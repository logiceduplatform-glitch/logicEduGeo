import React, { useState, useEffect, useContext, useCallback, useMemo } from "react";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import { LanguageContext } from "../i18n/LanguageContext";
import { VoiceService } from "../services/VoiceService";

const T = {
  el: {
    title: "Φωνητικό Κουίζ",
    subtitle: "Άκου την ερώτηση και πάτα την σωστή απάντηση.",
    play: "▶ Ξανά",
    next: "Επόμενη →",
    correct: "Μπράβο!",
    wrong: "Όχι ακριβώς...",
    score: "Σκορ",
    of: "από",
    finished: "Τέλειωσε!",
    restart: "Ξανά",
    notSupported: "Ο φυλλομετρητής σου δεν υποστηρίζει φωνή. Δοκίμασε Chrome.",
  },
  en: {
    title: "Voice Quiz",
    subtitle: "Listen to the question and tap the correct answer.",
    play: "▶ Replay",
    next: "Next →",
    correct: "Great!",
    wrong: "Not quite...",
    score: "Score",
    of: "of",
    finished: "Done!",
    restart: "Restart",
    notSupported: "Your browser doesn't support voice. Try Chrome.",
  },
};

const QUESTIONS = {
  el: [
    { q: "Πόσα δάχτυλα έχει ένα χέρι;", choices: ["3", "4", "5", "6"], correct: 2 },
    { q: "Τι χρώμα είναι ο ήλιος;", choices: ["Μπλε", "Κίτρινο", "Κόκκινο", "Πράσινο"], correct: 1 },
    { q: "Ποιο ζώο κάνει 'γαβ';", choices: ["Γάτα", "Σκύλος", "Αγελάδα", "Αλεπού"], correct: 1 },
    { q: "Πόσο κάνει 2 συν 3;", choices: ["4", "5", "6", "7"], correct: 1 },
    { q: "Ποιος είναι ο πρώτος μήνας του χρόνου;", choices: ["Μάρτιος", "Φεβρουάριος", "Ιανουάριος", "Δεκέμβριος"], correct: 2 },
  ],
  en: [
    { q: "How many fingers on one hand?", choices: ["3", "4", "5", "6"], correct: 2 },
    { q: "What color is the sun?", choices: ["Blue", "Yellow", "Red", "Green"], correct: 1 },
    { q: "Which animal says 'woof'?", choices: ["Cat", "Dog", "Cow", "Fox"], correct: 1 },
    { q: "What is 2 plus 3?", choices: ["4", "5", "6", "7"], correct: 1 },
    { q: "What is the first month of the year?", choices: ["March", "February", "January", "December"], correct: 2 },
  ],
};

const COLORS = [
  "from-rose-500 to-rose-600",
  "from-blue-500 to-blue-600",
  "from-amber-500 to-amber-600",
  "from-emerald-500 to-emerald-600",
];

export default function VoiceQuizPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;
  const questions = useMemo(() => QUESTIONS[lang] || QUESTIONS.en, [lang]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [picked, setPicked] = useState(null);
  const [finished, setFinished] = useState(false);

  const supported = VoiceService.isAvailable();

  const speakCurrent = useCallback(() => {
    if (!supported) return;
    const q = questions[idx];
    if (!q) return;
    VoiceService.stopSpeaking();
    const text = q.q + " " + q.choices.map((c, i) => `${i + 1}. ${c}.`).join(" ");
    VoiceService.speakCustom(text, { lang, rate: 0.85 });
  }, [idx, questions, lang, supported]);

  useEffect(() => {
    if (!finished) speakCurrent();
    return () => VoiceService.stopSpeaking();
  }, [idx, finished, speakCurrent]);

  const handlePick = (choiceIdx) => {
    if (answered) return;
    setPicked(choiceIdx);
    setAnswered(true);
    const isCorrect = choiceIdx === questions[idx].correct;
    if (isCorrect) {
      setScore((s) => s + 1);
      VoiceService.speakCustom(l.correct, { lang, rate: 0.95 });
    } else {
      VoiceService.speakCustom(l.wrong, { lang, rate: 0.95 });
    }
  };

  const handleNext = () => {
    if (idx + 1 >= questions.length) {
      setFinished(true);
      VoiceService.stopSpeaking();
      return;
    }
    setIdx((i) => i + 1);
    setAnswered(false);
    setPicked(null);
  };

  const handleRestart = () => {
    setIdx(0);
    setScore(0);
    setAnswered(false);
    setPicked(null);
    setFinished(false);
  };

  if (!supported) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center p-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl text-center">
            <div className="text-4xl mb-2">🔊</div>
            <p className="font-bold">{l.notSupported}</p>
          </div>
        </main>
      </>
    );
  }

  if (finished) {
    return (
      <>
        <Navbar />
        <SEO title={l.title} canonical="/voice-quiz" />
        <main className="min-h-screen bg-gradient-to-br from-amber-50 to-pink-50 dark:from-slate-900 dark:to-slate-800 py-12">
          <div className="max-w-md mx-auto px-4 text-center bg-white dark:bg-slate-800 rounded-2xl p-8 shadow">
            <div className="text-6xl mb-3">🎉</div>
            <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{l.finished}</h1>
            <div className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 my-4">
              {score} {l.of} {questions.length}
            </div>
            <button
              type="button"
              onClick={handleRestart}
              className="px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl"
            >
              {l.restart}
            </button>
          </div>
        </main>
      </>
    );
  }

  const q = questions[idx];

  return (
    <>
      <Navbar />
      <SEO title={l.title} description={l.subtitle} canonical="/voice-quiz" />
      <main className="min-h-screen bg-gradient-to-br from-amber-50 to-pink-50 dark:from-slate-900 dark:to-slate-800 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-6">
            <div className="text-5xl mb-2">🔊</div>
            <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{l.title}</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">{l.subtitle}</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 p-5 mb-4">
            <div className="flex items-center justify-between mb-3 text-sm text-slate-600 dark:text-slate-400">
              <span>Q{idx + 1} / {questions.length}</span>
              <span>{l.score}: {score}</span>
            </div>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">{q.q}</div>

            <button
              type="button"
              onClick={speakCurrent}
              className="mb-4 px-3 py-1.5 text-sm font-bold rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 hover:bg-blue-200"
            >
              {l.play}
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {q.choices.map((c, i) => {
                const isCorrect = i === q.correct;
                const showResult = answered;
                let cls = `bg-gradient-to-r ${COLORS[i % COLORS.length]} text-white`;
                if (showResult) {
                  if (isCorrect) cls = "bg-emerald-500 text-white ring-4 ring-emerald-300";
                  else if (i === picked) cls = "bg-rose-500 text-white";
                  else cls += " opacity-50";
                }
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handlePick(i)}
                    disabled={answered}
                    className={`p-4 rounded-xl font-bold text-left text-lg transition-all hover:scale-[1.02] active:scale-95 ${cls}`}
                  >
                    {i + 1}. {c}
                  </button>
                );
              })}
            </div>

            {answered && (
              <button
                type="button"
                onClick={handleNext}
                className="mt-4 w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow"
              >
                {l.next}
              </button>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
