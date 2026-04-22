import React, { useState, useEffect, useCallback, useMemo } from "react";

const PUZZLES = [
  { emojis: "🦁👑", answers: { el: "Ο Βασιλιάς των Λιονταριών", en: "The Lion King" }, options: { el: ["Ο Βασιλιάς των Λιονταριών", "Δουλειά στη ζούγκλα", "Λιοντάρι και Ποντικός", "Βασιλεία των ζώων"], en: ["The Lion King", "Jungle Job", "Lion and Mouse", "Kingdom of Beasts"] } },
  { emojis: "🧊❄️👸", answers: { el: "Ψυχρά και Ακράτητα", en: "Frozen" }, options: { el: ["Ψυχρά και Ακράτητα", "Η χιονένια βασίλισσα", "Παγωμένη κάστρο", "Χειμώνας"], en: ["Frozen", "The Snow Queen", "Ice Castle", "Winter"] } },
  { emojis: "🕷️🕸️🦸", answers: { el: "Spider-Man", en: "Spider-Man" }, options: { el: ["Spider-Man", "Αράχνη και Άνθρωπος", "Δίκτυο ήρωας", "Τα Marvel"], en: ["Spider-Man", "Spider and Man", "Web Hero", "Marvel"] } },
  { emojis: "🐟🔍", answers: { el: "Ψάχνοντας τη Νέμο", en: "Finding Nemo" }, options: { el: ["Ψάχνοντας τη Νέμο", "Ψάρεμα", "Θάλασσα και ψάρι", "Νέμο το ψαράκι"], en: ["Finding Nemo", "Fishing", "Ocean and Fish", "Nemo the Fish"] } },
  { emojis: "👻🏠", answers: { el: "Ghostbusters", en: "Ghostbusters" }, options: { el: ["Ghostbusters", "Σπίτι φαντασμάτων", "Φαντάσματα", "Τρομακτικό σπίτι"], en: ["Ghostbusters", "Haunted House", "Ghosts", "Scary House"] } },
  { emojis: "🦇🌃", answers: { el: "Batman", en: "Batman" }, options: { el: ["Batman", "Νύχτα και Νυχτερίδα", "Σκοτεινή πόλη", "Ήρωας της νύχτας"], en: ["Batman", "Night and Bat", "Dark City", "Night Hero"] } },
  { emojis: "🍎👸", answers: { el: "Χιονάτη", en: "Snow White" }, options: { el: ["Χιονάτη", "Μήλο και Βασίλισσα", "Οι επτά νάνοι", "Δεντροφυλλιά"], en: ["Snow White", "Apple and Queen", "Seven Dwarfs", "Cinderella"] } },
  { emojis: "🤖❤️", answers: { el: "WALL-E", en: "WALL-E" }, options: { el: ["WALL-E", "Ρομπότ και αγάπη", "Επιστημονική φαντασία", "Ρομπότ"], en: ["WALL-E", "Robot and Love", "Sci-Fi", "Robot"] } },
  { emojis: "🦈🌊", answers: { el: "Τα σαγόνια του καρχαρία", en: "Jaws" }, options: { el: ["Τα σαγόνια του καρχαρία", "Καρχαρίας", "Θάλασσα τρόμου", "Καρχαρίας και θάλασσα"], en: ["Jaws", "Shark", "Ocean Horror", "Shark and Sea"] } },
  { emojis: "🎃👻", answers: { el: "Η Νύχτα με τις Μάσκες", en: "Nightmare Before Christmas" }, options: { el: ["Η Νύχτα με τις Μάσκες", "Χαλοουίν", "Κολοκύθια", "Φαντάσματα"], en: ["Nightmare Before Christmas", "Halloween", "Pumpkins", "Ghosts"] } },
  { emojis: "🦖🦕", answers: { el: "Τζουράσικ Παρκ", en: "Jurassic Park" }, options: { el: ["Τζουράσικ Παρκ", "Δεινόσαυροι", "Πάρκο δεινοσαύρων", "Πρέιστορικ εποχή"], en: ["Jurassic Park", "Dinosaurs", "Dinosaur Park", "Prehistoric"] } },
  { emojis: "🚀🌟", answers: { el: "Star Wars", en: "Star Wars" }, options: { el: ["Star Wars", "Διαστήμιο", "Αστέρια", "Πόλεμος στα αστέρια"], en: ["Star Wars", "Space", "Stars", "Interstellar"] } },
];

