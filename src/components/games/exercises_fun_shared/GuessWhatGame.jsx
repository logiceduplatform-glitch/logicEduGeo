// src/components/games/GuessWhatGame.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import useSafeTimeout from "../../../hooks/useSafeTimeout";
import { VoiceService } from "../../../services/VoiceService";

export default function GuessWhatGame({ lang = "el", onComplete, difficulty = 3 }) {
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
  const d = Math.max(1, Math.min(5, difficulty));
  const WRONG_DELAY = [2000, 1800, 1500, 1200, 1000][d - 1];
  const NEXT_DELAY = [3000, 2800, 2500, 2200, 2000][d - 1];

  const TARGET_ROUNDS = 12; // 12 περιγραφές

  const riddlesData = {
    el: [
      {
        id: 1,
        description: "Είμαι κίτρινο και με τρώνε",
        correct: "banana",
        color: "#EAB308",
        options: [
          { id: "banana", name: "Μπανάνα", emoji: "🍌" },
          { id: "ball", name: "Μπάλα", emoji: "⚽" },
          { id: "sun", name: "Ήλιος", emoji: "☀️" },
        ]
      },
      {
        id: 2,
        description: "Έχω τέσσερα πόδια και λέω γάβ γάβ",
        correct: "dog",
        color: "#F59E0B",
        options: [
          { id: "dog", name: "Σκύλος", emoji: "🐶" },
          { id: "cat", name: "Γάτα", emoji: "🐱" },
          { id: "table", name: "Τραπέζι", emoji: "🪑" },
        ]
      },
      {
        id: 3,
        description: "Πετάω στον ουρανό και είμαι κίτρινο το μεσημέρι",
        correct: "sun",
        color: "#F97316",
        options: [
          { id: "sun", name: "Ήλιος", emoji: "☀️" },
          { id: "plane", name: "Αεροπλάνο", emoji: "✈️" },
          { id: "bird", name: "Πουλί", emoji: "🐦" },
        ]
      },
      {
        id: 4,
        description: "Ζω στη θάλασσα και κολυμπάω",
        correct: "fish",
        color: "#06B6D4",
        options: [
          { id: "fish", name: "Ψάρι", emoji: "🐟" },
          { id: "boat", name: "Καράβι", emoji: "⛵" },
          { id: "water", name: "Νερό", emoji: "💧" },
        ]
      },
      {
        id: 5,
        description: "Είμαι κόκκινο και μου αρέσει η σάλτσα",
        correct: "tomato",
        color: "#EF4444",
        options: [
          { id: "tomato", name: "Ντομάτα", emoji: "🍅" },
          { id: "apple", name: "Μήλο", emoji: "🍎" },
          { id: "car", name: "Αυτοκίνητο", emoji: "🚗" },
        ]
      },
      {
        id: 6,
        description: "Κάνω μιάου και μου αρέσει το γάλα",
        correct: "cat",
        color: "#F59E0B",
        options: [
          { id: "cat", name: "Γάτα", emoji: "🐱" },
          { id: "dog", name: "Σκύλος", emoji: "🐶" },
          { id: "cow", name: "Αγελάδα", emoji: "🐮" },
        ]
      },
      {
        id: 7,
        description: "Βγαίνω όταν βρέχει και έχω πολλά χρώματα",
        correct: "rainbow",
        color: "#EC4899",
        options: [
          { id: "rainbow", name: "Ουράνιο Τόξο", emoji: "🌈" },
          { id: "umbrella", name: "Ομπρέλα", emoji: "☂️" },
          { id: "rain", name: "Βροχή", emoji: "🌧️" },
        ]
      },
      {
        id: 8,
        description: "Είμαι γλυκό, καφέ και λιώνω στη ζέστη",
        correct: "chocolate",
        color: "#78350F",
        options: [
          { id: "chocolate", name: "Σοκολάτα", emoji: "🍫" },
          { id: "coffee", name: "Καφές", emoji: "☕" },
          { id: "bread", name: "Ψωμί", emoji: "🍞" },
        ]
      },
      {
        id: 9,
        description: "Βγαίνω τη νύχτα και είμαι στρογγυλό",
        correct: "moon",
        color: "#A855F7",
        options: [
          { id: "moon", name: "Φεγγάρι", emoji: "🌙" },
          { id: "star", name: "Αστέρι", emoji: "⭐" },
          { id: "ball", name: "Μπάλα", emoji: "⚽" },
        ]
      },
      {
        id: 10,
        description: "Είμαι πράσινο και μεγαλώνω στον κήπο",
        correct: "tree",
        color: "#22C55E",
        options: [
          { id: "tree", name: "Δέντρο", emoji: "🌳" },
          { id: "grass", name: "Χορτάρι", emoji: "🌿" },
          { id: "leaf", name: "Φύλλο", emoji: "🍃" },
        ]
      },
      {
        id: 11,
        description: "Έχω δύο φτερά και τιτιβίζω",
        correct: "bird",
        color: "#06B6D4",
        options: [
          { id: "bird", name: "Πουλί", emoji: "🐦" },
          { id: "plane", name: "Αεροπλάνο", emoji: "✈️" },
          { id: "butterfly", name: "Πεταλούδα", emoji: "🦋" },
        ]
      },
      {
        id: 12,
        description: "Μένω σε σπίτι και με αρέσει το τυρί",
        correct: "mouse",
        color: "#9CA3AF",
        options: [
          { id: "mouse", name: "Ποντίκι", emoji: "🐭" },
          { id: "cat", name: "Γάτα", emoji: "🐱" },
          { id: "cheese", name: "Τυρί", emoji: "🧀" },
        ]
      }
    ],
    en: [
      {
        id: 1,
        description: "I am yellow and you can eat me",
        correct: "banana",
        color: "#EAB308",
        options: [
          { id: "banana", name: "Banana", emoji: "🍌" },
          { id: "ball", name: "Ball", emoji: "⚽" },
          { id: "sun", name: "Sun", emoji: "☀️" },
        ]
      },
      {
        id: 2,
        description: "I have four legs and I say woof woof",
        correct: "dog",
        color: "#F59E0B",
        options: [
          { id: "dog", name: "Dog", emoji: "🐶" },
          { id: "cat", name: "Cat", emoji: "🐱" },
          { id: "table", name: "Table", emoji: "🪑" },
        ]
      },
      {
        id: 3,
        description: "I fly in the sky and I am yellow at noon",
        correct: "sun",
        color: "#F97316",
        options: [
          { id: "sun", name: "Sun", emoji: "☀️" },
          { id: "plane", name: "Plane", emoji: "✈️" },
          { id: "bird", name: "Bird", emoji: "🐦" },
        ]
      },
      {
        id: 4,
        description: "I live in the sea and I swim",
        correct: "fish",
        color: "#06B6D4",
        options: [
          { id: "fish", name: "Fish", emoji: "🐟" },
          { id: "boat", name: "Boat", emoji: "⛵" },
          { id: "water", name: "Water", emoji: "💧" },
        ]
      },
      {
        id: 5,
        description: "I am red and I like sauce",
        correct: "tomato",
        color: "#EF4444",
        options: [
          { id: "tomato", name: "Tomato", emoji: "🍅" },
          { id: "apple", name: "Apple", emoji: "🍎" },
          { id: "car", name: "Car", emoji: "🚗" },
        ]
      },
      {
        id: 6,
        description: "I say meow and I like milk",
        correct: "cat",
        color: "#F59E0B",
        options: [
          { id: "cat", name: "Cat", emoji: "🐱" },
          { id: "dog", name: "Dog", emoji: "🐶" },
          { id: "cow", name: "Cow", emoji: "🐮" },
        ]
      },
      {
        id: 7,
        description: "I come out when it rains and I have many colors",
        correct: "rainbow",
        color: "#EC4899",
        options: [
          { id: "rainbow", name: "Rainbow", emoji: "🌈" },
          { id: "umbrella", name: "Umbrella", emoji: "☂️" },
          { id: "rain", name: "Rain", emoji: "🌧️" },
        ]
      },
      {
        id: 8,
        description: "I am sweet, brown and I melt in the heat",
        correct: "chocolate",
        color: "#78350F",
        options: [
          { id: "chocolate", name: "Chocolate", emoji: "🍫" },
          { id: "coffee", name: "Coffee", emoji: "☕" },
          { id: "bread", name: "Bread", emoji: "🍞" },
        ]
      },
      {
        id: 9,
        description: "I come out at night and I am round",
        correct: "moon",
        color: "#A855F7",
        options: [
          { id: "moon", name: "Moon", emoji: "🌙" },
          { id: "star", name: "Star", emoji: "⭐" },
          { id: "ball", name: "Ball", emoji: "⚽" },
        ]
      },
      {
        id: 10,
        description: "I am green and I grow in the garden",
        correct: "tree",
        color: "#22C55E",
        options: [
          { id: "tree", name: "Tree", emoji: "🌳" },
          { id: "grass", name: "Grass", emoji: "🌿" },
          { id: "leaf", name: "Leaf", emoji: "🍃" },
        ]
      },
      {
        id: 11,
        description: "I have two wings and I tweet",
        correct: "bird",
        color: "#06B6D4",
        options: [
          { id: "bird", name: "Bird", emoji: "🐦" },
          { id: "plane", name: "Plane", emoji: "✈️" },
          { id: "butterfly", name: "Butterfly", emoji: "🦋" },
        ]
      },
      {
        id: 12,
        description: "I live in a house and I like cheese",
        correct: "mouse",
        color: "#9CA3AF",
        options: [
          { id: "mouse", name: "Mouse", emoji: "🐭" },
          { id: "cat", name: "Cat", emoji: "🐱" },
          { id: "cheese", name: "Cheese", emoji: "🧀" },
        ]
      }
    ]
  };

  const riddles = riddlesData[lang];
  const round = riddles[currentRound];

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
      emoji: ["🎉", "⭐", "✨", "🌟", "🎯", "✅"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    safeTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const speakDescription = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(round.description);
      utterance.lang = lang === 'el' ? 'el-GR' : 'en-US';
      utterance.rate = 0.75;
      utterance.pitch = 1.1;
      const voice = VoiceService.getVoice(lang);
      if (voice) utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    // Speak description automatically when round changes
    const timer = safeTimeout(() => {
      speakDescription();
    }, 500);
    return () => clearTimeout(timer);
  }, [currentRound]);

  const handleAnswerSelect = (answerId) => {
    if (showAnswer) return;

    setSelectedAnswer(answerId);
    setShowAnswer(true);

    const isCorrect = answerId === round.correct;

    if (isCorrect) {
      correctSoundRef.current?.play().catch(() => {});

      const newScore = score + 1;
      setScore(newScore);

      setScorePopup({ id: Date.now(), x: 50 });
      safeTimeout(() => setScorePopup(null), 1000);

      updateProgress({
        title: "Guess What Game",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      completeQuiz({
        title: "Guess What Game",
        score: 1,
        total: 1,
      });

      safeTimeout(() => {
        if (currentRound + 1 < TARGET_ROUNDS) {
          setCurrentRound(prev => prev + 1);
          setSelectedAnswer(null);
          setShowAnswer(false);
        } else {
          createCelebrationEmojis();
          setShowCelebration(true);
          safeTimeout(() => {
            if (onComplete) {
              onComplete({ score: newScore, total: TARGET_ROUNDS });
            }
          }, NEXT_DELAY);
        }
      }, NEXT_DELAY);
    } else {
      wrongSoundRef.current?.play().catch(() => {});

      safeTimeout(() => {
        setSelectedAnswer(null);
        setShowAnswer(false);
      }, WRONG_DELAY);
    }
  };

  const progressPercent = Math.round((currentRound / TARGET_ROUNDS) * 100);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-amber-100 via-yellow-100 to-orange-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Μάντεψε!" : "Guess What!"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Ερώτηση ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Question ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-amber-600">
            🎯 {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500 ease-out"
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
          <div className="text-9xl mb-4">🤔</div>
          <h2 className="text-3xl font-bold mb-4 text-slate-800">
            {lang === "el" ? "Άκου προσεκτικά!" : "Listen carefully!"}
          </h2>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl mb-4">
            <p className="text-2xl font-bold text-slate-800 italic">
              "{round.description}"
            </p>
          </div>

          <button
            onClick={speakDescription}
            className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-2xl font-bold rounded-full hover:scale-105 transition-transform shadow-lg mb-4"
          >
            🔊 {lang === "el" ? "Άκουσε Ξανά" : "Listen Again"}
          </button>

          <p className="text-xl text-slate-600 mt-4">
            {lang === "el" ? "Τι είμαι;" : "What am I?"}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mb-8">
        <div className="grid grid-cols-3 gap-4">
          {round.options.map((option) => {
            const isSelected = selectedAnswer === option.id;
            const isCorrect = showAnswer && option.id === round.correct;
            const isWrong = showAnswer && isSelected && option.id !== round.correct;

            return (
              <button
                key={option.id}
                onClick={() => handleAnswerSelect(option.id)}
                disabled={showAnswer}
                className={`
                  relative p-6 rounded-2xl border-4 transition-all duration-300 transform
                  ${isCorrect ? "bg-green-100 border-green-500 scale-110" : ""}
                  ${isWrong ? "bg-red-100 border-red-500 animate-shake" : ""}
                  ${!showAnswer ? "bg-white border-slate-300 hover:border-amber-400 hover:scale-105 cursor-pointer" : "cursor-not-allowed"}
                  ${showAnswer && !isSelected && option.id !== round.correct ? "opacity-50" : ""}
                `}
              >
                <div className="text-center">
                  <div className="text-7xl mb-3">{option.emoji}</div>
                  <p className="text-xl font-bold text-slate-800">{option.name}</p>

                  {isCorrect && (
                    <div className="text-6xl animate-bounce mt-3">
                      ✅
                    </div>
                  )}
                  {isWrong && (
                    <div className="text-6xl mt-3">
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
          {selectedAnswer === round.correct ? (
            <div className="bg-green-100 rounded-2xl p-6 inline-block border-4 border-green-400">
              <p className="text-3xl font-bold text-green-700">
                {lang === "el" ? "🎉 Σωστά! Μπράβο!" : "🎉 Correct! Well done!"}
              </p>
            </div>
          ) : (
            <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
              <p className="text-3xl font-bold text-red-700">
                {lang === "el" ? "Σκέψου πάλι!" : "Think again!"}
              </p>
            </div>
          )}
        </div>
      )}

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-amber-300/80 to-orange-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🎯🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Τα μάντεψες όλα!" : "Perfect! You guessed them all!"}
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

