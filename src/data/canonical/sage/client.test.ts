import { describe, expect, it, vi } from "vitest";
import { SageClient, SageError, type SageConfig } from "./client";

describe("SageClient", () => {
  const dummyConfig: SageConfig = {
    baseUrl: "https://api.accounting.sage.com/v3.1",
    oauthUrl: "https://oauth.accounting.sage.com/token",
    clientId: "test-client",
    clientSecret: "test-secret",
    businessId: "biz-123",
    tokens: {
      accessToken: "valid-token",
      refreshToken: "valid-refresh",
      expiresAt: Date.now() + 100_000,
      businessId: "biz-123",
      updatedAt: new Date().toISOString(),
    },
  };

  it("traverses pagination envelopes following $next links", async () => {
    const fetchMock = vi.fn();
    global.fetch = fetchMock;

    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          $total: 3,
          $page: 1,
          $next: "https://api.accounting.sage.com/v3.1/contacts?page=2",
          $itemsPerPage: 2,
          $items: [{ id: "c1", name: "Client 1" }, { id: "c2", name: "Client 2" }],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          $total: 3,
          $page: 2,
          $next: null,
          $itemsPerPage: 1,
          $items: [{ id: "c3", name: "Client 3" }],
        }),
      });

    const client = new SageClient(dummyConfig);
    const contacts = await client.contacts();

    expect(contacts).toHaveLength(3);
    expect(contacts.map((c) => c.id)).toEqual(["c1", "c2", "c3"]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("maps HTTP 401 error into SageError with kind 'auth'", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: async () => "Unauthorized",
    });
    global.fetch = fetchMock;

    const expiredConfig: SageConfig = {
      ...dummyConfig,
      tokens: {
        accessToken: "expired-token",
        refreshToken: "", // No refresh token so it fails immediately
        expiresAt: Date.now() + 100_000,
        updatedAt: new Date().toISOString(),
      },
    };

    const client = new SageClient(expiredConfig);
    await expect(client.contacts()).rejects.toThrowError(SageError);
  });

  it("maps HTTP 429 error into SageError with kind 'http'", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      text: async () => "Rate limit exceeded",
    });
    global.fetch = fetchMock;

    const client = new SageClient(dummyConfig);
    await expect(client.ledgerAccounts()).rejects.toThrowError(
      expect.objectContaining({ kind: "http", status: 429 }),
    );
  });
});
