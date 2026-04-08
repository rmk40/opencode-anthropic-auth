import { generatePKCE } from "@openauthjs/openauth/pkce";
import { CLIENT_ID } from "./config.mjs";
import { getHeaderProfile } from "./request-headers.mjs";

// ---------------------------------------------------------------------------
// OAuth helpers — shared between plugin (index.mjs) and CLI (cli.mjs)
// ---------------------------------------------------------------------------

/** User-Agent header matching Claude Code — required by Anthropic since 2026-03-17. */
const CC_USER_AGENT = getHeaderProfile()?.headers?.["user-agent"] ?? "claude-cli/2.1.96 (external, sdk-cli)";

// Anthropic migrated OAuth endpoints from console.anthropic.com to platform.claude.com.
// See ex-machina-co/opencode-anthropic-auth for the reference implementation.
const AUTHORIZE_URLS = {
  console: "https://platform.claude.com/oauth/authorize",
  max: "https://claude.ai/oauth/authorize",
};
const CODE_CALLBACK_URL = "https://platform.claude.com/oauth/code/callback";
const TOKEN_URL = "https://platform.claude.com/v1/oauth/token";
const REVOKE_URL = "https://platform.claude.com/v1/oauth/revoke";
const OAUTH_SCOPES = [
  "org:create_api_key",
  "user:profile",
  "user:inference",
  "user:sessions:claude_code",
  "user:mcp_servers",
  "user:file_upload",
].join(" ");

/**
 * Build an OAuth authorization URL with PKCE challenge.
 * @param {"max" | "console"} mode
 * @returns {Promise<{url: string, verifier: string}>}
 */
export async function authorize(mode) {
  const pkce = await generatePKCE();

  const url = new URL(AUTHORIZE_URLS[mode]);
  url.searchParams.set("code", "true");
  url.searchParams.set("client_id", CLIENT_ID);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", CODE_CALLBACK_URL);
  url.searchParams.set("scope", OAUTH_SCOPES);
  url.searchParams.set("code_challenge", pkce.challenge);
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("state", pkce.verifier);
  return {
    url: url.toString(),
    verifier: pkce.verifier,
  };
}

/**
 * Parse a user-provided callback input into a {code, state} pair.
 * Accepts: full URL, "code#state", or plain "code=X&state=Y".
 * @param {string} input
 * @returns {{code: string, state: string} | null}
 */
function parseCallbackInput(input) {
  const trimmed = input.trim();

  // Try as URL with query params
  try {
    const url = new URL(trimmed);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    if (code && state) {
      return { code, state };
    }
  } catch {
    // Not a URL, fall through
  }

  // Legacy "code#state" format
  const hashSplits = trimmed.split("#");
  if (hashSplits.length === 2 && hashSplits[0] && hashSplits[1]) {
    return { code: hashSplits[0], state: hashSplits[1] };
  }

  // Plain query string "code=X&state=Y"
  try {
    const params = new URLSearchParams(trimmed);
    const code = params.get("code");
    const state = params.get("state");
    if (code && state) {
      return { code, state };
    }
  } catch {
    // Ignore
  }

  return null;
}

/**
 * Exchange an authorization code for tokens.
 * Accepts a full URL, "code#state", or query string format.
 * @param {string} code - Authorization code or full callback input
 * @param {string} verifier - PKCE verifier returned from authorize()
 * @returns {Promise<{type: "success", refresh: string, access: string, expires: number, email?: string} | {type: "failed"}>}
 */
export async function exchange(code, verifier) {
  const callback = parseCallbackInput(code);
  if (!callback) {
    return { type: "failed" };
  }

  const result = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": CC_USER_AGENT,
    },
    body: JSON.stringify({
      code: callback.code,
      state: callback.state,
      grant_type: "authorization_code",
      client_id: CLIENT_ID,
      redirect_uri: CODE_CALLBACK_URL,
      code_verifier: verifier,
    }),
  });
  if (!result.ok)
    return {
      type: "failed",
    };
  const json = await result.json();
  return {
    type: "success",
    refresh: json.refresh_token,
    access: json.access_token,
    expires: Date.now() + json.expires_in * 1000,
    email: json.account?.email_address || undefined,
  };
}

/**
 * Attempt to revoke a refresh token server-side (best-effort, RFC 7009).
 *
 * Anthropic may or may not support this endpoint. The function returns
 * `true` on a 2xx response and `false` otherwise — callers should always
 * proceed with local cleanup regardless of the result.
 *
 * @param {string} refreshToken
 * @returns {Promise<boolean>}
 */
export async function revoke(refreshToken) {
  try {
    const resp = await fetch(REVOKE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "User-Agent": CC_USER_AGENT },
      body: JSON.stringify({
        token: refreshToken,
        token_type_hint: "refresh_token",
        client_id: CLIENT_ID,
      }),
      signal: AbortSignal.timeout(5000),
    });
    return resp.ok;
  } catch {
    return false;
  }
}

/**
 * Refresh an OAuth access token.
 * @param {string} refreshTokenValue - The refresh token to use
 * @param {{ signal?: AbortSignal }} [options]
 * @returns {Promise<{access_token: string, refresh_token: string, expires_in: number}>}
 * @throws {Error} On HTTP errors or network failures
 */
export async function refreshToken(refreshTokenValue, options = {}) {
  const resp = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": CC_USER_AGENT },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: CLIENT_ID,
      refresh_token: refreshTokenValue,
    }),
    ...(options.signal ? { signal: options.signal } : {}),
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    const error = new Error(`Token refresh failed (HTTP ${resp.status}): ${text}`);
    error.status = resp.status;
    try {
      const parsed = JSON.parse(text);
      if (parsed.error) error.code = parsed.error;
    } catch {
      // Body may not be valid JSON
    }
    throw error;
  }

  return resp.json();
}
