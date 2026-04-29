// Collectible cards system
// Rarities: common, rare, epic, legendary

export const RARITIES = {
  common:    { color: "from-slate-300 to-slate-500",       text: "text-slate-700",  border: "border-slate-300",  glow: "",                           weight: 60, label: { el: "Κοινή",      en: "Common" } },
  rare:      { color: "from-blue-400 to-blue-600",         text: "text-blue-700",   border: "border-blue-400",   glow: "shadow-blue-200",            weight: 25, label: { el: "Σπάνια",     en: "Rare" } },
  epic:      { color: "from-purple-400 to-pink-500",       text: "text-purple-700", border: "border-purple-400", glow: "shadow-purple-200",          weight: 12, label: { el: "Επική",      en: "Epic" } },
  legendary: { color: "from-amber-400 via-orange-500 to-rose-500", text: "text-amber-700", border: "border-amber-400", glow: "shadow-amber-300 shadow-xl", weight: 3, label: { el: "Θρυλική",    en: "Legendary" } },
};

export const CARD_CATEGORIES = [
  { id: "animals",  icon: "🐾", label: { el: "Ζώα",      en: "Animals" } },
  { id: "planets",  icon: "🪐", label: { el: "Πλανήτες", en: "Planets" } },
  { id: "heroes",   icon: "🦸", label: { el: "Ήρωες",    en: "Heroes" } },
  { id: "myth",     icon: "🐉", label: { el: "Μύθοι",    en: "Mythical" } },
];

