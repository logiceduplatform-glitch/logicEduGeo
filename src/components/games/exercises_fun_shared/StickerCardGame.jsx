// src/components/games/StickerCardGame.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import { VoiceService } from "../../../services/VoiceService";

export default function StickerCardGame({ lang = "el", onComplete, difficulty = 3 }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [placedStickers, setPlacedStickers] = useState([]);
  const [draggedSticker, setDraggedSticker] = useState(null);
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
        cardName: "Καρτέλα Φρούτων",
        background: "linear-gradient(to bottom, #FFF8DC, #FFFACD)",
        description: "Βάλε τα φρούτα στις σωστές θέσεις!",
        slots: [
          { id: "slot1", x: 20, y: 20, correctSticker: "🍎", label: "Μήλο", color: "#EF4444" },
          { id: "slot2", x: 50, y: 20, correctSticker: "🍌", label: "Μπανάνα", color: "#EAB308" },
          { id: "slot3", x: 80, y: 20, correctSticker: "🍊", label: "Πορτοκάλι", color: "#F97316" },
          { id: "slot4", x: 35, y: 60, correctSticker: "🍇", label: "Σταφύλι", color: "#A855F7" },
          { id: "slot5", x: 65, y: 60, correctSticker: "🍓", label: "Φράουλα", color: "#EF4444" }
        ],
        availableStickers: ["🍎", "🍌", "🍊", "🍇", "🍓", "🥕", "🥦"]
      },
      {
        id: 2,
        cardName: "Καρτέλα Ζώων",
        background: "linear-gradient(to bottom, #E0F2FE, #BAE6FD)",
        description: "Βάλε τα ζώα στις σωστές θέσεις!",
        slots: [
          { id: "slot1", x: 25, y: 25, correctSticker: "🐶", label: "Σκύλος", color: "#D97706" },
          { id: "slot2", x: 50, y: 25, correctSticker: "🐱", label: "Γάτα", color: "#F59E0B" },
          { id: "slot3", x: 75, y: 25, correctSticker: "🐰", label: "Λαγός", color: "#94A3B8" },
          { id: "slot4", x: 37.5, y: 65, correctSticker: "🐻", label: "Αρκούδα", color: "#78350F" },
          { id: "slot5", x: 62.5, y: 65, correctSticker: "🦊", label: "Αλεπού", color: "#EA580C" }
        ],
        availableStickers: ["🐶", "🐱", "🐰", "🐻", "🦊", "🐸", "🐔"]
      },
      {
        id: 3,
        cardName: "Καρτέλα Σχημάτων",
        background: "linear-gradient(to bottom, #FECACA, #FEE2E2)",
        description: "Βάλε τα σχήματα στις σωστές θέσεις!",
        slots: [
          { id: "slot1", x: 20, y: 30, correctSticker: "🔴", label: "Κύκλος", color: "#EF4444" },
          { id: "slot2", x: 40, y: 30, correctSticker: "🟦", label: "Τετράγωνο", color: "#3B82F6" },
          { id: "slot3", x: 60, y: 30, correctSticker: "🟢", label: "Κύκλος", color: "#22C55E" },
          { id: "slot4", x: 80, y: 30, correctSticker: "🟡", label: "Κύκλος", color: "#EAB308" },
          { id: "slot5", x: 50, y: 70, correctSticker: "🟣", label: "Κύκλος", color: "#A855F7" }
        ],
        availableStickers: ["🔴", "🟦", "🟢", "🟡", "🟣", "🟤", "⚫"]
      },
      {
        id: 4,
        cardName: "Καρτέλα Οχημάτων",
        background: "linear-gradient(to bottom, #DBEAFE, #BFDBFE)",
        description: "Βάλε τα οχήματα στις σωστές θέσεις!",
        slots: [
          { id: "slot1", x: 20, y: 20, correctSticker: "🚗", label: "Αυτοκίνητο", color: "#3B82F6" },
          { id: "slot2", x: 50, y: 20, correctSticker: "🚌", label: "Λεωφορείο", color: "#EAB308" },
          { id: "slot3", x: 80, y: 20, correctSticker: "🚆", label: "Τρένο", color: "#EF4444" },
          { id: "slot4", x: 35, y: 70, correctSticker: "✈️", label: "Αεροπλάνο", color: "#06B6D4" },
          { id: "slot5", x: 65, y: 70, correctSticker: "🚁", label: "Ελικόπτερο", color: "#22C55E" }
        ],
        availableStickers: ["🚗", "🚌", "🚆", "✈️", "🚁", "🚲", "⛵"]
      },
      {
        id: 5,
        cardName: "Καρτέλα Καιρού",
        background: "linear-gradient(to bottom, #E0E7FF, #C7D2FE)",
        description: "Βάλε τα σύμβολα καιρού στις σωστές θέσεις!",
        slots: [
          { id: "slot1", x: 20, y: 25, correctSticker: "☀️", label: "Ήλιος", color: "#EAB308" },
          { id: "slot2", x: 40, y: 25, correctSticker: "☁️", label: "Σύννεφο", color: "#94A3B8" },
          { id: "slot3", x: 60, y: 25, correctSticker: "🌧️", label: "Βροχή", color: "#3B82F6" },
          { id: "slot4", x: 80, y: 25, correctSticker: "⚡", label: "Αστραπή", color: "#EAB308" },
          { id: "slot5", x: 50, y: 70, correctSticker: "❄️", label: "Χιόνι", color: "#06B6D4" }
        ],
        availableStickers: ["☀️", "☁️", "🌧️", "⚡", "❄️", "🌈", "🌙"]
      },
      {
        id: 6,
        cardName: "Καρτέλα Αριθμών",
        background: "linear-gradient(to bottom, #FEF3C7, #FDE68A)",
        description: "Βάλε τους αριθμούς στις σωστές θέσεις!",
        slots: [
          { id: "slot1", x: 15, y: 50, correctSticker: "1️⃣", label: "Ένα", color: "#EF4444" },
          { id: "slot2", x: 30, y: 50, correctSticker: "2️⃣", label: "Δύο", color: "#F59E0B" },
          { id: "slot3", x: 45, y: 50, correctSticker: "3️⃣", label: "Τρία", color: "#EAB308" },
          { id: "slot4", x: 60, y: 50, correctSticker: "4️⃣", label: "Τέσσερα", color: "#22C55E" },
          { id: "slot5", x: 75, y: 50, correctSticker: "5️⃣", label: "Πέντε", color: "#3B82F6" }
        ],
        availableStickers: ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣"]
      },
      {
        id: 7,
        cardName: "Καρτέλα Θαλασσινών",
        background: "linear-gradient(to bottom, #A7F3D0, #6EE7B7)",
        description: "Βάλε τα θαλασσινά στις σωστές θέσεις!",
        slots: [
          { id: "slot1", x: 25, y: 30, correctSticker: "🐟", label: "Ψάρι", color: "#3B82F6" },
          { id: "slot2", x: 50, y: 30, correctSticker: "🐠", label: "Τροπικό Ψάρι", color: "#F59E0B" },
          { id: "slot3", x: 75, y: 30, correctSticker: "🐡", label: "Ψάρι Μπαλόνι", color: "#EAB308" },
          { id: "slot4", x: 37.5, y: 70, correctSticker: "🦈", label: "Καρχαρίας", color: "#64748B" },
          { id: "slot5", x: 62.5, y: 70, correctSticker: "🐙", label: "Χταπόδι", color: "#EC4899" }
        ],
        availableStickers: ["🐟", "🐠", "🐡", "🦈", "🐙", "🦀", "🐚"]
      },
      {
        id: 8,
        cardName: "Καρτέλα Λουλουδιών",
        background: "linear-gradient(to bottom, #FBCFE8, #F9A8D4)",
        description: "Βάλε τα λουλούδια στις σωστές θέσεις!",
        slots: [
          { id: "slot1", x: 20, y: 25, correctSticker: "🌸", label: "Ροζ Λουλούδι", color: "#EC4899" },
          { id: "slot2", x: 40, y: 25, correctSticker: "🌺", label: "Κόκκινο Λουλούδι", color: "#EF4444" },
          { id: "slot3", x: 60, y: 25, correctSticker: "🌻", label: "Ηλιοτρόπιο", color: "#EAB308" },
          { id: "slot4", x: 80, y: 25, correctSticker: "🌷", label: "Τουλίπα", color: "#F59E0B" },
          { id: "slot5", x: 50, y: 70, correctSticker: "🌹", label: "Τριαντάφυλλο", color: "#DC2626" }
        ],
        availableStickers: ["🌸", "🌺", "🌻", "🌷", "🌹", "🌼", "🏵️"]
      },
      {
        id: 9,
        cardName: "Καρτέλα Φαγητού",
        background: "linear-gradient(to bottom, #FED7AA, #FDBA74)",
        description: "Βάλε το φαγητό στις σωστές θέσεις!",
        slots: [
          { id: "slot1", x: 20, y: 30, correctSticker: "🍕", label: "Πίτσα", color: "#DC2626" },
          { id: "slot2", x: 40, y: 30, correctSticker: "🍔", label: "Μπέργκερ", color: "#D97706" },
          { id: "slot3", x: 60, y: 30, correctSticker: "🍟", label: "Πατάτες", color: "#EAB308" },
          { id: "slot4", x: 80, y: 30, correctSticker: "🌭", label: "Χοτ Ντογκ", color: "#F59E0B" },
          { id: "slot5", x: 50, y: 70, correctSticker: "🍰", label: "Τούρτα", color: "#EC4899" }
        ],
        availableStickers: ["🍕", "🍔", "🍟", "🌭", "🍰", "🍦", "🍪"]
      },
      {
        id: 10,
        cardName: "Καρτέλα Αστεριών",
        background: "linear-gradient(to bottom, #1E1B4B, #312E81)",
        description: "Βάλε τα αστέρια στις σωστές θέσεις!",
        slots: [
          { id: "slot1", x: 20, y: 20, correctSticker: "⭐", label: "Αστέρι", color: "#EAB308" },
          { id: "slot2", x: 50, y: 20, correctSticker: "🌟", label: "Λαμπερό Αστέρι", color: "#FBBF24" },
          { id: "slot3", x: 80, y: 20, correctSticker: "✨", label: "Σπινθήρες", color: "#FDE047" },
          { id: "slot4", x: 35, y: 70, correctSticker: "💫", label: "Ζαλισμένο Αστέρι", color: "#F0ABFC" },
          { id: "slot5", x: 65, y: 70, correctSticker: "🌠", label: "Πεφταστέρι", color: "#BFDBFE" }
        ],
        availableStickers: ["⭐", "🌟", "✨", "💫", "🌠", "🌙", "☄️"]
      }
    ],
    en: [
      {
        id: 1,
        cardName: "Fruit Card",
        background: "linear-gradient(to bottom, #FFF8DC, #FFFACD)",
        description: "Place the fruits in the correct positions!",
        slots: [
          { id: "slot1", x: 20, y: 20, correctSticker: "🍎", label: "Apple", color: "#EF4444" },
          { id: "slot2", x: 50, y: 20, correctSticker: "🍌", label: "Banana", color: "#EAB308" },
          { id: "slot3", x: 80, y: 20, correctSticker: "🍊", label: "Orange", color: "#F97316" },
          { id: "slot4", x: 35, y: 60, correctSticker: "🍇", label: "Grapes", color: "#A855F7" },
          { id: "slot5", x: 65, y: 60, correctSticker: "🍓", label: "Strawberry", color: "#EF4444" }
        ],
        availableStickers: ["🍎", "🍌", "🍊", "🍇", "🍓", "🥕", "🥦"]
      },
      {
        id: 2,
        cardName: "Animal Card",
        background: "linear-gradient(to bottom, #E0F2FE, #BAE6FD)",
        description: "Place the animals in the correct positions!",
        slots: [
          { id: "slot1", x: 25, y: 25, correctSticker: "🐶", label: "Dog", color: "#D97706" },
          { id: "slot2", x: 50, y: 25, correctSticker: "🐱", label: "Cat", color: "#F59E0B" },
          { id: "slot3", x: 75, y: 25, correctSticker: "🐰", label: "Rabbit", color: "#94A3B8" },
          { id: "slot4", x: 37.5, y: 65, correctSticker: "🐻", label: "Bear", color: "#78350F" },
          { id: "slot5", x: 62.5, y: 65, correctSticker: "🦊", label: "Fox", color: "#EA580C" }
        ],
        availableStickers: ["🐶", "🐱", "🐰", "🐻", "🦊", "🐸", "🐔"]
      },
      {
        id: 3,
        cardName: "Shape Card",
        background: "linear-gradient(to bottom, #FECACA, #FEE2E2)",
        description: "Place the shapes in the correct positions!",
        slots: [
          { id: "slot1", x: 20, y: 30, correctSticker: "🔴", label: "Circle", color: "#EF4444" },
          { id: "slot2", x: 40, y: 30, correctSticker: "🟦", label: "Square", color: "#3B82F6" },
          { id: "slot3", x: 60, y: 30, correctSticker: "🟢", label: "Circle", color: "#22C55E" },
          { id: "slot4", x: 80, y: 30, correctSticker: "🟡", label: "Circle", color: "#EAB308" },
          { id: "slot5", x: 50, y: 70, correctSticker: "🟣", label: "Circle", color: "#A855F7" }
        ],
        availableStickers: ["🔴", "🟦", "🟢", "🟡", "🟣", "🟤", "⚫"]
      },
      {
        id: 4,
        cardName: "Vehicle Card",
        background: "linear-gradient(to bottom, #DBEAFE, #BFDBFE)",
        description: "Place the vehicles in the correct positions!",
        slots: [
          { id: "slot1", x: 20, y: 20, correctSticker: "🚗", label: "Car", color: "#3B82F6" },
          { id: "slot2", x: 50, y: 20, correctSticker: "🚌", label: "Bus", color: "#EAB308" },
          { id: "slot3", x: 80, y: 20, correctSticker: "🚆", label: "Train", color: "#EF4444" },
          { id: "slot4", x: 35, y: 70, correctSticker: "✈️", label: "Plane", color: "#06B6D4" },
          { id: "slot5", x: 65, y: 70, correctSticker: "🚁", label: "Helicopter", color: "#22C55E" }
        ],
        availableStickers: ["🚗", "🚌", "🚆", "✈️", "🚁", "🚲", "⛵"]
      },
      {
        id: 5,
        cardName: "Weather Card",
        background: "linear-gradient(to bottom, #E0E7FF, #C7D2FE)",
        description: "Place the weather symbols in the correct positions!",
        slots: [
          { id: "slot1", x: 20, y: 25, correctSticker: "☀️", label: "Sun", color: "#EAB308" },
          { id: "slot2", x: 40, y: 25, correctSticker: "☁️", label: "Cloud", color: "#94A3B8" },
          { id: "slot3", x: 60, y: 25, correctSticker: "🌧️", label: "Rain", color: "#3B82F6" },
          { id: "slot4", x: 80, y: 25, correctSticker: "⚡", label: "Lightning", color: "#EAB308" },
          { id: "slot5", x: 50, y: 70, correctSticker: "❄️", label: "Snow", color: "#06B6D4" }
        ],
        availableStickers: ["☀️", "☁️", "🌧️", "⚡", "❄️", "🌈", "🌙"]
      },
      {
        id: 6,
        cardName: "Number Card",
        background: "linear-gradient(to bottom, #FEF3C7, #FDE68A)",
        description: "Place the numbers in the correct positions!",
        slots: [
          { id: "slot1", x: 15, y: 50, correctSticker: "1️⃣", label: "One", color: "#EF4444" },
          { id: "slot2", x: 30, y: 50, correctSticker: "2️⃣", label: "Two", color: "#F59E0B" },
          { id: "slot3", x: 45, y: 50, correctSticker: "3️⃣", label: "Three", color: "#EAB308" },
          { id: "slot4", x: 60, y: 50, correctSticker: "4️⃣", label: "Four", color: "#22C55E" },
          { id: "slot5", x: 75, y: 50, correctSticker: "5️⃣", label: "Five", color: "#3B82F6" }
        ],
        availableStickers: ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣"]
      },
      {
        id: 7,
        cardName: "Sea Creatures Card",
        background: "linear-gradient(to bottom, #A7F3D0, #6EE7B7)",
        description: "Place the sea creatures in the correct positions!",
        slots: [
          { id: "slot1", x: 25, y: 30, correctSticker: "🐟", label: "Fish", color: "#3B82F6" },
          { id: "slot2", x: 50, y: 30, correctSticker: "🐠", label: "Tropical Fish", color: "#F59E0B" },
          { id: "slot3", x: 75, y: 30, correctSticker: "🐡", label: "Blowfish", color: "#EAB308" },
          { id: "slot4", x: 37.5, y: 70, correctSticker: "🦈", label: "Shark", color: "#64748B" },
          { id: "slot5", x: 62.5, y: 70, correctSticker: "🐙", label: "Octopus", color: "#EC4899" }
        ],
        availableStickers: ["🐟", "🐠", "🐡", "🦈", "🐙", "🦀", "🐚"]
      },
      {
        id: 8,
        cardName: "Flower Card",
        background: "linear-gradient(to bottom, #FBCFE8, #F9A8D4)",
        description: "Place the flowers in the correct positions!",
        slots: [
          { id: "slot1", x: 20, y: 25, correctSticker: "🌸", label: "Pink Flower", color: "#EC4899" },
          { id: "slot2", x: 40, y: 25, correctSticker: "🌺", label: "Red Flower", color: "#EF4444" },
          { id: "slot3", x: 60, y: 25, correctSticker: "🌻", label: "Sunflower", color: "#EAB308" },
          { id: "slot4", x: 80, y: 25, correctSticker: "🌷", label: "Tulip", color: "#F59E0B" },
          { id: "slot5", x: 50, y: 70, correctSticker: "🌹", label: "Rose", color: "#DC2626" }
        ],
        availableStickers: ["🌸", "🌺", "🌻", "🌷", "🌹", "🌼", "🏵️"]
      },
      {
        id: 9,
        cardName: "Food Card",
        background: "linear-gradient(to bottom, #FED7AA, #FDBA74)",
        description: "Place the food in the correct positions!",
        slots: [
          { id: "slot1", x: 20, y: 30, correctSticker: "🍕", label: "Pizza", color: "#DC2626" },
          { id: "slot2", x: 40, y: 30, correctSticker: "🍔", label: "Burger", color: "#D97706" },
          { id: "slot3", x: 60, y: 30, correctSticker: "🍟", label: "Fries", color: "#EAB308" },
          { id: "slot4", x: 80, y: 30, correctSticker: "🌭", label: "Hot Dog", color: "#F59E0B" },
          { id: "slot5", x: 50, y: 70, correctSticker: "🍰", label: "Cake", color: "#EC4899" }
        ],
        availableStickers: ["🍕", "🍔", "🍟", "🌭", "🍰", "🍦", "🍪"]
      },
      {
        id: 10,
        cardName: "Star Card",
        background: "linear-gradient(to bottom, #1E1B4B, #312E81)",
        description: "Place the stars in the correct positions!",
        slots: [
          { id: "slot1", x: 20, y: 20, correctSticker: "⭐", label: "Star", color: "#EAB308" },
          { id: "slot2", x: 50, y: 20, correctSticker: "🌟", label: "Glowing Star", color: "#FBBF24" },
          { id: "slot3", x: 80, y: 20, correctSticker: "✨", label: "Sparkles", color: "#FDE047" },
          { id: "slot4", x: 35, y: 70, correctSticker: "💫", label: "Dizzy Star", color: "#F0ABFC" },
          { id: "slot5", x: 65, y: 70, correctSticker: "🌠", label: "Shooting Star", color: "#BFDBFE" }
        ],
        availableStickers: ["⭐", "🌟", "✨", "💫", "🌠", "🌙", "☄️"]
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
    setPlacedStickers([]);
    setShowAnswer(false);
  }, [currentRound]);

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "✅", "🎯"][Math.floor(Math.random() * 6)],
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

  const handleDragStart = (sticker) => {
    setDraggedSticker(sticker);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, slot) => {
    e.preventDefault();

    if (!draggedSticker || showAnswer) return;

    // Check if slot already filled
    if (placedStickers.find(p => p.slotId === slot.id)) {
      setDraggedSticker(null);
      return;
    }

    const isCorrect = draggedSticker === slot.correctSticker;

    if (isCorrect) {
      correctSoundRef.current?.play().catch(() => {});

      setPlacedStickers(prev => [...prev, {
        slotId: slot.id,
        sticker: draggedSticker
      }]);

      // Check if all slots are filled
      const newPlacedCount = placedStickers.length + 1;
      if (newPlacedCount === round.slots.length) {
        handleComplete();
      }
    } else {
      wrongSoundRef.current?.play().catch(() => {});
    }

    setDraggedSticker(null);
  };

  const handleComplete = () => {
    setShowAnswer(true);

    const newScore = score + 1;
    setScore(newScore);

    setScorePopup({ id: Date.now(), x: 50 });
    setTimeout(() => setScorePopup(null), 1000);

    updateProgress({
      title: "Sticker Card Game",
      score: newScore,
      total: TARGET_ROUNDS,
      index: currentRound + 1,
    });

    completeQuiz({
      title: "Sticker Card Game",
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

  const progressPercent = Math.round((currentRound / TARGET_ROUNDS) * 100);
  const placedCount = placedStickers.length;
  const totalSlots = round.slots.length;

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Καρτέλα Stickers" : "Sticker Card"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {round.cardName} - {lang === "el"
                ? `Επίπεδο ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Level ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-pink-600">
            🎯 {score}
          </div>
        </div>

        <div className="flex items-center gap-3 mb-3">
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

        {/* Progress indicator */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-700">
            {lang === "el" ? "Πρόοδος:" : "Progress:"}
          </span>
          <div className="flex gap-1">
            {Array.from({ length: totalSlots }).map((_, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all duration-300 ${
                  i < placedCount
                    ? 'bg-pink-400 text-white scale-110'
                    : 'bg-slate-200 text-slate-400'
                }`}
              >
                {i < placedCount ? '✓' : '○'}
              </div>
            ))}
          </div>
          <span className="text-sm text-slate-600 ml-2">
            {placedCount}/{totalSlots}
          </span>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center mb-6">
        <div className="inline-block bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl border-4 border-pink-400">
          <div className="text-7xl mb-3">🎯</div>
          <h2 className="text-3xl font-bold mb-3 text-slate-800">
            {round.description}
          </h2>

          <button
            onClick={speakQuestion}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-bold rounded-full hover:scale-105 transition-transform shadow-lg"
          >
            🔊 {lang === "el" ? "Άκουσε Ξανά" : "Listen Again"}
          </button>
        </div>
      </div>

      {/* Sticker Card */}
      <div className="max-w-5xl mx-auto mb-6">
        <div className="relative rounded-3xl shadow-2xl overflow-hidden border-4 border-white" style={{ height: '450px', background: round.background }}>
          {/* Slots */}
          {round.slots.map((slot) => {
            const placed = placedStickers.find(p => p.slotId === slot.id);

            return (
              <div
                key={slot.id}
                className="absolute"
                style={{
                  left: `${slot.x}%`,
                  top: `${slot.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, slot)}
              >
                {/* Slot background */}
                <div
                  className={`w-24 h-24 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    placed
                      ? 'bg-white/90 border-4 scale-110'
                      : 'bg-white/50 border-4 border-dashed'
                  }`}
                  style={{
                    borderColor: placed ? slot.color : '#CBD5E1'
                  }}
                >
                  {placed ? (
                    <div className="text-6xl animate-bounce">
                      {placed.sticker}
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-3xl opacity-30">📍</div>
                      <p className="text-xs font-bold text-slate-500 mt-1">{slot.label}</p>
                    </div>
                  )}
                </div>

                {placed && (
                  <div className="absolute -top-2 -right-2 text-3xl animate-bounce">
                    ✅
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Available Stickers */}
      <div className="max-w-5xl mx-auto">
        <div className="bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl border-4 border-pink-400">
          <p className="text-center text-lg font-bold text-slate-800 mb-4">
            {lang === "el" ? "Σύρε τα stickers στις σωστές θέσεις:" : "Drag the stickers to the correct positions:"}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {round.availableStickers.map((sticker, index) => {
              const isUsed = placedStickers.find(p => p.sticker === sticker);

              return (
                <div
                  key={index}
                  draggable={!isUsed && !showAnswer}
                  onDragStart={() => handleDragStart(sticker)}
                  className={`
                    relative w-20 h-20 rounded-2xl border-4 transition-all duration-300 transform flex items-center justify-center
                    ${isUsed
                      ? 'bg-gray-100 border-gray-300 opacity-30 cursor-not-allowed'
                      : 'bg-gradient-to-br from-purple-100 to-pink-100 border-purple-300 hover:border-pink-400 hover:scale-110 cursor-grab active:cursor-grabbing shadow-lg'}
                  `}
                >
                  <div className="text-5xl">{sticker}</div>

                  {isUsed && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-xl">
                      <div className="text-3xl">✓</div>
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
                ? `🎉 Τέλεια! Ολοκλήρωσες την ${round.cardName}!`
                : `🎉 Perfect! You completed the ${round.cardName}!`}
            </p>
          </div>
        </div>
      )}

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-300/80 to-pink-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🎯🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Ξέρεις να βάζεις stickers!" : "Perfect! You know how to place stickers!"}
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

