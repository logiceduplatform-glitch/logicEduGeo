import React, { useState, useEffect, useCallback } from "react";

const GREEK_ALPHABET = "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ";
const LATIN_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const WORDS_EL = [
  ["ΘΑΛΑΣΣΑ", "ΕΛΛΑΔΑ", "ΠΛΑΝΗΤΗΣ", "ΟΥΡΑΝΟΣ", "ΓΗ"],
  ["ΜΟΥΣΙΚΗ", "ΒΙΒΛΙΟ", "ΦΩΤΙΑ", "ΔΕΝΤΡΟ", "ΚΟΣΜΟΣ"],
  ["ΗΛΙΟΣ", "ΦΕΓΓΑΡΙ", "ΑΣΤΕΡΙ", "ΝΕΦΕΛΗ", "ΒΡΟΧΗ"],
];
const WORDS_EN = [
  ["PLANET", "SUN", "MOON", "STAR", "EARTH"],
  ["MUSIC", "WATER", "FIRE", "FOREST", "GARDEN"],
  ["TRAVEL", "BRIDGE", "SPIRIT", "WONDER", "RHYTHM"],
];

function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateGrid(words, alphabet, size = 10) {
  const grid = Array(size)
    .fill(null)
    .map(() => Array(size).fill(null));
  const placements = [];

  const tryPlace = (word, horizontal) => {
    const len = word.length;
    const maxRow = horizontal ? size : size - len;
    const maxCol = horizontal ? size - len : size;
    if (maxRow < 0 || maxCol < 0) return null;

    for (let attempt = 0; attempt < 50; attempt++) {
      const r = Math.floor(Math.random() * maxRow);
      const c = Math.floor(Math.random() * maxCol);
      let ok = true;
      for (let i = 0; i < len; i++) {
        const nr = horizontal ? r : r + i;
        const nc = horizontal ? c + i : c;
        if (grid[nr][nc] !== null && grid[nr][nc] !== word[i]) {
          ok = false;
          break;
        }
      }
      if (ok) {
        const cells = [];
        for (let i = 0; i < len; i++) {
          const nr = horizontal ? r : r + i;
          const nc = horizontal ? c + i : c;
          grid[nr][nc] = word[i];
          cells.push({ r: nr, c: nc });
        }
        return { word, cells, horizontal };
      }
    }
    return null;
  };

  for (const word of words) {
    const h = tryPlace(word, true);
    if (h) placements.push(h);
    else {
      const v = tryPlace(word, false);
      if (v) placements.push(v);
    }
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === null) {
        grid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
      }
    }
  }

  return { grid, placements };
}

