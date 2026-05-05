import React, { useState, useContext, useEffect, useCallback } from "react";
import { LanguageContext } from "../i18n/LanguageContext";
import { AuthContext } from "../auth/AuthContext";
import { db } from "../auth/firebase";
import { collection, doc, setDoc, getDocs, deleteDoc, query, where } from "firebase/firestore";

const LESSONS_KEY = "geo:teacherLessons";

function getLocalLessons() {
  try { return JSON.parse(localStorage.getItem(LESSONS_KEY)) || []; }
  catch { return []; }
}
function saveLocalLessons(l) { localStorage.setItem(LESSONS_KEY, JSON.stringify(l)); }

function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

const SUBJECT_OPTIONS = [
  { key: "math", el: "Μαθηματικά", en: "Mathematics", icon: "🧮" },
  { key: "greek", el: "Ελληνικά", en: "Greek", icon: "🇬🇷" },
  { key: "english", el: "Αγγλικά", en: "English", icon: "🇬🇧" },
  { key: "history", el: "Ιστορία", en: "History", icon: "📜" },
  { key: "science", el: "Φυσική", en: "Science", icon: "🔬" },
  { key: "geography", el: "Γεωγραφία", en: "Geography", icon: "🌍" },
  { key: "biology", el: "Βιολογία", en: "Biology", icon: "🧬" },
  { key: "other", el: "Άλλο", en: "Other", icon: "📖" },
];

