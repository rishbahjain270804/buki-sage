import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

async function recordStudioDemo() {
  const videoDir = path.resolve('videos');
  if (!fs.existsSync(videoDir)) {
    fs.mkdirSync(videoDir, { recursive: true });
  }

  // clean old videos
  fs.readdirSync(videoDir).forEach(f => {
    try { fs.unlinkSync(path.join(videoDir, f)); } catch(e) {}
  });

  console.log('--- Launching Playwright to Record Master Studio Walkthrough ---');
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: { dir: videoDir, size: { width: 1280, height: 720 } }
  });

  const page = await context.newPage();

  console.log('1. Navigating to Dashboard...');
  await page.goto('http://localhost:4110', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  console.log('2. Starting Interactive Tour via evaluate...');
  await page.evaluate(() => {
    if (typeof startGuidedTour === 'function') {
      startGuidedTour();
    }
  });
  await page.waitForTimeout(3000);

  console.log('3. Tour Step 2: "Who owes us money?"...');
  await page.evaluate(() => nextTourStep());
  await page.waitForTimeout(4000);

  console.log('4. Tour Step 3: Software Spend ($2,350)...');
  await page.evaluate(() => nextTourStep());
  await page.waitForTimeout(4000);

  console.log('5. Tour Step 4: Live Mutation Sandbox...');
  await page.evaluate(() => nextTourStep());
  await page.waitForTimeout(2500);

  console.log('6. Triggering live mutation: Record $5,000 Payment...');
  const payBtn = page.locator("button:has-text('Record $5,000 Payment')");
  await payBtn.click();
  await page.waitForTimeout(3500);

  console.log('7. Tour Step 5: FDE Flashcards...');
  await page.evaluate(() => nextTourStep());
  await page.waitForTimeout(3000);

  console.log('8. Ending Tour & inspecting Invoices ledger...');
  await page.evaluate(() => endTour());
  await page.waitForTimeout(1000);

  const invTab = page.locator("button:has-text('Invoices & Receivables')");
  await invTab.click();
  await page.waitForTimeout(3000);

  const cashTab = page.locator("button:has-text('Bank Cash & Ledger')");
  await cashTab.click();
  await page.waitForTimeout(3000);

  console.log('9. Opening Standalone Flashcard page...');
  await page.goto('http://localhost:4110/flashcards', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  console.log('10. Flipping Flashcard 1...');
  const cardScene = page.locator('#card-scene');
  await cardScene.click();
  await page.waitForTimeout(3000);

  console.log('11. Flipping Flashcard 2...');
  const nextCardBtn = page.locator("button:has-text('Next Card')");
  await nextCardBtn.click();
  await page.waitForTimeout(1500);
  await cardScene.click();
  await page.waitForTimeout(3000);

  console.log('--- Finalizing Studio Video ---');
  await page.close();
  await context.close();
  await browser.close();

  const files = fs.readdirSync(videoDir).filter(f => f.endsWith('.webm'));
  if (files.length > 0) {
    const latest = files[files.length - 1];
    const src = path.join(videoDir, latest);
    const dest = path.resolve('demo.webm');
    fs.copyFileSync(src, dest);
    console.log(`Master demo video recorded successfully: ${dest} (${(fs.statSync(dest).size / 1024).toFixed(1)} KB)`);
  }
}

import('../api/index.js').then(async (mod) => {
  const handler = mod.default;
  const http = await import('node:http');
  const server = http.createServer((req, res) => handler(req, res));
  server.listen(4110, async () => {
    console.log('Local server running on 4110 for video capture');
    await recordStudioDemo();
    server.close();
    process.exit(0);
  });
});
