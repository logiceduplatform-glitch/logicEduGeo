export const SHOP_ITEMS = {
  avatars: [
    { id: "av_dragon", emoji: "🐉", name: { el: "Δράκος", en: "Dragon" }, price: 10 },
    { id: "av_robot", emoji: "🤖", name: { el: "Ρομπότ", en: "Robot" }, price: 10 },
    { id: "av_alien", emoji: "👽", name: { el: "Εξωγήινος", en: "Alien" }, price: 10 },
    { id: "av_wizard", emoji: "🧙", name: { el: "Μάγος", en: "Wizard" }, price: 15 },
    { id: "av_ninja", emoji: "🥷", name: { el: "Νίντζα", en: "Ninja" }, price: 15 },
    { id: "av_astronaut", emoji: "🧑‍🚀", name: { el: "Αστροναύτης", en: "Astronaut" }, price: 15 },
    { id: "av_pirate", emoji: "🏴‍☠️", name: { el: "Πειρατής", en: "Pirate" }, price: 10 },
    { id: "av_fairy", emoji: "🧚", name: { el: "Νεράιδα", en: "Fairy" }, price: 10 },
    { id: "av_superhero", emoji: "🦸", name: { el: "Σούπερ Ήρωας", en: "Superhero" }, price: 15 },
    { id: "av_scientist", emoji: "🧑‍🔬", name: { el: "Επιστήμονας", en: "Scientist" }, price: 10 },
    { id: "av_unicorn", emoji: "🦄", name: { el: "Μονόκερος", en: "Unicorn" }, price: 20 },
    { id: "av_phoenix", emoji: "🔥", name: { el: "Φοίνικας", en: "Phoenix" }, price: 20 },
    { id: "av_panda_king", emoji: "🐼", name: { el: "Πάντα Βασιλιάς", en: "Panda King" }, price: 25 },
    { id: "av_diamond", emoji: "💎", name: { el: "Διαμάντι", en: "Diamond" }, price: 30 },
    { id: "av_crown", emoji: "👑", name: { el: "Στέμμα", en: "Crown" }, price: 30 },
    { id: "av_star", emoji: "🌟", name: { el: "Αστέρι", en: "Star" }, price: 20 },
    { id: "av_tiger", emoji: "🐯", name: { el: "Τίγρης", en: "Tiger" }, price: 10 },
    { id: "av_dolphin", emoji: "🐬", name: { el: "Δελφίνι", en: "Dolphin" }, price: 10 },
    { id: "av_eagle", emoji: "🦅", name: { el: "Αετός", en: "Eagle" }, price: 15 },
    { id: "av_koala", emoji: "🐨", name: { el: "Κοάλα", en: "Koala" }, price: 10 },
  ],
  themes: [
    { id: "th_ocean", emoji: "🌊", name: { el: "Ωκεανός", en: "Ocean" }, price: 25, colors: "from-blue-500 to-cyan-500" },
    { id: "th_forest", emoji: "🌲", name: { el: "Δάσος", en: "Forest" }, price: 25, colors: "from-green-500 to-emerald-500" },
    { id: "th_sunset", emoji: "🌅", name: { el: "Ηλιοβασίλεμα", en: "Sunset" }, price: 25, colors: "from-orange-500 to-rose-500" },
    { id: "th_galaxy", emoji: "🌌", name: { el: "Γαλαξίας", en: "Galaxy" }, price: 30, colors: "from-indigo-600 to-purple-600" },
  ],
  pets: [
    { id: "pet_cat", emoji: "🐱", name: { el: "Γατάκι", en: "Kitten" }, price: 15 },
    { id: "pet_dog", emoji: "🐕", name: { el: "Σκυλάκι", en: "Puppy" }, price: 15 },
    { id: "pet_hamster", emoji: "🐹", name: { el: "Χάμστερ", en: "Hamster" }, price: 15 },
    { id: "pet_parrot", emoji: "🦜", name: { el: "Παπαγάλος", en: "Parrot" }, price: 20 },
    { id: "pet_turtle", emoji: "🐢", name: { el: "Χελώνα", en: "Turtle" }, price: 15 },
    { id: "pet_fox", emoji: "🦊", name: { el: "Αλεπού", en: "Fox" }, price: 20 },
  ],
  avatarParts: [
    // Hats
    { id: "avatar_sparkle", emoji: "✨", name: { el: "Λαμπερό Αξεσουάρ", en: "Sparkle Accessory" }, price: 15, category: "accessory" },
    { id: "avatar_explorer_hat", emoji: "🪖", name: { el: "Καπέλο Εξερευνητή", en: "Explorer Hat" }, price: 20, category: "hat" },
    { id: "avatar_cowboy_hat", emoji: "🤠", name: { el: "Καπέλο Καουμπόι", en: "Cowboy Hat" }, price: 20, category: "hat" },
    { id: "avatar_party_hat", emoji: "🥳", name: { el: "Καπέλο Πάρτυ", en: "Party Hat" }, price: 15, category: "hat" },
    { id: "avatar_top_hat", emoji: "🎩", name: { el: "Ψηλό Καπέλο", en: "Top Hat" }, price: 25, category: "hat" },
    { id: "avatar_graduation_cap", emoji: "🎓", name: { el: "Καπέλο Αποφοίτησης", en: "Graduation Cap" }, price: 30, category: "hat" },
    { id: "avatar_crown_gold", emoji: "👑", name: { el: "Χρυσό Στέμμα", en: "Gold Crown" }, price: 50, category: "hat", rarity: "rare" },
    { id: "avatar_chef_hat", emoji: "👨‍🍳", name: { el: "Καπέλο Σεφ", en: "Chef Hat" }, price: 20, category: "hat" },
    { id: "avatar_construction", emoji: "👷", name: { el: "Κράνος", en: "Hard Hat" }, price: 20, category: "hat" },

    // Glasses / face accessories
    { id: "avatar_sunglasses", emoji: "🕶️", name: { el: "Γυαλιά Ηλίου", en: "Sunglasses" }, price: 15, category: "glasses" },
    { id: "avatar_3d_glasses", emoji: "🥽", name: { el: "Γυαλιά 3D", en: "3D Glasses" }, price: 15, category: "glasses" },
    { id: "avatar_monocle", emoji: "🧐", name: { el: "Μονόκλ", en: "Monocle" }, price: 25, category: "glasses" },
    { id: "avatar_mustache", emoji: "👨", name: { el: "Μουστάκι", en: "Mustache" }, price: 20, category: "face" },

    // Outfits
    { id: "outfit_lab_coat", emoji: "🥼", name: { el: "Φόρμα Επιστήμονα", en: "Lab Coat" }, price: 40, category: "outfit" },
    { id: "outfit_superhero", emoji: "🦸", name: { el: "Στολή Υπερήρωα", en: "Superhero Suit" }, price: 50, category: "outfit", rarity: "rare" },
    { id: "outfit_ninja", emoji: "🥷", name: { el: "Στολή Νίντζα", en: "Ninja Suit" }, price: 45, category: "outfit" },
    { id: "outfit_pirate", emoji: "🏴‍☠️", name: { el: "Στολή Πειρατή", en: "Pirate Outfit" }, price: 40, category: "outfit" },
    { id: "outfit_knight", emoji: "🛡️", name: { el: "Πανοπλία Ιππότη", en: "Knight Armor" }, price: 50, category: "outfit", rarity: "rare" },
    { id: "outfit_astronaut", emoji: "🧑‍🚀", name: { el: "Διαστημική Στολή", en: "Astronaut Suit" }, price: 60, category: "outfit", rarity: "rare" },

    // Accessories / hand items
    { id: "acc_book", emoji: "📚", name: { el: "Βιβλίο Σοφίας", en: "Book of Wisdom" }, price: 15, category: "accessory" },
    { id: "acc_wand", emoji: "🪄", name: { el: "Μαγικό Ραβδί", en: "Magic Wand" }, price: 35, category: "accessory" },
    { id: "acc_sword", emoji: "🗡️", name: { el: "Σπαθί", en: "Sword" }, price: 35, category: "accessory" },
    { id: "acc_shield", emoji: "🛡️", name: { el: "Ασπίδα", en: "Shield" }, price: 35, category: "accessory" },
    { id: "acc_balloon", emoji: "🎈", name: { el: "Μπαλόνι", en: "Balloon" }, price: 10, category: "accessory" },
    { id: "acc_microphone", emoji: "🎤", name: { el: "Μικρόφωνο", en: "Microphone" }, price: 20, category: "accessory" },
    { id: "acc_trophy", emoji: "🏆", name: { el: "Τρόπαιο", en: "Trophy" }, price: 40, category: "accessory" },
    { id: "acc_medal", emoji: "🥇", name: { el: "Χρυσό Μετάλλιο", en: "Gold Medal" }, price: 30, category: "accessory" },
  ],

  // Profile frames - decorative borders around the avatar
  frames: [
    { id: "frame_simple", emoji: "⚪", name: { el: "Απλό", en: "Simple" }, price: 0, ringClass: "ring-2 ring-slate-300", default: true },
    { id: "frame_gold", emoji: "🌟", name: { el: "Χρυσό", en: "Gold" }, price: 50, ringClass: "ring-4 ring-amber-400" },
    { id: "frame_silver", emoji: "🔘", name: { el: "Ασημί", en: "Silver" }, price: 30, ringClass: "ring-4 ring-slate-300" },
    { id: "frame_rainbow", emoji: "🌈", name: { el: "Ουράνιο Τόξο", en: "Rainbow" }, price: 100, ringClass: "ring-4 ring-pink-400", rarity: "rare" },
    { id: "frame_neon", emoji: "💚", name: { el: "Neon", en: "Neon" }, price: 60, ringClass: "ring-4 ring-emerald-400" },
    { id: "frame_fire", emoji: "🔥", name: { el: "Φωτιά", en: "Fire" }, price: 80, ringClass: "ring-4 ring-rose-500" },
    { id: "frame_ice", emoji: "❄️", name: { el: "Πάγος", en: "Ice" }, price: 80, ringClass: "ring-4 ring-cyan-300" },
    { id: "frame_diamond", emoji: "💎", name: { el: "Διαμάντι", en: "Diamond" }, price: 150, ringClass: "ring-4 ring-purple-400", rarity: "legendary" },
  ],

  // Profile badges - decorative pin shown next to name
  badges: [
    { id: "badge_starter", emoji: "🌱", name: { el: "Αρχάριος", en: "Starter" }, price: 5 },
    { id: "badge_scholar", emoji: "📖", name: { el: "Λόγιος", en: "Scholar" }, price: 30 },
    { id: "badge_athlete", emoji: "🏅", name: { el: "Αθλητής", en: "Athlete" }, price: 30 },
    { id: "badge_artist", emoji: "🎨", name: { el: "Καλλιτέχνης", en: "Artist" }, price: 30 },
    { id: "badge_explorer", emoji: "🧭", name: { el: "Εξερευνητής", en: "Explorer" }, price: 30 },
    { id: "badge_thinker", emoji: "🧠", name: { el: "Στοχαστής", en: "Thinker" }, price: 35 },
    { id: "badge_legend", emoji: "🦄", name: { el: "Θρύλος", en: "Legend" }, price: 100, rarity: "legendary" },
    { id: "badge_champion", emoji: "🏆", name: { el: "Πρωταθλητής", en: "Champion" }, price: 80, rarity: "rare" },
  ],

  // Music tracks unlocked for the music library
  music: [
    { id: "music_focus", emoji: "🎵", name: { el: "Συγκέντρωση", en: "Focus" }, price: 0, default: true, mood: "focus" },
    { id: "music_chill", emoji: "🌊", name: { el: "Χαλάρωση", en: "Chill" }, price: 20, mood: "chill" },
    { id: "music_energy", emoji: "⚡", name: { el: "Ενέργεια", en: "Energy" }, price: 25, mood: "energy" },
    { id: "music_arcade", emoji: "🕹️", name: { el: "Arcade", en: "Arcade" }, price: 25, mood: "arcade" },
    { id: "music_lullaby", emoji: "🌙", name: { el: "Νανούρισμα", en: "Lullaby" }, price: 20, mood: "lullaby" },
    { id: "music_epic", emoji: "🎻", name: { el: "Επικό", en: "Epic" }, price: 35, mood: "epic", rarity: "rare" },
  ],
};

export const SHOP_TABS = [
  { id: "avatars", icon: "🎭", label: { el: "Avatars", en: "Avatars" } },
  { id: "themes", icon: "🎨", label: { el: "Θέματα", en: "Themes" } },
  { id: "pets", icon: "🐾", label: { el: "Κατοικίδια", en: "Pets" } },
  { id: "avatarParts", icon: "🧩", label: { el: "Avatar Parts", en: "Avatar Parts" } },
  { id: "frames", icon: "🖼️", label: { el: "Πλαίσια", en: "Frames" } },
  { id: "badges", icon: "🎖️", label: { el: "Παράσημα", en: "Badges" } },
  { id: "music", icon: "🎶", label: { el: "Μουσική", en: "Music" } },
];