const LESSON_TEMPLATES = [
  {
    titleEl: "Χρώματα", titleEn: "Colors",
    subject: "other", gradeLevel: "elem", gradeLabel: { el: "Νηπιαγωγείο", en: "Kindergarten" },
    sectionsEl: [
      { title: "Βασικά χρώματα", content: "Τα βασικά χρώματα είναι τρία: Κόκκινο, Κίτρινο, Μπλε.\n\nΑπό αυτά τα τρία χρώματα μπορούμε να φτιάξουμε όλα τα υπόλοιπα!", imageUrl: "" },
      { title: "Ανάμειξη χρωμάτων", content: "• Κόκκινο + Κίτρινο = Πορτοκαλί\n• Κίτρινο + Μπλε = Πράσινο\n• Κόκκινο + Μπλε = Μοβ\n\nΔοκίμασε να αναμείξεις χρώματα με τα δάχτυλά σου!", imageUrl: "" },
      { title: "Δραστηριότητα", content: "Κοίταξε γύρω σου! Πόσα αντικείμενα μπορείς να βρεις για κάθε χρώμα;\n\n🔴 Κόκκινα: ...\n🟡 Κίτρινα: ...\n🔵 Μπλε: ...", imageUrl: "" },
    ],
    sectionsEn: [
      { title: "Primary colors", content: "The primary colors are three: Red, Yellow, Blue.\n\nFrom these three colors we can make all the rest!", imageUrl: "" },
      { title: "Mixing colors", content: "• Red + Yellow = Orange\n• Yellow + Blue = Green\n• Red + Blue = Purple\n\nTry mixing colors with your fingers!", imageUrl: "" },
      { title: "Activity", content: "Look around you! How many objects can you find for each color?\n\n🔴 Red: ...\n🟡 Yellow: ...\n🔵 Blue: ...", imageUrl: "" },
    ],
  },
  {
    titleEl: "Αριθμοί 1-10", titleEn: "Numbers 1-10",
    subject: "math", gradeLevel: "elem", gradeLabel: { el: "Νηπιαγωγείο", en: "Kindergarten" },
    sectionsEl: [
      { title: "Μετράμε μέχρι το 5", content: "1 - ένα 🍎\n2 - δύο 🍎🍎\n3 - τρία 🍎🍎🍎\n4 - τέσσερα 🍎🍎🍎🍎\n5 - πέντε 🍎🍎🍎🍎🍎\n\nΜέτρησε τα δάχτυλα του ενός χεριού σου!", imageUrl: "" },
      { title: "Μετράμε μέχρι το 10", content: "6 - έξι\n7 - εφτά\n8 - οχτώ\n9 - εννιά\n10 - δέκα\n\nΜέτρησε τα δάχτυλα και των δύο χεριών σου! Είναι 10!", imageUrl: "" },
      { title: "Δραστηριότητα", content: "Μέτρησε τα αντικείμενα:\n🧸🧸🧸 = ?\n⭐⭐⭐⭐⭐ = ?\n🚗🚗🚗🚗🚗🚗🚗 = ?", imageUrl: "" },
    ],
    sectionsEn: [
      { title: "Counting to 5", content: "1 - one 🍎\n2 - two 🍎🍎\n3 - three 🍎🍎🍎\n4 - four 🍎🍎🍎🍎\n5 - five 🍎🍎🍎🍎🍎\n\nCount the fingers on one hand!", imageUrl: "" },
      { title: "Counting to 10", content: "6 - six\n7 - seven\n8 - eight\n9 - nine\n10 - ten\n\nCount the fingers on both hands! That's 10!", imageUrl: "" },
      { title: "Activity", content: "Count the objects:\n🧸🧸🧸 = ?\n⭐⭐⭐⭐⭐ = ?\n🚗🚗🚗🚗🚗🚗🚗 = ?", imageUrl: "" },
    ],
  },
  {
    titleEl: "Ζώα", titleEn: "Animals",
    subject: "biology", gradeLevel: "elem", gradeLabel: { el: "Νηπιαγωγείο", en: "Kindergarten" },
    sectionsEl: [
      { title: "Ζώα της φάρμας", content: "Στη φάρμα ζουν πολλά ζώα:\n\n🐄 Αγελάδα — μας δίνει γάλα\n🐔 Κότα — μας δίνει αυγά\n🐑 Πρόβατο — μας δίνει μαλλί\n🐷 Γουρούνι\n🐴 Άλογο", imageUrl: "" },
      { title: "Άγρια ζώα", content: "Στη ζούγκλα και στη σαβάνα ζουν:\n\n🦁 Λιοντάρι — ο βασιλιάς των ζώων\n🐘 Ελέφαντας — το μεγαλύτερο χερσαίο ζώο\n🦒 Καμηλοπάρδαλη — το ψηλότερο ζώο\n🐊 Κροκόδειλος", imageUrl: "" },
      { title: "Δραστηριότητα", content: "Ποιο ζώο κάνει τον κάθε ήχο;\n\nΓαβ-γαβ → ?\nΜου → ?\nΝιάου → ?\nΚο-κο-κο → ?", imageUrl: "" },
    ],
    sectionsEn: [
      { title: "Farm animals", content: "Many animals live on the farm:\n\n🐄 Cow — gives us milk\n🐔 Chicken — gives us eggs\n🐑 Sheep — gives us wool\n🐷 Pig\n🐴 Horse", imageUrl: "" },
      { title: "Wild animals", content: "In the jungle and savanna live:\n\n🦁 Lion — the king of animals\n🐘 Elephant — the largest land animal\n🦒 Giraffe — the tallest animal\n🐊 Crocodile", imageUrl: "" },
      { title: "Activity", content: "Which animal makes each sound?\n\nWoof-woof → ?\nMoo → ?\nMeow → ?\nCluck-cluck → ?", imageUrl: "" },
    ],
  },
  {
    titleEl: "Πρόσθεση & Αφαίρεση", titleEn: "Addition & Subtraction",
    subject: "math", gradeLevel: "elem", gradeLabel: { el: "Δημοτικό", en: "Elementary" },
    sectionsEl: [
      { title: "Τι είναι η πρόσθεση;", content: "Η πρόσθεση (+) σημαίνει «βάζω μαζί».\n\n3 μήλα + 2 μήλα = 5 μήλα\n🍎🍎🍎 + 🍎🍎 = 🍎🍎🍎🍎🍎\n\nΤο σύμβολο + λέγεται «συν».", imageUrl: "" },
      { title: "Τι είναι η αφαίρεση;", content: "Η αφαίρεση (−) σημαίνει «βγάζω».\n\n5 μήλα − 2 μήλα = 3 μήλα\n🍎🍎🍎🍎🍎 − 🍎🍎 = 🍎🍎🍎\n\nΤο σύμβολο − λέγεται «μείον» ή «πλην».", imageUrl: "" },
      { title: "Κόλπα υπολογισμού", content: "• Μέτρησε στα δάχτυλα!\n• Ξεκίνα από τον μεγαλύτερο αριθμό\n• Π.χ. 3 + 5: ξεκίνα από το 5 και μέτρα 3 ακόμα → 6, 7, 8!\n• Στην αφαίρεση, μέτρα αντίστροφα", imageUrl: "" },
    ],
    sectionsEn: [
      { title: "What is addition?", content: "Addition (+) means 'putting together'.\n\n3 apples + 2 apples = 5 apples\n🍎🍎🍎 + 🍎🍎 = 🍎🍎🍎🍎🍎\n\nThe + symbol is called 'plus'.", imageUrl: "" },
      { title: "What is subtraction?", content: "Subtraction (−) means 'taking away'.\n\n5 apples − 2 apples = 3 apples\n🍎🍎🍎🍎🍎 − 🍎🍎 = 🍎🍎🍎\n\nThe − symbol is called 'minus'.", imageUrl: "" },
      { title: "Calculation tricks", content: "• Count on your fingers!\n• Start from the bigger number\n• E.g. 3 + 5: start from 5 and count 3 more → 6, 7, 8!\n• For subtraction, count backwards", imageUrl: "" },
    ],
  },
  {
    titleEl: "Ορθογραφία βασικών λέξεων", titleEn: "Spelling of basic words",
    subject: "greek", gradeLevel: "elem", gradeLabel: { el: "Δημοτικό", en: "Elementary" },
    sectionsEl: [
      { title: "Κανόνες με -ι, -η, -υ", content: "Πολλές λέξεις τελειώνουν σε ίδιο ήχο αλλά γράφονται διαφορετικά:\n\n• σπίτι (με ι)\n• νύχτα (με υ)\n• γάτα (με α)\n\nΘυμήσου: η ορθογραφία θέλει εξάσκηση!", imageUrl: "" },
      { title: "Συχνά λάθη", content: "❌ αυγώ → ✅ αυγό\n❌ πεδί → ✅ παιδί\n❌ εφτά → ✅ επτά (σε επίσημο ύφος)\n❌ θέλο → ✅ θέλω\n\nΣυμβουλή: Διάβαζε πολύ! Όσο πιο πολύ βλέπεις τις λέξεις, τόσο πιο εύκολα τις θυμάσαι.", imageUrl: "" },
      { title: "Δραστηριότητα", content: "Γράψε σωστά:\n\n1. Το π__δί (αι/ε) παίζει.\n2. Θ__ω (έλ/έλ) ένα ποτήρι νερό.\n3. Το σπ__τι (ί/ή) είναι μεγάλο.\n4. Η γ__τα (ά/αί) κοιμάται.", imageUrl: "" },
    ],
    sectionsEn: [
      { title: "Common spelling patterns", content: "Many words sound the same but are spelled differently:\n\n• their / there / they're\n• your / you're\n• its / it's\n\nRemember: spelling takes practice!", imageUrl: "" },
      { title: "Common mistakes", content: "❌ becuz → ✅ because\n❌ freind → ✅ friend\n❌ wich → ✅ which\n❌ realy → ✅ really\n\nTip: Read a lot! The more you see words, the easier you remember them.", imageUrl: "" },
      { title: "Activity", content: "Choose the correct spelling:\n\n1. I want to go __ (their/there)\n2. __ my friend (Your/You're)\n3. The dog wagged __ tail (its/it's)\n4. I __ like pizza (realy/really)", imageUrl: "" },
    ],
  },
  {
    titleEl: "Βασική Γραμματική", titleEn: "Basic Grammar",
    subject: "greek", gradeLevel: "middle", gradeLabel: { el: "Γυμνάσιο", en: "Middle" },
    sectionsEl: [
      { title: "Μέρη του λόγου", content: "Τα βασικά μέρη του λόγου:\n\n1. Ουσιαστικό — ονομάζει πρόσωπα, πράγματα (σπίτι, σκύλος)\n2. Ρήμα — δηλώνει ενέργεια (τρέχω, γράφω)\n3. Επίθετο — περιγράφει (ωραίος, μεγάλος)\n4. Αντωνυμία — αντικαθιστά ουσιαστικό (εγώ, αυτός)", imageUrl: "" },
      { title: "Χρόνοι ρημάτων", content: "• Ενεστώτας: γράφω (τώρα)\n• Αόριστος: έγραψα (στο παρελθόν)\n• Μέλλοντας: θα γράψω (στο μέλλον)\n\nΠαράδειγμα:\nΧτες έγραψα. Τώρα γράφω. Αύριο θα γράψω.", imageUrl: "" },
      { title: "Δραστηριότητα", content: "Βρες το μέρος του λόγου:\n\n1. «Ο σκύλος τρέχει γρήγορα.»\n   - σκύλος = ?\n   - τρέχει = ?\n   - γρήγορα = ?", imageUrl: "" },
    ],
    sectionsEn: [
      { title: "Parts of speech", content: "The basic parts of speech:\n\n1. Noun — names people, things (house, dog)\n2. Verb — shows action (run, write)\n3. Adjective — describes (beautiful, big)\n4. Pronoun — replaces noun (I, he)", imageUrl: "" },
      { title: "Verb tenses", content: "• Present: I write (now)\n• Past: I wrote (before)\n• Future: I will write (later)\n\nExample:\nYesterday I wrote. Now I write. Tomorrow I will write.", imageUrl: "" },
      { title: "Activity", content: "Find the part of speech:\n\n1. 'The dog runs quickly.'\n   - dog = ?\n   - runs = ?\n   - quickly = ?", imageUrl: "" },
    ],
  },
  {
    titleEl: "Κλάσματα", titleEn: "Fractions",
    subject: "math", gradeLevel: "middle", gradeLabel: { el: "Γυμνάσιο", en: "Middle" },
    sectionsEl: [
      { title: "Τι είναι τα κλάσματα;", content: "Ένα κλάσμα δείχνει ένα μέρος ενός συνόλου.\n\n1/2 = μισό (κόβω μια πίτσα στα δύο, παίρνω το ένα κομμάτι)\n1/4 = ένα τέταρτο (κόβω στα τέσσερα)\n3/4 = τρία τέταρτα\n\nΑριθμητής = πάνω (πόσα κομμάτια πήρα)\nΠαρονομαστής = κάτω (σε πόσα κομμάτια έκοψα)", imageUrl: "" },
      { title: "Πράξεις με κλάσματα", content: "Πρόσθεση (ίδιος παρονομαστής):\n1/4 + 2/4 = 3/4\n\nΠολλαπλασιασμός:\n1/2 × 1/3 = 1/6\n\nΑπλοποίηση:\n2/4 = 1/2 (διαιρώ αριθμητή & παρονομαστή με 2)", imageUrl: "" },
      { title: "Πρακτική εξάσκηση", content: "Λύσε:\n1. 1/3 + 1/3 = ?\n2. 2/5 + 1/5 = ?\n3. 1/2 × 2 = ?\n4. Απλοποίησε: 4/8 = ?", imageUrl: "" },
    ],
    sectionsEn: [
      { title: "What are fractions?", content: "A fraction shows a part of a whole.\n\n1/2 = half (cut a pizza in two, take one piece)\n1/4 = one quarter (cut in four)\n3/4 = three quarters\n\nNumerator = top (how many pieces I took)\nDenominator = bottom (how many pieces I cut)", imageUrl: "" },
      { title: "Operations with fractions", content: "Addition (same denominator):\n1/4 + 2/4 = 3/4\n\nMultiplication:\n1/2 × 1/3 = 1/6\n\nSimplification:\n2/4 = 1/2 (divide numerator & denominator by 2)", imageUrl: "" },
      { title: "Practice", content: "Solve:\n1. 1/3 + 1/3 = ?\n2. 2/5 + 1/5 = ?\n3. 1/2 × 2 = ?\n4. Simplify: 4/8 = ?", imageUrl: "" },
    ],
  },
  {
    titleEl: "Present Simple (Αγγλικά)", titleEn: "Present Simple (English)",
    subject: "english", gradeLevel: "middle", gradeLabel: { el: "Γυμνάσιο", en: "Middle" },
    sectionsEl: [
      { title: "Τι είναι ο Present Simple;", content: "Ο Present Simple χρησιμοποιείται για:\n\n• Συνήθειες: I play football every day.\n• Γενικές αλήθειες: The sun rises in the east.\n• Προγράμματα: The train leaves at 9.\n\nΔομή: Υποκείμενο + ρήμα (βασική μορφή)", imageUrl: "" },
      { title: "Κανόνες", content: "Στο 3ο πρόσωπο (he/she/it) βάζουμε -s:\n\n• I play → He plays\n• I watch → She watches (-es μετά από s, sh, ch, x, o)\n• I study → He studies (y → ies μετά σύμφωνο)\n\nΆρνηση: don't / doesn't + βασικό ρήμα\n• I don't like. He doesn't like.", imageUrl: "" },
      { title: "Ασκήσεις", content: "Συμπλήρωσε:\n\n1. She ___ (play) tennis. → plays\n2. They ___ (watch) TV. → watch\n3. He ___ (not/like) pizza. → doesn't like\n4. ___ you ___ (speak) English? → Do you speak", imageUrl: "" },
    ],
    sectionsEn: [
      { title: "What is Present Simple?", content: "Present Simple is used for:\n\n• Habits: I play football every day.\n• General truths: The sun rises in the east.\n• Schedules: The train leaves at 9.\n\nStructure: Subject + verb (base form)", imageUrl: "" },
      { title: "Rules", content: "For 3rd person (he/she/it) add -s:\n\n• I play → He plays\n• I watch → She watches (-es after s, sh, ch, x, o)\n• I study → He studies (y → ies after consonant)\n\nNegative: don't / doesn't + base verb\n• I don't like. He doesn't like.", imageUrl: "" },
      { title: "Exercises", content: "Complete:\n\n1. She ___ (play) tennis. → plays\n2. They ___ (watch) TV. → watch\n3. He ___ (not/like) pizza. → doesn't like\n4. ___ you ___ (speak) English? → Do you speak", imageUrl: "" },
    ],
  },
  {
    titleEl: "Ιστορία — Αρχαία Ελλάδα", titleEn: "History — Ancient Greece",
    subject: "history", gradeLevel: "high", gradeLabel: { el: "Λύκειο", en: "High" },
    sectionsEl: [
      { title: "Ο χρυσός αιώνας", content: "Ο 5ος αιώνας π.Χ. θεωρείται ο «χρυσός αιώνας» της Αθήνας.\n\n• Πολιτικό σύστημα: Δημοκρατία (Περικλής)\n• Τέχνη: Παρθενώνας, αγγειοπλαστική\n• Φιλοσοφία: Σωκράτης, Πλάτων\n• Θέατρο: Σοφοκλής, Ευριπίδης, Αριστοφάνης", imageUrl: "" },
      { title: "Πέρσες vs Έλληνες", content: "Οι Περσικοί Πόλεμοι (490–479 π.Χ.):\n\n• Μαραθώνας (490 π.Χ.): Νίκη Αθηναίων\n• Θερμοπύλες (480 π.Χ.): Λεωνίδας & 300 Σπαρτιάτες\n• Σαλαμίνα (480 π.Χ.): Ναυμαχία — νίκη Θεμιστοκλή\n• Πλαταιές (479 π.Χ.): Τελική νίκη", imageUrl: "" },
      { title: "Κληρονομιά", content: "Τι μας άφησε η αρχαία Ελλάδα:\n\n• Δημοκρατία\n• Ολυμπιακοί Αγώνες\n• Φιλοσοφία & Επιστήμη\n• Θέατρο\n• Αρχιτεκτονική (κίονες, αμφιθέατρα)", imageUrl: "" },
    ],
    sectionsEn: [
      { title: "The Golden Age", content: "The 5th century BC is considered the 'golden age' of Athens.\n\n• Political system: Democracy (Pericles)\n• Art: Parthenon, pottery\n• Philosophy: Socrates, Plato\n• Theater: Sophocles, Euripides, Aristophanes", imageUrl: "" },
      { title: "Persians vs Greeks", content: "The Persian Wars (490–479 BC):\n\n• Marathon (490 BC): Athenian victory\n• Thermopylae (480 BC): Leonidas & 300 Spartans\n• Salamis (480 BC): Naval battle — Themistocles' victory\n• Plataea (479 BC): Final victory", imageUrl: "" },
      { title: "Legacy", content: "What ancient Greece left us:\n\n• Democracy\n• Olympic Games\n• Philosophy & Science\n• Theater\n• Architecture (columns, amphitheaters)", imageUrl: "" },
    ],
  },
  {
    titleEl: "Βασική Φυσική — Δυνάμεις", titleEn: "Basic Physics — Forces",
    subject: "science", gradeLevel: "high", gradeLabel: { el: "Λύκειο", en: "High" },
    sectionsEl: [
      { title: "Τι είναι δύναμη;", content: "Η δύναμη (F) είναι κάτι που αλλάζει την κίνηση ενός σώματος.\n\n• Μονάδα μέτρησης: Newton (N)\n• Μπορεί να σπρώξει, να τραβήξει, να σταματήσει ή να αλλάξει κατεύθυνση\n\nΤύπος: F = m × a (δύναμη = μάζα × επιτάχυνση)", imageUrl: "" },
      { title: "Νόμοι του Νεύτωνα", content: "1ος: Αδράνεια — ένα σώμα μένει ακίνητο ή κινείται ευθύγραμμα αν δεν ασκείται δύναμη\n\n2ος: F = m × a — η δύναμη εξαρτάται από μάζα και επιτάχυνση\n\n3ος: Δράση-Αντίδραση — κάθε δύναμη έχει ίση και αντίθετη δύναμη", imageUrl: "" },
      { title: "Παραδείγματα", content: "• Όταν κλωτσάς μπάλα: ασκείς δύναμη → η μπάλα επιταχύνεται\n• Τριβή: η δύναμη που σταματά ένα αυτοκίνητο\n• Βαρύτητα: η δύναμη που μας κρατά στη Γη (g ≈ 9.8 m/s²)", imageUrl: "" },
    ],
    sectionsEn: [
      { title: "What is a force?", content: "Force (F) is something that changes the motion of an object.\n\n• Unit: Newton (N)\n• Can push, pull, stop, or change direction\n\nFormula: F = m × a (force = mass × acceleration)", imageUrl: "" },
      { title: "Newton's Laws", content: "1st: Inertia — an object stays still or moves straight if no force acts on it\n\n2nd: F = m × a — force depends on mass and acceleration\n\n3rd: Action-Reaction — every force has an equal and opposite force", imageUrl: "" },
      { title: "Examples", content: "• When you kick a ball: you apply force → the ball accelerates\n• Friction: the force that stops a car\n• Gravity: the force that keeps us on Earth (g ≈ 9.8 m/s²)", imageUrl: "" },
    ],
  },
];

