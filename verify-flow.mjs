import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const allErrors = [];
const results = {};
const screenshotDir = '/tmp/geo-verify-screenshots';

const browser = await chromium.launch();
const page = await browser.newPage();

page.on('console', msg => {
  const text = msg.text();
  if (msg.type() === 'error') {
    allErrors.push({ step: 'ongoing', url: page.url(), message: text });
  }
});

async function screenshot(name) {
  await page.screenshot({ path: `${screenshotDir}/${name}.png`, fullPage: true });
  results[name] = { path: `${screenshotDir}/${name}.png` };
}

mkdirSync(screenshotDir, { recursive: true });

try {
  // Step 1: Homepage
  console.log('=== 1. Navigating to http://localhost:5173/ ===');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 15000 });
  await screenshot('01-homepage');
  console.log('Homepage loaded. URL:', page.url());

  // Step 2: Click "Try as guest"
  console.log('\n=== 2. Clicking "Δοκίμασε ως επισκέπτης" (Try as guest) ===');
  const tryGuest = page.getByRole('button', { name: /Δοκίμασε ως επισκέπτης|Try as guest/i });
  await tryGuest.click();
  await page.waitForURL(/guest-setup/, { timeout: 5000 });

  // Step 3: Screenshot guest setup
  console.log('=== 3. Guest setup page ===');
  await screenshot('02-guest-setup');

  // Step 4: Select age 4-5 and proceed
  console.log('\n=== 4. Selecting Age 4-5 ===');
  const age45 = page.getByRole('button', { name: /Ηλικία 4|Age 4-5|4-5/i });
  await age45.first().click();
  await page.getByRole('button', { name: /Επόμενη|Next/i }).click();

  // Step 5: Select objective and start (choose "logic" or "school" to get /play/4-5)
  console.log('=== 5. Selecting objective and starting ===');
  const objective = page.getByRole('button', { name: /Εκκίνηση|logic|Προετοιμασία|school|Προετοιμασία για το σχολείο/i });
  await objective.first().click();
  await page.getByRole('button', { name: /Ξεκινήστε|Start Quiz/i }).click();

  await page.waitForURL(/\/play\//, { timeout: 5000 });
  console.log('Landed on play page:', page.url());
  await screenshot('03-after-guest-start');

  // Step 6: Navigate directly to /play/4-5
  console.log('\n=== 6. Navigating to http://localhost:5173/play/4-5 ===');
  await page.goto('http://localhost:5173/play/4-5', { waitUntil: 'networkidle', timeout: 10000 });
  await screenshot('04-play-4-5');
  console.log('Final URL:', page.url());

} catch (e) {
  console.error('Error:', e.message);
  allErrors.push({ step: 'script', message: e.message });
  // Try to capture current state
  try { await screenshot('99-error-state'); } catch (_) {}
}

await browser.close();

// Report
console.log('\n========== REPORT ==========');
console.log(JSON.stringify(results, null, 2));
console.log('\nConsole errors:', allErrors.length);
allErrors.forEach((e, i) => console.log(`  [${i + 1}] ${e.url || ''}: ${e.message}`));
console.log('\nScreenshots saved to:', screenshotDir);
