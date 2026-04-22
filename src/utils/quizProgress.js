// src/utils/quizProgress.js

/**
 * Καταχωρεί την πρόοδο του χρήστη σε ένα quiz.
 * @param {string} title - Τίτλος του quiz
 * @param {number} index - Τρέχουσα θέση στην ερώτηση
 * @param {number} length - Συνολικός αριθμός ερωτήσεων
 * @param {boolean} correct - Αν η απάντηση ήταν σωστή
 */
export function updateProgress(title, index, length, correct) {
  if (!title) return;

  // --- Προσωρινή πρόοδος ανά quiz ---
  const progressKey = `progress:${title}`;
  const progress = { index, length };
  localStorage.setItem(progressKey, JSON.stringify(progress));

  // --- Τελευταίο quiz ---
  localStorage.setItem("geo:progress:recent", JSON.stringify({ title }));

  // --- Quiz stats ---
  const rawStats = localStorage.getItem("geo:quizStats");
  let stats = {
    totalAttempts: 0,
    totalCorrect: 0,
    streak: 0,
    weekly: Array(7).fill(false),
    monthCorrectByKey: {}
  };
  if (rawStats) {
    try {
      stats = { ...stats, ...JSON.parse(rawStats) };
    } catch {}
  }

  // --- Ενημέρωση total attempts και correct ---
  stats.totalAttempts += 1;
  if (correct) stats.totalCorrect += 1;

  // --- Ημερομηνία για week & month ---
  const now = new Date();
  const dayIdx = now.getDay(); // Κυριακή = 0, Δευτέρα = 1 ...
  const jsDay = (dayIdx + 6) % 7; // Μετατρέπουμε ώστε Δευτέρα = 0
  stats.weekly[jsDay] = correct;

  // --- Υπολογισμός streak ---
  let streak = 0;
  for (let i = 6; i >= 0; i--) {
    if (stats.weekly[i]) streak++;
    else break;
  }
  stats.streak = streak;

  // --- Month correct ---
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  stats.monthCorrectByKey[monthKey] = (stats.monthCorrectByKey[monthKey] || 0) + (correct ? 1 : 0);

  // --- Αποθήκευση ---
  localStorage.setItem("geo:quizStats", JSON.stringify(stats));
}
