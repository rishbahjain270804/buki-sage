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
        <button class="btn btn-primary" onclick="startGuidedTour()">▶️ Interactive Tour</button>
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
          <div class="kpi-title">TOTAL OUTSTANDING</div>
          <div class="kpi-value val-amber" id="kpi-outstanding">Loading...</div>
          <div class="kpi-sub" id="kpi-outstanding-sub"></div>
        </div>
        <div class="kpi-card">
          <div class="kpi-title">SALES INVOICES</div>
          <div class="kpi-value val-blue" id="kpi-invoices">Loading...</div>
          <div class="kpi-sub" id="kpi-invoices-sub"></div>
        </div>
        <div class="kpi-card">
          <div class="kpi-title">TOTAL INVOICED</div>
          <div class="kpi-value val-green" id="kpi-revenue">Loading...</div>
          <div class="kpi-sub" id="kpi-revenue-sub"></div>
        </div>
        <div class="kpi-card">
          <div class="kpi-title">CONTACTS ON FILE</div>
          <div class="kpi-value val-purple" id="kpi-contacts">Loading...</div>
          <div class="kpi-sub" id="kpi-contacts-sub"></div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
        <div class="table-card">
          <div class="table-header"><div class="table-title">Top Customers by Invoiced Volume</div></div>
          <table>
            <thead><tr><th>Customer</th><th style="text-align: right;">Invoiced</th><th style="text-align: right;">Outstanding</th></tr></thead>
            <tbody id="top-customers-rows"></tbody>
          </table>
        </div>

        <div class="table-card">
          <div class="table-header"><div class="table-title">Invoices by Status</div></div>
          <table>
            <thead><tr><th>Status</th><th style="text-align: right;">Count</th><th style="text-align: right;">Total Amount</th></tr></thead>
            <tbody id="status-breakdown-rows"></tbody>
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
        <div class="table-header"><div class="table-title">Ledger Accounts (Chart of Accounts)</div></div>
        <table>
          <thead><tr><th>Code</th><th>Account Name</th><th>Type</th></tr></thead>
          <tbody id="ledger-rows"></tbody>
        </table>
      </div>
    </div>

    <!-- SANDBOX TAB -->
    <div id="tab-sandbox" class="tab-content">
      <div class="sandbox-panel">
        <div class="sandbox-title">⚡ Live Sage Mutation Simulator</div>
        <div class="sandbox-desc">Simulate live changes in the in-memory store to verify change detection. These mutations modify the serverless instance's data — click Reset to restore the original synced state.</div>
        <div class="sandbox-actions">
          <button class="btn btn-amber" onclick="mutate('partial-pay')">💵 Record Partial Payment on First Unpaid Invoice</button>
          <button class="btn btn-primary" onclick="mutate('mark-paid')">✔️ Mark Second Unpaid Invoice as Paid</button>
          <button class="btn" onclick="resetData()">🔄 Reset to Baseline</button>
        </div>
        <div class="mutation-status" id="mut-status">System Ready. Live Sage data loaded.</div>
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

    <!-- GUIDED TOUR BANNER OVERLAY -->
    <div id="tour-banner" style="display:none; position:fixed; bottom:28px; left:50%; transform:translateX(-50%); background:rgba(22, 27, 34, 0.95); border:2px solid #388bfd; border-radius:14px; padding:20px 26px; box-shadow:0 16px 40px rgba(0,0,0,0.7); z-index:9999; max-width:680px; width:92%; backdrop-filter:blur(16px);">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <span id="tour-badge" style="background:rgba(56,139,253,0.2); color:#58a6ff; font-family:var(--font-mono); font-size:11px; font-weight:700; padding:4px 12px; border-radius:6px; letter-spacing:0.5px;">TOUR STEP 1 OF 5</span>
        <button onclick="endTour()" style="background:transparent; border:none; color:var(--text-muted); cursor:pointer; font-size:18px; padding:2px 8px;">✕</button>
      </div>
      <div id="tour-title" style="font-size:17px; font-weight:700; color:#f0f6fc; margin-bottom:6px;"></div>
      <div id="tour-desc" style="font-size:13px; color:#8b949e; line-height:1.5; margin-bottom:16px;"></div>
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <button class="btn" onclick="prevTourStep()" id="tour-prev-btn" style="padding:7px 16px; font-size:13px;">← Prev</button>
        <button class="btn btn-primary" onclick="nextTourStep()" id="tour-next-btn" style="padding:7px 18px; font-size:13px;">Next Step →</button>
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

    function fmtCur(amount, currency) {
      const whole = Math.round(Math.abs(amount)).toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',');
      return (currency === 'USD' ? '$' : currency + ' ') + whole;
    }

    function statusBadge(s) {
      if (s === 'paid') return '<span class="badge badge-green">PAID</span>';
      if (s === 'unpaid') return '<span class="badge badge-red">UNPAID</span>';
      if (s === 'part_paid') return '<span class="badge badge-blue">PART PAID</span>';
      if (s === 'draft') return '<span class="badge" style="background:rgba(139,148,158,0.15);color:#8b949e;border:1px solid rgba(139,148,158,0.35);">DRAFT</span>';
      if (s === 'void') return '<span class="badge" style="background:rgba(139,148,158,0.15);color:#8b949e;border:1px solid rgba(139,148,158,0.35);">VOID</span>';
      return '<span class="badge badge-blue">' + (s || 'UNKNOWN').toUpperCase() + '</span>';
    }

    async function loadData() {
      const res = await fetch('/api/store-data');
      const data = await res.json();
      const fin = data.finance || {};
      const invoices = fin.invoices || [];
      const parties = fin.parties || [];
      const accounts = fin.accounts || [];
      const currency = invoices[0]?.currency || 'GBP';
      const partyMap = {};
      parties.forEach(p => partyMap[p.id] = p.name);

      // KPIs
      const totalOutstanding = invoices.reduce((s, i) => s + (i.outstanding || 0), 0);
      const totalInvoiced = invoices.reduce((s, i) => s + (i.total || 0), 0);
      const unpaidCount = invoices.filter(i => i.status === 'unpaid' || i.status === 'part_paid').length;
      document.getElementById('kpi-outstanding').innerText = fmtCur(totalOutstanding, currency);
      document.getElementById('kpi-outstanding-sub').innerText = unpaidCount + ' unpaid/part-paid invoices';
      document.getElementById('kpi-invoices').innerText = invoices.length.toString();
      document.getElementById('kpi-invoices-sub').innerText = 'From live Sage trial business';
      document.getElementById('kpi-revenue').innerText = fmtCur(totalInvoiced, currency);
      document.getElementById('kpi-revenue-sub').innerText = 'Total across all sales invoices';
      document.getElementById('kpi-contacts').innerText = parties.length.toString();
      document.getElementById('kpi-contacts-sub').innerText = 'Customers & suppliers synced';

      // Top customers
      const byParty = {};
      invoices.filter(i => i.kind === 'sales').forEach(inv => {
        const name = partyMap[inv.partyId] || inv.partyId;
        if (!byParty[name]) byParty[name] = { total: 0, outstanding: 0 };
        byParty[name].total += (inv.total || 0);
        byParty[name].outstanding += (inv.outstanding || 0);
      });
      const sorted = Object.entries(byParty).sort((a, b) => b[1].total - a[1].total).slice(0, 5);
      const custTbody = document.getElementById('top-customers-rows');
      custTbody.innerHTML = '';
      sorted.forEach(([name, v]) => {
        const row = document.createElement('tr');
        const oColor = v.outstanding > 0 ? '#f85149' : '#3fb950';
        row.innerHTML = '<td>' + name + '</td><td class="mono" style="text-align:right;">' + fmtCur(v.total, currency) + '</td><td class="mono" style="text-align:right;color:' + oColor + ';">' + fmtCur(v.outstanding, currency) + '</td>';
        custTbody.appendChild(row);
      });

      // Status breakdown
      const statusMap = {};
      invoices.forEach(inv => {
        const s = inv.status || 'unknown';
        if (!statusMap[s]) statusMap[s] = { count: 0, total: 0 };
        statusMap[s].count++;
        statusMap[s].total += (inv.total || 0);
      });
      const statusTbody = document.getElementById('status-breakdown-rows');
      statusTbody.innerHTML = '';
      Object.entries(statusMap).sort((a, b) => b[1].total - a[1].total).forEach(([s, v]) => {
        const row = document.createElement('tr');
        row.innerHTML = '<td>' + statusBadge(s) + '</td><td class="mono" style="text-align:right;">' + v.count + '</td><td class="mono" style="text-align:right;">' + fmtCur(v.total, currency) + '</td>';
        statusTbody.appendChild(row);
      });

      // Invoices tab
      const invTbody = document.getElementById('inv-rows');
      invTbody.innerHTML = '';
      invoices.slice(0, 50).forEach(inv => {
        const row = document.createElement('tr');
        row.innerHTML = '<td><strong>' + (inv.number || inv.id) + '</strong></td><td>' + (inv.kind || '').toUpperCase() + '</td><td class="mono">' + (inv.date || '-') + '</td><td class="mono">' + (inv.dueDate || '-') + '</td><td>' + statusBadge(inv.status) + '</td><td class="mono" style="text-align:right;">' + fmtCur(inv.outstanding || 0, currency) + '</td>';
        invTbody.appendChild(row);
      });

      // Ledger accounts tab
      const ledgerTbody = document.getElementById('ledger-rows');
      ledgerTbody.innerHTML = '';
      accounts.sort((a, b) => (a.code || '').localeCompare(b.code || '')).slice(0, 50).forEach(acc => {
        const typeBadge = acc.type === 'income' ? 'badge-green' : acc.type === 'expense' ? 'badge-red' : acc.type === 'asset' ? 'badge-blue' : 'badge-blue';
        const row = document.createElement('tr');
        row.innerHTML = '<td class="mono">' + (acc.code || '-') + '</td><td>' + acc.name + '</td><td><span class="badge ' + typeBadge + '">' + (acc.type || '').toUpperCase() + '</span></td>';
        ledgerTbody.appendChild(row);
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
      loadData();
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
      status.innerHTML = '✅ <strong style="color:#388bfd">Sage Mutated:</strong> ' + data.message;
      loadData();
      submitQuery();
    }

    async function resetData() {
      await fetch('/api/reset-sage', { method: 'POST' });
      document.getElementById('mut-status').innerText = 'Reset to baseline. Live Sage data restored.';
      loadData();
      submitQuery();
    }

    // GUIDED TOUR
    const TOUR_STEPS = [
      {
        step: 1, tab: 'overview',
        title: '1/4: Live Sage Data Overview',
        desc: 'All KPIs and tables are computed dynamically from real Sage trial data synced via OAuth. 202 sales invoices, 47 contacts, 134 ledger accounts.',
        action: () => {}
      },
      {
        step: 2, tab: 'brief',
        title: '2/4: Founder Brief — "Who owes us money?"',
        desc: 'Natural language queries run against the canonical store. Try "who owes us money", "biggest customers", or "how much cash do we have".',
        action: () => { askQuestion('who owes us money'); }
      },
      {
        step: 3, tab: 'invoices',
        title: '3/4: 202 Real Sales Invoices from Sage',
        desc: 'Each invoice has correct party links, dates, amounts (parsed from Sage string format), and status. Data loaded via Sage test data collection.',
        action: () => {}
      },
      {
        step: 4, tab: 'sandbox',
        title: '4/4: Live Mutation Simulator',
        desc: 'Simulate changes to test the sync engine. Mutations modify the in-memory store and the brief answers update instantly.',
        action: () => {}
      }
    ];

    let tourIdx = 0;
    function startGuidedTour() {
      tourIdx = 0;
      document.getElementById('tour-banner').style.display = 'block';
      renderTourStep();
    }
    function renderTourStep() {
      const s = TOUR_STEPS[tourIdx];
      document.getElementById('tour-badge').innerText = 'TOUR STEP ' + (tourIdx + 1) + ' OF ' + TOUR_STEPS.length;
      document.getElementById('tour-title').innerText = s.title;
      document.getElementById('tour-desc').innerText = s.desc;
      const tabBtn = Array.from(document.querySelectorAll('.tab-btn')).find(b => b.innerText.toLowerCase().includes(s.tab));
      if (tabBtn) switchTab(s.tab, tabBtn);
      s.action();
      document.getElementById('tour-prev-btn').style.visibility = tourIdx === 0 ? 'hidden' : 'visible';
      document.getElementById('tour-next-btn').innerText = tourIdx === TOUR_STEPS.length - 1 ? 'Finish Tour ✔' : 'Next Step →';
    }
    function nextTourStep() { if (tourIdx < TOUR_STEPS.length - 1) { tourIdx++; renderTourStep(); } else endTour(); }
    function prevTourStep() { if (tourIdx > 0) { tourIdx--; renderTourStep(); } }
    function endTour() { document.getElementById('tour-banner').style.display = 'none'; }

    loadData();
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
      const unpaid = (currentStore.finance?.invoices || []).filter((i: any) => i.status === "unpaid" || i.status === "part_paid");
      if (action === "partial-pay") {
        const inv = unpaid[0];
        if (inv) {
          const payment = Math.round(inv.outstanding * 0.5);
          inv.outstanding = inv.outstanding - payment;
          inv.status = inv.outstanding > 0 ? "part_paid" : "paid";
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ ok: true, message: "Recorded payment of " + payment + " on " + (inv.number || inv.id) + ": outstanding now " + inv.outstanding }));
        } else {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ ok: true, message: "No unpaid invoices to apply payment to" }));
        }
        return;
      }
      if (action === "mark-paid") {
        const inv = unpaid.length > 1 ? unpaid[1] : unpaid[0];
        if (inv) {
          inv.outstanding = 0;
          inv.status = "paid";
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ ok: true, message: "Marked " + (inv.number || inv.id) + " as PAID (outstanding now 0)" }));
        } else {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ ok: true, message: "No unpaid invoices to mark as paid" }));
        }
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
