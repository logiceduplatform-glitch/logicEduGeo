import React, { useState, useCallback, useMemo } from "react";

const CHAINS = [
  { word: { el: "ΚΑΦΕΣ", en: "COFFEE" }, opts: { el: ["ΣΚΥΛΟΣ", "ΠΟΤΑ", "ΜΗΛΟ", "ΤΡΙΑ"], en: ["EAGLE", "SUNNY", "TABLE", "RADIO"] }, ans: { el: "ΣΚΥΛΟΣ", en: "EAGLE" } },
  { word: { el: "ΝΕΡΟ", en: "WATER" }, opts: { el: ["ΟΥΡΑΝΟΣ", "ΑΛΑΤΙ", "ΠΕΤΡΑ", "ΚΑΡΠΟΣ"], en: ["RIVER", "RABBIT", "CANDLE", "OCEAN"] }, ans: { el: "ΟΥΡΑΝΟΣ", en: "RIVER" } },
  { word: { el: "ΛΟΥΛΟΥΔΙ", en: "FLOWER" }, opts: { el: ["ΙΣΤΟΡΙΑ", "ΝΕΡΟ", "ΠΑΓΟΣ", "ΚΥΜΑ"], en: ["RIDDLE", "OCEAN", "TABLE", "LION"] }, ans: { el: "ΙΣΤΟΡΙΑ", en: "RIDDLE" } },
  { word: { el: "ΜΗΛΟ", en: "APPLE" }, opts: { el: ["ΟΡΑΜΑ", "ΑΛΑΤΙ", "ΝΕΡΟ", "ΚΑΡΠΟΣ"], en: ["EAGLE", "EMPTY", "OCEAN", "UNCLE"] }, ans: { el: "ΟΡΑΜΑ", en: "EAGLE" } },
  { word: { el: "ΣΚΥΛΟΣ", en: "DOG" }, opts: { el: ["ΣΑΛΑΤΑ", "ΠΟΤΑ", "ΜΗΛΟ", "ΑΛΦΑ"], en: ["GIRAFFE", "EAGLE", "TIGER", "LION"] }, ans: { el: "ΣΑΛΑΤΑ", en: "GIRAFFE" } },
  { word: { el: "ΣΑΛΑΤΑ", en: "SALAD" }, opts: { el: ["ΑΘΗΝΑ", "ΝΕΡΟ", "ΠΕΤΡΑ", "ΚΥΜΑ"], en: ["DANCE", "RABBIT", "CANDLE", "OCEAN"] }, ans: { el: "ΑΘΗΝΑ", en: "DANCE" } },
  { word: { el: "ΑΘΗΝΑ", en: "ATHENS" }, opts: { el: ["ΑΕΡΑΣ", "ΝΕΡΟ", "ΠΕΤΡΑ", "ΚΑΡΠΟΣ"], en: ["SNAKE", "RABBIT", "TABLE", "OCEAN"] }, ans: { el: "ΑΕΡΑΣ", en: "SNAKE" } },
  { word: { el: "ΑΕΡΑΣ", en: "SNAKE" }, opts: { el: ["ΣΠΙΤΙ", "ΠΟΤΑ", "ΜΗΛΟ", "ΤΡΙΑ"], en: ["EAGLE", "TIGER", "LION", "UNCLE"] }, ans: { el: "ΣΠΙΤΙ", en: "EAGLE" } },
  { word: { el: "ΝΗΣΙ", en: "ISLAND" }, opts: { el: ["ΙΣΤΟΡΙΑ", "ΝΕΡΟ", "ΠΑΓΟΣ", "ΚΥΜΑ"], en: ["DANCE", "RABBIT", "CANDLE", "OCEAN"] }, ans: { el: "ΙΣΤΟΡΙΑ", en: "DANCE" } },
  { word: { el: "ΒΙΒΛΙΟ", en: "BOOK" }, opts: { el: ["ΟΥΡΑΝΟΣ", "ΑΛΑΤΙ", "ΠΕΤΡΑ", "ΚΑΡΠΟΣ"], en: ["KANGAROO", "EAGLE", "TIGER", "LION"] }, ans: { el: "ΟΥΡΑΝΟΣ", en: "KANGAROO" } },
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

function lastLetter(w) {
  const s = w.trim().toUpperCase();
  return s[s.length - 1];
}

export default function ChainWordsGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [order, setOrder] = useState(() => shuffleArr(CHAINS.map((_, i) => i)));
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const current = CHAINS[order[round]];
  const w = current.word[isEl ? "el" : "en"];
  const letter = lastLetter(w);
  const correct = current.ans[isEl ? "el" : "en"];
  const options = useMemo(() => shuffleArr(current.opts[isEl ? "el" : "en"]), [round, isEl, current]);

  const initGame = useCallback(() => {
    setOrder(shuffleArr(CHAINS.map((_, i) => i)));
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
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">🔗 {isEl ? "Αλυσίδα λέξεων" : "Word chain"}</p>
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
        <p className="text-slate-600 dark:text-slate-400 mb-2 text-sm">
          {isEl ? "Η επόμενη λέξη ξεκινά από το τελευταίο γράμμα:" : "The next word starts with the last letter:"}
        </p>
        <p className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400 mb-1">{w}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          → <span className="font-mono font-bold">{letter}</span>…
        </p>
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
                className={`w-full py-3 px-4 rounded-xl text-left font-mono font-semibold transition border-2 ${
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
