// src/components/games/exercises_4_5/BreakWord.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import { VoiceService } from "../../../services/VoiceService";

export default function BreakWord({ lang = "el", onComplete }) {
  const [currentWord, setCurrentWord] = useState(0);
  const [tappedSyllables, setTappedSyllables] = useState([]);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const correctSoundRef = useRef(null);
  const completeRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const TARGET_WORDS = 8; // 8 λέξεις

  const wordsData = {
    el: [
      {
        id: 1,
        word: "ΠΟΡΤΟΚΑΛΙ",
        syllables: ["ΠΟ", "ΡΤΟ", "ΚΑ", "ΛΙ"],
        emoji: "🍊",
        image: "🍊"
      },
      {
        id: 2,
        word: "ΠΕΤΑΛΟΥΔΑ",
        syllables: ["ΠΕ", "ΤΑ", "ΛΟΥ", "ΔΑ"],
        emoji: "🦋",
        image: "🦋"
      },
      {
        id: 3,
        word: "ΣΟΚΟΛΑΤΑ",
        syllables: ["ΣΟ", "ΚΟ", "ΛΑ", "ΤΑ"],
        emoji: "🍫",
        image: "🍫"
      },
      {
        id: 4,
        word: "ΕΛΕΦΑΝΤΑΣ",
        syllables: ["Ε", "ΛΕ", "ΦΑ", "ΝΤΑ", "Σ"],
        emoji: "🐘",
        image: "🐘"
      },
      {
        id: 5,
        word: "ΜΠΑΝΑΝΑ",
        syllables: ["ΜΠΑ", "ΝΑ", "ΝΑ"],
        emoji: "🍌",
        image: "🍌"
      },
      {
        id: 6,
        word: "ΚΑΡΟΤΟ",
        syllables: ["ΚΑ", "ΡΟ", "ΤΟ"],
        emoji: "🥕",
        image: "🥕"
      },
      {
        id: 7,
        word: "ΜΗΛΟ",
        syllables: ["ΜΗ", "ΛΟ"],
        emoji: "🍎",
        image: "🍎"
      },
      {
        id: 8,
        word: "ΓΑΤΑ",
        syllables: ["ΓΑ", "ΤΑ"],
        emoji: "🐱",
        image: "🐱"
      }
    ],
    en: [
      {
        id: 1,
        word: "WATERMELON",
        syllables: ["WA", "TER", "MEL", "ON"],
        emoji: "🍉",
        image: "🍉"
      },
      {
        id: 2,
        word: "BUTTERFLY",
        syllables: ["BUT", "TER", "FLY"],
        emoji: "🦋",
        image: "🦋"
      },
      {
        id: 3,
        word: "CHOCOLATE",
        syllables: ["CHOC", "O", "LATE"],
        emoji: "🍫",
        image: "🍫"
      },
      {
        id: 4,
        word: "ELEPHANT",
        syllables: ["EL", "E", "PHANT"],
        emoji: "🐘",
        image: "🐘"
      },
      {
        id: 5,
        word: "BANANA",
        syllables: ["BA", "NA", "NA"],
        emoji: "🍌",
        image: "🍌"
      },
      {
        id: 6,
        word: "CARROT",
        syllables: ["CAR", "ROT"],
        emoji: "🥕",
        image: "🥕"
      },
      {
        id: 7,
        word: "APPLE",
        syllables: ["AP", "PLE"],
        emoji: "🍎",
        image: "🍎"
      },
      {
        id: 8,
        word: "KITTEN",
        syllables: ["KIT", "TEN"],
        emoji: "🐱",
        image: "🐱"
      }
    ]
  };

  const words = wordsData[lang];
  const word = words[currentWord];

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/pop.mp3");
    completeRef.current = new Audio("/sounds/correct.mp3");
    correctSoundRef.current.preload = "auto";
    completeRef.current.preload = "auto";
  }, []);

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "👏", "🎊"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const speakSyllable = (syllable) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(syllable);
    utterance.lang = lang === "el" ? "el-GR" : "en-US";
    utterance.rate = lang === "el" ? 0.6 : 0.75;
    utterance.pitch = 1.2;
    window.speechSynthesis.speak(utterance);
  };

  const speakWord = () => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word.word);
    utterance.lang = lang === "el" ? "el-GR" : "en-US";
    utterance.rate = lang === "el" ? 0.6 : 0.75;
    utterance.pitch = 1.1;
    const voice = VoiceService.getVoice(lang);
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  };

  const handleSyllableTap = (index) => {
    // Έλεγχος αν είναι η επόμενη συλλαβή στη σειρά
    if (tappedSyllables.length === index) {
      correctSoundRef.current?.play().catch(() => {});

      const newTapped = [...tappedSyllables, index];
      setTappedSyllables(newTapped);

      // Άκουσε τη συλλαβή
      speakSyllable(word.syllables[index]);

      // Έλεγχος αν τελείωσαν όλες οι συλλαβές
      if (newTapped.length === word.syllables.length) {
        completeRef.current?.play().catch(() => {});

        const newScore = score + 1;
        setScore(newScore);

        // Show +1 score popup
        setScorePopup({ id: Date.now(), x: 50 });
        setTimeout(() => setScorePopup(null), 1000);

        // Ενημέρωση progress
        updateProgress({
          title: "Break Word",
          score: newScore,
          total: TARGET_WORDS,
          index: currentWord + 1,
        });

        completeQuiz({
          title: "Break Word",
          score: 1,
          total: 1,
        });

        // Άκουσε την ολόκληρη λέξη
        setTimeout(() => {
          speakWord();
        }, 500);

        // Πήγαινε στην επόμενη λέξη
        setTimeout(() => {
          if (currentWord + 1 < TARGET_WORDS) {
            setCurrentWord(prev => prev + 1);
            setTappedSyllables([]);
          } else {
            // Τελείωσαν όλες οι λέξεις
            createCelebrationEmojis();
            setShowCelebration(true);
            setTimeout(() => {
              if (onComplete) {
                onComplete();
              }
            }, 2500);
          }
        }, 2500);
      }
    }
  };

  const progressPercent = Math.round(((currentWord + 1) / TARGET_WORDS) * 100);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-cyan-100 via-teal-100 to-green-100 p-4 sm:p-8 rounded-xl overflow-hidden">
      {/* Celebration Emojis */}
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

      {/* Score Popup */}
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

      {/* Score Bar */}
      <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">
              {lang === "el" ? "Σπασ' τη Λέξη" : "Break the Word"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Λέξη ${currentWord + 1}/${TARGET_WORDS}`
                : `Word ${currentWord + 1}/${TARGET_WORDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-teal-600">
            👏 {score}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-teal-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-600">
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center mb-8">
        <p className="text-xl text-slate-700 font-semibold bg-white/80 backdrop-blur rounded-xl p-4 inline-block shadow-lg">
          {lang === "el"
            ? "👆 Πάτα τις συλλαβές με τη σειρά!"
            : "👆 Tap the syllables in order!"}
        </p>
      </div>

      {/* Word Image */}
      <div className="text-center mb-8">
        <div className="inline-block bg-white/90 backdrop-blur rounded-3xl shadow-2xl p-8 border-4 border-teal-300">
          <div className="text-9xl mb-4 animate-bounce">
            {word.image}
          </div>
          <button
            onClick={speakWord}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-full font-bold text-lg shadow-lg hover:scale-105 transition-transform"
          >
            🔊 {lang === "el" ? "Άκουσε τη λέξη" : "Hear the word"}
          </button>
        </div>
      </div>

      {/* Syllables Buttons */}
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap justify-center gap-4">
          {word.syllables.map((syllable, index) => {
            const isTapped = tappedSyllables.includes(index);
            const isNext = tappedSyllables.length === index;
            const isLater = tappedSyllables.length < index;

            return (
              <button
                key={index}
                onClick={() => handleSyllableTap(index)}
                disabled={isTapped || isLater}
                className={`
                  relative px-12 py-8 rounded-2xl border-4 font-bold text-4xl transition-all duration-300 transform
                  ${isTapped ? "bg-green-100 border-green-500 scale-95 opacity-70" : ""}
                  ${isNext ? "bg-white border-teal-400 hover:border-teal-600 hover:scale-110 cursor-pointer animate-pulse" : ""}
                  ${isLater ? "bg-gray-100 border-gray-300 opacity-50 cursor-not-allowed" : ""}
                `}
                style={{
                  minWidth: "120px",
                }}
              >
                {syllable}
                {isTapped && (
                  <div className="absolute -top-3 -right-3 text-3xl animate-bounce">
                    ✅
                  </div>
                )}
                {isNext && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <div className="text-2xl animate-bounce">👆</div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Syllable Count */}
        <div className="mt-8 text-center">
          <div className="inline-block bg-teal-100 rounded-2xl p-4 border-3 border-teal-400">
            <p className="text-xl font-bold text-teal-700">
              {lang === "el"
                ? `Συλλαβές: ${tappedSyllables.length} / ${word.syllables.length}`
                : `Syllables: ${tappedSyllables.length} / ${word.syllables.length}`}
            </p>
          </div>
        </div>

        {/* Completed Word Display */}
        {tappedSyllables.length === word.syllables.length && (
          <div className="mt-8 text-center animate-fadeIn">
            <div className="bg-gradient-to-r from-green-100 to-teal-100 rounded-3xl p-8 inline-block border-4 border-green-400 shadow-2xl">
              <div className="text-6xl mb-4">{word.emoji}</div>
              <h2 className="text-5xl font-bold text-green-700 mb-4">
                {word.word}
              </h2>
              <p className="text-2xl font-bold text-green-600">
                {lang === "el" ? "🎉 Μπράβο! Το έσπασες σωστά!" : "🎉 Great! You broke it correctly!"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-300/80 to-teal-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">👏🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια!" : "Perfect!"}
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

