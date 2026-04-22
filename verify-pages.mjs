import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const screenshotDir = path.join(__dirname, 'screenshots');

const allErrors = [];
const findings = [];

const browser = await chromium.launch();
const page = await browser.newPage();

page.on('console', msg => {
  if (msg.type() === 'error') {
    allErrors.push({ url: page.url(), message: msg.text() });
  }
});

async function checkRoute(url, name) {
  const slug = name.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  const screenshotPath = path.join(screenshotDir, `${slug}.png`);
  
  findings.push(`\n=== ${name} (${url}) ===`);
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
    await page.screenshot({ path: screenshotPath, fullPage: true });
    
    const finalUrl = page.url();
    findings.push(`  Loaded: OK`);
    findings.push(`  Final URL: ${finalUrl}`);
    if (finalUrl !== url) findings.push(`  (Redirected)`);
  } catch (e) {
    findings.push(`  Loaded: FAILED - ${e.message}`);
  }
  await page.waitForTimeout(500);
}

// Create screenshots directory
await fs.promises.mkdir(screenshotDir, { recursive: true });

// 1. Homepage
await checkRoute('http://localhost:5173/', 'Homepage');

// 2. Guest setup
await checkRoute('http://localhost:5173/guest-setup', 'Guest Setup');

// 3. Play 4-5
await checkRoute('http://localhost:5173/play/4-5', 'Play 4-5');

await browser.close();

// Report
findings.forEach(f => console.log(f));
console.log('\n========== CONSOLE ERRORS ==========');
console.log(`Total: ${allErrors.length}`);
allErrors.forEach((e, i) => console.log(`  [${i + 1}] (${e.url}):\n    ${e.message}`));
console.log('\nScreenshots saved to:', screenshotDir);
