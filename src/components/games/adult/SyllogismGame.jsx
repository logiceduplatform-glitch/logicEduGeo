import React, { useState, useCallback } from "react";

const QUESTIONS = [
  {
    premiseEl: "Όλα τα σκυλιά είναι ζώα. Όλα τα ζώα αναπνέουν.",
    premiseEn: "All dogs are animals. All animals breathe.",
    qEl: "Συνεπώς:",
    qEn: "Therefore:",
    choicesEl: ["Κάθε σκύλος αναπνέει.", "Κάθε ζώο είναι σκύλος.", "Τίποτα δεν αναπνέει.", "Μόνο τα σκυλιά αναπνέουν."],
    choicesEn: ["Every dog breathes.", "Every animal is a dog.", "Nothing breathes.", "Only dogs breathe."],
    correct: 0,
  },
  {
    premiseEl: "Κανένας κύκλος δεν είναι τετράγωνο. Όλα τα Α είναι κύκλοι.",
    premiseEn: "No circle is a square. All As are circles.",
    qEl: "Συνεπώς:",
    qEn: "Therefore:",
    choicesEl: ["Κανένα Α δεν είναι τετράγωνο.", "Όλα τα τετράγωνα είναι Α.", "Κάθε Α είναι τετράγωνο.", "Υπάρχει Α που είναι τετράγωνο."],
    choicesEn: ["No A is a square.", "All squares are A.", "Every A is a square.", "Some A is a square."],
    correct: 0,
  },
  {
    premiseEl: "Μερικά φυτά είναι δέντρα. Όλα τα δέντρα έχουν ρίζες.",
    premiseEn: "Some plants are trees. All trees have roots.",
    qEl: "Τι ακολουθεί οπωσδήποτε;",
    qEn: "What necessarily follows?",
    choicesEl: ["Κάθε φυτό έχει ρίζες.", "Κάποιο φυτό έχει ρίζες.", "Κανένα φυτό δεν έχει ρίζες.", "Όλα τα φυτά είναι δέντρα."],
    choicesEn: ["Every plant has roots.", "Some plant has roots.", "No plant has roots.", "All plants are trees."],
    correct: 1,
  },
  {
    premiseEl: "Ή βρέχει ή είναι ηλιόλουστο (και όχι και τα δύο). Δεν βρέχει.",
    premiseEn: "Either it rains or it is sunny (not both). It is not raining.",
    qEl: "Συνεπώς:",
    qEn: "Therefore:",
    choicesEl: ["Είναι ηλιόλουστο.", "Βρέχει.", "Δεν μπορούμε να συμπεράνουμε.", "Και τα δύο."],
    choicesEn: ["It is sunny.", "It is raining.", "We cannot conclude.", "Both."],
    correct: 0,
  },
  {
    premiseEl: "Αν σπουδάζεις σκληρά, περνάς. Δεν πέρασες.",
    premiseEn: "If you study hard, you pass. You did not pass.",
    qEl: "Συνεπώς:",
    qEn: "Therefore:",
    choicesEl: ["Δεν σπούδασες σκληρά (modus tollens).", "Σπούδασες σκληρά.", "Πέρασες.", "Κανένα συμπέρασμα."],
    choicesEn: ["You did not study hard (modus tollens).", "You studied hard.", "You passed.", "No conclusion."],
    correct: 0,
  },
  {
    premiseEl: "Όλοι οι γιατροί σπούδασαν ιατρική. Η Μαρία είναι γιατρός.",
    premiseEn: "All doctors studied medicine. Maria is a doctor.",
    qEl: "Συνεπώς:",
    qEn: "Therefore:",
    choicesEl: ["Η Μαρία σπούδασε ιατρική.", "Όποιος σπούδασε ιατρική είναι γιατρός.", "Η Μαρία δεν είναι γιατρός.", "Κανένας γιατρός δεν σπούδασε ιατρική."],
    choicesEn: ["Maria studied medicine.", "Whoever studied medicine is a doctor.", "Maria is not a doctor.", "No doctor studied medicine."],
    correct: 0,
  },
  {
    premiseEl: "Κανένα θηλαστικό δεν είναι ψάρι. Όλα τα δελφίνια είναι θηλαστικά.",
    premiseEn: "No mammal is a fish. All dolphins are mammals.",
    qEl: "Συνεπώς:",
    qEn: "Therefore:",
    choicesEl: ["Κανένα δελφίνι δεν είναι ψάρι.", "Όλα τα ψάρια είναι δελφίνια.", "Μερικά δελφίνια είναι ψάρια.", "Κάθε ψάρι είναι θηλαστικό."],
    choicesEn: ["No dolphin is a fish.", "All fish are dolphins.", "Some dolphins are fish.", "Every fish is a mammal."],
    correct: 0,
  },
  {
    premiseEl: "Μόνο τα μέλη μπορούν να ψηφίσουν. Ο Γιάννης μπορεί να ψηφίσει.",
    premiseEn: "Only members can vote. Giannis can vote.",
    qEl: "Συνεπώς:",
    qEn: "Therefore:",
    choicesEl: ["Ο Γιάννης είναι μέλος.", "Ο Γιάννης δεν είναι μέλος.", "Όλοι οι ψηφοφόροι δεν είναι μέλη.", "Κανένα μέλος δεν ψηφίζει."],
    choicesEn: ["Giannis is a member.", "Giannis is not a member.", "All voters are not members.", "No member votes."],
    correct: 0,
  },
  {
    premiseEl: "Όλα τα Α είναι Β. Κανένα Β δεν είναι Γ.",
    premiseEn: "All As are Bs. No B is C.",
    qEl: "Συνεπώς:",
    qEn: "Therefore:",
    choicesEl: ["Κανένα Α δεν είναι Γ.", "Όλα τα Γ είναι Α.", "Μερικά Α είναι Γ.", "Όλα τα Α είναι Γ."],
    choicesEn: ["No A is C.", "All Cs are A.", "Some As are C.", "All As are C."],
    correct: 0,
  },
  {
    premiseEl: "Αν βρέχει, το έδαφος είναι βρεγμένο. Το έδαφος δεν είναι βρεγμένο.",
    premiseEn: "If it rains, the ground is wet. The ground is not wet.",
    qEl: "Συνεπώς:",
    qEn: "Therefore:",
    choicesEl: ["Δεν βρέχει.", "Βρέχει.", "Το έδαφος είναι πάντα στεγνό.", "Η βροχή δεν επηρεάζει το έδαφος."],
    choicesEn: ["It is not raining.", "It is raining.", "The ground is always dry.", "Rain does not affect the ground."],
    correct: 0,
  },
];

