import React, { useState, useEffect, useCallback } from "react";

function shuffled(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function genMathQ() {
  const ops = ["+", "-", "×"];
  const op = ops[Math.floor(Math.random() * 3)];
  let a, b, ans;
  if (op === "+") { a = Math.floor(Math.random() * 50) + 10; b = Math.floor(Math.random() * 50) + 10; ans = a + b; }
  else if (op === "-") { a = Math.floor(Math.random() * 50) + 20; b = Math.floor(Math.random() * a) + 1; ans = a - b; }
  else { a = Math.floor(Math.random() * 12) + 2; b = Math.floor(Math.random() * 12) + 2; ans = a * b; }
  const opts = new Set([ans]);
  while (opts.size < 4) { opts.add(Math.max(0, ans + Math.floor(Math.random() * 10) - 5)); }
  return { question: `${a} ${op} ${b} = ?`, answer: ans, options: shuffled([...opts]) };
}

function genWordQ(isEl) {
  const words = isEl
    ? ["ΕΛΛΑΔΑ","ΘΑΛΑΣΣΑ","ΜΟΥΣΙΚΗ","ΗΛΙΟΣ","ΒΙΒΛΙΟ","ΚΟΣΜΟΣ","ΠΛΑΝΗΤΗΣ","ΦΙΛΟΣ"]
    : ["PLANET","CASTLE","FOREST","GARDEN","WONDER","SPIRIT","BRIDGE","GUITAR"];
  const w = words[Math.floor(Math.random() * words.length)];
  const scrambled = shuffled(w.split("")).join("");
  return { question: scrambled, answer: w, options: shuffled([w, ...shuffled(words.filter(x => x !== w)).slice(0, 3)]) };
}

function genTriviaQ(isEl) {
  const qs = isEl
    ? [
        { q: "Ποια είναι η πρωτεύουσα της Ιαπωνίας;", a: "Τόκιο", o: ["Τόκιο","Πεκίνο","Σεούλ","Μπανγκόκ"] },
        { q: "Πόσα πόδια έχει η αράχνη;", a: "8", o: ["6","8","10","12"] },
        { q: "Ποιος ανακάλυψε τη βαρύτητα;", a: "Νεύτων", o: ["Αϊνστάιν","Νεύτων","Γαλιλαίος","Τέσλα"] },
      ]
    : [
        { q: "Capital of Japan?", a: "Tokyo", o: ["Tokyo","Beijing","Seoul","Bangkok"] },
        { q: "How many legs does a spider have?", a: "8", o: ["6","8","10","12"] },
        { q: "Who discovered gravity?", a: "Newton", o: ["Einstein","Newton","Galileo","Tesla"] },
      ];
  const q = qs[Math.floor(Math.random() * qs.length)];
  return { question: q.q, answer: q.a, options: shuffled(q.o) };
}

function genPatternQ() {
  const patterns = [
    { seq: [2, 5, 8, 11], next: 14, opts: [12, 13, 14, 15] },
    { seq: [3, 6, 12, 24], next: 48, opts: [36, 42, 48, 54] },
    { seq: [1, 4, 9, 16], next: 25, opts: [20, 23, 25, 30] },
    { seq: [1, 1, 2, 3, 5], next: 8, opts: [6, 7, 8, 10] },
  ];
  const p = patterns[Math.floor(Math.random() * patterns.length)];
  return { question: p.seq.join(", ") + ", ?", answer: p.next, options: shuffled(p.opts) };
}

const DAY_TYPES = ["math", "words", "memory", "logic", "trivia", "pattern", "mixed"];
const DAY_LABELS = {
  el: ["Δευτέρα: Μαθηματικά","Τρίτη: Λέξεις","Τετάρτη: Μνήμη","Πέμπτη: Λογική","Παρασκευή: Trivia","Σάββατο: Μοτίβα","Κυριακή: Mix"],
  en: ["Monday: Math","Tuesday: Words","Wednesday: Memory","Thursday: Logic","Friday: Trivia","Saturday: Patterns","Sunday: Mixed"],
};
const DAY_ICONS = ["🔢","📝","🧠","🧩","❓","🔄","🎲"];

export default function DailyChallengeGame({ lang = "el" }) {
  const isEl = lang === "el";
  const dayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
  const dayType = DAY_TYPES[dayIndex];

  const [round, setRound] = useState(0);
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const TARGET_ROUNDS = 10;

  const generateQ = useCallback(() => {
    let type = dayType;
    if (type === "mixed") type = ["math","words","trivia","pattern"][Math.floor(Math.random() * 4)];
    if (type === "memory") type = "math";
    if (type === "logic") type = "trivia";

    switch (type) {
      case "math": return genMathQ();
      case "words": return genWordQ(isEl);
      case "trivia": return genTriviaQ(isEl);
      case "pattern": return genPatternQ();
      default: return genMathQ();
    }
  }, [dayType, isEl]);

  useEffect(() => { setQuestion(generateQ()); }, []);

  const handleAnswer = (ans) => {
    if (selected !== null) return;
    setSelected(ans);
    if (ans === question.answer) setScore(prev => prev + 1);

    setTimeout(() => {
      if (round + 1 >= TARGET_ROUNDS) {
        setGameOver(true);
      } else {
        setRound(prev => prev + 1);
        setQuestion(generateQ());
        setSelected(null);
      }
    }, 1200);
  };

  const restart = () => {
    setRound(0);
    setScore(0);
    setGameOver(false);
    setSelected(null);
    setQuestion(generateQ());
  };

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <span className="text-7xl">📅</span>
        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{isEl ? "Ημερήσια Πρόκληση Ολοκληρώθηκε!" : "Daily Challenge Complete!"}</h2>
        <p className="text-lg text-slate-600 dark:text-slate-400">{isEl ? `Σκόρ: ${score}/${TARGET_ROUNDS}` : `Score: ${score}/${TARGET_ROUNDS}`}</p>
        <button onClick={restart} className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold shadow-lg hover:scale-105 transition-transform">
          {isEl ? "Ξανά Παίξτε" : "Play Again"}
        </button>
      </div>
    );
  }

  if (!question) return null;

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{isEl ? "Ημερήσια Πρόκληση" : "Daily Challenge"} 📅</span>
          <span className="text-sm font-bold text-slate-500">{round + 1}/{TARGET_ROUNDS}</span>
        </div>

        <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl p-3 mb-4 text-center">
          <span className="text-lg">{DAY_ICONS[dayIndex]}</span>
          <span className="ml-2 font-semibold text-sm text-purple-700 dark:text-purple-300">{DAY_LABELS[isEl ? "el" : "en"][dayIndex]}</span>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 text-center mb-4">
          <p className="text-xl font-bold text-slate-800 dark:text-slate-100 font-mono">{question.question}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {question.options.map((opt, i) => {
            const isCorrect = opt === question.answer;
            const isSel = selected === opt;
            return (
              <button key={i} onClick={() => handleAnswer(opt)} disabled={selected !== null}
                className={[
                  "px-4 py-3 rounded-xl font-semibold transition-all border-2 text-center",
                  selected !== null && isCorrect ? "bg-emerald-100 border-emerald-400 text-emerald-700 scale-105"
                    : selected !== null && isSel ? "bg-red-100 border-red-400 text-red-700"
                    : "bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-purple-400",
                ].join(" ")}>
                {opt}
              </button>
            );
          })}
        </div>

        <div className="flex justify-center mt-4 text-sm font-semibold">
          <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-700">⭐ {score}</span>
        </div>
      </div>
    </div>
  );
}
