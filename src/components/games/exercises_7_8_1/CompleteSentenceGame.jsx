// src/components/games/exercises_7_8_1/CompleteSentenceGame.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import useSafeTimeout from "../../../hooks/useSafeTimeout";
import { VoiceService } from "../../../services/VoiceService";

export default function CompleteSentenceGame({ lang = "el", onComplete, difficulty = 3 }) {
  const { safeTimeout } = useSafeTimeout();
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
  const d = Math.max(1, Math.min(5, difficulty));
  const WRONG_DELAY = [2000, 1800, 1500, 1200, 1000][d - 1];
  const NEXT_DELAY = [3000, 2800, 2500, 2200, 2000][d - 1];

  const TARGET_ROUNDS = 15;

  const sentencesData = {
    el: [
      { id: 1, sentence: "Ο αετός πετάει ψηλά στον ___", correct: "ουρανό", color: "#F59E0B", options: [{ id: "sky", word: "ουρανό", emoji: "🌤️" }, { id: "sea", word: "θάλασσα", emoji: "🌊" }, { id: "mountain", word: "βουνό", emoji: "🏔️" }] },
      { id: 2, sentence: "Η Ελλάδα περιβάλλεται από ___", correct: "θάλασσα", color: "#3B82F6", options: [{ id: "sea", word: "θάλασσα", emoji: "🌊" }, { id: "desert", word: "έρημο", emoji: "🏜️" }, { id: "forest", word: "δάσος", emoji: "🌲" }] },
      { id: 3, sentence: "Τα φυτά χρειάζονται ___ για να μεγαλώσουν", correct: "νερό", color: "#10B981", options: [{ id: "water", word: "νερό", emoji: "💧" }, { id: "pizza", word: "πίτσα", emoji: "🍕" }, { id: "guitar", word: "κιθάρα", emoji: "🎸" }] },
      { id: 4, sentence: "Η καρδιά μας χτυπάει μέσα στο ___", correct: "στήθος", color: "#06B6D4", options: [{ id: "chest", word: "στήθος", emoji: "🫀" }, { id: "foot", word: "πόδι", emoji: "🦶" }, { id: "hand", word: "χέρι", emoji: "✋" }] },
      { id: 5, sentence: "Η γη είναι ο τρίτος ___ από τον ήλιο", correct: "πλανήτης", color: "#8B5CF6", options: [{ id: "planet", word: "πλανήτης", emoji: "🌍" }, { id: "star", word: "αστέρι", emoji: "⭐" }, { id: "moon", word: "φεγγάρι", emoji: "🌙" }] },
      { id: 6, sentence: "Τα ψάρια αναπνέουν με τα ___", correct: "βράγχια", color: "#EC4899", options: [{ id: "gills", word: "βράγχια", emoji: "🐟" }, { id: "lungs", word: "πνεύμονες", emoji: "🫁" }, { id: "nose", word: "μύτη", emoji: "👃" }] },
      { id: 7, sentence: "Οι πυραμίδες βρίσκονται στην ___", correct: "Αίγυπτο", color: "#22C55E", options: [{ id: "egypt", word: "Αίγυπτο", emoji: "🇪🇬" }, { id: "france", word: "Γαλλία", emoji: "🇫🇷" }, { id: "greece", word: "Ελλάδα", emoji: "🇬🇷" }] },
      { id: 8, sentence: "Η ίριδα έχει ___ χρώματα", correct: "επτά", color: "#EAB308", options: [{ id: "seven", word: "επτά", emoji: "7️⃣" }, { id: "three", word: "τρία", emoji: "3️⃣" }, { id: "ten", word: "δέκα", emoji: "🔟" }] },
      { id: 9, sentence: "Ο Ήλιος είναι ένα μεγάλο ___", correct: "αστέρι", color: "#EF4444", options: [{ id: "star", word: "αστέρι", emoji: "⭐" }, { id: "moon", word: "φεγγάρι", emoji: "🌙" }, { id: "planet", word: "πλανήτης", emoji: "🌍" }] },
      { id: 10, sentence: "Τα μάτια μας μπορούν να ___", correct: "βλέπουν", color: "#A855F7", options: [{ id: "see", word: "βλέπουν", emoji: "👀" }, { id: "hear", word: "ακούν", emoji: "👂" }, { id: "smell", word: "μυρίζουν", emoji: "👃" }] },
      { id: 11, sentence: "Η σοκολάτα φτιάχνεται από ___", correct: "κακάο", color: "#14B8A6", options: [{ id: "cocoa", word: "κακάο", emoji: "🍫" }, { id: "butter", word: "βούτυρο", emoji: "🧈" }, { id: "corn", word: "καλαμπόκι", emoji: "🌽" }] },
      { id: 12, sentence: "Η αράχνη έχει ___ πόδια", correct: "οχτώ", color: "#78350F", options: [{ id: "eight", word: "οχτώ", emoji: "8️⃣" }, { id: "six", word: "έξι", emoji: "6️⃣" }, { id: "four", word: "τέσσερα", emoji: "4️⃣" }] },
      { id: 13, sentence: "Η ___ είναι η μεγαλύτερη ήπειρος", correct: "Ασία", color: "#06B6D4", options: [{ id: "asia", word: "Ασία", emoji: "🌏" }, { id: "africa", word: "Αφρική", emoji: "🌍" }, { id: "america", word: "Αμερική", emoji: "🌎" }] },
      { id: 14, sentence: "Η μπάλα του μπάσκετ μπαίνει στο ___", correct: "καλάθι", color: "#F97316", options: [{ id: "basket", word: "καλάθι", emoji: "🏀" }, { id: "goal", word: "τέρμα", emoji: "⚽" }, { id: "net", word: "δίχτυ", emoji: "🥅" }] },
      { id: 15, sentence: "Η μουσική αποτελείται από ___", correct: "νότες", color: "#EC4899", options: [{ id: "notes", word: "νότες", emoji: "🎵" }, { id: "books", word: "βιβλία", emoji: "📚" }, { id: "colors", word: "χρώματα", emoji: "🎨" }] }
    ],
    en: [
      { id: 1, sentence: "The eagle flies high in the ___", correct: "sky", color: "#F59E0B", options: [{ id: "sky", word: "sky", emoji: "🌤️" }, { id: "sea", word: "sea", emoji: "🌊" }, { id: "mountain", word: "mountain", emoji: "🏔️" }] },
      { id: 2, sentence: "Greece is surrounded by the ___", correct: "sea", color: "#3B82F6", options: [{ id: "sea", word: "sea", emoji: "🌊" }, { id: "desert", word: "desert", emoji: "🏜️" }, { id: "forest", word: "forest", emoji: "🌲" }] },
      { id: 3, sentence: "Plants need ___ to grow", correct: "water", color: "#10B981", options: [{ id: "water", word: "water", emoji: "💧" }, { id: "pizza", word: "pizza", emoji: "🍕" }, { id: "guitar", word: "guitar", emoji: "🎸" }] },
      { id: 4, sentence: "Our heart beats inside our ___", correct: "chest", color: "#06B6D4", options: [{ id: "chest", word: "chest", emoji: "🫀" }, { id: "foot", word: "foot", emoji: "🦶" }, { id: "hand", word: "hand", emoji: "✋" }] },
      { id: 5, sentence: "Earth is the third ___ from the sun", correct: "planet", color: "#8B5CF6", options: [{ id: "planet", word: "planet", emoji: "🌍" }, { id: "star", word: "star", emoji: "⭐" }, { id: "moon", word: "moon", emoji: "🌙" }] },
      { id: 6, sentence: "Fish breathe with their ___", correct: "gills", color: "#EC4899", options: [{ id: "gills", word: "gills", emoji: "🐟" }, { id: "lungs", word: "lungs", emoji: "🫁" }, { id: "nose", word: "nose", emoji: "👃" }] },
      { id: 7, sentence: "The pyramids are in ___", correct: "Egypt", color: "#22C55E", options: [{ id: "egypt", word: "Egypt", emoji: "🇪🇬" }, { id: "france", word: "France", emoji: "🇫🇷" }, { id: "greece", word: "Greece", emoji: "🇬🇷" }] },
      { id: 8, sentence: "The rainbow has ___ colors", correct: "seven", color: "#EAB308", options: [{ id: "seven", word: "seven", emoji: "7️⃣" }, { id: "three", word: "three", emoji: "3️⃣" }, { id: "ten", word: "ten", emoji: "🔟" }] },
      { id: 9, sentence: "The Sun is a big ___", correct: "star", color: "#EF4444", options: [{ id: "star", word: "star", emoji: "⭐" }, { id: "moon", word: "moon", emoji: "🌙" }, { id: "planet", word: "planet", emoji: "🌍" }] },
      { id: 10, sentence: "Our eyes can ___", correct: "see", color: "#A855F7", options: [{ id: "see", word: "see", emoji: "👀" }, { id: "hear", word: "hear", emoji: "👂" }, { id: "smell", word: "smell", emoji: "👃" }] },
      { id: 11, sentence: "Chocolate is made from ___", correct: "cocoa", color: "#14B8A6", options: [{ id: "cocoa", word: "cocoa", emoji: "🍫" }, { id: "butter", word: "butter", emoji: "🧈" }, { id: "corn", word: "corn", emoji: "🌽" }] },
      { id: 12, sentence: "A spider has ___ legs", correct: "eight", color: "#78350F", options: [{ id: "eight", word: "eight", emoji: "8️⃣" }, { id: "six", word: "six", emoji: "6️⃣" }, { id: "four", word: "four", emoji: "4️⃣" }] },
      { id: 13, sentence: "___ is the largest continent", correct: "Asia", color: "#06B6D4", options: [{ id: "asia", word: "Asia", emoji: "🌏" }, { id: "africa", word: "Africa", emoji: "🌍" }, { id: "america", word: "America", emoji: "🌎" }] },
      { id: 14, sentence: "The basketball goes into the ___", correct: "basket", color: "#F97316", options: [{ id: "basket", word: "basket", emoji: "🏀" }, { id: "goal", word: "goal", emoji: "⚽" }, { id: "net", word: "net", emoji: "🥅" }] },
      { id: 15, sentence: "Music is made of ___", correct: "notes", color: "#EC4899", options: [{ id: "notes", word: "notes", emoji: "🎵" }, { id: "books", word: "books", emoji: "📚" }, { id: "colors", word: "colors", emoji: "🎨" }] }
    ]
  };

  const sentences = sentencesData[lang];
  const round = sentences[currentRound];

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
      emoji: ["🎉", "⭐", "✨", "🌟", "✅", "📝"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    safeTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const speakSentence = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(round.sentence + "...");
      utterance.lang = lang === 'el' ? 'el-GR' : 'en-US';
      utterance.rate = 0.75;
      utterance.pitch = 1.1;
      const voice = VoiceService.getVoice(lang);
      if (voice) utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    const timer = safeTimeout(() => {
      speakSentence();
    }, 500);
    return () => clearTimeout(timer);
  }, [currentRound]);

  const handleAnswerSelect = (answerId) => {
    if (showAnswer) return;

    setSelectedAnswer(answerId);
    setShowAnswer(true);

    const isCorrect = answerId === round.correct;

    if (isCorrect) {
      correctSoundRef.current?.play().catch(() => {});

      const newScore = score + 1;
      setScore(newScore);

      setScorePopup({ id: Date.now(), x: 50 });
      safeTimeout(() => setScorePopup(null), 1000);

      updateProgress({
        title: "Complete Sentence Game",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      completeQuiz({
        title: "Complete Sentence Game",
        score: 1,
        total: 1,
      });

      safeTimeout(() => {
        if (currentRound + 1 < TARGET_ROUNDS) {
          setCurrentRound(prev => prev + 1);
          setSelectedAnswer(null);
          setShowAnswer(false);
        } else {
          createCelebrationEmojis();
          setShowCelebration(true);
          safeTimeout(() => {
            if (onComplete) {
              onComplete({ score: newScore, total: TARGET_ROUNDS });
            }
          }, NEXT_DELAY);
        }
      }, NEXT_DELAY);
    } else {
      wrongSoundRef.current?.play().catch(() => {});

      safeTimeout(() => {
        setSelectedAnswer(null);
        setShowAnswer(false);
      }, WRONG_DELAY);
    }
  };

  const progressPercent = Math.round((currentRound / TARGET_ROUNDS) * 100);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-cyan-100 via-blue-100 to-indigo-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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

      <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">
              {lang === "el" ? "Ολοκλήρωσε τη Φράση" : "Complete the Sentence"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Φράση ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Sentence ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-cyan-600">
            📝 {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-600">
            {progressPercent}%
          </span>
        </div>
      </div>

      <div className="text-center mb-8">
        <div className="inline-block bg-white/90 backdrop-blur rounded-2xl p-8 shadow-xl border-4" style={{ borderColor: round.color }}>
          <div className="text-9xl mb-4">💭</div>
          <h2 className="text-3xl font-bold mb-4 text-slate-800">
            {lang === "el" ? "Άκου τη φράση!" : "Listen to the sentence!"}
          </h2>

          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-xl mb-4">
            <p className="text-3xl font-bold text-slate-800">
              {round.sentence} <span className="text-5xl text-indigo-600">...</span>
            </p>
          </div>

          <button
            onClick={speakSentence}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-indigo-500 text-white text-2xl font-bold rounded-full hover:scale-105 transition-transform shadow-lg mb-4"
          >
            🔊 {lang === "el" ? "Άκουσε Ξανά" : "Listen Again"}
          </button>

          <p className="text-xl text-slate-600 mt-4">
            {lang === "el" ? "Ποια λέξη λείπει;" : "Which word is missing?"}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mb-8">
        <div className="grid grid-cols-3 gap-4">
          {round.options.map((option) => {
            const isSelected = selectedAnswer === option.word;
            const isCorrect = showAnswer && option.word === round.correct;
            const isWrong = showAnswer && isSelected && option.word !== round.correct;

            return (
              <button
                key={option.id}
                onClick={() => handleAnswerSelect(option.word)}
                disabled={showAnswer}
                className={`
                  relative p-6 rounded-2xl border-4 transition-all duration-300 transform
                  ${isCorrect ? "bg-green-100 border-green-500 scale-110" : ""}
                  ${isWrong ? "bg-red-100 border-red-500 animate-shake" : ""}
                  ${!showAnswer ? "bg-white border-slate-300 hover:border-cyan-400 hover:scale-105 cursor-pointer" : "cursor-not-allowed"}
                  ${showAnswer && !isSelected && option.word !== round.correct ? "opacity-50" : ""}
                `}
              >
                <div className="text-center">
                  <div className="text-7xl mb-3">{option.emoji}</div>
                  <p className="text-2xl font-bold text-slate-800">{option.word}</p>

                  {isCorrect && (
                    <div className="text-6xl animate-bounce mt-3">
                      ✅
                    </div>
                  )}
                  {isWrong && (
                    <div className="text-6xl mt-3">
                      ❌
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {showAnswer && (
        <div className="text-center animate-fadeIn">
          {selectedAnswer === round.correct ? (
            <div className="bg-green-100 rounded-2xl p-6 inline-block border-4 border-green-400">
              <p className="text-3xl font-bold text-green-700">
                {lang === "el"
                  ? `🎉 Μπράβο! "${round.sentence} ${round.correct}"`
                  : `🎉 Great! "${round.sentence} ${round.correct}"`}
              </p>
            </div>
          ) : (
            <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
              <p className="text-3xl font-bold text-red-700">
                {lang === "el"
                  ? `Η σωστή ήταν: ${round.correct}`
                  : `The correct one was: ${round.correct}`}
              </p>
            </div>
          )}
        </div>
      )}

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-300/80 to-indigo-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">📝🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Ολοκλήρωσες όλες τις φράσεις!" : "Perfect! You completed all sentences!"}
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
