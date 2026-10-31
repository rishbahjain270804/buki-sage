/**
 * Vercel Serverless Function Entry Point for Buki Executive Dashboard
 */

import type { IncomingMessage, ServerResponse } from "node:http";
import url from "node:url";
import fs from "node:fs";
import path from "node:path";
import { readStore, writeStore, type Store } from "../src/lib/store/store";
import { answerBrief } from "../src/lib/brief/answer";
import { runSync } from "../src/lib/sync/runSync";
import { loadDotEnv } from "../scripts/env.mjs";

loadDotEnv();

// In serverless environments, store may need to live in memory or /tmp if mutated
let inMemoryStore: Store | null = null;
let inMemorySageBusiness: any = null;

function getSageData(): any {
  if (inMemorySageBusiness) return inMemorySageBusiness;
  try {
    const raw = fs.readFileSync(path.resolve(process.cwd(), "mock/sage/data/business.json"), "utf8");
    inMemorySageBusiness = JSON.parse(raw);
    return inMemorySageBusiness;
  } catch {
    return { sales_invoices: [] };
  }
}

async function getStoreData(): Promise<Store> {
  if (inMemoryStore) return inMemoryStore;
  try {
    inMemoryStore = await readStore();
    return inMemoryStore;
  } catch {
    const raw = fs.readFileSync(path.resolve(process.cwd(), ".data/store.json"), "utf8");
    inMemoryStore = JSON.parse(raw);
    return inMemoryStore!;
  }
}

function htmlTemplate(): string {
  // Read dashboard HTML or serve template
  try {
    const dashboardScript = fs.readFileSync(path.resolve(process.cwd(), "scripts/web-dashboard.ts"), "utf8");
    const startIdx = dashboardScript.indexOf("<!DOCTYPE html>");
    const endIdx = dashboardScript.indexOf("</html>") + 7;
    if (startIdx !== -1 && endIdx > startIdx) {
      return dashboardScript.slice(startIdx, endIdx);
    }
  } catch (err) {
    // fallback
  }
  return "<!DOCTYPE html><html><body><h1>Buki Finance Dashboard</h1><p>Running on Vercel Serverless</p></body></html>";
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const parsed = url.parse(req.url || "/", true);
  const pathname = parsed.pathname || "/";

  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (pathname === "/" || pathname === "/index.html") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(htmlTemplate());
    return;
  }

  if (pathname === "/api/store-data") {
    try {
      const store = await getStoreData();
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(store));
    } catch (err: any) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  if (pathname === "/api/ask") {
    const q = (parsed.query.q as string) || "";
    try {
      const store = await getStoreData();
      const answer = answerBrief(q, store);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(answer));
    } catch (err: any) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  if (pathname === "/api/sync" && req.method === "POST") {
    try {
      const store = await getStoreData();
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        ok: true,
        financeChanged: 0,
        storeStats: { accounts: store.finance.accounts.length, invoices: store.finance.invoices.length }
      }));
    } catch (err: any) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: false, error: err.message }));
    }
    return;
  }

  if (pathname === "/api/mutate-sage" && req.method === "POST") {
    try {
      let body = "";
      req.on("data", chunk => body += chunk);
      req.on("end", async () => {
        const { action } = JSON.parse(body || "{}");
        const data = getSageData();
        const store = await getStoreData();

        if (action === "partial-pay") {
          const inv = data.sales_invoices.find((i: any) => i.id === "si-3002");
          if (inv) {
            inv.outstanding_amount = 4500;
            const storeInv = store.finance.invoices.find(i => i.id === "sage:si-3002");
            if (storeInv) storeInv.outstanding = 4500;
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ ok: true, message: `Recorded $5,000 payment for ${inv.invoice_number}: outstanding reduced to $4,500` }));
            return;
          }
        } else if (action === "mark-paid") {
          const inv = data.sales_invoices.find((i: any) => i.id === "si-3003");
          if (inv) {
            inv.outstanding_amount = 0;
            const storeInv = store.finance.invoices.find(i => i.id === "sage:si-3003");
            if (storeInv) {
              storeInv.outstanding = 0;
              storeInv.status = "paid";
            }
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ ok: true, message: `Marked invoice ${inv.invoice_number} as PAID ($0 outstanding)` }));
            return;
          }
        }

        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: false, error: "Action handled in serverless" }));
      });
    } catch (err: any) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  if (pathname === "/api/reset-sage" && req.method === "POST") {
    inMemorySageBusiness = null;
    inMemoryStore = null;
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, message: "Restored baseline" }));
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");
}
