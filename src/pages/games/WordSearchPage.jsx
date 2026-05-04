import React, { useState, useEffect, useContext, useCallback, useMemo } from "react";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";

const SIZE = 12;

const PACKS = {
  el: [
    { id: "fruits", name: "Φρούτα", words: ["ΜΗΛΟ", "ΑΧΛΑΔΙ", "ΦΡΑΟΥΛΑ", "ΚΕΡΑΣΙ", "ΛΕΜΟΝΙ", "ΣΥΚΟ"] },
    { id: "animals", name: "Ζώα", words: ["ΣΚΥΛΟΣ", "ΓΑΤΑ", "ΑΛΟΓΟ", "ΛΥΚΟΣ", "ΑΛΕΠΟΥ", "ΛΙΟΝΤΑΡΙ"] },
    { id: "colors", name: "Χρώματα", words: ["ΚΟΚΚΙΝΟ", "ΚΙΤΡΙΝΟ", "ΜΠΛΕ", "ΠΡΑΣΙΝΟ", "ΜΩΒ", "ΜΑΥΡΟ"] },
  ],
  en: [
    { id: "fruits", name: "Fruits", words: ["APPLE", "PEAR", "STRAWBERRY", "CHERRY", "LEMON", "FIG"] },
    { id: "animals", name: "Animals", words: ["DOG", "CAT", "HORSE", "WOLF", "FOX", "LION"] },
    { id: "colors", name: "Colors", words: ["RED", "YELLOW", "BLUE", "GREEN", "PURPLE", "BLACK"] },
  ],
};

const T = {
  el: { title: "Κρυπτόλεξο", desc: "Βρες όλες τις λέξεις στο πλέγμα!", new: "Νέο", pack: "Πακέτο", found: "Βρέθηκαν" },
  en: { title: "Word Search", desc: "Find all words in the grid!", new: "New", pack: "Pack", found: "Found" },
};

const ALPHA = {
  el: "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ",
  en: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
};

const DIRS = [
  [1, 0], [0, 1], [1, 1], [-1, 1],
  [-1, 0], [0, -1], [-1, -1], [1, -1],
];

function makeGrid(words, lang) {
  const grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(""));
  const placed = [];
  const alpha = ALPHA[lang] || ALPHA.en;

  for (const word of words) {
    let attempts = 200;
    while (attempts--) {
      const [dx, dy] = DIRS[Math.floor(Math.random() * DIRS.length)];
      const x = Math.floor(Math.random() * SIZE);
      const y = Math.floor(Math.random() * SIZE);
      const endX = x + dx * (word.length - 1);
      const endY = y + dy * (word.length - 1);
      if (endX < 0 || endX >= SIZE || endY < 0 || endY >= SIZE) continue;
      let ok = true;
      const cells = [];
      for (let i = 0; i < word.length; i++) {
        const cx = x + dx * i;
        const cy = y + dy * i;
        if (grid[cy][cx] && grid[cy][cx] !== word[i]) { ok = false; break; }
        cells.push([cx, cy]);
      }
      if (!ok) continue;
      cells.forEach(([cx, cy], i) => { grid[cy][cx] = word[i]; });
      placed.push({ word, cells });
      break;
    }
  }

  // Fill blanks
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
    if (!grid[y][x]) grid[y][x] = alpha[Math.floor(Math.random() * alpha.length)];
  }

  return { grid, placed };
}

function cellsBetween(a, b) {
  const dx = Math.sign(b.x - a.x);
  const dy = Math.sign(b.y - a.y);
  const distX = Math.abs(b.x - a.x);
  const distY = Math.abs(b.y - a.y);
  if (dx !== 0 && dy !== 0 && distX !== distY) return null; // not straight
  const len = Math.max(distX, distY);
  const cells = [];
  for (let i = 0; i <= len; i++) cells.push({ x: a.x + dx * i, y: a.y + dy * i });
  return cells;
}

function wordFromCells(grid, cells) {
  return cells.map(({ x, y }) => grid[y][x]).join("");
}

