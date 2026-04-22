// src/components/games/exercises_4_5_1/GuessWhatGame.jsx - Age 4-5 override
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

  const TARGET_ROUNDS = 15;

  const riddlesData = {
    el: [
      { id: 1, description: "Είμαι κίτρινο και με τρώνε. Τι είμαι;", correct: "banana", color: "#EAB308", options: [{ id: "banana", name: "Μπανάνα", emoji: "🍌" }, { id: "ball", name: "Μπάλα", emoji: "🏀" }, { id: "sun", name: "Ήλιος", emoji: "☀️" }] },
      { id: 2, description: "Έχω τέσσερα πόδια και λέω γαβ γαβ", correct: "dog", color: "#F59E0B", options: [{ id: "dog", name: "Σκύλος", emoji: "🐶" }, { id: "cat", name: "Γάτα", emoji: "🐱" }, { id: "fish", name: "Ψάρι", emoji: "🐟" }] },
      { id: 3, description: "Πετάω στον ουρανό και είμαι κίτρινος", correct: "sun", color: "#F97316", options: [{ id: "sun", name: "Ήλιος", emoji: "☀️" }, { id: "moon", name: "Φεγγάρι", emoji: "🌙" }, { id: "ball", name: "Μπάλα", emoji: "⚽" }] },
      { id: 4, description: "Πέφτει από τον ουρανό όταν βρέχει", correct: "rain", color: "#06B6D4", options: [{ id: "rain", name: "Βροχή", emoji: "🌧️" }, { id: "fire", name: "Φωτιά", emoji: "🔥" }, { id: "balloon", name: "Μπαλόνι", emoji: "🎈" }] },
      { id: 5, description: "Είμαι κόκκινο και στρογγυλό. Φυτρώνω σε δέντρο", correct: "apple", color: "#EF4444", options: [{ id: "apple", name: "Μήλο", emoji: "🍎" }, { id: "ball", name: "Μπάλα", emoji: "🎾" }, { id: "circle", name: "Κύκλος", emoji: "🔴" }] },
      { id: 6, description: "Έχω φτερά και πετάω. Κάνω τιτίτι", correct: "bird", color: "#06B6D4", options: [{ id: "bird", name: "Πουλί", emoji: "🐦" }, { id: "bug", name: "Έντομο", emoji: "🐛" }, { id: "cat", name: "Γάτα", emoji: "🐱" }] },
      { id: 7, description: "Είμαι ψηλό, έχω φύλλα και κλαδιά", correct: "tree", color: "#22C55E", options: [{ id: "tree", name: "Δέντρο", emoji: "🌳" }, { id: "house", name: "Σπίτι", emoji: "🏠" }, { id: "water", name: "Νερό", emoji: "🌊" }] },
      { id: 8, description: "Με τρώνε με καλαμάκι. Είμαι γλυκός", correct: "juice", color: "#EC4899", options: [{ id: "juice", name: "Χυμός", emoji: "🧃" }, { id: "broom", name: "Σκούπα", emoji: "🧹" }, { id: "phone", name: "Τηλέφωνο", emoji: "📱" }] },
      { id: 9, description: "Τη νύχτα λάμπω στον ουρανό", correct: "moon", color: "#A855F7", options: [{ id: "moon", name: "Φεγγάρι", emoji: "🌙" }, { id: "sun", name: "Ήλιος", emoji: "☀️" }, { id: "ball", name: "Μπάλα", emoji: "⚽" }] },
      { id: 10, description: "Με φοράνε στα πόδια και περπατάνε", correct: "shoes", color: "#8B5CF6", options: [{ id: "shoes", name: "Παπούτσια", emoji: "👟" }, { id: "gloves", name: "Γάντια", emoji: "🧤" }, { id: "hat", name: "Καπέλο", emoji: "🎩" }] },
      { id: 11, description: "Ζω στο νερό και έχω πτερύγια", correct: "fish", color: "#06B6D4", options: [{ id: "fish", name: "Ψάρι", emoji: "🐟" }, { id: "dog", name: "Σκύλος", emoji: "🐶" }, { id: "cat", name: "Γάτα", emoji: "🐱" }] },
      { id: 12, description: "Είμαι μαλακό, κοιμάσαι πάνω μου", correct: "pillow", color: "#14B8A6", options: [{ id: "pillow", name: "Μαξιλάρι", emoji: "🛏️" }, { id: "bucket", name: "Κόφινος", emoji: "🪣" }, { id: "guitar", name: "Κιθάρα", emoji: "🎸" }] },
      { id: 13, description: "Μου αρέσει το τυρί και λέω νιάου", correct: "cat", color: "#F59E0B", options: [{ id: "cat", name: "Γάτα", emoji: "🐱" }, { id: "dog", name: "Σκύλος", emoji: "🐶" }, { id: "cow", name: "Αγελάδα", emoji: "🐄" }] },
      { id: 14, description: "Με ανοίγουν για να μπουν μέσα", correct: "door", color: "#78350F", options: [{ id: "door", name: "Πόρτα", emoji: "🚪" }, { id: "phone", name: "Τηλέφωνο", emoji: "📱" }, { id: "paint", name: "Βαφή", emoji: "🎨" }] },
      { id: 15, description: "Κάνω μουου και δίνω γάλα", correct: "cow", color: "#10B981", options: [{ id: "cow", name: "Αγελάδα", emoji: "🐄" }, { id: "dog", name: "Σκύλος", emoji: "🐶" }, { id: "cat", name: "Γάτα", emoji: "🐱" }] }
    ],
    en: [
      { id: 1, description: "I am yellow and you eat me. What am I?", correct: "banana", color: "#EAB308", options: [{ id: "banana", name: "Banana", emoji: "🍌" }, { id: "ball", name: "Ball", emoji: "🏀" }, { id: "sun", name: "Sun", emoji: "☀️" }] },
      { id: 2, description: "I have four legs and I say woof woof", correct: "dog", color: "#F59E0B", options: [{ id: "dog", name: "Dog", emoji: "🐶" }, { id: "cat", name: "Cat", emoji: "🐱" }, { id: "fish", name: "Fish", emoji: "🐟" }] },
      { id: 3, description: "I fly in the sky and I am yellow", correct: "sun", color: "#F97316", options: [{ id: "sun", name: "Sun", emoji: "☀️" }, { id: "moon", name: "Moon", emoji: "🌙" }, { id: "ball", name: "Ball", emoji: "⚽" }] },
      { id: 4, description: "I fall from the sky when it rains", correct: "rain", color: "#06B6D4", options: [{ id: "rain", name: "Rain", emoji: "🌧️" }, { id: "fire", name: "Fire", emoji: "🔥" }, { id: "balloon", name: "Balloon", emoji: "🎈" }] },
      { id: 5, description: "I am red and round. I grow on a tree", correct: "apple", color: "#EF4444", options: [{ id: "apple", name: "Apple", emoji: "🍎" }, { id: "ball", name: "Ball", emoji: "🎾" }, { id: "circle", name: "Circle", emoji: "🔴" }] },
      { id: 6, description: "I have wings and I fly. I tweet tweet", correct: "bird", color: "#06B6D4", options: [{ id: "bird", name: "Bird", emoji: "🐦" }, { id: "bug", name: "Bug", emoji: "🐛" }, { id: "cat", name: "Cat", emoji: "🐱" }] },
      { id: 7, description: "I am tall, I have leaves and branches", correct: "tree", color: "#22C55E", options: [{ id: "tree", name: "Tree", emoji: "🌳" }, { id: "house", name: "House", emoji: "🏠" }, { id: "water", name: "Water", emoji: "🌊" }] },
      { id: 8, description: "You drink me with a straw. I am sweet", correct: "juice", color: "#EC4899", options: [{ id: "juice", name: "Juice", emoji: "🧃" }, { id: "broom", name: "Broom", emoji: "🧹" }, { id: "phone", name: "Phone", emoji: "📱" }] },
      { id: 9, description: "I shine in the sky at night", correct: "moon", color: "#A855F7", options: [{ id: "moon", name: "Moon", emoji: "🌙" }, { id: "sun", name: "Sun", emoji: "☀️" }, { id: "ball", name: "Ball", emoji: "⚽" }] },
      { id: 10, description: "You wear me on your feet to walk", correct: "shoes", color: "#8B5CF6", options: [{ id: "shoes", name: "Shoes", emoji: "👟" }, { id: "gloves", name: "Gloves", emoji: "🧤" }, { id: "hat", name: "Hat", emoji: "🎩" }] },
      { id: 11, description: "I live in water and I have fins", correct: "fish", color: "#06B6D4", options: [{ id: "fish", name: "Fish", emoji: "🐟" }, { id: "dog", name: "Dog", emoji: "🐶" }, { id: "cat", name: "Cat", emoji: "🐱" }] },
      { id: 12, description: "I am soft, you sleep on me", correct: "pillow", color: "#14B8A6", options: [{ id: "pillow", name: "Pillow", emoji: "🛏️" }, { id: "bucket", name: "Bucket", emoji: "🪣" }, { id: "guitar", name: "Guitar", emoji: "🎸" }] },
      { id: 13, description: "I like cheese and I say meow", correct: "cat", color: "#F59E0B", options: [{ id: "cat", name: "Cat", emoji: "🐱" }, { id: "dog", name: "Dog", emoji: "🐶" }, { id: "cow", name: "Cow", emoji: "🐄" }] },
      { id: 14, description: "You open me to go inside", correct: "door", color: "#78350F", options: [{ id: "door", name: "Door", emoji: "🚪" }, { id: "phone", name: "Phone", emoji: "📱" }, { id: "paint", name: "Paint", emoji: "🎨" }] },
      { id: 15, description: "I say moo and I give milk", correct: "cow", color: "#10B981", options: [{ id: "cow", name: "Cow", emoji: "🐄" }, { id: "dog", name: "Dog", emoji: "🐶" }, { id: "cat", name: "Cat", emoji: "🐱" }] }
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