const T = {
  el: {
    tabLessons: "Μαθήματα",
    newLesson: "Νέο Μάθημα",
    useTemplate: "Έτοιμο μάθημα",
    createCustom: "Φτιάξε δικό σου",
    noLessons: "Δεν έχεις δημιουργήσει μαθήματα ακόμα",
    lessonTitle: "Τίτλος μαθήματος",
    subject: "Μάθημα",
    gradeLevel: "Βαθμίδα",
    sections: "Ενότητες",
    sectionTitle: "Τίτλος ενότητας",
    sectionContent: "Περιεχόμενο",
    sectionImage: "Εικόνα (URL, προαιρετικά)",
    addLink: "Προσθήκη συνδέσμου",
    linkName: "Τίτλος (π.χ. Σημειώσεις PDF)",
    linkUrl: "Σύνδεσμος (URL)",
    linkHint: "Google Drive, Dropbox, YouTube κ.ά.",
    attachments: "Συνημμένα",
    removeAttachment: "Αφαίρεση",
    addSection: "Προσθήκη ενότητας",
    removeSection: "Αφαίρεση",
    linkedQuiz: "Σύνδεση με Quiz",
    noLinkedQuiz: "Χωρίς quiz",
    save: "Αποθήκευση",
    saved: "Αποθηκεύτηκε!",
    cancel: "Ακύρωση",
    edit: "Επεξεργασία",
    delete: "Διαγραφή",
    confirmDelete: "Σίγουρα θέλεις να διαγράψεις αυτό το μάθημα;",
    titleRequired: "Ο τίτλος είναι υποχρεωτικός",
    minSections: "Χρειάζεται τουλάχιστον 1 ενότητα",
    assignToClass: "Ανάθεση σε τάξη",
    assignedToClass: "Ανατέθηκε στην τάξη!",
    templateLibrary: "Βιβλιοθήκη μαθημάτων",
    selectTemplate: "Χρήση",
    preview: "Προεπισκόπηση",
    sectionCount: "ενότητες",
    elem: "Δημοτικό",
    middle: "Γυμνάσιο",
    high: "Λύκειο",
    all: "Όλες",
    closeModal: "Κλείσιμο",
    cloudSync: "Συγχρονισμός",
    cloudSynced: "Συγχρονίστηκε!",
  },
  en: {
    tabLessons: "Lessons",
    newLesson: "New Lesson",
    useTemplate: "Use template",
    createCustom: "Create your own",
    noLessons: "You haven't created any lessons yet",
    lessonTitle: "Lesson title",
    subject: "Subject",
    gradeLevel: "Grade level",
    sections: "Sections",
    sectionTitle: "Section title",
    sectionContent: "Content",
    sectionImage: "Image (URL, optional)",
    addLink: "Add link",
    linkName: "Title (e.g. Notes PDF)",
    linkUrl: "Link (URL)",
    linkHint: "Google Drive, Dropbox, YouTube etc.",
    attachments: "Attachments",
    removeAttachment: "Remove",
    addSection: "Add section",
    removeSection: "Remove",
    linkedQuiz: "Link to Quiz",
    noLinkedQuiz: "No quiz",
    save: "Save",
    saved: "Saved!",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    confirmDelete: "Are you sure you want to delete this lesson?",
    titleRequired: "Title is required",
    minSections: "At least 1 section required",
    assignToClass: "Assign to class",
    assignedToClass: "Assigned to class!",
    templateLibrary: "Lesson library",
    selectTemplate: "Use",
    preview: "Preview",
    sectionCount: "sections",
    elem: "Elementary",
    middle: "Middle",
    high: "High",
    all: "All",
    closeModal: "Close",
    cloudSync: "Sync",
    cloudSynced: "Synced!",
  },
};

