import React, { useState, useContext, useCallback, useMemo } from "react";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";

const T = {
  el: { title: "Ένωσε τις Τελείες", desc: "Πάτα τις τελείες με τη σειρά (1, 2, 3...) για να φτιάξεις το σχέδιο!", new: "Νέο", reveal: "Δες λύση", restart: "Ξανά", success: "🎉 Τα κατάφερες!" },
  en: { title: "Connect the Dots", desc: "Tap the dots in order (1, 2, 3...) to draw the picture!", new: "New", reveal: "Show solution", restart: "Restart", success: "🎉 You did it!" },
};

// Predefined puzzles. Each is a list of {x,y} dots in 0-100 coordinate space.
// Drawing them in order produces the named shape.
const PUZZLES = [
  {
    id: "star", name: "Αστέρι",
    dots: [
      { x: 50, y: 10 }, { x: 61, y: 35 }, { x: 90, y: 35 },
      { x: 67, y: 55 }, { x: 78, y: 85 }, { x: 50, y: 65 },
      { x: 22, y: 85 }, { x: 33, y: 55 }, { x: 10, y: 35 }, { x: 39, y: 35 },
    ],
  },
  {
    id: "house", name: "Σπίτι",
    dots: [
      { x: 20, y: 50 }, { x: 50, y: 20 }, { x: 80, y: 50 },
      { x: 80, y: 90 }, { x: 20, y: 90 }, { x: 20, y: 50 },
    ],
  },
  {
    id: "fish", name: "Ψάρι",
    dots: [
      { x: 20, y: 50 }, { x: 35, y: 30 }, { x: 65, y: 30 }, { x: 80, y: 45 },
      { x: 90, y: 30 }, { x: 90, y: 70 }, { x: 80, y: 55 }, { x: 65, y: 70 },
      { x: 35, y: 70 }, { x: 20, y: 50 },
    ],
  },
  {
    id: "heart", name: "Καρδιά",
    dots: [
      { x: 50, y: 30 }, { x: 35, y: 18 }, { x: 18, y: 25 }, { x: 13, y: 45 },
      { x: 25, y: 65 }, { x: 50, y: 88 }, { x: 75, y: 65 }, { x: 87, y: 45 },
      { x: 82, y: 25 }, { x: 65, y: 18 }, { x: 50, y: 30 },
    ],
  },
];

export default function ConnectDotsPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;
  const [puzzleIdx, setPuzzleIdx] = useState(() => Math.floor(Math.random() * PUZZLES.length));
  const [progress, setProgress] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const puzzle = PUZZLES[puzzleIdx];

  const reset = useCallback((idx = puzzleIdx) => {
    setPuzzleIdx(idx);
    setProgress(0);
    setRevealed(false);
  }, [puzzleIdx]);

  const next = useCallback(() => {
    const i = Math.floor(Math.random() * PUZZLES.length);
    reset(i);
  }, [reset]);

  const handleDot = (i) => {
    if (revealed) return;
    if (i === progress) {
      setProgress((p) => p + 1);
    }
  };

  const linesD = useMemo(() => {
    const cells = puzzle.dots.slice(0, revealed ? puzzle.dots.length : progress);
    if (cells.length < 2) return "";
    return "M " + cells.map((d) => `${d.x} ${d.y}`).join(" L ");
  }, [puzzle.dots, progress, revealed]);

  const done = progress >= puzzle.dots.length;

  return (
    <GameShell title={l.title} description={l.desc} emoji="✏️" canonical="/games/connect-dots">
      <div className="flex justify-between items-center mb-3">
        <div className="font-bold text-slate-700 dark:text-slate-200">{puzzle.name}</div>
        <div className="flex gap-2">
          <button onClick={() => setRevealed(true)} className="px-3 py-2 bg-slate-200 dark:bg-slate-700 font-bold rounded-lg text-sm">{l.reveal}</button>
          <button onClick={next} className="px-3 py-2 bg-purple-600 text-white font-bold rounded-lg text-sm">{l.new}</button>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-2">
        <svg viewBox="0 0 100 100" className="w-full" style={{ aspectRatio: "1/1" }}>
          {linesD && (
            <path d={linesD} fill="none" stroke="#a855f7" strokeWidth="0.6" strokeLinecap="round" strokeLinejoin="round" />
          )}
          {puzzle.dots.map((d, i) => {
            const isNext = i === progress && !revealed;
            const isDone = i < progress || revealed;
            return (
              <g key={i} onClick={() => handleDot(i)} className="cursor-pointer">
                <circle
                  cx={d.x}
                  cy={d.y}
                  r={isNext ? 3 : 2.2}
                  fill={isDone ? "#a855f7" : isNext ? "#f59e0b" : "#cbd5e1"}
                  className={isNext ? "animate-pulse" : ""}
                />
                <text
                  x={d.x}
                  y={d.y - 4.5}
                  textAnchor="middle"
                  fontSize="3"
                  fontWeight="bold"
                  fill={isDone ? "#a855f7" : "#475569"}
                >
                  {i + 1}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {done && !revealed && (
        <div className="mt-3 text-center font-bold text-lg text-emerald-700 dark:text-emerald-300">{l.success}</div>
      )}
    </GameShell>
  );
}
