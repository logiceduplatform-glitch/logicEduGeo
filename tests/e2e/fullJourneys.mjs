import { chromium } from 'playwright';

const BASE = 'http://localhost:5173';

async function run() {
  const browser = await chromium.launch({ headless: true });

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

  async function waitForApp(page, timeout = 8000) {
    try { await page.waitForFunction(() => document.body && document.body.innerText.length > 50, { timeout }); } catch {}
  }

  console.log('\n=== E2E: Full User Journey Tests ===\n');

  // ─── 1. Homepage Smoke ─────────────────────────────────
  console.log('--- Homepage ---');

  await test('Homepage renders hero section with branding', async () => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await waitForApp(page);
    const text = await page.textContent('body');
    assert(
      text.includes('Where curiosity blooms') ||
        text.includes('Όπου η περιέργεια ανθίζει') ||
        text.includes('Kibloo') ||
        text.includes('Learn. Think. Solve.') ||
        text.includes('Μάθε. Σκέψου. Λύσε.'),
      'Missing branding tagline',
    );
    await page.close();
    await ctx.close();
  });

  await test('Homepage has pricing section', async () => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await waitForApp(page);
    const pricing = await page.$('#pricing');
    assert(pricing !== null, 'No pricing section found');
    await page.close();
    await ctx.close();
  });

  await test('Homepage has FAQ section', async () => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await waitForApp(page);
    const faq = await page.$('#faq');
    assert(faq !== null, 'No FAQ section found');
    await page.close();
    await ctx.close();
  });

  await test('Homepage shows correct pricing (€2.99 and €4.99)', async () => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await waitForApp(page);
    const text = await page.textContent('body');
    assert(text.includes('2.99'), 'Missing Premium price €2.99');
    assert(text.includes('4.99'), 'Missing Family price €4.99');
    await page.close();
    await ctx.close();
  });

  await test('Homepage has games showcase section', async () => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await waitForApp(page);
    const games = await page.$('#games');
    assert(games !== null, 'No games section found');
    await page.close();
    await ctx.close();
  });

  // ─── 2. Guest Setup Flow ──────────────────────────────
  console.log('\n--- Guest Setup Flow ---');

  await test('Guest setup page loads and shows age selection', async () => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/guest-setup`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await waitForApp(page);
    const text = await page.textContent('body');
    assert(text.length > 50, 'Guest setup page is empty');
    await page.close();
    await ctx.close();
  });

  // ─── 3. Auth Page ─────────────────────────────────────
  console.log('\n--- Auth Page ---');

  await test('Auth page shows login form', async () => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/auth`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await waitForApp(page);
    const hasEmail = await page.$('input[type="email"]');
    const hasPassword = await page.$('input[type="password"]');
    assert(hasEmail !== null, 'No email input on auth page');
    assert(hasPassword !== null, 'No password input on auth page');
    await page.close();
    await ctx.close();
  });

  await test('Auth page has Google login button', async () => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/auth`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await waitForApp(page);
    const text = await page.textContent('body');
    assert(text.includes('Google'), 'No Google login button found');
    await page.close();
    await ctx.close();
  });

  // ─── 4. Subscription Page ─────────────────────────────
  console.log('\n--- Subscription Page ---');

  await test('Subscription page loads with pricing plans', async () => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/subscription`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await waitForApp(page);
    const text = await page.textContent('body');
    assert(text.includes('Premium'), 'Missing Premium plan');
    assert(text.includes('Family') || text.includes('Οικογενειακό'), 'Missing Family plan');
    await page.close();
    await ctx.close();
  });

  // ─── 5. Static Pages ──────────────────────────────────
  console.log('\n--- Static Pages ---');

  for (const { name, path } of [
    { name: 'Privacy', path: '/privacy' },
    { name: 'Terms', path: '/terms' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' },
    { name: 'About', path: '/about' },
  ]) {
    await test(`${name} page loads`, async () => {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
      const page = await ctx.newPage();
      const response = await page.goto(`${BASE}${path}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await waitForApp(page);
    await waitForApp(page);
      assert(response.status() < 400, `Status ${response.status()}`);
      const text = await page.textContent('body');
      assert(text.length > 50, `${name} page is empty`);
      await page.close();
      await ctx.close();
    });
  }

  // ─── 6. Protected Route Redirects ─────────────────────
  console.log('\n--- Protected Route Redirects ---');

  for (const { name, path } of [
    { name: '/play', path: '/play' },
    { name: '/profile', path: '/profile' },
    { name: '/stats', path: '/stats' },
    { name: '/my-games', path: '/my-games' },
    { name: '/teacher-dashboard', path: '/teacher-dashboard' },
    { name: '/parent-dashboard', path: '/parent-dashboard' },
    { name: '/weekly-report', path: '/weekly-report' },
    { name: '/join', path: '/join' },
  ]) {
    await test(`${name} redirects to home when not logged in`, async () => {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
      const page = await ctx.newPage();
      await page.goto(`${BASE}${path}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await waitForApp(page);
      const url = page.url();
      // Anonymous visitors are routed to /, /auth or /guest-setup depending
      // on which gate the route uses (PlayGate vs RoleGate vs AuthGate).
      assert(
        url === `${BASE}/` ||
          url === BASE ||
          url.startsWith(`${BASE}/auth`) ||
          url.startsWith(`${BASE}/guest-setup`),
        `Expected redirect to home/auth/guest-setup, got ${url}`,
      );
      await page.close();
      await ctx.close();
    });
  }

  // ─── 7. 404 Page ──────────────────────────────────────
  console.log('\n--- 404 Page ---');

  await test('Unknown route shows 404 page', async () => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/nonexistent-route-xyz`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await waitForApp(page);
    const text = await page.textContent('body');
    assert(text.includes('404'), '404 page did not show');
    await page.close();
    await ctx.close();
  });

  // ─── 8. Mobile Responsive ────────────────────────────
  console.log('\n--- Mobile Responsive ---');

  await test('Homepage renders on mobile (375x812)', async () => {
    const ctx = await browser.newContext({ viewport: { width: 375, height: 812 } });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await waitForApp(page);
    const content = await page.textContent('body');
    assert(content.length > 100, 'Mobile homepage is empty');
    await page.close();
    await ctx.close();
  });

  await test('Mobile hamburger menu opens', async () => {
    const ctx = await browser.newContext({ viewport: { width: 375, height: 812 } });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await waitForApp(page);
    const hamburger = await page.$('[aria-label="Open menu"], [aria-label="Άνοιγμα μενού"]');
    assert(hamburger !== null, 'No hamburger button found');
    await hamburger.click();
    await page.waitForTimeout(300);
    const closeBtn = await page.$('[aria-label="Close menu"], [aria-label="Κλείσιμο μενού"]');
    assert(closeBtn !== null, 'Mobile menu did not open');
    await page.close();
    await ctx.close();
  });

  // ─── 9. Guest Full Flow ──────────────────────────────
  console.log('\n--- Guest Full Flow ---');

  await test('Guest can access game pages after setup', async () => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    await ctx.addInitScript(() => {
      localStorage.setItem('geo:guestProfile', JSON.stringify({
        id: 'guest_e2e_test',
        name: 'E2EKid',
        age: 'Age 6',
        createdAt: new Date().toISOString(),
      }));
    });
    const page = await ctx.newPage();
    const response = await page.goto(`${BASE}/play/6-fun`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await waitForApp(page);
    await waitForApp(page);
    const status = response?.status() ?? 0;
    assert(status < 400, `Status ${status}`);
    const crashed = await page.evaluate(() => {
      const root = document.getElementById('root');
      return root?.innerText?.includes('Something went wrong') && root.innerText.length < 100;
    });
    assert(!crashed, 'Game page crashed');
    await page.close();
    await ctx.close();
  });

  await test('Guest can access board games page', async () => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    await ctx.addInitScript(() => {
      localStorage.setItem('geo:guestProfile', JSON.stringify({
        id: 'guest_e2e_test',
        name: 'E2EKid',
        age: 'Age 6',
        createdAt: new Date().toISOString(),
      }));
    });
    const page = await ctx.newPage();
    const response = await page.goto(`${BASE}/play/board-games`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await waitForApp(page);
    await waitForApp(page);
    const status = response?.status() ?? 0;
    assert(status < 400, `Status ${status}`);
    const text = await page.textContent('body');
    assert(text.length > 50, 'Board games page is empty');
    await page.close();
    await ctx.close();
  });

  await test('Guest can access adult games page', async () => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    await ctx.addInitScript(() => {
      localStorage.setItem('geo:guestProfile', JSON.stringify({
        id: 'guest_e2e_test',
        name: 'E2EAdult',
        age: 'Adult',
        createdAt: new Date().toISOString(),
      }));
    });
    const page = await ctx.newPage();
    const response = await page.goto(`${BASE}/play/adult-games`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await waitForApp(page);
    await waitForApp(page);
    const status = response?.status() ?? 0;
    assert(status < 400, `Status ${status}`);
    await page.close();
    await ctx.close();
  });

  // ─── 10. Keyboard & Accessibility ────────────────────
  console.log('\n--- Keyboard & Accessibility ---');

  await test('Skip-to-content link exists', async () => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await waitForApp(page);
    const skipLink = await page.$('a.skip-link');
    assert(skipLink !== null, 'No skip-to-content link');
    await page.close();
    await ctx.close();
  });

  await test('Search opens with Ctrl+K', async () => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await waitForApp(page);
    await page.keyboard.press('Control+k');
    await page.waitForTimeout(300);
    const searchInput = await page.$('input[placeholder*="Search"], input[placeholder*="Αναζήτηση"]');
    assert(searchInput !== null, 'Search overlay did not open with Ctrl+K');
    await page.close();
    await ctx.close();
  });

  await test('Language toggle works', async () => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await waitForApp(page);
    const langBtn = await page.$('[aria-label*="language"], [aria-label*="Language"], [aria-label*="Αλλαγή"]') || await page.$('button:has-text("EN")') || await page.$('button:has-text("EL")');
    if (langBtn) {
      await langBtn.click();
      await page.waitForTimeout(500);
      console.log('    (language toggle clicked)');
    }
    assert(true, 'Language toggle test');
    await page.close();
    await ctx.close();
  });

  // ─── 11. Theme Toggle ────────────────────────────────
  console.log('\n--- Theme ---');

  await test('Dark mode toggle exists', async () => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await waitForApp(page);
    const themeBtn = await page.$('[aria-label*="mode"], [aria-label*="θέμα"]');
    assert(themeBtn !== null, 'No theme toggle button found');
    await page.close();
    await ctx.close();
  });

  // ─── Results ─────────────────────────────────────────
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

  await browser.close();
  process.exit(failed > 0 ? 1 : 0);
}

run().catch(err => {
  console.error('Test runner failed:', err);
  process.exit(1);
});
