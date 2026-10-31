// Mock Sage Business Cloud Accounting v3.1 server.
// Mirrors the endpoints and shapes of Sage Accounting.
// Re-reads mock/sage/data/business.json on every request, so modifying that file
// simulates a live change made in Sage.

import http from "node:http";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { loadDotEnv } from "../../scripts/env.mjs";

loadDotEnv();

const PORT = Number(process.env.MOCK_SAGE_PORT) || 4020;
const DATA_FILE = join(dirname(fileURLToPath(import.meta.url)), "data", "business.json");

function readData() {
  return JSON.parse(readFileSync(DATA_FILE, "utf8"));
}

function send(res, status, body, headers = {}) {
  res.writeHead(status, { "Content-Type": "application/json", ...headers });
  res.end(JSON.stringify(body));
}

function envelope(items, total = items.length, page = 1) {
  return {
    $total: total,
    $page: page,
    $next: null,
    $back: null,
    $itemsPerPage: items.length,
    $items: items,
  };
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const log = (status) => console.log(`[mock:sage] ${req.method} ${url.pathname}${url.search} -> ${status}`);

  // OAuth token mock
  if (req.method === "POST" && (url.pathname === "/oauth/token" || url.pathname === "/token")) {
    log(200);
    return send(res, 200, {
      access_token: `mock-token-${Date.now()}`,
      refresh_token: `mock-refresh-${Date.now()}`,
      expires_in: 300,
      token_type: "bearer",
      scope: "readonly",
    });
  }

  const data = readData();

  if (req.method === "GET") {
    if (url.pathname === "/businesses" || url.pathname === "/v3.1/businesses") {
      log(200);
      return send(res, 200, envelope(data.businesses || []));
    }

    if (url.pathname === "/ledger_accounts" || url.pathname === "/v3.1/ledger_accounts") {
      log(200);
      return send(res, 200, envelope(data.ledger_accounts || []));
    }

    if (url.pathname === "/contacts" || url.pathname === "/v3.1/contacts") {
      log(200);
      return send(res, 200, envelope(data.contacts || []));
    }

    if (url.pathname === "/sales_invoices" || url.pathname === "/v3.1/sales_invoices") {
      log(200);
      return send(res, 200, envelope(data.sales_invoices || []));
    }

    if (url.pathname === "/purchase_invoices" || url.pathname === "/v3.1/purchase_invoices") {
      log(200);
      return send(res, 200, envelope(data.purchase_invoices || []));
    }

    if (url.pathname === "/bank_accounts" || url.pathname === "/v3.1/bank_accounts") {
      log(200);
      return send(res, 200, envelope(data.bank_accounts || []));
    }

    if (url.pathname === "/bank_transactions" || url.pathname === "/v3.1/bank_transactions") {
      log(200);
      return send(res, 200, envelope(data.bank_transactions || []));
    }
  }

  log(404);
  return send(res, 404, { $severity: "error", $message: "Not found" });
});

server.listen(PORT, () => {
  console.log(`Mock Sage Accounting server listening on http://localhost:${PORT}`);
});
