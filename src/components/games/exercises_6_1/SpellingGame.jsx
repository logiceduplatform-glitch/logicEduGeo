// src/components/games/exercises_6_1/SpellingGame.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

export default function SpellingGame({ lang = "el", onComplete }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const TARGET_ROUNDS = 10;

  const wordsData = {
    el: [
      { word: "ΓΑΤΑ", image: "🐱", sound: "γάτα" },
      { word: "ΣΚΥΛΟΣ", image: "🐶", sound: "σκύλος" },
      { word: "ΜΗΛΟ", image: "🍎", sound: "μήλο" },
      { word: "ΨΑΡΙ", image: "🐟", sound: "ψάρι" },
      { word: "ΣΠΙΤΙ", image: "🏠", sound: "σπίτι" },
      { word: "ΗΛΙΟΣ", image: "☀️", sound: "ήλιος" },
      { word: "ΛΟΥΛΟΥΔΙ", image: "🌸", sound: "λουλούδι" },
      { word: "ΜΠΑΛΑ", image: "⚽", sound: "μπάλα" },
      { word: "ΑΥΤΟΚΙΝΗΤΟ", image: "🚗", sound: "αυτοκίνητο" },
      { word: "ΒΙΒΛΙΟ", image: "📚", sound: "βιβλίο" }
    ],
    en: [
      { word: "CAT", image: "🐱", sound: "cat" },
      { word: "DOG", image: "🐶", sound: "dog" },
      { word: "APPLE", image: "🍎", sound: "apple" },
      { word: "FISH", image: "🐟", sound: "fish" },
      { word: "HOUSE", image: "🏠", sound: "house" },
      { word: "SUN", image: "☀️", sound: "sun" },
      { word: "FLOWER", image: "🌸", sound: "flower" },
      { word: "BALL", image: "⚽", sound: "ball" },
      { word: "CAR", image: "🚗", sound: "car" },
      { word: "BOOK", image: "📚", sound: "book" }
    ]
  };

  const words = wordsData[lang];
  const currentWord = words[currentRound];

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    wrongSoundRef.current = new Audio("/sounds/wrong.mp3");
    correctSoundRef.current.preload = "auto";
    wrongSoundRef.current.preload = "auto";
  }, []);

  useEffect(() => {
    setSelectedLetters([]);
    setShowAnswer(false);
  }, [currentRound]);

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "✅", "📝", "🏆"][Math.floor(Math.random() * 7)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const handleLetterClick = (letter, buttonIndex) => {
    if (showAnswer) return;
    if (selectedLetters.length < currentWord.word.length) {
      setSelectedLetters([...selectedLetters, { letter, buttonIndex }]);
    }
  };

  const handleRemoveLetter = (index) => {
    if (showAnswer) return;
    setSelectedLetters(selectedLetters.filter((_, i) => i !== index));
  };

  const handleCheckAnswer = () => {
    if (selectedLetters.length !== currentWord.word.length) return;

    const answer = selectedLetters.map(item => item.letter).join('');
    const isCorrect = answer === currentWord.word;

    setShowAnswer(true);

    if (isCorrect) {
      correctSoundRef.current?.play().catch(() => {});

      const newScore = score + 1;
      setScore(newScore);

      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      updateProgress({
        title: "Spelling Game",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      setTimeout(() => {
        if (currentRound + 1 < TARGET_ROUNDS) {
          setCurrentRound(prev => prev + 1);
        } else {
          createCelebrationEmojis();
          setShowCelebration(true);

          completeQuiz({
            title: "Spelling Game",
            score: newScore,
            total: TARGET_ROUNDS,
          });

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
        setSelectedLetters([]);
        setShowAnswer(false);
      }, 1500);
    }
  };

  // Generate letter options (scrambled word + extra letters)
  const generateLetters = () => {
    const wordLetters = currentWord.word.split('');
    const allLetters = lang === 'el'
      ? 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ'
      : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    const extraLetters = [];
    while (extraLetters.length < 4) {
      const letter = allLetters[Math.floor(Math.random() * allLetters.length)];
      if (!wordLetters.includes(letter) && !extraLetters.includes(letter)) {
        extraLetters.push(letter);
      }
    }

    return [...wordLetters, ...extraLetters].sort(() => Math.random() - 0.5);
  };

  const [letterOptions, setLetterOptions] = useState([]);

  // Regenerate letters when currentRound changes
  useEffect(() => {
    setLetterOptions(generateLetters());
  }, [currentRound, lang]);

  const progressPercent = Math.round(((currentRound + 1) / TARGET_ROUNDS) * 100);
  const isAnswerComplete = selectedLetters.length === currentWord.word.length;

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Ορθογραφία" : "Spelling"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Λέξη ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Word ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-orange-600">
            📝 {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500 ease-out"
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
        <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border-4 border-orange-400">
          {/* Image */}
          <div className="text-center mb-6">
            <div className="text-9xl mb-4 animate-bounce">{currentWord.image}</div>
            <p className="text-3xl font-bold text-slate-800 mb-2">
              {lang === "el" ? "Γράψε τη λέξη:" : "Spell the word:"}
            </p>
            <p className="text-2xl text-slate-600">{currentWord.sound}</p>
          </div>

          {/* Answer Box */}
          <div className="mb-6">
            <div className="flex justify-center gap-2 min-h-20 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border-4 border-orange-300">
              {Array.from({ length: currentWord.word.length }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleRemoveLetter(idx)}
                  className={`w-16 h-16 rounded-xl text-3xl font-bold flex items-center justify-center transition-all ${
                    selectedLetters[idx]
                      ? 'bg-orange-400 text-white shadow-lg transform scale-110'
                      : 'bg-white border-2 border-dashed border-orange-300'
                  }`}
                  disabled={!selectedLetters[idx] || showAnswer}
                >
                  {selectedLetters[idx]?.letter || ''}
                </button>
              ))}
            </div>
          </div>

          {/* Letter Options */}
          {!showAnswer && (
            <div className="grid grid-cols-6 gap-3 mb-6">
              {letterOptions.map((letter, idx) => {
                // Check if this specific button instance (by index) was already used
                const isUsed = selectedLetters.some(item => item.buttonIndex === idx);

                return (
                  <button
                    key={idx}
                    onClick={() => handleLetterClick(letter, idx)}
                    disabled={isUsed}
                    className={`p-4 rounded-xl text-2xl font-bold transition-all ${
                      isUsed
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-gradient-to-br from-orange-100 to-yellow-100 hover:from-orange-200 hover:to-yellow-200 text-slate-800 shadow-md hover:shadow-lg transform hover:scale-110'
                    }`}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>
          )}

          {/* Check Button */}
          {!showAnswer && isAnswerComplete && (
            <div className="text-center">
              <button
                onClick={handleCheckAnswer}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-2xl font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
              >
                {lang === "el" ? "Έλεγχος ✓" : "Check ✓"}
              </button>
            </div>
          )}

          {/* Show Answer */}
          {showAnswer && selectedLetters.map(item => item.letter).join('') === currentWord.word && (
            <div className="text-center animate-fadeIn">
              <div className="inline-block bg-green-100 rounded-3xl p-8 border-4 border-green-400">
                <div className="text-8xl mb-4">✅</div>
                <p className="text-3xl font-bold text-green-700">
                  {lang === "el"
                    ? `🎉 Σωστά! ${currentWord.word}`
                    : `🎉 Correct! ${currentWord.word}`}
                </p>
              </div>
            </div>
          )}

          {showAnswer && selectedLetters.map(item => item.letter).join('') !== currentWord.word && (
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
        <div className="absolute inset-0 bg-gradient-to-br from-orange-300/80 to-pink-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">📝🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Είσαι άσος στην ορθογραφία!" : "Perfect! You're a spelling star!"}
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

