// Ready-made lesson plans: theory + quiz + worksheet ideas
// Teachers can browse and "use template" to instantly create a full classroom package

export const LESSON_PLANS = [
  {
    id: "lp_addition_basics",
    icon: "➕",
    color: "from-blue-500 to-cyan-500",
    age: { el: "Δημοτικό (Α-Β)", en: "Elementary 1-2" },
    subject: { el: "Μαθηματικά", en: "Math" },
    title: { el: "Πρόσθεση μέχρι το 20", en: "Addition up to 20" },
    duration: { el: "30 λεπτά", en: "30 min" },
    objectives: {
      el: ["Προσθέτει αριθμούς μέχρι το 20", "Καταλαβαίνει την έννοια του + και =", "Λύνει απλά προβλήματα πρόσθεσης"],
      en: ["Add numbers up to 20", "Understand + and = symbols", "Solve simple addition problems"],
    },
    theory: {
      el: `# Τι είναι η Πρόσθεση;\n\nΗ **πρόσθεση** μας βοηθά να ενώνουμε αριθμούς. \n\nΌταν προσθέτουμε:\n- Παίρνουμε **δύο αριθμούς**\n- Τους **βάζουμε μαζί**\n- Βρίσκουμε **πόσα είναι όλα μαζί**\n\n## Παράδειγμα 🍎🍎 + 🍎🍎🍎 = 🍎🍎🍎🍎🍎\n\n2 + 3 = 5\n\n## Σύμβολα\n- **+** σημαίνει "προσθέτω"\n- **=** σημαίνει "ίσον με"\n\n## Tips\n💡 Μπορείς να μετράς με τα δάχτυλα!\n💡 Δοκίμασε να ζωγραφίζεις τους αριθμούς`,
      en: `# What is Addition?\n\n**Addition** helps us combine numbers.\n\nWhen we add:\n- We take **two numbers**\n- **Put them together**\n- Find **how many in total**\n\n## Example 🍎🍎 + 🍎🍎🍎 = 🍎🍎🍎🍎🍎\n\n2 + 3 = 5\n\n## Symbols\n- **+** means "add"\n- **=** means "equals"\n\n## Tips\n💡 You can count with your fingers!\n💡 Try drawing the numbers`,
    },
    quiz: [
      { question: { el: "Πόσο είναι 3 + 4;", en: "What is 3 + 4?" }, options: ["6", "7", "8", "9"], correct: 1 },
      { question: { el: "Πόσο είναι 5 + 5;", en: "What is 5 + 5?" }, options: ["8", "9", "10", "11"], correct: 2 },
      { question: { el: "Πόσο είναι 8 + 6;", en: "What is 8 + 6?" }, options: ["12", "13", "14", "15"], correct: 2 },
      { question: { el: "Πόσο είναι 9 + 1;", en: "What is 9 + 1?" }, options: ["8", "9", "10", "11"], correct: 2 },
      { question: { el: "Πόσο είναι 7 + 7;", en: "What is 7 + 7?" }, options: ["13", "14", "15", "16"], correct: 1 },
    ],
    worksheetType: "addition",
    worksheetDifficulty: "easy",
  },
  {
    id: "lp_subtraction_basics",
    icon: "➖",
    color: "from-orange-500 to-red-500",
    age: { el: "Δημοτικό (Α-Β)", en: "Elementary 1-2" },
    subject: { el: "Μαθηματικά", en: "Math" },
    title: { el: "Αφαίρεση μέχρι το 20", en: "Subtraction up to 20" },
    duration: { el: "30 λεπτά", en: "30 min" },
    objectives: {
      el: ["Αφαιρεί αριθμούς μέχρι το 20", "Καταλαβαίνει την έννοια του −", "Λύνει απλά προβλήματα αφαίρεσης"],
      en: ["Subtract numbers up to 20", "Understand the − symbol", "Solve simple subtraction problems"],
    },
    theory: {
      el: `# Τι είναι η Αφαίρεση;\n\nΗ **αφαίρεση** σημαίνει "παίρνω μακριά".\n\n## Παράδειγμα 🍎🍎🍎🍎🍎 - 🍎🍎 = 🍎🍎🍎\n\n5 - 2 = 3\n\n## Σύμβολα\n- **−** σημαίνει "αφαιρώ"\n\n💡 Σκέψου το σαν να δίνεις πράγματα σε φίλο!`,
      en: `# What is Subtraction?\n\n**Subtraction** means "take away".\n\n## Example 🍎🍎🍎🍎🍎 - 🍎🍎 = 🍎🍎🍎\n\n5 - 2 = 3\n\n💡 Think of it like giving things to a friend!`,
    },
    quiz: [
      { question: { el: "Πόσο είναι 8 - 3;", en: "8 - 3?" }, options: ["3", "4", "5", "6"], correct: 2 },
      { question: { el: "Πόσο είναι 10 - 5;", en: "10 - 5?" }, options: ["3", "4", "5", "6"], correct: 2 },
      { question: { el: "Πόσο είναι 15 - 7;", en: "15 - 7?" }, options: ["6", "7", "8", "9"], correct: 2 },
      { question: { el: "Πόσο είναι 9 - 4;", en: "9 - 4?" }, options: ["3", "4", "5", "6"], correct: 2 },
      { question: { el: "Πόσο είναι 20 - 11;", en: "20 - 11?" }, options: ["8", "9", "10", "11"], correct: 1 },
    ],
    worksheetType: "subtraction",
    worksheetDifficulty: "easy",
  },
  {
    id: "lp_multiplication_tables",
    icon: "✖️",
    color: "from-purple-500 to-pink-500",
    age: { el: "Δημοτικό (Γ-Δ)", en: "Elementary 3-4" },
    subject: { el: "Μαθηματικά", en: "Math" },
    title: { el: "Προπαίδεια του 5", en: "Times Tables of 5" },
    duration: { el: "40 λεπτά", en: "40 min" },
    objectives: {
      el: ["Μαθαίνει την προπαίδεια του 5", "Καταλαβαίνει τη σχέση πρόσθεσης-πολλαπλασιασμού"],
      en: ["Learn the 5 times table", "Understand addition-multiplication relationship"],
    },
    theory: {
      el: `# Προπαίδεια του 5\n\nΗ προπαίδεια είναι **επαναλαμβανόμενη πρόσθεση**.\n\n## Παράδειγμα\n5 × 3 = 5 + 5 + 5 = 15\n\n## Πίνακας\n- 5 × 1 = 5\n- 5 × 2 = 10\n- 5 × 3 = 15\n- 5 × 4 = 20\n- 5 × 5 = 25\n- 5 × 6 = 30\n- 5 × 7 = 35\n- 5 × 8 = 40\n- 5 × 9 = 45\n- 5 × 10 = 50\n\n💡 **Tip**: Όλοι οι αριθμοί τελειώνουν σε 0 ή 5!`,
      en: `# Times Tables of 5\n\nMultiplication is **repeated addition**.\n\n## Example\n5 × 3 = 5 + 5 + 5 = 15\n\n## Table\n- 5 × 1 = 5\n- 5 × 2 = 10\n- ...\n- 5 × 10 = 50\n\n💡 **Tip**: All numbers end in 0 or 5!`,
    },
    quiz: [
      { question: { el: "5 × 3 = ?", en: "5 × 3 = ?" }, options: ["10", "15", "20", "25"], correct: 1 },
      { question: { el: "5 × 7 = ?", en: "5 × 7 = ?" }, options: ["30", "35", "40", "45"], correct: 1 },
      { question: { el: "5 × 9 = ?", en: "5 × 9 = ?" }, options: ["40", "45", "50", "55"], correct: 1 },
      { question: { el: "5 × 4 = ?", en: "5 × 4 = ?" }, options: ["15", "20", "25", "30"], correct: 1 },
      { question: { el: "5 × 6 = ?", en: "5 × 6 = ?" }, options: ["25", "30", "35", "40"], correct: 1 },
    ],
    worksheetType: "multiplication",
    worksheetDifficulty: "easy",
  },
  {
    id: "lp_fractions_intro",
    icon: "🍰",
    color: "from-pink-500 to-rose-500",
    age: { el: "Δημοτικό (Δ-Στ)", en: "Elementary 4-6" },
    subject: { el: "Μαθηματικά", en: "Math" },
    title: { el: "Εισαγωγή στα Κλάσματα", en: "Introduction to Fractions" },
    duration: { el: "45 λεπτά", en: "45 min" },
    objectives: {
      el: ["Καταλαβαίνει τι είναι κλάσμα", "Αναγνωρίζει αριθμητή και παρονομαστή", "Παριστάνει κλάσματα γραφικά"],
      en: ["Understand what a fraction is", "Identify numerator and denominator", "Represent fractions visually"],
    },
    theory: {
      el: `# Τι είναι Κλάσμα;\n\nΈνα **κλάσμα** δείχνει ένα μέρος ενός όλου.\n\n## Παράδειγμα\nΑν κόψεις μια πίτσα σε **4 κομμάτια** και πάρεις **1**:\n\n**1/4** = ένα τέταρτο\n\n## Μέρη ενός Κλάσματος\n- **Αριθμητής** (πάνω): πόσα κομμάτια παίρνεις\n- **Παρονομαστής** (κάτω): σε πόσα κομμάτια χωρίστηκε\n\n## Παραδείγματα\n- 1/2 = μισό\n- 1/3 = ένα τρίτο\n- 1/4 = ένα τέταρτο\n- 3/4 = τρία τέταρτα\n\n💡 Πιο μεγάλος παρονομαστής = πιο μικρά κομμάτια!`,
      en: `# What is a Fraction?\n\nA **fraction** shows a part of a whole.\n\n## Example\nIf you cut a pizza into **4 slices** and take **1**:\n\n**1/4** = one quarter\n\n## Parts\n- **Numerator** (top): how many parts you take\n- **Denominator** (bottom): total parts\n\n💡 Bigger denominator = smaller parts!`,
    },
    quiz: [
      { question: { el: "Τι σημαίνει 1/2;", en: "What does 1/2 mean?" }, options: [{ el: "Ένα μόνο", en: "Just one" }, { el: "Μισό", en: "Half" }, { el: "Δύο", en: "Two" }, { el: "Τίποτα", en: "Nothing" }], correct: 1 },
      { question: { el: "Στο 3/5, ποιος είναι ο παρονομαστής;", en: "In 3/5, what's the denominator?" }, options: ["3", "5", "8", "15"], correct: 1 },
      { question: { el: "Ποιο είναι μεγαλύτερο: 1/2 ή 1/4;", en: "Which is bigger: 1/2 or 1/4?" }, options: ["1/2", "1/4", { el: "Ίδια", en: "Same" }, { el: "Δεν ξέρω", en: "Don't know" }], correct: 0 },
      { question: { el: "1/2 + 1/2 = ?", en: "1/2 + 1/2 = ?" }, options: ["1/4", "1/2", "1", "2"], correct: 2 },
      { question: { el: "Πόσα 1/4 χρειάζονται για ένα ολόκληρο;", en: "How many 1/4 to make a whole?" }, options: ["2", "3", "4", "5"], correct: 2 },
    ],
    worksheetType: "addition",
    worksheetDifficulty: "medium",
  },
  {
    id: "lp_colors_kindergarten",
    icon: "🎨",
    color: "from-yellow-500 to-orange-500",
    age: { el: "Νηπιαγωγείο", en: "Kindergarten" },
    subject: { el: "Γενικά", en: "General" },
    title: { el: "Τα Χρώματα", en: "Colors" },
    duration: { el: "20 λεπτά", en: "20 min" },
    objectives: {
      el: ["Αναγνωρίζει βασικά χρώματα", "Συσχετίζει χρώματα με αντικείμενα"],
      en: ["Recognize basic colors", "Match colors with objects"],
    },
    theory: {
      el: `# Τα Χρώματα 🌈\n\n## Βασικά Χρώματα\n\n🔴 **Κόκκινο** - φράουλα, μήλο\n🟡 **Κίτρινο** - ήλιος, μπανάνα\n🔵 **Μπλε** - θάλασσα, ουρανός\n🟢 **Πράσινο** - γρασίδι, φύλλα\n🟠 **Πορτοκαλί** - πορτοκάλι, καρότο\n🟣 **Μωβ** - σταφύλι, κρόκος\n\n💡 Παίξε: Τι χρώμα έχει το αυτοκίνητο;`,
      en: `# Colors 🌈\n\n## Basic Colors\n\n🔴 **Red** - strawberry, apple\n🟡 **Yellow** - sun, banana\n🔵 **Blue** - sea, sky\n🟢 **Green** - grass, leaves\n🟠 **Orange** - orange, carrot\n🟣 **Purple** - grapes, plum\n\n💡 Play: What color is the car?`,
    },
    quiz: [
      { question: { el: "Τι χρώμα είναι ο ήλιος;", en: "What color is the sun?" }, options: [{ el: "Μπλε", en: "Blue" }, { el: "Κίτρινο", en: "Yellow" }, { el: "Πράσινο", en: "Green" }, { el: "Μωβ", en: "Purple" }], correct: 1 },
      { question: { el: "Τι χρώμα είναι το γρασίδι;", en: "What color is grass?" }, options: [{ el: "Κόκκινο", en: "Red" }, { el: "Μπλε", en: "Blue" }, { el: "Πράσινο", en: "Green" }, { el: "Κίτρινο", en: "Yellow" }], correct: 2 },
      { question: { el: "Τι χρώμα είναι η θάλασσα;", en: "What color is the sea?" }, options: [{ el: "Μπλε", en: "Blue" }, { el: "Κόκκινο", en: "Red" }, { el: "Πράσινο", en: "Green" }, { el: "Κίτρινο", en: "Yellow" }], correct: 0 },
      { question: { el: "Τι χρώμα έχει η ντομάτα;", en: "Tomato color?" }, options: [{ el: "Κόκκινο", en: "Red" }, { el: "Μπλε", en: "Blue" }, { el: "Πράσινο", en: "Green" }, { el: "Κίτρινο", en: "Yellow" }], correct: 0 },
    ],
    worksheetType: "comparisons",
    worksheetDifficulty: "easy",
  },
  {
    id: "lp_planets",
    icon: "🪐",
    color: "from-indigo-600 to-purple-700",
    age: { el: "Δημοτικό (Δ-Στ)", en: "Elementary 4-6" },
    subject: { el: "Επιστήμη", en: "Science" },
    title: { el: "Το Ηλιακό μας Σύστημα", en: "Our Solar System" },
    duration: { el: "45 λεπτά", en: "45 min" },
    objectives: {
      el: ["Γνωρίζει τους 8 πλανήτες", "Καταλαβαίνει τη θέση τους από τον Ήλιο", "Συγκρίνει χαρακτηριστικά πλανητών"],
      en: ["Know all 8 planets", "Understand their order from the Sun", "Compare planet features"],
    },
    theory: {
      el: `# Το Ηλιακό μας Σύστημα 🌞\n\nΟ **Ήλιος** είναι ένα μεγάλο άστρο. Γύρω του γυρίζουν **8 πλανήτες**:\n\n1. ☿️ **Ερμής** - πιο κοντά, πολύ ζεστός\n2. ♀️ **Αφροδίτη** - φωτεινός σαν αστέρι\n3. 🌍 **Γη** - το σπίτι μας!\n4. ♂️ **Άρης** - ο κόκκινος πλανήτης\n5. ♃ **Δίας** - ο μεγαλύτερος\n6. ♄ **Κρόνος** - με τους όμορφους δακτυλίους\n7. ♅ **Ουρανός** - γαλάζιο-πράσινος\n8. ♆ **Ποσειδώνας** - ο πιο μακρινός\n\n## Διασκεδαστικά γεγονότα\n- Στον Άρη μια μέρα διαρκεί 24,5 ώρες\n- Ο Δίας έχει 92 δορυφόρους\n- Στον Κρόνο θα μπορούσες να επιπλεύσεις (αν ήταν τόσο μεγάλος ωκεανός)`,
      en: `# Our Solar System 🌞\n\nThe **Sun** is a huge star. **8 planets** orbit around it:\n\n1. ☿️ **Mercury** - closest, very hot\n2. ♀️ **Venus** - bright like a star\n3. 🌍 **Earth** - our home!\n4. ♂️ **Mars** - the red planet\n5. ♃ **Jupiter** - the biggest\n6. ♄ **Saturn** - with beautiful rings\n7. ♅ **Uranus** - blue-green\n8. ♆ **Neptune** - the farthest`,
    },
    quiz: [
      { question: { el: "Πόσοι πλανήτες υπάρχουν στο ηλιακό μας σύστημα;", en: "How many planets in our solar system?" }, options: ["6", "7", "8", "9"], correct: 2 },
      { question: { el: "Ποιος είναι ο μεγαλύτερος πλανήτης;", en: "Largest planet?" }, options: [{ el: "Άρης", en: "Mars" }, { el: "Δίας", en: "Jupiter" }, { el: "Κρόνος", en: "Saturn" }, { el: "Γη", en: "Earth" }], correct: 1 },
      { question: { el: "Ποιος είναι ο κόκκινος πλανήτης;", en: "The red planet?" }, options: [{ el: "Ερμής", en: "Mercury" }, { el: "Αφροδίτη", en: "Venus" }, { el: "Άρης", en: "Mars" }, { el: "Δίας", en: "Jupiter" }], correct: 2 },
      { question: { el: "Ποιος πλανήτης έχει δακτυλίους;", en: "Planet with rings?" }, options: [{ el: "Γη", en: "Earth" }, { el: "Κρόνος", en: "Saturn" }, { el: "Άρης", en: "Mars" }, { el: "Ερμής", en: "Mercury" }], correct: 1 },
      { question: { el: "Πιο κοντινός πλανήτης στον Ήλιο;", en: "Closest planet to Sun?" }, options: [{ el: "Γη", en: "Earth" }, { el: "Αφροδίτη", en: "Venus" }, { el: "Ερμής", en: "Mercury" }, { el: "Άρης", en: "Mars" }], correct: 2 },
    ],
    worksheetType: "comparisons",
    worksheetDifficulty: "medium",
  },
  {
    id: "lp_human_body",
    icon: "🫀",
    color: "from-red-500 to-pink-600",
    age: { el: "Δημοτικό (Γ-Στ)", en: "Elementary 3-6" },
    subject: { el: "Επιστήμη", en: "Science" },
    title: { el: "Το Ανθρώπινο Σώμα", en: "The Human Body" },
    duration: { el: "40 λεπτά", en: "40 min" },
    objectives: {
      el: ["Αναγνωρίζει βασικά όργανα", "Καταλαβαίνει τη λειτουργία τους"],
      en: ["Identify main organs", "Understand their functions"],
    },
    theory: {
      el: `# Το Ανθρώπινο Σώμα 🫀\n\n## Βασικά Όργανα\n\n❤️ **Καρδιά** - πομπάρει το αίμα σε όλο το σώμα\n🫁 **Πνεύμονες** - μας βοηθούν να αναπνέουμε\n🧠 **Εγκέφαλος** - σκέφτεται και ελέγχει το σώμα\n🦴 **Σκελετός** - 206 οστά που στηρίζουν το σώμα\n💪 **Μύες** - μας βοηθούν να κινούμαστε\n👁️ **Μάτια** - βλέπουμε\n👂 **Αυτιά** - ακούμε\n👅 **Γλώσσα** - γευόμαστε\n\n💡 Η καρδιά σου χτυπά ~100,000 φορές την ημέρα!`,
      en: `# The Human Body 🫀\n\n## Main Organs\n\n❤️ **Heart** - pumps blood\n🫁 **Lungs** - help us breathe\n🧠 **Brain** - thinks & controls\n🦴 **Skeleton** - 206 bones\n💪 **Muscles** - help us move\n\n💡 Your heart beats ~100,000 times a day!`,
    },
    quiz: [
      { question: { el: "Τι κάνει η καρδιά;", en: "What does the heart do?" }, options: [{ el: "Σκέφτεται", en: "Thinks" }, { el: "Πομπάρει αίμα", en: "Pumps blood" }, { el: "Αναπνέει", en: "Breathes" }, { el: "Πέπτει", en: "Digests" }], correct: 1 },
      { question: { el: "Πόσα οστά έχει ο ενήλικας;", en: "How many bones in adult?" }, options: ["106", "206", "306", "406"], correct: 1 },
      { question: { el: "Τι κάνουν τα πνευμόνια;", en: "What do lungs do?" }, options: [{ el: "Αναπνοή", en: "Breathing" }, { el: "Πέψη", en: "Digestion" }, { el: "Σκέψη", en: "Thinking" }, { el: "Όραση", en: "Vision" }], correct: 0 },
      { question: { el: "Ποιο όργανο ελέγχει το σώμα;", en: "Which organ controls the body?" }, options: [{ el: "Καρδιά", en: "Heart" }, { el: "Εγκέφαλος", en: "Brain" }, { el: "Πνεύμονες", en: "Lungs" }, { el: "Στομάχι", en: "Stomach" }], correct: 1 },
      { question: { el: "Τι μας βοηθάει να γευτούμε;", en: "What helps us taste?" }, options: [{ el: "Μάτια", en: "Eyes" }, { el: "Αυτιά", en: "Ears" }, { el: "Γλώσσα", en: "Tongue" }, { el: "Μύτη", en: "Nose" }], correct: 2 },
    ],
    worksheetType: "comparisons",
    worksheetDifficulty: "easy",
  },
  {
    id: "lp_ancient_greece",
    icon: "🏛️",
    color: "from-amber-600 to-orange-700",
    age: { el: "Δημοτικό (Δ-Στ)", en: "Elementary 4-6" },
    subject: { el: "Ιστορία", en: "History" },
    title: { el: "Αρχαία Ελλάδα", en: "Ancient Greece" },
    duration: { el: "45 λεπτά", en: "45 min" },
    objectives: {
      el: ["Γνωρίζει τις αρχαίες πόλεις-κράτη", "Αναγνωρίζει σημαντικές προσωπικότητες", "Καταλαβαίνει τη γέννηση της Δημοκρατίας"],
      en: ["Know ancient city-states", "Recognize important figures", "Understand birth of Democracy"],
    },
    theory: {
      el: `# Αρχαία Ελλάδα 🏛️\n\nΗ Αρχαία Ελλάδα είναι η αρχή του δυτικού πολιτισμού.\n\n## Πόλεις-Κράτη\n- 🏛️ **Αθήνα** - δημοκρατία, φιλοσοφία, τέχνες\n- ⚔️ **Σπάρτη** - ισχυρός στρατός\n- 🏺 **Κόρινθος** - εμπόριο\n- 🌊 **Θήβα** - αρχαιότατη πόλη\n\n## Σημαντικοί Άνθρωποι\n- 👨‍🏫 **Σωκράτης** - φιλόσοφος\n- 📚 **Πλάτων** - μαθητής του Σωκράτη\n- 🧠 **Αριστοτέλης** - επιστήμονας\n- ⚔️ **Μέγας Αλέξανδρος** - στρατηγός\n- 📖 **Όμηρος** - ποιητής (Ιλιάδα, Οδύσσεια)\n\n## Επιτεύγματα\n🏆 Ολυμπιακοί Αγώνες (776 π.Χ.)\n🏛️ Δημοκρατία (508 π.Χ.)\n🎭 Θέατρο, Φιλοσοφία, Μαθηματικά`,
      en: `# Ancient Greece 🏛️\n\nAncient Greece is the cradle of Western civilization.\n\n## City-States\n- 🏛️ **Athens** - democracy, philosophy\n- ⚔️ **Sparta** - powerful army\n- 🏺 **Corinth** - trade\n\n## Important People\n- 👨‍🏫 **Socrates** - philosopher\n- 📚 **Plato**\n- 🧠 **Aristotle**\n- ⚔️ **Alexander the Great**\n- 📖 **Homer** - poet (Iliad, Odyssey)\n\n## Achievements\n🏆 Olympics (776 BC)\n🏛️ Democracy (508 BC)`,
    },
    quiz: [
      { question: { el: "Σε ποια πόλη γεννήθηκε η Δημοκρατία;", en: "Where was Democracy born?" }, options: [{ el: "Σπάρτη", en: "Sparta" }, { el: "Αθήνα", en: "Athens" }, { el: "Κόρινθος", en: "Corinth" }, { el: "Θήβα", en: "Thebes" }], correct: 1 },
      { question: { el: "Πότε έγιναν οι πρώτοι Ολυμπιακοί;", en: "First Olympics year?" }, options: ["500 π.Χ./BC", "776 π.Χ./BC", "1000 π.Χ./BC", "300 π.Χ./BC"], correct: 1 },
      { question: { el: "Ποιος έγραψε την Ιλιάδα;", en: "Who wrote the Iliad?" }, options: [{ el: "Πλάτων", en: "Plato" }, { el: "Σωκράτης", en: "Socrates" }, { el: "Όμηρος", en: "Homer" }, { el: "Αριστοτέλης", en: "Aristotle" }], correct: 2 },
      { question: { el: "Ποια πόλη ήταν γνωστή για τον στρατό;", en: "City known for army?" }, options: [{ el: "Αθήνα", en: "Athens" }, { el: "Σπάρτη", en: "Sparta" }, { el: "Δελφοί", en: "Delphi" }, { el: "Κόρινθος", en: "Corinth" }], correct: 1 },
      { question: { el: "Ο Αριστοτέλης ήταν δάσκαλος του:", en: "Aristotle was teacher of:" }, options: [{ el: "Σωκράτη", en: "Socrates" }, { el: "Πλάτωνα", en: "Plato" }, { el: "Μ. Αλεξάνδρου", en: "Alexander" }, { el: "Όμηρου", en: "Homer" }], correct: 2 },
    ],
    worksheetType: "comparisons",
    worksheetDifficulty: "medium",
  },
  {
    id: "lp_present_simple",
    icon: "🗣️",
    color: "from-emerald-500 to-teal-600",
    age: { el: "Δημοτικό (Δ-Στ)", en: "Elementary 4-6" },
    subject: { el: "Αγγλικά", en: "English" },
    title: { el: "Present Simple", en: "Present Simple Tense" },
    duration: { el: "35 λεπτά", en: "35 min" },
    objectives: {
      el: ["Σχηματίζει σωστά τον Present Simple", "Χρησιμοποιεί s/es στο τρίτο πρόσωπο"],
      en: ["Form Present Simple correctly", "Use s/es in third person"],
    },
    theory: {
      el: `# Present Simple\n\nΤο **Present Simple** μιλάει για:\n- Συνήθειες (every day)\n- Γενικές αλήθειες (The sun rises)\n- Επαναλαμβανόμενες δράσεις\n\n## Δομή\n**I/You/We/They + verb**\n- I play football.\n\n**He/She/It + verb + s/es**\n- She plays tennis.\n- He goes to school.\n- It rains.\n\n## Negation\n- I **don't** play.\n- He **doesn't** play.\n\n## Question\n- **Do** you play?\n- **Does** she play?\n\n💡 Στο τρίτο πρόσωπο πάντα +s ή +es!`,
      en: `# Present Simple\n\nUsed for:\n- Habits\n- General truths\n- Repeated actions\n\n## Structure\n**I/You/We/They + verb**\n**He/She/It + verb + s/es**\n\n💡 Always +s or +es in third person!`,
    },
    quiz: [
      { question: { el: "She ___ tennis every day.", en: "She ___ tennis every day." }, options: ["play", "plays", "playing", "played"], correct: 1 },
      { question: { el: "I ___ coffee in the morning.", en: "I ___ coffee in the morning." }, options: ["drink", "drinks", "drinking", "drank"], correct: 0 },
      { question: { el: "He ___ to school by bus.", en: "He ___ to school by bus." }, options: ["go", "goes", "going", "went"], correct: 1 },
      { question: { el: "Negative: I ___ like fish.", en: "Negative: I ___ like fish." }, options: ["don't", "doesn't", "not", "no"], correct: 0 },
      { question: { el: "Question: ___ she dance?", en: "Question: ___ she dance?" }, options: ["Do", "Does", "Is", "Are"], correct: 1 },
    ],
    worksheetType: "patterns",
    worksheetDifficulty: "medium",
  },
  {
    id: "lp_animals_basic",
    icon: "🐾",
    color: "from-green-500 to-emerald-600",
    age: { el: "Νηπιαγωγείο/Α' Δημ.", en: "Kindergarten/1st" },
    subject: { el: "Φύση", en: "Nature" },
    title: { el: "Τα Ζώα και οι Ήχοι τους", en: "Animals and their Sounds" },
    duration: { el: "20 λεπτά", en: "20 min" },
    objectives: {
      el: ["Αναγνωρίζει βασικά ζώα", "Συσχετίζει ζώα με τους ήχους τους"],
      en: ["Recognize basic animals", "Match animals with sounds"],
    },
    theory: {
      el: `# Τα Ζώα 🐾\n\n## Ζώα της Φάρμας\n🐮 **Αγελάδα** - κάνει "μου!"\n🐷 **Γουρούνι** - κάνει "γκρου!"\n🐔 **Κότα** - κάνει "κο-κο-κο"\n🐑 **Πρόβατο** - κάνει "μπεε!"\n🐶 **Σκύλος** - κάνει "γαβ!"\n🐱 **Γάτα** - κάνει "νιάου"\n\n## Ζώα της Ζούγκλας\n🦁 **Λιοντάρι** - βρυχάται\n🐯 **Τίγρης** - βρυχάται\n🐘 **Ελέφαντας** - βαρβατίζει\n🐵 **Μαϊμού** - φωνάζει\n\n💡 Όλα τα ζώα κάνουν διαφορετικούς ήχους!`,
      en: `# Animals 🐾\n\n## Farm Animals\n🐮 **Cow** - "moo!"\n🐷 **Pig** - "oink!"\n🐔 **Hen** - "cluck!"\n🐑 **Sheep** - "baa!"\n🐶 **Dog** - "woof!"\n🐱 **Cat** - "meow!"\n\n## Jungle Animals\n🦁 **Lion** - roars\n🐯 **Tiger** - roars\n🐘 **Elephant** - trumpets`,
    },
    quiz: [
      { question: { el: "Τι κάνει η αγελάδα;", en: "What sound does cow make?" }, options: [{ el: "Νιάου", en: "Meow" }, { el: "Μου", en: "Moo" }, { el: "Γαβ", en: "Woof" }, { el: "Μπεε", en: "Baa" }], correct: 1 },
      { question: { el: "Τι κάνει το λιοντάρι;", en: "What does lion do?" }, options: [{ el: "Νιαουρίζει", en: "Meow" }, { el: "Γαβγίζει", en: "Bark" }, { el: "Βρυχάται", en: "Roars" }, { el: "Σιωπή", en: "Silent" }], correct: 2 },
      { question: { el: "Πού ζει η αγελάδα;", en: "Where does cow live?" }, options: [{ el: "Φάρμα", en: "Farm" }, { el: "Ζούγκλα", en: "Jungle" }, { el: "Σπίτι", en: "Home" }, { el: "Δάσος", en: "Forest" }], correct: 0 },
      { question: { el: "Τι ζώο είναι ο ελέφαντας;", en: "What kind is elephant?" }, options: [{ el: "Φάρμα", en: "Farm" }, { el: "Ζούγκλα", en: "Jungle" }, { el: "Θάλασσα", en: "Sea" }, { el: "Σπίτι", en: "Pet" }], correct: 1 },
    ],
    worksheetType: "comparisons",
    worksheetDifficulty: "easy",
  },
];

