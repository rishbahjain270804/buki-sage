/**
 * Pure transformations from raw Sage v3.1 shapes to Buki canonical shapes.
 *
 * Rules:
 * - Pure: inputs in, canonical records out. No I/O, no network, no side effects.
 * - Strict absence: an optional field that is missing or empty MUST be left absent.
 *   Never set it to null, "", or undefined.
 * - Canonical IDs: every canonical id is `sage:${sourceId}`.
 * - Referential integrity: bankAccountId must reference a canonical LedgerAccount (asset).
 */

import {
  type BankTransaction,
  type Invoice,
  type InvoiceLine,
  type LedgerAccount,
  type Party,
} from "../types";
import {
  type SageBankAccount,
  type SageBankTransaction,
  type SageContact,
  type SageInvoice,
  type SageLedgerAccount,
  type SagePurchaseInvoice,
  type SageSalesInvoice,
} from "./raw/types";

/**
 * Strips properties whose values are undefined, null, or empty strings.
 * Guarantees that optional fields are genuinely absent rather than defaulted.
 */
function cleanRecord<T extends Record<string, unknown>>(obj: T): T {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null) continue;
    if (typeof value === "string" && value.trim() === "") continue;
    result[key] = value;
  }
  return result as T;
}

// ---------------------------------------------------------------------------
// Accounts
// ---------------------------------------------------------------------------

function mapAccountType(
  typeId?: string,
  nominalCode?: number | string,
): "asset" | "liability" | "equity" | "income" | "expense" {
  const t = (typeId || "").toUpperCase();

  if (
    t.includes("BANK") ||
    t.includes("CURRENT_ASSET") ||
    t.includes("FIXED_ASSET") ||
    t === "ASSET" ||
    t === "DEBTOR"
  ) {
    return "asset";
  }

  if (
    t.includes("CURRENT_LIABILITY") ||
    t.includes("LIABILITY") ||
    t.includes("CREDITOR") ||
    t.includes("LOAN")
  ) {
    return "liability";
  }

  if (t.includes("EQUITY") || t.includes("CAPITAL")) {
    return "equity";
  }

  if (t.includes("SALES") || t.includes("INCOME") || t.includes("REVENUE")) {
    return "income";
  }

  if (t.includes("EXPENSE") || t.includes("OVERHEAD") || t.includes("COST")) {
    return "expense";
  }

  // Fallback by standard UK / Sage nominal code ranges
  const code = Number(nominalCode);
  if (!Number.isNaN(code)) {
    if (code >= 1000 && code < 2000) return "asset";
    if (code >= 2000 && code < 3000) return "liability";
    if (code >= 3000 && code < 4000) return "equity";
    if (code >= 4000 && code < 5000) return "income";
    if (code >= 5000 && code < 10000) return "expense";
  }

  return "expense";
}

export function normalizeAccount(raw: SageLedgerAccount): LedgerAccount {
  const codeStr = raw.nominal_code !== undefined && raw.nominal_code !== null ? String(raw.nominal_code).trim() : undefined;

  const account: LedgerAccount = {
    id: `sage:${raw.id}`,
    source: "sage",
    sourceId: raw.id,
    name: raw.name || raw.displayed_as || `Account ${raw.id}`,
    type: mapAccountType(raw.ledger_account_type?.id, raw.nominal_code),
  };

  if (codeStr) {
    account.code = codeStr;
  }
  if (raw.updated_at) {
    account.sourceUpdatedAt = raw.updated_at;
  }

  return cleanRecord(account as unknown as Record<string, unknown>) as unknown as LedgerAccount;
}

export function normalizeAccounts(rawAccounts: SageLedgerAccount[]): LedgerAccount[] {
  return rawAccounts.map(normalizeAccount);
}

// ---------------------------------------------------------------------------
// Parties (Customers & Suppliers)
// ---------------------------------------------------------------------------

function mapContactKind(types: string[] = []): "customer" | "supplier" | "both" {
  const upper = types.map((t) => t.toUpperCase());
  const isCustomer = upper.some((t) => t.includes("CUSTOMER"));
  const isSupplier = upper.some((t) => t.includes("VENDOR") || t.includes("SUPPLIER"));

  if (isCustomer && isSupplier) return "both";
  if (isSupplier) return "supplier";
  return "customer";
}

export function normalizeParty(raw: SageContact): Party {
  const emailCandidate = (raw.email || raw.main_contact_person?.email || "").trim();

  const party: Party = {
    id: `sage:${raw.id}`,
    source: "sage",
    sourceId: raw.id,
    name: raw.name || raw.displayed_as || `Contact ${raw.id}`,
    kind: mapContactKind(raw.contact_type_ids),
  };

  if (emailCandidate) {
    party.email = emailCandidate;
  }
  if (raw.updated_at) {
    party.sourceUpdatedAt = raw.updated_at;
  }

  return cleanRecord(party as unknown as Record<string, unknown>) as unknown as Party;
}

export function normalizeParties(rawContacts: SageContact[]): Party[] {
  return rawContacts.map(normalizeParty);
}

// ---------------------------------------------------------------------------
// Invoices
// ---------------------------------------------------------------------------

function mapInvoiceStatus(
  statusId?: string,
  total = 0,
  outstanding = 0,
): "draft" | "unpaid" | "part_paid" | "paid" | "void" {
  const s = (statusId || "").toUpperCase().trim();
  if (s === "VOID" || s.includes("VOID")) return "void";
  if (s === "DRAFT" || s.includes("DRAFT")) return "draft";
  if (s === "PART_PAID" || s === "PARTPAID" || s.includes("PART")) return "part_paid";
  if (s === "UNPAID") {
    if (outstanding <= 0 && total > 0) return "paid";
    if (outstanding < total && outstanding > 0) return "part_paid";
    return "unpaid";
  }
  if (s === "PAID") return "paid";

  if (outstanding <= 0 && total > 0) return "paid";
  if (outstanding > 0 && outstanding < total) return "part_paid";
  return "unpaid";
}

