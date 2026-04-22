import React, { useState, useCallback, useMemo } from "react";

const ACRONYMS = [
  { q: { el: "Τι σημαίνει το HTML;", en: "What does HTML stand for?" }, opts: { el: ["HyperText Markup Language", "High Tech Modern Link", "Home Tool Markup Line", "Hyperlink Text Mode Layer"], en: ["HyperText Markup Language", "High Tech Modern Link", "Home Tool Markup Line", "Hyperlink Text Mode Layer"] }, ans: "HyperText Markup Language" },
  { q: { el: "Τι σημαίνει το CPU;", en: "What does CPU stand for?" }, opts: { el: ["Central Processing Unit", "Computer Personal Utility", "Core Program Unit", "Cached Processing Utility"], en: ["Central Processing Unit", "Computer Personal Utility", "Core Program Unit", "Cached Processing Utility"] }, ans: "Central Processing Unit" },
  { q: { el: "Τι σημαίνει το PDF;", en: "What does PDF stand for?" }, opts: { el: ["Portable Document Format", "Public Data File", "Printed Document Form", "Personal Digital Folder"], en: ["Portable Document Format", "Public Data File", "Printed Document Form", "Personal Digital Folder"] }, ans: "Portable Document Format" },
  { q: { el: "Τι σημαίνει το Wi‑Fi;", en: "What does Wi‑Fi stand for?" }, opts: { el: ["Wireless Fidelity", "Wide Fiber Internet", "Web File Interface", "Wired Fixed Input"], en: ["Wireless Fidelity", "Wide Fiber Internet", "Web File Interface", "Wired Fixed Input"] }, ans: "Wireless Fidelity" },
  { q: { el: "Τι σημαίνει το RAM;", en: "What does RAM stand for?" }, opts: { el: ["Random Access Memory", "Rapid Application Module", "Read And Modify", "Remote Access Manager"], en: ["Random Access Memory", "Rapid Application Module", "Read And Modify", "Remote Access Manager"] }, ans: "Random Access Memory" },
  { q: { el: "Τι σημαίνει το USB;", en: "What does USB stand for?" }, opts: { el: ["Universal Serial Bus", "Ultra Speed Buffer", "United System Bridge", "User Storage Block"], en: ["Universal Serial Bus", "Ultra Speed Buffer", "United System Bridge", "User Storage Block"] }, ans: "Universal Serial Bus" },
  { q: { el: "Τι σημαίνει το NASA;", en: "What does NASA stand for?" }, opts: { el: ["National Aeronautics and Space Administration", "North American Space Agency", "Naval Air and Sea Association", "New Astronomy Science Academy"], en: ["National Aeronautics and Space Administration", "North American Space Agency", "Naval Air and Sea Association", "New Astronomy Science Academy"] }, ans: "National Aeronautics and Space Administration" },
  { q: { el: "Τι σημαίνει το FAQ;", en: "What does FAQ stand for?" }, opts: { el: ["Frequently Asked Questions", "Fast Answer Query", "File Access Queue", "Final Approval Question"], en: ["Frequently Asked Questions", "Fast Answer Query", "File Access Queue", "Final Approval Question"] }, ans: "Frequently Asked Questions" },
  { q: { el: "Τι σημαίνει το ATM;", en: "What does ATM stand for?" }, opts: { el: ["Automated Teller Machine", "Any Time Money", "Account Transfer Module", "Automatic Token Manager"], en: ["Automated Teller Machine", "Any Time Money", "Account Transfer Module", "Automatic Token Manager"] }, ans: "Automated Teller Machine" },
  { q: { el: "Τι σημαίνει το GPS;", en: "What does GPS stand for?" }, opts: { el: ["Global Positioning System", "General Purpose Satellite", "Geo Path Service", "Ground Point Signal"], en: ["Global Positioning System", "General Purpose Satellite", "Geo Path Service", "Ground Point Signal"] }, ans: "Global Positioning System" },
];

function shuffleArr(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const ROUNDS = 10;

export default function AcronymGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [order, setOrder] = useState(() => shuffleArr(ACRONYMS.map((_, i) => i)));
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const current = ACRONYMS[order[round]];
  const correct = current.ans;
  const options = useMemo(() => shuffleArr(current.opts[isEl ? "el" : "en"]), [round, isEl, current]);

  const initGame = useCallback(() => {
    setOrder(shuffleArr(ACRONYMS.map((_, i) => i)));
    setRound(0);
    setScore(0);
    setSelected(null);
    setGameOver(false);
  }, []);

  const pick = (opt) => {
    if (selected !== null) return;
    setSelected(opt);
    if (opt === correct) setScore((s) => s + 1);
  };

  const next = () => {
    if (round >= ROUNDS - 1) {
      setGameOver(true);
      return;
    }
    setRound((r) => r + 1);
    setSelected(null);
  };

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 flex items-center justify-center">
        <div className="max-w-md w-full rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-8 text-center">
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">🔠 {isEl ? "Ακρωνύμια" : "Acronyms"}</p>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {isEl ? "Σκορ" : "Score"}: {score} / {ROUNDS}
          </p>
          <button
            type="button"
            onClick={initGame}
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition"
          >
            {isEl ? "Ξαναπαίξτε" : "Play Again"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 flex items-center justify-center">
      <div className="max-w-lg w-full rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-6 sm:p-8">
        <div className="flex justify-between items-center mb-4 text-sm text-slate-500 dark:text-slate-400">
          <span>
            {isEl ? "Γύρος" : "Round"} {round + 1}/{ROUNDS}
          </span>
          <span>
            {isEl ? "Σκορ" : "Score"}: {score}
          </span>
        </div>
        <p className="text-lg sm:text-xl text-slate-800 dark:text-slate-100 mb-6">{current.q[isEl ? "el" : "en"]}</p>
        <div className="grid gap-3">
          {options.map((opt, i) => {
            const wrong = selected !== null && opt !== correct;
            const right = selected !== null && opt === correct;
            return (
              <button
                key={`${round}-${i}`}
                type="button"
                disabled={selected !== null}
                onClick={() => pick(opt)}
                className={`w-full py-3 px-4 rounded-xl text-left font-medium transition border-2 text-sm ${
                  right
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200"
                    : wrong
                      ? "border-rose-400 bg-rose-50 dark:bg-rose-900/20 text-rose-800 dark:text-rose-200"
                      : "border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-800 dark:text-slate-100 hover:border-indigo-400"
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
        {selected !== null && (
          <button
            type="button"
            onClick={next}
            className="mt-6 w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
          >
            {round >= ROUNDS - 1 ? (isEl ? "Τέλος" : "Finish") : isEl ? "Επόμενο" : "Next"}
          </button>
        )}
      </div>
    </div>
  );
}
