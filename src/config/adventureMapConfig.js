export const ADVENTURE_STATIONS = [
  { id: 1,  icon: "🌈", name: { el: "Χρώματα & Σχήματα", en: "Colors & Shapes" }, route: "/play/2-3-fun", zone: "forest", stars: 3, description: { el: "Μάθε τα χρώματα και τα σχήματα!", en: "Learn colors and shapes!" } },
  { id: 2,  icon: "🔢", name: { el: "Αριθμοί 1-10", en: "Numbers 1-10" }, route: "/play/2-3-school", zone: "forest", stars: 3, description: { el: "Μέτρησε από το 1 ως το 10!", en: "Count from 1 to 10!" } },
  { id: 3,  icon: "🐾", name: { el: "Ζώα & Ήχοι", en: "Animals & Sounds" }, route: "/play/2-3-fun", zone: "forest", stars: 3, description: { el: "Ποιο ζώο κάνει αυτόν τον ήχο;", en: "Which animal makes this sound?" } },
  { id: 4,  icon: "🧩", name: { el: "Πρώτα Παζλ", en: "First Puzzles" }, route: "/play/2-3-logic", zone: "forest", stars: 3, description: { el: "Λύσε τα πρώτα σου παζλ!", en: "Solve your first puzzles!" } },
  { id: 5,  icon: "⭐", name: { el: "Δοκιμασία Δάσους", en: "Forest Trial" }, route: "/play/4-5-fun", zone: "forest", stars: 3, boss: true, description: { el: "Μπορείς να περάσεις τη δοκιμασία;", en: "Can you pass the trial?" } },

  { id: 6,  icon: "🎨", name: { el: "Τέχνη & Μοτίβα", en: "Art & Patterns" }, route: "/play/4-5-fun", zone: "beach", stars: 3, description: { el: "Βρες τα μοτίβα στην τέχνη!", en: "Find patterns in art!" } },
  { id: 7,  icon: "🧠", name: { el: "Μνήμη & Λογική", en: "Memory & Logic" }, route: "/play/4-5-logic", zone: "beach", stars: 3, description: { el: "Πόσο δυνατή είναι η μνήμη σου;", en: "How strong is your memory?" } },
  { id: 8,  icon: "📖", name: { el: "Γράμματα & Λέξεις", en: "Letters & Words" }, route: "/play/4-5-fun", zone: "beach", stars: 3, description: { el: "Ανακάλυψε τα γράμματα!", en: "Discover the letters!" } },
  { id: 9,  icon: "🌊", name: { el: "Φύση & Κόσμος", en: "Nature & World" }, route: "/play/4-5-fun", zone: "beach", stars: 3, description: { el: "Εξερεύνησε τη φύση!", en: "Explore nature!" } },
  { id: 10, icon: "🏖️", name: { el: "Δοκιμασία Παραλίας", en: "Beach Trial" }, route: "/play/6-fun", zone: "beach", stars: 3, boss: true, description: { el: "Ο αρχηγός της παραλίας σε προκαλεί!", en: "The beach boss challenges you!" } },

  { id: 11, icon: "➕", name: { el: "Πρόσθεση & Αφαίρεση", en: "Addition & Subtraction" }, route: "/play/6-logic", zone: "mountain", stars: 3, description: { el: "Μάθε πρόσθεση και αφαίρεση!", en: "Learn addition and subtraction!" } },
  { id: 12, icon: "🔤", name: { el: "Ορθογραφία", en: "Spelling" }, route: "/play/6-fun", zone: "mountain", stars: 3, description: { el: "Πόσο καλά γράφεις;", en: "How well can you spell?" } },
  { id: 13, icon: "🌍", name: { el: "Γεωγραφία", en: "Geography" }, route: "/play/7-8-fun", zone: "mountain", stars: 3, description: { el: "Ταξίδεψε στον κόσμο!", en: "Travel the world!" } },
  { id: 14, icon: "🔬", name: { el: "Επιστήμη", en: "Science" }, route: "/play/7-8-fun", zone: "mountain", stars: 3, description: { el: "Ανακάλυψε την επιστήμη!", en: "Discover science!" } },
  { id: 15, icon: "⛰️", name: { el: "Δοκιμασία Βουνού", en: "Mountain Trial" }, route: "/play/7-8-logic", zone: "mountain", stars: 3, boss: true, description: { el: "Ο αρχηγός του βουνού σε περιμένει!", en: "The mountain boss awaits!" } },

  { id: 16, icon: "📐", name: { el: "Γεωμετρία", en: "Geometry" }, route: "/play/9-10-logic", zone: "castle", stars: 3, description: { el: "Σχήματα και γωνίες!", en: "Shapes and angles!" } },
  { id: 17, icon: "📜", name: { el: "Ιστορία", en: "History" }, route: "/play/9-10-fun", zone: "castle", stars: 3, description: { el: "Ταξίδι στο χρόνο!", en: "Travel through time!" } },
  { id: 18, icon: "🧪", name: { el: "Πειράματα", en: "Experiments" }, route: "/play/9-10-fun", zone: "castle", stars: 3, description: { el: "Γίνε επιστήμονας!", en: "Become a scientist!" } },
  { id: 19, icon: "📊", name: { el: "Προχωρημένα Μαθηματικά", en: "Advanced Math" }, route: "/play/9-10-logic", zone: "castle", stars: 3, description: { el: "Κλάσματα, δεκαδικοί κι ακόμα πιο πολλά!", en: "Fractions, decimals and more!" } },
  { id: 20, icon: "🏰", name: { el: "Δοκιμασία Κάστρου", en: "Castle Trial" }, route: "/play/11-12-fun", zone: "castle", stars: 3, boss: true, description: { el: "Ο βασιλιάς του κάστρου σε προκαλεί!", en: "The castle king challenges you!" } },

  { id: 21, icon: "🎲", name: { el: "Επιτραπέζια", en: "Board Games" }, route: "/play/board-games", zone: "space", stars: 3, description: { el: "Παίξε επιτραπέζια παιχνίδια!", en: "Play board games!" } },
  { id: 22, icon: "💡", name: { el: "Brain Teasers", en: "Brain Teasers" }, route: "/play/11-12-logic", zone: "space", stars: 3, description: { el: "Σπαζοκεφαλιές για δυνατά μυαλά!", en: "Brain teasers for sharp minds!" } },
  { id: 23, icon: "🎓", name: { el: "Σχολική Προετοιμασία", en: "School Prep" }, route: "/play/11-12-school", zone: "space", stars: 3, description: { el: "Ετοιμάσου για το σχολείο!", en: "Get ready for school!" } },
  { id: 24, icon: "🌟", name: { el: "Κουίζ Γνώσεων", en: "Knowledge Quiz" }, route: "/play/adult-games", zone: "space", stars: 3, description: { el: "Πόσα ξέρεις;", en: "How much do you know?" } },
  { id: 25, icon: "👑", name: { el: "Τελικός Αρχηγός", en: "Final Boss" }, route: "/daily", zone: "space", stars: 3, boss: true, description: { el: "Η τελική πρόκληση! Μπορείς;", en: "The final challenge! Can you do it?" } },
];

