import { chromium } from 'playwright';

const BASE = 'http://localhost:5173';

// NOTE: Real teacher-only routes require Firebase Auth, which can't be
// mocked from the client side. These E2E tests therefore verify the
// public surface: that gated routes correctly redirect anonymous /
// guest visitors, and that publicly accessible teacher-related pages
// (lookups, join code) load without crashing.
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
    try {
      await page.waitForFunction(
        () => document.body && document.body.innerText.length > 50,
        { timeout },
      );
    } catch {}
  }

  function studentContext() {
    return browser
      .newContext({ viewport: { width: 1280, height: 720 } })
      .then(async (ctx) => {
        await ctx.addInitScript(() => {
          localStorage.setItem(
            'geo:guestProfile',
            JSON.stringify({
              id: 'guest_e2e_student',
              name: 'E2EStudent',
              age: 'Age 8',
              createdAt: new Date().toISOString(),
            }),
          );
        });
        return ctx;
      });
  }

  console.log('\n=== E2E: Teacher Flow Tests ===\n');

  // ─── Gated routes redirect anonymous visitors ────────────────
  console.log('--- Gated Routes ---');

  await test('Anonymous /teacher-dashboard redirects to public landing', async () => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/teacher-dashboard`, { waitUntil: 'domcontentloaded' });
    await waitForApp(page);
    const url = page.url();
    assert(
      url.includes('/auth') ||
        url.includes('/guest-setup') ||
        url === `${BASE}/`,
      `Expected anon redirect, got ${url}`,
    );
    await ctx.close();
  });

  await test('Guest /teacher-dashboard redirects to public landing', async () => {
    const ctx = await studentContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE}/teacher-dashboard`, { waitUntil: 'domcontentloaded' });
    await waitForApp(page);
    const url = page.url();
    assert(
      url.includes('/auth') ||
        url.includes('/guest-setup') ||
        url === `${BASE}/`,
      `Expected guest redirect, got ${url}`,
    );
    await ctx.close();
  });

  // ─── Publicly accessible classroom flows ────────────────────
  console.log('\n--- Public Classroom Flows ---');

  await test('Join classroom landing renders for guest', async () => {
    const ctx = await studentContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE}/join`, { waitUntil: 'domcontentloaded' });
    await waitForApp(page);
    const body = await page.textContent('body');
    assert(
      body.includes('κωδικ') ||
        body.includes('code') ||
        body.includes('τάξη') ||
        body.includes('class') ||
        body.length > 50,
      'Join page should render content',
    );
    await ctx.close();
  });

  await test('Join classroom with code parameter renders without crash', async () => {
    const ctx = await studentContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE}/join/TEST123`, { waitUntil: 'domcontentloaded' });
    await waitForApp(page);
    const body = await page.textContent('body');
    assert(body.length > 0, 'Join page with code should render');
    await ctx.close();
  });

  await test('Kid-login (/k) page renders without crash', async () => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/k`, { waitUntil: 'domcontentloaded' });
    await waitForApp(page);
    const body = await page.textContent('body');
    assert(body.length > 50, 'Kid login page should render');
    await ctx.close();
  });

  // ─── Teacher-facing public marketing pages ──────────────────
  console.log('\n--- Marketing Pages ---');

  await test('/for-teachers marketing page renders', async () => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/for-teachers`, { waitUntil: 'domcontentloaded' });
    await waitForApp(page);
    const body = await page.textContent('body');
    assert(body.length > 100, '/for-teachers page should render content');
    await ctx.close();
  });

  console.log('\n--- Summary ---');
  console.log(`  ${passed} passed, ${failed} failed`);
  if (failures.length) {
    console.log('\n  Failures:');
    for (const f of failures) console.log(`    • ${f.name}: ${f.reason}`);
  }

  await browser.close();
  process.exit(failed > 0 ? 1 : 0);
}

run().catch((err) => {
  console.error('Test runner failed:', err);
  process.exit(1);
});
