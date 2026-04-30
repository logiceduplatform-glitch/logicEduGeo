import { db } from "../auth/firebase";
import { collection, getDocs, onSnapshot } from "firebase/firestore";

// Helper: build age-group game flags.
// Each age has 3 categories (school, fun, logic). Plus Adult has brain/fun/logic + board.
const AGE_GROUPS = [
  { key: "2_3",   labelEl: "2-3 ετών",  labelEn: "Age 2-3" },
  { key: "4_5",   labelEl: "4-5 ετών",  labelEn: "Age 4-5" },
  { key: "6",     labelEl: "6 ετών",    labelEn: "Age 6" },
  { key: "7_8",   labelEl: "7-8 ετών",  labelEn: "Age 7-8" },
  { key: "9_10",  labelEl: "9-10 ετών", labelEn: "Age 9-10" },
  { key: "11_12", labelEl: "11-12 ετών",labelEn: "Age 11-12" },
];

const OBJECTIVES = [
  { key: "school", labelEl: "🏫 Σχολικά",  labelEn: "🏫 School" },
  { key: "fun",    labelEl: "🎉 Διασκέδαση", labelEn: "🎉 Fun" },
  { key: "logic",  labelEl: "🧠 Λογική",    labelEn: "🧠 Logic" },
];

function buildGameFlags() {
  const out = {};
  for (const age of AGE_GROUPS) {
    for (const obj of OBJECTIVES) {
      const id = `games_age_${age.key}_${obj.key}`;
      out[id] = {
        enabled: true,
        label: {
          el: `${age.labelEl} · ${obj.labelEl}`,
          en: `${age.labelEn} · ${obj.labelEn}`,
        },
        category: `games_age_${age.key}`,
      };
    }
  }
  // Adult special - 4 categories
  for (const obj of [
    { key: "brain", labelEl: "🧠 Brain Games", labelEn: "🧠 Brain Games" },
    { key: "fun",   labelEl: "🎉 Fun Games",   labelEn: "🎉 Fun Games" },
    { key: "logic", labelEl: "🧩 Logic Games", labelEn: "🧩 Logic Games" },
    { key: "board", labelEl: "♟️ Επιτραπέζια", labelEn: "♟️ Board Games" },
  ]) {
    const id = `games_age_adult_${obj.key}`;
    out[id] = {
      enabled: true,
      label: { el: `Ενήλικες · ${obj.labelEl}`, en: `Adult · ${obj.labelEn}` },
      category: "games_age_adult",
    };
  }
  return out;
}

