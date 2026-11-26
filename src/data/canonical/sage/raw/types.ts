/**
 * Sage Business Cloud Accounting v3.1 raw API shapes.
 *
 * Exactly as Sage's API returns them: envelope with $items, snake_case properties,
 * nested IDs, and line items. The rest of the app never imports these; normalize.ts
 * is the only file that transforms them into canonical shapes.
 */

export interface SageListEnvelope<T> {
  $total: number;
  $page: number;
  $next?: string | null;
  $back?: string | null;
  $itemsPerPage: number;
  $items: T[];
}

export interface SageLedgerAccountType {
  id: string; // e.g., "BANK", "EXPENSE", "SALES", "CURRENT_ASSETS", "CURRENT_LIABILITY", "EQUITY"
  displayed_as?: string;
}

export interface SageLedgerAccount {
  id: string;
  displayed_as?: string;
  name: string;
  nominal_code?: number | string;
  ledger_account_type?: SageLedgerAccountType;
  included_in_chart?: boolean;
  updated_at?: string;
  created_at?: string;
}

export interface SageContactPerson {
  id?: string;
  name?: string;
  email?: string;
  is_main_contact?: boolean;
}

export interface SageContact {
  id: string;
  displayed_as?: string;
  name: string;
  contact_type_ids: string[]; // ["CUSTOMER"], ["VENDOR"], or ["CUSTOMER", "VENDOR"]
  main_contact_person?: SageContactPerson;
  email?: string;
  updated_at?: string;
  created_at?: string;
}

export interface SageInvoiceLine {
  id?: string;
  description: string;
  ledger_account?: {
    id: string;
    displayed_as?: string;
    nominal_code?: number | string;
  };
  quantity?: number | string;
  unit_price?: number | string;
  net_amount: number | string;
  tax_amount?: number | string;
  total_amount?: number | string;
}

export interface SageInvoiceStatus {
  id: string; // "DRAFT", "UNPAID", "PART_PAID", "PAID", "VOID"
  displayed_as?: string;
}

export interface SageInvoice {
  id: string;
  displayed_as?: string;
  invoice_number?: string;
  date: string; // YYYY-MM-DD
  due_date?: string; // YYYY-MM-DD
  status?: SageInvoiceStatus;
  contact?: {
    id: string;
    displayed_as?: string;
    name?: string;
  };
  currency?: {
    id: string; // "GBP", "USD", etc.
    displayed_as?: string;
  };
  total_amount: number | string;
  outstanding_amount: number | string;
  net_amount?: number | string;
  tax_amount?: number | string;
  invoice_lines?: SageInvoiceLine[];
  void_reason?: string;
  updated_at?: string;
  created_at?: string;
}

export type SageSalesInvoice = SageInvoice;
export type SagePurchaseInvoice = SageInvoice;

export interface SageBankAccount {
  id: string;
  displayed_as?: string;
  nominal_code?: number | string;
  ledger_account?: {
    id: string;
    displayed_as?: string;
  };
  bank_account_details?: {
    account_name?: string;
    account_number?: string;
    sort_code?: string;
  };
  updated_at?: string;
}

export interface SageBankTransaction {
  id: string;
  date: string; // YYYY-MM-DD
  amount: number | string; // Signed or unsigned depending on transaction type
  bank_account: {
    id: string;
    displayed_as?: string;
  };
  transaction_type?: {
    id: string; // "RECEIPT", "PAYMENT", "TRANSFER", etc.
  };
  description?: string;
  reference?: string;
  contact?: {
    id: string;
    displayed_as?: string;
  };
  ledger_account?: {
    id: string;
    displayed_as?: string;
  };
  updated_at?: string;
  created_at?: string;
}

export interface SageBusiness {
  id: string;
  name: string;
  displayed_as?: string;
  country?: {
    id: string;
  };
  currency?: {
    id: string;
  };
}

export interface SageTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number; // typically 300 seconds
  token_type: string;
  scope: string;
  requested_by_id?: string;
}
