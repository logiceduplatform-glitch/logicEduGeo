// src/components/games/exercises_4_5/WhichHasMore.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

export default function WhichHasMore({ lang = "el", onComplete }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const TARGET_ROUNDS = 8; // 8 γύρους

  const roundsData = {
    el: [
      {
        id: 1,
        groups: [
          { id: "A", emoji: "🍎", count: 3, label: "μήλα" },
          { id: "B", emoji: "🍌", count: 5, label: "μπανάνες" },
        ],
        correct: "B"
      },
      {
        id: 2,
        groups: [
          { id: "A", emoji: "⭐", count: 7, label: "αστέρια" },
          { id: "B", emoji: "🌙", count: 4, label: "φεγγάρια" },
        ],
        correct: "A"
      },
      {
        id: 3,
        groups: [
          { id: "A", emoji: "🐟", count: 6, label: "ψάρια" },
          { id: "B", emoji: "🐠", count: 6, label: "ψάρια" },
        ],
        correct: "equal"
      },
      {
        id: 4,
        groups: [
          { id: "A", emoji: "🌸", count: 4, label: "λουλούδια" },
          { id: "B", emoji: "🌺", count: 8, label: "λουλούδια" },
        ],
        correct: "B"
      },
      {
        id: 5,
        groups: [
          { id: "A", emoji: "🍒", count: 10, label: "κεράσια" },
          { id: "B", emoji: "🍓", count: 7, label: "φράουλες" },
        ],
        correct: "A"
      },
      {
        id: 6,
        groups: [
          { id: "A", emoji: "🦋", count: 5, label: "πεταλούδες" },
          { id: "B", emoji: "🐝", count: 5, label: "μέλισσες" },
        ],
        correct: "equal"
      },
      {
        id: 7,
        groups: [
          { id: "A", emoji: "🎈", count: 9, label: "μπαλόνια" },
          { id: "B", emoji: "🎁", count: 6, label: "δώρα" },
        ],
        correct: "A"
      },
      {
        id: 8,
        groups: [
          { id: "A", emoji: "🍕", count: 4, label: "πίτσες" },
          { id: "B", emoji: "🍔", count: 7, label: "μπέργκερ" },
        ],
        correct: "B"
      }
    ],
    en: [
      {
        id: 1,
        groups: [
          { id: "A", emoji: "🍎", count: 3, label: "apples" },
          { id: "B", emoji: "🍌", count: 5, label: "bananas" },
        ],
        correct: "B"
      },
      {
        id: 2,
        groups: [
          { id: "A", emoji: "⭐", count: 7, label: "stars" },
          { id: "B", emoji: "🌙", count: 4, label: "moons" },
        ],
        correct: "A"
      },
      {
        id: 3,
        groups: [
          { id: "A", emoji: "🐟", count: 6, label: "fish" },
          { id: "B", emoji: "🐠", count: 6, label: "fish" },
        ],
        correct: "equal"
      },
      {
        id: 4,
        groups: [
          { id: "A", emoji: "🌸", count: 4, label: "flowers" },
          { id: "B", emoji: "🌺", count: 8, label: "flowers" },
        ],
        correct: "B"
      },
      {
        id: 5,
        groups: [
          { id: "A", emoji: "🍒", count: 10, label: "cherries" },
          { id: "B", emoji: "🍓", count: 7, label: "strawberries" },
        ],
        correct: "A"
      },
      {
        id: 6,
        groups: [
          { id: "A", emoji: "🦋", count: 5, label: "butterflies" },
          { id: "B", emoji: "🐝", count: 5, label: "bees" },
        ],
        correct: "equal"
      },
      {
        id: 7,
        groups: [
          { id: "A", emoji: "🎈", count: 9, label: "balloons" },
          { id: "B", emoji: "🎁", count: 6, label: "gifts" },
        ],
        correct: "A"
      },
      {
        id: 8,
        groups: [
          { id: "A", emoji: "🍕", count: 4, label: "pizzas" },
          { id: "B", emoji: "🍔", count: 7, label: "burgers" },
        ],
        correct: "B"
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
      emoji: ["🎉", "⭐", "✨", "🌟", "🔢", "👏"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const handleGroupSelect = (groupId) => {
    if (showAnswer) return;

    setSelectedGroup(groupId);
    setShowAnswer(true);

    const isCorrect = groupId === round.correct;

    if (isCorrect) {
      correctSoundRef.current?.play().catch(() => {});

      const newScore = score + 1;
      setScore(newScore);

      // Show +1 score popup
      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      // Ενημέρωση progress
      updateProgress({
        title: "Which Has More",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      completeQuiz({
        title: "Which Has More",
        score: 1,
        total: 1,
      });

      // Πήγαινε στον επόμενο γύρο
      setTimeout(() => {
        if (currentRound + 1 < TARGET_ROUNDS) {
          setCurrentRound(prev => prev + 1);
          setSelectedGroup(null);
          setShowAnswer(false);
        } else {
          // Τελείωσαν όλοι οι γύροι
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
        setSelectedGroup(null);
        setShowAnswer(false);
      }, 1500);
    }
  };

  const progressPercent = Math.round(((currentRound + 1) / TARGET_ROUNDS) * 100);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-orange-100 via-yellow-100 to-green-100 p-4 sm:p-8 rounded-xl overflow-hidden">
      {/* Celebration Emojis */}
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

      {/* Score Popup */}
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

      {/* Score Bar */}
      <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">
              {lang === "el" ? "Ποιο έχει Περισσότερα;" : "Which Has More?"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Γύρος ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Round ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-orange-600">
            🔢 {score}
          </div>
        </div>

        {/* Progress Bar */}
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
      <div className="text-center mb-8">
        <p className="text-xl text-slate-700 font-semibold bg-white/80 backdrop-blur rounded-xl p-4 inline-block shadow-lg">
          {lang === "el"
            ? "🔢 Ποια ομάδα έχει περισσότερα αντικείμενα;"
            : "🔢 Which group has more objects?"}
        </p>
      </div>

      {/* Groups Comparison */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {round.groups.map((group) => {
            const isSelected = selectedGroup === group.id;
            const isCorrect = showAnswer && group.id === round.correct;
            const isWrong = showAnswer && isSelected && group.id !== round.correct;

            return (
              <button
                key={group.id}
                onClick={() => handleGroupSelect(group.id)}
                disabled={showAnswer}
                className={`
                  relative p-8 rounded-3xl border-4 transition-all duration-300 transform
                  ${isCorrect ? "bg-green-100 border-green-500 scale-105" : ""}
                  ${isWrong ? "bg-red-100 border-red-500 animate-shake" : ""}
                  ${!showAnswer ? "bg-white border-slate-300 hover:border-orange-400 hover:scale-105 cursor-pointer" : "cursor-not-allowed"}
                  ${showAnswer && !isSelected && group.id !== round.correct ? "opacity-50" : ""}
                `}
              >
                {/* Group Label */}
                <div className="text-center mb-6">
                  <div className="inline-block bg-slate-200 rounded-full px-6 py-2">
                    <span className="text-3xl font-bold text-slate-700">
                      {lang === "el" ? "Ομάδα" : "Group"} {group.id}
                    </span>
                  </div>
                </div>

                {/* Items Grid */}
                <div className={`grid gap-3 mb-6 ${
                  group.count <= 4 ? 'grid-cols-2' :
                  group.count <= 6 ? 'grid-cols-3' :
                  group.count <= 9 ? 'grid-cols-3' : 'grid-cols-4'
                }`}>
                  {Array.from({ length: group.count }, (_, i) => (
                    <div key={i} className="text-6xl animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
                      {group.emoji}
                    </div>
                  ))}
                </div>

                {/* Count Display */}
                <div className="text-center">
                  <div className="inline-block bg-orange-100 rounded-2xl px-8 py-4 border-4 border-orange-300">
                    <div className="text-5xl font-bold text-orange-700">
                      {group.count}
                    </div>
                    <div className="text-lg font-semibold text-orange-600 mt-1">
                      {group.label}
                    </div>
                  </div>
                </div>

                {/* Feedback Icons */}
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

        {/* Equal Option for equal cases */}
        {round.correct === "equal" && (
          <div className="mt-8 text-center">
            <button
              onClick={() => handleGroupSelect("equal")}
              disabled={showAnswer}
              className={`
                relative px-12 py-6 rounded-3xl border-4 transition-all duration-300 transform
                ${selectedGroup === "equal" && showAnswer ? "bg-green-100 border-green-500 scale-105" : ""}
                ${selectedGroup === "equal" && !showAnswer ? "bg-orange-100 border-orange-400" : ""}
                ${!showAnswer && selectedGroup !== "equal" ? "bg-white border-slate-300 hover:border-orange-400 hover:scale-105 cursor-pointer" : ""}
                ${showAnswer && selectedGroup !== "equal" ? "opacity-50" : ""}
              `}
            >
              <div className="text-4xl font-bold text-orange-700">
                {lang === "el" ? "🟰 Είναι Ίσα!" : "🟰 They're Equal!"}
              </div>
              {selectedGroup === "equal" && showAnswer && (
                <div className="absolute -top-4 -right-4 text-6xl animate-bounce">
                  ✅
                </div>
              )}
            </button>
          </div>
        )}

        {/* Feedback Message */}
        {showAnswer && (
          <div className="mt-8 text-center animate-fadeIn">
            {selectedGroup === round.correct ? (
              <div className="bg-green-100 rounded-2xl p-6 inline-block border-4 border-green-400">
                <p className="text-3xl font-bold text-green-700">
                  {lang === "el" ? "🎉 Μπράβο! Σωστή απάντηση!" : "🎉 Great! Correct answer!"}
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
      </div>

      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-orange-300/80 to-green-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🔢🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια!" : "Perfect!"}
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