export const ZONES = [
  { id: "forest",   name: { el: "Μαγικό Δάσος",   en: "Magic Forest" },    color: "from-emerald-400 to-green-600",  bgEmoji: "🌲", stations: [1,2,3,4,5] },
  { id: "beach",    name: { el: "Ηλιόλουστη Ακτή", en: "Sunny Beach" },     color: "from-cyan-400 to-blue-500",      bgEmoji: "🏝️", stations: [6,7,8,9,10] },
  { id: "mountain", name: { el: "Χιονισμένο Βουνό", en: "Snowy Mountain" }, color: "from-slate-400 to-indigo-500",   bgEmoji: "🏔️", stations: [11,12,13,14,15] },
  { id: "castle",   name: { el: "Αρχαίο Κάστρο",   en: "Ancient Castle" },  color: "from-amber-400 to-orange-600",   bgEmoji: "🏰", stations: [16,17,18,19,20] },
  { id: "space",    name: { el: "Διάστημα",         en: "Space" },           color: "from-violet-500 to-purple-700",  bgEmoji: "🚀", stations: [21,22,23,24,25] },
];

export function getAdventureProgress() {
  try { return JSON.parse(localStorage.getItem("geo:adventureMap")) || { completed: {}, current: 1 }; } catch { return { completed: {}, current: 1 }; }
}

export function saveAdventureProgress(progress) {
  localStorage.setItem("geo:adventureMap", JSON.stringify(progress));
}

export function completeStation(stationId, starsEarned) {
  const progress = getAdventureProgress();
  const prev = progress.completed[stationId];
  progress.completed[stationId] = Math.max(prev || 0, starsEarned);
  if (stationId >= progress.current) {
    progress.current = stationId + 1;
  }
  saveAdventureProgress(progress);
  return progress;
}
