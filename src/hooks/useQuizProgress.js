import { useState, useEffect, useCallback, useContext, useRef } from "react";
import { ProgressContext } from "../contexts/ProgressContext";

/**
 * Backward-compatible hook used by all game components.
 * When ProgressContext is available, delegates to it.
 * Falls back to standalone event-based behavior otherwise.
 *
 * Many games call completeQuiz on every correct answer instead of only
 * at the end. We debounce per gameId: buffer the latest call and flush
 * it after 3 seconds of inactivity, so only one record is saved per
 * play session with the best score/total seen.
 */
export function useQuizProgress() {
  const ctx = useContext(ProgressContext);
  const [progressData, setProgressData] = useState({});
  const debounceTimers = useRef({});
  const bestScores = useRef({});

  useEffect(() => {
    return () => {
      Object.values(debounceTimers.current).forEach(clearTimeout);
    };
  }, []);

  const updateProgress = useCallback(({ title, score, total, category, index, categoryId }) => {
    setProgressData((prev) => ({ ...prev, [title]: { score, total } }));

    if (ctx) {
      ctx.updateInProgress({ title, index: index || 0, length: total || 0, score: score || 0, categoryId });
    } else {
      window.dispatchEvent(
        new CustomEvent("quizProgress", {
          detail: { title, score, total, category, index },
        })
      );
    }
  }, [ctx]);

  const flushComplete = useCallback((title) => {
    const data = bestScores.current[title];
    if (!data) return;
    delete bestScores.current[title];
    delete debounceTimers.current[title];

    if (ctx) {
      ctx.recordGameComplete({
        gameId: title,
        title,
        score: data.score || 0,
        total: data.total || 0,
        category: data.category || "general",
      });
    } else {
      window.dispatchEvent(
        new CustomEvent("quizComplete", {
          detail: { title, score: data.score, total: data.total, category: data.category },
        })
      );
    }
  }, [ctx]);

  const completeQuiz = useCallback(({ title, score, total, category }) => {
    setProgressData((prev) => ({ ...prev, [title]: { score, total } }));

    const prev = bestScores.current[title];
    if (!prev || score > prev.score || total > prev.total) {
      bestScores.current[title] = { score: score || 0, total: total || 0, category };
    }

    if (debounceTimers.current[title]) {
      clearTimeout(debounceTimers.current[title]);
    }
    debounceTimers.current[title] = setTimeout(() => flushComplete(title), 3000);
  }, [flushComplete]);

  useEffect(() => {
    const handler = (e) => {
      const { title, score, total } = e.detail;
      setProgressData((prev) => ({ ...prev, [title]: { score, total } }));
    };
    window.addEventListener("quizProgress", handler);
    return () => window.removeEventListener("quizProgress", handler);
  }, []);

  const totalScore = Object.values(progressData).reduce((s, i) => s + (i.score || 0), 0);
  const totalPossible = Object.values(progressData).reduce((s, i) => s + (i.total || 0), 0);

  return { progressData, totalScore, totalPossible, updateProgress, completeQuiz };
}
