import React, { useState, useEffect, useRef } from "react";

export default function PuzzlePiece({ piece, onPlace, fullImageSrc, pieceWidth = 150, pieceHeight = 150 }) {
  const [placed, setPlaced] = useState(false);
  const correctRef = useRef(null);

  useEffect(() => {
    correctRef.current = new Audio("/sounds/correct.mp3");
    correctRef.current.preload = "auto";
  }, []);

  const handleTap = () => {
    if (placed) return;
    setPlaced(true);
    correctRef.current?.play().catch(() => {});
    onPlace(piece.id);
  };

  // Υπολογισμός τυχαίας θέσης (μόνο μία φορά)
  const [randomPos] = useState({
    left: Math.random() * 80 + 10,
    top: Math.random() * 80 + 10
  });

  return (
    <div
      onClick={handleTap}
      className={`absolute transition-all duration-500 cursor-pointer border-2 rounded
        ${placed ? "opacity-100 scale-100 border-white" : "opacity-80 scale-95 border-slate-300 hover:border-blue-400"}`}
      style={{
        width: pieceWidth,
        height: pieceHeight,
        left: placed ? piece.x : randomPos.left,
        top: placed ? piece.y : randomPos.top,
        backgroundImage: `url(${fullImageSrc})`,
        backgroundPosition: `-${piece.x}px -${piece.y}px`,
        backgroundSize: '300px 300px',
        backgroundRepeat: 'no-repeat',
        boxShadow: placed ? 'none' : '0 4px 6px rgba(0,0,0,0.2)',
      }}
    />
  );
}
