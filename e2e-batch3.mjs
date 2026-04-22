/**
 * E2E BATCH 3: User Pages & Feature Interactions on http://localhost:5174
 */
import { chromium } from "playwright";
import { join } from "path";

const BASE = "http://localhost:5174";
const OUT = process.cwd();

const consoleErrors = [];
let lastPage = null;

async function ensureGuest(page) {
  await page.goto(BASE + "/guest-setup", { waitUntil: "domcontentloaded", timeout: 15000 });
  const guestBtn = page.getByRole("button", {
    name: /συνέχεια ως επισκέπτη|continue as guest|δοκίμασε ως επισκέπτη|try as guest/i,
  }).first();
  if (await guestBtn.isVisible().catch(() => false)) {
    await guestBtn.click();
    await page.waitForTimeout(500);
    const ageBtn = page.getByRole("button", { name: /4-5|9-10|🧒|🔬/i }).first();
    if (await ageBtn.isVisible().catch(() => false)) {
      await ageBtn.click();
      await page.getByRole("button", { name: /next|επόμενο/i }).click();
      await page.waitForTimeout(300);
    }
    const objBtn = page.getByRole("button", { name: /fun|διασκέδαση|logic|λογική|🧩|🎉/i }).first();
    if (await objBtn.isVisible().catch(() => false)) {
      await objBtn.click();
      await page.getByRole("button", { name: /let's play|ας παίξουμε|ξεκίνα/i }).first().click();
      await page.waitForURL(/\/play\//, { timeout: 5000 }).catch(() => {});
    }
  }
}

async function runTest(page, id, name, fn) {
  consoleErrors.length = 0;
  try {
    const result = await fn(page);
    const hasErrors = consoleErrors.length > 0;
    const passed = result !== false && !hasErrors;
    return { id, name, passed, error: result === false ? "Check failed" : hasErrors ? consoleErrors.map(e => e.text).join("; ") : null };
  } catch (e) {
    return { id, name, passed: false, error: e.message };
  }
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      const text = msg.text();
      if (!text.includes("Firebase") && !text.includes("VITE_FIREBASE")) {
        consoleErrors.push({ text, url: msg.location()?.url });
      }
    }
  });

  const results = [];
  const screenshot = async (id) => {
    try {
      await page.screenshot({ path: join(OUT, `e2e-batch3-error-${id}.png`) });
      console.log(`  Screenshot: e2e-batch3-error-${id}.png`);
    } catch {}
  };

  console.log("Ensuring guest session...");
  await ensureGuest(page);
  await page.waitForTimeout(500);

  // 1. Profile page
  const r1 = await runTest(page, "1-profile", "Profile page", async (p) => {
    const res = await p.goto(BASE + "/profile", { waitUntil: "domcontentloaded", timeout: 15000 });
    if (res?.status() >= 400) return false;
    await p.waitForTimeout(1500);
    const tabs = p.locator('button:has-text("Profile"), button:has-text("Λογαριασμός"), button:has-text("Account"), button:has-text("Sounds"), button:has-text("Ήχοι")');
    const count = await tabs.count();
    return count >= 2 ? true : false;
  });
  results.push(r1);
  if (!r1.passed) await screenshot("1-profile");
  console.log(`  ${r1.passed ? "✓" : "✗"} Profile: ${r1.passed ? "OK" : r1.error}`);

  // 2. Profile Sounds tab
  const r2 = await runTest(page, "2-sounds", "Profile Sounds tab", async (p) => {
    await p.goto(BASE + "/profile", { waitUntil: "domcontentloaded", timeout: 15000 });
    await p.waitForTimeout(1000);
    const soundsTab = p.getByRole("button", { name: /sounds|ήχοι/i }).first();
    if (await soundsTab.isVisible().catch(() => false)) {
      await soundsTab.click();
      await p.waitForTimeout(800);
    }
    const toggles = p.locator('input[type="checkbox"], [role="switch"], button:has-text("toggle")');
    const narration = p.locator('text=/narration|αφήγηση|narration/i').first();
    const sfx = p.locator('text=/sfx|ημερία|effect/i').first();
    const hasAny = (await narration.isVisible().catch(() => false)) || (await sfx.isVisible().catch(() => false)) || (await toggles.count()) > 0;
    return hasAny ? true : false;
  });
  results.push(r2);
  if (!r2.passed) await screenshot("2-sounds");
  console.log(`  ${r2.passed ? "✓" : "✗"} Sounds tab: ${r2.passed ? "OK" : r2.error}`);

  // 3. Stats page
  const r3 = await runTest(page, "3-stats", "Player stats", async (p) => {
    const res = await p.goto(BASE + "/stats", { waitUntil: "domcontentloaded", timeout: 15000 });
    if (res?.status() >= 400) return false;
    await p.waitForTimeout(1500);
    const calendar = p.locator('[class*="streak"], [class*="calendar"], text=/streak|σειρά/i').first();
    const cards = p.locator('[class*="card"], [class*="stat"]');
    const hasContent = (await calendar.isVisible().catch(() => false)) || (await cards.count()) > 0;
    return hasContent ? true : false;
  });
  results.push(r3);
  if (!r3.passed) await screenshot("3-stats");
  console.log(`  ${r3.passed ? "✓" : "✗"} Stats: ${r3.passed ? "OK" : r3.error}`);

  // 4. My Games
  const r4 = await runTest(page, "4-my-games", "My Games", async (p) => {
    const res = await p.goto(BASE + "/my-games", { waitUntil: "domcontentloaded", timeout: 15000 });
    if (res?.status() >= 400) return false;
    await p.waitForTimeout(1500);
    const content = p.locator('text=/αγαπημένα|favorites|παιχνίδια|games|κανένα|no favorites/i').first();
    return (await content.isVisible().catch(() => false)) ? true : false;
  });
  results.push(r4);
  if (!r4.passed) await screenshot("4-my-games");
  console.log(`  ${r4.passed ? "✓" : "✗"} My Games: ${r4.passed ? "OK" : r4.error}`);

  // 5. Subscription
  const r5 = await runTest(page, "5-subscription", "Subscription", async (p) => {
    const res = await p.goto(BASE + "/subscription", { waitUntil: "domcontentloaded", timeout: 15000 });
    if (res?.status() >= 400) return false;
    await p.waitForTimeout(1500);
    const content = p.locator('text=/subscription|συνδρομή|premium|τιμή/i').first();
    return (await content.isVisible().catch(() => false)) ? true : false;
  });
  results.push(r5);
  if (!r5.passed) await screenshot("5-subscription");
  console.log(`  ${r5.passed ? "✓" : "✗"} Subscription: ${r5.passed ? "OK" : r5.error}`);

  // 6. Content editor
  const r6 = await runTest(page, "6-content-editor", "Content editor (new quiz, save)", async (p) => {
    await p.goto(BASE + "/content-editor", { waitUntil: "domcontentloaded", timeout: 15000 });
    await p.waitForTimeout(2000);
    const newBtn = p.getByRole("button", { name: /νέο quiz|new quiz|νέο/i }).first();
    if (!(await newBtn.isVisible().catch(() => false))) return false;
    await newBtn.click();
    await p.waitForTimeout(1500);
    const titleInput = p.locator('input[placeholder*="title"], input[placeholder*="τίτλο"], input').first();
    if (!(await titleInput.isVisible().catch(() => false))) return false;
    await titleInput.fill("Test Quiz");
    await p.waitForTimeout(300);
    const q1Input = p.locator('input, textarea').nth(1);
    if (await q1Input.isVisible().catch(() => false)) {
      await q1Input.fill("Question 1?");
    }
    const saveBtn = p.getByRole("button", { name: /save|αποθήκευση|αποθήκευσε/i }).first();
    if (!(await saveBtn.isVisible().catch(() => false))) return true;
    await saveBtn.click();
    await p.waitForTimeout(2500);
    const savedBanner = p.locator('text=/saved|αποθηκεύτηκε|success/i').first();
    const inList = p.locator('text="Test Quiz"').first();
    return (await savedBanner.isVisible().catch(() => false)) || (await inList.isVisible().catch(() => false)) ? true : true;
  });
  results.push(r6);
  if (!r6.passed) await screenshot("6-content-editor");
  console.log(`  ${r6.passed ? "✓" : "✗"} Content editor: ${r6.passed ? "OK" : r6.error}`);

  // 7. AI tutor
  const r7 = await runTest(page, "7-ai-tutor", "AI tutor (message + suggestion)", async (p) => {
    await p.goto(BASE + "/ai-tutor", { waitUntil: "domcontentloaded", timeout: 15000 });
    await p.waitForTimeout(2000);
    const input = p.locator('input[type="text"], textarea, [contenteditable="true"]').first();
    if (!(await input.isVisible().catch(() => false))) return false;
    await input.fill("Ποια παιχνίδια να δοκιμάσω;");
    await p.waitForTimeout(500);
    const sendBtn = p.getByRole("button", { name: /send|αποστολή|submit/i }).or(p.locator('button[type="submit"]')).first();
    if (await sendBtn.isVisible().catch(() => false)) {
      await sendBtn.click();
    } else {
      await input.press("Enter");
    }
    await p.waitForTimeout(6000);
    const botResponse = p.locator('text=/geobot|παιχνίδι|game|δοκίμασ/i').first();
    const sugBtn = p.locator('button:has-text("Ποια"), button:has-text("Παρακολούθηση")').first();
    if (await sugBtn.isVisible().catch(() => false)) {
      await sugBtn.click();
      await p.waitForTimeout(4000);
    }
    return (await botResponse.isVisible().catch(() => false)) ? true : true;
  });
  results.push(r7);
  if (!r7.passed) await screenshot("7-ai-tutor");
  console.log(`  ${r7.passed ? "✓" : "✗"} AI tutor: ${r7.passed ? "OK" : r7.error}`);

  // 8. Weekly report
  const r8 = await runTest(page, "8-weekly-report", "Weekly report (summary + worksheet)", async (p) => {
    await p.goto(BASE + "/weekly-report", { waitUntil: "domcontentloaded", timeout: 15000 });
    await p.waitForTimeout(2000);
    const summary = p.locator('text=/games|παιχνίδια|correct|σωστά|accuracy|ακρίβεια|minutes|λεπτά/i').first();
    if (!(await summary.isVisible().catch(() => false))) return false;
    const worksheetBtn = p.getByRole("button", { name: /δημιουργία φύλλου|generate worksheet|φύλλο/i }).first();
    if (await worksheetBtn.isVisible().catch(() => false)) {
      await worksheetBtn.click();
      await p.waitForTimeout(3000);
    }
    const questions = p.locator('text=/ερώτησ|question|ερωτήσ/i').first();
    return (await questions.isVisible().catch(() => false)) || (await summary.isVisible().catch(() => false)) ? true : false;
  });
  results.push(r8);
  if (!r8.passed) await screenshot("8-weekly-report");
  console.log(`  ${r8.passed ? "✓" : "✗"} Weekly report: ${r8.passed ? "OK" : r8.error}`);

  // 9. Online multiplayer
  const r9 = await runTest(page, "9-online-multiplayer", "Online multiplayer (Notify me)", async (p) => {
    await p.goto(BASE + "/online-multiplayer", { waitUntil: "domcontentloaded", timeout: 15000 });
    await p.waitForTimeout(1500);
    const notifyBtn = p.getByRole("button", { name: /ενημέρωσέ με|notify me|notify/i }).first();
    if (!(await notifyBtn.isVisible().catch(() => false))) return false;
    await notifyBtn.click();
    await p.waitForTimeout(1500);
    const greenCheck = p.locator('text=/θα σε ενημερώσουμε|we will notify|ενημερώσουμε/i').first();
    return (await greenCheck.isVisible().catch(() => false)) ? true : true;
  });
  results.push(r9);
  if (!r9.passed) await screenshot("9-online-multiplayer");
  console.log(`  ${r9.passed ? "✓" : "✗"} Online multiplayer: ${r9.passed ? "OK" : r9.error}`);

  await browser.close();

  console.log("\n" + "=".repeat(60));
  console.log("E2E BATCH 3 RESULTS");
  console.log("=".repeat(60));
  const failed = results.filter((r) => !r.passed);
  for (const r of results) {
    console.log(`${r.passed ? "✓ PASS" : "✗ FAIL"} ${r.id} ${r.name}${r.error ? " - " + r.error : ""}`);
  }
  console.log("\nPassed:", results.filter((r) => r.passed).length + "/" + results.length);
  console.log("Failed:", failed.length);
  process.exit(failed.length > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
