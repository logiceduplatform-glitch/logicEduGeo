// src/components/games/exercises_6_1/ReadingGame.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

export default function ReadingGame({ lang = "el", onComplete }) {
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

  const TARGET_ROUNDS = 8;

  const storiesData = {
    el: [
      {
        id: 1,
        text: "Η γάτα παίζει με την μπάλα. Η μπάλα είναι κόκκινη.",
        question: "Τι χρώμα είναι η μπάλα;",
        options: ["Κόκκινη", "Μπλε", "Πράσινη", "Κίτρινη"],
        correctAnswer: "Κόκκινη",
        image: "🐱⚽"
      },
      {
        id: 2,
        text: "Ο σκύλος τρώει το φαγητό του. Είναι πολύ πεινασμένος.",
        question: "Πώς νιώθει ο σκύλος;",
        options: ["Πεινασμένος", "Κουρασμένος", "Χαρούμενος", "Θυμωμένος"],
        correctAnswer: "Πεινασμένος",
        image: "🐶🍖"
      },
      {
        id: 3,
        text: "Ο ήλιος λάμπει στον ουρανό. Είναι μια όμορφη μέρα.",
        question: "Τι λάμπει στον ουρανό;",
        options: ["Ο ήλιος", "Το φεγγάρι", "Τα αστέρια", "Το σύννεφο"],
        correctAnswer: "Ο ήλιος",
        image: "☀️🌤️"
      },
      {
        id: 4,
        text: "Το παιδί πάει στο σχολείο. Κρατάει το σακίδιό του.",
        question: "Πού πάει το παιδί;",
        options: ["Στο σχολείο", "Στο σπίτι", "Στο πάρκο", "Στο μαγαζί"],
        correctAnswer: "Στο σχολείο",
        image: "👦🎒"
      },
      {
        id: 5,
        text: "Το πουλί πετάει στον ουρανό. Τραγουδάει ένα τραγούδι.",
        question: "Τι κάνει το πουλί;",
        options: ["Πετάει", "Κολυμπάει", "Τρέχει", "Κοιμάται"],
        correctAnswer: "Πετάει",
        image: "🐦🎵"
      },
      {
        id: 6,
        text: "Το δέντρο είναι πολύ ψηλό. Έχει πράσινα φύλλα.",
        question: "Τι χρώμα είναι τα φύλλα;",
        options: ["Πράσινα", "Κόκκινα", "Κίτρινα", "Μπλε"],
        correctAnswer: "Πράσινα",
        image: "🌳🍃"
      },
      {
        id: 7,
        text: "Το αυτοκίνητο είναι γρήγορο. Τρέχει στον δρόμο.",
        question: "Πού τρέχει το αυτοκίνητο;",
        options: ["Στον δρόμο", "Στη θάλασσα", "Στον ουρανό", "Στο δάσος"],
        correctAnswer: "Στον δρόμο",
        image: "🚗💨"
      },
      {
        id: 8,
        text: "Το παγωτό είναι κρύο και γλυκό. Το παιδί το τρώει με χαρά.",
        question: "Πώς είναι το παγωτό;",
        options: ["Κρύο", "Ζεστό", "Πικρό", "Ξινό"],
        correctAnswer: "Κρύο",
        image: "🍦😋"
      }
    ],
    en: [
      {
        id: 1,
        text: "The cat plays with the ball. The ball is red.",
        question: "What color is the ball?",
        options: ["Red", "Blue", "Green", "Yellow"],
        correctAnswer: "Red",
        image: "🐱⚽"
      },
      {
        id: 2,
        text: "The dog eats his food. He is very hungry.",
        question: "How does the dog feel?",
        options: ["Hungry", "Tired", "Happy", "Angry"],
        correctAnswer: "Hungry",
        image: "🐶🍖"
      },
      {
        id: 3,
        text: "The sun shines in the sky. It is a beautiful day.",
        question: "What shines in the sky?",
        options: ["The sun", "The moon", "The stars", "The cloud"],
        correctAnswer: "The sun",
        image: "☀️🌤️"
      },
      {
        id: 4,
        text: "The child goes to school. He carries his backpack.",
        question: "Where does the child go?",
        options: ["To school", "To home", "To the park", "To the store"],
        correctAnswer: "To school",
        image: "👦🎒"
      },
      {
        id: 5,
        text: "The bird flies in the sky. It sings a song.",
        question: "What does the bird do?",
        options: ["Flies", "Swims", "Runs", "Sleeps"],
        correctAnswer: "Flies",
        image: "🐦🎵"
      },
      {
        id: 6,
        text: "The tree is very tall. It has green leaves.",
        question: "What color are the leaves?",
        options: ["Green", "Red", "Yellow", "Blue"],
        correctAnswer: "Green",
        image: "🌳🍃"
      },
      {
        id: 7,
        text: "The car is fast. It runs on the road.",
        question: "Where does the car run?",
        options: ["On the road", "In the sea", "In the sky", "In the forest"],
        correctAnswer: "On the road",
        image: "🚗💨"
      },
      {
        id: 8,
        text: "The ice cream is cold and sweet. The child eats it happily.",
        question: "How is the ice cream?",
        options: ["Cold", "Hot", "Bitter", "Sour"],
        correctAnswer: "Cold",
        image: "🍦😋"
      }
    ]
  };

  const stories = storiesData[lang];
  const story = stories[currentRound];

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
      emoji: ["🎉", "⭐", "✨", "🌟", "✅", "📖", "🏆"][Math.floor(Math.random() * 7)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const handleAnswerSelect = (answer) => {
    if (showAnswer) return;

    setSelectedAnswer(answer);
    setShowAnswer(true);

    const isCorrect = answer === story.correctAnswer;

    if (isCorrect) {
      correctSoundRef.current?.play().catch(() => {});

      const newScore = score + 1;
      setScore(newScore);

      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      updateProgress({
        title: "Reading Game",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      completeQuiz({
        title: "Reading Game",
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
      }, 2000);
    } else {
      wrongSoundRef.current?.play().catch(() => {});

      setTimeout(() => {
        setSelectedAnswer(null);
        setShowAnswer(false);
      }, 1500);
    }
  };

  const progressPercent = Math.round((currentRound / TARGET_ROUNDS) * 100);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-green-100 via-teal-100 to-blue-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Κατανόηση Ανάγνωσης" : "Reading Comprehension"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Ιστορία ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Story ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-teal-600">
            📖 {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-teal-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-600">
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Game Area */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border-4 border-teal-400">
          {/* Story Card */}
          <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-3xl p-8 mb-8 border-4 border-green-300 shadow-lg">
            <div className="text-7xl text-center mb-6">{story.image}</div>
            <p className="text-2xl leading-relaxed text-slate-800 text-center font-medium">
              {story.text}
            </p>
          </div>

          {/* Question */}
          {!showAnswer && (
            <>
              <p className="text-3xl font-bold text-center text-teal-700 mb-6">
                {story.question}
              </p>

              {/* Answer Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {story.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswerSelect(option)}
                    className="p-6 rounded-2xl bg-gradient-to-br from-teal-100 to-green-100 hover:from-teal-200 hover:to-green-200 border-4 border-teal-300 hover:border-teal-500 transition-all duration-200 transform hover:scale-105 shadow-lg text-xl font-bold text-slate-800"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Show Answer */}
          {showAnswer && selectedAnswer === story.correctAnswer && (
            <div className="text-center animate-fadeIn">
              <div className="inline-block bg-green-100 rounded-3xl p-8 border-4 border-green-400">
                <div className="text-8xl mb-4">✅</div>
                <p className="text-3xl font-bold text-green-700">
                  {lang === "el"
                    ? `🎉 Σωστά! ${story.correctAnswer}`
                    : `🎉 Correct! ${story.correctAnswer}`}
                </p>
              </div>
            </div>
          )}

          {showAnswer && selectedAnswer !== story.correctAnswer && (
            <div className="text-center animate-fadeIn">
              <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
                <p className="text-3xl font-bold text-red-700">
                  {lang === "el"
                    ? `Προσπάθησε ξανά! Διάβασε προσεκτικά!`
                    : `Try again! Read carefully!`}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-green-300/80 to-teal-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">📖🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Είσαι άσος στην ανάγνωση!" : "Perfect! You're a reading star!"}
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

