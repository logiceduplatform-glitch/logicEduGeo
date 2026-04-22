import React, { useState, useCallback, useMemo } from "react";

const WORDS = [
  { word: { el: "ΑΣΤΡΟΝΟΜΙΑ", en: "ASTRONOMY" }, opts: { el: ["ΑΣΤΡΟΝΟΜΙΑ", "ΜΟΝΑΣΤΗΡΙ", "ΝΗΣΤΕΙΑ", "ΙΣΤΟΡΙΑ"], en: ["ASTRONOMY", "MONASTERY", "HISTORY", "SYMPHONY"] } },
  { word: { el: "ΚΑΦΕΤΕΡΙΑ", en: "CAFETERIA" }, opts: { el: ["ΚΑΦΕΤΕΡΙΑ", "ΚΑΤΑΦΥΓΙΟ", "ΚΑΡΤΕΛΑ", "ΚΑΡΑΒΙΑ"], en: ["CAFETERIA", "CARTEL", "CAREFREE", "CARTRIDGE"] } },
  { word: { el: "ΠΑΡΑΘΥΡΟ", en: "WINDOW" }, opts: { el: ["ΠΑΡΑΘΥΡΟ", "ΡΑΔΙΟΦΩΝΟ", "ΠΡΟΒΑΤΟ", "ΘΥΡΑΙΟ"], en: ["WINDOW", "WIDGET", "WISDOM", "WINTER"] } },
  { word: { el: "ΒΙΒΛΙΟΘΗΚΗ", en: "LIBRARY" }, opts: { el: ["ΒΙΒΛΙΟΘΗΚΗ", "ΒΙΟΛΟΓΙΑ", "ΒΙΒΛΙΟ", "ΘΗΚΗ"], en: ["LIBRARY", "BATTERY", "BRIEFLY", "PRIMARY"] } },
  { word: { el: "ΗΛΕΚΤΡΟΝΙΚΑ", en: "ELECTRONIC" }, opts: { el: ["ΗΛΕΚΤΡΟΝΙΚΑ", "ΗΛΕΚΤΡΙΚΑ", "ΚΛΕΙΔΙΑ", "ΝΕΡΑΙΔΑ"], en: ["ELECTRONIC", "ELECTRIC", "ECONOMIC", "ECCENTRIC"] } },
  { word: { el: "ΦΙΛΟΣΟΦΙΑ", en: "PHILOSOPHY" }, opts: { el: ["ΦΙΛΟΣΟΦΙΑ", "ΦΙΛΟΛΟΓΙΑ", "ΣΟΦΙΑ", "ΦΩΝΗ"], en: ["PHILOSOPHY", "PHYSIOLOGY", "PHONETICS", "PHILANTHROPY"] } },
  { word: { el: "ΜΟΥΣΙΚΗ", en: "MUSIC" }, opts: { el: ["ΜΟΥΣΙΚΗ", "ΚΟΥΣΙΝΑ", "ΜΟΥΣΕΙΟ", "ΣΙΚΥΑ"], en: ["MUSIC", "MAGIC", "MOSAIC", "MUSCLE"] } },
  { word: { el: "ΚΟΜΠΙΟΥΤΕΡ", en: "COMPUTER" }, opts: { el: ["ΚΟΜΠΙΟΥΤΕΡ", "ΚΟΥΠΕΡ", "ΠΕΤΡΕΛΑΙΟ", "ΚΟΥΤΙ"], en: ["COMPUTER", "COMMUTER", "COMPOSED", "COMPOUND"] } },
  { word: { el: "ΔΙΑΚΟΠΕΣ", en: "VACATION" }, opts: { el: ["ΔΙΑΚΟΠΕΣ", "ΔΙΑΚΟΣΜΟΣ", "ΚΟΠΕΣ", "ΠΕΣ"], en: ["VACATION", "LOCATION", "VOCATION", "VACUUM"] } },
  { word: { el: "ΕΠΙΣΤΗΜΗ", en: "SCIENCE" }, opts: { el: ["ΕΠΙΣΤΗΜΗ", "ΕΠΙΤΡΟΠΗ", "ΣΤΗΜΗ", "ΠΙΣΤΗ"], en: ["SCIENCE", "SILENCE", "SEQUENCE", "SENTENCE"] } },
];

function shuffle(str) {
  const chars = str.split("");
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  let s = chars.join("");
  if (s === str && str.length > 1) return shuffle(str);
  return s;
}

function shuffleArr(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const ROUNDS = 10;

export default function AnagramGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [indices, setIndices] = useState(() => shuffleArr(WORDS.map((_, i) => i)).slice(0, ROUNDS));
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [scrambleKey, setScrambleKey] = useState(0);

  const current = WORDS[indices[round]];
  const correct = current.word[isEl ? "el" : "en"];
  const scrambled = useMemo(() => shuffle(correct), [correct, scrambleKey]);
  const options = useMemo(() => shuffleArr(current.opts[isEl ? "el" : "en"]), [round, isEl, current]);

  const initGame = useCallback(() => {
    setIndices(shuffleArr(WORDS.map((_, i) => i)).slice(0, ROUNDS));
    setRound(0);
    setScore(0);
    setSelected(null);
    setGameOver(false);
    setScrambleKey((k) => k + 1);
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
    setScrambleKey((k) => k + 1);
  };

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 flex items-center justify-center">
        <div className="max-w-md w-full rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-8 text-center">
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">🔤 {isEl ? "Αναγραμματισμός" : "Anagram"}</p>
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
        <p className="text-slate-600 dark:text-slate-400 mb-2 text-sm">{isEl ? "Ξεμπερδέψτε τα γράμματα:" : "Unscramble the letters:"}</p>
        <p className="text-2xl sm:text-3xl font-mono font-bold tracking-widest text-indigo-600 dark:text-indigo-400 mb-6 break-all">{scrambled}</p>
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
