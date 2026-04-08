var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// index.mjs
import { createInterface as createInterface2 } from "node:readline/promises";
import { stdin as stdin2, stdout as stdout2 } from "node:process";
import { randomUUID } from "node:crypto";

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
function detectModelFamily(model) {
  if (!model) return null;
  const normalized = model.toLowerCase();
  if (normalized.includes("opus")) return "opus";
  return null;
}
function getDefaultBetas(profileName, model) {
  const profile = getHeaderProfile(profileName);
  const family = detectModelFamily(model);
  const familyBetas = family ? profile.betaByModel[family] || [] : [];
  return [...profile.betaBase, ...familyBetas];
}
function getBillingHeaderBlock(profileName) {
  const profile = getHeaderProfile(profileName);
  const cch = randomBytes(3).toString("hex").slice(0, 5);
  return `x-anthropic-billing-header: cc_version=${profile.ccVersion}; cc_entrypoint=cli; cch=${cch};`;
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
async function clearAccounts() {
  const storagePath = getStoragePath();
  try {
    await fs.unlink(storagePath);
  } catch (error) {
    const code = (
      /** @type {NodeJS.ErrnoException} */
      error.code
    );
    if (code !== "ENOENT") throw error;
  }
}

// lib/rotation.mjs
var HealthScoreTracker = class {
  /** @type {Map<number, {score: number, lastUpdated: number, consecutiveFailures: number}>} */
  #scores = /* @__PURE__ */ new Map();
  /** @type {HealthScoreConfig} */
  #config;
  /**
   * @param {Partial<HealthScoreConfig>} [config]
   */
  constructor(config = {}) {
    this.#config = { ...DEFAULT_CONFIG.health_score, ...config };
  }
  /**
   * Get the current health score for an account, including passive recovery.
   * @param {number} accountIndex
   * @returns {number}
   */
  getScore(accountIndex) {
    const state = this.#scores.get(accountIndex);
    if (!state) return this.#config.initial;
    const hoursSinceUpdate = (Date.now() - state.lastUpdated) / (1e3 * 60 * 60);
    const recoveredPoints = Math.floor(hoursSinceUpdate * this.#config.recovery_rate_per_hour);
    return Math.min(this.#config.max_score, state.score + recoveredPoints);
  }
  /**
   * Record a successful request.
   * @param {number} accountIndex
   */
  recordSuccess(accountIndex) {
    const current = this.getScore(accountIndex);
    this.#scores.set(accountIndex, {
      score: Math.min(this.#config.max_score, current + this.#config.success_reward),
      lastUpdated: Date.now(),
      consecutiveFailures: 0
    });
  }
  /**
   * Record a rate limit event.
   * @param {number} accountIndex
   */
  recordRateLimit(accountIndex) {
    const current = this.getScore(accountIndex);
    const state = this.#scores.get(accountIndex);
    this.#scores.set(accountIndex, {
      score: Math.max(0, current + this.#config.rate_limit_penalty),
      lastUpdated: Date.now(),
      consecutiveFailures: (state?.consecutiveFailures ?? 0) + 1
    });
  }
  /**
   * Record a general failure.
   * @param {number} accountIndex
   */
  recordFailure(accountIndex) {
    const current = this.getScore(accountIndex);
    const state = this.#scores.get(accountIndex);
    this.#scores.set(accountIndex, {
      score: Math.max(0, current + this.#config.failure_penalty),
      lastUpdated: Date.now(),
      consecutiveFailures: (state?.consecutiveFailures ?? 0) + 1
    });
  }
  /**
   * Check if an account is usable (score above minimum).
   * @param {number} accountIndex
   * @returns {boolean}
   */
  isUsable(accountIndex) {
    return this.getScore(accountIndex) >= this.#config.min_usable;
  }
  /**
   * Reset tracking for an account.
   * @param {number} accountIndex
   */
  reset(accountIndex) {
    this.#scores.delete(accountIndex);
  }
};
var TokenBucketTracker = class {
  /** @type {Map<number, {tokens: number, lastUpdated: number}>} */
  #buckets = /* @__PURE__ */ new Map();
  /** @type {TokenBucketConfig} */
  #config;
  /**
   * @param {Partial<TokenBucketConfig>} [config]
   */
  constructor(config = {}) {
    this.#config = { ...DEFAULT_CONFIG.token_bucket, ...config };
  }
  /**
   * Get current token count for an account, including regeneration.
   * @param {number} accountIndex
   * @returns {number}
   */
  getTokens(accountIndex) {
    const state = this.#buckets.get(accountIndex);
    if (!state) return this.#config.initial_tokens;
    const minutesSinceUpdate = (Date.now() - state.lastUpdated) / (1e3 * 60);
    const recoveredTokens = minutesSinceUpdate * this.#config.regeneration_rate_per_minute;
    return Math.min(this.#config.max_tokens, state.tokens + recoveredTokens);
  }
  /**
   * Check if an account has enough tokens.
   * @param {number} accountIndex
   * @param {number} [cost=1]
   * @returns {boolean}
   */
  hasTokens(accountIndex, cost = 1) {
    return this.getTokens(accountIndex) >= cost;
  }
  /**
   * Consume tokens for a request.
   * @param {number} accountIndex
   * @param {number} [cost=1]
   * @returns {boolean} Whether tokens were available and consumed
   */
  consume(accountIndex, cost = 1) {
    const current = this.getTokens(accountIndex);
    if (current < cost) return false;
    this.#buckets.set(accountIndex, {
      tokens: current - cost,
      lastUpdated: Date.now()
    });
    return true;
  }
  /**
   * Refund tokens (e.g., on non-rate-limit failure).
   * @param {number} accountIndex
   * @param {number} [amount=1]
   */
  refund(accountIndex, amount = 1) {
    const current = this.getTokens(accountIndex);
    this.#buckets.set(accountIndex, {
      tokens: Math.min(this.#config.max_tokens, current + amount),
      lastUpdated: Date.now()
    });
  }
  /**
   * Get the max tokens value (for scoring calculations).
   * @returns {number}
   */
  getMaxTokens() {
    return this.#config.max_tokens;
  }
};
var STICKINESS_BONUS = 150;
var SWITCH_THRESHOLD = 100;
function calculateHybridScore(account, maxTokens) {
  const healthComponent = account.healthScore * 2;
  const tokenComponent = account.tokens / maxTokens * 100 * 5;
  const secondsSinceUsed = (Date.now() - account.lastUsed) / 1e3;
  const freshnessComponent = Math.min(secondsSinceUsed, 3600) * 0.1;
  return Math.max(0, healthComponent + tokenComponent + freshnessComponent);
}
function selectAccount(candidates, strategy, currentIndex, healthTracker, tokenTracker, cursor) {
  const available = candidates.filter((acc) => acc.enabled && !acc.isRateLimited);
  if (available.length === 0) return null;
  switch (strategy) {
    case "sticky": {
      if (currentIndex !== null) {
        const current = available.find((acc) => acc.index === currentIndex);
        if (current) {
          return { index: current.index, cursor };
        }
      }
      const next = available[cursor % available.length];
      return next ? { index: next.index, cursor: cursor + 1 } : null;
    }
    case "round-robin": {
      const next = available[cursor % available.length];
      return next ? { index: next.index, cursor: cursor + 1 } : null;
    }
    case "hybrid": {
      const scoredCandidates = available.filter((acc) => healthTracker.isUsable(acc.index) && tokenTracker.hasTokens(acc.index)).map((acc) => ({
        ...acc,
        tokens: tokenTracker.getTokens(acc.index)
      }));
      if (scoredCandidates.length === 0) {
        const fallback = available[0];
        return fallback ? { index: fallback.index, cursor } : null;
      }
      const maxTokens = tokenTracker.getMaxTokens();
      const scored = scoredCandidates.map((acc) => {
        const baseScore = calculateHybridScore(acc, maxTokens);
        const stickinessBonus = acc.index === currentIndex ? STICKINESS_BONUS : 0;
        return {
          index: acc.index,
          baseScore,
          score: baseScore + stickinessBonus,
          isCurrent: acc.index === currentIndex
        };
      }).sort((a, b) => b.score - a.score);
      const best = scored[0];
      if (!best) return null;
      const currentCandidate = scored.find((s) => s.isCurrent);
      if (currentCandidate && !best.isCurrent) {
        const advantage = best.baseScore - currentCandidate.baseScore;
        if (advantage < SWITCH_THRESHOLD) {
          return { index: currentCandidate.index, cursor };
        }
      }
      return { index: best.index, cursor };
    }
    default:
      return available[0] ? { index: available[0].index, cursor } : null;
  }
}

