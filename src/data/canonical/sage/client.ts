/**
 * The Sage Business Cloud Accounting v3.1 HTTP client.
 *
 * Handles:
 * - Proactive OAuth 2.0 token refresh (access tokens expire after 300s)
 * - Transparent retry on 401 expiration
 * - Cursor pagination through $next links
 * - X-Business header injection
 * - Timeout handling (10s) and error classification
 * - Configurable base URLs for both live API and offline mock server
 */

import {
  type SageBankAccount,
  type SageBankTransaction,
  type SageBusiness,
  type SageContact,
  type SageLedgerAccount,
  type SageListEnvelope,
  type SagePurchaseInvoice,
  type SageSalesInvoice,
  type SageTokenResponse,
} from "./raw/types";
import {
  isTokenExpired,
  readSageTokens,
  writeSageTokens,
  type StoredSageTokens,
} from "./tokenStore";

export type SageErrorKind = "config" | "auth" | "http" | "network" | "timeout" | "shape";

export class SageError extends Error {
  constructor(
    public readonly kind: SageErrorKind,
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "SageError";
  }
}

export interface SageConfig {
  baseUrl: string;
  oauthUrl: string;
  clientId: string;
  clientSecret: string;
  businessId?: string;
  tokens?: StoredSageTokens | null;
}

const REQUEST_TIMEOUT_MS = 10_000;

