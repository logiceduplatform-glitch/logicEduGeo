export const PET_TYPES = [
  {
    id: "dragon",
    name: { el: "Δράκος", en: "Dragon" },
    stages: [
      { stage: 1, emoji: "🥚", name: { el: "Αυγό", en: "Egg" } },
      { stage: 2, emoji: "🐲", name: { el: "Δρακάκι", en: "Baby Dragon" } },
      { stage: 3, emoji: "🐉", name: { el: "Δράκος", en: "Dragon" } },
    ],
    color: "from-red-400 to-orange-500",
    bgColor: "bg-red-50 dark:bg-red-900/20",
  },
  {
    id: "unicorn",
    name: { el: "Μονόκερος", en: "Unicorn" },
    stages: [
      { stage: 1, emoji: "🥚", name: { el: "Αυγό", en: "Egg" } },
      { stage: 2, emoji: "🐴", name: { el: "Πουλαράκι", en: "Foal" } },
      { stage: 3, emoji: "🦄", name: { el: "Μονόκερος", en: "Unicorn" } },
    ],
    color: "from-pink-400 to-purple-500",
    bgColor: "bg-pink-50 dark:bg-pink-900/20",
  },
  {
    id: "phoenix",
    name: { el: "Φοίνικας", en: "Phoenix" },
    stages: [
      { stage: 1, emoji: "🥚", name: { el: "Αυγό", en: "Egg" } },
      { stage: 2, emoji: "🐤", name: { el: "Νεοσσός", en: "Chick" } },
      { stage: 3, emoji: "🔥", name: { el: "Φοίνικας", en: "Phoenix" } },
    ],
    color: "from-orange-400 to-red-500",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
  },
  {
    id: "panda",
    name: { el: "Πάντα", en: "Panda" },
    stages: [
      { stage: 1, emoji: "🥚", name: { el: "Αυγό", en: "Egg" } },
      { stage: 2, emoji: "🐼", name: { el: "Μωρό Πάντα", en: "Baby Panda" } },
      { stage: 3, emoji: "🐼✨", name: { el: "Σοφό Πάντα", en: "Wise Panda" } },
    ],
    color: "from-slate-400 to-slate-600",
    bgColor: "bg-slate-50 dark:bg-slate-800",
  },
  {
    id: "cat",
    name: { el: "Γατάκι", en: "Kitten" },
    stages: [
      { stage: 1, emoji: "🥚", name: { el: "Καλαθάκι", en: "Basket" } },
      { stage: 2, emoji: "🐱", name: { el: "Γατάκι", en: "Kitten" } },
      { stage: 3, emoji: "😸", name: { el: "Μάγος Γάτος", en: "Magic Cat" } },
    ],
    color: "from-amber-400 to-yellow-500",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
  },
  {
    id: "owl",
    name: { el: "Κουκουβάγια", en: "Owl" },
    stages: [
      { stage: 1, emoji: "🥚", name: { el: "Αυγό", en: "Egg" } },
      { stage: 2, emoji: "🐥", name: { el: "Νεοσσός", en: "Chick" } },
      { stage: 3, emoji: "🦉", name: { el: "Σοφή Κουκουβάγια", en: "Wise Owl" } },
    ],
    color: "from-amber-700 to-amber-900",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
  },
];

export const PET_KEY = "geo:pet";

export const PET_CONFIG = {
  maxHunger: 100,
  maxHappiness: 100,
  maxEnergy: 100,
  hungerDecayPerHour: 8,
  happinessDecayPerHour: 5,
  energyDecayPerHour: 4,
  evolveStage2XP: 50,
  evolveStage3XP: 250,
  feedCost: 1,
  playReward: 5,
};

export function getPet() {
  try {
    const data = JSON.parse(localStorage.getItem(PET_KEY));
    if (data) return updateDecay(data);
  } catch {}
  return null;
}

export function savePet(pet) {
  pet.lastUpdated = new Date().toISOString();
  localStorage.setItem(PET_KEY, JSON.stringify(pet));
}

function updateDecay(pet) {
  if (!pet.lastUpdated) return pet;
  const last = new Date(pet.lastUpdated).getTime();
  const now = Date.now();
  const hoursPassed = Math.max(0, (now - last) / (1000 * 60 * 60));

  const newHunger = Math.max(0, pet.hunger - PET_CONFIG.hungerDecayPerHour * hoursPassed);
  const newHappiness = Math.max(0, pet.happiness - PET_CONFIG.happinessDecayPerHour * hoursPassed);
  const newEnergy = Math.min(PET_CONFIG.maxEnergy, (pet.energy || 0) + PET_CONFIG.energyDecayPerHour * hoursPassed * 0.5);

  return { ...pet, hunger: newHunger, happiness: newHappiness, energy: newEnergy };
}

export function adoptPet(typeId, name) {
  const pet = {
    typeId,
    name: name || "Pet",
    stage: 1,
    xp: 0,
    hunger: 80,
    happiness: 80,
    energy: 100,
    adoptedAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    lastFedAt: null,
    lastPlayedAt: null,
  };
  savePet(pet);
  return pet;
}

export function feedPet() {
  const pet = getPet();
  if (!pet) return null;
  pet.hunger = Math.min(PET_CONFIG.maxHunger, pet.hunger + 30);
  pet.happiness = Math.min(PET_CONFIG.maxHappiness, pet.happiness + 5);
  pet.lastFedAt = new Date().toISOString();
  savePet(pet);
  return pet;
}

export function playWithPet() {
  const pet = getPet();
  if (!pet) return null;
  pet.happiness = Math.min(PET_CONFIG.maxHappiness, pet.happiness + 25);
  pet.energy = Math.max(0, pet.energy - 15);
  pet.xp += PET_CONFIG.playReward;
  pet.lastPlayedAt = new Date().toISOString();
  pet.stage = pet.xp >= PET_CONFIG.evolveStage3XP ? 3 : pet.xp >= PET_CONFIG.evolveStage2XP ? 2 : 1;
  savePet(pet);
  return pet;
}

export function restPet() {
  const pet = getPet();
  if (!pet) return null;
  pet.energy = PET_CONFIG.maxEnergy;
  pet.lastUpdated = new Date().toISOString();
  savePet(pet);
  return pet;
}

export function awardPetXP(amount) {
  const pet = getPet();
  if (!pet) return null;
  pet.xp += amount;
  pet.happiness = Math.min(PET_CONFIG.maxHappiness, pet.happiness + 2);
  pet.stage = pet.xp >= PET_CONFIG.evolveStage3XP ? 3 : pet.xp >= PET_CONFIG.evolveStage2XP ? 2 : 1;
  savePet(pet);
  return pet;
}

export function getPetType(typeId) {
  return PET_TYPES.find(t => t.id === typeId) || PET_TYPES[0];
}

export function getPetCurrentStage(pet) {
  if (!pet) return null;
  const type = getPetType(pet.typeId);
  return type.stages.find(s => s.stage === pet.stage) || type.stages[0];
}

export function getPetMood(pet) {
  if (!pet) return null;
  const avg = (pet.hunger + pet.happiness) / 2;
  if (avg > 70) return { emoji: "😄", label: { el: "Χαρούμενο", en: "Happy" } };
  if (avg > 40) return { emoji: "😊", label: { el: "Καλό", en: "Good" } };
  if (avg > 20) return { emoji: "😐", label: { el: "Λυπημένο", en: "Sad" } };
  return { emoji: "😢", label: { el: "Πεινάει!", en: "Starving!" } };
}
