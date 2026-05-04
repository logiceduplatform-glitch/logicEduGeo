import React, { useContext, useEffect, useState } from "react";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";

const MAZES = [
  {
    grid: [
      "S....",
      ".###.",
      "...#.",
      ".#...",
      "....G",
    ],
  },
  {
    grid: [
      "S.#..",
      ".....",
      "##.##",
      ".....",
      "..#.G",
    ],
  },
  {
    grid: [
      "S....#",
      "###.#.",
      "....#.",
      ".####.",
      "......",
      "##.##G",
    ],
  },
];

function findStart(grid) {
  for (let y = 0; y < grid.length; y++) for (let x = 0; x < grid[y].length; x++) if (grid[y][x] === "S") return [x, y];
  return [0, 0];
}
function findGoal(grid) {
  for (let y = 0; y < grid.length; y++) for (let x = 0; x < grid[y].length; x++) if (grid[y][x] === "G") return [x, y];
  return [0, 0];
}

export default function RobotMazePage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const isEl = lang === "el";
  const [mIdx, setMIdx] = useState(0);
  const maze = MAZES[mIdx % MAZES.length];
  const W = maze.grid[0].length, H = maze.grid.length;
  const [pos, setPos] = useState(() => findStart(maze.grid));
  const goal = findGoal(maze.grid);
  const [moves, setMoves] = useState(0);
  const [solved, setSolved] = useState(0);

  useEffect(() => {
    setPos(findStart(maze.grid));
    setMoves(0);
  }, [mIdx]); // eslint-disable-line

  const move = (dx, dy) => {
    setPos(([x, y]) => {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= W || ny >= H) return [x, y];
      if (maze.grid[ny][nx] === "#") return [x, y];
      setMoves((m) => m + 1);
      if (nx === goal[0] && ny === goal[1]) {
        setSolved((s) => s + 1);
        setTimeout(() => setMIdx((i) => i + 1), 600);
      }
      return [nx, ny];
    });
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowUp") move(0, -1);
      if (e.key === "ArrowDown") move(0, 1);
      if (e.key === "ArrowLeft") move(-1, 0);
      if (e.key === "ArrowRight") move(1, 0);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [W, H, maze]); // eslint-disable-line

  return (
    <GameShell title={isEl ? "Λαβύρινθος Ρομπότ" : "Robot Maze"} description={isEl ? "Οδήγησε το ρομπότ στον στόχο" : "Guide the robot to the goal"} emoji="🤖" canonical="/games/robot-maze" back="/games">
      <div className="text-center mb-3">
        <span className="mr-3">🧩 {isEl ? "Επίπεδο" : "Level"}: <b>{(mIdx % MAZES.length) + 1}</b></span>
        <span className="mr-3">👣 {moves}</span>
        <span>🏆 {solved}</span>
      </div>
      <div className="inline-grid mx-auto mb-3" style={{ gridTemplateColumns: `repeat(${W}, 44px)` }}>
        {maze.grid.flatMap((row, y) => row.split("").map((cell, x) => {
          const isRobot = pos[0] === x && pos[1] === y;
          const isGoal = cell === "G";
          const isWall = cell === "#";
          return (
            <div key={`${x},${y}`} className={`w-11 h-11 flex items-center justify-center text-2xl ${isWall ? "bg-slate-700" : isGoal ? "bg-emerald-300" : "bg-slate-100 dark:bg-slate-700"}`}>
              {isRobot ? "🤖" : isGoal ? "🎯" : ""}
            </div>
          );
        }))}
      </div>
      <div className="grid grid-cols-3 gap-1 max-w-[180px] mx-auto">
        <div />
        <button onClick={() => move(0, -1)} className="bg-blue-500 text-white text-2xl rounded p-2">▲</button>
        <div />
        <button onClick={() => move(-1, 0)} className="bg-blue-500 text-white text-2xl rounded p-2">◀</button>
        <button onClick={() => setPos(findStart(maze.grid))} className="bg-slate-300 text-slate-800 rounded p-2 text-xs font-bold">↺</button>
        <button onClick={() => move(1, 0)} className="bg-blue-500 text-white text-2xl rounded p-2">▶</button>
        <div />
        <button onClick={() => move(0, 1)} className="bg-blue-500 text-white text-2xl rounded p-2">▼</button>
        <div />
      </div>
    </GameShell>
  );
}
