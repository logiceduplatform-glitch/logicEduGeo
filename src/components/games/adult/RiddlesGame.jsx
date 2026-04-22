import React, { useState, useCallback, useMemo } from "react";

const RIDDLES = [
  {
    q: { el: "Έχω δείκτες αλλά δε χτυπάω παλαμάκια. Τι είμαι;", en: "I have hands but can't clap. What am I?" },
    opts: { el: ["Ρολόι", "Γάτα", "Δέντρο", "Βιβλίο"], en: ["Clock", "Cat", "Tree", "Book"] },
    ans: { el: "Ρολόι", en: "Clock" },
  },
  {
    q: { el: "Όσο περισσότερο παίρνεις, τόσο μεγαλύτερο γίνεται. Τι είναι;", en: "The more you take, the larger it becomes. What is it?" },
    opts: { el: ["Τρύπα", "Πέτρα", "Νερό", "Φωτιά"], en: ["A hole", "A stone", "Water", "Fire"] },
    ans: { el: "Τρύπα", en: "A hole" },
  },
  {
    q: { el: "Τρέχω χωρίς πόδια και κλαίω χωρίς μάτια. Τι είμαι;", en: "I run without legs and cry without eyes. What am I?" },
    opts: { el: ["Σύννεφο", "Ποτάμι", "Άνεμος", "Βροχή"], en: ["Cloud", "River", "Wind", "Rain"] },
    ans: { el: "Σύννεφο", en: "Cloud" },
  },
  {
    q: { el: "Έχω κλειδαριά αλλά δεν έχω πόρτα. Τι είμαι;", en: "I have a lock but no door. What am I?" },
    opts: { el: ["Πληκτρολόγιο", "Αυτοκίνητο", "Σπίτι", "Κλειδί"], en: ["Keyboard", "Car", "House", "Key"] },
    ans: { el: "Πληκτρολόγιο", en: "Keyboard" },
  },
  {
    q: { el: "Όσο πιο πολύ ξεφορτώνεις, τόσο πιο ελαφρύ γίνεται. Τι είναι;", en: "The more you unload, the lighter it gets. What is it?" },
    opts: { el: ["Σκάφος", "Σακίδιο", "Αυτοκίνητο", "Φορτηγό"], en: ["Ship", "Backpack", "Car", "Truck"] },
    ans: { el: "Σκάφος", en: "Ship" },
  },
  {
    q: { el: "Με σπάς χωρίς να με αγγίξεις. Τι είμαι;", en: "You break me without touching me. What am I?" },
    opts: { el: ["Υπόσχεση", "Γυαλί", "Πάγος", "Καρδιά"], en: ["A promise", "Glass", "Ice", "Heart"] },
    ans: { el: "Υπόσχεση", en: "A promise" },
  },
  {
    q: { el: "Έχω κεφάλι και ουρά αλλά δεν έχω σώμα. Τι είμαι;", en: "I have a head and a tail but no body. What am I?" },
    opts: { el: ["Νόμισμα", "Φίδι", "Δράκος", "Ψάρι"], en: ["A coin", "Snake", "Dragon", "Fish"] },
    ans: { el: "Νόμισμα", en: "A coin" },
  },
  {
    q: { el: "Με τρως πριν με φας. Τι είμαι;", en: "You eat me before you eat me. What am I?" },
    opts: { el: ["Πιρούνι", "Ψωμί", "Σούπα", "Επιδόρπιο"], en: ["Fork", "Bread", "Soup", "Dessert"] },
    ans: { el: "Πιρούνι", en: "Fork" },
  },
  {
    q: { el: "Φτάνω παντού χωρίς να κουνηθώ. Τι είμαι;", en: "I get everywhere without moving. What am I?" },
    opts: { el: ["Φως", "Πουλί", "Άνεμος", "Σκιά"], en: ["Light", "Bird", "Wind", "Shadow"] },
    ans: { el: "Φως", en: "Light" },
  },
  {
    q: { el: "Έχω πολλά δόντια αλλά δεν μασάω. Τι είμαι;", en: "I have many teeth but I don't chew. What am I?" },
    opts: { el: ["Χτένα", "Καρχαρίας", "Πριόνι", "Τροχός"], en: ["Comb", "Shark", "Saw", "Gear"] },
    ans: { el: "Χτένα", en: "Comb" },
  },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function RiddlesGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [order, setOrder] = useState(() => shuffle(RIDDLES.map((_, i) => i)));
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const idx = order[round];
  const current = RIDDLES[idx];
  const correct = current.ans[isEl ? "el" : "en"];
  const options = useMemo(() => shuffle(current.opts[isEl ? "el" : "en"]), [idx, isEl]);

  const initGame = useCallback(() => {
    setOrder(shuffle(RIDDLES.map((_, i) => i)));
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
    if (round >= RIDDLES.length - 1) {
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
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">🧩 {isEl ? "Γρίφοι" : "Riddles"}</p>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {isEl ? "Σκορ" : "Score"}: {score} / {RIDDLES.length}
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
            {isEl ? "Γύρος" : "Round"} {round + 1}/{RIDDLES.length}
          </span>
          <span>
            {isEl ? "Σκορ" : "Score"}: {score}
          </span>
        </div>
        <p className="text-lg sm:text-xl text-slate-800 dark:text-slate-100 mb-6 leading-relaxed">{current.q[isEl ? "el" : "en"]}</p>
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
            {round >= RIDDLES.length - 1 ? (isEl ? "Τέλος" : "Finish") : isEl ? "Επόμενο" : "Next"}
          </button>
        )}
      </div>
    </div>
  );
}
