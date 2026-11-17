# Day 3 Plan: Sage Accounting Connector for Buki

**Author:** Rishabh Bothra  
**Target Reviewer:** Vivek Chandrasekar (`vivekschandrasekar-beep`)  
**Repository:** `github.com/rishbahjain270804/buki-sage` (private fork of `MyBuki/buki-connector-kit`)

---

## 1. What I Am Pulling from Sage

Sage Business Cloud Accounting (v3.1) organizes company financials into several discrete entities. The connector will pull:

1. **`ledger_accounts` & `bank_accounts`**:
   - Accounts: nominal code, name, account type (`BANK`, `SALES`, `EXPENSE`, `CURRENT_ASSETS`, `CURRENT_LIABILITY`, `EQUITY`).
   - Bank accounts: maps bank account records to their underlying nominal asset ledger accounts.
2. **`contacts`**:
   - Customers and vendors (`contact_type_ids: ["CUSTOMER", "VENDOR"]`), primary contact email, and business name.
3. **`sales_invoices` & `purchase_invoices`**:
   - Invoices: invoice number, issue date, due date, status (`DRAFT`, `UNPAID`, `PART_PAID`, `PAID`, `VOID`), currency, gross total, and outstanding balance.
   - Line items: line description, destination ledger account id, line net amount (pre-tax), and VAT amounts.
4. **`bank_transactions`**:
   - Date, signed amount (money in positive, money out negative), source bank account id, description/reference, contact id, and posted ledger account id.

**What is left out and why:**
- **Quotes, Estimates, and Purchase Orders**: Uncommitted pipeline documents that have not entered the ledger.
- **Stock/Inventory movements**: Buki’s Finance module focuses on cash, receivables, and category spend; inventory valuation is omitted.
- **Tax Rates and VAT return schedules**: In Buki, invoice lines record net spend; VAT schedules are left to Sage’s native tax filing engine.

---

## 2. Mapping onto Canonical Types

The connector enforces Buki’s **strict absence rule**: optional fields without values (`dueDate`, `email`, `code`) are completely omitted from output objects, never defaulted to `null` or `""`.

- **`LedgerAccount`**:
  `id = "sage:" + account.id`, `source = "sage"`, `code` (optional string), `name`, `type` mapped to one of `"asset" | "liability" | "equity" | "income" | "expense"`.
- **`Party`**:
  `id = "sage:" + contact.id`, `kind = "customer" | "supplier" | "both"`. `email` is included only when non-empty.
- **`Invoice`**:
  Unified sales and purchase invoices with `kind: "sales" | "purchase"`. `status` maps to `"draft" | "unpaid" | "part_paid" | "paid" | "void"`. Lines map `accountId: "sage:" + line.ledger_account.id` and `net: line.net_amount`.
- **`BankTransaction`**:
  `bankAccountId` maps to the canonical ledger asset account (`sage:acc-...`) ensuring referential integrity with `accounts`. Amount sign is normalized: payments are negative, receipts are positive.

---

## 3. How It Stays in Sync

1. **OAuth 2.0 Token Lifecycle**:
   - Sage access tokens expire every 300 seconds (5 minutes).
   - Proactive refresh: Before executing an API batch, the client checks token expiration. If < 30 seconds remain, it automatically refreshes via `POST https://oauth.accounting.sage.com/token` using the persisted refresh token.
   - Reactive recovery: A 401 response automatically triggers a refresh and single retry before failing.
   - Tokens live in `.data/sage_tokens.json` outside version control.
2. **Synchronization Strategy**:
   - The sync runs on a schedule via `npm run cron` every `SYNC_INTERVAL_SECONDS`.
   - Each run pulls all four collections concurrently via `Promise.all`.
   - `runSync.ts` diffs pulled records against `.data/store.json` by id and deterministic JSON hashing.
   - If a change is made in Sage (e.g. an invoice marked paid or edited), the next tick reports `finance/sage: changed: 1` and updates the store atomically.
   - If Sage is offline or returns an error, the sync records `ok: false` with the error detail while preserving existing store data, ensuring Buki never shows an accidental zero.

---

## 4. Questions for Vivek

1. **VAT Handling in Briefs**: For purchase invoice lines, Buki answers "what did we spend on software last month" using line `net`. Should team spend questions strictly report pre-tax net or gross inclusive of non-recoverable VAT?
2. **Rate Limits on Large Ledger Accounts**: For high-volume companies with thousands of bank transactions, does Buki favor paging 100 items per request with backoff, or switching to incremental `updated_or_created_since` filters on subsequent cron cycles?
