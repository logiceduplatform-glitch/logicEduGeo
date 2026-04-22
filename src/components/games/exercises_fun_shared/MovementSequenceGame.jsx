// src/components/games/MovementSequenceGame.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import { VoiceService } from "../../../services/VoiceService";

export default function MovementSequenceGame({ lang = "el", onComplete, difficulty = 3 }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [showingSequence, setShowingSequence] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [userSequence, setUserSequence] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();
  const d = Math.max(1, Math.min(5, difficulty));
  const WRONG_DELAY = [2000, 1800, 1500, 1200, 1000][d - 1];
  const NEXT_DELAY = [3000, 2800, 2500, 2200, 2000][d - 1];

  const TARGET_ROUNDS = 10;

  const movements = {
    el: {
      up: { emoji: "🙌", label: "Πάνω", icon: "⬆️" },
      down: { emoji: "👇", label: "Κάτω", icon: "⬇️" },
      around: { emoji: "🔄", label: "Γύρω", icon: "🔄" },
      clap: { emoji: "👏", label: "Χειροκρότημα", icon: "👏" },
      wave: { emoji: "👋", label: "Κούνημα", icon: "👋" },
      point: { emoji: "👈", label: "Δείξιμο", icon: "👈" }
    },
    en: {
      up: { emoji: "🙌", label: "Up", icon: "⬆️" },
      down: { emoji: "👇", label: "Down", icon: "⬇️" },
      around: { emoji: "🔄", label: "Around", icon: "🔄" },
      clap: { emoji: "👏", label: "Clap", icon: "👏" },
      wave: { emoji: "👋", label: "Wave", icon: "👋" },
      point: { emoji: "👈", label: "Point", icon: "👈" }
    }
  };

  const roundsData = {
    el: [
      {
        id: 1,
        title: "Βασική Σειρά",
        sequence: ["up", "down"],
        description: "Κοίτα και επανάλαβε!"
      },
      {
        id: 2,
        title: "Τρία Βήματα",
        sequence: ["up", "down", "around"],
        description: "Κοίτα και επανάλαβε!"
      },
      {
        id: 3,
        title: "Χειροκρότημα",
        sequence: ["clap", "up", "clap"],
        description: "Κοίτα και επανάλαβε!"
      },
      {
        id: 4,
        title: "Κύκλος",
        sequence: ["around", "around", "up"],
        description: "Κοίτα και επανάλαβε!"
      },
      {
        id: 5,
        title: "Κούνημα",
        sequence: ["wave", "wave", "down"],
        description: "Κοίτα και επανάλαβε!"
      },
      {
        id: 6,
        title: "Σύνθετη",
        sequence: ["up", "clap", "down", "clap"],
        description: "Κοίτα και επανάλαβε!"
      },
      {
        id: 7,
        title: "Δείξιμο",
        sequence: ["point", "up", "point", "down"],
        description: "Κοίτα και επανάλαβε!"
      },
      {
        id: 8,
        title: "Μίξη",
        sequence: ["wave", "around", "clap", "up"],
        description: "Κοίτα και επανάλαβε!"
      },
      {
        id: 9,
        title: "Ρυθμός",
        sequence: ["clap", "clap", "wave", "wave", "up"],
        description: "Κοίτα και επανάλαβε!"
      },
      {
        id: 10,
        title: "Τελική Πρόκληση",
        sequence: ["up", "down", "around", "clap", "wave", "point"],
        description: "Κοίτα και επανάλαβε!"
      }
    ],
    en: [
      {
        id: 1,
        title: "Basic Sequence",
        sequence: ["up", "down"],
        description: "Watch and repeat!"
      },
      {
        id: 2,
        title: "Three Steps",
        sequence: ["up", "down", "around"],
        description: "Watch and repeat!"
      },
      {
        id: 3,
        title: "Clap Pattern",
        sequence: ["clap", "up", "clap"],
        description: "Watch and repeat!"
      },
      {
        id: 4,
        title: "Circle",
        sequence: ["around", "around", "up"],
        description: "Watch and repeat!"
      },
      {
        id: 5,
        title: "Wave",
        sequence: ["wave", "wave", "down"],
        description: "Watch and repeat!"
      },
      {
        id: 6,
        title: "Complex",
        sequence: ["up", "clap", "down", "clap"],
        description: "Watch and repeat!"
      },
      {
        id: 7,
        title: "Pointing",
        sequence: ["point", "up", "point", "down"],
        description: "Watch and repeat!"
      },
      {
        id: 8,
        title: "Mix",
        sequence: ["wave", "around", "clap", "up"],
        description: "Watch and repeat!"
      },
      {
        id: 9,
        title: "Rhythm",
        sequence: ["clap", "clap", "wave", "wave", "up"],
        description: "Watch and repeat!"
      },
      {
        id: 10,
        title: "Final Challenge",
        sequence: ["up", "down", "around", "clap", "wave", "point"],
        description: "Watch and repeat!"
      }
    ]
  };

  const rounds = roundsData[lang];
  const round = rounds[currentRound];
  const movementSet = movements[lang];

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    wrongSoundRef.current = new Audio("/sounds/wrong.mp3");
    correctSoundRef.current.preload = "auto";
    wrongSoundRef.current.preload = "auto";
  }, []);

  useEffect(() => {
    setShowingSequence(true);
    setCurrentStep(0);
    setUserSequence([]);
    setShowAnswer(false);
    setIsCorrect(null);

    // Show sequence animation
    let step = 0;
    const interval = setInterval(() => {
      if (step < round.sequence.length) {
        setCurrentStep(step);
        step++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setShowingSequence(false);
          setCurrentStep(-1);
        }, 800);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentRound, round.sequence.length]);

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "✅", "🙌"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const speakQuestion = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const text = lang === 'el'
        ? 'Κοίτα τις κινήσεις και επανάλαβέ τες'
        : 'Watch the movements and repeat them';

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'el' ? 'el-GR' : 'en-US';
      utterance.rate = 0.75;
      utterance.pitch = 1.1;
      const voice = VoiceService.getVoice(lang);
      if (voice) utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      speakQuestion();
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRound, lang]);

  const handleMovementClick = (movementKey) => {
    if (showingSequence || showAnswer) return;

    const newSequence = [...userSequence, movementKey];
    setUserSequence(newSequence);

    // Check if sequence is complete
    if (newSequence.length === round.sequence.length) {
      checkAnswer(newSequence);
    }
  };

  const checkAnswer = (sequence) => {
    const correct = JSON.stringify(sequence) === JSON.stringify(round.sequence);
    setIsCorrect(correct);
    setShowAnswer(true);

    if (correct) {
      correctSoundRef.current?.play().catch(() => {});

      const newScore = score + 1;
      setScore(newScore);

      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      updateProgress({
        title: "Movement Sequence Game",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      completeQuiz({
        title: "Movement Sequence Game",
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
            if (onComplete) {
              onComplete({ score: newScore, total: TARGET_ROUNDS });
            }
          }, NEXT_DELAY);
        }
      }, NEXT_DELAY);
    } else {
      wrongSoundRef.current?.play().catch(() => {});

      setTimeout(() => {
        setUserSequence([]);
        setShowAnswer(false);
        setIsCorrect(null);
      }, WRONG_DELAY);
    }
  };

  const progressPercent = Math.round(((currentRound + 1) / TARGET_ROUNDS) * 100);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-orange-100 via-yellow-100 to-green-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Ακολουθία Κινήσεων" : "Movement Sequence"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {round.title} - {lang === "el"
                ? `Επίπεδο ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Level ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-orange-600">
            🙌 {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-400 to-green-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-600">
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center mb-6">
        <div className="inline-block bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl border-4 border-orange-400">
          <div className="text-7xl mb-3">🙌</div>
          <h2 className="text-3xl font-bold mb-3 text-slate-800">
            {round.description}
          </h2>

          <button
            onClick={speakQuestion}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-green-500 text-white text-xl font-bold rounded-full hover:scale-105 transition-transform shadow-lg"
          >
            🔊 {lang === "el" ? "Άκουσε Ξανά" : "Listen Again"}
          </button>
        </div>
      </div>

      {/* Sequence Display */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border-4 border-orange-400 min-h-[300px]">
          {showingSequence ? (
            <>
              <p className="text-2xl font-bold text-center text-slate-800 mb-6">
                {lang === "el" ? "Κοίτα τη σειρά:" : "Watch the sequence:"}
              </p>

              <div className="flex justify-center items-center gap-6 mb-6">
                {round.sequence.map((moveKey, index) => {
                  const move = movementSet[moveKey];
                  const isActive = index === currentStep;

                  return (
                    <div
                      key={index}
                      className={`
                        relative w-32 h-32 rounded-3xl transition-all duration-300
                        ${isActive
                          ? 'bg-gradient-to-br from-orange-400 to-yellow-400 border-orange-500 scale-125 shadow-2xl'
                          : 'bg-gradient-to-br from-slate-200 to-slate-300 border-slate-400'}
                        border-4 flex flex-col items-center justify-center
                      `}
                    >
                      <div className={`text-7xl transition-transform duration-300 ${isActive ? 'animate-bounce' : ''}`}>
                        {move.emoji}
                      </div>
                      {isActive && (
                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white font-bold px-4 py-2 rounded-full text-sm animate-pulse">
                          {index + 1}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="text-center">
                <p className="text-lg font-bold text-orange-600 animate-pulse">
                  {lang === "el" ? "Παρακολούθησε προσεκτικά..." : "Watch carefully..."}
                </p>
              </div>
            </>
          ) : (
            <>
              <p className="text-2xl font-bold text-center text-slate-800 mb-6">
                {lang === "el" ? "Τώρα εσύ! Επανάλαβε τη σειρά:" : "Your turn! Repeat the sequence:"}
              </p>

              {/* User's sequence so far */}
              <div className="flex justify-center items-center gap-4 mb-8 min-h-[100px]">
                {userSequence.map((moveKey, index) => {
                  const move = movementSet[moveKey];
                  const isCorrectSoFar = round.sequence[index] === moveKey;

                  return (
                    <div
                      key={index}
                      className={`
                        w-24 h-24 rounded-2xl transition-all duration-300 transform
                        ${showAnswer
                          ? (isCorrectSoFar ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500')
                          : 'bg-blue-100 border-blue-400'}
                        border-4 flex items-center justify-center scale-110
                      `}
                    >
                      <div className="text-5xl">{move.emoji}</div>
                    </div>
                  );
                })}
                {!showAnswer && userSequence.length < round.sequence.length && (
                  <div className="w-24 h-24 rounded-2xl border-4 border-dashed border-slate-300 flex items-center justify-center">
                    <div className="text-4xl text-slate-400">?</div>
                  </div>
                )}
              </div>

              {/* Movement Buttons */}
              {!showAnswer && (
                <>
                  <p className="text-xl font-bold text-center text-slate-700 mb-4">
                    {lang === "el" ? "Διάλεξε την επόμενη κίνηση:" : "Choose the next movement:"}
                  </p>

                  <div className="flex justify-center flex-wrap gap-4">
                    {Object.entries(movementSet).map(([key, move]) => (
                      <button
                        key={key}
                        onClick={() => handleMovementClick(key)}
                        className="w-28 h-28 rounded-2xl bg-gradient-to-br from-orange-200 to-yellow-200 hover:from-orange-300 hover:to-yellow-300 border-4 border-orange-300 hover:border-orange-500 transition-all duration-200 transform hover:scale-110 shadow-lg flex flex-col items-center justify-center cursor-pointer"
                      >
                        <div className="text-6xl mb-1">{move.emoji}</div>
                        <p className="text-xs font-bold text-slate-700">{move.label}</p>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {showAnswer && isCorrect && (
        <div className="text-center animate-fadeIn">
          <div className="bg-green-100 rounded-2xl p-6 inline-block border-4 border-green-400">
            <p className="text-3xl font-bold text-green-700">
              {lang === "el"
                ? `🎉 Τέλεια! Επανέλαβες σωστά τη σειρά!`
                : `🎉 Perfect! You repeated the sequence correctly!`}
            </p>
          </div>
        </div>
      )}

      {showAnswer && !isCorrect && (
        <div className="text-center animate-fadeIn">
          <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
            <p className="text-3xl font-bold text-red-700">
              {lang === "el"
                ? `Προσπάθησε ξανά!`
                : `Try again!`}
            </p>
          </div>
        </div>
      )}

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-orange-300/80 to-green-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🙌🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Έχεις εξαιρετική μνήμη κινήσεων!" : "Perfect! You have excellent movement memory!"}
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

