# Test List: Sage Connector for Buki

Written before implementation to define acceptance criteria, edge cases, and verification results across all five milestone steps.

---

## 1. Authentication & Token Lifecycle

| ID | Test Scenario | Expected Outcome | Result |
|---|---|---|---|
| **T-AUTH-01** | Initial OAuth Authorization (`npm run sage:auth`) | Generates authorization URL, catches callback redirect, exchanges authorization code for access and refresh tokens, and saves them to `.data/sage_tokens.json`. | **PASS** |
| **T-AUTH-02** | Proactive Token Refresh | When access token is near 300s expiry (< 30s remaining), client automatically calls Sage OAuth refresh endpoint and updates `.data/sage_tokens.json` without failing the sync. | **PASS** |
| **T-AUTH-03** | Reactive 401 Expiration Recovery | If Sage responds with HTTP 401 Unauthorized, client attempts one token refresh and retries the in-flight request. | **PASS** |
| **T-AUTH-04** | Missing Credentials / Config | Client throws classified `SageError("config", ...)` if client ID or secret is absent. | **PASS** |

---

## 2. API Ingestion & Pagination

| ID | Test Scenario | Expected Outcome | Result |
|---|---|---|---|
| **T-API-01** | Multi-page list ingestion | Traverses `$next` URLs across envelopes until `$next` is null, concatenating all records. | **PASS** |
| **T-API-02** | Incremental fetch parameter | Passes `updated_or_created_since` ISO string when provided. | **PASS** |
| **T-API-03** | HTTP 429 Rate Limiting | Identifies rate limit status code and raises classified `SageError("http", ..., 429)` or retries. | **PASS** |
| **T-API-04** | Network Timeout | Requests abort after 10,000 ms with `SageError("timeout", ...)`. | **PASS** |

---

## 3. Normalization & Canonical Contract

| ID | Test Scenario | Expected Outcome | Result |
|---|---|---|---|
| **T-NORM-01** | Strict Absence Rule | Optional fields with no value are completely omitted (never defaulted to `null`, `""`, or `undefined`). | **PASS** |
| **T-NORM-02** | ID Prefixing | Every canonical record has `id: "sage:${sourceId}"`. | **PASS** |
| **T-NORM-03** | Account Classification | Maps Sage nominal codes and account types to canonical `"asset" \| "liability" \| "equity" \| "income" \| "expense"`. | **PASS** |
| **T-NORM-04** | Contact Kind Mapping | Maps `contact_type_ids` to `"customer"`, `"supplier"`, or `"both"`. | **PASS** |
| **T-NORM-05** | Invoice Status & Lines | Correctly maps `"draft"`, `"unpaid"`, `"part_paid"`, `"paid"`, `"void"`. Outstanding on paid invoices is 0. | **PASS** |
| **T-NORM-06** | Bank Account Referential Integrity | `bankAccountId` in `BankTransaction` references an asset account in `accounts`. | **PASS** |
| **T-NORM-07** | Transaction Sign Convention | Money in is positive; money out (payments) is negative. | **PASS** |
| **T-NORM-08** | Full Set Schema Validation | Normalized records pass `validateFinanceSet()` with 0 errors and 0 warnings. | **PASS** |

---

## 4. Finance Module & Brief Answers

| ID | Test Scenario | Expected Outcome | Result |
|---|---|---|---|
| **T-SHOW-01** | `npm run show -- finance` | Prints Cash across bank accounts, Invoiced in current & previous month, Overdue receivables, Spend by expense account, and Biggest customers. | **PASS** |
| **T-ASK-01** | `"who owes us money"` | Identifies overdue sales invoices past due date with outstanding amounts and debtors. Notes open invoices with no due date. | **PASS** |
| **T-ASK-02** | `"what did we spend on software last month"` | Identifies purchase invoice lines posted to "Software subscriptions" for the previous calendar month. | **PASS** |
| **T-ASK-03** | `"how much cash do we have"` | Sums signed bank transactions across accounts without converting currencies. | **PASS** |
| **T-ASK-04** | `"what did we invoice last month"` | Sums sales invoices dated in the previous month (excluding void and draft). | **PASS** |
| **T-ASK-05** | `"biggest customers"` | Ranks top customers by total invoiced sales on file. | **PASS** |

---

## 5. Scheduling & Live Mutation Pickup

| ID | Test Scenario | Expected Outcome | Result |
|---|---|---|---|
| **T-CRON-01** | Scheduled Poll Loop (`npm run cron`) | Runs synchronizations every `SYNC_INTERVAL_SECONDS` without duplicate runs on slow responses. | **PASS** |
| **T-CRON-02** | Live Change Detection | Editing an invoice in Sage after the first sync reports `changed: 1` on the subsequent sync. | **PASS** |
| **T-CRON-03** | Additive Record Detection | Adding an invoice or contact in Sage reports `added: 1` on the next sync. | **PASS** |
| **T-CRON-04** | Non-Destructive Failure | If a sync pull fails halfway, the previous canonical store remains intact and the error is recorded in `store.runs`. | **PASS** |
