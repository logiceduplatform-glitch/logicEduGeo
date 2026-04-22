// src/components/games/exercises_7_8/NumberRecognition.jsx - Upgraded for age 8: Numbers to 100, place value
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
export default function NumberRecognition({ lang = "el", onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();
  const TARGET_QUESTIONS = 10;
  const questionsData = {
    el: [
      {
        id: 1,
        type: "recognize",
        question: "Ποιος είναι αυτός ο αριθμός;",
        number: 45,
        options: ["35", "45", "54"]
      },
      {
        id: 2,
        type: "placeValue",
        question: "Πόσες δεκάδες έχει το 73;",
        number: 73,
        options: ["3", "7", "10"]
      },
      {
        id: 3,
        type: "recognize",
        question: "Ποιος είναι αυτός ο αριθμός;",
        number: 89,
        options: ["89", "98", "79"]
      },
      {
        id: 4,
        type: "placeValue",
        question: "Πόσες μονάδες έχει το 56;",
        number: 56,
        options: ["5", "6", "11"]
      },
      {
        id: 5,
        type: "compare",
        question: "Ποιος αριθμός είναι μεγαλύτερος;",
        numbers: [67, 76],
        options: ["67", "76", "Ίδιοι"]
      },
      {
        id: 6,
        type: "sequence",
        question: "Ποιος αριθμός έρχεται μετά το 49;",
        number: 49,
        options: ["48", "50", "51"]
      },
      {
        id: 7,
        type: "placeValue",
        question: "Το 82 έχει πόσες δεκάδες;",
        number: 82,
        options: ["2", "8", "10"]
      },
      {
        id: 8,
        type: "compare",
        question: "Ποιος αριθμός είναι μικρότερος;",
        numbers: [34, 43],
        options: ["34", "43", "Ίδιοι"]
      },
      {
        id: 9,
        type: "recognize",
        question: "Ποιος είναι αυτός ο αριθμός;",
        number: 100,
        options: ["10", "100", "1000"]
      },
      {
        id: 10,
        type: "sequence",
        question: "Ποιος αριθμός έρχεται πριν το 80;",
        number: 80,
        options: ["79", "81", "78"]
      }
    ],
    en: [
      {
        id: 1,
        type: "recognize",
        question: "What is this number?",
        number: 45,
        options: ["35", "45", "54"]
      },
      {
        id: 2,
        type: "placeValue",
        question: "How many tens in 73?",
        number: 73,
        options: ["3", "7", "10"]
      },
      {
        id: 3,
        type: "recognize",
        question: "What is this number?",
        number: 89,
        options: ["89", "98", "79"]
      },
      {
        id: 4,
        type: "placeValue",
        question: "How many ones in 56?",
        number: 56,
        options: ["5", "6", "11"]
      },
      {
        id: 5,
        type: "compare",
        question: "Which number is greater?",
        numbers: [67, 76],
        options: ["67", "76", "Same"]
      },
      {
        id: 6,
        type: "sequence",
        question: "What number comes after 49?",
        number: 49,
        options: ["48", "50", "51"]
      },
      {
        id: 7,
        type: "placeValue",
        question: "How many tens in 82?",
        number: 82,
        options: ["2", "8", "10"]
      },
      {
        id: 8,
        type: "compare",
        question: "Which number is smaller?",
        numbers: [34, 43],
        options: ["34", "43", "Same"]
      },
      {
        id: 9,
        type: "recognize",
        question: "What is this number?",
        number: 100,
        options: ["10", "100", "1000"]
      },
      {
        id: 10,
        type: "sequence",
        question: "What number comes before 80?",
        number: 80,
        options: ["79", "81", "78"]
      }
    ]
  };
  const questions = questionsData[lang];
  const currentQ = questions[currentQuestion];
  const correctAnswer = currentQ.type === "compare" 
    ? (currentQ.numbers[0] > currentQ.numbers[1] ? currentQ.options[1] : currentQ.options[0])
    : currentQ.options[currentQ.type === "placeValue" ? (currentQ.question.includes("δεκάδες") || currentQ.question.includes("tens") ? 1 : 1) : 1];
  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    wrongSoundRef.current = new Audio("/sounds/wrong.mp3");
    correctSoundRef.current.preload = "auto";
    wrongSoundRef.current.preload = "auto";
  }, []);
  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "🔢", "💯", "🎯", "🧮"][Math.floor(Math.random() * 8)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);
    setTimeout(() => setCelebrationEmojis([]), 2000);
  };
  const showScorePopup = (points) => {
    setScorePopup({ points, id: Date.now() });
    setTimeout(() => setScorePopup(null), 1500);
  };
  const getCorrectAnswer = (q) => {
    if (q.type === "placeValue") {
      if (q.question.includes("δεκάδες") || q.question.includes("tens")) {
        return String(Math.floor(q.number / 10));
      } else {
        return String(q.number % 10);
      }
    } else if (q.type === "compare") {
      if (q.question.includes("μεγαλύτερος") || q.question.includes("greater")) {
        return String(Math.max(...q.numbers));
      } else {
        return String(Math.min(...q.numbers));
      }
    } else if (q.type === "sequence") {
      if (q.question.includes("μετά") || q.question.includes("after")) {
        return String(q.number + 1);
      } else {
        return String(q.number - 1);
      }
    } else {
      return String(q.number);
    }
  };
  const handleAnswer = (answer) => {
    if (feedback || selectedAnswer) return;
    setSelectedAnswer(answer);
    const correct = getCorrectAnswer(currentQ);
    if (answer === correct) {
      correctSoundRef.current?.play().catch(() => {});
      setFeedback("correct");
      const newScore = score + 1;
      setScore(newScore);
      showScorePopup(1);
      createCelebrationEmojis();
      updateProgress({ title: "Number Recognition", score: newScore, total: TARGET_QUESTIONS, index: currentQuestion + 1 });
      setTimeout(() => {
        if (currentQuestion + 1 < TARGET_QUESTIONS) {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedAnswer(null);
          setFeedback(null);
        } else {
          setShowCelebration(true);
          setTimeout(() => {
            completeQuiz({
              title: lang === "el" ? "Αναγνώριση Αριθμών" : "Number Recognition",
              score: newScore,
              total: TARGET_QUESTIONS,
            });
            onComplete?.();
          }, 2000);
        }
      }, 1500);
    } else {
      wrongSoundRef.current?.play().catch(() => {});
      setFeedback("wrong");
      setTimeout(() => {
        setSelectedAnswer(null);
        setFeedback(null);
      }, 1500);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-cyan-50 to-teal-100 p-6 relative overflow-hidden">
      {celebrationEmojis.map((emoji) => (
        <div
          key={emoji.id}
          className="absolute text-4xl animate-bounce pointer-events-none z-10"
          style={{
            left: `${emoji.x}%`,
            top: "10%",
            animationDelay: `${emoji.delay}s`,
            animationDuration: "1s",
          }}
        >
          {emoji.emoji}
        </div>
      ))}
      {scorePopup && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 animate-bounce">
          <div className="bg-yellow-400 text-white px-8 py-4 rounded-full text-4xl font-bold shadow-2xl border-4 border-yellow-500 flex items-center gap-2">
            <span>⭐</span>
            <span>+{scorePopup.points}</span>
            <span>⭐</span>
          </div>
        </div>
      )}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/90 backdrop-blur rounded-3xl shadow-2xl p-8 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent flex items-center gap-3">
              <span className="text-4xl">🔢</span>
              {lang === "el" ? "Αριθμοί έως 100" : "Numbers to 100"}
            </h2>
            <div className="text-2xl font-bold text-teal-600">
              {currentQuestion + 1} / {TARGET_QUESTIONS}
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-100 to-teal-100 rounded-xl p-4 mb-4">
            <div className="text-sm text-blue-700 font-semibold mb-1">
              {lang === "el" ? "Πρόοδος" : "Progress"}
            </div>
            <div className="h-3 bg-white/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-teal-500 transition-all duration-500 rounded-full"
                style={{ width: `${((currentQuestion + 1) / TARGET_QUESTIONS) * 100}%` }}
              />
            </div>
            <div className="text-right text-blue-700 font-bold mt-1">
              {score} / {TARGET_QUESTIONS}
            </div>
          </div>
        </div>
        {!showCelebration ? (
          <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-10">
            <div className="text-center mb-8">
              <div className="text-9xl mb-4 font-bold text-blue-600">
                {currentQ.type === "compare" ? `${currentQ.numbers[0]} 🆚 ${currentQ.numbers[1]}` : currentQ.number}
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-4">
                {currentQ.question}
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              {currentQ.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  disabled={feedback || selectedAnswer}
                  className={`p-8 rounded-2xl text-5xl font-bold transition-all transform hover:scale-105 ${
                    selectedAnswer === option
                      ? feedback === "correct"
                        ? "bg-green-500 text-white scale-105 shadow-2xl"
                        : "bg-red-500 text-white"
                      : "bg-gradient-to-br from-blue-400 to-teal-400 text-white hover:shadow-xl"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-3xl shadow-2xl p-12 text-center text-white animate-bounce">
            <div className="text-8xl mb-6">🎉</div>
            <h2 className="text-5xl font-bold mb-4">
              {lang === "el" ? "Συγχαρητήρια!" : "Congratulations!"}
            </h2>
            <p className="text-3xl mb-4">
              {lang === "el" ? `Βαθμολογία: ${score}/${TARGET_QUESTIONS}` : `Score: ${score}/${TARGET_QUESTIONS}`}
            </p>
            <p className="text-2xl">
              {lang === "el" ? "Είσαι άσος στους αριθμούς!" : "You're a number expert!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