function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function EmojiQuizGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [puzzleOrder, setPuzzleOrder] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    setPuzzleOrder(shuffle([...Array(PUZZLES.length).keys()]));
  }, []);

  const currentPuzzle = puzzleOrder.length ? PUZZLES[puzzleOrder[round]] : null;
  const options = currentPuzzle ? shuffle(currentPuzzle.options[lang]) : [];

  const handleSelect = useCallback(
    (opt) => {
      if (selected !== null) return;
      setSelected(opt);
      const correct = currentPuzzle.answers[lang];
      if (opt === correct) setScore((s) => s + 1);
    },
    [selected, currentPuzzle, lang]
  );

  const handleNext = () => {
    if (round >= 11) {
      setGameOver(true);
    } else {
      setRound((r) => r + 1);
      setSelected(null);
    }
  };

  const reset = () => {
    setRound(0);
    setScore(0);
    setSelected(null);
    setPuzzleOrder(shuffle([...Array(PUZZLES.length).keys()]));
    setGameOver(false);
  };

  const T = {
    title: isEl ? "Κουίζ Emoji" : "Emoji Quiz",
    round: isEl ? "Γύρος" : "Round",
    score: isEl ? "Πόντοι" : "Score",
    next: isEl ? "Επόμενο" : "Next",
    playAgain: isEl ? "Ξανά παίξτε" : "Play Again",
    finalScore: isEl ? "Τελικό σκορ" : "Final score",
    congrats: isEl ? "Συγχαρητήρια! Ολοκλήρωσες το κουίζ!" : "Congratulations! You completed the quiz!",
    correct: isEl ? "Σωστά! ✓" : "Correct! ✓",
    wrong: isEl ? "Λάθος" : "Wrong",
    guess: isEl ? "Τι αντιπροσωπεύουν;" : "What do these represent?",
  };

  if (!currentPuzzle || puzzleOrder.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
        <div className="animate-pulse text-slate-500">Loading...</div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 dark:from-slate-900 dark:via-rose-950/20 dark:to-slate-900 p-4 sm:p-6 flex items-center justify-center">
        <div className="max-w-md w-full rounded-2xl bg-white/90 dark:bg-slate-800/90 shadow-xl p-8 text-center">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">🎬 {T.congrats}</h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-6">
            {T.finalScore}: <span className="font-bold text-rose-600 dark:text-rose-400">{score}/12</span>
          </p>
          <button
            onClick={reset}
            className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold transition shadow-lg"
          >
            {T.playAgain}
          </button>
        </div>
      </div>
    );
  }

  const correctAnswer = currentPuzzle.answers[lang];
  const showResult = selected !== null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 dark:from-slate-900 dark:via-rose-950/20 dark:to-slate-900 p-4 sm:p-6">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2 text-center">{T.title}</h1>
        <div className="flex justify-center gap-6 mb-6">
          <div className="px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 shadow-sm">
            <span className="text-slate-500 dark:text-slate-400 text-sm">{T.round}</span>
            <span className="ml-2 font-semibold text-slate-800 dark:text-slate-200">{round + 1}/12</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 shadow-sm">
            <span className="text-slate-500 dark:text-slate-400 text-sm">{T.score}</span>
            <span className="ml-2 font-semibold text-slate-800 dark:text-slate-200">{score}</span>
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-6 sm:p-8">
          <p className="text-center text-slate-500 dark:text-slate-400 mb-4">{T.guess}</p>
          <div className="flex justify-center gap-2 mb-8 flex-wrap text-4xl sm:text-5xl">
            {[...currentPuzzle.emojis].map((e, i) => (
              <span key={i}>{e}</span>
            ))}
          </div>

          <div className="space-y-3">
            {options.map((opt) => {
              const isChosen = selected === opt;
              const isCorrect = opt === correctAnswer;
              const showCorrect = showResult && isCorrect;
              const showWrong = showResult && isChosen && !isCorrect;

              return (
                <button
                  key={opt}
                  onClick={() => handleSelect(opt)}
                  disabled={showResult}
                  className={`
                    w-full py-3 px-4 rounded-xl text-left font-medium transition
                    ${showCorrect ? "bg-emerald-500 dark:bg-emerald-600 text-white" : ""}
                    ${showWrong ? "bg-red-500 dark:bg-red-600 text-white" : ""}
                    ${!showResult ? "bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200" : ""}
                  `}
                >
                  {opt} {showCorrect && " ✓"} {showWrong && " ✗"}
                </button>
              );
            })}
          </div>

          {showResult && (
            <div className="mt-6 text-center">
              <p className={`text-lg font-semibold mb-4 ${selected === correctAnswer ? "text-emerald-600" : "text-red-600"}`}>
                {selected === correctAnswer ? T.correct : T.wrong}
              </p>
              <button
                onClick={handleNext}
                className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold transition"
              >
                {round >= 11 ? (isEl ? "Τέλος" : "Finish") : T.next}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
