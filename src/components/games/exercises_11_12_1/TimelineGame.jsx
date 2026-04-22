import React, { useState, useCallback, useRef } from "react";

const EVENTS = {
  el: [
    { id: 0, label: "Ολυμπιακοί Αγώνες (776 π.Χ.)", year: -776 },
    { id: 1, label: "Πτώση Κωνσταντινούπολης (1453)", year: 1453 },
    { id: 2, label: "Γαλλική Επανάσταση (1789)", year: 1789 },
    { id: 3, label: "Α' Παγκόσμιος Πόλεμος (1914)", year: 1914 },
    { id: 4, label: "Πρώτος Άνθρωπος στη Σελήνη (1969)", year: 1969 },
  ],
  en: [
    { id: 0, label: "Olympic Games (776 BC)", year: -776 },
    { id: 1, label: "Fall of Constantinople (1453)", year: 1453 },
    { id: 2, label: "French Revolution (1789)", year: 1789 },
    { id: 3, label: "World War I (1914)", year: 1914 },
    { id: 4, label: "First Human on the Moon (1969)", year: 1969 },
  ],
};

const CORRECT_ORDER = [0, 1, 2, 3, 4];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function TimelineGame({ onComplete, difficulty = 1, lang = "el" }) {
  const isEl = lang === "el";
  const eventsSource = EVENTS[isEl ? "el" : "en"];
  const TOTAL_ROUNDS = 5;
  const TOTAL_PLACEMENTS = TOTAL_ROUNDS * 5;
  const startRef = useRef(Date.now());

  const [round, setRound] = useState(0);
  const [orderedIds, setOrderedIds] = useState(() => shuffle([...CORRECT_ORDER]));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [dragging, setDragging] = useState(null);

  const restart = useCallback(() => {
    startRef.current = Date.now();
    setRound(0);
    setOrderedIds(shuffle([...CORRECT_ORDER]));
    setScore(0);
    setGameOver(false);
    setSubmitted(false);
    setDragging(null);
  }, []);

  const eventById = useCallback(
    (id) => eventsSource.find((e) => e.id === id),
    [eventsSource]
  );

  const moveItem = useCallback((fromIndex, toIndex) => {
    if (submitted) return;
    setOrderedIds((prev) => {
      const next = [...prev];
      const [item] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, item);
      return next;
    });
  }, [submitted]);

  const submitRound = useCallback(() => {
    if (submitted) return;
    setSubmitted(true);
    let roundScore = 0;
    orderedIds.forEach((id, i) => {
      if (id === CORRECT_ORDER[i]) roundScore += 1;
    });
    setScore((s) => s + roundScore);

    setTimeout(() => {
      if (round + 1 >= TOTAL_ROUNDS) {
        setGameOver(true);
      } else {
        setRound((r) => r + 1);
        setOrderedIds(shuffle([...CORRECT_ORDER]));
        setSubmitted(false);
      }
    }, 1200);
  }, [submitted, orderedIds, round]);

  const handleFinish = useCallback(() => {
    const time = Math.round((Date.now() - startRef.current) / 1000);
    onComplete?.({ score, total: TOTAL_PLACEMENTS, time });
  }, [onComplete, score]);

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 flex items-center justify-center">
        <div className="max-w-md w-full rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-8 text-center">
          <p className="text-6xl mb-4">📜</p>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            {isEl ? "Χρονολόγιο" : "Timeline"}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {score}/{TOTAL_PLACEMENTS}
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-800 p-4 flex items-center justify-center">
      <div className="max-w-lg w-full rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-6 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 text-center mb-2">
          {isEl ? "Ταξινόμησε χρονολογικά" : "Sort chronologically"}
        </h1>
        <p className="text-center text-slate-600 dark:text-slate-400 text-sm mb-6">
          {isEl ? `Γύρος ${round + 1}/${TOTAL_ROUNDS} · Σκορ: ${score}/${TOTAL_PLACEMENTS}` : `Round ${round + 1}/${TOTAL_ROUNDS} · Score: ${score}/${TOTAL_PLACEMENTS}`}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-500 text-center mb-4">
          {isEl
            ? "Σύρε ή χρησιμοποίησε τα βελάκια. Από το παλαιότερο στο νεότερο."
            : "Drag or use arrows. Oldest at the top, newest at the bottom."}
        </p>
        <ul className="space-y-2 mb-6">
          {orderedIds.map((id, index) => {
            const ev = eventById(id);
            if (!ev) return null;
            const correct = submitted && id === CORRECT_ORDER[index];
            const wrong = submitted && id !== CORRECT_ORDER[index];
            return (
              <li
                key={`${round}-${id}`}
                draggable={!submitted}
                onDragStart={() => setDragging(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (dragging !== null && dragging !== index) {
                    moveItem(dragging, index);
                  }
                  setDragging(null);
                }}
                className={`flex items-center gap-2 rounded-xl border-2 p-3 cursor-grab active:cursor-grabbing transition-colors ${
                  correct
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30"
                    : wrong
                      ? "border-rose-500 bg-rose-50 dark:bg-rose-900/30"
                      : "border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50"
                }`}
              >
                <span className="text-slate-400 dark:text-slate-500 font-mono text-sm w-6">{index + 1}</span>
                <span className="flex-1 text-sm sm:text-base text-slate-800 dark:text-slate-100">{ev.label}</span>
                <div className="flex flex-col gap-0.5">
                  <button
                    type="button"
                    disabled={submitted || index === 0}
                    onClick={() => moveItem(index, index - 1)}
                    className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs disabled:opacity-30"
                    aria-label="up"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    disabled={submitted || index === orderedIds.length - 1}
                    onClick={() => moveItem(index, index + 1)}
                    className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs disabled:opacity-30"
                    aria-label="down"
                  >
                    ↓
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
        <button
          type="button"
          disabled={submitted}
          onClick={submitRound}
          className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold"
        >
          {isEl ? "Έλεγχος σειράς" : "Check order"}
        </button>
      </div>
    </div>
  );
}
