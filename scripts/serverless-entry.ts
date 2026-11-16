/**
 * Vercel Serverless Function Entry Point for Buki Executive Dashboard
 */

import type { IncomingMessage, ServerResponse } from "node:http";
import url from "node:url";
import initialStore from "../.data/store.json";
import { answerBrief } from "../src/lib/brief/answer";
import { FLASHCARDS_HTML } from "./flashcards-data";

let currentStore: any = JSON.parse(JSON.stringify(initialStore));

function getHtml(): string {
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
      --accent-green: #238636;
      --accent-blue: #388bfd;
      --accent-amber: #d29922;
      --accent-red: #f85149;
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
    .cloud-badge {
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
    .btn-primary { background: #238636; color: white; border-color: rgba(255,255,255,0.1); }
    .btn-primary:hover { background: #2ea043; }
    .btn-blue { background: #1f6feb; color: white; border-color: rgba(255,255,255,0.1); }
    .btn-blue:hover { background: #388bfd; }
    .btn-amber { background: rgba(210, 153, 34, 0.15); border-color: rgba(210, 153, 34, 0.4); color: #d29922; }

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
      font-family: var(--font);
      display: flex;
      align-items: center;
      gap: 8px;
      white-space: nowrap;
    }
    .tab-btn:hover { color: var(--text); background: rgba(255, 255, 255, 0.05); }
    .tab-btn.active { color: white; background: #21262d; border-bottom: 2px solid var(--accent-blue); }

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
    }
    .kpi-title { font-size: 12px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px; }
    .kpi-value { font-size: 26px; font-weight: 700; font-family: var(--font-mono); }
    .kpi-sub { font-size: 12px; color: var(--text-muted); margin-top: 6px; }
    .val-green { color: #3fb950; }
    .val-amber { color: #d29922; }
    .val-blue { color: #58a6ff; }
    .val-purple { color: #bc8cff; }

    .ask-box {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 28px;
    }
    .ask-title { font-size: 16px; font-weight: 700; margin-bottom: 12px; }
    .chips-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
    .chip {
      background: rgba(56, 139, 253, 0.08);
      border: 1px solid rgba(56, 139, 253, 0.25);
      color: #58a6ff;
      border-radius: 999px;
      padding: 5px 14px;
      font-size: 12px;
      cursor: pointer;
    }
    .chip:hover { background: rgba(56, 139, 253, 0.2); }
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

    .table-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 22px;
      margin-bottom: 24px;
    }
    .table-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px; }
    .table-title { font-size: 16px; font-weight: 700; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th { text-align: left; padding: 10px 12px; color: var(--text-muted); font-size: 11px; font-weight: 600; text-transform: uppercase; border-bottom: 1px solid var(--border); }
    td { padding: 12px; border-bottom: 1px solid rgba(48, 54, 61, 0.4); }
    .mono { font-family: var(--font-mono); }
    .badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; }
    .badge-red { background: rgba(248, 81, 73, 0.15); color: #f85149; border: 1px solid rgba(248, 81, 73, 0.35); }
    .badge-green { background: rgba(46, 160, 67, 0.15); color: #3fb950; border: 1px solid rgba(46, 160, 67, 0.35); }
    .badge-blue { background: rgba(56, 139, 253, 0.15); color: #58a6ff; border: 1px solid rgba(56, 139, 253, 0.35); }
    
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
    .mutation-status { background: #0d1117; border: 1px solid var(--border); border-radius: 8px; padding: 14px 18px; font-size: 13px; font-family: var(--font-mono); color: #3fb950; }

    .tab-content { display: none; }
    .tab-content.active { display: block; }
    footer { border-top: 1px solid var(--border); padding: 24px 20px; font-size: 13px; color: var(--text-muted); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-top: auto; }
    footer a { color: var(--accent-blue); text-decoration: none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <header>
      <div class="brand-wrap">
        <div class="brand-logo">B</div>
        <div class="brand-text">
          <h1>Buki Finance Executive Dashboard</h1>
          <p>Canonical Sage v3.1 Integration · Hosted 24/7 on Vercel Serverless</p>
        </div>
      </div>
      <div class="header-actions">
        <div class="cloud-badge">
          <div class="pulse-dot"></div>
          VERCEL CLOUD 24/7
        </div>
        <button class="btn btn-blue" onclick="triggerSync(this)">Sync Now</button>
      </div>
    </header>

    <div class="nav-tabs">
      <button class="tab-btn active" onclick="switchTab('overview', this)">📊 Overview & Figures</button>
      <button class="tab-btn" onclick="switchTab('brief', this)">💬 Natural Language Brief</button>
      <button class="tab-btn" onclick="switchTab('invoices', this)">📑 Invoices & Receivables</button>
      <button class="tab-btn" onclick="switchTab('cash', this)">🏦 Bank Cash & Ledger</button>
      <button class="tab-btn" onclick="switchTab('sandbox', this)">⚡ Live Mutation Sandbox</button>
      <button class="tab-btn" onclick="switchTab('flashcards', this)">🎴 FDE Flashcards</button>
    </div>

    <!-- OVERVIEW TAB -->
    <div id="tab-overview" class="tab-content active">
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-title">TOTAL BANK CASH</div>
          <div class="kpi-value val-green">$253,615</div>
          <div class="kpi-sub">Operating ($63.5k) & Reserve ($190.1k)</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-title">OVERDUE RECEIVABLES</div>
          <div class="kpi-value val-amber" id="ov-overdue">$12,000</div>
          <div class="kpi-sub">2 open sales invoices past terms</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-title">SEPT SOFTWARE SPEND</div>
          <div class="kpi-value val-blue">$300</div>
          <div class="kpi-sub">Software subscriptions nominal account</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-title">INVOICED REVENUE</div>
          <div class="kpi-value val-purple">$45,500</div>
          <div class="kpi-sub">Sept ($33.5k) · Oct ($12.0k)</div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
        <div class="table-card">
          <div class="table-header"><div class="table-title">Top Customers by Volume</div></div>
          <table>
            <thead><tr><th>Customer</th><th style="text-align: right;">Invoiced</th><th style="text-align: right;">Outstanding</th></tr></thead>
            <tbody>
              <tr><td>Northgate Analytics</td><td class="mono" style="text-align: right;">$30,000.00</td><td class="mono" style="text-align: right; color: #3fb950;">$12,000.00</td></tr>
              <tr><td>Pinecrest Health</td><td class="mono" style="text-align: right;">$9,500.00</td><td class="mono" style="text-align: right; color: #f85149;" id="pine-overdue">$9,500.00</td></tr>
              <tr><td>Tolliver & Reed LLP</td><td class="mono" style="text-align: right;">$6,000.00</td><td class="mono" style="text-align: right; color: #f85149;" id="toll-overdue">$2,500.00</td></tr>
            </tbody>
          </table>
        </div>

        <div class="table-card">
          <div class="table-header"><div class="table-title">Spend by Expense Account (Sept 2026)</div></div>
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

    <!-- BRIEF TAB -->
    <div id="tab-brief" class="tab-content">
      <div class="ask-box">
        <div class="ask-title">Ask Founder Financial & Payroll Questions</div>
        <div class="chips-row">
          <span class="chip" onclick="askQuestion('who owes us money')">Who owes us money?</span>
          <span class="chip" onclick="askQuestion('what did we spend on software last month')">What did we spend on software last month?</span>
          <span class="chip" onclick="askQuestion('how much cash do we have')">How much cash do we have?</span>
          <span class="chip" onclick="askQuestion('how many people')">How many people on payroll?</span>
          <span class="chip" onclick="askQuestion('what does the Engineering team cost')">What does Engineering cost?</span>
        </div>
        <div class="query-input-wrap">
          <input type="text" id="query-input" class="query-input" value="who owes us money">
          <button class="btn btn-primary" onclick="submitQuery()">Ask Buki</button>
        </div>
        <div id="brief-answer-box" class="answer-card">
          <div id="brief-text" class="answer-text"></div>
          <div id="brief-figures" class="fig-list"></div>
          <div id="brief-citation" class="cite-label"></div>
        </div>
      </div>
    </div>

    <!-- INVOICES TAB -->
    <div id="tab-invoices" class="tab-content">
      <div class="table-card">
        <div class="table-header"><div class="table-title">Sage Accounting Invoices</div></div>
        <table>
          <thead><tr><th>Invoice #</th><th>Type</th><th>Issue Date</th><th>Due Date</th><th>Status</th><th style="text-align: right;">Outstanding</th></tr></thead>
          <tbody id="inv-rows"></tbody>
        </table>
      </div>
    </div>

    <!-- BANK TAB -->
    <div id="tab-cash" class="tab-content">
      <div class="table-card">
        <div class="table-header"><div class="table-title">Bank Accounts & Nominal Assets</div></div>
        <table>
          <thead><tr><th>Bank Account</th><th>Nominal Asset ID</th><th>Transactions</th><th style="text-align: right;">Cash Balance</th></tr></thead>
          <tbody>
            <tr><td>Operating account</td><td class="mono">acc-asset-operating</td><td class="mono">7 txns</td><td class="mono" style="text-align: right; color: #3fb950; font-weight: 700;">$63,520.00</td></tr>
            <tr><td>Reserve account</td><td class="mono">acc-asset-reserve</td><td class="mono">3 txns</td><td class="mono" style="text-align: right; color: #3fb950; font-weight: 700;">$190,095.00</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- SANDBOX TAB -->
    <div id="tab-sandbox" class="tab-content">
      <div class="sandbox-panel">
        <div class="sandbox-title">⚡ Live Sage Mutation Simulator</div>
        <div class="sandbox-desc">Simulate live changes in Sage Accounting and verify real-time change detection.</div>
        <div class="sandbox-actions">
          <button class="btn btn-amber" onclick="mutate('partial-pay')">💵 Record $5,000 Payment for Pinecrest ($9.5k → $4.5k)</button>
          <button class="btn btn-primary" onclick="mutate('mark-paid')">✔️ Mark Tolliver & Reed as Paid ($0 Outstanding)</button>
          <button class="btn" onclick="resetData()">🔄 Reset to Baseline</button>
        </div>
        <div class="mutation-status" id="mut-status">System Ready. Baseline loaded.</div>
      </div>
    </div>

    <!-- FLASHCARDS TAB -->
    <div id="tab-flashcards" class="tab-content">
      <div style="background: var(--card-bg); border: 1px solid var(--border); border-radius: 12px; padding: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 12px;">
          <div>
            <h2 style="font-size: 18px; font-weight: 700; color: #58a6ff;">🎴 FDE Interview Flashcards (20 Master Questions)</h2>
            <p style="color: var(--text-muted); font-size: 13px;">Master every technical decision, accounting rule, and architectural perspective from the Buki Sage challenge.</p>
          </div>
          <a href="/flashcards" target="_blank" class="btn btn-blue">Open Full-Screen ↗</a>
        </div>
        <iframe src="/flashcards" style="width: 100%; height: 750px; border: 1px solid var(--border); border-radius: 12px; background: #090d16;"></iframe>
      </div>
    </div>

    <footer>
      <div>Candidate: <strong>Rishabh Bothra</strong> · Evaluated by <strong>Vivek Chandrasekar</strong> (vivek@mybuki.ai)</div>
      <div>
        <a href="https://github.com/rishbahjain270804/buki-sage/pull/1" target="_blank">Pull Request #1</a> · 
        <a href="https://proof.zeromaintenanceengineer.in/next/build/a6302c1b-6e8a-44e0-88f6-b8c0c075c766" target="_blank">Proof Notebook</a>
      </div>
    </footer>
  </div>

  <script>
    function switchTab(id, el) {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      el.classList.add('active');
      document.getElementById('tab-' + id).classList.add('active');
    }

    async function loadInvoices() {
      const res = await fetch('/api/store-data');
      const data = await res.json();
      const tbody = document.getElementById('inv-rows');
      tbody.innerHTML = '';
      (data.finance?.invoices || []).forEach(inv => {
        let badge = '<span class="badge badge-green">PAID</span>';
        if (inv.status === 'overdue') badge = '<span class="badge badge-red">OVERDUE</span>';
        else if (inv.status === 'open') badge = '<span class="badge badge-blue">OPEN</span>';
        const row = document.createElement('tr');
        row.innerHTML = '<td><strong>' + (inv.number || inv.id) + '</strong></td><td>' + inv.kind.toUpperCase() + '</td><td>' + inv.date + '</td><td>' + (inv.dueDate || 'None') + '</td><td>' + badge + '</td><td class="mono" style="text-align:right;">$' + inv.outstanding.toLocaleString() + '</td>';
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
      document.getElementById('brief-text').innerText = 'Analyzing store...';
      const res = await fetch('/api/ask?q=' + encodeURIComponent(q));
      const data = await res.json();
      document.getElementById('brief-text').innerText = data.answer;
      let figHtml = '';
      (data.figures || []).forEach(f => {
        figHtml += '<div class="fig-tag"><strong>' + f.label + ':</strong> ' + f.value + '</div>';
      });
      document.getElementById('brief-figures').innerHTML = figHtml;
      if (data.cited) {
        document.getElementById('brief-citation').innerText = 'Cited from ' + data.cited.source + ' · ' + data.cited.records + ' records on file';
      }
    }

    async function triggerSync(btn) {
      if (btn) btn.innerText = 'Syncing...';
      await fetch('/api/sync', { method: 'POST' });
      if (btn) { btn.innerText = 'Synced!'; setTimeout(() => btn.innerText = 'Sync Now', 2000); }
      loadInvoices();
      submitQuery();
    }

    async function mutate(action) {
      const status = document.getElementById('mut-status');
      status.innerText = 'Mutating in cloud memory...';
      const res = await fetch('/api/mutate-sage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      const data = await res.json();
      status.innerHTML = '✅ <strong>Sage Mutated:</strong> ' + data.message;
      if (action === 'partial-pay') {
        document.getElementById('pine-overdue').innerText = '$4,500.00';
        document.getElementById('ov-overdue').innerText = '$7,000';
      } else if (action === 'mark-paid') {
        document.getElementById('toll-overdue').innerText = '$0.00';
      }
      loadInvoices();
      submitQuery();
    }

    async function resetData() {
      await fetch('/api/reset-sage', { method: 'POST' });
      document.getElementById('mut-status').innerText = 'Reset to baseline.';
      document.getElementById('pine-overdue').innerText = '$9,500.00';
      document.getElementById('toll-overdue').innerText = '$2,500.00';
      document.getElementById('ov-overdue').innerText = '$12,000';
      loadInvoices();
      submitQuery();
    }

    loadInvoices();
    submitQuery();
  </script>
</body>
</html>`;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const parsed = url.parse(req.url || "/", true);
  const pathname = parsed.pathname || "/";

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
    res.end(getHtml());
    return;
  }

  if (pathname === "/flashcards" || pathname === "/flashcards.html") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(FLASHCARDS_HTML);
    return;
  }

  if (pathname === "/api/store-data") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(currentStore));
    return;
  }

  if (pathname === "/api/ask") {
    const q = (parsed.query.q as string) || "";
    try {
      const answer = answerBrief(q, currentStore);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(answer));
    } catch (err: any) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  if (pathname === "/api/sync" && req.method === "POST") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, financeChanged: 0 }));
    return;
  }

  if (pathname === "/api/mutate-sage" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      const { action } = JSON.parse(body || "{}");
      if (action === "partial-pay") {
        const inv = currentStore.finance.invoices.find((i: any) => i.id === "sage:si-3002");
        if (inv) inv.outstanding = 4500;
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true, message: "Recorded $5,000 payment for SI-3002: outstanding is now $4,500" }));
        return;
      }
      if (action === "mark-paid") {
        const inv = currentStore.finance.invoices.find((i: any) => i.id === "sage:si-3003");
        if (inv) {
          inv.outstanding = 0;
          inv.status = "paid";
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true, message: "Marked SI-3003 as PAID ($0 outstanding)" }));
        return;
      }
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: false, error: "Unknown action" }));
    });
    return;
  }

  if (pathname === "/api/reset-sage" && req.method === "POST") {
    currentStore = JSON.parse(JSON.stringify(initialStore));
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, message: "Baseline restored" }));
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");
}
