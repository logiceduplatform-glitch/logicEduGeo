// src/components/games/FlippedSoundCardsGame.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import { VoiceService } from "../../../services/VoiceService";

export default function FlippedSoundCardsGame({ lang = "el", onComplete, difficulty = 3 }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const audioRefs = useRef({});
  const { updateProgress, completeQuiz } = useQuizProgress();
  const d = Math.max(1, Math.min(5, difficulty));
  const WRONG_DELAY = [2000, 1800, 1500, 1200, 1000][d - 1];
  const NEXT_DELAY = [3000, 2800, 2500, 2200, 2000][d - 1];

  const TARGET_ROUNDS = 5;

  const roundsData = {
    el: [
      {
        id: 1,
        title: "Ζώα",
        pairs: [
          { id: 1, sound: "dog", label: "Σκύλος", emoji: "🐶" },
          { id: 2, sound: "cat", label: "Γάτα", emoji: "🐱" },
          { id: 3, sound: "cow", label: "Αγελάδα", emoji: "🐮" },
          { id: 4, sound: "bird", label: "Πουλί", emoji: "🐦" }
        ]
      },
      {
        id: 2,
        title: "Οχήματα",
        pairs: [
          { id: 1, sound: "car", label: "Αυτοκίνητο", emoji: "🚗" },
          { id: 2, sound: "train", label: "Τρένο", emoji: "🚆" },
          { id: 3, sound: "plane", label: "Αεροπλάνο", emoji: "✈️" },
          { id: 4, sound: "boat", label: "Βάρκα", emoji: "⛵" }
        ]
      },
      {
        id: 3,
        title: "Μουσικά Όργανα",
        pairs: [
          { id: 1, sound: "piano", label: "Πιάνο", emoji: "🎹" },
          { id: 2, sound: "drum", label: "Τύμπανο", emoji: "🥁" },
          { id: 3, sound: "guitar", label: "Κιθάρα", emoji: "🎸" },
          { id: 4, sound: "bell", label: "Καμπάνα", emoji: "🔔" }
        ]
      },
      {
        id: 4,
        title: "Φύση",
        pairs: [
          { id: 1, sound: "rain", label: "Βροχή", emoji: "🌧️" },
          { id: 2, sound: "thunder", label: "Βροντή", emoji: "⚡" },
          { id: 3, sound: "wind", label: "Άνεμος", emoji: "💨" },
          { id: 4, sound: "water", label: "Νερό", emoji: "💧" }
        ]
      },
      {
        id: 5,
        title: "Καθημερινά",
        pairs: [
          { id: 1, sound: "phone", label: "Τηλέφωνο", emoji: "📱" },
          { id: 2, sound: "door", label: "Πόρτα", emoji: "🚪" },
          { id: 3, sound: "clock", label: "Ρολόι", emoji: "⏰" },
          { id: 4, sound: "applause", label: "Χειροκρότημα", emoji: "👏" }
        ]
      }
    ],
    en: [
      {
        id: 1,
        title: "Animals",
        pairs: [
          { id: 1, sound: "dog", label: "Dog", emoji: "🐶" },
          { id: 2, sound: "cat", label: "Cat", emoji: "🐱" },
          { id: 3, sound: "cow", label: "Cow", emoji: "🐮" },
          { id: 4, sound: "bird", label: "Bird", emoji: "🐦" }
        ]
      },
      {
        id: 2,
        title: "Vehicles",
        pairs: [
          { id: 1, sound: "car", label: "Car", emoji: "🚗" },
          { id: 2, sound: "train", label: "Train", emoji: "🚆" },
          { id: 3, sound: "plane", label: "Airplane", emoji: "✈️" },
          { id: 4, sound: "boat", label: "Boat", emoji: "⛵" }
        ]
      },
      {
        id: 3,
        title: "Musical Instruments",
        pairs: [
          { id: 1, sound: "piano", label: "Piano", emoji: "🎹" },
          { id: 2, sound: "drum", label: "Drum", emoji: "🥁" },
          { id: 3, sound: "guitar", label: "Guitar", emoji: "🎸" },
          { id: 4, sound: "bell", label: "Bell", emoji: "🔔" }
        ]
      },
      {
        id: 4,
        title: "Nature",
        pairs: [
          { id: 1, sound: "rain", label: "Rain", emoji: "🌧️" },
          { id: 2, sound: "thunder", label: "Thunder", emoji: "⚡" },
          { id: 3, sound: "wind", label: "Wind", emoji: "💨" },
          { id: 4, sound: "water", label: "Water", emoji: "💧" }
        ]
      },
      {
        id: 5,
        title: "Everyday",
        pairs: [
          { id: 1, sound: "phone", label: "Phone", emoji: "📱" },
          { id: 2, sound: "door", label: "Door", emoji: "🚪" },
          { id: 3, sound: "clock", label: "Clock", emoji: "⏰" },
          { id: 4, sound: "applause", label: "Applause", emoji: "👏" }
        ]
      }
    ]
  };

  const rounds = roundsData[lang];
  const round = rounds[currentRound];

  // Create cards array (2 of each pair)
  const cards = round.pairs.flatMap(pair => [
    { ...pair, uniqueId: `${pair.id}-a` },
    { ...pair, uniqueId: `${pair.id}-b` }
  ]).sort(() => Math.random() - 0.5);

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    wrongSoundRef.current = new Audio("/sounds/wrong.mp3");
    correctSoundRef.current.preload = "auto";
    wrongSoundRef.current.preload = "auto";
  }, []);

  useEffect(() => {
    setFlippedCards([]);
    setMatchedPairs([]);
  }, [currentRound]);

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "✅", "🔊"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const speakQuestion = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const text = lang === 'el'
        ? `Βρες τα ζευγάρια ήχων στο ${round.title}`
        : `Find the sound pairs in ${round.title}`;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'el' ? 'el-GR' : 'en-US';
      utterance.rate = 0.75;
      utterance.pitch = 1.1;
      const voice = VoiceService.getVoice(lang);
      if (voice) utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      speakQuestion();
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRound, lang]);

  const playSound = (soundName) => {
    if (isPlaying) return;

    setIsPlaying(true);

    // Create a simple beep sound for demo
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Different frequencies for different sounds
    const frequencies = {
      dog: 300, cat: 400, cow: 200, bird: 800,
      car: 250, train: 180, plane: 600, boat: 220,
      piano: 440, drum: 150, guitar: 330, bell: 880,
      rain: 500, thunder: 100, wind: 700, water: 350,
      phone: 900, door: 120, clock: 660, applause: 550
    };

    oscillator.frequency.value = frequencies[soundName] || 440;
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);

    setTimeout(() => {
      setIsPlaying(false);
    }, 500);
  };

  const handleCardClick = (card) => {
    if (isPlaying || flippedCards.length >= 2 || flippedCards.includes(card.uniqueId) || matchedPairs.includes(card.id)) {
      return;
    }

    playSound(card.sound);

    const newFlipped = [...flippedCards, card.uniqueId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      const card1 = cards.find(c => c.uniqueId === newFlipped[0]);
      const card2 = cards.find(c => c.uniqueId === newFlipped[1]);

      if (card1.id === card2.id) {
        // Match!
        correctSoundRef.current?.play().catch(() => {});

        setTimeout(() => {
          const newMatched = [...matchedPairs, card1.id];
          setMatchedPairs(newMatched);
          setFlippedCards([]);

          // Check if all pairs matched
          if (newMatched.length === round.pairs.length) {
            handleComplete();
          }
        }, 1000);
      } else {
        // No match
        wrongSoundRef.current?.play().catch(() => {});

        setTimeout(() => {
          setFlippedCards([]);
        }, WRONG_DELAY);
      }
    }
  };

  const handleComplete = () => {
    const newScore = score + 1;
    setScore(newScore);

    setScorePopup({ id: Date.now(), x: 50 });
    setTimeout(() => setScorePopup(null), 1000);

    updateProgress({
      title: "Flipped Sound Cards Game",
      score: newScore,
      total: TARGET_ROUNDS,
      index: currentRound + 1,
    });

    completeQuiz({
      title: "Flipped Sound Cards Game",
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
            onComplete({ score: newScore, total: TARGET_ROUNDS });
          }
        }, NEXT_DELAY);
      }
    }, NEXT_DELAY);
  };

  const progressPercent = Math.round(((currentRound + 1) / TARGET_ROUNDS) * 100);
  const matchProgress = Math.round((matchedPairs.length / round.pairs.length) * 100);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Κάρτες Ήχου" : "Sound Cards"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {round.title} - {lang === "el"
                ? `Επίπεδο ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Level ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-blue-600">
            🔊 {score}
          </div>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-600">
            {progressPercent}%
          </span>
        </div>

        {/* Match Progress */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-700">
            {lang === "el" ? "Ζευγάρια:" : "Pairs:"}
          </span>
          <div className="flex gap-1">
            {Array.from({ length: round.pairs.length }).map((_, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all duration-300 ${
                  i < matchedPairs.length
                    ? 'bg-green-400 text-white scale-110'
                    : 'bg-slate-200 text-slate-400'
                }`}
              >
                {i < matchedPairs.length ? '✓' : '○'}
              </div>
            ))}
          </div>
          <span className="text-sm text-slate-600 ml-2">
            {matchedPairs.length}/{round.pairs.length}
          </span>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center mb-6">
        <div className="inline-block bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl border-4 border-blue-400">
          <div className="text-7xl mb-3">🔊</div>
          <h2 className="text-3xl font-bold mb-3 text-slate-800">
            {lang === "el" ? "Βρες τα Ζευγάρια Ήχων!" : "Find the Sound Pairs!"}
          </h2>

          <button
            onClick={speakQuestion}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xl font-bold rounded-full hover:scale-105 transition-transform shadow-lg"
          >
            🔊 {lang === "el" ? "Άκουσε Ξανά" : "Listen Again"}
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-4 gap-4">
          {cards.map((card) => {
            const isFlipped = flippedCards.includes(card.uniqueId);
            const isMatched = matchedPairs.includes(card.id);
            const isDisabled = isPlaying || flippedCards.length >= 2;

            return (
              <button
                key={card.uniqueId}
                onClick={() => handleCardClick(card)}
                disabled={isDisabled || isMatched}
                className={`
                  relative aspect-square rounded-2xl transition-all duration-300 transform
                  ${isMatched ? 'bg-green-100 border-green-400 scale-95 opacity-50' : ''}
                  ${isFlipped && !isMatched ? 'bg-blue-100 border-blue-400 scale-105' : ''}
                  ${!isFlipped && !isMatched ? 'bg-gradient-to-br from-purple-400 to-blue-500 hover:scale-110 cursor-pointer shadow-lg' : ''}
                  ${isDisabled && !isFlipped && !isMatched ? 'opacity-50 cursor-not-allowed' : ''}
                  border-4 flex flex-col items-center justify-center
                `}
              >
                {isFlipped || isMatched ? (
                  <>
                    <div className="text-6xl mb-2">{card.emoji}</div>
                    <p className="text-sm font-bold text-slate-700">{card.label}</p>
                  </>
                ) : (
                  <div className="text-white">
                    <div className="text-6xl mb-2">🔊</div>
                    <p className="text-sm font-bold">
                      {lang === "el" ? "Πάτα" : "Tap"}
                    </p>
                  </div>
                )}

                {isMatched && (
                  <div className="absolute -top-2 -right-2 text-4xl animate-bounce">
                    ✅
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-6 text-center">
          <p className="text-lg text-slate-600">
            {lang === "el"
              ? "🔊 Πάτα τις κάρτες για να ακούσεις τους ήχους και να βρεις τα ζευγάρια!"
              : "🔊 Tap the cards to hear sounds and find the pairs!"}
          </p>
        </div>
      </div>

      {matchedPairs.length === round.pairs.length && (
        <div className="text-center mt-6 animate-fadeIn">
          <div className="bg-green-100 rounded-2xl p-6 inline-block border-4 border-green-400">
            <p className="text-3xl font-bold text-green-700">
              {lang === "el"
                ? `🎉 Τέλεια! Βρήκες όλα τα ζευγάρια!`
                : `🎉 Perfect! You found all the pairs!`}
            </p>
          </div>
        </div>
      )}

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-300/80 to-purple-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🔊🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Έχεις εξαιρετική ακοή!" : "Perfect! You have excellent hearing!"}
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

