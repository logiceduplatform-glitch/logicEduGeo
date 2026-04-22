// src/components/games/GroupByCategoriesGame.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import { VoiceService } from "../../../services/VoiceService";

export default function GroupByCategoriesGame({ lang = "el", onComplete, difficulty = 3 }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [items, setItems] = useState([]);
  const [basket1Items, setBasket1Items] = useState([]);
  const [basket2Items, setBasket2Items] = useState([]);
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

  const TARGET_ROUNDS = 10; // 10 ομαδοποιήσεις

  const roundsData = {
    el: [
      {
        id: 1,
        question: "Χώρισε τα φρούτα από τα λαχανικά",
        basket1: { name: "Φρούτα", emoji: "🍎", category: "fruits" },
        basket2: { name: "Λαχανικά", emoji: "🥕", category: "vegetables" },
        color: "#EF4444",
        items: [
          { id: 1, emoji: "🍎", name: "Μήλο", category: "fruits" },
          { id: 2, emoji: "🥕", name: "Καρότο", category: "vegetables" },
          { id: 3, emoji: "🍌", name: "Μπανάνα", category: "fruits" },
          { id: 4, emoji: "🥒", name: "Αγγούρι", category: "vegetables" },
          { id: 5, emoji: "🍊", name: "Πορτοκάλι", category: "fruits" },
          { id: 6, emoji: "🥦", name: "Μπρόκολο", category: "vegetables" }
        ]
      },
      {
        id: 2,
        question: "Χώρισε τα ζώα από τα οχήματα",
        basket1: { name: "Ζώα", emoji: "🐶", category: "animals" },
        basket2: { name: "Οχήματα", emoji: "🚗", category: "vehicles" },
        color: "#10B981",
        items: [
          { id: 1, emoji: "🐶", name: "Σκύλος", category: "animals" },
          { id: 2, emoji: "🚗", name: "Αυτοκίνητο", category: "vehicles" },
          { id: 3, emoji: "🐱", name: "Γάτα", category: "animals" },
          { id: 4, emoji: "🚌", name: "Λεωφορείο", category: "vehicles" },
          { id: 5, emoji: "🐦", name: "Πουλί", category: "animals" },
          { id: 6, emoji: "✈️", name: "Αεροπλάνο", category: "vehicles" }
        ]
      },
      {
        id: 3,
        question: "Χώρισε τα ρούχα από τα παιχνίδια",
        basket1: { name: "Ρούχα", emoji: "👕", category: "clothes" },
        basket2: { name: "Παιχνίδια", emoji: "🧸", category: "toys" },
        color: "#3B82F6",
        items: [
          { id: 1, emoji: "👕", name: "Μπλούζα", category: "clothes" },
          { id: 2, emoji: "🧸", name: "Αρκούδα", category: "toys" },
          { id: 3, emoji: "👖", name: "Παντελόνι", category: "clothes" },
          { id: 4, emoji: "⚽", name: "Μπάλα", category: "toys" },
          { id: 5, emoji: "👟", name: "Παπούτσια", category: "clothes" },
          { id: 6, emoji: "🎮", name: "Παιχνίδι", category: "toys" }
        ]
      },
      {
        id: 4,
        question: "Χώρισε τα φαγητά από τα ποτά",
        basket1: { name: "Φαγητά", emoji: "🍕", category: "food" },
        basket2: { name: "Ποτά", emoji: "🥤", category: "drinks" },
        color: "#EAB308",
        items: [
          { id: 1, emoji: "🍕", name: "Πίτσα", category: "food" },
          { id: 2, emoji: "🥤", name: "Αναψυκτικό", category: "drinks" },
          { id: 3, emoji: "🍔", name: "Μπέργκερ", category: "food" },
          { id: 4, emoji: "🧃", name: "Χυμός", category: "drinks" },
          { id: 5, emoji: "🍰", name: "Κέικ", category: "food" },
          { id: 6, emoji: "🥛", name: "Γάλα", category: "drinks" }
        ]
      },
      {
        id: 5,
        question: "Χώρισε τα σχήματα από τα χρώματα",
        basket1: { name: "Σχήματα", emoji: "🔵", category: "shapes" },
        basket2: { name: "Αστέρια", emoji: "⭐", category: "stars" },
        color: "#EC4899",
        items: [
          { id: 1, emoji: "🔵", name: "Κύκλος", category: "shapes" },
          { id: 2, emoji: "⭐", name: "Αστέρι", category: "stars" },
          { id: 3, emoji: "🔴", name: "Κύκλος", category: "shapes" },
          { id: 4, emoji: "✨", name: "Αστέρι", category: "stars" },
          { id: 5, emoji: "🟢", name: "Κύκλος", category: "shapes" },
          { id: 6, emoji: "🌟", name: "Αστέρι", category: "stars" }
        ]
      },
      {
        id: 6,
        question: "Χώρισε τα έντομα από τα πουλιά",
        basket1: { name: "Έντομα", emoji: "🐝", category: "insects" },
        basket2: { name: "Πουλιά", emoji: "🐦", category: "birds" },
        color: "#22C55E",
        items: [
          { id: 1, emoji: "🐝", name: "Μέλισσα", category: "insects" },
          { id: 2, emoji: "🐦", name: "Πουλί", category: "birds" },
          { id: 3, emoji: "🦋", name: "Πεταλούδα", category: "insects" },
          { id: 4, emoji: "🦅", name: "Αετός", category: "birds" },
          { id: 5, emoji: "🐞", name: "Πασχαλίτσα", category: "insects" },
          { id: 6, emoji: "🦆", name: "Πάπια", category: "birds" }
        ]
      },
      {
        id: 7,
        question: "Χώρισε τα δέντρα από τα λουλούδια",
        basket1: { name: "Δέντρα", emoji: "🌲", category: "trees" },
        basket2: { name: "Λουλούδια", emoji: "🌸", category: "flowers" },
        color: "#14B8A6",
        items: [
          { id: 1, emoji: "🌲", name: "Δέντρο", category: "trees" },
          { id: 2, emoji: "🌸", name: "Λουλούδι", category: "flowers" },
          { id: 3, emoji: "🌳", name: "Δέντρο", category: "trees" },
          { id: 4, emoji: "🌺", name: "Λουλούδι", category: "flowers" },
          { id: 5, emoji: "🌴", name: "Δέντρο", category: "trees" },
          { id: 6, emoji: "🌻", name: "Λουλούδι", category: "flowers" }
        ]
      },
      {
        id: 8,
        question: "Χώρισε τα μουσικά όργανα από τα αθλητικά",
        basket1: { name: "Μουσικά", emoji: "🎸", category: "music" },
        basket2: { name: "Αθλητικά", emoji: "⚽", category: "sports" },
        color: "#A855F7",
        items: [
          { id: 1, emoji: "🎸", name: "Κιθάρα", category: "music" },
          { id: 2, emoji: "⚽", name: "Μπάλα", category: "sports" },
          { id: 3, emoji: "🎹", name: "Πιάνο", category: "music" },
          { id: 4, emoji: "🏀", name: "Μπάσκετ", category: "sports" },
          { id: 5, emoji: "🎺", name: "Τρομπέτα", category: "music" },
          { id: 6, emoji: "🎾", name: "Τένις", category: "sports" }
        ]
      },
      {
        id: 9,
        question: "Χώρισε τα θαλάσσια από τα χερσαία",
        basket1: { name: "Θαλάσσια", emoji: "🐟", category: "sea" },
        basket2: { name: "Χερσαία", emoji: "🐘", category: "land" },
        color: "#06B6D4",
        items: [
          { id: 1, emoji: "🐟", name: "Ψάρι", category: "sea" },
          { id: 2, emoji: "🐘", name: "Ελέφαντας", category: "land" },
          { id: 3, emoji: "🐙", name: "Χταπόδι", category: "sea" },
          { id: 4, emoji: "🦁", name: "Λιοντάρι", category: "land" },
          { id: 5, emoji: "🐬", name: "Δελφίνι", category: "sea" },
          { id: 6, emoji: "🦒", name: "Καμηλοπάρδαλη", category: "land" }
        ]
      },
      {
        id: 10,
        question: "Χώρισε τα βιβλία από τα εργαλεία",
        basket1: { name: "Βιβλία", emoji: "📚", category: "books" },
        basket2: { name: "Εργαλεία", emoji: "🔨", category: "tools" },
        color: "#8B5CF6",
        items: [
          { id: 1, emoji: "📚", name: "Βιβλίο", category: "books" },
          { id: 2, emoji: "🔨", name: "Σφυρί", category: "tools" },
          { id: 3, emoji: "📖", name: "Βιβλίο", category: "books" },
          { id: 4, emoji: "🔧", name: "Κλειδί", category: "tools" },
          { id: 5, emoji: "📕", name: "Βιβλίο", category: "books" },
          { id: 6, emoji: "🪚", name: "Πριόνι", category: "tools" }
        ]
      }
    ],
    en: [
      {
        id: 1,
        question: "Separate fruits from vegetables",
        basket1: { name: "Fruits", emoji: "🍎", category: "fruits" },
        basket2: { name: "Vegetables", emoji: "🥕", category: "vegetables" },
        color: "#EF4444",
        items: [
          { id: 1, emoji: "🍎", name: "Apple", category: "fruits" },
          { id: 2, emoji: "🥕", name: "Carrot", category: "vegetables" },
          { id: 3, emoji: "🍌", name: "Banana", category: "fruits" },
          { id: 4, emoji: "🥒", name: "Cucumber", category: "vegetables" },
          { id: 5, emoji: "🍊", name: "Orange", category: "fruits" },
          { id: 6, emoji: "🥦", name: "Broccoli", category: "vegetables" }
        ]
      },
      {
        id: 2,
        question: "Separate animals from vehicles",
        basket1: { name: "Animals", emoji: "🐶", category: "animals" },
        basket2: { name: "Vehicles", emoji: "🚗", category: "vehicles" },
        color: "#10B981",
        items: [
          { id: 1, emoji: "🐶", name: "Dog", category: "animals" },
          { id: 2, emoji: "🚗", name: "Car", category: "vehicles" },
          { id: 3, emoji: "🐱", name: "Cat", category: "animals" },
          { id: 4, emoji: "🚌", name: "Bus", category: "vehicles" },
          { id: 5, emoji: "🐦", name: "Bird", category: "animals" },
          { id: 6, emoji: "✈️", name: "Plane", category: "vehicles" }
        ]
      },
      {
        id: 3,
        question: "Separate clothes from toys",
        basket1: { name: "Clothes", emoji: "👕", category: "clothes" },
        basket2: { name: "Toys", emoji: "🧸", category: "toys" },
        color: "#3B82F6",
        items: [
          { id: 1, emoji: "👕", name: "Shirt", category: "clothes" },
          { id: 2, emoji: "🧸", name: "Teddy", category: "toys" },
          { id: 3, emoji: "👖", name: "Pants", category: "clothes" },
          { id: 4, emoji: "⚽", name: "Ball", category: "toys" },
          { id: 5, emoji: "👟", name: "Shoes", category: "clothes" },
          { id: 6, emoji: "🎮", name: "Game", category: "toys" }
        ]
      },
      {
        id: 4,
        question: "Separate food from drinks",
        basket1: { name: "Food", emoji: "🍕", category: "food" },
        basket2: { name: "Drinks", emoji: "🥤", category: "drinks" },
        color: "#EAB308",
        items: [
          { id: 1, emoji: "🍕", name: "Pizza", category: "food" },
          { id: 2, emoji: "🥤", name: "Soda", category: "drinks" },
          { id: 3, emoji: "🍔", name: "Burger", category: "food" },
          { id: 4, emoji: "🧃", name: "Juice", category: "drinks" },
          { id: 5, emoji: "🍰", name: "Cake", category: "food" },
          { id: 6, emoji: "🥛", name: "Milk", category: "drinks" }
        ]
      },
      {
        id: 5,
        question: "Separate shapes from stars",
        basket1: { name: "Shapes", emoji: "🔵", category: "shapes" },
        basket2: { name: "Stars", emoji: "⭐", category: "stars" },
        color: "#EC4899",
        items: [
          { id: 1, emoji: "🔵", name: "Circle", category: "shapes" },
          { id: 2, emoji: "⭐", name: "Star", category: "stars" },
          { id: 3, emoji: "🔴", name: "Circle", category: "shapes" },
          { id: 4, emoji: "✨", name: "Star", category: "stars" },
          { id: 5, emoji: "🟢", name: "Circle", category: "shapes" },
          { id: 6, emoji: "🌟", name: "Star", category: "stars" }
        ]
      },
      {
        id: 6,
        question: "Separate insects from birds",
        basket1: { name: "Insects", emoji: "🐝", category: "insects" },
        basket2: { name: "Birds", emoji: "🐦", category: "birds" },
        color: "#22C55E",
        items: [
          { id: 1, emoji: "🐝", name: "Bee", category: "insects" },
          { id: 2, emoji: "🐦", name: "Bird", category: "birds" },
          { id: 3, emoji: "🦋", name: "Butterfly", category: "insects" },
          { id: 4, emoji: "🦅", name: "Eagle", category: "birds" },
          { id: 5, emoji: "🐞", name: "Ladybug", category: "insects" },
          { id: 6, emoji: "🦆", name: "Duck", category: "birds" }
        ]
      },
      {
        id: 7,
        question: "Separate trees from flowers",
        basket1: { name: "Trees", emoji: "🌲", category: "trees" },
        basket2: { name: "Flowers", emoji: "🌸", category: "flowers" },
        color: "#14B8A6",
        items: [
          { id: 1, emoji: "🌲", name: "Tree", category: "trees" },
          { id: 2, emoji: "🌸", name: "Flower", category: "flowers" },
          { id: 3, emoji: "🌳", name: "Tree", category: "trees" },
          { id: 4, emoji: "🌺", name: "Flower", category: "flowers" },
          { id: 5, emoji: "🌴", name: "Tree", category: "trees" },
          { id: 6, emoji: "🌻", name: "Flower", category: "flowers" }
        ]
      },
      {
        id: 8,
        question: "Separate musical from sports",
        basket1: { name: "Musical", emoji: "🎸", category: "music" },
        basket2: { name: "Sports", emoji: "⚽", category: "sports" },
        color: "#A855F7",
        items: [
          { id: 1, emoji: "🎸", name: "Guitar", category: "music" },
          { id: 2, emoji: "⚽", name: "Ball", category: "sports" },
          { id: 3, emoji: "🎹", name: "Piano", category: "music" },
          { id: 4, emoji: "🏀", name: "Basketball", category: "sports" },
          { id: 5, emoji: "🎺", name: "Trumpet", category: "music" },
          { id: 6, emoji: "🎾", name: "Tennis", category: "sports" }
        ]
      },
      {
        id: 9,
        question: "Separate sea from land animals",
        basket1: { name: "Sea", emoji: "🐟", category: "sea" },
        basket2: { name: "Land", emoji: "🐘", category: "land" },
        color: "#06B6D4",
        items: [
          { id: 1, emoji: "🐟", name: "Fish", category: "sea" },
          { id: 2, emoji: "🐘", name: "Elephant", category: "land" },
          { id: 3, emoji: "🐙", name: "Octopus", category: "sea" },
          { id: 4, emoji: "🦁", name: "Lion", category: "land" },
          { id: 5, emoji: "🐬", name: "Dolphin", category: "sea" },
          { id: 6, emoji: "🦒", name: "Giraffe", category: "land" }
        ]
      },
      {
        id: 10,
        question: "Separate books from tools",
        basket1: { name: "Books", emoji: "📚", category: "books" },
        basket2: { name: "Tools", emoji: "🔨", category: "tools" },
        color: "#8B5CF6",
        items: [
          { id: 1, emoji: "📚", name: "Book", category: "books" },
          { id: 2, emoji: "🔨", name: "Hammer", category: "tools" },
          { id: 3, emoji: "📖", name: "Book", category: "books" },
          { id: 4, emoji: "🔧", name: "Wrench", category: "tools" },
          { id: 5, emoji: "📕", name: "Book", category: "books" },
          { id: 6, emoji: "🪚", name: "Saw", category: "tools" }
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
    // Shuffle items when round changes
    const shuffled = [...round.items].sort(() => Math.random() - 0.5);
    setItems(shuffled);
    setBasket1Items([]);
    setBasket2Items([]);
    setShowAnswer(false);
  }, [currentRound]);

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "🗂️", "✅"][Math.floor(Math.random() * 6)],
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

      const utterance = new SpeechSynthesisUtterance(round.question);
      utterance.lang = lang === 'el' ? 'el-GR' : 'en-US';
      utterance.rate = 0.75;
      utterance.pitch = 1.1;
      const voice = VoiceService.getVoice(lang);
      if (voice) utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    // Speak question automatically when round changes
    const timer = setTimeout(() => {
      speakQuestion();
    }, 500);
    return () => clearTimeout(timer);
  }, [currentRound]);

  const handleDragStart = (item, source) => {
    setDraggedItem({ item, source });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDropToBasket1 = () => {
    if (!draggedItem) return;

    const { item, source } = draggedItem;

    // Remove from source
    if (source === 'items') {
      setItems(prev => prev.filter(i => i.id !== item.id));
    } else if (source === 'basket2') {
      setBasket2Items(prev => prev.filter(i => i.id !== item.id));
    }

    // Add to basket1 if not already there
    if (source !== 'basket1') {
      setBasket1Items(prev => [...prev, item]);
    }

    setDraggedItem(null);
  };

  const handleDropToBasket2 = () => {
    if (!draggedItem) return;

    const { item, source } = draggedItem;

    // Remove from source
    if (source === 'items') {
      setItems(prev => prev.filter(i => i.id !== item.id));
    } else if (source === 'basket1') {
      setBasket1Items(prev => prev.filter(i => i.id !== item.id));
    }

    // Add to basket2 if not already there
    if (source !== 'basket2') {
      setBasket2Items(prev => [...prev, item]);
    }

    setDraggedItem(null);
  };

  const handleDropToItems = () => {
    if (!draggedItem) return;

    const { item, source } = draggedItem;

    // Remove from source basket
    if (source === 'basket1') {
      setBasket1Items(prev => prev.filter(i => i.id !== item.id));
    } else if (source === 'basket2') {
      setBasket2Items(prev => prev.filter(i => i.id !== item.id));
    }

    // Add back to items if not already there
    if (source !== 'items') {
      setItems(prev => [...prev, item]);
    }

    setDraggedItem(null);
  };

  const handleCheckAnswer = () => {
    // Check if all items are placed
    if (items.length > 0) {
      wrongSoundRef.current?.play().catch(() => {});
      return;
    }

    // Check if items are in correct baskets
    const basket1Correct = basket1Items.every(item => item.category === round.basket1.category);
    const basket2Correct = basket2Items.every(item => item.category === round.basket2.category);
    const allItemsPlaced = basket1Items.length + basket2Items.length === round.items.length;

    const isCorrect = basket1Correct && basket2Correct && allItemsPlaced;

    setShowAnswer(true);

    if (isCorrect) {
      correctSoundRef.current?.play().catch(() => {});

      const newScore = score + 1;
      setScore(newScore);

      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      updateProgress({
        title: "Group By Categories Game",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      completeQuiz({
        title: "Group By Categories Game",
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
    } else {
      wrongSoundRef.current?.play().catch(() => {});

      setTimeout(() => {
        setShowAnswer(false);
      }, WRONG_DELAY);
    }
  };

  const progressPercent = Math.round((currentRound / TARGET_ROUNDS) * 100);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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

      <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">
              {lang === "el" ? "Χώρισε σε Ομάδες" : "Group by Categories"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Ομαδοποίηση ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Grouping ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-teal-600">
            🗂️ {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-teal-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-600">
            {progressPercent}%
          </span>
        </div>
      </div>

      <div className="text-center mb-6">
        <div className="inline-block bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl border-4" style={{ borderColor: round.color }}>
          <div className="text-6xl mb-3">🗂️</div>
          <h2 className="text-2xl font-bold mb-3 text-slate-800">
            {round.question}
          </h2>

          <button
            onClick={speakQuestion}
            className="px-6 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white text-lg font-bold rounded-full hover:scale-105 transition-transform shadow-lg"
          >
            🔊 {lang === "el" ? "Άκουσε Ξανά" : "Listen Again"}
          </button>
        </div>
      </div>

      {/* Items Area */}
      <div className="max-w-6xl mx-auto mb-6">
        <div
          className="bg-white/90 backdrop-blur rounded-2xl p-4 shadow-xl border-4 border-slate-300 min-h-[120px]"
          onDragOver={handleDragOver}
          onDrop={handleDropToItems}
        >
          <p className="text-center text-lg font-bold text-slate-700 mb-3">
            {lang === "el" ? "Αντικείμενα" : "Items"}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {items.map((item) => (
              <div
                key={item.id}
                draggable={!showAnswer}
                onDragStart={() => handleDragStart(item, 'items')}
                className={`
                  flex flex-col items-center p-3 bg-white rounded-xl border-2 border-slate-300
                  transition-all duration-300
                  ${!showAnswer ? 'cursor-move hover:scale-110 hover:shadow-lg' : 'cursor-not-allowed opacity-70'}
                  ${draggedItem?.item.id === item.id ? 'opacity-50' : 'opacity-100'}
                `}
              >
                <div className="text-5xl">{item.emoji}</div>
                <p className="text-sm font-semibold text-slate-700 mt-1">{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Baskets */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Basket 1 */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDropToBasket1}
            className="bg-white/90 backdrop-blur rounded-3xl p-6 shadow-xl border-4 min-h-[250px]"
            style={{ borderColor: round.color }}
          >
            <div className="text-center mb-4">
              <div className="text-6xl mb-2">{round.basket1.emoji}</div>
              <p className="text-2xl font-bold text-slate-800">{round.basket1.name}</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {basket1Items.map((item) => (
                <div
                  key={item.id}
                  draggable={!showAnswer}
                  onDragStart={() => handleDragStart(item, 'basket1')}
                  className={`
                    flex flex-col items-center p-3 bg-green-50 rounded-xl border-2
                    transition-all duration-300
                    ${!showAnswer ? 'cursor-move hover:scale-110' : 'cursor-not-allowed'}
                    ${draggedItem?.item.id === item.id ? 'opacity-50' : 'opacity-100'}
                    ${showAnswer && item.category === round.basket1.category ? 'border-green-500' : 'border-red-500'}
                  `}
                  style={{ borderColor: showAnswer ? (item.category === round.basket1.category ? '#22C55E' : '#EF4444') : round.color }}
                >
                  <div className="text-4xl">{item.emoji}</div>
                  <p className="text-xs font-semibold text-slate-700 mt-1">{item.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Basket 2 */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDropToBasket2}
            className="bg-white/90 backdrop-blur rounded-3xl p-6 shadow-xl border-4 min-h-[250px]"
            style={{ borderColor: round.color }}
          >
            <div className="text-center mb-4">
              <div className="text-6xl mb-2">{round.basket2.emoji}</div>
              <p className="text-2xl font-bold text-slate-800">{round.basket2.name}</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {basket2Items.map((item) => (
                <div
                  key={item.id}
                  draggable={!showAnswer}
                  onDragStart={() => handleDragStart(item, 'basket2')}
                  className={`
                    flex flex-col items-center p-3 bg-blue-50 rounded-xl border-2
                    transition-all duration-300
                    ${!showAnswer ? 'cursor-move hover:scale-110' : 'cursor-not-allowed'}
                    ${draggedItem?.item.id === item.id ? 'opacity-50' : 'opacity-100'}
                    ${showAnswer && item.category === round.basket2.category ? 'border-green-500' : 'border-red-500'}
                  `}
                  style={{ borderColor: showAnswer ? (item.category === round.basket2.category ? '#22C55E' : '#EF4444') : round.color }}
                >
                  <div className="text-4xl">{item.emoji}</div>
                  <p className="text-xs font-semibold text-slate-700 mt-1">{item.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Check Button */}
      {!showAnswer && items.length === 0 && (
        <div className="text-center mb-8">
          <button
            onClick={handleCheckAnswer}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-2xl font-bold rounded-full hover:scale-105 transition-transform shadow-lg"
          >
            ✓ {lang === "el" ? "Έλεγχος" : "Check"}
          </button>
        </div>
      )}

      {showAnswer && (
        <div className="text-center animate-fadeIn">
          {basket1Items.every(item => item.category === round.basket1.category) &&
           basket2Items.every(item => item.category === round.basket2.category) ? (
            <div className="bg-green-100 rounded-2xl p-6 inline-block border-4 border-green-400">
              <p className="text-3xl font-bold text-green-700">
                {lang === "el"
                  ? "🎉 Τέλεια! Χώρισες σωστά σε ομάδες!"
                  : "🎉 Perfect! You grouped them correctly!"}
              </p>
            </div>
          ) : (
            <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
              <p className="text-3xl font-bold text-red-700">
                {lang === "el"
                  ? "Προσπάθησε ξανά! Κοίταξε τις κατηγορίες."
                  : "Try again! Look at the categories."}
              </p>
            </div>
          )}
        </div>
      )}

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-green-300/80 to-teal-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🗂️🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Ξέρεις να χωρίζεις σε ομάδες!" : "Perfect! You know how to group by categories!"}
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

