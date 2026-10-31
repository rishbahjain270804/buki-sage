# Pull Request: Bring Sage into Buki (Canonical Finance Connector)

**Candidate:** Rishabh Bothra  
**Challenge:** Bring Sage into Buki (`FinanceProvider`, Canonical v3.1)  
**Evaluator:** Vivek Chandrasekar (`vivek@mybuki.ai`, `@vivekschandrasekar-beep`)  
**Proof Profile:** [proof.zeromaintenanceengineer.in](https://proof.zeromaintenanceengineer.in)  
**Live Demo:** [country-bloom-portland-lovely.trycloudflare.com](https://country-bloom-portland-lovely.trycloudflare.com)

---

## 📖 Build Notebook (Complete 5-Step Log)

### Step 1 · Day 1: Understanding & Foundation
- **WORKS NOW:**
  - Verified Buki connector kit baseline and smoke tests against mock BambooHR (43 people on payroll, $2,228,000 engineering annual cost, September new hires).
  - Validated sample finance contract via `npm run check -- sample/finance.sample.json` (0 errors, 0 warnings).
- **TESTED:**
  - Evaluated the gap: `"How much cash do we have?"` and `"Who owes us money?"` return `No finance source connected yet. Set FINANCE_SOURCE=sage once the Sage connector is registered.`
- **BROKE:**
  - Sage access tokens expire in just 300 seconds (5 minutes). Background syncs would fail on subsequent cron cycles without proactive token refresh.
- **NEXT:**
  - Define 5 founder questions, compile pre-implementation test list, and draft Day-3 architecture plan.
- **FIVE FOUNDER QUESTIONS:**
  1. *"Who owes us money right now, and which receivables are overdue past their payment terms?"*
  2. *"What was our burn on software subscriptions last month compared to our recurring monthly budget?"*
  3. *"What is our total real cash across all operating and reserve bank accounts today?"*
  4. *"Who are our top revenue-generating customers, and who among them has the highest unpaid balance?"*
  5. *"What did we bill in sales invoices last month, and what portion has already landed as cash in the bank?"*
- **LINK:** `https://github.com/rishbahjain270804/buki-sage/tree/v0.1.0-smoke-test`

---

### Step 2 · Days 2–3: Test List & Architecture Plan
- **WORKS NOW:**
  - Wrote `TEST_LIST.md` with 20 pre-written test scenarios covering OAuth token refresh, pagination, canonical normalization, absence rule validation, and scheduled change pickup.
  - Drafted and verified `DAY3_PLAN.md` documenting resources to pull (`ledger_accounts`, `contacts`, `sales_invoices`, `purchase_invoices`, `bank_accounts`, `bank_transactions`) and nominal ledger referential integrity.
- **TESTED:**
  - Tested local callback port binding on `http://localhost:3000/api/sage/callback` for one-command CLI auth.
- **BROKE:**
  - Strict absence rule in `src/lib/check/validate.ts`: default values like `null`, `""`, or `"undefined"` cause fatal validation failures. Optional fields must be stripped clean.
- **NEXT:**
  - Build raw types, token manager, HTTP client with automatic token refreshing, and pure normalizer.
- **LINK:** `https://github.com/rishbahjain270804/buki-sage/blob/main/TEST_LIST.md`

---

### Step 3 · Days 4–8: Sage Connector Core
- **WORKS NOW:**
  - Implemented `src/data/canonical/sage/`:
    - `raw/types.ts`: Complete Sage v3.1 API schemas.
    - `tokenStore.ts`: Proactive token refresh with 30s buffer, stored in `.data/sage_tokens.json`.
    - `client.ts`: Pagination cursor traversal (`$next`), classified errors (`SageError`), proactive token refreshing and 401 retry.
    - `normalize.ts`: Pure transformations mapping accounts, parties, invoices, and bank transactions. Strips all nulls/empty strings.
    - `provider.ts`: Registered `sageProvider` in `src/data/canonical/providers/index.ts`.
    - `scripts/sage-auth.ts`: One-command OAuth flow with temporary local callback listener (`npm run sage:auth`).
    - `mock/sage/server.mjs`: Offline mock server (`npm run mock:sage`) on port 4020 for zero-friction evaluation.
  - All 40 unit and integration tests pass (`npm test`).
  - TypeScript compiler passes with 0 errors (`npm run typecheck`).
  - Pulled 32 records from Sage, added 32 into `.data/store.json`.
  - Both core brief questions answer accurately:
    - `"who owes us money"`: identifies 2 overdue invoices ($12,000 outstanding) and notes 1 open invoice with no due date.
    - `"what did we spend on software last month"`: answers $300 spent on Software subscriptions in September 2026.
  - `npm run show -- finance` prints verified cash balances ($253,615), invoiced revenue, overdue receivables, category spend, and customer rankings.
- **TESTED:**
  - `npm run health`: reports `finance sage ok Connected to Sage Accounting for "Halden Labs UK"`.
  - Normalized data validated against `validateFinanceSet()`: 0 errors, 0 warnings.
- **BROKE:**
  - Substring match bug in `mapInvoiceStatus`: `"UNPAID".includes("PAID")` returned `"paid"` for unpaid invoices, failing validation. Fixed by checking `"UNPAID"` before `"PAID"` and using exact status ID matching.
  - Bank transactions referential integrity: Sage bank accounts have distinct IDs from nominal ledger accounts. Fixed by building a `bankAccountToLedgerAccountMap` so `bankAccountId` always points to the corresponding asset nominal account.
- **NEXT:**
  - Verify automated background scheduling and demonstrate live change pickup after first sync.
- **LINK:** `https://github.com/rishbahjain270804/buki-sage/tree/v0.3.0-connector-core`

---

### Step 4 · Days 9–11: Scheduled Sync & Live Change Pickup
- **WORKS NOW:**
  - Scheduled synchronization via `npm run cron` runs on a loop every `SYNC_INTERVAL_SECONDS`.
  - Verified live change detection:
    - First sync: `pulled 32, added 32, changed 0, removed 0`.
    - Unmodified subsequent sync: `pulled 32, added 0, changed 0, removed 0`.
    - Modified invoice in Sage: next scheduled poll automatically reported `finance/sage: pulled 32, added 0, changed 1, removed 0`.
    - Brief queries immediately reflected the modified invoice balance without restarting the application.
- **TESTED:**
  - Tested graceful degradation: when Sage mock server was stopped, `npm run sync` recorded `ok: false` with the network error in `store.runs` while preserving existing canonical store data without displaying 0 or crashing.
- **BROKE:**
  - Union return type in `client.ts` envelope pagination resolved with explicit type annotation.
- **NEXT:**
  - Prepare submission note, record video walkthrough, and verify clean run from a fresh clone.
- **LINK:** `https://github.com/rishbahjain270804/buki-sage/tree/v0.4.0-cron-live-sync`

---

### Step 5 · Days 12–14: Final Verification & Submission Deliverables
- **WORKS NOW:**
  - Clean clone test flow passes 100% in under 60 seconds (`npm test`, `npm run typecheck`, `npm run health`, `npm run sync`, `npm run ask`).
  - Completed 1-page `SUBMISSION_NOTE.md` and 5-minute `VIDEO_GUIDE.md`.
  - Built full executive web dashboard (`npm run dashboard`) with Cloudflare Tunnel and live mutation sandbox.
- **TESTED:**
  - End-to-end audit: 40 tests passing across 7 suites in 370ms.
- **BROKE:**
  - Ensured `.data/` and `.env` are strictly gitignored so credentials and access tokens are never committed.
- **LINK:** `https://github.com/rishbahjain270804/buki-sage/tree/v1.0.0-final-verified`

---

## 📑 1-Page Submission Note Summary

1. **What We Pulled & What We Left Out:**
   - **Pulled:** `ledger_accounts` (nominal chart of accounts), `contacts` (parties with kind mapped to customer/supplier/both), `sales_invoices` & `purchase_invoices` (with itemized lines and net amounts), `bank_accounts` & `bank_transactions` (signed amounts, receipts positive, payments negative).
   - **Left Out:** Products, stock items, tax rates as standalone entities, invoice attachments, and contact addresses.
   - **The Absent-Never-Defaulted Rule:** If Sage holds no due date or payment date, the field is stripped clean (`undefined`). It is neither treated as 0 nor given dummy dates.
2. **Error Handling & Failure Modes:**
   - **Sage Slow/Timeout:** 10-second `AbortSignal` timeout prevents hangs.
   - **Sage Down (5xx / Connection refused):** Recorded as `ok: false` in `store.runs`; existing canonical data remains intact so dashboards never show $0.
   - **401 Unauthorized:** Transparent single retry after refreshing the OAuth token.
   - **Rate Limits (429):** Categorized as typed `SageError("http")`.
3. **What I Would Still Worry About in Production:**
   - Multi-currency exchange rate drift across long reporting intervals.
   - Webhook-driven delta syncs (`updated_or_created_since`) for high-volume enterprise ledgers with >10,000 transactions/month.

---

## 🔗 Live Proof Platform Records

| Step | Type | Verified Proof Link |
| :--- | :--- | :--- |
| **Step 1** | Decided | [0d152c0f](https://proof.zeromaintenanceengineer.in/next/log/0d152c0f-6bff-4240-be00-e5582d6b47c8) |
| **Step 1** | Built | [a243a6a2](https://proof.zeromaintenanceengineer.in/next/log/a243a6a2-226b-4e79-beb3-b498ac508adc) |
| **Step 2** | Built | [ff68220f](https://proof.zeromaintenanceengineer.in/next/log/ff68220f-8924-48b8-ba57-d16dfbd4ff3f) |
| **Step 2** | Decided | [8f8e032a](https://proof.zeromaintenanceengineer.in/next/log/8f8e032a-3515-4ad6-9a58-eecf4cb0d109) |
| **Step 3** | Built | [64fe5e75](https://proof.zeromaintenanceengineer.in/next/log/64fe5e75-71e9-460c-9cd8-fe7c7708e01e) |
| **Step 3** | Mistake | [3fe0a161](https://proof.zeromaintenanceengineer.in/next/log/3fe0a161-599a-4bff-bca4-41a5a6e4d8c6) |
| **Step 3** | Learned | [93243d57](https://proof.zeromaintenanceengineer.in/next/log/93243d57-18dd-497c-bb73-a5d73d8aa894) |
| **Step 4** | Built | [c5c0acc4](https://proof.zeromaintenanceengineer.in/next/log/c5c0acc4-d386-41b5-bc97-3d7357fb4131) |
| **Step 4** | Decided | [35ddf7ce](https://proof.zeromaintenanceengineer.in/next/log/35ddf7ce-dc8b-4262-9c4b-9c134fbe525e) |
| **Step 5** | Built | [6521803a](https://proof.zeromaintenanceengineer.in/next/log/6521803a-21cf-4850-a54f-e5c81c5c97b3) |
| **Wrap** | **Session Seal** | [08f599f5](https://proof.zeromaintenanceengineer.in/next/log/08f599f5-3070-4a88-87db-e9b96bfa945a) |

---

## 🚀 Quick Verification Commands

```bash
# 1. Run full test suite (40 tests, 100% pass)
npm test

# 2. Verify TypeScript strict typecheck (0 errors)
npm run typecheck

# 3. Start Sage mock server
npm run mock:sage

# 4. Check system health
npm run health

# 5. Run single sync
npm run sync

# 6. Ask founder questions
npm run ask -- "who owes us money"
npm run ask -- "what did we spend on software last month"

# 7. Render Finance module
npm run show -- finance
```
