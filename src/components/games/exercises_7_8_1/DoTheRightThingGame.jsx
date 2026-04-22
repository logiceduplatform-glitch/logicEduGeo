// src/components/games/exercises_7_8_1/DoTheRightThingGame.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import useSafeTimeout from "../../../hooks/useSafeTimeout";

export default function DoTheRightThingGame({ lang = "el", difficulty = 3, onComplete }) {
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
      {
        id: 1,
        scenario: {
          emoji: "👫😢",
          description: "Ένας συμμαθητής γίνεται κοροϊδία.",
          context: "Στην αυλή"
        },
        correctAnswer: "standup",
        question: "Τι είναι το σωστό να κάνεις;",
        options: [
          { id: "standup", emoji: "🛡️", label: "Να τον υπερασπιστείς", isPolite: true },
          { id: "ignore", emoji: "🙄", label: "Να τον αγνοήσεις", isPolite: false },
          { id: "laugh", emoji: "😆", label: "Να γελάς μαζί", isPolite: false },
          { id: "walk", emoji: "🚶", label: "Να φύγεις", isPolite: false }
        ]
      },
      {
        id: 2,
        scenario: {
          emoji: "📝👀",
          description: "Βλέπεις κάποιον μαθητή να κοιτάζει απαντήσεις κατά τη διάρκεια διαγωνίσματος.",
          context: "Στην τάξη"
        },
        correctAnswer: "tellteacher",
        question: "Τι είναι το σωστό να κάνεις;",
        options: [
          { id: "tellteacher", emoji: "🤫", label: "Να πεις ήσυχα στη δασκάλα", isPolite: true },
          { id: "yell", emoji: "😤", label: "Να φωνάξεις μπροστά σε όλους", isPolite: false },
          { id: "ignore", emoji: "🙈", label: "Να μην πεις τίποτα", isPolite: false },
          { id: "copy", emoji: "📋", label: "Να κοιτάξεις κι εσύ", isPolite: false }
        ]
      },
      {
        id: 3,
        scenario: {
          emoji: "⚽🏃",
          description: "Χτύπησες κατά λάθος κάποιον σε ένα παιχνίδι.",
          context: "Στο γήπεδο"
        },
        correctAnswer: "apologize",
        question: "Τι είναι το σωστό να κάνεις;",
        options: [
          { id: "apologize", emoji: "🙏", label: "Να ζητήσεις συγγνώμη και να παίζεις τίμια", isPolite: true },
          { id: "blame", emoji: "👉", label: "Να πεις ότι φταίει αυτός", isPolite: false },
          { id: "ignore", emoji: "😐", label: "Να αγνοήσεις το συμβάν", isPolite: false },
          { id: "laugh", emoji: "😆", label: "Να γελάς", isPolite: false }
        ]
      },
      {
        id: 4,
        scenario: {
          emoji: "📚🤫",
          description: "Κάποιος κάνει θόρυβο στη βιβλιοθήκη.",
          context: "Στη βιβλιοθήκη"
        },
        correctAnswer: "askquiet",
        question: "Τι είναι το σωστό να κάνεις;",
        options: [
          { id: "askquiet", emoji: "🤫", label: "Να ζητήσεις ευγενικά να σιωπήσει", isPolite: true },
          { id: "yell", emoji: "😤", label: "Να φωνάξεις", isPolite: false },
          { id: "complain", emoji: "😒", label: "Να παραπονεθείς δυνατά", isPolite: false },
          { id: "ignore", emoji: "🙄", label: "Να τον αγνοήσεις", isPolite: false }
        ]
      },
      {
        id: 5,
        scenario: {
          emoji: "🍎👧",
          description: "Μια φίλη δεν έχει χρήματα για φαγητό.",
          context: "Στην καντίνα"
        },
        correctAnswer: "share",
        question: "Τι είναι το σωστό να κάνεις;",
        options: [
          { id: "share", emoji: "🤝", label: "Να μοιραστείς το φαγητό σου", isPolite: true },
          { id: "ignore", emoji: "😐", label: "Να την αγνοήσεις", isPolite: false },
          { id: "laugh", emoji: "😆", label: "Να γελάς", isPolite: false },
          { id: "tell", emoji: "👆", label: "Να πεις στη δασκάλα", isPolite: false }
        ]
      },
      {
        id: 6,
        scenario: {
          emoji: "🧹📋",
          description: "Η δασκάλα ζητά εθελοντές για καθάρισμα.",
          context: "Στην τάξη"
        },
        correctAnswer: "volunteer",
        question: "Τι είναι το σωστό να κάνεις;",
        options: [
          { id: "volunteer", emoji: "🙋", label: "Να προσφερθείς να βοηθήσεις", isPolite: true },
          { id: "ignore", emoji: "😴", label: "Να κοιτάξεις αλλού", isPolite: false },
          { id: "complain", emoji: "😒", label: "Να παραπονεθείς", isPolite: false },
          { id: "run", emoji: "🏃", label: "Να φύγεις", isPolite: false }
        ]
      },
      {
        id: 7,
        scenario: {
          emoji: "💻🎮",
          description: "Ο φίλος σου θέλει να παραλείψεις τις εργασίες για βιντεοπαιχνίδια.",
          context: "Στο σπίτι"
        },
        correctAnswer: "homework",
        question: "Τι είναι το σωστό να κάνεις;",
        options: [
          { id: "homework", emoji: "📚", label: "Να τελειώσεις πρώτα τις εργασίες", isPolite: true },
          { id: "play", emoji: "🎮", label: "Να παίξεις κι εσύ", isPolite: false },
          { id: "ignore", emoji: "😐", label: "Να τον αγνοήσεις", isPolite: false },
          { id: "yell", emoji: "😤", label: "Να του φωνάξεις", isPolite: false }
        ]
      },
      {
        id: 8,
        scenario: {
          emoji: "🌳🗑️",
          description: "Βλέπεις συμμαθητές να πετάνε σκουπίδια στο πάρκο.",
          context: "Στο πάρκο"
        },
        correctAnswer: "environment",
        question: "Τι είναι το σωστό να κάνεις;",
        options: [
          { id: "environment", emoji: "🌍", label: "Να τους πεις για το περιβάλλον", isPolite: true },
          { id: "ignore", emoji: "🙄", label: "Να τους αγνοήσεις", isPolite: false },
          { id: "join", emoji: "🗑️", label: "Να πετάξεις κι εσύ", isPolite: false },
          { id: "laugh", emoji: "😆", label: "Να γελάς", isPolite: false }
        ]
      },
      {
        id: 9,
        scenario: {
          emoji: "📱❌",
          description: "Κάποιος τραβάει φωτογραφίες χωρίς άδεια.",
          context: "Στο σχολείο"
        },
        correctAnswer: "tellright",
        question: "Τι είναι το σωστό να κάνεις;",
        options: [
          { id: "tellright", emoji: "🛑", label: "Να του πεις ότι δεν είναι σωστό", isPolite: true },
          { id: "ignore", emoji: "😐", label: "Να τον αγνοήσεις", isPolite: false },
          { id: "join", emoji: "📸", label: "Να τραβήξεις κι εσύ", isPolite: false },
          { id: "laugh", emoji: "😆", label: "Να γελάς", isPolite: false }
        ]
      },
      {
        id: 10,
        scenario: {
          emoji: "🎨💔",
          description: "Κατέστρεψες κατά λάθος το έργο κάποιου.",
          context: "Στην τάξη"
        },
        correctAnswer: "apologizehelp",
        question: "Τι είναι το σωστό να κάνεις;",
        options: [
          { id: "apologizehelp", emoji: "🙏", label: "Να ζητήσεις συγγνώμη και να βοηθήσεις να το φτιάξετε", isPolite: true },
          { id: "run", emoji: "🏃", label: "Να φύγεις", isPolite: false },
          { id: "blame", emoji: "👉", label: "Να πεις ότι φταίει αυτός", isPolite: false },
          { id: "ignore", emoji: "😐", label: "Να προσποιηθείς ότι δεν έγινε τίποτα", isPolite: false }
        ]
      },
      {
        id: 11,
        scenario: {
          emoji: "👫🚶",
          description: "Ένας μαθητής με ειδικές ανάγκες χρειάζεται βοήθεια.",
          context: "Στο σχολείο"
        },
        correctAnswer: "assist",
        question: "Τι είναι το σωστό να κάνεις;",
        options: [
          { id: "assist", emoji: "🤝", label: "Να προσφερθείς να βοηθήσεις", isPolite: true },
          { id: "ignore", emoji: "😐", label: "Να τον αγνοήσεις", isPolite: false },
          { id: "laugh", emoji: "😆", label: "Να γελάς", isPolite: false },
          { id: "point", emoji: "👆", label: "Να τον δείξεις στους άλλους", isPolite: false }
        ]
      },
      {
        id: 12,
        scenario: {
          emoji: "🏆😤",
          description: "Έχασες το παιχνίδι τίμια.",
          context: "Στο γήπεδο"
        },
        correctAnswer: "congratulate",
        question: "Τι είναι το σωστό να κάνεις;",
        options: [
          { id: "congratulate", emoji: "🎉", label: "Να συγχαρείς τον νικητή", isPolite: true },
          { id: "angry", emoji: "😠", label: "Να θυμώσεις", isPolite: false },
          { id: "blame", emoji: "👉", label: "Να κατηγορήσεις τους άλλους", isPolite: false },
          { id: "leave", emoji: "🚶", label: "Να φύγεις χωρίς να πεις τίποτα", isPolite: false }
        ]
      },
      {
        id: 13,
        scenario: {
          emoji: "📖👧",
          description: "Ένα μικρότερο παιδί δεν μπορεί να διαβάσει μια πινακίδα.",
          context: "Στο διάδρομο"
        },
        correctAnswer: "readhelp",
        question: "Τι είναι το σωστό να κάνεις;",
        options: [
          { id: "readhelp", emoji: "📚", label: "Να το βοηθήσεις να τη διαβάσει", isPolite: true },
          { id: "ignore", emoji: "😐", label: "Να το αγνοήσεις", isPolite: false },
          { id: "laugh", emoji: "😆", label: "Να γελάς", isPolite: false },
          { id: "tease", emoji: "😏", label: "Να το κοροϊδέψεις", isPolite: false }
        ]
      },
      {
        id: 14,
        scenario: {
          emoji: "🎁🎂",
          description: "Έφεραν μεγαλύτερο κομμάτι τούρτας σε εσένα.",
          context: "Στο πάρτι"
        },
        correctAnswer: "share",
        question: "Τι είναι το σωστό να κάνεις;",
        options: [
          { id: "share", emoji: "🥄", label: "Να προτείνεις να μοιραστείτε ίσα", isPolite: true },
          { id: "eat", emoji: "😋", label: "Να το φας όλο", isPolite: false },
          { id: "boast", emoji: "😎", label: "Να καυχηθείς", isPolite: false },
          { id: "ignore", emoji: "😐", label: "Να μην πεις τίποτα", isPolite: false }
        ]
      },
      {
        id: 15,
        scenario: {
          emoji: "🔑💼",
          description: "Βρήκες μια χαμένη τσάντα στο διάδρομο.",
          context: "Στο σχολείο"
        },
        correctAnswer: "lostfound",
        question: "Τι είναι το σωστό να κάνεις;",
        options: [
          { id: "lostfound", emoji: "📦", label: "Να την πάρεις στα χαμένα-βρέματα", isPolite: true },
          { id: "keep", emoji: "🙈", label: "Να την κρατήσεις", isPolite: false },
          { id: "ignore", emoji: "😐", label: "Να την αγνοήσεις", isPolite: false },
          { id: "open", emoji: "📂", label: "Να ανοίξεις να δεις τι έχει μέσα", isPolite: false }
        ]
      }
    ],
    en: [
      {
        id: 1,
        scenario: {
          emoji: "👫😢",
          description: "A classmate is being teased.",
          context: "In the yard"
        },
        correctAnswer: "standup",
        question: "What is the right thing to do?",
        options: [
          { id: "standup", emoji: "🛡️", label: "Stand up for them", isPolite: true },
          { id: "ignore", emoji: "🙄", label: "Ignore them", isPolite: false },
          { id: "laugh", emoji: "😆", label: "Laugh along", isPolite: false },
          { id: "walk", emoji: "🚶", label: "Walk away", isPolite: false }
        ]
      },
      {
        id: 2,
        scenario: {
          emoji: "📝👀",
          description: "You see another student cheating on a test.",
          context: "In the classroom"
        },
        correctAnswer: "tellteacher",
        question: "What is the right thing to do?",
        options: [
          { id: "tellteacher", emoji: "🤫", label: "Quietly tell the teacher", isPolite: true },
          { id: "yell", emoji: "😤", label: "Yell in front of everyone", isPolite: false },
          { id: "ignore", emoji: "🙈", label: "Say nothing", isPolite: false },
          { id: "copy", emoji: "📋", label: "Look at the answers too", isPolite: false }
        ]
      },
      {
        id: 3,
        scenario: {
          emoji: "⚽🏃",
          description: "You accidentally fouled someone in a game.",
          context: "On the field"
        },
        correctAnswer: "apologize",
        question: "What is the right thing to do?",
        options: [
          { id: "apologize", emoji: "🙏", label: "Apologize and play fair", isPolite: true },
          { id: "blame", emoji: "👉", label: "Say it's their fault", isPolite: false },
          { id: "ignore", emoji: "😐", label: "Ignore what happened", isPolite: false },
          { id: "laugh", emoji: "😆", label: "Laugh", isPolite: false }
        ]
      },
      {
        id: 4,
        scenario: {
          emoji: "📚🤫",
          description: "Someone is being loud in the library.",
          context: "In the library"
        },
        correctAnswer: "askquiet",
        question: "What is the right thing to do?",
        options: [
          { id: "askquiet", emoji: "🤫", label: "Politely ask them to be quiet", isPolite: true },
          { id: "yell", emoji: "😤", label: "Yell at them", isPolite: false },
          { id: "complain", emoji: "😒", label: "Complain loudly", isPolite: false },
          { id: "ignore", emoji: "🙄", label: "Ignore them", isPolite: false }
        ]
      },
      {
        id: 5,
        scenario: {
          emoji: "🍎👧",
          description: "A friend doesn't have lunch money.",
          context: "In the cafeteria"
        },
        correctAnswer: "share",
        question: "What is the right thing to do?",
        options: [
          { id: "share", emoji: "🤝", label: "Share your lunch", isPolite: true },
          { id: "ignore", emoji: "😐", label: "Ignore them", isPolite: false },
          { id: "laugh", emoji: "😆", label: "Laugh", isPolite: false },
          { id: "tell", emoji: "👆", label: "Tell the teacher", isPolite: false }
        ]
      },
      {
        id: 6,
        scenario: {
          emoji: "🧹📋",
          description: "The teacher asks for volunteers to clean up.",
          context: "In the classroom"
        },
        correctAnswer: "volunteer",
        question: "What is the right thing to do?",
        options: [
          { id: "volunteer", emoji: "🙋", label: "Volunteer to help", isPolite: true },
          { id: "ignore", emoji: "😴", label: "Look away", isPolite: false },
          { id: "complain", emoji: "😒", label: "Complain", isPolite: false },
          { id: "run", emoji: "🏃", label: "Leave", isPolite: false }
        ]
      },
      {
        id: 7,
        scenario: {
          emoji: "💻🎮",
          description: "A friend wants you to skip homework for video games.",
          context: "At home"
        },
        correctAnswer: "homework",
        question: "What is the right thing to do?",
        options: [
          { id: "homework", emoji: "📚", label: "Finish homework first", isPolite: true },
          { id: "play", emoji: "🎮", label: "Play with them", isPolite: false },
          { id: "ignore", emoji: "😐", label: "Ignore them", isPolite: false },
          { id: "yell", emoji: "😤", label: "Yell at them", isPolite: false }
        ]
      },
      {
        id: 8,
        scenario: {
          emoji: "🌳🗑️",
          description: "You see classmates throwing trash in the park.",
          context: "In the park"
        },
        correctAnswer: "environment",
        question: "What is the right thing to do?",
        options: [
          { id: "environment", emoji: "🌍", label: "Tell them about the environment", isPolite: true },
          { id: "ignore", emoji: "🙄", label: "Ignore them", isPolite: false },
          { id: "join", emoji: "🗑️", label: "Throw trash too", isPolite: false },
          { id: "laugh", emoji: "😆", label: "Laugh", isPolite: false }
        ]
      },
      {
        id: 9,
        scenario: {
          emoji: "📱❌",
          description: "Someone is taking photos without permission.",
          context: "At school"
        },
        correctAnswer: "tellright",
        question: "What is the right thing to do?",
        options: [
          { id: "tellright", emoji: "🛑", label: "Tell them it's not right", isPolite: true },
          { id: "ignore", emoji: "😐", label: "Ignore them", isPolite: false },
          { id: "join", emoji: "📸", label: "Take photos too", isPolite: false },
          { id: "laugh", emoji: "😆", label: "Laugh", isPolite: false }
        ]
      },
      {
        id: 10,
        scenario: {
          emoji: "🎨💔",
          description: "You accidentally ruined someone's project.",
          context: "In the classroom"
        },
        correctAnswer: "apologizehelp",
        question: "What is the right thing to do?",
        options: [
          { id: "apologizehelp", emoji: "🙏", label: "Apologize and help fix it", isPolite: true },
          { id: "run", emoji: "🏃", label: "Run away", isPolite: false },
          { id: "blame", emoji: "👉", label: "Say it's their fault", isPolite: false },
          { id: "ignore", emoji: "😐", label: "Pretend nothing happened", isPolite: false }
        ]
      },
      {
        id: 11,
        scenario: {
          emoji: "👫🚶",
          description: "A student with a disability needs help.",
          context: "At school"
        },
        correctAnswer: "assist",
        question: "What is the right thing to do?",
        options: [
          { id: "assist", emoji: "🤝", label: "Offer to assist", isPolite: true },
          { id: "ignore", emoji: "😐", label: "Ignore them", isPolite: false },
          { id: "laugh", emoji: "😆", label: "Laugh", isPolite: false },
          { id: "point", emoji: "👆", label: "Point them out to others", isPolite: false }
        ]
      },
      {
        id: 12,
        scenario: {
          emoji: "🏆😤",
          description: "You lost a game fairly.",
          context: "On the field"
        },
        correctAnswer: "congratulate",
        question: "What is the right thing to do?",
        options: [
          { id: "congratulate", emoji: "🎉", label: "Congratulate the winner", isPolite: true },
          { id: "angry", emoji: "😠", label: "Get angry", isPolite: false },
          { id: "blame", emoji: "👉", label: "Blame others", isPolite: false },
          { id: "leave", emoji: "🚶", label: "Leave without saying anything", isPolite: false }
        ]
      },
      {
        id: 13,
        scenario: {
          emoji: "📖👧",
          description: "A younger student can't read a sign.",
          context: "In the hallway"
        },
        correctAnswer: "readhelp",
        question: "What is the right thing to do?",
        options: [
          { id: "readhelp", emoji: "📚", label: "Help them read it", isPolite: true },
          { id: "ignore", emoji: "😐", label: "Ignore them", isPolite: false },
          { id: "laugh", emoji: "😆", label: "Laugh", isPolite: false },
          { id: "tease", emoji: "😏", label: "Make fun of them", isPolite: false }
        ]
      },
      {
        id: 14,
        scenario: {
          emoji: "🎁🎂",
          description: "You got a bigger slice of cake than others.",
          context: "At the party"
        },
        correctAnswer: "share",
        question: "What is the right thing to do?",
        options: [
          { id: "share", emoji: "🥄", label: "Offer to share equally", isPolite: true },
          { id: "eat", emoji: "😋", label: "Eat it all", isPolite: false },
          { id: "boast", emoji: "😎", label: "Brag", isPolite: false },
          { id: "ignore", emoji: "😐", label: "Say nothing", isPolite: false }
        ]
      },
      {
        id: 15,
        scenario: {
          emoji: "🔑💼",
          description: "You found a lost bag in the hallway.",
          context: "At school"
        },
        correctAnswer: "lostfound",
        question: "What is the right thing to do?",
        options: [
          { id: "lostfound", emoji: "📦", label: "Take it to the lost and found", isPolite: true },
          { id: "keep", emoji: "🙈", label: "Keep it", isPolite: false },
          { id: "ignore", emoji: "😐", label: "Ignore it", isPolite: false },
          { id: "open", emoji: "📂", label: "Open it to see what's inside", isPolite: false }
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
        title: "Do The Right Thing Game",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      completeQuiz({
        title: "Do The Right Thing Game",
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
    <div className="relative w-full min-h-screen bg-gradient-to-br from-green-100 via-teal-100 to-blue-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Κάνε το Σωστό" : "Do The Right Thing"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Επίπεδο ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Level ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-green-600">
            🤝 {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-500 ease-out"
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
        <div className="inline-block bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl border-4 border-green-400">
          <div className="text-7xl mb-3">🤝</div>
          <h2 className="text-3xl font-bold mb-3 text-slate-800">
            {round.question}
          </h2>
        </div>
      </div>

      {/* Game Area */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border-4 border-green-400">
          {/* Scenario Display */}
          <div className="bg-gradient-to-br from-blue-100 to-teal-100 rounded-3xl p-10 border-4 border-blue-400 mb-8 shadow-lg">
            <div className="flex flex-col items-center justify-center gap-6">
              {/* Context Badge */}
              <div className="bg-blue-500 text-white px-6 py-2 rounded-full font-bold text-lg">
                {round.scenario.context}
              </div>

              {/* Scenario Icons */}
              <div className="text-9xl">
                {round.scenario.emoji}
              </div>

              {/* Description */}
              <div className="bg-white/90 rounded-2xl p-6 border-4 border-blue-300 max-w-2xl">
                <p className="text-2xl font-bold text-center text-slate-800">
                  {round.scenario.description}
                </p>
              </div>
            </div>
          </div>

          {/* Answer Options */}
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
                      className="p-6 rounded-2xl bg-gradient-to-br from-green-100 to-teal-100 hover:from-green-200 hover:to-teal-200 border-4 border-green-300 hover:border-green-500 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-6 cursor-pointer text-left"
                    >
                      <div className="text-7xl flex-shrink-0">{option.emoji}</div>
                      <p className="text-xl font-bold text-slate-700 flex-1">{option.label}</p>
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
                  <div className="text-8xl">✅</div>
                </div>
                <p className="text-3xl font-bold text-green-700 mb-4">
                  {lang === "el"
                    ? `🎉 Μπράβο! Έκανες το σωστό!`
                    : `🎉 Well done! You did the right thing!`}
                </p>
                <p className="text-xl text-green-600">
                  {correctOption.label}
                </p>
              </div>
            </div>
          )}

          {showAnswer && selectedAnswer !== round.correctAnswer && (
            <div className="text-center animate-fadeIn">
              <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
                <p className="text-3xl font-bold text-red-700">
                  {lang === "el"
                    ? `Σκέψου ξανά! Τι θα ήταν πιο ευγενικό;`
                    : `Think again! What would be more polite?`}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-green-300/80 to-blue-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🤝🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Ξέρεις πάντα το σωστό!" : "Perfect! You always know the right thing!"}
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