// Default flags - shipped with the app. Admin can override via Firestore.
export const DEFAULT_FLAGS = {
  // ─── Subscriptions ─────────────────────────────────────
  subs_enabled:     { enabled: true, label: { el: "Σύστημα Συνδρομών (Master)", en: "Subscriptions System (Master)" }, category: "subscriptions" },
  subs_free:        { enabled: true, label: { el: "Πλάνο Free", en: "Free Plan" }, category: "subscriptions" },
  subs_premium:     { enabled: true, label: { el: "Πλάνο Premium (€9.99/μήνα)", en: "Premium Plan (€9.99/mo)" }, category: "subscriptions" },
  subs_family:      { enabled: true, label: { el: "Πλάνο Family (€14.99/μήνα)", en: "Family Plan (€14.99/mo)" }, category: "subscriptions" },
  subs_school:      { enabled: false, label: { el: "Πλάνο School (custom)", en: "School Plan (custom)" }, category: "subscriptions" },
  subs_trial:       { enabled: true, label: { el: "Δωρεάν δοκιμή 7 ημερών", en: "7-day Free Trial" }, category: "subscriptions" },
  subs_pricingPage: { enabled: true, label: { el: "Σελίδα Τιμολόγησης", en: "Pricing Page" }, category: "subscriptions" },
  subs_payment:     { enabled: true, label: { el: "Stripe Checkout", en: "Stripe Checkout" }, category: "subscriptions" },
  subs_referralReward: { enabled: true, label: { el: "Premium Trial μέσω Referral", en: "Premium Trial via Referral" }, category: "subscriptions" },

  // ─── Games per Age & Objective ─────────────────────────
  ...buildGameFlags(),

  // ─── Student features ──────────────────────────────────
  battleRoyale:   { enabled: true, label: { el: "Battle Royale", en: "Battle Royale" }, category: "students" },
  speedrun:       { enabled: true, label: { el: "Speedrun", en: "Speedrun" }, category: "students" },
  adventureMap:   { enabled: true, label: { el: "Χάρτης Περιπέτειας", en: "Adventure Map" }, category: "students" },
  pet:            { enabled: true, label: { el: "Pet System", en: "Pet System" }, category: "students" },
  cards:          { enabled: true, label: { el: "Κάρτες", en: "Collectible Cards" }, category: "students" },
  storyMode:      { enabled: true, label: { el: "Story Mode", en: "Story Mode" }, category: "students" },
  dailyChallenge: { enabled: true, label: { el: "Ημερήσια Πρόκληση", en: "Daily Challenge" }, category: "students" },
  avatarBuilder:  { enabled: true, label: { el: "Avatar Builder", en: "Avatar Builder" }, category: "students" },
  shop:           { enabled: true, label: { el: "Κατάστημα", en: "Shop" }, category: "students" },

  // ─── AI / Voice ────────────────────────────────────────
  aiTutor:        { enabled: true, label: { el: "Study Buddy AI", en: "Study Buddy AI" }, category: "ai" },
  voiceCommands:  { enabled: true, label: { el: "Voice Commands", en: "Voice Commands" }, category: "ai" },
  textToSpeech:   { enabled: true, label: { el: "Text-to-Speech", en: "Text-to-Speech" }, category: "ai" },
  hintSystem:     { enabled: true, label: { el: "Hint System (50/50)", en: "Hint System (50/50)" }, category: "ai" },

  // ─── Progress / Competition ────────────────────────────
  trophyRoom:        { enabled: true, label: { el: "Trophy Room", en: "Trophy Room" }, category: "progress" },
  masteryTracker:    { enabled: true, label: { el: "Mastery Tracker", en: "Mastery Tracker" }, category: "progress" },
  leaderboard:       { enabled: true, label: { el: "Παγκόσμια Κατάταξη", en: "Global Leaderboard" }, category: "progress" },
  events:            { enabled: true, label: { el: "Events & Τουρνουά", en: "Events & Tournaments" }, category: "progress" },
  spacedRepetition:  { enabled: true, label: { el: "Spaced Repetition", en: "Spaced Repetition" }, category: "progress" },
  certificates:      { enabled: true, label: { el: "Πιστοποιητικά", en: "Certificates" }, category: "progress" },

  // ─── Teacher ───────────────────────────────────────────
  liveQuiz:       { enabled: true, label: { el: "Live Quiz", en: "Live Quiz" }, category: "teachers" },
  homework:       { enabled: true, label: { el: "Εργασίες για το σπίτι", en: "Homework" }, category: "teachers" },
  worksheets:     { enabled: true, label: { el: "Φύλλα Εργασίας", en: "Worksheets" }, category: "teachers" },
  aiQuizGen:      { enabled: true, label: { el: "AI Quiz Generator", en: "AI Quiz Generator" }, category: "teachers" },
  lessonPlans:    { enabled: true, label: { el: "Σχέδια Μαθήματος", en: "Lesson Plans" }, category: "teachers" },
  classReports:   { enabled: true, label: { el: "Αναφορές Τάξης", en: "Class Reports" }, category: "teachers" },
  coTeacher:      { enabled: true, label: { el: "Co-Teacher", en: "Co-Teacher" }, category: "teachers" },
  teacherTheory:  { enabled: true, label: { el: "Θεωρία/Μαθήματα", en: "Theory/Lessons" }, category: "teachers" },

  // ─── Parent ────────────────────────────────────────────
  familyChallenge:    { enabled: true, label: { el: "Οικογενειακή Πρόκληση", en: "Family Challenge" }, category: "parents" },
  weeklyDigest:       { enabled: true, label: { el: "Εβδομαδιαία Αναφορά", en: "Weekly Digest" }, category: "parents" },
  screenTime:         { enabled: true, label: { el: "Έλεγχος Χρόνου Οθόνης", en: "Screen Time Controls" }, category: "parents" },
  parentTeacherChat:  { enabled: true, label: { el: "Chat Γονέα-Δασκάλου", en: "Parent-Teacher Chat" }, category: "parents" },
  multiChild:         { enabled: true, label: { el: "Σύγκριση Πολλαπλών Παιδιών", en: "Multi-Child Comparison" }, category: "parents" },
  homeworkHelper:     { enabled: true, label: { el: "Homework Helper", en: "Homework Helper" }, category: "parents" },

  // ─── UX / Theme ─────────────────────────────────────
  seasonalDecorations: { enabled: false, label: { el: "Εποχιακές διακοσμήσεις (animations)", en: "Seasonal decorations (animations)" }, category: "ux" },
  seasonalThemes:      { enabled: true,  label: { el: "Εποχιακά θέματα (επιλογή χρήστη)", en: "Seasonal themes (user selectable)" }, category: "ux" },

  // ─── Marketing ────────────────────────────────────────
  referrals:      { enabled: true, label: { el: "Σύστημα Παραπομπών", en: "Referrals" }, category: "marketing" },
  newsletter:     { enabled: true, label: { el: "Newsletter", en: "Newsletter" }, category: "marketing" },
  blog:           { enabled: true, label: { el: "Blog", en: "Blog" }, category: "marketing" },
  trophyShare:    { enabled: true, label: { el: "Share Trophy Room", en: "Share Trophy Room" }, category: "marketing" },
  scoreShare:     { enabled: true, label: { el: "Share Score Card", en: "Share Score Card" }, category: "marketing" },

  // ─── Round 9: AI / PWA / Quests ───────────────────────
  aiLessonGen:    { enabled: true, label: { el: "AI Δημιουργία Μαθήματος", en: "AI Lesson Generator" }, category: "round9" },
  pwaInstall:     { enabled: true, label: { el: "Εγκατάσταση PWA", en: "PWA Install" }, category: "round9" },
  pushNotifs:     { enabled: true, label: { el: "Browser Ειδοποιήσεις", en: "Browser Notifications" }, category: "round9" },
  dailyQuests:    { enabled: true, label: { el: "Ημερήσιες Αποστολές", en: "Daily Quests" }, category: "round9" },
  offlineMode:    { enabled: true, label: { el: "Offline Mode (Service Worker)", en: "Offline Mode (Service Worker)" }, category: "round9" },

  // ─── Round 10: Multiplayer & Social ───────────────────
  onlineBattle:   { enabled: true, label: { el: "Online Battle (PvP)", en: "Online Battle (PvP)" }, category: "round10" },
  guilds:         { enabled: true, label: { el: "Συμμαχίες (Guilds)", en: "Guilds / Crews" }, category: "round10" },
  publicProfile:  { enabled: true, label: { el: "Δημόσιο Προφίλ", en: "Public Profile" }, category: "round10" },

  // ─── Round 11: Innovative Modes ───────────────────────
  adventures:     { enabled: true, label: { el: "Διαδραστικές Περιπέτειες", en: "Interactive Adventures" }, category: "round11" },
  voiceQuiz:      { enabled: true, label: { el: "Φωνητικό Quiz", en: "Voice Quiz" }, category: "round11" },
  learningPath:   { enabled: true, label: { el: "Διαδρομή Μάθησης (AI)", en: "Personalized Learning Path (AI)" }, category: "round11" },

  // ─── Round 12: Business / B2B ─────────────────────────
  curriculumPacks:{ enabled: true, label: { el: "Πακέτα Curriculum", en: "Curriculum Packs" }, category: "round12" },
  schoolAdmin:    { enabled: true, label: { el: "Διαχείριση Σχολείου", en: "School Admin" }, category: "round12" },
  kidLogin:       { enabled: true, label: { el: "Kid Login (QR/PIN)", en: "Kid Login (QR/PIN)" }, category: "round12" },
  affiliate:      { enabled: true, label: { el: "Affiliate Program", en: "Affiliate Program" }, category: "round12" },
  lmsExport:      { enabled: true, label: { el: "LMS Export (Classroom/Teams)", en: "LMS Export (Classroom/Teams)" }, category: "round12" },

  // ─── Round 13: Engagement Polish ──────────────────────
  miniGames:      { enabled: true, label: { el: "Καθημερινά Mini-Games", en: "Daily Mini-Games" }, category: "round13" },
  shopExpansion:  { enabled: true, label: { el: "Επέκταση Shop (frames, badges)", en: "Shop expansion (frames, badges)" }, category: "round13" },
  music:          { enabled: true, label: { el: "Μουσική Παρασκηνίου", en: "Background Music" }, category: "round13" },

  // ─── Round 14: Accessibility ──────────────────────────
  accessibility:  { enabled: true, label: { el: "Σελίδα Προσβασιμότητας", en: "Accessibility Page" }, category: "round14" },
  a11yFAB:        { enabled: true, label: { el: "Floating Accessibility (♿)", en: "Floating Accessibility (♿)" }, category: "round14" },
  signLanguage:   { enabled: true, label: { el: "Νοηματική γλώσσα", en: "Sign Language" }, category: "round14" },

  // ─── Round 15: Ambitious ──────────────────────────────
  arFlashcards:   { enabled: true, label: { el: "AR Flashcards (κάμερα)", en: "AR Flashcards (camera)" }, category: "round15" },
  coPlay:         { enabled: true, label: { el: "Co-Play με Γονιό", en: "Co-Play with Parent" }, category: "round15" },
  printShop:      { enabled: true, label: { el: "Print Shop (φυσικά προϊόντα)", en: "Print Shop (physical goods)" }, category: "round15" },
};

