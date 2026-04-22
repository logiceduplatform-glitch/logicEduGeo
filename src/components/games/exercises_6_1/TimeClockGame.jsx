// src/components/games/exercises_6_1/TimeClockGame.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

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

  const TARGET_ROUNDS = 12;

  const generateTimes = () => {
    const times = [
      { hour: 12, minute: 0, text: { el: "12:00", en: "12:00" } },
      { hour: 1, minute: 0, text: { el: "1:00", en: "1:00" } },
      { hour: 2, minute: 0, text: { el: "2:00", en: "2:00" } },
      { hour: 3, minute: 0, text: { el: "3:00", en: "3:00" } },
      { hour: 6, minute: 0, text: { el: "6:00", en: "6:00" } },
      { hour: 9, minute: 0, text: { el: "9:00", en: "9:00" } },
      { hour: 12, minute: 30, text: { el: "12:30", en: "12:30" } },
      { hour: 3, minute: 30, text: { el: "3:30", en: "3:30" } },
      { hour: 6, minute: 30, text: { el: "6:30", en: "6:30" } },
      { hour: 9, minute: 30, text: { el: "9:30", en: "9:30" } },
      { hour: 2, minute: 15, text: { el: "2:15", en: "2:15" } },
      { hour: 5, minute: 45, text: { el: "5:45", en: "5:45" } }
    ];

    return times.map((time, idx) => {
      const wrongOptions = [];
      while (wrongOptions.length < 3) {
        const wrongHour = Math.floor(Math.random() * 12) + 1;
        const wrongMinute = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
        const wrongText = `${wrongHour}:${wrongMinute.toString().padStart(2, '0')}`;
        if (wrongText !== time.text.el && !wrongOptions.includes(wrongText)) {
          wrongOptions.push(wrongText);
        }
      }
      return {
        ...time,
        options: [time.text.el, ...wrongOptions].sort(() => Math.random() - 0.5)
      };
    });
  };

  const [times] = useState(generateTimes());
  const currentTime = times[currentRound];

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

  const handleAnswerSelect = (answer) => {
    if (showAnswer) return;

    setSelectedAnswer(answer);
    setShowAnswer(true);

    const isCorrect = answer === currentTime.text[lang];

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

  // Draw analog clock
  const drawClock = () => {
    const hourAngle = ((currentTime.hour % 12) + currentTime.minute / 60) * 30 - 90;
    const minuteAngle = currentTime.minute * 6 - 90;

    return (
      <svg viewBox="0 0 200 200" className="w-64 h-64">
        {/* Clock face */}
        <circle cx="100" cy="100" r="90" fill="white" stroke="#334155" strokeWidth="4" />

        {/* Hour marks */}
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

        {/* Numbers */}
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

        {/* Hour hand */}
        <line
          x1="100"
          y1="100"
          x2={100 + 45 * Math.cos(hourAngle * Math.PI / 180)}
          y2={100 + 45 * Math.sin(hourAngle * Math.PI / 180)}
          stroke="#1e40af"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Minute hand */}
        <line
          x1="100"
          y1="100"
          x2={100 + 65 * Math.cos(minuteAngle * Math.PI / 180)}
          y2={100 + 65 * Math.sin(minuteAngle * Math.PI / 180)}
          stroke="#dc2626"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Center dot */}
        <circle cx="100" cy="100" r="6" fill="#334155" />
      </svg>
    );
  };

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

      {/* Header */}
      <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">
              {lang === "el" ? "Μάθε την Ώρα" : "Learn the Time"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Ρολόι ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Clock ${currentRound + 1}/${TARGET_ROUNDS}`}
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

      {/* Game Area */}
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border-4 border-blue-400">
          {/* Clock Display */}
          <div className="text-center mb-8">
            <p className="text-2xl font-bold text-slate-700 mb-6">
              {lang === "el" ? "Τι ώρα είναι;" : "What time is it?"}
            </p>
            <div className="flex justify-center mb-6">
              {drawClock()}
            </div>
          </div>

          {/* Answer Options */}
          {!showAnswer && (
            <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
              {currentTime.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(option)}
                  className="p-6 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 hover:from-blue-200 hover:to-cyan-200 border-4 border-blue-300 hover:border-blue-500 transition-all duration-200 transform hover:scale-105 shadow-lg text-3xl font-bold text-slate-800"
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {/* Show Answer */}
          {showAnswer && selectedAnswer === currentTime.text[lang] && (
            <div className="text-center animate-fadeIn">
              <div className="inline-block bg-green-100 rounded-3xl p-8 border-4 border-green-400">
                <div className="text-8xl mb-4">✅</div>
                <p className="text-3xl font-bold text-green-700">
                  {lang === "el"
                    ? `🎉 Σωστά! Είναι ${currentTime.text.el}`
                    : `🎉 Correct! It's ${currentTime.text.en}`}
                </p>
              </div>
            </div>
          )}

          {showAnswer && selectedAnswer !== currentTime.text[lang] && (
            <div className="text-center animate-fadeIn">
              <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
                <p className="text-3xl font-bold text-red-700">
                  {lang === "el"
                    ? `Προσπάθησε ξανά! Κοίταξε τους δείκτες!`
                    : `Try again! Look at the hands!`}
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
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Ξέρεις να διαβάζεις την ώρα!" : "Perfect! You can read the time!"}
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