export function describe(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

export async function configFromEnv(env: NodeJS.ProcessEnv = process.env): Promise<SageConfig> {
  const baseUrl = (env.SAGE_BASE_URL || "https://api.accounting.sage.com/v3.1").replace(/\/+$/, "");
  const oauthUrl = (env.SAGE_OAUTH_URL || "https://oauth.accounting.sage.com/token").replace(/\/+$/, "");
  const clientId = env.SAGE_CLIENT_ID || "";
  const clientSecret = env.SAGE_CLIENT_SECRET || "";
  const businessId = env.SAGE_BUSINESS_ID || undefined;

  const tokens = await readSageTokens();

  // If we are pointing to the live API without credentials, raise config error
  if (!baseUrl.includes("localhost") && (!clientId || !clientSecret)) {
    throw new SageError(
      "config",
      "SAGE_CLIENT_ID and SAGE_CLIENT_SECRET must be set in .env (or run against mock server)",
    );
  }

  return {
    baseUrl,
    oauthUrl,
    clientId,
    clientSecret,
    businessId: businessId || tokens?.businessId,
    tokens,
  };
}

export class SageClient {
  private tokens: StoredSageTokens | null = null;

  constructor(private readonly config: SageConfig) {
    this.tokens = config.tokens ?? null;
  }

  /**
   * Refreshes the OAuth access token using the stored refresh token.
   */
  async refreshToken(): Promise<StoredSageTokens> {
    if (!this.tokens?.refreshToken) {
      throw new SageError("auth", "No refresh token available. Run npm run sage:auth first.");
    }

    const body = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: this.tokens.refreshToken,
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
    });

    let res: Response;
    try {
      res = await fetch(this.config.oauthUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
    } catch (err) {
      if (err instanceof Error && err.name === "TimeoutError") {
        throw new SageError("timeout", `Sage token refresh timed out after ${REQUEST_TIMEOUT_MS / 1000}s`);
      }
      throw new SageError("network", `Could not reach Sage OAuth at ${this.config.oauthUrl}: ${describe(err)}`);
    }

    if (!res.ok) {
      throw new SageError("auth", `Sage token refresh failed with status ${res.status}`, res.status);
    }

    let tokenData: SageTokenResponse;
    try {
      tokenData = (await res.json()) as SageTokenResponse;
    } catch {
      throw new SageError("shape", "Sage token endpoint returned invalid JSON");
    }

    const updated = await writeSageTokens({
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresIn: tokenData.expires_in,
      businessId: this.config.businessId,
    });

    this.tokens = updated;
    return updated;
  }

  /**
   * Ensures an active, unexpired access token is available before calling an API.
   */
  private async ensureValidToken(): Promise<string> {
    if (!this.tokens) {
      this.tokens = await readSageTokens();
    }

    // In local mock mode, a dummy token is acceptable if no tokens exist
    if (!this.tokens && this.config.baseUrl.includes("localhost")) {
      return "mock-access-token";
    }

    if (!this.tokens) {
      throw new SageError("auth", "No Sage access token found. Run npm run sage:auth first.");
    }

    if (isTokenExpired(this.tokens)) {
      const refreshed = await this.refreshToken();
      return refreshed.accessToken;
    }

    return this.tokens.accessToken;
  }

  /**
   * Performs an HTTP request with error handling and retry on 401 token expiration.
   */
  private async request<T>(urlStr: string, isRetry = false): Promise<T> {
    const token = await this.ensureValidToken();
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    };

    if (this.config.businessId) {
      headers["X-Business"] = this.config.businessId;
    }

    let res: Response;
    try {
      res = await fetch(urlStr, {
        headers,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
    } catch (err) {
      if (err instanceof Error && err.name === "TimeoutError") {
        throw new SageError("timeout", `Sage request timed out: ${urlStr}`);
      }
      throw new SageError("network", `Network error reaching Sage: ${describe(err)}`);
    }

    // If unauthorized and we haven't retried yet, refresh token and retry
    if (res.status === 401 && !isRetry && this.tokens?.refreshToken) {
      await this.refreshToken();
      return this.request<T>(urlStr, true);
    }

    if (res.status === 401 || res.status === 403) {
      throw new SageError("auth", `Sage authorization rejected (HTTP ${res.status})`, res.status);
    }

    if (res.status === 429) {
      throw new SageError("http", "Sage rate limit exceeded (HTTP 429)", res.status);
    }

    if (!res.ok) {
      throw new SageError("http", `Sage responded with HTTP ${res.status}`, res.status);
    }

    try {
      return (await res.json()) as T;
    } catch {
      throw new SageError("shape", "Sage response was not valid JSON");
    }
  }

  /**
   * Builds endpoint URL with query params.
   */
  private url(path: string, query?: Record<string, string>): string {
    const full = `${this.config.baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
    const u = new URL(full);
    if (query) {
      for (const [k, v] of Object.entries(query)) {
        if (v !== undefined && v !== "") {
          u.searchParams.set(k, v);
        }
      }
    }
    return u.toString();
  }

  /**
   * Exhausts all pages of an envelope list endpoint following $next cursors.
   */
  async fetchAllPages<T>(endpoint: string, query?: Record<string, string>): Promise<T[]> {
    let nextUrl: string | null = this.url(endpoint, { items_per_page: "100", ...query });
    const allItems: T[] = [];

    while (nextUrl) {
      const response: SageListEnvelope<T> | T[] = await this.request<SageListEnvelope<T> | T[]>(nextUrl);
      if (Array.isArray(response)) {
        allItems.push(...response);
        break;
      } else if (response && Array.isArray(response.$items)) {
        allItems.push(...response.$items);
        if (response.$next) {
          if (response.$next.startsWith("http://") || response.$next.startsWith("https://")) {
            nextUrl = response.$next;
          } else {
            nextUrl = `${this.config.baseUrl}${response.$next.startsWith("/") ? "" : "/"}${response.$next}`;
          }
        } else {
          nextUrl = null;
        }
      } else {
        nextUrl = null;
      }
    }

    return allItems;
  }

  // ---------------------------------------------------------------------------
  // Resource Accessors
  // ---------------------------------------------------------------------------

  async businesses(): Promise<SageBusiness[]> {
    const url = this.url("/businesses");
    const data: SageListEnvelope<SageBusiness> | SageBusiness[] = await this.request<SageListEnvelope<SageBusiness> | SageBusiness[]>(url);
    if (Array.isArray(data)) return data;
    return data.$items || [];
  }

  async ledgerAccounts(since?: string): Promise<SageLedgerAccount[]> {
    const query = since ? { updated_or_created_since: since } : undefined;
    return this.fetchAllPages<SageLedgerAccount>("/ledger_accounts", query);
  }

  async contacts(since?: string): Promise<SageContact[]> {
    const query = since ? { updated_or_created_since: since } : undefined;
    return this.fetchAllPages<SageContact>("/contacts", query);
  }

  async salesInvoices(since?: string): Promise<SageSalesInvoice[]> {
    const query = since ? { updated_or_created_since: since } : undefined;
    return this.fetchAllPages<SageSalesInvoice>("/sales_invoices", query);
  }

  async purchaseInvoices(since?: string): Promise<SagePurchaseInvoice[]> {
    const query = since ? { updated_or_created_since: since } : undefined;
    return this.fetchAllPages<SagePurchaseInvoice>("/purchase_invoices", query);
  }

  async bankAccounts(): Promise<SageBankAccount[]> {
    return this.fetchAllPages<SageBankAccount>("/bank_accounts");
  }

  async bankTransactions(since?: string): Promise<SageBankTransaction[]> {
    const query = since ? { updated_or_created_since: since } : undefined;
    return this.fetchAllPages<SageBankTransaction>("/bank_transactions", query);
  }
}
