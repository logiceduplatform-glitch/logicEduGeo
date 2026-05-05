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

  // ─── Classic Games (Mega Combo Round - 59 games, 6 categories) ─────
  classicGames_master:       { enabled: true, label: { el: "Master · Όλα τα Κλασικά Παιχνίδια", en: "Master · All Classic Games" }, category: "classicGames" },
  classicGames_quickWins:    { enabled: true, label: { el: "Quick Wins (10) · Wordle, 2048, Snake, Tetris…", en: "Quick Wins (10) · Wordle, 2048, Snake, Tetris…" }, category: "classicGames" },
  classicGames_educational:  { enabled: true, label: { el: "Εκπαιδευτικά (16) · Spelling Bee, Math Sprint…", en: "Educational (16) · Spelling Bee, Math Sprint…" }, category: "classicGames" },
  classicGames_creative:     { enabled: true, label: { el: "Δημιουργικά (13) · Pixel Art, Beat Maker…", en: "Creative (13) · Pixel Art, Beat Maker…" }, category: "classicGames" },
  classicGames_multiplayer:  { enabled: true, label: { el: "Multiplayer (5) · Battle Quiz, Co-op Maze…", en: "Multiplayer (5) · Battle Quiz, Co-op Maze…" }, category: "classicGames" },
  classicGames_action:       { enabled: true, label: { el: "Δράσης (8) · Reaction, Bubble Pop…", en: "Action (8) · Reaction, Bubble Pop…" }, category: "classicGames" },
  classicGames_stem:         { enabled: true, label: { el: "STEM (7) · Chemistry, Solar System, DNA…", en: "STEM (7) · Chemistry, Solar System, DNA…" }, category: "classicGames" },
  classicGames_navMenu:      { enabled: true, label: { el: "Εμφάνιση στο Navbar Menu", en: "Show in Navbar Menu" }, category: "classicGames" },
  classicGames_homeBanner:   { enabled: true, label: { el: "Mega banner στην Home Page", en: "Mega banner on Home Page" }, category: "classicGames" },
  classicGames_coinRewards:  { enabled: true, label: { el: "Coin rewards για κάθε παιχνίδι", en: "Coin rewards per game" }, category: "classicGames" },
  classicGames_achievements: { enabled: true, label: { el: "Achievements για milestones (5/15/30 παιχνίδια)", en: "Achievements for milestones (5/15/30 games)" }, category: "classicGames" },
  classicGames_firstTip:     { enabled: true, label: { el: "First-time tutorial popups", en: "First-time tutorial popups" }, category: "classicGames" },
  classicGames_rewardToast:  { enabled: true, label: { el: "Reward toast notifications", en: "Reward toast notifications" }, category: "classicGames" },
  classicGames_leaderboard:  { enabled: true, label: { el: "Personal Bests (Reflex Leaderboard)", en: "Personal Bests (Reflex Leaderboard)" }, category: "classicGames" },
  classicGames_whatsNew:     { enabled: true, label: { el: "Σελίδα 'Τι Νέο'", en: "'What's New' page" }, category: "classicGames" },

  // ─── Analytics & Tracking ───────────────────────────────
  analytics_clarity:        { enabled: true, label: { el: "Microsoft Clarity (heatmaps, session recordings)", en: "Microsoft Clarity (heatmaps, sessions)" }, category: "analytics" },
  analytics_gameEvents:     { enabled: true, label: { el: "Game events (start/complete/score)", en: "Game events (start/complete/score)" }, category: "analytics" },
  analytics_milestones:     { enabled: true, label: { el: "Milestone tracking", en: "Milestone tracking" }, category: "analytics" },
  sentry_enabled:           { enabled: true, label: { el: "Sentry · Error tracking & performance", en: "Sentry · Error tracking & performance" }, category: "analytics" },
  appcheck_enabled:         { enabled: true, label: { el: "Firebase App Check (anti-abuse)", en: "Firebase App Check (anti-abuse)" }, category: "analytics" },

  // ─── Marketing & Growth ─────────────────────────────────
  marketing_comparison:     { enabled: true,  label: { el: "Σύγκριση με ανταγωνισμό (homepage table)", en: "Comparison vs competitors (homepage table)" }, category: "marketing" },
  marketing_newsletter:     { enabled: true,  label: { el: "Newsletter signup (footer)", en: "Newsletter signup (footer)" }, category: "marketing" },
  marketing_newsletterHero: { enabled: false, label: { el: "Newsletter — large homepage hero (διπλό)", en: "Newsletter — large homepage hero (duplicate)" }, category: "marketing" },
  marketing_blog:           { enabled: true,  label: { el: "Blog (/blog)", en: "Blog (/blog)" }, category: "marketing" },
  marketing_rssLink:        { enabled: true,  label: { el: "RSS feed link στο head", en: "RSS feed link in head" }, category: "marketing" },
  marketing_seoFaqSchema:   { enabled: true,  label: { el: "FAQPage JSON-LD schema (rich results)", en: "FAQPage JSON-LD schema (rich results)" }, category: "marketing" },

  // ─── Business Operations ────────────────────────────────
  supportWidget:            { enabled: true,  label: { el: "3rd-party chat widget (Crisp/Tawk)", en: "3rd-party chat widget (Crisp/Tawk)" }, category: "business" },
  supportBubble:            { enabled: true,  label: { el: "Floating help bubble (fallback)", en: "Floating help bubble (fallback)" }, category: "business" },
  schoolInvoicing:          { enabled: true,  label: { el: "School / B2B invoicing (admin)", en: "School / B2B invoicing (admin)" }, category: "business" },
  onboardingEmails_day3:    { enabled: true,  label: { el: "Onboarding email Day 3", en: "Onboarding email Day 3" }, category: "business" },
  onboardingEmails_day7:    { enabled: true,  label: { el: "Onboarding email Day 7", en: "Onboarding email Day 7" }, category: "business" },

  // ─── Onboarding & Engagement ────────────────────────────
  welcomeQuest:             { enabled: true, label: { el: "Welcome Quest (interactive onboarding · μαθητές)", en: "Welcome Quest (interactive onboarding · students)" }, category: "onboarding" },
  roleOnboarding:           { enabled: true, label: { el: "Role Onboarding Tour (γονείς + δάσκαλοι)", en: "Role Onboarding Tour (parents + teachers)" }, category: "onboarding" },
  feedbackWidget:           { enabled: true, label: { el: "In-app Feedback Widget (floating)", en: "In-app Feedback Widget (floating)" }, category: "onboarding" },
  foundingMemberBadge:      { enabled: true, label: { el: "Founding Member Badge", en: "Founding Member Badge" }, category: "onboarding" },

  // ─── B2B & Plans ────────────────────────────────────────
  familyPlan_profiles:      { enabled: true, label: { el: "Family Plan · Πολλαπλά Child Profiles", en: "Family Plan · Multiple child profiles" }, category: "b2b" },
  schoolLicense:            { enabled: true, label: { el: "School License (B2B activation)", en: "School License (B2B activation)" }, category: "b2b" },
  schoolLicensePage:        { enabled: true, label: { el: "Σελίδα Activation Σχολείου", en: "School Activation page" }, category: "b2b" },

  // ─── Parental Controls ─────────────────────────────────
  timeManagement:           { enabled: true, label: { el: "Time Management Dashboard (γονικός έλεγχος)", en: "Time Management Dashboard (parental)" }, category: "parentalControls" },
  timeManagement_schedule:  { enabled: true, label: { el: "Schedule windows (ώρες χρήσης)", en: "Schedule windows" }, category: "parentalControls" },
  timeManagement_dailyCap:  { enabled: true, label: { el: "Ημερήσιο όριο λεπτών", en: "Daily minutes cap" }, category: "parentalControls" },

  // ─── Learning Engine ───────────────────────────────────
  srs:                      { enabled: true, label: { el: "Spaced Repetition (SRS)", en: "Spaced Repetition (SRS)" }, category: "learningEngine" },
  srsDashboard:             { enabled: true, label: { el: "SRS Dashboard widget", en: "SRS Dashboard widget" }, category: "learningEngine" },

  // ─── Multiplayer (new modes) ───────────────────────────
  friendChallenges:         { enabled: true, label: { el: "Friend Challenges (Async 1v1)", en: "Friend Challenges (Async 1v1)" }, category: "multiplayerNew" },
  liveClassroom:            { enabled: true, label: { el: "Live Classroom Mode (Kahoot-style)", en: "Live Classroom Mode (Kahoot-style)" }, category: "multiplayerNew" },
  ticTacToeOnline:          { enabled: true, label: { el: "Tic-Tac-Toe Online (Firestore)", en: "Tic-Tac-Toe Online (Firestore)" }, category: "multiplayerNew" },

  // ─── AI Tools (new) ────────────────────────────────────
  aiPhotoSolver:            { enabled: true, label: { el: "AI Math Photo Solver", en: "AI Math Photo Solver" }, category: "aiNew" },
  aiStoryGen:               { enabled: true, label: { el: "AI Story Generator", en: "AI Story Generator" }, category: "aiNew" },
  aiVoiceQuiz:              { enabled: true, label: { el: "Φωνητικό Quiz με AI", en: "AI Voice Quiz" }, category: "aiNew" },

  // ─── Homepage Sections (γενικές περιοχές της αρχικής) ─────────────────
  home_statsBar:            { enabled: true, label: { el: "📊 Stats Bar (350+ παιχνίδια κλπ)", en: "📊 Stats Bar (350+ games etc)" }, category: "homepage" },
  home_mission:             { enabled: true, label: { el: "🎯 Mission Banner", en: "🎯 Mission Banner" }, category: "homepage" },
  home_valuePillars:        { enabled: true, label: { el: "💎 Value Pillars (3 πυλώνες)", en: "💎 Value Pillars" }, category: "homepage" },
  home_useCases:            { enabled: true, label: { el: "🎯 Use Cases (περιπτώσεις χρήσης)", en: "🎯 Use Cases" }, category: "homepage" },
  home_categories:          { enabled: true, label: { el: "🎮 Ηλικιακές Ομάδες (carousel)", en: "🎮 Age Categories carousel" }, category: "homepage" },
  home_roleShowcase:        { enabled: true, label: { el: "👥 Role Showcase (Μαθητής/Γονιός/Δάσκαλος)", en: "👥 Role Showcase" }, category: "homepage" },
  home_howItWorks:          { enabled: true, label: { el: "❓ Πώς λειτουργεί (3 βήματα)", en: "❓ How it works (3 steps)" }, category: "homepage" },
  home_parentPeace:         { enabled: true, label: { el: "🛡️ Parent Peace of Mind", en: "🛡️ Parent Peace of Mind" }, category: "homepage" },
  home_startHereBanner:     { enabled: true, label: { el: "🚀 'Ξεκίνα εδώ!' banner (anonymous users)", en: "🚀 'Start Here!' banner (anonymous)" }, category: "homepage" },
  home_recommendations:     { enabled: true, label: { el: "💡 Συστάσεις παιχνιδιών (logged in)", en: "💡 Game recommendations (logged in)" }, category: "homepage" },
  home_dailyMissions:       { enabled: true, label: { el: "🎯 Ημερήσιες Αποστολές widget", en: "🎯 Daily Missions widget" }, category: "homepage" },
  home_petWidget:           { enabled: true, label: { el: "🐾 Pet Widget στην αρχική", en: "🐾 Pet Widget on home" }, category: "homepage" },
  home_dailyChallenge:      { enabled: true, label: { el: "⭐ Daily Challenge banner", en: "⭐ Daily Challenge banner" }, category: "homepage" },
  home_funZone:             { enabled: true, label: { el: "🎉 Fun Zone (Battle/Pet/Stories/Cards)", en: "🎉 Fun Zone" }, category: "homepage" },
  home_features:            { enabled: true, label: { el: "✨ Features Section", en: "✨ Features Section" }, category: "homepage" },
  home_gameShowcase:        { enabled: true, label: { el: "🖼️ Game Showcase carousel", en: "🖼️ Game Showcase carousel" }, category: "homepage" },
  home_milestones:          { enabled: true, label: { el: "🏆 Milestones Section", en: "🏆 Milestones Section" }, category: "homepage" },
  home_testimonials:        { enabled: true, label: { el: "💬 Testimonials (γνώμες χρηστών)", en: "💬 Testimonials" }, category: "homepage" },
  home_blogTips:            { enabled: true, label: { el: "📝 Blog Tips Section", en: "📝 Blog Tips Section" }, category: "homepage" },
  home_trustSignals:        { enabled: true, label: { el: "✅ Trust Signals (badges)", en: "✅ Trust Signals" }, category: "homepage" },
  home_pricing:             { enabled: true, label: { el: "💎 Pricing Section", en: "💎 Pricing Section" }, category: "homepage" },
  home_faq:                 { enabled: true, label: { el: "❓ FAQ Section", en: "❓ FAQ Section" }, category: "homepage" },
  home_tryFreeCta:          { enabled: true, label: { el: "🆓 Try Free CTA Section", en: "🆓 Try Free CTA Section" }, category: "homepage" },

  // ─── Header / Navbar UI elements ──────────────────────────
  navbar_search:            { enabled: true, label: { el: "🔍 Search button (header)", en: "🔍 Search button (header)" }, category: "uiHeader" },
  navbar_voiceCommand:      { enabled: true, label: { el: "🎤 Voice Command button (header)", en: "🎤 Voice Command button (header)" }, category: "uiHeader" },
  navbar_notifications:     { enabled: true, label: { el: "🔔 Notification Bell (header)", en: "🔔 Notification Bell (header)" }, category: "uiHeader" },
  navbar_themeToggle:       { enabled: true, label: { el: "🌙 Dark mode toggle (header)", en: "🌙 Dark mode toggle (header)" }, category: "uiHeader" },
  navbar_languageToggle:    { enabled: true, label: { el: "🌐 Language toggle (header)", en: "🌐 Language toggle (header)" }, category: "uiHeader" },
  navbar_xpBadge:           { enabled: true, label: { el: "⭐ XP Level Badge (header)", en: "⭐ XP Level Badge (header)" }, category: "uiHeader" },
  navbar_coinsBadge:        { enabled: true, label: { el: "🪙 Coins Badge (header)", en: "🪙 Coins Badge (header)" }, category: "uiHeader" },
  navbar_ageBadge:          { enabled: true, label: { el: "🎂 Age/Category Badge (header)", en: "🎂 Age/Category Badge (header)" }, category: "uiHeader" },
  navbar_taglinePill:       { enabled: true, label: { el: "🌟 Tagline pill δίπλα στο logo", en: "🌟 Tagline pill next to logo" }, category: "uiHeader" },

  // ─── Global UI Components (πάντα ορατά παντού) ────────────
  global_cookieConsent:     { enabled: true, label: { el: "🍪 Cookie Consent banner (απαιτείται για EU)", en: "🍪 Cookie Consent banner (EU required)" }, category: "uiGlobal" },
  global_installPrompt:     { enabled: true, label: { el: "📲 PWA Install Prompt", en: "📲 PWA Install Prompt" }, category: "uiGlobal" },
  global_swUpdateBanner:    { enabled: true, label: { el: "🔄 Service Worker Update banner", en: "🔄 Service Worker Update banner" }, category: "uiGlobal" },
  global_offlineBanner:     { enabled: true, label: { el: "📡 Offline Banner (όταν χάθηκε internet)", en: "📡 Offline Banner" }, category: "uiGlobal" },
  global_systemAnnouncement:{ enabled: true, label: { el: "📢 System Announcement banner", en: "📢 System Announcement banner" }, category: "uiGlobal" },
  global_milestoneListener: { enabled: true, label: { el: "🏆 Milestone Listener (auto popups)", en: "🏆 Milestone Listener" }, category: "uiGlobal" },
  global_timeLimitOverlay:  { enabled: true, label: { el: "⏱️ Time Limit Overlay (parental cap)", en: "⏱️ Time Limit Overlay (parental cap)" }, category: "uiGlobal" },

  // ─── Footer Sections ──────────────────────────────────────
  footer_links:             { enabled: true, label: { el: "🔗 Footer Links Section", en: "🔗 Footer Links Section" }, category: "uiFooter" },
  footer_socialIcons:       { enabled: true, label: { el: "📱 Footer Social Icons", en: "📱 Footer Social Icons" }, category: "uiFooter" },
  footer_legalLinks:        { enabled: true, label: { el: "📜 Footer Legal Links (Privacy/Terms/Cookies/DPA)", en: "📜 Footer Legal Links" }, category: "uiFooter" },
  footer_statusLink:        { enabled: true, label: { el: "🟢 Footer Status link", en: "🟢 Footer Status link" }, category: "uiFooter" },
  footer_rssLink:           { enabled: true, label: { el: "📡 Footer RSS link", en: "📡 Footer RSS link" }, category: "uiFooter" },
  footer_helpLink:          { enabled: true, label: { el: "💬 Footer Help Center link", en: "💬 Footer Help Center link" }, category: "uiFooter" },

  // ─── Help & Documentation ──────────────────────────────────
  helpCenter:               { enabled: true, label: { el: "💬 Κέντρο Βοήθειας (/help, /faq)", en: "💬 Help Center (/help, /faq)" }, category: "documentation" },
  helpCenter_search:        { enabled: true, label: { el: "🔍 Search στο Help Center", en: "🔍 Search in Help Center" }, category: "documentation" },
  helpCenter_categories:    { enabled: true, label: { el: "🏷️ Κατηγορίες/φίλτρα στο Help Center", en: "🏷️ Categories/filters in Help Center" }, category: "documentation" },
  helpCenter_contactCta:    { enabled: true, label: { el: "✉️ Contact CTA στο Help Center", en: "✉️ Contact CTA in Help Center" }, category: "documentation" },

  // ─── Admin Dashboard Tabs (αν θέλει admin να κρύψει tab) ───────────────
  adminTab_overview:        { enabled: true, label: { el: "📊 Tab · Επισκόπηση", en: "📊 Tab · Overview" }, category: "adminTabs" },
  adminTab_users:           { enabled: true, label: { el: "👥 Tab · Χρήστες", en: "👥 Tab · Users" }, category: "adminTabs" },
  adminTab_flags:           { enabled: true, label: { el: "🎛️ Tab · Feature Flags", en: "🎛️ Tab · Feature Flags" }, category: "adminTabs" },
  adminTab_premium:         { enabled: true, label: { el: "💎 Tab · Premium Content", en: "💎 Tab · Premium Content" }, category: "adminTabs" },
  adminTab_games:           { enabled: true, label: { el: "🎮 Tab · Παιχνίδια (per-game on/off)", en: "🎮 Tab · Games (per-game on/off)" }, category: "adminTabs" },
  adminTab_content:         { enabled: true, label: { el: "📝 Tab · Περιεχόμενο", en: "📝 Tab · Content" }, category: "adminTabs" },
  adminTab_moderation:      { enabled: true, label: { el: "🛡️ Tab · Moderation", en: "🛡️ Tab · Moderation" }, category: "adminTabs" },
  adminTab_subs:            { enabled: true, label: { el: "💰 Tab · Subscriptions", en: "💰 Tab · Subscriptions" }, category: "adminTabs" },
  adminTab_invoicing:       { enabled: true, label: { el: "💼 Tab · Invoicing (B2B)", en: "💼 Tab · Invoicing (B2B)" }, category: "adminTabs" },
  adminTab_analytics:       { enabled: true, label: { el: "📈 Tab · Analytics (A/B)", en: "📈 Tab · Analytics (A/B)" }, category: "adminTabs" },
  adminTab_system:          { enabled: true, label: { el: "⚙️ Tab · Σύστημα", en: "⚙️ Tab · System" }, category: "adminTabs" },
  adminTab_logs:            { enabled: true, label: { el: "📋 Tab · Logs", en: "📋 Tab · Logs" }, category: "adminTabs" },
  adminTab_errors:          { enabled: true, label: { el: "🐞 Tab · Σφάλματα (Sentry)", en: "🐞 Tab · Errors (Sentry)" }, category: "adminTabs" },
  adminTab_emails:          { enabled: true, label: { el: "📧 Tab · Email Queue", en: "📧 Tab · Email Queue" }, category: "adminTabs" },
  adminTab_push:            { enabled: true, label: { el: "🔔 Tab · Push Notifications", en: "🔔 Tab · Push Notifications" }, category: "adminTabs" },
  adminTab_feedback:        { enabled: true, label: { el: "💬 Tab · Γνώμες χρηστών", en: "💬 Tab · User Feedback" }, category: "adminTabs" },
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

  /**
   * Per-game enable check. Defaults to true (game is enabled) unless an admin
   * has explicitly disabled it via Firestore. Flag id pattern:
   *   game_<ageGroup>_<mode>_<gameId>     (matches gameItemId() in gamesCatalog)
   */
  isGameEnabled(ageGroup, mode, gameId) {
    if (!ageGroup || !mode || !gameId) return true;
    const id = `game_${ageGroup}_${mode}_${gameId}`;
    const cache = loadCache();
    if (Object.prototype.hasOwnProperty.call(cache, id)) {
      return cache[id] !== false;
    }
    return true;
  },

  /** Returns the raw boolean override (or undefined if no override set). */
  getGameOverride(ageGroup, mode, gameId) {
    const id = `game_${ageGroup}_${mode}_${gameId}`;
    const cache = loadCache();
    if (Object.prototype.hasOwnProperty.call(cache, id)) return cache[id] !== false;
    return undefined;
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
