// src/components/games/exercises_4_5/HowDoTheyFeel.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

export default function HowDoTheyFeel({ lang = "el", onComplete }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const TARGET_ROUNDS = 8; // 8 σενάρια

  const roundsData = {
    el: [
      {
        id: 1,
        situation: "Το παιδί πήρε δώρο για τα γενέθλιά του",
        correctEmotion: "happy",
        emoji: "🎁",
        color: "#FCD34D",
        options: [
          { id: "happy", emoji: "😊", name: "Χαρούμενο" },
          { id: "sad", emoji: "😢", name: "Λυπημένο" },
          { id: "angry", emoji: "😠", name: "Θυμωμένο" },
        ]
      },
      {
        id: 2,
        situation: "Το παιδί έχασε το αγαπημένο του παιχνίδι",
        correctEmotion: "sad",
        emoji: "🧸",
        color: "#60A5FA",
        options: [
          { id: "happy", emoji: "😊", name: "Χαρούμενο" },
          { id: "sad", emoji: "😢", name: "Λυπημένο" },
          { id: "scared", emoji: "😨", name: "Φοβισμένο" },
        ]
      },
      {
        id: 3,
        situation: "Το παιδί είδε μεγάλο σκύλο που γαύγιζε",
        correctEmotion: "scared",
        emoji: "🐕",
        color: "#A78BFA",
        options: [
          { id: "excited", emoji: "🤩", name: "Ενθουσιασμένο" },
          { id: "scared", emoji: "😨", name: "Φοβισμένο" },
          { id: "angry", emoji: "😠", name: "Θυμωμένο" },
        ]
      },
      {
        id: 4,
        situation: "Το παιδί πάει στο λούνα παρκ",
        correctEmotion: "excited",
        emoji: "🎢",
        color: "#F472B6",
        options: [
          { id: "excited", emoji: "🤩", name: "Ενθουσιασμένο" },
          { id: "sad", emoji: "😢", name: "Λυπημένο" },
          { id: "tired", emoji: "😴", name: "Κουρασμένο" },
        ]
      },
      {
        id: 5,
        situation: "Το παιδί δεν πήρε το παιχνίδι που ήθελε",
        correctEmotion: "angry",
        emoji: "🎮",
        color: "#EF4444",
        options: [
          { id: "happy", emoji: "😊", name: "Χαρούμενο" },
          { id: "angry", emoji: "😠", name: "Θυμωμένο" },
          { id: "surprised", emoji: "😲", name: "Έκπληκτο" },
        ]
      },
      {
        id: 6,
        situation: "Το παιδί είδε κάτι απροσδόκητο",
        correctEmotion: "surprised",
        emoji: "🎊",
        color: "#10B981",
        options: [
          { id: "surprised", emoji: "😲", name: "Έκπληκτο" },
          { id: "tired", emoji: "😴", name: "Κουρασμένο" },
          { id: "angry", emoji: "😠", name: "Θυμωμένο" },
        ]
      },
      {
        id: 7,
        situation: "Το παιδί έπαιξε όλη μέρα και είναι βράδυ",
        correctEmotion: "tired",
        emoji: "🌙",
        color: "#6366F1",
        options: [
          { id: "excited", emoji: "🤩", name: "Ενθουσιασμένο" },
          { id: "tired", emoji: "😴", name: "Κουρασμένο" },
          { id: "scared", emoji: "😨", name: "Φοβισμένο" },
        ]
      },
      {
        id: 8,
        situation: "Το παιδί φτιάχνει κάτι ωραίο με φίλους",
        correctEmotion: "happy",
        emoji: "👫",
        color: "#F59E0B",
        options: [
          { id: "happy", emoji: "😊", name: "Χαρούμενο" },
          { id: "sad", emoji: "😢", name: "Λυπημένο" },
          { id: "angry", emoji: "😠", name: "Θυμωμένο" },
        ]
      }
    ],
    en: [
      {
        id: 1,
        situation: "The child received a gift for their birthday",
        correctEmotion: "happy",
        emoji: "🎁",
        color: "#FCD34D",
        options: [
          { id: "happy", emoji: "😊", name: "Happy" },
          { id: "sad", emoji: "😢", name: "Sad" },
          { id: "angry", emoji: "😠", name: "Angry" },
        ]
      },
      {
        id: 2,
        situation: "The child lost their favorite toy",
        correctEmotion: "sad",
        emoji: "🧸",
        color: "#60A5FA",
        options: [
          { id: "happy", emoji: "😊", name: "Happy" },
          { id: "sad", emoji: "😢", name: "Sad" },
          { id: "scared", emoji: "😨", name: "Scared" },
        ]
      },
      {
        id: 3,
        situation: "The child saw a big dog barking",
        correctEmotion: "scared",
        emoji: "🐕",
        color: "#A78BFA",
        options: [
          { id: "excited", emoji: "🤩", name: "Excited" },
          { id: "scared", emoji: "😨", name: "Scared" },
          { id: "angry", emoji: "😠", name: "Angry" },
        ]
      },
      {
        id: 4,
        situation: "The child is going to the amusement park",
        correctEmotion: "excited",
        emoji: "🎢",
        color: "#F472B6",
        options: [
          { id: "excited", emoji: "🤩", name: "Excited" },
          { id: "sad", emoji: "😢", name: "Sad" },
          { id: "tired", emoji: "😴", name: "Tired" },
        ]
      },
      {
        id: 5,
        situation: "The child didn't get the toy they wanted",
        correctEmotion: "angry",
        emoji: "🎮",
        color: "#EF4444",
        options: [
          { id: "happy", emoji: "😊", name: "Happy" },
          { id: "angry", emoji: "😠", name: "Angry" },
          { id: "surprised", emoji: "😲", name: "Surprised" },
        ]
      },
      {
        id: 6,
        situation: "The child saw something unexpected",
        correctEmotion: "surprised",
        emoji: "🎊",
        color: "#10B981",
        options: [
          { id: "surprised", emoji: "😲", name: "Surprised" },
          { id: "tired", emoji: "😴", name: "Tired" },
          { id: "angry", emoji: "😠", name: "Angry" },
        ]
      },
      {
        id: 7,
        situation: "The child played all day and it's evening",
        correctEmotion: "tired",
        emoji: "🌙",
        color: "#6366F1",
        options: [
          { id: "excited", emoji: "🤩", name: "Excited" },
          { id: "tired", emoji: "😴", name: "Tired" },
          { id: "scared", emoji: "😨", name: "Scared" },
        ]
      },
      {
        id: 8,
        situation: "The child is making something nice with friends",
        correctEmotion: "happy",
        emoji: "👫",
        color: "#F59E0B",
        options: [
          { id: "happy", emoji: "😊", name: "Happy" },
          { id: "sad", emoji: "😢", name: "Sad" },
          { id: "angry", emoji: "😠", name: "Angry" },
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

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "❤️", "😊"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const handleEmotionSelect = (emotion) => {
    if (showAnswer) return;

    setSelectedEmotion(emotion);
    setShowAnswer(true);

    const isCorrect = emotion.id === round.correctEmotion;

    if (isCorrect) {
      correctSoundRef.current?.play().catch(() => {});

      const newScore = score + 1;
      setScore(newScore);

      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      updateProgress({
        title: "How Do They Feel",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      completeQuiz({
        title: "How Do They Feel",
        score: 1,
        total: 1,
      });

      setTimeout(() => {
        if (currentRound + 1 < TARGET_ROUNDS) {
          setCurrentRound(prev => prev + 1);
          setSelectedEmotion(null);
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
        setSelectedEmotion(null);
        setShowAnswer(false);
      }, 1500);
    }
  };

  const progressPercent = Math.round(((currentRound + 1) / TARGET_ROUNDS) * 100);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-pink-100 via-rose-100 to-red-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Πώς Νιώθει;" : "How Do They Feel?"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Σενάριο ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Scenario ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-pink-600">
            ❤️ {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-400 to-rose-500 transition-all duration-500 ease-out"
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
          <div className="text-9xl mb-4">{round.emoji}</div>
          <h2 className="text-2xl font-bold mb-4 text-slate-800">
            {round.situation}
          </h2>
          <p className="text-xl text-slate-600">
            {lang === "el" ? "Πώς νιώθει το παιδί;" : "How does the child feel?"}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {round.options.map((emotion) => {
            const isSelected = selectedEmotion && selectedEmotion.id === emotion.id;
            const isCorrect = showAnswer && emotion.id === round.correctEmotion;
            const isWrong = showAnswer && isSelected && emotion.id !== round.correctEmotion;

            return (
              <button
                key={emotion.id}
                onClick={() => handleEmotionSelect(emotion)}
                disabled={showAnswer}
                className={`
                  relative p-8 rounded-3xl border-4 transition-all duration-300 transform
                  ${isCorrect ? "bg-green-100 border-green-500 scale-110" : ""}
                  ${isWrong ? "bg-red-100 border-red-500 animate-shake" : ""}
                  ${!showAnswer ? "bg-white border-slate-300 hover:border-pink-400 hover:scale-105 cursor-pointer" : "cursor-not-allowed"}
                  ${showAnswer && !isSelected && emotion.id !== round.correctEmotion ? "opacity-50" : ""}
                `}
              >
                <div className="text-9xl mb-4">{emotion.emoji}</div>
                <p className="text-2xl font-bold text-slate-800">{emotion.name}</p>

                {isCorrect && (
                  <div className="absolute -top-4 -right-4 text-6xl animate-bounce">
                    ✅
                  </div>
                )}
                {isWrong && (
                  <div className="absolute -top-4 -right-4 text-6xl">
                    ❌
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {showAnswer && (
        <div className="text-center animate-fadeIn">
          {selectedEmotion && selectedEmotion.id === round.correctEmotion ? (
            <div className="bg-green-100 rounded-2xl p-6 inline-block border-4 border-green-400">
              <p className="text-3xl font-bold text-green-700">
                {lang === "el" ? "🎉 Σωστά! Μπράβο!" : "🎉 Correct! Well done!"}
              </p>
            </div>
          ) : (
            <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
              <p className="text-3xl font-bold text-red-700">
                {lang === "el" ? "Δοκίμασε ξανά!" : "Try again!"}
              </p>
            </div>
          )}
        </div>
      )}

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-pink-300/80 to-rose-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">❤️🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια Κατανόηση!" : "Perfect Understanding!"}
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

