// src/components/games/exercises_11_12_1/HelpYourFriendGame.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import useSafeTimeout from "../../../hooks/useSafeTimeout";

export default function HelpYourFriendGame({ lang = "el", difficulty = 3, onComplete }) {
  const { safeTimeout } = useSafeTimeout();
  const [currentRound, setCurrentRound] = useState(0);
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

  const TARGET_ROUNDS = 12;

  const roundsData = {
    el: [
      {
        id: 1,
        situation: {
          emoji: "📚😰",
          friend: "👧",
          description: "Η φίλη σου είναι αγχωμένη για τη σχολική απόδοσή της.",
          context: "Στο σχολείο"
        },
        correctAnswer: "help1",
        question: "Πώς μπορείς να τη βοηθήσεις;",
        options: [
          { id: "help1", emoji: "📋", action: "Της βοηθάς να οργανώσει ένα σχέδιο μελέτης", isCorrect: true },
          { id: "help2", emoji: "😏", action: "Της λες να ηρεμήσει απλά", isCorrect: false },
          { id: "help3", emoji: "📱", action: "Της δίνεις τις απαντήσεις", isCorrect: false }
        ]
      },
      {
        id: 2,
        situation: {
          emoji: "😔🚪",
          friend: "👦",
          description: "Ο φίλος σου αποκλείεται από μια ομάδα.",
          context: "Στην αυλή"
        },
        correctAnswer: "help2",
        question: "Πώς μπορείς να τον βοηθήσεις;",
        options: [
          { id: "help1", emoji: "😐", action: "Τον αγνοείς για να μην φαίνεσαι διαφορετικός", isCorrect: false },
          { id: "help2", emoji: "🤝", action: "Στέκεσαι δίπλα του και τον καλείς στην ομάδα σου", isCorrect: true },
          { id: "help3", emoji: "🙄", action: "Του λες να βρει άλλους φίλους", isCorrect: false }
        ]
      },
      {
        id: 3,
        situation: {
          emoji: "🏠💔",
          friend: "👧",
          description: "Η φίλη σου αντιμετωπίζει διαζύγιο γονέων.",
          context: "Στο σπίτι"
        },
        correctAnswer: "help1",
        question: "Πώς μπορείς να τη βοηθήσεις;",
        options: [
          { id: "help1", emoji: "🤗", action: "Ακούς χωρίς να κρίνεις και είσαι υποστηρικτική", isCorrect: true },
          { id: "help2", emoji: "😒", action: "Της λες τι πρέπει να κάνει", isCorrect: false },
          { id: "help3", emoji: "🙄", action: "Αλλάζεις θέμα", isCorrect: false }
        ]
      },
      {
        id: 4,
        situation: {
          emoji: "😰🎉",
          friend: "👦",
          description: "Ο φίλος σου πιέζεται να κάνει κάτι λάθος σε πάρτι.",
          context: "Στο πάρτι"
        },
        correctAnswer: "help2",
        question: "Πώς μπορείς να τον βοηθήσεις;",
        options: [
          { id: "help1", emoji: "😶", action: "Δεν κάνεις τίποτα", isCorrect: false },
          { id: "help2", emoji: "🛡️", action: "Τον βοηθάς να πει όχι και φεύγετε μαζί", isCorrect: true },
          { id: "help3", emoji: "😏", action: "Του λες να το κάνει", isCorrect: false }
        ]
      },
      {
        id: 5,
        situation: {
          emoji: "📱😳",
          friend: "👧",
          description: "Η φίλη σου ανέβασε κάτι ντροπιαστικό online και το μετανιώνει.",
          context: "Online"
        },
        correctAnswer: "help1",
        question: "Πώς μπορείς να τη βοηθήσεις;",
        options: [
          { id: "help1", emoji: "🗑️", action: "Τη βοηθάς να το διαγράψει και να το συζητήσετε", isCorrect: true },
          { id: "help2", emoji: "😏", action: "Της λες ότι φταίει η ίδια", isCorrect: false },
          { id: "help3", emoji: "😶", action: "Την αγνοείς", isCorrect: false }
        ]
      },
      {
        id: 6,
        situation: {
          emoji: "😞💭",
          friend: "👦",
          description: "Ο φίλος σου νιώθει ότι δεν είναι καλός σε τίποτα.",
          context: "Μετά το σχολείο"
        },
        correctAnswer: "help3",
        question: "Πώς μπορείς να τον βοηθήσεις;",
        options: [
          { id: "help1", emoji: "🙄", action: "Του λες ότι έχει δίκιο", isCorrect: false },
          { id: "help2", emoji: "😐", action: "Αλλάζεις θέμα", isCorrect: false },
          { id: "help3", emoji: "💪", action: "Του θυμίζεις τα δυνατά του σημεία", isCorrect: true }
        ]
      },
      {
        id: 7,
        situation: {
          emoji: "😰🎤",
          friend: "👧",
          description: "Η φίλη σου φοβάται να μιλήσει στην τάξη.",
          context: "Στην τάξη"
        },
        correctAnswer: "help1",
        question: "Πώς μπορείς να τη βοηθήσεις;",
        options: [
          { id: "help1", emoji: "💪", action: "Την ενθαρρύνεις και εξασκηθείτε μαζί", isCorrect: true },
          { id: "help2", emoji: "😏", action: "Της λες ότι πρέπει να το ξεπεράσει", isCorrect: false },
          { id: "help3", emoji: "🙄", action: "Μιλάς εσύ αντί για αυτήν", isCorrect: false }
        ]
      },
      {
        id: 8,
        situation: {
          emoji: "🐾😢",
          friend: "👦",
          description: "Ο φίλος σου έχασε το αγαπημένο του κατοικίδιο.",
          context: "Στο σπίτι"
        },
        correctAnswer: "help2",
        question: "Πώς μπορείς να τον βοηθήσεις;",
        options: [
          { id: "help1", emoji: "🙄", action: "Του λες να μην κλαίει", isCorrect: false },
          { id: "help2", emoji: "🤗", action: "Είσαι δίπλα του και τον αφήνεις να θρηνήσει", isCorrect: true },
          { id: "help3", emoji: "😐", action: "Του λες να πάρει νέο ζώο", isCorrect: false }
        ]
      },
      {
        id: 9,
        situation: {
          emoji: "🪞😔",
          friend: "👧",
          description: "Η φίλη σου αγχώνεται για την εικόνα του σώματός της.",
          context: "Στα αποδυτήρια"
        },
        correctAnswer: "help1",
        question: "Πώς μπορείς να τη βοηθήσεις;",
        options: [
          { id: "help1", emoji: "💪", action: "Την καθησυχάζεις και μιλάτε για υγιή εικόνα εαυτού", isCorrect: true },
          { id: "help2", emoji: "😏", action: "Της λες ότι όλοι είναι έτσι", isCorrect: false },
          { id: "help3", emoji: "🙄", action: "Της λες να σταματήσει να παραπονιέται", isCorrect: false }
        ]
      },
      {
        id: 10,
        situation: {
          emoji: "📱😭",
          friend: "👦",
          description: "Ο φίλος σου έλαβε άσχημα σχόλια online.",
          context: "Online"
        },
        correctAnswer: "help2",
        question: "Πώς μπορείς να τον βοηθήσεις;",
        options: [
          { id: "help1", emoji: "🙄", action: "Του λες να μην δίνει σημασία", isCorrect: false },
          { id: "help2", emoji: "🛡️", action: "Τον βοηθάς να κάνει block/report και να μιλήσει σε ενήλικα", isCorrect: true },
          { id: "help3", emoji: "😶", action: "Δεν κάνεις τίποτα", isCorrect: false }
        ]
      },
      {
        id: 11,
        situation: {
          emoji: "📚😵",
          friend: "👧",
          description: "Η φίλη σου είναι συγκλονισμένη με εργασίες και δραστηριότητες.",
          context: "Στη βιβλιοθήκη"
        },
        correctAnswer: "help3",
        question: "Πώς μπορείς να τη βοηθήσεις;",
        options: [
          { id: "help1", emoji: "😏", action: "Της λες ότι όλοι είμαστε έτσι", isCorrect: false },
          { id: "help2", emoji: "📝", action: "Κάνεις τις εργασίες για αυτήν", isCorrect: false },
          { id: "help3", emoji: "📋", action: "Της βοηθάς να προτεραιοποιήσει και να κάνει διαλείμματα", isCorrect: true }
        ]
      },
      {
        id: 12,
        situation: {
          emoji: "📅😰",
          friend: "👦",
          description: "Ο φίλος σου είναι νευρικός για τη νέα σχολική χρονιά.",
          context: "Πρώτη μέρα"
        },
        correctAnswer: "help1",
        question: "Πώς μπορείς να τον βοηθήσεις;",
        options: [
          { id: "help1", emoji: "🤝", action: "Μοιράζεσαι τις εμπειρίες σου και πηγαίνετε μαζί", isCorrect: true },
          { id: "help2", emoji: "😏", action: "Του λες ότι δεν είναι τίποτα", isCorrect: false },
          { id: "help3", emoji: "🙄", action: "Τον αγνοείς", isCorrect: false }
        ]
      }
    ],
    en: [
      {
        id: 1,
        situation: {
          emoji: "📚😰",
          friend: "👧",
          description: "Your friend is stressed about school performance.",
          context: "At school"
        },
        correctAnswer: "help1",
        question: "How can you help them?",
        options: [
          { id: "help1", emoji: "📋", action: "Help them organize a study plan", isCorrect: true },
          { id: "help2", emoji: "😏", action: "Tell them to just calm down", isCorrect: false },
          { id: "help3", emoji: "📱", action: "Give them the answers", isCorrect: false }
        ]
      },
      {
        id: 2,
        situation: {
          emoji: "😔🚪",
          friend: "👦",
          description: "Your friend is being excluded from a group.",
          context: "In the yard"
        },
        correctAnswer: "help2",
        question: "How can you help them?",
        options: [
          { id: "help1", emoji: "😐", action: "Ignore them so you don't look different", isCorrect: false },
          { id: "help2", emoji: "🤝", action: "Stand by them and invite them to your group", isCorrect: true },
          { id: "help3", emoji: "🙄", action: "Tell them to find other friends", isCorrect: false }
        ]
      },
      {
        id: 3,
        situation: {
          emoji: "🏠💔",
          friend: "👧",
          description: "Your friend is dealing with parents' divorce.",
          context: "At home"
        },
        correctAnswer: "help1",
        question: "How can you help them?",
        options: [
          { id: "help1", emoji: "🤗", action: "Listen without judging and be supportive", isCorrect: true },
          { id: "help2", emoji: "😒", action: "Tell them what they should do", isCorrect: false },
          { id: "help3", emoji: "🙄", action: "Change the subject", isCorrect: false }
        ]
      },
      {
        id: 4,
        situation: {
          emoji: "😰🎉",
          friend: "👦",
          description: "Your friend is being pressured to do something wrong at a party.",
          context: "At the party"
        },
        correctAnswer: "help2",
        question: "How can you help them?",
        options: [
          { id: "help1", emoji: "😶", action: "Do nothing", isCorrect: false },
          { id: "help2", emoji: "🛡️", action: "Help them say no and leave together", isCorrect: true },
          { id: "help3", emoji: "😏", action: "Tell them to do it", isCorrect: false }
        ]
      },
      {
        id: 5,
        situation: {
          emoji: "📱😳",
          friend: "👧",
          description: "Your friend posted something embarrassing online and regrets it.",
          context: "Online"
        },
        correctAnswer: "help1",
        question: "How can you help them?",
        options: [
          { id: "help1", emoji: "🗑️", action: "Help them delete it and talk about it", isCorrect: true },
          { id: "help2", emoji: "😏", action: "Tell them it's their fault", isCorrect: false },
          { id: "help3", emoji: "😶", action: "Ignore them", isCorrect: false }
        ]
      },
      {
        id: 6,
        situation: {
          emoji: "😞💭",
          friend: "👦",
          description: "Your friend feels they're not good at anything.",
          context: "After school"
        },
        correctAnswer: "help3",
        question: "How can you help them?",
        options: [
          { id: "help1", emoji: "🙄", action: "Tell them they're right", isCorrect: false },
          { id: "help2", emoji: "😐", action: "Change the subject", isCorrect: false },
          { id: "help3", emoji: "💪", action: "Remind them of their strengths", isCorrect: true }
        ]
      },
      {
        id: 7,
        situation: {
          emoji: "😰🎤",
          friend: "👧",
          description: "Your friend is afraid to speak up in class.",
          context: "In the classroom"
        },
        correctAnswer: "help1",
        question: "How can you help them?",
        options: [
          { id: "help1", emoji: "💪", action: "Encourage them and practice together", isCorrect: true },
          { id: "help2", emoji: "😏", action: "Tell them they need to get over it", isCorrect: false },
          { id: "help3", emoji: "🙄", action: "Speak for them", isCorrect: false }
        ]
      },
      {
        id: 8,
        situation: {
          emoji: "🐾😢",
          friend: "👦",
          description: "Your friend lost a pet they loved.",
          context: "At home"
        },
        correctAnswer: "help2",
        question: "How can you help them?",
        options: [
          { id: "help1", emoji: "🙄", action: "Tell them not to cry", isCorrect: false },
          { id: "help2", emoji: "🤗", action: "Be there for them and let them grieve", isCorrect: true },
          { id: "help3", emoji: "😐", action: "Tell them to get a new pet", isCorrect: false }
        ]
      },
      {
        id: 9,
        situation: {
          emoji: "🪞😔",
          friend: "👧",
          description: "Your friend is struggling with body image.",
          context: "In the locker room"
        },
        correctAnswer: "help1",
        question: "How can you help them?",
        options: [
          { id: "help1", emoji: "💪", action: "Reassure them and talk about healthy self-image", isCorrect: true },
          { id: "help2", emoji: "😏", action: "Tell them everyone feels that way", isCorrect: false },
          { id: "help3", emoji: "🙄", action: "Tell them to stop complaining", isCorrect: false }
        ]
      },
      {
        id: 10,
        situation: {
          emoji: "📱😭",
          friend: "👦",
          description: "Your friend received mean comments online.",
          context: "Online"
        },
        correctAnswer: "help2",
        question: "How can you help them?",
        options: [
          { id: "help1", emoji: "🙄", action: "Tell them to ignore it", isCorrect: false },
          { id: "help2", emoji: "🛡️", action: "Help them block/report and talk to an adult", isCorrect: true },
          { id: "help3", emoji: "😶", action: "Do nothing", isCorrect: false }
        ]
      },
      {
        id: 11,
        situation: {
          emoji: "📚😵",
          friend: "👧",
          description: "Your friend is overwhelmed with homework and activities.",
          context: "At the library"
        },
        correctAnswer: "help3",
        question: "How can you help them?",
        options: [
          { id: "help1", emoji: "😏", action: "Tell them we're all like that", isCorrect: false },
          { id: "help2", emoji: "📝", action: "Do their homework for them", isCorrect: false },
          { id: "help3", emoji: "📋", action: "Help them prioritize and take breaks", isCorrect: true }
        ]
      },
      {
        id: 12,
        situation: {
          emoji: "📅😰",
          friend: "👦",
          description: "Your friend is nervous about a new school year.",
          context: "First day"
        },
        correctAnswer: "help1",
        question: "How can you help them?",
        options: [
          { id: "help1", emoji: "🤝", action: "Share your own experiences and go together", isCorrect: true },
          { id: "help2", emoji: "😏", action: "Tell them it's nothing", isCorrect: false },
          { id: "help3", emoji: "🙄", action: "Ignore them", isCorrect: false }
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
  }, [currentRound]);

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "✅", "🤝"][Math.floor(Math.random() * 6)],
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

    const isCorrect = answerId === round.correctAnswer;

    if (isCorrect) {
      correctSoundRef.current?.play().catch(() => {});

      const newScore = score + 1;
      setScore(newScore);

      setScorePopup({ id: Date.now(), x: 50 });
      safeTimeout(() => setScorePopup(null), 1000);

      updateProgress({
        title: "Help Your Friend Game",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      completeQuiz({
        title: "Help Your Friend Game",
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

  const progressPercent = Math.round((currentRound / TARGET_ROUNDS) * 100);
  const correctOption = round.options.find(opt => opt.id === round.correctAnswer);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-blue-100 via-cyan-100 to-teal-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Βοήθησε τον Φίλο" : "Help Your Friend"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Επίπεδο ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Level ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-cyan-600">
            🤝 {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-teal-500 transition-all duration-500 ease-out"
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
        <div className="inline-block bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl border-4 border-cyan-400">
          <div className="text-7xl mb-3">🤝</div>
          <h2 className="text-3xl font-bold mb-3 text-slate-800">
            {round.question}
          </h2>
        </div>
      </div>

      {/* Game Area */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border-4 border-cyan-400">
          {/* Situation Display */}
          <div className="bg-gradient-to-br from-cyan-100 to-blue-100 rounded-3xl p-10 border-4 border-cyan-400 mb-8 shadow-lg">
            <div className="flex flex-col items-center justify-center gap-6">
              {/* Context Badge */}
              <div className="bg-cyan-500 text-white px-6 py-2 rounded-full font-bold text-lg">
                {round.situation.context}
              </div>

              {/* Friend and Situation */}
              <div className="flex items-center gap-6">
                <div className="text-9xl">{round.situation.friend}</div>
                <div className="text-8xl">{round.situation.emoji}</div>
              </div>

              {/* Description */}
              <div className="bg-white/90 rounded-2xl p-6 border-4 border-cyan-300 max-w-2xl">
                <p className="text-2xl font-bold text-center text-slate-800">
                  {round.situation.description}
                </p>
              </div>
            </div>
          </div>

          {/* Help Options */}
          {!showAnswer && (
            <>
              <p className="text-2xl font-bold text-center text-slate-700 mb-6">
                {round.question}
              </p>

              <div className="grid grid-cols-1 gap-4 max-w-3xl mx-auto">
                {round.options.map((option) => {
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleAnswerSelect(option.id)}
                      className="p-6 rounded-2xl bg-gradient-to-br from-cyan-100 to-blue-100 hover:from-cyan-200 hover:to-blue-200 border-4 border-cyan-300 hover:border-cyan-500 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-6 cursor-pointer text-left"
                    >
                      <div className="text-7xl flex-shrink-0">{option.emoji}</div>
                      <p className="text-xl font-bold text-slate-700 flex-1">{option.action}</p>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Show Answer */}
          {showAnswer && selectedAnswer === round.correctAnswer && (
            <div className="text-center animate-fadeIn">
              <div className="inline-block bg-green-100 rounded-3xl p-8 border-4 border-green-400">
                <div className="flex items-center justify-center gap-6 mb-4">
                  <div className="text-8xl">{correctOption.emoji}</div>
                  <div className="text-8xl">{round.situation.friend}</div>
                  <div className="text-8xl">✅</div>
                </div>
                <p className="text-3xl font-bold text-green-700 mb-4">
                  {lang === "el"
                    ? `🎉 Μπράβο! Αυτή είναι η καλύτερη βοήθεια!`
                    : `🎉 Well done! This is the best help!`}
                </p>
                <p className="text-xl text-green-600">
                  {correctOption.action}
                </p>
              </div>
            </div>
          )}

          {showAnswer && selectedAnswer !== round.correctAnswer && (
            <div className="text-center animate-fadeIn">
              <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
                <p className="text-3xl font-bold text-red-700">
                  {lang === "el"
                    ? `Σκέψου ξανά! Πώς θα ήθελες εσύ να σε βοηθήσουν;`
                    : `Think again! How would you want to be helped?`}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-300/80 to-blue-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🤝🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Είσαι πολύ καλός φίλος!" : "Perfect! You're a great friend!"}
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
