// Seasonal theme service. Auto-detects current season from date,
// allows manual override. Adds emoji confetti decorations across the app.

const KEY = "geo:seasonalTheme";
const MIGRATION_KEY = "geo:seasonalTheme:migration_v2";

// One-time migration: reset everyone to "none" since users found falling
// emoji animations annoying. Runs only once per browser.
function migrateOnce() {
  try {
    if (localStorage.getItem(MIGRATION_KEY)) return;
    localStorage.setItem(KEY, "none");
    localStorage.setItem(MIGRATION_KEY, "1");
  } catch {}
}

export const SEASONAL_THEMES = [
  {
    id: "none",
    icon: "🚫",
    name: { el: "Χωρίς διακόσμηση", en: "No decorations" },
    desc: { el: "Καθαρή εμφάνιση, χωρίς animations", en: "Clean look, no animations" },
    accent: null,
    decorations: [],
  },
  {
    id: "auto",
    icon: "✨",
    name: { el: "Αυτόματο (εποχιακό)", en: "Auto (seasonal)" },
    desc: { el: "Αυτόματη εποχή ανάλογα με την ημερομηνία", en: "Auto season based on date" },
    accent: null,
    decorations: [],
  },
  {
    id: "spring",
    icon: "🌸",
    name: { el: "Άνοιξη", en: "Spring" },
    desc: { el: "Λουλούδια & μέλισσες", en: "Flowers & bees" },
    accent: "#fb7185",
    decorations: ["🌸", "🌷", "🌼", "🐝", "🦋"],
  },
  {
    id: "summer",
    icon: "☀️",
    name: { el: "Καλοκαίρι", en: "Summer" },
    desc: { el: "Ήλιος, παραλία, διασκέδαση", en: "Sun, beach, fun" },
    accent: "#f59e0b",
    decorations: ["☀️", "🏖️", "🍦", "🌻", "🌊"],
  },
  {
    id: "autumn",
    icon: "🍂",
    name: { el: "Φθινόπωρο", en: "Autumn" },
    desc: { el: "Φύλλα & κολοκύθες", en: "Leaves & pumpkins" },
    accent: "#d97706",
    decorations: ["🍂", "🍁", "🎃", "🌰", "🍄"],
  },
  {
    id: "winter",
    icon: "❄️",
    name: { el: "Χειμώνας", en: "Winter" },
    desc: { el: "Χιόνι & ζεστασιά", en: "Snow & cozy" },
    accent: "#0ea5e9",
    decorations: ["❄️", "⛄", "☃️", "🧣", "🌨️"],
  },
  {
    id: "christmas",
    icon: "🎄",
    name: { el: "Χριστούγεννα", en: "Christmas" },
    desc: { el: "Χιόνι, δώρα & Άγιος Βασίλης", en: "Snow, gifts & Santa" },
    accent: "#dc2626",
    decorations: ["🎄", "🎁", "🎅", "❄️", "⛄", "🌟"],
  },
  {
    id: "halloween",
    icon: "🎃",
    name: { el: "Halloween", en: "Halloween" },
    desc: { el: "Φαντάσματα & μάγισσες", en: "Ghosts & witches" },
    accent: "#ea580c",
    decorations: ["🎃", "👻", "🦇", "🕷️", "🕸️", "🧙"],
  },
  {
    id: "carnival",
    icon: "🎭",
    name: { el: "Καρναβάλι", en: "Carnival" },
    desc: { el: "Μάσκες, σερπαντίνες & κομφετί", en: "Masks, streamers & confetti" },
    accent: "#a855f7",
    decorations: ["🎭", "🎉", "🎊", "🎪", "🤡", "🎈"],
  },
  {
    id: "easter",
    icon: "🐰",
    name: { el: "Πάσχα", en: "Easter" },
    desc: { el: "Λαγουδάκια & κόκκινα αυγά", en: "Bunnies & easter eggs" },
    accent: "#fb7185",
    decorations: ["🐰", "🥚", "🌷", "🐣", "🌸"],
  },
];

export function detectAutoTheme(date = new Date()) {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  // Christmas: Dec 1-31
  if (m === 12) return "christmas";
  // Halloween: Oct 15-31
  if (m === 10 && d >= 15) return "halloween";
  // Carnival: late Feb / early Mar (approx Feb 15 - Mar 14)
  if ((m === 2 && d >= 15) || (m === 3 && d <= 14)) return "carnival";
  // Easter season: approx Apr 1-30
  if (m === 4) return "easter";
  // Seasons (Northern hemisphere)
  if (m >= 3 && m <= 5) return "spring";
  if (m >= 6 && m <= 8) return "summer";
  if (m >= 9 && m <= 11) return "autumn";
  return "winter";
}

export const SeasonalThemeService = {
  get() {
    migrateOnce();
    try { return localStorage.getItem(KEY) || "none"; } catch { return "none"; }
  },
  set(themeId) {
    try { localStorage.setItem(KEY, themeId); } catch {}
    window.dispatchEvent(new CustomEvent("geo:seasonalThemeChange", { detail: themeId }));
  },
  getActive() {
    const stored = this.get();
    if (stored === "none") return SEASONAL_THEMES.find(t => t.id === "none");
    const id = stored === "auto" ? detectAutoTheme() : stored;
    return SEASONAL_THEMES.find(t => t.id === id) || SEASONAL_THEMES.find(t => t.id === "none");
  },
};
