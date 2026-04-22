import React, { useState, useEffect, useCallback, useRef } from "react";

// { statementEl, statementEn, correct }
const QUESTIONS = [
  { statementEl: "Η Γη έχει 2 φεγγάρια.", statementEn: "Earth has 2 moons.", correct: false },
  { statementEl: "Το νερό βράζει στους 100°C σε ατμοσφαιρική πίεση.", statementEn: "Water boils at 100°C at atmospheric pressure.", correct: true },
  { statementEl: "Η Αθήνα είναι η πρωτεύουσα της Ιαπωνίας.", statementEn: "Athens is the capital of Japan.", correct: false },
  { statementEl: "Τα μεγάλα λευκά καρχαρίοι είναι θηλαστικά.", statementEn: "Great white sharks are mammals.", correct: false },
  { statementEl: "Ο ήλιος είναι ένα αστέρι.", statementEn: "The sun is a star.", correct: true },
  { statementEl: "Το DNA είναι διπλό έλικα.", statementEn: "DNA is a double helix.", correct: true },
  { statementEl: "Η Αμαζόνος είναι ο μεγαλύτερος ποταμός σε όγκο νερού στον κόσμο.", statementEn: "The Amazon is the world's largest river by water volume.", correct: true },
  { statementEl: "Ο Νάπολεων ήταν Γάλλος αυτοκράτορας.", statementEn: "Napoleon was a French emperor.", correct: true },
  { statementEl: "Η χελώνη κοιμάται με ανοιχτά τα μάτια.", statementEn: "Turtles sleep with their eyes open.", correct: false },
  { statementEl: "Η Αφροδίτη είναι η πλησιέστερη πλανήτη στον Ήλιο.", statementEn: "Venus is the closest planet to the Sun.", correct: false },
  { statementEl: "Η Βατική είναι η μικρότερη χώρα στον κόσμο.", statementEn: "Vatican City is the smallest country in the world.", correct: true },
  { statementEl: "Τα κοάλα τρώνε μόνο φύλλα ευκαλύπτου.", statementEn: "Koalas eat only eucalyptus leaves.", correct: true },
  { statementEl: "Το μήκος του Έτους στον Πλούτωνα είναι μικρότερο από τη Γη.", statementEn: "A year on Pluto is shorter than on Earth.", correct: false },
  { statementEl: "Ο Κόλπος του Μεξικού είναι ωκεανός.", statementEn: "The Gulf of Mexico is an ocean.", correct: false },
  { statementEl: "Τα μελισσούλες αναπαράγονται σε μελισσόκοιλες.", statementEn: "Bees reproduce in beehives.", correct: true },
  { statementEl: "Η Κίνα είναι το μεγαλύτερο έθνος σε πληθυσμό.", statementEn: "China is the most populous nation.", correct: true },
  { statementEl: "Ο Ουρανός έχει δακτύλιους.", statementEn: "Uranus has rings.", correct: true },
  { statementEl: "Η φωτιά χρειάζεται οξυγόνο για να καίει.", statementEn: "Fire needs oxygen to burn.", correct: true },
  { statementEl: "Ο ποταμός Νείλος ρέει στη Μεσόγειο.", statementEn: "The Nile flows into the Mediterranean.", correct: true },
  { statementEl: "Η Αίγυπτος βρίσκεται σε δύο ηπείρους.", statementEn: "Egypt is on two continents.", correct: true },
];

function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const TIMER_SECONDS = 8;

