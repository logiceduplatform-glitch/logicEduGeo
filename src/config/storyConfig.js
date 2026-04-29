// Branching stories - each scene has either choices (path) or a quiz (gate to next).
// Quiz answer determines if you pass or get the "stuck" alternative ending.

export const STORIES = [
  {
    id: "space",
    icon: "🚀",
    title: { el: "Διαστημική Αποστολή", en: "Space Mission" },
    description: { el: "Οδήγησε ένα διαστημόπλοιο σε εξωγήινο πλανήτη!", en: "Pilot a spaceship to an alien planet!" },
    color: "from-indigo-500 to-purple-600",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/10",
    cover: "🌌",
    estimatedMinutes: 5,
    scenes: {
      start: {
        text: { el: "Είσαι αστροναύτης! Το διαστημόπλοιό σου είναι έτοιμο για απογείωση. Πού θες να ταξιδέψεις πρώτα;", en: "You are an astronaut! Your spaceship is ready for launch. Where do you want to travel first?" },
        emoji: "🚀",
        choices: [
          { text: { el: "Στον Άρη", en: "To Mars" }, next: "mars" },
          { text: { el: "Στη Σελήνη", en: "To the Moon" }, next: "moon" },
        ],
      },
      mars: {
        text: { el: "Ο Άρης είναι κόκκινος! Συναντάς έναν Αρειανό. Σε ρωτάει: «Πόσοι πλανήτες υπάρχουν στο ηλιακό σύστημα;»", en: "Mars is red! You meet a Martian. They ask you: 'How many planets are in the solar system?'" },
        emoji: "🪐",
        quiz: {
          question: { el: "Πόσοι πλανήτες;", en: "How many planets?" },
          options: ["6", "7", "8", "9"],
          correct: 2,
        },
        onCorrect: "marsWin",
        onWrong: "marsStuck",
      },
      marsWin: {
        text: { el: "Σωστά! Ο Αρειανός σου χαρίζει έναν χάρτη του γαλαξία!", en: "Correct! The Martian gives you a galaxy map!" },
        emoji: "🗺️",
        choices: [{ text: { el: "Συνέχισε στη Σελήνη", en: "Continue to the Moon" }, next: "moon" }],
      },
      marsStuck: {
        text: { el: "Λάθος! Ο Αρειανός λυπάται αλλά σε στέλνει πίσω. Ξεκίνα ξανά!", en: "Wrong! The Martian is sad but sends you back. Start again!" },
        emoji: "😅",
        ending: "small",
      },
      moon: {
        text: { el: "Φτάνεις στη Σελήνη! Πεινάς. Τι θα φας;", en: "You reach the Moon! You are hungry. What will you eat?" },
        emoji: "🌙",
        quiz: {
          question: { el: "Από τι είναι η Σελήνη;", en: "What is the Moon made of?" },
          options: [{ el: "Τυρί", en: "Cheese" }, { el: "Πάγος", en: "Ice" }, { el: "Πέτρα", en: "Rock" }, { el: "Νερό", en: "Water" }],
          correct: 2,
        },
        onCorrect: "moonWin",
        onWrong: "moonStuck",
      },
      moonWin: {
        text: { el: "Σωστά! Είναι από πέτρα! Βρίσκεις έναν θησαυρό! 💎", en: "Correct! It's made of rock! You find treasure! 💎" },
        emoji: "💎",
        ending: "great",
      },
      moonStuck: {
        text: { el: "Λάθος! Δεν μπορείς να φας πέτρα. Επιστρέφεις στη Γη.", en: "Wrong! You can't eat rock. Returning to Earth." },
        emoji: "🌍",
        ending: "small",
      },
    },
  },
  {
    id: "dragon",
    icon: "🐉",
    title: { el: "Ο Δράκος του Βουνού", en: "The Mountain Dragon" },
    description: { el: "Αντιμετώπισε τον δράκο και σώσε το χωριό!", en: "Face the dragon and save the village!" },
    color: "from-red-500 to-orange-600",
    bgColor: "bg-red-50 dark:bg-red-900/10",
    cover: "🐲",
    estimatedMinutes: 5,
    scenes: {
      start: {
        text: { el: "Ένας δράκος απείλησε το χωριό σου! Πρέπει να τον σταματήσεις. Τι όπλο θα πάρεις;", en: "A dragon is threatening your village! You must stop it. What weapon will you take?" },
        emoji: "⚔️",
        choices: [
          { text: { el: "Σπαθί", en: "Sword" }, next: "sword" },
          { text: { el: "Μαγικό Ραβδί", en: "Magic Wand" }, next: "wand" },
        ],
      },
      sword: {
        text: { el: "Ξεκινάς να σκαρφαλώνεις στο βουνό. Ένας γκριμπέρης σε σταματάει με γρίφο:", en: "You climb the mountain. A goblin stops you with a riddle:" },
        emoji: "👹",
        quiz: {
          question: { el: "Πόσο είναι 6 + 7;", en: "What is 6 + 7?" },
          options: ["12", "13", "14", "15"],
          correct: 1,
        },
        onCorrect: "swordWin",
        onWrong: "swordStuck",
      },
      swordWin: {
        text: { el: "Ο γκριμπέρης χάνει! Συνεχίζεις και βρίσκεις τον δράκο.", en: "The goblin loses! You continue and find the dragon." },
        emoji: "🏔️",
        choices: [{ text: { el: "Αντιμετώπισε τον δράκο", en: "Face the dragon" }, next: "battle" }],
      },
      swordStuck: {
        text: { el: "Ο γκριμπέρης γελάει και σε διώχνει.", en: "The goblin laughs and chases you away." },
        emoji: "😅",
        ending: "small",
      },
      wand: {
        text: { el: "Με μαγικό ραβδί στο χέρι, μια μάγισσα σε ρωτάει:", en: "With magic wand in hand, a witch asks you:" },
        emoji: "🧙‍♀️",
        quiz: {
          question: { el: "Ποιο είναι το χρώμα της μαγείας;", en: "What is the color of magic?" },
          options: [{ el: "Κόκκινο", en: "Red" }, { el: "Μωβ", en: "Purple" }, { el: "Πράσινο", en: "Green" }, { el: "Κίτρινο", en: "Yellow" }],
          correct: 1,
        },
        onCorrect: "battle",
        onWrong: "wandStuck",
      },
      wandStuck: {
        text: { el: "Η μάγισσα σε εξαφανίζει σε άλλη διάσταση!", en: "The witch banishes you to another dimension!" },
        emoji: "🌀",
        ending: "small",
      },
      battle: {
        text: { el: "Ο δράκος αναπνέει φωτιά! Πρέπει να βρεις την αδυναμία του.", en: "The dragon breathes fire! You must find its weakness." },
        emoji: "🔥",
        quiz: {
          question: { el: "Ποια είναι η αδυναμία του δράκου;", en: "What is the dragon's weakness?" },
          options: [{ el: "Νερό", en: "Water" }, { el: "Φωτιά", en: "Fire" }, { el: "Άμμος", en: "Sand" }, { el: "Αέρας", en: "Air" }],
          correct: 0,
        },
        onCorrect: "dragonWin",
        onWrong: "dragonStuck",
      },
      dragonWin: {
        text: { el: "Με νερό, ο δράκος ηρεμεί! Σώζεις το χωριό! 🎉", en: "With water, the dragon calms! You save the village! 🎉" },
        emoji: "🏆",
        ending: "great",
      },
      dragonStuck: {
        text: { el: "Ο δράκος είναι πολύ δυνατός. Πρέπει να ξανανακαλύψεις την αδυναμία.", en: "The dragon is too strong. You must rediscover its weakness." },
        emoji: "😢",
        ending: "small",
      },
    },
  },
  {
    id: "ocean",
    icon: "🌊",
    title: { el: "Μυστικό του Ωκεανού", en: "Ocean Secret" },
    description: { el: "Βρες τον χαμένο θησαυρό στα βάθη της θάλασσας!", en: "Find the lost treasure in the depths of the sea!" },
    color: "from-cyan-500 to-blue-600",
    bgColor: "bg-cyan-50 dark:bg-cyan-900/10",
    cover: "🐠",
    estimatedMinutes: 4,
    scenes: {
      start: {
        text: { el: "Είσαι δύτης! Βρίσκεις έναν παλιό χάρτη που δείχνει θησαυρό. Πού θα ψάξεις πρώτα;", en: "You are a diver! You find an old map showing treasure. Where will you search first?" },
        emoji: "🗺️",
        choices: [
          { text: { el: "Σπηλιά Καρχαριών", en: "Shark Cave" }, next: "shark" },
          { text: { el: "Παλιό Ναυάγιο", en: "Old Shipwreck" }, next: "wreck" },
        ],
      },
      shark: {
        text: { el: "Ένας καρχαρίας! Πρέπει να μάθεις γρήγορα...", en: "A shark! You must learn quickly..." },
        emoji: "🦈",
        quiz: {
          question: { el: "Τα ψάρια αναπνέουν με...;", en: "Fish breathe with...?" },
          options: [{ el: "Πνεύμονες", en: "Lungs" }, { el: "Βράγχια", en: "Gills" }, { el: "Δέρμα", en: "Skin" }, { el: "Στόμα", en: "Mouth" }],
          correct: 1,
        },
        onCorrect: "wreck",
        onWrong: "sharkStuck",
      },
      sharkStuck: {
        text: { el: "Ο καρχαρίας πλησιάζει! Επιστρέφεις στην επιφάνεια.", en: "The shark approaches! You return to the surface." },
        emoji: "🏊",
        ending: "small",
      },
      wreck: {
        text: { el: "Φτάνεις στο ναυάγιο! Βρίσκεις ένα κιβώτιο. Πώς θα το ανοίξεις;", en: "You reach the wreck! You find a chest. How will you open it?" },
        emoji: "📦",
        quiz: {
          question: { el: "Πόσες πλευρές έχει ένα τετράγωνο κιβώτιο;", en: "How many sides does a square box have?" },
          options: ["4", "5", "6", "8"],
          correct: 2,
        },
        onCorrect: "treasure",
        onWrong: "wreckStuck",
      },
      treasure: {
        text: { el: "Το κιβώτιο ανοίγει! Χρυσά νομίσματα! 💰", en: "The chest opens! Gold coins! 💰" },
        emoji: "👑",
        ending: "great",
      },
      wreckStuck: {
        text: { el: "Δεν μπόρεσες να ανοίξεις το κιβώτιο.", en: "You couldn't open the chest." },
        emoji: "😢",
        ending: "small",
      },
    },
  },
  {
    id: "forest",
    icon: "🌳",
    title: { el: "Το Μαγικό Δάσος", en: "The Magic Forest" },
    description: { el: "Βοήθησε τα ζώα του δάσους!", en: "Help the forest animals!" },
    color: "from-emerald-500 to-green-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/10",
    cover: "🦊",
    estimatedMinutes: 4,
    scenes: {
      start: {
        text: { el: "Στο δάσος, μια αλεπού ζητά βοήθεια. Ποιο ζώο θα πας πρώτα να βρεις;", en: "In the forest, a fox asks for help. Which animal will you find first?" },
        emoji: "🦊",
        choices: [
          { text: { el: "Κουκουβάγια", en: "Owl" }, next: "owl" },
          { text: { el: "Λαγός", en: "Rabbit" }, next: "rabbit" },
        ],
      },
      owl: {
        text: { el: "Η κουκουβάγια θέλει να σε δοκιμάσει με γρίφο:", en: "The owl wants to test you with a riddle:" },
        emoji: "🦉",
        quiz: {
          question: { el: "Πόσα πόδια έχει μια αράχνη;", en: "How many legs does a spider have?" },
          options: ["4", "6", "8", "10"],
          correct: 2,
        },
        onCorrect: "owlWin",
        onWrong: "owlStuck",
      },
      owlWin: {
        text: { el: "Η κουκουβάγια σου δίνει το «κλειδί της σοφίας»!", en: "The owl gives you the 'key of wisdom'!" },
        emoji: "🗝️",
        choices: [{ text: { el: "Επίστρεψε στην αλεπού", en: "Return to the fox" }, next: "foxWin" }],
      },
      owlStuck: {
        text: { el: "Η κουκουβάγια πετάει μακριά απογοητευμένη.", en: "The owl flies away disappointed." },
        emoji: "😢",
        ending: "small",
      },
      rabbit: {
        text: { el: "Ο λαγός κάνει διαγωνισμό μαθηματικών!", en: "The rabbit holds a math contest!" },
        emoji: "🐰",
        quiz: {
          question: { el: "5 × 6 = ?", en: "5 × 6 = ?" },
          options: ["25", "30", "35", "40"],
          correct: 1,
        },
        onCorrect: "rabbitWin",
        onWrong: "owlStuck",
      },
      rabbitWin: {
        text: { el: "Ο λαγός σου δίνει ένα μαγικό καρότο!", en: "The rabbit gives you a magic carrot!" },
        emoji: "🥕",
        choices: [{ text: { el: "Επίστρεψε στην αλεπού", en: "Return to the fox" }, next: "foxWin" }],
      },
      foxWin: {
        text: { el: "Η αλεπού είναι ευτυχισμένη! Σε ονομάζει «Φύλακα του Δάσους»! 🌟", en: "The fox is happy! Names you 'Guardian of the Forest'! 🌟" },
        emoji: "🏆",
        ending: "great",
      },
    },
  },
  {
    id: "time",
    icon: "⏰",
    title: { el: "Ταξίδι στον Χρόνο", en: "Time Journey" },
    description: { el: "Ταξίδεψε στο παρελθόν και διόρθωσε την Ιστορία!", en: "Travel to the past and fix history!" },
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-50 dark:bg-amber-900/10",
    cover: "⏳",
    estimatedMinutes: 5,
    scenes: {
      start: {
        text: { el: "Η μηχανή χρόνου είναι έτοιμη! Σε ποια εποχή θες να πας;", en: "The time machine is ready! What era do you want to visit?" },
        emoji: "⏰",
        choices: [
          { text: { el: "Αρχαία Ελλάδα", en: "Ancient Greece" }, next: "greece" },
          { text: { el: "Δεινόσαυροι", en: "Dinosaurs" }, next: "dinos" },
        ],
      },
      greece: {
        text: { el: "Είσαι στην αρχαία Αθήνα! Ένας φιλόσοφος σε ρωτάει:", en: "You are in ancient Athens! A philosopher asks:" },
        emoji: "🏛️",
        quiz: {
          question: { el: "Ποιος ήταν ο Σωκράτης;", en: "Who was Socrates?" },
          options: [{ el: "Ζωγράφος", en: "Painter" }, { el: "Φιλόσοφος", en: "Philosopher" }, { el: "Στρατιώτης", en: "Soldier" }, { el: "Βασιλιάς", en: "King" }],
          correct: 1,
        },
        onCorrect: "greeceWin",
        onWrong: "greeceStuck",
      },
      greeceWin: {
        text: { el: "Σωστά! Σε καλεί στο συμπόσιο των φιλοσόφων! 🎓", en: "Correct! You're invited to the philosophers' symposium! 🎓" },
        emoji: "🏆",
        ending: "great",
      },
      greeceStuck: {
        text: { el: "Ο φιλόσοφος γελάει: «Έχεις πολλά να μάθεις!»", en: "The philosopher laughs: 'You have much to learn!'" },
        emoji: "😅",
        ending: "small",
      },
      dinos: {
        text: { el: "ΩΩΩ! Δεινόσαυροι παντού! Ένας Τυραννόσαυρος σε πλησιάζει.", en: "WOW! Dinosaurs everywhere! A T-Rex approaches." },
        emoji: "🦖",
        quiz: {
          question: { el: "Τι έτρωγε ο T-Rex;", en: "What did T-Rex eat?" },
          options: [{ el: "Φυτά", en: "Plants" }, { el: "Κρέας", en: "Meat" }, { el: "Ψάρια", en: "Fish" }, { el: "Έντομα", en: "Insects" }],
          correct: 1,
        },
        onCorrect: "dinosWin",
        onWrong: "dinosStuck",
      },
      dinosWin: {
        text: { el: "Ξέρεις πολλά! Κρύβεσαι έγκαιρα και επιστρέφεις στο παρόν! 🦕", en: "You know a lot! You hide in time and return to the present! 🦕" },
        emoji: "🏆",
        ending: "great",
      },
      dinosStuck: {
        text: { el: "Ο T-Rex σε προλαβαίνει! Επιστρέφεις στο παρόν τρέχοντας!", en: "T-Rex catches up! You run back to the present!" },
        emoji: "🏃",
        ending: "small",
      },
    },
  },
];

const STORY_PROGRESS_KEY = "geo:storyProgress";

export function getStoryProgress() {
  try { return JSON.parse(localStorage.getItem(STORY_PROGRESS_KEY)) || {}; } catch { return {}; }
}

export function saveStoryProgress(storyId, ending) {
  const progress = getStoryProgress();
  progress[storyId] = {
    completed: true,
    ending,
    completedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORY_PROGRESS_KEY, JSON.stringify(progress));
}
