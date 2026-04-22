// src/components/games/exercises_9_10_1/HelpYourFriendGame.jsx
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

  const TARGET_ROUNDS = 15;

  const roundsData = {
    el: [
      { id: 1, situation: { emoji: "😰📊", friend: "👦", description: "Ο φίλος σου είναι συγκλονισμένος από πολλή εργασία.", context: "Στο σπίτι" }, correctAnswer: "help1", question: "Πώς μπορείς να τον βοηθήσεις;", options: [{ id: "help1", emoji: "📋", action: "Βοηθάς να οργανωθεί και να προτεραιοποιήσει", isCorrect: true }, { id: "help2", emoji: "😏", action: "Του λες ότι είναι εύκολα", isCorrect: false }, { id: "help3", emoji: "📱", action: "Του δίνεις τις απαντήσεις", isCorrect: false }] },
      { id: 2, situation: { emoji: "😢👫", friend: "👧", description: "Η φίλη σου γίνεται αντικείμενο κουτσομπολιού στο σχολείο.", context: "Στο σχολείο" }, correctAnswer: "help1", question: "Πώς μπορείς να τη βοηθήσεις;", options: [{ id: "help1", emoji: "🛡️", action: "Την υπερασπίζεσαι δημόσια", isCorrect: true }, { id: "help2", emoji: "😶", action: "Δεν κάνεις τίποτα", isCorrect: false }, { id: "help3", emoji: "🗣️", action: "Ακούς τις φήμες χωρίς να λες", isCorrect: false }] },
      { id: 3, situation: { emoji: "😔🏅", friend: "👦", description: "Ο φίλος σου δεν μπήκε στην αθλητική ομάδα.", context: "Στο γήπεδο" }, correctAnswer: "help2", question: "Πώς μπορείς να τον βοηθήσεις;", options: [{ id: "help1", emoji: "🙄", action: "Του λες να ξεχάσει το άθλημα", isCorrect: false }, { id: "help2", emoji: "🏃", action: "Προτείνεις να εξασκηθείτε μαζί", isCorrect: true }, { id: "help3", emoji: "😐", action: "Τον αγνοείς", isCorrect: false }] },
      { id: 4, situation: { emoji: "😰🎤", friend: "👧", description: "Η φίλη σου έχει φόβο εντεύξεων πριν την συναυλία.", context: "Στη γιορτή" }, correctAnswer: "help1", question: "Πώς μπορείς να τη βοηθήσεις;", options: [{ id: "help1", emoji: "🫁", action: "Κάνετε ασκήσεις αναπνοής μαζί", isCorrect: true }, { id: "help2", emoji: "😆", action: "Γελάς με το άγχος της", isCorrect: false }, { id: "help3", emoji: "🏃", action: "Φεύγεις να ετοιμαστείς εσύ", isCorrect: false }] },
      { id: 5, situation: { emoji: "😢💻", friend: "👦", description: "Ο φίλος σου δέχεται κακούς ανώνυμος online.", context: "Online" }, correctAnswer: "help1", question: "Πώς μπορείς να τον βοηθήσεις;", options: [{ id: "help1", emoji: "🛡️", action: "Βοηθάς να μπλοκάρει/να αναφέρει και να μιλήσει με ενήλικα", isCorrect: true }, { id: "help2", emoji: "😐", action: "Του λες ότι είναι απλά internet", isCorrect: false }, { id: "help3", emoji: "📱", action: "Του λες να αγνοήσει", isCorrect: false }] },
      { id: 6, situation: { emoji: "😔📱", friend: "👧", description: "Η φίλη σου συγκρίνεται με influencers στα social media.", context: "Στο σπίτι" }, correctAnswer: "help2", question: "Πώς μπορείς να τη βοηθήσεις;", options: [{ id: "help1", emoji: "😏", action: "Της λες να κοιτάξει περισσότερα", isCorrect: false }, { id: "help2", emoji: "💬", action: "Της θυμίζεις ότι τα social media δεν είναι πραγματικότητα", isCorrect: true }, { id: "help3", emoji: "📱", action: "Της προτείνεις να δει περισσότερα", isCorrect: false }] },
      { id: 7, situation: { emoji: "😰📝", friend: "👦", description: "Ο φίλος σου φοβάται να μιλήσει για πρόβλημα με δάσκαλο.", context: "Στο σχολείο" }, correctAnswer: "help1", question: "Πώς μπορείς να τον βοηθήσεις;", options: [{ id: "help1", emoji: "🤝", action: "Προσφέρεσαι να πάτε μαζί", isCorrect: true }, { id: "help2", emoji: "😶", action: "Του λες να το ξεχάσει", isCorrect: false }, { id: "help3", emoji: "😏", action: "Του λες ότι είναι δειλός", isCorrect: false }] },
      { id: 8, situation: { emoji: "😢🐈", friend: "👧", description: "Η γάτα της φίλης πέθανε.", context: "Στο σπίτι" }, correctAnswer: "help1", question: "Πώς μπορείς να τη βοηθήσεις;", options: [{ id: "help1", emoji: "🤗", action: "Είσαι υπομονετικός και την αφήνεις να θρηνήσει", isCorrect: true }, { id: "help2", emoji: "😐", action: "Της λες να πάρει άλλη γάτα", isCorrect: false }, { id: "help3", emoji: "🙄", action: "Της λες να σταματήσει να κλαίει", isCorrect: false }] },
      { id: 9, situation: { emoji: "😔🎨", friend: "👦", description: "Ο φίλος σου αισθάνεται ότι δεν έχει ταλέντο σε τίποτα.", context: "Μετά το σχολείο" }, correctAnswer: "help2", question: "Πώς μπορείς να τον βοηθήσεις;", options: [{ id: "help1", emoji: "😏", action: "Του λες ότι όλοι έχουν ταλέντο", isCorrect: false }, { id: "help2", emoji: "🔍", action: "Βοηθάς να ανακαλύψει τα πλεονεκτήματά του", isCorrect: true }, { id: "help3", emoji: "😐", action: "Τον αγνοείς", isCorrect: false }] },
      { id: 10, situation: { emoji: "😰👨‍👩‍👧", friend: "👧", description: "Η φίλη σου ανησυχεί ότι οι γονείς της τσακώνονται.", context: "Στο σχολείο" }, correctAnswer: "help1", question: "Πώς μπορείς να τη βοηθήσεις;", options: [{ id: "help1", emoji: "👂", action: "Ακούς και προτείνεις να μιλήσει με σύμβουλο", isCorrect: true }, { id: "help2", emoji: "😶", action: "Αλλάζεις θέμα", isCorrect: false }, { id: "help3", emoji: "🙄", action: "Της λες ότι όλοι οι γονείς τσακώνονται", isCorrect: false }] },
      { id: 11, situation: { emoji: "😢📚", friend: "👦", description: "Ο φίλος σου υστερεί σε ένα μάθημα.", context: "Στη βιβλιοθήκη" }, correctAnswer: "help1", question: "Πώς μπορείς να τον βοηθήσεις;", options: [{ id: "help1", emoji: "📖", action: "Προσφέρεσαι να μελετάτε μαζί τακτικά", isCorrect: true }, { id: "help2", emoji: "😏", action: "Του λες ότι είναι εύκολο", isCorrect: false }, { id: "help3", emoji: "📋", action: "Του δίνεις απαντήσεις", isCorrect: false }] },
      { id: 12, situation: { emoji: "😔🏊", friend: "👧", description: "Η φίλη σου απέτυχε στο τεστ κολύμβησης.", context: "Στο κολυμβητήριο" }, correctAnswer: "help2", question: "Πώς μπορείς να τη βοηθήσεις;", options: [{ id: "help1", emoji: "🙄", action: "Της λες να μην το ξαναδοκιμάσει", isCorrect: false }, { id: "help2", emoji: "💪", action: "Την ενθαρρύνεις να ξαναδοκιμάσει", isCorrect: true }, { id: "help3", emoji: "😐", action: "Αλλάζεις θέμα", isCorrect: false }] },
      { id: 13, situation: { emoji: "😰🎭", friend: "👦", description: "Στον φίλο σου δόθηκε μικρός ρόλος στο θεατρικό.", context: "Στην αίθουσα" }, correctAnswer: "help1", question: "Πώς μπορείς να τον βοηθήσεις;", options: [{ id: "help1", emoji: "🌟", action: "Του θυμίζεις ότι κάθε ρόλος έχει σημασία", isCorrect: true }, { id: "help2", emoji: "😏", action: "Του λες ότι του πάει η τύχη", isCorrect: false }, { id: "help3", emoji: "🙄", action: "Καταφέρνεις να αποφύγεις το θέμα", isCorrect: false }] },
      { id: 14, situation: { emoji: "😢👫", friend: "👧", description: "Η φίλη σου είχε μεγάλη διαμαρτυρία με το αδερφό της.", context: "Στο σπίτι" }, correctAnswer: "help1", question: "Πώς μπορείς να τη βοηθήσεις;", options: [{ id: "help1", emoji: "👂", action: "Ακούς και μοιράζεσαι παρόμοιες εμπειρίες", isCorrect: true }, { id: "help2", emoji: "😶", action: "Της λες ότι δεν είναι δική σου υπόθεση", isCorrect: false }, { id: "help3", emoji: "🙄", action: "Της λες να ξεχάσει", isCorrect: false }] },
      { id: 15, situation: { emoji: "😔🌍", friend: "👦", description: "Ο φίλος σου ανησυχεί για περιβαλλοντικά θέματα.", context: "Στο σχολείο" }, correctAnswer: "help2", question: "Πώς μπορείς να τον βοηθήσεις;", options: [{ id: "help1", emoji: "😶", action: "Του λες ότι δεν μπορείς να κάνεις τίποτα", isCorrect: false }, { id: "help2", emoji: "🌱", action: "Προτείνεις να λάβετε μέτρα μαζί (ανακύκλωση, φύτευση)", isCorrect: true }, { id: "help3", emoji: "🙄", action: "Του λες να μην ανησυχεί", isCorrect: false }] }
    ],
    en: [
      { id: 1, situation: { emoji: "😰📊", friend: "👦", description: "Friend is overwhelmed by too much homework.", context: "At home" }, correctAnswer: "help1", question: "How can you help them?", options: [{ id: "help1", emoji: "📋", action: "Help organize and prioritize", isCorrect: true }, { id: "help2", emoji: "😏", action: "Tell them it's easy", isCorrect: false }, { id: "help3", emoji: "📱", action: "Give them the answers", isCorrect: false }] },
      { id: 2, situation: { emoji: "😢👫", friend: "👧", description: "Friend is being gossiped about at school.", context: "At school" }, correctAnswer: "help1", question: "How can you help them?", options: [{ id: "help1", emoji: "🛡️", action: "Stand up for them publicly", isCorrect: true }, { id: "help2", emoji: "😶", action: "Do nothing", isCorrect: false }, { id: "help3", emoji: "🗣️", action: "Listen to rumors without speaking up", isCorrect: false }] },
      { id: 3, situation: { emoji: "😔🏅", friend: "👦", description: "Friend didn't make the sports team.", context: "On the field" }, correctAnswer: "help2", question: "How can you help them?", options: [{ id: "help1", emoji: "🙄", action: "Tell them to forget sports", isCorrect: false }, { id: "help2", emoji: "🏃", action: "Suggest practicing together", isCorrect: true }, { id: "help3", emoji: "😐", action: "Ignore them", isCorrect: false }] },
      { id: 4, situation: { emoji: "😰🎤", friend: "👧", description: "Friend has stage fright before the concert.", context: "At the celebration" }, correctAnswer: "help1", question: "How can you help them?", options: [{ id: "help1", emoji: "🫁", action: "Do breathing exercises together", isCorrect: true }, { id: "help2", emoji: "😆", action: "Laugh at their nerves", isCorrect: false }, { id: "help3", emoji: "🏃", action: "Go prepare yourself", isCorrect: false }] },
      { id: 5, situation: { emoji: "😢💻", friend: "👦", description: "Friend is being mean to online by strangers.", context: "Online" }, correctAnswer: "help1", question: "How can you help them?", options: [{ id: "help1", emoji: "🛡️", action: "Help them block/report and talk to adult", isCorrect: true }, { id: "help2", emoji: "😐", action: "Tell them it's just the internet", isCorrect: false }, { id: "help3", emoji: "📱", action: "Tell them to ignore it", isCorrect: false }] },
      { id: 6, situation: { emoji: "😔📱", friend: "👧", description: "Friend compares themselves to social media influencers.", context: "At home" }, correctAnswer: "help2", question: "How can you help them?", options: [{ id: "help1", emoji: "😏", action: "Tell them to look at more", isCorrect: false }, { id: "help2", emoji: "💬", action: "Remind them that social media isn't real life", isCorrect: true }, { id: "help3", emoji: "📱", action: "Suggest they watch more", isCorrect: false }] },
      { id: 7, situation: { emoji: "😰📝", friend: "👦", description: "Friend is afraid to speak up about a problem with a teacher.", context: "At school" }, correctAnswer: "help1", question: "How can you help them?", options: [{ id: "help1", emoji: "🤝", action: "Offer to go with them", isCorrect: true }, { id: "help2", emoji: "😶", action: "Tell them to forget it", isCorrect: false }, { id: "help3", emoji: "😏", action: "Tell them they're a coward", isCorrect: false }] },
      { id: 8, situation: { emoji: "😢🐈", friend: "👧", description: "Friend's cat passed away.", context: "At home" }, correctAnswer: "help1", question: "How can you help them?", options: [{ id: "help1", emoji: "🤗", action: "Be patient and let them grieve", isCorrect: true }, { id: "help2", emoji: "😐", action: "Tell them to get another cat", isCorrect: false }, { id: "help3", emoji: "🙄", action: "Tell them to stop crying", isCorrect: false }] },
      { id: 9, situation: { emoji: "😔🎨", friend: "👦", description: "Friend feels they're not talented at anything.", context: "After school" }, correctAnswer: "help2", question: "How can you help them?", options: [{ id: "help1", emoji: "😏", action: "Tell them everyone has talent", isCorrect: false }, { id: "help2", emoji: "🔍", action: "Help them discover their strengths", isCorrect: true }, { id: "help3", emoji: "😐", action: "Ignore them", isCorrect: false }] },
      { id: 10, situation: { emoji: "😰👨‍👩‍👧", friend: "👧", description: "Friend is worried about parents fighting.", context: "At school" }, correctAnswer: "help1", question: "How can you help them?", options: [{ id: "help1", emoji: "👂", action: "Listen and suggest talking to a counselor", isCorrect: true }, { id: "help2", emoji: "😶", action: "Change the subject", isCorrect: false }, { id: "help3", emoji: "🙄", action: "Tell them all parents fight", isCorrect: false }] },
      { id: 11, situation: { emoji: "😢📚", friend: "👦", description: "Friend is falling behind in a subject.", context: "At the library" }, correctAnswer: "help1", question: "How can you help them?", options: [{ id: "help1", emoji: "📖", action: "Offer to study together regularly", isCorrect: true }, { id: "help2", emoji: "😏", action: "Tell them it's easy", isCorrect: false }, { id: "help3", emoji: "📋", action: "Give them answers", isCorrect: false }] },
      { id: 12, situation: { emoji: "😔🏊", friend: "👧", description: "Friend failed a swimming test.", context: "At the pool" }, correctAnswer: "help2", question: "How can you help them?", options: [{ id: "help1", emoji: "🙄", action: "Tell them not to try again", isCorrect: false }, { id: "help2", emoji: "💪", action: "Encourage them to try again", isCorrect: true }, { id: "help3", emoji: "😐", action: "Change the subject", isCorrect: false }] },
      { id: 13, situation: { emoji: "😰🎭", friend: "👦", description: "Friend was given a small role in the play.", context: "In the hall" }, correctAnswer: "help1", question: "How can you help them?", options: [{ id: "help1", emoji: "🌟", action: "Remind them every role matters", isCorrect: true }, { id: "help2", emoji: "😏", action: "Tell them tough luck", isCorrect: false }, { id: "help3", emoji: "🙄", action: "Dismiss the topic", isCorrect: false }] },
      { id: 14, situation: { emoji: "😢👫", friend: "👧", description: "Friend had a big fight with their sibling.", context: "At home" }, correctAnswer: "help1", question: "How can you help them?", options: [{ id: "help1", emoji: "👂", action: "Listen and share similar experiences", isCorrect: true }, { id: "help2", emoji: "😶", action: "Say it's none of your business", isCorrect: false }, { id: "help3", emoji: "🙄", action: "Tell them to get over it", isCorrect: false }] },
      { id: 15, situation: { emoji: "😔🌍", friend: "👦", description: "Friend is anxious about environmental issues.", context: "At school" }, correctAnswer: "help2", question: "How can you help them?", options: [{ id: "help1", emoji: "😶", action: "Tell them you can't do anything", isCorrect: false }, { id: "help2", emoji: "🌱", action: "Suggest taking action together (recycling, planting)", isCorrect: true }, { id: "help3", emoji: "🙄", action: "Tell them not to worry", isCorrect: false }] }
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
