/**
 * Difficulty-adjusted parameters for all game types.
 * difficulty: 1-5 (1=easiest, 5=hardest)
 */

export function getTimingParams(difficulty = 3) {
  const d = Math.max(1, Math.min(5, difficulty));
  return {
    revealTime:    [4000, 3000, 2500, 2000, 1500][d - 1],
    wrongDelay:    [2000, 1800, 1500, 1200, 1000][d - 1],
    nextRoundDelay:[3000, 2800, 2500, 2200, 2000][d - 1],
    speakDelay:    500,
    popupDuration: 1000,
  };
}

export function getBlinkParams(difficulty = 3) {
  const d = Math.max(1, Math.min(5, difficulty));
  return {
    blinkInterval: [500, 400, 300, 220, 150][d - 1],
    startDelay:    [1500, 1200, 1000, 800, 600][d - 1],
  };
}

export function getMemoryParams(difficulty = 3) {
  const d = Math.max(1, Math.min(5, difficulty));
  return {
    pairCount:  [4, 5, 6, 8, 10][d - 1],
    revealTime: [3000, 2500, 2000, 1500, 1000][d - 1],
  };
}

export function getItemCountParams(difficulty = 3) {
  const d = Math.max(1, Math.min(5, difficulty));
  return {
    optionsCount: [2, 3, 3, 4, 5][d - 1],
    itemsPerRound: [3, 4, 5, 6, 7][d - 1],
    roundCount: [6, 8, 10, 12, 14][d - 1],
  };
}

export function getMazeParams(difficulty = 3) {
  const d = Math.max(1, Math.min(5, difficulty));
  return {
    wallCount:     [2, 3, 4, 5, 6][d - 1],
    gridComplexity:[3, 4, 5, 6, 7][d - 1],
  };
}

export function getFireParams(difficulty = 3) {
  const d = Math.max(1, Math.min(5, difficulty));
  return {
    fireRadius:  [8, 7, 5, 4, 3][d - 1],
    sizeMultiplier: [1.2, 1.1, 1.0, 0.9, 0.8][d - 1],
  };
}

export function getDifficultyLabel(difficulty, lang = "el") {
  const labels = {
    el: ["Πολύ Εύκολο", "Εύκολο", "Κανονικό", "Δύσκολο", "Πολύ Δύσκολο"],
    en: ["Very Easy", "Easy", "Normal", "Hard", "Very Hard"],
  };
  const d = Math.max(1, Math.min(5, difficulty));
  return (labels[lang] || labels.en)[d - 1];
}

export function getDifficultyColor(difficulty) {
  return [
    "text-green-500",
    "text-emerald-500",
    "text-blue-500",
    "text-orange-500",
    "text-red-500",
  ][Math.max(1, Math.min(5, difficulty)) - 1];
}

export function getDifficultyStars(difficulty) {
  return "★".repeat(Math.max(1, Math.min(5, difficulty))) + "☆".repeat(5 - Math.max(1, Math.min(5, difficulty)));
}
