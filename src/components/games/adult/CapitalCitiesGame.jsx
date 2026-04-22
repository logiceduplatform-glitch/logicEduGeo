import React, { useState, useCallback, useMemo } from "react";

const ITEMS = [
  { q: { el: "Ποια είναι η πρωτεύουσα της Γαλλίας;", en: "What is the capital of France?" }, opts: { el: ["Παρίσι", "Λυών", "Μασσαλία", "Νίκαια"], en: ["Paris", "Lyon", "Marseille", "Nice"] }, ans: { el: "Παρίσι", en: "Paris" } },
  { q: { el: "Ποια είναι η πρωτεύουσα της Ιαπωνίας;", en: "What is the capital of Japan?" }, opts: { el: ["Τόκιο", "Οσάκα", "Κιότο", "Γιοκοχάμα"], en: ["Tokyo", "Osaka", "Kyoto", "Yokohama"] }, ans: { el: "Τόκιο", en: "Tokyo" } },
  { q: { el: "Ποια είναι η πρωτεύουσα της Αυστραλίας;", en: "What is the capital of Australia?" }, opts: { el: ["Καμπέρα", "Σίδνεϊ", "Μελβούρνη", "Περθ"], en: ["Canberra", "Sydney", "Melbourne", "Perth"] }, ans: { el: "Καμπέρα", en: "Canberra" } },
  { q: { el: "Ποια είναι η πρωτεύουσα της Βραζιλίας;", en: "What is the capital of Brazil?" }, opts: { el: ["Μπραζίλια", "Ρίο ντε Τζανέιρο", "Σάο Πάολο", "Σαλβαδόρ"], en: ["Brasília", "Rio de Janeiro", "São Paulo", "Salvador"] }, ans: { el: "Μπραζίλια", en: "Brasília" } },
  { q: { el: "Ποια είναι η πρωτεύουσα της Αιγύπτου;", en: "What is the capital of Egypt?" }, opts: { el: ["Κάιρο", "Αλεξάνδρεια", "Γκίζα", "Λούξορ"], en: ["Cairo", "Alexandria", "Giza", "Luxor"] }, ans: { el: "Κάιρο", en: "Cairo" } },
  { q: { el: "Ποια είναι η πρωτεύουσα του Καναδά;", en: "What is the capital of Canada?" }, opts: { el: ["Οτάβα", "Τορόντο", "Βανκούβερ", "Μόντρεαλ"], en: ["Ottawa", "Toronto", "Vancouver", "Montreal"] }, ans: { el: "Οτάβα", en: "Ottawa" } },
  { q: { el: "Ποια είναι η πρωτεύουσα της Ιταλίας;", en: "What is the capital of Italy?" }, opts: { el: ["Ρώμη", "Μιλάνο", "Νάπολη", "Φλωρεντία"], en: ["Rome", "Milan", "Naples", "Florence"] }, ans: { el: "Ρώμη", en: "Rome" } },
  { q: { el: "Ποια είναι η πρωτεύουσα της Ινδίας;", en: "What is the capital of India?" }, opts: { el: ["Νέο Δελχί", "Μουμπάι", "Καλκούτα", "Μπανγκαλόρ"], en: ["New Delhi", "Mumbai", "Kolkata", "Bangalore"] }, ans: { el: "Νέο Δελχί", en: "New Delhi" } },
  { q: { el: "Ποια είναι η πρωτεύουσα της Αργεντινής;", en: "What is the capital of Argentina?" }, opts: { el: ["Μπουένος Άιρες", "Κόρδοβα", "Ροσάριο", "Μεντόζα"], en: ["Buenos Aires", "Córdoba", "Rosario", "Mendoza"] }, ans: { el: "Μπουένος Άιρες", en: "Buenos Aires" } },
  { q: { el: "Ποια είναι η πρωτεύουσα της Νορβηγίας;", en: "What is the capital of Norway?" }, opts: { el: ["Όσλο", "Μπέργκεν", "Τρόντχαϊμ", "Σταβάνγκερ"], en: ["Oslo", "Bergen", "Trondheim", "Stavanger"] }, ans: { el: "Όσλο", en: "Oslo" } },
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

export default function CapitalCitiesGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [order, setOrder] = useState(() => shuffleArr(ITEMS.map((_, i) => i)));
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const current = ITEMS[order[round]];
  const correct = current.ans[isEl ? "el" : "en"];
  const options = useMemo(() => shuffleArr(current.opts[isEl ? "el" : "en"]), [round, isEl, current]);

  const initGame = useCallback(() => {
    setOrder(shuffleArr(ITEMS.map((_, i) => i)));
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
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">🌍 {isEl ? "Πρωτεύουσες" : "Capital Cities"}</p>
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
