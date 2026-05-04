import React, { useState, useEffect, useContext, useCallback, useRef } from "react";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";

const COLS = 20;
const ROWS = 20;
const TICK_MS = 130;

const T = {
  el: { title: "Snake", desc: "Φάε τα φρούτα και μεγάλωσε. Μη χτυπήσεις τους τοίχους ή τον εαυτό σου!", score: "Σκορ", best: "Ρεκόρ", over: "Game over!", restart: "Νέο", paused: "Παύση" },
  en: { title: "Snake", desc: "Eat fruit and grow. Don't hit walls or yourself!", score: "Score", best: "Best", over: "Game over!", restart: "New", paused: "Paused" },
};

const STORAGE_BEST = "kibloo:snake:best";

function randomFood(snake) {
  let pos;
  do {
    pos = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
  } while (snake.some((s) => s.x === pos.x && s.y === pos.y));
  return pos;
}

export default function SnakePage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;

  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [dir, setDir] = useState({ x: 1, y: 0 });
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [over, setOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => parseInt(localStorage.getItem(STORAGE_BEST) || "0", 10));
  const dirRef = useRef(dir);
  const touchStart = useRef(null);

  useEffect(() => { dirRef.current = dir; }, [dir]);

  const reset = useCallback(() => {
    setSnake([{ x: 10, y: 10 }]);
    setDir({ x: 1, y: 0 });
    setFood({ x: 5, y: 5 });
    setOver(false);
    setPaused(false);
    setScore(0);
  }, []);

  const setDirection = useCallback((nx, ny) => {
    // Don't allow reversing into yourself
    if (nx === -dirRef.current.x && ny === -dirRef.current.y) return;
    setDir({ x: nx, y: ny });
  }, []);

  // Keyboard
  useEffect(() => {
    const onKey = (e) => {
      const map = {
        ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0],
        w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0],
      };
      if (map[e.key]) {
        e.preventDefault();
        setDirection(...map[e.key]);
      }
      if (e.key === " ") setPaused((p) => !p);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setDirection]);

  // Game loop
  useEffect(() => {
    if (over || paused) return;
    const id = setInterval(() => {
      setSnake((prev) => {
        const head = { x: prev[0].x + dirRef.current.x, y: prev[0].y + dirRef.current.y };
        if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
          setOver(true);
          return prev;
        }
        if (prev.some((s) => s.x === head.x && s.y === head.y)) {
          setOver(true);
          return prev;
        }
        const ate = head.x === food.x && head.y === food.y;
        const next = [head, ...prev];
        if (!ate) next.pop();
        else {
          setScore((s) => {
            const newScore = s + 10;
            if (newScore > best) {
              setBest(newScore);
              try { localStorage.setItem(STORAGE_BEST, String(newScore)); } catch { /* */ }
            }
            return newScore;
          });
          setFood(randomFood(next));
        }
        return next;
      });
    }, TICK_MS);
    return () => clearInterval(id);
  }, [over, paused, food, best]);

  // Touch
  const onTouchStart = (e) => { touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
  const onTouchEnd = (e) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    if (Math.abs(dx) < 25 && Math.abs(dy) < 25) return;
    if (Math.abs(dx) > Math.abs(dy)) setDirection(dx > 0 ? 1 : -1, 0);
    else setDirection(0, dy > 0 ? 1 : -1);
    touchStart.current = null;
  };

  return (
    <GameShell title={l.title} description={l.desc} emoji="🐍" canonical="/games/snake">
      <div className="flex justify-between items-center mb-3">
        <div className="flex gap-2">
          <div className="bg-slate-200 dark:bg-slate-700 rounded-lg px-3 py-1.5 text-center">
            <div className="text-[10px] uppercase text-slate-500">{l.score}</div>
            <div className="font-bold text-slate-800 dark:text-slate-100">{score}</div>
          </div>
          <div className="bg-amber-200 dark:bg-amber-800 rounded-lg px-3 py-1.5 text-center">
            <div className="text-[10px] uppercase text-amber-700 dark:text-amber-300">{l.best}</div>
            <div className="font-bold text-amber-900 dark:text-amber-100">{best}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setPaused((p) => !p)} className="px-3 py-2 bg-slate-200 dark:bg-slate-700 font-bold rounded-lg text-sm">⏯</button>
          <button onClick={reset} className="px-3 py-2 bg-purple-600 text-white font-bold rounded-lg text-sm">{l.restart}</button>
        </div>
      </div>

      <div
        className="bg-slate-900 rounded-xl p-2 select-none touch-none mx-auto"
        style={{ width: "min(100%, 480px)" }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="grid gap-px bg-slate-800 rounded"
          style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`, aspectRatio: "1/1" }}
        >
          {Array.from({ length: ROWS * COLS }).map((_, i) => {
            const x = i % COLS;
            const y = Math.floor(i / COLS);
            const isHead = snake[0].x === x && snake[0].y === y;
            const isBody = snake.slice(1).some((s) => s.x === x && s.y === y);
            const isFood = food.x === x && food.y === y;
            let cls = "bg-slate-900";
            if (isHead) cls = "bg-emerald-400";
            else if (isBody) cls = "bg-emerald-600";
            else if (isFood) cls = "bg-rose-500 rounded-full";
            return <div key={i} className={cls} />;
          })}
        </div>
      </div>

      {(paused || over) && (
        <div className="mt-3 text-center text-sm font-bold text-slate-700 dark:text-slate-200">
          {over ? `💀 ${l.over}` : `⏸ ${l.paused}`}
        </div>
      )}
    </GameShell>
  );
}
