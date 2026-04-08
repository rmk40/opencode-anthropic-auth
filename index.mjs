import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { randomUUID } from "node:crypto";
import { AccountManager } from "./lib/accounts.mjs";
import { main as cliMain } from "./cli.mjs";
import { authorize, exchange, refreshToken } from "./lib/oauth.mjs";
import { loadConfig } from "./lib/config.mjs";
import { loadAccounts, saveAccounts, clearAccounts, createDefaultStats } from "./lib/storage.mjs";
import { applyOAuthCredentials, resetAccountTracking } from "./lib/account-state.mjs";
import { acquireRefreshLock, releaseRefreshLock } from "./lib/refresh-lock.mjs";
import { resolveSlashCommandName, isDestructiveCommand, isInteractiveOnlyCommand } from "./lib/commands.mjs";
import { isAccountSpecificError, parseRateLimitReason, parseRetryAfterHeader } from "./lib/backoff.mjs";
import { getHeaderProfile, getDefaultBetas, getBillingHeaderBlock } from "./lib/request-headers.mjs";
import { stripAnsi } from "./lib/util.mjs";

// Stable per-process session ID, matches Claude Code behavior (one UUID per CLI invocation).
// Sent as x-claude-code-session-id header on every API request.
const CLAUDE_CODE_SESSION_ID = randomUUID();

// ---------------------------------------------------------------------------
// Account management CLI prompts
// ---------------------------------------------------------------------------

/**
 * @param {import('./lib/accounts.mjs').AccountManager} accountManager
 * @returns {Promise<'add' | 'fresh' | 'manage' | 'cancel'>}
 */
async function promptAccountMenu(accountManager) {
  const accounts = accountManager.getAccountsSnapshot();
  const currentIndex = accountManager.getCurrentIndex();
  const rl = createInterface({ input: stdin, output: stdout });

  try {
    console.log(`\n${accounts.length} account(s) configured:`);
    for (const acc of accounts) {
      const name = acc.email || `Account ${acc.index + 1}`;
      const active = acc.index === currentIndex ? " (active)" : "";
      const disabled = !acc.enabled ? " [disabled]" : "";
      console.log(`  ${acc.index + 1}. ${name}${active}${disabled}`);
    }
    console.log("");

    while (true) {
      const answer = await rl.question("(a)dd new, (f)resh start, (m)anage, (c)ancel? [a/f/m/c]: ");
      const normalized = answer.trim().toLowerCase();
      if (normalized === "a" || normalized === "add") return "add";
      if (normalized === "f" || normalized === "fresh") return "fresh";
      if (normalized === "m" || normalized === "manage") return "manage";
      if (normalized === "c" || normalized === "cancel") return "cancel";
      console.log("Please enter 'a', 'f', 'm', or 'c'.");
    }
  } finally {
    rl.close();
  }
}

/**
 * @param {import('./lib/accounts.mjs').AccountManager} accountManager
 * @returns {Promise<void>}
 */
async function promptManageAccounts(accountManager) {
  const accounts = accountManager.getAccountsSnapshot();
  const rl = createInterface({ input: stdin, output: stdout });

  try {
    console.log("\nManage accounts:");
    for (const acc of accounts) {
      const name = acc.email || `Account ${acc.index + 1}`;
      const status = acc.enabled ? "enabled" : "disabled";
      console.log(`  ${acc.index + 1}. ${name} [${status}]`);
    }
    console.log("");

    while (true) {
      const answer = await rl.question("Enter account number to toggle, (d)N to delete (e.g. d1), or (b)ack: ");
      const normalized = answer.trim().toLowerCase();

      if (normalized === "b" || normalized === "back") return;

      // Delete: d1, d2, etc.
      const deleteMatch = normalized.match(/^d(\d+)$/);
      if (deleteMatch) {
        const idx = parseInt(deleteMatch[1], 10) - 1;
        if (idx >= 0 && idx < accounts.length) {
          accountManager.removeAccount(idx);
          console.log(`Removed account ${idx + 1}.`);
          return;
        }
        console.log("Invalid account number.");
        continue;
      }

      // Toggle: just the number
      const num = parseInt(normalized, 10);
      if (!isNaN(num) && num >= 1 && num <= accounts.length) {
        const newState = accountManager.toggleAccount(num - 1);
        console.log(`Account ${num} is now ${newState ? "enabled" : "disabled"}.`);
        continue;
      }

      console.log("Invalid input.");
    }
  } finally {
    rl.close();
  }
}

// ---------------------------------------------------------------------------
// Request building helpers (extracted from original fetch interceptor)
// ---------------------------------------------------------------------------

/**
 * Build request headers from input and init, applying OAuth requirements.
 * Preserves behaviors D1-D7.
 *
 * @param {any} input
 * @param {Record<string, any>} requestInit
 * @param {string} accessToken
 * @param {import('./lib/config.mjs').AnthropicAuthConfig['headers']} headerConfig
 * @param {string | undefined} modelName
 * @returns {Headers}
 */
function buildRequestHeaders(input, requestInit, accessToken, headerConfig, modelName) {
  const requestHeaders = new Headers();
  if (input instanceof Request) {
    input.headers.forEach((value, key) => {
      requestHeaders.set(key, value);
    });
  }
  if (requestInit.headers) {
    if (requestInit.headers instanceof Headers) {
      requestInit.headers.forEach((value, key) => {
        requestHeaders.set(key, value);
      });
    } else if (Array.isArray(requestInit.headers)) {
      for (const [key, value] of requestInit.headers) {
        if (typeof value !== "undefined") {
          requestHeaders.set(key, String(value));
        }
      }
    } else {
      for (const [key, value] of Object.entries(requestInit.headers)) {
        if (typeof value !== "undefined") {
          requestHeaders.set(key, String(value));
        }
      }
    }
  }

  // Preserve incoming beta values before profile defaults/overrides.
  const incomingBeta = requestHeaders.get("anthropic-beta") || "";
  const incomingBetasList = incomingBeta
    .split(",")
    .map((b) => b.trim())
    .filter(Boolean);

  const profile = getHeaderProfile(headerConfig.emulation_profile);
  const disabledHeaders = new Set(headerConfig.disable.map((name) => name.toLowerCase()));

  for (const [key, value] of Object.entries(profile.headers)) {
    if (!disabledHeaders.has(key.toLowerCase())) {
      requestHeaders.set(key, value);
    }
  }

  let anthropicBetaOverride = null;

  for (const [key, value] of Object.entries(headerConfig.overrides)) {
    if (key.toLowerCase() === "anthropic-beta") {
      anthropicBetaOverride = value;
      continue;
    }
    requestHeaders.set(key, value);
  }

  for (const name of disabledHeaders) {
    requestHeaders.delete(name);
  }

  const defaultBetas = getDefaultBetas(headerConfig.emulation_profile, modelName);
  const configuredBetas = anthropicBetaOverride
    ? anthropicBetaOverride
        .split(",")
        .map((b) => b.trim())
        .filter(Boolean)
    : defaultBetas;
  const mergedBetas = [...new Set([...configuredBetas, ...incomingBetasList])].join(",");

  requestHeaders.set("authorization", `Bearer ${accessToken}`);
  if (!disabledHeaders.has("anthropic-beta")) {
    requestHeaders.set("anthropic-beta", mergedBetas);
  }
  // x-claude-code-session-id is a per-process UUID — matches Claude Code 2.1.96+ behavior.
  if (!disabledHeaders.has("x-claude-code-session-id") && !requestHeaders.has("x-claude-code-session-id")) {
    requestHeaders.set("x-claude-code-session-id", CLAUDE_CODE_SESSION_ID);
  }
  requestHeaders.delete("x-api-key");

  return requestHeaders;
}

/**
 * Read request model from transformed JSON body.
 * @param {string | undefined} body
 * @returns {string | undefined}
 */
