import React, { useState, useEffect, useContext, useCallback, useRef } from "react";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";

const HOLES = 9;
const GAME_DURATION = 30; // seconds
const SHOW_MIN = 600;
const SHOW_MAX = 1200;
const STORAGE_BEST = "kibloo:whack:best";

const T = {
  el: { title: "Whack-a-Mole", desc: "Χτύπα τα μολύκια όσο πιο γρήγορα μπορείς!", start: "Έναρξη", restart: "Ξανά", time: "Χρόνος", score: "Σκορ", best: "Ρεκόρ", over: "Τέλος! Πέτυχες {n} χτυπήματα." },
  en: { title: "Whack-a-Mole", desc: "Whack as many moles as you can!", start: "Start", restart: "Restart", time: "Time", score: "Score", best: "Best", over: "Done! You got {n} hits." },
};

export default function WhackAMolePage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;
  const [active, setActive] = useState(null); // hole index
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => parseInt(localStorage.getItem(STORAGE_BEST) || "0", 10));
  const [over, setOver] = useState(false);
  const moleTimer = useRef(null);
  const tickTimer = useRef(null);

  const stop = useCallback(() => {
    if (moleTimer.current) clearTimeout(moleTimer.current);
    if (tickTimer.current) clearInterval(tickTimer.current);
    setPlaying(false);
    setActive(null);
  }, []);

  const showMole = useCallback(() => {
    const slot = Math.floor(Math.random() * HOLES);
    setActive(slot);
    const visibleFor = SHOW_MIN + Math.random() * (SHOW_MAX - SHOW_MIN);
    moleTimer.current = setTimeout(() => {
      setActive(null);
      moleTimer.current = setTimeout(showMole, 200 + Math.random() * 400);
    }, visibleFor);
  }, []);

  const start = useCallback(() => {
    setScore(0);
    setTime(GAME_DURATION);
    setOver(false);
    setPlaying(true);
    showMole();
    tickTimer.current = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          stop();
          setOver(true);
          setScore((s) => {
            if (s > best) {
              setBest(s);
              try { localStorage.setItem(STORAGE_BEST, String(s)); } catch { /* */ }
            }
            return s;
          });
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, [showMole, stop, best]);

  useEffect(() => () => stop(), [stop]);

  const whack = (i) => {
    if (!playing || active !== i) return;
    setScore((s) => s + 1);
    setActive(null);
  };

  return (
    <GameShell title={l.title} description={l.desc} emoji="🐹" canonical="/games/whack">
      <div className="flex justify-between items-center mb-3 gap-2">
        <div className="bg-amber-100 dark:bg-amber-900/40 rounded-lg px-3 py-1.5 text-center min-w-[60px]">
          <div className="text-[10px] uppercase">{l.time}</div>
          <div className="font-bold text-amber-700 dark:text-amber-300">{time}s</div>
        </div>
        <div className="bg-emerald-100 dark:bg-emerald-900/40 rounded-lg px-3 py-1.5 text-center min-w-[60px]">
          <div className="text-[10px] uppercase">{l.score}</div>
          <div className="font-bold text-emerald-700 dark:text-emerald-300">{score}</div>
        </div>
        <div className="bg-purple-100 dark:bg-purple-900/40 rounded-lg px-3 py-1.5 text-center min-w-[60px]">
          <div className="text-[10px] uppercase">{l.best}</div>
          <div className="font-bold text-purple-700 dark:text-purple-300">{best}</div>
        </div>
        {!playing && (
          <button onClick={start} className="px-4 py-2 bg-purple-600 text-white font-bold rounded-lg">
            {over ? l.restart : l.start}
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
        {Array.from({ length: HOLES }).map((_, i) => (
          <button
            key={i}
            onClick={() => whack(i)}
            className="aspect-square bg-amber-800 rounded-full overflow-hidden relative shadow-inner"
          >
            <div className={`absolute inset-x-2 bottom-0 h-3/4 transition-transform duration-150 ${active === i ? "translate-y-0" : "translate-y-full"}`}>
              <div className="text-5xl sm:text-6xl">🐹</div>
            </div>
          </button>
        ))}
      </div>

      {over && (
        <div className="mt-4 text-center font-bold text-lg text-slate-700 dark:text-slate-200">
          {l.over.replace("{n}", String(score))}
        </div>
      )}
    </GameShell>
  );
}
