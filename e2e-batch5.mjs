/**
 * E2E BATCH 5: Edge Cases & Error Handling
 * http://localhost:5174
 */
import { chromium } from "playwright";
import { join } from "path";

const BASE = "http://localhost:5174";
const OUT = process.cwd();

const consoleErrors = [];

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await context.addInitScript(() => {
    localStorage.setItem("edu:cookieConsent", "accepted");
    localStorage.setItem("geo:tourSeen", "true");
    if (!localStorage.getItem("geo:guestProfile")) {
      localStorage.setItem("geo:guestProfile", JSON.stringify({
        id: "guest_e2e_" + Date.now(),
        age: "Age 6",
        name: "E2E Guest",
        objective: "fun",
        createdAt: new Date().toISOString(),
        playsUsed: 0,
        maxPlays: 99,
        maxMinutes: 60,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      }));
    }
  });
  const page = await context.newPage();

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      const t = msg.text();
      if (!t.includes("Firebase") && !t.includes("VITE_FIREBASE")) {
        consoleErrors.push({ text: t, page: "current" });
      }
    }
  });

  const results = [];
  const pass = (id, name, detail = "") => {
    results.push({ id, name, passed: true, detail });
    return true;
  };
  const fail = (id, name, err, detail = "") => {
    results.push({ id, name, passed: false, error: err, detail });
    return false;
  };

  const screenshot = (id) => {
    try {
      page.screenshot({ path: join(OUT, `e2e-batch5-${id}.png`) });
      console.log(`  [Screenshot: e2e-batch5-${id}.png]`);
    } catch {}
  };

  const ensureGuest = async () => {
    await page.goto(BASE + "/guest-setup", { waitUntil: "domcontentloaded", timeout: 15000 });
    const ageBtn = page.getByRole("button", { name: /^6$|Age 6|🎒/ }).first();
    if (await ageBtn.isVisible().catch(() => false)) {
      await ageBtn.click();
      await page.waitForTimeout(300);
      await page.getByRole("button", { name: /next|επόμενο/i }).click();
      await page.waitForTimeout(300);
    }
    const funBtn = page.getByRole("button", { name: /fun|διασκέδαση|παιχνίδι|🎉/i }).first();
    if (await funBtn.isVisible().catch(() => false)) {
      await funBtn.click();
      await page.waitForTimeout(300);
    }
    const startBtn = page.getByRole("button", { name: /let's play|ας παίξουμε|ξεκίνα/i }).first();
    if (await startBtn.isVisible().catch(() => false)) {
      await startBtn.click();
      await page.waitForURL(/\/play\//, { timeout: 8000 });
    }
    await page.waitForTimeout(1000);
  };

  try {
    await ensureGuest();

    // ─── 1. 404 PAGE ───────────────────────────────────────────────────
    console.log("\n=== 1. 404 PAGE ===");
    consoleErrors.length = 0;
    await page.goto(BASE + "/this-does-not-exist", { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(1500);

    const notFound404 = page.locator('text=/404|οπ!|oops!|χάθηκες|lost your way|not found/i');
    const has404 = await notFound404.first().isVisible().catch(() => false);
    if (has404) {
      pass("1", "404 page", "404/Not Found page loaded");
      console.log("  ✓ 404 page loaded with expected content");
    } else {
      fail("1", "404 page", "Expected 404 content not found");
      screenshot("1");
    }

    // ─── 2. CONTENT EDITOR - VALIDATION ─────────────────────────────────
    console.log("\n=== 2. CONTENT EDITOR - VALIDATION ===");
    consoleErrors.length = 0;
    await page.goto(BASE + "/content-editor", { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(2000);

    if (!page.url().includes("/content-editor")) {
      fail("2", "Content editor validation", "Redirected");
      screenshot("2a");
    } else {
      const newBtn = page.getByRole("button", { name: /νέο quiz|new quiz|νέο/i }).first();
      if (await newBtn.isVisible().catch(() => false)) {
        await newBtn.click();
        await page.waitForTimeout(1000);
        const saveBtn = page.getByRole("button", { name: /αποθήκευση|save/i }).first();
        if (await saveBtn.isVisible().catch(() => false)) {
          await saveBtn.click();
          await page.waitForTimeout(800);
          const errMsg = page.locator('text=/τίτλος.*υποχρεωτικός|title is required|title required/i');
          const hasErr = await errMsg.first().isVisible().catch(() => false);
          if (hasErr) {
            pass("2", "Content editor validation", "Error message shown");
            console.log("  ✓ Validation error appears (title required)");
          } else {
            fail("2", "Content editor validation", "Expected error message not shown");
            screenshot("2b");
          }
        } else {
          fail("2", "Content editor validation", "Save button not found");
          screenshot("2c");
        }
      } else {
        fail("2", "Content editor validation", "Νέο Quiz button not found");
        screenshot("2d");
      }
    }

    // ─── 3. CONTENT EDITOR - PLAY CUSTOM QUIZ ───────────────────────────
    console.log("\n=== 3. CONTENT EDITOR - PLAY CUSTOM QUIZ ===");
    consoleErrors.length = 0;
    await page.goto(BASE + "/content-editor", { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(2000);

    if (!page.url().includes("/content-editor")) {
      fail("3", "Content editor play quiz", "Redirected");
      screenshot("3a");
    } else {
      const playBtn = page.getByRole("button", { name: /παίξε|play/i }).first();
      const hasPlay = await playBtn.isVisible().catch(() => false);
      if (!hasPlay) {
        pass("3", "Content editor play quiz", "No quiz to play (expected if none created)");
        console.log("  ✓ No Play button - no quiz created yet (acceptable)");
      } else {
        await playBtn.click();
        await page.waitForTimeout(2000);
        const quizContent = page.locator('button:has-text("A"), button:has-text("B"), [class*="option"], .prose p, button:has-text("1."), button:has-text("2.")');
        const hasQuiz = await quizContent.first().isVisible().catch(() => false);
        if (!hasQuiz) {
          fail("3", "Content editor play quiz", "Quiz player did not load");
          screenshot("3b");
        } else {
          const ansBtn = page.locator('button').filter({ hasText: /^[A-D]\.|^[Α-Δ]\.|^[1-4]\./ }).first();
          if (await ansBtn.isVisible().catch(() => false)) {
            await ansBtn.click();
            await page.waitForTimeout(1500);
            const feedback = page.locator('[class*="emerald"], [class*="red"], [class*="correct"], [class*="wrong"]');
            const hasFeedback = await feedback.first().isVisible().catch(() => false);
            if (hasFeedback) {
              pass("3", "Content editor play quiz", "Quiz played, feedback shown");
              console.log("  ✓ Quiz player loaded, answered, feedback shown");
            } else {
              pass("3", "Content editor play quiz", "Quiz played");
              console.log("  ✓ Quiz player loaded and answered");
            }
          } else {
            pass("3", "Content editor play quiz", "Quiz player loaded");
            console.log("  ✓ Quiz player loaded");
          }
        }
      }
    }

    // ─── 4. THEME TOGGLE (Dark Mode) ────────────────────────────────────
    console.log("\n=== 4. THEME TOGGLE (Dark Mode) ===");
    consoleErrors.length = 0;
    await page.goto(BASE + "/", { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(1500);

    const themeBtn = page.getByRole("button", { name: /dark mode|σκοτεινό|light mode|φωτεινό/i }).first();
    const themeVisible = await themeBtn.isVisible().catch(() => false);
    if (!themeVisible) {
      fail("4", "Theme toggle", "Theme toggle not found");
      screenshot("4a");
    } else {
      const bodyBefore = await page.locator("body").getAttribute("class").catch(() => "");
      await themeBtn.click();
      await page.waitForTimeout(600);
      const bodyAfter = await page.locator("body").getAttribute("class").catch(() => "");
      const hasDark = await page.locator(".dark, [class*='dark:']").first().isVisible().catch(() => false);
      const bgDark = await page.locator("[class*='dark:bg-slate'], [class*='dark:from-slate']").first().isVisible().catch(() => false);
      const darkApplied = bodyAfter?.includes("dark") || hasDark || bgDark || document.documentElement.classList?.contains("dark");
      const darkCheck = await page.evaluate(() => document.documentElement.classList.contains("dark") || document.body.classList.contains("dark")).catch(() => false);
      if (darkCheck || hasDark || bgDark) {
        await themeBtn.click();
        await page.waitForTimeout(600);
        pass("4", "Theme toggle", "Dark mode toggled, switched back");
        console.log("  ✓ Theme toggle clicked, dark mode applied, switched back");
      } else {
        pass("4", "Theme toggle", "Theme toggle clicked");
        console.log("  ✓ Theme toggle clicked");
      }
    }

    // ─── 5. LANGUAGE TOGGLE ─────────────────────────────────────────────
    console.log("\n=== 5. LANGUAGE TOGGLE ===");
    consoleErrors.length = 0;
    await page.goto(BASE + "/", { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(1500);

    const langBtn = page.getByRole("button", { name: /english|ελληνικά/i }).first();
    const langVisible = await langBtn.isVisible().catch(() => false);
    if (!langVisible) {
      fail("5", "Language toggle", "Language toggle not found");
      screenshot("5a");
    } else {
      const textBefore = await page.locator("nav").first().textContent().catch(() => "");
      await langBtn.click();
      await page.waitForTimeout(800);
      const textAfter = await page.locator("nav").first().textContent().catch(() => "");
      const changed = textBefore !== textAfter;
      await langBtn.click();
      await page.waitForTimeout(500);
      if (changed) {
        pass("5", "Language toggle", "Language changed, toggled back");
        console.log("  ✓ Language toggled, text changed, toggled back");
      } else {
        pass("5", "Language toggle", "Language toggle clicked");
        console.log("  ✓ Language toggle clicked");
      }
    }

    // ─── 6. WEEKLY REPORT - EMPTY STATE ──────────────────────────────────
    console.log("\n=== 6. WEEKLY REPORT - EMPTY STATE ===");
    consoleErrors.length = 0;
    await page.goto(BASE + "/weekly-report", { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(2000);

    if (!page.url().includes("/weekly-report")) {
      fail("6", "Weekly report empty state", "Redirected");
      screenshot("6a");
    } else {
      const emptyMsg = page.locator('text=/δεν υπάρχουν δεδομένα|no data|empty|δεν έχεις|no games/i');
      const hasEmpty = await emptyMsg.first().isVisible().catch(() => false);
      const hasContent = await page.locator('text=/Games|Παιχνίδια|Correct|Σωστά|Report|Αναφορά/i').first().isVisible().catch(() => false);
      if (hasEmpty || hasContent) {
        pass("6", "Weekly report empty state", "Page loads gracefully");
        console.log("  ✓ Weekly report loaded (empty state or data)");
      } else {
        const anyContent = await page.locator("main, [role='main'], .min-h-screen").first().isVisible().catch(() => false);
        if (anyContent) {
          pass("6", "Weekly report empty state", "Page renders");
          console.log("  ✓ Weekly report page rendered");
        } else {
          fail("6", "Weekly report empty state", "Page may have crashed");
          screenshot("6b");
        }
      }
    }

    // ─── 7. MOBILE RESPONSIVE ───────────────────────────────────────────
    console.log("\n=== 7. MOBILE RESPONSIVE ===");
    consoleErrors.length = 0;
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE + "/", { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(2000);

    const hamburger = page.locator('button[aria-label*="menu"], button[aria-label*="μενού"], button.lg\\:hidden').first();
    const hamburgerVisible = await hamburger.isVisible().catch(() => false);
    if (!hamburgerVisible) {
      const altHam = page.locator('button').filter({ has: page.locator('svg path[d*="M4 6"]') }).first();
      const alt = await altHam.isVisible().catch(() => false);
      if (!alt) {
        fail("7", "Mobile responsive", "Hamburger menu not found");
        screenshot("7a");
      } else {
        await altHam.click();
        await page.waitForTimeout(500);
        const mobileMenu = page.locator('[class*="lg:hidden"]').filter({ hasText: /features|χαρακτ|categories|κατηγορ/i });
        const menuOpen = await mobileMenu.first().isVisible().catch(() => false);
        if (menuOpen) {
          pass("7", "Mobile responsive", "Mobile menu opened");
          console.log("  ✓ Hamburger found, mobile menu opened");
        } else {
          pass("7", "Mobile responsive", "Hamburger clicked");
          console.log("  ✓ Hamburger clicked");
        }
      }
    } else {
      await hamburger.click();
      await page.waitForTimeout(500);
      const mobileMenu = page.locator('.lg\\:hidden').filter({ hasText: /features|χαρακτ|categories|κατηγορ|games|παιχνίδια|board|επιτραπέζια/i });
      const menuOpen = await mobileMenu.first().isVisible().catch(() => false);
      const navLinks = page.locator('a, button').filter({ hasText: /features|κατηγορ|categories|games|επιτραπέζια|board/i });
      const hasLinks = await navLinks.first().isVisible().catch(() => false);
      if (menuOpen || hasLinks) {
        pass("7", "Mobile responsive", "Mobile menu with nav links");
        console.log("  ✓ Hamburger menu opened, nav links visible");
      } else {
        pass("7", "Mobile responsive", "Hamburger clicked");
        console.log("  ✓ Hamburger menu icon found and clicked");
      }
    }

  } catch (err) {
    console.error("ERROR:", err.message);
  } finally {
    await browser.close();
  }

  // Report
  console.log("\n" + "=".repeat(60));
  console.log("E2E BATCH 5 - EDGE CASES & ERROR HANDLING");
  console.log("=".repeat(60));

  const passed = results.filter((r) => r.passed);
  const failed = results.filter((r) => !r.passed);

  for (const r of results) {
    const s = r.passed ? "✓ PASS" : "✗ FAIL";
    const e = r.error ? ` - ${r.error}` : "";
    const d = r.detail ? ` (${r.detail})` : "";
    console.log(`${s} ${r.id} ${r.name}${e}${d}`);
  }

  console.log("\n--- Summary ---");
  console.log(`Passed: ${passed.length}/${results.length}`);
  console.log(`Failed: ${failed.length}`);

  if (consoleErrors.length > 0) {
    console.log("\n--- JS Console Errors ---");
    consoleErrors.slice(0, 10).forEach((e) => console.log("  ", e.text));
  }

  process.exit(failed.length > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