function extractModelName(body) {
  if (!body || typeof body !== "string") return undefined;
  try {
    const parsed = JSON.parse(body);
    if (parsed && typeof parsed === "object" && typeof parsed.model === "string" && parsed.model) {
      return parsed.model;
    }
  } catch {
    // ignore parse errors
  }
  return undefined;
}

/**
 * Transform the request body: system prompt sanitization and tool prefixing.
 * Preserves behaviors E1-E7.
 *
 * @param {string | undefined} body
 * @returns {string | undefined}
 */
function transformRequestBody(body) {
  if (!body || typeof body !== "string") return body;

  const TOOL_PREFIX = "mcp_";

  try {
    const parsed = JSON.parse(body);

    // Sanitize system prompt - server blocks "OpenCode" string
    // Note: (?<!\/) preserves paths like /path/to/opencode-foo
    if (parsed.system && Array.isArray(parsed.system)) {
      parsed.system = parsed.system.map((item) => {
        if (item.type === "text" && item.text) {
          return {
            ...item,
            // Strip the OpenCode identity line — the transform hook provides the correct Claude Code identity
            text: item.text
              .replace(/^You are OpenCode, the best coding agent on the planet\.\n*/m, "")
              .replace(/OpenCode/g, "Claude Code")
              .replace(/(?<!\/)opencode/gi, "Claude"),
          };
        }
        return item;
      });
    }

    // Add prefix to tools definitions
    if (parsed.tools && Array.isArray(parsed.tools)) {
      parsed.tools = parsed.tools.map((tool) => ({
        ...tool,
        name: tool.name ? `${TOOL_PREFIX}${tool.name}` : tool.name,
      }));
    }
    // Add prefix to tool_use blocks in messages
    if (parsed.messages && Array.isArray(parsed.messages)) {
      parsed.messages = parsed.messages.map((msg) => {
        if (msg.content && Array.isArray(msg.content)) {
          msg.content = msg.content.map((block) => {
            if (block.type === "tool_use" && block.name) {
              return {
                ...block,
                name: `${TOOL_PREFIX}${block.name}`,
              };
            }
            return block;
          });
        }
        return msg;
      });
    }
    return JSON.stringify(parsed);
  } catch {
    // ignore parse errors
    return body;
  }
}

/**
 * Transform the request URL: add ?beta=true to /v1/messages.
 * Preserves behaviors F1-F3.
 *
 * @param {any} input
 * @returns {{requestInput: any, requestUrl: URL | null}}
 */
function transformRequestUrl(input) {
  let requestInput = input;
  let requestUrl = null;
  try {
    if (typeof input === "string" || input instanceof URL) {
      requestUrl = new URL(input.toString());
    } else if (input instanceof Request) {
      requestUrl = new URL(input.url);
    }
  } catch {
    requestUrl = null;
  }

  if (requestUrl && requestUrl.pathname === "/v1/messages" && !requestUrl.searchParams.has("beta")) {
    requestUrl.searchParams.set("beta", "true");
    requestInput = input instanceof Request ? new Request(requestUrl.toString(), input) : requestUrl;
  }

  return { requestInput, requestUrl };
}

/**
 * @typedef {object} UsageStats
 * @property {number} inputTokens
 * @property {number} outputTokens
 * @property {number} cacheReadTokens
 * @property {number} cacheWriteTokens
 */

/**
 * Update running usage stats from a parsed SSE event.
 * @param {any} parsed
 * @param {UsageStats} stats
 */
function extractUsageFromSSEEvent(parsed, stats) {
  // message_delta: cumulative usage (preferred, overwrites)
  if (parsed?.type === "message_delta" && parsed.usage) {
    const u = parsed.usage;
    if (typeof u.input_tokens === "number") stats.inputTokens = u.input_tokens;
    if (typeof u.output_tokens === "number") stats.outputTokens = u.output_tokens;
    if (typeof u.cache_read_input_tokens === "number") stats.cacheReadTokens = u.cache_read_input_tokens;
    if (typeof u.cache_creation_input_tokens === "number") stats.cacheWriteTokens = u.cache_creation_input_tokens;
    return;
  }

  // message_start: initial usage (only set if we haven't seen message_delta yet)
  if (parsed?.type === "message_start" && parsed.message?.usage) {
    const u = parsed.message.usage;
    if (stats.inputTokens === 0 && typeof u.input_tokens === "number") {
      stats.inputTokens = u.input_tokens;
    }
    if (stats.cacheReadTokens === 0 && typeof u.cache_read_input_tokens === "number") {
      stats.cacheReadTokens = u.cache_read_input_tokens;
    }
    if (stats.cacheWriteTokens === 0 && typeof u.cache_creation_input_tokens === "number") {
      stats.cacheWriteTokens = u.cache_creation_input_tokens;
    }
  }
}

/**
 * Extract the combined SSE data payload from one event block.
 * @param {string} eventBlock
 * @returns {string | null}
 */
function getSSEDataPayload(eventBlock) {
  if (!eventBlock) return null;

  const dataLines = [];
  for (const line of eventBlock.split("\n")) {
    if (!line.startsWith("data:")) continue;
    dataLines.push(line.slice(5).trimStart());
  }

  if (dataLines.length === 0) return null;
  const payload = dataLines.join("\n");
  if (!payload || payload === "[DONE]") return null;
  return payload;
}

/**
 * Parse one SSE event payload and return account-error details if present.
 * @param {any} parsed
 * @returns {{reason: import('./lib/backoff.mjs').RateLimitReason, invalidateToken: boolean} | null}
 */
function getMidStreamAccountError(parsed) {
  if (!parsed || parsed.type !== "error" || !parsed.error) {
    return null;
  }

  const errorBody = {
    error: {
      type: String(parsed.error.type || ""),
      message: String(parsed.error.message || ""),
    },
  };

  // Mid-stream errors do not include a reliable HTTP status. Use 400-style
  // body parsing to identify account-specific errors.
  if (!isAccountSpecificError(400, errorBody)) {
    return null;
  }

  const reason = parseRateLimitReason(400, errorBody);

  return {
    reason,
    invalidateToken: reason === "AUTH_FAILED",
  };
}

/**
 * Strip `mcp_` prefix from tool_use `name` fields in SSE data lines.
 * Only modifies `name` values inside content blocks with `"type": "tool_use"`.
 * Non-JSON lines and text blocks are left untouched.
 *
 * @param {string} text - Raw SSE chunk text (may contain multiple lines)
 * @returns {string}
 */
function stripMcpPrefixFromSSE(text) {
  return text.replace(/^data:\s*(.+)$/gm, (_match, jsonStr) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (stripMcpPrefixFromParsedEvent(parsed)) {
        return `data: ${JSON.stringify(parsed)}`;
      }
    } catch {
      // Not valid JSON — pass through unchanged.
    }
    return _match;
  });
}

/**
 * Mutate a parsed SSE event object, removing `mcp_` prefix from tool_use
 * name fields. Returns true if any modification was made.
 *
 * @param {any} parsed
 * @returns {boolean}
 */
function stripMcpPrefixFromParsedEvent(parsed) {
  if (!parsed || typeof parsed !== "object") return false;

  let modified = false;

  // content_block_start: { content_block: { type: "tool_use", name: "mcp_..." } }
  if (
    parsed.content_block &&
    parsed.content_block.type === "tool_use" &&
    typeof parsed.content_block.name === "string" &&
    parsed.content_block.name.startsWith("mcp_")
  ) {
    parsed.content_block.name = parsed.content_block.name.slice(4);
    modified = true;
  }

  // message_start: { message: { content: [{ type: "tool_use", name: "mcp_..." }] } }
  if (parsed.message && Array.isArray(parsed.message.content)) {
    for (const block of parsed.message.content) {
      if (block.type === "tool_use" && typeof block.name === "string" && block.name.startsWith("mcp_")) {
        block.name = block.name.slice(4);
        modified = true;
      }
    }
  }

  // Top-level content array (non-streaming responses forwarded through SSE)
  if (Array.isArray(parsed.content)) {
    for (const block of parsed.content) {
      if (block.type === "tool_use" && typeof block.name === "string" && block.name.startsWith("mcp_")) {
        block.name = block.name.slice(4);
        modified = true;
      }
    }
  }

  return modified;
}

