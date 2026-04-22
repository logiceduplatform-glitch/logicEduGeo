import { chromium } from "playwright";
import fs from "fs";

fs.mkdirSync("/tmp/geo-guest-navbar", { recursive: true });
const dir = "/tmp/geo-guest-navbar";
const report = [];
const consoleErrors = [];

function log(m) {
  console.log(m);
  report.push(m);
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(msg.text());
});
page.on("pageerror", (err) => consoleErrors.push(err.message));

// ========== TEST 1: Guest Setup redesign ==========
log("=== TEST 1: Guest Setup redesign ===");

await page.goto("http://localhost:5173/guest-setup", { waitUntil: "networkidle", timeout: 15000 });
await page.waitForTimeout(1500);

// 1. Step 1 screenshot and checks
log("\n--- Step 1 ---");
await page.screenshot({ path: `${dir}/01-guest-setup-step1.png` });
const greenGradient = (await page.locator('[class*="emerald"], [class*="teal"], [class*="cyan"]').count()) > 0;
const guestBadge = (await page.locator('text=/Guest Mode|Λειτουργία Επισκέπτη/').count()) > 0;
const pulseDot = (await page.locator('.animate-pulse').count()) > 0;
const progressStep1 = (await page.locator('text=/Step 1 of 2|Βήμα 1 από 2/').count()) > 0;
const headerTitle = (await page.locator('h1:has-text("How old"), h1:has-text("Πόσο χρονών")').count()) > 0;
const ageGrid = (await page.locator('button').filter({ hasText: /2-3|4-5|Age|Ηλικία/ }).count()) >= 4;
const backBtn = (await page.locator('button:has-text("Back"), button:has-text("Πίσω")').count()) > 0;
const nextBtn = (await page.locator('button:has-text("Next"), button:has-text("Επόμενο")').count()) > 0;
const signUpNudge = (await page.locator('text=/Sign up free|Εγγράψου δωρεάν/').count()) > 0;

log(`  Green/teal gradient: ${greenGradient}`);
log(`  Guest Mode badge: ${guestBadge}`);
log(`  Pulsing dot: ${pulseDot}`);
log(`  Progress Step 1 of 2: ${progressStep1}`);
log(`  Header "How old": ${headerTitle}`);
log(`  Age grid: ${ageGrid}`);
log(`  Back/Next: ${backBtn && nextBtn}`);
log(`  Sign up nudge: ${signUpNudge}`);

// 2. Select Age 4-5, Next
log("\n--- Step 2 ---");
const age45 = page.locator('button').filter({ hasText: /4[\s\-–]5|Ηλικία 4/i });
await age45.first().click();
await page.waitForTimeout(300);
await page.locator('button:has-text("Next"), button:has-text("Επόμενο")').click();
await page.waitForTimeout(600);
await page.screenshot({ path: `${dir}/02-guest-setup-step2.png` });
const objectiveOpts = (await page.locator('button').filter({ hasText: /school|Fun|logic|σχολείο|Διασκέδαση|Λογική/ }).count()) >= 3;
log(`  3 objectives: ${objectiveOpts}`);

// 3. Select Fun
log("\n--- Select Fun ---");
await page.locator('button').filter({ hasText: /Fun|Διασκέδαση|διασκέδαση/i }).first().click();
await page.waitForTimeout(400);
await page.screenshot({ path: `${dir}/03-fun-selected.png` });
const funSelected = (await page.locator('button.border-emerald-500').count()) > 0;
const greenCheck = (await page.locator('button').filter({ has: page.locator('svg') }).count()) > 0;
log(`  Fun selected (green border): ${funSelected}`);
log(`  Green checkmark: ${greenCheck}`);

// ========== TEST 2: Navbar authenticated state ==========
log("\n=== TEST 2: Navbar authenticated state ===");

// 4. Homepage navbar - unauthenticated
log("\n--- Step 4: Homepage (unauthenticated) ---");
await page.goto("http://localhost:5173/", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
await page.screenshot({ path: `${dir}/04-navbar-unauthenticated.png` });
const hasLogIn = (await page.locator('button:has-text("Log in"), button:has-text("Σύνδεση")').count()) > 0;
const hasSignUp = (await page.locator('button:has-text("Sign Up"), button:has-text("Εγγραφή")').count()) > 0;
log(`  Log in visible: ${hasLogIn}`);
log(`  Sign Up visible: ${hasSignUp}`);

// 5. Complete guest setup
log("\n--- Step 5: Complete guest setup ---");
await page.goto("http://localhost:5173/guest-setup", { waitUntil: "networkidle" });
await page.waitForTimeout(800);
await page.locator('button').filter({ hasText: /4[\s\-–]5|Ηλικία 4/i }).first().click();
await page.waitForTimeout(300);
await page.locator('button:has-text("Next"), button:has-text("Επόμενο")').click();
await page.waitForTimeout(600);
await page.locator('button').filter({ hasText: /Fun|Διασκέδαση|διασκέδαση/i }).first().click();
await page.waitForTimeout(400);
await page.locator('button:has-text("Let\'s play"), button:has-text("Ας παίξουμε")').click();
await page.waitForURL(/\/play\//, { timeout: 8000 });
await page.waitForTimeout(1500);
log("  Guest session created, redirected to play");

// 6. Navigate to homepage to see Navbar in guest state
log("\n--- Step 6: Navbar (authenticated/guest) ---");
await page.goto("http://localhost:5173/", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
await page.screenshot({ path: `${dir}/05-navbar-guest.png` });
const nav = page.locator('nav');
const noLogIn = (await nav.locator('button').filter({ hasText: /Log in|Σύνδεση/ }).count()) === 0;
const noSignUp = (await nav.locator('button').filter({ hasText: /Sign Up|Εγγραφή/ }).count()) === 0;
const hasAvatar = (await nav.locator('.rounded-full.bg-gradient-to-br, [class*="from-purple"]').count()) > 0;
const hasGuestName = (await nav.getByText(/Guest|Επισκέπτης/).count()) > 0;
log(`  Log in gone: ${noLogIn}`);
log(`  Sign Up gone: ${noSignUp}`);
log(`  Avatar (purple circle): ${hasAvatar}`);
log(`  Guest name: ${hasGuestName}`);

// 7. Click avatar to open dropdown
log("\n--- Step 7: Avatar dropdown ---");
const avatarBtn = page.locator('nav button').filter({ has: page.locator('.rounded-full, [class*="gradient"]') }).first();
if ((await avatarBtn.count()) > 0) {
  await avatarBtn.click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${dir}/06-navbar-dropdown.png` });
  const dropdownVisible = (await page.locator('text=/Guest mode|Λειτουργία επισκέπτη|Log out|Αποσύνδεση/').count()) > 0;
  log(`  Dropdown opens: ${dropdownVisible}`);
}

// 8. Console
log("\n=== Console errors ===");
log(`  Errors: ${consoleErrors.length}`);
consoleErrors.forEach((e, i) => log(`  [${i + 1}] ${e}`));

await browser.close();
console.log("\n" + report.join("\n"));
process.exit(0);
