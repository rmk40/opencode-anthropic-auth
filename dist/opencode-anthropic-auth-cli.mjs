#!/usr/bin/env node
var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// lib/storage.mjs
import { promises as fs } from "node:fs";
import { existsSync as existsSync2, readFileSync as readFileSync2, appendFileSync, writeFileSync as writeFileSync2 } from "node:fs";
import { dirname as dirname2, join as join2 } from "node:path";
import { randomBytes as randomBytes2 } from "node:crypto";

// lib/config.mjs
import { existsSync, readFileSync, writeFileSync, mkdirSync, renameSync } from "node:fs";
import { join, dirname } from "node:path";
import { homedir } from "node:os";

// lib/request-headers.mjs
import { randomBytes } from "node:crypto";
var CLAUDE_CLI_2_1_50_PROFILE = {
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
    "x-stainless-timeout": "600"
  },
  betaBase: [
    "claude-code-20250219",
    "oauth-2025-04-20",
    "interleaved-thinking-2025-05-14",
    "prompt-caching-scope-2026-01-05",
    "effort-2025-11-24",
    "adaptive-thinking-2026-01-28"
  ],
  betaByModel: {
    opus: ["context-management-2025-06-27"]
  }
};
var CLAUDE_CLI_2_1_75_PROFILE = {
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
    "x-stainless-timeout": "600"
  },
  betaBase: [
    "claude-code-20250219",
    "oauth-2025-04-20",
    "interleaved-thinking-2025-05-14",
    "redact-thinking-2026-02-12",
    "prompt-caching-scope-2026-01-05",
    "advanced-tool-use-2025-11-20",
    "effort-2025-11-24"
  ],
  betaByModel: {
    opus: ["context-management-2025-06-27"]
  }
};
var CLAUDE_CLI_2_1_79_PROFILE = {
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
    "x-stainless-timeout": "600"
  },
  betaBase: [
    "claude-code-20250219",
    "oauth-2025-04-20",
    "interleaved-thinking-2025-05-14",
    "redact-thinking-2026-02-12",
    "prompt-caching-scope-2026-01-05",
    "advanced-tool-use-2025-11-20",
    "effort-2025-11-24",
    "fast-mode-2026-02-01"
  ],
  betaByModel: {
    opus: ["context-management-2025-06-27"]
  }
};
var CLAUDE_CLI_2_1_91_PROFILE = {
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
    "x-stainless-timeout": "600"
  },
  betaBase: [
    "claude-code-20250219",
    "oauth-2025-04-20",
    "context-1m-2025-08-07",
    "interleaved-thinking-2025-05-14",
    "redact-thinking-2026-02-12",
    "prompt-caching-scope-2026-01-05",
    "advanced-tool-use-2025-11-20",
    "effort-2025-11-24"
  ],
  betaByModel: {
    opus: ["context-management-2025-06-27"]
  }
};
var CLAUDE_CLI_2_1_96_PROFILE = {
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
    "x-stainless-timeout": "600"
  },
  betaBase: [
    "claude-code-20250219",
    "oauth-2025-04-20",
    "interleaved-thinking-2025-05-14",
    "prompt-caching-scope-2026-01-05",
    "effort-2025-11-24"
  ],
  betaByModel: {
    opus: ["context-management-2025-06-27"]
  }
};
var HEADER_PROFILES = {
  "claude-cli-default": CLAUDE_CLI_2_1_96_PROFILE,
  "claude-cli-2.1.50": CLAUDE_CLI_2_1_50_PROFILE,
  "claude-cli-2.1.75": CLAUDE_CLI_2_1_75_PROFILE,
  "claude-cli-2.1.79": CLAUDE_CLI_2_1_79_PROFILE,
  "claude-cli-2.1.91": CLAUDE_CLI_2_1_91_PROFILE,
  "claude-cli-2.1.96": CLAUDE_CLI_2_1_96_PROFILE
};
var DEFAULT_HEADER_PROFILE = "claude-cli-2.1.96";
function getHeaderProfile(profileName) {
  if (profileName && HEADER_PROFILES[profileName]) {
    return HEADER_PROFILES[profileName];
  }
  return HEADER_PROFILES[DEFAULT_HEADER_PROFILE];
}

// lib/config.mjs
var DEFAULT_CONFIG = {
  account_selection_strategy: "sticky",
  failure_ttl_seconds: 3600,
  debug: false,
  health_score: {
    initial: 70,
    success_reward: 1,
    rate_limit_penalty: -10,
    failure_penalty: -20,
    recovery_rate_per_hour: 2,
    min_usable: 50,
    max_score: 100
  },
  token_bucket: {
    max_tokens: 50,
    regeneration_rate_per_minute: 6,
    initial_tokens: 50
  },
  toasts: {
    quiet: false,
    debounce_seconds: 30
  },
  headers: {
    emulation_profile: DEFAULT_HEADER_PROFILE,
    overrides: {},
    disable: [],
    billing_header: false
  },
  idle_refresh: {
    enabled: true,
    window_minutes: 60,
    min_interval_minutes: 30
  }
};
var VALID_STRATEGIES = ["sticky", "round-robin", "hybrid"];
var CLIENT_ID = "9d1c250a-e61b-44d9-88ed-5944d1962f5e";
function getConfigDir() {
  const platform = process.platform;
  if (platform === "win32") {
    return join(process.env.APPDATA || join(homedir(), "AppData", "Roaming"), "opencode");
  }
  const xdgConfig = process.env.XDG_CONFIG_HOME || join(homedir(), ".config");
  return join(xdgConfig, "opencode");
}
function getConfigPath() {
  return join(getConfigDir(), "anthropic-auth.json");
}
function clampNumber(value, min, max, fallback) {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return Math.max(min, Math.min(max, value));
}
function validateConfig(raw) {
  const config = {
    ...DEFAULT_CONFIG,
    health_score: { ...DEFAULT_CONFIG.health_score },
    token_bucket: { ...DEFAULT_CONFIG.token_bucket },
    toasts: { ...DEFAULT_CONFIG.toasts },
    headers: {
      emulation_profile: DEFAULT_CONFIG.headers.emulation_profile,
      overrides: { ...DEFAULT_CONFIG.headers.overrides },
      disable: [...DEFAULT_CONFIG.headers.disable],
      billing_header: DEFAULT_CONFIG.headers.billing_header
    },
    idle_refresh: { ...DEFAULT_CONFIG.idle_refresh }
  };
  if (typeof raw.account_selection_strategy === "string" && VALID_STRATEGIES.includes(raw.account_selection_strategy)) {
    config.account_selection_strategy = /** @type {AccountSelectionStrategy} */
    raw.account_selection_strategy;
  }
  config.failure_ttl_seconds = clampNumber(raw.failure_ttl_seconds, 60, 7200, DEFAULT_CONFIG.failure_ttl_seconds);
  if (typeof raw.debug === "boolean") {
    config.debug = raw.debug;
  }
  if (raw.health_score && typeof raw.health_score === "object") {
    const hs = (
      /** @type {Record<string, unknown>} */
      raw.health_score
    );
    config.health_score = {
      initial: clampNumber(hs.initial, 0, 100, DEFAULT_CONFIG.health_score.initial),
      success_reward: clampNumber(hs.success_reward, 0, 10, DEFAULT_CONFIG.health_score.success_reward),
      rate_limit_penalty: clampNumber(hs.rate_limit_penalty, -50, 0, DEFAULT_CONFIG.health_score.rate_limit_penalty),
      failure_penalty: clampNumber(hs.failure_penalty, -100, 0, DEFAULT_CONFIG.health_score.failure_penalty),
      recovery_rate_per_hour: clampNumber(
        hs.recovery_rate_per_hour,
        0,
        20,
        DEFAULT_CONFIG.health_score.recovery_rate_per_hour
      ),
      min_usable: clampNumber(hs.min_usable, 0, 100, DEFAULT_CONFIG.health_score.min_usable),
      max_score: clampNumber(hs.max_score, 50, 100, DEFAULT_CONFIG.health_score.max_score)
    };
  }
  if (raw.toasts && typeof raw.toasts === "object") {
    const t = (
      /** @type {Record<string, unknown>} */
      raw.toasts
    );
    config.toasts = {
      quiet: typeof t.quiet === "boolean" ? t.quiet : DEFAULT_CONFIG.toasts.quiet,
      debounce_seconds: clampNumber(t.debounce_seconds, 0, 300, DEFAULT_CONFIG.toasts.debounce_seconds)
    };
  }
  if (raw.token_bucket && typeof raw.token_bucket === "object") {
    const tb = (
      /** @type {Record<string, unknown>} */
      raw.token_bucket
    );
    config.token_bucket = {
      max_tokens: clampNumber(tb.max_tokens, 1, 1e3, DEFAULT_CONFIG.token_bucket.max_tokens),
      regeneration_rate_per_minute: clampNumber(
        tb.regeneration_rate_per_minute,
        0.1,
        60,
        DEFAULT_CONFIG.token_bucket.regeneration_rate_per_minute
      ),
      initial_tokens: clampNumber(tb.initial_tokens, 1, 1e3, DEFAULT_CONFIG.token_bucket.initial_tokens)
    };
  }
  if (raw.headers && typeof raw.headers === "object") {
    const h = (
      /** @type {Record<string, unknown>} */
      raw.headers
    );
    if (typeof h.emulation_profile === "string" && h.emulation_profile.trim()) {
      config.headers.emulation_profile = h.emulation_profile.trim();
    }
    if (h.overrides && typeof h.overrides === "object" && !Array.isArray(h.overrides)) {
      const overrides = {};
      for (const [key, value] of Object.entries(
        /** @type {Record<string, unknown>} */
        h.overrides
      )) {
        if (!key) continue;
        if (typeof value === "string") {
          overrides[key] = value;
        }
      }
      config.headers.overrides = overrides;
    }
    if (Array.isArray(h.disable)) {
      config.headers.disable = h.disable.filter((v) => typeof v === "string").map((v) => v.trim().toLowerCase()).filter(Boolean);
    }
    if (typeof h.billing_header === "boolean") {
      config.headers.billing_header = h.billing_header;
    }
  }
  if (raw.idle_refresh && typeof raw.idle_refresh === "object") {
    const ir = (
      /** @type {Record<string, unknown>} */
      raw.idle_refresh
    );
    config.idle_refresh = {
      enabled: typeof ir.enabled === "boolean" ? ir.enabled : DEFAULT_CONFIG.idle_refresh.enabled,
      window_minutes: clampNumber(ir.window_minutes, 1, 24 * 60, DEFAULT_CONFIG.idle_refresh.window_minutes),
      min_interval_minutes: clampNumber(
        ir.min_interval_minutes,
        1,
        24 * 60,
        DEFAULT_CONFIG.idle_refresh.min_interval_minutes
      )
    };
  }
  return config;
}
function applyEnvOverrides(config) {
  const env = process.env;
  if (env.OPENCODE_ANTHROPIC_STRATEGY && VALID_STRATEGIES.includes(env.OPENCODE_ANTHROPIC_STRATEGY)) {
    config.account_selection_strategy = /** @type {AccountSelectionStrategy} */
    env.OPENCODE_ANTHROPIC_STRATEGY;
  }
  if (env.OPENCODE_ANTHROPIC_DEBUG === "1" || env.OPENCODE_ANTHROPIC_DEBUG === "true") {
    config.debug = true;
  }
  if (env.OPENCODE_ANTHROPIC_DEBUG === "0" || env.OPENCODE_ANTHROPIC_DEBUG === "false") {
    config.debug = false;
  }
  if (env.OPENCODE_ANTHROPIC_QUIET === "1" || env.OPENCODE_ANTHROPIC_QUIET === "true") {
    config.toasts.quiet = true;
  }
  if (env.OPENCODE_ANTHROPIC_QUIET === "0" || env.OPENCODE_ANTHROPIC_QUIET === "false") {
    config.toasts.quiet = false;
  }
  return config;
}
function loadConfig() {
  const configPath = getConfigPath();
  if (!existsSync(configPath)) {
    return applyEnvOverrides(structuredClone(DEFAULT_CONFIG));
  }
  try {
    const content = readFileSync(configPath, "utf-8");
    const raw = JSON.parse(content);
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
      return applyEnvOverrides(structuredClone(DEFAULT_CONFIG));
    }
    const config = validateConfig(raw);
    return applyEnvOverrides(config);
  } catch {
    return applyEnvOverrides(structuredClone(DEFAULT_CONFIG));
  }
}
function loadRawConfig() {
  const configPath = getConfigPath();
  if (!existsSync(configPath)) return {};
  try {
    const content = readFileSync(configPath, "utf-8");
    const raw = JSON.parse(content);
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
    return raw;
  } catch {
    return {};
  }
}
function saveConfig(updates) {
  const configPath = getConfigPath();
  const dir = dirname(configPath);
  mkdirSync(dir, { recursive: true });
  const existing = loadRawConfig();
  const merged = { ...existing, ...updates };
  const tmpPath = configPath + `.tmp.${process.pid}`;
  writeFileSync(tmpPath, JSON.stringify(merged, null, 2) + "\n", { encoding: "utf-8", mode: 384 });
  renameSync(tmpPath, configPath);
}

