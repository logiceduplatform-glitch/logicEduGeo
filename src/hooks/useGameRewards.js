import { useCallback, useEffect, useRef } from "react";
import { CoinService } from "../services/CoinService";
import { AnalyticsService } from "../services/AnalyticsService";
import { ProgressService } from "../services/ProgressService";

/**
 * Centralised rewards + analytics for the new mini-games batch.
 *
 * - Tracks `game_start` once on mount.
 * - Caps daily coin earnings per game so reward farming is impossible.
 * - Awards a small "first-play" bonus the first time a user plays a game.
 * - Emits `game_complete` and (optionally) `milestone` events.
 * - Unlocks generic achievements ("first_game", "explorer", "sampler", "completionist").
 *
 * Usage:
 *   const { award, complete } = useGameRewards("wordle", "classic");
 *   award(5);              // grants up to 5 coins (respecting daily cap)
 *   complete(score, total);// fires game_complete event
 */
const DAILY_CAP = 30;
const FIRST_PLAY_BONUS = 5;

const ACHIEVEMENTS = {
  FIRST_GAME: "first_new_game",      // played any new mini-game once
  SAMPLER:    "new_games_sampler",   // played 5 different new games
  EXPLORER:   "new_games_explorer",  // played 15 different new games
  COMPLETIONIST: "new_games_completionist", // played 30 different new games
};

function todayKey(gameId) {
  const today = new Date().toISOString().slice(0, 10);
  return `gameRewards:${gameId}:${today}`;
}

function totalsKey(gameId) {
  return `gameRewards:totals:${gameId}`;
}

const PLAYED_KEY = "gameRewards:played";

function readJson(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}

function writeJson(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage blocked */ }
}

function emitReward(amount, label) {
  if (typeof window === "undefined") return;
  try { window.dispatchEvent(new CustomEvent("kibloo:reward", { detail: { amount, label } })); } catch { /* */ }
}

export function useGameRewards(gameId, category = "game") {
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    AnalyticsService.gameStart(gameId, category);

    const totals = readJson(totalsKey(gameId), { plays: 0, firstPlayedAt: null });
    if (!totals.plays) {
      totals.firstPlayedAt = new Date().toISOString();
      try { CoinService.earn(FIRST_PLAY_BONUS); } catch { /* */ }
      emitReward(FIRST_PLAY_BONUS, "first play");
      AnalyticsService.milestone("first_play_" + gameId, FIRST_PLAY_BONUS);

      // Track number of unique games played (for sampler/explorer achievements).
      const played = readJson(PLAYED_KEY, []);
      if (!played.includes(gameId)) {
        played.push(gameId);
        writeJson(PLAYED_KEY, played);
        try {
          if (played.length === 1) ProgressService.unlockAchievement(ACHIEVEMENTS.FIRST_GAME);
          if (played.length === 5) ProgressService.unlockAchievement(ACHIEVEMENTS.SAMPLER);
          if (played.length === 15) ProgressService.unlockAchievement(ACHIEVEMENTS.EXPLORER);
          if (played.length === 30) ProgressService.unlockAchievement(ACHIEVEMENTS.COMPLETIONIST);
        } catch { /* */ }
      }
    }
    totals.plays = (totals.plays || 0) + 1;
    writeJson(totalsKey(gameId), totals);
  }, [gameId, category]);

  const award = useCallback((amount, label = "") => {
    if (!amount || amount <= 0) return 0;
    const dKey = todayKey(gameId);
    const earnedToday = readJson(dKey, 0);
    const remaining = Math.max(0, DAILY_CAP - earnedToday);
    const grant = Math.min(amount, remaining);
    if (grant > 0) {
      try { CoinService.earn(grant); } catch { /* */ }
      writeJson(dKey, earnedToday + grant);
      emitReward(grant, label);
    }
    return grant;
  }, [gameId]);

  const complete = useCallback((score = null, total = null) => {
    AnalyticsService.gameComplete(gameId, score, total);
  }, [gameId]);

  const milestone = useCallback((name, value = null) => {
    AnalyticsService.milestone(`${gameId}_${name}`, value);
  }, [gameId]);

  return { award, complete, milestone };
}

export default useGameRewards;
