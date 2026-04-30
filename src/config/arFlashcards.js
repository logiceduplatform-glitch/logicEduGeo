// AR Flashcards content. Each card has:
//   - id, category, question, answer, emoji (3D representation), color
//   - facts (3 fun facts for back side)

export const AR_DECKS = [
  {
    id: "animals",
    title: { el: "🦁 Ζώα", en: "🦁 Animals" },
    color: "from-amber-400 to-orange-500",
    cards: [
      { id: "lion",     emoji: "🦁", question: { el: "Τι ζώο είναι;", en: "What animal is this?" }, answer: { el: "Λιοντάρι", en: "Lion" }, facts: { el: ["Ζει στην Αφρική", "Ονομάζεται 'βασιλιάς της ζούγκλας'", "Τα αρσενικά έχουν χαίτη"], en: ["Lives in Africa", "Called 'king of the jungle'", "Males have a mane"] } },
      { id: "elephant", emoji: "🐘", question: { el: "Τι ζώο είναι;", en: "What animal is this?" }, answer: { el: "Ελέφαντας", en: "Elephant" }, facts: { el: ["Το μεγαλύτερο χερσαίο θηλαστικό", "Έχει εξαιρετική μνήμη", "Ζει 60-70 χρόνια"], en: ["Largest land mammal", "Has excellent memory", "Lives 60-70 years"] } },
      { id: "giraffe",  emoji: "🦒", question: { el: "Τι ζώο είναι;", en: "What animal is this?" }, answer: { el: "Καμηλοπάρδαλη", en: "Giraffe" }, facts: { el: ["Το ψηλότερο ζώο", "Η γλώσσα είναι 50εκ", "Κοιμάται μόνο 30λ την ημέρα"], en: ["Tallest animal", "Tongue is 50cm long", "Sleeps only 30 min/day"] } },
      { id: "penguin",  emoji: "🐧", question: { el: "Τι ζώο είναι;", en: "What animal is this?" }, answer: { el: "Πιγκουίνος", en: "Penguin" }, facts: { el: ["Δεν πετά", "Ζει στους πάγους", "Κολυμπά σαν τορπίλη"], en: ["Cannot fly", "Lives on ice", "Swims like a torpedo"] } },
      { id: "octopus",  emoji: "🐙", question: { el: "Τι ζώο είναι;", en: "What animal is this?" }, answer: { el: "Χταπόδι", en: "Octopus" }, facts: { el: ["Έχει 3 καρδιές", "Έχει 8 πλοκάμια", "Είναι πανέξυπνο"], en: ["Has 3 hearts", "Has 8 arms", "Very intelligent"] } },
      { id: "butterfly",emoji: "🦋", question: { el: "Τι ζώο είναι;", en: "What animal is this?" }, answer: { el: "Πεταλούδα", en: "Butterfly" }, facts: { el: ["Γεύεται με τα πόδια", "Ξεκινά ως κάμπια", "Πετά έως 30km/h"], en: ["Tastes with feet", "Starts as caterpillar", "Flies up to 30 km/h"] } },
    ],
  },
  {
    id: "space",
    title: { el: "🪐 Διάστημα", en: "🪐 Space" },
    color: "from-indigo-500 to-purple-700",
    cards: [
      { id: "earth",  emoji: "🌍", question: { el: "Ποιος πλανήτης;", en: "Which planet?" }, answer: { el: "Γη", en: "Earth" }, facts: { el: ["3ος πλανήτης από τον Ήλιο", "Έχει 1 φυσικό δορυφόρο", "70% είναι νερό"], en: ["3rd planet from Sun", "Has 1 natural moon", "70% is water"] } },
      { id: "moon",   emoji: "🌙", question: { el: "Τι είναι αυτό;", en: "What is this?" }, answer: { el: "Σελήνη", en: "Moon" }, facts: { el: ["Δεν έχει ατμόσφαιρα", "1 φεγγάρι έχει η Γη", "Πατήθηκε το 1969"], en: ["No atmosphere", "Earth's only moon", "Visited in 1969"] } },
      { id: "sun",    emoji: "☀️", question: { el: "Τι είναι αυτό;", en: "What is this?" }, answer: { el: "Ήλιος", en: "Sun" }, facts: { el: ["Είναι αστέρι", "Πάνω από 5500°C επιφάνεια", "Ζει 4.6 δις χρόνια"], en: ["It's a star", "5500°C surface", "4.6 billion years old"] } },
      { id: "saturn", emoji: "🪐", question: { el: "Ποιος πλανήτης;", en: "Which planet?" }, answer: { el: "Κρόνος", en: "Saturn" }, facts: { el: ["Έχει εντυπωσιακούς δακτυλίους", "Ο 2ος μεγαλύτερος", "Έχει 80+ φεγγάρια"], en: ["Has stunning rings", "2nd largest planet", "Has 80+ moons"] } },
      { id: "rocket", emoji: "🚀", question: { el: "Τι είναι αυτό;", en: "What is this?" }, answer: { el: "Πύραυλος", en: "Rocket" }, facts: { el: ["Φτάνει στο διάστημα", "Καίει υδρογόνο", "Πάει >28000 km/h"], en: ["Reaches space", "Burns hydrogen", "Goes >28000 km/h"] } },
      { id: "alien",  emoji: "👽", question: { el: "Τι είναι αυτό;", en: "What is this?" }, answer: { el: "Εξωγήινος", en: "Alien" }, facts: { el: ["Φανταστικό πλάσμα", "Ζει σε άλλους πλανήτες (ίσως)", "Δεν έχει βρεθεί ακόμη"], en: ["Imaginary creature", "Maybe lives on other planets", "Not found yet"] } },
    ],
  },
  {
    id: "food",
    title: { el: "🍕 Φαγητά", en: "🍕 Food" },
    color: "from-rose-400 to-pink-600",
    cards: [
      { id: "pizza",   emoji: "🍕", question: { el: "Τι φαγητό είναι;", en: "What food is this?" }, answer: { el: "Πίτσα", en: "Pizza" }, facts: { el: ["Από Ιταλία", "Ψήνεται στον φούρνο", "Πιο δημοφιλής η Margherita"], en: ["From Italy", "Baked in oven", "Margherita is most popular"] } },
      { id: "burger",  emoji: "🍔", question: { el: "Τι φαγητό είναι;", en: "What food is this?" }, answer: { el: "Μπέργκερ", en: "Burger" }, facts: { el: ["Από ΗΠΑ", "Έχει ψωμάκι, μπιφτέκι, σαλάτα", "Πολύ διάσημο"], en: ["From USA", "Bun, patty, salad", "Very famous"] } },
      { id: "apple",   emoji: "🍎", question: { el: "Τι φρούτο είναι;", en: "What fruit?" }, answer: { el: "Μήλο", en: "Apple" }, facts: { el: ["Έχει βιταμίνες", "Πολλά χρώματα", "1 την ημέρα = υγεία"], en: ["Has vitamins", "Many colors", "An apple a day..."] } },
      { id: "ice_cream",emoji: "🍦", question: { el: "Τι γλυκό είναι;", en: "What dessert?" }, answer: { el: "Παγωτό", en: "Ice cream" }, facts: { el: ["Δροσίζει", "Βανίλια & σοκολάτα είναι κορυφαία", "Φτιάχτηκε στην Κίνα"], en: ["Cools you", "Vanilla & chocolate top", "Invented in China"] } },
    ],
  },
  {
    id: "math",
    title: { el: "🔢 Μαθηματικά", en: "🔢 Math" },
    color: "from-cyan-400 to-blue-600",
    cards: [
      { id: "cube",      emoji: "🧊", question: { el: "Τι σχήμα;", en: "What shape?" }, answer: { el: "Κύβος", en: "Cube" }, facts: { el: ["6 πλευρές", "12 ακμές", "8 κορυφές"], en: ["6 faces", "12 edges", "8 vertices"] } },
      { id: "circle",    emoji: "⭕", question: { el: "Τι σχήμα;", en: "What shape?" }, answer: { el: "Κύκλος", en: "Circle" }, facts: { el: ["Έχει ακτίνα & διάμετρο", "π ≈ 3.14", "Δεν έχει γωνίες"], en: ["Has radius & diameter", "π ≈ 3.14", "No corners"] } },
      { id: "triangle",  emoji: "🔺", question: { el: "Τι σχήμα;", en: "What shape?" }, answer: { el: "Τρίγωνο", en: "Triangle" }, facts: { el: ["3 πλευρές", "3 γωνίες", "Άθροισμα = 180°"], en: ["3 sides", "3 angles", "Sum = 180°"] } },
      { id: "diamond",   emoji: "💎", question: { el: "Τι σχήμα;", en: "What shape?" }, answer: { el: "Ρόμβος", en: "Diamond/Rhombus" }, facts: { el: ["4 ίσες πλευρές", "Κάθετες διαγώνιοι", "Παραλληλόγραμμο"], en: ["4 equal sides", "Perpendicular diagonals", "It's a parallelogram"] } },
    ],
  },
];

export function getDeck(id) {
  return AR_DECKS.find((d) => d.id === id);
}
