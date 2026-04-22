import React, { useState, useEffect, useCallback, useMemo } from "react";

const TRIVIA = [
  { cat: "science", q: { el: "Ποιο είναι το χημικό σύμβολο του χρυσού?", en: "What is the chemical symbol for gold?" }, opts: { el: ["Au", "Ag", "Cu", "Fe"], en: ["Au", "Ag", "Cu", "Fe"] }, ans: "Au" },
  { cat: "science", q: { el: "Πόσα οστά έχει το ανθρώπινο σώμα ως ενήλικας?", en: "How many bones does an adult human have?" }, opts: { el: ["206", "200", "210", "195"], en: ["206", "200", "210", "195"] }, ans: "206" },
  { cat: "history", q: { el: "Σε ποιο έτος έπεσε το Τείχος του Βερολίνου?", en: "In what year did the Berlin Wall fall?" }, opts: { el: ["1989", "1991", "1987", "1990"], en: ["1989", "1991", "1987", "1990"] }, ans: "1989" },
  { cat: "history", q: { el: "Ποιος ήταν ο πρώτος πρόεδρος των ΗΠΑ?", en: "Who was the first president of the USA?" }, opts: { el: ["George Washington", "Thomas Jefferson", "John Adams", "Benjamin Franklin"], en: ["George Washington", "Thomas Jefferson", "John Adams", "Benjamin Franklin"] }, ans: "George Washington" },
  { cat: "geography", q: { el: "Ποια είναι η μεγαλύτερη χώρα σε έκταση;", en: "What is the largest country by area?" }, opts: { el: ["Ρωσία", "Καναδάς", "Κίνα", "ΗΠΑ"], en: ["Russia", "Canada", "China", "USA"] }, ans: { el: "Ρωσία", en: "Russia" } },
  { cat: "geography", q: { el: "Ποια είναι η μεγαλύτερη έρημος στον κόσμο;", en: "What is the largest desert in the world?" }, opts: { el: ["Ανταρκτική", "Σαχάρα", "Αραβική", "Γοβί"], en: ["Antarctica", "Sahara", "Arabian", "Gobi"] }, ans: { el: "Ανταρκτική", en: "Antarctica" } },
  { cat: "culture", q: { el: "Ποιος ζωγράφισε τη Μόνα Λίζα;", en: "Who painted the Mona Lisa?" }, opts: { el: ["Λεονάρντο ντα Βίντσι", "Μιχαήλ Άγγελος", "Ραφαήλ", "Βαν Γκογκ"], en: ["Leonardo da Vinci", "Michelangelo", "Raphael", "Van Gogh"] }, ans: { el: "Λεονάρντο ντα Βίντσι", en: "Leonardo da Vinci" } },
  { cat: "science", q: { el: "Ποια είναι η ταχύτητα του φωτός (κατά προσέγγιση) σε km/s;", en: "What is the approximate speed of light in km/s?" }, opts: { el: ["~300.000", "~150.000", "~500.000", "~100.000"], en: ["~300,000", "~150,000", "~500,000", "~100,000"] }, ans: { el: "~300.000", en: "~300,000" } },
  { cat: "history", q: { el: "Πότε ξεκίνησε ο Α' Παγκόσμιος Πόλεμος;", en: "When did World War I begin?" }, opts: { el: ["1914", "1915", "1913", "1916"], en: ["1914", "1915", "1913", "1916"] }, ans: "1914" },
  { cat: "geography", q: { el: "Ποιο είναι το μακρύτερο ποτάμι στον κόσμο;", en: "What is the longest river in the world?" }, opts: { el: ["Νείλος", "Αμαζόνιος", "Γιανγκτσέ", "Μισισσιππής"], en: ["Nile", "Amazon", "Yangtze", "Mississippi"] }, ans: { el: "Νείλος", en: "Nile" } },
  { cat: "culture", q: { el: "Ποιος έγραψε τη 'Φάρμα των Ζώων';", en: "Who wrote Animal Farm?" }, opts: { el: ["George Orwell", "Aldous Huxley", "Ray Bradbury", "Kafka"], en: ["George Orwell", "Aldous Huxley", "Ray Bradbury", "Kafka"] }, ans: "George Orwell" },
  { cat: "science", q: { el: "Ποιο πλανητικό σύστημα περιέχει τη Γη;", en: "Which planetary system contains Earth?" }, opts: { el: ["Ηλιακό σύστημα", "Ανδρομέδα", "Κενταύρου", "Παρθενώνας"], en: ["Solar System", "Andromeda", "Centaurus", "Milky Way"] }, ans: { el: "Ηλιακό σύστημα", en: "Solar System" } },
  { cat: "culture", q: { el: "Ποια πόλη φιλοξένησε τους Ολυμπιακούς Αγώνες του 2004;", en: "Which city hosted the 2004 Olympics?" }, opts: { el: ["Αθήνα", "Σίδνεϊ", "Πεκίνο", "Βαρκελώνη"], en: ["Athens", "Sydney", "Beijing", "Barcelona"] }, ans: { el: "Αθήνα", en: "Athens" } },
  { cat: "geography", q: { el: "Ποια χώρα είναι γνωστή ως η Χώρα του Ανατέλλοντος Ηλίου;", en: "Which country is known as the Land of the Rising Sun?" }, opts: { el: ["Ιαπωνία", "Κίνα", "Κορέα", "Ταϊλάνδη"], en: ["Japan", "China", "Korea", "Thailand"] }, ans: { el: "Ιαπωνία", en: "Japan" } },
  { cat: "history", q: { el: "Ποιος ανακαλύφθηκε η Αμερική από Ευρωπαίο;", en: "Who is credited with discovering America for Europe?" }, opts: { el: ["Χριστόφορος Κολόμβος", "Αμέρικο Βεσπούτσι", "Μαρκο Πόλο", "Φερδινάνδος Μαγγελάνος"], en: ["Christopher Columbus", "Amerigo Vespucci", "Marco Polo", "Ferdinand Magellan"] }, ans: { el: "Χριστόφορος Κολόμβος", en: "Christopher Columbus" } },
];

