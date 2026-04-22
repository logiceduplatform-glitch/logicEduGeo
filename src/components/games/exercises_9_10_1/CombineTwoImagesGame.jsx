// src/components/games/CombineTwoImagesGame.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

export default function CombineTwoImagesGame({ lang = "el", onComplete }) {
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

  const TARGET_ROUNDS = 10;

  const roundsData = {
    el: [
      {
        id: 1,
        image1: { emoji: "🌧️", label: "Βροχή" },
        image2: { emoji: "☁️", label: "Σύννεφα" },
        correctAnswer: "storm",
        description: "Τι δημιουργούν μαζί;",
        options: [
          { id: "storm", emoji: "⛈️", label: "Καταιγίδα" },
          { id: "rainbow", emoji: "🌈", label: "Ουράνιο Τόξο" },
          { id: "sun", emoji: "☀️", label: "Ήλιος" },
          { id: "snow", emoji: "❄️", label: "Χιόνι" }
        ]
      },
      {
        id: 2,
        image1: { emoji: "🍞", label: "Ψωμί" },
        image2: { emoji: "🧈", label: "Βούτυρο" },
        correctAnswer: "toast",
        description: "Τι δημιουργούν μαζί;",
        options: [
          { id: "toast", emoji: "🍞🧈", label: "Βουτυρόψωμο" },
          { id: "cake", emoji: "🍰", label: "Τούρτα" },
          { id: "pizza", emoji: "🍕", label: "Πίτσα" },
          { id: "cookie", emoji: "🍪", label: "Μπισκότο" }
        ]
      },
      {
        id: 3,
        image1: { emoji: "☀️", label: "Ήλιος" },
        image2: { emoji: "🏖️", label: "Παραλία" },
        correctAnswer: "summer",
        description: "Τι δημιουργούν μαζί;",
        options: [
          { id: "summer", emoji: "🏝️", label: "Καλοκαίρι" },
          { id: "winter", emoji: "⛄", label: "Χειμώνας" },
          { id: "spring", emoji: "🌸", label: "Άνοιξη" },
          { id: "autumn", emoji: "🍂", label: "Φθινόπωρο" }
        ]
      },
      {
        id: 4,
        image1: { emoji: "🥛", label: "Γάλα" },
        image2: { emoji: "🍫", label: "Σοκολάτα" },
        correctAnswer: "hotChocolate",
        description: "Τι δημιουργούν μαζί;",
        options: [
          { id: "hotChocolate", emoji: "☕", label: "Ζεστή Σοκολάτα" },
          { id: "iceCream", emoji: "🍦", label: "Παγωτό" },
          { id: "cake", emoji: "🎂", label: "Κέικ" },
          { id: "candy", emoji: "🍬", label: "Καραμέλα" }
        ]
      },
      {
        id: 5,
        image1: { emoji: "🌙", label: "Φεγγάρι" },
        image2: { emoji: "⭐", label: "Αστέρια" },
        correctAnswer: "night",
        description: "Τι δημιουργούν μαζί;",
        options: [
          { id: "night", emoji: "🌃", label: "Νύχτα" },
          { id: "day", emoji: "🌅", label: "Μέρα" },
          { id: "sunset", emoji: "🌇", label: "Ηλιοβασίλεμα" },
          { id: "dawn", emoji: "🌄", label: "Αυγή" }
        ]
      },
      {
        id: 6,
        image1: { emoji: "🐝", label: "Μέλισσα" },
        image2: { emoji: "🌸", label: "Λουλούδι" },
        correctAnswer: "honey",
        description: "Τι δημιουργούν μαζί;",
        options: [
          { id: "honey", emoji: "🍯", label: "Μέλι" },
          { id: "juice", emoji: "🧃", label: "Χυμός" },
          { id: "tea", emoji: "🍵", label: "Τσάι" },
          { id: "water", emoji: "💧", label: "Νερό" }
        ]
      },
      {
        id: 7,
        image1: { emoji: "🍎", label: "Μήλο" },
        image2: { emoji: "🔪", label: "Μαχαίρι" },
        correctAnswer: "slicedApple",
        description: "Τι δημιουργούν μαζί;",
        options: [
          { id: "slicedApple", emoji: "🍏", label: "Κομμένο Μήλο" },
          { id: "juice", emoji: "🧃", label: "Χυμός" },
          { id: "pie", emoji: "🥧", label: "Πίτα" },
          { id: "sauce", emoji: "🍲", label: "Σάλτσα" }
        ]
      },
      {
        id: 8,
        image1: { emoji: "🎨", label: "Μπογιές" },
        image2: { emoji: "📄", label: "Χαρτί" },
        correctAnswer: "painting",
        description: "Τι δημιουργούν μαζί;",
        options: [
          { id: "painting", emoji: "🖼️", label: "Ζωγραφιά" },
          { id: "book", emoji: "📖", label: "Βιβλίο" },
          { id: "letter", emoji: "✉️", label: "Γράμμα" },
          { id: "photo", emoji: "📸", label: "Φωτογραφία" }
        ]
      },
      {
        id: 9,
        image1: { emoji: "🌳", label: "Δέντρο" },
        image2: { emoji: "🍎", label: "Μήλα" },
        correctAnswer: "appleTree",
        description: "Τι δημιουργούν μαζί;",
        options: [
          { id: "appleTree", emoji: "🌳🍎", label: "Μηλιά" },
          { id: "forest", emoji: "🌲", label: "Δάσος" },
          { id: "garden", emoji: "🏡", label: "Κήπος" },
          { id: "park", emoji: "🏞️", label: "Πάρκο" }
        ]
      },
      {
        id: 10,
        image1: { emoji: "🔥", label: "Φωτιά" },
        image2: { emoji: "🪵", label: "Ξύλο" },
        correctAnswer: "campfire",
        description: "Τι δημιουργούν μαζί;",
        options: [
          { id: "campfire", emoji: "🔥🪵", label: "Φωτιά" },
          { id: "house", emoji: "🏠", label: "Σπίτι" },
          { id: "smoke", emoji: "💨", label: "Καπνός" },
          { id: "coal", emoji: "🪨", label: "Κάρβουνο" }
        ]
      }
    ],
    en: [
      {
        id: 1,
        image1: { emoji: "🌧️", label: "Rain" },
        image2: { emoji: "☁️", label: "Clouds" },
        correctAnswer: "storm",
        description: "What do they create together?",
        options: [
          { id: "storm", emoji: "⛈️", label: "Storm" },
          { id: "rainbow", emoji: "🌈", label: "Rainbow" },
          { id: "sun", emoji: "☀️", label: "Sun" },
          { id: "snow", emoji: "❄️", label: "Snow" }
        ]
      },
      {
        id: 2,
        image1: { emoji: "🍞", label: "Bread" },
        image2: { emoji: "🧈", label: "Butter" },
        correctAnswer: "toast",
        description: "What do they create together?",
        options: [
          { id: "toast", emoji: "🍞🧈", label: "Buttered Bread" },
          { id: "cake", emoji: "🍰", label: "Cake" },
          { id: "pizza", emoji: "🍕", label: "Pizza" },
          { id: "cookie", emoji: "🍪", label: "Cookie" }
        ]
      },
      {
        id: 3,
        image1: { emoji: "☀️", label: "Sun" },
        image2: { emoji: "🏖️", label: "Beach" },
        correctAnswer: "summer",
        description: "What do they create together?",
        options: [
          { id: "summer", emoji: "🏝️", label: "Summer" },
          { id: "winter", emoji: "⛄", label: "Winter" },
          { id: "spring", emoji: "🌸", label: "Spring" },
          { id: "autumn", emoji: "🍂", label: "Autumn" }
        ]
      },
      {
        id: 4,
        image1: { emoji: "🥛", label: "Milk" },
        image2: { emoji: "🍫", label: "Chocolate" },
        correctAnswer: "hotChocolate",
        description: "What do they create together?",
        options: [
          { id: "hotChocolate", emoji: "☕", label: "Hot Chocolate" },
          { id: "iceCream", emoji: "🍦", label: "Ice Cream" },
          { id: "cake", emoji: "🎂", label: "Cake" },
          { id: "candy", emoji: "🍬", label: "Candy" }
        ]
      },
      {
        id: 5,
        image1: { emoji: "🌙", label: "Moon" },
        image2: { emoji: "⭐", label: "Stars" },
        correctAnswer: "night",
        description: "What do they create together?",
        options: [
          { id: "night", emoji: "🌃", label: "Night" },
          { id: "day", emoji: "🌅", label: "Day" },
          { id: "sunset", emoji: "🌇", label: "Sunset" },
          { id: "dawn", emoji: "🌄", label: "Dawn" }
        ]
      },
      {
        id: 6,
        image1: { emoji: "🐝", label: "Bee" },
        image2: { emoji: "🌸", label: "Flower" },
        correctAnswer: "honey",
        description: "What do they create together?",
        options: [
          { id: "honey", emoji: "🍯", label: "Honey" },
          { id: "juice", emoji: "🧃", label: "Juice" },
          { id: "tea", emoji: "🍵", label: "Tea" },
          { id: "water", emoji: "💧", label: "Water" }
        ]
      },
      {
        id: 7,
        image1: { emoji: "🍎", label: "Apple" },
        image2: { emoji: "🔪", label: "Knife" },
        correctAnswer: "slicedApple",
        description: "What do they create together?",
        options: [
          { id: "slicedApple", emoji: "🍏", label: "Sliced Apple" },
          { id: "juice", emoji: "🧃", label: "Juice" },
          { id: "pie", emoji: "🥧", label: "Pie" },
          { id: "sauce", emoji: "🍲", label: "Sauce" }
        ]
      },
      {
        id: 8,
        image1: { emoji: "🎨", label: "Paint" },
        image2: { emoji: "📄", label: "Paper" },
        correctAnswer: "painting",
        description: "What do they create together?",
        options: [
          { id: "painting", emoji: "🖼️", label: "Painting" },
          { id: "book", emoji: "📖", label: "Book" },
          { id: "letter", emoji: "✉️", label: "Letter" },
          { id: "photo", emoji: "📸", label: "Photo" }
        ]
      },
      {
        id: 9,
        image1: { emoji: "🌳", label: "Tree" },
        image2: { emoji: "🍎", label: "Apples" },
        correctAnswer: "appleTree",
        description: "What do they create together?",
        options: [
          { id: "appleTree", emoji: "🌳🍎", label: "Apple Tree" },
          { id: "forest", emoji: "🌲", label: "Forest" },
          { id: "garden", emoji: "🏡", label: "Garden" },
          { id: "park", emoji: "🏞️", label: "Park" }
        ]
      },
      {
        id: 10,
        image1: { emoji: "🔥", label: "Fire" },
        image2: { emoji: "🪵", label: "Wood" },
        correctAnswer: "campfire",
        description: "What do they create together?",
        options: [
          { id: "campfire", emoji: "🔥🪵", label: "Campfire" },
          { id: "house", emoji: "🏠", label: "House" },
          { id: "smoke", emoji: "💨", label: "Smoke" },
          { id: "coal", emoji: "🪨", label: "Coal" }
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

      const gameTitle = lang === "el" ? "Συνδυασμός Εικόνων" : "Combine Two Images Game";
      updateProgress({
        title: gameTitle,
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      completeQuiz({
        title: gameTitle,
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

  const progressPercent = Math.round((currentRound / TARGET_ROUNDS) * 100);
  const correctOption = round.options.find(opt => opt.id === round.correctAnswer);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-green-100 via-yellow-100 to-orange-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Συνδύασε 2 Εικόνες" : "Combine 2 Images"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Επίπεδο ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Level ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-green-600">
            🧠 {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-orange-500 transition-all duration-500 ease-out"
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
        <div className="inline-block bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl border-4 border-green-400">
          <div className="text-7xl mb-3">🤔</div>
          <h2 className="text-3xl font-bold mb-3 text-slate-800">
            {round.description}
          </h2>
        </div>
      </div>

      {/* Game Area */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border-4 border-green-400">
          {/* Two Images with Plus Sign */}
          <div className="flex justify-center items-center gap-8 mb-8">
            {/* First Image */}
            <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-3xl p-8 border-4 border-blue-400 flex flex-col items-center justify-center shadow-lg w-56 h-56">
              <div className="text-9xl mb-3">{round.image1.emoji}</div>
              <p className="text-xl font-bold text-slate-700">{round.image1.label}</p>
            </div>

            {/* Plus Sign */}
            <div className="text-8xl font-bold text-green-600 animate-pulse">
              +
            </div>

            {/* Second Image */}
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-8 border-4 border-purple-400 flex flex-col items-center justify-center shadow-lg w-56 h-56">
              <div className="text-9xl mb-3">{round.image2.emoji}</div>
              <p className="text-xl font-bold text-slate-700">{round.image2.label}</p>
            </div>

            {/* Equals Sign */}
            <div className="text-8xl font-bold text-orange-600 animate-pulse">
              =
            </div>

            {/* Question Mark */}
            <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-3xl p-8 border-4 border-dashed border-yellow-400 flex items-center justify-center shadow-lg w-56 h-56">
              <div className="text-9xl animate-bounce">❓</div>
            </div>
          </div>

          {/* Answer Options */}
          {!showAnswer && (
            <>
              <p className="text-2xl font-bold text-center text-slate-700 mb-6">
                {lang === "el" ? "Τι δημιουργούν μαζί;" : "What do they create together?"}
              </p>

              <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                {round.options.map((option) => {
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleAnswerSelect(option.id)}
                      className="p-6 rounded-2xl bg-gradient-to-br from-green-100 to-yellow-100 hover:from-green-200 hover:to-yellow-200 border-4 border-green-300 hover:border-green-500 transition-all duration-200 transform hover:scale-105 shadow-lg flex flex-col items-center justify-center cursor-pointer"
                    >
                      <div className="text-7xl mb-3">{option.emoji}</div>
                      <p className="text-lg font-bold text-slate-700">{option.label}</p>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Show Answer */}
          {showAnswer && selectedAnswer === round.correctAnswer && (
            <div className="text-center animate-fadeIn">
              <div className="inline-block bg-green-100 rounded-3xl p-8 border-4 border-green-400">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="text-6xl">{round.image1.emoji}</div>
                  <div className="text-4xl text-green-600">+</div>
                  <div className="text-6xl">{round.image2.emoji}</div>
                  <div className="text-4xl text-green-600">=</div>
                  <div className="text-8xl">{correctOption.emoji}</div>
                </div>
                <p className="text-3xl font-bold text-green-700">
                  {lang === "el"
                    ? `🎉 Σωστά! Δημιουργούν ${correctOption.label}!`
                    : `🎉 Correct! They create ${correctOption.label}!`}
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
        </div>
      </div>

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-green-300/80 to-orange-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🧠🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Συνδυάζεις εξαιρετικά!" : "Perfect! You combine excellently!"}
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

