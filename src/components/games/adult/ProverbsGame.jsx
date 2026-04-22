import React, { useState, useCallback, useMemo } from "react";

const PROVERBS = [
  {
    start: { el: "Η καλή μέρα από το πρωί φαίνεται", en: "A good day shows itself from the morning" },
    opts: { el: ["κι ο καλός ο φίλος από τα δύσκολα", "φέρνει και βροχή", "δεν έχει τέλος", "είναι πάντα Δευτέρα"], en: ["and a true friend in hard times", "brings rain too", "never ends", "is always Monday"] },
    ans: { el: "κι ο καλός ο φίλος από τα δύσκολα", en: "and a true friend in hard times" },
  },
  {
    start: { el: "Όποιος δεν θέλει να ζυμώσει", en: "Whoever does not want to knead dough" },
    opts: { el: ["πέντε μέρες κοσκινίζει", "τρώει ψωμί", "κοιμάται νωρίς", "βρίσκει λύση"], en: ["sifts for five days", "eats bread", "sleeps early", "finds a solution"] },
    ans: { el: "πέντε μέρες κοσκινίζει", en: "sifts for five days" },
  },
  {
    start: { el: "Η σιωπή είναι", en: "Silence is" },
    opts: { el: ["χρυσός", "ασημένιος", "σιδερένιος", "ξύλινος"], en: ["golden", "silver", "iron", "wooden"] },
    ans: { el: "χρυσός", en: "golden" },
  },
  {
    start: { el: "Όταν λείπει η γάτα", en: "When the cat is away" },
    opts: { el: ["χορεύουν τα ποντίκια", "κοιμούνται όλοι", "βρέχει πάντα", "έρχεται ο σκύλος"], en: ["the mice dance", "everyone sleeps", "it always rains", "the dog arrives"] },
    ans: { el: "χορεύουν τα ποντίκια", en: "the mice dance" },
  },
  {
    start: { el: "Χτύπα σίδερο", en: "Strike the iron" },
    opts: { el: ["όταν είναι καυτό", "όταν κρυώνει", "το πρωί μόνο", "με ξύλινο σφυρί"], en: ["while it is hot", "when it is cold", "only in the morning", "with a wooden hammer"] },
    ans: { el: "όταν είναι καυτό", en: "while it is hot" },
  },
  {
    start: { el: "Μια εικόνα", en: "A picture" },
    opts: { el: ["χίλιες λέξεις", "ένα βιβλίο", "μια ώρα", "ένα τραγούδι"], en: ["is worth a thousand words", "is a book", "is an hour", "is a song"] },
    ans: { el: "χίλιες λέξεις", en: "is worth a thousand words" },
  },
  {
    start: { el: "Όπου λαλούν πολλοί", en: "Where many sing" },
    opts: { el: ["κοκκορεύει ο πετεινός", "σωπαίνει ο κόσμος", "βρέχει δυνατά", "λείπει η μουσική"], en: ["the rooster crows", "the world is silent", "it rains hard", "music is missing"] },
    ans: { el: "κοκκορεύει ο πετεινός", en: "the rooster crows" },
  },
  {
    start: { el: "Τα πολλά λόγια είναι", en: "Too many words are" },
    opts: { el: ["φτώχεια", "πλούτος", "τύχη", "δύναμη"], en: ["poverty", "wealth", "luck", "strength"] },
    ans: { el: "φτώχεια", en: "poverty" },
  },
  {
    start: { el: "Όποιος έχει τη νύφη", en: "Whoever has the bride" },
    opts: { el: ["χορεύει", "τραγουδάει", "φεύγει", "κοιμάται"], en: ["dances", "sings", "leaves", "sleeps"] },
    ans: { el: "χορεύει", en: "dances" },
  },
  {
    start: { el: "Αγάλι αγάλι", en: "Slowly slowly" },
    opts: { el: ["γίνεται η αγουρίδα μέλι", "τρέχει ο λαγός", "χάνεται ο χρόνος", "έρχεται το κακό"], en: ["the unripe grape becomes honey", "the hare runs", "time is lost", "evil comes"] },
    ans: { el: "γίνεται η αγουρίδα μέλι", en: "the unripe grape becomes honey" },
  },
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

export default function ProverbsGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [order, setOrder] = useState(() => shuffleArr(PROVERBS.map((_, i) => i)));
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const current = PROVERBS[order[round]];
  const correct = current.ans[isEl ? "el" : "en"];
  const options = useMemo(() => shuffleArr(current.opts[isEl ? "el" : "en"]), [round, isEl, current]);

  const initGame = useCallback(() => {
    setOrder(shuffleArr(PROVERBS.map((_, i) => i)));
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
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">📜 {isEl ? "Παροιμίες" : "Proverbs"}</p>
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
        <p className="text-slate-600 dark:text-slate-400 mb-2 text-sm">{isEl ? "Συμπληρώστε την παροιμία:" : "Complete the proverb:"}</p>
        <p className="text-lg sm:text-xl text-slate-800 dark:text-slate-100 mb-2 font-medium">{current.start[isEl ? "el" : "en"]}</p>
        <p className="text-slate-500 dark:text-slate-400 mb-6 text-2xl">…</p>
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
                className={`w-full py-3 px-4 rounded-xl text-left font-medium transition border-2 text-sm sm:text-base ${
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