export default function TrueOrFalseGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [answered, setAnswered] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const timerRef = useRef(null);

  const current = questions[index];

  useEffect(() => {
    setQuestions(shuffle([...QUESTIONS]).slice(0, 20));
  }, []);

  useEffect(() => {
    if (!current || answered || gameOver) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setAnswered(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [current, answered, gameOver]);

  const handleAnswer = useCallback(
    (choice) => {
      if (!current || answered) return;
      const correct = choice === current.correct;
      setAnswered(true);
      setScore((s) => s + (correct ? 50 : 0));
      setStreak((st) => (correct ? st + 1 : 0));
      setTimeout(() => {
        if (index >= 19) {
          setGameOver(true);
        } else {
          setIndex((i) => i + 1);
          setTimeLeft(TIMER_SECONDS);
          setAnswered(false);
        }
      }, 1200);
    },
    [current, answered, index]
  );

  const reset = () => {
    setQuestions(shuffle([...QUESTIONS]).slice(0, 20));
    setIndex(0);
    setScore(0);
    setStreak(0);
    setTimeLeft(TIMER_SECONDS);
    setAnswered(false);
    setGameOver(false);
  };

  const T = {
    title: isEl ? "Σωστό ή Λάθος" : "True or False",
    score: isEl ? "Πόντοι" : "Score",
    streak: isEl ? "Σειρά" : "Streak",
    trueBtn: isEl ? "Σωστό" : "True",
    falseBtn: isEl ? "Λάθος" : "False",
    playAgain: isEl ? "Ξανά παίξτε" : "Play Again",
    congrats: isEl ? "Συγχαρητήρια! Ολοκλήρωσες τις ερωτήσεις!" : "Congratulations! You completed the questions!",
    finalScore: isEl ? "Τελικό σκορ" : "Final score",
  };

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50/50 to-sky-50 dark:from-slate-900 dark:via-teal-950/20 dark:to-slate-900 p-4 sm:p-6 flex items-center justify-center">
        <div className="max-w-md w-full rounded-2xl bg-white/95 dark:bg-slate-800/95 shadow-xl p-8 text-center">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">✅ {T.congrats}</h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-6">
            {T.finalScore}: <span className="font-bold text-teal-600 dark:text-teal-400">{score}</span>
          </p>
          <button
            onClick={reset}
            className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold transition shadow-lg"
          >
            {T.playAgain}
          </button>
        </div>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
        <div className="w-10 h-10 border-4 border-teal-200 dark:border-teal-800 border-t-teal-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50/50 to-sky-50 dark:from-slate-900 dark:via-teal-950/20 dark:to-slate-900 p-4 sm:p-6">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2 text-center">{T.title}</h1>
        <div className="flex justify-center gap-4 sm:gap-6 mb-6 flex-wrap">
          <div className="px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 shadow-sm">
            <span className="text-slate-500 dark:text-slate-400 text-sm">{T.score}</span>
            <span className="ml-2 font-semibold text-slate-800 dark:text-slate-200">{score}</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 shadow-sm">
            <span className="text-slate-500 dark:text-slate-400 text-sm">{T.streak}</span>
            <span className="ml-2 font-semibold text-emerald-600 dark:text-emerald-400">{streak}</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 shadow-sm">
            <span className="text-slate-500 dark:text-slate-400 text-sm">{isEl ? "Ερώτηση" : "Question"}</span>
            <span className="ml-2 font-semibold text-slate-800 dark:text-slate-200">{index + 1}/20</span>
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-6 sm:p-8">
          <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden mb-6">
            <div
              className="h-full bg-teal-500 dark:bg-teal-400 transition-all duration-1000"
              style={{ width: `${(timeLeft / TIMER_SECONDS) * 100}%` }}
            />
          </div>

          <p className="text-center text-xl sm:text-2xl font-medium text-slate-800 dark:text-slate-100 mb-8 leading-relaxed">
            {isEl ? current.statementEl : current.statementEn}
          </p>

          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            <button
              onClick={() => handleAnswer(true)}
              disabled={answered}
              className="py-6 sm:py-8 rounded-xl bg-emerald-500 dark:bg-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-lg sm:text-xl transition disabled:opacity-70 flex items-center justify-center gap-2"
            >
              <span className="text-2xl">✅</span> {T.trueBtn}
            </button>
            <button
              onClick={() => handleAnswer(false)}
              disabled={answered}
              className="py-6 sm:py-8 rounded-xl bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-500 text-white font-bold text-lg sm:text-xl transition disabled:opacity-70 flex items-center justify-center gap-2"
            >
              <span className="text-2xl">❌</span> {T.falseBtn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