function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function TriviaQuizGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [questions, setQuestions] = useState([]);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameOver, setGameOver] = useState(false);
  const [showCorrect, setShowCorrect] = useState(false);

  useEffect(() => {
    setQuestions(shuffle([...TRIVIA]).slice(0, 15));
  }, []);

  const current = questions[round];
  const correctAns = current ? (typeof current.ans === "object" ? current.ans[lang] : current.ans) : null;
  const options = current ? shuffle(current.opts[lang]) : [];

  useEffect(() => {
    if (!current || selected !== null || gameOver) return;
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setSelected("__timeout__");
          setShowCorrect(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [round, selected, gameOver, current]);

  const handleSelect = useCallback(
    (opt) => {
      if (selected !== null) return;
      setSelected(opt);
      setShowCorrect(true);
      if (opt === correctAns) setScore((s) => s + 1);
    },
    [selected, correctAns]
  );

  const handleNext = () => {
    if (round >= 14) {
      setGameOver(true);
    } else {
      setRound((r) => r + 1);
      setSelected(null);
      setTimeLeft(15);
      setShowCorrect(false);
    }
  };

  const reset = () => {
    setQuestions(shuffle([...TRIVIA]).slice(0, 15));
    setRound(0);
    setScore(0);
    setSelected(null);
    setTimeLeft(15);
    setGameOver(false);
    setShowCorrect(false);
  };

  const T = {
    title: isEl ? "Κουίζ Γενικής Γνώσης" : "Trivia Quiz",
    round: isEl ? "Ερώτηση" : "Question",
    score: isEl ? "Πόντοι" : "Score",
    next: isEl ? "Επόμενο" : "Next",
    playAgain: isEl ? "Ξανά παίξτε" : "Play Again",
    finalScore: isEl ? "Τελικό σκορ" : "Final score",
    congrats: isEl ? "Συγχαρητήρια! Ολοκλήρωσες το κουίζ!" : "Congratulations! You completed the quiz!",
    timeUp: isEl ? "Χρόνος!" : "Time's up!",
    correct: isEl ? "Σωστά!" : "Correct!",
    wrong: isEl ? "Λάθος. Η σωστή απάντηση:" : "Wrong. The correct answer:",
    categories: { science: { el: "Επιστήμη", en: "Science" }, history: { el: "Ιστορία", en: "History" }, geography: { el: "Γεωγραφία", en: "Geography" }, culture: { el: "Πολιτισμός", en: "Culture" } },
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
        <div className="animate-pulse text-slate-500">Loading...</div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-50 dark:from-slate-900 dark:via-teal-950/20 dark:to-slate-900 p-4 sm:p-6 flex items-center justify-center">
        <div className="max-w-md w-full rounded-2xl bg-white/90 dark:bg-slate-800/90 shadow-xl p-8 text-center">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">🏆 {T.congrats}</h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-6">
            {T.finalScore}: <span className="font-bold text-cyan-600 dark:text-cyan-400">{score}/15</span>
          </p>
          <button
            onClick={reset}
            className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition shadow-lg"
          >
            {T.playAgain}
          </button>
        </div>
      </div>
    );
  }

  const catLabel = current ? T.categories[current.cat]?.[lang] || current.cat : "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-50 dark:from-slate-900 dark:via-teal-950/20 dark:to-slate-900 p-4 sm:p-6">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2 text-center">{T.title}</h1>
        <div className="flex justify-between gap-4 mb-6">
          <div className="px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 shadow-sm">
            <span className="text-slate-500 dark:text-slate-400 text-sm">{T.round}</span>
            <span className="ml-2 font-semibold text-slate-800 dark:text-slate-200">{round + 1}/15</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 shadow-sm">
            <span className="text-slate-500 dark:text-slate-400 text-sm">{T.score}</span>
            <span className="ml-2 font-semibold text-slate-800 dark:text-slate-200">{score}</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 shadow-sm">
            <span className={`font-semibold ${timeLeft <= 5 ? "text-red-600" : "text-slate-800 dark:text-slate-200"}`}>{timeLeft}s</span>
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-6 sm:p-8">
          <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-cyan-100 dark:bg-cyan-900/50 text-cyan-800 dark:text-cyan-200 mb-4">{catLabel}</span>
          <p className="text-lg sm:text-xl font-medium text-slate-800 dark:text-slate-100 mb-6">{current.q[lang]}</p>

          <div className="space-y-3">
            {options.map((opt) => {
              const isChosen = selected === opt;
              const isCorrect = opt === correctAns;
              const reveal = showCorrect && (isCorrect || isChosen);

              return (
                <button
                  key={opt}
                  onClick={() => handleSelect(opt)}
                  disabled={selected !== null}
                  className={`
                    w-full py-3 px-4 rounded-xl text-left font-medium transition
                    ${reveal && isCorrect ? "bg-emerald-500 dark:bg-emerald-600 text-white" : ""}
                    ${reveal && isChosen && !isCorrect ? "bg-red-500 dark:bg-red-600 text-white" : ""}
                    ${!selected ? "bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200" : ""}
                  `}
                >
                  {opt} {reveal && isCorrect && " ✓"}
                </button>
              );
            })}
          </div>

          {showCorrect && (
            <div className="mt-6 space-y-2">
              {selected !== correctAns && selected !== "__timeout__" && (
                <p className="text-slate-600 dark:text-slate-400">{T.wrong} <strong>{correctAns}</strong></p>
              )}
              {selected === "__timeout__" && (
                <p className="text-amber-600 dark:text-amber-400 font-medium">{T.timeUp}</p>
              )}
              <button
                onClick={handleNext}
                className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition"
              >
                {round >= 14 ? (isEl ? "Τέλος" : "Finish") : T.next}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