/**
 * Wrap a response body stream to strip mcp_ prefix from tool names,
 * extract token usage stats from SSE events, and detect mid-stream
 * account-specific errors (so the account can be marked for the NEXT request).
 * Preserves behaviors G1-G5.
 *
 * @param {Response} response
 * @param {((stats: UsageStats) => void) | null} [onUsage] - Called when stream ends with final usage
 * @param {((details: {reason: import('./lib/backoff.mjs').RateLimitReason, invalidateToken: boolean}) => void) | null} [onAccountError]
 *   Called if a mid-stream error looks account-specific
 * @returns {Response}
 */
function transformResponse(response, onUsage, onAccountError) {
  if (!response.body) return response;

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  const EMPTY_CHUNK = new Uint8Array();

  /** @type {UsageStats} */
  const stats = { inputTokens: 0, outputTokens: 0, cacheReadTokens: 0, cacheWriteTokens: 0 };
  let sseBuffer = "";
  let sseRewriteBuffer = "";
  let accountErrorHandled = false;

  /**
   * Process buffered SSE event blocks.
   * @param {boolean} flush
   */
  function processSSEBuffer(flush = false) {
    while (true) {
      const boundary = sseBuffer.indexOf("\n\n");

      if (boundary === -1) {
        if (!flush) return;
        if (!sseBuffer.trim()) {
          sseBuffer = "";
          return;
        }
      }

      const eventBlock = boundary === -1 ? sseBuffer : sseBuffer.slice(0, boundary);
      sseBuffer = boundary === -1 ? "" : sseBuffer.slice(boundary + 2);

      const payload = getSSEDataPayload(eventBlock);
      if (!payload) {
        if (boundary === -1) return;
        continue;
      }

      try {
        const parsed = JSON.parse(payload);

        if (onUsage) {
          extractUsageFromSSEEvent(parsed, stats);
        }

        if (onAccountError && !accountErrorHandled) {
          const details = getMidStreamAccountError(parsed);
          if (details) {
            accountErrorHandled = true;
            onAccountError(details);
          }
        }
      } catch {
        // Ignore malformed event payloads.
      }

      if (boundary === -1) return;
    }
  }

  /**
   * Rewrite complete SSE lines while preserving chunk boundaries for streaming.
   * Buffers trailing partial lines to avoid parsing split JSON payloads.
   * @param {string} chunk
   * @param {boolean} [flush]
   * @returns {string}
   */
  function rewriteSSEChunk(chunk, flush = false) {
    sseRewriteBuffer += chunk;

    if (!flush) {
      const boundary = sseRewriteBuffer.lastIndexOf("\n");
      if (boundary === -1) return "";
      const complete = sseRewriteBuffer.slice(0, boundary + 1);
      sseRewriteBuffer = sseRewriteBuffer.slice(boundary + 1);
      return stripMcpPrefixFromSSE(complete);
    }

    if (!sseRewriteBuffer) return "";
    const finalText = stripMcpPrefixFromSSE(sseRewriteBuffer);
    sseRewriteBuffer = "";
    return finalText;
  }

  const stream = new ReadableStream({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) {
        processSSEBuffer(true);

        const rewrittenTail = rewriteSSEChunk("", true);
        if (rewrittenTail) {
          controller.enqueue(encoder.encode(rewrittenTail));
        }

        if (
          onUsage &&
          (stats.inputTokens > 0 || stats.outputTokens > 0 || stats.cacheReadTokens > 0 || stats.cacheWriteTokens > 0)
        ) {
          onUsage(stats);
        }
        controller.close();
        return;
      }

      const text = decoder.decode(value, { stream: true });

      if (onUsage || onAccountError) {
        // Normalize CRLF for parser only; preserve original bytes for passthrough.
        sseBuffer += text.replace(/\r\n/g, "\n");
        processSSEBuffer(false);
      }

      const rewrittenText = rewriteSSEChunk(text, false);
      if (rewrittenText) {
        controller.enqueue(encoder.encode(rewrittenText));
      } else {
        // Keep the pull/read loop progressing when this chunk only extends a
        // partial line buffered for later rewrite.
        controller.enqueue(EMPTY_CHUNK);
      }
    },
  });

  return new Response(stream, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
}

/**
 * Check whether a response is an SSE event stream.
 * @param {Response} response
 * @returns {boolean}
 */
function isEventStreamResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  return contentType.toLowerCase().includes("text/event-stream");
}

/**
 * Build user-facing switch reason text for account-specific errors.
 * @param {number} status
 * @param {import('./lib/backoff.mjs').RateLimitReason} reason
 * @returns {string}
 */
function formatSwitchReason(status, reason) {
  if (reason === "AUTH_FAILED") return "auth failed";
  if (status === 403 && reason === "QUOTA_EXHAUSTED") return "permission denied";
  if (reason === "QUOTA_EXHAUSTED") return "quota exhausted";
  return "rate-limited";
}

/**
 * Format a duration into a compact human-readable string.
 * @param {number} ms
 * @returns {string}
 */
function formatDurationShort(ms) {
  const seconds = Math.max(1, Math.ceil(ms / 1000));
  if (seconds < 60) return `${seconds}s`;

  const minutes = Math.ceil(seconds / 60);
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.ceil(minutes / 60);
  if (hours < 24) return `${hours}h`;

  const days = Math.ceil(hours / 24);
  return `${days}d`;
}

/**
 * Build a diagnostic reason when no account can be selected.
 * @param {import('./lib/accounts.mjs').AccountManager} accountManager
 * @param {Set<number>} transientRefreshSkips
 * @param {unknown} lastError
 * @returns {string}
 */
function buildNoAvailableAccountReason(accountManager, transientRefreshSkips, lastError) {
  const now = Date.now();
  const accounts = accountManager.getAccountsSnapshot();
  const enabled = accounts.filter((acc) => acc.enabled);

  if (enabled.length === 0) {
    return "no enabled accounts";
  }

  const transientFailures = enabled.filter((acc) => transientRefreshSkips.has(acc.index));
  const rateLimited = enabled
    .map((acc) => ({ acc, resetAt: acc.rateLimitResetTimes?.anthropic }))
    .filter(
      ({ acc, resetAt }) => !transientRefreshSkips.has(acc.index) && typeof resetAt === "number" && resetAt > now,
    );

  const parts = [];

  if (rateLimited.length > 0) {
    const nextResetMs = Math.min(...rateLimited.map(({ resetAt }) => resetAt - now));
    parts.push(`${rateLimited.length} rate-limited (next retry in ${formatDurationShort(nextResetMs)})`);
  }

  if (transientFailures.length > 0) {
    parts.push(`${transientFailures.length} temporarily unavailable (request failures)`);
  }

  const unclassifiedCount = enabled.length - rateLimited.length - transientFailures.length;
  if (unclassifiedCount > 0) {
    parts.push(`${unclassifiedCount} unavailable (unknown reason)`);
  }

  if (lastError instanceof Error && lastError.message) {
    const compact = lastError.message.replace(/\s+/g, " ").trim();
    if (compact) {
      const snippet = compact.length > 140 ? `${compact.slice(0, 137)}...` : compact;
      parts.push(`last error: ${snippet}`);
    }
  }

  return parts.join("; ") || "all enabled accounts unavailable";
}

// ---------------------------------------------------------------------------
// Token refresh (per-account)
// ---------------------------------------------------------------------------

/**
 * Read the latest auth fields for an account from disk.
 * Another instance may have rotated tokens since we loaded into memory.
 * @param {string} accountId
 * @returns {Promise<{refreshToken: string, access?: string, expires?: number, tokenUpdatedAt: number} | null>}
 */
async function readDiskAccountAuth(accountId) {
  try {
    const diskData = await loadAccounts();
    if (!diskData) return null;
    const diskAccount = diskData.accounts.find((a) => a.id === accountId);
    if (!diskAccount) return null;
    return {
      refreshToken: diskAccount.refreshToken,
      access: diskAccount.access,
      expires: diskAccount.expires,
      tokenUpdatedAt: diskAccount.token_updated_at,
    };
  } catch {
    return null;
  }
}

