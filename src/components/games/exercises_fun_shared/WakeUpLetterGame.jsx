// src/components/games/WakeUpLetterGame.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import { VoiceService } from "../../../services/VoiceService";

export default function WakeUpLetterGame({ lang = "el", onComplete, difficulty = 3 }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [isAwake, setIsAwake] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const correctSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();
  const d = Math.max(1, Math.min(5, difficulty));
  const WRONG_DELAY = [2000, 1800, 1500, 1200, 1000][d - 1];
  const NEXT_DELAY = [3000, 2800, 2500, 2200, 2000][d - 1];

  const TARGET_ROUNDS = 10; // 10 γράμματα

  const lettersData = {
    el: [
      { id: 1, letter: "Α", sound: "α", word: "Αυτοκίνητο", emoji: "🚗", color: "#EF4444" },
      { id: 2, letter: "Μ", sound: "μ", word: "Μήλο", emoji: "🍎", color: "#F59E0B" },
      { id: 3, letter: "Π", sound: "π", word: "Πιάτο", emoji: "🍽️", color: "#10B981" },
      { id: 4, letter: "Σ", sound: "σ", word: "Σπίτι", emoji: "🏠", color: "#3B82F6" },
      { id: 5, letter: "Τ", sound: "τ", word: "Τρένο", emoji: "🚂", color: "#8B5CF6" },
      { id: 6, letter: "Κ", sound: "κ", word: "Καρδιά", emoji: "❤️", color: "#EC4899" },
      { id: 7, letter: "Ρ", sound: "ρ", word: "Ρολόι", emoji: "⏰", color: "#06B6D4" },
      { id: 8, letter: "Λ", sound: "λ", word: "Λουλούδι", emoji: "🌸", color: "#A855F7" },
      { id: 9, letter: "Ν", sound: "ν", word: "Νερό", emoji: "💧", color: "#14B8A6" },
      { id: 10, letter: "Γ", sound: "γ", word: "Γάτα", emoji: "🐱", color: "#F97316" },
    ],
    en: [
      { id: 1, letter: "A", sound: "a", word: "Apple", emoji: "🍎", color: "#EF4444" },
      { id: 2, letter: "B", sound: "b", word: "Ball", emoji: "⚽", color: "#F59E0B" },
      { id: 3, letter: "C", sound: "c", word: "Cat", emoji: "🐱", color: "#10B981" },
      { id: 4, letter: "D", sound: "d", word: "Dog", emoji: "🐶", color: "#3B82F6" },
      { id: 5, letter: "E", sound: "e", word: "Elephant", emoji: "🐘", color: "#8B5CF6" },
      { id: 6, letter: "F", sound: "f", word: "Fish", emoji: "🐟", color: "#EC4899" },
      { id: 7, letter: "S", sound: "s", word: "Sun", emoji: "☀️", color: "#06B6D4" },
      { id: 8, letter: "T", sound: "t", word: "Tree", emoji: "🌳", color: "#A855F7" },
      { id: 9, letter: "M", sound: "m", word: "Moon", emoji: "🌙", color: "#14B8A6" },
      { id: 10, letter: "H", sound: "h", word: "House", emoji: "🏠", color: "#F97316" },
    ]
  };

  const letters = lettersData[lang];
  const round = letters[currentRound];

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    correctSoundRef.current.preload = "auto";
  }, []);

  useEffect(() => {
    // Reset awake state when round changes
    setIsAwake(false);
    setShowAnswer(false);
  }, [currentRound]);

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "🔤", "✅"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const speakLetterSound = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      // Say the letter name first
      const letterUtterance = new SpeechSynthesisUtterance(round.letter);
      letterUtterance.lang = lang === 'el' ? 'el-GR' : 'en-US';
      letterUtterance.rate = 0.6;
      letterUtterance.pitch = 1.2;

      const voiceLetter = VoiceService.getVoice(lang);
      if (voiceLetter) letterUtterance.voice = voiceLetter;
      letterUtterance.onend = () => {
        setTimeout(() => {
          // Then say the sound
          const soundUtterance = new SpeechSynthesisUtterance(round.sound);
          soundUtterance.lang = lang === 'el' ? 'el-GR' : 'en-US';
          soundUtterance.rate = 0.5;
          soundUtterance.pitch = 1.3;

          soundUtterance.onend = () => {
            setTimeout(() => {
              // Finally say the word
              const wordUtterance = new SpeechSynthesisUtterance(round.word);
              wordUtterance.lang = lang === 'el' ? 'el-GR' : 'en-US';
              wordUtterance.rate = 0.7;
              wordUtterance.pitch = 1.1;
              const voiceWord = VoiceService.getVoice(lang);
              if (voiceWord) wordUtterance.voice = voiceWord;
              window.speechSynthesis.speak(wordUtterance);
            }, 600); // Increased from 300 to 600ms
          };

          const voiceSound = VoiceService.getVoice(lang);
          if (voiceSound) soundUtterance.voice = voiceSound;
          window.speechSynthesis.speak(soundUtterance);
        }, 600); // Increased from 300 to 600ms
      };

      window.speechSynthesis.speak(letterUtterance);
    }
  };

  const handleWakeUpLetter = () => {
    if (isAwake) return;

    setIsAwake(true);
    correctSoundRef.current?.play().catch(() => {});

    // Speak the letter sound
    setTimeout(() => {
      speakLetterSound();
    }, 500);

    const newScore = score + 1;
    setScore(newScore);

    setScorePopup({ id: Date.now(), x: 50 });
    setTimeout(() => setScorePopup(null), 1000);

    updateProgress({
      title: "Wake Up Letter Game",
      score: newScore,
      total: TARGET_ROUNDS,
      index: currentRound + 1,
    });

    completeQuiz({
      title: "Wake Up Letter Game",
      score: 1,
      total: 1,
    });

    setShowAnswer(true);

    setTimeout(() => {
      if (currentRound + 1 < TARGET_ROUNDS) {
        setCurrentRound(prev => prev + 1);
      } else {
        createCelebrationEmojis();
        setShowCelebration(true);
        setTimeout(() => {
          if (onComplete) {
            onComplete({ score: newScore, total: TARGET_ROUNDS });
          }
        }, NEXT_DELAY);
      }
    }, 6000); // Increased from 3500 to 6000ms to allow audio to complete
  };

  const progressPercent = Math.round((currentRound / TARGET_ROUNDS) * 100);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-indigo-100 via-blue-100 to-purple-100 p-4 sm:p-8 rounded-xl overflow-hidden">
      {/* Night sky decoration */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="text-6xl absolute top-10 left-10">🌙</div>
        <div className="text-4xl absolute top-20 right-20">⭐</div>
        <div className="text-4xl absolute top-40 left-40">✨</div>
        <div className="text-4xl absolute bottom-40 right-40">⭐</div>
        <div className="text-6xl absolute bottom-20 left-20">🌟</div>
      </div>

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

      <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-6 mb-6 relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">
              {lang === "el" ? "Ξύπνα το Γράμμα" : "Wake Up the Letter"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Γράμμα ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Letter ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-indigo-600">
            💤 {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-600">
            {progressPercent}%
          </span>
        </div>
      </div>

      <div className="text-center mb-8 relative z-10">
        <h2 className="text-3xl font-bold mb-4 text-slate-800">
          {lang === "el" ? "Πάτα το γράμμα για να το ξυπνήσεις!" : "Tap the letter to wake it up!"}
        </h2>
      </div>

      {/* Sleeping/Awake Letter */}
      <div className="max-w-4xl mx-auto mb-8 relative z-10">
        <button
          onClick={handleWakeUpLetter}
          disabled={isAwake}
          className={`
            relative w-full p-16 rounded-3xl border-4 transition-all duration-500 transform
            ${isAwake ? "bg-white border-green-500 scale-110" : "bg-gradient-to-br from-slate-700 to-slate-900 border-slate-600 hover:scale-105 cursor-pointer"}
            ${!isAwake ? "animate-pulse-slow" : ""}
          `}
          style={{ borderColor: isAwake ? round.color : undefined }}
        >
          <div className="text-center">
            {/* Sleeping State */}
            {!isAwake && (
              <div className="animate-bounce-slow">
                <div className="text-9xl text-white opacity-30 mb-4 relative">
                  {round.letter}
                  <div className="absolute -top-4 -right-4 text-6xl">💤</div>
                  <div className="absolute -top-8 right-8 text-4xl opacity-70">💤</div>
                  <div className="absolute -top-12 right-20 text-3xl opacity-50">💤</div>
                </div>
                <p className="text-3xl font-bold text-white">
                  {lang === "el" ? "😴 Κοιμάται..." : "😴 Sleeping..."}
                </p>
                <p className="text-xl text-slate-300 mt-2">
                  {lang === "el" ? "Πάτα για να ξυπνήσει!" : "Tap to wake up!"}
                </p>
              </div>
            )}

            {/* Awake State */}
            {isAwake && (
              <div className="animate-fadeIn">
                <div className="text-9xl mb-4 animate-bounce" style={{ color: round.color }}>
                  {round.letter}
                </div>
                <div className="text-8xl mb-4">
                  {round.emoji}
                </div>
                <div className="space-y-4">
                  <p className="text-4xl font-bold text-slate-800">
                    {round.word}
                  </p>
                  <div className="inline-block bg-gradient-to-r from-green-100 to-emerald-100 px-6 py-3 rounded-full border-2 border-green-400">
                    <p className="text-2xl font-bold text-green-700">
                      {lang === "el" ? `Ήχος: "${round.sound}"` : `Sound: "${round.sound}"`}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sparkles when awake */}
          {isAwake && (
            <>
              <div className="absolute top-10 left-10 text-4xl animate-spin-slow">✨</div>
              <div className="absolute top-10 right-10 text-4xl animate-spin-slow animation-delay-200">⭐</div>
              <div className="absolute bottom-10 left-10 text-4xl animate-spin-slow animation-delay-400">🌟</div>
              <div className="absolute bottom-10 right-10 text-4xl animate-spin-slow animation-delay-600">✨</div>
            </>
          )}
        </button>
      </div>

      {showAnswer && (
        <div className="text-center animate-fadeIn relative z-10">
          <div className="bg-green-100 rounded-2xl p-6 inline-block border-4 border-green-400">
            <p className="text-3xl font-bold text-green-700">
              {lang === "el"
                ? `🎉 Μπράβο! Το γράμμα ${round.letter} λέει "${round.sound}"!`
                : `🎉 Great! The letter ${round.letter} says "${round.sound}"!`}
            </p>
          </div>
        </div>
      )}

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-300/80 to-purple-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🌟🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Ξύπνησες όλα τα γράμματα!" : "Perfect! You woke up all the letters!"}
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
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
      `}</style>
    </div>
  );
}

