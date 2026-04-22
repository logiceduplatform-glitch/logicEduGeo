import React, { useState, useCallback, useMemo, useEffect } from "react";

const POOL = [
  "ocean",
  "bridge",
  "crystal",
  "thunder",
  "garden",
  "velvet",
  "compass",
  "whisper",
  "lantern",
  "harvest",
  "meadow",
  "quartz",
  "falcon",
  "ember",
  "marble",
  "canyon",
  "breeze",
  "orchid",
  "summit",
  "ripple",
  "harbor",
  "nebula",
  "cobalt",
  "prairie",
  "mirage",
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickFive() {
  const sh = shuffle(POOL);
  return sh.slice(0, 5);
}

function pickFiveMore(avoid) {
  const pool = POOL.filter((w) => !avoid.includes(w));
  return shuffle(pool).slice(0, 5);
}

export default function WordMemoryGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState("memorize");
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [targets, setTargets] = useState([]);
  const [choices, setChoices] = useState([]);
  const [picked, setPicked] = useState(new Set());
  const [memSeconds, setMemSeconds] = useState(10);

  const T = useMemo(
    () => ({
      title: isEl ? "Μνήμη λέξεων" : "Word memory",
      instructions: isEl
        ? "Θα δεις 5 λέξεις για 10 δευτερόλεπτα. Μετά διάλεξε τις 5 που είδες ανάμεσα σε 10. 5 γύροι."
        : "You will see 5 words for 10 seconds. Then pick the 5 you saw among 10 options. 5 rounds.",
      start: isEl ? "Έναρξη" : "Start",
      memorize: isEl ? "Θυμήσου αυτές τις λέξεις" : "Memorize these words",
      pickFive: isEl ? "Διάλεξε τις 5 σωστές" : "Pick the 5 you saw",
      submit: isEl ? "Υποβολή" : "Submit",
      round: isEl ? "Γύρος" : "Round",
      score: isEl ? "Βαθμοί" : "Score",
      selected: isEl ? "Επιλεγμένες" : "Selected",
      gameOver: isEl ? "Τέλος" : "Game Over",
      finalScore: isEl ? "Τελική βαθμολογία" : "Final score",
      playAgain: isEl ? "Ξαναπαίξτε" : "Play Again",
    }),
    [isEl]
  );

  const beginRound = useCallback(() => {
    const t = pickFive();
    const decoys = pickFiveMore(t);
    setTargets(t);
    setChoices(shuffle([...t, ...decoys]));
    setPicked(new Set());
    setPhase("memorize");
    setMemSeconds(10);
  }, []);

  const initGame = useCallback(() => {
    setStarted(true);
    setRound(0);
    setScore(0);
    setGameOver(false);
    const t = pickFive();
    const decoys = pickFiveMore(t);
    setTargets(t);
    setChoices(shuffle([...t, ...decoys]));
    setPicked(new Set());
    setPhase("memorize");
    setMemSeconds(10);
  }, []);

  useEffect(() => {
    if (!started || gameOver || phase !== "memorize") return;
    if (memSeconds <= 0) {
      setPhase("recall");
      return;
    }
    const id = setTimeout(() => setMemSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [started, gameOver, phase, memSeconds]);

  const toggleWord = useCallback(
    (w) => {
      if (phase !== "recall" || gameOver) return;
      setPicked((prev) => {
        const next = new Set(prev);
        if (next.has(w)) next.delete(w);
        else if (next.size < 5) next.add(w);
        return next;
      });
    },
    [phase, gameOver]
  );

  const submit = useCallback(() => {
    if (picked.size !== 5 || gameOver) return;
    const targetSet = new Set(targets);
    const ok = [...picked].every((w) => targetSet.has(w)) && targets.every((w) => picked.has(w));
    if (ok) setScore((s) => s + 1);
    if (round >= 4) {
      setGameOver(true);
      return;
    }
    setRound((r) => r + 1);
    beginRound();
  }, [picked, targets, round, gameOver, beginRound]);

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 flex items-center justify-center">
        <div className="max-w-md w-full rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-8 text-center">
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">📚 {T.gameOver}</p>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {T.finalScore}: <span className="font-bold text-emerald-600 dark:text-emerald-400">{score}/5</span>
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
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">📚 {T.title}</h1>
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
        <div className="flex justify-center gap-6 mb-4 text-sm">
          <span className="text-slate-600 dark:text-slate-400">
            {T.round}: <strong className="text-amber-600 dark:text-amber-400">{round + 1}/5</strong>
          </span>
          <span className="text-slate-600 dark:text-slate-400">
            {T.score}: <strong className="text-emerald-600 dark:text-emerald-400">{score}</strong>
          </span>
        </div>

        {phase === "memorize" && (
          <div className="rounded-2xl bg-white dark:bg-slate-800 shadow-lg p-6">
            <p className="text-center text-slate-500 dark:text-slate-400 mb-2">
              {T.memorize} — {memSeconds}s
            </p>
            <ul className="space-y-2 text-center text-lg font-semibold text-slate-800 dark:text-slate-100">
              {targets.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </div>
        )}

        {phase === "recall" && (
          <div className="rounded-2xl bg-white dark:bg-slate-800 shadow-lg p-6">
            <p className="text-center text-slate-600 dark:text-slate-400 mb-2">{T.pickFive}</p>
            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-4">
              {T.selected}: {picked.size}/5
            </p>
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {choices.map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => toggleWord(w)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition ${
                    picked.has(w)
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-600"
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
            <div className="flex justify-center">
              <button
                type="button"
                disabled={picked.size !== 5}
                onClick={submit}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white font-semibold transition"
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
