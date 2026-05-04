import React, { useContext, useMemo, useState } from "react";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";

const COMMANDS = ["⬆️", "⬇️", "⬅️", "➡️"];

const PUZZLES = [
  { start: [0, 0], goal: [3, 0], grid: 4 },
  { start: [0, 3], goal: [3, 0], grid: 4 },
  { start: [0, 0], goal: [3, 3], grid: 4 },
  { start: [2, 0], goal: [0, 3], grid: 4 },
];

function move(pos, cmd, size) {
  let [x, y] = pos;
  if (cmd === "⬆️") y = Math.max(0, y - 1);
  if (cmd === "⬇️") y = Math.min(size - 1, y + 1);
  if (cmd === "⬅️") x = Math.max(0, x - 1);
  if (cmd === "➡️") x = Math.min(size - 1, x + 1);
  return [x, y];
}

export default function CodePuzzlesPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const isEl = lang === "el";
  const [pIdx, setPIdx] = useState(0);
  const [program, setProgram] = useState([]);
  const [running, setRunning] = useState(false);
  const [solved, setSolved] = useState(0);
  const puzzle = PUZZLES[pIdx % PUZZLES.length];
  const [pos, setPos] = useState(puzzle.start);

  const reset = () => { setProgram([]); setPos(puzzle.start); setRunning(false); };
  const next = () => { setPIdx((i) => i + 1); setProgram([]); setPos(PUZZLES[(pIdx + 1) % PUZZLES.length].start); };

  const run = async () => {
    setRunning(true);
    let p = puzzle.start;
    setPos(p);
    for (const c of program) {
      await new Promise((r) => setTimeout(r, 350));
      p = move(p, c, puzzle.grid);
      setPos(p);
    }
    if (p[0] === puzzle.goal[0] && p[1] === puzzle.goal[1]) {
      setSolved((s) => s + 1);
      setTimeout(next, 800);
    }
    setRunning(false);
  };

  const cells = useMemo(() => {
    const arr = [];
    for (let y = 0; y < puzzle.grid; y++) {
      for (let x = 0; x < puzzle.grid; x++) arr.push([x, y]);
    }
    return arr;
  }, [puzzle.grid]);

  return (
    <GameShell title={isEl ? "Παζλ Κώδικα" : "Code Puzzles"} description={isEl ? "Φτιάξε το πρόγραμμα να φτάσει στον στόχο" : "Build a program to reach the goal"} emoji="🤖" canonical="/games/code-puzzles" back="/games">
      <div className="text-center">
        <div className="text-sm text-slate-500 mb-3">{isEl ? "Επιλυμένα" : "Solved"}: <b>{solved}</b></div>
        <div className="inline-grid gap-1 mb-4" style={{ gridTemplateColumns: `repeat(${puzzle.grid}, 56px)` }}>
          {cells.map(([x, y]) => {
            const isRobot = pos[0] === x && pos[1] === y;
            const isGoal = puzzle.goal[0] === x && puzzle.goal[1] === y;
            return (
              <div key={`${x},${y}`} className={`w-14 h-14 flex items-center justify-center rounded text-3xl ${isGoal ? "bg-emerald-300 dark:bg-emerald-700" : "bg-slate-200 dark:bg-slate-700"}`}>
                {isRobot ? "🤖" : isGoal ? "🎯" : ""}
              </div>
            );
          })}
        </div>
        <div className="flex flex-wrap justify-center gap-2 mb-3">
          {COMMANDS.map((c) => (
            <button key={c} onClick={() => setProgram((p) => [...p, c])} disabled={running} className="px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-2xl rounded">
              {c}
            </button>
          ))}
        </div>
        <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-3 mb-3 min-h-[60px] flex flex-wrap justify-center gap-1">
          {program.length === 0 && <span className="text-slate-400 text-sm">{isEl ? "Πρόσθεσε εντολές..." : "Add commands..."}</span>}
          {program.map((c, i) => <span key={i} className="text-2xl">{c}</span>)}
        </div>
        <div className="flex gap-2 justify-center flex-wrap">
          <button onClick={run} disabled={running || program.length === 0} className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold rounded-lg">
            ▶ {isEl ? "Τρέξε" : "Run"}
          </button>
          <button onClick={reset} disabled={running} className="px-5 py-2 bg-slate-200 dark:bg-slate-700 font-bold rounded-lg">
            ↺ {isEl ? "Επαναφορά" : "Reset"}
          </button>
          <button onClick={next} disabled={running} className="px-5 py-2 bg-slate-200 dark:bg-slate-700 font-bold rounded-lg">
            {isEl ? "Παράλειψη" : "Skip"}
          </button>
        </div>
      </div>
    </GameShell>
  );
}
