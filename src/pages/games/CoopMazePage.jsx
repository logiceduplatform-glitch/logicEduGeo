import React, { useContext, useEffect, useMemo, useState } from "react";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";

const MAZE = [
  "S....#....G",
  ".#.#.#.##..",
  ".#.#...#...",
  ".#.###.#.#.",
  ".....#...#.",
  "###.###.##.",
  "...#...#...",
  ".#####.#.##",
  "...........",
];

export default function CoopMazePage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const isEl = lang === "el";
  const W = MAZE[0].length, H = MAZE.length;
  const start = useMemo(() => {
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (MAZE[y][x] === "S") return [x, y];
    return [0, 0];
  }, []);
  const goal = useMemo(() => {
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (MAZE[y][x] === "G") return [x, y];
    return [W - 1, H - 1];
  }, []);
  const [p1, setP1] = useState(start);
  const [p2, setP2] = useState(start);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  const move = (who, dx, dy) => {
    const setter = who === 1 ? setP1 : setP2;
    setter(([x, y]) => {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= W || ny >= H) return [x, y];
      if (MAZE[ny][nx] === "#") return [x, y];
      setMoves((m) => m + 1);
      return [nx, ny];
    });
  };

  useEffect(() => {
    if (p1[0] === goal[0] && p1[1] === goal[1] && p2[0] === goal[0] && p2[1] === goal[1]) setWon(true);
  }, [p1, p2, goal]);

  useEffect(() => {
    const onKey = (e) => {
      // P1: WASD
      if (e.key.toLowerCase() === "w") move(1, 0, -1);
      if (e.key.toLowerCase() === "s") move(1, 0, 1);
      if (e.key.toLowerCase() === "a") move(1, -1, 0);
      if (e.key.toLowerCase() === "d") move(1, 1, 0);
      // P2: Arrows
      if (e.key === "ArrowUp") move(2, 0, -1);
      if (e.key === "ArrowDown") move(2, 0, 1);
      if (e.key === "ArrowLeft") move(2, -1, 0);
      if (e.key === "ArrowRight") move(2, 1, 0);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []); // eslint-disable-line

  const reset = () => { setP1(start); setP2(start); setMoves(0); setWon(false); };

  return (
    <GameShell title={isEl ? "Co-op Λαβύρινθος" : "Co-op Maze"} description={isEl ? "P1: WASD · P2: Βέλη — φτάστε ΜΑΖΙ στον στόχο" : "P1: WASD · P2: Arrows — reach goal TOGETHER"} emoji="🧭" canonical="/games/coop-maze" back="/games">
      <div className="text-center mb-2 text-sm">
        👣 {moves} {won && <span className="ml-3 font-bold text-emerald-600">{isEl ? "🎉 Νικήσατε!" : "🎉 You won!"}</span>}
      </div>
      <div className="overflow-x-auto">
        <div className="inline-grid mx-auto" style={{ gridTemplateColumns: `repeat(${W}, 28px)` }}>
          {MAZE.flatMap((row, y) => row.split("").map((cell, x) => {
            const isP1 = p1[0] === x && p1[1] === y;
            const isP2 = p2[0] === x && p2[1] === y;
            const isGoal = cell === "G";
            const isWall = cell === "#";
            return (
              <div key={`${x},${y}`} className={`w-7 h-7 flex items-center justify-center text-base relative ${isWall ? "bg-slate-700" : isGoal ? "bg-emerald-300" : "bg-slate-100 dark:bg-slate-700"}`}>
                {isGoal && !isP1 && !isP2 && "🎯"}
                {isP1 && isP2 ? "💑" : isP1 ? "🔵" : isP2 ? "🔴" : ""}
              </div>
            );
          }))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-3">
        <div className="text-center">
          <div className="text-xs font-bold mb-1 text-blue-600">P1 (🔵)</div>
          <div className="grid grid-cols-3 gap-1 max-w-[140px] mx-auto">
            <div /><button onClick={() => move(1, 0, -1)} className="bg-blue-500 text-white p-1 rounded">W</button><div />
            <button onClick={() => move(1, -1, 0)} className="bg-blue-500 text-white p-1 rounded">A</button>
            <button onClick={() => move(1, 0, 1)} className="bg-blue-500 text-white p-1 rounded">S</button>
            <button onClick={() => move(1, 1, 0)} className="bg-blue-500 text-white p-1 rounded">D</button>
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs font-bold mb-1 text-rose-600">P2 (🔴)</div>
          <div className="grid grid-cols-3 gap-1 max-w-[140px] mx-auto">
            <div /><button onClick={() => move(2, 0, -1)} className="bg-rose-500 text-white p-1 rounded">▲</button><div />
            <button onClick={() => move(2, -1, 0)} className="bg-rose-500 text-white p-1 rounded">◀</button>
            <button onClick={() => move(2, 0, 1)} className="bg-rose-500 text-white p-1 rounded">▼</button>
            <button onClick={() => move(2, 1, 0)} className="bg-rose-500 text-white p-1 rounded">▶</button>
          </div>
        </div>
      </div>
      <div className="text-center mt-3">
        <button onClick={reset} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 font-bold rounded-lg">↺ {isEl ? "Επανεκκίνηση" : "Reset"}</button>
      </div>
    </GameShell>
  );
}