export default function WordSearchGame({ lang = "el" }) {
  const isEl = lang === "el";
  const alphabet = isEl ? GREEK_ALPHABET : LATIN_ALPHABET;
  const wordPools = isEl ? WORDS_EL : WORDS_EN;

  const [puzzle, setPuzzle] = useState(null);
  const [selected, setSelected] = useState([]);
  const [found, setFound] = useState(new Set());
  const [gameOver, setGameOver] = useState(false);

  const initPuzzle = useCallback(() => {
    const pool = shuffle([...wordPools.flat()]).slice(0, 5);
    const { grid, placements } = generateGrid(pool, alphabet);
    setPuzzle({ grid, placements, words: pool });
    setSelected([]);
    setFound(new Set());
    setGameOver(false);
  }, [alphabet]);

  useEffect(() => {
    initPuzzle();
  }, [initPuzzle]);

  const handleCellClick = useCallback(
    (r, c) => {
      if (!puzzle || gameOver) return;
      const idx = selected.findIndex((s) => s.r === r && s.c === c);
      if (idx >= 0) {
        setSelected((s) => s.filter((_, i) => i !== idx));
        return;
      }
      const next = [...selected, { r, c }];
      if (next.length > 2) {
        setSelected([{ r, c }]);
        return;
      }
      if (next.length === 2) {
        const [a, b] = next;
        const dr = b.r - a.r;
        const dc = b.c - a.c;
        const isLine = dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc);
        const len = Math.max(Math.abs(dr), Math.abs(dc)) + 1;
        const cells = [];
        const stepR = dr === 0 ? 0 : dr > 0 ? 1 : -1;
        const stepC = dc === 0 ? 0 : dc > 0 ? 1 : -1;
        for (let i = 0; i < len; i++) {
          cells.push({ r: a.r + i * stepR, c: a.c + i * stepC });
        }
        const cellsSet = (arr) => arr.map(({ r, c }) => `${r},${c}`).sort().join("|");
        const match = puzzle.placements.find((p) => {
          if (p.cells.length !== cells.length) return false;
          return cellsSet(p.cells) === cellsSet(cells);
        });
        if (match && !found.has(match.word)) {
          const newFound = new Set([...found, match.word]);
          setFound(newFound);
          if (newFound.size >= puzzle.words.length) setGameOver(true);
        }
        setSelected([]);
      } else {
        setSelected(next);
      }
    },
    [puzzle, selected, found]
  );

  const isSelected = (r, c) => selected.some((s) => s.r === r && s.c === c);
  const isInFound = (r, c) =>
    puzzle?.placements.some((p) => found.has(p.word) && p.cells.some((cell) => cell.r === r && cell.c === c));

  const T = {
    title: isEl ? "Αναζήτηση Λέξεων" : "Word Search",
    find: isEl ? "Βρες τις λέξεις" : "Find the words",
    hint: isEl ? "Κλικ στο ξεκίνημα και το τέλος κάθε λέξης" : "Click start and end of each word",
    playAgain: isEl ? "Νέο παζλ" : "New Puzzle",
    congrats: isEl ? "Συγχαρητήρια! Βρήκες όλες τις λέξεις!" : "Congratulations! You found all the words!",
  };

  if (!puzzle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
        <div className="w-10 h-10 border-4 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50/50 to-cyan-50 dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-900 p-4 sm:p-6 flex items-center justify-center">
        <div className="max-w-md w-full rounded-2xl bg-white/95 dark:bg-slate-800/95 shadow-xl p-8 text-center">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">🎉 {T.congrats}</h1>
          <button
            onClick={initPuzzle}
            className="mt-4 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition shadow-lg"
          >
            {T.playAgain}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50/50 to-cyan-50 dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-900 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2 text-center">{T.title}</h1>
        <p className="text-center text-slate-500 dark:text-slate-400 text-sm mb-4">{T.hint}</p>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="w-full lg:w-auto">
            <div className="inline-grid gap-1 p-2 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
              {puzzle.grid.map((row, r) => (
                <div key={r} className="flex gap-1">
                  {row.map((cell, c) => (
                    <button
                      key={c}
                      onClick={() => handleCellClick(r, c)}
                      className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-sm sm:text-base font-bold rounded transition select-none ${
                        isInFound(r, c)
                          ? "bg-emerald-400 dark:bg-emerald-600 text-slate-900"
                          : isSelected(r, c)
                          ? "bg-indigo-400 dark:bg-indigo-600 text-white ring-2 ring-indigo-600 dark:ring-indigo-400"
                          : "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600"
                      }`}
                    >
                      {cell}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-48 shrink-0">
            <div className="rounded-xl bg-white dark:bg-slate-800 shadow-lg p-4">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-3">{T.find}:</p>
              <ul className="space-y-2">
                {puzzle.words.map((w) => (
                  <li
                    key={w}
                    className={`font-semibold ${
                      found.has(w) ? "text-emerald-600 dark:text-emerald-400 line-through" : "text-slate-800 dark:text-slate-200"
                    }`}
                  >
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={initPuzzle}
            className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-300 dark:hover:bg-slate-500 transition"
          >
            {T.playAgain}
          </button>
        </div>
      </div>
    </div>
  );
}
