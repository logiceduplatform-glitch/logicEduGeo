// src/components/games/exercises_4_5/StoryChoices.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import { VoiceService } from "../../../services/VoiceService";

export default function StoryChoices({ lang = "el", onComplete }) {
  const [currentStory, setCurrentStory] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const [isReading, setIsReading] = useState(false);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const TARGET_STORIES = 5; // 5 ιστορίες

  const storiesData = {
    el: [
      {
        id: 1,
        title: "Η Μέλισσα και το Λουλούδι",
        images: ["🐝", "🌸", "🍯"],
        text: "Μια μικρή μέλισσα πετούσε στον κήπο. Βρήκε ένα όμορφο κόκκινο λουλούδι. Η μέλισσα μάζεψε γύρη και έφτιαξε μέλι.",
        question: "Τι έκανε η μέλισσα μετά;",
        options: [
          { id: 1, text: "Έφτιαξε μέλι", emoji: "🍯", correct: true },
          { id: 2, text: "Πήγε σπίτι", emoji: "🏠", correct: false },
          { id: 3, text: "Κοιμήθηκε", emoji: "😴", correct: false },
        ]
      },
      {
        id: 2,
        title: "Το Γατάκι και το Γάλα",
        images: ["🐱", "🥛", "😺"],
        text: "Ένα μικρό γατάκι είχε πολλή πείνα. Η μαμά του έφερε ένα μπολ γάλα. Το γατάκι ήπιε όλο το γάλα και χάρηκε πολύ.",
        question: "Πώς ένιωσε το γατάκι στο τέλος;",
        options: [
          { id: 1, text: "Λυπημένο", emoji: "😢", correct: false },
          { id: 2, text: "Χαρούμενο", emoji: "😺", correct: true },
          { id: 3, text: "Κουρασμένο", emoji: "😴", correct: false },
        ]
      },
      {
        id: 3,
        title: "Ο Σκύλος στο Πάρκο",
        images: ["🐕", "⚽", "🌳"],
        text: "Ένας σκύλος πήγε με τον ιδιοκτήτη του στο πάρκο. Είδε μια μπάλα κάτω από ένα δέντρο. Ο σκύλος έτρεξε και έπιασε την μπάλα.",
        question: "Που ήταν η μπάλα;",
        options: [
          { id: 1, text: "Στο σπίτι", emoji: "🏠", correct: false },
          { id: 2, text: "Κάτω από δέντρο", emoji: "🌳", correct: true },
          { id: 3, text: "Στο νερό", emoji: "💧", correct: false },
        ]
      },
      {
        id: 4,
        title: "Η Πάπια στη Λίμνη",
        images: ["🦆", "💧", "🐟"],
        text: "Μια πάπια κολυμπούσε στη λίμνη. Είδε ένα ψαράκι να κολυμπά. Η πάπια έπαιξε με το ψαράκι όλο το πρωί.",
        question: "Με ποιον έπαιξε η πάπια;",
        options: [
          { id: 1, text: "Με άλλη πάπια", emoji: "🦆", correct: false },
          { id: 2, text: "Με ψαράκι", emoji: "🐟", correct: true },
          { id: 3, text: "Με βάτραχο", emoji: "🐸", correct: false },
        ]
      },
      {
        id: 5,
        title: "Το Αρκουδάκι και το Μέλι",
        images: ["🐻", "🍯", "🌲"],
        text: "Ένα αρκουδάκι έψαχνε για φαγητό στο δάσος. Βρήκε ένα δέντρο με μέλι. Το αρκουδάκι έφαγε το μέλι και χόρτασε.",
        question: "Τι βρήκε το αρκουδάκι στο δέντρο;",
        options: [
          { id: 1, text: "Φρούτα", emoji: "🍎", correct: false },
          { id: 2, text: "Μέλι", emoji: "🍯", correct: true },
          { id: 3, text: "Ψωμί", emoji: "🍞", correct: false },
        ]
      }
    ],
    en: [
      {
        id: 1,
        title: "The Bee and the Flower",
        images: ["🐝", "🌸", "🍯"],
        text: "A small bee was flying in the garden. She found a beautiful red flower. The bee collected pollen and made honey.",
        question: "What did the bee do after?",
        options: [
          { id: 1, text: "Made honey", emoji: "🍯", correct: true },
          { id: 2, text: "Went home", emoji: "🏠", correct: false },
          { id: 3, text: "Slept", emoji: "😴", correct: false },
        ]
      },
      {
        id: 2,
        title: "The Kitten and the Milk",
        images: ["🐱", "🥛", "😺"],
        text: "A small kitten was very hungry. Its mother brought a bowl of milk. The kitten drank all the milk and was very happy.",
        question: "How did the kitten feel at the end?",
        options: [
          { id: 1, text: "Sad", emoji: "😢", correct: false },
          { id: 2, text: "Happy", emoji: "😺", correct: true },
          { id: 3, text: "Tired", emoji: "😴", correct: false },
        ]
      },
      {
        id: 3,
        title: "The Dog in the Park",
        images: ["🐕", "⚽", "🌳"],
        text: "A dog went with its owner to the park. He saw a ball under a tree. The dog ran and caught the ball.",
        question: "Where was the ball?",
        options: [
          { id: 1, text: "At home", emoji: "🏠", correct: false },
          { id: 2, text: "Under a tree", emoji: "🌳", correct: true },
          { id: 3, text: "In water", emoji: "💧", correct: false },
        ]
      },
      {
        id: 4,
        title: "The Duck in the Lake",
        images: ["🦆", "💧", "🐟"],
        text: "A duck was swimming in the lake. She saw a little fish swimming. The duck played with the fish all morning.",
        question: "Who did the duck play with?",
        options: [
          { id: 1, text: "Another duck", emoji: "🦆", correct: false },
          { id: 2, text: "A fish", emoji: "🐟", correct: true },
          { id: 3, text: "A frog", emoji: "🐸", correct: false },
        ]
      },
      {
        id: 5,
        title: "The Bear and the Honey",
        images: ["🐻", "🍯", "🌲"],
        text: "A little bear was looking for food in the forest. He found a tree with honey. The bear ate the honey and was full.",
        question: "What did the bear find in the tree?",
        options: [
          { id: 1, text: "Fruits", emoji: "🍎", correct: false },
          { id: 2, text: "Honey", emoji: "🍯", correct: true },
          { id: 3, text: "Bread", emoji: "🍞", correct: false },
        ]
      }
    ]
  };

  const stories = storiesData[lang];
  const story = stories[currentStory];

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    wrongSoundRef.current = new Audio("/sounds/wrong.mp3");
    correctSoundRef.current.preload = "auto";
    wrongSoundRef.current.preload = "auto";
  }, []);

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "📚", "📖"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const readStoryAloud = () => {
    // Σταμάτα τυχόν άλλη ανάγνωση
    window.speechSynthesis.cancel();

    if (isReading) {
      setIsReading(false);
      return;
    }

    setIsReading(true);

    // Διάβασε τον τίτλο και το κείμενο
    const textToRead = `${story.title}. ${story.text}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = lang === "el" ? "el-GR" : "en-US";

    // Πιο αργή ταχύτητα για ελληνικά για καλύτερη κατανόηση
    utterance.rate = lang === "el" ? 0.7 : 0.85;
    utterance.pitch = lang === "el" ? 1.0 : 1.1;

    // Για ελληνικά, πρόσθεσε μικρές παύσεις
    if (lang === "el") {
      utterance.volume = 1.0;
    }

    utterance.onend = () => {
      setIsReading(false);
    };

    const voice = VoiceService.getVoice(lang);
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  };

  // Σταμάτα την ανάγνωση όταν αλλάζει ιστορία
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      setIsReading(false);
    };
  }, [currentStory]);

  const handleAnswerSelect = (option) => {
    if (showAnswer) return;

    setSelectedAnswer(option.id);
    setShowAnswer(true);

    if (option.correct) {
      correctSoundRef.current?.play().catch(() => {});

      const newScore = score + 1;
      setScore(newScore);

      // Show +1 score popup
      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      // Ενημέρωση progress
      updateProgress({
        title: "Story Choices",
        score: newScore,
        total: TARGET_STORIES,
        index: currentStory + 1,
      });

      completeQuiz({
        title: "Story Choices",
        score: 1,
        total: 1,
      });

      // Πήγαινε στην επόμενη ιστορία
      setTimeout(() => {
        if (currentStory + 1 < TARGET_STORIES) {
          setCurrentStory(prev => prev + 1);
          setSelectedAnswer(null);
          setShowAnswer(false);
        } else {
          // Τελείωσαν όλες οι ιστορίες
          createCelebrationEmojis();
          setShowCelebration(true);
          setTimeout(() => {
            if (onComplete) {
              onComplete();
            }
          }, 2500);
        }
      }, 2000);
    } else {
      wrongSoundRef.current?.play().catch(() => {});

      setTimeout(() => {
        setSelectedAnswer(null);
        setShowAnswer(false);
      }, 2000);
    }
  };

  const progressPercent = Math.round(((currentStory + 1) / TARGET_STORIES) * 100);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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

      {/* Score Bar */}
      <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">
              {lang === "el" ? "Ιστορίες με Επιλογές" : "Stories with Choices"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Ιστορία ${currentStory + 1}/${TARGET_STORIES}`
                : `Story ${currentStory + 1}/${TARGET_STORIES}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-orange-600">
            📖 {score}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-600">
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Story Card */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8 mb-6">
          {/* Story Title */}
          <h2 className="text-3xl font-bold text-orange-600 text-center mb-6">
            {story.title}
          </h2>

          {/* Story Images */}
          <div className="flex justify-center gap-4 mb-6">
            {story.images.map((emoji, index) => (
              <div
                key={index}
                className="text-6xl animate-bounce"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {emoji}
              </div>
            ))}
          </div>

          {/* Story Text */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 mb-6 border-4 border-orange-200">
            <p className="text-xl leading-relaxed text-slate-800 text-center font-medium">
              {story.text}
            </p>
          </div>

          {/* Read Story Button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={readStoryAloud}
              className={`
                px-8 py-4 rounded-full font-bold text-lg shadow-lg transition-all duration-300 transform
                ${isReading
                  ? "bg-red-500 hover:bg-red-600 text-white animate-pulse scale-105"
                  : "bg-gradient-to-r from-blue-500 to-purple-500 hover:scale-105 text-white"}
              `}
            >
              <span className="flex items-center gap-3">
                {isReading ? (
                  <>
                    🔊 {lang === "el" ? "Σταμάτα την ανάγνωση" : "Stop reading"}
                  </>
                ) : (
                  <>
                    🔊 {lang === "el" ? "Διάβασε την ιστορία" : "Read the story"}
                  </>
                )}
              </span>
            </button>
          </div>

          {/* Question */}
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-slate-700 text-center mb-4">
              ❓ {story.question}
            </h3>
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {story.options.map((option) => {
              const isSelected = selectedAnswer === option.id;
              const isCorrect = option.correct && showAnswer;
              const isWrong = isSelected && !option.correct && showAnswer;

              return (
                <button
                  key={option.id}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showAnswer}
                  className={`
                    p-6 rounded-2xl border-4 transition-all duration-300 transform
                    ${isCorrect ? "bg-green-100 border-green-500 scale-105" : ""}
                    ${isWrong ? "bg-red-100 border-red-500 animate-shake" : ""}
                    ${!showAnswer ? "bg-white border-orange-300 hover:border-orange-500 hover:scale-105 cursor-pointer" : "cursor-not-allowed"}
                    ${showAnswer && !isSelected && !option.correct ? "opacity-50" : ""}
                  `}
                >
                  <div className="text-6xl mb-3">{option.emoji}</div>
                  <div className="text-lg font-semibold text-slate-700">
                    {option.text}
                  </div>
                  {isCorrect && (
                    <div className="text-4xl mt-2 animate-bounce">✅</div>
                  )}
                  {isWrong && (
                    <div className="text-4xl mt-2">❌</div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback Message */}
          {showAnswer && (
            <div className="mt-6 text-center animate-fadeIn">
              {story.options.find(o => o.id === selectedAnswer)?.correct ? (
                <p className="text-2xl font-bold text-green-600">
                  {lang === "el" ? "🎉 Μπράβο! Σωστή απάντηση!" : "🎉 Great! Correct answer!"}
                </p>
              ) : (
                <p className="text-2xl font-bold text-orange-600">
                  {lang === "el" ? "Δοκίμασε ξανά!" : "Try again!"}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/80 to-orange-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">📚🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια!" : "Perfect!"}
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
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
}