export const PLAN_AGES = [
  { id: "all", label: { el: "Όλα", en: "All" } },
  { id: "kindergarten", label: { el: "Νηπιαγωγείο", en: "Kindergarten" }, match: ["Νηπιαγωγείο", "Kindergarten"] },
  { id: "elementary_low", label: { el: "Α-Β Δημ.", en: "Elementary 1-2" }, match: ["Α-Β", "1-2"] },
  { id: "elementary_high", label: { el: "Γ-Στ Δημ.", en: "Elementary 3-6" }, match: ["Γ-Δ", "Γ-Στ", "Δ-Στ", "3-4", "4-6", "3-6"] },
];

export const PLAN_SUBJECTS = [
  { id: "all",     label: { el: "Όλα",        en: "All" } },
  { id: "math",    label: { el: "Μαθηματικά", en: "Math" } },
  { id: "science", label: { el: "Επιστήμη",   en: "Science" } },
  { id: "history", label: { el: "Ιστορία",    en: "History" } },
  { id: "english", label: { el: "Αγγλικά",    en: "English" } },
  { id: "general", label: { el: "Γενικά",     en: "General" } },
];

export function filterPlans(plans, ageId, subjectId, lang) {
  return plans.filter(p => {
    if (ageId !== "all") {
      const ageDef = PLAN_AGES.find(a => a.id === ageId);
      const ageStr = `${p.age.el} ${p.age.en}`;
      if (ageDef && ageDef.match && !ageDef.match.some(m => ageStr.includes(m))) return false;
    }
    if (subjectId !== "all") {
      const subjDef = PLAN_SUBJECTS.find(s => s.id === subjectId);
      if (!subjDef) return false;
      const subjStr = `${p.subject.el} ${p.subject.en}`.toLowerCase();
      if (!subjStr.includes(subjDef.label.el.toLowerCase()) && !subjStr.includes(subjDef.label.en.toLowerCase())) return false;
    }
    return true;
  });
}
