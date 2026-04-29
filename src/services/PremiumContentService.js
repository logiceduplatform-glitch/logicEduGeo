import { db } from "../auth/firebase";
import { collection, doc, getDocs, setDoc, deleteDoc } from "firebase/firestore";

// All gateable items. id => label/category.
// Categories: games (per age/objective) + features (key premium features).
export const PREMIUM_ITEMS = [
  // Games - per age/objective (matches FeatureFlagService game flag IDs)
  { id: "games_age_2_3_school",   label: { el: "🏫 Σχολικά · 2-3 ετών",    en: "🏫 School · Age 2-3" },    category: "games_age_2_3" },
  { id: "games_age_2_3_fun",      label: { el: "🎉 Διασκέδαση · 2-3 ετών",  en: "🎉 Fun · Age 2-3" },       category: "games_age_2_3" },
  { id: "games_age_2_3_logic",    label: { el: "🧠 Λογική · 2-3 ετών",      en: "🧠 Logic · Age 2-3" },     category: "games_age_2_3" },
  { id: "games_age_4_5_school",   label: { el: "🏫 Σχολικά · 4-5 ετών",    en: "🏫 School · Age 4-5" },    category: "games_age_4_5" },
  { id: "games_age_4_5_fun",      label: { el: "🎉 Διασκέδαση · 4-5 ετών",  en: "🎉 Fun · Age 4-5" },       category: "games_age_4_5" },
  { id: "games_age_4_5_logic",    label: { el: "🧠 Λογική · 4-5 ετών",      en: "🧠 Logic · Age 4-5" },     category: "games_age_4_5" },
  { id: "games_age_6_school",     label: { el: "🏫 Σχολικά · 6 ετών",      en: "🏫 School · Age 6" },      category: "games_age_6" },
  { id: "games_age_6_fun",        label: { el: "🎉 Διασκέδαση · 6 ετών",    en: "🎉 Fun · Age 6" },         category: "games_age_6" },
  { id: "games_age_6_logic",      label: { el: "🧠 Λογική · 6 ετών",        en: "🧠 Logic · Age 6" },       category: "games_age_6" },
  { id: "games_age_7_8_school",   label: { el: "🏫 Σχολικά · 7-8 ετών",    en: "🏫 School · Age 7-8" },    category: "games_age_7_8" },
  { id: "games_age_7_8_fun",      label: { el: "🎉 Διασκέδαση · 7-8 ετών",  en: "🎉 Fun · Age 7-8" },       category: "games_age_7_8" },
  { id: "games_age_7_8_logic",    label: { el: "🧠 Λογική · 7-8 ετών",      en: "🧠 Logic · Age 7-8" },     category: "games_age_7_8" },
  { id: "games_age_9_10_school",  label: { el: "🏫 Σχολικά · 9-10 ετών",   en: "🏫 School · Age 9-10" },   category: "games_age_9_10" },
  { id: "games_age_9_10_fun",     label: { el: "🎉 Διασκέδαση · 9-10 ετών", en: "🎉 Fun · Age 9-10" },      category: "games_age_9_10" },
  { id: "games_age_9_10_logic",   label: { el: "🧠 Λογική · 9-10 ετών",     en: "🧠 Logic · Age 9-10" },    category: "games_age_9_10" },
  { id: "games_age_11_12_school", label: { el: "🏫 Σχολικά · 11-12 ετών",  en: "🏫 School · Age 11-12" },  category: "games_age_11_12" },
  { id: "games_age_11_12_fun",    label: { el: "🎉 Διασκέδαση · 11-12 ετών",en: "🎉 Fun · Age 11-12" },     category: "games_age_11_12" },
  { id: "games_age_11_12_logic",  label: { el: "🧠 Λογική · 11-12 ετών",    en: "🧠 Logic · Age 11-12" },   category: "games_age_11_12" },
  { id: "games_age_adult_brain",  label: { el: "🧠 Brain · Ενήλικες",       en: "🧠 Brain · Adult" },        category: "games_age_adult" },
  { id: "games_age_adult_fun",    label: { el: "🎉 Fun · Ενήλικες",         en: "🎉 Fun · Adult" },          category: "games_age_adult" },
  { id: "games_age_adult_logic",  label: { el: "🧩 Logic · Ενήλικες",       en: "🧩 Logic · Adult" },        category: "games_age_adult" },
  { id: "games_age_adult_board",  label: { el: "♟️ Board · Ενήλικες",       en: "♟️ Board · Adult" },        category: "games_age_adult" },

  // Features
  { id: "feature_battleRoyale",   label: { el: "⚔️ Battle Royale",          en: "⚔️ Battle Royale" },        category: "features" },
  { id: "feature_speedrun",       label: { el: "⚡ Speedrun",                en: "⚡ Speedrun" },              category: "features" },
  { id: "feature_adventureMap",   label: { el: "🗺️ Adventure Map",          en: "🗺️ Adventure Map" },        category: "features" },
  { id: "feature_pet",            label: { el: "🐾 Pet System",             en: "🐾 Pet System" },           category: "features" },
  { id: "feature_cards",          label: { el: "🃏 Card Collection",        en: "🃏 Card Collection" },      category: "features" },
  { id: "feature_storyMode",      label: { el: "📖 Story Mode",             en: "📖 Story Mode" },           category: "features" },
  { id: "feature_aiTutor",        label: { el: "🤖 Study Buddy AI",         en: "🤖 Study Buddy AI" },       category: "features" },
  { id: "feature_masteryTracker", label: { el: "🔥 Mastery Tracker",        en: "🔥 Mastery Tracker" },      category: "features" },
  { id: "feature_trophyRoom",     label: { el: "🏆 Trophy Room",            en: "🏆 Trophy Room" },          category: "features" },
  { id: "feature_leaderboard",    label: { el: "🌍 Global Leaderboard",     en: "🌍 Global Leaderboard" },   category: "features" },
  { id: "feature_events",         label: { el: "🎉 Events & Tournaments",   en: "🎉 Events & Tournaments" }, category: "features" },
  { id: "feature_avatar",         label: { el: "🎭 Avatar Builder",         en: "🎭 Avatar Builder" },       category: "features" },
  { id: "feature_shop",           label: { el: "🛍️ Shop",                   en: "🛍️ Shop" },                 category: "features" },
  { id: "feature_dailyChallenge", label: { el: "🎯 Daily Challenge",        en: "🎯 Daily Challenge" },      category: "features" },

  // Teacher tools (could be premium for Family/School plan)
  { id: "feature_aiQuizGen",      label: { el: "🤖 AI Quiz Generator",      en: "🤖 AI Quiz Generator" },    category: "teacher" },
  { id: "feature_lessonPlans",    label: { el: "📋 Lesson Plans",           en: "📋 Lesson Plans" },         category: "teacher" },
  { id: "feature_classReports",   label: { el: "📊 Class Reports",          en: "📊 Class Reports" },        category: "teacher" },
  { id: "feature_coTeacher",      label: { el: "👥 Co-Teacher",             en: "👥 Co-Teacher" },           category: "teacher" },
  { id: "feature_liveQuiz",       label: { el: "🎮 Live Quiz",              en: "🎮 Live Quiz" },            category: "teacher" },

  // Parent tools
  { id: "feature_familyChallenge",label: { el: "👨‍👩‍👧 Family Challenge",   en: "👨‍👩‍👧 Family Challenge" },  category: "parent" },
  { id: "feature_weeklyDigest",   label: { el: "📧 Weekly Digest",          en: "📧 Weekly Digest" },        category: "parent" },
  { id: "feature_multiChild",     label: { el: "👨‍👩‍👧‍👦 Multi-Child",     en: "👨‍👩‍👧‍👦 Multi-Child" },    category: "parent" },
];