function emptyLesson() {
  return {
    id: "tl_" + Date.now(),
    title: "",
    subject: "",
    gradeLevel: "",
    sections: [{ title: "", content: "", imageUrl: "", attachments: [] }],
    linkedQuizId: "",
    createdAt: new Date().toISOString(),
    isTemplate: false,
  };
}

function getLinkIcon(url) {
  const u = (url || "").toLowerCase();
  if (u.includes("drive.google")) return "📁";
  if (u.includes("dropbox")) return "📦";
  if (u.includes("youtube") || u.includes("youtu.be")) return "🎬";
  if (u.match(/\.(pdf)(\?|$)/)) return "📄";
  if (u.match(/\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/)) return "🖼️";
  if (u.match(/\.(doc|docx)(\?|$)/)) return "📝";
  if (u.match(/\.(ppt|pptx)(\?|$)/)) return "📊";
  return "🔗";
}

export default function TeacherLessons({ quizzes = [], classrooms = [], lang }) {
  const isEl = lang === "el";
  const l = T[isEl ? "el" : "en"];
  const { user } = useContext(AuthContext);

  const [lessons, setLessons] = useState(() => getLocalLessons());
  const [editing, setEditing] = useState(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [assignPopup, setAssignPopup] = useState(null);
  const [previewLesson, setPreviewLesson] = useState(null);

  const addAttachmentLink = useCallback((sectionIdx, name, url) => {
    if (!url.trim()) return;
    const s = [...editing.sections];
    const sec = { ...s[sectionIdx] };
    sec.attachments = [...(sec.attachments || []), { name: name.trim() || url, url: url.trim() }];
    s[sectionIdx] = sec;
    setEditing({ ...editing, sections: s });
  }, [editing]);

  const removeAttachment = useCallback((sectionIdx, attachIdx) => {
    const s = [...editing.sections];
    const sec = { ...s[sectionIdx] };
    sec.attachments = sec.attachments.filter((_, i) => i !== attachIdx);
    s[sectionIdx] = sec;
    setEditing({ ...editing, sections: s });
  }, [editing]);

  useEffect(() => { saveLocalLessons(lessons); }, [lessons]);

  useEffect(() => {
    if (!user || !db) return;
    if (lessons.length > 0) return;
    (async () => {
      try {
        const snap = await getDocs(collection(db, "users", user.uid, "teacherLessons"));
        if (!snap.empty) {
          const cloud = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          setLessons(cloud);
          saveLocalLessons(cloud);
        }
      } catch {}
    })();
  }, [user]);

  const handleSave = useCallback(async () => {
    if (!editing.title.trim()) { setError(l.titleRequired); return; }
    const validSections = editing.sections.filter(s => s.title.trim() || s.content.trim());
    if (validSections.length < 1) { setError(l.minSections); return; }
    const toSave = { ...editing, sections: validSections, updatedAt: new Date().toISOString() };
    const idx = lessons.findIndex(x => x.id === toSave.id);
    const updated = idx >= 0 ? lessons.map(x => x.id === toSave.id ? toSave : x) : [...lessons, toSave];
    setLessons(updated);
    if (user && db) {
      try { await setDoc(doc(db, "users", user.uid, "teacherLessons", toSave.id), toSave); } catch {}
    }
    setEditing(null);
    setError(null);
    setSuccess(l.saved);
    setTimeout(() => setSuccess(null), 2000);
  }, [editing, lessons, user, l]);

  const handleDelete = useCallback(async (id) => {
    if (!confirm(l.confirmDelete)) return;
    setLessons(prev => prev.filter(x => x.id !== id));
    if (user && db) {
      try { await deleteDoc(doc(db, "users", user.uid, "teacherLessons", id)); } catch {}
    }
  }, [user, l]);

  const handleSync = useCallback(async () => {
    if (!user || !db) return;
    for (const ls of lessons) {
      try { await setDoc(doc(db, "users", user.uid, "teacherLessons", ls.id), ls); } catch {}
    }
    setSuccess(l.cloudSynced);
    setTimeout(() => setSuccess(null), 2000);
  }, [lessons, user, l]);

  const applyTemplate = (tpl) => {
    const sections = isEl ? tpl.sectionsEl : tpl.sectionsEn;
    setEditing({
      ...emptyLesson(),
      title: isEl ? tpl.titleEl : tpl.titleEn,
      subject: tpl.subject,
      gradeLevel: tpl.gradeLevel,
      sections: sections.map(s => ({ ...s })),
    });
    setShowTemplates(false);
  };

  const handleAssign = useCallback(async (lesson, clsCode) => {
    if (!user || !db) return;
    const code = generateCode();
    try {
      await setDoc(doc(db, "classroomLessons", code), {
        code,
        classroomCode: clsCode,
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        subject: lesson.subject || "",
        gradeLevel: lesson.gradeLevel || "",
        sections: lesson.sections,
        linkedQuizId: lesson.linkedQuizId || "",
        teacherUid: user.uid,
        teacherName: user.displayName || "",
        createdAt: new Date().toISOString(),
      });
      setSuccess(l.assignedToClass);
      setTimeout(() => setSuccess(null), 2000);
    } catch {}
    setAssignPopup(null);
  }, [user, l]);

  const subjectLabel = (key) => {
    const s = SUBJECT_OPTIONS.find(o => o.key === key);
    return s ? (isEl ? s.el : s.en) : key;
  };
  const subjectIcon = (key) => {
    const s = SUBJECT_OPTIONS.find(o => o.key === key);
    return s ? s.icon : "📖";
  };
  const gradeLabel = (g) => l[g] || g;

  if (editing) {
    return (
      <div className="space-y-5">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">{l.newLesson}</h3>
            <button onClick={() => { setEditing(null); setError(null); }} className="text-sm text-slate-500 hover:text-red-500">{l.cancel}</button>
          </div>

          {error && <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-xl">{error}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{l.lessonTitle}</label>
              <input type="text" value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 focus:border-purple-400 outline-none text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700" placeholder={isEl ? "π.χ. Κλάσματα" : "e.g. Fractions"} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{l.subject}</label>
              <select value={editing.subject || ""} onChange={e => setEditing({ ...editing, subject: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 focus:border-purple-400 outline-none text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700">
                <option value="">{isEl ? "-- Επιλέξτε --" : "-- Select --"}</option>
                {SUBJECT_OPTIONS.map(s => <option key={s.key} value={s.key}>{s.icon} {isEl ? s.el : s.en}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{l.gradeLevel}</label>
            <div className="flex gap-2 flex-wrap">
              {["elem", "middle", "high", "all"].map(g => (
                <button key={g} onClick={() => setEditing({ ...editing, gradeLevel: g })} className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${editing.gradeLevel === g ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300" : "border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-purple-300"}`}>
                  {l[g]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{l.linkedQuiz}</label>
            <select value={editing.linkedQuizId || ""} onChange={e => setEditing({ ...editing, linkedQuizId: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 focus:border-purple-400 outline-none text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700">
              <option value="">{l.noLinkedQuiz}</option>
              {quizzes.map(q => <option key={q.id} value={q.id}>{q.title}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">{l.sections}</label>
            <div className="space-y-4">
              {editing.sections.map((sec, i) => (
                <div key={i} className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 border border-slate-200 dark:border-slate-600 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase">{isEl ? `Ενότητα ${i + 1}` : `Section ${i + 1}`}</span>
                    {editing.sections.length > 1 && (
                      <button onClick={() => { const s = [...editing.sections]; s.splice(i, 1); setEditing({ ...editing, sections: s }); }} className="text-xs text-red-500 hover:text-red-700">{l.removeSection}</button>
                    )}
                  </div>
                  <input type="text" value={sec.title} onChange={e => { const s = [...editing.sections]; s[i] = { ...s[i], title: e.target.value }; setEditing({ ...editing, sections: s }); }} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 outline-none text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:border-purple-400" placeholder={l.sectionTitle} />
                  <textarea value={sec.content} onChange={e => { const s = [...editing.sections]; s[i] = { ...s[i], content: e.target.value }; setEditing({ ...editing, sections: s }); }} rows={5} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 outline-none text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 resize-y focus:border-purple-400" placeholder={l.sectionContent} />
                  <input type="url" value={sec.imageUrl || ""} onChange={e => { const s = [...editing.sections]; s[i] = { ...s[i], imageUrl: e.target.value }; setEditing({ ...editing, sections: s }); }} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 outline-none text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:border-purple-400" placeholder={l.sectionImage} />

                  {/* Add link */}
                  <div className="pt-1">
                    <details className="group">
                      <summary className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-indigo-300 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400 text-xs font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors cursor-pointer list-none">
                        <span>🔗</span> {l.addLink}
                        <span className="text-[10px] text-slate-400 font-normal ml-1">({l.linkHint})</span>
                      </summary>
                      <div className="mt-2 flex flex-col sm:flex-row gap-2">
                        <input type="text" id={`att-name-${i}`} className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 outline-none text-xs bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:border-indigo-400" placeholder={l.linkName} />
                        <input type="url" id={`att-url-${i}`} className="flex-[2] px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 outline-none text-xs bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:border-indigo-400" placeholder={l.linkUrl} />
                        <button type="button" onClick={() => {
                          const nameEl = document.getElementById(`att-name-${i}`);
                          const urlEl = document.getElementById(`att-url-${i}`);
                          if (urlEl?.value?.trim()) {
                            addAttachmentLink(i, nameEl?.value || "", urlEl.value);
                            if (nameEl) nameEl.value = "";
                            urlEl.value = "";
                          }
                        }} className="px-4 py-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors whitespace-nowrap">
                          + {isEl ? "Προσθήκη" : "Add"}
                        </button>
                      </div>
                    </details>
                  </div>

                  {/* Attachments list */}
                  {(sec.attachments || []).length > 0 && (
                    <div className="pt-1 space-y-1.5">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{l.attachments}:</span>
                      {sec.attachments.map((att, ai) => (
                        <div key={ai} className="flex items-center gap-2 bg-white dark:bg-slate-700 rounded-lg px-3 py-1.5 border border-slate-200 dark:border-slate-600 text-xs">
                          <span>{getLinkIcon(att.url)}</span>
                          <a href={att.url} target="_blank" rel="noopener noreferrer" className="flex-1 truncate text-indigo-600 dark:text-indigo-400 hover:underline font-medium">{att.name}</a>
                          <button onClick={() => removeAttachment(i, ai)} className="text-red-400 hover:text-red-600 font-bold" title={l.removeAttachment}>×</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button onClick={() => setEditing({ ...editing, sections: [...editing.sections, { title: "", content: "", imageUrl: "", attachments: [] }] })} className="mt-3 px-4 py-2 rounded-xl border-2 border-dashed border-purple-300 dark:border-purple-700 text-purple-600 dark:text-purple-400 text-sm font-medium hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all">
              + {l.addSection}
            </button>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-md hover:shadow-lg transition-all">{l.save}</button>
            <button onClick={() => { setEditing(null); setError(null); }} className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold">{l.cancel}</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {success && <div className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2"><span>✅</span>{success}</div>}

      <div className="flex flex-wrap gap-3">
        <button onClick={() => setShowTemplates(true)} className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold shadow-md hover:shadow-lg transition-all text-sm flex items-center gap-2">
          <span>📚</span> {l.useTemplate}
        </button>
        <button onClick={() => setEditing(emptyLesson())} className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold shadow-md hover:shadow-lg transition-all text-sm flex items-center gap-2">
          <span>✏️</span> {l.createCustom}
        </button>
        {user && lessons.length > 0 && (
          <button onClick={handleSync} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center gap-1.5">
            <span>☁️</span> {l.cloudSync}
          </button>
        )}
      </div>

      {lessons.length === 0 ? (
        <div className="text-center py-12 text-slate-400 dark:text-slate-500">
          <div className="text-5xl mb-3">📖</div>
          <p className="text-sm">{l.noLessons}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {lessons.map(ls => (
            <div key={ls.id} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl">{subjectIcon(ls.subject)}</span>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-800 dark:text-white text-sm truncate">{ls.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {subjectLabel(ls.subject)} {ls.gradeLevel ? `• ${gradeLabel(ls.gradeLevel)}` : ""} • {ls.sections.length} {l.sectionCount}
                  </p>
                  {ls.linkedQuizId && (
                    <p className="text-xs text-purple-500 mt-1 flex items-center gap-1">
                      <span>📝</span> {quizzes.find(q => q.id === ls.linkedQuizId)?.title || "Quiz"}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setPreviewLesson(ls)} className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900/50">{l.preview}</button>
                <button onClick={() => setEditing({ ...ls })} className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-600">{l.edit}</button>
                {classrooms.length > 0 && (
                  <button onClick={() => setAssignPopup(ls)} className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/50">{l.assignToClass}</button>
                )}
                <button onClick={() => handleDelete(ls.id)} className="px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400 text-xs font-semibold hover:bg-red-100 dark:hover:bg-red-900/50">{l.delete}</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Templates Modal */}
      {showTemplates && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowTemplates(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2"><span>📚</span>{l.templateLibrary}</h3>
              <button onClick={() => setShowTemplates(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm">{l.closeModal}</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {LESSON_TEMPLATES.map((tpl, i) => (
                <div key={i} className="group bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 border border-slate-200 dark:border-slate-600 hover:border-purple-300 dark:hover:border-purple-600 transition-all">
                  <div className="flex items-start gap-3 mb-2">
                    <span className="text-xl">{SUBJECT_OPTIONS.find(s => s.key === tpl.subject)?.icon || "📖"}</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-800 dark:text-white text-sm">{isEl ? tpl.titleEl : tpl.titleEn}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {isEl ? tpl.gradeLabel.el : tpl.gradeLabel.en} • {(isEl ? tpl.sectionsEl : tpl.sectionsEn).length} {l.sectionCount}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => applyTemplate(tpl)} className="w-full mt-2 px-3 py-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-bold hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors">
                    {l.selectTemplate}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {assignPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setAssignPopup(null)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">{l.assignToClass}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{assignPopup.title}</p>
            <div className="space-y-2">
              {classrooms.map(cls => (
                <button key={cls.code} onClick={() => handleAssign(assignPopup, cls.code)} className="w-full text-left px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-700 hover:bg-purple-50 dark:hover:bg-purple-900/30 text-slate-700 dark:text-slate-200 font-medium text-sm transition-colors flex items-center gap-2">
                  <span>🏫</span> {cls.name} <span className="text-xs text-slate-400 ml-auto">{cls.code}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setAssignPopup(null)} className="mt-4 w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-500 text-sm font-medium">{l.cancel}</button>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setPreviewLesson(null)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <span>{subjectIcon(previewLesson.subject)}</span>{previewLesson.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1">{subjectLabel(previewLesson.subject)} {previewLesson.gradeLevel ? `• ${gradeLabel(previewLesson.gradeLevel)}` : ""}</p>
              </div>
              <button onClick={() => setPreviewLesson(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">{l.closeModal}</button>
            </div>
            <div className="space-y-6">
              {previewLesson.sections.map((sec, i) => (
                <div key={i} className="border-l-4 border-purple-400 pl-4">
                  <h4 className="font-bold text-slate-800 dark:text-white text-base mb-2">{sec.title}</h4>
                  {sec.imageUrl && <img src={sec.imageUrl} alt="" loading="lazy" decoding="async" className="rounded-xl mb-3 max-h-48 object-cover" />}
                  <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">{sec.content}</div>
                  {(sec.attachments || []).length > 0 && (
                    <div className="mt-3 space-y-1.5">
                      {sec.attachments.map((att, ai) => (
                        <a key={ai} href={att.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg px-3 py-2 border border-slate-200 dark:border-slate-600 text-xs text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">
                          <span>{getLinkIcon(att.url)}</span>
                          <span className="font-medium truncate">{att.name}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
