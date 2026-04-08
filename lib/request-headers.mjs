import { randomBytes } from "node:crypto";

/**
 * @typedef {object} HeaderProfile
 * @property {string} ccVersion
 * @property {Record<string, string>} headers
 * @property {string[]} betaBase
 * @property {{ opus?: string[] }} betaByModel
 */

/** @type {HeaderProfile} */
const CLAUDE_CLI_2_1_50_PROFILE = {
  ccVersion: "2.1.50.b97",
  headers: {
    accept: "application/json",
    "anthropic-dangerous-direct-browser-access": "true",
    "anthropic-version": "2023-06-01",
    "user-agent": "claude-cli/2.1.50 (external, cli)",
    "x-app": "cli",
    "x-stainless-arch": "arm64",
    "x-stainless-lang": "js",
    "x-stainless-os": "MacOS",
    "x-stainless-package-version": "0.74.0",
    "x-stainless-retry-count": "0",
    "x-stainless-runtime": "node",
    "x-stainless-runtime-version": "v24.3.0",
    "x-stainless-timeout": "600",
  },
  betaBase: [
    "claude-code-20250219",
    "oauth-2025-04-20",
    "interleaved-thinking-2025-05-14",
    "prompt-caching-scope-2026-01-05",
    "effort-2025-11-24",
    "adaptive-thinking-2026-01-28",
  ],
  betaByModel: {
    opus: ["context-management-2025-06-27"],
  },
};

/** @type {HeaderProfile} */
const CLAUDE_CLI_2_1_75_PROFILE = {
  // Captured from a real 2.1.75 Opus request. The optional billing header was
  // not enabled in that capture, so this ccVersion is inferred from the CLI
  // user-agent rather than an observed billing-header block.
  ccVersion: "2.1.75",
  headers: {
    accept: "application/json",
    "anthropic-dangerous-direct-browser-access": "true",
    "anthropic-version": "2023-06-01",
    "user-agent": "claude-cli/2.1.75 (external, cli)",
    "x-app": "cli",
    "x-stainless-arch": "arm64",
    "x-stainless-lang": "js",
    "x-stainless-os": "MacOS",
    "x-stainless-package-version": "0.74.0",
    "x-stainless-retry-count": "0",
    "x-stainless-runtime": "node",
    "x-stainless-runtime-version": "v24.3.0",
    "x-stainless-timeout": "600",
  },
  betaBase: [
    "claude-code-20250219",
    "oauth-2025-04-20",
    "interleaved-thinking-2025-05-14",
    "redact-thinking-2026-02-12",
    "prompt-caching-scope-2026-01-05",
    "advanced-tool-use-2025-11-20",
    "effort-2025-11-24",
  ],
  betaByModel: {
    opus: ["context-management-2025-06-27"],
  },
};

/** @type {HeaderProfile} */
const CLAUDE_CLI_2_1_79_PROFILE = {
  // Extracted from Claude Code 2.1.79 binary (BUILD_TIME: 2026-03-18T21:33:25Z)
  ccVersion: "2.1.79",
  headers: {
    accept: "application/json",
    "anthropic-dangerous-direct-browser-access": "true",
    "anthropic-version": "2023-06-01",
    "user-agent": "claude-cli/2.1.79 (external, cli)",
    "x-app": "cli",
    "x-stainless-arch": "x86_64",
    "x-stainless-lang": "js",
    "x-stainless-os": "Linux",
    "x-stainless-package-version": "0.74.0",
    "x-stainless-retry-count": "0",
    "x-stainless-runtime": "node",
    "x-stainless-runtime-version": "v24.14.0",
    "x-stainless-timeout": "600",
  },
  betaBase: [
    "claude-code-20250219",
    "oauth-2025-04-20",
    "interleaved-thinking-2025-05-14",
    "redact-thinking-2026-02-12",
    "prompt-caching-scope-2026-01-05",
    "advanced-tool-use-2025-11-20",
    "effort-2025-11-24",
    "fast-mode-2026-02-01",
  ],
  betaByModel: {
    opus: ["context-management-2025-06-27"],
  },
};

/** @type {HeaderProfile} */
const CLAUDE_CLI_2_1_91_PROFILE = {
  // Extracted from Claude Code 2.1.91 binary (BUILD_TIME: 2026-04-02T21:59:14Z)
  // Binary analysis confirmed: no native cch attestation in ELF — cch=00000 is
  // a static placeholder in the JS bundle, never overwritten by native code.
  // getBillingHeaderBlock() generates a random 5-char hex cch which is equivalent.
  ccVersion: "2.1.91",
  headers: {
    accept: "application/json",
    "anthropic-dangerous-direct-browser-access": "true",
    "anthropic-version": "2023-06-01",
    "user-agent": "claude-cli/2.1.91 (external, cli)",
    "x-app": "cli",
    "x-stainless-arch": "x64",
    "x-stainless-lang": "js",
    "x-stainless-os": "Linux",
    "x-stainless-package-version": "0.74.0",
    "x-stainless-retry-count": "0",
    "x-stainless-runtime": "node",
    "x-stainless-runtime-version": "v22.0.0",
    "x-stainless-timeout": "600",
  },
  betaBase: [
    "claude-code-20250219",
    "oauth-2025-04-20",
    "context-1m-2025-08-07",
    "interleaved-thinking-2025-05-14",
    "redact-thinking-2026-02-12",
    "prompt-caching-scope-2026-01-05",
    "advanced-tool-use-2025-11-20",
    "effort-2025-11-24",
  ],
  betaByModel: {
    opus: ["context-management-2025-06-27"],
  },
};