/**
 * @param {import('./lib/accounts.mjs').ManagedAccount} account
 * @param {number} [now]
 */
function markTokenStateUpdated(account, now = Date.now()) {
  account.tokenUpdatedAt = now;
}

/**
 * Adopt disk auth fields only when disk has fresher token state.
 * @param {import('./lib/accounts.mjs').ManagedAccount} account
 * @param {{refreshToken: string, access?: string, expires?: number, tokenUpdatedAt: number} | null} diskAuth
 * @param {{ allowExpiredFallback?: boolean }} [options]
 * @returns {boolean}
 */
function applyDiskAuthIfFresher(account, diskAuth, options = {}) {
  if (!diskAuth) return false;
  const diskTokenUpdatedAt = diskAuth.tokenUpdatedAt || 0;
  const memTokenUpdatedAt = account.tokenUpdatedAt || 0;
  const diskHasDifferentAuth = diskAuth.refreshToken !== account.refreshToken || diskAuth.access !== account.access;
  const memAuthExpired = !account.expires || account.expires <= Date.now();
  const allowExpiredFallback = options.allowExpiredFallback === true;
  if (diskTokenUpdatedAt <= memTokenUpdatedAt && !(allowExpiredFallback && diskHasDifferentAuth && memAuthExpired)) {
    return false;
  }
  account.refreshToken = diskAuth.refreshToken;
  account.access = diskAuth.access;
  account.expires = diskAuth.expires;
  account.tokenUpdatedAt = Math.max(memTokenUpdatedAt, diskTokenUpdatedAt);
  return true;
}

/**
 * Refresh an account's access token.
 *
 * @param {import('./lib/accounts.mjs').ManagedAccount} account
 * @param {ReturnType<typeof import('@opencode-ai/plugin').createOpencodeClient>} client
 * @param {"foreground" | "idle"} [source]
 * @param {{ onTokensUpdated?: () => Promise<void> }} [options] - If provided,
 *   called under the cross-process lock after token update to persist rotated
 *   tokens before the lock is released.  Omitting means tokens won't be saved
 *   to disk until the caller arranges it (risking the rotation race).
 * @returns {Promise<string>} The new access token
 * @throws {Error} If refresh fails
 */
async function refreshAccountToken(account, client, source = "foreground", { onTokensUpdated } = {}) {
  const lockResult = await acquireRefreshLock(account.id, {
    timeoutMs: 2_000,
    backoffMs: 60,
    staleMs: 20_000,
  });
  const lock =
    lockResult && typeof lockResult === "object"
      ? lockResult
      : {
          acquired: true,
          lockPath: null,
          owner: null,
          lockInode: null,
        };

  if (!lock.acquired) {
    const diskAuth = await readDiskAccountAuth(account.id);
    const adopted = applyDiskAuthIfFresher(account, diskAuth, { allowExpiredFallback: true });
    if (adopted && account.access && account.expires && account.expires > Date.now()) {
      return account.access;
    }
    throw new Error("Refresh lock busy");
  }

  try {
    const diskAuthBeforeRefresh = await readDiskAccountAuth(account.id);
    const adopted = applyDiskAuthIfFresher(account, diskAuthBeforeRefresh);
    if (source === "foreground" && adopted && account.access && account.expires && account.expires > Date.now()) {
      return account.access;
    }

    const json = await refreshToken(account.refreshToken, { signal: AbortSignal.timeout(10_000) });

    account.access = json.access_token;
    account.expires = Date.now() + json.expires_in * 1000;
    if (json.refresh_token) {
      account.refreshToken = json.refresh_token;
    }
    markTokenStateUpdated(account);

    // Persist new tokens to disk BEFORE releasing the cross-process lock.
    // This is critical: if we release the lock first, another process can
    // acquire it and read the old (now-rotated) refresh token from disk,
    // leading to an invalid_grant failure.  The debounced requestSaveToDisk()
    // that callers used previously left a ~1 s window where this race could
    // (and did) happen.
    if (onTokensUpdated) {
      try {
        await onTokensUpdated();
      } catch {
        // Best-effort: in-memory tokens remain valid for this process.
        // The callback is responsible for scheduling its own fallback
        // (e.g. a debounced retry) if the synchronous save fails.
      }
    }

    // Also persist to OpenCode's auth.json for compatibility.
    // This should be best-effort: a persistence hiccup should not invalidate an
    // otherwise successful refresh token exchange.
    try {
      await client.auth.set({
        path: { id: "anthropic" },
        body: {
          type: "oauth",
          refresh: account.refreshToken,
          access: account.access,
          expires: account.expires,
        },
      });
    } catch {
      // Ignore persistence errors; in-memory tokens remain valid for this request.
    }

    return json.access_token;
  } finally {
    await releaseRefreshLock(lock);
  }
}

// ---------------------------------------------------------------------------
// Plugin entry point
// ---------------------------------------------------------------------------

const ANTHROPIC_COMMAND_HANDLED = "__ANTHROPIC_COMMAND_HANDLED__";
const PENDING_OAUTH_TTL_MS = 10 * 60 * 1000;

/**
 * Parse command arguments with minimal quote support.
 *
 * Examples:
 *   a b "c d"  -> ["a", "b", "c d"]
 *   a 'c d'     -> ["a", "c d"]
 *
 * @param {string} raw
 * @returns {string[]}
 */
