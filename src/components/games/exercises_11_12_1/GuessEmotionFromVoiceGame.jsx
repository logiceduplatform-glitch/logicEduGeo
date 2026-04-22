// src/components/games/exercises_11_12_1/GuessEmotionFromVoiceGame.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import { VoiceService } from "../../../services/VoiceService";

export default function GuessEmotionFromVoiceGame({ lang = "el", difficulty = 3, onComplete }) {
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

  const TARGET_ROUNDS = 12;

  const roundsData = {
    el: [
      {
        id: 1,
        text: "Πάλι δεν με κάλεσαν στο πάρτι...",
        correctEmotion: "disappointed",
        voiceSettings: { rate: 0.8, pitch: 0.8, volume: 0.7 },
        options: [
          { id: "disappointed", emoji: "😞", label: "Απογοητευμένος" },
          { id: "happy", emoji: "😊", label: "Χαρούμενος" },
          { id: "angry", emoji: "😠", label: "Θυμωμένος" },
          { id: "bored", emoji: "😒", label: "Βαρεμένος" }
        ]
      },
      {
        id: 2,
        text: "Ναι, φυσικά, δεν πειράζει ΚΑΘΟΛΟΥ.",
        correctEmotion: "sarcastic",
        voiceSettings: { rate: 0.9, pitch: 1.0, volume: 0.9 },
        options: [
          { id: "sarcastic", emoji: "🙄", label: "Σαρκαστικός" },
          { id: "happy", emoji: "😊", label: "Χαρούμενος" },
          { id: "calm", emoji: "😌", label: "Ήρεμος" },
          { id: "sad", emoji: "😢", label: "Λυπημένος" }
        ]
      },
      {
        id: 3,
        text: "Α... εντάξει... δεν... ξέρω τι να πω...",
        correctEmotion: "nervous",
        voiceSettings: { rate: 1.2, pitch: 1.3, volume: 0.7 },
        options: [
          { id: "nervous", emoji: "😬", label: "Νευρικός" },
          { id: "happy", emoji: "😊", label: "Χαρούμενος" },
          { id: "confident", emoji: "😎", label: "Έμπειρος" },
          { id: "sleepy", emoji: "😴", label: "Νυσταγμένος" }
        ]
      },
      {
        id: 4,
        text: "Δεν μπορώ να πιστέψω ότι τα κατάφερα! Πέρασα!",
        correctEmotion: "relieved",
        voiceSettings: { rate: 1.1, pitch: 1.2, volume: 1.0 },
        options: [
          { id: "relieved", emoji: "😮‍💨", label: "Ανακουφισμένος" },
          { id: "sad", emoji: "😢", label: "Λυπημένος" },
          { id: "angry", emoji: "😠", label: "Θυμωμένος" },
          { id: "bored", emoji: "😒", label: "Βαρεμένος" }
        ]
      },
      {
        id: 5,
        text: "Ντάξει, κάνε ό,τι θέλεις. Δεν με νοιάζει πια.",
        correctEmotion: "resigned",
        voiceSettings: { rate: 0.8, pitch: 0.7, volume: 0.6 },
        options: [
          { id: "resigned", emoji: "😐", label: "Παραιτημένος" },
          { id: "excited", emoji: "🤩", label: "Ενθουσιασμένος" },
          { id: "happy", emoji: "😊", label: "Χαρούμενος" },
          { id: "angry", emoji: "😠", label: "Θυμωμένος" }
        ]
      },
      {
        id: 6,
        text: "Θα πρέπει... θα πρέπει να μιλήσω στον καθηγητή σήμερα.",
        correctEmotion: "hesitant",
        voiceSettings: { rate: 0.85, pitch: 0.9, volume: 0.7 },
        options: [
          { id: "hesitant", emoji: "😥", label: "Διστακτικός" },
          { id: "confident", emoji: "😎", label: "Έμπειρος" },
          { id: "happy", emoji: "😊", label: "Χαρούμενος" },
          { id: "angry", emoji: "😠", label: "Θυμωμένος" }
        ]
      },
      {
        id: 7,
        text: "Αυτό ήταν ΤΟΣΟ αστείο! Πέθανα!",
        correctEmotion: "amused",
        voiceSettings: { rate: 1.3, pitch: 1.4, volume: 1.0 },
        options: [
          { id: "amused", emoji: "😂", label: "Διασκεδασμένος" },
          { id: "sad", emoji: "😢", label: "Λυπημένος" },
          { id: "angry", emoji: "😠", label: "Θυμωμένος" },
          { id: "tired", emoji: "😴", label: "Κουρασμένος" }
        ]
      },
      {
        id: 8,
        text: "Μακάρι να μπορούσα να γυρίσω πίσω στο χρόνο...",
        correctEmotion: "regretful",
        voiceSettings: { rate: 0.7, pitch: 0.8, volume: 0.7 },
        options: [
          { id: "regretful", emoji: "😔", label: "Μετανιωμένος" },
          { id: "happy", emoji: "😊", label: "Χαρούμενος" },
          { id: "excited", emoji: "🤩", label: "Ενθουσιασμένος" },
          { id: "proud", emoji: "😎", label: "Περήφανος" }
        ]
      },
      {
        id: 9,
        text: "Πάμε! Σήμερα θα δώσουμε τα πάντα!",
        correctEmotion: "determined",
        voiceSettings: { rate: 1.2, pitch: 1.3, volume: 1.0 },
        options: [
          { id: "determined", emoji: "💪", label: "Αποφασισμένος" },
          { id: "sad", emoji: "😢", label: "Λυπημένος" },
          { id: "scared", emoji: "😨", label: "Φοβισμένος" },
          { id: "bored", emoji: "😒", label: "Βαρεμένος" }
        ]
      },
      {
        id: 10,
        text: "Εσύ πάντα παίρνεις τα εύσημα...",
        correctEmotion: "resentful",
        voiceSettings: { rate: 0.9, pitch: 1.1, volume: 0.8 },
        options: [
          { id: "resentful", emoji: "😤", label: "Πικραμένος" },
          { id: "happy", emoji: "😊", label: "Χαρούμενος" },
          { id: "grateful", emoji: "🙏", label: "Ευγνώμων" },
          { id: "excited", emoji: "🤩", label: "Ενθουσιασμένος" }
        ]
      },
      {
        id: 11,
        text: "Σκέφτομαι μήπως δεν κάνω για αυτό...",
        correctEmotion: "insecure",
        voiceSettings: { rate: 0.8, pitch: 0.85, volume: 0.65 },
        options: [
          { id: "insecure", emoji: "😟", label: "Ανασφαλής" },
          { id: "confident", emoji: "😎", label: "Έμπειρος" },
          { id: "proud", emoji: "😊", label: "Περήφανος" },
          { id: "angry", emoji: "😠", label: "Θυμωμένος" }
        ]
      },
      {
        id: 12,
        text: "Ξέρεις τι; Αρκετά! Θα το κάνω μόνος μου!",
        correctEmotion: "defiant",
        voiceSettings: { rate: 1.3, pitch: 1.3, volume: 1.0 },
        options: [
          { id: "defiant", emoji: "😤", label: "Αποφασιστικός" },
          { id: "sad", emoji: "😢", label: "Λυπημένος" },
          { id: "scared", emoji: "😨", label: "Φοβισμένος" },
          { id: "calm", emoji: "😌", label: "Ήρεμος" }
        ]
      }
    ],
    en: [
      {
        id: 1,
        text: "They didn't invite me to the party again...",
        correctEmotion: "disappointed",
        voiceSettings: { rate: 0.8, pitch: 0.8, volume: 0.7 },
        options: [
          { id: "disappointed", emoji: "😞", label: "Disappointed" },
          { id: "happy", emoji: "😊", label: "Happy" },
          { id: "angry", emoji: "😠", label: "Angry" },
          { id: "bored", emoji: "😒", label: "Bored" }
        ]
      },
      {
        id: 2,
        text: "Yes, of course, it doesn't matter AT ALL.",
        correctEmotion: "sarcastic",
        voiceSettings: { rate: 0.9, pitch: 1.0, volume: 0.9 },
        options: [
          { id: "sarcastic", emoji: "🙄", label: "Sarcastic" },
          { id: "happy", emoji: "😊", label: "Happy" },
          { id: "calm", emoji: "😌", label: "Calm" },
          { id: "sad", emoji: "😢", label: "Sad" }
        ]
      },
      {
        id: 3,
        text: "Oh... okay... I... don't know what to say...",
        correctEmotion: "nervous",
        voiceSettings: { rate: 1.2, pitch: 1.3, volume: 0.7 },
        options: [
          { id: "nervous", emoji: "😬", label: "Nervous" },
          { id: "happy", emoji: "😊", label: "Happy" },
          { id: "confident", emoji: "😎", label: "Confident" },
          { id: "sleepy", emoji: "😴", label: "Sleepy" }
        ]
      },
      {
        id: 4,
        text: "I can't believe I did it! I passed!",
        correctEmotion: "relieved",
        voiceSettings: { rate: 1.1, pitch: 1.2, volume: 1.0 },
        options: [
          { id: "relieved", emoji: "😮‍💨", label: "Relieved" },
          { id: "sad", emoji: "😢", label: "Sad" },
          { id: "angry", emoji: "😠", label: "Angry" },
          { id: "bored", emoji: "😒", label: "Bored" }
        ]
      },
      {
        id: 5,
        text: "Fine, do whatever you want. I don't care anymore.",
        correctEmotion: "resigned",
        voiceSettings: { rate: 0.8, pitch: 0.7, volume: 0.6 },
        options: [
          { id: "resigned", emoji: "😐", label: "Resigned" },
          { id: "excited", emoji: "🤩", label: "Excited" },
          { id: "happy", emoji: "😊", label: "Happy" },
          { id: "angry", emoji: "😠", label: "Angry" }
        ]
      },
      {
        id: 6,
        text: "I should... I should talk to the teacher today.",
        correctEmotion: "hesitant",
        voiceSettings: { rate: 0.85, pitch: 0.9, volume: 0.7 },
        options: [
          { id: "hesitant", emoji: "😥", label: "Hesitant" },
          { id: "confident", emoji: "😎", label: "Confident" },
          { id: "happy", emoji: "😊", label: "Happy" },
          { id: "angry", emoji: "😠", label: "Angry" }
        ]
      },
      {
        id: 7,
        text: "That was SO funny! I'm dying!",
        correctEmotion: "amused",
        voiceSettings: { rate: 1.3, pitch: 1.4, volume: 1.0 },
        options: [
          { id: "amused", emoji: "😂", label: "Amused" },
          { id: "sad", emoji: "😢", label: "Sad" },
          { id: "angry", emoji: "😠", label: "Angry" },
          { id: "tired", emoji: "😴", label: "Tired" }
        ]
      },
      {
        id: 8,
        text: "I wish I could go back in time...",
        correctEmotion: "regretful",
        voiceSettings: { rate: 0.7, pitch: 0.8, volume: 0.7 },
        options: [
          { id: "regretful", emoji: "😔", label: "Regretful" },
          { id: "happy", emoji: "😊", label: "Happy" },
          { id: "excited", emoji: "🤩", label: "Excited" },
          { id: "proud", emoji: "😎", label: "Proud" }
        ]
      },
      {
        id: 9,
        text: "Let's go! Today we give it everything!",
        correctEmotion: "determined",
        voiceSettings: { rate: 1.2, pitch: 1.3, volume: 1.0 },
        options: [
          { id: "determined", emoji: "💪", label: "Determined" },
          { id: "sad", emoji: "😢", label: "Sad" },
          { id: "scared", emoji: "😨", label: "Scared" },
          { id: "bored", emoji: "😒", label: "Bored" }
        ]
      },
      {
        id: 10,
        text: "You always get the credit...",
        correctEmotion: "resentful",
        voiceSettings: { rate: 0.9, pitch: 1.1, volume: 0.8 },
        options: [
          { id: "resentful", emoji: "😤", label: "Resentful" },
          { id: "happy", emoji: "😊", label: "Happy" },
          { id: "grateful", emoji: "🙏", label: "Grateful" },
          { id: "excited", emoji: "🤩", label: "Excited" }
        ]
      },
      {
        id: 11,
        text: "I'm thinking maybe I'm not cut out for this...",
        correctEmotion: "insecure",
        voiceSettings: { rate: 0.8, pitch: 0.85, volume: 0.65 },
        options: [
          { id: "insecure", emoji: "😟", label: "Insecure" },
          { id: "confident", emoji: "😎", label: "Confident" },
          { id: "proud", emoji: "😊", label: "Proud" },
          { id: "angry", emoji: "😠", label: "Angry" }
        ]
      },
      {
        id: 12,
        text: "You know what? Enough! I'll do it myself!",
        correctEmotion: "defiant",
        voiceSettings: { rate: 1.3, pitch: 1.3, volume: 1.0 },
        options: [
          { id: "defiant", emoji: "😤", label: "Defiant" },
          { id: "sad", emoji: "😢", label: "Sad" },
          { id: "scared", emoji: "😨", label: "Scared" },
          { id: "calm", emoji: "😌", label: "Calm" }
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

              <div className="grid grid-cols-2 gap-4 max-w-3xl mx-auto">
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