// lib/storage.mjs
var CURRENT_VERSION = 1;
function createDefaultStats(now) {
  return {
    requests: 0,
    inputTokens: 0,
    outputTokens: 0,
    cacheReadTokens: 0,
    cacheWriteTokens: 0,
    lastReset: now ?? Date.now()
  };
}
function validateStats(raw, now) {
  if (!raw || typeof raw !== "object") return createDefaultStats(now);
  const s = (
    /** @type {Record<string, unknown>} */
    raw
  );
  const safeNum = (v) => typeof v === "number" && Number.isFinite(v) && v >= 0 ? Math.floor(v) : 0;
  return {
    requests: safeNum(s.requests),
    inputTokens: safeNum(s.inputTokens),
    outputTokens: safeNum(s.outputTokens),
    cacheReadTokens: safeNum(s.cacheReadTokens),
    cacheWriteTokens: safeNum(s.cacheWriteTokens),
    lastReset: typeof s.lastReset === "number" && Number.isFinite(s.lastReset) ? s.lastReset : now
  };
}
var GITIGNORE_ENTRIES = [".gitignore", "anthropic-accounts.json", "anthropic-accounts.json.*.tmp"];
function getStoragePath() {
  return join2(getConfigDir(), "anthropic-accounts.json");
}
function ensureGitignore(configDir) {
  const gitignorePath = join2(configDir, ".gitignore");
  try {
    let content = "";
    let existingLines = [];
    if (existsSync2(gitignorePath)) {
      content = readFileSync2(gitignorePath, "utf-8");
      existingLines = content.split("\n").map((line) => line.trim());
    }
    const missingEntries = GITIGNORE_ENTRIES.filter((entry) => !existingLines.includes(entry));
    if (missingEntries.length === 0) return;
    if (content === "") {
      writeFileSync2(gitignorePath, missingEntries.join("\n") + "\n", "utf-8");
    } else {
      const suffix = content.endsWith("\n") ? "" : "\n";
      appendFileSync(gitignorePath, suffix + missingEntries.join("\n") + "\n", "utf-8");
    }
  } catch {
  }
}
function deduplicateByRefreshToken(accounts) {
  const tokenMap = /* @__PURE__ */ new Map();
  for (const acc of accounts) {
    if (!acc.refreshToken) continue;
    const existing = tokenMap.get(acc.refreshToken);
    if (!existing || (acc.lastUsed || 0) > (existing.lastUsed || 0)) {
      tokenMap.set(acc.refreshToken, acc);
    }
  }
  return Array.from(tokenMap.values());
}
function validateAccount(raw, now) {
  if (!raw || typeof raw !== "object") return null;
  const acc = (
    /** @type {Record<string, unknown>} */
    raw
  );
  if (typeof acc.refreshToken !== "string" || !acc.refreshToken) return null;
  const addedAt = typeof acc.addedAt === "number" && Number.isFinite(acc.addedAt) ? acc.addedAt : now;
  const id = typeof acc.id === "string" && acc.id ? acc.id : `${addedAt}:${acc.refreshToken.slice(0, 12)}`;
  return {
    id,
    email: typeof acc.email === "string" ? acc.email : void 0,
    refreshToken: acc.refreshToken,
    access: typeof acc.access === "string" ? acc.access : void 0,
    expires: typeof acc.expires === "number" && Number.isFinite(acc.expires) ? acc.expires : void 0,
    token_updated_at: typeof acc.token_updated_at === "number" && Number.isFinite(acc.token_updated_at) ? acc.token_updated_at : typeof acc.tokenUpdatedAt === "number" && Number.isFinite(acc.tokenUpdatedAt) ? acc.tokenUpdatedAt : addedAt,
    addedAt,
    lastUsed: typeof acc.lastUsed === "number" && Number.isFinite(acc.lastUsed) ? acc.lastUsed : 0,
    enabled: acc.enabled !== false,
    rateLimitResetTimes: acc.rateLimitResetTimes && typeof acc.rateLimitResetTimes === "object" && !Array.isArray(acc.rateLimitResetTimes) ? (
      /** @type {Record<string, number>} */
      acc.rateLimitResetTimes
    ) : {},
    consecutiveFailures: typeof acc.consecutiveFailures === "number" ? Math.max(0, Math.floor(acc.consecutiveFailures)) : 0,
    lastFailureTime: typeof acc.lastFailureTime === "number" ? acc.lastFailureTime : null,
    lastSwitchReason: typeof acc.lastSwitchReason === "string" ? acc.lastSwitchReason : void 0,
    stats: validateStats(acc.stats, now)
  };
}
async function loadAccounts() {
  const storagePath = getStoragePath();
  try {
    const content = await fs.readFile(storagePath, "utf-8");
    const data = JSON.parse(content);
    if (!data || typeof data !== "object" || !Array.isArray(data.accounts)) {
      return null;
    }
    if (data.version !== CURRENT_VERSION) {
      return null;
    }
    const now = Date.now();
    const accounts = data.accounts.map((raw) => validateAccount(raw, now)).filter(
      /** @returns {acc is AccountMetadata} */
      (acc) => acc !== null
    );
    const deduped = deduplicateByRefreshToken(accounts);
    let activeIndex = typeof data.activeIndex === "number" && Number.isFinite(data.activeIndex) ? data.activeIndex : 0;
    if (deduped.length > 0) {
      activeIndex = Math.max(0, Math.min(activeIndex, deduped.length - 1));
    } else {
      activeIndex = 0;
    }
    return {
      version: CURRENT_VERSION,
      accounts: deduped,
      activeIndex
    };
  } catch {
    return null;
  }
}
async function saveAccounts(storage) {
  const storagePath = getStoragePath();
  const configDir = dirname2(storagePath);
  await fs.mkdir(configDir, { recursive: true });
  ensureGitignore(configDir);
  let storageToWrite = storage;
  try {
    const disk = await loadAccounts();
    if (disk && storage.accounts.length > 0) {
      const diskById = new Map(disk.accounts.map((a) => [a.id, a]));
      const diskByAddedAt = /* @__PURE__ */ new Map();
      const diskByToken = new Map(disk.accounts.map((a) => [a.refreshToken, a]));
      for (const d of disk.accounts) {
        const bucket = diskByAddedAt.get(d.addedAt) || [];
        bucket.push(d);
        diskByAddedAt.set(d.addedAt, bucket);
      }
      const findDiskMatch = (acc) => {
        const byId = diskById.get(acc.id);
        if (byId) return byId;
        const byAddedAt = diskByAddedAt.get(acc.addedAt);
        if (byAddedAt?.length === 1) return byAddedAt[0];
        const byToken = diskByToken.get(acc.refreshToken);
        if (byToken) return byToken;
        if (byAddedAt && byAddedAt.length > 0) return byAddedAt[0];
        return null;
      };
      const mergedAccounts = storage.accounts.map((acc) => {
        const diskAcc = findDiskMatch(acc);
        const memTs = typeof acc.token_updated_at === "number" && Number.isFinite(acc.token_updated_at) ? acc.token_updated_at : acc.addedAt;
        const diskTs = diskAcc?.token_updated_at || 0;
        const useDiskAuth = !!diskAcc && diskTs > memTs;
        return {
          ...acc,
          refreshToken: useDiskAuth ? diskAcc.refreshToken : acc.refreshToken,
          access: useDiskAuth ? diskAcc.access : acc.access,
          expires: useDiskAuth ? diskAcc.expires : acc.expires,
          token_updated_at: useDiskAuth ? diskTs : memTs
        };
      });
      let activeIndex = storage.activeIndex;
      if (mergedAccounts.length > 0) {
        activeIndex = Math.max(0, Math.min(activeIndex, mergedAccounts.length - 1));
      } else {
        activeIndex = 0;
      }
      storageToWrite = {
        ...storage,
        accounts: mergedAccounts,
        activeIndex
      };
    }
  } catch {
  }
  const tempPath = `${storagePath}.${randomBytes2(6).toString("hex")}.tmp`;
  const content = JSON.stringify(storageToWrite, null, 2);
  try {
    await fs.writeFile(tempPath, content, { encoding: "utf-8", mode: 384 });
    await fs.rename(tempPath, storagePath);
  } catch (error) {
    try {
      await fs.unlink(tempPath);
    } catch {
    }
    throw error;
  }
}

