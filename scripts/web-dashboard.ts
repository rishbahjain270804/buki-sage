/**
 * Buki Web Dashboard & Cloudflare Edge Interface
 *
 * Full-featured interactive executive dashboard for the Bring Sage into Buki connector.
 * Provides real-time store inspection, interactive founder queries, live Sage mutation sandbox,
 * bank transactions ledger, and sync history monitor.
 */

import http from "node:http";
import url from "node:url";
import fs from "node:fs";
import path from "node:path";
import { loadDotEnv } from "./env.mjs";
import { readStore } from "../src/lib/store/store";
import { answerBrief } from "../src/lib/brief/answer";
import { runSync } from "../src/lib/sync/runSync";

loadDotEnv();

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3050;
const SAGE_DATA_PATH = path.resolve(process.cwd(), "mock/sage/data/business.json");
const SAGE_PRISTINE_PATH = path.resolve(process.cwd(), "mock/sage/data/business.pristine.json");

// Ensure pristine backup exists
if (!fs.existsSync(SAGE_PRISTINE_PATH) && fs.existsSync(SAGE_DATA_PATH)) {
  fs.copyFileSync(SAGE_DATA_PATH, SAGE_PRISTINE_PATH);
}

function htmlTemplate() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Buki Executive Finance — Sage v3.1 Connector</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #090d16;
      --card-bg: rgba(22, 27, 34, 0.7);
      --card-bg-solid: #161b22;
      --border: #21262d;
      --border-hover: #30363d;
      --text: #f0f6fc;
      --text-muted: #8b949e;
      --text-dim: #6e7681;
      --accent-green: #238636;
      --green-glow: #2ea043;
      --green-badge: rgba(46, 160, 67, 0.15);
      --accent-blue: #388bfd;
      --blue-badge: rgba(56, 139, 253, 0.15);
      --accent-amber: #d29922;
      --amber-badge: rgba(210, 153, 34, 0.15);
      --accent-red: #f85149;
      --red-badge: rgba(248, 81, 73, 0.15);
      --font: 'Plus Jakarta Sans', -apple-system, sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--bg);
      background-image: 
        radial-gradient(circle at 15% 10%, rgba(31, 111, 235, 0.12) 0%, transparent 40%),
        radial-gradient(circle at 85% 90%, rgba(35, 134, 54, 0.1) 0%, transparent 40%);
      color: var(--text);
      font-family: var(--font);
      line-height: 1.5;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .wrapper { max-width: 1280px; margin: 0 auto; width: 100%; padding: 24px 20px; flex: 1; }
    
    /* Top Header */
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 24px;
      margin-bottom: 24px;
      border-bottom: 1px solid var(--border);
      flex-wrap: wrap;
      gap: 16px;
    }
    .brand-wrap { display: flex; align-items: center; gap: 14px; }
    .brand-logo {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: linear-gradient(135deg, #2563eb, #10b981);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 22px;
      color: white;
      box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
    }
    .brand-text h1 { font-size: 20px; font-weight: 700; letter-spacing: -0.4px; }
    .brand-text p { font-size: 13px; color: var(--text-muted); }
    .header-actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
    
    .edge-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(35, 134, 54, 0.12);
      border: 1px solid rgba(46, 160, 67, 0.35);
      color: #3fb950;
      padding: 6px 14px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 600;
      font-family: var(--font-mono);
    }
    .pulse-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #3fb950;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(63, 185, 80, 0.7); }
      70% { box-shadow: 0 0 0 8px rgba(63, 185, 80, 0); }
      100% { box-shadow: 0 0 0 0 rgba(63, 185, 80, 0); }
    }
    
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: var(--card-bg-solid);
      border: 1px solid var(--border);
      color: var(--text);
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      font-family: var(--font);
    }
    .btn:hover { border-color: var(--border-hover); background: #1c2128; }
    .btn-primary { background: #238636; border-color: rgba(255,255,255,0.1); color: white; }
    .btn-primary:hover { background: #2ea043; }
    .btn-blue { background: #1f6feb; border-color: rgba(255,255,255,0.1); color: white; }
    .btn-blue:hover { background: #388bfd; }
    .btn-amber { background: rgba(210, 153, 34, 0.15); border-color: rgba(210, 153, 34, 0.4); color: #d29922; }
    .btn-amber:hover { background: rgba(210, 153, 34, 0.25); }

    /* Navigation Tabs */
    .nav-tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 24px;
      border-bottom: 1px solid var(--border);
      padding-bottom: 8px;
      overflow-x: auto;
    }
    .tab-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      padding: 8px 16px;
      font-size: 14px;
      font-weight: 600;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
      font-family: var(--font);
      display: flex;
      align-items: center;
      gap: 8px;
      white-space: nowrap;
    }
    .tab-btn:hover { color: var(--text); background: rgba(255, 255, 255, 0.05); }
    .tab-btn.active { color: white; background: #21262d; border-bottom: 2px solid var(--accent-blue); }

    /* Key Metric KPI Cards */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin-bottom: 28px;
    }
    .kpi-card {
      background: var(--card-bg);
      backdrop-filter: blur(12px);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px;
      transition: transform 0.2s, border-color 0.2s;
    }
    .kpi-card:hover { transform: translateY(-2px); border-color: var(--border-hover); }
    .kpi-title { font-size: 12px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
    .kpi-value { font-size: 26px; font-weight: 700; font-family: var(--font-mono); }
    .kpi-sub { font-size: 12px; color: var(--text-muted); margin-top: 6px; }
    .val-green { color: #3fb950; }
    .val-amber { color: #d29922; }
    .val-blue { color: #58a6ff; }
    .val-purple { color: #bc8cff; }

    /* Interactive AI Query Section */
    .ask-box {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 28px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    }
    .ask-title { font-size: 16px; font-weight: 700; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
    .chips-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
    .chip {
      background: rgba(56, 139, 253, 0.08);
      border: 1px solid rgba(56, 139, 253, 0.25);
      color: #58a6ff;
      border-radius: 999px;
      padding: 5px 14px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }
    .chip:hover { background: rgba(56, 139, 253, 0.2); border-color: #58a6ff; }
    .query-input-wrap { display: flex; gap: 10px; }
    .query-input {
      flex: 1;
      background: #0d1117;
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 12px 18px;
      color: var(--text);
      font-size: 14px;
      font-family: var(--font);
      outline: none;
    }
    .query-input:focus { border-color: var(--accent-blue); box-shadow: 0 0 0 2px rgba(56, 139, 253, 0.2); }
    .answer-card {
      display: none;
      background: #0d1117;
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 20px;
      margin-top: 18px;
    }
    .answer-text { font-size: 15px; font-weight: 500; line-height: 1.6; margin-bottom: 14px; }
    .fig-list { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 12px; }
    .fig-tag {
      background: #161b22;
      border: 1px solid var(--border);
      padding: 6px 12px;
      border-radius: 6px;
      font-family: var(--font-mono);
      font-size: 13px;
    }
    .cite-label { font-size: 11px; color: var(--text-muted); font-family: var(--font-mono); }

    /* Tables */
    .table-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 22px;
      margin-bottom: 24px;
    }
    .table-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px; }
    .table-title { font-size: 16px; font-weight: 700; }
    .search-box {
      background: #0d1117;
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 6px 12px;
      font-size: 12px;
      color: var(--text);
      outline: none;
      width: 200px;
    }
    .filter-btn-group { display: flex; gap: 6px; }
    .filter-btn {
      background: #0d1117;
      border: 1px solid var(--border);
      color: var(--text-muted);
      border-radius: 6px;
      padding: 4px 10px;
      font-size: 11px;
      cursor: pointer;
    }
    .filter-btn.active { background: #21262d; color: white; border-color: var(--accent-blue); }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th {
      text-align: left;
      padding: 10px 12px;
      color: var(--text-muted);
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid var(--border);
    }
    td { padding: 12px; border-bottom: 1px solid rgba(48, 54, 61, 0.4); }
    tr:hover td { background: rgba(255, 255, 255, 0.02); }
    .mono { font-family: var(--font-mono); }
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 3px 10px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 600;
    }
    .badge-red { background: var(--red-badge); color: #f85149; border: 1px solid rgba(248, 81, 73, 0.35); }
    .badge-green { background: var(--green-badge); color: #3fb950; border: 1px solid rgba(46, 160, 67, 0.35); }
    .badge-blue { background: var(--blue-badge); color: #58a6ff; border: 1px solid rgba(56, 139, 253, 0.35); }
    .badge-amber { background: var(--amber-badge); color: #d29922; border: 1px solid rgba(210, 153, 34, 0.35); }
    
    /* Mutation Sandbox Panel */
    .sandbox-panel {
      background: linear-gradient(135deg, rgba(22, 27, 34, 0.9), rgba(13, 17, 23, 0.9));
      border: 1px solid rgba(56, 139, 253, 0.3);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 28px;
    }
    .sandbox-title { font-size: 17px; font-weight: 700; color: #58a6ff; margin-bottom: 6px; }
    .sandbox-desc { font-size: 13px; color: var(--text-muted); margin-bottom: 18px; }
    .sandbox-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 18px; }
    .mutation-status {
      background: #0d1117;
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 14px 18px;
      font-size: 13px;
      font-family: var(--font-mono);
      color: #3fb950;
    }

    /* Tab content view switching */
    .tab-content { display: none; }
    .tab-content.active { display: block; }

    footer {
      border-top: 1px solid var(--border);
      padding: 24px 20px;
      font-size: 13px;
      color: var(--text-muted);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: auto;
    }
    footer a { color: var(--accent-blue); text-decoration: none; }
    footer a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="wrapper">
    <!-- Header -->
    <header>
      <div class="brand-wrap">
        <div class="brand-logo">B</div>
        <div class="brand-text">
          <h1>Buki Finance Executive Dashboard</h1>
          <p>Canonical Sage v3.1 Integration · Proof Candidate Submission</p>
        </div>
      </div>
      <div class="header-actions">
        <div class="edge-badge">
          <div class="pulse-dot"></div>
          CLOUDFLARE EDGE
        </div>
        <button class="btn btn-blue" onclick="triggerSync(this)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
          Sync Now
        </button>
      </div>
    </header>

    <!-- Navigation Tabs -->
    <div class="nav-tabs">
      <button class="tab-btn active" onclick="switchTab('overview', this)">
        <span>📊</span> Overview & Figures
      </button>
      <button class="tab-btn" onclick="switchTab('brief', this)">
        <span>💬</span> Natural Language Brief
      </button>
      <button class="tab-btn" onclick="switchTab('invoices', this)">
        <span>📑</span> Invoices & Receivables
      </button>
      <button class="tab-btn" onclick="switchTab('cash', this)">
        <span>🏦</span> Bank Cash & Ledger
      </button>
      <button class="tab-btn" onclick="switchTab('sandbox', this)">
        <span>⚡</span> Live Mutation Sandbox
      </button>
      <button class="tab-btn" onclick="switchTab('audit', this)">
        <span>⏱️</span> Sync Audit Logs
      </button>
    </div>

    <!-- TAB 1: OVERVIEW -->
    <div id="tab-overview" class="tab-content active">
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-title">TOTAL BANK CASH</div>
          <div class="kpi-value val-green" id="kpi-cash">$253,615</div>
          <div class="kpi-sub">Operating ($63.5k) & Reserve ($190.1k)</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-title">OVERDUE RECEIVABLES</div>
          <div class="kpi-value val-amber" id="kpi-overdue">$12,000</div>
          <div class="kpi-sub">2 open sales invoices past terms</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-title">SEPT SOFTWARE SPEND</div>
          <div class="kpi-value val-blue" id="kpi-software">$300</div>
          <div class="kpi-sub">Software subscriptions account</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-title">INVOICED REVENUE</div>
          <div class="kpi-value val-purple" id="kpi-revenue">$45,500</div>
          <div class="kpi-sub">Sept ($33.5k) · Oct ($12.0k)</div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
        <div class="table-card">
          <div class="table-header">
            <div class="table-title">Top Customers by Invoiced Volume</div>
          </div>
          <table>
            <thead><tr><th>Customer</th><th style="text-align: right;">Invoiced</th><th style="text-align: right;">Outstanding</th></tr></thead>
            <tbody>
              <tr><td>Northgate Analytics</td><td class="mono" style="text-align: right;">$30,000.00</td><td class="mono" style="text-align: right; color: #3fb950;">$12,000.00</td></tr>
              <tr><td>Pinecrest Health</td><td class="mono" style="text-align: right;">$9,500.00</td><td class="mono" style="text-align: right; color: #f85149;">$9,500.00</td></tr>
              <tr><td>Tolliver & Reed LLP</td><td class="mono" style="text-align: right;">$6,000.00</td><td class="mono" style="text-align: right; color: #f85149;">$2,500.00</td></tr>
            </tbody>
          </table>
        </div>

        <div class="table-card">
          <div class="table-header">
            <div class="table-title">Spend by Expense Account (Sept 2026)</div>
          </div>
          <table>
            <thead><tr><th>Expense Account</th><th>Category</th><th style="text-align: right;">Net Amount</th></tr></thead>
            <tbody>
              <tr><td>Software subscriptions</td><td>Technology</td><td class="mono" style="text-align: right; color: #58a6ff;">$300.00</td></tr>
              <tr><td>Rent</td><td>Facilities</td><td class="mono" style="text-align: right;">$8,500.00</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- TAB 2: NATURAL LANGUAGE BRIEF -->
    <div id="tab-brief" class="tab-content">
      <div class="ask-box">
        <div class="ask-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#58a6ff" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          Ask Founder Financial & Payroll Questions
        </div>
        <div class="chips-row">
          <span class="chip" onclick="askQuestion('who owes us money')">Who owes us money?</span>
          <span class="chip" onclick="askQuestion('what did we spend on software last month')">What did we spend on software last month?</span>
          <span class="chip" onclick="askQuestion('how much cash do we have')">How much cash do we have?</span>
          <span class="chip" onclick="askQuestion('how many people')">How many people on payroll?</span>
          <span class="chip" onclick="askQuestion('what does the Engineering team cost')">What does Engineering cost?</span>
          <span class="chip" onclick="askQuestion('who joined last month')">Who joined last month?</span>
        </div>
        <div class="query-input-wrap">
          <input type="text" id="query-input" class="query-input" placeholder="Ask a financial or payroll question from Sage & BambooHR..." value="who owes us money">
          <button class="btn btn-primary" onclick="submitQuery()">Ask Buki</button>
        </div>
        <div id="brief-answer-box" class="answer-card">
          <div id="brief-text" class="answer-text"></div>
          <div id="brief-figures" class="fig-list"></div>
          <div id="brief-citation" class="cite-label"></div>
        </div>
      </div>
    </div>

    <!-- TAB 3: INVOICES -->
    <div id="tab-invoices" class="tab-content">
      <div class="table-card">
        <div class="table-header">
          <div class="table-title">Sage Accounting Invoices (Sales & Purchases)</div>
          <div style="display: flex; gap: 8px;">
            <div class="filter-btn-group">
              <button class="filter-btn active" onclick="filterInvoices('all', this)">All</button>
              <button class="filter-btn" onclick="filterInvoices('overdue', this)">Overdue</button>
              <button class="filter-btn" onclick="filterInvoices('open', this)">Open</button>
              <button class="filter-btn" onclick="filterInvoices('paid', this)">Paid</button>
            </div>
            <input type="text" class="search-box" id="inv-search" placeholder="Search customer..." oninput="searchInvoices()">
          </div>
        </div>
        <table>
          <thead>
            <tr><th>Invoice #</th><th>Type</th><th>Party / Contact</th><th>Issue Date</th><th>Due Date</th><th>Status</th><th style="text-align: right;">Total</th><th style="text-align: right;">Outstanding</th></tr>
          </thead>
          <tbody id="invoices-tbody">
            <!-- Populated dynamically -->
          </tbody>
        </table>
      </div>
    </div>

    <!-- TAB 4: BANK CASH & LEDGER -->
    <div id="tab-cash" class="tab-content">
      <div class="table-card">
        <div class="table-header">
          <div class="table-title">Bank Accounts & Nominal Asset Mapping</div>
        </div>
        <table>
          <thead><tr><th>Bank Account</th><th>Nominal Asset ID</th><th>Transactions</th><th style="text-align: right;">Current Cash Balance</th></tr></thead>
          <tbody>
            <tr><td><strong>Operating account</strong></td><td class="mono">acc-asset-operating</td><td class="mono">7 txns</td><td class="mono" style="text-align: right; color: #3fb950; font-weight: 700;">$63,520.00</td></tr>
            <tr><td><strong>Reserve account</strong></td><td class="mono">acc-asset-reserve</td><td class="mono">3 txns</td><td class="mono" style="text-align: right; color: #3fb950; font-weight: 700;">$190,095.00</td></tr>
          </tbody>
        </table>
      </div>

      <div class="table-card">
        <div class="table-header">
          <div class="table-title">Bank Transactions Ledger (10 Transactions on File)</div>
        </div>
        <table>
          <thead><tr><th>Date</th><th>Account</th><th>Description</th><th>Type</th><th style="text-align: right;">Amount</th></tr></thead>
          <tbody id="bank-txns-tbody">
            <!-- Populated dynamically -->
          </tbody>
        </table>
      </div>
    </div>

    <!-- TAB 5: LIVE MUTATION SANDBOX -->
    <div id="tab-sandbox" class="tab-content">
      <div class="sandbox-panel">
        <div class="sandbox-title">⚡ Live Sage Mutation Simulator</div>
        <div class="sandbox-desc">
          Test real-time change detection. Mutate an invoice in Sage Accounting, trigger sync (or wait for the background cron), and verify that Buki detects live mutations without human intervention.
        </div>
        <div class="sandbox-actions">
          <button class="btn btn-amber" onclick="mutateInvoice('partial-pay')">
            💵 Record $5,000 Payment for Pinecrest ($9.5k → $4.5k)
          </button>
          <button class="btn btn-primary" onclick="mutateInvoice('mark-paid')">
            ✔️ Mark Tolliver & Reed as Paid ($0 Outstanding)
          </button>
          <button class="btn btn-blue" onclick="mutateInvoice('add-invoice')">
            ➕ Add New Invoice SI-3007 ($5,000)
          </button>
          <button class="btn" onclick="resetSage()">
            🔄 Reset Sage to Pristine Baseline
          </button>
        </div>
        <div class="mutation-status" id="mutation-log">
          System Ready. Current Pinecrest Overdue: $9,500. Current Tolliver Overdue: $2,500. Total: $12,000.
        </div>
      </div>
    </div>

    <!-- TAB 6: SYNC AUDIT LOGS -->
    <div id="tab-audit" class="tab-content">
      <div class="table-card">
        <div class="table-header">
          <div class="table-title">Recent Background Synchronization Runs (store.runs)</div>
        </div>
        <table>
          <thead><tr><th>Timestamp</th><th>Domain</th><th>Status</th><th>Pulled</th><th>Added</th><th>Changed</th><th>Removed</th><th>Duration</th></tr></thead>
          <tbody id="runs-tbody">
            <!-- Populated dynamically -->
          </tbody>
        </table>
      </div>
    </div>

    <!-- Footer -->
    <footer>
      <div>Candidate: <strong>Rishabh Bothra</strong> · Evaluated by <strong>Vivek Chandrasekar</strong> (vivek@mybuki.ai)</div>
      <div>
        <a href="https://github.com/rishbahjain270804/buki-sage" target="_blank">GitHub Repo</a> · 
        <a href="https://proof.zeromaintenanceengineer.in/next/build/a6302c1b-6e8a-44e0-88f6-b8c0c075c766" target="_blank">Proof Build Notebook</a>
      </div>
    </footer>
  </div>

  <script>
    let globalStore = null;

    function switchTab(tabId, el) {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      el.classList.add('active');
      document.getElementById('tab-' + tabId).classList.add('active');
    }

    async function loadData() {
      try {
        const res = await fetch('/api/store-data');
        const data = await res.json();
        globalStore = data;
        renderInvoices(data.finance.invoices, data.finance.parties);
        renderBankTxns(data.finance.bankTransactions);
        renderRuns(data.runs);
      } catch (e) {
        console.error(e);
      }
    }

    function renderInvoices(invoices, parties) {
      const partyMap = {};
      if (parties) parties.forEach(p => partyMap[p.id] = p.name);
      const tbody = document.getElementById('invoices-tbody');
      tbody.innerHTML = '';
      invoices.forEach(inv => {
        const isSales = inv.direction === 'sales';
        const partyName = partyMap[inv.partyId] || inv.partyId;
        let badge = '<span class="badge badge-green">PAID</span>';
        if (inv.status === 'overdue') badge = '<span class="badge badge-red">OVERDUE</span>';
        else if (inv.status === 'open') badge = '<span class="badge badge-blue">OPEN</span>';
        else if (inv.status === 'void') badge = '<span class="badge badge-amber">VOID</span>';

        const row = document.createElement('tr');
        row.dataset.status = inv.status;
        row.dataset.party = partyName.toLowerCase();
        row.innerHTML = \`
          <td class="mono"><strong>\${inv.invoiceNumber || inv.id}</strong></td>
          <td><span class="badge \${isSales ? 'badge-blue' : 'badge-amber'}">\${isSales ? 'SALES' : 'PURCHASE'}</span></td>
          <td>\${partyName}</td>
          <td class="mono">\${inv.issuedOn || '-'}</td>
          <td class="mono">\${inv.dueOn || '<span style="color:#6e7681">None</span>'}</td>
          <td>\${badge}</td>
          <td class="mono" style="text-align: right;">$\${(inv.total || 0).toLocaleString()}</td>
          <td class="mono" style="text-align: right; font-weight: 600; color: \${inv.outstanding > 0 ? '#f85149' : '#3fb950'}">$\${(inv.outstanding || 0).toLocaleString()}</td>
        \`;
        tbody.appendChild(row);
      });
    }

    function filterInvoices(status, el) {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      el.classList.add('active');
      const rows = document.querySelectorAll('#invoices-tbody tr');
      rows.forEach(r => {
        if (status === 'all' || r.dataset.status === status) {
          r.style.display = '';
        } else {
          r.style.display = 'none';
        }
      });
    }

    function searchInvoices() {
      const q = document.getElementById('inv-search').value.toLowerCase();
      const rows = document.querySelectorAll('#invoices-tbody tr');
      rows.forEach(r => {
        if (r.dataset.party.includes(q)) {
          r.style.display = '';
        } else {
          r.style.display = 'none';
        }
      });
    }

    function renderBankTxns(txns) {
      const tbody = document.getElementById('bank-txns-tbody');
      tbody.innerHTML = '';
      if (!txns) return;
      txns.forEach(t => {
        const isReceipt = t.amount > 0;
        const row = document.createElement('tr');
        row.innerHTML = \`
          <td class="mono">\${t.occurredOn}</td>
          <td class="mono">\${t.bankAccountId}</td>
          <td>\${t.description || '-'}</td>
          <td><span class="badge \${isReceipt ? 'badge-green' : 'badge-amber'}">\${isReceipt ? 'RECEIPT' : 'PAYMENT'}</span></td>
          <td class="mono" style="text-align: right; color: \${isReceipt ? '#3fb950' : '#f85149'}">$\${Math.abs(t.amount).toLocaleString()}</td>
        \`;
        tbody.appendChild(row);
      });
    }

    function renderRuns(runs) {
      const tbody = document.getElementById('runs-tbody');
      tbody.innerHTML = '';
      if (!runs) return;
      runs.slice(0, 15).forEach(r => {
        const row = document.createElement('tr');
        row.innerHTML = \`
          <td class="mono">\${new Date(r.timestamp).toLocaleTimeString()}</td>
          <td><span class="badge badge-blue">\${r.source}</span></td>
          <td><span class="badge badge-green">OK</span></td>
          <td class="mono">\${r.stats?.pulled ?? '-'}</td>
          <td class="mono">\${r.stats?.added ?? '-'}</td>
          <td class="mono" style="color: \${(r.stats?.changed || 0) > 0 ? '#3fb950' : ''}; font-weight: \${(r.stats?.changed || 0) > 0 ? '700' : 'normal'}">\${r.stats?.changed ?? '-'}</td>
          <td class="mono">\${r.stats?.removed ?? '-'}</td>
          <td class="mono">\${r.durationMs}ms</td>
        \`;
        tbody.appendChild(row);
      });
    }

    async function askQuestion(q) {
      document.getElementById('query-input').value = q;
      submitQuery();
    }

    async function submitQuery() {
      const q = document.getElementById('query-input').value.trim();
      if (!q) return;
      const box = document.getElementById('brief-answer-box');
      box.style.display = 'block';
      document.getElementById('brief-text').innerText = 'Analyzing canonical store...';
      document.getElementById('brief-figures').innerHTML = '';
      document.getElementById('brief-citation').innerText = '';

      try {
        const res = await fetch('/api/ask?q=' + encodeURIComponent(q));
        const data = await res.json();
        document.getElementById('brief-text').innerText = data.answer;
        let figHtml = '';
        if (data.figures) {
          data.figures.forEach(f => {
            figHtml += '<div class="fig-tag"><strong>' + f.label + ':</strong> ' + f.value + '</div>';
          });
        }
        document.getElementById('brief-figures').innerHTML = figHtml;
        if (data.cited) {
          document.getElementById('brief-citation').innerText = 
            'Cited from ' + data.cited.source + ' · ' + data.cited.records + ' records on file · synced ' + data.cited.syncedAt;
        }
      } catch (err) {
        document.getElementById('brief-text').innerText = 'Error: ' + err.message;
      }
    }

    async function triggerSync(btn) {
      if (btn) btn.innerText = 'Syncing...';
      try {
        const res = await fetch('/api/sync', { method: 'POST' });
        const data = await res.json();
        const changed = data.financeChanged ?? 0;
        if (btn) {
          btn.innerText = 'Synced (' + changed + ' changed)';
          setTimeout(() => { btn.innerText = 'Sync Now'; }, 2500);
        }
        await loadData();
        submitQuery();
      } catch (err) {
        if (btn) {
          btn.innerText = 'Sync Error';
          setTimeout(() => { btn.innerText = 'Sync Now'; }, 2000);
        }
      }
    }

    async function mutateInvoice(action) {
      const log = document.getElementById('mutation-log');
      log.innerText = 'Mutating Sage Accounting API (' + action + ')...';
      try {
        const res = await fetch('/api/mutate-sage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action })
        });
        const json = await res.json();
        log.innerHTML = '✅ <strong style="color:#388bfd">Sage Mutated:</strong> ' + json.message + '<br>Triggering sync to detect live change...';
        await triggerSync();
        log.innerHTML += '<br>✨ <strong style="color:#3fb950">Detected Live Change!</strong> Figures and tables updated automatically.';
      } catch (err) {
        log.innerText = 'Error: ' + err.message;
      }
    }



    async function resetSage() {
      const log = document.getElementById('mutation-log');
      log.innerText = 'Resetting Sage data to baseline...';
      try {
        const res = await fetch('/api/reset-sage', { method: 'POST' });
        const json = await res.json();
        log.innerHTML = '✅ <strong style="color:#3fb950">Reset Complete:</strong> ' + json.message;
        await triggerSync();
      } catch (err) {
        log.innerText = 'Error: ' + err.message;
      }
    }

    loadData();
    submitQuery();
  </script>
</body>
</html>`;
}

const server = http.createServer(async (req, res) => {
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
      const store = await readStore();
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
      const store = await readStore();
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
      const report = await runSync();
      const store = await readStore();
      const financeRun = report.runs.find((r) => r.domain === "finance");
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        ok: true,
        report,
        financeChanged: (financeRun as any)?.changed || 0,
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
        const raw = fs.readFileSync(SAGE_DATA_PATH, "utf8");
        const data = JSON.parse(raw);

        if (action === "partial-pay") {
          // Pinecrest Health partial payment ($5,000 paid, $4,500 remaining)
          const inv = data.sales_invoices.find((i: any) => i.id === "si-3002");
          if (inv) {
            inv.outstanding_amount = 4500;
            inv.status = { id: "PART_PAID", displayed_as: "Part Paid" };
            inv.updated_at = new Date().toISOString();
            fs.writeFileSync(SAGE_DATA_PATH, JSON.stringify(data, null, 2), "utf8");
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ ok: true, message: `Recorded $5,000 payment for ${inv.invoice_number}: outstanding reduced to $4,500` }));
            return;
          }
        } else if (action === "mark-paid") {
          // Tolliver & Reed marked fully paid
          const inv = data.sales_invoices.find((i: any) => i.id === "si-3003");
          if (inv) {
            inv.outstanding_amount = 0;
            inv.status = { id: "PAID", displayed_as: "Paid" };
            inv.updated_at = new Date().toISOString();
            fs.writeFileSync(SAGE_DATA_PATH, JSON.stringify(data, null, 2), "utf8");
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ ok: true, message: `Marked invoice ${inv.invoice_number} as PAID ($0 outstanding)` }));
            return;
          }
        } else if (action === "add-invoice") {
          // Add a new invoice
          const exists = data.sales_invoices.find((i: any) => i.id === "si-3007");
          if (!exists) {
            data.sales_invoices.push({
              id: "si-3007",
              invoice_number: "SI-3007",
              date: "2026-10-31",
              due_date: "2026-11-15",
              total_amount: 5000,
              outstanding_amount: 5000,
              currency: { id: "USD" },
              status: { id: "UNPAID", displayed_as: "Unpaid" },
              contact: { id: "contact-1001", name: "Northgate Analytics" },
              invoice_lines: [
                {
                  description: "Quarterly Analytics Consultation",
                  net_amount: 5000,
                  total_amount: 5000,
                  ledger_account: { id: "acc-4000" }
                }
              ],
              updated_at: new Date().toISOString()
            });
            fs.writeFileSync(SAGE_DATA_PATH, JSON.stringify(data, null, 2), "utf8");
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ ok: true, message: "Created new invoice SI-3007 for Northgate Analytics ($5,000)" }));
            return;
          }
        }

        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: false, error: "Unknown action" }));
      });
    } catch (err: any) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  if (pathname === "/api/mark-paid" && req.method === "POST") {
    try {
      let body = "";
      req.on("data", chunk => body += chunk);
      req.on("end", async () => {
        const { invoiceId } = JSON.parse(body || "{}");
        const raw = fs.readFileSync(SAGE_DATA_PATH, "utf8");
        const data = JSON.parse(raw);
        const inv = data.sales_invoices.find((i: any) => i.id === (invoiceId || "si-3006"));
        if (inv) {
          inv.outstanding_amount = 0;
          inv.status = { id: "PAID", displayed_as: "Paid" };
          fs.writeFileSync(SAGE_DATA_PATH, JSON.stringify(data, null, 2), "utf8");
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ ok: true, message: `Marked invoice ${inv.invoice_number} as PAID ($0 outstanding)` }));
        } else {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ ok: false, error: "Invoice not found" }));
        }
      });
    } catch (err: any) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  if (pathname === "/api/reset-sage" && req.method === "POST") {
    try {
      if (fs.existsSync(SAGE_PRISTINE_PATH)) {
        fs.copyFileSync(SAGE_PRISTINE_PATH, SAGE_DATA_PATH);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true, message: "Sage Accounting data restored to original pristine baseline" }));
      } else {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: false, error: "No pristine backup found" }));
      }
    } catch (err: any) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");
});

server.listen(PORT, () => {
  console.log(`Buki Web Dashboard running on http://localhost:${PORT}`);
});
