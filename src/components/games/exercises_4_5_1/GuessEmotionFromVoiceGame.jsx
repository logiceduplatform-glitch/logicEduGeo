// src/components/games/exercises_4_5_1/GuessEmotionFromVoiceGame.jsx (age 4-5)
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import useSafeTimeout from "../../../hooks/useSafeTimeout";
import { VoiceService } from "../../../services/VoiceService";

export default function GuessEmotionFromVoiceGame({ lang = "el", difficulty = 3, onComplete }) {
  const { safeTimeout } = useSafeTimeout();
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();
  const d = Math.max(1, Math.min(5, difficulty));
  const WRONG_DELAY = [2000, 1800, 1500, 1200, 1000][d - 1];
  const NEXT_DELAY = [3000, 2800, 2500, 2200, 2000][d - 1];

  const TARGET_ROUNDS = 15;

  const roundsData = {
    el: [
      {
        id: 1,
        text: "Τι ωραίο! Αγαπώ το παγωτό!",
        correctEmotion: "happy",
        voiceSettings: { rate: 1.1, pitch: 1.3, volume: 1 },
        options: [
          { id: "happy", emoji: "😊", label: "Χαρούμενο" },
          { id: "sad", emoji: "😢", label: "Λυπημένο" },
          { id: "angry", emoji: "😠", label: "Θυμωμένο" }
        ]
      },
      {
        id: 2,
        text: "Δεν θέλω να φύγεις μαμά...",
        correctEmotion: "sad",
        voiceSettings: { rate: 0.8, pitch: 0.8, volume: 0.7 },
        options: [
          { id: "happy", emoji: "😊", label: "Χαρούμενο" },
          { id: "sad", emoji: "😢", label: "Λυπημένο" },
          { id: "excited", emoji: "🤩", label: "Ενθουσιασμένο" }
        ]
      },
      {
        id: 3,
        text: "Δεν είναι δίκιο! Ήταν δική μου σειρά!",
        correctEmotion: "angry",
        voiceSettings: { rate: 1.3, pitch: 1.4, volume: 1 },
        options: [
          { id: "angry", emoji: "😠", label: "Θυμωμένο" },
          { id: "happy", emoji: "😊", label: "Χαρούμενο" },
          { id: "calm", emoji: "😌", label: "Ήρεμο" }
        ]
      },
      {
        id: 4,
        text: "Τι ήταν αυτός ο θόρυβος;",
        correctEmotion: "scared",
        voiceSettings: { rate: 1.0, pitch: 1.2, volume: 0.7 },
        options: [
          { id: "scared", emoji: "😨", label: "Φοβισμένο" },
          { id: "happy", emoji: "😊", label: "Χαρούμενο" },
          { id: "angry", emoji: "😠", label: "Θυμωμένο" }
        ]
      },
      {
        id: 5,
        text: "Κοίτα! Κοίτα τι μπορώ να κάνω!",
        correctEmotion: "excited",
        voiceSettings: { rate: 1.2, pitch: 1.5, volume: 1 },
        options: [
          { id: "excited", emoji: "🤩", label: "Ενθουσιασμένο" },
          { id: "sad", emoji: "😢", label: "Λυπημένο" },
          { id: "bored", emoji: "😑", label: "Βαρεμένο" }
        ]
      },
      {
        id: 6,
        text: "Αχ! Πονάω!",
        correctEmotion: "hurt",
        voiceSettings: { rate: 0.9, pitch: 0.9, volume: 0.8 },
        options: [
          { id: "hurt", emoji: "😣", label: "Πονεμένο" },
          { id: "happy", emoji: "😊", label: "Χαρούμενο" },
          { id: "excited", emoji: "🤩", label: "Ενθουσιασμένο" }
        ]
      },
      {
        id: 7,
        text: "Τα κατάφερα ολομόνος μου!",
        correctEmotion: "proud",
        voiceSettings: { rate: 1.0, pitch: 1.2, volume: 1 },
        options: [
          { id: "proud", emoji: "😎", label: "Περήφανο" },
          { id: "sad", emoji: "😢", label: "Λυπημένο" },
          { id: "scared", emoji: "😨", label: "Φοβισμένο" }
        ]
      },
      {
        id: 8,
        text: "Νυστάζω πολύ... θέλω ύπνο...",
        correctEmotion: "tired",
        voiceSettings: { rate: 0.7, pitch: 0.8, volume: 0.6 },
        options: [
          { id: "tired", emoji: "😴", label: "Κουρασμένο" },
          { id: "excited", emoji: "🤩", label: "Ενθουσιασμένο" },
          { id: "angry", emoji: "😠", label: "Θυμωμένο" }
        ]
      },
      {
        id: 9,
        text: "Ωωωω! Τι είναι αυτό;",
        correctEmotion: "surprised",
        voiceSettings: { rate: 1.2, pitch: 1.4, volume: 1 },
        options: [
          { id: "surprised", emoji: "😲", label: "Έκπληκτο" },
          { id: "sad", emoji: "😢", label: "Λυπημένο" },
          { id: "calm", emoji: "😌", label: "Ήρεμο" }
        ]
      },
      {
        id: 10,
        text: "Σε αγαπώ πολύ μαμά μου!",
        correctEmotion: "loving",
        voiceSettings: { rate: 0.9, pitch: 1.1, volume: 0.9 },
        options: [
          { id: "loving", emoji: "🥰", label: "Αγαπημένο" },
          { id: "angry", emoji: "😠", label: "Θυμωμένο" },
          { id: "scared", emoji: "😨", label: "Φοβισμένο" }
        ]
      },
      {
        id: 11,
        text: "Θέλω κι εγώ να παίξω!",
        correctEmotion: "excited",
        voiceSettings: { rate: 1.1, pitch: 1.3, volume: 1 },
        options: [
          { id: "excited", emoji: "🤩", label: "Ενθουσιασμένο" },
          { id: "sad", emoji: "😢", label: "Λυπημένο" },
          { id: "tired", emoji: "😴", label: "Κουρασμένο" }
        ]
      },
      {
        id: 12,
        text: "Πού πήγε η μπάλα μου;",
        correctEmotion: "confused",
        voiceSettings: { rate: 0.9, pitch: 1.0, volume: 0.8 },
        options: [
          { id: "confused", emoji: "😕", label: "Μπερδεμένο" },
          { id: "happy", emoji: "😊", label: "Χαρούμενο" },
          { id: "angry", emoji: "😠", label: "Θυμωμένο" }
        ]
      },
      {
        id: 13,
        text: "Μπράβο! Ζωγράφισα ένα σπίτι!",
        correctEmotion: "proud",
        voiceSettings: { rate: 1.1, pitch: 1.3, volume: 1 },
        options: [
          { id: "proud", emoji: "😎", label: "Περήφανο" },
          { id: "sad", emoji: "😢", label: "Λυπημένο" },
          { id: "scared", emoji: "😨", label: "Φοβισμένο" }
        ]
      },
      {
        id: 14,
        text: "Δεν μου αρέσει αυτό το φαγητό...",
        correctEmotion: "displeased",
        voiceSettings: { rate: 0.9, pitch: 0.9, volume: 0.7 },
        options: [
          { id: "displeased", emoji: "😒", label: "Δυσαρεστημένο" },
          { id: "happy", emoji: "😊", label: "Χαρούμενο" },
          { id: "excited", emoji: "🤩", label: "Ενθουσιασμένο" }
        ]
      },
      {
        id: 15,
        text: "Φοβάμαι το σκοτάδι...",
        correctEmotion: "scared",
        voiceSettings: { rate: 0.85, pitch: 1.1, volume: 0.65 },
        options: [
          { id: "scared", emoji: "😨", label: "Φοβισμένο" },
          { id: "happy", emoji: "😊", label: "Χαρούμενο" },
          { id: "angry", emoji: "😠", label: "Θυμωμένο" }
        ]
      }
    ],
    en: [
      {
        id: 1,
        text: "How nice! I love ice cream!",
        correctEmotion: "happy",
        voiceSettings: { rate: 1.1, pitch: 1.3, volume: 1 },
        options: [
          { id: "happy", emoji: "😊", label: "Happy" },
          { id: "sad", emoji: "😢", label: "Sad" },
          { id: "angry", emoji: "😠", label: "Angry" }
        ]
      },
      {
        id: 2,
        text: "I don't want you to go, mommy...",
        correctEmotion: "sad",
        voiceSettings: { rate: 0.8, pitch: 0.8, volume: 0.7 },
        options: [
          { id: "happy", emoji: "😊", label: "Happy" },
          { id: "sad", emoji: "😢", label: "Sad" },
          { id: "excited", emoji: "🤩", label: "Excited" }
        ]
      },
      {
        id: 3,
        text: "It's not fair! It was my turn!",
        correctEmotion: "angry",
        voiceSettings: { rate: 1.3, pitch: 1.4, volume: 1 },
        options: [
          { id: "angry", emoji: "😠", label: "Angry" },
          { id: "happy", emoji: "😊", label: "Happy" },
          { id: "calm", emoji: "😌", label: "Calm" }
        ]
      },
      {
        id: 4,
        text: "What was that noise?",
        correctEmotion: "scared",
        voiceSettings: { rate: 1.0, pitch: 1.2, volume: 0.7 },
        options: [
          { id: "scared", emoji: "😨", label: "Scared" },
          { id: "happy", emoji: "😊", label: "Happy" },
          { id: "angry", emoji: "😠", label: "Angry" }
        ]
      },
      {
        id: 5,
        text: "Look! Look what I can do!",
        correctEmotion: "excited",
        voiceSettings: { rate: 1.2, pitch: 1.5, volume: 1 },
        options: [
          { id: "excited", emoji: "🤩", label: "Excited" },
          { id: "sad", emoji: "😢", label: "Sad" },
          { id: "bored", emoji: "😑", label: "Bored" }
        ]
      },
      {
        id: 6,
        text: "Ouch! It hurts!",
        correctEmotion: "hurt",
        voiceSettings: { rate: 0.9, pitch: 0.9, volume: 0.8 },
        options: [
          { id: "hurt", emoji: "😣", label: "Hurt" },
          { id: "happy", emoji: "😊", label: "Happy" },
          { id: "excited", emoji: "🤩", label: "Excited" }
        ]
      },
      {
        id: 7,
        text: "I did it all by myself!",
        correctEmotion: "proud",
        voiceSettings: { rate: 1.0, pitch: 1.2, volume: 1 },
        options: [
          { id: "proud", emoji: "😎", label: "Proud" },
          { id: "sad", emoji: "😢", label: "Sad" },
          { id: "scared", emoji: "😨", label: "Scared" }
        ]
      },
      {
        id: 8,
        text: "I'm so sleepy... I want to sleep...",
        correctEmotion: "tired",
        voiceSettings: { rate: 0.7, pitch: 0.8, volume: 0.6 },
        options: [
          { id: "tired", emoji: "😴", label: "Tired" },
          { id: "excited", emoji: "🤩", label: "Excited" },
          { id: "angry", emoji: "😠", label: "Angry" }
        ]
      },
      {
        id: 9,
        text: "Wooow! What is that?",
        correctEmotion: "surprised",
        voiceSettings: { rate: 1.2, pitch: 1.4, volume: 1 },
        options: [
          { id: "surprised", emoji: "😲", label: "Surprised" },
          { id: "sad", emoji: "😢", label: "Sad" },
          { id: "calm", emoji: "😌", label: "Calm" }
        ]
      },
      {
        id: 10,
        text: "I love you so much mommy!",
        correctEmotion: "loving",
        voiceSettings: { rate: 0.9, pitch: 1.1, volume: 0.9 },
        options: [
          { id: "loving", emoji: "🥰", label: "Loving" },
          { id: "angry", emoji: "😠", label: "Angry" },
          { id: "scared", emoji: "😨", label: "Scared" }
        ]
      },
      {
        id: 11,
        text: "I want to play too!",
        correctEmotion: "excited",
        voiceSettings: { rate: 1.1, pitch: 1.3, volume: 1 },
        options: [
          { id: "excited", emoji: "🤩", label: "Excited" },
          { id: "sad", emoji: "😢", label: "Sad" },
          { id: "tired", emoji: "😴", label: "Tired" }
        ]
      },
      {
        id: 12,
        text: "Where did my ball go?",
        correctEmotion: "confused",
        voiceSettings: { rate: 0.9, pitch: 1.0, volume: 0.8 },
        options: [
          { id: "confused", emoji: "😕", label: "Confused" },
          { id: "happy", emoji: "😊", label: "Happy" },
          { id: "angry", emoji: "😠", label: "Angry" }
        ]
      },
      {
        id: 13,
        text: "Yay! I drew a house!",
        correctEmotion: "proud",
        voiceSettings: { rate: 1.1, pitch: 1.3, volume: 1 },
        options: [
          { id: "proud", emoji: "😎", label: "Proud" },
          { id: "sad", emoji: "😢", label: "Sad" },
          { id: "scared", emoji: "😨", label: "Scared" }
        ]
      },
      {
        id: 14,
        text: "I don't like this food...",
        correctEmotion: "displeased",
        voiceSettings: { rate: 0.9, pitch: 0.9, volume: 0.7 },
        options: [
          { id: "displeased", emoji: "😒", label: "Displeased" },
          { id: "happy", emoji: "😊", label: "Happy" },
          { id: "excited", emoji: "🤩", label: "Excited" }
        ]
      },
      {
        id: 15,
        text: "I'm scared of the dark...",
        correctEmotion: "scared",
        voiceSettings: { rate: 0.85, pitch: 1.1, volume: 0.65 },
        options: [
          { id: "scared", emoji: "😨", label: "Scared" },
          { id: "happy", emoji: "😊", label: "Happy" },
          { id: "angry", emoji: "😠", label: "Angry" }
        ]
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

    // Auto-play voice after 1 second
    const timer = safeTimeout(() => {
      playVoice();
    }, 1000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRound]);

  const playVoice = () => {
    if ('speechSynthesis' in window && !isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(true);

      const utterance = new SpeechSynthesisUtterance(round.text);
      utterance.lang = lang === 'el' ? 'el-GR' : 'en-US';
      utterance.rate = round.voiceSettings.rate;
      utterance.pitch = round.voiceSettings.pitch;
      utterance.volume = round.voiceSettings.volume;

      utterance.onend = () => {
        setIsPlaying(false);
      };

      const voice = VoiceService.getVoice(lang);
      if (voice) utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    }
  };

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "✅", "👂"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    safeTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const handleAnswerSelect = (answerId) => {
    if (showAnswer) return;

    setSelectedAnswer(answerId);
    setShowAnswer(true);

    const isCorrect = answerId === round.correctEmotion;

    if (isCorrect) {
      correctSoundRef.current?.play().catch(() => {});

      const newScore = score + 1;
      setScore(newScore);

      setScorePopup({ id: Date.now(), x: 50 });
      safeTimeout(() => setScorePopup(null), 1000);

      updateProgress({
        title: "Guess Emotion From Voice Game",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      completeQuiz({
        title: "Guess Emotion From Voice Game",
        score: 1,
        total: 1,
      });

      safeTimeout(() => {
        if (currentRound + 1 < TARGET_ROUNDS) {
          setCurrentRound(prev => prev + 1);
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

  const progressPercent = Math.round(((currentRound + 1) / TARGET_ROUNDS) * 100);
  const correctOption = round.options.find(opt => opt.id === round.correctEmotion);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-rose-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Μάντεψε το Συναίσθημα" : "Guess the Emotion"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Επίπεδο ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Level ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-purple-600">
            👂 {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-400 to-pink-500 transition-all duration-500 ease-out"
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
        <div className="inline-block bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl border-4 border-purple-400">
          <div className="text-7xl mb-3">👂</div>
          <h2 className="text-3xl font-bold mb-3 text-slate-800">
            {lang === "el" ? "Άκου τη φωνή!" : "Listen to the voice!"}
          </h2>
          <button
            onClick={playVoice}
            disabled={isPlaying}
            className={`px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-2xl font-bold rounded-full hover:scale-105 transition-transform shadow-lg ${
              isPlaying ? 'opacity-50 cursor-not-allowed animate-pulse' : ''
            }`}
          >
            🔊 {lang === "el" ? "Άκουσε Ξανά" : "Listen Again"}
          </button>
        </div>
      </div>

      {/* Game Area */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border-4 border-purple-400">
          {/* Voice Display */}
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-10 border-4 border-purple-400 mb-8 shadow-lg">
            <div className="flex flex-col items-center justify-center gap-6">
              {/* Sound waves animation */}
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 bg-purple-500 rounded-full ${isPlaying ? 'animate-pulse' : ''}`}
                    style={{
                      height: isPlaying ? `${40 + Math.random() * 40}px` : '20px',
                      animationDelay: `${i * 0.1}s`,
                      transition: 'height 0.3s ease'
                    }}
                  />
                ))}
              </div>

              {/* Speaker icon */}
              <div className={`text-9xl ${isPlaying ? 'animate-bounce' : ''}`}>
                🔊
              </div>

              {/* Text preview (shown after playing) */}
              {!isPlaying && (
                <div className="bg-white/90 rounded-2xl p-6 border-4 border-purple-300 max-w-2xl">
                  <p className="text-xl font-bold text-center text-slate-800 italic">
                    "{round.text}"
                  </p>
                </div>
              )}

              {isPlaying && (
                <div className="bg-yellow-100 rounded-2xl p-4 border-4 border-yellow-400">
                  <p className="text-xl font-bold text-yellow-700 animate-pulse">
                    {lang === "el" ? "Άκου προσεκτικά..." : "Listen carefully..."}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Answer Options */}
          {!showAnswer && !isPlaying && (
            <>
              <p className="text-2xl font-bold text-center text-slate-700 mb-6">
                {lang === "el" ? "Πώς νιώθει η φωνή;" : "How does the voice feel?"}
              </p>

              <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
                {round.options.map((option) => {
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleAnswerSelect(option.id)}
                      className="p-6 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 border-4 border-purple-300 hover:border-purple-500 transition-all duration-200 transform hover:scale-105 shadow-lg flex flex-col items-center cursor-pointer"
                    >
                      <div className="text-8xl mb-3">{option.emoji}</div>
                      <p className="text-lg font-bold text-slate-700 text-center">
                        {option.label}
                      </p>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Show Answer */}
          {showAnswer && selectedAnswer === round.correctEmotion && (
            <div className="text-center animate-fadeIn">
              <div className="inline-block bg-green-100 rounded-3xl p-8 border-4 border-green-400">
                <div className="flex items-center justify-center gap-6 mb-4">
                  <div className="text-9xl">{correctOption.emoji}</div>
                  <div className="text-8xl">✅</div>
                </div>
                <p className="text-3xl font-bold text-green-700 mb-4">
                  {lang === "el"
                    ? `🎉 Σωστά! Η φωνή ακούγεται ${correctOption.label}!`
                    : `🎉 Correct! The voice sounds ${correctOption.label}!`}
                </p>
              </div>
            </div>
          )}

          {showAnswer && selectedAnswer !== round.correctEmotion && (
            <div className="text-center animate-fadeIn">
              <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
                <p className="text-3xl font-bold text-red-700">
                  {lang === "el"
                    ? `Άκου ξανά! Πώς ακούγεται η φωνή;`
                    : `Listen again! How does the voice sound?`}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-300/80 to-pink-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">👂🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Ακούς πολύ καλά τα συναισθήματα!" : "Perfect! You hear emotions very well!"}
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
