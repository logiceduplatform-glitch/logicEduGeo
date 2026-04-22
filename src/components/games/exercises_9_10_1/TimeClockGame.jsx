import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

function formatClockText(hour24, minute) {
  const h12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  const m = minute.toString().padStart(2, "0");
  return `${h12}:${m}`;
}

function buildRounds() {
  const clockSpecs = [
    { hour: 10, minute: 10 },
    { hour: 14, minute: 40 },
    { hour: 9, minute: 5 },
    { hour: 16, minute: 55 },
    { hour: 11, minute: 35 },
    { hour: 7, minute: 50 },
    { hour: 13, minute: 25 },
    { hour: 18, minute: 15 },
  ];

  const mins = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  const clockRounds = clockSpecs.map(({ hour: hour24, minute }) => {
    const text = formatClockText(hour24, minute);
    const wrong = new Set();
    let guard = 0;
    while (wrong.size < 3 && guard < 80) {
      guard++;
      const h24 = Math.floor(Math.random() * 24);
      const mi = mins[Math.floor(Math.random() * mins.length)];
      const cand = formatClockText(h24, mi);
      if (cand !== text) wrong.add(cand);
    }
    const wrongArr = Array.from(wrong);
    return {
      kind: "clock",
      hour24,
      minute,
      text: { el: text, en: text },
      options: { el: [text, ...wrongArr].sort(() => Math.random() - 0.5), en: [text, ...wrongArr].sort(() => Math.random() - 0.5) },
    };
  });

  const elapsedRounds = [
    {
      kind: "elapsed",
      prompt: {
        el: "Ξεκινάς στις 8:15 και διαρκεί 50 λεπτά. Πότε τελειώνεις;",
        en: "You start at 8:15 and it lasts 50 minutes. When do you finish?",
      },
      correct: { el: "9:05", en: "9:05" },
    },
    {
      kind: "elapsed",
      prompt: {
        el: "Από τις 2:30 μ.μ. μέχρι τις 4:10 μ.μ. πόση ώρα πέρασε;",
        en: "From 2:30 p.m. to 4:10 p.m., how much time passed?",
      },
      correct: { el: "1 ώρα 40 λεπτά", en: "1 hour 40 minutes" },
    },
    {
      kind: "elapsed",
      prompt: {
        el: "Στην Αθήνα είναι 12:00. Στο Λονδίνο (1 ώρα πίσω) τι ώρα είναι;",
        en: "In Athens it is 12:00. In London (1 hour behind) what time is it?",
      },
      correct: { el: "11:00", en: "11:00" },
    },
    {
      kind: "elapsed",
      prompt: {
        el: "Μια ταινία αρχίζει 19:20 και διαρκεί 2 ώρες 10 λεπτά. Πότε τελειώνει;",
        en: "A film starts at 19:20 and lasts 2 hours 10 minutes. When does it end?",
      },
      correct: { el: "21:30", en: "21:30" },
    },
  ];

  elapsedRounds.forEach((r) => {
    const optsEl = new Set([r.correct.el]);
    const optsEn = new Set([r.correct.en]);
    const poolEl = ["8:00", "9:30", "10:15", "11:45", "12:20", "1 ώρα 20 λεπτά", "2 ώρες", "10:00", "8:50", "21:00", "22:00", "2 ώρες 30 λεπτά"];
    const poolEn = ["8:00", "9:30", "10:15", "11:45", "12:20", "1 hour 20 minutes", "2 hours", "10:00", "8:50", "9:00", "22:00", "2 hours 30 minutes"];
    let g = 0;
    while (optsEl.size < 4 && g < 100) {
      g++;
      const c = poolEl[Math.floor(Math.random() * poolEl.length)];
      if (c !== r.correct.el) optsEl.add(c);
    }
    g = 0;
    while (optsEn.size < 4 && g < 100) {
      g++;
      const c = poolEn[Math.floor(Math.random() * poolEn.length)];
      if (c !== r.correct.en) optsEn.add(c);
    }
    r.options = { el: [...optsEl].sort(() => Math.random() - 0.5), en: [...optsEn].sort(() => Math.random() - 0.5) };
  });

  return [...clockRounds, ...elapsedRounds];
}

