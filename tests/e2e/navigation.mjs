import { chromium } from 'playwright';

const BASE = 'http://localhost:5173';
const SCREENSHOT_DIR = '/tmp/geo-e2e-navigation';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });

  let passed = 0;
  let failed = 0;
  const failures = [];

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✓ ${name}`);
      passed++;
    } catch (err) {
      console.log(`  ✗ ${name}: ${err.message}`);
      failed++;
      failures.push({ name, reason: err.message });
    }
  }

  function assert(condition, message) {
    if (!condition) throw new Error(message || 'Assertion failed');
  }

  // Helper that goes to a URL and waits for the React app to mount.
  // The app emits its <nav> + content quickly after the bundles execute,
  // so polling for any rendered content (>50 chars) is a reliable signal.
  // Returns the navigation response so callers can still inspect status().
  async function gotoAndWaitForApp(page, url, opts = {}) {
    const response = await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: opts.timeout || 15000,
    });
    try {
      await page.waitForFunction(
        () => document.body && document.body.innerText.length > 50,
        { timeout: opts.appTimeout || 10000 },
      );
    } catch {
      // soft-fail; individual assertions will surface the reason
    }
    return response;
  }

  console.log('\n=== E2E: Navigation & UI Tests ===\n');

  // ─── Homepage Tests ────────────────────────────────────
  console.log('--- Homepage ---');

  await test('Homepage loads with correct title', async () => {
    const page = await context.newPage();
    await gotoAndWaitForApp(page, BASE);
    const title = await page.title();
    assert(title.includes('Kibloo') || title.includes('Educational Platform') || title.includes('Εκπαιδευτική'), `Expected title to contain "Kibloo", got "${title}"`);
    await page.close();
  });

  await test('Homepage has navigation bar', async () => {
    const page = await context.newPage();
    await gotoAndWaitForApp(page, BASE);
    const nav = await page.$('nav');
    assert(nav !== null, 'No <nav> element found');
    await page.close();
  });

  await test('Homepage has skip-to-content link for accessibility', async () => {
    const page = await context.newPage();
    await gotoAndWaitForApp(page, BASE);
    const skipLink = await page.$('a.skip-link');
    assert(skipLink !== null, 'No skip-link found');
    await page.close();
  });

  await test('Homepage has main content area', async () => {
    const page = await context.newPage();
    await gotoAndWaitForApp(page, BASE);
    const hasContent = await page.evaluate(() => document.body.innerText.length > 50);
    assert(hasContent, 'Homepage has no meaningful content');
    await page.close();
  });

  // ─── Static Pages ──────────────────────────────────────
  console.log('\n--- Static Pages ---');

  await test('Privacy page loads', async () => {
    const page = await context.newPage();
    const response = await gotoAndWaitForApp(page, `${BASE}/privacy`);
    assert(response.status() < 400, `Status ${response.status()}`);
    const text = await page.evaluate(() => document.body.innerText);
    assert(text.length > 20, 'Privacy page is empty');
    await page.close();
  });

  await test('Terms page loads', async () => {
    const page = await context.newPage();
    const response = await gotoAndWaitForApp(page, `${BASE}/terms`);
    assert(response.status() < 400, `Status ${response.status()}`);
    const text = await page.evaluate(() => document.body.innerText);
    assert(text.length > 20, 'Terms page is empty');
    await page.close();
  });

  await test('Auth page loads', async () => {
    const page = await context.newPage();
    const response = await gotoAndWaitForApp(page, `${BASE}/auth`);
    assert(response.status() < 400, `Status ${response.status()}`);
    await page.close();
  });

  await test('404 page shows for unknown route', async () => {
    const page = await context.newPage();
    await gotoAndWaitForApp(page, `${BASE}/this-route-does-not-exist`);
    const text = await page.evaluate(() => document.body.innerText);
    assert(text.includes('404'), '404 page did not show');
    await page.close();
  });

  // ─── Guest Setup Flow ─────────────────────────────────
  console.log('\n--- Guest Flow ---');

  await test('Guest setup page loads', async () => {
    const page = await context.newPage();
    const response = await gotoAndWaitForApp(page, `${BASE}/guest-setup`);
    assert(response.status() < 400, `Status ${response.status()}`);
    const text = await page.evaluate(() => document.body.innerText);
    assert(text.length > 20, 'Guest setup page is empty');
    await page.close();
  });

  // ─── Protected Routes Redirect ────────────────────────
  console.log('\n--- Protected Routes ---');

  // Anonymous users are routed to /guest-setup or / when hitting protected
  // routes; either is acceptable.
  function isPublicLanding(url) {
    return (
      url === `${BASE}/` ||
      url === BASE ||
      url.startsWith(`${BASE}/guest-setup`) ||
      url.startsWith(`${BASE}/auth`)
    );
  }

  await test('Protected /play redirects guest to setup or home', async () => {
    const page = await context.newPage();
    await gotoAndWaitForApp(page, `${BASE}/play`);
    const url = page.url();
    assert(isPublicLanding(url), `Expected redirect to home/guest-setup/auth, got ${url}`);
    await page.close();
  });

  await test('Protected /profile redirects guest to setup or home', async () => {
    const page = await context.newPage();
    await gotoAndWaitForApp(page, `${BASE}/profile`);
    const url = page.url();
    assert(isPublicLanding(url), `Expected redirect to home/guest-setup/auth, got ${url}`);
    await page.close();
  });

  await test('Protected /parent-dashboard redirects guest to setup or home', async () => {
    const page = await context.newPage();
    await gotoAndWaitForApp(page, `${BASE}/parent-dashboard`);
    const url = page.url();
    assert(isPublicLanding(url), `Expected redirect to home/guest-setup/auth, got ${url}`);
    await page.close();
  });

  // ─── Guest Authenticated Routes ────────────────────────
  console.log('\n--- Guest Authenticated Routes ---');

  const guestContext = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  await guestContext.addInitScript(() => {
    localStorage.setItem('geo:guestProfile', JSON.stringify({
      id: 'guest_test',
      name: 'TestKid',
      age: '6',
      createdAt: new Date().toISOString(),
    }));
  });

  const AGE_ROUTES = [
    { name: 'Age 2-3 School', path: '/play/2-3-school' },
    { name: 'Age 2-3 Fun', path: '/play/2-3-fun' },
    { name: 'Age 4-5 Fun', path: '/play/4-5-fun' },
    { name: 'Age 6 Fun', path: '/play/6-fun' },
    { name: 'Age 7-8 Fun', path: '/play/7-8-fun' },
    { name: 'Age 9-10 Fun', path: '/play/9-10-fun' },
    { name: 'Age 11-12 Fun', path: '/play/11-12-fun' },
  ];

  for (const route of AGE_ROUTES) {
    await test(`${route.name} page loads for guest user`, async () => {
      const page = await guestContext.newPage();
      try {
        const response = await page.goto(`${BASE}${route.path}`, {
          waitUntil: 'domcontentloaded',
          timeout: 15000,
        });
        const status = response?.status() ?? 0;
        assert(status >= 200 && status < 400, `Status ${status}`);

        const crashed = await page.evaluate(() => {
          const root = document.getElementById('root');
          if (!root) return true;
          const text = root.innerText;
          return text.includes('Something went wrong') && text.length < 100;
        });
        assert(!crashed, 'Page crashed with error');
      } finally {
        await page.close();
      }
    });
  }

  // ─── Responsive Design ─────────────────────────────────
  console.log('\n--- Responsive Design ---');

  await test('Mobile viewport renders without crash', async () => {
    const mobileCtx = await browser.newContext({ viewport: { width: 375, height: 812 } });
    const page = await mobileCtx.newPage();
    await gotoAndWaitForApp(page, BASE);
    const hasContent = await page.evaluate(() => document.body.innerText.length > 50);
    assert(hasContent, 'Mobile homepage has no content');
    await page.close();
    await mobileCtx.close();
  });

  await test('Tablet viewport renders without crash', async () => {
    const tabletCtx = await browser.newContext({ viewport: { width: 768, height: 1024 } });
    const page = await tabletCtx.newPage();
    await gotoAndWaitForApp(page, BASE);
    const hasContent = await page.evaluate(() => document.body.innerText.length > 50);
    assert(hasContent, 'Tablet homepage has no content');
    await page.close();
    await tabletCtx.close();
  });

  // ─── Results ───────────────────────────────────────────
  console.log('\n=== Results ===');
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total:  ${passed + failed}`);

  if (failures.length > 0) {
    console.log('\nFailures:');
    for (const f of failures) {
      console.log(`  - ${f.name}: ${f.reason}`);
    }
  }

  await guestContext.close();
  await browser.close();
  process.exit(failed > 0 ? 1 : 0);
}

run().catch(err => {
  console.error('Test runner failed:', err);
  process.exit(1);
});
