import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import useSafeTimeout from "../../../hooks/useSafeTimeout";
import { VoiceService } from "../../../services/VoiceService";

const PUZZLES = {
  el: [
    {
      scenario: "Σε μια σειρά τριών αριθμών, κάθε επόμενος είναι διπλάσιος του προηγούμενου. Ο πρώτος είναι 4.",
      question: "Ποιος είναι ο τρίτος αριθμός;",
      options: ["12", "16", "8"],
      answer: "16",
      hint: "4, μετά 8, μετά...",
    },
    {
      scenario: "Όλοι οι κύκνοι είναι λευκοί σε αυτή την ιστορία. Ένα πτηνό είναι μαύρο.",
      question: "Μπορεί να είναι κύκνος;",
      options: ["Ναι", "Όχι", "Δεν ξέρουμε"],
      answer: "Όχι",
      hint: "Όλοι οι κύκνοι λευκοί → το μαύρο δεν είναι κύκνος.",
    },
    {
      scenario: "Αν Α > Β και Β > Γ, για τους πραγματικούς αριθμούς Α, Β, Γ.",
      question: "Ποια ανισότητα είναι σίγουρα σωστή;",
      options: ["Α > Γ", "Γ > Α", "Α = Γ"],
      answer: "Α > Γ",
      hint: "Μεταβατική ιδιότητα της ανισότητας.",
    },
    {
      scenario: "Σε ένα κουτί υπάρχουν μόνο κόκκινες και πράσινες μπάλες. Δεν είναι κόκκινη.",
      question: "Τι χρώμα είναι (αν ισχύει η περιγραφή);",
      options: ["Πράσινη", "Κόκκινη", "Μπλε"],
      answer: "Πράσινη",
      hint: "Μόνο δύο χρώματα· δεν είναι κόκκινη.",
    },
    {
      scenario: "Ένα ρολόι χάνει 2 λεπτά κάθε ώρα. Μετά από 5 ώρες, συνολικά χάνει...",
      question: "Πόσα λεπτά συνολικά;",
      options: ["10", "5", "2"],
      answer: "10",
      hint: "5 × 2 λεπτά = ...",
    },
    {
      scenario: "Ο Άρης είναι πιο ψηλός από τη Βάσω. Η Βάσω είναι πιο ψηλή από τον Γιάννη. Ο Δημήτρης είναι πιο κοντός από τον Γιάννη.",
      question: "Ποιος είναι σίγουρα ο ψηλότερος;",
      options: ["Άρης", "Δημήτρης", "Γιάννης"],
      answer: "Άρης",
      hint: "Άρης > Βάσω > Γιάννης > Δημήτρης",
    },
    {
      scenario: "Κάθε κατοικίδιο σε ένα σπίτι είναι είτε σκύλος είτε γάτα. Το Ζορό δεν γαβγίζει ποτέ, αλλά νιαουρίζει.",
      question: "Τι είναι πιθανότερα το Ζορό;",
      options: ["Γάτα", "Σκύλος", "Ψάρι"],
      answer: "Γάτα",
      hint: "Νιαουρίζει → ταιριάζει σε γάτα.",
    },
    {
      scenario: "Σε έναν πίνακα 3×3, κάθε γραμμή και κάθε στήλη έχει άθροισμα 15. Το κέντρο είναι 5.",
      question: "Αν η πάνω-αριστερά γωνία είναι 8, η πάνω-δεξιά μπορεί να είναι 6 χωρίς άλλες πληροφορίες;",
      options: ["Όχι πάντα", "Ναι πάντα", "Μόνο αν 8+6=15"],
      answer: "Όχι πάντα",
      hint: "Χρειάζονται περισσότερα δεδομένα για μοναδική λύση.",
    },
    {
      scenario: "Ένα ψεύτικο νόμισμα είναι ελαφρύτερο. Έχεις ζυγαριά με δύο πλατό.",
      question: "Με μία ζύγιση σε τρία νομίσματα (1 ανά πλάτη), αν ισορροπεί, πού είναι το ψεύτικο;",
      options: ["Στο τρίτο που έμεινε έξω", "Στο αριστερό πλατό", "Στο δεξί πλατό"],
      answer: "Στο τρίτο που έμεινε έξω",
      hint: "Αν τα δύο είναι ίσα, το διαφορετικό είναι το τρίτο.",
    },
    {
      scenario: "Αν βρέχει, η αυλή είναι βρεγμένη. Η αυλή είναι βρεγμένη.",
      question: "Σίγουρα βρέχει;",
      options: ["Όχι απαραίτητα", "Ναι", "Ποτέ"],
      answer: "Όχι απαραίτητα",
      hint: "Άλλες αιτίες μπορεί να βρέχουν την αυλή.",
    },
    {
      scenario: "Ένα μοτίβο: 3, 7, 11, 15, ...",
      question: "Ποιος είναι ο επόμενος αριθμός;",
      options: ["19", "17", "20"],
      answer: "19",
      hint: "Πρόσθεσε 4 κάθε φορά.",
    },
    {
      scenario: "Δύο λογικές πρότασεις: (α) Όλα τα Α είναι Β. (β) Το Χ είναι Α.",
      question: "Τι μπορούμε να συμπεράνουμε για το Χ;",
      options: ["Το Χ είναι Β", "Το Χ δεν είναι ποτέ Β", "Τίποτα"],
      answer: "Το Χ είναι Β",
      hint: "Αν Χ είναι Α και όλα τα Α είναι Β, τότε Χ είναι Β.",
    },
  ],
  en: [
    {
      scenario: "In a sequence of three numbers, each next number is double the previous. The first is 4.",
      question: "What is the third number?",
      options: ["12", "16", "8"],
      answer: "16",
      hint: "4, then 8, then...",
    },
    {
      scenario: "In this story, all swans are white. One bird is black.",
      question: "Can it be a swan?",
      options: ["Yes", "No", "We cannot tell"],
      answer: "No",
      hint: "All swans are white, so a black bird is not a swan.",
    },
    {
      scenario: "If A > B and B > C for real numbers A, B, C.",
      question: "Which inequality is always true?",
      options: ["A > C", "C > A", "A = C"],
      answer: "A > C",
      hint: "Transitivity of inequality.",
    },
    {
      scenario: "A box has only red and green balls. This ball is not red.",
      question: "What color must it be?",
      options: ["Green", "Red", "Blue"],
      answer: "Green",
      hint: "Only two colors and it is not red.",
    },
    {
      scenario: "A clock loses 2 minutes every hour. After 5 hours, it loses...",
      question: "How many minutes in total?",
      options: ["10", "5", "2"],
      answer: "10",
      hint: "5 × 2 minutes = ...",
    },
    {
      scenario: "Aris is taller than Vasso. Vasso is taller than Yannis. Dimitris is shorter than Yannis.",
      question: "Who is definitely the tallest?",
      options: ["Aris", "Dimitris", "Yannis"],
      answer: "Aris",
      hint: "Aris > Vasso > Yannis > Dimitris",
    },
    {
      scenario: "Every pet in a house is either a dog or a cat. Zorro never barks, but meows.",
      question: "What is Zorro most likely?",
      options: ["Cat", "Dog", "Fish"],
      answer: "Cat",
      hint: "Meowing fits a cat better.",
    },
    {
      scenario: "In a 3×3 magic square, each row and column sums to 15. The center is 5.",
      question: "If the top-left is 8, can the top-right be 6 without more clues?",
      options: ["Not always", "Always", "Only if 8+6=15"],
      answer: "Not always",
      hint: "You need more information for a unique solution.",
    },
    {
      scenario: "One coin is counterfeit and lighter. You have a balance scale.",
      question: "With one weighing of three coins (one on each side), if it balances, where is the fake?",
      options: ["The third coin off the scale", "The left pan", "The right pan"],
      answer: "The third coin off the scale",
      hint: "If two match, the odd one is the third.",
    },
    {
      scenario: "If it rains, the yard is wet. The yard is wet.",
      question: "Must it be raining?",
      options: ["Not necessarily", "Yes", "Never"],
      answer: "Not necessarily",
      hint: "Other causes can wet the yard.",
    },
    {
      scenario: "A pattern: 3, 7, 11, 15, ...",
      question: "What is the next number?",
      options: ["19", "17", "20"],
      answer: "19",
      hint: "Add 4 each step.",
    },
    {
      scenario: "Two statements: (a) All A are B. (b) X is A.",
      question: "What can we conclude about X?",
      options: ["X is B", "X is never B", "Nothing"],
      answer: "X is B",
      hint: "If X is A and all A are B, then X is B.",
    },
  ],
};