// lib/backoff.mjs
var QUOTA_EXHAUSTED_BACKOFFS = [6e4, 3e5, 18e5, 72e5];
var AUTH_FAILED_BACKOFF = 5e3;
var RATE_LIMIT_EXCEEDED_BACKOFF = 3e4;
var MIN_BACKOFF_MS = 2e3;
function parseRetryAfterHeader(response) {
  const header = response.headers.get("retry-after");
  if (!header) return null;
  const seconds = parseInt(header, 10);
  if (!isNaN(seconds) && seconds > 0) {
    return seconds * 1e3;
  }
  const date = new Date(header);
  if (!isNaN(date.getTime())) {
    const ms = date.getTime() - Date.now();
    return ms > 0 ? ms : null;
  }
  return null;
}
function extractErrorSignals(body) {
  let errorType = "";
  let message = "";
  let text = "";
  if (body == null) {
    return { errorType, message, text };
  }
  if (typeof body === "string") {
    text = body.toLowerCase();
    try {
      const parsed = JSON.parse(body);
      errorType = String(parsed?.error?.type || "").toLowerCase();
      message = String(parsed?.error?.message || "").toLowerCase();
    } catch {
    }
    return { errorType, message, text };
  }
  if (typeof body === "object") {
    errorType = String(body?.error?.type || "").toLowerCase();
    message = String(body?.error?.message || "").toLowerCase();
    try {
      text = JSON.stringify(body).toLowerCase();
    } catch {
      text = "";
    }
  }
  return { errorType, message, text };
}
function bodyHasAccountError(body) {
  const { errorType, message, text } = extractErrorSignals(body);
  const typeSignals = [
    "rate_limit",
    "quota",
    "billing",
    "permission",
    "authentication",
    "invalid_api_key",
    "insufficient_permissions",
    "invalid_grant"
  ];
  const messageSignals = [
    "rate limit",
    "would exceed",
    "quota",
    "exhausted",
    "credit balance",
    "billing",
    "permission",
    "forbidden",
    "unauthorized",
    "authentication",
    "not authorized",
    // Claude subscription usage limits (observed 2026-04-08):
    // "You're out of extra usage. Add more at claude.ai/settings/usage and keep going."
    "out of extra usage",
    "extra usage",
    "settings/usage",
    "out of usage"
  ];
  return typeSignals.some((signal) => errorType.includes(signal)) || messageSignals.some((signal) => message.includes(signal)) || messageSignals.some((signal) => text.includes(signal));
}
function isAccountSpecificError(status, body) {
  if (status === 429) return true;
  if (status === 401) return true;
  if ((status === 400 || status === 403) && body) {
    return bodyHasAccountError(body);
  }
  return false;
}
function parseRateLimitReason(status, body) {
  const { errorType, message, text } = extractErrorSignals(body);
  const authSignals = [
    "authentication",
    "invalid_api_key",
    "invalid api key",
    "invalid_grant",
    "unauthorized",
    "invalid access token",
    "expired token"
  ];
  const isAuthFailure = status === 401 || authSignals.some((signal) => errorType.includes(signal)) || authSignals.some((signal) => message.includes(signal)) || authSignals.some((signal) => text.includes(signal));
  if (isAuthFailure) {
    return "AUTH_FAILED";
  }
  if (errorType.includes("quota") || errorType.includes("billing") || errorType.includes("permission") || errorType.includes("insufficient_permissions") || message.includes("quota") || message.includes("exhausted") || message.includes("credit balance") || message.includes("billing") || message.includes("permission") || message.includes("forbidden") || message.includes("out of extra usage") || message.includes("extra usage") || message.includes("settings/usage") || message.includes("out of usage") || text.includes("permission") || text.includes("out of extra usage")) {
    return "QUOTA_EXHAUSTED";
  }
  return "RATE_LIMIT_EXCEEDED";
}
function calculateBackoffMs(reason, consecutiveFailures, retryAfterMs) {
  if (retryAfterMs && retryAfterMs > 0) {
    return Math.max(retryAfterMs, MIN_BACKOFF_MS);
  }
  switch (reason) {
    case "AUTH_FAILED":
      return AUTH_FAILED_BACKOFF;
    case "QUOTA_EXHAUSTED": {
      const index = Math.min(consecutiveFailures, QUOTA_EXHAUSTED_BACKOFFS.length - 1);
      return QUOTA_EXHAUSTED_BACKOFFS[index];
    }
    case "RATE_LIMIT_EXCEEDED":
    default:
      return RATE_LIMIT_EXCEEDED_BACKOFF;
  }
}