export default function SyllogismGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const initGame = useCallback(() => {
    setRound(0);
    setScore(0);
    setPicked(null);
    setAnswered(false);
    setGameOver(false);
  }, []);

  const q = QUESTIONS[round];

  const pick = (i) => {
    if (answered || gameOver) return;
    setPicked(i);
    setAnswered(true);
    if (i === q.correct) setScore((s) => s + 1);
    setTimeout(() => {
      if (round >= QUESTIONS.length - 1) setGameOver(true);
      else {
        setRound((r) => r + 1);
        setPicked(null);
        setAnswered(false);
      }
    }, 900);
  };

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 flex items-center justify-center">
        <div className="max-w-md w-full rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-8 text-center">
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            {isEl ? "Συλλογισμός" : "Syllogism"}
          </p>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {isEl ? "Σκορ" : "Score"}: {score} / {QUESTIONS.length}
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

  const choices = isEl ? q.choicesEl : q.choicesEn;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 text-center mb-2">
          {isEl ? "Λογικοί συλλογισμοί" : "Logical syllogisms"}
        </h1>
        <p className="text-center text-slate-600 dark:text-slate-400 text-sm mb-6">
          {isEl ? `Ερώτηση ${round + 1} / ${QUESTIONS.length} · Σκορ: ${score}` : `Question ${round + 1} / ${QUESTIONS.length} · Score: ${score}`}
        </p>
        <div className="rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-6 mb-6">
          <p className="text-slate-800 dark:text-slate-100 font-medium mb-3">{isEl ? q.premiseEl : q.premiseEn}</p>
          <p className="text-indigo-600 dark:text-indigo-400 font-semibold mb-4">{isEl ? q.qEl : q.qEn}</p>
          <div className="space-y-2">
            {choices.map((text, i) => {
              const wrong = answered && picked === i && i !== q.correct;
              const right = answered && i === q.correct;
              return (
                <button
                  key={i}
                  type="button"
                  disabled={answered}
                  onClick={() => pick(i)}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 transition text-sm ${
                    right
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30"
                      : wrong
                        ? "border-rose-500 bg-rose-50 dark:bg-rose-900/30"
                        : "border-slate-200 dark:border-slate-600 hover:border-indigo-400"
                  } text-slate-800 dark:text-slate-100`}
                >
                  {text}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
