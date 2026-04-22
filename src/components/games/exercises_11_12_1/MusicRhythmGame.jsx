import React, { useState, useEffect, useCallback, useRef } from "react";

const BEATS = ["🔴", "🔵", "🟢", "🟡", "🟣"];

function randomSequence(length) {
  const out = [];
  for (let i = 0; i < length; i++) {
    out.push(BEATS[Math.floor(Math.random() * BEATS.length)]);
  }
  return out;
}

export default function MusicRhythmGame({ onComplete, difficulty = 1, lang = "el" }) {
  const isEl = lang === "el";
  const TOTAL_LEVELS = 10;
  const startRef = useRef(Date.now());

  const showMs = difficulty >= 2 ? 350 : 550;
  const gapMs = difficulty >= 2 ? 120 : 200;

  const [level, setLevel] = useState(0);
  const [phase, setPhase] = useState("show");
  const [sequence, setSequence] = useState(() => randomSequence(3));
  const [inputIndex, setInputIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [pulse, setPulse] = useState(-1);

  const seqLen = 3 + level;

  const restart = useCallback(() => {
    startRef.current = Date.now();
    setLevel(0);
    setPhase("show");
    setSequence(randomSequence(3));
    setInputIndex(0);
    setScore(0);
    setGameOver(false);
    setPulse(-1);
  }, []);

  useEffect(() => {
    if (gameOver) return;
    if (phase !== "show") return;

    let cancelled = false;
    let idx = 0;

    const run = async () => {
      while (idx < sequence.length && !cancelled) {
        setPulse(idx);
        await new Promise((r) => setTimeout(r, showMs));
        setPulse(-1);
        await new Promise((r) => setTimeout(r, gapMs));
        idx += 1;
      }
      if (!cancelled) {
        setPulse(-1);
        setPhase("input");
        setInputIndex(0);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [phase, sequence, showMs, gapMs, gameOver]);

  const handleTap = useCallback(
    (emoji) => {
      if (phase !== "input" || gameOver) return;
      const expected = sequence[inputIndex];
      if (emoji !== expected) {
        setGameOver(true);
        return;
      }
      const next = inputIndex + 1;
      if (next >= sequence.length) {
        setScore((s) => s + 1);
        if (level + 1 >= TOTAL_LEVELS) {
          setGameOver(true);
        } else {
          const nextLevel = level + 1;
          setLevel(nextLevel);
          setSequence(randomSequence(3 + nextLevel));
          setPhase("show");
        }
      } else {
        setInputIndex(next);
      }
    },
    [phase, gameOver, sequence, inputIndex, level]
  );

  const handleFinish = useCallback(() => {
    const time = Math.round((Date.now() - startRef.current) / 1000);
    onComplete?.({ score, total: TOTAL_LEVELS, time });
  }, [onComplete, score]);

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 flex items-center justify-center">
        <div className="max-w-md w-full rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-8 text-center">
          <p className="text-6xl mb-4">🎵</p>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            {isEl ? "Ρυθμός & μνήμη" : "Rhythm & memory"}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {score}/{TOTAL_LEVELS}
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              type="button"
              onClick={restart}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"
            >
              {isEl ? "Ξαναπαίξε" : "Play Again"}
            </button>
            <button
              type="button"
              onClick={handleFinish}
              className="px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold"
            >
              {isEl ? "Τέλος" : "Finish"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 to-pink-100 dark:from-slate-900 dark:to-slate-800 p-4 flex items-center justify-center">
      <div className="max-w-lg w-full rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-6 sm:p-8">
        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 text-center mb-2">
          {isEl ? "Επανάλαβε τον ρυθμό!" : "Repeat the rhythm!"}
        </h1>
        <p className="text-center text-sm text-slate-600 dark:text-slate-400 mb-6">
          {isEl
            ? `Επίπεδο ${level + 1}/${TOTAL_LEVELS} · ${seqLen} χτυπήματα · Σκορ: ${score}`
            : `Level ${level + 1}/${TOTAL_LEVELS} · ${seqLen} beats · Score: ${score}`}
        </p>

        {phase === "show" && (
          <div className="mb-8 min-h-[120px] flex flex-col items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700/60 p-6">
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
              {isEl ? "Παρακολούθησε προσεκτικά…" : "Watch carefully…"}
            </p>
            <div className="flex gap-3 flex-wrap justify-center text-5xl sm:text-6xl min-h-[4rem] items-center">
              {sequence.map((b, i) => (
                <span
                  key={`${i}-${b}`}
                  className={`transition-transform duration-150 ${
                    pulse === i ? "scale-125 drop-shadow-lg" : "opacity-40 scale-90"
                  }`}
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        )}

        {phase === "input" && (
          <div className="mb-6">
            <p className="text-center text-sm font-medium text-slate-700 dark:text-slate-200 mb-4">
              {isEl
                ? `Τώρα πάτησε με τη σειρά (${inputIndex + 1}/${sequence.length}):`
                : `Now tap in order (${inputIndex + 1}/${sequence.length}):`}
            </p>
            <div className="flex gap-3 flex-wrap justify-center">
              {BEATS.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => handleTap(b)}
                  className="text-5xl sm:text-6xl w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 hover:bg-fuchsia-100 dark:hover:bg-fuchsia-900/30 hover:scale-105 active:scale-95 transition-all"
                  aria-label={b}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
