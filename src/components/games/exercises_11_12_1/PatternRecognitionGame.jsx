import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import useSafeTimeout from "../../../hooks/useSafeTimeout";
import { VoiceService } from "../../../services/VoiceService";

export default function PatternRecognitionGame({ lang = "el", onComplete }) {
  const { safeTimeout } = useSafeTimeout();
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

  const NEXT_DELAY = 2000;
  const WRONG_DELAY = 1200;
  const TARGET_ROUNDS = 10;

  const roundsData = {
    el: [
      {
        id: 1,
        question: "Ποιος αριθμός ακολουθεί;",
        pattern: ["2", "4", "8", "16", "32"],
        correctAnswer: "64",
        options: ["48", "64", "128"],
        color: "#EF4444",
        hint: "x2"
      },
      {
        id: 2,
        question: "Ποιος αριθμός ακολουθεί;",
        pattern: ["1", "1", "2", "3", "5"],
        correctAnswer: "8",
        options: ["6", "7", "8"],
        color: "#3B82F6",
        hint: "Fibonacci"
      },
      {
        id: 3,
        question: "Ποιο σχήμα ακολουθεί;",
        pattern: ["🔺", "🔻", "🔺🔺", "🔻🔻", "🔺🔺🔺"],
        correctAnswer: "🔻🔻🔻",
        options: ["🔺🔺🔺", "🔻🔻🔻", "🔺🔻🔺"],
        color: "#10B981"
      },
      {
        id: 4,
        question: "Ποιος αριθμός ακολουθεί;",
        pattern: ["3", "6", "12", "24", "48"],
        correctAnswer: "96",
        options: ["72", "84", "96"],
        color: "#EAB308",
        hint: "x2"
      },
      {
        id: 5,
        question: "Ποιος αριθμός ακολουθεί;",
        pattern: ["100", "90", "81", "73", "66"],
        correctAnswer: "60",
        options: ["58", "60", "62"],
        color: "#EC4899",
        hint: "-10, -9, -8, -7, ..."
      },
      {
        id: 6,
        question: "Ποιος αριθμός ακολουθεί;",
        pattern: ["1", "4", "9", "16", "25"],
        correctAnswer: "36",
        options: ["30", "36", "49"],
        color: "#8B5CF6",
        hint: "n\u00B2"
      },
      {
        id: 7,
        question: "Ποιο σύμβολο ακολουθεί;",
        pattern: ["\u2660", "\u2665", "\u2666", "\u2663", "\u2660"],
        correctAnswer: "\u2665",
        options: ["\u2666", "\u2665", "\u2663"],
        color: "#F59E0B"
      },
      {
        id: 8,
        question: "Ποιος αριθμός ακολουθεί;",
        pattern: ["0", "1", "3", "6", "10"],
        correctAnswer: "15",
        options: ["13", "15", "20"],
        color: "#14B8A6",
        hint: "+1, +2, +3, +4, ..."
      },
      {
        id: 9,
        question: "Ποιος αριθμός ακολουθεί;",
        pattern: ["2", "6", "18", "54", "162"],
        correctAnswer: "486",
        options: ["324", "486", "512"],
        color: "#06B6D4",
        hint: "x3"
      },
      {
        id: 10,
        question: "Ποιος αριθμός ακολουθεί;",
        pattern: ["1", "2", "4", "7", "11"],
        correctAnswer: "16",
        options: ["14", "16", "18"],
        color: "#A855F7",
        hint: "+1, +2, +3, +4, ..."
      }
    ],
    en: [
      {
        id: 1,
        question: "What number comes next?",
        pattern: ["2", "4", "8", "16", "32"],
        correctAnswer: "64",
        options: ["48", "64", "128"],
        color: "#EF4444",
        hint: "x2"
      },
      {
        id: 2,
        question: "What number comes next?",
        pattern: ["1", "1", "2", "3", "5"],
        correctAnswer: "8",
        options: ["6", "7", "8"],
        color: "#3B82F6",
        hint: "Fibonacci"
      },
      {
        id: 3,
        question: "What shape comes next?",
        pattern: ["🔺", "🔻", "🔺🔺", "🔻🔻", "🔺🔺🔺"],
        correctAnswer: "🔻🔻🔻",
        options: ["🔺🔺🔺", "🔻🔻🔻", "🔺🔻🔺"],
        color: "#10B981"
      },
      {
        id: 4,
        question: "What number comes next?",
        pattern: ["3", "6", "12", "24", "48"],
        correctAnswer: "96",
        options: ["72", "84", "96"],
        color: "#EAB308",
        hint: "x2"
      },
      {
        id: 5,
        question: "What number comes next?",
        pattern: ["100", "90", "81", "73", "66"],
        correctAnswer: "60",
        options: ["58", "60", "62"],
        color: "#EC4899",
        hint: "-10, -9, -8, -7, ..."
      },
      {
        id: 6,
        question: "What number comes next?",
        pattern: ["1", "4", "9", "16", "25"],
        correctAnswer: "36",
        options: ["30", "36", "49"],
        color: "#8B5CF6",
        hint: "n\u00B2"
      },
      {
        id: 7,
        question: "What symbol comes next?",
        pattern: ["\u2660", "\u2665", "\u2666", "\u2663", "\u2660"],
        correctAnswer: "\u2665",
        options: ["\u2666", "\u2665", "\u2663"],
        color: "#F59E0B"
      },
      {
        id: 8,
        question: "What number comes next?",
        pattern: ["0", "1", "3", "6", "10"],
        correctAnswer: "15",
        options: ["13", "15", "20"],
        color: "#14B8A6",
        hint: "+1, +2, +3, +4, ..."
      },
      {
        id: 9,
        question: "What number comes next?",
        pattern: ["2", "6", "18", "54", "162"],
        correctAnswer: "486",
        options: ["324", "486", "512"],
        color: "#06B6D4",
        hint: "x3"
      },
      {
        id: 10,
        question: "What number comes next?",
        pattern: ["1", "2", "4", "7", "11"],
        correctAnswer: "16",
        options: ["14", "16", "18"],
        color: "#A855F7",
        hint: "+1, +2, +3, +4, ..."
      }
    ]
  };

  const rounds = roundsData[lang];
  const round = rounds[currentRound];

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    wrongSoundRef.current = new Audio("/sounds/wrong.mp3");
    correctSoundRef.current.preload = "auto";
    wrongSoundRef.current.preload = "auto";
  }, []);

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "🔄", "✅"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);
    safeTimeout(() => setCelebrationEmojis([]), 2000);
  };

  const speakQuestion = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(round.question);
      utterance.lang = lang === 'el' ? 'el-GR' : 'en-US';
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      const voice = VoiceService.getVoice(lang);
      if (voice) utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    const timer = safeTimeout(() => speakQuestion(), 500);
    return () => clearTimeout(timer);
  }, [currentRound]);

  const handleAnswerSelect = (answer) => {
    if (showAnswer) return;
    setSelectedAnswer(answer);
    setShowAnswer(true);
    const isCorrect = answer === round.correctAnswer;

    if (isCorrect) {
      correctSoundRef.current?.play().catch(() => {});
      const newScore = score + 1;
      setScore(newScore);
      setScorePopup({ id: Date.now(), x: 50 });
      safeTimeout(() => setScorePopup(null), 1000);

      updateProgress({ title: "Pattern Recognition Game", score: newScore, total: TARGET_ROUNDS, index: currentRound + 1 });
      completeQuiz({ title: "Pattern Recognition Game", score: 1, total: 1 });

      safeTimeout(() => {
        if (currentRound + 1 < TARGET_ROUNDS) {
          setCurrentRound(prev => prev + 1);
          setSelectedAnswer(null);
          setShowAnswer(false);
        } else {
          createCelebrationEmojis();
          setShowCelebration(true);
          safeTimeout(() => { if (onComplete) onComplete({ score: newScore, total: TARGET_ROUNDS }); }, NEXT_DELAY);
        }
      }, NEXT_DELAY);
    } else {
      wrongSoundRef.current?.play().catch(() => {});
      safeTimeout(() => { setSelectedAnswer(null); setShowAnswer(false); }, WRONG_DELAY);
    }
  };

  const progressPercent = Math.round(((currentRound + 1) / TARGET_ROUNDS) * 100);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-indigo-100 via-violet-100 to-purple-100 p-4 sm:p-8 rounded-xl overflow-hidden">
      {celebrationEmojis.map((item) => (
        <div key={item.id} className="absolute text-4xl animate-float-up pointer-events-none z-20" style={{ left: `${item.x}%`, top: "50%", animationDelay: `${item.delay}s` }}>
          {item.emoji}
        </div>
      ))}

      {scorePopup && (
        <div key={scorePopup.id} className="absolute text-4xl font-bold text-green-600 pointer-events-none z-50" style={{ left: `${scorePopup.x}%`, top: "40%", animation: "float-up 1s ease-out forwards" }}>
          +1 ⭐
        </div>
      )}

      <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">
              {lang === "el" ? "Αναγνώριση Μοτίβου - Προχωρημένο" : "Pattern Recognition - Advanced"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el" ? `Μοτίβο ${currentRound + 1}/${TARGET_ROUNDS}` : `Pattern ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-violet-600">🔄 {score}</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-400 to-violet-500 transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }} />
          </div>
          <span className="text-sm font-semibold text-slate-600">{progressPercent}%</span>
        </div>
      </div>

      <div className="text-center mb-8">
        <div className="inline-block bg-white/90 backdrop-blur rounded-2xl p-8 shadow-xl border-4" style={{ borderColor: round.color }}>
          <div className="text-7xl mb-4">🧠</div>
          <h2 className="text-3xl font-bold mb-4 text-slate-800">{round.question}</h2>
          <button onClick={speakQuestion} className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-xl font-bold rounded-full hover:scale-105 transition-transform shadow-lg">
            🔊 {lang === "el" ? "Άκουσε" : "Listen"}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mb-8">
        <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border-4" style={{ borderColor: round.color }}>
          <div className="flex justify-center items-center gap-4 mb-6 flex-wrap">
            {round.pattern.map((item, index) => (
              <div key={index} className="text-5xl sm:text-6xl font-bold text-slate-800 bg-white rounded-xl px-4 py-3 shadow-md border-2 border-slate-200">
                {item}
              </div>
            ))}
            <div className="text-5xl sm:text-6xl font-bold text-indigo-400 animate-pulse bg-yellow-50 rounded-xl px-4 py-3 border-2 border-yellow-300">
              ?
            </div>
          </div>
          {round.hint && (
            <p className="text-center text-sm text-slate-400 italic">
              {lang === "el" ? `Υπόδειξη: ${round.hint}` : `Hint: ${round.hint}`}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto mb-8">
        <div className="grid grid-cols-3 gap-6">
          {round.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = showAnswer && option === round.correctAnswer;
            const isWrong = showAnswer && isSelected && option !== round.correctAnswer;

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={showAnswer}
                className={`
                  relative p-6 rounded-3xl border-4 transition-all duration-300 transform
                  ${isCorrect ? "bg-green-100 border-green-500 scale-110" : ""}
                  ${isWrong ? "bg-red-100 border-red-500 animate-shake" : ""}
                  ${!showAnswer ? "bg-white border-slate-300 hover:border-violet-400 hover:scale-110 cursor-pointer shadow-lg" : "cursor-not-allowed"}
                  ${showAnswer && !isSelected && option !== round.correctAnswer ? "opacity-50" : ""}
                `}
              >
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl font-bold text-slate-800">{option}</div>
                  {isCorrect && <div className="text-5xl animate-bounce absolute -top-4 -right-4">✅</div>}
                  {isWrong && <div className="text-5xl absolute -top-4 -right-4">❌</div>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {showAnswer && (
        <div className="text-center animate-fadeIn">
          {selectedAnswer === round.correctAnswer ? (
            <div className="bg-green-100 rounded-2xl p-6 inline-block border-4 border-green-400">
              <p className="text-3xl font-bold text-green-700">
                {lang === "el" ? `🎉 Σωστά! Η απάντηση είναι ${round.correctAnswer}!` : `🎉 Correct! The answer is ${round.correctAnswer}!`}
              </p>
            </div>
          ) : (
            <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
              <p className="text-3xl font-bold text-red-700">
                {lang === "el" ? `Η σωστή απάντηση είναι: ${round.correctAnswer}` : `The correct answer is: ${round.correctAnswer}`}
              </p>
            </div>
          )}
        </div>
      )}

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-300/80 to-violet-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🧠🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Εξαιρετικά! Είσαι ειδικός στα μοτίβα!" : "Excellent! You're a pattern expert!"}
            </h3>
          </div>
        </div>
      )}

      <style>{`
        @keyframes float-up { 0% { transform: translateY(0) scale(1); opacity: 1; } 100% { transform: translateY(-200px) scale(1.5); opacity: 0; } }
        .animate-float-up { animation: float-up 2s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        .animate-fadeIn { animation: fadeIn 0.5s ease-in; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-10px); } 75% { transform: translateX(10px); } }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
}