export default function SimpleLogicPuzzleGame({ lang = "el", onComplete, difficulty = 3 }) {
  const { safeTimeout } = useSafeTimeout();
  const isEl = lang === "el";
  const puzzles = PUZZLES[isEl ? "el" : "en"];

  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const correctRef = useRef(null);
  const wrongRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const d = Math.max(1, Math.min(5, difficulty));
  const NEXT_DELAY = [3000, 2800, 2500, 2200, 2000][d - 1];
  const puzzle = puzzles[round];
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
    const correct = opt === puzzle.answer;
    setSelected(opt);
    setShowResult(true);

    if (correct) { correctRef.current?.play(); setScore(prev => prev + 1); }
    else { wrongRef.current?.play(); }

    updateProgress({ title: "simpleLogicPuzzleGame", score: score + (correct ? 1 : 0), total: TARGET_ROUNDS, index: round + 1 });

    safeTimeout(() => {
      if (round + 1 >= TARGET_ROUNDS) {
        setShowCelebration(true);
        const final = score + (correct ? 1 : 0);
        completeQuiz({ title: "simpleLogicPuzzleGame", score: final, total: TARGET_ROUNDS });
        safeTimeout(() => onComplete?.({ score: final, total: TARGET_ROUNDS }), 2500);
      } else {
        setRound(prev => prev + 1);
        setSelected(null);
        setShowResult(false);
        setShowHint(false);
      }
    }, NEXT_DELAY);
  };

  if (showCelebration) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4 animate-[fadeIn_0.5s]">
        <span className="text-7xl">🎉</span>
        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
          {isEl ? "Εξαιρετικά!" : "Excellent!"}
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          {isEl ? `Σκόρ: ${score}/${TARGET_ROUNDS}` : `Score: ${score}/${TARGET_ROUNDS}`}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 p-2 sm:p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
            {isEl ? "Λογικό Γρίφο" : "Logic Puzzle"} 🧩
          </span>
          <span className="text-sm font-bold text-slate-500">{round + 1}/{TARGET_ROUNDS}</span>
        </div>

        <div className="h-2 bg-slate-200 rounded-full overflow-hidden mb-4">
          <div className="h-full bg-gradient-to-r from-purple-400 to-pink-500 transition-all" style={{ width: `${((round + 1) / TARGET_ROUNDS) * 100}%` }} />
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-lg border border-slate-200 dark:border-slate-700 mb-4">
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-3">{puzzle.scenario}</p>
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
                  showResult && isCorrect ? "bg-emerald-100 dark:bg-emerald-900/40 border-emerald-400 text-emerald-700 dark:text-emerald-300 scale-[1.02]"
                    : showResult && isSel ? "bg-red-100 dark:bg-red-900/40 border-red-400 text-red-700 dark:text-red-300"
                    : "bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-purple-400 hover:shadow-md",
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
