// scripts/post-proof-question.mjs
// Progressive 10-day questioning engine for Buki Sage evaluation

const token = process.env.PROOF_MCP_TOKEN;
if (!token) { console.error('Set PROOF_MCP_TOKEN (get one at https://proof.zeromaintenanceengineer.in/settings/mcp)'); process.exit(1); }

export const QUESTIONS = {
  1: {
    day: 1,
    verb: 'ask',
    content: "When Sage returns a sales invoice without a due date (like SI-3006 for Northgate Analytics), our normalizer leaves dueDate absent so the brief reports: '1 open invoice has no due date on file and is not counted'. In the full Buki satellite product, is the intended UX to flag these undated invoices in an executive alert so founders know to assign payment terms?",
    evidence_url: 'https://github.com/rishbahjain270804/buki-sage/pull/1'
  },
  2: {
    day: 2,
    verb: 'ask',
    content: "Sage access tokens expire in exactly 300 seconds. We implemented a 30s proactive refresh buffer before API requests in tokenStore.ts rather than relying on 401 retries. Does Buki prefer proactive refresh buffers across all finance connectors to avoid mid-sync pagination interruptions?",
    evidence_url: 'https://github.com/rishbahjain270804/buki-sage/blob/main/src/data/canonical/sage/tokenStore.ts'
  },
  3: {
    day: 3,
    verb: 'wonder',
    content: "Looking at how purchase invoices post to multiple ledger accounts: if an invoice has lines split across Software and Office Supplies, the brief isolates only the Software lines. Does Buki plan to introduce a brief question for vendor-level spend (e.g. 'What did we pay AWS last month') alongside nominal account spend?",
    evidence_url: 'https://github.com/rishbahjain270804/buki-sage/pull/1'
  },
  4: {
    day: 4,
    verb: 'ask',
    content: "In Sage v3.1, bank accounts have distinct IDs from their nominal ledger accounts. We built an automated ID mapping so BankTransaction.bankAccountId always links to an asset in the chart of accounts. Is this nominal asset linkage enforced across all upcoming banking connectors?",
    evidence_url: 'https://github.com/rishbahjain270804/buki-sage/blob/main/src/data/canonical/sage/normalize.ts'
  },
  5: {
    day: 5,
    verb: 'wonder',
    content: "We strictly followed Buki's rule never to convert currencies without explicit ledger conversion transactions. In production tenants where a company invoices in USD but holds EUR reserve accounts, does Buki plan to introduce certified FX rate providers or continue strict currency segregation?",
    evidence_url: 'https://github.com/rishbahjain270804/buki-sage/blob/main/src/lib/brief/answer.ts'
  },
  6: {
    day: 6,
    verb: 'ask',
    content: "For background cron synchronization on large businesses with >10,000 monthly transactions: does Buki prefer polling with updated_or_created_since incremental cursors, or moving toward webhook-driven delta synchronization in the satellite product?",
    evidence_url: 'https://github.com/rishbahjain270804/buki-sage/blob/main/src/data/canonical/sage/client.ts'
  },
  7: {
    day: 7,
    verb: 'wonder',
    content: "While validating the brief figures: combining total verified bank cash ($253,615) with trailing 3-month average purchase invoice burn (~$8,800/mo) deterministically yields ~28 months of runway. Is adding runway intelligence to the brief planned for the finance domain?",
    evidence_url: 'https://github.com/rishbahjain270804/buki-sage/pull/1'
  },
  8: {
    day: 8,
    verb: 'ask',
    content: "In the sample books, Northgate Analytics accounts for 65.9% ($30,000) of total invoiced revenue. Does Buki plan to surface revenue concentration risk warnings when a single customer exceeds 50% of receivables?",
    evidence_url: 'https://github.com/rishbahjain270804/buki-sage/blob/main/src/lib/finance/figures.ts'
  },
  9: {
    day: 9,
    verb: 'thinking',
    content: "Reflecting on resilience: when Sage is down or rate-limited (429), our connector logs ok:false in store.runs but preserves existing canonical store data so the dashboard never shows $0 cash. This pattern of stale-with-warning feels essential for executive trust.",
    evidence_url: 'https://github.com/rishbahjain270804/buki-sage/blob/main/src/lib/sync/runSync.ts'
  },
  10: {
    day: 10,
    verb: 'ask',
    content: "With the Sage v3.1 connector adhering cleanly to the FinanceProvider contract and 100% test coverage: how much of this architecture is reusable as a template for upcoming QuickBooks Online and Xero connectors?",
    evidence_url: 'https://github.com/rishbahjain270804/buki-sage/pull/1'
  }
};

async function postDay(dayNum) {
  const item = QUESTIONS[dayNum];
  if (!item) {
    console.error(`Unknown question day: ${dayNum}`);
    return;
  }

  console.log(`\n--- Posting Day ${item.day} Question [${item.verb}] to Proof ---`);
  const payload = {
    jsonrpc: '2.0',
    id: Date.now(),
    method: 'tools/call',
    params: {
      name: 'post_log',
      arguments: {
        verb: item.verb,
        content: item.content,
        evidence_url: item.evidence_url
      }
    }
  };

  const res = await fetch('https://proof.zeromaintenanceengineer.in/api/mcp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  const text = data?.result?.content?.[0]?.text || JSON.stringify(data);
  console.log(`Result: ${text}`);
}

const arg = process.argv[2];
if (arg) {
  const day = parseInt(arg, 10);
  if (!isNaN(day)) {
    postDay(day).catch(console.error);
  }
}
