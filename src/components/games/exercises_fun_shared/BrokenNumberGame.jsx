// src/components/games/BrokenNumberGame.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import { VoiceService } from "../../../services/VoiceService";

export default function BrokenNumberGame({ lang = "el", onComplete, difficulty = 3 }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [pieces, setPieces] = useState([]);
  const [assembledPieces, setAssembledPieces] = useState([]);
  const [draggedPiece, setDraggedPiece] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const TARGET_ROUNDS = 10; // 10 αριθμοί

  const roundsData = {
    el: [
      {
        id: 1,
        question: "Συνέθεσε τον αριθμό",
        number: "123",
        pieces: ["1", "2", "3"],
        color: "#EF4444"
      },
      {
        id: 2,
        question: "Συνέθεσε τον αριθμό",
        number: "456",
        pieces: ["4", "5", "6"],
        color: "#10B981"
      },
      {
        id: 3,
        question: "Συνέθεσε τον αριθμό",
        number: "789",
        pieces: ["7", "8", "9"],
        color: "#3B82F6"
      },
      {
        id: 4,
        question: "Συνέθεσε τον αριθμό",
        number: "234",
        pieces: ["2", "3", "4"],
        color: "#EAB308"
      },
      {
        id: 5,
        question: "Συνέθεσε τον αριθμό",
        number: "567",
        pieces: ["5", "6", "7"],
        color: "#EC4899"
      },
      {
        id: 6,
        question: "Συνέθεσε τον αριθμό",
        number: "345",
        pieces: ["3", "4", "5"],
        color: "#A855F7"
      },
      {
        id: 7,
        question: "Συνέθεσε τον αριθμό",
        number: "678",
        pieces: ["6", "7", "8"],
        color: "#14B8A6"
      },
      {
        id: 8,
        question: "Συνέθεσε τον αριθμό",
        number: "321",
        pieces: ["3", "2", "1"],
        color: "#F59E0B"
      },
      {
        id: 9,
        question: "Συνέθεσε τον αριθμό",
        number: "654",
        pieces: ["6", "5", "4"],
        color: "#06B6D4"
      },
      {
        id: 10,
        question: "Συνέθεσε τον αριθμό",
        number: "987",
        pieces: ["9", "8", "7"],
        color: "#8B5CF6"
      }
    ],
    en: [
      {
        id: 1,
        question: "Assemble the number",
        number: "123",
        pieces: ["1", "2", "3"],
        color: "#EF4444"
      },
      {
        id: 2,
        question: "Assemble the number",
        number: "456",
        pieces: ["4", "5", "6"],
        color: "#10B981"
      },
      {
        id: 3,
        question: "Assemble the number",
        number: "789",
        pieces: ["7", "8", "9"],
        color: "#3B82F6"
      },
      {
        id: 4,
        question: "Assemble the number",
        number: "234",
        pieces: ["2", "3", "4"],
        color: "#EAB308"
      },
      {
        id: 5,
        question: "Assemble the number",
        number: "567",
        pieces: ["5", "6", "7"],
        color: "#EC4899"
      },
      {
        id: 6,
        question: "Assemble the number",
        number: "345",
        pieces: ["3", "4", "5"],
        color: "#A855F7"
      },
      {
        id: 7,
        question: "Assemble the number",
        number: "678",
        pieces: ["6", "7", "8"],
        color: "#14B8A6"
      },
      {
        id: 8,
        question: "Assemble the number",
        number: "321",
        pieces: ["3", "2", "1"],
        color: "#F59E0B"
      },
      {
        id: 9,
        question: "Assemble the number",
        number: "654",
        pieces: ["6", "5", "4"],
        color: "#06B6D4"
      },
      {
        id: 10,
        question: "Assemble the number",
        number: "987",
        pieces: ["9", "8", "7"],
        color: "#8B5CF6"
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
    // Shuffle pieces when round changes
    const shuffledPieces = [...round.pieces]
      .sort(() => Math.random() - 0.5)
      .map((piece, index) => ({ id: index, value: piece }));
    setPieces(shuffledPieces);
    setAssembledPieces([]);
    setShowAnswer(false);
  }, [currentRound]);

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "🔢", "✅"][Math.floor(Math.random() * 6)],
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
        ? `Συνέθεσε τον αριθμό ${round.number.split('').join(', ')}`
        : `Assemble the number ${round.number.split('').join(', ')}`;

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
    // Speak question automatically when round changes
    const timer = setTimeout(() => {
      speakQuestion();
    }, 500);
    return () => clearTimeout(timer);
  }, [currentRound]);

  const handleDragStart = (piece, source) => {
    setDraggedPiece({ piece, source });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDropToAssembly = (targetIndex) => {
    if (!draggedPiece) return;

    const { piece, source } = draggedPiece;

    if (source === 'pieces') {
      // Coming from pieces area - simple insert
      setPieces(prev => prev.filter(p => p.id !== piece.id));

      setAssembledPieces(prev => {
        const newAssembled = [...prev];
        newAssembled.splice(targetIndex, 0, piece);
        return newAssembled;
      });
    } else if (source === 'assembled') {
      // Rearranging within assembled area
      setAssembledPieces(prev => {
        const currentIndex = prev.findIndex(p => p.id === piece.id);
        if (currentIndex === -1 || currentIndex === targetIndex) return prev;

        // Remove from current position
        const newAssembled = [...prev];
        newAssembled.splice(currentIndex, 1);

        // Calculate new target index after removal
        const finalIndex = currentIndex < targetIndex ? targetIndex - 1 : targetIndex;

        // Insert at new position
        newAssembled.splice(finalIndex, 0, piece);
        return newAssembled;
      });
    }

    setDraggedPiece(null);
  };

  const handleDropToPieces = () => {
    if (!draggedPiece) return;
    if (draggedPiece.source === 'pieces') return;

    const { piece } = draggedPiece;

    // Remove from assembled
    setAssembledPieces(prev => prev.filter(p => p.id !== piece.id));

    // Add back to pieces
    setPieces(prev => [...prev, piece]);

    setDraggedPiece(null);
  };

  const handleCheckAnswer = () => {
    const assembledNumber = assembledPieces.map(p => p.value).join('');
    const isCorrect = assembledNumber === round.number;

    setShowAnswer(true);

    if (isCorrect) {
      correctSoundRef.current?.play().catch(() => {});

      const newScore = score + 1;
      setScore(newScore);

      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      updateProgress({
        title: "Broken Number Game",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      completeQuiz({
        title: "Broken Number Game",
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
        setShowAnswer(false);
      }, WRONG_DELAY);
    }
  };

  const progressPercent = Math.round(((currentRound + 1) / TARGET_ROUNDS) * 100);

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
              {lang === "el" ? "Ανακατεμένος Αριθμός" : "Broken Number"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Αριθμός ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Number ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-blue-600">
            🔢 {score}
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

      <div className="text-center mb-6">
        <div className="inline-block bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl border-4" style={{ borderColor: round.color }}>
          <div className="text-7xl mb-3">🔢</div>
          <h2 className="text-2xl font-bold mb-3 text-slate-800">
            {round.question}
          </h2>

          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 rounded-xl mb-3">
            <p className="text-5xl font-bold" style={{ color: round.color }}>
              {round.number}
            </p>
          </div>

          <button
            onClick={speakQuestion}
            className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-lg font-bold rounded-full hover:scale-105 transition-transform shadow-lg"
          >
            🔊 {lang === "el" ? "Άκουσε" : "Listen"}
          </button>
        </div>
      </div>

      {/* Assembly Area */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border-4 min-h-[180px]" style={{ borderColor: round.color }}>
          <p className="text-center text-2xl font-bold text-slate-800 mb-4">
            {lang === "el" ? "Σύνθεσε εδώ" : "Assemble here"}
          </p>

          <div className="flex justify-center items-center gap-2 min-h-[100px]">
            {assembledPieces.length === 0 ? (
              <div
                className="w-full h-24 flex items-center justify-center text-2xl text-slate-400 border-4 border-dashed border-slate-300 rounded-2xl"
                onDragOver={handleDragOver}
                onDrop={() => handleDropToAssembly(0)}
              >
                {lang === "el" ? "Σύρε τα ψηφία εδώ" : "Drag digits here"}
              </div>
            ) : (
              <>
                {/* Drop zone before first piece */}
                <div
                  className="w-12 h-24 flex items-center justify-center border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all"
                  onDragOver={handleDragOver}
                  onDrop={() => handleDropToAssembly(0)}
                >
                  <span className="text-2xl text-slate-300">+</span>
                </div>

                {assembledPieces.map((piece, index) => (
                  <React.Fragment key={piece.id}>
                    {/* The piece */}
                    <div
                      draggable={!showAnswer}
                      onDragStart={() => handleDragStart(piece, 'assembled')}
                      className={`
                        w-24 h-24 flex items-center justify-center text-6xl font-bold
                        rounded-2xl border-4 transition-all duration-300
                        ${!showAnswer ? 'cursor-move hover:scale-110' : 'cursor-not-allowed'}
                        ${draggedPiece?.piece.id === piece.id ? 'opacity-50' : 'opacity-100'}
                        bg-gradient-to-br from-cyan-100 to-blue-100
                      `}
                      style={{
                        borderColor: round.color,
                        color: round.color
                      }}
                    >
                      {piece.value}
                    </div>

                    {/* Drop zone after this piece */}
                    <div
                      className="w-12 h-24 flex items-center justify-center border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all"
                      onDragOver={handleDragOver}
                      onDrop={() => handleDropToAssembly(index + 1)}
                    >
                      <span className="text-2xl text-slate-300">+</span>
                    </div>
                  </React.Fragment>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Available Pieces */}
      <div className="max-w-5xl mx-auto mb-6">
        <div
          onDragOver={handleDragOver}
          onDrop={handleDropToPieces}
          className="bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl border-4 border-slate-300 min-h-[150px]"
        >
          <p className="text-center text-xl font-bold text-slate-700 mb-4">
            {lang === "el" ? "Κομμάτια Αριθμού" : "Number Pieces"}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {pieces.map((piece) => (
              <div
                key={piece.id}
                draggable={!showAnswer}
                onDragStart={() => handleDragStart(piece, 'pieces')}
                className={`
                  w-24 h-24 flex items-center justify-center text-6xl font-bold
                  bg-white rounded-2xl border-4 border-slate-400 shadow-lg
                  transition-all duration-300
                  ${!showAnswer ? 'cursor-move hover:scale-110 hover:shadow-xl' : 'cursor-not-allowed opacity-70'}
                  ${draggedPiece?.piece.id === piece.id ? 'opacity-50' : 'opacity-100'}
                `}
                style={{ color: round.color }}
              >
                {piece.value}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Check Button */}
      {!showAnswer && assembledPieces.length === round.pieces.length && (
        <div className="text-center mb-8">
          <button
            onClick={handleCheckAnswer}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-2xl font-bold rounded-full hover:scale-105 transition-transform shadow-lg"
          >
            ✓ {lang === "el" ? "Έλεγχος" : "Check"}
          </button>
        </div>
      )}

      {showAnswer && (
        <div className="text-center animate-fadeIn">
          {assembledPieces.map(p => p.value).join('') === round.number ? (
            <div className="bg-green-100 rounded-2xl p-6 inline-block border-4 border-green-400">
              <p className="text-3xl font-bold text-green-700">
                {lang === "el"
                  ? `🎉 Τέλεια! Συνέθεσες τον αριθμό ${round.number}!`
                  : `🎉 Perfect! You assembled the number ${round.number}!`}
              </p>
            </div>
          ) : (
            <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
              <p className="text-3xl font-bold text-red-700">
                {lang === "el"
                  ? `Προσπάθησε ξανά! Ο σωστός αριθμός είναι ${round.number}`
                  : `Try again! The correct number is ${round.number}`}
              </p>
            </div>
          )}
        </div>
      )}

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-300/80 to-indigo-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🔢🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Ξέρεις να συνθέτεις αριθμούς!" : "Perfect! You know how to assemble numbers!"}
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

