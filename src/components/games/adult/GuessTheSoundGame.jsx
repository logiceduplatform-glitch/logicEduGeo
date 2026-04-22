import React, { useState, useEffect, useCallback } from "react";

// { sound, optionsEl, optionsEn, answerIndex }
const ROUNDS = [
  { sound: "ΜΠΟΥΜ!", optionsEl: ["Κεραυνός", "Βροντή", "Πυροτέχνημα", "Έκρηξη"], optionsEn: ["Thunder", "Firework", "Explosion", "Bomb"], answerIndex: 0 },
  { sound: "ΤΙΚ-ΤΑΚ", optionsEl: ["Ρολόι", "Σφυρί", "Κουδούνι", "Τροχός"], optionsEn: ["Clock", "Hammer", "Bell", "Wheel"], answerIndex: 0 },
  { sound: "ΓΚΡΡΡ", optionsEl: ["Στομάχι", "Λιοντάρι", "Κατσαρίδα", "Αεροπλάνο"], optionsEn: ["Stomach", "Lion", "Airplane", "Engine"], answerIndex: 0 },
  { sound: "ΧΑΥ", optionsEl: ["Γέλιο", "Κλάμα", "Φύσημα", "Βήχας"], optionsEn: ["Laughter", "Crying", "Sneeze", "Cough"], answerIndex: 0 },
  { sound: "ΜΙΑΟΥ", optionsEl: ["Γάτα", "Σκύλος", "Πτηνό", "Αλογο"], optionsEn: ["Cat", "Dog", "Bird", "Horse"], answerIndex: 0 },
  { sound: "ΓΑΒ ΓΑΒ", optionsEl: ["Σκύλος", "Λύκος", "Αλεπού", "Λέοντας"], optionsEn: ["Dog", "Wolf", "Fox", "Lion"], answerIndex: 0 },
  { sound: "ΜΠΛΟΥΡΠ", optionsEl: ["Νερό πέφτει", "Φύσημα", "Άερας", "Βροχή"], optionsEn: ["Water drop", "Blow", "Wind", "Rain"], answerIndex: 0 },
  { sound: "ΤΡΙΝ ΤΡΙΝ", optionsEl: ["Τηλέφωνο", "Κουδούνι πόρτας", "Άλαρμ", "Ραδιόφωνο"], optionsEn: ["Phone", "Doorbell", "Alarm", "Radio"], answerIndex: 0 },
  { sound: "ΣΣΣΣ", optionsEl: ["Φίδι", "Αέρας", "Φωτιά", "Βροχή"], optionsEn: ["Snake", "Wind", "Fire", "Rain"], answerIndex: 0 },
  { sound: "ΚΑΡ ΚΑΡ", optionsEl: ["Κόρακας", "Περιστέρι", "Γλάρος", "Αετός"], optionsEn: ["Crow", "Pigeon", "Seagull", "Eagle"], answerIndex: 0 },
  { sound: "ΜΠΡΡΡ", optionsEl: ["Αμάξι", "Μοτοσικλέτα", "Τρένο", "Πλοίο"], optionsEn: ["Car", "Motorcycle", "Train", "Ship"], answerIndex: 0 },
  { sound: "ΣΠΛΑΣ", optionsEl: ["Νερό", "Πτώση αντικειμένου", "Χτύπημα", "Σπασμένο γυαλί"], optionsEn: ["Water splash", "Dropping object", "Hit", "Breaking glass"], answerIndex: 0 },
];

