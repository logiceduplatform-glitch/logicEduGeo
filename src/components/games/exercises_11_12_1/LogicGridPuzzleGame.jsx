import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import useSafeTimeout from "../../../hooks/useSafeTimeout";
import { VoiceService } from "../../../services/VoiceService";

const PUZZLES = {
  el: [
    {
      scenario: "Τρεις φίλοι — Μαρία, Νίκος και Ελένη — κάθονται σε μια σειρά. Η Μαρία δεν κάθεται στη μέση. Ο Νίκος κάθεται δίπλα στην Ελένη.",
      question: "Ποιος κάθεται στη μέση;",
      options: ["Μαρία", "Νίκος", "Ελένη"],
      answer: "Ελένη",
      hint: "Αν η Μαρία δεν είναι στη μέση και ο Νίκος είναι δίπλα στην Ελένη...",
    },
    {
      scenario: "Τέσσερα ζώα — γάτα, σκύλος, ψάρι, πουλί — ζουν σε διαφορετικά μέρη. Το ψάρι ζει στο νερό. Το πουλί ζει ψηλά. Η γάτα δεν ζει έξω.",
      question: "Ποιο ζώο ζει στον κήπο;",
      options: ["Γάτα", "Σκύλος", "Ψάρι", "Πουλί"],
      answer: "Σκύλος",
      hint: "Ψάρι=νερό, Πουλί=δέντρο, Γάτα=μέσα...",
    },
    {
      scenario: "Η Άννα είναι πιο ψηλή από τον Γιώργο. Ο Γιώργος είναι πιο ψηλός από τη Σοφία. Η Κατερίνα είναι πιο κοντή από τη Σοφία.",
      question: "Ποιος είναι ο πιο κοντός;",
      options: ["Άννα", "Γιώργος", "Σοφία", "Κατερίνα"],
      answer: "Κατερίνα",
      hint: "Σκέψου: Άννα > Γιώργος > Σοφία > ...",
    },
    {
      scenario: "Σε ένα σχολείο, 3 μαθητές — Αλέξης, Βασίλης, Γιάννης — παίζουν 3 αθλήματα: ποδόσφαιρο, μπάσκετ, κολύμβηση. Ο Αλέξης δεν κολυμπάει. Ο Βασίλης παίζει μπάσκετ.",
      question: "Τι παίζει ο Γιάννης;",
      options: ["Ποδόσφαιρο", "Μπάσκετ", "Κολύμβηση"],
      answer: "Κολύμβηση",
      hint: "Βασίλης=μπάσκετ, Αλέξης≠κολύμβηση...",
    },
    {
      scenario: "Πέντε σπίτια σε μια σειρά — κόκκινο, μπλε, πράσινο, κίτρινο, λευκό. Το μπλε είναι δίπλα στο κόκκινο. Το πράσινο δεν είναι στις άκρες. Το κίτρινο είναι πρώτο.",
      question: "Ποιο σπίτι είναι στη μέση;",
      options: ["Κόκκινο", "Μπλε", "Πράσινο", "Κίτρινο", "Λευκό"],
      answer: "Πράσινο",
      hint: "Κίτρινο=1ο, Πράσινο≠άκρες, δηλαδή 2ο, 3ο ή 4ο...",
    },
    {
      scenario: "Τρεις αδερφές — Δήμητρα, Εύα, Ζωή — αγαπούν 3 χρώματα: ροζ, γαλάζιο, μοβ. Η Δήμητρα δεν αγαπάει το ροζ. Η Ζωή αγαπάει το μοβ.",
      question: "Ποιο χρώμα αγαπάει η Δήμητρα;",
      options: ["Ροζ", "Γαλάζιο", "Μοβ"],
      answer: "Γαλάζιο",
      hint: "Ζωή=μοβ, Δήμητρα≠ροζ...",
    },
  ],
  en: [
    {
      scenario: "Three friends — Maria, Nick, and Elena — sit in a row. Maria doesn't sit in the middle. Nick sits next to Elena.",
      question: "Who sits in the middle?",
      options: ["Maria", "Nick", "Elena"],
      answer: "Elena",
      hint: "If Maria isn't in the middle and Nick is next to Elena...",
    },
    {
      scenario: "Four animals — cat, dog, fish, bird — live in different places. Fish lives in water. Bird lives high up. Cat doesn't live outside.",
      question: "Which animal lives in the garden?",
      options: ["Cat", "Dog", "Fish", "Bird"],
      answer: "Dog",
      hint: "Fish=water, Bird=tree, Cat=inside...",
    },
    {
      scenario: "Anna is taller than George. George is taller than Sofia. Katerina is shorter than Sofia.",
      question: "Who is the shortest?",
      options: ["Anna", "George", "Sofia", "Katerina"],
      answer: "Katerina",
      hint: "Think: Anna > George > Sofia > ...",
    },
    {
      scenario: "Three students — Alex, Bill, John — play 3 sports: football, basketball, swimming. Alex doesn't swim. Bill plays basketball.",
      question: "What does John play?",
      options: ["Football", "Basketball", "Swimming"],
      answer: "Swimming",
      hint: "Bill=basketball, Alex≠swimming...",
    },
    {
      scenario: "Five houses in a row — red, blue, green, yellow, white. Blue is next to red. Green is not at the edges. Yellow is first.",
      question: "Which house is in the middle?",
      options: ["Red", "Blue", "Green", "Yellow", "White"],
      answer: "Green",
      hint: "Yellow=1st, Green≠edges, so 2nd, 3rd, or 4th...",
    },
    {
      scenario: "Three sisters — Diana, Eve, Zoe — love 3 colors: pink, light blue, purple. Diana doesn't love pink. Zoe loves purple.",
      question: "What color does Diana love?",
      options: ["Pink", "Light Blue", "Purple"],
      answer: "Light Blue",
      hint: "Zoe=purple, Diana≠pink...",
    },
  ],
};

