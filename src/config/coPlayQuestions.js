// Co-Play Questions: short, family-friendly trivia for parent + child to play together.
// Each question has 2 versions: "kid" (easier) and "parent" (harder/cultural).

export const COPLAY_CATEGORIES = [
  {
    id: "general",
    title: { el: "🌍 Γενικές Γνώσεις", en: "🌍 General Knowledge" },
    color: "from-blue-400 to-blue-600",
    questions: [
      { kid: { q: { el: "Τι χρώμα είναι ο ουρανός;", en: "What color is the sky?" }, options: { el: ["Μπλε","Πράσινο","Κίτρινο","Κόκκινο"], en: ["Blue","Green","Yellow","Red"] }, correct: 0 },
        parent: { q: { el: "Πότε ιδρύθηκε η UNESCO;", en: "When was UNESCO founded?" }, options: { el: ["1945","1920","1960","1900"], en: ["1945","1920","1960","1900"] }, correct: 0 } },
      { kid: { q: { el: "Πόσες ώρες έχει η μέρα;", en: "How many hours in a day?" }, options: { el: ["24","12","60","48"], en: ["24","12","60","48"] }, correct: 0 },
        parent: { q: { el: "Πόσοι μήνες έχουν 31 μέρες;", en: "How many months have 31 days?" }, options: { el: ["7","6","8","5"], en: ["7","6","8","5"] }, correct: 0 } },
      { kid: { q: { el: "Ποιο ζώο γαβγίζει;", en: "Which animal barks?" }, options: { el: ["Σκύλος","Γάτα","Άλογο","Πρόβατο"], en: ["Dog","Cat","Horse","Sheep"] }, correct: 0 },
        parent: { q: { el: "Πόσα είδη σκυλιών αναγνωρίζει η FCI;", en: "How many dog breeds does FCI recognize?" }, options: { el: ["~360","~100","~500","~200"], en: ["~360","~100","~500","~200"] }, correct: 0 } },
    ],
  },
  {
    id: "math",
    title: { el: "🔢 Μαθηματικά", en: "🔢 Math" },
    color: "from-cyan-400 to-blue-500",
    questions: [
      { kid: { q: { el: "5 + 3 = ;", en: "5 + 3 = ?" }, options: { el: ["8","7","9","6"], en: ["8","7","9","6"] }, correct: 0 },
        parent: { q: { el: "Τετραγωνική ρίζα του 144;", en: "Square root of 144?" }, options: { el: ["12","14","11","13"], en: ["12","14","11","13"] }, correct: 0 } },
      { kid: { q: { el: "10 - 4 = ;", en: "10 - 4 = ?" }, options: { el: ["6","5","7","8"], en: ["6","5","7","8"] }, correct: 0 },
        parent: { q: { el: "15 × 12 = ;", en: "15 × 12 = ?" }, options: { el: ["180","160","200","150"], en: ["180","160","200","150"] }, correct: 0 } },
      { kid: { q: { el: "Πόσοι παίρνουν 2 + 2;", en: "What is 2 + 2?" }, options: { el: ["4","3","5","2"], en: ["4","3","5","2"] }, correct: 0 },
        parent: { q: { el: "Πόσο κάνει 7² ;", en: "What is 7²?" }, options: { el: ["49","42","56","36"], en: ["49","42","56","36"] }, correct: 0 } },
    ],
  },
  {
    id: "nature",
    title: { el: "🌿 Φύση", en: "🌿 Nature" },
    color: "from-emerald-400 to-green-600",
    questions: [
      { kid: { q: { el: "Τι παράγουν τα φυτά;", en: "What do plants produce?" }, options: { el: ["Οξυγόνο","Διοξείδιο","Νερό","Άζωτο"], en: ["Oxygen","CO2","Water","Nitrogen"] }, correct: 0 },
        parent: { q: { el: "Ποια διαδικασία παράγει O₂ στα φυτά;", en: "What process produces O₂ in plants?" }, options: { el: ["Φωτοσύνθεση","Αναπνοή","Ζύμωση","Ώσμωση"], en: ["Photosynthesis","Respiration","Fermentation","Osmosis"] }, correct: 0 } },
      { kid: { q: { el: "Ποιο ζώο δίνει μέλι;", en: "Which animal makes honey?" }, options: { el: ["Μέλισσα","Πεταλούδα","Μυρμήγκι","Ακρίδα"], en: ["Bee","Butterfly","Ant","Grasshopper"] }, correct: 0 },
        parent: { q: { el: "Πόσα είδη μέλισσας υπάρχουν παγκοσμίως;", en: "How many bee species worldwide?" }, options: { el: ["~20.000","~1.000","~5.000","~50.000"], en: ["~20,000","~1,000","~5,000","~50,000"] }, correct: 0 } },
    ],
  },
  {
    id: "history",
    title: { el: "📜 Ιστορία", en: "📜 History" },
    color: "from-amber-400 to-orange-600",
    questions: [
      { kid: { q: { el: "Σε ποια χώρα είναι η Ακρόπολη;", en: "Where is the Acropolis?" }, options: { el: ["Ελλάδα","Ιταλία","Αίγυπτος","Γαλλία"], en: ["Greece","Italy","Egypt","France"] }, correct: 0 },
        parent: { q: { el: "Πότε χτίστηκε ο Παρθενώνας;", en: "When was the Parthenon built?" }, options: { el: ["447-432 π.Χ.","500-450 π.Χ.","100 μ.Χ.","200 π.Χ."], en: ["447-432 BC","500-450 BC","100 AD","200 BC"] }, correct: 0 } },
      { kid: { q: { el: "Ποιος ανακάλυψε την Αμερική;", en: "Who discovered America?" }, options: { el: ["Κολόμβος","Μαγγελάνος","Cook","Marco Polo"], en: ["Columbus","Magellan","Cook","Marco Polo"] }, correct: 0 },
        parent: { q: { el: "Σε ποιο νησί έφτασε πρώτα ο Κολόμβος;", en: "Which island did Columbus first reach?" }, options: { el: ["San Salvador","Κούβα","Αϊτή","Πουέρτο Ρίκο"], en: ["San Salvador","Cuba","Haiti","Puerto Rico"] }, correct: 0 } },
    ],
  },
];

export function getCoplayCategory(id) {
  return COPLAY_CATEGORIES.find((c) => c.id === id);
}
