// Spaced Repetition Service
// Tracks wrong-answer questions and schedules them for review at 1, 3, 7 days.
// Uses a simplified Leitner system with 4 stages.

const KEY = "geo:srs";
const DAY = 24 * 60 * 60 * 1000;

// Schedule (days) per stage. Stage advances on correct answer, resets on wrong.
const STAGES = [1, 3, 7, 14];

function load() {
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
}
function save(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {}
}

function makeId(question, subject = "general") {
  // hash-like id from question text + subject (simple, stable)
  const txt = `${subject}::${(question || "").toLowerCase().trim()}`;
  let h = 0;
  for (let i = 0; i < txt.length; i++) h = (h * 31 + txt.charCodeAt(i)) | 0;
  return `q_${Math.abs(h)}`;
}

export const SpacedRepetitionService = {
  /**
   * Record a wrong answer. Adds question to review queue with stage=0 (review tomorrow).
   * @param {object} item - { question, options, correct, explanation, subject, source }
   */
  recordWrong(item) {
    if (!item || !item.question) return;
    const data = load();
    const id = makeId(item.question, item.subject);
    const existing = data[id];
    const now = Date.now();
    data[id] = {
      id,
      question: item.question,
      options: item.options || [],
      correct: item.correct,
      explanation: item.explanation || "",
      subject: item.subject || "general",
      source: item.source || "",
      stage: 0,
      lastSeen: now,
      nextReview: now + STAGES[0] * DAY,
      wrongCount: (existing?.wrongCount || 0) + 1,
      addedAt: existing?.addedAt || now,
    };
    save(data);
  },

  /**
   * Record a correct answer for a tracked question. Advances stage; removes if mastered.
   */
  recordCorrect(question, subject = "general") {
    const id = makeId(question, subject);
    const data = load();
    const item = data[id];
    if (!item) return;
    const newStage = item.stage + 1;
    if (newStage >= STAGES.length) {
      delete data[id];
    } else {
      item.stage = newStage;
      item.lastSeen = Date.now();
      item.nextReview = Date.now() + STAGES[newStage] * DAY;
    }
    save(data);
  },

  getAll() {
    const data = load();
    return Object.values(data);
  },

  /**
   * Get questions due for review now.
   */
  getDue() {
    const now = Date.now();
    return this.getAll().filter(it => it.nextReview <= now);
  },

  getDueCount() {
    return this.getDue().length;
  },

  /**
   * Stats by subject for mastery heatmap.
   */
  getBySubject() {
    const map = {};
    for (const it of this.getAll()) {
      const s = it.subject || "general";
      if (!map[s]) map[s] = { subject: s, total: 0, mastered: 0, wrongCount: 0, due: 0 };
      map[s].total++;
      map[s].wrongCount += it.wrongCount || 0;
      if (it.stage >= STAGES.length - 1) map[s].mastered++;
      if (it.nextReview <= Date.now()) map[s].due++;
    }
    return Object.values(map);
  },

  remove(id) {
    const data = load();
    delete data[id];
    save(data);
  },

  clear() {
    save({});
  },

  STAGES,
};