// lib/accounts.mjs
var MAX_ACCOUNTS = 10;
var RATE_LIMIT_KEY = "anthropic";
var AccountManager = class _AccountManager {
  /** @type {ManagedAccount[]} */
  #accounts = [];
  /** @type {number} */
  #cursor = 0;
  /** @type {number} */
  #currentIndex = -1;
  /** @type {HealthScoreTracker} */
  #healthTracker;
  /** @type {TokenBucketTracker} */
  #tokenTracker;
  /** @type {AnthropicAuthConfig} */
  #config;
  /** @type {ReturnType<typeof setTimeout> | null} */
  #saveTimeout = null;
  /**
   * Pending stats deltas per account id, merged into disk values on save.
   * @type {Map<string, StatsDelta>}
   */
  #statsDeltas = /* @__PURE__ */ new Map();
  /**
   * @param {AnthropicAuthConfig} config
   */
  constructor(config) {
    this.#config = config;
    this.#healthTracker = new HealthScoreTracker(config.health_score);
    this.#tokenTracker = new TokenBucketTracker(config.token_bucket);
  }
  /**
   * Load accounts from disk, optionally merging with an OpenCode auth fallback.
   * @param {AnthropicAuthConfig} config
   * @param {{refresh: string, access?: string, expires?: number} | null} [authFallback]
   * @returns {Promise<AccountManager>}
   */
  static async load(config, authFallback) {
    const manager = new _AccountManager(config);
    const stored = await loadAccounts();
    if (stored) {
      manager.#accounts = stored.accounts.map((acc, index) => ({
        id: acc.id || `${acc.addedAt}:${acc.refreshToken.slice(0, 12)}`,
        index,
        email: acc.email,
        refreshToken: acc.refreshToken,
        access: acc.access,
        expires: acc.expires,
        tokenUpdatedAt: acc.token_updated_at,
        addedAt: acc.addedAt,
        lastUsed: acc.lastUsed,
        enabled: acc.enabled,
        rateLimitResetTimes: acc.rateLimitResetTimes,
        consecutiveFailures: acc.consecutiveFailures,
        lastFailureTime: acc.lastFailureTime,
        lastSwitchReason: acc.lastSwitchReason,
        stats: acc.stats ?? createDefaultStats(acc.addedAt)
      }));
      manager.#currentIndex = manager.#accounts.length > 0 ? Math.min(stored.activeIndex, manager.#accounts.length - 1) : -1;
      if (authFallback && manager.#accounts.length > 0) {
        const match = manager.#accounts.find((acc) => acc.refreshToken === authFallback.refresh);
        if (match) {
          const fallbackHasAccess = typeof authFallback.access === "string" && authFallback.access.length > 0;
          const fallbackExpires = typeof authFallback.expires === "number" ? authFallback.expires : 0;
          const matchExpires = typeof match.expires === "number" ? match.expires : 0;
          const fallbackLooksFresh = fallbackHasAccess && fallbackExpires > Date.now();
          const shouldAdoptFallback = fallbackLooksFresh && (!match.access || !match.expires || fallbackExpires > matchExpires);
          if (shouldAdoptFallback) {
            match.access = authFallback.access;
            match.expires = authFallback.expires;
            match.tokenUpdatedAt = Math.max(match.tokenUpdatedAt || 0, fallbackExpires);
          }
        }
      }
      return manager;
    }
    if (authFallback && authFallback.refresh) {
      const now = Date.now();
      manager.#accounts = [
        {
          id: `${now}:${authFallback.refresh.slice(0, 12)}`,
          index: 0,
          email: void 0,
          refreshToken: authFallback.refresh,
          access: authFallback.access,
          expires: authFallback.expires,
          tokenUpdatedAt: now,
          addedAt: now,
          lastUsed: 0,
          enabled: true,
          rateLimitResetTimes: {},
          consecutiveFailures: 0,
          lastFailureTime: null,
          lastSwitchReason: "initial",
          stats: createDefaultStats(now)
        }
      ];
      manager.#currentIndex = 0;
    }
    return manager;
  }
  /**
   * Get the number of enabled accounts.
   * @returns {number}
   */
  getAccountCount() {
    return this.#accounts.filter((acc) => acc.enabled).length;
  }
  /**
   * Get the total number of accounts (including disabled).
   * @returns {number}
   */
  getTotalAccountCount() {
    return this.#accounts.length;
  }
  /**
   * Get a snapshot of all accounts (for display/management).
   * @returns {ManagedAccount[]}
   */
  getAccountsSnapshot() {
    return this.#accounts.map((acc) => ({ ...acc }));
  }
  /**
   * Get the current active account index.
   * @returns {number}
   */
  getCurrentIndex() {
    return this.#currentIndex;
  }
  /**
   * Get enabled account references for internal plugin operations.
   * Returned objects are mutable managed accounts.
   * @param {Set<number>} [excludedIndices]
   * @returns {ManagedAccount[]}
   */
  getEnabledAccounts(excludedIndices) {
    return this.#accounts.filter((acc) => acc.enabled && !excludedIndices?.has(acc.index));
  }
  /**
   * Clear expired rate limits for an account.
   * @param {ManagedAccount} account
   */
  #clearExpiredRateLimits(account) {
    const now = Date.now();
    for (const key of Object.keys(account.rateLimitResetTimes)) {
      if (account.rateLimitResetTimes[key] <= now) {
        delete account.rateLimitResetTimes[key];
      }
    }
  }
  /**
   * Check if an account is currently rate-limited.
   * @param {ManagedAccount} account
   * @returns {boolean}
   */
  #isRateLimited(account) {
    this.#clearExpiredRateLimits(account);
    const resetTime = account.rateLimitResetTimes[RATE_LIMIT_KEY];
    return resetTime !== void 0 && Date.now() < resetTime;
  }
  /**
   * Select the best account for the current request.
   * @param {Set<number>} [excludedIndices] - Temporary per-request exclusions
   * @returns {ManagedAccount | null}
   */
  getCurrentAccount(excludedIndices) {
    if (this.#accounts.length === 0) return null;
    const candidates = this.#accounts.filter((acc) => acc.enabled && !excludedIndices?.has(acc.index)).map((acc) => {
      this.#clearExpiredRateLimits(acc);
      return {
        index: acc.index,
        lastUsed: acc.lastUsed,
        healthScore: this.#healthTracker.getScore(acc.index),
        isRateLimited: this.#isRateLimited(acc),
        enabled: acc.enabled
      };
    });
    const result = selectAccount(
      candidates,
      this.#config.account_selection_strategy,
      this.#currentIndex >= 0 ? this.#currentIndex : null,
      this.#healthTracker,
      this.#tokenTracker,
      this.#cursor
    );
    if (!result) return null;
    this.#cursor = result.cursor;
    this.#currentIndex = result.index;
    const account = this.#accounts[result.index];
    if (account) {
      account.lastUsed = Date.now();
      this.#tokenTracker.consume(account.index);
    }
    return account ?? null;
  }
  /**
   * Mark an account as rate-limited.
   * @param {ManagedAccount} account
   * @param {RateLimitReason} reason
   * @param {number | null} [retryAfterMs]
   * @returns {number} The backoff duration in ms
   */
  markRateLimited(account, reason, retryAfterMs) {
    const now = Date.now();
    if (account.lastFailureTime !== null && now - account.lastFailureTime > this.#config.failure_ttl_seconds * 1e3) {
      account.consecutiveFailures = 0;
    }
    account.consecutiveFailures += 1;
    account.lastFailureTime = now;
    const backoffMs = calculateBackoffMs(reason, account.consecutiveFailures - 1, retryAfterMs);
    account.rateLimitResetTimes[RATE_LIMIT_KEY] = now + backoffMs;
    this.#healthTracker.recordRateLimit(account.index);
    this.requestSaveToDisk();
    return backoffMs;
  }
  /**
   * Mark a successful request for an account.
   * @param {ManagedAccount} account
   */
  markSuccess(account) {
    account.consecutiveFailures = 0;
    account.lastFailureTime = null;
    this.#healthTracker.recordSuccess(account.index);
  }
  /**
   * Mark a general failure (not rate limit) for an account.
   * @param {ManagedAccount} account
   */
  markFailure(account) {
    this.#healthTracker.recordFailure(account.index);
    this.#tokenTracker.refund(account.index);
  }
  /**
   * Add a new account to the pool.
   * @param {string} refreshToken
   * @param {string} accessToken
   * @param {number} expires
   * @param {string} [email]
   * @returns {ManagedAccount | null} The new account, or null if at capacity
   */
  addAccount(refreshToken2, accessToken, expires, email) {
    if (this.#accounts.length >= MAX_ACCOUNTS) return null;
    const existing = this.#accounts.find((acc) => acc.refreshToken === refreshToken2);
    if (existing) {
      existing.access = accessToken;
      existing.expires = expires;
      existing.tokenUpdatedAt = Date.now();
      if (email) existing.email = email;
      existing.enabled = true;
      return existing;
    }
    const now = Date.now();
    const account = {
      id: `${now}:${refreshToken2.slice(0, 12)}`,
      index: this.#accounts.length,
      email,
      refreshToken: refreshToken2,
      access: accessToken,
      expires,
      tokenUpdatedAt: now,
      addedAt: now,
      lastUsed: 0,
      enabled: true,
      rateLimitResetTimes: {},
      consecutiveFailures: 0,
      lastFailureTime: null,
      lastSwitchReason: "initial",
      stats: createDefaultStats(now)
    };
    this.#accounts.push(account);
    if (this.#accounts.length === 1) {
      this.#currentIndex = 0;
    }
    this.requestSaveToDisk();
    return account;
  }
  /**
   * Remove an account by index.
   * @param {number} index
   * @returns {boolean}
   */
  removeAccount(index) {
    if (index < 0 || index >= this.#accounts.length) return false;
    this.#accounts.splice(index, 1);
    this.#accounts.forEach((acc, i) => {
      acc.index = i;
    });
    if (this.#accounts.length === 0) {
      this.#currentIndex = -1;
      this.#cursor = 0;
    } else {
      if (this.#currentIndex >= this.#accounts.length) {
        this.#currentIndex = this.#accounts.length - 1;
      }
      if (this.#cursor > 0) {
        this.#cursor = Math.min(this.#cursor, this.#accounts.length);
      }
    }
    for (let i = 0; i < this.#accounts.length; i++) {
      this.#healthTracker.reset(i);
    }
    this.requestSaveToDisk();
    return true;
  }
  /**
   * Toggle an account's enabled state.
   * @param {number} index
   * @returns {boolean} New enabled state
   */
  toggleAccount(index) {
    const account = this.#accounts[index];
    if (!account) return false;
    account.enabled = !account.enabled;
    this.requestSaveToDisk();
    return account.enabled;
  }
  /**
   * Clear all accounts and reset state.
   */
  clearAll() {
    this.#accounts = [];
    this.#currentIndex = -1;
    this.#cursor = 0;
  }
  /**
   * Request a debounced save to disk.
   * Each call resets the debounce timer so the latest state is always persisted.
   */
  requestSaveToDisk() {
    if (this.#saveTimeout) clearTimeout(this.#saveTimeout);
    this.#saveTimeout = setTimeout(() => {
      this.#saveTimeout = null;
      this.saveToDisk().catch(() => {
      });
    }, 1e3);
  }
  /**
   * Persist current state to disk immediately.
   * Stats use merge-on-save: read disk values, add this instance's deltas,
   * write merged result. This prevents concurrent instances from clobbering
   * each other's stats.
   * @returns {Promise<void>}
   */
  async saveToDisk() {
    let diskAccountsById = null;
    let diskAccountsByAddedAt = null;
    let diskAccountsByRefreshToken = null;
    try {
      const diskData = await loadAccounts();
      if (diskData) {
        diskAccountsById = new Map(diskData.accounts.map((a) => [a.id, a]));
        diskAccountsByAddedAt = /* @__PURE__ */ new Map();
        diskAccountsByRefreshToken = /* @__PURE__ */ new Map();
        for (const diskAcc of diskData.accounts) {
          const bucket = diskAccountsByAddedAt.get(diskAcc.addedAt) || [];
          bucket.push(diskAcc);
          diskAccountsByAddedAt.set(diskAcc.addedAt, bucket);
          diskAccountsByRefreshToken.set(diskAcc.refreshToken, diskAcc);
        }
      }
    } catch {
    }
    const findDiskAccount = (account) => {
      const byId = diskAccountsById?.get(account.id);
      if (byId) return byId;
      const byAddedAt = diskAccountsByAddedAt?.get(account.addedAt);
      if (byAddedAt?.length === 1) return byAddedAt[0];
      const byToken = diskAccountsByRefreshToken?.get(account.refreshToken);
      if (byToken) return byToken;
      if (byAddedAt && byAddedAt.length > 0) return byAddedAt[0];
      return null;
    };
    const storage = {
      version: 1,
      accounts: this.#accounts.map((acc) => {
        const delta = this.#statsDeltas.get(acc.id);
        let mergedStats = acc.stats;
        const diskAcc = findDiskAccount(acc);
        if (delta) {
          const diskStats = diskAcc?.stats;
          if (delta.isReset) {
            mergedStats = {
              requests: delta.requests,
              inputTokens: delta.inputTokens,
              outputTokens: delta.outputTokens,
              cacheReadTokens: delta.cacheReadTokens,
              cacheWriteTokens: delta.cacheWriteTokens,
              lastReset: delta.resetTimestamp ?? acc.stats.lastReset
            };
          } else if (diskStats) {
            mergedStats = {
              requests: diskStats.requests + delta.requests,
              inputTokens: diskStats.inputTokens + delta.inputTokens,
              outputTokens: diskStats.outputTokens + delta.outputTokens,
              cacheReadTokens: diskStats.cacheReadTokens + delta.cacheReadTokens,
              cacheWriteTokens: diskStats.cacheWriteTokens + delta.cacheWriteTokens,
              lastReset: diskStats.lastReset
            };
          }
        }
        const memTokenUpdatedAt = acc.tokenUpdatedAt || 0;
        const diskTokenUpdatedAt = diskAcc?.token_updated_at || 0;
        const freshestAuth = diskAcc && diskTokenUpdatedAt > memTokenUpdatedAt ? {
          refreshToken: diskAcc.refreshToken,
          access: diskAcc.access,
          expires: diskAcc.expires,
          tokenUpdatedAt: diskTokenUpdatedAt
        } : {
          refreshToken: acc.refreshToken,
          access: acc.access,
          expires: acc.expires,
          tokenUpdatedAt: memTokenUpdatedAt
        };
        acc.refreshToken = freshestAuth.refreshToken;
        acc.access = freshestAuth.access;
        acc.expires = freshestAuth.expires;
        acc.tokenUpdatedAt = freshestAuth.tokenUpdatedAt;
        return {
          id: acc.id,
          email: acc.email,
          refreshToken: freshestAuth.refreshToken,
          access: freshestAuth.access,
          expires: freshestAuth.expires,
          token_updated_at: freshestAuth.tokenUpdatedAt,
          addedAt: acc.addedAt,
          lastUsed: acc.lastUsed,
          enabled: acc.enabled,
          rateLimitResetTimes: Object.keys(acc.rateLimitResetTimes).length > 0 ? acc.rateLimitResetTimes : {},
          consecutiveFailures: acc.consecutiveFailures,
          lastFailureTime: acc.lastFailureTime,
          lastSwitchReason: acc.lastSwitchReason,
          stats: mergedStats
        };
      }),
      activeIndex: Math.max(0, this.#currentIndex)
    };
    await saveAccounts(storage);
    this.#statsDeltas.clear();
    for (const saved of storage.accounts) {
      const acc = this.#accounts.find((a) => a.id === saved.id);
      if (acc) {
        acc.stats = saved.stats;
      }
    }
  }
  /**
   * Sync activeIndex from disk (picks up CLI changes while OpenCode is running).
   * Only switches if the disk value differs and the target account is enabled.
   * @returns {Promise<void>}
   */
  async syncActiveIndexFromDisk() {
    const stored = await loadAccounts();
    if (!stored) return;
    const existingByTokenForSnapshot = new Map(this.#accounts.map((acc) => [acc.refreshToken, acc]));
    const memSnapshot = this.#accounts.map((acc) => `${acc.id}:${acc.refreshToken}:${acc.enabled ? 1 : 0}`).join("|");
    const diskSnapshot = stored.accounts.map((acc) => {
      const resolvedId = acc.id || existingByTokenForSnapshot.get(acc.refreshToken)?.id || acc.refreshToken;
      return `${resolvedId}:${acc.refreshToken}:${acc.enabled ? 1 : 0}`;
    }).join("|");
    if (diskSnapshot !== memSnapshot) {
      const existingById = new Map(this.#accounts.map((acc) => [acc.id, acc]));
      const existingByToken = new Map(this.#accounts.map((acc) => [acc.refreshToken, acc]));
      this.#accounts = stored.accounts.map((acc, index) => {
        const existing = acc.id && existingById.get(acc.id) || (!acc.id ? existingByToken.get(acc.refreshToken) : null);
        return {
          id: acc.id || existing?.id || `${acc.addedAt}:${acc.refreshToken.slice(0, 12)}`,
          index,
          email: acc.email ?? existing?.email,
          refreshToken: acc.refreshToken,
          access: acc.access ?? existing?.access,
          expires: acc.expires ?? existing?.expires,
          tokenUpdatedAt: acc.token_updated_at ?? existing?.tokenUpdatedAt ?? acc.addedAt,
          addedAt: acc.addedAt,
          lastUsed: acc.lastUsed,
          enabled: acc.enabled,
          rateLimitResetTimes: acc.rateLimitResetTimes,
          consecutiveFailures: acc.consecutiveFailures,
          lastFailureTime: acc.lastFailureTime,
          lastSwitchReason: acc.lastSwitchReason || existing?.lastSwitchReason || "initial",
          stats: acc.stats ?? existing?.stats ?? createDefaultStats()
        };
      });
      this.#healthTracker = new HealthScoreTracker(this.#config.health_score);
      this.#tokenTracker = new TokenBucketTracker(this.#config.token_bucket);
      const currentIds = new Set(this.#accounts.map((a) => a.id));
      for (const id of this.#statsDeltas.keys()) {
        if (!currentIds.has(id)) this.#statsDeltas.delete(id);
      }
      if (this.#accounts.length === 0) {
        this.#currentIndex = -1;
        this.#cursor = 0;
        return;
      }
    }
    const diskIndex = Math.min(stored.activeIndex, this.#accounts.length - 1);
    if (diskIndex >= 0 && diskIndex !== this.#currentIndex) {
      const diskAccount = stored.accounts[diskIndex];
      if (!diskAccount || !diskAccount.enabled) return;
      const account = this.#accounts[diskIndex];
      if (account && account.enabled) {
        this.#currentIndex = diskIndex;
        this.#cursor = diskIndex;
        this.#healthTracker.reset(diskIndex);
      }
    }
  }
  /**
   * Record token usage for an account after a successful API response.
   * @param {number} index
   * @param {{inputTokens?: number, outputTokens?: number, cacheReadTokens?: number, cacheWriteTokens?: number}} usage
   */
  recordUsage(index, usage) {
    const account = this.#accounts[index];
    if (!account) return;
    const inTok = usage.inputTokens || 0;
    const outTok = usage.outputTokens || 0;
    const crTok = usage.cacheReadTokens || 0;
    const cwTok = usage.cacheWriteTokens || 0;
    account.stats.requests += 1;
    account.stats.inputTokens += inTok;
    account.stats.outputTokens += outTok;
    account.stats.cacheReadTokens += crTok;
    account.stats.cacheWriteTokens += cwTok;
    const delta = this.#statsDeltas.get(account.id);
    if (delta) {
      delta.requests += 1;
      delta.inputTokens += inTok;
      delta.outputTokens += outTok;
      delta.cacheReadTokens += crTok;
      delta.cacheWriteTokens += cwTok;
    } else {
      this.#statsDeltas.set(account.id, {
        requests: 1,
        inputTokens: inTok,
        outputTokens: outTok,
        cacheReadTokens: crTok,
        cacheWriteTokens: cwTok,
        isReset: false
      });
    }
    this.requestSaveToDisk();
  }
  /**
   * Reset stats for a specific account or all accounts.
   * @param {number | "all"} target - Account index or "all"
   */
  resetStats(target) {
    const now = Date.now();
    const resetAccount = (acc) => {
      acc.stats = createDefaultStats(now);
      this.#statsDeltas.set(acc.id, {
        requests: 0,
        inputTokens: 0,
        outputTokens: 0,
        cacheReadTokens: 0,
        cacheWriteTokens: 0,
        isReset: true,
        resetTimestamp: now
      });
    };
    if (target === "all") {
      for (const acc of this.#accounts) {
        resetAccount(acc);
      }
    } else {
      const account = this.#accounts[target];
      if (account) {
        resetAccount(account);
      }
    }
    this.requestSaveToDisk();
  }
};

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
function resolveSlashCommandName(token) {
  return SLASH_ALIAS_MAP.get(token.toLowerCase()) || null;
}
function isDestructiveCommand(command) {
  return commandByName.get(command)?.destructive === true;
}
function isInteractiveOnlyCommand(command) {
  return commandByName.get(command)?.interactiveOnly === true;
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

// lib/refresh-lock.mjs
import { promises as fs2 } from "node:fs";
import { createHash, randomBytes as randomBytes3 } from "node:crypto";
import { dirname as dirname3, join as join3 } from "node:path";
var DEFAULT_LOCK_TIMEOUT_MS = 2e3;
var DEFAULT_LOCK_BACKOFF_MS = 50;
var DEFAULT_STALE_LOCK_MS = 2e4;
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function getLockPath(accountId) {
  const hash = createHash("sha1").update(accountId).digest("hex").slice(0, 24);
  return join3(dirname3(getStoragePath()), "locks", `refresh-${hash}.lock`);
}
async function acquireRefreshLock(accountId, options = {}) {
  const timeoutMs = options.timeoutMs ?? DEFAULT_LOCK_TIMEOUT_MS;
  const backoffMs = options.backoffMs ?? DEFAULT_LOCK_BACKOFF_MS;
  const staleMs = options.staleMs ?? DEFAULT_STALE_LOCK_MS;
  const lockPath = getLockPath(accountId);
  const lockDir = dirname3(lockPath);
  const deadline = Date.now() + Math.max(0, timeoutMs);
  const owner = randomBytes3(12).toString("hex");
  await fs2.mkdir(lockDir, { recursive: true });
  while (Date.now() <= deadline) {
    try {
      const handle = await fs2.open(lockPath, "wx", 384);
      try {
        await handle.writeFile(JSON.stringify({ pid: process.pid, createdAt: Date.now(), owner }), "utf-8");
        const stat = await handle.stat();
        return { acquired: true, lockPath, owner, lockInode: stat.ino };
      } finally {
        await handle.close();
      }
    } catch (error) {
      const code = (
        /** @type {NodeJS.ErrnoException} */
        error.code
      );
      if (code !== "EEXIST") {
        throw error;
      }
      try {
        const stat = await fs2.stat(lockPath);
        if (Date.now() - stat.mtimeMs > staleMs) {
          await fs2.unlink(lockPath);
          continue;
        }
      } catch {
      }
      const remaining = deadline - Date.now();
      if (remaining <= 0) break;
      const jitter = Math.floor(Math.random() * 25);
      await delay(Math.min(remaining, backoffMs + jitter));
    }
  }
  return { acquired: false, lockPath: null, owner: null, lockInode: null };
}
async function releaseRefreshLock(lock) {
  const lockPath = typeof lock === "string" || lock === null ? lock : lock.lockPath;
  const owner = typeof lock === "object" && lock ? lock.owner || null : null;
  const lockInode = typeof lock === "object" && lock ? lock.lockInode || null : null;
  if (!lockPath) return;
  if (owner) {
    try {
      const content = await fs2.readFile(lockPath, "utf-8");
      const parsed = JSON.parse(content);
      if (!parsed || typeof parsed !== "object" || parsed.owner !== owner) {
        return;
      }
      if (lockInode) {
        const stat = await fs2.stat(lockPath);
        if (stat.ino !== lockInode) {
          return;
        }
      }
    } catch (error) {
      const code = (
        /** @type {NodeJS.ErrnoException} */
        error.code
      );
      if (code === "ENOENT") return;
      return;
    }
  }
  try {
    await fs2.unlink(lockPath);
  } catch (error) {
    const code = (
      /** @type {NodeJS.ErrnoException} */
      error.code
    );
    if (code !== "ENOENT") throw error;
  }
}

// index.mjs
var CLAUDE_CODE_SESSION_ID = randomUUID();
async function promptAccountMenu(accountManager) {
  const accounts = accountManager.getAccountsSnapshot();
  const currentIndex = accountManager.getCurrentIndex();
  const rl = createInterface2({ input: stdin2, output: stdout2 });
  try {
    console.log(`
${accounts.length} account(s) configured:`);
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
async function promptManageAccounts(accountManager) {
  const accounts = accountManager.getAccountsSnapshot();
  const rl = createInterface2({ input: stdin2, output: stdout2 });
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
  const incomingBeta = requestHeaders.get("anthropic-beta") || "";
  const incomingBetasList = incomingBeta.split(",").map((b) => b.trim()).filter(Boolean);
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
  const configuredBetas = anthropicBetaOverride ? anthropicBetaOverride.split(",").map((b) => b.trim()).filter(Boolean) : defaultBetas;
  const mergedBetas = [.../* @__PURE__ */ new Set([...configuredBetas, ...incomingBetasList])].join(",");
  requestHeaders.set("authorization", `Bearer ${accessToken}`);
  if (!disabledHeaders.has("anthropic-beta")) {
    requestHeaders.set("anthropic-beta", mergedBetas);
  }
  if (!disabledHeaders.has("x-claude-code-session-id") && !requestHeaders.has("x-claude-code-session-id")) {
    requestHeaders.set("x-claude-code-session-id", CLAUDE_CODE_SESSION_ID);
  }
  requestHeaders.delete("x-api-key");
  return requestHeaders;
}
function extractModelName(body) {
  if (!body || typeof body !== "string") return void 0;
  try {
    const parsed = JSON.parse(body);
    if (parsed && typeof parsed === "object" && typeof parsed.model === "string" && parsed.model) {
      return parsed.model;
    }
  } catch {
  }
  return void 0;
}
function transformRequestBody(body) {
  if (!body || typeof body !== "string") return body;
  const TOOL_PREFIX = "mcp_";
  try {
    const parsed = JSON.parse(body);
    if (parsed.system && Array.isArray(parsed.system)) {
      parsed.system = parsed.system.map((item) => {
        if (item.type === "text" && item.text) {
          return {
            ...item,
            // Strip the OpenCode identity line — the transform hook provides the correct Claude Code identity
            text: item.text.replace(/^You are OpenCode, the best coding agent on the planet\.\n*/m, "").replace(/OpenCode/g, "Claude Code").replace(/(?<!\/)opencode/gi, "Claude")
          };
        }
        return item;
      });
    }
    if (parsed.tools && Array.isArray(parsed.tools)) {
      parsed.tools = parsed.tools.map((tool) => ({
        ...tool,
        name: tool.name ? `${TOOL_PREFIX}${tool.name}` : tool.name
      }));
    }
    if (parsed.messages && Array.isArray(parsed.messages)) {
      parsed.messages = parsed.messages.map((msg) => {
        if (msg.content && Array.isArray(msg.content)) {
          msg.content = msg.content.map((block) => {
            if (block.type === "tool_use" && block.name) {
              return {
                ...block,
                name: `${TOOL_PREFIX}${block.name}`
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
    return body;
  }
}
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
function extractUsageFromSSEEvent(parsed, stats) {
  if (parsed?.type === "message_delta" && parsed.usage) {
    const u = parsed.usage;
    if (typeof u.input_tokens === "number") stats.inputTokens = u.input_tokens;
    if (typeof u.output_tokens === "number") stats.outputTokens = u.output_tokens;
    if (typeof u.cache_read_input_tokens === "number") stats.cacheReadTokens = u.cache_read_input_tokens;
    if (typeof u.cache_creation_input_tokens === "number") stats.cacheWriteTokens = u.cache_creation_input_tokens;
    return;
  }
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
function getMidStreamAccountError(parsed) {
  if (!parsed || parsed.type !== "error" || !parsed.error) {
    return null;
  }
  const errorBody = {
    error: {
      type: String(parsed.error.type || ""),
      message: String(parsed.error.message || "")
    }
  };
  if (!isAccountSpecificError(400, errorBody)) {
    return null;
  }
  const reason = parseRateLimitReason(400, errorBody);
  return {
    reason,
    invalidateToken: reason === "AUTH_FAILED"
  };
}
function stripMcpPrefixFromSSE(text) {
  return text.replace(/^data:\s*(.+)$/gm, (_match, jsonStr) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (stripMcpPrefixFromParsedEvent(parsed)) {
        return `data: ${JSON.stringify(parsed)}`;
      }
    } catch {
    }
    return _match;
  });
}
function stripMcpPrefixFromParsedEvent(parsed) {
  if (!parsed || typeof parsed !== "object") return false;
  let modified = false;
  if (parsed.content_block && parsed.content_block.type === "tool_use" && typeof parsed.content_block.name === "string" && parsed.content_block.name.startsWith("mcp_")) {
    parsed.content_block.name = parsed.content_block.name.slice(4);
    modified = true;
  }
  if (parsed.message && Array.isArray(parsed.message.content)) {
    for (const block of parsed.message.content) {
      if (block.type === "tool_use" && typeof block.name === "string" && block.name.startsWith("mcp_")) {
        block.name = block.name.slice(4);
        modified = true;
      }
    }
  }
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
function transformResponse(response, onUsage, onAccountError) {
  if (!response.body) return response;
  const reader = response.body.getReader();
  const decoder2 = new TextDecoder();
  const encoder2 = new TextEncoder();
  const EMPTY_CHUNK = new Uint8Array();
  const stats = { inputTokens: 0, outputTokens: 0, cacheReadTokens: 0, cacheWriteTokens: 0 };
  let sseBuffer = "";
  let sseRewriteBuffer = "";
  let accountErrorHandled = false;
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
      }
      if (boundary === -1) return;
    }
  }
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
          controller.enqueue(encoder2.encode(rewrittenTail));
        }
        if (onUsage && (stats.inputTokens > 0 || stats.outputTokens > 0 || stats.cacheReadTokens > 0 || stats.cacheWriteTokens > 0)) {
          onUsage(stats);
        }
        controller.close();
        return;
      }
      const text = decoder2.decode(value, { stream: true });
      if (onUsage || onAccountError) {
        sseBuffer += text.replace(/\r\n/g, "\n");
        processSSEBuffer(false);
      }
      const rewrittenText = rewriteSSEChunk(text, false);
      if (rewrittenText) {
        controller.enqueue(encoder2.encode(rewrittenText));
      } else {
        controller.enqueue(EMPTY_CHUNK);
      }
    }
  });
  return new Response(stream, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers
  });
}
function isEventStreamResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  return contentType.toLowerCase().includes("text/event-stream");
}
function formatSwitchReason(status, reason) {
  if (reason === "AUTH_FAILED") return "auth failed";
  if (status === 403 && reason === "QUOTA_EXHAUSTED") return "permission denied";
  if (reason === "QUOTA_EXHAUSTED") return "quota exhausted";
  return "rate-limited";
}
function formatDurationShort(ms) {
  const seconds = Math.max(1, Math.ceil(ms / 1e3));
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.ceil(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.ceil(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.ceil(hours / 24);
  return `${days}d`;
}
function buildNoAvailableAccountReason(accountManager, transientRefreshSkips, lastError) {
  const now = Date.now();
  const accounts = accountManager.getAccountsSnapshot();
  const enabled = accounts.filter((acc) => acc.enabled);
  if (enabled.length === 0) {
    return "no enabled accounts";
  }
  const transientFailures = enabled.filter((acc) => transientRefreshSkips.has(acc.index));
  const rateLimited = enabled.map((acc) => ({ acc, resetAt: acc.rateLimitResetTimes?.anthropic })).filter(
    ({ acc, resetAt }) => !transientRefreshSkips.has(acc.index) && typeof resetAt === "number" && resetAt > now
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
      tokenUpdatedAt: diskAccount.token_updated_at
    };
  } catch {
    return null;
  }
}
function markTokenStateUpdated(account, now = Date.now()) {
  account.tokenUpdatedAt = now;
}
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
async function refreshAccountToken(account, client, source = "foreground", { onTokensUpdated } = {}) {
  const lockResult = await acquireRefreshLock(account.id, {
    timeoutMs: 2e3,
    backoffMs: 60,
    staleMs: 2e4
  });
  const lock = lockResult && typeof lockResult === "object" ? lockResult : {
    acquired: true,
    lockPath: null,
    owner: null,
    lockInode: null
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
    const json = await refreshToken(account.refreshToken, { signal: AbortSignal.timeout(1e4) });
    account.access = json.access_token;
    account.expires = Date.now() + json.expires_in * 1e3;
    if (json.refresh_token) {
      account.refreshToken = json.refresh_token;
    }
    markTokenStateUpdated(account);
    if (onTokensUpdated) {
      try {
        await onTokensUpdated();
      } catch {
      }
    }
    try {
      await client.auth.set({
        path: { id: "anthropic" },
        body: {
          type: "oauth",
          refresh: account.refreshToken,
          access: account.access,
          expires: account.expires
        }
      });
    } catch {
    }
    return json.access_token;
  } finally {
    await releaseRefreshLock(lock);
  }
}
var ANTHROPIC_COMMAND_HANDLED = "__ANTHROPIC_COMMAND_HANDLED__";
var PENDING_OAUTH_TTL_MS = 10 * 60 * 1e3;
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
async function AnthropicAuthPlugin({ client }) {
  const config = loadConfig();
  let accountManager = null;
  let lastToastedIndex = -1;
  const debouncedToastTimestamps = /* @__PURE__ */ new Map();
  const refreshInFlight = /* @__PURE__ */ new Map();
  const idleRefreshLastAttempt = /* @__PURE__ */ new Map();
  const idleRefreshInFlight = /* @__PURE__ */ new Set();
  const IDLE_REFRESH_ENABLED = config.idle_refresh.enabled;
  const IDLE_REFRESH_WINDOW_MS = config.idle_refresh.window_minutes * 60 * 1e3;
  const IDLE_REFRESH_MIN_INTERVAL_MS = config.idle_refresh.min_interval_minutes * 60 * 1e3;
  const pendingSlashOAuth = /* @__PURE__ */ new Map();
  async function sendCommandMessage(sessionID, text) {
    await client.session?.prompt({
      path: { id: sessionID },
      body: {
        noReply: true,
        parts: [{ type: "text", text, ignored: true }]
      }
    });
  }
  async function reloadAccountManagerFromDisk() {
    if (!accountManager) return;
    accountManager = await AccountManager.load(config, null);
  }
  async function persistOpenCodeAuth(refresh, access, expires) {
    await client.auth.set({
      path: { id: "anthropic" },
      body: { type: "oauth", refresh, access, expires }
    });
  }
  function pruneExpiredPendingOAuth() {
    const now = Date.now();
    for (const [sessionID, pending] of pendingSlashOAuth.entries()) {
      if (now - pending.createdAt > PENDING_OAUTH_TTL_MS) {
        pendingSlashOAuth.delete(sessionID);
      }
    }
  }
  async function runCliCommand(argv) {
    const logs = [];
    const errors = [];
    let code = 1;
    try {
      code = await main(argv, {
        io: {
          log: (...args) => logs.push(args.join(" ")),
          error: (...args) => errors.push(args.join(" "))
        }
      });
    } catch (err) {
      errors.push(err instanceof Error ? err.message : String(err));
    }
    return {
      code,
      stdout: stripAnsi(logs.join("\n")).trim(),
      stderr: stripAnsi(errors.join("\n")).trim()
    };
  }
  async function startSlashOAuth(sessionID, mode, targetIndex) {
    pruneExpiredPendingOAuth();
    const { url, verifier } = await authorize("max");
    pendingSlashOAuth.set(sessionID, {
      mode,
      verifier,
      targetIndex,
      createdAt: Date.now()
    });
    const action = mode === "login" ? "login" : `reauth ${(targetIndex ?? 0) + 1}`;
    const followup = mode === "login" ? "/anthropic login complete <code#state>" : "/anthropic reauth complete <code#state>";
    await sendCommandMessage(
      sessionID,
      [
        "\u25A3 Anthropic OAuth",
        "",
        `Started ${action} flow.`,
        "Open this URL in your browser:",
        url,
        "",
        `Then run: ${followup}`,
        "(Paste the full authorization code, including #state)"
      ].join("\n")
    );
  }
  async function completeSlashOAuth(sessionID, code, expectedMode) {
    const pending = pendingSlashOAuth.get(sessionID);
    if (!pending) {
      pruneExpiredPendingOAuth();
      return {
        ok: false,
        message: "No pending OAuth flow. Start with /anthropic login or /anthropic reauth <N>."
      };
    }
    if (Date.now() - pending.createdAt > PENDING_OAUTH_TTL_MS) {
      pendingSlashOAuth.delete(sessionID);
      return {
        ok: false,
        message: "Pending OAuth flow expired. Start again with /anthropic login or /anthropic reauth <N>."
      };
    }
    if (pending.mode !== expectedMode) {
      return {
        ok: false,
        message: `Pending ${pending.mode} OAuth flow found. Complete with /anthropic ${pending.mode} complete <code#state> or restart.`
      };
    }
    const credentials = await exchange(code, pending.verifier);
    if (credentials.type === "failed") {
      return { ok: false, message: "Token exchange failed. The code may be invalid or expired." };
    }
    const stored = await loadAccounts() || { version: 1, accounts: [], activeIndex: 0 };
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
        const name2 = acc.email || `Account ${existingIdx + 1}`;
        return { ok: true, message: `Updated existing account #${existingIdx + 1} (${name2}).` };
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
        stats: createDefaultStats(now)
      });
      await saveAccounts(stored);
      const newAccount = stored.accounts[stored.accounts.length - 1];
      await persistOpenCodeAuth(newAccount.refreshToken, newAccount.access, newAccount.expires);
      await reloadAccountManagerFromDisk();
      pendingSlashOAuth.delete(sessionID);
      const label = credentials.email || `Account ${stored.accounts.length}`;
      return { ok: true, message: `Added account #${stored.accounts.length} (${label}).` };
    }
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
  async function handleAnthropicSlashCommand(input) {
    const args = parseCommandArgs(input.arguments || "");
    const primaryToken = (args[0] || "list").toLowerCase();
    const resolvedPrimary = resolveSlashCommandName(primaryToken);
    const primary = resolvedPrimary || primaryToken;
    if (primary === "login") {
      if ((args[1] || "").toLowerCase() === "complete") {
        const code = args.slice(2).join(" ").trim();
        if (!code) {
          await sendCommandMessage(
            input.sessionID,
            "\u25A3 Anthropic OAuth\n\nMissing code. Use: /anthropic login complete <code#state>"
          );
          return;
        }
        const result2 = await completeSlashOAuth(input.sessionID, code, "login");
        const heading2 = result2.ok ? "\u25A3 Anthropic OAuth" : "\u25A3 Anthropic OAuth (error)";
        await sendCommandMessage(input.sessionID, `${heading2}

${result2.message}`);
        return;
      }
      await startSlashOAuth(input.sessionID, "login");
      return;
    }
    if (primary === "reauth") {
      if ((args[1] || "").toLowerCase() === "complete") {
        const code = args.slice(2).join(" ").trim();
        if (!code) {
          await sendCommandMessage(
            input.sessionID,
            "\u25A3 Anthropic OAuth\n\nMissing code. Use: /anthropic reauth complete <code#state>"
          );
          return;
        }
        const result2 = await completeSlashOAuth(input.sessionID, code, "reauth");
        const heading2 = result2.ok ? "\u25A3 Anthropic OAuth" : "\u25A3 Anthropic OAuth (error)";
        await sendCommandMessage(input.sessionID, `${heading2}

${result2.message}`);
        return;
      }
      const n = parseInt(args[1], 10);
      if (Number.isNaN(n) || n < 1) {
        await sendCommandMessage(
          input.sessionID,
          "\u25A3 Anthropic OAuth\n\nProvide an account number. Example: /anthropic reauth 1"
        );
        return;
      }
      const stored = await loadAccounts();
      if (!stored || stored.accounts.length === 0) {
        await sendCommandMessage(input.sessionID, "\u25A3 Anthropic OAuth (error)\n\nNo accounts configured.");
        return;
      }
      const idx = n - 1;
      if (idx >= stored.accounts.length) {
        await sendCommandMessage(
          input.sessionID,
          `\u25A3 Anthropic OAuth (error)

Account ${n} does not exist. You have ${stored.accounts.length} account(s).`
        );
        return;
      }
      await startSlashOAuth(input.sessionID, "reauth", idx);
      return;
    }
    if (isInteractiveOnlyCommand(primary)) {
      await sendCommandMessage(
        input.sessionID,
        "\u25A3 Anthropic\n\n`manage` is interactive-only. Use granular slash commands (switch/enable/disable/remove/reset) or run `opencode-anthropic-auth manage` in a terminal."
      );
      return;
    }
    const cliArgs = [...args];
    if (cliArgs.length === 0) cliArgs.push("list");
    if (resolvedPrimary) {
      cliArgs[0] = primary;
    }
    if (isDestructiveCommand(primary) && !cliArgs.includes("--force")) {
      cliArgs.push("--force");
    }
    const result = await runCliCommand(cliArgs);
    const heading = result.code === 0 ? "\u25A3 Anthropic" : "\u25A3 Anthropic (error)";
    const body = result.stdout || result.stderr || "No output.";
    await sendCommandMessage(input.sessionID, [heading, "", body].join("\n"));
    await reloadAccountManagerFromDisk();
  }
  async function toast(message, variant = "info", options = {}) {
    if (config.toasts.quiet && variant !== "error") return;
    if (variant !== "error" && options.debounceKey) {
      const minGapMs = Math.max(0, config.toasts.debounce_seconds) * 1e3;
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
    }
  }
  function debugLog(...args) {
    if (!config.debug) return;
    console.error("[opencode-anthropic-auth]", ...args);
  }
  function parseRefreshFailure(refreshError) {
    const message = refreshError instanceof Error ? refreshError.message : String(refreshError);
    const status = typeof refreshError === "object" && refreshError && "status" in refreshError ? Number(refreshError.status) : NaN;
    const errorCode = typeof refreshError === "object" && refreshError && ("errorCode" in refreshError || "code" in refreshError) ? String(refreshError.errorCode || refreshError.code || "") : "";
    const msgLower = message.toLowerCase();
    const isInvalidGrant = errorCode === "invalid_grant" || errorCode === "invalid_request" || msgLower.includes("invalid_grant");
    const isTerminalStatus = status === 400 || status === 401 || status === 403;
    return { message, status, errorCode, isInvalidGrant, isTerminalStatus };
  }
  async function refreshAccountTokenSingleFlight(account, source = "foreground") {
    const key = account.id;
    const existing = refreshInFlight.get(key);
    if (existing) {
      if (source === "foreground" && existing.source === "idle") {
        try {
          await existing.promise;
        } catch {
        }
        if (account.access && account.expires && account.expires > Date.now()) {
          return account.access;
        }
      } else {
        return existing.promise;
      }
    }
    const entry = { source, promise: Promise.resolve("") };
    const p = (async () => {
      try {
        return await refreshAccountToken(account, client, source, {
          onTokensUpdated: async () => {
            try {
              await accountManager.saveToDisk();
            } catch {
              accountManager.requestSaveToDisk();
              throw new Error("save failed, debounced retry scheduled");
            }
          }
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
            message: details.message
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
            message: details.message
          });
          return;
        }
      }
    } finally {
      idleRefreshInFlight.delete(account.id);
    }
  }
  function maybeRefreshIdleAccounts(activeAccount) {
    if (!IDLE_REFRESH_ENABLED || !accountManager) return;
    const now = Date.now();
    const excluded = /* @__PURE__ */ new Set([activeAccount.index]);
    const candidates = accountManager.getEnabledAccounts(excluded).filter((acc) => !acc.expires || acc.expires <= now + IDLE_REFRESH_WINDOW_MS).filter((acc) => {
      const last = idleRefreshLastAttempt.get(acc.id) ?? 0;
      return now - last >= IDLE_REFRESH_MIN_INTERVAL_MS;
    }).sort((a, b) => (a.expires ?? 0) - (b.expires ?? 0));
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
      for (let i = output.system.length - 1; i >= 0; i--) {
        if (output.system[i] === prefix) output.system.splice(i, 1);
      }
      for (let i = 0; i < output.system.length; i++) {
        if (typeof output.system[i] === "string" && output.system[i].startsWith(prefix + "\n")) {
          output.system[i] = output.system[i].slice(prefix.length).replace(/^\n+/, "");
        }
      }
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
        description: "Manage Anthropic multi-account auth (status, usage, switch, login, reauth, logout)"
      };
    },
    "command.execute.before": async (input) => {
      if (input.command !== "anthropic") return;
      try {
        await handleAnthropicSlashCommand(input);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        await sendCommandMessage(input.sessionID, `\u25A3 Anthropic (error)

${message}`);
      }
      throw new Error(ANTHROPIC_COMMAND_HANDLED);
    },
    auth: {
      provider: "anthropic",
      async loader(getAuth, provider) {
        const auth = await getAuth();
        if (auth.type === "oauth") {
          for (const model of Object.values(provider.models)) {
            model.cost = {
              input: 0,
              output: 0,
              cache: {
                read: 0,
                write: 0
              }
            };
          }
          accountManager = await AccountManager.load(config, {
            refresh: auth.refresh,
            access: auth.access,
            expires: auth.expires
          });
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
              const currentAuth = await getAuth();
              if (currentAuth.type !== "oauth") return fetch(input, init);
              const requestInit = init ?? {};
              const body = transformRequestBody(requestInit.body);
              const modelName = extractModelName(body);
              const { requestInput, requestUrl } = transformRequestUrl(input);
              const requestMethod = String(
                requestInit.method || (requestInput instanceof Request ? requestInput.method : "POST")
              ).toUpperCase();
              const showUsageToast = requestUrl?.pathname === "/v1/messages" && requestMethod === "POST";
              let lastError = null;
              const transientRefreshSkips = /* @__PURE__ */ new Set();
              if (accountManager) {
                await accountManager.syncActiveIndexFromDisk();
              }
              const maxAttempts = accountManager.getTotalAccountCount();
              for (let attempt = 0; attempt < maxAttempts; attempt++) {
                const account = accountManager.getCurrentAccount(transientRefreshSkips);
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
                      "No enabled Anthropic accounts available. Enable one with 'opencode-anthropic-auth enable <N>'."
                    );
                  }
                  const reason = buildNoAvailableAccountReason(accountManager, transientRefreshSkips, lastError);
                  await toast(`All Anthropic accounts unavailable: ${reason}`, "error");
                  throw new Error(`No available Anthropic account for request: ${reason}`);
                }
                let accessToken;
                if (!account.access || !account.expires || account.expires < Date.now()) {
                  const attemptedRefreshToken = account.refreshToken;
                  try {
                    accessToken = await refreshAccountTokenSingleFlight(account);
                  } catch (err) {
                    let finalError = err;
                    let details = parseRefreshFailure(err);
                    if (details.isInvalidGrant || details.isTerminalStatus) {
                      const diskAuth = await readDiskAccountAuth(account.id);
                      const retryToken = diskAuth?.refreshToken;
                      if (retryToken && retryToken !== attemptedRefreshToken && account.refreshToken === attemptedRefreshToken) {
                        debugLog("refresh token on disk differs from in-memory, retrying with disk token", {
                          accountIndex: account.index
                        });
                        account.refreshToken = retryToken;
                        if (diskAuth?.tokenUpdatedAt) {
                          account.tokenUpdatedAt = diskAuth.tokenUpdatedAt;
                        } else {
                          markTokenStateUpdated(account);
                        }
                      } else if (retryToken && retryToken !== attemptedRefreshToken) {
                        debugLog("skipping disk token adoption because in-memory token already changed", {
                          accountIndex: account.index
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
                          message: details.message
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
                          message: details.message
                        });
                        account.enabled = false;
                        accountManager.requestSaveToDisk();
                        const statusLabel = Number.isFinite(details.status) ? `HTTP ${details.status}` : "unknown status";
                        await toast(
                          `Disabled ${name} (token refresh failed: ${details.errorCode || statusLabel})`,
                          "error"
                        );
                      } else {
                        transientRefreshSkips.add(account.index);
                      }
                      lastError = finalError;
                      continue;
                    }
                  }
                } else {
                  accessToken = account.access;
                }
                maybeRefreshIdleAccounts(account);
                const requestHeaders = buildRequestHeaders(input, requestInit, accessToken, config.headers, modelName);
                let response;
                try {
                  response = await fetch(requestInput, {
                    ...requestInit,
                    body,
                    headers: requestHeaders
                  });
                } catch (err) {
                  const fetchError = err instanceof Error ? err : new Error(String(err));
                  if (accountManager && account) {
                    accountManager.markFailure(account);
                    transientRefreshSkips.add(account.index);
                    lastError = fetchError;
                    debugLog("request fetch threw, trying next account", {
                      accountIndex: account.index,
                      message: fetchError.message
                    });
                    continue;
                  }
                  throw fetchError;
                }
                if (!response.ok && accountManager && account) {
                  let errorBody = null;
                  try {
                    errorBody = await response.clone().text();
                  } catch {
                  }
                  if (isAccountSpecificError(response.status, errorBody)) {
                    const reason = parseRateLimitReason(response.status, errorBody);
                    const retryAfterMs = parseRetryAfterHeader(response);
                    const authOrPermissionIssue = reason === "AUTH_FAILED";
                    if (reason === "AUTH_FAILED") {
                      account.access = void 0;
                      account.expires = void 0;
                      markTokenStateUpdated(account);
                    }
                    debugLog("account-specific error, switching account", {
                      accountIndex: account.index,
                      status: response.status,
                      reason
                    });
                    accountManager.markRateLimited(account, reason, authOrPermissionIssue ? null : retryAfterMs);
                    const name = account.email || `Account ${accountManager.getCurrentIndex() + 1}`;
                    const total = accountManager.getAccountCount();
                    if (total > 1) {
                      const switchReason = formatSwitchReason(response.status, reason);
                      await toast(`${name} ${switchReason}, switching account`, "warning", {
                        debounceKey: "account-switch"
                      });
                    }
                    continue;
                  }
                  debugLog("service-wide response error, returning directly", {
                    status: response.status
                  });
                  return transformResponse(response);
                }
                if (account && accountManager) {
                  if (response.ok) {
                    accountManager.markSuccess(account);
                  }
                }
                const shouldInspectStream = response.ok && account && accountManager && isEventStreamResponse(response);
                const usageCallback = shouldInspectStream ? (usage) => {
                  accountManager.recordUsage(account.index, usage);
                } : null;
                const accountErrorCallback = shouldInspectStream ? (details) => {
                  if (details.invalidateToken) {
                    account.access = void 0;
                    account.expires = void 0;
                    markTokenStateUpdated(account);
                  }
                  accountManager.markRateLimited(account, details.reason, null);
                } : null;
                return transformResponse(response, usageCallback, accountErrorCallback);
              }
              if (lastError) throw lastError;
              throw new Error("All accounts exhausted \u2014 no account could serve this request");
            }
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
            const stored = await loadAccounts();
            if (stored && stored.accounts.length > 0 && accountManager) {
              const action = await promptAccountMenu(accountManager);
              if (action === "cancel") {
                return {
                  url: "about:blank",
                  instructions: "Cancelled.",
                  method: "code",
                  callback: async () => ({ type: "failed" })
                };
              }
              if (action === "manage") {
                await promptManageAccounts(accountManager);
                await accountManager.saveToDisk();
                return {
                  url: "about:blank",
                  instructions: "Account management complete. Re-run auth to add accounts.",
                  method: "code",
                  callback: async () => ({ type: "failed" })
                };
              }
              if (action === "fresh") {
                await clearAccounts();
                accountManager.clearAll();
              }
            }
            const { url, verifier } = await authorize("max");
            return {
              url,
              instructions: "Paste the authorization code here: ",
              method: "code",
              callback: async (code) => {
                const credentials = await exchange(code, verifier);
                if (credentials.type === "failed") return credentials;
                if (!accountManager) {
                  accountManager = await AccountManager.load(config, null);
                }
                const countBefore = accountManager.getAccountCount();
                accountManager.addAccount(
                  credentials.refresh,
                  credentials.access,
                  credentials.expires,
                  credentials.email
                );
                await accountManager.saveToDisk();
                const total = accountManager.getAccountCount();
                const name = credentials.email || "account";
                if (countBefore > 0) {
                  await toast(`Added ${name} \u2014 ${total} accounts`, "success");
                } else {
                  await toast(`Authenticated (${name})`, "success");
                }
                return credentials;
              }
            };
          }
        },
        {
          // H2: Create an API Key (unchanged)
          label: "Create an API Key",
          type: "oauth",
          authorize: async () => {
            const { url, verifier } = await authorize("console");
            return {
              url,
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
                      authorization: `Bearer ${credentials.access}`
                    }
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
              }
            };
          }
        },
        {
          // H3: Manual API Key (unchanged)
          provider: "anthropic",
          label: "Manually enter API Key",
          type: "api"
        }
      ]
    }
  };
}
export {
  AnthropicAuthPlugin
};
