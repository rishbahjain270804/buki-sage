# Submission note

## What I pulled, and what I left out

The connector pulls six core resources from Sage Business Cloud Accounting v3.1:
1. `ledger_accounts` & `bank_accounts`: mapped to canonical `LedgerAccount` (asset, liability, equity, income, expense). Nominal codes are converted to `code`. Bank accounts are cross-referenced with nominal accounts to ensure `bankAccountId` always points to an asset.
2. `contacts`: mapped to `Party` (customer, supplier, or both). We pull `id`, `name`, and `email` (from contact or main contact person). If `email` is empty or missing, it is left absent.
3. `sales_invoices` & `purchase_invoices`: mapped to `Invoice` with kind `"sales"` or `"purchase"`. We extract `id`, `invoice_number`, `date`, `due_date`, `status`, `currency`, `total_amount`, `outstanding_amount`, and line items (`description`, destination `ledger_account.id`, and `net_amount`).
4. `bank_transactions`: mapped to `BankTransaction`. Amounts are normalized so payments are signed negative and receipts positive.

**What was left out and why:**
- **Quotes, Estimates, and Purchase Orders**: These are unposted pipeline records, not ledger entries.
- **Journals**: The brief and Finance module derive category spend from purchase invoice lines and cash balances from bank transactions. Unlinked manual journals would confuse line-level category reporting.
- **Tax rates & VAT calculation tables**: Buki’s canonical model uses invoice-level total (gross) and line-level net (pre-tax). Since UK VAT is accounted for in line net amounts and total amounts, detailed tax breakdown structures are omitted.

## How it stays in sync

- **First sync**: `npm run sync` pulls the full dataset from Sage across accounts, parties, invoices, and bank transactions. All four pulls resolve before the store is written. The records are stored in `.data/store.json`, reporting `added: 32`.
- **Scheduled later syncs**: `npm run cron` polls Sage every `SYNC_INTERVAL_SECONDS` (default 300s, 5s during tests).
- **Picking up changes**: Each sync pulls the current data, normalizes it, and calculates a deterministic hash diff against previous records by ID. When an invoice is edited or marked paid in Sage, the next cron cycle reports `changed: 1` and updates `.data/store.json` atomically via temporary file rename. It takes at most `SYNC_INTERVAL_SECONDS` (e.g., 5 seconds in testing, or 5 minutes in production) for any change made in Sage to show up in Buki.
- **Token persistence**: Sage access tokens expire after 300 seconds. The client inspects the expiration timestamp before every API call and automatically refreshes tokens via `POST /oauth/token` whenever fewer than 30 seconds remain.

## When Sage is slow, down, or returns something unexpected

- **When slow**: Every outgoing HTTP request has an explicit `AbortSignal.timeout(10_000)` (10 seconds). If Sage stalls, the request aborts and raises a `SageError("timeout")`.
- **When down or unreachable**: Network dropouts raise a `SageError("network")`. `runSync` catches this error, logs `finance/sage fail: <error>`, and records a failed run (`ok: false`) in `store.runs`. Crucially, existing store data is preserved intact.
- **What the user sees**: The brief continues serving grounded answers from the last successful sync, citing the timestamp and source. The user never sees a false zero for cash or receivables because stale data with a clear citation beats an empty screen.
- **When returning unexpected shapes or rate limits (HTTP 429)**: The client catches non-200 responses, handles HTTP 401 with a token refresh retry, and classifies shape mismatches as `SageError("shape")`.

## What I would still worry about

1. **Multi-currency conversions**: Invoices and bank accounts in multiple currencies are presented as separate totals without automatic FX conversion. A company with multi-currency accounts would need fixed or live exchange rates to compute unified burn.
2. **High-volume bank transactions**: Companies with tens of thousands of bank transactions would experience slower sync times when doing full pagination. In production, I would persist an incremental high-water mark (`updated_or_created_since`) to pull only delta records.
3. **Credit notes**: Sage represents credit notes as distinct endpoints (`sales_credit_notes`, `purchase_credit_notes`). Mapping these into negative invoices or payment allocations would be necessary for complete credit reconciliation.

## Questions I asked

1. *Absence rule clarification*: Ensured optional fields with empty strings or nulls are removed before schema validation.
2. *VAT and Net handling*: Decided that line-level `net` should map pre-tax amount while invoice `total` reflects gross payable.
