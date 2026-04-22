import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";

function randomSequence(len) {
  let s = "";
  for (let i = 0; i < len; i++) s += Math.floor(Math.random() * 10);
  return s;
}

export default function DigitSpanGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState("show");
  const [length, setLength] = useState(3);
  const [maxReached, setMaxReached] = useState(0);
  const [sequence, setSequence] = useState("");
  const [showIndex, setShowIndex] = useState(0);
  const [input, setInput] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const seqRef = useRef("");

  const T = useMemo(
    () => ({
      title: isEl ? "Ψηφιακό εύρος" : "Digit span",
      instructions: isEl
        ? "Θα εμφανίζονται ψηφία ένα-ένα. Μετά πληκτρολόγησε την ίδια σειρά. Ξεκινά από 3 ψηφία· κάθε επιτυχία αυξάνει το μήκος. Λάθος = τέλος. Η βαθμολογία είναι το μέγιστο μήκος που θυμήθηκες σωστά."
        : "Digits appear one at a time. Then type the same sequence. Starts at 3 digits; each success increases length. Wrong answer ends the game. Score is the longest sequence you recalled correctly.",
      start: isEl ? "Έναρξη" : "Start",
      length: isEl ? "Μήκος" : "Length",
      recall: isEl ? "Επανάλαβε τη σειρά" : "Repeat the sequence",
      submit: isEl ? "Υποβολή" : "Submit",
      clear: isEl ? "Διαγραφή" : "Clear",
      gameOver: isEl ? "Τέλος" : "Game Over",
      maxSpan: isEl ? "Μέγιστο μήκος" : "Max span",
      playAgain: isEl ? "Ξαναπαίξτε" : "Play Again",
    }),
    [isEl]
  );

  const startSequence = useCallback((len) => {
    const seq = randomSequence(len);
    seqRef.current = seq;
    setSequence(seq);
    setShowIndex(0);
    setInput("");
    setPhase("show");
  }, []);

  const initGame = useCallback(() => {
    setStarted(true);
    setLength(3);
    setMaxReached(0);
    setGameOver(false);
    startSequence(3);
  }, [startSequence]);

  useEffect(() => {
    if (!started || gameOver || phase !== "show") return;
    if (showIndex >= sequence.length) {
      setPhase("input");
      return;
    }
    const id = setTimeout(() => setShowIndex((i) => i + 1), 700);
    return () => clearTimeout(id);
  }, [started, gameOver, phase, showIndex, sequence]);

  const submit = useCallback(() => {
    if (phase !== "input" || gameOver) return;
    if (input === seqRef.current) {
      setMaxReached((m) => Math.max(m, length));
      const next = length + 1;
      setLength(next);
      startSequence(next);
    } else {
      setGameOver(true);
    }
  }, [phase, gameOver, input, length, startSequence]);

  const key = (d) => {
    if (phase !== "input" || gameOver) return;
    setInput((prev) => (prev.length < length ? prev + d : prev));
  };

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 flex items-center justify-center">
        <div className="max-w-md w-full rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-8 text-center">
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">🔢 {T.gameOver}</p>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {T.maxSpan}: <span className="font-bold text-emerald-600 dark:text-emerald-400">{maxReached}</span>
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
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">🔢 {T.title}</h1>
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
          {T.length}: <span className="font-bold text-amber-600 dark:text-amber-400">{length}</span>
        </p>

        {phase === "show" && (
          <div className="rounded-2xl bg-white dark:bg-slate-800 shadow-lg p-16 flex items-center justify-center min-h-[200px]">
            <p className="text-6xl font-mono font-black text-indigo-600 dark:text-indigo-400">
              {showIndex < sequence.length ? sequence[showIndex] : ""}
            </p>
          </div>
        )}

        {phase === "input" && (
          <div className="rounded-2xl bg-white dark:bg-slate-800 shadow-lg p-6">
            <p className="text-center text-slate-600 dark:text-slate-400 mb-4">{T.recall}</p>
            <p className="text-center text-3xl font-mono font-bold text-slate-800 dark:text-slate-100 mb-6 min-h-[2.5rem]">{input || "—"}</p>
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
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-600"
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
