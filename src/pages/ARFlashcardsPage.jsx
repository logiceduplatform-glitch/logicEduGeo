import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import { LanguageContext } from "../i18n/LanguageContext";
import { AR_DECKS, getDeck } from "../config/arFlashcards";
import { CoinService } from "../services/CoinService";
import { ProgressService } from "../services/ProgressService";

const T = {
  el: {
    title: "📱 AR Flashcards",
    subtitle: "Μάθε με 3D κάρτες πάνω από την κάμερά σου!",
    pickDeck: "Διάλεξε ένα πακέτο:",
    cards: "κάρτες",
    enableCamera: "📷 Ενεργοποίηση Κάμερας",
    cameraDenied: "Δεν δόθηκε άδεια για την κάμερα. Μπορείς να παίξεις και χωρίς AR (κανονικές flashcards).",
    playWithoutAR: "Συνέχεια χωρίς AR",
    flip: "🔄 Γύρνα την κάρτα",
    next: "Επόμενη →",
    prev: "← Προηγούμενη",
    facts: "Φοβερά γεγονότα:",
    answer: "Απάντηση",
    progress: "Κάρτα",
    of: "από",
    finished: "🎉 Ολοκλήρωσες το πακέτο!",
    finishedDesc: "Μπράβο! Πήρες:",
    backToDecks: "← Πίσω στα πακέτα",
    arInfo: "✨ Κίνησε τη συσκευή σου για 3D effect",
    motion: "Ενεργοποίηση κίνησης",
    motionTip: "Κούνα το κινητό για να περιστρέψεις την κάρτα!",
    pinchZoom: "Pinch to zoom",
    info: "AR mode χρησιμοποιεί την κάμερά σου ΜΟΝΟ τοπικά (δεν αποθηκεύεται κανένα video).",
    back: "← Πίσω",
  },
  en: {
    title: "📱 AR Flashcards",
    subtitle: "Learn with 3D cards over your camera!",
    pickDeck: "Pick a deck:",
    cards: "cards",
    enableCamera: "📷 Enable Camera",
    cameraDenied: "Camera access denied. You can still play without AR (regular flashcards).",
    playWithoutAR: "Continue without AR",
    flip: "🔄 Flip card",
    next: "Next →",
    prev: "← Previous",
    facts: "Cool facts:",
    answer: "Answer",
    progress: "Card",
    of: "of",
    finished: "🎉 You finished the deck!",
    finishedDesc: "Awesome! You earned:",
    backToDecks: "← Back to decks",
    arInfo: "✨ Move your device for 3D effect",
    motion: "Enable motion",
    motionTip: "Tilt your phone to rotate the card!",
    pinchZoom: "Pinch to zoom",
    info: "AR mode uses your camera ONLY locally (no video is saved).",
    back: "← Back",
  },
};

export default function ARFlashcardsPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;
  const navigate = useNavigate();
  const { deckId } = useParams();

  const deck = deckId ? getDeck(deckId) : null;

  if (!deck) return <DeckList l={l} lang={lang} />;
  return <DeckPlayer deck={deck} l={l} lang={lang} navigate={navigate} />;
}

