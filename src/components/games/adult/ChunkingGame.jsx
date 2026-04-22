import React, { useState, useCallback, useMemo, useEffect } from "react";

function randomDigits(len) {
  let s = "";
  for (let i = 0; i < len; i++) s += Math.floor(Math.random() * 10);
  return s;
}

export default function ChunkingGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState("show");
  const [level, setLevel] = useState(4);
  const [bestLevel, setBestLevel] = useState(0);
  const [sequence, setSequence] = useState("");
  const [input, setInput] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [showSeconds, setShowSeconds] = useState(5);

  const T = useMemo(
    () => ({
      title: isEl ? "Ομαδοποίηση αριθμών" : "Number chunking",
      instructions: isEl
        ? "Θα εμφανιστεί ακολουθία ψηφίων για 5 δευτερόλεπτα. Μετά πληκτρολόγησέ την ακριβώς. Ξεκινά από 4 ψηφία· κάθε επιτυχία αυξάνει το μήκος. Λάθος = τέλος. Η βαθμολογία είναι το μεγαλύτερο επίπεδο που ολοκλήρωσες."
        : "A digit sequence appears for 5 seconds. Then type it back exactly. Starts at 4 digits; each success increases length. One mistake ends the run. Score is the longest level you completed.",
      start: isEl ? "Έναρξη" : "Start",
      level: isEl ? "Επίπεδο" : "Level",
      recall: isEl ? "Πληκτρολόγησε την ακολουθία" : "Type the sequence",
      submit: isEl ? "Υποβολή" : "Submit",
      clear: isEl ? "Διαγραφή" : "Clear",
      gameOver: isEl ? "Τέλος" : "Game Over",
      best: isEl ? "Καλύτερο επίπεδο (μήκος)" : "Best level (length)",
      playAgain: isEl ? "Ξαναπαίξτε" : "Play Again",
      watch: isEl ? "Πρόσεχε…" : "Watch…",
    }),
    [isEl]
  );

  const startShow = useCallback((len) => {
    const seq = randomDigits(len);
    setSequence(seq);
    setPhase("show");
    setShowSeconds(5);
    setInput("");
  }, []);

  const initGame = useCallback(() => {
    setStarted(true);
    setLevel(4);
    setBestLevel(0);
    setGameOver(false);
    startShow(4);
  }, [startShow]);

  useEffect(() => {
    if (!started || gameOver || phase !== "show") return;
    if (showSeconds <= 0) {
      setPhase("input");
      return;
    }
    const id = setTimeout(() => setShowSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [started, gameOver, phase, showSeconds]);

  const submit = useCallback(() => {
    if (phase !== "input" || gameOver) return;
    if (input === sequence) {
      setBestLevel((b) => Math.max(b, level));
      const nextLen = level + 1;
      setLevel(nextLen);
      startShow(nextLen);
    } else {
      setGameOver(true);
    }
  }, [phase, gameOver, input, sequence, level, startShow]);

  const key = (d) => {
    if (phase !== "input" || gameOver) return;
    setInput((prev) => (prev.length < level ? prev + d : prev));
  };

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 flex items-center justify-center">
        <div className="max-w-md w-full rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-8 text-center">
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">📦 {T.gameOver}</p>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {T.best}: <span className="font-bold text-emerald-600 dark:text-emerald-400">{bestLevel}</span>
          </p>
          <button onClick={initGame} className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition">
            {T.playAgain}
          </button>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 flex items-center justify-center">
        <div className="max-w-lg w-full rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-8 text-center">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">📦 {T.title}</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8 text-left sm:text-center">{T.instructions}</p>
          <button onClick={initGame} className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition">
            {T.start}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4 text-center">{T.title}</h1>
        <p className="text-center text-slate-600 dark:text-slate-400 mb-4">
          {T.level}: <span className="font-bold text-amber-600 dark:text-amber-400">{level}</span> ({level}{" "}
          {isEl ? "ψηφία" : "digits"})
        </p>

        {phase === "show" && (
          <div className="rounded-2xl bg-white dark:bg-slate-800 shadow-lg p-10 text-center">
            <p className="text-slate-500 dark:text-slate-400 mb-4">
              {T.watch} {showSeconds}s
            </p>
            <p className="text-4xl sm:text-5xl font-mono font-bold tracking-[0.3em] text-slate-800 dark:text-slate-100">{sequence}</p>
          </div>
        )}

        {phase === "input" && (
          <div className="rounded-2xl bg-white dark:bg-slate-800 shadow-lg p-6">
            <p className="text-center text-slate-600 dark:text-slate-400 mb-4">{T.recall}</p>
            <p className="text-center text-3xl font-mono font-bold text-indigo-600 dark:text-indigo-400 mb-6 min-h-[2.5rem]">{input || "—"}</p>
            <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto mb-4">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => key(d)}
                  className="py-3 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 font-semibold text-lg"
                >
                  {d}
                </button>
              ))}
              <button
                type="button"
                onClick={() => key("0")}
                className="py-3 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 font-semibold text-lg col-span-3"
              >
                0
              </button>
            </div>
            <div className="flex gap-2 justify-center">
              <button
                type="button"
                onClick={() => setInput("")}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-100"
              >
                {T.clear}
              </button>
              <button
                type="button"
                onClick={submit}
                className="px-6 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"
              >
                {T.submit}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