const CACHE_KEY = "geo:featureFlags";
let _cache = null;
let _listeners = new Set();

function loadCache() {
  if (_cache) return _cache;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) _cache = JSON.parse(raw);
  } catch {}
  if (!_cache) _cache = {};
  return _cache;
}

function saveCache(data) {
  _cache = data;
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch {}
  _listeners.forEach((fn) => { try { fn(); } catch {} });
}

export const FeatureFlagService = {
  /**
   * Synchronous check using cached values + defaults.
   * Returns true if flag enabled (or unknown).
   */
  isEnabled(id) {
    const cache = loadCache();
    if (Object.prototype.hasOwnProperty.call(cache, id)) {
      return cache[id] !== false;
    }
    const def = DEFAULT_FLAGS[id];
    return def ? !!def.enabled : true;
  },

  getAll() {
    const cache = loadCache();
    const merged = {};
    for (const [id, def] of Object.entries(DEFAULT_FLAGS)) {
      merged[id] = {
        ...def,
        enabled: Object.prototype.hasOwnProperty.call(cache, id) ? cache[id] !== false : !!def.enabled,
      };
    }
    return merged;
  },

  /**
   * Initialize: fetch flag overrides from Firestore once.
   */
  async init() {
    try {
      const snap = await getDocs(collection(db, "featureFlags"));
      const data = {};
      snap.forEach((d) => { data[d.id] = !!d.data().enabled; });
      saveCache(data);
    } catch (e) {
      // Use defaults silently
    }
  },

  /**
   * Live subscription (use only on admin pages or if needed).
   */
  subscribe(callback) {
    _listeners.add(callback);
    return () => _listeners.delete(callback);
  },

  /**
   * Optional: real-time listener — only call when the user really needs latest flags.
   */
  startLive() {
    try {
      onSnapshot(collection(db, "featureFlags"), (snap) => {
        const data = {};
        snap.forEach((d) => { data[d.id] = !!d.data().enabled; });
        saveCache(data);
      });
    } catch {}
  },
};