export const CARDS = [
  // === ANIMALS ===
  { id: "a01", category: "animals", emoji: "🦁", name: { el: "Λιοντάρι",    en: "Lion" },        rarity: "common",    fact: { el: "Ο βασιλιάς της ζούγκλας!", en: "King of the jungle!" } },
  { id: "a02", category: "animals", emoji: "🐯", name: { el: "Τίγρης",      en: "Tiger" },       rarity: "common",    fact: { el: "Τα ριγέ ζώα της Ασίας.", en: "The striped Asian beasts." } },
  { id: "a03", category: "animals", emoji: "🐘", name: { el: "Ελέφαντας",   en: "Elephant" },    rarity: "common",    fact: { el: "Το πιο μεγάλο ζώο της στεριάς.", en: "The largest land animal." } },
  { id: "a04", category: "animals", emoji: "🐧", name: { el: "Πιγκουίνος",  en: "Penguin" },     rarity: "common",    fact: { el: "Πουλί που δεν πετάει αλλά κολυμπά!", en: "A bird that swims, not flies!" } },
  { id: "a05", category: "animals", emoji: "🐬", name: { el: "Δελφίνι",     en: "Dolphin" },     rarity: "common",    fact: { el: "Έξυπνα θαλάσσια θηλαστικά.", en: "Smart sea mammals." } },
  { id: "a06", category: "animals", emoji: "🦊", name: { el: "Αλεπού",      en: "Fox" },         rarity: "common",    fact: { el: "Πανέξυπνη και πανούργα!", en: "Clever and cunning!" } },
  { id: "a07", category: "animals", emoji: "🐺", name: { el: "Λύκος",       en: "Wolf" },        rarity: "common",    fact: { el: "Ζει σε αγέλες.", en: "Lives in packs." } },
  { id: "a08", category: "animals", emoji: "🐼", name: { el: "Πάντα",        en: "Panda" },       rarity: "rare",      fact: { el: "Τρώει μόνο μπαμπού.", en: "Eats only bamboo." } },
  { id: "a09", category: "animals", emoji: "🐨", name: { el: "Κοάλα",        en: "Koala" },       rarity: "rare",      fact: { el: "Κοιμάται 18 ώρες την ημέρα!", en: "Sleeps 18 hours a day!" } },
  { id: "a10", category: "animals", emoji: "🦒", name: { el: "Καμηλοπάρδαλη",en: "Giraffe" },     rarity: "common",    fact: { el: "Το πιο ψηλό ζώο.", en: "Tallest animal." } },
  { id: "a11", category: "animals", emoji: "🐢", name: { el: "Χελώνα",      en: "Turtle" },      rarity: "common",    fact: { el: "Ζει 100+ χρόνια!", en: "Lives 100+ years!" } },
  { id: "a12", category: "animals", emoji: "🦋", name: { el: "Πεταλούδα",   en: "Butterfly" },   rarity: "rare",      fact: { el: "Μεταμορφώνεται από κάμπια!", en: "Transforms from caterpillar!" } },
  { id: "a13", category: "animals", emoji: "🐙", name: { el: "Χταπόδι",     en: "Octopus" },     rarity: "epic",      fact: { el: "Έχει 9 εγκεφάλους!", en: "Has 9 brains!" } },
  { id: "a14", category: "animals", emoji: "🦅", name: { el: "Αετός",       en: "Eagle" },       rarity: "rare",      fact: { el: "Έχει εξαιρετική όραση.", en: "Has amazing vision." } },
  { id: "a15", category: "animals", emoji: "🦉", name: { el: "Κουκουβάγια", en: "Owl" },         rarity: "rare",      fact: { el: "Σύμβολο σοφίας.", en: "Symbol of wisdom." } },
  { id: "a16", category: "animals", emoji: "🦈", name: { el: "Καρχαρίας",   en: "Shark" },       rarity: "epic",      fact: { el: "Υπάρχει 400 εκατ. χρόνια!", en: "Exists for 400M years!" } },
  { id: "a17", category: "animals", emoji: "🐻‍❄️", name: { el: "Πολική Αρκούδα",en: "Polar Bear" },rarity: "epic",      fact: { el: "Ζει στον πάγο.", en: "Lives on ice." } },

  // === PLANETS ===
  { id: "p01", category: "planets", emoji: "☀️", name: { el: "Ήλιος",      en: "Sun" },         rarity: "epic",      fact: { el: "Άστρο 4.6 δισ. ετών.", en: "4.6 billion year old star." } },
  { id: "p02", category: "planets", emoji: "🌍", name: { el: "Γη",          en: "Earth" },       rarity: "rare",      fact: { el: "Το σπίτι μας!", en: "Our home!" } },
  { id: "p03", category: "planets", emoji: "🌙", name: { el: "Σελήνη",      en: "Moon" },        rarity: "common",    fact: { el: "Ο δορυφόρος της Γης.", en: "Earth's satellite." } },
  { id: "p04", category: "planets", emoji: "♂️", name: { el: "Άρης",        en: "Mars" },        rarity: "common",    fact: { el: "Ο Κόκκινος Πλανήτης.", en: "The Red Planet." } },
  { id: "p05", category: "planets", emoji: "♃", name: { el: "Δίας",         en: "Jupiter" },     rarity: "rare",      fact: { el: "Ο μεγαλύτερος πλανήτης.", en: "Largest planet." } },
  { id: "p06", category: "planets", emoji: "♄", name: { el: "Κρόνος",       en: "Saturn" },      rarity: "rare",      fact: { el: "Ο πλανήτης με τους δακτυλίους.", en: "The ringed planet." } },
  { id: "p07", category: "planets", emoji: "♀️", name: { el: "Αφροδίτη",    en: "Venus" },       rarity: "common",    fact: { el: "Ο πιο φωτεινός πλανήτης.", en: "Brightest planet." } },
  { id: "p08", category: "planets", emoji: "☿", name: { el: "Ερμής",        en: "Mercury" },     rarity: "common",    fact: { el: "Ο πιο κοντινός στον Ήλιο.", en: "Closest to the Sun." } },
  { id: "p09", category: "planets", emoji: "♅", name: { el: "Ουρανός",      en: "Uranus" },      rarity: "epic",      fact: { el: "Γέρνει στο πλάι!", en: "Tilts on its side!" } },
  { id: "p10", category: "planets", emoji: "♆", name: { el: "Ποσειδώνας",   en: "Neptune" },     rarity: "epic",      fact: { el: "Ο πιο μακρινός πλανήτης.", en: "Farthest planet." } },
  { id: "p11", category: "planets", emoji: "🌌", name: { el: "Γαλαξίας",    en: "Galaxy" },      rarity: "legendary", fact: { el: "Δισεκατομμύρια άστρα!", en: "Billions of stars!" } },
  { id: "p12", category: "planets", emoji: "⭐", name: { el: "Άστρο",        en: "Star" },        rarity: "common",    fact: { el: "Φωτίζει το διάστημα.", en: "Lights the universe." } },
  { id: "p13", category: "planets", emoji: "☄️", name: { el: "Κομήτης",     en: "Comet" },       rarity: "rare",      fact: { el: "Πάγος και πέτρα στο διάστημα.", en: "Ice and rock in space." } },
  { id: "p14", category: "planets", emoji: "🛸", name: { el: "UFO",          en: "UFO" },         rarity: "legendary", fact: { el: "Άγνωστο Ιπτάμενο Αντικείμενο!", en: "Unidentified Flying Object!" } },

  // === HEROES ===
  { id: "h01", category: "heroes",  emoji: "🦸‍♀️", name: { el: "Σούπερ Κορίτσι",   en: "Super Girl" },     rarity: "common",    fact: { el: "Σώζει τον κόσμο!", en: "Saves the world!" } },
  { id: "h02", category: "heroes",  emoji: "🦸‍♂️", name: { el: "Σούπερ Ήρωας",     en: "Super Hero" },     rarity: "common",    fact: { el: "Πετάει στον αέρα!", en: "Flies through air!" } },
  { id: "h03", category: "heroes",  emoji: "🥷", name: { el: "Νίντζα",          en: "Ninja" },          rarity: "rare",      fact: { el: "Σιωπηλός μαχητής.", en: "Silent fighter." } },
  { id: "h04", category: "heroes",  emoji: "🧙‍♂️", name: { el: "Μάγος",            en: "Wizard" },         rarity: "rare",      fact: { el: "Κάνει μαγικά!", en: "Makes magic!" } },
  { id: "h05", category: "heroes",  emoji: "👨‍🚀", name: { el: "Αστροναύτης",      en: "Astronaut" },      rarity: "rare",      fact: { el: "Εξερευνά το διάστημα.", en: "Explores space." } },
  { id: "h06", category: "heroes",  emoji: "🧜‍♀️", name: { el: "Γοργόνα",          en: "Mermaid" },        rarity: "epic",      fact: { el: "Μισό άνθρωπος, μισό ψάρι.", en: "Half human, half fish." } },
  { id: "h07", category: "heroes",  emoji: "🧚‍♀️", name: { el: "Νεράιδα",          en: "Fairy" },          rarity: "epic",      fact: { el: "Έχει μαγικά φτερά.", en: "Has magic wings." } },
  { id: "h08", category: "heroes",  emoji: "👸", name: { el: "Πριγκίπισσα",      en: "Princess" },       rarity: "rare",      fact: { el: "Της κορώνας!", en: "Of the crown!" } },
  { id: "h09", category: "heroes",  emoji: "🤴", name: { el: "Πρίγκιπας",         en: "Prince" },         rarity: "rare",      fact: { el: "Γενναίος και ευγενής.", en: "Brave and noble." } },
  { id: "h10", category: "heroes",  emoji: "🧝‍♀️", name: { el: "Ξωτικό",            en: "Elf" },            rarity: "epic",      fact: { el: "Πλάσμα του δάσους.", en: "Forest creature." } },
  { id: "h11", category: "heroes",  emoji: "🤖", name: { el: "Ρομπότ Ήρωας",      en: "Hero Robot" },     rarity: "epic",      fact: { el: "Μηχανή σώτηρας.", en: "Savior machine." } },
  { id: "h12", category: "heroes",  emoji: "🧞‍♂️", name: { el: "Τζίνι",              en: "Genie" },          rarity: "legendary", fact: { el: "Πραγματοποιεί ευχές!", en: "Grants wishes!" } },

  // === MYTHICAL ===
  { id: "m01", category: "myth",    emoji: "🐉", name: { el: "Δράκος",        en: "Dragon" },         rarity: "epic",      fact: { el: "Φυσάει φωτιά!", en: "Breathes fire!" } },
  { id: "m02", category: "myth",    emoji: "🦄", name: { el: "Μονόκερος",     en: "Unicorn" },        rarity: "legendary", fact: { el: "Μαγικό άλογο.", en: "Magical horse." } },
  { id: "m03", category: "myth",    emoji: "👻", name: { el: "Φάντασμα",       en: "Ghost" },          rarity: "rare",      fact: { el: "Στοιχειωμένο πνεύμα.", en: "Haunting spirit." } },
  { id: "m04", category: "myth",    emoji: "👽", name: { el: "Εξωγήινος",      en: "Alien" },          rarity: "epic",      fact: { el: "Από άλλο πλανήτη!", en: "From another planet!" } },
  { id: "m05", category: "myth",    emoji: "🧛", name: { el: "Βρικόλακας",     en: "Vampire" },        rarity: "epic",      fact: { el: "Πλάσμα της νύχτας.", en: "Creature of the night." } },
  { id: "m06", category: "myth",    emoji: "🧟", name: { el: "Ζόμπι",           en: "Zombie" },         rarity: "rare",      fact: { el: "Νεκρός που περπατάει!", en: "Walking dead!" } },
  { id: "m07", category: "myth",    emoji: "🎃", name: { el: "Κολοκύθα",       en: "Pumpkin" },        rarity: "common",    fact: { el: "Στοιχειωμένο φως.", en: "Haunted light." } },
  { id: "m08", category: "myth",    emoji: "🐲", name: { el: "Δρακάκι",        en: "Baby Dragon" },    rarity: "rare",      fact: { el: "Νεογέννητος δράκος.", en: "Newborn dragon." } },
  { id: "m09", category: "myth",    emoji: "🦖", name: { el: "T-Rex",          en: "T-Rex" },          rarity: "epic",      fact: { el: "Ο βασιλιάς των δεινοσαύρων!", en: "King of dinosaurs!" } },
  { id: "m10", category: "myth",    emoji: "🦕", name: { el: "Δεινόσαυρος",    en: "Dinosaur" },       rarity: "rare",      fact: { el: "Έζησε εκατομμύρια χρόνια πριν.", en: "Lived millions of years ago." } },
  { id: "m11", category: "myth",    emoji: "🔥", name: { el: "Φοίνικας",       en: "Phoenix" },        rarity: "legendary", fact: { el: "Αναγεννιέται από τις στάχτες του.", en: "Reborn from ashes." } },
  { id: "m12", category: "myth",    emoji: "🐺", name: { el: "Λυκάνθρωπος",    en: "Werewolf" },       rarity: "epic",      fact: { el: "Άνθρωπος-λύκος!", en: "Wolf-human!" } },
];