// node_modules/jose/dist/node/esm/runtime/base64url.js
import { Buffer as Buffer2 } from "node:buffer";

// node_modules/jose/dist/node/esm/lib/buffer_utils.js
var encoder = new TextEncoder();
var decoder = new TextDecoder();
var MAX_INT32 = 2 ** 32;

// node_modules/jose/dist/node/esm/runtime/base64url.js
function normalize(input) {
  let encoded = input;
  if (encoded instanceof Uint8Array) {
    encoded = decoder.decode(encoded);
  }
  return encoded;
}
var encode = (input) => Buffer2.from(input).toString("base64url");
var decode = (input) => new Uint8Array(Buffer2.from(normalize(input), "base64url"));

// node_modules/jose/dist/node/esm/util/base64url.js
var base64url_exports = {};
__export(base64url_exports, {
  decode: () => decode2,
  encode: () => encode2
});
var encode2 = encode;
var decode2 = decode;

// node_modules/@openauthjs/openauth/dist/esm/pkce.js
function generateVerifier(length) {
  const buffer = new Uint8Array(length);
  crypto.getRandomValues(buffer);
  return base64url_exports.encode(buffer);
}
async function generateChallenge(verifier, method) {
  if (method === "plain")
    return verifier;
  const encoder2 = new TextEncoder();
  const data = encoder2.encode(verifier);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return base64url_exports.encode(new Uint8Array(hash));
}
async function generatePKCE(length = 64) {
  if (length < 43 || length > 128) {
    throw new Error("Code verifier length must be between 43 and 128 characters");
  }
  const verifier = generateVerifier(length);
  const challenge = await generateChallenge(verifier, "S256");
  return {
    verifier,
    challenge,
    method: "S256"
  };
}

// lib/oauth.mjs
var CC_USER_AGENT = getHeaderProfile()?.headers?.["user-agent"] ?? "claude-cli/2.1.96 (external, sdk-cli)";
var AUTHORIZE_URLS = {
  console: "https://platform.claude.com/oauth/authorize",
  max: "https://claude.ai/oauth/authorize"
};
var CODE_CALLBACK_URL = "https://platform.claude.com/oauth/code/callback";
var TOKEN_URL = "https://platform.claude.com/v1/oauth/token";
var REVOKE_URL = "https://platform.claude.com/v1/oauth/revoke";
var OAUTH_SCOPES = [
  "org:create_api_key",
  "user:profile",
  "user:inference",
  "user:sessions:claude_code",
  "user:mcp_servers",
  "user:file_upload"
].join(" ");
async function authorize(mode) {
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
    verifier: pkce.verifier
  };
}
function parseCallbackInput(input) {
  const trimmed = input.trim();
  try {
    const url = new URL(trimmed);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    if (code && state) {
      return { code, state };
    }
  } catch {
  }
  const hashSplits = trimmed.split("#");
  if (hashSplits.length === 2 && hashSplits[0] && hashSplits[1]) {
    return { code: hashSplits[0], state: hashSplits[1] };
  }
  try {
    const params = new URLSearchParams(trimmed);
    const code = params.get("code");
    const state = params.get("state");
    if (code && state) {
      return { code, state };
    }
  } catch {
  }
  return null;
}
async function exchange(code, verifier) {
  const callback = parseCallbackInput(code);
  if (!callback) {
    return { type: "failed" };
  }
  const result = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": CC_USER_AGENT
    },
    body: JSON.stringify({
      code: callback.code,
      state: callback.state,
      grant_type: "authorization_code",
      client_id: CLIENT_ID,
      redirect_uri: CODE_CALLBACK_URL,
      code_verifier: verifier
    })
  });
  if (!result.ok)
    return {
      type: "failed"
    };
  const json = await result.json();
  return {
    type: "success",
    refresh: json.refresh_token,
    access: json.access_token,
    expires: Date.now() + json.expires_in * 1e3,
    email: json.account?.email_address || void 0
  };
}
async function revoke(refreshToken2) {
  try {
    const resp = await fetch(REVOKE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "User-Agent": CC_USER_AGENT },
      body: JSON.stringify({
        token: refreshToken2,
        token_type_hint: "refresh_token",
        client_id: CLIENT_ID
      }),
      signal: AbortSignal.timeout(5e3)
    });
    return resp.ok;
  } catch {
    return false;
  }
}
async function refreshToken(refreshTokenValue, options = {}) {
  const resp = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": CC_USER_AGENT },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: CLIENT_ID,
      refresh_token: refreshTokenValue
    }),
    ...options.signal ? { signal: options.signal } : {}
  });
  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    const error = new Error(`Token refresh failed (HTTP ${resp.status}): ${text}`);
    error.status = resp.status;
    try {
      const parsed = JSON.parse(text);
      if (parsed.error) error.code = parsed.error;
    } catch {
    }
    throw error;
  }
  return resp.json();
}

// lib/account-state.mjs
function resetAccountTracking(account) {
  account.rateLimitResetTimes = {};
  account.consecutiveFailures = 0;
  account.lastFailureTime = null;
}
function adjustActiveIndexAfterRemoval(storage, removedIndex) {
  if (storage.accounts.length === 0) {
    storage.activeIndex = 0;
    return;
  }
  if (storage.activeIndex >= storage.accounts.length) {
    storage.activeIndex = storage.accounts.length - 1;
    return;
  }
  if (storage.activeIndex > removedIndex) {
    storage.activeIndex -= 1;
  }
}
function applyOAuthCredentials(account, credentials) {
  account.refreshToken = credentials.refresh;
  account.access = credentials.access;
  account.expires = credentials.expires;
  account.token_updated_at = Date.now();
  if (credentials.email) {
    account.email = credentials.email;
  }
}

// lib/commands.mjs
var COMMAND_DEFINITIONS = [
  { name: "login", aliases: ["ln"] },
  { name: "logout", aliases: ["lo"], destructive: true },
  { name: "reauth", aliases: ["ra"] },
  { name: "refresh", aliases: ["rf"] },
  { name: "list", aliases: ["ls"], slashAliases: ["usage"] },
  { name: "status", aliases: ["st"] },
  { name: "switch", aliases: ["sw"] },
  { name: "enable", aliases: ["en"] },
  { name: "disable", aliases: ["dis"] },
  { name: "remove", aliases: ["rm"], destructive: true },
  { name: "reset" },
  { name: "stats" },
  { name: "reset-stats" },
  { name: "strategy", aliases: ["strat"] },
  { name: "config", aliases: ["cfg"] },
  { name: "manage", aliases: ["mg"], interactiveOnly: true },
  { name: "help", aliases: ["-h", "--help"] }
];
var commandByName = new Map(COMMAND_DEFINITIONS.map((def) => [def.name, def]));
function buildAliasMap(includeSlashAliases) {
  const map = /* @__PURE__ */ new Map();
  for (const def of COMMAND_DEFINITIONS) {
    map.set(def.name, def.name);
    for (const alias of def.aliases || []) {
      map.set(alias, def.name);
    }
    if (includeSlashAliases) {
      for (const alias of def.slashAliases || []) {
        map.set(alias, def.name);
      }
    }
  }
  return map;
}
var CLI_ALIAS_MAP = buildAliasMap(false);
var SLASH_ALIAS_MAP = buildAliasMap(true);
function resolveCliCommandName(token) {
  return CLI_ALIAS_MAP.get(token.toLowerCase()) || null;
}

