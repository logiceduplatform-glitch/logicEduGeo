// src/components/games/GuessFromPiecesGame.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import { VoiceService } from "../../../services/VoiceService";

export default function GuessFromPiecesGame({ lang = "el", onComplete, difficulty = 3 }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [revealLevel, setRevealLevel] = useState(1);
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
        emoji: "🍎",
        correctAnswer: "apple",
        name: "Μήλο",
        description: "Τι είναι αυτό;",
        options: [
          { id: "apple", emoji: "🍎", label: "Μήλο" },
          { id: "orange", emoji: "🍊", label: "Πορτοκάλι" },
          { id: "banana", emoji: "🍌", label: "Μπανάνα" },
          { id: "grape", emoji: "🍇", label: "Σταφύλι" }
        ]
      },
      {
        id: 2,
        emoji: "🐶",
        correctAnswer: "dog",
        name: "Σκύλος",
        description: "Τι είναι αυτό;",
        options: [
          { id: "dog", emoji: "🐶", label: "Σκύλος" },
          { id: "cat", emoji: "🐱", label: "Γάτα" },
          { id: "rabbit", emoji: "🐰", label: "Λαγός" },
          { id: "bear", emoji: "🐻", label: "Αρκούδα" }
        ]
      },
      {
        id: 3,
        emoji: "🚗",
        correctAnswer: "car",
        name: "Αυτοκίνητο",
        description: "Τι είναι αυτό;",
        options: [
          { id: "car", emoji: "🚗", label: "Αυτοκίνητο" },
          { id: "bus", emoji: "🚌", label: "Λεωφορείο" },
          { id: "train", emoji: "🚆", label: "Τρένο" },
          { id: "plane", emoji: "✈️", label: "Αεροπλάνο" }
        ]
      },
      {
        id: 4,
        emoji: "🌸",
        correctAnswer: "flower",
        name: "Λουλούδι",
        description: "Τι είναι αυτό;",
        options: [
          { id: "flower", emoji: "🌸", label: "Λουλούδι" },
          { id: "tree", emoji: "🌲", label: "Δέντρο" },
          { id: "sun", emoji: "☀️", label: "Ήλιος" },
          { id: "cloud", emoji: "☁️", label: "Σύννεφο" }
        ]
      },
      {
        id: 5,
        emoji: "⭐",
        correctAnswer: "star",
        name: "Αστέρι",
        description: "Τι είναι αυτό;",
        options: [
          { id: "star", emoji: "⭐", label: "Αστέρι" },
          { id: "moon", emoji: "🌙", label: "Φεγγάρι" },
          { id: "sun", emoji: "☀️", label: "Ήλιος" },
          { id: "heart", emoji: "❤️", label: "Καρδιά" }
        ]
      },
      {
        id: 6,
        emoji: "🏠",
        correctAnswer: "house",
        name: "Σπίτι",
        description: "Τι είναι αυτό;",
        options: [
          { id: "house", emoji: "🏠", label: "Σπίτι" },
          { id: "school", emoji: "🏫", label: "Σχολείο" },
          { id: "castle", emoji: "🏰", label: "Κάστρο" },
          { id: "tent", emoji: "⛺", label: "Σκηνή" }
        ]
      },
      {
        id: 7,
        emoji: "🎈",
        correctAnswer: "balloon",
        name: "Μπαλόνι",
        description: "Τι είναι αυτό;",
        options: [
          { id: "balloon", emoji: "🎈", label: "Μπαλόνι" },
          { id: "ball", emoji: "⚽", label: "Μπάλα" },
          { id: "apple", emoji: "🍎", label: "Μήλο" },
          { id: "heart", emoji: "❤️", label: "Καρδιά" }
        ]
      },
      {
        id: 8,
        emoji: "🦋",
        correctAnswer: "butterfly",
        name: "Πεταλούδα",
        description: "Τι είναι αυτό;",
        options: [
          { id: "butterfly", emoji: "🦋", label: "Πεταλούδα" },
          { id: "bee", emoji: "🐝", label: "Μέλισσα" },
          { id: "bird", emoji: "🐦", label: "Πουλί" },
          { id: "ladybug", emoji: "🐞", label: "Πασχαλίτσα" }
        ]
      },
      {
        id: 9,
        emoji: "🍕",
        correctAnswer: "pizza",
        name: "Πίτσα",
        description: "Τι είναι αυτό;",
        options: [
          { id: "pizza", emoji: "🍕", label: "Πίτσα" },
          { id: "burger", emoji: "🍔", label: "Μπέργκερ" },
          { id: "cake", emoji: "🍰", label: "Τούρτα" },
          { id: "bread", emoji: "🍞", label: "Ψωμί" }
        ]
      },
      {
        id: 10,
        emoji: "🌈",
        correctAnswer: "rainbow",
        name: "Ουράνιο Τόξο",
        description: "Τι είναι αυτό;",
        options: [
          { id: "rainbow", emoji: "🌈", label: "Ουράνιο Τόξο" },
          { id: "cloud", emoji: "☁️", label: "Σύννεφο" },
          { id: "sun", emoji: "☀️", label: "Ήλιος" },
          { id: "star", emoji: "⭐", label: "Αστέρι" }
        ]
      }
    ],
    en: [
      {
        id: 1,
        emoji: "🍎",
        correctAnswer: "apple",
        name: "Apple",
        description: "What is this?",
        options: [
          { id: "apple", emoji: "🍎", label: "Apple" },
          { id: "orange", emoji: "🍊", label: "Orange" },
          { id: "banana", emoji: "🍌", label: "Banana" },
          { id: "grape", emoji: "🍇", label: "Grape" }
        ]
      },
      {
        id: 2,
        emoji: "🐶",
        correctAnswer: "dog",
        name: "Dog",
        description: "What is this?",
        options: [
          { id: "dog", emoji: "🐶", label: "Dog" },
          { id: "cat", emoji: "🐱", label: "Cat" },
          { id: "rabbit", emoji: "🐰", label: "Rabbit" },
          { id: "bear", emoji: "🐻", label: "Bear" }
        ]
      },
      {
        id: 3,
        emoji: "🚗",
        correctAnswer: "car",
        name: "Car",
        description: "What is this?",
        options: [
          { id: "car", emoji: "🚗", label: "Car" },
          { id: "bus", emoji: "🚌", label: "Bus" },
          { id: "train", emoji: "🚆", label: "Train" },
          { id: "plane", emoji: "✈️", label: "Plane" }
        ]
      },
      {
        id: 4,
        emoji: "🌸",
        correctAnswer: "flower",
        name: "Flower",
        description: "What is this?",
        options: [
          { id: "flower", emoji: "🌸", label: "Flower" },
          { id: "tree", emoji: "🌲", label: "Tree" },
          { id: "sun", emoji: "☀️", label: "Sun" },
          { id: "cloud", emoji: "☁️", label: "Cloud" }
        ]
      },
      {
        id: 5,
        emoji: "⭐",
        correctAnswer: "star",
        name: "Star",
        description: "What is this?",
        options: [
          { id: "star", emoji: "⭐", label: "Star" },
          { id: "moon", emoji: "🌙", label: "Moon" },
          { id: "sun", emoji: "☀️", label: "Sun" },
          { id: "heart", emoji: "❤️", label: "Heart" }
        ]
      },
      {
        id: 6,
        emoji: "🏠",
        correctAnswer: "house",
        name: "House",
        description: "What is this?",
        options: [
          { id: "house", emoji: "🏠", label: "House" },
          { id: "school", emoji: "🏫", label: "School" },
          { id: "castle", emoji: "🏰", label: "Castle" },
          { id: "tent", emoji: "⛺", label: "Tent" }
        ]
      },
      {
        id: 7,
        emoji: "🎈",
        correctAnswer: "balloon",
        name: "Balloon",
        description: "What is this?",
        options: [
          { id: "balloon", emoji: "🎈", label: "Balloon" },
          { id: "ball", emoji: "⚽", label: "Ball" },
          { id: "apple", emoji: "🍎", label: "Apple" },
          { id: "heart", emoji: "❤️", label: "Heart" }
        ]
      },
      {
        id: 8,
        emoji: "🦋",
        correctAnswer: "butterfly",
        name: "Butterfly",
        description: "What is this?",
        options: [
          { id: "butterfly", emoji: "🦋", label: "Butterfly" },
          { id: "bee", emoji: "🐝", label: "Bee" },
          { id: "bird", emoji: "🐦", label: "Bird" },
          { id: "ladybug", emoji: "🐞", label: "Ladybug" }
        ]
      },
      {
        id: 9,
        emoji: "🍕",
        correctAnswer: "pizza",
        name: "Pizza",
        description: "What is this?",
        options: [
          { id: "pizza", emoji: "🍕", label: "Pizza" },
          { id: "burger", emoji: "🍔", label: "Burger" },
          { id: "cake", emoji: "🍰", label: "Cake" },
          { id: "bread", emoji: "🍞", label: "Bread" }
        ]
      },
      {
        id: 10,
        emoji: "🌈",
        correctAnswer: "rainbow",
        name: "Rainbow",
        description: "What is this?",
        options: [
          { id: "rainbow", emoji: "🌈", label: "Rainbow" },
          { id: "cloud", emoji: "☁️", label: "Cloud" },
          { id: "sun", emoji: "☀️", label: "Sun" },
          { id: "star", emoji: "⭐", label: "Star" }
        ]
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
    setRevealLevel(1);
  }, [currentRound]);

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "✅", "🔍"][Math.floor(Math.random() * 6)],
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
        ? 'Κοίτα τα κομμάτια και μάντεψε τι είναι'
        : 'Look at the pieces and guess what it is';

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

  const handleRevealMore = () => {
    if (revealLevel < 3 && !showAnswer) {
      setRevealLevel(prev => prev + 1);
    }
  };

  const handleAnswerSelect = (answerId) => {
    if (showAnswer) return;

    setSelectedAnswer(answerId);
    setShowAnswer(true);

    const isCorrect = answerId === round.correctAnswer;

    if (isCorrect) {
      correctSoundRef.current?.play().catch(() => {});

      const newScore = score + 1;
      setScore(newScore);

      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      updateProgress({
        title: "Guess From Pieces Game",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      completeQuiz({
        title: "Guess From Pieces Game",
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

  // Generate fragmented pieces
  const getPieces = () => {
    const pieces = [];
    const positions = [
      { top: 20, left: 20 },
      { top: 20, left: 60 },
      { top: 60, left: 20 },
      { top: 60, left: 60 }
    ];

    positions.forEach((pos, index) => {
      if (index < revealLevel || revealLevel === 3) {
        pieces.push(
          <div
            key={index}
            className="absolute w-16 h-16 overflow-hidden"
            style={{
              top: `${pos.top}%`,
              left: `${pos.left}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div
              className="text-9xl"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: `translate(${-pos.left * 2.5}%, ${-pos.top * 2.5}%)`
              }}
            >
              {round.emoji}
            </div>
          </div>
        );
      }
    });

    return pieces;
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Μάντεψε από τα Κομμάτια" : "Guess From Pieces"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Επίπεδο ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Level ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-purple-600">
            🔍 {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-400 to-pink-500 transition-all duration-500 ease-out"
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
        <div className="inline-block bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl border-4 border-purple-400">
          <div className="text-7xl mb-3">🔍</div>
          <h2 className="text-3xl font-bold mb-3 text-slate-800">
            {round.description}
          </h2>

          <button
            onClick={speakQuestion}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-bold rounded-full hover:scale-105 transition-transform shadow-lg"
          >
            🔊 {lang === "el" ? "Άκουσε Ξανά" : "Listen Again"}
          </button>
        </div>
      </div>

      {/* Puzzle Display */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border-4 border-purple-400">
          <p className="text-2xl font-bold text-center text-slate-800 mb-6">
            {lang === "el" ? "Κοίτα τα κομμάτια:" : "Look at the pieces:"}
          </p>

          {/* Fragmented View */}
          <div className="relative w-80 h-80 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl border-4 border-dashed border-slate-400 overflow-hidden">
            {showAnswer && selectedAnswer === round.correctAnswer ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-[200px]">{round.emoji}</div>
              </div>
            ) : (
              <>
                {getPieces()}
                {revealLevel < 3 && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-8xl text-slate-300">❓</div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Reveal Button */}
          {!showAnswer && revealLevel < 3 && (
            <div className="text-center mb-6">
              <button
                onClick={handleRevealMore}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xl font-bold rounded-full hover:scale-105 transition-transform shadow-lg"
              >
                🔍 {lang === "el" ? "Δείξε Περισσότερα" : "Show More"} ({revealLevel}/3)
              </button>
            </div>
          )}

          {/* Answer Options */}
          {!showAnswer && (
            <>
              <p className="text-xl font-bold text-center text-slate-700 mb-4">
                {lang === "el" ? "Τι πιστεύεις ότι είναι;" : "What do you think it is?"}
              </p>

              <div className="grid grid-cols-2 gap-4">
                {round.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswerSelect(option.id)}
                    className="p-6 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 border-4 border-purple-300 hover:border-purple-500 transition-all duration-200 transform hover:scale-105 shadow-lg flex flex-col items-center justify-center cursor-pointer"
                  >
                    <div className="text-7xl mb-2">{option.emoji}</div>
                    <p className="text-lg font-bold text-slate-700">{option.label}</p>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {showAnswer && selectedAnswer === round.correctAnswer && (
        <div className="text-center animate-fadeIn">
          <div className="bg-green-100 rounded-2xl p-6 inline-block border-4 border-green-400">
            <p className="text-3xl font-bold text-green-700">
              {lang === "el"
                ? `🎉 Σωστά! Είναι ${round.name}!`
                : `🎉 Correct! It's a ${round.name}!`}
            </p>
          </div>
        </div>
      )}

      {showAnswer && selectedAnswer !== round.correctAnswer && (
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
        <div className="absolute inset-0 bg-gradient-to-br from-purple-300/80 to-pink-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🔍🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Μπορείς να μαντεύεις τέλεια!" : "Perfect! You're great at guessing!"}
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

