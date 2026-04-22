// src/components/games/FixThePictureGame.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import { VoiceService } from "../../../services/VoiceService";

export default function FixThePictureGame({ lang = "el", onComplete, difficulty = 3 }) {
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
  const d = Math.max(1, Math.min(5, difficulty));
  const WRONG_DELAY = [2000, 1800, 1500, 1200, 1000][d - 1];
  const NEXT_DELAY = [3000, 2800, 2500, 2200, 2000][d - 1];

  const TARGET_ROUNDS = 10;

  const roundsData = {
    el: [
      {
        id: 1,
        question: "Ποιο κομμάτι είναι λάθος;",
        picture: ["🌞", "🌞", "🌞", "🌙"], // 4η θέση λάθος
        wrongIndex: 3,
        correctPiece: "🌞",
        options: [
          { piece: "🌞", name: "Ήλιος" },
          { piece: "🌙", name: "Φεγγάρι" },
          { piece: "⭐", name: "Αστέρι" }
        ],
        color: "#EAB308"
      },
      {
        id: 2,
        question: "Ποιο κομμάτι είναι λάθος;",
        picture: ["🍎", "🍌", "🍎", "🍎"], // 2η θέση λάθος
        wrongIndex: 1,
        correctPiece: "🍎",
        options: [
          { piece: "🍎", name: "Μήλο" },
          { piece: "🍌", name: "Μπανάνα" },
          { piece: "🍊", name: "Πορτοκάλι" }
        ],
        color: "#EF4444"
      },
      {
        id: 3,
        question: "Ποιο κομμάτι είναι λάθος;",
        picture: ["🐶", "🐶", "🐱", "🐶"], // 3η θέση λάθος
        wrongIndex: 2,
        correctPiece: "🐶",
        options: [
          { piece: "🐶", name: "Σκύλος" },
          { piece: "🐱", name: "Γάτα" },
          { piece: "🐦", name: "Πουλί" }
        ],
        color: "#F59E0B"
      },
      {
        id: 4,
        question: "Ποιο κομμάτι είναι λάθος;",
        picture: ["🚗", "🚗", "🚗", "🚌"], // 4η θέση λάθος
        wrongIndex: 3,
        correctPiece: "🚗",
        options: [
          { piece: "🚗", name: "Αυτοκίνητο" },
          { piece: "🚌", name: "Λεωφορείο" },
          { piece: "✈️", name: "Αεροπλάνο" }
        ],
        color: "#3B82F6"
      },
      {
        id: 5,
        question: "Ποιο κομμάτι είναι λάθος;",
        picture: ["❤️", "💙", "❤️", "❤️"], // 2η θέση λάθος
        wrongIndex: 1,
        correctPiece: "❤️",
        options: [
          { piece: "❤️", name: "Κόκκινη Καρδιά" },
          { piece: "💙", name: "Μπλε Καρδιά" },
          { piece: "💚", name: "Πράσινη Καρδιά" }
        ],
        color: "#EF4444"
      },
      {
        id: 6,
        question: "Ποιο κομμάτι είναι λάθος;",
        picture: ["🌸", "🌸", "🌻", "🌸"], // 3η θέση λάθος
        wrongIndex: 2,
        correctPiece: "🌸",
        options: [
          { piece: "🌸", name: "Ροζ Λουλούδι" },
          { piece: "🌻", name: "Ηλιοτρόπιο" },
          { piece: "🌺", name: "Κόκκινο Λουλούδι" }
        ],
        color: "#EC4899"
      },
      {
        id: 7,
        question: "Ποιο κομμάτι είναι λάθος;",
        picture: ["⚽", "⚽", "⚽", "🏀"], // 4η θέση λάθος
        wrongIndex: 3,
        correctPiece: "⚽",
        options: [
          { piece: "⚽", name: "Μπάλα Ποδοσφαίρου" },
          { piece: "🏀", name: "Μπάσκετ" },
          { piece: "🎾", name: "Τένις" }
        ],
        color: "#10B981"
      },
      {
        id: 8,
        question: "Ποιο κομμάτι είναι λάθος;",
        picture: ["🍕", "🍔", "🍕", "🍕"], // 2η θέση λάθος
        wrongIndex: 1,
        correctPiece: "🍕",
        options: [
          { piece: "🍕", name: "Πίτσα" },
          { piece: "🍔", name: "Μπέργκερ" },
          { piece: "🌭", name: "Χοτ Ντογκ" }
        ],
        color: "#F97316"
      },
      {
        id: 9,
        question: "Ποιο κομμάτι είναι λάθος;",
        picture: ["🎈", "🎈", "🎁", "🎈"], // 3η θέση λάθος
        wrongIndex: 2,
        correctPiece: "🎈",
        options: [
          { piece: "🎈", name: "Μπαλόνι" },
          { piece: "🎁", name: "Δώρο" },
          { piece: "🎉", name: "Πάρτι" }
        ],
        color: "#A855F7"
      },
      {
        id: 10,
        question: "Ποιο κομμάτι είναι λάθος;",
        picture: ["🌲", "🌲", "🌲", "🌴"], // 4η θέση λάθος
        wrongIndex: 3,
        correctPiece: "🌲",
        options: [
          { piece: "🌲", name: "Έλατο" },
          { piece: "🌴", name: "Φοίνικας" },
          { piece: "🌳", name: "Δέντρο" }
        ],
        color: "#22C55E"
      }
    ],
    en: [
      {
        id: 1,
        question: "Which piece is wrong?",
        picture: ["🌞", "🌞", "🌞", "🌙"],
        wrongIndex: 3,
        correctPiece: "🌞",
        options: [
          { piece: "🌞", name: "Sun" },
          { piece: "🌙", name: "Moon" },
          { piece: "⭐", name: "Star" }
        ],
        color: "#EAB308"
      },
      {
        id: 2,
        question: "Which piece is wrong?",
        picture: ["🍎", "🍌", "🍎", "🍎"],
        wrongIndex: 1,
        correctPiece: "🍎",
        options: [
          { piece: "🍎", name: "Apple" },
          { piece: "🍌", name: "Banana" },
          { piece: "🍊", name: "Orange" }
        ],
        color: "#EF4444"
      },
      {
        id: 3,
        question: "Which piece is wrong?",
        picture: ["🐶", "🐶", "🐱", "🐶"],
        wrongIndex: 2,
        correctPiece: "🐶",
        options: [
          { piece: "🐶", name: "Dog" },
          { piece: "🐱", name: "Cat" },
          { piece: "🐦", name: "Bird" }
        ],
        color: "#F59E0B"
      },
      {
        id: 4,
        question: "Which piece is wrong?",
        picture: ["🚗", "🚗", "🚗", "🚌"],
        wrongIndex: 3,
        correctPiece: "🚗",
        options: [
          { piece: "🚗", name: "Car" },
          { piece: "🚌", name: "Bus" },
          { piece: "✈️", name: "Plane" }
        ],
        color: "#3B82F6"
      },
      {
        id: 5,
        question: "Which piece is wrong?",
        picture: ["❤️", "💙", "❤️", "❤️"],
        wrongIndex: 1,
        correctPiece: "❤️",
        options: [
          { piece: "❤️", name: "Red Heart" },
          { piece: "💙", name: "Blue Heart" },
          { piece: "💚", name: "Green Heart" }
        ],
        color: "#EF4444"
      },
      {
        id: 6,
        question: "Which piece is wrong?",
        picture: ["🌸", "🌸", "🌻", "🌸"],
        wrongIndex: 2,
        correctPiece: "🌸",
        options: [
          { piece: "🌸", name: "Pink Flower" },
          { piece: "🌻", name: "Sunflower" },
          { piece: "🌺", name: "Red Flower" }
        ],
        color: "#EC4899"
      },
      {
        id: 7,
        question: "Which piece is wrong?",
        picture: ["⚽", "⚽", "⚽", "🏀"],
        wrongIndex: 3,
        correctPiece: "⚽",
        options: [
          { piece: "⚽", name: "Soccer Ball" },
          { piece: "🏀", name: "Basketball" },
          { piece: "🎾", name: "Tennis" }
        ],
        color: "#10B981"
      },
      {
        id: 8,
        question: "Which piece is wrong?",
        picture: ["🍕", "🍔", "🍕", "🍕"],
        wrongIndex: 1,
        correctPiece: "🍕",
        options: [
          { piece: "🍕", name: "Pizza" },
          { piece: "🍔", name: "Burger" },
          { piece: "🌭", name: "Hot Dog" }
        ],
        color: "#F97316"
      },
      {
        id: 9,
        question: "Which piece is wrong?",
        picture: ["🎈", "🎈", "🎁", "🎈"],
        wrongIndex: 2,
        correctPiece: "🎈",
        options: [
          { piece: "🎈", name: "Balloon" },
          { piece: "🎁", name: "Gift" },
          { piece: "🎉", name: "Party" }
        ],
        color: "#A855F7"
      },
      {
        id: 10,
        question: "Which piece is wrong?",
        picture: ["🌲", "🌲", "🌲", "🌴"],
        wrongIndex: 3,
        correctPiece: "🌲",
        options: [
          { piece: "🌲", name: "Pine Tree" },
          { piece: "🌴", name: "Palm Tree" },
          { piece: "🌳", name: "Tree" }
        ],
        color: "#22C55E"
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

  useEffect(() => {
    setSelectedAnswer(null);
    setShowAnswer(false);
  }, [currentRound]);

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "✅", "🔧"][Math.floor(Math.random() * 6)],
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
        ? 'Ποιο κομμάτι είναι λάθος; Διάλεξε το σωστό!'
        : 'Which piece is wrong? Choose the correct one!';

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
  }, [currentRound]);

  const handleAnswerSelect = (answer) => {
    if (showAnswer) return;

    setSelectedAnswer(answer);
    setShowAnswer(true);

    const isCorrect = answer.piece === round.correctPiece;

    if (isCorrect) {
      correctSoundRef.current?.play().catch(() => {});

      const newScore = score + 1;
      setScore(newScore);

      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      updateProgress({
        title: "Fix The Picture Game",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      completeQuiz({
        title: "Fix The Picture Game",
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
        setSelectedAnswer(null);
        setShowAnswer(false);
      }, WRONG_DELAY);
    }
  };

  const progressPercent = Math.round(((currentRound + 1) / TARGET_ROUNDS) * 100);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-amber-100 via-orange-100 to-red-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Επιδιόρθωσε την Εικόνα" : "Fix the Picture"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Επίπεδο ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Level ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-orange-600">
            🔧 {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-red-500 transition-all duration-500 ease-out"
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
          <div className="text-7xl mb-4">🔍</div>
          <h2 className="text-3xl font-bold mb-4 text-slate-800">
            {round.question}
          </h2>

          <button
            onClick={speakQuestion}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xl font-bold rounded-full hover:scale-105 transition-transform shadow-lg"
          >
            🔊 {lang === "el" ? "Άκουσε Ξανά" : "Listen Again"}
          </button>
        </div>
      </div>

      {/* Picture Display */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border-4" style={{ borderColor: round.color }}>
          <p className="text-2xl font-bold text-center text-slate-800 mb-6">
            {lang === "el" ? "Βρες το λάθος κομμάτι:" : "Find the wrong piece:"}
          </p>

          <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
            {round.picture.map((piece, index) => {
              const isWrongPiece = index === round.wrongIndex;
              const isFixed = showAnswer && selectedAnswer?.piece === round.correctPiece && isWrongPiece;

              return (
                <div
                  key={index}
                  className={`
                    relative p-6 rounded-2xl border-4 transition-all duration-300
                    ${isWrongPiece && !isFixed ? 'bg-red-100 border-red-400 animate-pulse' : 'bg-white border-slate-300'}
                    ${isFixed ? 'bg-green-100 border-green-400' : ''}
                  `}
                >
                  <div className="text-7xl text-center">
                    {isFixed ? round.correctPiece : piece}
                  </div>

                  {isWrongPiece && !isFixed && (
                    <div className="absolute -top-3 -right-3 text-4xl animate-bounce">
                      ⚠️
                    </div>
                  )}

                  {isFixed && (
                    <div className="absolute -top-3 -right-3 text-4xl animate-bounce">
                      ✅
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="max-w-4xl mx-auto mb-8">
        <p className="text-2xl font-bold text-center text-slate-800 mb-6">
          {lang === "el" ? "Διάλεξε το σωστό κομμάτι:" : "Choose the correct piece:"}
        </p>

        <div className="grid grid-cols-3 gap-6">
          {round.options.map((option, index) => {
            const isSelected = selectedAnswer?.piece === option.piece;
            const isCorrect = showAnswer && option.piece === round.correctPiece;
            const isWrong = showAnswer && isSelected && option.piece !== round.correctPiece;

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={showAnswer}
                className={`
                  relative p-8 rounded-3xl border-4 transition-all duration-300 transform
                  ${isCorrect ? "bg-green-100 border-green-500 scale-110" : ""}
                  ${isWrong ? "bg-red-100 border-red-500 animate-shake" : ""}
                  ${!showAnswer ? "bg-white border-slate-300 hover:border-orange-400 hover:scale-110 cursor-pointer shadow-lg" : "cursor-not-allowed"}
                  ${showAnswer && !isSelected && option.piece !== round.correctPiece ? "opacity-50" : ""}
                `}
              >
                <div className="text-center">
                  <div className="text-8xl mb-2">{option.piece}</div>
                  <p className="text-sm font-semibold text-slate-700">{option.name}</p>

                  {isCorrect && (
                    <div className="text-7xl animate-bounce absolute -top-4 -right-4">
                      ✅
                    </div>
                  )}
                  {isWrong && (
                    <div className="text-7xl absolute -top-4 -right-4">
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
          {selectedAnswer?.piece === round.correctPiece ? (
            <div className="bg-green-100 rounded-2xl p-6 inline-block border-4 border-green-400">
              <p className="text-3xl font-bold text-green-700">
                {lang === "el"
                  ? "🎉 Τέλεια! Επιδιόρθωσες την εικόνα!"
                  : "🎉 Perfect! You fixed the picture!"}
              </p>
            </div>
          ) : (
            <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
              <p className="text-3xl font-bold text-red-700">
                {lang === "el"
                  ? `Προσπάθησε ξανά! Το σωστό είναι: ${round.correctPiece}`
                  : `Try again! The correct one is: ${round.correctPiece}`}
              </p>
            </div>
          )}
        </div>
      )}

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-amber-300/80 to-orange-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🔧🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Ξέρεις να επιδιορθώνεις εικόνες!" : "Perfect! You know how to fix pictures!"}
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

