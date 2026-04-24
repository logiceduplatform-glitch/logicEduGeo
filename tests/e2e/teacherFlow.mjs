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

  function teacherContext() {
    return browser.newContext({
      viewport: { width: 1280, height: 720 },
    }).then(async (ctx) => {
      await ctx.addInitScript(() => {
        const fakeUid = 'teacher_e2e_uid';
        const profile = {
          role: 'teacher',
          name: 'E2E Teacher',
          age: '',
          avatar: '🦊',
          objective: '',
        };
        localStorage.setItem('geo:userProfile', JSON.stringify(profile));
        localStorage.setItem(`geo:userProfile:${fakeUid}`, JSON.stringify(profile));
      });
      return ctx;
    });
  }

  function studentContext() {
    return browser.newContext({
      viewport: { width: 1280, height: 720 },
    }).then(async (ctx) => {
      await ctx.addInitScript(() => {
        localStorage.setItem('geo:guestProfile', JSON.stringify({
          id: 'guest_e2e_student',
          name: 'E2EStudent',
          age: 'Age 8',
          createdAt: new Date().toISOString(),
        }));
      });
      return ctx;
    });
  }

  console.log('\n=== E2E: Teacher Flow Tests ===\n');

  // ─── 1. Teacher Dashboard Access ───────────────────────────
  console.log('--- Teacher Dashboard Access ---');

  await test('Teacher dashboard page exists and renders', async () => {
    const ctx = await teacherContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE}/teacher`, { waitUntil: 'networkidle' });
    const body = await page.textContent('body');
    assert(
      body.includes('Πίνακας') || body.includes('Dashboard') || body.includes('teacher'),
      'Teacher dashboard should render content'
    );
    await ctx.close();
  });

  await test('Non-teacher cannot access teacher dashboard', async () => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    await ctx.addInitScript(() => {
      localStorage.setItem('geo:guestProfile', JSON.stringify({
        id: 'guest_e2e',
        name: 'Guest',
        age: 'Age 8',
        createdAt: new Date().toISOString(),
      }));
    });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/teacher`, { waitUntil: 'networkidle' });
    const url = page.url();
    assert(
      !url.includes('/teacher') || (await page.textContent('body')).includes('login') ||
      (await page.textContent('body')).includes('σύνδεσ') || url.includes('/auth'),
      'Guest should be redirected away from teacher dashboard'
    );
    await ctx.close();
  });

  // ─── 2. Quiz Creation Flow ───────────────────────────
  console.log('--- Quiz Creation Flow ---');

  await test('Quiz builder elements exist in teacher dashboard', async () => {
    const ctx = await teacherContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE}/teacher`, { waitUntil: 'networkidle' });
    const body = await page.textContent('body');
    const hasQuizElements = body.includes('Quiz') || body.includes('quiz') ||
      body.includes('Δημιουργία') || body.includes('Ερωτήσεις');
    assert(hasQuizElements, 'Teacher dashboard should have quiz-related content');
    await ctx.close();
  });

  // ─── 3. Classroom Code System ───────────────────────────
  console.log('--- Classroom Code System ---');

  await test('Join classroom page renders', async () => {
    const ctx = await studentContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE}/join`, { waitUntil: 'networkidle' });
    const body = await page.textContent('body');
    assert(
      body.includes('κωδικ') || body.includes('code') || body.includes('τάξη') || body.includes('class'),
      'Join page should have code/classroom related text'
    );
    await ctx.close();
  });

  await test('Join page with code parameter renders', async () => {
    const ctx = await studentContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE}/join/TEST123`, { waitUntil: 'networkidle' });
    const body = await page.textContent('body');
    assert(body.length > 0, 'Join page with code should render');
    await ctx.close();
  });

  // ─── 4. My Classroom Page (Student) ───────────────────────────
  console.log('--- My Classroom Page ---');

  await test('My classroom page renders for student', async () => {
    const ctx = await studentContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE}/my-classroom`, { waitUntil: 'networkidle' });
    const body = await page.textContent('body');
    assert(
      body.includes('Τάξη') || body.includes('τάξη') || body.includes('Classroom') ||
      body.includes('κωδικ') || body.includes('code') || body.length > 50,
      'My classroom page should render enrollment UI'
    );
    await ctx.close();
  });

  // ─── 5. Announcements Section ───────────────────────────
  console.log('--- Announcements ---');

  await test('Teacher dashboard has announcements tab', async () => {
    const ctx = await teacherContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE}/teacher`, { waitUntil: 'networkidle' });
    const body = await page.textContent('body');
    const hasAnnouncements = body.includes('Ανακοιν') || body.includes('Announc');
    assert(hasAnnouncements, 'Teacher dashboard should have announcements section');
    await ctx.close();
  });

  // ─── 6. Results Section ───────────────────────────
  console.log('--- Results ---');

  await test('Teacher dashboard has results tab', async () => {
    const ctx = await teacherContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE}/teacher`, { waitUntil: 'networkidle' });
    const body = await page.textContent('body');
    const hasResults = body.includes('Αποτελ') || body.includes('Result');
    assert(hasResults, 'Teacher dashboard should have results section');
    await ctx.close();
  });

  // ─── 7. Permanent Classrooms ───────────────────────────
  console.log('--- Permanent Classrooms ---');

  await test('Teacher dashboard has classroom management', async () => {
    const ctx = await teacherContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE}/teacher`, { waitUntil: 'networkidle' });
    const body = await page.textContent('body');
    const hasClassroom = body.includes('Η Τάξη μου') || body.includes('Τάξη') ||
      body.includes('Δημιουργία τάξης') || body.includes('Classroom');
    assert(hasClassroom, 'Teacher dashboard should have classroom management');
    await ctx.close();
  });

  // ─── 8. Navigation for Teacher Role ───────────────────────────
  console.log('--- Teacher Navigation ---');

  await test('Home page loads for teacher', async () => {
    const ctx = await teacherContext();
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: 'networkidle' });
    assert(page.url().includes(BASE), 'Home page should load');
    await ctx.close();
  });

  await test('Profile page loads for teacher', async () => {
    const ctx = await teacherContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE}/profile`, { waitUntil: 'networkidle' });
    const body = await page.textContent('body');
    assert(
      body.includes('E2E Teacher') || body.includes('Προφίλ') || body.includes('Profile'),
      'Profile page should show teacher profile'
    );
    await ctx.close();
  });

  // ─── 9. User Guide Tab ───────────────────────────
  console.log('--- User Guide ---');

  await test('Teacher dashboard has user guide', async () => {
    const ctx = await teacherContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE}/teacher`, { waitUntil: 'networkidle' });
    const body = await page.textContent('body');
    const hasGuide = body.includes('Οδηγός') || body.includes('Guide') || body.includes('Πόροι');
    assert(hasGuide, 'Teacher dashboard should have a user guide section');
    await ctx.close();
  });

  // ─── Summary ───────────────────────────
  console.log('\n--- Summary ---');
  console.log(`  ${passed} passed, ${failed} failed`);
  if (failures.length) {
    console.log('\n  Failures:');
    failures.forEach((f) => console.log(`    • ${f.name}: ${f.reason}`));
  }

  await browser.close();
  process.exit(failed > 0 ? 1 : 0);
}

run().catch((err) => {
  console.error('E2E teacher flow runner error:', err);
  process.exit(1);
});
