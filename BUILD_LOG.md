# Build Notebook: Bring Sage into Buki

Candidate: **Rishabh Bothra**  
Repository: `buki-sage` (private fork with `vivekschandrasekar-beep` invited)

---

## Step 1 · Day 1: Understanding & Foundation

### WORKS NOW
- The kit's smoke test passes against mock BambooHR:
  - `"How many people?"` answers `43 people on the payroll, 2 more with a start date after today`.
  - `"Who joined last month?"` answers 3 names for September 2026.
  - `"What does the Engineering team cost?"` answers `$2,228,000` a year.
- Validated `sample/finance.sample.json` through `npm run check`: passes with 0 errors and 0 warnings, printing the target Finance module layout.

### TESTED
- Asked `"How much cash do we have?"` and `"Who owes us money?"`: both returned `No finance source connected yet. Set FINANCE_SOURCE=sage once the Sage connector is registered.` That defines the exact gap to bridge.

### BROKE
- Initial understanding of Sage token lifetime: Sage access tokens expire in just 300 seconds (5 minutes). Without proactive refresh logic, background syncs would fail on subsequent cron cycles.

### NEXT
- Compile 5 questions a founder asks of their financial data, write the pre-implementation test list, and draft the Day-3 plan for Vivek.

### FIVE FOUNDER QUESTIONS
1. *"Who owes us money right now, and which receivables are overdue past their payment terms?"*
2. *"What was our burn on software subscriptions last month compared to our recurring monthly budget?"*
3. *"What is our total real cash across all operating and reserve bank accounts today?"*
4. *"Who are our top revenue-generating customers, and who among them has the highest unpaid balance?"*
5. *"What did we bill in sales invoices last month, and what portion has already landed as cash in the bank?"*

### LINK
`github.com/rishbahjain270804/buki-sage` (private)

---

## Step 2 · Days 2–3: Test List & Architecture Plan

### WORKS NOW
- Created comprehensive `TEST_LIST.md` before writing code: covers 20 specific test cases across Authentication, API Ingestion & Pagination, Normalization & Canonical Contract, Finance Module Display, and Cron Synchronization.
- Drafted and verified `DAY3_PLAN.md` documenting what resources to pull (`ledger_accounts`, `contacts`, `sales_invoices`, `purchase_invoices`, `bank_accounts`, `bank_transactions`), mapping onto canonical shapes, and token synchronization strategy.

### TESTED
- Evaluated Sage v3.1 API data dictionary and OAuth 2.0 specifications. Tested local callback port binding on `http://localhost:3000/api/sage/callback`.

### BROKE
- The strict absence rule in `src/lib/check/validate.ts`: default values like `null`, `""`, or `"undefined"` cause fatal validation failures. Optional fields must be stripped clean.

### NEXT
- Build raw types, token manager, HTTP client with automatic token refreshing, and pure normalizer.

### LINK
`github.com/rishbahjain270804/buki-sage` (private)

---

## Step 3 · Days 4–8: Sage Connector Core

### WORKS NOW
- Implemented `src/data/canonical/sage/`:
  - `raw/types.ts`: Full Sage v3.1 API schemas.
  - `tokenStore.ts`: Proactive token refresh with 30s buffer, stored in `.data/sage_tokens.json`.
  - `client.ts`: Pagination cursor traversal (`$next`), classified errors (`SageError`), proactive token refreshing and 401 retry.
  - `normalize.ts`: Pure transformations mapping accounts, parties, invoices, and bank transactions. Strips all nulls/empty strings.
  - `provider.ts`: Registered `sageProvider` in `src/data/canonical/providers/index.ts`.
  - `scripts/sage-auth.ts`: One-command OAuth flow with temporary local callback listener (`npm run sage:auth`).
  - `mock/sage/server.mjs`: High-fidelity offline mock server (`npm run mock:sage`) on port 4020 for immediate zero-friction evaluation.
- All 40 unit and integration tests pass (`npm test`).
- TypeScript compiler passes with 0 errors (`npm run typecheck`).
- Ran `npm run sync`: pulled 32 records from Sage, added 32 into `.data/store.json`.
- Both core brief questions answer accurately:
  - `"who owes us money"`: identifies 2 overdue invoices ($12,000 outstanding) and notes 1 open invoice with no due date.
  - `"what did we spend on software last month"`: answers $300 spent on Software subscriptions in September 2026.
- `npm run show -- finance` prints verified cash balances, invoiced revenue, overdue receivables, category spend, and customer rankings.

### TESTED
- Ran `npm run health`: reports `finance sage ok Connected to Sage Accounting for "Halden Labs UK"`.
- Validated normalized data against `validateFinanceSet()`: 0 errors, 0 warnings.

### BROKE
- Substring match bug in `mapInvoiceStatus`: `"UNPAID".includes("PAID")` was returning `"paid"` for unpaid invoices, causing a validator error. Fixed by checking `"UNPAID"` before `"PAID"` and using exact status ID matching.
- Bank transactions referential integrity: Sage bank accounts have distinct IDs from their nominal ledger accounts. Fixed by building a `bankAccountToLedgerAccountMap` so `bankAccountId` always points to the corresponding asset nominal account.

### NEXT
- Verify automated background scheduling and demonstrate live change pickup after first sync.

### LINK
`github.com/rishbahjain270804/buki-sage` (private)

---

## Step 4 · Days 9–11: Scheduled Sync & Live Change Pickup

### WORKS NOW
- Scheduled synchronization via `npm run cron` runs on a loop every `SYNC_INTERVAL_SECONDS`.
- Verified live change detection:
  - First sync: `pulled 32, added 32, changed 0, removed 0`.
  - Unmodified subsequent sync: `pulled 32, added 0, changed 0, removed 0`.
  - Modified invoice in Sage (`outstanding_amount` edited): next scheduled poll automatically reported `finance/sage: pulled 32, added 0, changed 1, removed 0`.
  - Brief queries immediately reflected the modified invoice balance without restarting the application.

### TESTED
- Tested graceful degradation: when Sage mock server was stopped, `npm run sync` recorded `ok: false` with the network error in `store.runs` while preserving existing canonical store data without displaying 0 or crashing.

### BROKE
- TypeScript compilation issue in `client.ts` with union type return on paginated envelopes. Fixed with explicit type annotations on `response: SageListEnvelope<T> | T[]`.

### NEXT
- Prepare submission note, record video walkthrough, and verify clean run from a fresh clone.

### LINK
`github.com/rishbahjain270804/buki-sage` (private)

---

## Step 5 · Days 12–14: Final Verification & Submission

### WORKS NOW
- Completed full verification checklist from a clean state.
- Generated complete `SUBMISSION_NOTE.md` based on `SUBMISSION_NOTE_TEMPLATE.md` within the 1-page requirement.
- Prepared 5-minute video walkthrough outline and script demonstrating:
  1. Fresh clone & dependencies install.
  2. Running health check and first sync.
  3. Displaying Finance module & asking the two founder questions.
  4. Scheduled sync picking up a live invoice change.
  5. 100% test pass rate (`npm test`, `npm run typecheck`).

### TESTED
- Tested complete clone-to-ask flow from scratch in under 60 seconds.

### BROKE
- Ensured `.data/` is strictly ignored in `.gitignore` so no access tokens, refresh tokens, or local stores are committed.

### NEXT
- Push code to private GitHub repository, invite `vivekschandrasekar-beep`, and submit video link and note on the Proof project page.

### LINK
`github.com/rishbahjain270804/buki-sage` (private)
