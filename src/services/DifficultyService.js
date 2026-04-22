import { ProgressService } from "./ProgressService";

const ADVANCE_THRESHOLD = 0.8;
const DECREASE_THRESHOLD = 0.5;
const CONSECUTIVE_TO_ADVANCE = 3;
const CONSECUTIVE_TO_DECREASE = 2;
const MIN_LEVEL = 1;
const MAX_LEVEL = 5;

export const DifficultyService = {
  getDifficulty(gameId) {
    return ProgressService.getDifficulty(gameId);
  },

  /**
   * Evaluate recent history and adjust difficulty automatically.
   * Call after each game completion.
   * Returns { newLevel, changed, direction }.
   */
  evaluate(gameId) {
    const { history, currentDifficulty } = ProgressService.getGameProgress(gameId);
    if (!history || history.length === 0) {
      return { newLevel: currentDifficulty, changed: false, direction: null };
    }

    const recentAtCurrentLevel = history
      .filter((h) => h.difficulty === currentDifficulty)
      .slice(-CONSECUTIVE_TO_ADVANCE);

    if (recentAtCurrentLevel.length >= CONSECUTIVE_TO_ADVANCE) {
      const allAbove = recentAtCurrentLevel.every(
        (h) => h.total > 0 && h.score / h.total >= ADVANCE_THRESHOLD
      );
      if (allAbove && currentDifficulty < MAX_LEVEL) {
        const newLevel = currentDifficulty + 1;
        ProgressService.setDifficulty(gameId, newLevel);
        return { newLevel, changed: true, direction: "up" };
      }
    }

    const recentForDecrease = history
      .filter((h) => h.difficulty === currentDifficulty)
      .slice(-CONSECUTIVE_TO_DECREASE);

    if (recentForDecrease.length >= CONSECUTIVE_TO_DECREASE) {
      const allBelow = recentForDecrease.every(
        (h) => h.total > 0 && h.score / h.total < DECREASE_THRESHOLD
      );
      if (allBelow && currentDifficulty > MIN_LEVEL) {
        const newLevel = currentDifficulty - 1;
        ProgressService.setDifficulty(gameId, newLevel);
        return { newLevel, changed: true, direction: "down" };
      }
    }

    return { newLevel: currentDifficulty, changed: false, direction: null };
  },

  /**
   * Maps difficulty level (1-5) to game-type-specific parameters.
   */
  getParams(gameType, level) {
    const params = DIFFICULTY_PARAMS[gameType];
    if (!params) return params?.["default"]?.[level] || DEFAULT_PARAMS[level];
    return params[level] || DEFAULT_PARAMS[level];
  },
};

const DEFAULT_PARAMS = {
  1: { timeLimit: 30, itemCount: 3, complexity: "easy" },
  2: { timeLimit: 25, itemCount: 4, complexity: "easy" },
  3: { timeLimit: 20, itemCount: 5, complexity: "medium" },
  4: { timeLimit: 15, itemCount: 6, complexity: "hard" },
  5: { timeLimit: 10, itemCount: 8, complexity: "hard" },
};

const DIFFICULTY_PARAMS = {
  timer: {
    1: { timeLimit: 30, speedMultiplier: 1.0 },
    2: { timeLimit: 25, speedMultiplier: 1.2 },
    3: { timeLimit: 20, speedMultiplier: 1.5 },
    4: { timeLimit: 15, speedMultiplier: 1.8 },
    5: { timeLimit: 10, speedMultiplier: 2.0 },
  },
  memory: {
    1: { pairCount: 3, revealTime: 3000 },
    2: { pairCount: 4, revealTime: 2500 },
    3: { pairCount: 6, revealTime: 2000 },
    4: { pairCount: 8, revealTime: 1500 },
    5: { pairCount: 10, revealTime: 1000 },
  },
  math: {
    1: { maxNumber: 10, operations: ["+"] },
    2: { maxNumber: 20, operations: ["+", "-"] },
    3: { maxNumber: 50, operations: ["+", "-"] },
    4: { maxNumber: 100, operations: ["+", "-", "*"] },
    5: { maxNumber: 100, operations: ["+", "-", "*", "/"] },
  },
  language: {
    1: { maxWordLength: 4, hintLevel: "full" },
    2: { maxWordLength: 5, hintLevel: "partial" },
    3: { maxWordLength: 6, hintLevel: "minimal" },
    4: { maxWordLength: 8, hintLevel: "none" },
    5: { maxWordLength: 10, hintLevel: "none" },
  },
};
