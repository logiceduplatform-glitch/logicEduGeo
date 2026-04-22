import React, { useState, useCallback, useMemo } from "react";

const ROUNDS_DATA = [
  { mode: "syn", word: { el: "γρήγορος", en: "fast" }, opts: { el: ["ταχύς", "αργός", "βαρύς", "κρύος"], en: ["swift", "slow", "heavy", "cold"] }, ans: { el: "ταχύς", en: "swift" } },
  { mode: "ant", word: { el: "φωτεινός", en: "bright" }, opts: { el: ["σκοτεινός", "λαμπρός", "ζεστός", "ψηλός"], en: ["dark", "radiant", "warm", "tall"] }, ans: { el: "σκοτεινός", en: "dark" } },
  { mode: "syn", word: { el: "έξυπνος", en: "smart" }, opts: { el: ["ευφυής", "χαζός", "κουρασμένος", "νεκρός"], en: ["clever", "foolish", "tired", "dead"] }, ans: { el: "ευφυής", en: "clever" } },
  { mode: "ant", word: { el: "ευτυχισμένος", en: "happy" }, opts: { el: ["λυπημένος", "χαρούμενος", "πλούσιος", "νέος"], en: ["sad", "joyful", "rich", "young"] }, ans: { el: "λυπημένος", en: "sad" } },
  { mode: "syn", word: { el: "μεγάλος", en: "big" }, opts: { el: ["τεράστιος", "μικρός", "λεπτός", "κενός"], en: ["huge", "tiny", "thin", "empty"] }, ans: { el: "τεράστιος", en: "huge" } },
  { mode: "ant", word: { el: "ζεστός", en: "hot" }, opts: { el: ["κρύος", "θερμός", "υγρός", "ξηρός"], en: ["cold", "warm", "wet", "dry"] }, ans: { el: "κρύος", en: "cold" } },
  { mode: "syn", word: { el: "αρχίζω", en: "begin" }, opts: { el: ["ξεκινώ", "τελειώνω", "κοιμάμαι", "τρώω"], en: ["start", "finish", "sleep", "eat"] }, ans: { el: "ξεκινώ", en: "start" } },
  { mode: "ant", word: { el: "αλήθεια", en: "truth" }, opts: { el: ["ψέμα", "γεγονός", "ιστορία", "λέξη"], en: ["lie", "fact", "story", "word"] }, ans: { el: "ψέμα", en: "lie" } },
  { mode: "syn", word: { el: "όμορφος", en: "beautiful" }, opts: { el: ["πανέμορφος", "άσχημος", "παλιός", "φθηνός"], en: ["gorgeous", "ugly", "old", "cheap"] }, ans: { el: "πανέμορφος", en: "gorgeous" } },
  { mode: "ant", word: { el: "πάνω", en: "above" }, opts: { el: ["κάτω", "πέρα", "μέσα", "δίπλα"], en: ["below", "beyond", "inside", "beside"] }, ans: { el: "κάτω", en: "below" } },
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

export default function SynonymAntonymGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [order, setOrder] = useState(() => shuffleArr(ROUNDS_DATA.map((_, i) => i)));
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const current = ROUNDS_DATA[order[round]];
  const correct = current.ans[isEl ? "el" : "en"];
  const options = useMemo(() => shuffleArr(current.opts[isEl ? "el" : "en"]), [round, isEl, current]);
  const prompt =
    current.mode === "syn"
      ? isEl
        ? `Βρείτε το συνώνυμο του: «${current.word.el}»`
        : `Find the synonym of: "${current.word.en}"`
      : isEl
        ? `Βρείτε το αντώνυμο του: «${current.word.el}»`
        : `Find the antonym of: "${current.word.en}"`;

  const initGame = useCallback(() => {
    setOrder(shuffleArr(ROUNDS_DATA.map((_, i) => i)));
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
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">📖 {isEl ? "Συνώνυμα & αντώνυμα" : "Synonyms & antonyms"}</p>
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
        <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
          {current.mode === "syn" ? (isEl ? "Συνώνυμο" : "Synonym") : isEl ? "Αντώνυμο" : "Antonym"}
        </p>
        <p className="text-lg sm:text-xl text-slate-800 dark:text-slate-100 mb-6">{prompt}</p>
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