export default function LogicGridPuzzleGame({ lang = "el", onComplete, difficulty = 3 }) {
  const { safeTimeout } = useSafeTimeout();
  const isEl = lang === "el";
  const puzzles = PUZZLES[isEl ? "el" : "en"];

  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const correctRef = useRef(null);
  const wrongRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const puzzle = puzzles[round % puzzles.length];
  const TARGET_ROUNDS = puzzles.length;

  useEffect(() => {
    correctRef.current = new Audio("/sounds/correct.mp3");
    wrongRef.current = new Audio("/sounds/wrong.mp3");
  }, []);

  useEffect(() => {
    VoiceService.speak(puzzle.scenario, lang);
  }, [round]);

  const handleAnswer = (opt) => {
    if (showResult) return;
    setSelected(opt);
    setShowResult(true);
    const correct = opt === puzzle.answer;

    if (correct) {
      correctRef.current?.play();
      setScore(prev => prev + 1);
    } else {
      wrongRef.current?.play();
    }

    updateProgress({ title: "logicGridPuzzleGame", score: score + (correct ? 1 : 0), total: TARGET_ROUNDS, index: round + 1 });

    safeTimeout(() => {
      if (round + 1 >= TARGET_ROUNDS) {
        setShowCelebration(true);
        const final = score + (correct ? 1 : 0);
        completeQuiz({ title: "logicGridPuzzleGame", score: final, total: TARGET_ROUNDS });
        safeTimeout(() => onComplete?.({ score: final, total: TARGET_ROUNDS }), 2500);
      } else {
        setRound(prev => prev + 1);
        setSelected(null);
        setShowResult(false);
        setShowHint(false);
      }
    }, 2000);
  };

  if (showCelebration) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4 animate-[fadeIn_0.5s]">
        <span className="text-7xl">🧩</span>
        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{isEl ? "Μπράβο!" : "Well done!"}</h2>
        <p className="text-lg text-slate-600 dark:text-slate-400">{isEl ? `Σκόρ: ${score}/${TARGET_ROUNDS}` : `Score: ${score}/${TARGET_ROUNDS}`}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 p-2 sm:p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{isEl ? "Λογικό Γρίφο" : "Logic Grid"} 🧩</span>
          <span className="text-sm font-bold text-slate-500">{round + 1}/{TARGET_ROUNDS}</span>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-lg border border-slate-200 dark:border-slate-700 mb-4">
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">{puzzle.scenario}</p>
          <p className="text-base font-bold text-slate-800 dark:text-slate-100">{puzzle.question}</p>
        </div>

        {showHint && (
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3 mb-3 text-sm text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-700">
            💡 {puzzle.hint}
          </div>
        )}

        <div className="space-y-2 mb-4">
          {puzzle.options.map(opt => {
            const isCorrect = opt === puzzle.answer;
            const isSel = selected === opt;
            return (
              <button key={opt} onClick={() => handleAnswer(opt)} disabled={showResult}
                className={[
                  "w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all border-2 text-left",
                  showResult && isCorrect ? "bg-emerald-100 dark:bg-emerald-900/40 border-emerald-400 text-emerald-700 dark:text-emerald-300"
                    : showResult && isSel ? "bg-red-100 dark:bg-red-900/40 border-red-400 text-red-700 dark:text-red-300"
                    : "bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-purple-400",
                ].join(" ")}>
                {opt}
              </button>
            );
          })}
        </div>

        {!showResult && (
          <button onClick={() => setShowHint(true)} className="px-4 py-2 rounded-xl bg-amber-400 text-amber-900 text-sm font-bold mx-auto block">
            💡 {isEl ? "Βοήθεια" : "Hint"}
          </button>
        )}

        <div className="flex justify-center mt-3 text-sm font-semibold">
          <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-700">⭐ {score}/{TARGET_ROUNDS}</span>
        </div>
      </div>
      <style>{`@keyframes fadeIn { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} }`}</style>
    </div>
  );
}
