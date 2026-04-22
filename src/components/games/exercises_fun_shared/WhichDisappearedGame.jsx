// src/components/games/WhichDisappearedGame.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import { VoiceService } from "../../../services/VoiceService";

export default function WhichDisappearedGame({ lang = "el", difficulty = 3, onComplete }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [showingAll, setShowingAll] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const TARGET_ROUNDS = 10;

  const roundsData = {
    el: [
      {
        id: 1,
        items: [
          { id: "apple", emoji: "🍎", label: "Μήλο" },
          { id: "banana", emoji: "🍌", label: "Μπανάνα" },
          { id: "orange", emoji: "🍊", label: "Πορτοκάλι" },
          { id: "grape", emoji: "🍇", label: "Σταφύλι" }
        ],
        missingId: "banana",
        description: "Ποιο εξαφανίστηκε;"
      },
      {
        id: 2,
        items: [
          { id: "dog", emoji: "🐶", label: "Σκύλος" },
          { id: "cat", emoji: "🐱", label: "Γάτα" },
          { id: "rabbit", emoji: "🐰", label: "Λαγός" },
          { id: "bear", emoji: "🐻", label: "Αρκούδα" }
        ],
        missingId: "cat",
        description: "Ποιο εξαφανίστηκε;"
      },
      {
        id: 3,
        items: [
          { id: "car", emoji: "🚗", label: "Αυτοκίνητο" },
          { id: "bus", emoji: "🚌", label: "Λεωφορείο" },
          { id: "train", emoji: "🚆", label: "Τρένο" },
          { id: "plane", emoji: "✈️", label: "Αεροπλάνο" }
        ],
        missingId: "train",
        description: "Ποιο εξαφανίστηκε;"
      },
      {
        id: 4,
        items: [
          { id: "star", emoji: "⭐", label: "Αστέρι" },
          { id: "moon", emoji: "🌙", label: "Φεγγάρι" },
          { id: "sun", emoji: "☀️", label: "Ήλιος" },
          { id: "cloud", emoji: "☁️", label: "Σύννεφο" }
        ],
        missingId: "moon",
        description: "Ποιο εξαφανίστηκε;"
      },
      {
        id: 5,
        items: [
          { id: "flower", emoji: "🌸", label: "Λουλούδι" },
          { id: "tree", emoji: "🌲", label: "Δέντρο" },
          { id: "cactus", emoji: "🌵", label: "Κάκτος" },
          { id: "sunflower", emoji: "🌻", label: "Ηλιοτρόπιο" }
        ],
        missingId: "tree",
        description: "Ποιο εξαφανίστηκε;"
      },
      {
        id: 6,
        items: [
          { id: "pizza", emoji: "🍕", label: "Πίτσα" },
          { id: "burger", emoji: "🍔", label: "Μπέργκερ" },
          { id: "hotdog", emoji: "🌭", label: "Χοτ Ντογκ" },
          { id: "cake", emoji: "🍰", label: "Τούρτα" }
        ],
        missingId: "burger",
        description: "Ποιο εξαφανίστηκε;"
      },
      {
        id: 7,
        items: [
          { id: "ball", emoji: "⚽", label: "Μπάλα" },
          { id: "basketball", emoji: "🏀", label: "Μπάσκετ" },
          { id: "tennis", emoji: "🎾", label: "Τένις" },
          { id: "baseball", emoji: "⚾", label: "Μπέιζμπολ" }
        ],
        missingId: "basketball",
        description: "Ποιο εξαφανίστηκε;"
      },
      {
        id: 8,
        items: [
          { id: "heart", emoji: "❤️", label: "Καρδιά" },
          { id: "diamond", emoji: "💎", label: "Διαμάντι" },
          { id: "crown", emoji: "👑", label: "Κορώνα" },
          { id: "star2", emoji: "🌟", label: "Αστέρι" }
        ],
        missingId: "diamond",
        description: "Ποιο εξαφανίστηκε;"
      },
      {
        id: 9,
        items: [
          { id: "butterfly", emoji: "🦋", label: "Πεταλούδα" },
          { id: "bee", emoji: "🐝", label: "Μέλισσα" },
          { id: "ladybug", emoji: "🐞", label: "Πασχαλίτσα" },
          { id: "ant", emoji: "🐜", label: "Μυρμήγκι" }
        ],
        missingId: "bee",
        description: "Ποιο εξαφανίστηκε;"
      },
      {
        id: 10,
        items: [
          { id: "house", emoji: "🏠", label: "Σπίτι" },
          { id: "school", emoji: "🏫", label: "Σχολείο" },
          { id: "hospital", emoji: "🏥", label: "Νοσοκομείο" },
          { id: "castle", emoji: "🏰", label: "Κάστρο" }
        ],
        missingId: "school",
        description: "Ποιο εξαφανίστηκε;"
      }
    ],
    en: [
      {
        id: 1,
        items: [
          { id: "apple", emoji: "🍎", label: "Apple" },
          { id: "banana", emoji: "🍌", label: "Banana" },
          { id: "orange", emoji: "🍊", label: "Orange" },
          { id: "grape", emoji: "🍇", label: "Grape" }
        ],
        missingId: "banana",
        description: "Which one disappeared?"
      },
      {
        id: 2,
        items: [
          { id: "dog", emoji: "🐶", label: "Dog" },
          { id: "cat", emoji: "🐱", label: "Cat" },
          { id: "rabbit", emoji: "🐰", label: "Rabbit" },
          { id: "bear", emoji: "🐻", label: "Bear" }
        ],
        missingId: "cat",
        description: "Which one disappeared?"
      },
      {
        id: 3,
        items: [
          { id: "car", emoji: "🚗", label: "Car" },
          { id: "bus", emoji: "🚌", label: "Bus" },
          { id: "train", emoji: "🚆", label: "Train" },
          { id: "plane", emoji: "✈️", label: "Plane" }
        ],
        missingId: "train",
        description: "Which one disappeared?"
      },
      {
        id: 4,
        items: [
          { id: "star", emoji: "⭐", label: "Star" },
          { id: "moon", emoji: "🌙", label: "Moon" },
          { id: "sun", emoji: "☀️", label: "Sun" },
          { id: "cloud", emoji: "☁️", label: "Cloud" }
        ],
        missingId: "moon",
        description: "Which one disappeared?"
      },
      {
        id: 5,
        items: [
          { id: "flower", emoji: "🌸", label: "Flower" },
          { id: "tree", emoji: "🌲", label: "Tree" },
          { id: "cactus", emoji: "🌵", label: "Cactus" },
          { id: "sunflower", emoji: "🌻", label: "Sunflower" }
        ],
        missingId: "tree",
        description: "Which one disappeared?"
      },
      {
        id: 6,
        items: [
          { id: "pizza", emoji: "🍕", label: "Pizza" },
          { id: "burger", emoji: "🍔", label: "Burger" },
          { id: "hotdog", emoji: "🌭", label: "Hot Dog" },
          { id: "cake", emoji: "🍰", label: "Cake" }
        ],
        missingId: "burger",
        description: "Which one disappeared?"
      },
      {
        id: 7,
        items: [
          { id: "ball", emoji: "⚽", label: "Ball" },
          { id: "basketball", emoji: "🏀", label: "Basketball" },
          { id: "tennis", emoji: "🎾", label: "Tennis" },
          { id: "baseball", emoji: "⚾", label: "Baseball" }
        ],
        missingId: "basketball",
        description: "Which one disappeared?"
      },
      {
        id: 8,
        items: [
          { id: "heart", emoji: "❤️", label: "Heart" },
          { id: "diamond", emoji: "💎", label: "Diamond" },
          { id: "crown", emoji: "👑", label: "Crown" },
          { id: "star2", emoji: "🌟", label: "Star" }
        ],
        missingId: "diamond",
        description: "Which one disappeared?"
      },
      {
        id: 9,
        items: [
          { id: "butterfly", emoji: "🦋", label: "Butterfly" },
          { id: "bee", emoji: "🐝", label: "Bee" },
          { id: "ladybug", emoji: "🐞", label: "Ladybug" },
          { id: "ant", emoji: "🐜", label: "Ant" }
        ],
        missingId: "bee",
        description: "Which one disappeared?"
      },
      {
        id: 10,
        items: [
          { id: "house", emoji: "🏠", label: "House" },
          { id: "school", emoji: "🏫", label: "School" },
          { id: "hospital", emoji: "🏥", label: "Hospital" },
          { id: "castle", emoji: "🏰", label: "Castle" }
        ],
        missingId: "school",
        description: "Which one disappeared?"
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
    setShowingAll(true);
    setSelectedAnswer(null);
    setShowAnswer(false);

    // Show all items for 3 seconds, then hide one
    const hideTimer = setTimeout(() => {
      setShowingAll(false);
    }, 3000);

    return () => clearTimeout(hideTimer);
  }, [currentRound]);

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "✅", "🧠"][Math.floor(Math.random() * 6)],
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
        ? 'Κοίτα τα αντικείμενα και θυμήσου ποιο εξαφανίστηκε'
        : 'Look at the objects and remember which one disappeared';

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

  const handleAnswerSelect = (itemId) => {
    if (showAnswer || showingAll) return;

    setSelectedAnswer(itemId);
    setShowAnswer(true);

    const isCorrect = itemId === round.missingId;

    if (isCorrect) {
      correctSoundRef.current?.play().catch(() => {});

      const newScore = score + 1;
      setScore(newScore);

      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      updateProgress({
        title: "Which Disappeared Game",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      setTimeout(() => {
        if (currentRound + 1 < TARGET_ROUNDS) {
          setCurrentRound(prev => prev + 1);
        } else {
          completeQuiz({
            title: "Which Disappeared Game",
            score: newScore,
            total: TARGET_ROUNDS,
          });
          createCelebrationEmojis();
          setShowCelebration(true);
          setTimeout(() => {
            if (onComplete) {
              onComplete();
            }
          }, 2500);
        }
      }, 2500);
    } else {
      wrongSoundRef.current?.play().catch(() => {});

      setTimeout(() => {
        setSelectedAnswer(null);
        setShowAnswer(false);
      }, 1500);
    }
  };

  const progressPercent = Math.round(((currentRound + 1) / TARGET_ROUNDS) * 100);
  const missingItem = round.items.find(item => item.id === round.missingId);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Ποιο Εξαφανίστηκε;" : "Which Disappeared?"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Επίπεδο ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Level ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-purple-600">
            🧠 {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-400 to-purple-500 transition-all duration-500 ease-out"
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
          <div className="text-7xl mb-3">👀</div>
          <h2 className="text-3xl font-bold mb-3 text-slate-800">
            {showingAll
              ? (lang === "el" ? "Κοίτα καλά!" : "Look carefully!")
              : round.description
            }
          </h2>

          <button
            onClick={speakQuestion}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xl font-bold rounded-full hover:scale-105 transition-transform shadow-lg"
          >
            🔊 {lang === "el" ? "Άκουσε Ξανά" : "Listen Again"}
          </button>
        </div>
      </div>

      {/* Game Area */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border-4 border-purple-400">
          {showingAll ? (
            <>
              <p className="text-2xl font-bold text-center text-slate-800 mb-6">
                {lang === "el" ? "Θυμήσου αυτά τα 4:" : "Remember these 4:"}
              </p>

              {/* Show all 4 items */}
              <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto">
                {round.items.map((item, index) => (
                  <div
                    key={item.id}
                    className="relative bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-8 border-4 border-purple-300 flex flex-col items-center justify-center shadow-lg animate-bounce"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div className="text-8xl mb-3">{item.emoji}</div>
                    <p className="text-xl font-bold text-slate-700">{item.label}</p>
                  </div>
                ))}
              </div>

              <div className="text-center mt-8">
                <div className="inline-block bg-yellow-100 rounded-2xl p-4 border-4 border-yellow-400">
                  <p className="text-xl font-bold text-yellow-700 animate-pulse">
                    {lang === "el" ? "Θυμήσου όλα!" : "Remember them all!"}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="text-2xl font-bold text-center text-slate-800 mb-6">
                {lang === "el" ? "Ένα εξαφανίστηκε! Ποιο;" : "One disappeared! Which one?"}
              </p>

              {/* Show 3 items (missing one) */}
              <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto mb-8">
                {round.items.map((item) => {
                  const isMissing = item.id === round.missingId;

                  if (isMissing) {
                    return (
                      <div
                        key={item.id}
                        className="relative bg-gradient-to-br from-slate-200 to-slate-300 rounded-3xl p-8 border-4 border-dashed border-slate-400 flex flex-col items-center justify-center shadow-lg"
                      >
                        <div className="text-8xl text-slate-400">❓</div>
                        <p className="text-xl font-bold text-slate-500 mt-3">???</p>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={item.id}
                      className="relative bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-8 border-4 border-purple-300 flex flex-col items-center justify-center shadow-lg"
                    >
                      <div className="text-8xl mb-3">{item.emoji}</div>
                      <p className="text-xl font-bold text-slate-700">{item.label}</p>
                    </div>
                  );
                })}
              </div>

              {/* Answer options */}
              {!showAnswer && (
                <>
                  <p className="text-xl font-bold text-center text-slate-700 mb-4">
                    {lang === "el" ? "Ποιο εξαφανίστηκε;" : "Which one disappeared?"}
                  </p>

                  <div className="flex justify-center gap-4">
                    {round.items.map((item) => {
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleAnswerSelect(item.id)}
                          className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200 border-4 border-blue-300 hover:border-blue-500 transition-all duration-200 transform hover:scale-110 shadow-lg flex flex-col items-center justify-center cursor-pointer"
                        >
                          <div className="text-6xl mb-1">{item.emoji}</div>
                          <p className="text-sm font-bold text-slate-700">{item.label}</p>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {showAnswer && selectedAnswer === round.missingId && (
        <div className="text-center animate-fadeIn">
          <div className="bg-green-100 rounded-2xl p-6 inline-block border-4 border-green-400">
            <div className="text-7xl mb-3">{missingItem.emoji}</div>
            <p className="text-3xl font-bold text-green-700">
              {lang === "el"
                ? `🎉 Σωστά! Το ${missingItem.label} εξαφανίστηκε!`
                : `🎉 Correct! The ${missingItem.label} disappeared!`}
            </p>
          </div>
        </div>
      )}

      {showAnswer && selectedAnswer !== round.missingId && (
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
        <div className="absolute inset-0 bg-gradient-to-br from-pink-300/80 to-purple-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🧠🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Έχεις εξαιρετική μνήμη!" : "Perfect! You have excellent memory!"}
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

