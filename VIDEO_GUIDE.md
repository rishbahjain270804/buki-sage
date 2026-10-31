# 5-Minute Submission Video Script & Checklist

For: **Bring Sage into Buki** submission by **Rishabh Bothra**  
Reviewer: **Vivek Chandrasekar** (`vivekschandrasekar-beep`)  
Time limit: **5 minutes max**

---

## Video Outline & Timing Breakdown

### Segment 1: Quick Introduction (0:00 - 0:45)
- **Say**: "Hi Vivek, I'm Rishabh Bothra. This is my submission for the Sage connector in Buki. I'll demonstrate the connector running against the canonical contract, answering the brief questions, showing the Finance module, and picking up changes on a schedule."
- **Show**: Clean terminal, git status, and project file structure.

### Segment 2: Fresh Start & Health Check (0:45 - 1:45)
- **Terminal 1**: Start mock BambooHR:
  ```bash
  npm run mock
  ```
- **Terminal 2**: Start mock Sage server (or live Sage connection):
  ```bash
  npm run mock:sage
  ```
- **Terminal 3**: Run health check:
  ```bash
  npm run health
  ```
  *Point out*: Both `hr/bamboohr` and `finance/sage` report `ok: true`.

### Segment 3: First Synchronization (1:45 - 2:30)
- **Execute**:
  ```bash
  npm run sync
  ```
- **Point out**:
  - `hr/bamboohr: pulled 48, added 48, changed 0, removed 0`
  - `finance/sage: pulled 32, added 32, changed 0, removed 0`
- Briefly show that `.data/store.json` holds the normalized canonical records.

### Segment 4: Brief Answers & Finance Module (2:30 - 3:30)
- **Show Finance module**:
  ```bash
  npm run show -- finance
  ```
  *Highlight*: Operating & Reserve bank balances, September & October invoiced revenue, overdue receivables ($12,000), Software subscriptions spend ($300), and top customers.
- **Ask the two key brief questions**:
  ```bash
  npm run ask -- "who owes us money"
  npm run ask -- "what did we spend on software last month"
  ```
  *Highlight*: Grounded answers with exact citations and timestamps.

### Segment 5: Scheduled Sync & Live Change Pickup (3:30 - 4:30)
- **Start cron in background**:
  ```bash
  npm run cron
  ```
- **Make a live change**:
  - Open `mock/sage/data/business.json` (or the Sage web UI) and modify `si-3006`'s `outstanding_amount` or add a new invoice.
- **Watch the next tick**:
  - The cron output immediately prints: `ok finance/sage: pulled 32, added 0, changed 1, removed 0`.
- **Re-ask**:
  ```bash
  npm run ask -- "who owes us money"
  ```
  *Highlight*: Updated figures show up automatically without touching a button.

### Segment 6: Tests & Wrap Up (4:30 - 5:00)
- **Run automated test suite**:
  ```bash
  npm test
  npm run typecheck
  ```
  *Highlight*: 40/40 tests passing, 0 TypeScript errors.
- **Say**: "All code is clean, adheres strictly to the absence rule, and is pushed to my private repository with vivekschandrasekar-beep invited. Thank you!"
