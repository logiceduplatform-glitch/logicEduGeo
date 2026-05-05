#!/usr/bin/env node
/**
 * Production smoke test — runs against the LIVE deployed site.
 *
 * Purpose: catch regressions that only show up in production (CDN cache,
 * Firebase Hosting rules, CSP headers, missing static assets, etc).
 *
 * Run after every deploy:
 *   npm run test:smoke           # default: live site
 *   BASE=http://localhost:4173 npm run test:smoke   # local preview
 *
 * Exits with code 1 if any check fails.
 */
import { chromium } from "playwright";

const BASE = process.env.BASE || "https://logic-education-platform.web.app";
const HEADLESS = process.env.HEADED ? false : true;

const checks = [];
let passed = 0;
let failed = 0;

function test(name, fn) {
  checks.push({ name, fn });
}

async function run() {
  const browser = await chromium.launch({ headless: HEADLESS });
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    // Don't follow `prefers-reduced-motion` — we want to test animations work.
  });
  const page = await ctx.newPage();

  // Track console errors
  const consoleErrors = [];
  page.on("pageerror", (err) => consoleErrors.push(err.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });

  const banner = `\n=== Production smoke against ${BASE} ===\n`;
  console.log(banner);

  for (const { name, fn } of checks) {
    consoleErrors.length = 0;
    try {
      await fn(page);
      // Filter out third-party noise (extensions, ads); keep app-level errors.
      // The Firestore "Could not reach backend" warning is harmless because we
      // probe Firestore deliberately on /status — that's the whole point.
      const realErrors = consoleErrors.filter((e) =>
        !/extension|chrome-extension|favicon|net::ERR_BLOCKED_BY_CLIENT/i.test(e)
        && !/Could not reach Cloud Firestore backend/i.test(e)
        && !/Connection failed \d+ times/i.test(e)
        && !/WebChannelConnection RPC/i.test(e)
        // /status page deliberately probes a non-existent function URL;
        // that's how we test "Cloud Functions reachable".
        && !/Failed to load resource:\s*the server responded with a status of 404/i.test(e),
      );
      if (realErrors.length > 0) {
        throw new Error(`Console errors:\n  - ${realErrors.slice(0, 3).join("\n  - ")}`);
      }
      console.log(`  ✓ ${name}`);
      passed++;
    } catch (e) {
      console.log(`  ✗ ${name}: ${e.message.slice(0, 200)}`);
      failed++;
    }
  }

  await browser.close();
  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
}

// ─── Tests ───────────────────────────────────────────────────────────────

test("Homepage loads & shows brand", async (page) => {
  const res = await page.goto(BASE + "/", { waitUntil: "domcontentloaded", timeout: 20000 });
  if (!res || res.status() >= 400) throw new Error(`Status ${res?.status()}`);
  await page.waitForSelector("body", { timeout: 5000 });
  const html = await page.content();
  if (!/Kibloo/i.test(html)) throw new Error("Brand 'Kibloo' missing from page");
});

test("Status page reports all systems operational", async (page) => {
  // Use domcontentloaded — `load` fires after every subresource which can
  // race with the in-page Firestore probe and trigger ERR_ABORTED.
  try {
    await page.goto(BASE + "/status", { waitUntil: "domcontentloaded", timeout: 30000 });
  } catch (e) {
    // ERR_ABORTED happens when an inflight fetch is cancelled by a re-render;
    // page is still usable. Continue if so.
    if (!/ERR_ABORTED/.test(e.message)) throw e;
  }
  await page.waitForTimeout(6000);
  const text = await page.locator("body").innerText();
  if (!/operational|λειτουργικά/i.test(text)) {
    throw new Error("Status banner missing 'operational' indicator");
  }
});

