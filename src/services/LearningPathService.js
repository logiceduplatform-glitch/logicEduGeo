// Personalized Learning Path AI.
// Analyzes user's game performance, identifies strong & weak topics,
// and proposes a custom step-by-step learning path with goals & milestones.

import { ProgressService } from "./ProgressService";
import { AIService } from "./AIService";

const KEY_PATH = "geo:learning-path";
const KEY_PREFS = "geo:learning-prefs";

// Maps gameId prefixes / categories → topic taxonomy.
// Keep simple: derive topic from the first segment of the gameId or game category.
function inferTopic(gameId, category) {
  const id = (gameId || "").toLowerCase();
  if (id.includes("math") || id.includes("count") || id.includes("number") || id.includes("arith")) return "math";
  if (id.includes("read") || id.includes("alphabet") || id.includes("letter") || id.includes("spell") || id.includes("phon")) return "language";
  if (id.includes("science") || id.includes("nature") || id.includes("body") || id.includes("space") || id.includes("animal")) return "science";
  if (id.includes("hist") || id.includes("greek-myth") || id.includes("byz")) return "history";
  if (id.includes("art") || id.includes("draw") || id.includes("color")) return "art";
  if (id.includes("music") || id.includes("sound") || id.includes("rhythm")) return "music";
  if (id.includes("logic") || id.includes("puzzle") || id.includes("memory") || id.includes("brain")) return "logic";
  if (id.includes("emot") || id.includes("social") || id.includes("life-skill")) return "social";
  if (category) {
    const c = category.toLowerCase();
    if (c.includes("math")) return "math";
    if (c.includes("language") || c.includes("reading")) return "language";
    if (c.includes("science")) return "science";
    if (c.includes("history")) return "history";
    if (c.includes("art")) return "art";
    if (c.includes("logic") || c.includes("brain")) return "logic";
  }
  return "general";
}

const TOPIC_LABELS = {
  el: {
    math: "🧮 Μαθηματικά",
    language: "📖 Γλώσσα",
    science: "🔬 Επιστήμη",
    history: "🏛️ Ιστορία",
    art: "🎨 Τέχνη",
    music: "🎵 Μουσική",
    logic: "🧠 Λογική",
    social: "💬 Κοινωνικές δεξιότητες",
    general: "🎯 Γενικά",
  },
  en: {
    math: "🧮 Math",
    language: "📖 Language",
    science: "🔬 Science",
    history: "🏛️ History",
    art: "🎨 Art",
    music: "🎵 Music",
    logic: "🧠 Logic",
    social: "💬 Social skills",
    general: "🎯 General",
  },
};

