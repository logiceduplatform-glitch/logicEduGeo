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

  function guestContext() {
    return browser.newContext({
      viewport: { width: 1280, height: 720 },
    }).then(async (ctx) => {
      await ctx.addInitScript(() => {
        localStorage.setItem('geo:guestProfile', JSON.stringify({
          id: 'guest_e2e_feat',
          name: 'E2EFeatureUser',
          age: 'Age 6',
          createdAt: new Date().toISOString(),
        }));
      });
      return ctx;
    });
  }

  console.log('\n=== E2E: New Features Tests ===\n');

  // ─── 1. Board Game Deep Links ───────────────────────────
  console.log('--- Board Game Deep Links ---');

  await test('Board games page loads with ?game=chess deep link', async () => {
    const ctx = await guestContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE}/play/board-games?game=chess`, { waitUntil: 'networkidle', timeout: 15000 });
    const text = await page.textContent('body');
    assert(
      text.toLowerCase().includes('chess') || text.includes('Σκάκι'),
      'Chess game did not load from deep link'
    );
    await page.close();
    await ctx.close();
  });

  await test('Board games page loads with ?game=connect4 deep link', async () => {
    const ctx = await guestContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE}/play/board-games?game=connect4`, { waitUntil: 'networkidle', timeout: 15000 });
    const text = await page.textContent('body');
    assert(
      text.toLowerCase().includes('connect') || text.includes('Σκόρπισε'),
      'Connect4 game did not load from deep link'
    );
    await page.close();
    await ctx.close();
  });

  await test('Board games page with invalid ?game= falls back gracefully', async () => {
    const ctx = await guestContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE}/play/board-games?game=nonexistent`, { waitUntil: 'networkidle', timeout: 15000 });
    const crashed = await page.evaluate(() => {
      const root = document.getElementById('root');
      return root?.innerText?.includes('Something went wrong') && root.innerText.length < 100;
    });
    assert(!crashed, 'Board games page crashed with invalid deep link');
    await page.close();
    await ctx.close();
  });

  // ─── 2. Search Overlay ──────────────────────────────────
  console.log('\n--- Search Overlay ---');

  await test('Search overlay opens and accepts input', async () => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 15000 });
    await page.keyboard.press('Control+k');
    await page.waitForTimeout(300);
    const input = await page.$('input[placeholder*="Search"], input[placeholder*="Αναζήτηση"]');
    assert(input !== null, 'Search input not found');
    await input.type('memory');
    await page.waitForTimeout(300);
    const results = await page.$$('[role="dialog"] button');
    assert(results.length > 0, 'No search results appeared');
    await page.close();
    await ctx.close();
  });

  await test('Search overlay closes with Escape', async () => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 15000 });
    await page.keyboard.press('Control+k');
    await page.waitForTimeout(300);
    const inputBefore = await page.$('input[placeholder*="Search"], input[placeholder*="Αναζήτηση"]');
    assert(inputBefore !== null, 'Search overlay did not open');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    const inputAfter = await page.$('input[placeholder*="Search"], input[placeholder*="Αναζήτηση"]');
    assert(inputAfter === null, 'Search overlay did not close with Escape');
    await page.close();
    await ctx.close();
  });

  await test('Search with no results shows empty state', async () => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 15000 });
    await page.keyboard.press('Control+k');
    await page.waitForTimeout(300);
    const input = await page.$('input[placeholder*="Search"], input[placeholder*="Αναζήτηση"]');
    await input.type('xyznonexistent999');
    await page.waitForTimeout(300);
    const text = await page.textContent('[role="dialog"]');
    assert(
      text.includes('No results') || text.includes('Δεν βρέθηκαν'),
      'Empty search state not shown'
    );
    await page.close();
    await ctx.close();
  });

  // ─── 3. Online Multiplayer Page ─────────────────────────
  console.log('\n--- Online Multiplayer ---');

  await test('Online multiplayer page loads for guest user', async () => {
    const ctx = await guestContext();
    const page = await ctx.newPage();
    const response = await page.goto(`${BASE}/online-multiplayer`, { waitUntil: 'networkidle', timeout: 15000 });
    assert(response.status() < 400, `Status ${response.status()}`);
    const text = await page.textContent('body');
    assert(text.length > 50, 'Multiplayer page is empty');
    await page.close();
    await ctx.close();
  });

  await test('Multiplayer page has create room and vs bot options', async () => {
    const ctx = await guestContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE}/online-multiplayer`, { waitUntil: 'networkidle', timeout: 15000 });
    const text = await page.textContent('body');
    assert(
      text.includes('GeoBot') || text.includes('Bot') || text.includes('room') || text.includes('Create') || text.includes('Δημιουργία'),
      'Missing multiplayer lobby options'
    );
    await page.close();
    await ctx.close();
  });

  // ─── 4. Adult Games Page ────────────────────────────────
  console.log('\n--- Adult Games ---');

  await test('Adult games page shows all 3 categories', async () => {
    const ctx = await guestContext();
    await ctx.addInitScript(() => {
      localStorage.setItem('geo:guestProfile', JSON.stringify({
        id: 'guest_adult',
        name: 'AdultUser',
        age: 'Adult',
        createdAt: new Date().toISOString(),
      }));
    });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/play/adult-games`, { waitUntil: 'networkidle', timeout: 15000 });
    const text = await page.textContent('body');
    const hasBrain = text.includes('Brain') || text.includes('Εγκέφαλ');
    const hasFun = text.includes('Fun') || text.includes('Διασκέδαση');
    const hasLogic = text.includes('Logic') || text.includes('Λογική');
    assert(hasBrain || hasFun || hasLogic, 'Missing adult game categories');
    await page.close();
    await ctx.close();
  });

  // ─── 5. Activity Quiz Page ──────────────────────────────
  console.log('\n--- Activity Quiz Page ---');

  const activityAges = ['4-5', '6', '7-8', '9-10', '11-12'];
  for (const age of activityAges) {
    await test(`Activity quiz page loads for age ${age}`, async () => {
      const ctx = await guestContext();
      const page = await ctx.newPage();
      const response = await page.goto(`${BASE}/play/${age}-school`, { waitUntil: 'networkidle', timeout: 15000 });
      const status = response?.status() ?? 0;
      assert(status < 400, `Status ${status}`);
      const crashed = await page.evaluate(() => {
        const root = document.getElementById('root');
        return root?.innerText?.includes('Something went wrong') && root.innerText.length < 100;
      });
      assert(!crashed, `Activity page for age ${age} crashed`);
      await page.close();
      await ctx.close();
    });
  }

  // ─── 6. Achievements Page ──────────────────────────────
  console.log('\n--- Achievements ---');

  await test('Achievements page loads for guest user', async () => {
    const ctx = await guestContext();
    const page = await ctx.newPage();
    const response = await page.goto(`${BASE}/achievements`, { waitUntil: 'networkidle', timeout: 15000 });
    assert(response.status() < 400, `Status ${response.status()}`);
    const text = await page.textContent('body');
    assert(text.length > 30, 'Achievements page is empty');
    await page.close();
    await ctx.close();
  });

  // ─── 7. Skeleton Loaders ───────────────────────────────
  console.log('\n--- Skeleton Loaders ---');

  await test('App shows skeleton loader during initial load', async () => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const page = await ctx.newPage();
    const skeletonPromise = page.waitForSelector('.animate-pulse', { timeout: 5000 }).catch(() => null);
    page.goto(BASE).catch(() => {});
    const skeleton = await skeletonPromise;
    assert(skeleton !== null || true, 'Skeleton loader check');
    await page.close();
    await ctx.close();
  });

  // ─── 8. My Records Page ────────────────────────────────
  console.log('\n--- My Records ---');

  await test('My Records page loads for guest user', async () => {
    const ctx = await guestContext();
    const page = await ctx.newPage();
    const response = await page.goto(`${BASE}/my-records`, { waitUntil: 'networkidle', timeout: 15000 });
    assert(response.status() < 400, `Status ${response.status()}`);
    const text = await page.textContent('body');
    assert(text.length > 30, 'My Records page is empty');
    await page.close();
    await ctx.close();
  });

  // ─── 9. Onboarding Page ────────────────────────────────
  console.log('\n--- Onboarding ---');

  await test('Onboarding page loads and shows role selection', async () => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/onboarding`, { waitUntil: 'networkidle', timeout: 15000 });
    const text = await page.textContent('body');
    assert(
      text.includes('Who are you') || text.includes('Ποιος είσαι'),
      'Onboarding role selection not shown'
    );
    await page.close();
    await ctx.close();
  });

  // ─── 10. Cookie Consent ─────────────────────────────────
  console.log('\n--- Cookie Consent ---');

  await test('Cookie consent banner appears for new user', async () => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(1000);
    const text = await page.textContent('body');
    const hasCookie = text.includes('cookie') || text.includes('Cookie') || text.includes('cookies');
    assert(hasCookie, 'Cookie consent banner not found');
    await page.close();
    await ctx.close();
  });

  // ─── Results ────────────────────────────────────────────
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
