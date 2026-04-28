import React, { useState, useContext, useMemo, useRef } from "react";
import { LanguageContext } from "../i18n/LanguageContext";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";

const WORKSHEET_TYPES = [
  {
    id: "addition",
    icon: "➕",
    name: { el: "Πρόσθεση", en: "Addition" },
    category: "math",
    generate: (count, difficulty) => {
      const max = difficulty === "easy" ? 20 : difficulty === "medium" ? 100 : 1000;
      return Array.from({ length: count }, () => {
        const a = Math.floor(Math.random() * max) + 1;
        const b = Math.floor(Math.random() * max) + 1;
        return { question: `${a} + ${b} = ___`, answer: a + b };
      });
    },
  },
  {
    id: "subtraction",
    icon: "➖",
    name: { el: "Αφαίρεση", en: "Subtraction" },
    category: "math",
    generate: (count, difficulty) => {
      const max = difficulty === "easy" ? 20 : difficulty === "medium" ? 100 : 1000;
      return Array.from({ length: count }, () => {
        const b = Math.floor(Math.random() * max) + 1;
        const a = b + Math.floor(Math.random() * max) + 1;
        return { question: `${a} − ${b} = ___`, answer: a - b };
      });
    },
  },
  {
    id: "multiplication",
    icon: "✖️",
    name: { el: "Πολλαπλασιασμός", en: "Multiplication" },
    category: "math",
    generate: (count, difficulty) => {
      const max = difficulty === "easy" ? 10 : difficulty === "medium" ? 12 : 20;
      return Array.from({ length: count }, () => {
        const a = Math.floor(Math.random() * max) + 2;
        const b = Math.floor(Math.random() * max) + 2;
        return { question: `${a} × ${b} = ___`, answer: a * b };
      });
    },
  },
  {
    id: "division",
    icon: "➗",
    name: { el: "Διαίρεση", en: "Division" },
    category: "math",
    generate: (count, difficulty) => {
      const max = difficulty === "easy" ? 10 : difficulty === "medium" ? 12 : 20;
      return Array.from({ length: count }, () => {
        const b = Math.floor(Math.random() * max) + 2;
        const answer = Math.floor(Math.random() * max) + 1;
        const a = b * answer;
        return { question: `${a} ÷ ${b} = ___`, answer };
      });
    },
  },
  {
    id: "mixed",
    icon: "🔢",
    name: { el: "Μικτές Πράξεις", en: "Mixed Operations" },
    category: "math",
    generate: (count, difficulty) => {
      const ops = ["+", "−", "×"];
      const max = difficulty === "easy" ? 15 : difficulty === "medium" ? 50 : 100;
      return Array.from({ length: count }, () => {
        const op = ops[Math.floor(Math.random() * ops.length)];
        let a, b, answer;
        if (op === "×") { a = Math.floor(Math.random() * 12) + 2; b = Math.floor(Math.random() * 12) + 2; answer = a * b; }
        else if (op === "−") { b = Math.floor(Math.random() * max) + 1; a = b + Math.floor(Math.random() * max); answer = a - b; }
        else { a = Math.floor(Math.random() * max) + 1; b = Math.floor(Math.random() * max) + 1; answer = a + b; }
        return { question: `${a} ${op} ${b} = ___`, answer };
      });
    },
  },
  {
    id: "number_patterns",
    icon: "🔗",
    name: { el: "Μοτίβα Αριθμών", en: "Number Patterns" },
    category: "math",
    generate: (count, difficulty) => {
      const step = difficulty === "easy" ? [2, 3, 5] : difficulty === "medium" ? [3, 4, 6, 7] : [7, 8, 9, 11];
      return Array.from({ length: count }, () => {
        const s = step[Math.floor(Math.random() * step.length)];
        const start = Math.floor(Math.random() * 20) + 1;
        const seq = Array.from({ length: 5 }, (_, i) => start + s * i);
        return { question: `${seq.slice(0, 4).join(", ")}, ___`, answer: seq[4] };
      });
    },
  },
  {
    id: "comparisons",
    icon: "⚖️",
    name: { el: "Συγκρίσεις (>, <, =)", en: "Comparisons (>, <, =)" },
    category: "math",
    generate: (count, difficulty) => {
      const max = difficulty === "easy" ? 20 : difficulty === "medium" ? 100 : 1000;
      return Array.from({ length: count }, () => {
        const a = Math.floor(Math.random() * max) + 1;
        const b = Math.floor(Math.random() * max) + 1;
        const answer = a > b ? ">" : a < b ? "<" : "=";
        return { question: `${a} ___ ${b}`, answer };
      });
    },
  },
  {
    id: "word_problems",
    icon: "📝",
    name: { el: "Προβλήματα", en: "Word Problems" },
    category: "math",
    generate: (count, difficulty) => {
      const templates = [
        (a, b) => ({ question: `Maria has ${a} apples. She buys ${b} more. How many does she have? ___`, answer: a + b }),
        (a, b) => ({ question: `There are ${a + b} birds. ${a} fly away. How many remain? ___`, answer: b }),
        (a, b) => ({ question: `${a} children each have ${b} stickers. Total stickers? ___`, answer: a * b }),
      ];
      return Array.from({ length: count }, () => {
        const a = Math.floor(Math.random() * 12) + 2;
        const b = Math.floor(Math.random() * 12) + 2;
        return templates[Math.floor(Math.random() * templates.length)](a, b);
      });
    },
  },
];

