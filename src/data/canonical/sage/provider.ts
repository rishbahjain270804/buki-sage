/**
 * The Sage FinanceProvider: the single object registered with the canonical layer.
 *
 * Implements the FinanceProvider contract:
 * - health(): lightweight check reporting connectivity and business name/id
 * - accounts(): normalized chart of accounts including bank accounts
 * - parties(): normalized customers and suppliers
 * - invoices(): normalized sales and purchase invoices
 * - bankTransactions(): normalized signed bank transactions
 */

import type {
  BankTransaction,
  Invoice,
  LedgerAccount,
  Party,
} from "../types";
import type { FinanceProvider, ProviderHealth } from "../providers/types";
import { configFromEnv, describe, SageClient, SageError } from "./client";
import {
  normalizeAccounts,
  normalizeBankTransactions,
  normalizeInvoices,
  normalizeParties,
} from "./normalize";

export const sageProvider: FinanceProvider = {
  source: "sage",

  async health(): Promise<ProviderHealth> {
    try {
      const config = await configFromEnv();
      const client = new SageClient(config);

      const businesses = await client.businesses();
      const targetBiz = businesses.find((b) => b.id === config.businessId) || businesses[0];
      const bizName = targetBiz?.name || config.businessId || "default business";

      return {
        ok: true,
        detail: `Connected to Sage Accounting for "${bizName}" at ${config.baseUrl}`,
      };
    } catch (err) {
      const kind = err instanceof SageError ? err.kind : "unknown";
      return {
        ok: false,
        detail: `${kind}: ${describe(err)}`,
      };
    }
  },

  async accounts(): Promise<LedgerAccount[]> {
    const config = await configFromEnv();
    const client = new SageClient(config);

    const [rawAccounts, rawBankAccounts] = await Promise.all([
      client.ledgerAccounts(),
      client.bankAccounts(),
    ]);

    const accounts = normalizeAccounts(rawAccounts);
    const existingIds = new Set(accounts.map((a) => a.id));

    // Ensure any bank account whose ledger account is missing from chart of accounts is included as an asset
    for (const ba of rawBankAccounts) {
      const accId = ba.ledger_account?.id || ba.id;
      const canonicalId = accId.startsWith("sage:") ? accId : `sage:${accId}`;
      if (!existingIds.has(canonicalId)) {
        accounts.push({
          id: canonicalId,
          source: "sage",
          sourceId: accId,
          code: ba.nominal_code ? String(ba.nominal_code) : undefined,
          name: ba.displayed_as || ba.bank_account_details?.account_name || "Bank Account",
          type: "asset",
        });
        existingIds.add(canonicalId);
      }
    }

    return accounts;
  },

  async parties(): Promise<Party[]> {
    const config = await configFromEnv();
    const client = new SageClient(config);
    const rawContacts = await client.contacts();
    return normalizeParties(rawContacts);
  },

  async invoices(since?: string): Promise<Invoice[]> {
    const config = await configFromEnv();
    const client = new SageClient(config);

    const [sales, purchases] = await Promise.all([
      client.salesInvoices(since),
      client.purchaseInvoices(since),
    ]);

    return normalizeInvoices(sales, purchases);
  },

  async bankTransactions(since?: string): Promise<BankTransaction[]> {
    const config = await configFromEnv();
    const client = new SageClient(config);

    const [rawTxns, rawBankAccounts] = await Promise.all([
      client.bankTransactions(since),
      client.bankAccounts(),
    ]);

    return normalizeBankTransactions(rawTxns, rawBankAccounts);
  },
};
