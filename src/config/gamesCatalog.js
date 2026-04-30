// Flat catalog of every individual game in the platform, used for granular
// per-game admin control (Premium / Free) and feature gating.
//
// Each entry: { ageGroup, mode, categoryId, gameId, label, icon }
//   - ageGroup: "2_3" | "4_5" | "6" | "7_8" | "9_10" | "11_12" | "adult"
//   - mode    : "school" | "fun" | "logic" | "brain" | "board"
//   - categoryId: optional sub-category inside a mode (e.g. "puzzleGames")
//
// Premium item id format used for both PremiumContentService & FeatureFlag:
//   game_<ageGroup>_<mode>_<gameId>
//
// IMPORTANT: We pull from existing game-config files so this stays in-sync.

import { getGameCategories } from "./funGameConfig";
import {
  SCHOOL_2_3_GAMES,
  FUN_2_3_GAMES,
  LOGIC_2_3_GAMES,
  LOGIC_4_5_GAMES,
} from "./localGamesConfig";
import { ADULT_GAME_CATEGORIES } from "./adultGameConfig";

/** ID helper. Stable. */
export function gameItemId(ageGroup, mode, gameId) {
  return `game_${ageGroup}_${mode}_${gameId}`;
}

/** Build the full catalog. Memoised. */
let _catalog = null;
export function getGamesCatalog() {
  if (_catalog) return _catalog;
  const out = [];

  // ── Age 2-3 (manual lists in localGamesConfig)
  for (const g of SCHOOL_2_3_GAMES) {
    out.push({ ageGroup: "2_3", mode: "school", categoryId: "school", gameId: g.id, label: g.title, icon: g.icon });
  }
  for (const g of FUN_2_3_GAMES) {
    out.push({ ageGroup: "2_3", mode: "fun", categoryId: "fun", gameId: g.id, label: g.title, icon: g.icon });
  }
  for (const g of LOGIC_2_3_GAMES) {
    out.push({ ageGroup: "2_3", mode: "logic", categoryId: "logic", gameId: g.id, label: g.title, icon: g.icon });
  }

  // ── Age 4-5 logic (extra hardcoded list)
  for (const g of LOGIC_4_5_GAMES) {
    out.push({ ageGroup: "4_5", mode: "logic", categoryId: "logic", gameId: g.id, label: g.title, icon: g.icon });
  }

  // ── Ages 4-5, 6, 7-8, 9-10, 11-12 (resolved via getGameCategories)
  const AGES = [
    { key: "4_5",   src: "4-5" },
    { key: "6",     src: "6"   },
    { key: "7_8",   src: "7-8" },
    { key: "9_10",  src: "9-10"},
    { key: "11_12", src: "11-12" },
  ];
  for (const a of AGES) {
    for (const mode of ["fun", "logic"]) {
      let cats;
      try { cats = getGameCategories(a.src, mode); } catch { cats = null; }
      if (!cats) continue;
      for (const [catId, games] of Object.entries(cats)) {
        for (const g of games) {
          if (!g?.id) continue;
          out.push({
            ageGroup: a.key,
            mode,
            categoryId: catId,
            gameId: g.id,
            label: g.title,
            icon: g.icon,
          });
        }
      }
    }
  }

  // ── Adults: brain / fun / logic (from ADULT_GAME_CATEGORIES) + board games
  // Map adult category id → mode:
  const adultModeMap = { brainTraining: "brain", funGames: "fun", logicThinking: "logic" };
  for (const cat of ADULT_GAME_CATEGORIES || []) {
    const mode = adultModeMap[cat.id];
    if (!mode) continue;
    for (const g of cat.games || []) {
      out.push({
        ageGroup: "adult",
        mode,
        categoryId: cat.id,
        gameId: g.id,
        label: g.title,
        icon: g.icon,
      });
    }
  }

  // Board games (separate page – kept under adult/board)
  const BOARD = [
    { id: "chess", icon: "♟️", title: { el: "Σκάκι", en: "Chess" } },
    { id: "go", icon: "⚫", title: { el: "Go", en: "Go" } },
    { id: "checkers", icon: "🔴", title: { el: "Ντάμα", en: "Checkers" } },
    { id: "othello", icon: "⚪", title: { el: "Όθελο", en: "Othello" } },
    { id: "backgammon", icon: "🎲", title: { el: "Τάβλι", en: "Backgammon" } },
    { id: "connect4", icon: "🟡", title: { el: "Σκορ 4", en: "Connect 4" } },
    { id: "mahjong", icon: "🀄", title: { el: "Mahjong", en: "Mahjong" } },
    { id: "stratego", icon: "⚔️", title: { el: "Stratego", en: "Stratego" } },
    { id: "battleship", icon: "🚢", title: { el: "Ναυμαχία", en: "Battleship" } },
    { id: "catan", icon: "🏝️", title: { el: "Catan", en: "Catan" } },
    { id: "ticket", icon: "🚂", title: { el: "Ticket to Ride", en: "Ticket to Ride" } },
    { id: "carcassonne", icon: "🏰", title: { el: "Carcassonne", en: "Carcassonne" } },
    { id: "pandemic", icon: "🦠", title: { el: "Pandemic", en: "Pandemic" } },
    { id: "trivial", icon: "🧩", title: { el: "Trivial Pursuit", en: "Trivial Pursuit" } },
    { id: "codenames", icon: "🕵️", title: { el: "Codenames", en: "Codenames" } },
    { id: "uno", icon: "🃏", title: { el: "UNO", en: "UNO" } },
    { id: "monopoly", icon: "🏦", title: { el: "Monopoly", en: "Monopoly" } },
    { id: "werewolf", icon: "🐺", title: { el: "Λυκάνθρωπος", en: "Werewolf" } },
  ];
  for (const g of BOARD) {
    out.push({ ageGroup: "adult", mode: "board", categoryId: "board", gameId: g.id, label: g.title, icon: g.icon });
  }

  // De-duplicate (same age+mode+gameId might appear in multiple sub-categories)
  const seen = new Set();
  _catalog = out.filter((e) => {
    const k = `${e.ageGroup}|${e.mode}|${e.gameId}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  return _catalog;
}

export const AGE_LABELS = {
  "2_3":   { el: "🐣 2-3 ετών",   en: "🐣 Age 2-3" },
  "4_5":   { el: "🧒 4-5 ετών",   en: "🧒 Age 4-5" },
  "6":     { el: "👦 6 ετών",     en: "👦 Age 6" },
  "7_8":   { el: "🎒 7-8 ετών",   en: "🎒 Age 7-8" },
  "9_10":  { el: "📚 9-10 ετών",  en: "📚 Age 9-10" },
  "11_12": { el: "🎓 11-12 ετών", en: "🎓 Age 11-12" },
  "adult": { el: "🍷 Ενήλικες",    en: "🍷 Adults" },
};

export const MODE_LABELS = {
  school: { el: "🏫 Σχολικά",    en: "🏫 School" },
  fun:    { el: "🎉 Διασκέδαση", en: "🎉 Fun" },
  logic:  { el: "🧠 Λογική",     en: "🧠 Logic" },
  brain:  { el: "🧠 Brain",      en: "🧠 Brain" },
  board:  { el: "♟️ Επιτραπέζια",en: "♟️ Board" },
};