const T = {
  el: {
    title: "Εκτυπώσιμα Φύλλα Εργασίας",
    subtitle: "Δημιούργησε φύλλα εργασίας για εξάσκηση!",
    type: "Τύπος",
    difficulty: "Δυσκολία",
    count: "Πλήθος ασκήσεων",
    easy: "Εύκολο",
    medium: "Μέτριο",
    hard: "Δύσκολο",
    generate: "Δημιουργία",
    print: "Εκτύπωση",
    newSheet: "Νέο φύλλο",
    showAnswers: "Εμφάνιση απαντήσεων",
    hideAnswers: "Απόκρυψη απαντήσεων",
    name: "Όνομα: _______________",
    date: "Ημερομηνία: _______________",
    worksheet: "Φύλλο Εργασίας",
    answers: "Απαντήσεις",
    math: "Μαθηματικά",
  },
  en: {
    title: "Printable Worksheets",
    subtitle: "Generate practice worksheets for printing!",
    type: "Type",
    difficulty: "Difficulty",
    count: "Number of exercises",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    generate: "Generate",
    print: "Print",
    newSheet: "New sheet",
    showAnswers: "Show answers",
    hideAnswers: "Hide answers",
    name: "Name: _______________",
    date: "Date: _______________",
    worksheet: "Worksheet",
    answers: "Answers",
    math: "Math",
  },
};

export default function PrintableWorksheetsPage() {
  const { lang } = useContext(LanguageContext);
  const l = T[lang] || T.en;
  const isEl = lang === "el";
  const printRef = useRef(null);

  const [selectedType, setSelectedType] = useState("addition");
  const [difficulty, setDifficulty] = useState("easy");
  const [count, setCount] = useState(15);
  const [exercises, setExercises] = useState(null);
  const [showAnswers, setShowAnswers] = useState(false);

  const wsType = WORKSHEET_TYPES.find(w => w.id === selectedType);

  const handleGenerate = () => {
    if (!wsType) return;
    setExercises(wsType.generate(count, difficulty));
    setShowAnswers(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <Navbar />
      <SEO title={l.title} />

      <div className="pt-20 pb-12 px-4 print:pt-0 print:px-0">
        <div className="mx-auto max-w-3xl">
          {/* Controls - hidden when printing */}
          <div className="print:hidden space-y-6 mb-8">
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white mb-2">🖨️ {l.title}</h1>
              <p className="text-slate-500 dark:text-slate-400">{l.subtitle}</p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-700 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">{l.type}</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {WORKSHEET_TYPES.map(wt => (
                    <button key={wt.id} onClick={() => setSelectedType(wt.id)} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${selectedType === wt.id ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border-2 border-indigo-400" : "bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600"}`}>
                      <span>{wt.icon}</span>
                      <span className="truncate">{isEl ? wt.name.el : wt.name.en}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">{l.difficulty}</label>
                  <div className="flex gap-2">
                    {["easy", "medium", "hard"].map(d => (
                      <button key={d} onClick={() => setDifficulty(d)} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${difficulty === d ? "bg-indigo-500 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"}`}>
                        {l[d]}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">{l.count}</label>
                  <select value={count} onChange={e => setCount(Number(e.target.value))} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white outline-none">
                    {[10, 15, 20, 25, 30].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </div>

              <button onClick={handleGenerate} className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold shadow-md hover:shadow-lg transition-all text-lg">
                ✨ {l.generate}
              </button>
            </div>
          </div>

          {/* Worksheet preview / print area */}
          {exercises && (
            <>
              <div className="print:hidden flex gap-3 justify-center mb-4">
                <button onClick={handlePrint} className="px-6 py-2.5 rounded-xl bg-emerald-500 text-white font-bold shadow-md hover:shadow-lg transition-all">
                  🖨️ {l.print}
                </button>
                <button onClick={() => setShowAnswers(!showAnswers)} className="px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold">
                  {showAnswers ? l.hideAnswers : l.showAnswers}
                </button>
                <button onClick={handleGenerate} className="px-6 py-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold">
                  🔄 {l.newSheet}
                </button>
              </div>

              <div ref={printRef} className="bg-white dark:bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-slate-100 dark:border-slate-100 print:shadow-none print:border-none print:rounded-none print:p-4">
                {/* Header */}
                <div className="text-center border-b-2 border-slate-300 pb-4 mb-6">
                  <h2 className="text-xl font-bold text-slate-800">{l.worksheet}: {wsType && (isEl ? wsType.name.el : wsType.name.en)}</h2>
                  <div className="flex justify-between mt-3 text-sm text-slate-500">
                    <span>{l.name}</span>
                    <span>{l.date}</span>
                  </div>
                </div>

                {/* Exercises */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  {exercises.map((ex, i) => (
                    <div key={i} className="flex items-baseline gap-2 py-1.5 border-b border-dotted border-slate-200">
                      <span className="text-sm font-bold text-slate-400 w-6 text-right shrink-0">{i + 1}.</span>
                      <span className="text-base text-slate-800 font-medium">{ex.question}</span>
                    </div>
                  ))}
                </div>

                {/* Answers (only when toggled or for print) */}
                {showAnswers && (
                  <div className="mt-8 pt-4 border-t-2 border-slate-300">
                    <h3 className="text-sm font-bold text-slate-500 mb-2">{l.answers}:</h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                      {exercises.map((ex, i) => (
                        <span key={i}><strong>{i + 1}.</strong> {ex.answer}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        @media print {
          body > *:not(#root) { display: none !important; }
          nav, .print\\:hidden { display: none !important; }
          .print\\:pt-0 { padding-top: 0 !important; }
          .print\\:px-0 { padding-left: 0 !important; padding-right: 0 !important; }
        }
      `}</style>
    </div>
  );
}
