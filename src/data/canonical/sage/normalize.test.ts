import { describe, expect, it } from "vitest";
import { validateFinanceSet } from "../../../lib/check/validate";
import {
  normalizeAccount,
  normalizeAccounts,
  normalizeBankTransaction,
  normalizeBankTransactions,
  normalizeInvoice,
  normalizeInvoices,
  normalizeParty,
  normalizeParties,
} from "./normalize";
import type {
  SageBankAccount,
  SageBankTransaction,
  SageContact,
  SageInvoice,
  SageLedgerAccount,
} from "./raw/types";

describe("Sage Normalize", () => {
  describe("normalizeAccount", () => {
    it("maps nominal code, source id, and account type to canonical shape", () => {
      const raw: SageLedgerAccount = {
        id: "acc-1200",
        name: "Operating account",
        nominal_code: 1200,
        ledger_account_type: { id: "BANK" },
        updated_at: "2026-01-05T09:00:00Z",
      };

      const canonical = normalizeAccount(raw);
      expect(canonical).toEqual({
        id: "sage:acc-1200",
        source: "sage",
        sourceId: "acc-1200",
        name: "Operating account",
        code: "1200",
        type: "asset",
        sourceUpdatedAt: "2026-01-05T09:00:00Z",
      });
    });

    it("leaves code absent when missing (never defaults to null or empty)", () => {
      const raw: SageLedgerAccount = {
        id: "acc-9999",
        name: "Misc Income",
        ledger_account_type: { id: "SALES" },
      };

      const canonical = normalizeAccount(raw);
      expect(canonical.code).toBeUndefined();
      expect("code" in canonical).toBe(false);
      expect(canonical.type).toBe("income");
    });

    it("correctly infers types from nominal code fallback", () => {
      expect(normalizeAccount({ id: "1", name: "A", nominal_code: 1500 }).type).toBe("asset");
      expect(normalizeAccount({ id: "2", name: "B", nominal_code: 2200 }).type).toBe("liability");
      expect(normalizeAccount({ id: "3", name: "C", nominal_code: 3100 }).type).toBe("equity");
      expect(normalizeAccount({ id: "4", name: "D", nominal_code: 4200 }).type).toBe("income");
      expect(normalizeAccount({ id: "5", name: "E", nominal_code: 7500 }).type).toBe("expense");
    });
  });

  describe("normalizeParty", () => {
    it("maps customer contact with email", () => {
      const raw: SageContact = {
        id: "con-100",
        name: "Acme Corp",
        contact_type_ids: ["CUSTOMER"],
        email: "billing@acme.example",
        updated_at: "2026-02-01T10:00:00Z",
      };

      const party = normalizeParty(raw);
      expect(party).toEqual({
        id: "sage:con-100",
        source: "sage",
        sourceId: "con-100",
        name: "Acme Corp",
        kind: "customer",
        email: "billing@acme.example",
        sourceUpdatedAt: "2026-02-01T10:00:00Z",
      });
    });

    it("omits email when missing or empty string", () => {
      const raw: SageContact = {
        id: "con-101",
        name: "Vendor Only",
        contact_type_ids: ["VENDOR"],
        email: "   ",
      };

      const party = normalizeParty(raw);
      expect(party.kind).toBe("supplier");
      expect("email" in party).toBe(false);
    });

    it("identifies both customer and supplier", () => {
      const raw: SageContact = {
        id: "con-102",
        name: "Dual Partner",
        contact_type_ids: ["CUSTOMER", "VENDOR"],
      };

      expect(normalizeParty(raw).kind).toBe("both");
    });
  });

  describe("normalizeInvoice", () => {
    it("maps sales invoice lines and status", () => {
      const raw: SageInvoice = {
        id: "si-500",
        invoice_number: "INV-500",
        date: "2026-10-01",
        due_date: "2026-10-31",
        status: { id: "UNPAID" },
        contact: { id: "con-100" },
        currency: { id: "USD" },
        total_amount: 5000,
        outstanding_amount: 5000,
        invoice_lines: [
          { description: "Consulting", ledger_account: { id: "acc-4000" }, net_amount: 5000 },
        ],
      };

      const inv = normalizeInvoice(raw, "sales");
      expect(inv).toEqual({
        id: "sage:si-500",
        source: "sage",
        sourceId: "si-500",
        kind: "sales",
        partyId: "sage:con-100",
        number: "INV-500",
        date: "2026-10-01",
        dueDate: "2026-10-31",
        status: "unpaid",
        currency: "USD",
        total: 5000,
        outstanding: 5000,
        lines: [
          { description: "Consulting", accountId: "sage:acc-4000", net: 5000 },
        ],
      });
    });

    it("omits dueDate when absent", () => {
      const raw: SageInvoice = {
        id: "si-501",
        date: "2026-10-15",
        contact: { id: "con-100" },
        total_amount: 1000,
        outstanding_amount: 1000,
      };

      const inv = normalizeInvoice(raw, "sales");
      expect("dueDate" in inv).toBe(false);
    });
  });

  describe("normalizeBankTransaction", () => {
    it("maps transaction and inverts amount for payments", () => {
      const raw: SageBankTransaction = {
        id: "bt-201",
        date: "2026-09-15",
        amount: 2500,
        bank_account: { id: "ba-1" },
        transaction_type: { id: "PAYMENT" },
        description: "Rent payment",
        ledger_account: { id: "acc-7100" },
      };

      const map = new Map([["ba-1", "acc-1200"]]);
      const tx = normalizeBankTransaction(raw, map);

      expect(tx).toEqual({
        id: "sage:bt-201",
        source: "sage",
        sourceId: "bt-201",
        bankAccountId: "sage:acc-1200",
        date: "2026-09-15",
        amount: -2500, // Inverted because PAYMENT
        currency: "USD",
        description: "Rent payment",
        accountId: "sage:acc-7100",
      });
    });
  });

  describe("Complete Set Validation", () => {
    it("passes Buki validateFinanceSet check with 0 errors and 0 warnings", () => {
      const rawAccounts: SageLedgerAccount[] = [
        { id: "acc-1200", name: "Operating account", nominal_code: 1200, ledger_account_type: { id: "BANK" } },
        { id: "acc-4000", name: "Sales", nominal_code: 4000, ledger_account_type: { id: "SALES" } },
        { id: "acc-7500", name: "Software subscriptions", nominal_code: 7500, ledger_account_type: { id: "EXPENSE" } },
      ];

      const rawContacts: SageContact[] = [
        { id: "con-1", name: "Client A", contact_type_ids: ["CUSTOMER"], email: "a@test.com" },
        { id: "con-2", name: "Vendor B", contact_type_ids: ["VENDOR"] },
      ];

      const rawSales: SageInvoice[] = [
        {
          id: "si-1",
          invoice_number: "INV-1",
          date: "2026-10-01",
          due_date: "2026-10-15",
          status: { id: "UNPAID" },
          contact: { id: "con-1" },
          currency: { id: "USD" },
          total_amount: 1000,
          outstanding_amount: 1000,
          invoice_lines: [{ description: "Service", ledger_account: { id: "acc-4000" }, net_amount: 1000 }],
        },
      ];

      const rawPurchases: SageInvoice[] = [
        {
          id: "pi-1",
          invoice_number: "BILL-1",
          date: "2026-10-02",
          due_date: "2026-11-02",
          status: { id: "UNPAID" },
          contact: { id: "con-2" },
          currency: { id: "USD" },
          total_amount: 500,
          outstanding_amount: 500,
          invoice_lines: [{ description: "SaaS", ledger_account: { id: "acc-7500" }, net_amount: 500 }],
        },
      ];

      const rawBankAccounts: SageBankAccount[] = [
        { id: "ba-1", ledger_account: { id: "acc-1200" } },
      ];

      const rawTxns: SageBankTransaction[] = [
        {
          id: "tx-1",
          date: "2026-10-05",
          amount: 1000,
          bank_account: { id: "ba-1" },
          transaction_type: { id: "RECEIPT" },
          description: "Client payment",
          contact: { id: "con-1" },
        },
      ];

      const accounts = normalizeAccounts(rawAccounts);
      const parties = normalizeParties(rawContacts);
      const invoices = normalizeInvoices(rawSales, rawPurchases);
      const bankTransactions = normalizeBankTransactions(rawTxns, rawBankAccounts);

      const result = validateFinanceSet({ accounts, parties, invoices, bankTransactions });

      expect(result.errors).toEqual([]);
      expect(result.warnings).toEqual([]);
      expect(result.set).not.toBeNull();
    });
  });
});