function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function GuessTheSoundGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [roundIndex, setRoundIndex] = useState(0);
  const [rounds, setRounds] = useState([]);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    setRounds(
      shuffle([...ROUNDS])
        .slice(0, 10)
        .map((r) => ({
          ...r,
          options: shuffle(
            (isEl ? r.optionsEl : r.optionsEn).map((text, i) => ({ text, correct: i === r.answerIndex }))
          ),
        }))
    );
  }, [isEl]);

  const current = rounds[roundIndex];

  const handleAnswer = useCallback(
    (opt) => {
      if (!current || revealed) return;
      setSelected(opt);
      setRevealed(true);
      if (opt.correct) setScore((s) => s + 100);
      setTimeout(() => {
        setSelected(null);
        setRevealed(false);
        if (roundIndex >= 9) {
          setGameOver(true);
        } else {
          setRoundIndex((r) => r + 1);
        }
      }, 1500);
    },
    [current, revealed, roundIndex]
  );

  const reset = () => {
    setRoundIndex(0);
    setRounds(
      shuffle([...ROUNDS])
        .slice(0, 10)
        .map((r) => ({
          ...r,
          options: shuffle(
            (isEl ? r.optionsEl : r.optionsEn).map((text, i) => ({ text, correct: i === r.answerIndex }))
          ),
        }))
    );
    setScore(0);
    setSelected(null);
    setRevealed(false);
    setGameOver(false);
  };

  const T = {
    title: isEl ? "Μάντεψε τον Ήχο" : "Guess the Sound",
    round: isEl ? "Γύρος" : "Round",
    score: isEl ? "Πόντοι" : "Score",
    prompt: isEl ? "Τι κάνει αυτόν τον ήχο;" : "What makes this sound?",
    playAgain: isEl ? "Ξανά παίξτε" : "Play Again",
    congrats: isEl ? "Συγχαρητήρια! Ολοκλήρωσες το παιχνίδι!" : "Congratulations! You completed the game!",
    finalScore: isEl ? "Τελικό σκορ" : "Final score",
  };

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-fuchsia-50/50 to-pink-50 dark:from-slate-900 dark:via-violet-950/20 dark:to-slate-900 p-4 sm:p-6 flex items-center justify-center">
        <div className="max-w-md w-full rounded-2xl bg-white/95 dark:bg-slate-800/95 shadow-xl p-8 text-center">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">🎧 {T.congrats}</h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-6">
            {T.finalScore}: <span className="font-bold text-violet-600 dark:text-violet-400">{score}</span>
          </p>
          <button
            onClick={reset}
            className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition shadow-lg"
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
        <div className="w-10 h-10 border-4 border-violet-200 dark:border-violet-800 border-t-violet-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-fuchsia-50/50 to-pink-50 dark:from-slate-900 dark:via-violet-950/20 dark:to-slate-900 p-4 sm:p-6">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2 text-center">{T.title}</h1>
        <div className="flex justify-center gap-4 sm:gap-6 mb-6 flex-wrap">
          <div className="px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 shadow-sm">
            <span className="text-slate-500 dark:text-slate-400 text-sm">{T.round}</span>
            <span className="ml-2 font-semibold text-slate-800 dark:text-slate-200">{roundIndex + 1}/10</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 shadow-sm">
            <span className="text-slate-500 dark:text-slate-400 text-sm">{T.score}</span>
            <span className="ml-2 font-semibold text-slate-800 dark:text-slate-200">{score}</span>
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-6 sm:p-8">
          <p className="text-center text-slate-500 dark:text-slate-400 text-sm mb-4">{T.prompt}</p>
          <div className="text-center text-4xl sm:text-5xl font-black text-violet-600 dark:text-violet-400 mb-8 tracking-tight animate-pulse">
            {current.sound}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {current.options.map((opt, i) => {
              const isChosen = selected === opt;
              const showCorrect = revealed && opt.correct;
              const showWrong = revealed && isChosen && !opt.correct;
              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt)}
                  disabled={revealed}
                  className={`py-4 px-4 rounded-xl font-semibold text-lg transition disabled:cursor-default ${
                    showCorrect
                      ? "bg-emerald-500 dark:bg-emerald-600 text-white"
                      : showWrong
                      ? "bg-red-500 dark:bg-red-600 text-white"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-violet-200 dark:hover:bg-violet-800"
                  }`}
                >
                  {opt.text}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
