// src/components/games/exercises_6_1/ScienceExperimentsGame.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

export default function ScienceExperimentsGame({ lang = "el", onComplete }) {
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

  const scienceData = {
    el: [
      { question: "Τι χρειάζονται τα φυτά για να μεγαλώσουν;", correct: "Νερό και ήλιο", icon: "🌱", options: ["Νερό και ήλιο", "Μόνο νερό", "Μόνο σκοτάδι", "Χιόνι"] },
      { question: "Τι συμβαίνει όταν ρίξουμε πάγο στο νερό;", correct: "Λιώνει", icon: "🧊", options: ["Λιώνει", "Γίνεται πιο σκληρός", "Εξαφανίζεται", "Καίει"] },
      { question: "Τι κάνει ο μαγνήτης;", correct: "Τραβάει το σίδερο", icon: "🧲", options: ["Τραβάει το σίδερο", "Τραβάει το ξύλο", "Τραβάει το νερό", "Τραβάει το χαρτί"] },
      { question: "Γιατί πέφτουν τα πράγματα κάτω;", correct: "Βαρύτητα", icon: "🍎", options: ["Βαρύτητα", "Άνεμος", "Μαγεία", "Νερό"] },
      { question: "Πώς μετακινούνται τα πουλιά στον αέρα;", correct: "Πετάνε", icon: "🐦", options: ["Πετάνε", "Κολυμπάνε", "Τρέχουν", "Σκάβουν"] },
      { question: "Τι χρειάζεται η φωτιά για να καίει;", correct: "Αέρα (οξυγόνο)", icon: "🔥", options: ["Αέρα (οξυγόνο)", "Νερό", "Σκοτάδι", "Πάγο"] },
      { question: "Από τι είναι φτιαγμένα τα σύννεφα;", correct: "Από νερό (ατμό)", icon: "☁️", options: ["Από νερό (ατμό)", "Από χιόνι", "Από μαλλί", "Από χαρτί"] },
      { question: "Τι κάνει τα πράγματα να φαίνονται;", correct: "Το φως", icon: "💡", options: ["Το φως", "Το σκοτάδι", "Ο ήχος", "Η μυρωδιά"] },
      { question: "Τι συμβαίνει στο νερό όταν παγώνει;", correct: "Γίνεται πάγος", icon: "❄️", options: ["Γίνεται πάγος", "Εξαφανίζεται", "Γίνεται ζεστό", "Γίνεται αέρας"] },
      { question: "Πώς ακούμε τους ήχους;", correct: "Με τα αυτιά μας", icon: "👂", options: ["Με τα αυτιά μας", "Με τα μάτια μας", "Με τη μύτη μας", "Με τα χέρια μας"] }
    ],
    en: [
      { question: "What do plants need to grow?", correct: "Water and sun", icon: "🌱", options: ["Water and sun", "Only water", "Only darkness", "Snow"] },
      { question: "What happens when we put ice in water?", correct: "It melts", icon: "🧊", options: ["It melts", "Gets harder", "Disappears", "Burns"] },
      { question: "What does a magnet do?", correct: "Attracts iron", icon: "🧲", options: ["Attracts iron", "Attracts wood", "Attracts water", "Attracts paper"] },
      { question: "Why do things fall down?", correct: "Gravity", icon: "🍎", options: ["Gravity", "Wind", "Magic", "Water"] },
      { question: "How do birds move in the air?", correct: "They fly", icon: "🐦", options: ["They fly", "They swim", "They run", "They dig"] },
      { question: "What does fire need to burn?", correct: "Air (oxygen)", icon: "🔥", options: ["Air (oxygen)", "Water", "Darkness", "Ice"] },
      { question: "What are clouds made of?", correct: "Water (vapor)", icon: "☁️", options: ["Water (vapor)", "Snow", "Cotton", "Paper"] },
      { question: "What makes things visible?", correct: "Light", icon: "💡", options: ["Light", "Darkness", "Sound", "Smell"] },
      { question: "What happens to water when it freezes?", correct: "Becomes ice", icon: "❄️", options: ["Becomes ice", "Disappears", "Gets hot", "Becomes air"] },
      { question: "How do we hear sounds?", correct: "With our ears", icon: "👂", options: ["With our ears", "With our eyes", "With our nose", "With our hands"] }
    ]
  };

  const questions = scienceData[lang];
  const currentQuestion = questions[currentRound];

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
      emoji: ["🎉", "⭐", "✨", "🔬", "🧪", "🧬", "🏆"][Math.floor(Math.random() * 7)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);
    setTimeout(() => setCelebrationEmojis([]), 2000);
  };

  const handleAnswerSelect = (answer) => {
    if (showAnswer) return;

    setSelectedAnswer(answer);
    setShowAnswer(true);

    const isCorrect = answer === currentQuestion.correct;

    if (isCorrect) {
      correctSoundRef.current?.play().catch(() => {});
      const newScore = score + 1;
      setScore(newScore);

      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      updateProgress({
        title: "Science Game",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      completeQuiz({
        title: "Science Game",
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
            if (onComplete) onComplete();
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
    <div className="relative w-full min-h-screen bg-gradient-to-br from-purple-100 via-indigo-100 to-blue-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Επιστήμη" : "Science"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Πείραμα ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Experiment ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-purple-600">
            🔬 {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-400 to-indigo-500 transition-all duration-500 ease-out"
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
        <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border-4 border-purple-400">
          {/* Question Display */}
          <div className="text-center mb-8">
            <div className="text-9xl mb-6 animate-bounce">{currentQuestion.icon}</div>
            <p className="text-3xl font-bold text-slate-800 mb-4">
              {currentQuestion.question}
            </p>
          </div>

          {/* Answer Options */}
          {!showAnswer && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {currentQuestion.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(option)}
                  className="p-6 rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 hover:from-purple-200 hover:to-indigo-200 border-4 border-purple-300 hover:border-purple-500 transition-all duration-200 transform hover:scale-105 shadow-lg text-xl font-bold text-slate-800"
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {/* Show Answer */}
          {showAnswer && selectedAnswer === currentQuestion.correct && (
            <div className="text-center animate-fadeIn">
              <div className="inline-block bg-green-100 rounded-3xl p-8 border-4 border-green-400">
                <div className="text-8xl mb-4">✅</div>
                <p className="text-3xl font-bold text-green-700">
                  {lang === "el"
                    ? `🎉 Σωστά! ${currentQuestion.correct}`
                    : `🎉 Correct! ${currentQuestion.correct}`}
                </p>
              </div>
            </div>
          )}

          {showAnswer && selectedAnswer !== currentQuestion.correct && (
            <div className="text-center animate-fadeIn">
              <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
                <p className="text-3xl font-bold text-red-700">
                  {lang === "el"
                    ? `Προσπάθησε ξανά! Σκέψου επιστημονικά!`
                    : `Try again! Think scientifically!`}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-300/80 to-indigo-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🔬🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Είσαι μικρός επιστήμονας!" : "Perfect! You're a little scientist!"}
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

