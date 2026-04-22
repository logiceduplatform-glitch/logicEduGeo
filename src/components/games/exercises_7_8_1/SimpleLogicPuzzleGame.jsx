import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import useSafeTimeout from "../../../hooks/useSafeTimeout";
import { VoiceService } from "../../../services/VoiceService";

const PUZZLES = {
  el: [
    {
      scenario: "Τρία κουτιά — 🟥 🟦 🟨. Ο θησαυρός δεν είναι στο κόκκινο. Το μπλε κουτί είναι άδειο.",
      question: "Πού είναι ο θησαυρός;",
      options: ["🟥 Κόκκινο", "🟦 Μπλε", "🟨 Κίτρινο"],
      answer: "🟨 Κίτρινο",
      hint: "Δεν είναι στο κόκκινο, ούτε στο μπλε...",
    },
    {
      scenario: "Η Μαρία κρατάει μήλο. Ο Νίκος κρατάει μπανάνα. Ένα παιδί κρατάει πορτοκάλι.",
      question: "Ποιος κρατάει το πορτοκάλι;",
      options: ["Μαρία", "Νίκος", "Κανένα από τα δύο"],
      answer: "Κανένα από τα δύο",
      hint: "Η Μαρία=μήλο, ο Νίκος=μπανάνα...",
    },
    {
      scenario: "Πέντε μπάλες στη σειρά. Η κόκκινη είναι δίπλα στη μπλε. Η πράσινη είναι στη μέση.",
      question: "Πού είναι η πράσινη;",
      options: ["1η θέση", "3η θέση", "5η θέση"],
      answer: "3η θέση",
      hint: "Η μέση σε 5 θέσεις είναι η 3η!",
    },
    {
      scenario: "Ο Γιώργος είναι πιο ψηλός από τη Σοφία. Η Σοφία είναι πιο ψηλή από τον Αλέξη.",
      question: "Ποιος είναι ο πιο κοντός;",
      options: ["Γιώργος", "Σοφία", "Αλέξης"],
      answer: "Αλέξης",
      hint: "Γιώργος > Σοφία > ...",
    },
    {
      scenario: "Τρία ζώα — γάτα, σκύλος, ψάρι. Η γάτα δεν μπορεί να κολυμπήσει. Ο σκύλος τρέχει στο πάρκο.",
      question: "Ποιο ζώο ζει στο νερό;",
      options: ["Γάτα", "Σκύλος", "Ψάρι"],
      answer: "Ψάρι",
      hint: "Γάτα=ξηρά, Σκύλος=πάρκο...",
    },
    {
      scenario: "Τέσσερα χρώματα: κόκκινο, μπλε, κίτρινο, πράσινο. Αν ανακατέψεις κόκκινο + κίτρινο...",
      question: "Τι χρώμα βγαίνει;",
      options: ["Μπλε", "Πράσινο", "Πορτοκαλί"],
      answer: "Πορτοκαλί",
      hint: "Κόκκινο + Κίτρινο = ...",
    },
    {
      scenario: "Ο Κώστας έχει 3 καραμέλες. Η Ελένη έχει 2 παραπάνω από τον Κώστα.",
      question: "Πόσες καραμέλες έχει η Ελένη;",
      options: ["3", "5", "7"],
      answer: "5",
      hint: "3 + 2 = ...",
    },
    {
      scenario: "Τρεις φίλοι κάθονται σε παγκάκι. Ο Πέτρος δεν κάθεται στη μέση. Η Μαρία κάθεται στα αριστερά.",
      question: "Ποιος κάθεται στη μέση;",
      options: ["Πέτρος", "Μαρία", "Ο τρίτος φίλος"],
      answer: "Ο τρίτος φίλος",
      hint: "Μαρία=αριστερά, Πέτρος≠μέση...",
    },
    {
      scenario: "Σε μια τάξη, ο πρώτος μαθητής φοράει κόκκινο. Ο τελευταίος φοράει μπλε. Μεταξύ τους είναι 3 μαθητές.",
      question: "Πόσοι μαθητές είναι συνολικά;",
      options: ["3", "4", "5"],
      answer: "5",
      hint: "1ος + 3 στη μέση + τελευταίος = ...",
    },
    {
      scenario: "Η γάτα κυνηγάει το ποντίκι. Το ποντίκι κρύβεται πίσω από τον καναπέ. Η γάτα κοιτάζει κάτω από το τραπέζι.",
      question: "Θα βρει η γάτα το ποντίκι;",
      options: ["Ναι", "Όχι, κοιτάζει αλλού", "Δεν ξέρουμε"],
      answer: "Όχι, κοιτάζει αλλού",
      hint: "Ποντίκι=πίσω από καναπέ, γάτα=κάτω από τραπέζι...",
    },
    {
      scenario: "Τρία σπίτια — ψηλό, μεσαίο, χαμηλό. Ο Τάσος μένει στο πιο ψηλό. Η Λίτσα στο πιο χαμηλό.",
      question: "Πού μένει ο Γιάννης;",
      options: ["Στο ψηλό", "Στο μεσαίο", "Στο χαμηλό"],
      answer: "Στο μεσαίο",
      hint: "Τάσος=ψηλό, Λίτσα=χαμηλό...",
    },
    {
      scenario: "Μια βαλίτσα ζυγίζει 5 κιλά. Βάζεις μέσα ένα βιβλίο 2 κιλών.",
      question: "Πόσο ζυγίζει τώρα η βαλίτσα;",
      options: ["5 κιλά", "7 κιλά", "3 κιλά"],
      answer: "7 κιλά",
      hint: "5 + 2 = ...",
    },
  ],
  en: [
    {
      scenario: "Three boxes — 🟥 🟦 🟨. The treasure is NOT in the red box. The blue box is empty.",
      question: "Where is the treasure?",
      options: ["🟥 Red", "🟦 Blue", "🟨 Yellow"],
      answer: "🟨 Yellow",
      hint: "Not red, not blue...",
    },
    {
      scenario: "Maria has an apple. Nick has a banana. One child has an orange.",
      question: "Who has the orange?",
      options: ["Maria", "Nick", "Neither of them"],
      answer: "Neither of them",
      hint: "Maria=apple, Nick=banana...",
    },
    {
      scenario: "Five balls in a row. The red one is next to the blue one. The green one is in the middle.",
      question: "Where is the green one?",
      options: ["1st position", "3rd position", "5th position"],
      answer: "3rd position",
      hint: "The middle of 5 positions is the 3rd!",
    },
    {
      scenario: "George is taller than Sofia. Sofia is taller than Alex.",
      question: "Who is the shortest?",
      options: ["George", "Sofia", "Alex"],
      answer: "Alex",
      hint: "George > Sofia > ...",
    },
    {
      scenario: "Three animals — cat, dog, fish. The cat can't swim. The dog runs in the park.",
      question: "Which animal lives in water?",
      options: ["Cat", "Dog", "Fish"],
      answer: "Fish",
      hint: "Cat=land, Dog=park...",
    },
    {
      scenario: "Four colors: red, blue, yellow, green. If you mix red + yellow...",
      question: "What color do you get?",
      options: ["Blue", "Green", "Orange"],
      answer: "Orange",
      hint: "Red + Yellow = ...",
    },
    {
      scenario: "Kostas has 3 candies. Elena has 2 more than Kostas.",
      question: "How many candies does Elena have?",
      options: ["3", "5", "7"],
      answer: "5",
      hint: "3 + 2 = ...",
    },
    {
      scenario: "Three friends sit on a bench. Peter doesn't sit in the middle. Maria sits on the left.",
      question: "Who sits in the middle?",
      options: ["Peter", "Maria", "The third friend"],
      answer: "The third friend",
      hint: "Maria=left, Peter≠middle...",
    },
    {
      scenario: "In a class, the first student wears red. The last wears blue. Between them are 3 students.",
      question: "How many students in total?",
      options: ["3", "4", "5"],
      answer: "5",
      hint: "1st + 3 in between + last = ...",
    },
    {
      scenario: "The cat chases the mouse. The mouse hides behind the couch. The cat looks under the table.",
      question: "Will the cat find the mouse?",
      options: ["Yes", "No, looking elsewhere", "We don't know"],
      answer: "No, looking elsewhere",
      hint: "Mouse=behind couch, cat=under table...",
    },
    {
      scenario: "Three houses — tall, medium, short. Tasos lives in the tallest. Litsa lives in the shortest.",
      question: "Where does Yannis live?",
      options: ["In the tall one", "In the medium one", "In the short one"],
      answer: "In the medium one",
      hint: "Tasos=tall, Litsa=short...",
    },
    {
      scenario: "A suitcase weighs 5 kg. You put a 2 kg book inside.",
      question: "How much does the suitcase weigh now?",
      options: ["5 kg", "7 kg", "3 kg"],
      answer: "7 kg",
      hint: "5 + 2 = ...",
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
            {isEl ? "Απλό Λογικό Γρίφο" : "Simple Logic Puzzle"} 🧩
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
