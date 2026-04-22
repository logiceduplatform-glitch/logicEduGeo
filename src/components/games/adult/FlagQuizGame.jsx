import React, { useState, useCallback, useMemo } from "react";

const FLAGS = [
  { flag: "🇬🇷", opts: { el: ["Ελλάδα", "Κύπρος", "Ιταλία", "Βουλγαρία"], en: ["Greece", "Cyprus", "Italy", "Bulgaria"] }, ans: { el: "Ελλάδα", en: "Greece" } },
  { flag: "🇫🇷", opts: { el: ["Γαλλία", "Ιταλία", "Ισπανία", "Βέλγιο"], en: ["France", "Italy", "Spain", "Belgium"] }, ans: { el: "Γαλλία", en: "France" } },
  { flag: "🇯🇵", opts: { el: ["Ιαπωνία", "Κίνα", "Νότια Κορέα", "Ταϊλάνδη"], en: ["Japan", "China", "South Korea", "Thailand"] }, ans: { el: "Ιαπωνία", en: "Japan" } },
  { flag: "🇧🇷", opts: { el: ["Βραζιλία", "Αργεντινή", "Μεξικό", "Χιλή"], en: ["Brazil", "Argentina", "Mexico", "Chile"] }, ans: { el: "Βραζιλία", en: "Brazil" } },
  { flag: "🇨🇦", opts: { el: ["Καναδάς", "ΗΠΑ", "Αυστραλία", "Νέα Ζηλανδία"], en: ["Canada", "USA", "Australia", "New Zealand"] }, ans: { el: "Καναδάς", en: "Canada" } },
  { flag: "🇮🇹", opts: { el: ["Ιταλία", "Ισπανία", "Πορτογαλία", "Ελλάδα"], en: ["Italy", "Spain", "Portugal", "Greece"] }, ans: { el: "Ιταλία", en: "Italy" } },
  { flag: "🇩🇪", opts: { el: ["Γερμανία", "Αυστρία", "Ελβετία", "Ολλανδία"], en: ["Germany", "Austria", "Switzerland", "Netherlands"] }, ans: { el: "Γερμανία", en: "Germany" } },
  { flag: "🇪🇸", opts: { el: ["Ισπανία", "Μεξικό", "Αργεντινή", "Κολομβία"], en: ["Spain", "Mexico", "Argentina", "Colombia"] }, ans: { el: "Ισπανία", en: "Spain" } },
  { flag: "🇦🇺", opts: { el: ["Αυστραλία", "Νέα Ζηλανδία", "Φίτζι", "Παπούα"], en: ["Australia", "New Zealand", "Fiji", "Papua New Guinea"] }, ans: { el: "Αυστραλία", en: "Australia" } },
  { flag: "🇮🇳", opts: { el: ["Ινδία", "Πακιστάν", "Μπανγκλαντές", "Σρι Λάνκα"], en: ["India", "Pakistan", "Bangladesh", "Sri Lanka"] }, ans: { el: "Ινδία", en: "India" } },
  { flag: "🇲🇽", opts: { el: ["Μεξικό", "Ισπανία", "Γουατεμάλα", "Κούβα"], en: ["Mexico", "Spain", "Guatemala", "Cuba"] }, ans: { el: "Μεξικό", en: "Mexico" } },
  { flag: "🇿🇦", opts: { el: ["Νότια Αφρική", "Νιγηρία", "Κένυα", "Αίγυπτος"], en: ["South Africa", "Nigeria", "Kenya", "Egypt"] }, ans: { el: "Νότια Αφρική", en: "South Africa" } },
  { flag: "🇸🇪", opts: { el: ["Σουηδία", "Νορβηγία", "Φινλανδία", "Δανία"], en: ["Sweden", "Norway", "Finland", "Denmark"] }, ans: { el: "Σουηδία", en: "Sweden" } },
  { flag: "🇦🇷", opts: { el: ["Αργεντινή", "Χιλή", "Ουρουγουάη", "Παραγουάη"], en: ["Argentina", "Chile", "Uruguay", "Paraguay"] }, ans: { el: "Αργεντινή", en: "Argentina" } },
  { flag: "🇵🇹", opts: { el: ["Πορτογαλία", "Ισπανία", "Βραζιλία", "Αγκόλα"], en: ["Portugal", "Spain", "Brazil", "Angola"] }, ans: { el: "Πορτογαλία", en: "Portugal" } },
];

function shuffleArr(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const ROUNDS = 15;

export default function FlagQuizGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [order, setOrder] = useState(() => shuffleArr(FLAGS.map((_, i) => i)).slice(0, ROUNDS));
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const current = FLAGS[order[round]];
  const correct = current.ans[isEl ? "el" : "en"];
  const options = useMemo(() => shuffleArr(current.opts[isEl ? "el" : "en"]), [round, isEl, current]);

  const initGame = useCallback(() => {
    setOrder(shuffleArr(FLAGS.map((_, i) => i)).slice(0, ROUNDS));
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
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">🏳️ {isEl ? "Κουίζ σημαιών" : "Flag Quiz"}</p>
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
        <p className="text-center text-slate-600 dark:text-slate-400 mb-4">{isEl ? "Ποια χώρα είναι αυτή;" : "Which country is this?"}</p>
        <p className="text-center text-7xl sm:text-8xl mb-8" aria-hidden>
          {current.flag}
        </p>
        <div className="grid gap-3">
          {options.map((opt) => {
            const wrong = selected !== null && opt !== correct;
            const right = selected !== null && opt === correct;
            return (
              <button
                key={opt}
                type="button"
                disabled={selected !== null}
                onClick={() => pick(opt)}
                className={`w-full py-3 px-4 rounded-xl text-left font-medium transition border-2 ${
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