export function normalizeInvoice(
  raw: SageInvoice,
  kind: "sales" | "purchase",
  defaultAccountId?: string,
): Invoice {
  const lines: InvoiceLine[] = (raw.invoice_lines || []).map((line) => {
    const rawAccId = line.ledger_account?.id || defaultAccountId || "acc-4000";
    const canonicalAccId = rawAccId.startsWith("sage:") ? rawAccId : `sage:${rawAccId}`;
    return {
      description: line.description || "Line item",
      accountId: canonicalAccId,
      net: typeof line.net_amount === "number" ? line.net_amount : (line.total_amount ?? 0),
    };
  });

  // Ensure at least one line exists
  if (lines.length === 0) {
    const fallbackAccId = defaultAccountId || (kind === "sales" ? "acc-4000" : "acc-7500");
    lines.push({
      description: raw.displayed_as || "Invoice total",
      accountId: fallbackAccId.startsWith("sage:") ? fallbackAccId : `sage:${fallbackAccId}`,
      net: typeof raw.net_amount === "number" ? raw.net_amount : raw.total_amount,
    });
  }

  const rawPartyId = raw.contact?.id || "unknown";
  const canonicalPartyId = rawPartyId.startsWith("sage:") ? rawPartyId : `sage:${rawPartyId}`;

  const inv: Invoice = {
    id: `sage:${raw.id}`,
    source: "sage",
    sourceId: raw.id,
    kind,
    partyId: canonicalPartyId,
    date: raw.date,
    status: mapInvoiceStatus(raw.status?.id, raw.total_amount, raw.outstanding_amount),
    currency: (raw.currency?.id || "USD").toUpperCase(),
    total: raw.total_amount,
    outstanding: raw.outstanding_amount,
    lines,
  };

  if (raw.invoice_number && raw.invoice_number.trim() !== "") {
    inv.number = raw.invoice_number.trim();
  }
  if (raw.due_date && raw.due_date.trim() !== "") {
    inv.dueDate = raw.due_date.trim();
  }
  if (raw.updated_at) {
    inv.sourceUpdatedAt = raw.updated_at;
  }

  return cleanRecord(inv as unknown as Record<string, unknown>) as unknown as Invoice;
}

export function normalizeInvoices(
  sales: SageSalesInvoice[],
  purchases: SagePurchaseInvoice[],
  salesDefaultAccountId?: string,
  purchaseDefaultAccountId?: string,
): Invoice[] {
  const normSales = sales.map((inv) => normalizeInvoice(inv, "sales", salesDefaultAccountId));
  const normPurchases = purchases.map((inv) => normalizeInvoice(inv, "purchase", purchaseDefaultAccountId));
  return [...normSales, ...normPurchases];
}

// ---------------------------------------------------------------------------
// Bank Transactions
// ---------------------------------------------------------------------------

export function normalizeBankTransaction(
  raw: SageBankTransaction,
  bankAccountToLedgerAccountMap: Map<string, string>,
  defaultCurrency = "USD",
): BankTransaction {
  // Resolve bank account id to canonical LedgerAccount id
  const rawBankId = raw.bank_account?.id || "";
  const mappedLedgerAccId = bankAccountToLedgerAccountMap.get(rawBankId) || rawBankId;
  const canonicalBankAccountId = mappedLedgerAccId.startsWith("sage:")
    ? mappedLedgerAccId
    : `sage:${mappedLedgerAccId}`;

  // Determine signed amount
  let amount = raw.amount;
  const typeId = (raw.transaction_type?.id || "").toUpperCase();
  if (typeId.includes("PAYMENT") || typeId.includes("EXPENSE") || typeId.includes("DEBIT")) {
    if (amount > 0) amount = -amount;
  } else if (typeId.includes("RECEIPT") || typeId.includes("INCOME") || typeId.includes("CREDIT")) {
    if (amount < 0) amount = Math.abs(amount);
  }

  const desc = (raw.description || raw.reference || "Bank transaction").trim();

  const tx: BankTransaction = {
    id: `sage:${raw.id}`,
    source: "sage",
    sourceId: raw.id,
    bankAccountId: canonicalBankAccountId,
    date: raw.date,
    amount,
    currency: defaultCurrency,
    description: desc,
  };

  if (raw.ledger_account?.id) {
    tx.accountId = `sage:${raw.ledger_account.id}`;
  }
  if (raw.contact?.id) {
    tx.partyId = `sage:${raw.contact.id}`;
  }
  if (raw.updated_at) {
    tx.sourceUpdatedAt = raw.updated_at;
  }

  return cleanRecord(tx as unknown as Record<string, unknown>) as unknown as BankTransaction;
}

export function normalizeBankTransactions(
  rawTxns: SageBankTransaction[],
  bankAccounts: SageBankAccount[],
  defaultCurrency = "USD",
): BankTransaction[] {
  const bankAccountMap = new Map<string, string>();
  for (const ba of bankAccounts) {
    if (ba.ledger_account?.id) {
      bankAccountMap.set(ba.id, ba.ledger_account.id);
    }
  }

  return rawTxns.map((tx) => normalizeBankTransaction(tx, bankAccountMap, defaultCurrency));
}