function DeckList({ l, lang }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-fuchsia-50 to-pink-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <Navbar />
      <SEO title={l.title} />
      <div className="pt-20 pb-12 px-4">
        <div className="mx-auto max-w-4xl space-y-6">
          <button onClick={() => navigate(-1)} className="text-sm text-slate-500 hover:underline">{l.back}</button>

          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800 dark:text-white">{l.title}</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">{l.subtitle}</p>
          </div>

          <p className="text-center font-bold text-slate-700 dark:text-slate-200">{l.pickDeck}</p>

          <div className="grid sm:grid-cols-2 gap-4">
            {AR_DECKS.map((deck) => (
              <button
                key={deck.id}
                onClick={() => navigate(`/ar-flashcards/${deck.id}`)}
                className={`bg-gradient-to-br ${deck.color} p-6 rounded-3xl text-white shadow-xl hover:scale-105 transition text-left`}
              >
                <div className="text-5xl mb-3">{deck.title[lang] || deck.title.en}</div>
                <p className="text-sm opacity-90">{deck.cards.length} {l.cards}</p>
                <div className="mt-3 flex gap-1 flex-wrap">
                  {deck.cards.slice(0, 6).map((c) => (
                    <span key={c.id} className="text-2xl">{c.emoji}</span>
                  ))}
                </div>
              </button>
            ))}
          </div>

          <div className="bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-xl p-4 text-sm text-violet-800 dark:text-violet-200">
            <p>🔒 {l.info}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeckPlayer({ deck, l, lang, navigate }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const cardRef = useRef(null);
  const [arMode, setArMode] = useState(null); // null = not chosen, true = AR, false = normal
  const [cameraError, setCameraError] = useState(null);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [motionEnabled, setMotionEnabled] = useState(false);
  const [finished, setFinished] = useState(false);
  const pinchRef = useRef({ active: false, dist: 0, baseScale: 1 });

  const card = deck.cards[idx];
  const total = deck.cards.length;

  // Camera setup
  const enableCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setArMode(true);
    } catch (err) {
      console.error("Camera error:", err);
      setCameraError(err.message || "denied");
      setArMode(false);
    }
  };

  // Cleanup camera
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, []);

  // DeviceOrientation tilt for parallax 3D
  useEffect(() => {
    if (!motionEnabled) return;
    const handler = (e) => {
      const beta = e.beta || 0;   // -180..180 (front/back)
      const gamma = e.gamma || 0; // -90..90 (left/right)
      setTilt({ x: Math.max(-20, Math.min(20, gamma)), y: Math.max(-20, Math.min(20, beta - 45)) });
    };
    window.addEventListener("deviceorientation", handler);
    return () => window.removeEventListener("deviceorientation", handler);
  }, [motionEnabled]);

  // Request motion permission (iOS 13+)
  const enableMotion = async () => {
    if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
      try {
        const res = await DeviceOrientationEvent.requestPermission();
        if (res === "granted") setMotionEnabled(true);
      } catch { setMotionEnabled(false); }
    } else {
      setMotionEnabled(true);
    }
  };

  // Mouse-based tilt (desktop fallback) on the card area
  const handleMouseMove = (e) => {
    if (motionEnabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / rect.width;
    const dy = (e.clientY - cy) / rect.height;
    setTilt({ x: dx * 15, y: -dy * 15 });
  };
  const handleMouseLeave = () => {
    if (!motionEnabled) setTilt({ x: 0, y: 0 });
  };

  // Pinch zoom
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchRef.current = { active: true, dist: Math.hypot(dx, dy), baseScale: scale };
    }
  };
  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && pinchRef.current.active) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const d = Math.hypot(dx, dy);
      const s = Math.max(0.6, Math.min(2.5, pinchRef.current.baseScale * (d / pinchRef.current.dist)));
      setScale(s);
    }
  };
  const handleTouchEnd = () => { pinchRef.current.active = false; };

  const next = () => {
    if (idx < total - 1) {
      setIdx(idx + 1);
      setFlipped(false);
      setScale(1);
    } else {
      handleFinish();
    }
  };
  const prev = () => {
    if (idx > 0) {
      setIdx(idx - 1);
      setFlipped(false);
      setScale(1);
    }
  };

  const handleFinish = async () => {
    setFinished(true);
    try {
      CoinService.earn(20, "ar_flashcards");
      ProgressService.addXP?.(50);
    } catch {}
  };

  if (finished) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-100 to-teal-200 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-md text-center shadow-2xl">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white">{l.finished}</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">{l.finishedDesc}</p>
          <div className="mt-4 flex justify-center gap-4">
            <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-xl font-bold">+20 🪙</span>
            <span className="bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 px-4 py-2 rounded-xl font-bold">+50 XP</span>
          </div>
          <button
            onClick={() => navigate("/ar-flashcards")}
            className="mt-6 w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold"
          >
            {l.backToDecks}
          </button>
        </div>
      </div>
    );
  }

  // Initial gate: choose AR or no-AR
  if (arMode === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-fuchsia-50 to-pink-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
        <Navbar />
        <SEO title={l.title} />
        <div className="pt-20 pb-12 px-4">
          <div className="mx-auto max-w-md bg-white dark:bg-slate-800 rounded-3xl p-6 space-y-4 text-center shadow-xl">
            <div className="text-5xl">📱✨</div>
            <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">{deck.title[lang] || deck.title.en}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{l.info}</p>
            <button
              onClick={enableCamera}
              className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold"
            >
              {l.enableCamera}
            </button>
            <button
              onClick={() => setArMode(false)}
              className="w-full py-3 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold"
            >
              {l.playWithoutAR}
            </button>
            {cameraError && <p className="text-xs text-rose-600">{l.cameraDenied}</p>}
          </div>
        </div>
      </div>
    );
  }

  const transform = `perspective(1000px) rotateX(${-tilt.y}deg) rotateY(${tilt.x}deg) scale(${scale}) ${flipped ? "rotateY(180deg)" : ""}`;

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Camera background */}
      {arMode && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Gradient overlay if not AR */}
      {!arMode && <div className={`absolute inset-0 bg-gradient-to-br ${deck.color}`} />}

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10">
        <button
          onClick={() => navigate("/ar-flashcards")}
          className="px-3 py-2 bg-black/60 backdrop-blur text-white rounded-lg text-sm font-bold"
        >
          {l.back}
        </button>
        <div className="px-4 py-2 bg-black/60 backdrop-blur text-white rounded-lg text-sm font-bold">
          {l.progress} {idx + 1} {l.of} {total}
        </div>
      </div>

      {/* Card area */}
      <div
        className="absolute inset-0 flex items-center justify-center px-4 pt-16 pb-32"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          ref={cardRef}
          onClick={() => setFlipped(!flipped)}
          className="relative w-72 h-96 cursor-pointer transition-transform duration-300 ease-out"
          style={{ transform, transformStyle: "preserve-3d" }}
        >
          {/* Front */}
          <div
            className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${deck.color} text-white p-6 flex flex-col items-center justify-center shadow-2xl border-4 border-white/30`}
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="text-9xl drop-shadow-2xl mb-6 animate-bounce-slow">{card.emoji}</div>
            <p className="text-xl font-bold text-center">{card.question[lang] || card.question.en}</p>
            <p className="text-xs opacity-70 mt-4">👆 Tap to flip</p>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 rounded-3xl bg-white text-slate-800 p-6 flex flex-col shadow-2xl border-4 border-violet-300"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <div className="text-6xl text-center mb-2">{card.emoji}</div>
            <p className="text-xs uppercase font-bold text-violet-500 text-center">{l.answer}</p>
            <h3 className="text-3xl font-extrabold text-center text-violet-700 mb-3">{card.answer[lang] || card.answer.en}</h3>
            <p className="text-xs uppercase font-bold text-slate-500">{l.facts}</p>
            <ul className="mt-1 space-y-1 text-sm">
              {(card.facts[lang] || card.facts.en).map((f, i) => (
                <li key={i} className="flex gap-2"><span>✨</span><span>{f}</span></li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* AR hints */}
      {arMode && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-violet-600/80 backdrop-blur text-white text-xs rounded-full">
          {l.arInfo}
        </div>
      )}

      {/* Motion permission button (iOS) */}
      {!motionEnabled && typeof DeviceOrientationEvent !== "undefined" && (
        <button
          onClick={enableMotion}
          className="absolute top-32 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-amber-500 text-white text-xs rounded-full font-bold"
        >
          🎯 {l.motion}
        </button>
      )}

      {/* Bottom controls */}
      <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between gap-3 z-10">
        <button
          onClick={prev}
          disabled={idx === 0}
          className="px-4 py-3 bg-black/60 backdrop-blur text-white rounded-xl font-bold disabled:opacity-40"
        >
          {l.prev}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setFlipped(!flipped); }}
          className="px-5 py-3 bg-violet-600 text-white rounded-xl font-bold shadow-lg"
        >
          {l.flip}
        </button>
        <button
          onClick={next}
          className="px-4 py-3 bg-emerald-500 text-white rounded-xl font-bold shadow-lg"
        >
          {idx === total - 1 ? "🎉" : l.next}
        </button>
      </div>
    </div>
  );
}
