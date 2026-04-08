/**
 * Unit tests for lib/oauth.mjs — shared OAuth helpers.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock @openauthjs/openauth/pkce
vi.mock("@openauthjs/openauth/pkce", () => ({
  generatePKCE: vi.fn(async () => ({
    challenge: "test-challenge",
    verifier: "test-verifier",
  })),
}));

// Mock global fetch
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

import { authorize, exchange, revoke, refreshToken } from "./oauth.mjs";
import { CLIENT_ID } from "./config.mjs";

beforeEach(() => {
  mockFetch.mockReset();
});

// ---------------------------------------------------------------------------
// refreshToken
// ---------------------------------------------------------------------------

describe("refreshToken", () => {
  it("returns token data on successful refresh", async () => {
    const tokenData = {
      access_token: "new-access",
      refresh_token: "new-refresh",
      expires_in: 3600,
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => tokenData,
    });

    const result = await refreshToken("old-refresh");

    expect(result).toEqual(tokenData);
    expect(mockFetch).toHaveBeenCalledTimes(1);

    const [url, opts] = mockFetch.mock.calls[0];
    expect(url).toBe("https://platform.claude.com/v1/oauth/token");
    expect(opts.method).toBe("POST");
    expect(opts.headers["Content-Type"]).toBe("application/x-www-form-urlencoded");

    const body = new URLSearchParams(opts.body);
    expect(body.get("grant_type")).toBe("refresh_token");
    expect(body.get("client_id")).toBe(CLIENT_ID);
    expect(body.get("refresh_token")).toBe("old-refresh");
  });

  it("throws with status and error code on HTTP 400", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: async () => JSON.stringify({ error: "invalid_grant" }),
    });

    const error = await refreshToken("bad-refresh").catch((e) => e);

    expect(error).toBeInstanceOf(Error);
    expect(error.message).toContain("Token refresh failed");
    expect(error.message).toContain("400");
    expect(error.status).toBe(400);
    expect(error.code).toBe("invalid_grant");
  });

  it("throws with status on HTTP 401 (no error code in body)", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: async () => "Unauthorized",
    });

    const error = await refreshToken("expired-refresh").catch((e) => e);

    expect(error).toBeInstanceOf(Error);
    expect(error.message).toContain("401");
    expect(error.status).toBe(401);
    expect(error.code).toBeUndefined();
  });

  it("propagates network errors from fetch", async () => {
    mockFetch.mockRejectedValueOnce(new Error("network failure"));

    await expect(refreshToken("any-refresh")).rejects.toThrow("network failure");
  });

  it("passes AbortSignal through to fetch", async () => {
    const controller = new AbortController();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: "a", refresh_token: "r", expires_in: 3600 }),
    });

    await refreshToken("refresh-val", { signal: controller.signal });

    const [, opts] = mockFetch.mock.calls[0];
    expect(opts.signal).toBe(controller.signal);
  });

  it("does not include signal when not provided", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: "a", refresh_token: "r", expires_in: 3600 }),
    });

    await refreshToken("refresh-val");

    const [, opts] = mockFetch.mock.calls[0];
    expect(opts.signal).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// authorize
// ---------------------------------------------------------------------------

describe("authorize", () => {
  it("returns url and verifier shape", async () => {
    const result = await authorize("max");

    expect(result).toHaveProperty("url");
    expect(result).toHaveProperty("verifier");
    expect(typeof result.url).toBe("string");
    expect(typeof result.verifier).toBe("string");
  });

  it("constructs URL with correct client_id for max mode", async () => {
    const result = await authorize("max");
    const url = new URL(result.url);

    expect(url.origin).toBe("https://claude.ai");
    expect(url.searchParams.get("client_id")).toBe(CLIENT_ID);
    expect(url.searchParams.get("redirect_uri")).toBe("https://platform.claude.com/oauth/code/callback");
    expect(url.searchParams.get("response_type")).toBe("code");
  });

  it("constructs URL with console origin for console mode", async () => {
    const result = await authorize("console");
    const url = new URL(result.url);

    expect(url.origin).toBe("https://platform.claude.com");
    expect(url.searchParams.get("client_id")).toBe(CLIENT_ID);
  });
});

// ---------------------------------------------------------------------------
// exchange
// ---------------------------------------------------------------------------

describe("exchange", () => {
  it("returns success credentials on successful exchange", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        access_token: "access-123",
        refresh_token: "refresh-123",
        expires_in: 3600,
        account: { email_address: "user@example.com" },
      }),
    });

    const result = await exchange("code#state", "verifier-abc");

    expect(result.type).toBe("success");
    expect(result.refresh).toBe("refresh-123");
    expect(result.access).toBe("access-123");
    expect(result.expires).toBeGreaterThan(Date.now());
    expect(result.email).toBe("user@example.com");

    const [url, opts] = mockFetch.mock.calls[0];
    expect(url).toBe("https://platform.claude.com/v1/oauth/token");
    const body = JSON.parse(opts.body);
    expect(body.code).toBe("code");
    expect(body.state).toBe("state");
    expect(body.code_verifier).toBe("verifier-abc");
    expect(body.client_id).toBe(CLIENT_ID);
  });

  it("returns failed on HTTP error", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
    });

    const result = await exchange("bad-code#state", "verifier");

    expect(result).toEqual({ type: "failed" });
  });
});

// ---------------------------------------------------------------------------
// revoke
// ---------------------------------------------------------------------------

describe("revoke", () => {
  it("returns true on successful revocation", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true });

    const result = await revoke("refresh-to-revoke");

    expect(result).toBe(true);

    const [url, opts] = mockFetch.mock.calls[0];
    expect(url).toBe("https://platform.claude.com/v1/oauth/revoke");
    const body = JSON.parse(opts.body);
    expect(body.token).toBe("refresh-to-revoke");
    expect(body.token_type_hint).toBe("refresh_token");
    expect(body.client_id).toBe(CLIENT_ID);
  });

  it("returns false on HTTP error (does not throw)", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 404 });

    const result = await revoke("unknown-token");

    expect(result).toBe(false);
  });

  it("returns false on network error (does not throw)", async () => {
    mockFetch.mockRejectedValueOnce(new Error("network down"));

    const result = await revoke("any-token");

    expect(result).toBe(false);
  });
});
