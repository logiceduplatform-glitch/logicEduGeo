import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";
import { useGameRewards } from "../../hooks/useGameRewards";

/**
 * Memory Pairs — flip cards in pairs and match them all.
 * 4×3 grid (6 pairs) for easy, 4×4 (8 pairs) for medium, 6×4 (12 pairs) for hard.
 */

const STORAGE_BEST = "kibloo:memorypairs:bestMoves";

const T = {
  el: {
    title: "Memory Pairs",
    desc: "Γύρισε τις κάρτες σε ζευγάρια. Βρες όλα τα ίδια!",
    moves: "Κινήσεις",
    matched: "Ταίριαξαν",
    best: "Καλύτερο",
    restart: "Νέο",
    win: "Νίκησες! 🎉",
    pair: "ζευγάρια",
    difficulty: "Δυσκολία",
    easy: "Εύκολο (6 ζεύγη)",
    medium: "Μεσαίο (8)",
    hard: "Δύσκολο (12)",
    timer: "Χρόνος",
  },
  en: {
    title: "Memory Pairs",
    desc: "Flip cards in pairs. Match them all!",
    moves: "Moves",
    matched: "Matched",
    best: "Best",
    restart: "New",
    win: "You won! 🎉",
    pair: "pairs",
    difficulty: "Difficulty",
    easy: "Easy (6 pairs)",
    medium: "Medium (8)",
    hard: "Hard (12)",
    timer: "Time",
  },
};

const ALL_EMOJIS = ["🐶","🐱","🦁","🐼","🦊","🐸","🐵","🐨","🦄","🐙","🦋","🐢","🐝","🦉","🦒","🐬","🐧","🐰","🦓","🦔","🐯","🦘","🐹","🐮"];

const DIFFICULTY = {
  easy:   { pairs: 6,  cols: 3 },
  medium: { pairs: 8,  cols: 4 },
  hard:   { pairs: 12, cols: 4 },
};

function buildDeck(pairs) {
  const chosen = [...ALL_EMOJIS].sort(() => Math.random() - 0.5).slice(0, pairs);
  const deck = [...chosen, ...chosen]
    .map((emoji, idx) => ({ id: idx, emoji, flipped: false, matched: false }))
    .sort(() => Math.random() - 0.5);
  return deck;
}

function fmtTime(s) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