/** @type {HeaderProfile} */
const CLAUDE_CLI_2_1_96_PROFILE = {
  // Captured from a live Claude Code 2.1.96 request via local HTTPS intercept
  // on 2026-04-08. User-agent format is "external, sdk-cli" (not "external, cli")
  // as of this version. The anthropic-beta list no longer includes oauth-2025-04-20
  // by default (we add it explicitly for OAuth requests).
  ccVersion: "2.1.96",
  headers: {
    accept: "application/json",
    "anthropic-dangerous-direct-browser-access": "true",
    "anthropic-version": "2023-06-01",
    "user-agent": "claude-cli/2.1.96 (external, sdk-cli)",
    "x-app": "cli",
    "x-stainless-arch": "x64",
    "x-stainless-lang": "js",
    "x-stainless-os": "Linux",
    "x-stainless-package-version": "0.81.0",
    "x-stainless-retry-count": "0",
    "x-stainless-runtime": "node",
    "x-stainless-runtime-version": "v24.3.0",
    "x-stainless-timeout": "600",
  },
  betaBase: [
    "claude-code-20250219",
    "oauth-2025-04-20",
    "interleaved-thinking-2025-05-14",
    "prompt-caching-scope-2026-01-05",
    "effort-2025-11-24",
  ],
  betaByModel: {
    opus: ["context-management-2025-06-27"],
  },
};

/** @type {Record<string, HeaderProfile>} */
export const HEADER_PROFILES = {
  "claude-cli-default": CLAUDE_CLI_2_1_96_PROFILE,
  "claude-cli-2.1.50": CLAUDE_CLI_2_1_50_PROFILE,
  "claude-cli-2.1.75": CLAUDE_CLI_2_1_75_PROFILE,
  "claude-cli-2.1.79": CLAUDE_CLI_2_1_79_PROFILE,
  "claude-cli-2.1.91": CLAUDE_CLI_2_1_91_PROFILE,
  "claude-cli-2.1.96": CLAUDE_CLI_2_1_96_PROFILE,
};

export const DEFAULT_HEADER_PROFILE = "claude-cli-2.1.96";

/**
 * Adding a new profile version:
 *
 * 1. Define a new `CLAUDE_CLI_x_y_z_PROFILE` constant above with the
 *    captured headers from the target Claude CLI version.
 * 2. Add a versioned entry to `HEADER_PROFILES` (e.g. `"claude-cli-3.0.0"`).
 * 3. Point the `"claude-cli-default"` alias at the new profile constant.
 * 4. Optionally update `DEFAULT_HEADER_PROFILE` to the new versioned key.
 * 5. Update tests in `request-headers.test.mjs` to cover the new profile.
 */

/**
 * @param {string | undefined} profileName
 * @returns {HeaderProfile}
 */
export function getHeaderProfile(profileName) {
  if (profileName && HEADER_PROFILES[profileName]) {
    return HEADER_PROFILES[profileName];
  }
  return HEADER_PROFILES[DEFAULT_HEADER_PROFILE];
}

/**
 * @param {string | undefined} model
 * @returns {"opus" | null}
 */
function detectModelFamily(model) {
  if (!model) return null;
  const normalized = model.toLowerCase();
  if (normalized.includes("opus")) return "opus";
  return null;
}

/**
 * @param {string | undefined} profileName
 * @param {string | undefined} model
 * @returns {string[]}
 */
export function getDefaultBetas(profileName, model) {
  const profile = getHeaderProfile(profileName);
  const family = detectModelFamily(model);
  const familyBetas = family ? profile.betaByModel[family] || [] : [];
  return [...profile.betaBase, ...familyBetas];
}

/**
 * Generate a billing header system block matching official Claude Code format.
 * The `cch` value is a random 5-char hex string generated per call (per request).
 *
 * @param {string | undefined} profileName
 * @returns {string}
 */
export function getBillingHeaderBlock(profileName) {
  const profile = getHeaderProfile(profileName);
  const cch = randomBytes(3).toString("hex").slice(0, 5);
  return `x-anthropic-billing-header: cc_version=${profile.ccVersion}; cc_entrypoint=cli; cch=${cch};`;
}
