// src/components/games/MusicalPiano.jsx
import React, { useState, useRef } from "react";

export default function MusicalPiano({ lang = "el", onComplete }) {
  const [activeKey, setActiveKey] = useState(null);
  const [particles, setParticles] = useState([]);
  const [currentNote, setCurrentNote] = useState(null);
  const [notesPlayed, setNotesPlayed] = useState(0);
  const audioContextRef = useRef(null);

  const keys = [
    { id: 1, note: "C", frequency: 261.63, color: "bg-red-400", name: { el: "Ντο", en: "C" } },
    { id: 2, note: "D", frequency: 293.66, color: "bg-orange-400", name: { el: "Ρε", en: "D" } },
    { id: 3, note: "E", frequency: 329.63, color: "bg-yellow-400", name: { el: "Μι", en: "E" } },
    { id: 4, note: "F", frequency: 349.23, color: "bg-green-400", name: { el: "Φα", en: "F" } },
    { id: 5, note: "G", frequency: 392.00, color: "bg-blue-400", name: { el: "Σολ", en: "G" } },
    { id: 6, note: "A", frequency: 440.00, color: "bg-indigo-400", name: { el: "Λα", en: "A" } },
    { id: 7, note: "B", frequency: 493.88, color: "bg-purple-400", name: { el: "Σι", en: "B" } },
  ];

  const playNote = (frequency, keyId) => {
    // Initialize AudioContext if needed
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    const audioContext = audioContextRef.current;

    // Create oscillator
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = "sine";

    // Envelope
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);

    // Visual feedback
    setActiveKey(keyId);
    setNotesPlayed((n) => n + 1);
    setTimeout(() => setActiveKey(null), 200);

    // Set current note display
    const key = keys.find(k => k.id === keyId);
    setCurrentNote(key);
    setTimeout(() => setCurrentNote(null), 800);

    // Create particles
    createParticles(keyId);
  };

  const createParticles = (keyId) => {
    const key = keys.find(k => k.id === keyId);
    const ids = new Set(Array.from({ length: 6 }, (_, i) => Date.now() + i));
    const newParticles = [...ids].map((id) => ({
      id,
      x: (keyId - 1) * 14.28 + 7,
      color: key.color.replace("bg-", "text-"),
      delay: Math.random() * 0.2,
    }));

    setParticles(prev => [...prev, ...newParticles]);

    setTimeout(() => {
      setParticles(prev => prev.filter(p => !ids.has(p.id)));
    }, 1000);
  };

  const handleKeyPress = (key) => {
    playNote(key.frequency, key.id);
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 p-4 sm:p-8 flex flex-col items-center justify-center">
      {/* Header */}
      <div className="max-w-4xl w-full mb-12">
        <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">
            {lang === "el" ? "🎵 Μουσικό Πιάνο! 🎵" : "🎵 Musical Piano! 🎵"}
          </h2>
          <p className="text-lg text-slate-600">
            {lang === "el"
              ? "Πάτα τα πλήκτρα για να παίξεις μουσική!"
              : "Tap the keys to play music!"}
          </p>
        </div>
      </div>

      {/* Current Note Display */}
      <div className="w-full max-w-4xl mb-6">
        <div className={`
          ${currentNote ? currentNote.color : 'bg-slate-300'}
          rounded-2xl shadow-2xl p-6 text-center
          transform transition-all duration-300
          ${currentNote ? 'scale-100 opacity-100' : 'scale-95 opacity-50'}
          border-4 border-white
        `}>
          <div className="text-white font-bold">
            <div className="text-6xl sm:text-7xl mb-2 drop-shadow-lg animate-pulse">
              {currentNote ? '♪' : '♫'}
            </div>
            <div className="text-3xl sm:text-4xl drop-shadow-md">
              {currentNote
                ? `${currentNote.name[lang]} (${currentNote.note})`
                : lang === "el" ? "Πάτα ένα πλήκτρο!" : "Press a key!"}
            </div>
          </div>
        </div>
      </div>

      {/* Piano Container */}
      <div className="relative w-full max-w-4xl">
        {/* Piano Keys */}
        <div className="relative bg-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 border-8 border-slate-700 overflow-hidden">
          <div className="grid grid-cols-7 gap-2 sm:gap-3">
            {keys.map((key) => (
              <button
                key={key.id}
                onMouseDown={() => handleKeyPress(key)}
                onTouchStart={(e) => {
                  e.preventDefault();
                  handleKeyPress(key);
                }}
                className={`
                  ${key.color}
                  h-48 sm:h-64 rounded-2xl shadow-xl
                  flex flex-col items-center justify-end pb-6
                  transform transition-all duration-100
                  hover:scale-105 active:scale-95
                  border-4 border-white/50
                  ${activeKey === key.id ? "scale-95 brightness-110" : ""}
                  relative overflow-hidden
                `}
              >
                {/* Note Name */}
                <div className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg mb-2">
                  {key.name[lang]}
                </div>

                {/* Musical Note Emoji */}
                <div className="text-4xl sm:text-5xl">
                  🎵
                </div>

                {/* Shine Effect */}
                {activeKey === key.id && (
                  <div className="absolute inset-0 bg-white/30 animate-ping" />
                )}
              </button>
            ))}
          </div>

          {/* Piano Brand */}
          <div className="text-center mt-6 text-white/60 font-serif text-sm">
            🎹 Kids Piano 🎹
          </div>

          {/* Floating Particles - Inside piano container */}
          {particles.map((particle) => (
            <div
              key={particle.id}
              className={`absolute text-4xl pointer-events-none animate-floatUp ${particle.color}`}
              style={{
                left: `${particle.x}%`,
                bottom: "10%",
                animationDelay: `${particle.delay}s`,
              }}
            >
              ♪
            </div>
          ))}
        </div>

        {/* Sound Waves Decoration */}
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-6xl animate-bounce">
          🎶
        </div>
      </div>

      {/* Instructions & Done */}
      <div className="max-w-4xl w-full mt-8">
        <div className="bg-white/80 backdrop-blur rounded-lg shadow p-4 text-center">
          <p className="text-slate-700 font-medium">
            {lang === "el"
              ? "✨ Δεν υπάρχουν κανόνες - απλά παίξε και διασκέδασε! ✨"
              : "✨ No rules - just play and have fun! ✨"}
          </p>
          {onComplete && (
            <button
              onClick={onComplete}
              disabled={notesPlayed < 3}
              className={`mt-4 px-8 py-3 rounded-full text-lg font-bold shadow-lg transition-all duration-300 ${
                notesPlayed >= 3
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-105 hover:shadow-xl"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              {lang === "el"
                ? notesPlayed >= 3 ? "✅ Τέλειωσα!" : `🎵 Παίξε ${3 - notesPlayed} ακόμα νότες…`
                : notesPlayed >= 3 ? "✅ Done!" : `🎵 Play ${3 - notesPlayed} more notes…`}
            </button>
          )}
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-150px) scale(1.5);
            opacity: 0;
          }
        }
        .animate-floatUp {
          animation: floatUp 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