// lib/util.mjs
function stripAnsi(value) {
  return value.replace(/\x1b\[[0-9;]*m/g, "");
}

// cli.mjs
import { AsyncLocalStorage } from "node:async_hooks";
import { pathToFileURL } from "node:url";
import { execFile } from "node:child_process";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
var USE_COLOR = !process.env.NO_COLOR && process.stdout.isTTY !== false;
var ansi = (code, text) => USE_COLOR ? `\x1B[${code}m${text}\x1B[0m` : text;
var c = {
  bold: (t) => ansi("1", t),
  dim: (t) => ansi("2", t),
  green: (t) => ansi("32", t),
  yellow: (t) => ansi("33", t),
  cyan: (t) => ansi("36", t),
  red: (t) => ansi("31", t),
  gray: (t) => ansi("90", t)
};
function formatDuration(ms) {
  if (ms <= 0) return "now";
  const seconds = Math.floor(ms / 1e3);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainSec = seconds % 60;
  if (minutes < 60) return remainSec > 0 ? `${minutes}m ${remainSec}s` : `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainMin = minutes % 60;
  if (hours < 24) return remainMin > 0 ? `${hours}h ${remainMin}m` : `${hours}h`;
  const days = Math.floor(hours / 24);
  const remainHours = hours % 24;
  return remainHours > 0 ? `${days}d ${remainHours}h` : `${days}d`;
}
function formatTimeAgo(timestamp) {
  if (!timestamp || timestamp === 0) return "never";
  const ms = Date.now() - timestamp;
  if (ms < 0) return "just now";
  return `${formatDuration(ms)} ago`;
}
function shortPath(p) {
  const home = process.env.HOME || process.env.USERPROFILE || "";
  if (home && p.startsWith(home)) return "~" + p.slice(home.length);
  return p;
}
function pad(str, width) {
  const diff = width - stripAnsi(str).length;
  return diff > 0 ? str + " ".repeat(diff) : str;
}
function rpad(str, width) {
  const diff = width - stripAnsi(str).length;
  return diff > 0 ? " ".repeat(diff) + str : str;
}
async function refreshAccessToken(account) {
  try {
    const json = await refreshToken(account.refreshToken, { signal: AbortSignal.timeout(5e3) });
    account.access = json.access_token;
    account.expires = Date.now() + json.expires_in * 1e3;
    if (json.refresh_token) account.refreshToken = json.refresh_token;
    account.token_updated_at = Date.now();
    return json.access_token;
  } catch {
    return null;
  }
}
async function fetchUsage(accessToken) {
  try {
    const resp = await fetch("https://api.anthropic.com/api/oauth/usage", {
      headers: {
        authorization: `Bearer ${accessToken}`,
        "anthropic-beta": "oauth-2025-04-20",
        accept: "application/json"
      },
      signal: AbortSignal.timeout(5e3)
    });
    if (!resp.ok) return null;
    return resp.json();
  } catch {
    return null;
  }
}
async function ensureTokenAndFetchUsage(account) {
  if (!account.enabled) return { usage: null, tokenRefreshed: false };
  let token = account.access;
  let tokenRefreshed = false;
  if (!token || !account.expires || account.expires < Date.now()) {
    token = await refreshAccessToken(account);
    tokenRefreshed = !!token;
    if (!token) return { usage: null, tokenRefreshed: false };
  }
  const usage = await fetchUsage(token);
  return { usage, tokenRefreshed };
}
function renderBar(utilization, width = 10) {
  const pct = Math.max(0, Math.min(100, utilization));
  const filled = Math.round(pct / 100 * width);
  const empty = width - filled;
  let bar;
  if (pct >= 90) {
    bar = c.red("\u2588".repeat(filled)) + c.dim("\u2591".repeat(empty));
  } else if (pct >= 70) {
    bar = c.yellow("\u2588".repeat(filled)) + c.dim("\u2591".repeat(empty));
  } else {
    bar = c.green("\u2588".repeat(filled)) + c.dim("\u2591".repeat(empty));
  }
  return bar;
}
function formatResetTime(isoString) {
  const resetMs = new Date(isoString).getTime();
  const remaining = resetMs - Date.now();
  if (remaining <= 0) return "now";
  return formatDuration(remaining);
}
var QUOTA_BUCKETS = [
  { key: "five_hour", label: "5h" },
  { key: "seven_day", label: "7d" },
  { key: "seven_day_sonnet", label: "Sonnet 7d" },
  { key: "seven_day_opus", label: "Opus 7d" },
  { key: "seven_day_oauth_apps", label: "OAuth Apps 7d" },
  { key: "seven_day_cowork", label: "Cowork 7d" }
];
var USAGE_INDENT = "       ";
var USAGE_LABEL_WIDTH = 13;
function renderUsageLines(usage) {
  const lines = [];
  for (const { key, label } of QUOTA_BUCKETS) {
    const bucket = usage[key];
    if (!bucket || bucket.utilization == null) continue;
    const pct = bucket.utilization;
    const bar = renderBar(pct);
    const pctStr = pad(String(Math.round(pct)) + "%", 4);
    const reset = bucket.resets_at ? c.dim(`resets in ${formatResetTime(bucket.resets_at)}`) : "";
    lines.push(`${USAGE_INDENT}${pad(label, USAGE_LABEL_WIDTH)} ${bar} ${pctStr}${reset ? ` ${reset}` : ""}`);
  }
  return lines;
}
function openBrowser(url) {
  const noop = () => {
  };
  if (process.platform === "win32") {
    execFile("cmd", ["/c", "start", "", url]).on("error", noop);
    return;
  }
  const cmd = process.platform === "darwin" ? "open" : "xdg-open";
  execFile(cmd, [url]).on("error", noop);
}
async function runOAuthFlow() {
  const { url, verifier } = await authorize("max");
  console.log("");
  console.log(c.bold("Opening browser for Anthropic OAuth login..."));
  console.log("");
  console.log(c.dim("If your browser didn't open, visit this URL:"));
  console.log(c.cyan(url));
  console.log("");
  openBrowser(url);
  const rl = createInterface({ input: stdin, output: stdout });
  try {
    const code = await rl.question("Paste the authorization code here: ");
    const trimmed = code.trim();
    if (!trimmed) {
      console.error(c.red("Error: no authorization code provided."));
      return null;
    }
    const credentials = await exchange(trimmed, verifier);
    if (credentials.type === "failed") {
      console.error(c.red("Error: token exchange failed. The code may be invalid or expired."));
      return null;
    }
    return {
      refresh: credentials.refresh,
      access: credentials.access,
      expires: credentials.expires,
      email: credentials.email
    };
  } finally {
    rl.close();
  }
}
async function cmdLogin() {
  if (!process.stdin.isTTY) {
    console.error(c.red("Error: 'login' requires an interactive terminal."));
    return 1;
  }
  const stored = await loadAccounts();
  const credentials = await runOAuthFlow();
  if (!credentials) return 1;
  const storage = stored || { version: 1, accounts: [], activeIndex: 0 };
  const existingIdx = storage.accounts.findIndex((acc) => acc.refreshToken === credentials.refresh);
  if (existingIdx >= 0) {
    applyOAuthCredentials(storage.accounts[existingIdx], credentials);
    storage.accounts[existingIdx].enabled = true;
    await saveAccounts(storage);
    const label2 = credentials.email || `Account ${existingIdx + 1}`;
    console.log(c.green(`Updated existing account #${existingIdx + 1} (${label2}).`));
    return 0;
  }
  if (storage.accounts.length >= 10) {
    console.error(c.red("Error: maximum of 10 accounts reached. Remove one first."));
    return 1;
  }
  const now = Date.now();
  storage.accounts.push({
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
    stats: createDefaultStats(now)
  });
  await saveAccounts(storage);
  const label = credentials.email || `Account ${storage.accounts.length}`;
  console.log(c.green(`Added account #${storage.accounts.length} (${label}).`));
  console.log(c.dim(`${storage.accounts.length} account(s) total.`));
  return 0;
}
function resolveAccountTarget(arg, stored, options) {
  const n = parseInt(arg, 10);
  if (Number.isNaN(n) || n < 1) {
    console.error(c.red(options.invalidArgMessage));
    return null;
  }
  if (!stored || stored.accounts.length === 0) {
    const message = options.noAccountsMessage || "Error: no accounts configured.";
    console.error(c.red(message));
    return null;
  }
  const idx = n - 1;
  if (idx >= stored.accounts.length) {
    console.error(c.red(options.outOfRangeMessage(n, stored.accounts.length)));
    return null;
  }
  return { n, idx };
}
async function cmdLogout(arg, opts = {}) {
  if (opts.all) {
    return cmdLogoutAll(opts);
  }
  const stored = await loadAccounts();
  const target = resolveAccountTarget(arg, stored, {
    invalidArgMessage: "Error: provide a valid account number (e.g., 'logout 2') or --all.",
    outOfRangeMessage: (n2, accountCount) => `Error: account ${n2} does not exist. You have ${accountCount} account(s).`
  });
  if (!target) {
    return 1;
  }
  const { n, idx } = target;
  const label = stored.accounts[idx].email || `Account ${n}`;
  if (!opts.force) {
    if (!process.stdin.isTTY) {
      console.error(c.red("Error: use --force to logout in non-interactive mode."));
      return 1;
    }
    const rl = createInterface({ input: stdin, output: stdout });
    try {
      const answer = await rl.question(
        `Logout account #${n} (${label})? This will revoke tokens and remove the account. [y/N]: `
      );
      if (answer.trim().toLowerCase() !== "y") {
        console.log(c.dim("Cancelled."));
        return 0;
      }
    } finally {
      rl.close();
    }
  }
  const revoked = await revoke(stored.accounts[idx].refreshToken);
  if (revoked) {
    console.log(c.dim("Token revoked server-side."));
  } else {
    console.log(c.dim("Token revocation skipped (server may not support it)."));
  }
  stored.accounts.splice(idx, 1);
  adjustActiveIndexAfterRemoval(stored, idx);
  await saveAccounts(stored);
  console.log(c.green(`Logged out account #${n} (${label}).`));
  if (stored.accounts.length > 0) {
    console.log(c.dim(`${stored.accounts.length} account(s) remaining.`));
  } else {
    console.log(c.dim("No accounts remaining. Run 'login' to add one."));
  }
  return 0;
}
async function cmdLogoutAll(opts = {}) {
  const stored = await loadAccounts();
  if (!stored || stored.accounts.length === 0) {
    console.log(c.dim("No accounts to logout."));
    return 0;
  }
  const count = stored.accounts.length;
  if (!opts.force) {
    if (!process.stdin.isTTY) {
      console.error(c.red("Error: use --force to logout all in non-interactive mode."));
      return 1;
    }
    const rl = createInterface({ input: stdin, output: stdout });
    try {
      const answer = await rl.question(
        `Logout all ${count} account(s)? This will revoke tokens and remove all accounts. [y/N]: `
      );
      if (answer.trim().toLowerCase() !== "y") {
        console.log(c.dim("Cancelled."));
        return 0;
      }
    } finally {
      rl.close();
    }
  }
  const results = await Promise.allSettled(stored.accounts.map((acc) => revoke(acc.refreshToken)));
  const revokedCount = results.filter((r) => r.status === "fulfilled" && r.value === true).length;
  if (revokedCount > 0) {
    console.log(c.dim(`Revoked ${revokedCount} of ${count} token(s) server-side.`));
  }
  await saveAccounts({ version: 1, accounts: [], activeIndex: 0 });
  console.log(c.green(`Logged out all ${count} account(s).`));
  return 0;
}
async function cmdReauth(arg) {
  if (!process.stdin.isTTY) {
    console.error(c.red("Error: 'reauth' requires an interactive terminal."));
    return 1;
  }
  const stored = await loadAccounts();
  const target = resolveAccountTarget(arg, stored, {
    invalidArgMessage: "Error: provide a valid account number (e.g., 'reauth 1')",
    outOfRangeMessage: (n2, accountCount) => `Error: account ${n2} does not exist. You have ${accountCount} account(s).`
  });
  if (!target) {
    return 1;
  }
  const { n, idx } = target;
  const existing = stored.accounts[idx];
  const wasDisabled = !existing.enabled;
  const oldLabel = existing.email || `Account ${n}`;
  console.log(c.bold(`Re-authenticating account #${n} (${oldLabel})...`));
  const credentials = await runOAuthFlow();
  if (!credentials) return 1;
  applyOAuthCredentials(existing, credentials);
  existing.enabled = true;
  resetAccountTracking(existing);
  await saveAccounts(stored);
  const newLabel = credentials.email || `Account ${n}`;
  console.log(c.green(`Re-authenticated account #${n} (${newLabel}).`));
  if (wasDisabled) {
    console.log(c.dim("Account has been re-enabled."));
  }
  return 0;
}
async function cmdRefresh(arg) {
  const stored = await loadAccounts();
  const target = resolveAccountTarget(arg, stored, {
    invalidArgMessage: "Error: provide a valid account number (e.g., 'refresh 1')",
    outOfRangeMessage: (n2, accountCount) => `Error: account ${n2} does not exist. You have ${accountCount} account(s).`
  });
  if (!target) {
    return 1;
  }
  const { n, idx } = target;
  const account = stored.accounts[idx];
  const label = account.email || `Account ${n}`;
  console.log(c.dim(`Refreshing token for account #${n} (${label})...`));
  const token = await refreshAccessToken(account);
  if (!token) {
    console.error(c.red(`Error: token refresh failed for account #${n}.`));
    console.error(c.dim("The refresh token may be invalid or expired."));
    console.error(c.dim(`Try: opencode-anthropic-auth reauth ${n}`));
    return 1;
  }
  const wasDisabled = !account.enabled;
  account.enabled = true;
  resetAccountTracking(account);
  await saveAccounts(stored);
  const expiresIn = account.expires ? formatDuration(account.expires - Date.now()) : "unknown";
  console.log(c.green(`Token refreshed for account #${n} (${label}).`));
  console.log(c.dim(`New token expires in ${expiresIn}.`));
  if (wasDisabled) {
    console.log(c.dim("Account has been re-enabled."));
  }
  return 0;
}
async function cmdList() {
  const stored = await loadAccounts();
  if (!stored || stored.accounts.length === 0) {
    console.log(c.yellow("No accounts configured."));
    console.log(c.dim(`Storage: ${shortPath(getStoragePath())}`));
    console.log(c.dim("\nRun 'opencode-anthropic-auth login' and select 'Claude Pro/Max' to add accounts."));
    return 1;
  }
  const config = loadConfig();
  const now = Date.now();
  const usageResults = await Promise.allSettled(stored.accounts.map((acc) => ensureTokenAndFetchUsage(acc)));
  let anyRefreshed = false;
  for (const result of usageResults) {
    if (result.status === "fulfilled" && result.value.tokenRefreshed) {
      anyRefreshed = true;
    }
  }
  if (anyRefreshed) {
    await saveAccounts(stored).catch(() => {
    });
  }
  console.log(c.bold("Anthropic Multi-Account Status"));
  console.log(
    "  " + pad(c.dim("#"), 5) + pad(c.dim("Account"), 22) + pad(c.dim("Status"), 14) + pad(c.dim("Failures"), 11) + c.dim("Rate Limit")
  );
  console.log(c.dim("  " + "\u2500".repeat(62)));
  for (let i = 0; i < stored.accounts.length; i++) {
    const acc = stored.accounts[i];
    const isActive = i === stored.activeIndex;
    const num = String(i + 1);
    const label = acc.email || `Account ${i + 1}`;
    let status;
    if (!acc.enabled) {
      status = c.gray("\u25CB disabled");
    } else if (isActive) {
      status = c.green("\u25CF active");
    } else {
      status = c.cyan("\u25CF ready");
    }
    let failures;
    if (!acc.enabled) {
      failures = c.dim("\u2014");
    } else if (acc.consecutiveFailures > 0) {
      failures = c.yellow(String(acc.consecutiveFailures));
    } else {
      failures = c.dim("0");
    }
    let rateLimit;
    if (!acc.enabled) {
      rateLimit = c.dim("\u2014");
    } else {
      const resetTimes = acc.rateLimitResetTimes || {};
      const maxReset = Math.max(0, ...Object.values(resetTimes));
      if (maxReset > now) {
        rateLimit = c.yellow(`\u26A0 ${formatDuration(maxReset - now)}`);
      } else {
        rateLimit = c.dim("\u2014");
      }
    }
    console.log("  " + pad(c.bold(num), 5) + pad(label, 22) + pad(status, 14) + pad(failures, 11) + rateLimit);
    if (acc.enabled) {
      const result = usageResults[i];
      const usage = result.status === "fulfilled" ? result.value.usage : null;
      if (usage) {
        const lines = renderUsageLines(usage);
        for (const line of lines) {
          console.log(line);
        }
      } else {
        console.log(c.dim(`${USAGE_INDENT}quotas: unavailable`));
      }
    }
    if (i < stored.accounts.length - 1) {
      console.log("");
    }
  }
  console.log("");
  const enabled = stored.accounts.filter((a) => a.enabled).length;
  const disabled = stored.accounts.length - enabled;
  const parts = [
    `Strategy: ${c.cyan(config.account_selection_strategy)}`,
    `${c.bold(String(enabled))} of ${stored.accounts.length} enabled`
  ];
  if (disabled > 0) {
    parts.push(`${c.yellow(String(disabled))} disabled`);
  }
  console.log(parts.join(c.dim(" | ")));
  console.log(c.dim(`Storage: ${shortPath(getStoragePath())}`));
  return 0;
}
async function cmdStatus() {
  const stored = await loadAccounts();
  if (!stored || stored.accounts.length === 0) {
    console.log("anthropic: no accounts configured");
    return 1;
  }
  const config = loadConfig();
  const total = stored.accounts.length;
  const enabled = stored.accounts.filter((a) => a.enabled).length;
  const now = Date.now();
  let rateLimited = 0;
  for (const acc of stored.accounts) {
    if (!acc.enabled) continue;
    const resetTimes = acc.rateLimitResetTimes || {};
    const maxReset = Math.max(0, ...Object.values(resetTimes));
    if (maxReset > now) rateLimited++;
  }
  let line = `anthropic: ${total} account${total !== 1 ? "s" : ""} (${enabled} active)`;
  line += `, strategy: ${config.account_selection_strategy}`;
  line += `, next: #${stored.activeIndex + 1}`;
  if (rateLimited > 0) {
    line += `, ${rateLimited} rate-limited`;
  }
  console.log(line);
  return 0;
}
async function cmdSwitch(arg) {
  const stored = await loadAccounts();
  const target = resolveAccountTarget(arg, stored, {
    invalidArgMessage: "Error: provide a valid account number (e.g., 'switch 2')",
    outOfRangeMessage: (n2, accountCount) => `Error: account ${n2} does not exist. You have ${accountCount} account(s).`
  });
  if (!target) {
    return 1;
  }
  const { n, idx } = target;
  if (!stored.accounts[idx].enabled) {
    console.error(c.yellow(`Warning: account ${n} is disabled. Enable it first with 'enable ${n}'.`));
    return 1;
  }
  stored.activeIndex = idx;
  await saveAccounts(stored);
  const label = stored.accounts[idx].email || `Account ${n}`;
  console.log(c.green(`Switched active account to #${n} (${label}).`));
  return 0;
}
async function cmdEnable(arg) {
  const stored = await loadAccounts();
  const target = resolveAccountTarget(arg, stored, {
    invalidArgMessage: "Error: provide a valid account number (e.g., 'enable 3')",
    outOfRangeMessage: (n2) => `Error: account ${n2} does not exist.`
  });
  if (!target) {
    return 1;
  }
  const { n, idx } = target;
  if (stored.accounts[idx].enabled) {
    console.log(c.dim(`Account ${n} is already enabled.`));
    return 0;
  }
  stored.accounts[idx].enabled = true;
  await saveAccounts(stored);
  const label = stored.accounts[idx].email || `Account ${n}`;
  console.log(c.green(`Enabled account #${n} (${label}).`));
  return 0;
}
async function cmdDisable(arg) {
  const stored = await loadAccounts();
  const target = resolveAccountTarget(arg, stored, {
    invalidArgMessage: "Error: provide a valid account number (e.g., 'disable 3')",
    outOfRangeMessage: (n2) => `Error: account ${n2} does not exist.`
  });
  if (!target) {
    return 1;
  }
  const { n, idx } = target;
  if (!stored.accounts[idx].enabled) {
    console.log(c.dim(`Account ${n} is already disabled.`));
    return 0;
  }
  const enabledCount = stored.accounts.filter((a) => a.enabled).length;
  if (enabledCount <= 1) {
    console.error(c.red("Error: cannot disable the last enabled account."));
    return 1;
  }
  stored.accounts[idx].enabled = false;
  const label = stored.accounts[idx].email || `Account ${n}`;
  let switchedTo = null;
  if (idx === stored.activeIndex) {
    const nextEnabled = stored.accounts.findIndex((a) => a.enabled);
    if (nextEnabled >= 0) {
      stored.activeIndex = nextEnabled;
      switchedTo = nextEnabled;
    }
  }
  await saveAccounts(stored);
  console.log(c.yellow(`Disabled account #${n} (${label}).`));
  if (switchedTo !== null) {
    const nextLabel = stored.accounts[switchedTo].email || `Account ${switchedTo + 1}`;
    console.log(c.dim(`Active account switched to #${switchedTo + 1} (${nextLabel}).`));
  }
  return 0;
}
async function cmdRemove(arg, opts = {}) {
  const stored = await loadAccounts();
  const target = resolveAccountTarget(arg, stored, {
    invalidArgMessage: "Error: provide a valid account number (e.g., 'remove 2')",
    outOfRangeMessage: (n2) => `Error: account ${n2} does not exist.`
  });
  if (!target) {
    return 1;
  }
  const { n, idx } = target;
  const label = stored.accounts[idx].email || `Account ${n}`;
  if (!opts.force) {
    if (!process.stdin.isTTY) {
      console.error(c.red("Error: use --force to remove accounts in non-interactive mode."));
      return 1;
    }
    const rl = createInterface({ input: stdin, output: stdout });
    try {
      const answer = await rl.question(`Remove account #${n} (${label})? This cannot be undone. [y/N]: `);
      if (answer.trim().toLowerCase() !== "y") {
        console.log(c.dim("Cancelled."));
        return 0;
      }
    } finally {
      rl.close();
    }
  }
  stored.accounts.splice(idx, 1);
  adjustActiveIndexAfterRemoval(stored, idx);
  await saveAccounts(stored);
  console.log(c.green(`Removed account #${n} (${label}).`));
  if (stored.accounts.length > 0) {
    console.log(c.dim(`${stored.accounts.length} account(s) remaining.`));
  } else {
    console.log(c.dim("No accounts remaining. Run 'opencode-anthropic-auth login' to add one."));
  }
  return 0;
}
async function cmdReset(arg) {
  if (!arg) {
    console.error(c.red("Error: provide an account number or 'all' (e.g., 'reset 1' or 'reset all')"));
    return 1;
  }
  const stored = await loadAccounts();
  if (!stored || stored.accounts.length === 0) {
    console.error(c.red("Error: no accounts configured."));
    return 1;
  }
  if (arg.toLowerCase() === "all") {
    let count = 0;
    for (const acc of stored.accounts) {
      resetAccountTracking(acc);
      count++;
    }
    await saveAccounts(stored);
    console.log(c.green(`Reset tracking for all ${count} account(s).`));
    return 0;
  }
  const target = resolveAccountTarget(arg, stored, {
    invalidArgMessage: "Error: provide a valid account number or 'all'.",
    outOfRangeMessage: (n2) => `Error: account ${n2} does not exist.`
  });
  if (!target) {
    return 1;
  }
  const { n, idx } = target;
  resetAccountTracking(stored.accounts[idx]);
  await saveAccounts(stored);
  const label = stored.accounts[idx].email || `Account ${n}`;
  console.log(c.green(`Reset tracking for account #${n} (${label}).`));
  return 0;
}
var SETTABLE_KEYS = {
  "billing-header": { path: ["headers", "billing_header"], type: "boolean" },
  debug: { path: ["debug"], type: "boolean" },
  quiet: { path: ["toasts", "quiet"], type: "boolean" },
  strategy: { path: ["account_selection_strategy"], type: "string", validate: (v) => VALID_STRATEGIES.includes(v) }
};
function parseValue(raw, type) {
  if (type === "boolean") {
    const lower = raw.toLowerCase();
    if (lower === "true" || lower === "on" || lower === "1") return { ok: true, value: true };
    if (lower === "false" || lower === "off" || lower === "0") return { ok: true, value: false };
    return { ok: false, reason: `expected true/false/on/off, got '${raw}'` };
  }
  if (type === "number") {
    const n = Number(raw);
    if (!Number.isFinite(n)) return { ok: false, reason: `expected a number, got '${raw}'` };
    return { ok: true, value: n };
  }
  return { ok: true, value: raw };
}
function getByPath(obj, path) {
  let current = obj;
  for (const key of path) {
    if (current == null || typeof current !== "object") return void 0;
    current = /** @type {Record<string, unknown>} */
    current[key];
  }
  return current;
}
function cmdConfigSet(keyArg, valueArg) {
  if (!keyArg) {
    console.error(c.red("Usage: config set <key> <value>"));
    console.error("");
    console.error(c.dim("Settable keys:"));
    for (const [name, meta2] of Object.entries(SETTABLE_KEYS)) {
      console.error(c.dim("  ") + c.cyan(name) + c.dim(` (${meta2.type})`));
    }
    return 1;
  }
  let key = keyArg;
  let rawValue = valueArg;
  if (key.includes("=") && rawValue === void 0) {
    const idx = key.indexOf("=");
    rawValue = key.slice(idx + 1);
    key = key.slice(0, idx);
  }
  const meta = SETTABLE_KEYS[key];
  if (!meta) {
    console.error(c.red(`Unknown config key: '${key}'`));
    console.error(c.dim("Settable keys: " + Object.keys(SETTABLE_KEYS).join(", ")));
    return 1;
  }
  if (rawValue === void 0 || rawValue === "") {
    const config = loadConfig();
    const current = getByPath(
      /** @type {Record<string, unknown>} */
      config,
      meta.path
    );
    console.log(`${key} = ${JSON.stringify(current)}`);
    return 0;
  }
  const parsed = parseValue(rawValue, meta.type);
  if (!parsed.ok) {
    console.error(c.red(`Invalid value for '${key}': ${parsed.reason}`));
    return 1;
  }
  if (meta.validate && !meta.validate(String(parsed.value))) {
    console.error(c.red(`Invalid value for '${key}': '${rawValue}'`));
    if (key === "strategy") {
      console.error(c.dim(`Valid values: ${VALID_STRATEGIES.join(", ")}`));
    }
    return 1;
  }
  const raw = loadRawConfig();
  const oldConfig = loadConfig();
  const oldValue = getByPath(
    /** @type {Record<string, unknown>} */
    oldConfig,
    meta.path
  );
  let update;
  if (meta.path.length === 1) {
    update = { [meta.path[0]]: parsed.value };
  } else {
    const topKey = meta.path[0];
    const existing = raw[topKey] && typeof raw[topKey] === "object" ? { .../** @type {Record<string, unknown>} */
    raw[topKey] } : {};
    existing[meta.path[1]] = parsed.value;
    update = { [topKey]: existing };
  }
  saveConfig(update);
  const display = (v) => typeof v === "boolean" ? v ? "on" : "off" : JSON.stringify(v);
  console.log(c.green(`${key}: ${display(oldValue)} \u2192 ${display(parsed.value)}`));
  return 0;
}
async function cmdConfig(...args) {
  const subcommand = args[0];
  if (subcommand === "set") {
    return cmdConfigSet(args[1], args[2]);
  }
  if (subcommand) {
    console.error(c.red(`Unknown config subcommand: '${subcommand}'`));
    console.error(c.dim("Usage: config [set <key> <value>]"));
    return 1;
  }
  const config = loadConfig();
  const stored = await loadAccounts();
  console.log(c.bold("Anthropic Auth Configuration"));
  console.log(c.dim("\u2500".repeat(45)));
  console.log("");
  console.log(c.dim("Strategy:          ") + c.cyan(config.account_selection_strategy));
  console.log(c.dim("Failure TTL:       ") + `${config.failure_ttl_seconds}s`);
  console.log(c.dim("Debug:             ") + (config.debug ? c.yellow("on") : c.dim("off")));
  console.log("");
  console.log(c.dim("Health Score"));
  console.log(c.dim("  Initial:         ") + `${config.health_score.initial}`);
  console.log(c.dim("  Success reward:  ") + `+${config.health_score.success_reward}`);
  console.log(c.dim("  Rate limit:      ") + `${config.health_score.rate_limit_penalty}`);
  console.log(c.dim("  Failure:         ") + `${config.health_score.failure_penalty}`);
  console.log(c.dim("  Recovery/hour:   ") + `+${config.health_score.recovery_rate_per_hour}`);
  console.log(c.dim("  Min usable:      ") + `${config.health_score.min_usable}`);
  console.log("");
  console.log(c.dim("Token Bucket"));
  console.log(c.dim("  Max tokens:      ") + `${config.token_bucket.max_tokens}`);
  console.log(c.dim("  Regen/min:       ") + `${config.token_bucket.regeneration_rate_per_minute}`);
  console.log(c.dim("  Initial:         ") + `${config.token_bucket.initial_tokens}`);
  console.log("");
  console.log(c.dim("Headers"));
  console.log(c.dim("  Profile:         ") + c.cyan(config.headers.emulation_profile));
  console.log(c.dim("  Billing header:  ") + (config.headers.billing_header ? c.yellow("on") : c.dim("off")));
  if (config.headers.disable.length > 0) {
    console.log(c.dim("  Disabled:        ") + config.headers.disable.join(", "));
  }
  if (Object.keys(config.headers.overrides).length > 0) {
    console.log(c.dim("  Overrides:       ") + `${Object.keys(config.headers.overrides).length} key(s)`);
  }
  console.log("");
  console.log(c.dim("Files"));
  console.log(c.dim("  Config:          ") + shortPath(getConfigPath()));
  console.log(c.dim("  Accounts:        ") + shortPath(getStoragePath()));
  if (stored) {
    const enabled = stored.accounts.filter((a) => a.enabled).length;
    console.log(c.dim("  Accounts total:  ") + `${stored.accounts.length} (${enabled} enabled)`);
  } else {
    console.log(c.dim("  Accounts total:  ") + c.dim("none"));
  }
  console.log("");
  const envOverrides = [];
  if (process.env.OPENCODE_ANTHROPIC_STRATEGY) {
    envOverrides.push(`OPENCODE_ANTHROPIC_STRATEGY=${process.env.OPENCODE_ANTHROPIC_STRATEGY}`);
  }
  if (process.env.OPENCODE_ANTHROPIC_DEBUG) {
    envOverrides.push(`OPENCODE_ANTHROPIC_DEBUG=${process.env.OPENCODE_ANTHROPIC_DEBUG}`);
  }
  if (envOverrides.length > 0) {
    console.log(c.dim("Environment overrides:"));
    for (const ov of envOverrides) {
      console.log(c.dim("  ") + c.yellow(ov));
    }
  }
  return 0;
}
async function cmdStrategy(arg) {
  const config = loadConfig();
  if (!arg) {
    console.log(c.bold("Account Selection Strategy"));
    console.log(c.dim("\u2500".repeat(45)));
    console.log("");
    const descriptions = {
      sticky: "Stay on one account until it fails or is rate-limited",
      "round-robin": "Rotate through accounts on every request",
      hybrid: "Prefer healthy accounts, rotate when degraded"
    };
    for (const s of VALID_STRATEGIES) {
      const current = s === config.account_selection_strategy;
      const marker = current ? c.green("\u25B8 ") : "  ";
      const name = current ? c.bold(c.cyan(s)) : c.dim(s);
      const desc = current ? descriptions[s] : c.dim(descriptions[s]);
      console.log(`${marker}${pad(name, 16)}${desc}`);
    }
    console.log("");
    console.log(c.dim(`Change with: opencode-anthropic-auth strategy <${VALID_STRATEGIES.join("|")}>`));
    if (process.env.OPENCODE_ANTHROPIC_STRATEGY) {
      console.log(
        c.yellow(
          `
Note: OPENCODE_ANTHROPIC_STRATEGY=${process.env.OPENCODE_ANTHROPIC_STRATEGY} overrides config file at runtime.`
        )
      );
    }
    return 0;
  }
  const normalized = arg.toLowerCase().trim();
  if (!VALID_STRATEGIES.includes(normalized)) {
    console.error(c.red(`Error: invalid strategy '${arg}'.`));
    console.error(c.dim(`Valid strategies: ${VALID_STRATEGIES.join(", ")}`));
    return 1;
  }
  if (normalized === config.account_selection_strategy && !process.env.OPENCODE_ANTHROPIC_STRATEGY) {
    console.log(c.dim(`Strategy is already '${normalized}'.`));
    return 0;
  }
  saveConfig({ account_selection_strategy: normalized });
  console.log(c.green(`Strategy changed to '${normalized}'.`));
  if (process.env.OPENCODE_ANTHROPIC_STRATEGY) {
    console.log(
      c.yellow(
        `Note: OPENCODE_ANTHROPIC_STRATEGY=${process.env.OPENCODE_ANTHROPIC_STRATEGY} will override this at runtime.`
      )
    );
  }
  return 0;
}
function fmtTokens(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return String(n);
}
async function cmdStats() {
  const stored = await loadAccounts();
  if (!stored || stored.accounts.length === 0) {
    console.log(c.yellow("No accounts configured."));
    return 1;
  }
  const W = { num: 4, name: 22, val: 10 };
  const RULE = c.dim("  " + "\u2500".repeat(74));
  console.log(c.bold("Anthropic Account Usage"));
  console.log(
    "  " + pad(c.dim("#"), W.num) + pad(c.dim("Account"), W.name) + rpad(c.dim("Requests"), W.val) + rpad(c.dim("Input"), W.val) + rpad(c.dim("Output"), W.val) + rpad(c.dim("Cache R"), W.val) + rpad(c.dim("Cache W"), W.val)
  );
  console.log(RULE);
  let totReq = 0, totIn = 0, totOut = 0, totCR = 0, totCW = 0;
  let oldestReset = Infinity;
  for (let i = 0; i < stored.accounts.length; i++) {
    const acc = stored.accounts[i];
    const s = acc.stats || createDefaultStats();
    const isActive = i === stored.activeIndex;
    const marker = isActive ? c.green("\u25CF") : " ";
    const num = `${marker} ${i + 1}`;
    const name = acc.email || `Account ${i + 1}`;
    console.log(
      "  " + pad(num, W.num) + pad(name, W.name) + rpad(String(s.requests), W.val) + rpad(fmtTokens(s.inputTokens), W.val) + rpad(fmtTokens(s.outputTokens), W.val) + rpad(fmtTokens(s.cacheReadTokens), W.val) + rpad(fmtTokens(s.cacheWriteTokens), W.val)
    );
    totReq += s.requests;
    totIn += s.inputTokens;
    totOut += s.outputTokens;
    totCR += s.cacheReadTokens;
    totCW += s.cacheWriteTokens;
    if (s.lastReset < oldestReset) oldestReset = s.lastReset;
  }
  if (stored.accounts.length > 1) {
    console.log(RULE);
    console.log(
      c.bold(
        "  " + pad("", W.num) + pad("Total", W.name) + rpad(String(totReq), W.val) + rpad(fmtTokens(totIn), W.val) + rpad(fmtTokens(totOut), W.val) + rpad(fmtTokens(totCR), W.val) + rpad(fmtTokens(totCW), W.val)
      )
    );
  }
  console.log("");
  if (oldestReset < Infinity) {
    console.log(c.dim(`Tracking since: ${new Date(oldestReset).toLocaleString()} (${formatTimeAgo(oldestReset)})`));
  }
  return 0;
}
async function cmdResetStats(arg) {
  const stored = await loadAccounts();
  if (!stored || stored.accounts.length === 0) {
    console.log(c.yellow("No accounts configured."));
    return 1;
  }
  const now = Date.now();
  if (!arg || arg === "all") {
    for (const acc of stored.accounts) {
      acc.stats = createDefaultStats(now);
    }
    await saveAccounts(stored);
    console.log(c.green("Reset usage statistics for all accounts."));
    return 0;
  }
  const idx = parseInt(arg, 10) - 1;
  if (Number.isNaN(idx) || idx < 0 || idx >= stored.accounts.length) {
    console.error(c.red(`Invalid account number. Use 1-${stored.accounts.length} or 'all'.`));
    return 1;
  }
  stored.accounts[idx].stats = createDefaultStats(now);
  await saveAccounts(stored);
  const name = stored.accounts[idx].email || `Account ${idx + 1}`;
  console.log(c.green(`Reset usage statistics for ${name}.`));
  return 0;
}
async function cmdManage() {
  let stored = await loadAccounts();
  if (!stored || stored.accounts.length === 0) {
    console.log(c.yellow("No accounts configured."));
    console.log(c.dim("Run 'opencode-anthropic-auth login' and select 'Claude Pro/Max' to add accounts."));
    return 1;
  }
  if (!process.stdin.isTTY) {
    console.error(c.red("Error: 'manage' requires an interactive terminal."));
    console.error(c.dim("Use 'enable', 'disable', 'remove', 'switch' for non-interactive use."));
    return 1;
  }
  const rl = createInterface({ input: stdin, output: stdout });
  try {
    while (true) {
      stored = await loadAccounts();
      if (!stored || stored.accounts.length === 0) {
        console.log(c.dim("No accounts remaining."));
        break;
      }
      const accounts = stored.accounts;
      console.log("");
      console.log(c.bold(`${accounts.length} account(s):`));
      for (let i = 0; i < accounts.length; i++) {
        const num2 = i + 1;
        const label = accounts[i].email || `Account ${num2}`;
        const active = i === stored.activeIndex ? c.green(" (active)") : "";
        const disabled = !accounts[i].enabled ? c.yellow(" [disabled]") : "";
        console.log(`  ${c.bold(String(num2))}. ${label}${active}${disabled}`);
      }
      console.log("");
      const currentStrategy = loadConfig().account_selection_strategy;
      console.log(c.dim(`Strategy: ${currentStrategy}`));
      console.log(c.dim("Commands: (s)witch N, (e)nable N, (d)isable N, (r)emove N, (R)eset N, s(t)rategy, (q)uit"));
      const answer = await rl.question(c.dim("> "));
      const trimmed = answer.trim();
      if (trimmed.toLowerCase() === "q" || trimmed.toLowerCase() === "quit") break;
      const match = trimmed.match(/^([a-zA-Z]+)\s*(\d+)?$/);
      if (!match) {
        console.log(c.red("Invalid input. Try 's 2', 'e 3', 'd 1', 'r 2', 'R 1', or 'q'."));
        continue;
      }
      const [, rawCmd, numStr] = match;
      const cmd = rawCmd.toLowerCase();
      const num = numStr ? parseInt(numStr, 10) : NaN;
      const idx = num - 1;
      if (numStr && (Number.isNaN(num) || num < 1 || idx >= accounts.length)) {
        console.log(c.red(`Invalid account number. Valid range: 1-${accounts.length}.`));
        continue;
      }
      const isReset = rawCmd === "R" || cmd === "reset";
      if (isReset) {
        if (Number.isNaN(num)) {
          console.log(c.red("Usage: R <number>"));
          continue;
        }
        resetAccountTracking(stored.accounts[idx]);
        await saveAccounts(stored);
        console.log(c.green(`Reset tracking for account #${num}.`));
        continue;
      }
      switch (cmd) {
        case "s":
        case "switch": {
          if (Number.isNaN(num)) {
            console.log(c.red("Usage: s <number>"));
            break;
          }
          if (!accounts[idx].enabled) {
            console.log(c.yellow(`Account ${num} is disabled. Enable it first.`));
            break;
          }
          stored.activeIndex = idx;
          await saveAccounts(stored);
          const switchLabel = accounts[idx].email || `Account ${num}`;
          console.log(c.green(`Switched to #${num} (${switchLabel}).`));
          break;
        }
        case "e":
        case "enable": {
          if (Number.isNaN(num)) {
            console.log(c.red("Usage: e <number>"));
            break;
          }
          if (accounts[idx].enabled) {
            console.log(c.dim(`Account ${num} is already enabled.`));
            break;
          }
          stored.accounts[idx].enabled = true;
          await saveAccounts(stored);
          console.log(c.green(`Enabled account #${num}.`));
          break;
        }
        case "d":
        case "disable": {
          if (Number.isNaN(num)) {
            console.log(c.red("Usage: d <number>"));
            break;
          }
          if (!accounts[idx].enabled) {
            console.log(c.dim(`Account ${num} is already disabled.`));
            break;
          }
          const enabledCount = accounts.filter((a) => a.enabled).length;
          if (enabledCount <= 1) {
            console.log(c.red("Cannot disable the last enabled account."));
            break;
          }
          stored.accounts[idx].enabled = false;
          if (idx === stored.activeIndex) {
            const nextEnabled = accounts.findIndex((a) => a.enabled && accounts.indexOf(a) !== idx);
            if (nextEnabled >= 0) stored.activeIndex = nextEnabled;
          }
          await saveAccounts(stored);
          console.log(c.yellow(`Disabled account #${num}.`));
          break;
        }
        case "r":
        case "remove": {
          if (Number.isNaN(num)) {
            console.log(c.red("Usage: r <number>"));
            break;
          }
          const removeLabel = accounts[idx].email || `Account ${num}`;
          const confirm = await rl.question(`Remove #${num} (${removeLabel})? [y/N]: `);
          if (confirm.trim().toLowerCase() === "y") {
            stored.accounts.splice(idx, 1);
            adjustActiveIndexAfterRemoval(stored, idx);
            await saveAccounts(stored);
            console.log(c.green(`Removed account #${num}.`));
          } else {
            console.log(c.dim("Cancelled."));
          }
          break;
        }
        case "t":
        case "strategy": {
          console.log(c.dim(`Current: ${loadConfig().account_selection_strategy}`));
          console.log(c.dim(`Options: ${VALID_STRATEGIES.join(", ")}`));
          const stratAnswer = await rl.question(c.dim("New strategy: "));
          const strat = stratAnswer.trim().toLowerCase();
          if (!strat) {
            console.log(c.dim("Cancelled."));
            break;
          }
          if (!VALID_STRATEGIES.includes(strat)) {
            console.log(c.red(`Invalid strategy. Choose: ${VALID_STRATEGIES.join(", ")}`));
            break;
          }
          saveConfig({ account_selection_strategy: strat });
          console.log(c.green(`Strategy changed to '${strat}'.`));
          break;
        }
        default:
          console.log(c.red("Unknown command. Try 's', 'e', 'd', 'r', 'R', 't', or 'q'."));
      }
    }
  } finally {
    rl.close();
  }
  return 0;
}
function cmdHelp() {
  const bin = "opencode-anthropic-auth";
  console.log(`
${c.bold("Anthropic Multi-Account Auth CLI")}

${c.dim("Usage:")}
  ${bin} [command] [args]

${c.dim("Auth Commands:")}
  ${pad(c.cyan("login"), 22)}Add a new account via browser OAuth flow
  ${pad(c.cyan("logout") + " <N>", 22)}Revoke tokens and remove account N
  ${pad(c.cyan("logout") + " --all", 22)}Revoke all tokens and clear all accounts
  ${pad(c.cyan("reauth") + " <N>", 22)}Re-authenticate account N with fresh tokens
  ${pad(c.cyan("refresh") + " <N>", 22)}Attempt token refresh (no browser needed)

${c.dim("Account Commands:")}
  ${pad(c.cyan("list"), 22)}Show all accounts with status ${c.dim("(default)")}
  ${pad(c.cyan("status"), 22)}Compact one-liner for scripts/prompts
  ${pad(c.cyan("switch") + " <N>", 22)}Set account N as active
  ${pad(c.cyan("enable") + " <N>", 22)}Enable a disabled account
  ${pad(c.cyan("disable") + " <N>", 22)}Disable an account (skipped in rotation)
  ${pad(c.cyan("remove") + " <N>", 22)}Remove an account permanently
  ${pad(c.cyan("reset") + " <N|all>", 22)}Clear rate-limit / failure tracking
  ${pad(c.cyan("stats"), 22)}Show per-account usage statistics
  ${pad(c.cyan("reset-stats") + " [N|all]", 22)}Reset usage statistics
  ${pad(c.cyan("strategy") + " [name]", 22)}Show or change selection strategy
  ${pad(c.cyan("config"), 22)}Show configuration and file paths
  ${pad(c.cyan("config set") + " <k> <v>", 22)}Set a config value (keys: ${Object.keys(SETTABLE_KEYS).join(", ")})
  ${pad(c.cyan("manage"), 22)}Interactive account management menu
  ${pad(c.cyan("help"), 22)}Show this help message

${c.dim("Options:")}
  --force           Skip confirmation prompts
  --all             Target all accounts (for logout)
  --no-color        Disable colored output

${c.dim("Examples:")}
  ${bin} login             ${c.dim("# Add a new account via browser")}
  ${bin} logout 2          ${c.dim("# Revoke tokens & remove account 2")}
  ${bin} logout --all      ${c.dim("# Logout all accounts")}
  ${bin} reauth 1          ${c.dim("# Re-authenticate account 1")}
  ${bin} refresh 1         ${c.dim("# Quick token refresh for account 1")}
  ${bin} list              ${c.dim("# Show all accounts")}
  ${bin} switch 2          ${c.dim("# Make account 2 active")}
  ${bin} disable 3         ${c.dim("# Temporarily disable account 3")}
  ${bin} reset all         ${c.dim("# Clear all rate-limit tracking")}
  ${bin} strategy sticky   ${c.dim("# Switch to sticky mode")}
  ${bin} stats             ${c.dim("# Show token usage per account")}
  ${bin} config set debug on ${c.dim("# Enable debug logging")}
  ${bin} status            ${c.dim("# One-liner for shell prompt")}

${c.dim("Files:")}
  Config:   ${shortPath(getConfigPath())}
  Accounts: ${shortPath(getStoragePath())}
`);
  return 0;
}
var ioContext = new AsyncLocalStorage();
var nativeConsoleLog = console.log.bind(console);
var nativeConsoleError = console.error.bind(console);
var consoleRouterUsers = 0;
function installConsoleRouter() {
  if (consoleRouterUsers === 0) {
    console.log = (...args) => {
      const io = ioContext.getStore();
      if (io?.log) return io.log(...args);
      return nativeConsoleLog(...args);
    };
    console.error = (...args) => {
      const io = ioContext.getStore();
      if (io?.error) return io.error(...args);
      return nativeConsoleError(...args);
    };
  }
  consoleRouterUsers++;
}
function uninstallConsoleRouter() {
  consoleRouterUsers = Math.max(0, consoleRouterUsers - 1);
  if (consoleRouterUsers === 0) {
    console.log = nativeConsoleLog;
    console.error = nativeConsoleError;
  }
}
async function runWithIoContext(io, fn) {
  installConsoleRouter();
  try {
    return await ioContext.run(io, fn);
  } finally {
    uninstallConsoleRouter();
  }
}
async function dispatch(argv) {
  const args = argv.filter((a) => !a.startsWith("--"));
  const flags = argv.filter((a) => a.startsWith("--"));
  if (flags.includes("--no-color")) USE_COLOR = false;
  if (flags.includes("--help")) return cmdHelp();
  const commandToken = args[0] || "list";
  const command = resolveCliCommandName(commandToken);
  const arg = args[1];
  const force = flags.includes("--force");
  const all = flags.includes("--all");
  if (!command) {
    console.error(c.red(`Unknown command: ${commandToken}`));
    console.error(c.dim("Run 'opencode-anthropic-auth help' for usage."));
    return 1;
  }
  switch (command) {
    // Auth commands
    case "login":
      return cmdLogin();
    case "logout":
      return cmdLogout(arg, { force, all });
    case "reauth":
      return cmdReauth(arg);
    case "refresh":
      return cmdRefresh(arg);
    // Account management commands
    case "list":
      return cmdList();
    case "status":
      return cmdStatus();
    case "switch":
      return cmdSwitch(arg);
    case "enable":
      return cmdEnable(arg);
    case "disable":
      return cmdDisable(arg);
    case "remove":
      return cmdRemove(arg, { force });
    case "reset":
      return cmdReset(arg);
    case "stats":
      return cmdStats();
    case "reset-stats":
      return cmdResetStats(arg);
    case "strategy":
      return cmdStrategy(arg);
    case "config":
      return cmdConfig(...args.slice(1));
    case "manage":
      return cmdManage();
    case "help":
      return cmdHelp();
  }
  console.error(c.red(`Unknown command: ${commandToken}`));
  console.error(c.dim("Run 'opencode-anthropic-auth help' for usage."));
  return 1;
}
async function main(argv, options = {}) {
  if (options.io) {
    return runWithIoContext(options.io, () => dispatch(argv));
  }
  return dispatch(argv);
}
async function detectMain() {
  if (!process.argv[1]) return false;
  if (import.meta.url === pathToFileURL(process.argv[1]).href) return true;
  try {
    const { realpath } = await import("node:fs/promises");
    const resolved = await realpath(process.argv[1]);
    return import.meta.url === pathToFileURL(resolved).href;
  } catch {
    return false;
  }
}
if (await detectMain()) {
  main(process.argv.slice(2)).then((code) => process.exit(code)).catch((err) => {
    console.error(c.red(`Fatal: ${err.message}`));
    process.exit(1);
  });
}
export {
  cmdConfig,
  cmdDisable,
  cmdEnable,
  cmdHelp,
  cmdList,
  cmdLogin,
  cmdLogout,
  cmdManage,
  cmdReauth,
  cmdRefresh,
  cmdRemove,
  cmdReset,
  cmdResetStats,
  cmdStats,
  cmdStatus,
  cmdStrategy,
  cmdSwitch,
  ensureTokenAndFetchUsage,
  fetchUsage,
  formatDuration,
  formatResetTime,
  formatTimeAgo,
  main,
  refreshAccessToken,
  renderBar,
  renderUsageLines
};
