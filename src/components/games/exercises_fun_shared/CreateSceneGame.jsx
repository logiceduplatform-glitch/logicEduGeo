// src/components/games/CreateSceneGame.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import { VoiceService } from "../../../services/VoiceService";

export default function CreateSceneGame({ lang = "el", onComplete, difficulty = 3 }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [placedItems, setPlacedItems] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
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

  const TARGET_ROUNDS = 10;

  const roundsData = {
    el: [
      {
        id: 1,
        sceneName: "Παραλία",
        background: "linear-gradient(to bottom, #87CEEB 0%, #F0E68C 70%, #F4A460 100%)",
        description: "Φτιάξε μια όμορφη παραλία!",
        requiredItems: [
          { id: "sun", emoji: "☀️", name: "Ήλιος", correctZone: "sky" },
          { id: "umbrella", emoji: "🏖️", name: "Ομπρέλα", correctZone: "beach" },
          { id: "wave", emoji: "🌊", name: "Κύμα", correctZone: "sea" }
        ],
        wrongItems: [
          { id: "snow", emoji: "❄️", name: "Χιόνι" },
          { id: "tree", emoji: "🌲", name: "Έλατο" }
        ],
        zones: [
          { id: "sky", name: "Ουρανός", top: 0, height: 40 },
          { id: "sea", name: "Θάλασσα", top: 40, height: 30 },
          { id: "beach", name: "Αμμουδιά", top: 70, height: 30 }
        ]
      },
      {
        id: 2,
        sceneName: "Δάσος",
        background: "linear-gradient(to bottom, #87CEEB 0%, #90EE90 60%, #228B22 100%)",
        description: "Φτιάξε ένα όμορφο δάσος!",
        requiredItems: [
          { id: "cloud", emoji: "☁️", name: "Σύννεφο", correctZone: "sky" },
          { id: "tree", emoji: "🌲", name: "Δέντρο", correctZone: "ground" },
          { id: "mushroom", emoji: "🍄", name: "Μανιτάρι", correctZone: "ground" }
        ],
        wrongItems: [
          { id: "boat", emoji: "⛵", name: "Βάρκα" },
          { id: "car", emoji: "🚗", name: "Αυτοκίνητο" }
        ],
        zones: [
          { id: "sky", name: "Ουρανός", top: 0, height: 50 },
          { id: "ground", name: "Έδαφος", top: 50, height: 50 }
        ]
      },
      {
        id: 3,
        sceneName: "Πόλη",
        background: "linear-gradient(to bottom, #87CEEB 0%, #D3D3D3 60%, #696969 100%)",
        description: "Φτιάξε μια πόλη!",
        requiredItems: [
          { id: "building", emoji: "🏢", name: "Κτίριο", correctZone: "city" },
          { id: "car", emoji: "🚗", name: "Αυτοκίνητο", correctZone: "road" },
          { id: "sun", emoji: "☀️", name: "Ήλιος", correctZone: "sky" }
        ],
        wrongItems: [
          { id: "fish", emoji: "🐟", name: "Ψάρι" },
          { id: "flower", emoji: "🌸", name: "Λουλούδι" }
        ],
        zones: [
          { id: "sky", name: "Ουρανός", top: 0, height: 40 },
          { id: "city", name: "Πόλη", top: 40, height: 35 },
          { id: "road", name: "Δρόμος", top: 75, height: 25 }
        ]
      },
      {
        id: 4,
        sceneName: "Κήπος",
        background: "linear-gradient(to bottom, #87CEEB 0%, #90EE90 50%, #228B22 100%)",
        description: "Φτιάξε έναν όμορφο κήπο!",
        requiredItems: [
          { id: "butterfly", emoji: "🦋", name: "Πεταλούδα", correctZone: "sky" },
          { id: "flower", emoji: "🌸", name: "Λουλούδι", correctZone: "ground" },
          { id: "bee", emoji: "🐝", name: "Μέλισσα", correctZone: "sky" }
        ],
        wrongItems: [
          { id: "penguin", emoji: "🐧", name: "Πιγκουίνος" },
          { id: "rocket", emoji: "🚀", name: "Πύραυλος" }
        ],
        zones: [
          { id: "sky", name: "Ουρανός", top: 0, height: 50 },
          { id: "ground", name: "Έδαφος", top: 50, height: 50 }
        ]
      },
      {
        id: 5,
        sceneName: "Νύχτα",
        background: "linear-gradient(to bottom, #191970 0%, #000080 50%, #1a1a2e 100%)",
        description: "Φτιάξε μια νυχτερινή σκηνή!",
        requiredItems: [
          { id: "moon", emoji: "🌙", name: "Φεγγάρι", correctZone: "sky" },
          { id: "stars", emoji: "⭐", name: "Αστέρι", correctZone: "sky" },
          { id: "house", emoji: "🏠", name: "Σπίτι", correctZone: "ground" }
        ],
        wrongItems: [
          { id: "sun", emoji: "☀️", name: "Ήλιος" },
          { id: "beach", emoji: "🏖️", name: "Παραλία" }
        ],
        zones: [
          { id: "sky", name: "Ουρανός", top: 0, height: 60 },
          { id: "ground", name: "Έδαφος", top: 60, height: 40 }
        ]
      },
      {
        id: 6,
        sceneName: "Φάρμα",
        background: "linear-gradient(to bottom, #87CEEB 0%, #90EE90 40%, #D2691E 100%)",
        description: "Φτιάξε μια φάρμα!",
        requiredItems: [
          { id: "barn", emoji: "🏚️", name: "Αχυρώνας", correctZone: "ground" },
          { id: "cow", emoji: "🐄", name: "Αγελάδα", correctZone: "ground" },
          { id: "cloud", emoji: "☁️", name: "Σύννεφο", correctZone: "sky" }
        ],
        wrongItems: [
          { id: "whale", emoji: "🐋", name: "Φάλαινα" },
          { id: "plane", emoji: "✈️", name: "Αεροπλάνο" }
        ],
        zones: [
          { id: "sky", name: "Ουρανός", top: 0, height: 50 },
          { id: "ground", name: "Έδαφος", top: 50, height: 50 }
        ]
      },
      {
        id: 7,
        sceneName: "Θάλασσα",
        background: "linear-gradient(to bottom, #87CEEB 0%, #4682B4 30%, #00008B 100%)",
        description: "Φτιάξε μια θαλασσινή σκηνή!",
        requiredItems: [
          { id: "boat", emoji: "⛵", name: "Βάρκα", correctZone: "sea" },
          { id: "fish", emoji: "🐟", name: "Ψάρι", correctZone: "underwater" },
          { id: "seagull", emoji: "🕊️", name: "Γλάρος", correctZone: "sky" }
        ],
        wrongItems: [
          { id: "cactus", emoji: "🌵", name: "Κάκτος" },
          { id: "snowman", emoji: "⛄", name: "Χιονάνθρωπος" }
        ],
        zones: [
          { id: "sky", name: "Ουρανός", top: 0, height: 30 },
          { id: "sea", name: "Θάλασσα", top: 30, height: 35 },
          { id: "underwater", name: "Βυθός", top: 65, height: 35 }
        ]
      },
      {
        id: 8,
        sceneName: "Χειμώνας",
        background: "linear-gradient(to bottom, #B0C4DE 0%, #F0F8FF 50%, #FFFFFF 100%)",
        description: "Φτιάξε μια χειμωνιάτικη σκηνή!",
        requiredItems: [
          { id: "snowman", emoji: "⛄", name: "Χιονάνθρωπος", correctZone: "ground" },
          { id: "snowflake", emoji: "❄️", name: "Νιφάδα", correctZone: "sky" },
          { id: "tree", emoji: "🌲", name: "Έλατο", correctZone: "ground" }
        ],
        wrongItems: [
          { id: "sun", emoji: "☀️", name: "Ήλιος" },
          { id: "flower", emoji: "🌸", name: "Λουλούδι" }
        ],
        zones: [
          { id: "sky", name: "Ουρανός", top: 0, height: 50 },
          { id: "ground", name: "Έδαφος", top: 50, height: 50 }
        ]
      },
      {
        id: 9,
        sceneName: "Ζούγκλα",
        background: "linear-gradient(to bottom, #87CEEB 0%, #228B22 40%, #006400 100%)",
        description: "Φτιάξε μια ζούγκλα!",
        requiredItems: [
          { id: "monkey", emoji: "🐒", name: "Πίθηκος", correctZone: "trees" },
          { id: "palm", emoji: "🌴", name: "Φοίνικας", correctZone: "ground" },
          { id: "parrot", emoji: "🦜", name: "Παπαγάλος", correctZone: "trees" }
        ],
        wrongItems: [
          { id: "penguin", emoji: "🐧", name: "Πιγκουίνος" },
          { id: "igloo", emoji: "⛺", name: "Σκηνή" }
        ],
        zones: [
          { id: "trees", name: "Δέντρα", top: 0, height: 50 },
          { id: "ground", name: "Έδαφος", top: 50, height: 50 }
        ]
      },
      {
        id: 10,
        sceneName: "Διάστημα",
        background: "linear-gradient(to bottom, #000000 0%, #191970 50%, #4B0082 100%)",
        description: "Φτιάξε μια διαστημική σκηνή!",
        requiredItems: [
          { id: "rocket", emoji: "🚀", name: "Πύραυλος", correctZone: "space" },
          { id: "planet", emoji: "🪐", name: "Πλανήτης", correctZone: "space" },
          { id: "alien", emoji: "👽", name: "Εξωγήινος", correctZone: "space" }
        ],
        wrongItems: [
          { id: "flower", emoji: "🌸", name: "Λουλούδι" },
          { id: "fish", emoji: "🐟", name: "Ψάρι" }
        ],
        zones: [
          { id: "space", name: "Διάστημα", top: 0, height: 100 }
        ]
      }
    ],
    en: [
      {
        id: 1,
        sceneName: "Beach",
        background: "linear-gradient(to bottom, #87CEEB 0%, #F0E68C 70%, #F4A460 100%)",
        description: "Create a beautiful beach!",
        requiredItems: [
          { id: "sun", emoji: "☀️", name: "Sun", correctZone: "sky" },
          { id: "umbrella", emoji: "🏖️", name: "Umbrella", correctZone: "beach" },
          { id: "wave", emoji: "🌊", name: "Wave", correctZone: "sea" }
        ],
        wrongItems: [
          { id: "snow", emoji: "❄️", name: "Snow" },
          { id: "tree", emoji: "🌲", name: "Pine Tree" }
        ],
        zones: [
          { id: "sky", name: "Sky", top: 0, height: 40 },
          { id: "sea", name: "Sea", top: 40, height: 30 },
          { id: "beach", name: "Beach", top: 70, height: 30 }
        ]
      },
      {
        id: 2,
        sceneName: "Forest",
        background: "linear-gradient(to bottom, #87CEEB 0%, #90EE90 60%, #228B22 100%)",
        description: "Create a beautiful forest!",
        requiredItems: [
          { id: "cloud", emoji: "☁️", name: "Cloud", correctZone: "sky" },
          { id: "tree", emoji: "🌲", name: "Tree", correctZone: "ground" },
          { id: "mushroom", emoji: "🍄", name: "Mushroom", correctZone: "ground" }
        ],
        wrongItems: [
          { id: "boat", emoji: "⛵", name: "Boat" },
          { id: "car", emoji: "🚗", name: "Car" }
        ],
        zones: [
          { id: "sky", name: "Sky", top: 0, height: 50 },
          { id: "ground", name: "Ground", top: 50, height: 50 }
        ]
      },
      {
        id: 3,
        sceneName: "City",
        background: "linear-gradient(to bottom, #87CEEB 0%, #D3D3D3 60%, #696969 100%)",
        description: "Create a city!",
        requiredItems: [
          { id: "building", emoji: "🏢", name: "Building", correctZone: "city" },
          { id: "car", emoji: "🚗", name: "Car", correctZone: "road" },
          { id: "sun", emoji: "☀️", name: "Sun", correctZone: "sky" }
        ],
        wrongItems: [
          { id: "fish", emoji: "🐟", name: "Fish" },
          { id: "flower", emoji: "🌸", name: "Flower" }
        ],
        zones: [
          { id: "sky", name: "Sky", top: 0, height: 40 },
          { id: "city", name: "City", top: 40, height: 35 },
          { id: "road", name: "Road", top: 75, height: 25 }
        ]
      },
      {
        id: 4,
        sceneName: "Garden",
        background: "linear-gradient(to bottom, #87CEEB 0%, #90EE90 50%, #228B22 100%)",
        description: "Create a beautiful garden!",
        requiredItems: [
          { id: "butterfly", emoji: "🦋", name: "Butterfly", correctZone: "sky" },
          { id: "flower", emoji: "🌸", name: "Flower", correctZone: "ground" },
          { id: "bee", emoji: "🐝", name: "Bee", correctZone: "sky" }
        ],
        wrongItems: [
          { id: "penguin", emoji: "🐧", name: "Penguin" },
          { id: "rocket", emoji: "🚀", name: "Rocket" }
        ],
        zones: [
          { id: "sky", name: "Sky", top: 0, height: 50 },
          { id: "ground", name: "Ground", top: 50, height: 50 }
        ]
      },
      {
        id: 5,
        sceneName: "Night",
        background: "linear-gradient(to bottom, #191970 0%, #000080 50%, #1a1a2e 100%)",
        description: "Create a night scene!",
        requiredItems: [
          { id: "moon", emoji: "🌙", name: "Moon", correctZone: "sky" },
          { id: "stars", emoji: "⭐", name: "Star", correctZone: "sky" },
          { id: "house", emoji: "🏠", name: "House", correctZone: "ground" }
        ],
        wrongItems: [
          { id: "sun", emoji: "☀️", name: "Sun" },
          { id: "beach", emoji: "🏖️", name: "Beach" }
        ],
        zones: [
          { id: "sky", name: "Sky", top: 0, height: 60 },
          { id: "ground", name: "Ground", top: 60, height: 40 }
        ]
      },
      {
        id: 6,
        sceneName: "Farm",
        background: "linear-gradient(to bottom, #87CEEB 0%, #90EE90 40%, #D2691E 100%)",
        description: "Create a farm!",
        requiredItems: [
          { id: "barn", emoji: "🏚️", name: "Barn", correctZone: "ground" },
          { id: "cow", emoji: "🐄", name: "Cow", correctZone: "ground" },
          { id: "cloud", emoji: "☁️", name: "Cloud", correctZone: "sky" }
        ],
        wrongItems: [
          { id: "whale", emoji: "🐋", name: "Whale" },
          { id: "plane", emoji: "✈️", name: "Plane" }
        ],
        zones: [
          { id: "sky", name: "Sky", top: 0, height: 50 },
          { id: "ground", name: "Ground", top: 50, height: 50 }
        ]
      },
      {
        id: 7,
        sceneName: "Ocean",
        background: "linear-gradient(to bottom, #87CEEB 0%, #4682B4 30%, #00008B 100%)",
        description: "Create an ocean scene!",
        requiredItems: [
          { id: "boat", emoji: "⛵", name: "Boat", correctZone: "sea" },
          { id: "fish", emoji: "🐟", name: "Fish", correctZone: "underwater" },
          { id: "seagull", emoji: "🕊️", name: "Seagull", correctZone: "sky" }
        ],
        wrongItems: [
          { id: "cactus", emoji: "🌵", name: "Cactus" },
          { id: "snowman", emoji: "⛄", name: "Snowman" }
        ],
        zones: [
          { id: "sky", name: "Sky", top: 0, height: 30 },
          { id: "sea", name: "Sea", top: 30, height: 35 },
          { id: "underwater", name: "Underwater", top: 65, height: 35 }
        ]
      },
      {
        id: 8,
        sceneName: "Winter",
        background: "linear-gradient(to bottom, #B0C4DE 0%, #F0F8FF 50%, #FFFFFF 100%)",
        description: "Create a winter scene!",
        requiredItems: [
          { id: "snowman", emoji: "⛄", name: "Snowman", correctZone: "ground" },
          { id: "snowflake", emoji: "❄️", name: "Snowflake", correctZone: "sky" },
          { id: "tree", emoji: "🌲", name: "Pine Tree", correctZone: "ground" }
        ],
        wrongItems: [
          { id: "sun", emoji: "☀️", name: "Sun" },
          { id: "flower", emoji: "🌸", name: "Flower" }
        ],
        zones: [
          { id: "sky", name: "Sky", top: 0, height: 50 },
          { id: "ground", name: "Ground", top: 50, height: 50 }
        ]
      },
      {
        id: 9,
        sceneName: "Jungle",
        background: "linear-gradient(to bottom, #87CEEB 0%, #228B22 40%, #006400 100%)",
        description: "Create a jungle!",
        requiredItems: [
          { id: "monkey", emoji: "🐒", name: "Monkey", correctZone: "trees" },
          { id: "palm", emoji: "🌴", name: "Palm Tree", correctZone: "ground" },
          { id: "parrot", emoji: "🦜", name: "Parrot", correctZone: "trees" }
        ],
        wrongItems: [
          { id: "penguin", emoji: "🐧", name: "Penguin" },
          { id: "igloo", emoji: "⛺", name: "Tent" }
        ],
        zones: [
          { id: "trees", name: "Trees", top: 0, height: 50 },
          { id: "ground", name: "Ground", top: 50, height: 50 }
        ]
      },
      {
        id: 10,
        sceneName: "Space",
        background: "linear-gradient(to bottom, #000000 0%, #191970 50%, #4B0082 100%)",
        description: "Create a space scene!",
        requiredItems: [
          { id: "rocket", emoji: "🚀", name: "Rocket", correctZone: "space" },
          { id: "planet", emoji: "🪐", name: "Planet", correctZone: "space" },
          { id: "alien", emoji: "👽", name: "Alien", correctZone: "space" }
        ],
        wrongItems: [
          { id: "flower", emoji: "🌸", name: "Flower" },
          { id: "fish", emoji: "🐟", name: "Fish" }
        ],
        zones: [
          { id: "space", name: "Space", top: 0, height: 100 }
        ]
      }
    ]
  };

  const rounds = roundsData[lang];
  const round = rounds[currentRound];
  const allItems = [...round.requiredItems, ...round.wrongItems];

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    wrongSoundRef.current = new Audio("/sounds/wrong.mp3");
    correctSoundRef.current.preload = "auto";
    wrongSoundRef.current.preload = "auto";
  }, []);

  useEffect(() => {
    setPlacedItems([]);
    setShowAnswer(false);
  }, [currentRound]);

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "✅", "🎨"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const speakQuestion = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const text = `${round.description}`;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'el' ? 'el-GR' : 'en-US';
      utterance.rate = 0.75;
      utterance.pitch = 1.1;
      const voice = VoiceService.getVoice(lang);
      if (voice) utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      speakQuestion();
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRound, lang]);

  const handleDragStart = (item) => {
    setDraggedItem(item);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, zoneId) => {
    e.preventDefault();

    if (!draggedItem || showAnswer) return;

    // Check if item already placed
    if (placedItems.find(p => p.item.id === draggedItem.id)) {
      setDraggedItem(null);
      return;
    }

    const isCorrect = draggedItem.correctZone === zoneId;

    if (isCorrect) {
      correctSoundRef.current?.play().catch(() => {});

      setPlacedItems(prev => [...prev, {
        item: draggedItem,
        zone: zoneId,
        position: {
          x: Math.random() * 70 + 15,
          y: Math.random() * 40 + 30
        }
      }]);

      // Check if all required items are placed
      const newPlacedCount = placedItems.length + 1;
      if (newPlacedCount === round.requiredItems.length) {
        handleComplete();
      }
    } else {
      wrongSoundRef.current?.play().catch(() => {});
    }

    setDraggedItem(null);
  };

  const handleComplete = () => {
    setShowAnswer(true);

    const newScore = score + 1;
    setScore(newScore);

    setScorePopup({ id: Date.now(), x: 50 });
    setTimeout(() => setScorePopup(null), 1000);

    updateProgress({
      title: "Create Scene Game",
      score: newScore,
      total: TARGET_ROUNDS,
      index: currentRound + 1,
    });

    completeQuiz({
      title: "Create Scene Game",
      score: 1,
      total: 1,
    });

    setTimeout(() => {
      if (currentRound + 1 < TARGET_ROUNDS) {
        setCurrentRound(prev => prev + 1);
      } else {
        createCelebrationEmojis();
        setShowCelebration(true);
        setTimeout(() => {
          if (onComplete) {
            onComplete({ score: newScore, total: TARGET_ROUNDS });
          }
        }, NEXT_DELAY);
      }
    }, NEXT_DELAY);
  };

  const progressPercent = Math.round(((currentRound + 1) / TARGET_ROUNDS) * 100);
  const placedCount = placedItems.length;
  const totalRequired = round.requiredItems.length;

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-blue-100 via-green-100 to-yellow-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Δημιούργησε Σκηνή" : "Create a Scene"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {round.sceneName} - {lang === "el"
                ? `Επίπεδο ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Level ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-green-600">
            🎨 {score}
          </div>
        </div>

        <div className="flex items-center gap-3 mb-3">
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

        {/* Progress indicator */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-700">
            {lang === "el" ? "Πρόοδος:" : "Progress:"}
          </span>
          <div className="flex gap-1">
            {Array.from({ length: totalRequired }).map((_, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all duration-300 ${
                  i < placedCount
                    ? 'bg-green-400 text-white scale-110'
                    : 'bg-slate-200 text-slate-400'
                }`}
              >
                {i < placedCount ? '✓' : '○'}
              </div>
            ))}
          </div>
          <span className="text-sm text-slate-600 ml-2">
            {placedCount}/{totalRequired}
          </span>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center mb-6">
        <div className="inline-block bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl border-4 border-green-400">
          <div className="text-7xl mb-3">🎭</div>
          <h2 className="text-3xl font-bold mb-3 text-slate-800">
            {round.description}
          </h2>

          <button
            onClick={speakQuestion}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white text-xl font-bold rounded-full hover:scale-105 transition-transform shadow-lg"
          >
            🔊 {lang === "el" ? "Άκουσε Ξανά" : "Listen Again"}
          </button>
        </div>
      </div>

      {/* Scene Canvas */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="relative rounded-3xl shadow-2xl overflow-hidden border-4 border-white" style={{ height: '500px', background: round.background }}>
          {/* Zone labels (for debugging - can be removed) */}
          {round.zones.map((zone) => (
            <div
              key={zone.id}
              className="absolute w-full border-t-2 border-dashed border-white/30"
              style={{
                top: `${zone.top}%`,
                height: `${zone.height}%`
              }}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, zone.id)}
            >
              <span className="absolute top-2 left-2 text-white/50 text-sm font-bold">
                {zone.name}
              </span>
            </div>
          ))}

          {/* Placed items */}
          {placedItems.map((placed, index) => {
            const zone = round.zones.find(z => z.id === placed.zone);
            const absoluteY = zone ? zone.top + (zone.height * placed.position.y / 100) : 50;

            return (
              <div
                key={index}
                className="absolute text-6xl animate-bounce"
                style={{
                  left: `${placed.position.x}%`,
                  top: `${absoluteY}%`,
                  transform: 'translate(-50%, -50%)',
                  filter: 'drop-shadow(3px 3px 5px rgba(0,0,0,0.3))',
                  animation: 'bounce 0.5s ease-out'
                }}
              >
                {placed.item.emoji}
              </div>
            );
          })}
        </div>
      </div>

      {/* Available Items */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl border-4 border-green-400">
          <p className="text-center text-lg font-bold text-slate-800 mb-4">
            {lang === "el" ? "Σύρε τα αντικείμενα στη σκηνή:" : "Drag the items to the scene:"}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {allItems.map((item) => {
              const isPlaced = placedItems.find(p => p.item.id === item.id);

              return (
                <div
                  key={item.id}
                  draggable={!isPlaced && !showAnswer}
                  onDragStart={() => handleDragStart(item)}
                  className={`
                    relative p-6 rounded-2xl border-4 transition-all duration-300 transform
                    ${isPlaced
                      ? 'bg-green-100 border-green-400 opacity-50 cursor-not-allowed'
                      : 'bg-white border-slate-300 hover:border-blue-400 hover:scale-110 cursor-grab active:cursor-grabbing shadow-lg'}
                  `}
                >
                  <div className="text-6xl mb-2 text-center">{item.emoji}</div>
                  <p className="text-xs font-semibold text-slate-700 text-center">{item.name}</p>

                  {isPlaced && (
                    <div className="absolute -top-2 -right-2 text-3xl animate-bounce">
                      ✅
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showAnswer && (
        <div className="text-center mt-6 animate-fadeIn">
          <div className="bg-green-100 rounded-2xl p-6 inline-block border-4 border-green-400">
            <p className="text-3xl font-bold text-green-700">
              {lang === "el"
                ? `🎉 Τέλεια! Δημιούργησες την ${round.sceneName}!`
                : `🎉 Perfect! You created the ${round.sceneName}!`}
            </p>
          </div>
        </div>
      )}

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-green-300/80 to-blue-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🎭🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Ξέρεις να δημιουργείς σκηνές!" : "Perfect! You know how to create scenes!"}
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
        @keyframes bounce {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.2); }
        }
      `}</style>
    </div>
  );
}