export const LearningPathService = {
  topicLabel(topic, lang = "el") {
    return (TOPIC_LABELS[lang] || TOPIC_LABELS.en)[topic] || topic;
  },

  /** Analyze user's progress and return per-topic stats. */
  analyzePerformance() {
    const all = ProgressService.getAllGameProgress();
    const byTopic = {};
    let totalGames = 0;

    for (const [key, p] of Object.entries(all || {})) {
      const gameId = key.replace("progress:game:", "");
      const topic = inferTopic(gameId, p?.category);
      const games = p?.gamesPlayed || 0;
      const correct = p?.totalCorrect || 0;
      const attempts = p?.totalAttempts || 0;
      if (!byTopic[topic]) byTopic[topic] = { topic, games: 0, correct: 0, attempts: 0, gameIds: [] };
      byTopic[topic].games += games;
      byTopic[topic].correct += correct;
      byTopic[topic].attempts += attempts;
      if (games > 0) byTopic[topic].gameIds.push(gameId);
      totalGames += games;
    }

    const topics = Object.values(byTopic).map((t) => ({
      ...t,
      accuracy: t.attempts > 0 ? Math.round((t.correct / t.attempts) * 100) : 0,
      proficiency: this._proficiencyLevel(t),
    }));

    topics.sort((a, b) => b.games - a.games);

    const weakest = topics
      .filter((t) => t.attempts >= 3)
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 3);

    const strongest = topics
      .filter((t) => t.attempts >= 3 && t.accuracy >= 70)
      .sort((a, b) => b.accuracy - a.accuracy)
      .slice(0, 3);

    return { topics, weakest, strongest, totalGames };
  },

  _proficiencyLevel(t) {
    if (t.attempts < 3) return "new"; // not enough data
    if (t.accuracy >= 90) return "mastered";
    if (t.accuracy >= 75) return "strong";
    if (t.accuracy >= 50) return "developing";
    return "needs-work";
  },

  /** Generate a personalized learning path (mix of AI + heuristics). */
  async generatePath({ ageGroup, lang = "el", goals = [] } = {}) {
    const perf = this.analyzePerformance();

    if (AIService.isConfigured && AIService.isConfigured()) {
      try {
        const reply = await AIService.generateLesson({
          topic: lang === "el" ? "Προσωπική διαδρομή μάθησης" : "Personal learning path",
          subject: "learning_path",
          ageGroup,
          difficulty: "medium",
          lang,
        });
        if (reply && reply.exercises) {
          return this._aiToPath(reply, perf, lang);
        }
      } catch {}
    }

    return this._heuristicPath(perf, ageGroup, lang, goals);
  },

  _aiToPath(reply, perf, lang) {
    const steps = (reply.exercises || []).slice(0, 8).map((title, i) => ({
      id: `ai_${i}`,
      title,
      description: reply.theory ? reply.theory.slice(0, 120) : "",
      topic: perf.weakest[0]?.topic || "general",
      goalGames: 3,
      done: false,
    }));
    return {
      generatedAt: Date.now(),
      title: reply.title || (lang === "el" ? "Η Διαδρομή Μάθησής σου" : "Your Learning Path"),
      summary: reply.theory || "",
      steps,
      analysis: perf,
    };
  },

  _heuristicPath(perf, ageGroup, lang, goals) {
    const isEl = lang === "el";
    const steps = [];

    // 1. Address weakest topics (1-3 steps)
    perf.weakest.forEach((t, i) => {
      steps.push({
        id: `weak_${t.topic}`,
        title: isEl
          ? `Δούλεψε στα: ${this.topicLabel(t.topic, lang)} (${t.accuracy}%)`
          : `Improve: ${this.topicLabel(t.topic, lang)} (${t.accuracy}%)`,
        description: isEl
          ? `Παίξε 5 παιχνίδια στην κατηγορία αυτή για να ανεβάσεις την ακρίβειά σου πάνω από 70%.`
          : `Play 5 games in this topic to push accuracy above 70%.`,
        topic: t.topic,
        goalGames: 5,
        done: false,
        priority: "high",
      });
    });

    // 2. Reinforce strengths (1-2 steps)
    perf.strongest.slice(0, 2).forEach((t) => {
      steps.push({
        id: `strong_${t.topic}`,
        title: isEl
          ? `Πάμε σε δυσκολότερο: ${this.topicLabel(t.topic, lang)}`
          : `Level up: ${this.topicLabel(t.topic, lang)}`,
        description: isEl
          ? `Είσαι δυνατός εδώ! Δοκίμασε δυσκολότερες ασκήσεις για να γίνεις master.`
          : `You're strong here! Try harder challenges to master it.`,
        topic: t.topic,
        goalGames: 3,
        done: false,
        priority: "medium",
      });
    });

    // 3. Daily streak goal
    steps.push({
      id: "streak_7",
      title: isEl ? "🔥 Φτιάξε σερί 7 ημερών" : "🔥 Build a 7-day streak",
      description: isEl
        ? "Παίξε τουλάχιστον ένα παιχνίδι την ημέρα για 7 συνεχόμενες μέρες."
        : "Play at least one game per day for 7 days in a row.",
      topic: "general",
      goalGames: 7,
      done: false,
      priority: "medium",
    });

    // 4. Variety
    if (perf.topics.length < 4) {
      steps.push({
        id: "variety",
        title: isEl ? "🌈 Δοκίμασε νέα θέματα" : "🌈 Try new topics",
        description: isEl
          ? "Εξερεύνησε τουλάχιστον 3 διαφορετικές κατηγορίες παιχνιδιών."
          : "Explore at least 3 different game categories.",
        topic: "general",
        goalGames: 3,
        done: false,
        priority: "low",
      });
    }

    // 5. Custom goals
    goals.forEach((g, i) => {
      steps.push({
        id: `goal_${i}`,
        title: g,
        description: isEl ? "Προσωπικός στόχος" : "Personal goal",
        topic: "general",
        goalGames: 1,
        done: false,
        priority: "high",
        custom: true,
      });
    });

    if (steps.length === 0) {
      steps.push({
        id: "start_anywhere",
        title: isEl ? "Ξεκίνα τη μάθηση!" : "Start learning!",
        description: isEl
          ? "Παίξε τα πρώτα σου 5 παιχνίδια ώστε να φτιάξουμε εξατομικευμένη διαδρομή."
          : "Play your first 5 games so we can build a personalized path.",
        topic: "general",
        goalGames: 5,
        done: false,
        priority: "high",
      });
    }

    return {
      generatedAt: Date.now(),
      title: isEl ? "🎯 Η Προσωπική σου Διαδρομή" : "🎯 Your Personal Path",
      summary: isEl
        ? `Με βάση ${perf.totalGames} παιχνίδια που έχεις παίξει, αυτή η διαδρομή θα σε βοηθήσει να βελτιωθείς εκεί που το χρειάζεσαι.`
        : `Based on ${perf.totalGames} games you've played, this path helps you grow where it matters.`,
      steps,
      analysis: perf,
    };
  },

  /** Save/load current path. */
  savePath(path) {
    try { localStorage.setItem(KEY_PATH, JSON.stringify(path)); } catch {}
  },

  loadPath() {
    try {
      const s = localStorage.getItem(KEY_PATH);
      if (s) return JSON.parse(s);
    } catch {}
    return null;
  },

  clearPath() {
    try { localStorage.removeItem(KEY_PATH); } catch {}
  },

  toggleStepDone(stepId) {
    const path = this.loadPath();
    if (!path) return;
    const step = path.steps.find((s) => s.id === stepId);
    if (step) {
      step.done = !step.done;
      this.savePath(path);
    }
    return path;
  },

  /** Auto-update step progress based on actual game plays. */
  updateProgressFromStats() {
    const path = this.loadPath();
    if (!path) return null;
    const perf = this.analyzePerformance();
    let changed = false;
    for (const step of path.steps) {
      if (step.done) continue;
      const t = perf.topics.find((x) => x.topic === step.topic);
      if (!t) continue;
      // Step considered done when goalGames is met in that topic
      if (t.games >= (step.goalGames || 3) && t.accuracy >= 60) {
        step.done = true;
        changed = true;
      }
    }
    if (changed) this.savePath(path);
    return path;
  },

  // Preferences
  getPrefs() {
    try { return JSON.parse(localStorage.getItem(KEY_PREFS) || "{}"); } catch { return {}; }
  },
  setPrefs(prefs) {
    try { localStorage.setItem(KEY_PREFS, JSON.stringify(prefs)); } catch {}
  },
};
