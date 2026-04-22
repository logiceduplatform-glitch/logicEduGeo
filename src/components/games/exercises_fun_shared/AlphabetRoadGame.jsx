// src/components/games/AlphabetRoadGame.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import { VoiceService } from "../../../services/VoiceService";

export default function AlphabetRoadGame({ lang = "el", onComplete, difficulty = 3 }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [carPosition, setCarPosition] = useState(0);
  const [collectedLetters, setCollectedLetters] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const [wrongLetterClicked, setWrongLetterClicked] = useState(null);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();
  const d = Math.max(1, Math.min(5, difficulty));
  const WRONG_DELAY = [2000, 1800, 1500, 1200, 1000][d - 1];
  const NEXT_DELAY = [3000, 2800, 2500, 2200, 2000][d - 1];

  const TARGET_ROUNDS = 8; // 8 δρόμοι

  const roadsData = {
    el: [
      {
        id: 1,
        targetWord: "ΓΑΤΑ",
        color: "#EF4444",
        letters: [
          { id: 1, letter: "Γ", position: 15, isCorrect: true, order: 0 },
          { id: 2, letter: "Β", position: 25, isCorrect: false },
          { id: 3, letter: "Α", position: 35, isCorrect: true, order: 1 },
          { id: 4, letter: "Κ", position: 45, isCorrect: false },
          { id: 5, letter: "Τ", position: 55, isCorrect: true, order: 2 },
          { id: 6, letter: "Π", position: 65, isCorrect: false },
          { id: 7, letter: "Α", position: 75, isCorrect: true, order: 3 },
          { id: 8, letter: "Μ", position: 85, isCorrect: false },
        ]
      },
      {
        id: 2,
        targetWord: "ΣΠΙΤΙ",
        color: "#3B82F6",
        letters: [
          { id: 1, letter: "Σ", position: 12, isCorrect: true, order: 0 },
          { id: 2, letter: "Λ", position: 22, isCorrect: false },
          { id: 3, letter: "Π", position: 32, isCorrect: true, order: 1 },
          { id: 4, letter: "Ρ", position: 42, isCorrect: false },
          { id: 5, letter: "Ι", position: 52, isCorrect: true, order: 2 },
          { id: 6, letter: "Ν", position: 62, isCorrect: false },
          { id: 7, letter: "Τ", position: 72, isCorrect: true, order: 3 },
          { id: 8, letter: "Α", position: 82, isCorrect: false },
          { id: 9, letter: "Ι", position: 88, isCorrect: true, order: 4 },
        ]
      },
      {
        id: 3,
        targetWord: "ΜΗΛΟ",
        color: "#10B981",
        letters: [
          { id: 1, letter: "Μ", position: 15, isCorrect: true, order: 0 },
          { id: 2, letter: "Κ", position: 28, isCorrect: false },
          { id: 3, letter: "Η", position: 41, isCorrect: true, order: 1 },
          { id: 4, letter: "Ρ", position: 54, isCorrect: false },
          { id: 5, letter: "Λ", position: 67, isCorrect: true, order: 2 },
          { id: 6, letter: "Σ", position: 77, isCorrect: false },
          { id: 7, letter: "Ο", position: 87, isCorrect: true, order: 3 },
        ]
      },
      {
        id: 4,
        targetWord: "ΨΑΡΙ",
        color: "#06B6D4",
        letters: [
          { id: 1, letter: "Ψ", position: 12, isCorrect: true, order: 0 },
          { id: 2, letter: "Τ", position: 24, isCorrect: false },
          { id: 3, letter: "Α", position: 36, isCorrect: true, order: 1 },
          { id: 4, letter: "Μ", position: 48, isCorrect: false },
          { id: 5, letter: "Ρ", position: 60, isCorrect: true, order: 2 },
          { id: 6, letter: "Ν", position: 72, isCorrect: false },
          { id: 7, letter: "Ι", position: 84, isCorrect: true, order: 3 },
        ]
      },
      {
        id: 5,
        targetWord: "ΗΛΙΟΣ",
        color: "#EAB308",
        letters: [
          { id: 1, letter: "Η", position: 10, isCorrect: true, order: 0 },
          { id: 2, letter: "Κ", position: 20, isCorrect: false },
          { id: 3, letter: "Λ", position: 30, isCorrect: true, order: 1 },
          { id: 4, letter: "Π", position: 40, isCorrect: false },
          { id: 5, letter: "Ι", position: 50, isCorrect: true, order: 2 },
          { id: 6, letter: "Α", position: 60, isCorrect: false },
          { id: 7, letter: "Ο", position: 70, isCorrect: true, order: 3 },
          { id: 8, letter: "Ρ", position: 80, isCorrect: false },
          { id: 9, letter: "Σ", position: 88, isCorrect: true, order: 4 },
        ]
      },
      {
        id: 6,
        targetWord: "ΔΕΝΤΡΟ",
        color: "#22C55E",
        letters: [
          { id: 1, letter: "Δ", position: 8, isCorrect: true, order: 0 },
          { id: 2, letter: "Β", position: 18, isCorrect: false },
          { id: 3, letter: "Ε", position: 28, isCorrect: true, order: 1 },
          { id: 4, letter: "Μ", position: 38, isCorrect: false },
          { id: 5, letter: "Ν", position: 48, isCorrect: true, order: 2 },
          { id: 6, letter: "Κ", position: 58, isCorrect: false },
          { id: 7, letter: "Τ", position: 68, isCorrect: true, order: 3 },
          { id: 8, letter: "Λ", position: 76, isCorrect: false },
          { id: 9, letter: "Ρ", position: 82, isCorrect: true, order: 4 },
          { id: 10, letter: "Π", position: 88, isCorrect: false },
          { id: 11, letter: "Ο", position: 93, isCorrect: true, order: 5 },
        ]
      },
      {
        id: 7,
        targetWord: "ΒΙΒΛΙΟ",
        color: "#8B5CF6",
        letters: [
          { id: 1, letter: "Β", position: 8, isCorrect: true, order: 0 },
          { id: 2, letter: "Γ", position: 17, isCorrect: false },
          { id: 3, letter: "Ι", position: 26, isCorrect: true, order: 1 },
          { id: 4, letter: "Α", position: 35, isCorrect: false },
          { id: 5, letter: "Β", position: 44, isCorrect: true, order: 2 },
          { id: 6, letter: "Ρ", position: 53, isCorrect: false },
          { id: 7, letter: "Λ", position: 62, isCorrect: true, order: 3 },
          { id: 8, letter: "Ν", position: 71, isCorrect: false },
          { id: 9, letter: "Ι", position: 80, isCorrect: true, order: 4 },
          { id: 10, letter: "Κ", position: 87, isCorrect: false },
          { id: 11, letter: "Ο", position: 93, isCorrect: true, order: 5 },
        ]
      },
      {
        id: 8,
        targetWord: "ΚΑΡΔΙΑ",
        color: "#EC4899",
        letters: [
          { id: 1, letter: "Κ", position: 8, isCorrect: true, order: 0 },
          { id: 2, letter: "Ψ", position: 17, isCorrect: false },
          { id: 3, letter: "Α", position: 26, isCorrect: true, order: 1 },
          { id: 4, letter: "Ε", position: 35, isCorrect: false },
          { id: 5, letter: "Ρ", position: 44, isCorrect: true, order: 2 },
          { id: 6, letter: "Μ", position: 53, isCorrect: false },
          { id: 7, letter: "Δ", position: 62, isCorrect: true, order: 3 },
          { id: 8, letter: "Τ", position: 71, isCorrect: false },
          { id: 9, letter: "Ι", position: 80, isCorrect: true, order: 4 },
          { id: 10, letter: "Ο", position: 87, isCorrect: false },
          { id: 11, letter: "Α", position: 93, isCorrect: true, order: 5 },
        ]
      }
    ],
    en: [
      {
        id: 1,
        targetWord: "CAT",
        color: "#EF4444",
        letters: [
          { id: 1, letter: "C", position: 20, isCorrect: true, order: 0 },
          { id: 2, letter: "B", position: 35, isCorrect: false },
          { id: 3, letter: "A", position: 50, isCorrect: true, order: 1 },
          { id: 4, letter: "D", position: 65, isCorrect: false },
          { id: 5, letter: "T", position: 80, isCorrect: true, order: 2 },
        ]
      },
      {
        id: 2,
        targetWord: "DOG",
        color: "#3B82F6",
        letters: [
          { id: 1, letter: "D", position: 20, isCorrect: true, order: 0 },
          { id: 2, letter: "F", position: 35, isCorrect: false },
          { id: 3, letter: "O", position: 50, isCorrect: true, order: 1 },
          { id: 4, letter: "P", position: 65, isCorrect: false },
          { id: 5, letter: "G", position: 80, isCorrect: true, order: 2 },
        ]
      },
      {
        id: 3,
        targetWord: "SUN",
        color: "#EAB308",
        letters: [
          { id: 1, letter: "S", position: 20, isCorrect: true, order: 0 },
          { id: 2, letter: "R", position: 35, isCorrect: false },
          { id: 3, letter: "U", position: 50, isCorrect: true, order: 1 },
          { id: 4, letter: "T", position: 65, isCorrect: false },
          { id: 5, letter: "N", position: 80, isCorrect: true, order: 2 },
        ]
      },
      {
        id: 4,
        targetWord: "FISH",
        color: "#06B6D4",
        letters: [
          { id: 1, letter: "F", position: 15, isCorrect: true, order: 0 },
          { id: 2, letter: "G", position: 30, isCorrect: false },
          { id: 3, letter: "I", position: 45, isCorrect: true, order: 1 },
          { id: 4, letter: "J", position: 60, isCorrect: false },
          { id: 5, letter: "S", position: 75, isCorrect: true, order: 2 },
          { id: 6, letter: "K", position: 88, isCorrect: false },
          { id: 7, letter: "H", position: 93, isCorrect: true, order: 3 },
        ]
      },
      {
        id: 5,
        targetWord: "TREE",
        color: "#22C55E",
        letters: [
          { id: 1, letter: "T", position: 15, isCorrect: true, order: 0 },
          { id: 2, letter: "S", position: 30, isCorrect: false },
          { id: 3, letter: "R", position: 45, isCorrect: true, order: 1 },
          { id: 4, letter: "P", position: 60, isCorrect: false },
          { id: 5, letter: "E", position: 75, isCorrect: true, order: 2 },
          { id: 6, letter: "D", position: 88, isCorrect: false },
          { id: 7, letter: "E", position: 93, isCorrect: true, order: 3 },
        ]
      },
      {
        id: 6,
        targetWord: "BOOK",
        color: "#8B5CF6",
        letters: [
          { id: 1, letter: "B", position: 15, isCorrect: true, order: 0 },
          { id: 2, letter: "C", position: 30, isCorrect: false },
          { id: 3, letter: "O", position: 45, isCorrect: true, order: 1 },
          { id: 4, letter: "P", position: 60, isCorrect: false },
          { id: 5, letter: "O", position: 75, isCorrect: true, order: 2 },
          { id: 6, letter: "M", position: 88, isCorrect: false },
          { id: 7, letter: "K", position: 93, isCorrect: true, order: 3 },
        ]
      },
      {
        id: 7,
        targetWord: "STAR",
        color: "#A855F7",
        letters: [
          { id: 1, letter: "S", position: 15, isCorrect: true, order: 0 },
          { id: 2, letter: "R", position: 30, isCorrect: false },
          { id: 3, letter: "T", position: 45, isCorrect: true, order: 1 },
          { id: 4, letter: "P", position: 60, isCorrect: false },
          { id: 5, letter: "A", position: 75, isCorrect: true, order: 2 },
          { id: 6, letter: "B", position: 88, isCorrect: false },
          { id: 7, letter: "R", position: 93, isCorrect: true, order: 3 },
        ]
      },
      {
        id: 8,
        targetWord: "MOON",
        color: "#EC4899",
        letters: [
          { id: 1, letter: "M", position: 15, isCorrect: true, order: 0 },
          { id: 2, letter: "N", position: 30, isCorrect: false },
          { id: 3, letter: "O", position: 45, isCorrect: true, order: 1 },
          { id: 4, letter: "P", position: 60, isCorrect: false },
          { id: 5, letter: "O", position: 75, isCorrect: true, order: 2 },
          { id: 6, letter: "L", position: 88, isCorrect: false },
          { id: 7, letter: "N", position: 93, isCorrect: true, order: 3 },
        ]
      }
    ]
  };

  const roads = roadsData[lang];
  const round = roads[currentRound];

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
      emoji: ["🎉", "⭐", "✨", "🌟", "🚗", "✅"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const speakWord = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const text = lang === 'el'
        ? `Φτιάξε τη λέξη: ${round.targetWord}`
        : `Build the word: ${round.targetWord}`;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'el' ? 'el-GR' : 'en-US';
      utterance.rate = 0.7;
      utterance.pitch = 1.1;
      const voice = VoiceService.getVoice(lang);
      if (voice) utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    // Speak word automatically when round changes
    const timer = setTimeout(() => {
      speakWord();
    }, 500);
    return () => clearTimeout(timer);
  }, [currentRound]);

  const handleLetterClick = (letter) => {
    if (showAnswer) return;

    const expectedLetter = round.targetWord[collectedLetters.length];

    if (letter.letter === expectedLetter && letter.isCorrect) {
      // Correct letter!
      correctSoundRef.current?.play().catch(() => {});

      const newCollectedLetters = [...collectedLetters, letter.id];
      setCollectedLetters(newCollectedLetters);

      // Move car to letter position
      setCarPosition(letter.position);

      setScorePopup({ id: Date.now(), x: letter.position });
      setTimeout(() => setScorePopup(null), 1000);

      // Check if word is complete
      if (newCollectedLetters.length === round.targetWord.length) {
        setShowAnswer(true);

        const newScore = score + 1;
        setScore(newScore);

        updateProgress({
          title: "Alphabet Road Game",
          score: newScore,
          total: TARGET_ROUNDS,
          index: currentRound + 1,
        });

        completeQuiz({
          title: "Alphabet Road Game",
          score: 1,
          total: 1,
        });

        setTimeout(() => {
          if (currentRound + 1 < TARGET_ROUNDS) {
            setCurrentRound(prev => prev + 1);
            setCollectedLetters([]);
            setCarPosition(0);
            setShowAnswer(false);
          } else {
            createCelebrationEmojis();
            setShowCelebration(true);
            setTimeout(() => {
              if (onComplete) {
                onComplete({ score: newScore, total: TARGET_ROUNDS });
              }
            }, NEXT_DELAY);
          }
        }, NEXT_DELAY);
      }
    } else {
      // Wrong letter!
      wrongSoundRef.current?.play().catch(() => {});
      setWrongLetterClicked(letter.id);

      setTimeout(() => {
        setWrongLetterClicked(null);
      }, 800);
    }
  };

  const progressPercent = Math.round(((currentRound + 1) / TARGET_ROUNDS) * 100);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-sky-100 via-blue-100 to-indigo-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
            top: "35%",
            animation: "float-up 1s ease-out forwards",
          }}
        >
          ✅
        </div>
      )}

      <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">
              {lang === "el" ? "Αλφαβητόδρομος" : "Alphabet Road"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Λέξη ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Word ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-blue-600">
            🚗 {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-600">
            {progressPercent}%
          </span>
        </div>
      </div>

      <div className="text-center mb-6">
        <div className="inline-block bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl border-4" style={{ borderColor: round.color }}>
          <h2 className="text-2xl font-bold mb-2 text-slate-800">
            {lang === "el" ? "Φτιάξε τη λέξη:" : "Build the word:"}
          </h2>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl mb-3">
            <p className="text-5xl font-bold tracking-wider" style={{ color: round.color }}>
              {round.targetWord}
            </p>
          </div>

          {/* Collected letters display */}
          <div className="flex justify-center gap-2 mb-3">
            {round.targetWord.split('').map((letter, index) => (
              <div
                key={index}
                className={`w-12 h-12 flex items-center justify-center text-2xl font-bold rounded-lg border-2 transition-all ${
                  collectedLetters.length > index
                    ? 'bg-green-100 border-green-500 text-green-700'
                    : 'bg-slate-100 border-slate-300 text-slate-400'
                }`}
              >
                {collectedLetters.length > index ? letter : '?'}
              </div>
            ))}
          </div>

          <button
            onClick={speakWord}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-lg font-bold rounded-full hover:scale-105 transition-transform shadow-lg"
          >
            🔊 {lang === "el" ? "Άκουσε" : "Listen"}
          </button>
        </div>
      </div>

      <p className="text-xl text-center text-slate-700 font-semibold mb-4">
        {lang === "el" ? "Οδήγησε το αυτοκίνητο στα σωστά γράμματα! 🚗" : "Drive the car to the correct letters! 🚗"}
      </p>

      {/* Road with letters */}
      <div className="max-w-6xl mx-auto mb-8 relative">
        <div className="relative h-40 bg-gradient-to-r from-slate-600 to-slate-700 rounded-2xl border-4 border-slate-800 overflow-hidden shadow-2xl">
          {/* Road lines */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-yellow-300 opacity-70" style={{ transform: 'translateY(-50%)' }}></div>
          <div className="absolute top-1/2 left-0 right-0 flex justify-around" style={{ transform: 'translateY(-50%)' }}>
            {[...Array(10)].map((_, i) => (
              <div key={i} className="w-12 h-1 bg-yellow-400"></div>
            ))}
          </div>

          {/* Car */}
          <div
            className="absolute top-1/2 text-6xl transition-all duration-500 ease-out z-10"
            style={{
              left: `${carPosition}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            🚗
          </div>

          {/* Letters on road */}
          {round.letters.map((letter) => {
            const isCollected = collectedLetters.includes(letter.id);
            const isWrong = wrongLetterClicked === letter.id;

            return (
              <button
                key={letter.id}
                onClick={() => handleLetterClick(letter)}
                disabled={isCollected || showAnswer}
                className={`
                  absolute top-1/2 transform -translate-y-1/2
                  text-4xl font-bold px-4 py-2 rounded-xl border-4 transition-all duration-300
                  ${isCollected ? 'bg-green-200 border-green-500 scale-75 opacity-50' : ''}
                  ${isWrong ? 'bg-red-200 border-red-500 animate-shake' : ''}
                  ${!isCollected && !isWrong ? 'bg-white border-slate-400 hover:scale-110 cursor-pointer shadow-lg' : ''}
                  ${isCollected || showAnswer ? 'cursor-not-allowed' : ''}
                `}
                style={{
                  left: `${letter.position}%`,
                  zIndex: isCollected ? 1 : 5,
                }}
              >
                {letter.letter}
              </button>
            );
          })}
        </div>
      </div>

      {showAnswer && (
        <div className="text-center animate-fadeIn">
          <div className="bg-green-100 rounded-2xl p-6 inline-block border-4 border-green-400">
            <p className="text-3xl font-bold text-green-700">
              {lang === "el"
                ? `🎉 Μπράβο! Έφτιαξες τη λέξη "${round.targetWord}"!`
                : `🎉 Great! You built the word "${round.targetWord}"!`}
            </p>
          </div>
        </div>
      )}

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-300/80 to-indigo-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🚗🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Ολοκλήρωσες όλους τους δρόμους!" : "Perfect! You completed all the roads!"}
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
          0%, 100% { transform: translateX(0) translateY(-50%); }
          25% { transform: translateX(-10px) translateY(-50%); }
          75% { transform: translateX(10px) translateY(-50%); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
}

