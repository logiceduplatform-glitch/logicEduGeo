// src/components/games/WhatHeardFirstGame.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

export default function WhatHeardFirstGame({ lang = "el", onComplete, difficulty = 3 }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [playingSequence, setPlayingSequence] = useState(false);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState(-1);
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

  const TARGET_ROUNDS = 10;

  const roundsData = {
    el: [
      {
        id: 1,
        sequence: [
          { id: "dog", emoji: "🐶", label: "Σκύλος", frequency: 300 },
          { id: "cat", emoji: "🐱", label: "Γάτα", frequency: 400 },
          { id: "bird", emoji: "🐦", label: "Πουλί", frequency: 800 }
        ],
        firstId: "dog",
        description: "Τι άκουσες πρώτο;"
      },
      {
        id: 2,
        sequence: [
          { id: "car", emoji: "🚗", label: "Αυτοκίνητο", frequency: 250 },
          { id: "train", emoji: "🚆", label: "Τρένο", frequency: 180 }
        ],
        firstId: "car",
        description: "Τι άκουσες πρώτο;"
      },
      {
        id: 3,
        sequence: [
          { id: "piano", emoji: "🎹", label: "Πιάνο", frequency: 440 },
          { id: "drum", emoji: "🥁", label: "Τύμπανο", frequency: 150 },
          { id: "bell", emoji: "🔔", label: "Καμπάνα", frequency: 880 }
        ],
        firstId: "piano",
        description: "Τι άκουσες πρώτο;"
      },
      {
        id: 4,
        sequence: [
          { id: "phone", emoji: "📱", label: "Τηλέφωνο", frequency: 900 },
          { id: "door", emoji: "🚪", label: "Πόρτα", frequency: 120 }
        ],
        firstId: "phone",
        description: "Τι άκουσες πρώτο;"
      },
      {
        id: 5,
        sequence: [
          { id: "rain", emoji: "🌧️", label: "Βροχή", frequency: 500 },
          { id: "thunder", emoji: "⚡", label: "Βροντή", frequency: 100 },
          { id: "wind", emoji: "💨", label: "Άνεμος", frequency: 700 }
        ],
        firstId: "rain",
        description: "Τι άκουσες πρώτο;"
      },
      {
        id: 6,
        sequence: [
          { id: "applause", emoji: "👏", label: "Χειροκρότημα", frequency: 550 },
          { id: "laugh", emoji: "😂", label: "Γέλιο", frequency: 600 }
        ],
        firstId: "applause",
        description: "Τι άκουσες πρώτο;"
      },
      {
        id: 7,
        sequence: [
          { id: "cow", emoji: "🐮", label: "Αγελάδα", frequency: 200 },
          { id: "sheep", emoji: "🐑", label: "Πρόβατο", frequency: 350 },
          { id: "horse", emoji: "🐴", label: "Άλογο", frequency: 280 }
        ],
        firstId: "cow",
        description: "Τι άκουσες πρώτο;"
      },
      {
        id: 8,
        sequence: [
          { id: "bee", emoji: "🐝", label: "Μέλισσα", frequency: 450 },
          { id: "fly", emoji: "🪰", label: "Μύγα", frequency: 520 }
        ],
        firstId: "bee",
        description: "Τι άκουσες πρώτο;"
      },
      {
        id: 9,
        sequence: [
          { id: "baby", emoji: "👶", label: "Μωρό", frequency: 650 },
          { id: "whistle", emoji: "🎵", label: "Σφύριγμα", frequency: 750 },
          { id: "sneeze", emoji: "🤧", label: "Φτέρνισμα", frequency: 380 }
        ],
        firstId: "baby",
        description: "Τι άκουσες πρώτο;"
      },
      {
        id: 10,
        sequence: [
          { id: "guitar", emoji: "🎸", label: "Κιθάρα", frequency: 330 },
          { id: "trumpet", emoji: "🎺", label: "Τρομπέτα", frequency: 480 }
        ],
        firstId: "guitar",
        description: "Τι άκουσες πρώτο;"
      }
    ],
    en: [
      {
        id: 1,
        sequence: [
          { id: "dog", emoji: "🐶", label: "Dog", frequency: 300 },
          { id: "cat", emoji: "🐱", label: "Cat", frequency: 400 },
          { id: "bird", emoji: "🐦", label: "Bird", frequency: 800 }
        ],
        firstId: "dog",
        description: "What did you hear first?"
      },
      {
        id: 2,
        sequence: [
          { id: "car", emoji: "🚗", label: "Car", frequency: 250 },
          { id: "train", emoji: "🚆", label: "Train", frequency: 180 }
        ],
        firstId: "car",
        description: "What did you hear first?"
      },
      {
        id: 3,
        sequence: [
          { id: "piano", emoji: "🎹", label: "Piano", frequency: 440 },
          { id: "drum", emoji: "🥁", label: "Drum", frequency: 150 },
          { id: "bell", emoji: "🔔", label: "Bell", frequency: 880 }
        ],
        firstId: "piano",
        description: "What did you hear first?"
      },
      {
        id: 4,
        sequence: [
          { id: "phone", emoji: "📱", label: "Phone", frequency: 900 },
          { id: "door", emoji: "🚪", label: "Door", frequency: 120 }
        ],
        firstId: "phone",
        description: "What did you hear first?"
      },
      {
        id: 5,
        sequence: [
          { id: "rain", emoji: "🌧️", label: "Rain", frequency: 500 },
          { id: "thunder", emoji: "⚡", label: "Thunder", frequency: 100 },
          { id: "wind", emoji: "💨", label: "Wind", frequency: 700 }
        ],
        firstId: "rain",
        description: "What did you hear first?"
      },
      {
        id: 6,
        sequence: [
          { id: "applause", emoji: "👏", label: "Applause", frequency: 550 },
          { id: "laugh", emoji: "😂", label: "Laugh", frequency: 600 }
        ],
        firstId: "applause",
        description: "What did you hear first?"
      },
      {
        id: 7,
        sequence: [
          { id: "cow", emoji: "🐮", label: "Cow", frequency: 200 },
          { id: "sheep", emoji: "🐑", label: "Sheep", frequency: 350 },
          { id: "horse", emoji: "🐴", label: "Horse", frequency: 280 }
        ],
        firstId: "cow",
        description: "What did you hear first?"
      },
      {
        id: 8,
        sequence: [
          { id: "bee", emoji: "🐝", label: "Bee", frequency: 450 },
          { id: "fly", emoji: "🪰", label: "Fly", frequency: 520 }
        ],
        firstId: "bee",
        description: "What did you hear first?"
      },
      {
        id: 9,
        sequence: [
          { id: "baby", emoji: "👶", label: "Baby", frequency: 650 },
          { id: "whistle", emoji: "🎵", label: "Whistle", frequency: 750 },
          { id: "sneeze", emoji: "🤧", label: "Sneeze", frequency: 380 }
        ],
        firstId: "baby",
        description: "What did you hear first?"
      },
      {
        id: 10,
        sequence: [
          { id: "guitar", emoji: "🎸", label: "Guitar", frequency: 330 },
          { id: "trumpet", emoji: "🎺", label: "Trumpet", frequency: 480 }
        ],
        firstId: "guitar",
        description: "What did you hear first?"
      }
    ]
  };

  const rounds = roundsData[lang];
  const round = rounds[currentRound];

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    wrongSoundRef.current = new Audio("/sounds/wrong.mp3");
    correctSoundRef.current.preload = "auto";
    wrongSoundRef.current.preload = "auto";
  }, []);

  useEffect(() => {
    setSelectedAnswer(null);
    setShowAnswer(false);
    setCurrentPlayingIndex(-1);

    // Auto-play sequence after 1 second
    const autoPlayTimer = setTimeout(() => {
      playSequence();
    }, 1000);

    return () => clearTimeout(autoPlayTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRound]);

  const playSound = (frequency, duration = 0.5) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);

    return new Promise(resolve => setTimeout(resolve, duration * 1000));
  };

  const playSequence = async () => {
    if (playingSequence) return;

    setPlayingSequence(true);

    for (let i = 0; i < round.sequence.length; i++) {
      setCurrentPlayingIndex(i);
      await playSound(round.sequence[i].frequency, 0.6);
      await new Promise(resolve => setTimeout(resolve, 400)); // Gap between sounds
    }

    setCurrentPlayingIndex(-1);
    setPlayingSequence(false);
  };

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

  const handleAnswerSelect = (soundId) => {
    if (showAnswer || playingSequence) return;

    setSelectedAnswer(soundId);
    setShowAnswer(true);

    const isCorrect = soundId === round.firstId;

    if (isCorrect) {
      correctSoundRef.current?.play().catch(() => {});

      const newScore = score + 1;
      setScore(newScore);

      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      updateProgress({
        title: "What Heard First Game",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      completeQuiz({
        title: "What Heard First Game",
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
    } else {
      wrongSoundRef.current?.play().catch(() => {});

      setTimeout(() => {
        setSelectedAnswer(null);
        setShowAnswer(false);
      }, WRONG_DELAY);
    }
  };

  const progressPercent = Math.round((currentRound / TARGET_ROUNDS) * 100);
  const firstSound = round.sequence.find(sound => sound.id === round.firstId);

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
              {lang === "el" ? "Τι Άκουσες Πρώτο;" : "What Did You Hear First?"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Επίπεδο ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Level ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-blue-600">
            🔊 {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-pink-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-600">
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center mb-6">
        <div className="inline-block bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl border-4 border-blue-400">
          <div className="text-7xl mb-3">👂</div>
          <h2 className="text-3xl font-bold mb-3 text-slate-800">
            {playingSequence
              ? (lang === "el" ? "Άκου προσεκτικά!" : "Listen carefully!")
              : round.description
            }
          </h2>

          <button
            onClick={playSequence}
            disabled={playingSequence}
            className={`px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xl font-bold rounded-full hover:scale-105 transition-transform shadow-lg ${
              playingSequence ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            🔊 {lang === "el" ? "Άκουσε Ξανά" : "Listen Again"}
          </button>
        </div>
      </div>

      {/* Sound Sequence Display */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border-4 border-blue-400">
          <p className="text-2xl font-bold text-center text-slate-800 mb-6">
            {playingSequence
              ? (lang === "el" ? "Άκουσε τη σειρά:" : "Listen to the sequence:")
              : (lang === "el" ? "Ποιος ήταν πρώτος;" : "Which was first?")}
          </p>

          {/* Sequence indicators */}
          <div className="flex justify-center items-center gap-6 mb-8">
            {round.sequence.map((sound, index) => {
              const isPlaying = currentPlayingIndex === index;
              const isFirst = index === 0;

              return (
                <div key={sound.id} className="relative">
                  <div
                    className={`
                      w-32 h-32 rounded-3xl transition-all duration-300 transform
                      ${isPlaying
                        ? 'bg-gradient-to-br from-yellow-200 to-orange-200 border-yellow-400 scale-125 shadow-2xl'
                        : 'bg-gradient-to-br from-slate-100 to-slate-200 border-slate-300'}
                      border-4 flex flex-col items-center justify-center shadow-lg
                    `}
                  >
                    <div className={`text-6xl ${isPlaying ? 'animate-bounce' : ''}`}>
                      {isPlaying ? '🔊' : sound.emoji}
                    </div>
                    {!playingSequence && !isPlaying && (
                      <p className="text-xs font-bold text-slate-600 mt-2">#{index + 1}</p>
                    )}
                  </div>

                  {isFirst && !playingSequence && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white font-bold px-3 py-1 rounded-full text-xs">
                      {lang === "el" ? "ΠΡΩΤΟΣ" : "FIRST"}
                    </div>
                  )}

                  {isPlaying && (
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-slate-800 font-bold px-3 py-1 rounded-full text-sm animate-pulse">
                      #{index + 1}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {playingSequence ? (
            <div className="text-center">
              <div className="inline-block bg-yellow-100 rounded-2xl p-4 border-4 border-yellow-400">
                <p className="text-xl font-bold text-yellow-700 animate-pulse">
                  {lang === "el" ? "Άκου και θυμήσου τη σειρά!" : "Listen and remember the order!"}
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Answer options */}
              {!showAnswer && (
                <>
                  <p className="text-xl font-bold text-center text-slate-700 mb-4">
                    {lang === "el" ? "Ποιον άκουσες πρώτο;" : "Which one did you hear first?"}
                  </p>

                  <div className="flex justify-center gap-4">
                    {round.sequence.map((sound) => {
                      return (
                        <button
                          key={sound.id}
                          onClick={() => handleAnswerSelect(sound.id)}
                          className="w-36 h-36 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200 border-4 border-blue-300 hover:border-blue-500 transition-all duration-200 transform hover:scale-110 shadow-lg flex flex-col items-center justify-center cursor-pointer"
                        >
                          <div className="text-7xl mb-2">{sound.emoji}</div>
                          <p className="text-sm font-bold text-slate-700">{sound.label}</p>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {showAnswer && selectedAnswer === round.firstId && (
        <div className="text-center animate-fadeIn">
          <div className="bg-green-100 rounded-2xl p-6 inline-block border-4 border-green-400">
            <div className="text-7xl mb-3">{firstSound.emoji}</div>
            <p className="text-3xl font-bold text-green-700">
              {lang === "el"
                ? `🎉 Σωστά! Το ${firstSound.label} ήταν πρώτο!`
                : `🎉 Correct! The ${firstSound.label} was first!`}
            </p>
          </div>
        </div>
      )}

      {showAnswer && selectedAnswer !== round.firstId && (
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

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-300/80 to-pink-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">👂🏆</div>
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