function parseCommandArgs(raw) {
  if (!raw || !raw.trim()) return [];
  const parts = [];
  const re = /"([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)'|(\S+)/g;
  let match;
  while ((match = re.exec(raw)) !== null) {
    const token = match[1] ?? match[2] ?? match[3] ?? "";
    parts.push(token.replace(/\\(["'\\])/g, "$1"));
  }
  return parts;
}

/**
 * @type {import('@opencode-ai/plugin').Plugin}
 */
export async function AnthropicAuthPlugin({ client }) {
  const config = loadConfig();

  /** @type {AccountManager | null} */
  let accountManager = null;

  /** Track account usage toasts; show once per account change (including first use). */
  let lastToastedIndex = -1;
  /** @type {Map<string, number>} */
  const debouncedToastTimestamps = new Map();

  /** @type {Map<string, { promise: Promise<string>, source: "foreground" | "idle" }>} */
  const refreshInFlight = new Map();

  /** @type {Map<string, number>} */
  const idleRefreshLastAttempt = new Map();
  /** @type {Set<string>} */
  const idleRefreshInFlight = new Set();

  const IDLE_REFRESH_ENABLED = config.idle_refresh.enabled;
  const IDLE_REFRESH_WINDOW_MS = config.idle_refresh.window_minutes * 60 * 1000;
  const IDLE_REFRESH_MIN_INTERVAL_MS = config.idle_refresh.min_interval_minutes * 60 * 1000;

  /**
   * Pending slash-command OAuth flows keyed by session ID.
   * @type {Map<string, { mode: "login" | "reauth", verifier: string, targetIndex?: number, createdAt: number }>}
   */
  const pendingSlashOAuth = new Map();

  /**
   * Send an informational message into the current session.
   * @param {string} sessionID
   * @param {string} text
   */
  async function sendCommandMessage(sessionID, text) {
    await client.session?.prompt({
      path: { id: sessionID },
      body: {
        noReply: true,
        parts: [{ type: "text", text, ignored: true }],
      },
    });
  }

  /**
   * Keep in-memory AccountManager in sync with disk mutations made via slash commands.
   */
  async function reloadAccountManagerFromDisk() {
    if (!accountManager) return;
    accountManager = await AccountManager.load(config, null);
  }

  /**
   * Persist OAuth credentials into OpenCode auth storage for immediate compatibility.
   * @param {string} refresh
   * @param {string} access
   * @param {number} expires
   */
  async function persistOpenCodeAuth(refresh, access, expires) {
    await client.auth.set({
      path: { id: "anthropic" },
      body: { type: "oauth", refresh, access, expires },
    });
  }

  /**
   * Remove expired pending OAuth flows.
   */
  function pruneExpiredPendingOAuth() {
    const now = Date.now();
    for (const [sessionID, pending] of pendingSlashOAuth.entries()) {
      if (now - pending.createdAt > PENDING_OAUTH_TTL_MS) {
        pendingSlashOAuth.delete(sessionID);
      }
    }
  }

  /**
   * Execute CLI main(argv) in-process and capture console output.
   * @param {string[]} argv
   * @returns {Promise<{ code: number, stdout: string, stderr: string }>}
   */
  async function runCliCommand(argv) {
    const logs = [];
    const errors = [];

    /** @type {number} */
    let code = 1;
    try {
      code = await cliMain(argv, {
        io: {
          log: (...args) => logs.push(args.join(" ")),
          error: (...args) => errors.push(args.join(" ")),
        },
      });
    } catch (err) {
      errors.push(err instanceof Error ? err.message : String(err));
    }

    return {
      code,
      stdout: stripAnsi(logs.join("\n")).trim(),
      stderr: stripAnsi(errors.join("\n")).trim(),
    };
  }

  /**
   * Start a slash-command OAuth flow and store verifier in-memory.
   * @param {string} sessionID
   * @param {"login" | "reauth"} mode
   * @param {number} [targetIndex]
   */
  async function startSlashOAuth(sessionID, mode, targetIndex) {
    pruneExpiredPendingOAuth();
    const { url, verifier } = await authorize("max");
    pendingSlashOAuth.set(sessionID, {
      mode,
      verifier,
      targetIndex,
      createdAt: Date.now(),
    });

    const action = mode === "login" ? "login" : `reauth ${(targetIndex ?? 0) + 1}`;
    const followup =
      mode === "login" ? "/anthropic login complete <code#state>" : "/anthropic reauth complete <code#state>";

    await sendCommandMessage(
      sessionID,
      [
        "▣ Anthropic OAuth",
        "",
        `Started ${action} flow.`,
        "Open this URL in your browser:",
        url,
        "",
        `Then run: ${followup}`,
        "(Paste the full authorization code, including #state)",
      ].join("\n"),
    );
  }

  /**
   * Complete a pending slash-command OAuth flow.
   * @param {string} sessionID
   * @param {string} code
   * @param {"login" | "reauth"} expectedMode
   * @returns {Promise<{ ok: boolean, message: string }>}
   */
  async function completeSlashOAuth(sessionID, code, expectedMode) {
    const pending = pendingSlashOAuth.get(sessionID);
    if (!pending) {
      pruneExpiredPendingOAuth();
      return {
        ok: false,
        message: "No pending OAuth flow. Start with /anthropic login or /anthropic reauth <N>.",
      };
    }

    if (Date.now() - pending.createdAt > PENDING_OAUTH_TTL_MS) {
      pendingSlashOAuth.delete(sessionID);
      return {
        ok: false,
        message: "Pending OAuth flow expired. Start again with /anthropic login or /anthropic reauth <N>.",
      };
    }

    if (pending.mode !== expectedMode) {
      return {
        ok: false,
        message: `Pending ${pending.mode} OAuth flow found. Complete with /anthropic ${pending.mode} complete <code#state> or restart.`,
      };
    }

    const credentials = await exchange(code, pending.verifier);
    if (credentials.type === "failed") {
      return { ok: false, message: "Token exchange failed. The code may be invalid or expired." };
    }

    const stored = (await loadAccounts()) || { version: 1, accounts: [], activeIndex: 0 };

    if (pending.mode === "login") {
      const existingIdx = stored.accounts.findIndex((acc) => acc.refreshToken === credentials.refresh);
      if (existingIdx >= 0) {
        const acc = stored.accounts[existingIdx];
        applyOAuthCredentials(acc, credentials);
        acc.enabled = true;
        resetAccountTracking(acc);
        await saveAccounts(stored);
        await persistOpenCodeAuth(acc.refreshToken, acc.access, acc.expires);
        await reloadAccountManagerFromDisk();
        pendingSlashOAuth.delete(sessionID);
        const name = acc.email || `Account ${existingIdx + 1}`;
        return { ok: true, message: `Updated existing account #${existingIdx + 1} (${name}).` };
      }

      if (stored.accounts.length >= 10) {
        return { ok: false, message: "Maximum of 10 accounts reached. Remove one first." };
      }

      const now = Date.now();
      stored.accounts.push({
        id: `${now}:${credentials.refresh.slice(0, 12)}`,
        email: credentials.email,
        refreshToken: credentials.refresh,
        access: credentials.access,
        expires: credentials.expires,
        token_updated_at: now,
        addedAt: now,
        lastUsed: 0,
        enabled: true,
        rateLimitResetTimes: {},
        consecutiveFailures: 0,
        lastFailureTime: null,
        stats: createDefaultStats(now),
      });
      await saveAccounts(stored);
      const newAccount = stored.accounts[stored.accounts.length - 1];
      await persistOpenCodeAuth(newAccount.refreshToken, newAccount.access, newAccount.expires);
      await reloadAccountManagerFromDisk();
      pendingSlashOAuth.delete(sessionID);
      const label = credentials.email || `Account ${stored.accounts.length}`;
      return { ok: true, message: `Added account #${stored.accounts.length} (${label}).` };
    }

    // reauth flow
    const idx = pending.targetIndex ?? -1;
    if (idx < 0 || idx >= stored.accounts.length) {
      pendingSlashOAuth.delete(sessionID);
      return { ok: false, message: "Target account no longer exists. Start reauth again." };
    }

    const existing = stored.accounts[idx];
    applyOAuthCredentials(existing, credentials);
    existing.enabled = true;
    resetAccountTracking(existing);

    await saveAccounts(stored);
    await persistOpenCodeAuth(existing.refreshToken, existing.access, existing.expires);
    await reloadAccountManagerFromDisk();
    pendingSlashOAuth.delete(sessionID);
    const name = existing.email || `Account ${idx + 1}`;
    return { ok: true, message: `Re-authenticated account #${idx + 1} (${name}).` };
  }

  /**
   * Handle /anthropic slash commands.
   *
   * Supported examples:
   *   /anthropic
   *   /anthropic usage
   *   /anthropic switch 2
   *   /anthropic login
   *   /anthropic login complete <code#state>
   *   /anthropic reauth 1
   *   /anthropic reauth complete <code#state>
   *
   * @param {{ command: string, arguments?: string, sessionID: string }} input
   */
  async function handleAnthropicSlashCommand(input) {
    const args = parseCommandArgs(input.arguments || "");
    const primaryToken = (args[0] || "list").toLowerCase();
    const resolvedPrimary = resolveSlashCommandName(primaryToken);
    const primary = resolvedPrimary || primaryToken;

    // Two-step login flow for slash commands
    if (primary === "login") {
      if ((args[1] || "").toLowerCase() === "complete") {
        const code = args.slice(2).join(" ").trim();
        if (!code) {
          await sendCommandMessage(
            input.sessionID,
            "▣ Anthropic OAuth\n\nMissing code. Use: /anthropic login complete <code#state>",
          );
          return;
        }
        const result = await completeSlashOAuth(input.sessionID, code, "login");
        const heading = result.ok ? "▣ Anthropic OAuth" : "▣ Anthropic OAuth (error)";
        await sendCommandMessage(input.sessionID, `${heading}\n\n${result.message}`);
        return;
      }

      await startSlashOAuth(input.sessionID, "login");
      return;
    }

    // Two-step reauth flow for slash commands
    if (primary === "reauth") {
      if ((args[1] || "").toLowerCase() === "complete") {
        const code = args.slice(2).join(" ").trim();
        if (!code) {
          await sendCommandMessage(
            input.sessionID,
            "▣ Anthropic OAuth\n\nMissing code. Use: /anthropic reauth complete <code#state>",
          );
          return;
        }
        const result = await completeSlashOAuth(input.sessionID, code, "reauth");
        const heading = result.ok ? "▣ Anthropic OAuth" : "▣ Anthropic OAuth (error)";
        await sendCommandMessage(input.sessionID, `${heading}\n\n${result.message}`);
        return;
      }

      const n = parseInt(args[1], 10);
      if (Number.isNaN(n) || n < 1) {
        await sendCommandMessage(
          input.sessionID,
          "▣ Anthropic OAuth\n\nProvide an account number. Example: /anthropic reauth 1",
        );
        return;
      }
      const stored = await loadAccounts();
      if (!stored || stored.accounts.length === 0) {
        await sendCommandMessage(input.sessionID, "▣ Anthropic OAuth (error)\n\nNo accounts configured.");
        return;
      }
      const idx = n - 1;
      if (idx >= stored.accounts.length) {
        await sendCommandMessage(
          input.sessionID,
          `▣ Anthropic OAuth (error)\n\nAccount ${n} does not exist. You have ${stored.accounts.length} account(s).`,
        );
        return;
      }

      await startSlashOAuth(input.sessionID, "reauth", idx);
      return;
    }

    // Interactive CLI command is not compatible with slash flow.
    if (isInteractiveOnlyCommand(primary)) {
      await sendCommandMessage(
        input.sessionID,
        "▣ Anthropic\n\n`manage` is interactive-only. Use granular slash commands (switch/enable/disable/remove/reset) or run `opencode-anthropic-auth manage` in a terminal.",
      );
      return;
    }

    // Route remaining commands through the CLI command surface.
    const cliArgs = [...args];
    if (cliArgs.length === 0) cliArgs.push("list");
    if (resolvedPrimary) {
      cliArgs[0] = primary;
    }

    // Avoid readline prompts in slash mode.
    if (isDestructiveCommand(primary) && !cliArgs.includes("--force")) {
      cliArgs.push("--force");
    }

    const result = await runCliCommand(cliArgs);
    const heading = result.code === 0 ? "▣ Anthropic" : "▣ Anthropic (error)";
    const body = result.stdout || result.stderr || "No output.";
    await sendCommandMessage(input.sessionID, [heading, "", body].join("\n"));
    await reloadAccountManagerFromDisk();
  }

  /**
   * Show a toast in the TUI. Silently fails if TUI is not running.
   * @param {string} message
   * @param {"info" | "success" | "warning" | "error"} variant
   * @param {{debounceKey?: string}} [options]
   */
  async function toast(message, variant = "info", options = {}) {
    // Quiet mode suppresses non-error toasts
    if (config.toasts.quiet && variant !== "error") return;

    // Debounce configured toast categories to reduce chatter.
    if (variant !== "error" && options.debounceKey) {
      const minGapMs = Math.max(0, config.toasts.debounce_seconds) * 1000;
      if (minGapMs > 0) {
        const now = Date.now();
        const lastAt = debouncedToastTimestamps.get(options.debounceKey) ?? 0;
        if (now - lastAt < minGapMs) {
          return;
        }
        debouncedToastTimestamps.set(options.debounceKey, now);
      }
    }

    try {
      await client.tui?.showToast({ body: { message, variant } });
    } catch {
      // TUI may not be available
    }
  }

  /**
   * Emit debug logs when config.debug is enabled.
   * @param {...unknown} args
   */
  function debugLog(...args) {
    if (!config.debug) return;
    console.error("[opencode-anthropic-auth]", ...args);
  }

  /**
   * Parse refresh error details for retry/disable decisions.
   * @param {unknown} refreshError
   * @returns {{message: string, status: number, errorCode: string, isInvalidGrant: boolean, isTerminalStatus: boolean}}
   */
  function parseRefreshFailure(refreshError) {
    const message = refreshError instanceof Error ? refreshError.message : String(refreshError);
    const status =
      typeof refreshError === "object" && refreshError && "status" in refreshError ? Number(refreshError.status) : NaN;
    const errorCode =
      typeof refreshError === "object" && refreshError && ("errorCode" in refreshError || "code" in refreshError)
        ? String(refreshError.errorCode || refreshError.code || "")
        : "";
    const msgLower = message.toLowerCase();
    const isInvalidGrant =
      errorCode === "invalid_grant" || errorCode === "invalid_request" || msgLower.includes("invalid_grant");
    const isTerminalStatus = status === 400 || status === 401 || status === 403;
    return { message, status, errorCode, isInvalidGrant, isTerminalStatus };
  }

  /**
   * Refresh a specific account token with single-flight protection.
   * Prevents concurrent refresh races from disabling healthy accounts.
   * @param {import('./lib/accounts.mjs').ManagedAccount} account
   * @param {"foreground" | "idle"} [source]
   * @returns {Promise<string>}
   */
  async function refreshAccountTokenSingleFlight(account, source = "foreground") {
    const key = account.id;
    const existing = refreshInFlight.get(key);
    if (existing) {
      // Foreground requests should not directly inherit idle refresh failures.
      // Wait for idle maintenance to finish, then re-evaluate token state.
      if (source === "foreground" && existing.source === "idle") {
        try {
          await existing.promise;
        } catch {
          // Ignore idle failure here; foreground path handles refresh decisions.
        }

        if (account.access && account.expires && account.expires > Date.now()) {
          return account.access;
        }
      } else {
        return existing.promise;
      }
    }

    /** @type {{ promise: Promise<string>, source: "foreground" | "idle" }} */
    const entry = { source, promise: Promise.resolve("") };
    const p = (async () => {
      try {
        return await refreshAccountToken(account, client, source, {
          onTokensUpdated: async () => {
            try {
              await accountManager.saveToDisk();
            } catch {
              // Synchronous save failed (disk full, permissions, etc.).
              // Schedule a debounced retry so the rotated token eventually
              // reaches disk.  Another process may hit invalid_grant in the
              // interim, but its retry-from-disk logic can recover once this
              // save lands.
              accountManager.requestSaveToDisk();
              throw new Error("save failed, debounced retry scheduled");
            }
          },
        });
      } finally {
        if (refreshInFlight.get(key) === entry) {
          refreshInFlight.delete(key);
        }
      }
    })();

    entry.promise = p;
    refreshInFlight.set(key, entry);
    return p;
  }

  /**
   * Refresh one idle (non-active) account in the background.
   * Best-effort only: never disables accounts from background maintenance.
   * @param {import('./lib/accounts.mjs').ManagedAccount} account
   * @returns {Promise<void>}
   */
  async function refreshIdleAccount(account) {
    if (!accountManager) return;
    if (idleRefreshInFlight.has(account.id)) return;

    idleRefreshInFlight.add(account.id);
    const attemptedRefreshToken = account.refreshToken;

    try {
      try {
        await refreshAccountTokenSingleFlight(account, "idle");
        return;
      } catch (err) {
        let details = parseRefreshFailure(err);

        if (!(details.isInvalidGrant || details.isTerminalStatus)) {
          debugLog("idle refresh skipped after transient failure", {
            accountIndex: account.index,
            status: details.status,
            errorCode: details.errorCode,
            message: details.message,
          });
          return;
        }

        const diskAuth = await readDiskAccountAuth(account.id);
        const retryToken = diskAuth?.refreshToken;
        if (retryToken && retryToken !== attemptedRefreshToken && account.refreshToken === attemptedRefreshToken) {
          account.refreshToken = retryToken;
          if (diskAuth?.tokenUpdatedAt) {
            account.tokenUpdatedAt = diskAuth.tokenUpdatedAt;
          } else {
            markTokenStateUpdated(account);
          }
        }

        try {
          await refreshAccountTokenSingleFlight(account, "idle");
          return;
        } catch (retryErr) {
          details = parseRefreshFailure(retryErr);
          debugLog("idle refresh retry failed", {
            accountIndex: account.index,
            status: details.status,
            errorCode: details.errorCode,
            message: details.message,
          });
          return;
        }
      }
    } finally {
      idleRefreshInFlight.delete(account.id);
    }
  }

  /**
   * Opportunistically refresh one near-expiry idle account in background.
   * Runs during normal requests so inactive accounts stay healthy.
   * @param {import('./lib/accounts.mjs').ManagedAccount} activeAccount
   */
  function maybeRefreshIdleAccounts(activeAccount) {
    if (!IDLE_REFRESH_ENABLED || !accountManager) return;

    const now = Date.now();
    const excluded = new Set([activeAccount.index]);
    const candidates = accountManager
      .getEnabledAccounts(excluded)
      .filter((acc) => !acc.expires || acc.expires <= now + IDLE_REFRESH_WINDOW_MS)
      .filter((acc) => {
        const last = idleRefreshLastAttempt.get(acc.id) ?? 0;
        return now - last >= IDLE_REFRESH_MIN_INTERVAL_MS;
      })
      .sort((a, b) => (a.expires ?? 0) - (b.expires ?? 0));

    const target = candidates[0];
    if (!target) return;

    idleRefreshLastAttempt.set(target.id, now);
    void refreshIdleAccount(target);
  }

  return {
    // A1-A4: System prompt transform (unchanged)
    "experimental.chat.system.transform": (input, output) => {
      const prefix = "You are Claude Code, Anthropic's official CLI for Claude.";
      if (input.model?.providerID !== "anthropic") return;
      if (!Array.isArray(output.system)) return;

      // Mutate in place — reassigning output.system breaks the caller's reference.
      // Remove exact matches of the prefix.
      for (let i = output.system.length - 1; i >= 0; i--) {
        if (output.system[i] === prefix) output.system.splice(i, 1);
      }
      // Strip prefix prepended to other entries (BUILTIN double-insert pattern:
      // system[1] = prefix + "\n\n" + rest). Only matches the known pattern.
      for (let i = 0; i < output.system.length; i++) {
        if (typeof output.system[i] === "string" && output.system[i].startsWith(prefix + "\n")) {
          output.system[i] = output.system[i].slice(prefix.length).replace(/^\n+/, "");
        }
      }
      // Remove any existing billing header blocks (BUILTIN coexistence dedup).
      for (let i = output.system.length - 1; i >= 0; i--) {
        if (typeof output.system[i] === "string" && output.system[i].startsWith("x-anthropic-billing-header:")) {
          output.system.splice(i, 1);
        }
      }
      output.system.unshift(prefix);
      if (config.headers.billing_header) {
        output.system.unshift(getBillingHeaderBlock(config.headers.emulation_profile));
      }
    },
    config: async (input) => {
      input.command ??= {};
      input.command["anthropic"] = {
        template: "/anthropic",
        description: "Manage Anthropic multi-account auth (status, usage, switch, login, reauth, logout)",
      };
    },
    "command.execute.before": async (input) => {
      if (input.command !== "anthropic") return;

      try {
        await handleAnthropicSlashCommand(input);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        await sendCommandMessage(input.sessionID, `▣ Anthropic (error)\n\n${message}`);
      }

      throw new Error(ANTHROPIC_COMMAND_HANDLED);
    },
    auth: {
      provider: "anthropic",
      async loader(getAuth, provider) {
        const auth = await getAuth();
        if (auth.type === "oauth") {
          // B1-B2: Zero out cost for max plan
          for (const model of Object.values(provider.models)) {
            model.cost = {
              input: 0,
              output: 0,
              cache: {
                read: 0,
                write: 0,
              },
            };
          }

          // Initialize AccountManager from disk + OpenCode auth fallback
          accountManager = await AccountManager.load(config, {
            refresh: auth.refresh,
            access: auth.access,
            expires: auth.expires,
          });

          // If we bootstrapped from auth.json and have no stored accounts file,
          // save immediately to create it (debounced save may not fire in time)
          if (accountManager.getAccountCount() > 0) {
            await accountManager.saveToDisk();
          }

          return {
            apiKey: "",
            /**
             * @param {any} input
             * @param {any} init
             */
            async fetch(input, init) {
              // Re-read auth for non-oauth fallback
              const currentAuth = await getAuth();
              if (currentAuth.type !== "oauth") return fetch(input, init);

              // Transform body and URL once (shared across retries)
              const requestInit = init ?? {};
              const body = transformRequestBody(requestInit.body);
              const modelName = extractModelName(body);
              const { requestInput, requestUrl } = transformRequestUrl(input);
              const requestMethod = String(
                requestInit.method || (requestInput instanceof Request ? requestInput.method : "POST"),
              ).toUpperCase();
              const showUsageToast = requestUrl?.pathname === "/v1/messages" && requestMethod === "POST";

              let lastError = null;
              const transientRefreshSkips = new Set();

              // Sync with CLI changes at request start.
              if (accountManager) {
                await accountManager.syncActiveIndexFromDisk();
              }

              // Try each account at most once. If the error is account-specific,
              // switch to the next account. If it's service-wide, return immediately.
              const maxAttempts = accountManager.getTotalAccountCount();

              for (let attempt = 0; attempt < maxAttempts; attempt++) {
                // Select account
                const account = accountManager.getCurrentAccount(transientRefreshSkips);

                // Toast account usage on first use and whenever the account changes
                if (showUsageToast && account && accountManager) {
                  const currentIndex = accountManager.getCurrentIndex();
                  if (currentIndex !== lastToastedIndex) {
                    const name = account.email || `Account ${currentIndex + 1}`;
                    const total = accountManager.getAccountCount();
                    const msg = total > 1 ? `Claude: ${name} (${currentIndex + 1}/${total})` : `Claude: ${name}`;
                    await toast(msg, "info", { debounceKey: "account-usage" });
                    lastToastedIndex = currentIndex;
                  }
                }

                if (!account) {
                  const enabledCount = accountManager.getAccountCount();
                  if (enabledCount === 0) {
                    throw new Error(
                      "No enabled Anthropic accounts available. Enable one with 'opencode-anthropic-auth enable <N>'.",
                    );
                  }
                  // Enabled accounts exist, but none are currently selectable.
                  const reason = buildNoAvailableAccountReason(accountManager, transientRefreshSkips, lastError);
                  await toast(`All Anthropic accounts unavailable: ${reason}`, "error");
                  throw new Error(`No available Anthropic account for request: ${reason}`);
                }

                // Determine access token
                let accessToken;
                // Per-account token refresh
                if (!account.access || !account.expires || account.expires < Date.now()) {
                  const attemptedRefreshToken = account.refreshToken;
                  try {
                    accessToken = await refreshAccountTokenSingleFlight(account);
                    // Tokens are now saved under the refresh lock (inside
                    // refreshAccountToken) so no debounced save needed here.
                  } catch (err) {
                    // Token refresh failed — check if another instance rotated the
                    // refresh token and persisted it between attempts.
                    let finalError = err;
                    let details = parseRefreshFailure(err);

                    // Belt-and-suspenders retry: on terminal/invalid_grant failures,
                    // always re-read disk token and retry once before disabling.
                    if (details.isInvalidGrant || details.isTerminalStatus) {
                      const diskAuth = await readDiskAccountAuth(account.id);
                      const retryToken = diskAuth?.refreshToken;
                      if (
                        retryToken &&
                        retryToken !== attemptedRefreshToken &&
                        account.refreshToken === attemptedRefreshToken
                      ) {
                        debugLog("refresh token on disk differs from in-memory, retrying with disk token", {
                          accountIndex: account.index,
                        });
                        account.refreshToken = retryToken;
                        if (diskAuth?.tokenUpdatedAt) {
                          account.tokenUpdatedAt = diskAuth.tokenUpdatedAt;
                        } else {
                          markTokenStateUpdated(account);
                        }
                      } else if (retryToken && retryToken !== attemptedRefreshToken) {
                        debugLog("skipping disk token adoption because in-memory token already changed", {
                          accountIndex: account.index,
                        });
                      }

                      try {
                        accessToken = await refreshAccountTokenSingleFlight(account);
                      } catch (retryErr) {
                        finalError = retryErr;
                        details = parseRefreshFailure(retryErr);
                        debugLog("retry refresh failed", {
                          accountIndex: account.index,
                          status: details.status,
                          errorCode: details.errorCode,
                          message: details.message,
                        });
                      }
                    }

                    if (!accessToken) {
                      accountManager.markFailure(account);

                      if (details.isInvalidGrant || details.isTerminalStatus) {
                        const name = account.email || `Account ${accountManager.getCurrentIndex() + 1}`;
                        debugLog("disabling account after terminal refresh failure", {
                          accountIndex: account.index,
                          status: details.status,
                          errorCode: details.errorCode,
                          message: details.message,
                        });
                        account.enabled = false;
                        accountManager.requestSaveToDisk();
                        const statusLabel = Number.isFinite(details.status)
                          ? `HTTP ${details.status}`
                          : "unknown status";
                        await toast(
                          `Disabled ${name} (token refresh failed: ${details.errorCode || statusLabel})`,
                          "error",
                        );
                      } else {
                        // Skip this account for the remainder of this request.
                        transientRefreshSkips.add(account.index);
                      }
                      lastError = finalError;
                      continue; // Try next account
                    }
                  }
                } else {
                  accessToken = account.access;
                }

                // Keep non-active accounts warm without blocking the request.
                maybeRefreshIdleAccounts(account);

                // Build headers with the selected account's token
                const requestHeaders = buildRequestHeaders(input, requestInit, accessToken, config.headers, modelName);

                // Execute the request
                let response;
                try {
                  response = await fetch(requestInput, {
                    ...requestInit,
                    body,
                    headers: requestHeaders,
                  });
                } catch (err) {
                  const fetchError = err instanceof Error ? err : new Error(String(err));

                  if (accountManager && account) {
                    accountManager.markFailure(account);
                    transientRefreshSkips.add(account.index);
                    lastError = fetchError;
                    debugLog("request fetch threw, trying next account", {
                      accountIndex: account.index,
                      message: fetchError.message,
                    });
                    continue;
                  }

                  throw fetchError;
                }

                // On error, check if it's account-specific or service-wide
                if (!response.ok && accountManager && account) {
                  let errorBody = null;
                  try {
                    errorBody = await response.clone().text();
                  } catch {
                    // Ignore read errors
                  }

                  if (isAccountSpecificError(response.status, errorBody)) {
                    // Account-specific: mark this account, try the next one
                    const reason = parseRateLimitReason(response.status, errorBody);
                    const retryAfterMs = parseRetryAfterHeader(response);
                    const authOrPermissionIssue = reason === "AUTH_FAILED";

                    // Auth failures should force token refresh on next use.
                    if (reason === "AUTH_FAILED") {
                      account.access = undefined;
                      account.expires = undefined;
                      markTokenStateUpdated(account);
                    }

                    debugLog("account-specific error, switching account", {
                      accountIndex: account.index,
                      status: response.status,
                      reason,
                    });

                    accountManager.markRateLimited(account, reason, authOrPermissionIssue ? null : retryAfterMs);

                    const name = account.email || `Account ${accountManager.getCurrentIndex() + 1}`;
                    const total = accountManager.getAccountCount();
                    if (total > 1) {
                      const switchReason = formatSwitchReason(response.status, reason);
                      await toast(`${name} ${switchReason}, switching account`, "warning", {
                        debounceKey: "account-switch",
                      });
                    }

                    continue; // Try next account immediately
                  }

                  // Service-wide error (529, 503, 500, etc.) — return to caller,
                  // switching accounts won't help
                  debugLog("service-wide response error, returning directly", {
                    status: response.status,
                  });
                  return transformResponse(response);
                }

                // Success
                if (account && accountManager) {
                  if (response.ok) {
                    accountManager.markSuccess(account);
                  }
                }

                // Wire usage tracking and mid-stream error detection for SSE responses only.
                const shouldInspectStream = response.ok && account && accountManager && isEventStreamResponse(response);

                const usageCallback = shouldInspectStream
                  ? (/** @type {UsageStats} */ usage) => {
                      accountManager.recordUsage(account.index, usage);
                    }
                  : null;

                const accountErrorCallback = shouldInspectStream
                  ? (details) => {
                      // Mid-stream account error: mark for NEXT request
                      if (details.invalidateToken) {
                        account.access = undefined;
                        account.expires = undefined;
                        markTokenStateUpdated(account);
                      }
                      accountManager.markRateLimited(account, details.reason, null);
                    }
                  : null;

                return transformResponse(response, usageCallback, accountErrorCallback);
              }

              // All accounts tried
              if (lastError) throw lastError;
              throw new Error("All accounts exhausted — no account could serve this request");
            },
          };
        }

        return {};
      },
      methods: [
        {
          // H1: Claude Pro/Max OAuth — now with multi-account support
          label: "Claude Pro/Max (multi-account)",
          type: "oauth",
          authorize: async () => {
            // Check for existing accounts
            const stored = await loadAccounts();
            if (stored && stored.accounts.length > 0 && accountManager) {
              const action = await promptAccountMenu(accountManager);

              if (action === "cancel") {
                return {
                  url: "about:blank",
                  instructions: "Cancelled.",
                  method: "code",
                  callback: async () => ({ type: "failed" }),
                };
              }

              if (action === "manage") {
                await promptManageAccounts(accountManager);
                await accountManager.saveToDisk();
                return {
                  url: "about:blank",
                  instructions: "Account management complete. Re-run auth to add accounts.",
                  method: "code",
                  callback: async () => ({ type: "failed" }),
                };
              }

              if (action === "fresh") {
                await clearAccounts();
                accountManager.clearAll();
              }

              // action === "add" or "fresh" — fall through to OAuth flow
            }

            const { url, verifier } = await authorize("max");
            return {
              url: url,
              instructions: "Paste the authorization code here: ",
              method: "code",
              callback: async (code) => {
                const credentials = await exchange(code, verifier);
                if (credentials.type === "failed") return credentials;

                // Initialize AccountManager if not yet loaded (first login —
                // loader() hasn't run yet because auth hasn't completed)
                if (!accountManager) {
                  accountManager = await AccountManager.load(config, null);
                }

                // Add to account pool and persist immediately
                const countBefore = accountManager.getAccountCount();
                accountManager.addAccount(
                  credentials.refresh,
                  credentials.access,
                  credentials.expires,
                  credentials.email,
                );
                await accountManager.saveToDisk();

                // Toast the result
                const total = accountManager.getAccountCount();
                const name = credentials.email || "account";
                if (countBefore > 0) {
                  await toast(`Added ${name} — ${total} accounts`, "success");
                } else {
                  await toast(`Authenticated (${name})`, "success");
                }

                return credentials;
              },
            };
          },
        },
        {
          // H2: Create an API Key (unchanged)
          label: "Create an API Key",
          type: "oauth",
          authorize: async () => {
            const { url, verifier } = await authorize("console");
            return {
              url: url,
              instructions: "Paste the authorization code here: ",
              method: "code",
              callback: async (code) => {
                const credentials = await exchange(code, verifier);
                if (credentials.type === "failed") return credentials;
                let result;
                try {
                  const resp = await fetch(`https://api.anthropic.com/api/oauth/claude_cli/create_api_key`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      authorization: `Bearer ${credentials.access}`,
                    },
                  });
                  if (!resp.ok) {
                    const text = await resp.text().catch(() => "");
                    return { type: "failed", error: `API key creation failed (HTTP ${resp.status}): ${text}` };
                  }
                  result = await resp.json();
                } catch (err) {
                  return { type: "failed", error: `API key creation failed: ${err.message}` };
                }
                if (!result?.raw_key) {
                  return { type: "failed", error: "API key creation failed: no key in response" };
                }
                return { type: "success", key: result.raw_key };
              },
            };
          },
        },
        {
          // H3: Manual API Key (unchanged)
          provider: "anthropic",
          label: "Manually enter API Key",
          type: "api",
        },
      ],
    },
  };
}