const COLLECTION_KEY = "geo:cardCollection";
const SPIN_LAST_KEY = "geo:cardLastSpin";

export function getCollection() {
  try { return JSON.parse(localStorage.getItem(COLLECTION_KEY)) || {}; } catch { return {}; }
}

export function saveCollection(collection) {
  localStorage.setItem(COLLECTION_KEY, JSON.stringify(collection));
}

export function addCardToCollection(cardId) {
  const collection = getCollection();
  collection[cardId] = (collection[cardId] || 0) + 1;
  saveCollection(collection);
  return collection;
}

export function isCardOwned(cardId) {
  const collection = getCollection();
  return !!collection[cardId];
}

export function getCardCount(cardId) {
  return getCollection()[cardId] || 0;
}

export function getOwnedCount() {
  return Object.keys(getCollection()).length;
}

export function getOwnedByRarity() {
  const collection = getCollection();
  const counts = { common: 0, rare: 0, epic: 0, legendary: 0 };
  Object.keys(collection).forEach(id => {
    const card = CARDS.find(c => c.id === id);
    if (card) counts[card.rarity]++;
  });
  return counts;
}

export function pickRandomCard(forceRarity = null) {
  const rarity = forceRarity || (() => {
    const r = Math.random() * 100;
    let cumul = 0;
    for (const [name, info] of Object.entries(RARITIES)) {
      cumul += info.weight;
      if (r < cumul) return name;
    }
    return "common";
  })();
  const pool = CARDS.filter(c => c.rarity === rarity);
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getLastSpinTime() {
  return parseInt(localStorage.getItem(SPIN_LAST_KEY) || "0", 10);
}

export function recordSpin() {
  localStorage.setItem(SPIN_LAST_KEY, Date.now().toString());
}

export function canFreeSpin() {
  const last = getLastSpinTime();
  const hoursSince = (Date.now() - last) / (1000 * 60 * 60);
  return hoursSince >= 24;
}

export function getNextFreeSpinHours() {
  const last = getLastSpinTime();
  const hoursSince = (Date.now() - last) / (1000 * 60 * 60);
  return Math.max(0, 24 - hoursSince);
}