const CACHE_KEY = "geo:premiumContent";
const COLLECTION = "premiumContent";

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

export const PremiumContentService = {
  PREMIUM_ITEMS,

  /**
   * Synchronous check.
   * Returns true if the item id is premium-only.
   */
  isPremiumOnly(id) {
    const cache = loadCache();
    return cache[id] === true;
  },

  getAll() {
    return loadCache();
  },

  async init() {
    try {
      const snap = await getDocs(collection(db, COLLECTION));
      const data = {};
      snap.forEach((d) => { data[d.id] = !!d.data().premium; });
      saveCache(data);
    } catch (e) {
      // Use cache
    }
  },

  async setPremium(id, premium) {
    if (premium) {
      await setDoc(doc(db, COLLECTION, id), { premium: true, id, updatedAt: new Date() });
    } else {
      try { await deleteDoc(doc(db, COLLECTION, id)); } catch {}
    }
    const cache = { ...loadCache() };
    if (premium) cache[id] = true;
    else delete cache[id];
    saveCache(cache);
  },

  /**
   * Bulk set. items: array of ids. premium: true/false.
   */
  async setBulk(ids, premium) {
    for (const id of ids) {
      // eslint-disable-next-line no-await-in-loop
      await this.setPremium(id, premium);
    }
  },

  subscribe(cb) {
    _listeners.add(cb);
    return () => _listeners.delete(cb);
  },
};
