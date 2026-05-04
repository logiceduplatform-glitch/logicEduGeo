import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import { ProgressService } from "../services/ProgressService";
import { StorageService } from "../services/StorageService";

const ProgressContext = createContext(null);

function ensureScope() {
  if (StorageService.getScope()) return;
  const activeId = localStorage.getItem("geo:activeProfileId");
  if (activeId) {
    StorageService.setScope(activeId);
  }
}

export function ProgressProvider({ children }) {
  const [version, setVersion] = useState(() => {
    ensureScope();
    return 0;
  });
  const bump = useCallback(() => setVersion((v) => v + 1), []);

  const recordGameComplete = useCallback((data) => {
    const result = ProgressService.recordGameComplete(data);
    bump();
    window.dispatchEvent(new CustomEvent("progressUpdate", { detail: data }));
    // Welcome Quest hook: mark "play_one" the first time any game completes.
    try {
      import("../components/WelcomeQuest").then((m) => m.completeQuest && m.completeQuest("play_one"));
    } catch { /* no-op */ }
    // SRS hook: log the result against the game/topic id so we can review it later.
    try {
      import("../services/SRSService").then((m) => {
        const cardId = data?.cardId || data?.gameId || data?.topic;
        if (cardId && m.SRSService) {
          m.SRSService.logQuizResult({
            cardId: String(cardId),
            correct: data?.correct !== false && (data?.score == null || data.score > 0),
            timeMs: data?.timeMs || 0,
          });
        }
      });
    } catch { /* no-op */ }
    return result;
  }, [bump]);

  const updateInProgress = useCallback(({ title, index, length, score, categoryId }) => {
    ProgressService.setInProgressGame({ title, index, length, score, categoryId });
    bump();
    window.dispatchEvent(
      new CustomEvent("quizProgress", {
        detail: { title, score, total: length, index, categoryId },
      })
    );
  }, [bump]);

  const setDifficulty = useCallback((gameId, level) => {
    ProgressService.setDifficulty(gameId, level);
    bump();
  }, [bump]);

  const unlockAchievement = useCallback((id) => {
    ProgressService.unlockAchievement(id);
    bump();
  }, [bump]);

  const switchProfile = useCallback((profileId) => {
    StorageService.setScope(profileId);
    bump();
  }, [bump]);

  const value = useMemo(() => ({
    version,
    recordGameComplete,
    updateInProgress,
    setDifficulty,
    unlockAchievement,
    switchProfile,
    getGameProgress: ProgressService.getGameProgress.bind(ProgressService),
    getRecentGame: ProgressService.getRecentGame.bind(ProgressService),
    getInProgressGame: ProgressService.getInProgressGame.bind(ProgressService),
    getDailyStats: ProgressService.getDailyStats.bind(ProgressService),
    getMonthlyStats: ProgressService.getMonthlyStats.bind(ProgressService),
    getStreak: ProgressService.getStreak.bind(ProgressService),
    getWeeklyGrid: ProgressService.getWeeklyGrid.bind(ProgressService),
    getOverallStats: ProgressService.getOverallStats.bind(ProgressService),
    getUnlockedAchievements: ProgressService.getUnlockedAchievements.bind(ProgressService),
    getAllGameProgress: ProgressService.getAllGameProgress.bind(ProgressService),
    getDailyStatsRange: ProgressService.getDailyStatsRange.bind(ProgressService),
    getDifficulty: ProgressService.getDifficulty.bind(ProgressService),
    getXP: ProgressService.getXP.bind(ProgressService),
    getXPProgress: ProgressService.getXPProgress.bind(ProgressService),
  }), [version, recordGameComplete, updateInProgress, setDifficulty, unlockAchievement, switchProfile]);

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider");
  return ctx;
}

export { ProgressContext };
