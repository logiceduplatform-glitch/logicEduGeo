// src/components/games/SyllableListening.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import { VoiceService } from "../../../services/VoiceService";

export default function SyllableListening({ lang = "el", onComplete }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedSyllable, setSelectedSyllable] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const TARGET_ROUNDS = 10; // 10 συλλαβές

  const syllablesData = {
    el: [
      {
        id: 1,
        correct: "ΠΑ",
        audio: "pa",
        options: ["ΠΑ", "ΜΑ", "ΒΑ", "ΤΑ"],
        color: "#3B82F6"
      },
      {
        id: 2,
        correct: "ΜΑ",
        audio: "ma",
        options: ["ΠΑ", "ΜΑ", "ΒΑ", "ΝΑ"],
        color: "#10B981"
      },
      {
        id: 3,
        correct: "ΒΑ",
        audio: "ba",
        options: ["ΠΑ", "ΒΑ", "ΔΑ", "ΓΑ"],
        color: "#F59E0B"
      },
      {
        id: 4,
        correct: "ΤΑ",
        audio: "ta",
        options: ["ΤΑ", "ΔΑ", "ΚΑ", "ΠΑ"],
        color: "#EF4444"
      },
      {
        id: 5,
        correct: "ΛΑ",
        audio: "la",
        options: ["ΛΑ", "ΡΑ", "ΝΑ", "ΜΑ"],
        color: "#8B5CF6"
      },
      {
        id: 6,
        correct: "ΣΑ",
        audio: "sa",
        options: ["ΣΑ", "ΖΑ", "ΞΑ", "ΨΑ"],
        color: "#EC4899"
      },
      {
        id: 7,
        correct: "ΚΑ",
        audio: "ka",
        options: ["ΚΑ", "ΓΑ", "ΧΑ", "ΤΑ"],
        color: "#06B6D4"
      },
      {
        id: 8,
        correct: "ΡΑ",
        audio: "ra",
        options: ["ΡΑ", "ΛΑ", "ΝΑ", "ΜΑ"],
        color: "#F97316"
      },
      {
        id: 9,
        correct: "ΝΑ",
        audio: "na",
        options: ["ΝΑ", "ΜΑ", "ΛΑ", "ΡΑ"],
        color: "#14B8A6"
      },
      {
        id: 10,
        correct: "ΔΑ",
        audio: "da",
        options: ["ΔΑ", "ΤΑ", "ΘΑ", "ΒΑ"],
        color: "#A855F7"
      }
    ],
    en: [
      {
        id: 1,
        correct: "PA",
        audio: "pa",
        options: ["PA", "MA", "BA", "TA"],
        color: "#3B82F6"
      },
      {
        id: 2,
        correct: "MA",
        audio: "ma",
        options: ["PA", "MA", "BA", "NA"],
        color: "#10B981"
      },
      {
        id: 3,
        correct: "BA",
        audio: "ba",
        options: ["PA", "BA", "DA", "GA"],
        color: "#F59E0B"
      },
      {
        id: 4,
        correct: "TA",
        audio: "ta",
        options: ["TA", "DA", "KA", "PA"],
        color: "#EF4444"
      },
      {
        id: 5,
        correct: "LA",
        audio: "la",
        options: ["LA", "RA", "NA", "MA"],
        color: "#8B5CF6"
      },
      {
        id: 6,
        correct: "SA",
        audio: "sa",
        options: ["SA", "ZA", "XA", "FA"],
        color: "#EC4899"
      },
      {
        id: 7,
        correct: "KA",
        audio: "ka",
        options: ["KA", "GA", "HA", "TA"],
        color: "#06B6D4"
      },
      {
        id: 8,
        correct: "RA",
        audio: "ra",
        options: ["RA", "LA", "NA", "MA"],
        color: "#F97316"
      },
      {
        id: 9,
        correct: "NA",
        audio: "na",
        options: ["NA", "MA", "LA", "RA"],
        color: "#14B8A6"
      },
      {
        id: 10,
        correct: "DA",
        audio: "da",
        options: ["DA", "TA", "THA", "BA"],
        color: "#A855F7"
      }
    ]
  };

  const syllables = syllablesData[lang];
  const round = syllables[currentRound];

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
      emoji: ["🎉", "⭐", "✨", "🌟", "🔤", "✅"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const playSyllableSound = () => {
    // Using Web Speech API to pronounce syllables
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(round.correct);
      utterance.lang = lang === 'el' ? 'el-GR' : 'en-US';
      utterance.rate = 0.7; // Slower for kids
      utterance.pitch = 1.2; // Higher pitch for kids
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      const voice = VoiceService.getVoice(lang);
      if (voice) utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSyllableSelect = (syllable) => {
    if (showAnswer) return;

    setSelectedSyllable(syllable);
    setShowAnswer(true);

    const isCorrect = syllable === round.correct;

    if (isCorrect) {
      correctSoundRef.current?.play().catch(() => {});

      const newScore = score + 1;
      setScore(newScore);

      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      updateProgress({
        title: "Syllable Listening",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      completeQuiz({
        title: "Syllable Listening",
        score: 1,
        total: 1,
      });

      setTimeout(() => {
        if (currentRound + 1 < TARGET_ROUNDS) {
          setCurrentRound(prev => prev + 1);
          setSelectedSyllable(null);
          setShowAnswer(false);
        } else {
          createCelebrationEmojis();
          setShowCelebration(true);
          setTimeout(() => {
            if (onComplete) {
              onComplete();
            }
          }, 2500);
        }
      }, 2000);
    } else {
      wrongSoundRef.current?.play().catch(() => {});

      setTimeout(() => {
        setSelectedSyllable(null);
        setShowAnswer(false);
      }, 1500);
    }
  };

  const progressPercent = Math.round((currentRound / TARGET_ROUNDS) * 100);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Άκου τη Συλλαβή" : "Listen to the Syllable"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Συλλαβή ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Syllable ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-indigo-600">
            🔤 {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-600">
            {progressPercent}%
          </span>
        </div>
      </div>

      <div className="text-center mb-8">
        <div className="inline-block bg-white/90 backdrop-blur rounded-2xl p-8 shadow-xl border-4" style={{ borderColor: round.color }}>
          <div className="text-9xl mb-4">👂</div>
          <h2 className="text-3xl font-bold mb-4 text-slate-800">
            {lang === "el" ? "Άκου προσεκτικά!" : "Listen carefully!"}
          </h2>

          <button
            onClick={playSyllableSound}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-2xl font-bold rounded-full hover:scale-105 transition-transform shadow-lg mb-4"
          >
            🔊 {lang === "el" ? "Άκουσε Ξανά" : "Listen Again"}
          </button>

          <p className="text-xl text-slate-600">
            {lang === "el" ? "Ποια συλλαβή άκουσες;" : "Which syllable did you hear?"}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mb-8">
        <div className="grid grid-cols-2 gap-4">
          {round.options.map((syllable) => {
            const isSelected = selectedSyllable === syllable;
            const isCorrect = showAnswer && syllable === round.correct;
            const isWrong = showAnswer && isSelected && syllable !== round.correct;

            return (
              <button
                key={syllable}
                onClick={() => handleSyllableSelect(syllable)}
                disabled={showAnswer}
                className={`
                  relative p-8 rounded-2xl border-4 transition-all duration-300 transform
                  ${isCorrect ? "bg-green-100 border-green-500 scale-105" : ""}
                  ${isWrong ? "bg-red-100 border-red-500 animate-shake" : ""}
                  ${!showAnswer ? "bg-white border-slate-300 hover:border-indigo-400 hover:scale-105 cursor-pointer" : "cursor-not-allowed"}
                  ${showAnswer && !isSelected && syllable !== round.correct ? "opacity-50" : ""}
                `}
              >
                <div className="text-center">
                  <p className="text-7xl font-bold text-slate-800 mb-2">{syllable}</p>

                  {isCorrect && (
                    <div className="text-6xl animate-bounce">
                      ✅
                    </div>
                  )}
                  {isWrong && (
                    <div className="text-6xl">
                      ❌
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {showAnswer && (
        <div className="text-center animate-fadeIn">
          {selectedSyllable === round.correct ? (
            <div className="bg-green-100 rounded-2xl p-6 inline-block border-4 border-green-400">
              <p className="text-3xl font-bold text-green-700">
                {lang === "el" ? "🎉 Σωστά! Άκουσες σωστά τη συλλαβή!" : "🎉 Correct! You heard the syllable right!"}
              </p>
            </div>
          ) : (
            <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
              <p className="text-3xl font-bold text-red-700">
                {lang === "el" ? `Όχι! Η σωστή ήταν: ${round.correct}` : `No! The correct one was: ${round.correct}`}
              </p>
            </div>
          )}
        </div>
      )}

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-300/80 to-purple-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🔤🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Μπράβο! Ακούς πολύ καλά τις συλλαβές!" : "Great! You hear syllables very well!"}
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
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
}