export default function MemoryPairsPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;
  const rewards = useGameRewards("memorypairs");

  const [difficulty, setDifficulty] = useState("medium");
  const cfg = DIFFICULTY[difficulty];
  const [deck, setDeck] = useState(() => buildDeck(cfg.pairs));
  const [opened, setOpened] = useState([]); // ids currently face-up (max 2)
  const [moves, setMoves] = useState(0);
  const [matched, setMatched] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [best, setBest] = useState(() => {
    const raw = JSON.parse(localStorage.getItem(STORAGE_BEST) || "{}");
    return raw[difficulty] || null;
  });
  const lockRef = useRef(false);
  const startedAt = useRef(Date.now());

  const won = matched === cfg.pairs;

  // Refresh best when difficulty changes
  useEffect(() => {
    const raw = JSON.parse(localStorage.getItem(STORAGE_BEST) || "{}");
    setBest(raw[difficulty] || null);
  }, [difficulty]);

  // Tick seconds (paused on win)
  useEffect(() => {
    if (won) return;
    const t = setInterval(() => setSeconds(Math.floor((Date.now() - startedAt.current) / 1000)), 1000);
    return () => clearInterval(t);
  }, [won]);

  // On win: best & rewards
  useEffect(() => {
    if (!won) return;
    rewards.complete(100, 100);
    rewards.award(Math.min(20, Math.max(5, 30 - moves)), "Memory pairs solved");
    if (best === null || moves < best) {
      setBest(moves);
      try {
        const raw = JSON.parse(localStorage.getItem(STORAGE_BEST) || "{}");
        raw[difficulty] = moves;
        localStorage.setItem(STORAGE_BEST, JSON.stringify(raw));
      } catch { /* noop */ }
      rewards.milestone("new_best", moves);
    }
  }, [won]); // eslint-disable-line react-hooks/exhaustive-deps

  const restart = useCallback((diff = difficulty) => {
    const c = DIFFICULTY[diff];
    setDeck(buildDeck(c.pairs));
    setOpened([]);
    setMoves(0);
    setMatched(0);
    setSeconds(0);
    lockRef.current = false;
    startedAt.current = Date.now();
  }, [difficulty]);

  const handleFlip = (id) => {
    if (lockRef.current) return;
    if (won) return;
    const card = deck.find((c) => c.id === id);
    if (!card || card.flipped || card.matched) return;
    if (opened.length >= 2) return;

    const nextDeck = deck.map((c) => (c.id === id ? { ...c, flipped: true } : c));
    const nextOpened = [...opened, id];
    setDeck(nextDeck);
    setOpened(nextOpened);

    if (nextOpened.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = nextOpened;
      const ca = nextDeck.find((c) => c.id === a);
      const cb = nextDeck.find((c) => c.id === b);
      if (ca.emoji === cb.emoji) {
        // Match!
        setTimeout(() => {
          setDeck((d) => d.map((c) => (c.id === a || c.id === b ? { ...c, matched: true, flipped: false } : c)));
          setMatched((n) => n + 1);
          setOpened([]);
        }, 350);
      } else {
        // Mismatch - flip back
        lockRef.current = true;
        setTimeout(() => {
          setDeck((d) => d.map((c) => (c.id === a || c.id === b ? { ...c, flipped: false } : c)));
          setOpened([]);
          lockRef.current = false;
        }, 850);
      }
    }
  };

  const onChangeDifficulty = (d) => { setDifficulty(d); restart(d); };

  const grid = useMemo(() => ({ gridTemplateColumns: `repeat(${cfg.cols}, minmax(0,1fr))` }), [cfg.cols]);

  return (
    <GameShell title={l.title} description={l.desc}>
      <div className="max-w-md mx-auto">
        <div className="grid grid-cols-3 gap-2 mb-3 text-sm">
          <div className="rounded-xl bg-white dark:bg-slate-800 p-2 text-center shadow border border-slate-200 dark:border-slate-700">
            <p className="text-[10px] uppercase font-bold text-slate-500">{l.moves}</p>
            <p className="text-xl font-extrabold text-purple-600 dark:text-purple-400">{moves}</p>
          </div>
          <div className="rounded-xl bg-white dark:bg-slate-800 p-2 text-center shadow border border-slate-200 dark:border-slate-700">
            <p className="text-[10px] uppercase font-bold text-slate-500">{l.matched}</p>
            <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {matched}/{cfg.pairs}
            </p>
          </div>
          <div className="rounded-xl bg-white dark:bg-slate-800 p-2 text-center shadow border border-slate-200 dark:border-slate-700">
            <p className="text-[10px] uppercase font-bold text-slate-500">{l.timer}</p>
            <p className="text-xl font-extrabold tabular-nums text-amber-600 dark:text-amber-400">{fmtTime(seconds)}</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1 mb-4 text-xs">
          <span className="text-slate-500 dark:text-slate-400 mr-1">{l.difficulty}:</span>
          {["easy", "medium", "hard"].map((d) => (
            <button
              key={d}
              onClick={() => onChangeDifficulty(d)}
              className={`px-2 py-1 rounded-md font-bold transition ${
                difficulty === d
                  ? "bg-purple-600 text-white"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
              }`}
            >
              {l[d]}
            </button>
          ))}
        </div>

        {best !== null && (
          <p className="text-center text-xs text-slate-500 dark:text-slate-400 mb-3">
            {l.best}: <strong className="text-emerald-600 dark:text-emerald-400">{best}</strong> {l.moves.toLowerCase()}
          </p>
        )}

        <div
          role="grid"
          aria-label={l.title}
          className="grid gap-2 mx-auto"
          style={grid}
        >
          {deck.map((c) => {
            const showFace = c.flipped || c.matched;
            return (
              <button
                key={c.id}
                role="gridcell"
                onClick={() => handleFlip(c.id)}
                aria-label={showFace ? c.emoji : "card"}
                className={`aspect-square rounded-xl text-3xl sm:text-4xl flex items-center justify-center transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 ${
                  c.matched
                    ? "bg-emerald-100 dark:bg-emerald-900/40 ring-2 ring-emerald-400 cursor-default"
                    : c.flipped
                      ? "bg-white dark:bg-slate-700 shadow-inner ring-2 ring-purple-300"
                      : "bg-gradient-to-br from-purple-500 to-pink-500 hover:scale-105 shadow"
                }`}
                disabled={c.matched}
              >
                {showFace ? c.emoji : <span className="text-white text-2xl">?</span>}
              </button>
            );
          })}
        </div>

        <div className="text-center mt-4">
          <button
            onClick={() => restart()}
            className="px-4 py-2 rounded-lg text-sm font-bold bg-purple-600 hover:bg-purple-700 text-white shadow"
          >
            {l.restart}
          </button>
        </div>

        {won && (
          <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white text-center shadow-lg">
            <p className="text-lg font-extrabold">{l.win}</p>
            <p className="text-sm opacity-90 mt-1">{moves} {l.moves.toLowerCase()} · {fmtTime(seconds)}</p>
          </div>
        )}
      </div>
    </GameShell>
  );
}