export default function TimeClockGame({ lang = "el", onComplete }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const [times] = useState(buildRounds());
  const TARGET_ROUNDS = times.length;
  const current = times[currentRound];

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    wrongSoundRef.current = new Audio("/sounds/wrong.mp3");
    correctSoundRef.current.preload = "auto";
    wrongSoundRef.current.preload = "auto";
  }, []);

  useEffect(() => {
    setSelectedAnswer(null);
    setShowAnswer(false);
  }, [currentRound]);

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "⏰", "🕐", "🏆"][Math.floor(Math.random() * 7)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);
    setTimeout(() => setCelebrationEmojis([]), 2000);
  };

  const correctValue = current.kind === "clock" ? current.text.el : current.correct[lang];

  const handleAnswerSelect = (answer) => {
    if (showAnswer) return;

    setSelectedAnswer(answer);
    setShowAnswer(true);

    const isCorrect = answer === correctValue;

    if (isCorrect) {
      correctSoundRef.current?.play().catch(() => {});
      const newScore = score + 1;
      setScore(newScore);

      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      updateProgress({
        title: "Time & Clock Game",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      completeQuiz({
        title: "Time & Clock Game",
        score: 1,
        total: 1,
      });

      setTimeout(() => {
        if (currentRound + 1 < TARGET_ROUNDS) {
          setCurrentRound(prev => prev + 1);
        } else {
          createCelebrationEmojis();
          setShowCelebration(true);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 2500);
        }
      }, 2000);
    } else {
      wrongSoundRef.current?.play().catch(() => {});
      setTimeout(() => {
        setSelectedAnswer(null);
        setShowAnswer(false);
      }, 1500);
    }
  };

  const progressPercent = Math.round(((currentRound + 1) / TARGET_ROUNDS) * 100);

  const drawClock = () => {
    const hour = current.kind === "clock" ? current.hour24 : 12;
    const minute = current.kind === "clock" ? current.minute : 0;
    const hourAngle = ((hour % 12) + minute / 60) * 30 - 90;
    const minuteAngle = minute * 6 - 90;

    return (
      <svg viewBox="0 0 200 200" className="w-64 h-64">
        <circle cx="100" cy="100" r="90" fill="white" stroke="#334155" strokeWidth="4" />

        {[...Array(12)].map((_, i) => {
          const angle = (i * 30 - 90) * Math.PI / 180;
          const x1 = 100 + 75 * Math.cos(angle);
          const y1 = 100 + 75 * Math.sin(angle);
          const x2 = 100 + 85 * Math.cos(angle);
          const y2 = 100 + 85 * Math.sin(angle);
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#334155" strokeWidth="3" />
          );
        })}

        {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, i) => {
          const angle = (i * 30 - 90) * Math.PI / 180;
          const x = 100 + 65 * Math.cos(angle);
          const y = 100 + 65 * Math.sin(angle);
          return (
            <text
              key={num}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="20"
              fontWeight="bold"
              fill="#334155"
            >
              {num}
            </text>
          );
        })}

        <line
          x1="100"
          y1="100"
          x2={100 + 45 * Math.cos(hourAngle * Math.PI / 180)}
          y2={100 + 45 * Math.sin(hourAngle * Math.PI / 180)}
          stroke="#1e40af"
          strokeWidth="6"
          strokeLinecap="round"
        />

        <line
          x1="100"
          y1="100"
          x2={100 + 65 * Math.cos(minuteAngle * Math.PI / 180)}
          y2={100 + 65 * Math.sin(minuteAngle * Math.PI / 180)}
          stroke="#dc2626"
          strokeWidth="4"
          strokeLinecap="round"
        />

        <circle cx="100" cy="100" r="6" fill="#334155" />
      </svg>
    );
  };

  const optionsList = current.kind === "clock" ? current.options[lang] : current.options[lang];

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-blue-100 via-cyan-100 to-teal-100 p-4 sm:p-8 rounded-xl overflow-hidden">
      {celebrationEmojis.map((item) => (
        <div
          key={item.id}
          className="absolute text-4xl animate-float-up pointer-events-none z-20"
          style={{
            left: `${item.x}%`,
            top: "50%",
            animationDelay: `${item.delay}s`,
          }}
        >
          {item.emoji}
        </div>
      ))}

      {scorePopup && (
        <div
          key={scorePopup.id}
          className="absolute text-4xl font-bold text-green-600 pointer-events-none z-50"
          style={{
            left: `${scorePopup.x}%`,
            top: "40%",
            animation: "float-up 1s ease-out forwards",
          }}
        >
          +1 ⭐⭐
        </div>
      )}

      <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">
              {lang === "el" ? "Ώρα & Διάρκεια" : "Time & Duration"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Γύρος ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Round ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-blue-600">
            ⏰ {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-cyan-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-600">
            {progressPercent}%
          </span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border-4 border-blue-400">
          <div className="text-center mb-8">
            <p className="text-2xl font-bold text-slate-700 mb-6">
              {current.kind === "clock"
                ? (lang === "el" ? "Τι ώρα δείχνει το ρολόι;" : "What time does the clock show?")
                : (lang === "el" ? "Λύσε το πρόβλημα:" : "Solve the problem:")}
            </p>
            {current.kind === "clock" ? (
              <div className="flex justify-center mb-6">{drawClock()}</div>
            ) : (
              <div className="mb-6">
                <div className="text-6xl mb-4">⏱️🌍</div>
                <p className="text-xl sm:text-2xl font-semibold text-slate-800 px-2">{current.prompt[lang]}</p>
              </div>
            )}
          </div>

          {!showAnswer && (
            <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
              {optionsList.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(option)}
                  className="p-6 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 hover:from-blue-200 hover:to-cyan-200 border-4 border-blue-300 hover:border-blue-500 transition-all duration-200 transform hover:scale-105 shadow-lg text-xl sm:text-2xl font-bold text-slate-800"
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {showAnswer && selectedAnswer === correctValue && (
            <div className="text-center animate-fadeIn">
              <div className="inline-block bg-green-100 rounded-3xl p-8 border-4 border-green-400">
                <div className="text-8xl mb-4">✅</div>
                <p className="text-3xl font-bold text-green-700">
                  {lang === "el"
                    ? `🎉 Σωστά! ${correctValue}`
                    : `🎉 Correct! ${correctValue}`}
                </p>
              </div>
            </div>
          )}

          {showAnswer && selectedAnswer !== correctValue && (
            <div className="text-center animate-fadeIn">
              <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
                <p className="text-3xl font-bold text-red-700">
                  {lang === "el"
                    ? `Προσπάθησε ξανά! Σκέψου διάρκεια, ώρα ή διαφορά ζώνης.`
                    : `Try again! Think about duration, clock time, or time zones.`}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-300/80 to-cyan-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">⏰🏆</div>
            <h3 className="text-4xl font-bold text-white px-4">
              {lang === "el" ? "Τέλεια! Καταλαβαίνεις χρόνο και διάρκεια!" : "Perfect! You understand time and duration!"}
            </h3>
          </div>
        </div>
      )}

      <style>{`
        @keyframes float-up {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-200px) scale(1.5); opacity: 0; }
        }
        .animate-float-up {
          animation: float-up 2s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in;
        }
      `}</style>
    </div>
  );
}
