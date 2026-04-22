// src/components/games/VehicleSounds.jsx
import React, { useState, useEffect, useRef } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import { VoiceService } from "../../../services/VoiceService";

export default function VehicleSounds({ lang = "el", onComplete }) {
  const [currentVehicle, setCurrentVehicle] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const vehicles = [
    {
      id: "car",
      name: { el: "Αυτοκίνητο", en: "Car" },
      emoji: "🚗",
      sound: { el: "βρουμ βρουμ", en: "vroom vroom" },
      color: "bg-blue-100",
      borderColor: "border-blue-400",
    },
    {
      id: "train",
      name: { el: "Τρένο", en: "Train" },
      emoji: "🚂",
      sound: { el: "τσου τσου", en: "choo choo" },
      color: "bg-red-100",
      borderColor: "border-red-400",
    },
    {
      id: "airplane",
      name: { el: "Αεροπλάνο", en: "Airplane" },
      emoji: "✈️",
      sound: { el: "ζουμ", en: "zoom" },
      color: "bg-sky-100",
      borderColor: "border-sky-400",
    },
    {
      id: "boat",
      name: { el: "Πλοίο", en: "Boat" },
      emoji: "🚢",
      sound: { el: "του του", en: "toot toot" },
      color: "bg-cyan-100",
      borderColor: "border-cyan-400",
    },
    {
      id: "bus",
      name: { el: "Λεωφορείο", en: "Bus" },
      emoji: "🚌",
      sound: { el: "μπρουμ μπρουμ", en: "brum brum" },
      color: "bg-yellow-100",
      borderColor: "border-yellow-400",
    },
    {
      id: "motorcycle",
      name: { el: "Μοτοσυκλέτα", en: "Motorcycle" },
      emoji: "🏍️",
      sound: { el: "βρουμ βρουμ", en: "vroom vroom" },
      color: "bg-orange-100",
      borderColor: "border-orange-400",
    },
  ];

  const TARGET_SCORE = 10;

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    wrongSoundRef.current = new Audio("/sounds/wrong.mp3");
    correctSoundRef.current.preload = "auto";
    wrongSoundRef.current.preload = "auto";

    selectNewVehicle();
  }, []);

  useEffect(() => {
    if (score >= TARGET_SCORE && !showCelebration) {
      setShowCelebration(true);
      setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
      }, 2500);
    }
  }, [score, showCelebration, onComplete]);

  const selectNewVehicle = () => {
    // Επιλογή τυχαίου οχήματος
    const randomVehicle = vehicles[Math.floor(Math.random() * vehicles.length)];
    setCurrentVehicle(randomVehicle);

    // Δημιουργία επιλογών (το σωστό + 2 λάθος)
    const wrongVehicles = vehicles.filter((v) => v.id !== randomVehicle.id);
    const shuffled = wrongVehicles.sort(() => Math.random() - 0.5);
    const selectedWrong = shuffled.slice(0, 2);
    const allOptions = [randomVehicle, ...selectedWrong].sort(
      () => Math.random() - 0.5
    );
    setOptions(allOptions);
    setSelectedOption(null);
  };

  const playVehicleSound = () => {
    if (!currentVehicle || isPlayingSound) return;

    setIsPlayingSound(true);

    const utterance = new SpeechSynthesisUtterance(currentVehicle.sound[lang]);
    utterance.lang = lang === "el" ? "el-GR" : "en-US";
    utterance.rate = 0.8;
    utterance.pitch = 1.2;
    utterance.volume = 1;
    const voice = VoiceService.getVoice(lang);
    if (voice) utterance.voice = voice;

    utterance.onend = () => {
      setIsPlayingSound(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleVehicleSelect = (selectedVehicle) => {
    if (!currentVehicle || feedback !== null) return;

    setSelectedOption(selectedVehicle.id);

    if (selectedVehicle.id === currentVehicle.id) {
      // Σωστή απάντηση! 🎉
      correctSoundRef.current?.play().catch(() => {});
      setFeedback("correct");

      const newScore = score + 1;
      setScore(newScore);

      createCelebrationEmojis();

      // Ενημέρωση RightPanel
      updateProgress({
        title: "Vehicle Sounds",
        score: newScore,
        total: TARGET_SCORE,
        index: newScore,
      });

      // Cup of Month
      completeQuiz({
        title: "Vehicle Sounds",
        score: 1,
        total: 1,
      });

      // Επόμενο όχημα μετά από 1.8 δευτερόλεπτα
      setTimeout(() => {
        setFeedback(null);
        selectNewVehicle();
      }, 1800);
    } else {
      // Λάθος απάντηση ❌
      wrongSoundRef.current?.play().catch(() => {});
      setFeedback("wrong");

      setTimeout(() => {
        setFeedback(null);
        setSelectedOption(null);
      }, 1000);
    }
  };

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🚗", "⭐", "✨", "🌟", "🎉"][Math.floor(Math.random() * 5)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  if (!currentVehicle) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-2xl text-slate-600 dark:text-slate-400">
          {lang === "el" ? "Φόρτωση..." : "Loading..."}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-100 via-cyan-100 to-sky-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 rounded-xl shadow-lg p-8 relative overflow-hidden">
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

      {/* Score Bar - Enhanced */}
      <div className="mb-8">
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
              {lang === "el" ? "Πρόοδος" : "Progress"}
            </h3>
            <div className="text-2xl font-bold text-blue-600">
              🚗 {score}/{TARGET_SCORE}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-cyan-500 transition-all duration-500 ease-out"
                style={{ width: `${(score / TARGET_SCORE) * 100}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              {Math.round((score / TARGET_SCORE) * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">
          {lang === "el" ? "🚗 Βρες το Όχημα!" : "🚗 Find the Vehicle!"}
        </h2>

        {/* Display Current Vehicle Sound with Play Button */}
        <div className="mb-6">
          <p className="text-xl text-slate-700 dark:text-slate-300 mb-4 font-semibold">
            {lang === "el"
              ? "Πάτα το κουμπί για να ακούσεις τον ήχο!"
              : "Press the button to hear the sound!"}
          </p>
          <div className="inline-block bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
            <button
              onClick={playVehicleSound}
              disabled={isPlayingSound}
              className={`
                text-8xl mb-4 transform transition-all duration-200
                hover:scale-110 active:scale-95
                ${isPlayingSound ? "animate-bounce" : ""}
                disabled:opacity-50
              `}
            >
              🔊
            </button>
            <div className="text-4xl font-bold text-slate-800 mt-2">
              "{currentVehicle.sound[lang]}"
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
              {lang === "el"
                ? "Ποιο όχημα κάνει αυτόν τον ήχο;"
                : "Which vehicle makes this sound?"}
            </p>
          </div>
        </div>

        {/* Feedback Message */}
        {feedback === "correct" && (
          <div className="text-4xl font-bold text-green-600 animate-bounce mb-4">
            {lang === "el" ? "Μπράβο! Σωστά! ✅" : "Great! Correct! ✅"}
          </div>
        )}
        {feedback === "wrong" && (
          <div className="text-3xl font-bold text-red-600 animate-shake mb-4">
            {lang === "el" ? "Προσπάθησε ξανά! ❌" : "Try again! ❌"}
          </div>
        )}
      </div>

      {/* Vehicle Options Grid */}
      <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto">
        {options.map((vehicle) => {
          const isSelected = selectedOption === vehicle.id;
          const isCorrect = vehicle.id === currentVehicle.id;
          const showCorrectBorder = feedback === "correct" && isCorrect;
          const showWrongBorder = feedback === "wrong" && isSelected;
          const showCorrectAnswer = feedback === "wrong" && isCorrect;

          return (
            <button
              key={vehicle.id}
              onClick={() => handleVehicleSelect(vehicle)}
              disabled={feedback !== null}
              className={`
                ${vehicle.color}
                border-4 ${vehicle.borderColor}
                p-6 rounded-2xl shadow-lg
                transform transition-all duration-200
                hover:scale-110 hover:shadow-2xl
                active:scale-95
                disabled:cursor-not-allowed
                ${showCorrectBorder ? "ring-8 ring-green-500 scale-110 bg-green-200" : ""}
                ${showWrongBorder ? "ring-8 ring-red-500 scale-95 bg-red-200" : ""}
                ${showCorrectAnswer ? "ring-8 ring-green-500 scale-105 bg-green-200" : ""}
              `}
            >
              <div className="text-8xl mb-3 filter drop-shadow-md">
                {vehicle.emoji}
              </div>
              <p className="text-lg font-bold text-slate-800 dark:text-white">
                {vehicle.name[lang]}
              </p>
              {showCorrectAnswer && (
                <div className="text-2xl mt-2 text-green-700 font-bold">
                  ✓
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-300/90 to-cyan-400/90 flex items-center justify-center rounded-xl z-10">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🚗🏆</div>
            <h3 className="text-4xl font-bold text-white mb-2">
              {lang === "el" ? "Τέλεια!" : "Perfect!"}
            </h3>
            <p className="text-2xl text-white">
              {lang === "el"
                ? "Βρήκες όλα τα οχήματα!"
                : "You found all the vehicles!"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

