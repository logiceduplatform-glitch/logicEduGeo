// src/components/games/exercises_7_8/LetterSound.jsx - Upgraded for age 8: Word Reading & Phonics
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

export default function LetterSound({ lang = "el", onComplete }) {
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
        question: "Διάβασε τη λέξη: ΓΑ-ΤΑ. Ποιο ζώο είναι;",
        options: [
          { id: "a", text: "Γάτα", emoji: "🐱", correct: true },
          { id: "b", text: "Πάτα", emoji: "🦆", correct: false },
          { id: "c", text: "Ράτα", emoji: "🐀", correct: false },
        ]
      },
      {
        id: 2,
        question: "Ποια λέξη αρχίζει από τα ίδια γράμματα με ΜΗΛΟ;",
        options: [
          { id: "a", text: "ΜΕΛΙ", emoji: "🍯", correct: true },
          { id: "b", text: "ΠΗΛΟΣ", emoji: "🪨", correct: false },
          { id: "c", text: "ΗΛΙΟΣ", emoji: "☀️", correct: false },
        ]
      },
      {
        id: 3,
        question: "Πόσες συλλαβές έχει: ΠΕ-ΤΑ-ΛΟΥ-ΔΑ;",
        options: [
          { id: "a", text: "2 συλλαβές", emoji: "2️⃣", correct: false },
          { id: "b", text: "3 συλλαβές", emoji: "3️⃣", correct: false },
          { id: "c", text: "4 συλλαβές", emoji: "4️⃣", correct: true },
        ]
      },
      {
        id: 4,
        question: "Ποια λέξη τελειώνει στο -ΟΣ;",
        options: [
          { id: "a", text: "ΟΥΡΑΝΟΣ", emoji: "☁️", correct: true },
          { id: "b", text: "ΘΑΛΑΣΣΑ", emoji: "🌊", correct: false },
          { id: "c", text: "ΔΕΝΤΡΟ", emoji: "🌳", correct: false },
        ]
      },
      {
        id: 5,
        question: "Ποιες λέξεις κάνουν ρίμα;",
        options: [
          { id: "a", text: "ΓΑΤΑ - ΠΑΤΑ", emoji: "🎵", correct: true },
          { id: "b", text: "ΣΠΙΤΙ - ΑΥΤΟ", emoji: "🏠", correct: false },
          { id: "c", text: "ΨΩΜΙ - ΝΕΡΟ", emoji: "🍞", correct: false },
        ]
      },
      {
        id: 6,
        question: "Διάβασε: ΤΟ ΣΚΥΛΙ ΤΡΩΕΙ. Ποιος τρώει;",
        options: [
          { id: "a", text: "Το σκυλί", emoji: "🐕", correct: true },
          { id: "b", text: "Η γάτα", emoji: "🐱", correct: false },
          { id: "c", text: "Το πουλί", emoji: "🐦", correct: false },
        ]
      },
      {
        id: 7,
        question: "Αν αλλάξω το Α σε Ο: ΜΑΛΙ → ΜΟΛΙ. Ποια είναι η νέα λέξη;",
        options: [
          { id: "a", text: "ΜΟΛΙ", emoji: "✏️", correct: true },
          { id: "b", text: "ΜΑΛΙ", emoji: "🍯", correct: false },
          { id: "c", text: "ΜΙΛΙ", emoji: "🔤", correct: false },
        ]
      },
      {
        id: 8,
        question: "Ποια λέξη είναι μεγαλύτερη (έχει περισσότερα γράμματα);",
        options: [
          { id: "a", text: "ΕΛΕΦΑΝΤΑΣ", emoji: "🐘", correct: true },
          { id: "b", text: "ΣΚΥΛΟΣ", emoji: "🐕", correct: false },
          { id: "c", text: "ΓΑΤΑ", emoji: "🐱", correct: false },
        ]
      },
      {
        id: 9,
        question: "Διάβασε την πρόταση: Η ΜΑΜΑ ΨΗΝΕΙ ΚΕΙΚ. Τι κάνει η μαμά;",
        options: [
          { id: "a", text: "Ψήνει κέικ", emoji: "🍰", correct: true },
          { id: "b", text: "Τρώει κέικ", emoji: "🍽️", correct: false },
          { id: "c", text: "Αγοράζει κέικ", emoji: "🛒", correct: false },
        ]
      },
      {
        id: 10,
        question: "Ποιο γράμμα λείπει; ΣΚ_ΛΟΣ",
        options: [
          { id: "a", text: "Υ", emoji: "🐕", correct: true },
          { id: "b", text: "Ι", emoji: "❌", correct: false },
          { id: "c", text: "Ο", emoji: "❌", correct: false },
        ]
      },
    ],
    en: [
      {
        id: 1,
        question: "Read the word: C-A-T. What animal is it?",
        options: [
          { id: "a", text: "Cat", emoji: "🐱", correct: true },
          { id: "b", text: "Bat", emoji: "🦇", correct: false },
          { id: "c", text: "Rat", emoji: "🐀", correct: false },
        ]
      },
      {
        id: 2,
        question: "Which word starts with the same letters as APPLE?",
        options: [
          { id: "a", text: "APRON", emoji: "👗", correct: true },
          { id: "b", text: "ORANGE", emoji: "🍊", correct: false },
          { id: "c", text: "LEMON", emoji: "🍋", correct: false },
        ]
      },
      {
        id: 3,
        question: "How many syllables: BUT-TER-FLY?",
        options: [
          { id: "a", text: "2 syllables", emoji: "2️⃣", correct: false },
          { id: "b", text: "3 syllables", emoji: "3️⃣", correct: true },
          { id: "c", text: "4 syllables", emoji: "4️⃣", correct: false },
        ]
      },
      {
        id: 4,
        question: "Which word ends with -ING?",
        options: [
          { id: "a", text: "RUNNING", emoji: "🏃", correct: true },
          { id: "b", text: "JUMPED", emoji: "🦘", correct: false },
          { id: "c", text: "WALKS", emoji: "🚶", correct: false },
        ]
      },
      {
        id: 5,
        question: "Which words rhyme?",
        options: [
          { id: "a", text: "CAT - HAT", emoji: "🎵", correct: true },
          { id: "b", text: "DOG - CAR", emoji: "🐕", correct: false },
          { id: "c", text: "SUN - BED", emoji: "☀️", correct: false },
        ]
      },
      {
        id: 6,
        question: "Read: THE DOG RUNS. Who runs?",
        options: [
          { id: "a", text: "The dog", emoji: "🐕", correct: true },
          { id: "b", text: "The cat", emoji: "🐱", correct: false },
          { id: "c", text: "The bird", emoji: "🐦", correct: false },
        ]
      },
      {
        id: 7,
        question: "If I change A to O: HAT → HOT. What is the new word?",
        options: [
          { id: "a", text: "HOT", emoji: "🔥", correct: true },
          { id: "b", text: "HAT", emoji: "🎩", correct: false },
          { id: "c", text: "HIT", emoji: "⚾", correct: false },
        ]
      },
      {
        id: 8,
        question: "Which word is longer (has more letters)?",
        options: [
          { id: "a", text: "ELEPHANT", emoji: "🐘", correct: true },
          { id: "b", text: "HORSE", emoji: "🐴", correct: false },
          { id: "c", text: "DOG", emoji: "🐕", correct: false },
        ]
      },
      {
        id: 9,
        question: "Read the sentence: MOM BAKES A CAKE. What does mom do?",
        options: [
          { id: "a", text: "Bakes a cake", emoji: "🍰", correct: true },
          { id: "b", text: "Eats a cake", emoji: "🍽️", correct: false },
          { id: "c", text: "Buys a cake", emoji: "🛒", correct: false },
        ]
      },
      {
        id: 10,
        question: "What letter is missing? B_RD",
        options: [
          { id: "a", text: "I", emoji: "🐦", correct: true },
          { id: "b", text: "O", emoji: "❌", correct: false },
          { id: "c", text: "A", emoji: "❌", correct: false },
        ]
      },
    ]
  };

  const questions = questionsData[lang];
  const currentQ = questions[currentQuestion];

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
      emoji: ["🎉", "⭐", "✨", "🌟", "📚", "🔤", "📖", "✏️"][Math.floor(Math.random() * 8)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);
    setTimeout(() => setCelebrationEmojis([]), 2000);
  };

  const showScorePopup = (points) => {
    setScorePopup({ points, id: Date.now() });
    setTimeout(() => setScorePopup(null), 1500);
  };

  const handleAnswer = (option) => {
    if (feedback || selectedAnswer) return;

    setSelectedAnswer(option.id);

    if (option.correct) {
      correctSoundRef.current?.play().catch(() => {});
      setFeedback("correct");
      const newScore = score + 1;
      setScore(newScore);
      showScorePopup(1);
      createCelebrationEmojis();
      updateProgress({ title: "Letter Sound", score: newScore, total: TARGET_QUESTIONS, index: currentQuestion + 1 });

      setTimeout(() => {
        if (currentQuestion + 1 < TARGET_QUESTIONS) {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedAnswer(null);
          setFeedback(null);
        } else {
          setShowCelebration(true);
          setTimeout(() => {
            completeQuiz({
              title: lang === "el" ? "Ανάγνωση & Φωνητική" : "Reading & Phonics",
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-6 relative overflow-hidden">
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
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
              <span className="text-4xl">📖</span>
              {lang === "el" ? "Ανάγνωση & Φωνητική" : "Reading & Phonics"}
            </h2>
            <div className="text-2xl font-bold text-purple-600">
              {currentQuestion + 1} / {TARGET_QUESTIONS}
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl p-4 mb-4">
            <div className="text-sm text-purple-700 font-semibold mb-1">
              {lang === "el" ? "Πρόοδος" : "Progress"}
            </div>
            <div className="h-3 bg-white/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500 rounded-full"
                style={{ width: `${((currentQuestion + 1) / TARGET_QUESTIONS) * 100}%` }}
              />
            </div>
            <div className="text-right text-purple-700 font-bold mt-1">
              {score} / {TARGET_QUESTIONS}
            </div>
          </div>
        </div>

        {!showCelebration ? (
          <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-10">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {currentQ?.question}
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {currentQ?.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleAnswer(option)}
                  disabled={feedback || selectedAnswer}
                  className={`p-6 rounded-2xl text-xl font-bold transition-all transform hover:scale-105 flex items-center justify-center gap-4 ${
                    selectedAnswer === option.id
                      ? feedback === "correct"
                        ? "bg-green-500 text-white scale-105 shadow-2xl"
                        : "bg-red-500 text-white"
                      : "bg-gradient-to-r from-purple-400 to-indigo-400 text-white hover:shadow-xl"
                  }`}
                >
                  <span className="text-4xl">{option.emoji}</span>
                  <span>{option.text}</span>
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
              {lang === "el" ? "Τα πήγες υπέροχα!" : "You did amazing!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