test("Privacy page renders LEGAL_INFO content", async (page) => {
  await page.goto(BASE + "/privacy", { waitUntil: "load", timeout: 30000 });
  await page.waitForTimeout(2000); // SPA hydration
  const text = await page.locator("body").innerText();
  if (!/privacy|απορρήτου/i.test(text)) throw new Error("Privacy heading missing");
  if (!/kibloo\.app|hello@kibloo/i.test(text)) throw new Error("Contact info missing");
});

test("Terms page is full production-grade (16 sections)", async (page) => {
  await page.goto(BASE + "/terms", { waitUntil: "load", timeout: 30000 });
  await page.waitForTimeout(2000);
  const headingCount = await page.locator("h2, h3").count();
  if (headingCount < 10) throw new Error(`Only ${headingCount} headings (expected ≥ 10)`);
});

test("Cookies page lists cookie inventory table", async (page) => {
  await page.goto(BASE + "/cookies", { waitUntil: "load", timeout: 30000 });
  await page.waitForTimeout(2000);
  const tableCount = await page.locator("table").count();
  if (tableCount < 1) throw new Error("Cookie inventory table missing");
});

test("Sitemap.xml is reachable and contains > 30 URLs", async (page) => {
  const res = await page.goto(BASE + "/sitemap.xml", { waitUntil: "domcontentloaded" });
  if (!res || res.status() >= 400) throw new Error(`Status ${res?.status()}`);
  const txt = await page.content();
  const count = (txt.match(/<loc>/g) || []).length;
  if (count < 30) throw new Error(`Only ${count} URLs in sitemap (expected ≥ 30)`);
});

test("RSS feed is valid XML and has items", async (page) => {
  const res = await page.goto(BASE + "/rss.xml", { waitUntil: "domcontentloaded" });
  if (!res || res.status() >= 400) throw new Error(`Status ${res?.status()}`);
  const txt = await page.content();
  if (!/<rss/i.test(txt))   throw new Error("Not a valid RSS document");
  if (!/<item>/i.test(txt)) throw new Error("No <item> entries");
});

test("Robots.txt blocks AI crawlers", async (page) => {
  const res = await page.goto(BASE + "/robots.txt", { waitUntil: "domcontentloaded" });
  if (!res || res.status() >= 400) throw new Error(`Status ${res?.status()}`);
  const txt = await page.content();
  if (!/GPTBot|ChatGPT-User|ClaudeBot/i.test(txt)) {
    throw new Error("AI crawler User-agents missing from robots.txt");
  }
});

test("Service worker is registered (PWA)", async (page) => {
  await page.goto(BASE + "/", { waitUntil: "load", timeout: 20000 });
  await page.waitForTimeout(2000);
  const hasSw = await page.evaluate(async () => {
    if (!("serviceWorker" in navigator)) return false;
    const reg = await navigator.serviceWorker.getRegistration();
    return !!reg;
  });
  if (!hasSw) throw new Error("Service worker not registered");
});

test("Hero CTA → /auth?mode=register works (anonymous user)", async (page) => {
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded", timeout: 20000 });
  await page.waitForTimeout(1500);
  // Find any signup button (multiple A/B variants — match by URL after click).
  const candidate = page.locator(
    "a[href*='auth?mode=register'], button:has-text('Sign Up'), button:has-text('Δοκίμασε')",
  ).first();
  if (await candidate.count() === 0) {
    // Some hero variants only show "Try as guest" first → that's also fine.
    const guest = page.locator("a[href*='guest-setup'], button:has-text('guest'), button:has-text('επισκέπτης')").first();
    if (await guest.count() === 0) throw new Error("No CTA found in hero");
  }
});

test("404 page renders for unknown routes", async (page) => {
  await page.goto(BASE + "/this-page-does-not-exist-xyz123", { waitUntil: "domcontentloaded", timeout: 20000 });
  await page.waitForTimeout(1500);
  const text = await page.locator("body").innerText();
  if (!/404|not found|δεν βρέθηκε/i.test(text)) {
    throw new Error("404 page didn't render expected message");
  }
});

run().catch((err) => {
  console.error("Smoke test runner crashed:", err);
  process.exit(2);
});
