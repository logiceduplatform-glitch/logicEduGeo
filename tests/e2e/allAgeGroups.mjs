import { chromium } from 'playwright';

const BASE = 'http://localhost:5173';
const SCREENSHOT_DIR = '/tmp/geo-e2e-all-ages';

const AGE_ROUTES = {
  '2-3':  { school: '/play/2-3', fun: '/play/2-3-fun', logic: '/play/2-3-logic' },
  '4-5':  { school: '/play/4-5', fun: '/play/4-5-fun', logic: '/play/4-5-logic' },
  '6':    { school: '/play/6',   fun: '/play/6-fun',   logic: '/play/6-logic' },
  '7-8':  { school: '/play/7-8', fun: '/play/7-8-fun', logic: '/play/7-8-logic' },
  '9-10': { school: '/play/9-10',fun: '/play/9-10-fun',logic: '/play/9-10-logic' },
  '11-12':{ school: '/play/11-12-school', fun: '/play/11-12-fun', logic: '/play/11-12-logic' },
};

const PAGES_TO_CHECK = [
  { name: 'Homepage', path: '/' },
  { name: 'Guest Setup', path: '/guest-setup' },
];

async function runTests() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    storageState: undefined,
  });

  await context.addInitScript(() => {
    localStorage.setItem('guestMode', 'true');
    localStorage.setItem('guestAge', '9-10');
    localStorage.setItem('guestName', 'Test User');
  });

  let passed = 0;
  let failed = 0;
  const failures = [];

  async function testPage(name, path) {
    const page = await context.newPage();
    try {
      const response = await page.goto(`${BASE}${path}`, {
        waitUntil: 'domcontentloaded',
        timeout: 15000,
      });

      const status = response?.status() ?? 0;
      const hasContent = await page.evaluate(() => document.body.innerText.length > 10);
      const consoleErrors = [];

      page.on('console', msg => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      });

      const crashed = await page.evaluate(() => {
        const root = document.getElementById('root');
        if (!root) return true;
        const text = root.innerText;
        return text.includes('Something went wrong') ||
               text.includes('Error') && text.length < 100;
      });

      if (status >= 200 && status < 400 && hasContent && !crashed) {
        console.log(`  ✓ ${name} (${path}) - OK`);
        passed++;
      } else {
        const reason = crashed ? 'CRASHED' : !hasContent ? 'EMPTY' : `STATUS ${status}`;
        console.log(`  ✗ ${name} (${path}) - ${reason}`);
        failed++;
        failures.push({ name, path, reason });
        await page.screenshot({
          path: `${SCREENSHOT_DIR}/${name.replace(/[^a-zA-Z0-9]/g, '_')}.png`,
          fullPage: true,
        });
      }
    } catch (err) {
      console.log(`  ✗ ${name} (${path}) - ERROR: ${err.message}`);
      failed++;
      failures.push({ name, path, reason: err.message });
    } finally {
      await page.close();
    }
  }

  console.log('\n=== E2E Tests: All Age Groups ===\n');

  console.log('--- General Pages ---');
  for (const p of PAGES_TO_CHECK) {
    await testPage(p.name, p.path);
  }

  for (const [age, routes] of Object.entries(AGE_ROUTES)) {
    console.log(`\n--- Age ${age} ---`);
    for (const [mode, path] of Object.entries(routes)) {
      await testPage(`Age ${age} ${mode}`, path);
    }
  }

  console.log('\n=== Results ===');
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total:  ${passed + failed}`);

  if (failures.length > 0) {
    console.log('\nFailures:');
    for (const f of failures) {
      console.log(`  - ${f.name} (${f.path}): ${f.reason}`);
    }
    console.log(`\nScreenshots saved to ${SCREENSHOT_DIR}/`);
  }

  await browser.close();
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(err => {
  console.error('Test runner failed:', err);
  process.exit(1);
});
