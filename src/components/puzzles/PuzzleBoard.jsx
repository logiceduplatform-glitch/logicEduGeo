import React, { useState, useRef } from "react";
import PuzzlePiece from "./PuzzlePiece";
import puzzlesData from "./data/puzzlesData.json";
import { useQuizProgress } from "../../hooks/useQuizProgress";

export default function PuzzleBoard({ piecesCount = 4, onComplete, lang = "el" }) {
  const [current, setCurrent] = useState(0);
  const [placedPieces, setPlacedPieces] = useState({});
  const [allCompleted, setAllCompleted] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const completeRef = useRef(null);

  const { updateProgress, completeQuiz } = useQuizProgress();

  const puzzle = puzzlesData[current];
  const displayedPieces = puzzle?.pieces.slice(0, piecesCount) || [];
  const isCurrentPuzzleComplete = Object.keys(placedPieces).length === displayedPieces.length;
  const totalPuzzles = puzzlesData.length;

  // Μεταφράσεις τίτλων
  const titleTranslations = {
    "Cat": { el: "Γάτα", en: "Cat" },
    "Dog": { el: "Σκύλος", en: "Dog" },
    "Fish": { el: "Ψάρι", en: "Fish" }
  };

  // Λήψη μεταφρασμένου τίτλου
  const getTranslatedTitle = (title) => {
    return titleTranslations[title]?.[lang] || title;
  };

  if (!completeRef.current) {
    completeRef.current = new Audio("/sounds/correct.mp3");
    completeRef.current.preload = "auto";
  }

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🧩", "⭐", "✨", "🌟", "🎉", "🎊"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const handlePlace = (id) => {
    setPlacedPieces((prev) => {
      const newState = { ...prev, [id]: true };
      const piecesPlaced = Object.keys(newState).length;

      // Show +1 score popup for each piece placed
      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      // 🔥 Ενημέρωση Started bar σε κάθε κομμάτι που τοποθετείται
      const currentProgress = (current * piecesCount) + piecesPlaced;
      updateProgress({
        title: "Image Puzzle",
        score: totalScore,
        total: totalPuzzles * piecesCount,
        index: currentProgress, // Real-time progress: 1, 2, 3, 4, 5, ..., 12
      });

      if (piecesPlaced === displayedPieces.length) {
        completeRef.current?.play().catch(() => {});

        // 🎯 Ενημέρωση σκορ: +4 πόντοι (όσα τα κομμάτια) για κάθε ολοκληρωμένο παζλ
        const newScore = totalScore + displayedPieces.length;
        setTotalScore(newScore);

        // 🔥 Ενημέρωση RightPanel με completion ΑΝΑ ΠΑΖΛ
        // Περνάμε μόνο το σκορ του τρέχοντος παζλ (+4) όχι το cumulative
        completeQuiz({
          title: "Image Puzzle",
          score: displayedPieces.length, // Μόνο +4 για αυτό το παζλ
          total: piecesCount, // Total για ένα παζλ = 4
        });

        // Εμφάνιση ολοκληρωμένης εικόνας
        setShowFullImage(true);

        // Έλεγχος αν τελείωσαν όλα τα παζλ
        if (current + 1 >= puzzlesData.length) {
          // Celebration emojis μόνο στο τελευταίο παζλ
          createCelebrationEmojis();
          setTimeout(() => {
            // Εμφάνιση completion modal
            if (onComplete) {
              onComplete();
            }
            // ΔΕΝ κάνουμε setAllCompleted - αφήνουμε το animation ορατό
          }, 2500);
        } else {
          // Πήγαινε στο επόμενο παζλ μετά από 2.5 δευτερόλεπτα
          setTimeout(() => {
            setShowFullImage(false);
            setPlacedPieces({});
            setCurrent((prev) => prev + 1);
          }, 2500);
        }
      }

      return newState;
    });
  };

  if (!puzzle) {
    return (
      <div className="text-center p-8">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
          {lang === "el" ? "Ολοκληρώθηκαν όλα τα παζλ!" : "All puzzles completed!"}
        </h2>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 rounded-xl shadow-lg p-8 relative overflow-hidden">
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

      {/* Enhanced Progress Bar Header */}
      <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">
              {getTranslatedTitle(puzzle.title)}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === 'el' ? 'Παζλ' : 'Puzzle'} {current + 1}/{puzzlesData.length}
            </p>
          </div>
          <div className="text-2xl font-bold text-orange-600">
            🧩 {totalScore}/{totalPuzzles * piecesCount}
          </div>
        </div>

        {/* Progress Bar - Ανά παζλ */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-400 to-amber-500 transition-all duration-500 ease-out"
              style={{ width: `${Math.round((Object.keys(placedPieces).length / displayedPieces.length) * 100)}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-600">
            {Math.round((Object.keys(placedPieces).length / displayedPieces.length) * 100)}%
          </span>
        </div>

        <div className="text-center mt-2 text-sm text-slate-600">
          {Object.keys(placedPieces).length}/{displayedPieces.length} {lang === 'el' ? 'κομμάτια' : 'pieces'}
        </div>
      </div>

      {/* Puzzle Board */}
      <div
        className="relative mx-auto rounded-3xl shadow-2xl overflow-hidden border-8 border-white"
        style={{
          width: puzzle.width,
          height: puzzle.height,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
        }}
      >
        {/* Puzzle Pieces */}
        {!showFullImage && displayedPieces.map((p) => (
          <PuzzlePiece
            key={p.id}
            piece={p}
            onPlace={handlePlace}
            fullImageSrc={`/images/${puzzle.title.toLowerCase()}.png`}
            pieceWidth={puzzle.width / 2}
            pieceHeight={puzzle.height / 2}
          />
        ))}

        {/* Full Image - Εμφανίζεται όταν ολοκληρώνεται το παζλ */}
        {showFullImage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={`/images/${puzzle.title.toLowerCase()}.png`}
              alt={puzzle.title}
              className="w-full h-full object-cover"
            />
            {/* Overlay με όνομα ζώου (για ΟΛΑ τα παζλ) */}
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="text-white text-4xl font-bold animate-bounce">
                🎉 {getTranslatedTitle(puzzle.title)}! 🎉
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Celebration Overlay - Μόνο στο τελευταίο παζλ - ΚΑΛΥΠΤΕΙ ΟΛΟ ΤΟ BOARD */}
      {showFullImage && current + 1 >= puzzlesData.length && (
        <div className="absolute inset-0 bg-gradient-to-br from-orange-300/80 to-pink-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🧩🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια!" : "Perfect!"}
            </h3>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in;
        }
        @keyframes float-up {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-200px) scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