export default function WordSearchPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;
  const packs = PACKS[lang] || PACKS.en;
  const [packIdx, setPackIdx] = useState(0);
  const [puzzle, setPuzzle] = useState(() => makeGrid(packs[0].words, lang));
  const [found, setFound] = useState([]);
  const [start, setStart] = useState(null);
  const [hover, setHover] = useState(null);

  const refresh = useCallback((p = packIdx) => {
    setPuzzle(makeGrid(packs[p].words, lang));
    setFound([]);
    setStart(null);
    setHover(null);
  }, [packIdx, packs, lang]);

  useEffect(() => { refresh(packIdx); }, [packIdx, lang]);

  const selection = useMemo(() => {
    if (!start || !hover) return null;
    return cellsBetween(start, hover);
  }, [start, hover]);

  const handleDown = (x, y) => { setStart({ x, y }); setHover({ x, y }); };
  const handleEnter = (x, y) => { if (start) setHover({ x, y }); };
  const handleUp = () => {
    if (!start || !hover) return;
    const cells = cellsBetween(start, hover);
    if (cells) {
      const w = wordFromCells(puzzle.grid, cells);
      const wRev = w.split("").reverse().join("");
      const target = packs[packIdx].words.find((wrd) => wrd === w || wrd === wRev);
      if (target && !found.includes(target)) setFound((f) => [...f, target]);
    }
    setStart(null);
    setHover(null);
  };

  const isSelected = (x, y) => selection?.some((c) => c.x === x && c.y === y);
  const isFoundCell = (x, y) =>
    puzzle.placed.some((p) =>
      found.includes(p.word) && p.cells.some(([cx, cy]) => cx === x && cy === y)
    );

  return (
    <GameShell title={l.title} description={l.desc} emoji="🔍" canonical="/games/word-search">
      <div className="flex justify-between items-center mb-3 gap-2 flex-wrap">
        <select
          value={packIdx}
          onChange={(e) => setPackIdx(Number(e.target.value))}
          className="px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900"
        >
          {packs.map((p, i) => <option key={p.id} value={i}>{p.name}</option>)}
        </select>
        <div className="text-sm font-bold text-slate-700 dark:text-slate-200">
          {l.found}: {found.length} / {packs[packIdx].words.length}
        </div>
        <button onClick={() => refresh()} className="px-3 py-2 bg-purple-600 text-white font-bold rounded-lg text-sm">{l.new}</button>
      </div>

      <div
        className="bg-slate-100 dark:bg-slate-900 rounded-xl p-2 select-none"
        onMouseUp={handleUp}
        onTouchEnd={handleUp}
      >
        <div className="grid gap-px" style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}>
          {puzzle.grid.map((row, y) => row.map((ch, x) => {
            const sel = isSelected(x, y);
            const fnd = isFoundCell(x, y);
            return (
              <div
                key={`${x}-${y}`}
                onMouseDown={() => handleDown(x, y)}
                onMouseEnter={() => handleEnter(x, y)}
                onTouchStart={() => handleDown(x, y)}
                onTouchMove={(e) => {
                  const t = e.touches[0];
                  const el = document.elementFromPoint(t.clientX, t.clientY);
                  const cx = parseInt(el?.dataset?.cx, 10);
                  const cy = parseInt(el?.dataset?.cy, 10);
                  if (!isNaN(cx) && !isNaN(cy)) handleEnter(cx, cy);
                }}
                data-cx={x}
                data-cy={y}
                className={`aspect-square flex items-center justify-center font-bold text-xs sm:text-sm cursor-pointer transition-colors ${
                  fnd
                    ? "bg-emerald-300 dark:bg-emerald-700 text-emerald-900 dark:text-emerald-100"
                    : sel
                    ? "bg-amber-300 dark:bg-amber-700 text-amber-900 dark:text-amber-100"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                }`}
              >
                {ch}
              </div>
            );
          }))}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {packs[packIdx].words.map((w) => (
          <span
            key={w}
            className={`px-2 py-1 rounded-full text-sm font-bold ${
              found.includes(w)
                ? "bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-100 line-through"
                : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
            }`}
          >
            {w}
          </span>
        ))}
      </div>
    </GameShell>
  );
}
