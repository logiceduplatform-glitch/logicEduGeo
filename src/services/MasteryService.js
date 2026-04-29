// Tracks per-subject performance for mastery heatmap.
// Each subject has: { correct, total, lastUpdated }

const KEY = "geo:mastery";

const SUBJECTS_DEFAULTS = [
  { id: "math",      el: "Μαθηματικά",  en: "Math",      icon: "🧮" },
  { id: "language",  el: "Γλώσσα",      en: "Language",  icon: "📖" },
  { id: "science",   el: "Επιστήμη",    en: "Science",   icon: "🔬" },
  { id: "history",   el: "Ιστορία",     en: "History",   icon: "📜" },
  { id: "geography", el: "Γεωγραφία",   en: "Geography", icon: "🌍" },
  { id: "art",       el: "Τέχνες",      en: "Arts",      icon: "🎨" },
  { id: "logic",     el: "Λογική",      en: "Logic",     icon: "🧩" },
  { id: "music",     el: "Μουσική",     en: "Music",     icon: "🎵" },
  { id: "memory",    el: "Μνήμη",       en: "Memory",    icon: "🧠" },
  { id: "animals",   el: "Ζώα & Φύση",  en: "Animals",   icon: "🐾" },
  { id: "general",   el: "Γενικά",      en: "General",   icon: "✨" },
  { id: "classroom", el: "Τάξη",        en: "Classroom", icon: "🏫" },
];

function load() {
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
}
function save(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {}
}

export const MasteryService = {
  SUBJECTS: SUBJECTS_DEFAULTS,

  record(subjectId, isCorrect) {
    const id = subjectId || "general";
    const data = load();
    if (!data[id]) data[id] = { correct: 0, total: 0, lastUpdated: 0 };
    data[id].total += 1;
    if (isCorrect) data[id].correct += 1;
    data[id].lastUpdated = Date.now();
    save(data);
  },

  getAll() {
    const data = load();
    return SUBJECTS_DEFAULTS.map(s => {
      const stat = data[s.id] || { correct: 0, total: 0, lastUpdated: 0 };
      const accuracy = stat.total > 0 ? stat.correct / stat.total : 0;
      return {
        ...s,
        ...stat,
        accuracy,
        level: getLevel(accuracy, stat.total),
      };
    });
  },

  reset() { save({}); },
};

// Mastery level: 0 (not started), 1 (learning), 2 (developing), 3 (proficient), 4 (master)
function getLevel(accuracy, total) {
  if (total < 3) return 0;
  if (total < 8) return accuracy >= 0.6 ? 1 : 1;
  if (accuracy >= 0.9) return 4;
  if (accuracy >= 0.75) return 3;
  if (accuracy >= 0.5) return 2;
  return 1;
}
