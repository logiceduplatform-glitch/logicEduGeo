import React, { useState, useContext, useMemo, useRef } from "react";
import { LanguageContext } from "../i18n/LanguageContext";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";

const WORKSHEET_TYPES = [
  {
    id: "addition",
    icon: "➕",
    name: { el: "Πρόσθεση", en: "Addition" },
    category: "math",
    generate: (count, difficulty) => {
      const max = difficulty === "easy" ? 20 : difficulty === "medium" ? 100 : 1000;
      return Array.from({ length: count }, () => {
        const a = Math.floor(Math.random() * max) + 1;
        const b = Math.floor(Math.random() * max) + 1;
        return { question: `${a} + ${b} = ___`, answer: a + b };
      });
    },
  },
  {
    id: "subtraction",
    icon: "➖",
    name: { el: "Αφαίρεση", en: "Subtraction" },
    category: "math",
    generate: (count, difficulty) => {
      const max = difficulty === "easy" ? 20 : difficulty === "medium" ? 100 : 1000;
      return Array.from({ length: count }, () => {
        const b = Math.floor(Math.random() * max) + 1;
        const a = b + Math.floor(Math.random() * max) + 1;
        return { question: `${a} − ${b} = ___`, answer: a - b };
      });
    },
  },
  {
    id: "multiplication",
    icon: "✖️",
    name: { el: "Πολλαπλασιασμός", en: "Multiplication" },
    category: "math",
    generate: (count, difficulty) => {
      const max = difficulty === "easy" ? 10 : difficulty === "medium" ? 12 : 20;
      return Array.from({ length: count }, () => {
        const a = Math.floor(Math.random() * max) + 2;
        const b = Math.floor(Math.random() * max) + 2;
        return { question: `${a} × ${b} = ___`, answer: a * b };
      });
    },
  },
  {
    id: "division",
    icon: "➗",
    name: { el: "Διαίρεση", en: "Division" },
    category: "math",
    generate: (count, difficulty) => {
      const max = difficulty === "easy" ? 10 : difficulty === "medium" ? 12 : 20;
      return Array.from({ length: count }, () => {
        const b = Math.floor(Math.random() * max) + 2;
        const answer = Math.floor(Math.random() * max) + 1;
        const a = b * answer;
        return { question: `${a} ÷ ${b} = ___`, answer };
      });
    },
  },
  {
    id: "mixed",
    icon: "🔢",
    name: { el: "Μικτές Πράξεις", en: "Mixed Operations" },
    category: "math",
    generate: (count, difficulty) => {
      const ops = ["+", "−", "×"];
      const max = difficulty === "easy" ? 15 : difficulty === "medium" ? 50 : 100;
      return Array.from({ length: count }, () => {
        const op = ops[Math.floor(Math.random() * ops.length)];
        let a, b, answer;
        if (op === "×") { a = Math.floor(Math.random() * 12) + 2; b = Math.floor(Math.random() * 12) + 2; answer = a * b; }
        else if (op === "−") { b = Math.floor(Math.random() * max) + 1; a = b + Math.floor(Math.random() * max); answer = a - b; }
        else { a = Math.floor(Math.random() * max) + 1; b = Math.floor(Math.random() * max) + 1; answer = a + b; }
        return { question: `${a} ${op} ${b} = ___`, answer };
      });
    },
  },
  {
    id: "number_patterns",
    icon: "🔗",
    name: { el: "Μοτίβα Αριθμών", en: "Number Patterns" },
    category: "math",
    generate: (count, difficulty) => {
      const step = difficulty === "easy" ? [2, 3, 5] : difficulty === "medium" ? [3, 4, 6, 7] : [7, 8, 9, 11];
      return Array.from({ length: count }, () => {
        const s = step[Math.floor(Math.random() * step.length)];
        const start = Math.floor(Math.random() * 20) + 1;
        const seq = Array.from({ length: 5 }, (_, i) => start + s * i);
        return { question: `${seq.slice(0, 4).join(", ")}, ___`, answer: seq[4] };
      });
    },
  },
  {
    id: "comparisons",
    icon: "⚖️",
    name: { el: "Συγκρίσεις (>, <, =)", en: "Comparisons (>, <, =)" },
    category: "math",
    generate: (count, difficulty) => {
      const max = difficulty === "easy" ? 20 : difficulty === "medium" ? 100 : 1000;
      return Array.from({ length: count }, () => {
        const a = Math.floor(Math.random() * max) + 1;
        const b = Math.floor(Math.random() * max) + 1;
        const answer = a > b ? ">" : a < b ? "<" : "=";
        return { question: `${a} ___ ${b}`, answer };
      });
    },
  },
  {
    id: "word_problems",
    icon: "📝",
    name: { el: "Προβλήματα", en: "Word Problems" },
    category: "math",
    generate: (count, difficulty, lang = "en") => {
      const templates = {
        en: [
          (a, b) => ({ question: `Maria has ${a} apples. She buys ${b} more. How many does she have? ___`, answer: a + b }),
          (a, b) => ({ question: `There are ${a + b} birds. ${a} fly away. How many remain? ___`, answer: b }),
          (a, b) => ({ question: `${a} children each have ${b} stickers. Total stickers? ___`, answer: a * b }),
          (a, b) => ({ question: `A box has ${a * b} chocolates shared equally among ${a} children. Each gets? ___`, answer: b }),
          (a, b) => ({ question: `John reads ${a} pages a day for ${b} days. Total pages read? ___`, answer: a * b }),
        ],
        el: [
          (a, b) => ({ question: `Η Μαρία έχει ${a} μήλα. Αγοράζει άλλα ${b}. Πόσα έχει συνολικά; ___`, answer: a + b }),
          (a, b) => ({ question: `Σε ένα δέντρο κάθονται ${a + b} πουλιά. ${a} φεύγουν. Πόσα μένουν; ___`, answer: b }),
          (a, b) => ({ question: `${a} παιδιά έχουν από ${b} αυτοκόλλητα το καθένα. Πόσα αυτοκόλλητα συνολικά; ___`, answer: a * b }),
          (a, b) => ({ question: `Ένα κουτί έχει ${a * b} σοκολατάκια και τα μοιράζονται ${a} παιδιά. Πόσα παίρνει το καθένα; ___`, answer: b }),
          (a, b) => ({ question: `Ο Γιάννης διαβάζει ${a} σελίδες την ημέρα για ${b} μέρες. Πόσες σελίδες διάβασε συνολικά; ___`, answer: a * b }),
          (a, b) => ({ question: `Στο πάρκο υπάρχουν ${a} κούνιες. Κάθε κούνια έχει ${b} παιδιά. Πόσα παιδιά συνολικά; ___`, answer: a * b }),
        ],
      };
      const t = templates[lang] || templates.en;
      return Array.from({ length: count }, () => {
        const a = Math.floor(Math.random() * 12) + 2;
        const b = Math.floor(Math.random() * 12) + 2;
        return t[Math.floor(Math.random() * t.length)](a, b);
      });
    },
  },

  // ─── ΕΛΛΗΝΙΚΑ / GREEK LANGUAGE ────────────────────────────────────────────
  {
    id: "el_alphabet",
    icon: "🔤",
    name: { el: "Αλφάβητο", en: "Greek Alphabet" },
    category: "language_el",
    onlyLang: "el",
    generate: (count) => {
      const alphabet = ["Α","Β","Γ","Δ","Ε","Ζ","Η","Θ","Ι","Κ","Λ","Μ","Ν","Ξ","Ο","Π","Ρ","Σ","Τ","Υ","Φ","Χ","Ψ","Ω"];
      const lower    = ["α","β","γ","δ","ε","ζ","η","θ","ι","κ","λ","μ","ν","ξ","ο","π","ρ","σ","τ","υ","φ","χ","ψ","ω"];
      return Array.from({ length: count }, () => {
        const i = Math.floor(Math.random() * alphabet.length);
        const variants = [
          { question: `Γράψε το πεζό του γράμματος ${alphabet[i]}: ___`, answer: lower[i] },
          { question: `Γράψε το κεφαλαίο του γράμματος ${lower[i]}: ___`, answer: alphabet[i] },
          { question: `Ποιο γράμμα έρχεται μετά το ${alphabet[i]}; ___`, answer: alphabet[(i + 1) % alphabet.length] },
        ];
        return variants[Math.floor(Math.random() * variants.length)];
      });
    },
  },
  {
    id: "el_spelling",
    icon: "📝",
    name: { el: "Ορθογραφία", en: "Greek Spelling" },
    category: "language_el",
    onlyLang: "el",
    generate: (count, difficulty) => {
      const easy = [
        { hint: "γάτος", answer: "γάτος" }, { hint: "παιδί", answer: "παιδί" },
        { hint: "σπίτι", answer: "σπίτι" }, { hint: "βιβλίο", answer: "βιβλίο" },
        { hint: "δάσκαλος", answer: "δάσκαλος" }, { hint: "αγόρι", answer: "αγόρι" },
        { hint: "κορίτσι", answer: "κορίτσι" }, { hint: "ήλιος", answer: "ήλιος" },
        { hint: "νερό", answer: "νερό" }, { hint: "χέρι", answer: "χέρι" },
        { hint: "ποδήλατο", answer: "ποδήλατο" }, { hint: "καρέκλα", answer: "καρέκλα" },
      ];
      const medium = [
        { hint: "Γράψε σωστά: «η»/«οι» — αυτές οι φίλες είναι κ___λές", answer: "καλές" },
        { hint: "Συμπλήρωσε: το σχ___λείο έχει αρχ___σει", answer: "σχολείο, αρχίσει" },
        { hint: "Συμπλήρωσε ο/ω: μαθητ___ς που γράφ___", answer: "μαθητής, γράφω" },
        { hint: "Διόρθωσε: «πεδί» → ", answer: "παιδί" },
        { hint: "Διόρθωσε: «βυβλίο» → ", answer: "βιβλίο" },
        { hint: "Συμπλήρωσε ει/ι: επ___δή", answer: "επειδή" },
      ];
      const hard = [
        { hint: "Γράψε ορθά τη μετοχή του «τρέχω» (παρακείμενος)", answer: "έχω τρέξει" },
        { hint: "Διόρθωσε: «εξεσερευνώ» → ", answer: "εξερευνώ" },
        { hint: "Συμπλήρωσε ορθογραφικά: «έγρα___ε» (γράφω, αόρ.)", answer: "έγραψε" },
        { hint: "Συμπλήρωσε: «πρ___τη φορά»", answer: "πρώτη" },
        { hint: "Συμπλήρωσε: «δι___σταση»", answer: "διάσταση" },
        { hint: "Διόρθωσε: «παρακαλόντας» → ", answer: "παρακαλώντας" },
      ];
      const pool = difficulty === "easy" ? easy : difficulty === "medium" ? medium : hard;
      return Array.from({ length: count }, () => {
        const it = pool[Math.floor(Math.random() * pool.length)];
        return { question: `${it.hint} ___`, answer: it.answer };
      });
    },
  },
  {
    id: "el_vocabulary",
    icon: "📚",
    name: { el: "Λεξιλόγιο", en: "Greek Vocabulary" },
    category: "language_el",
    onlyLang: "el",
    generate: (count) => {
      const items = [
        { q: "Συνώνυμο: όμορφος", a: "ωραίος" },
        { q: "Συνώνυμο: γρήγορος", a: "ταχύς" },
        { q: "Συνώνυμο: μεγάλος", a: "τεράστιος" },
        { q: "Αντώνυμο: φωτεινός", a: "σκοτεινός" },
        { q: "Αντώνυμο: ψηλός", a: "κοντός" },
        { q: "Αντώνυμο: πλούσιος", a: "φτωχός" },
        { q: "Αντώνυμο: γρήγορος", a: "αργός" },
        { q: "Συνώνυμο: χαρούμενος", a: "ευτυχισμένος" },
        { q: "Συνώνυμο: τρέχω", a: "σπεύδω" },
        { q: "Αντώνυμο: ζεστός", a: "κρύος" },
        { q: "Συνώνυμο: φοβάμαι", a: "τρέμω" },
        { q: "Αντώνυμο: αρχή", a: "τέλος" },
        { q: "Συμπλήρωσε: ο τίτλος μιας ιστορίας ονομάζεται ___", a: "πρωτότυπος / αρχικός" },
        { q: "Πληθυντικός: το βιβλίο →", a: "τα βιβλία" },
        { q: "Πληθυντικός: ο μαθητής →", a: "οι μαθητές" },
      ];
      return Array.from({ length: count }, () => {
        const it = items[Math.floor(Math.random() * items.length)];
        return { question: `${it.q}: ___`, answer: it.a };
      });
    },
  },
  {
    id: "el_grammar",
    icon: "✏️",
    name: { el: "Γραμματική", en: "Greek Grammar" },
    category: "language_el",
    onlyLang: "el",
    generate: (count, difficulty) => {
      const items = [
        { q: "Συμπλήρωσε με τον σωστό τύπο του ρήματος «τρέχω» (β' εν., ενεστ.)", a: "τρέχεις" },
        { q: "Συμπλήρωσε με τον σωστό τύπο του ρήματος «γράφω» (γ' πληθ., ενεστ.)", a: "γράφουν" },
        { q: "Πτώσεις: γενική του «το παιδί»", a: "του παιδιού" },
        { q: "Πτώσεις: αιτιατική πληθυντικού «ο μαθητής»", a: "τους μαθητές" },
        { q: "Άρθρο πριν τη λέξη «αδελφή» (αιτιατική)", a: "την" },
        { q: "Άρθρο πριν τη λέξη «πατέρας» (γενική)", a: "του" },
        { q: "Συμπληρωμένος μέλλοντας του «παίζω» (α' εν.)", a: "θα έχω παίξει" },
        { q: "Παραθετικά: μεγάλος → συγκριτικός", a: "μεγαλύτερος" },
        { q: "Παραθετικά: όμορφος → υπερθετικός", a: "ομορφότατος / πιο όμορφος" },
        { q: "Πτώση: «του βιβλίου» είναι σε", a: "γενική" },
      ];
      return Array.from({ length: count }, () => {
        const it = items[Math.floor(Math.random() * items.length)];
        return { question: `${it.q}: ___`, answer: it.a };
      });
    },
  },
  {
    id: "el_word_problems",
    icon: "🧩",
    name: { el: "Προβλήματα Λογικής", en: "Greek Logic Problems" },
    category: "language_el",
    onlyLang: "el",
    generate: (count, difficulty) => {
      return Array.from({ length: count }, () => {
        const a = Math.floor(Math.random() * 12) + 2;
        const b = Math.floor(Math.random() * 12) + 2;
        const templates = [
          () => ({ question: `Η Άννα έχει ${a} ευρώ και ξοδεύει ${Math.min(a-1,b)}. Πόσα της μένουν; ___`, answer: a - Math.min(a-1, b) }),
          () => ({ question: `Ο Νίκος έγραψε ${a * b} γράμματα σε ${a} φακέλους ισόποσα. Πόσα γράμματα ανά φάκελο; ___`, answer: b }),
          () => ({ question: `Η μαμά αγόρασε ${a} κουτιά με ${b} αυγά το καθένα. Πόσα αυγά συνολικά; ___`, answer: a * b }),
          () => ({ question: `Σε μια τάξη υπάρχουν ${a + b} μαθητές, ${a} αγόρια και υπόλοιπα κορίτσια. Πόσα κορίτσια; ___`, answer: b }),
        ];
        return templates[Math.floor(Math.random() * templates.length)]();
      });
    },
  },

  // ─── ENGLISH LANGUAGE ────────────────────────────────────────────────────
  {
    id: "en_alphabet",
    icon: "🔤",
    name: { el: "Αγγλικό Αλφάβητο", en: "English Alphabet" },
    category: "language_en",
    onlyLang: "en",
    generate: (count) => {
      const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
      const lower = "abcdefghijklmnopqrstuvwxyz".split("");
      return Array.from({ length: count }, () => {
        const i = Math.floor(Math.random() * upper.length);
        const variants = [
          { question: `Write the lowercase of ${upper[i]}: ___`, answer: lower[i] },
          { question: `Write the uppercase of ${lower[i]}: ___`, answer: upper[i] },
          { question: `Which letter comes after ${upper[i]}? ___`, answer: upper[(i + 1) % upper.length] },
        ];
        return variants[Math.floor(Math.random() * variants.length)];
      });
    },
  },
  {
    id: "en_spelling",
    icon: "📝",
    name: { el: "Αγγλική Ορθογραφία", en: "English Spelling" },
    category: "language_en",
    onlyLang: "en",
    generate: (count) => {
      const items = [
        { q: "Spell: a small house pet (4 letters)", a: "cat" },
        { q: "Fix: «recieve» →", a: "receive" },
        { q: "Fix: «definately» →", a: "definitely" },
        { q: "Fix: «seperately» →", a: "separately" },
        { q: "Fix: «occured» →", a: "occurred" },
        { q: "Plural of «child»", a: "children" },
        { q: "Plural of «mouse»", a: "mice" },
        { q: "Past tense of «go»", a: "went" },
        { q: "Past tense of «write»", a: "wrote" },
        { q: "Spell the number 7", a: "seven" },
        { q: "Spell the number 12", a: "twelve" },
      ];
      return Array.from({ length: count }, () => {
        const it = items[Math.floor(Math.random() * items.length)];
        return { question: `${it.q}: ___`, answer: it.a };
      });
    },
  },
  {
    id: "en_vocabulary",
    icon: "📚",
    name: { el: "Αγγλικό Λεξιλόγιο", en: "English Vocabulary" },
    category: "language_en",
    onlyLang: "en",
    generate: (count) => {
      const items = [
        { q: "Synonym of: happy", a: "joyful / glad" },
        { q: "Synonym of: big", a: "large / huge" },
        { q: "Antonym of: hot", a: "cold" },
        { q: "Antonym of: fast", a: "slow" },
        { q: "Antonym of: rich", a: "poor" },
        { q: "Synonym of: smart", a: "clever / intelligent" },
        { q: "Translate to English: σπίτι", a: "house" },
        { q: "Translate to English: γάτα", a: "cat" },
        { q: "Translate to English: σχολείο", a: "school" },
        { q: "Translate to English: βιβλίο", a: "book" },
      ];
      return Array.from({ length: count }, () => {
        const it = items[Math.floor(Math.random() * items.length)];
        return { question: `${it.q}: ___`, answer: it.a };
      });
    },
  },
];

const T = {
  el: {
    title: "Εκτυπώσιμα Φύλλα Εργασίας",
    subtitle: "Δημιούργησε φύλλα εργασίας για εξάσκηση!",
    type: "Τύπος",
    difficulty: "Δυσκολία",
    count: "Πλήθος ασκήσεων",
    easy: "Εύκολο",
    medium: "Μέτριο",
    hard: "Δύσκολο",
    generate: "Δημιουργία",
    print: "Εκτύπωση",
    newSheet: "Νέο φύλλο",
    showAnswers: "Εμφάνιση απαντήσεων",
    hideAnswers: "Απόκρυψη απαντήσεων",
    name: "Όνομα: _______________",
    date: "Ημερομηνία: _______________",
    worksheet: "Φύλλο Εργασίας",
    answers: "Απαντήσεις",
    math: "Μαθηματικά",
    language_el: "Ελληνική Γλώσσα",
    language_en: "Αγγλική Γλώσσα",
    catLabel: "Κατηγορία",
  },
  en: {
    title: "Printable Worksheets",
    subtitle: "Generate practice worksheets for printing!",
    type: "Type",
    difficulty: "Difficulty",
    count: "Number of exercises",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    generate: "Generate",
    print: "Print",
    newSheet: "New sheet",
    showAnswers: "Show answers",
    hideAnswers: "Hide answers",
    name: "Name: _______________",
    date: "Date: _______________",
    worksheet: "Worksheet",
    answers: "Answers",
    math: "Math",
    language_el: "Greek Language",
    language_en: "English Language",
    catLabel: "Category",
  },
};

export default function PrintableWorksheetsPage() {
  const { lang } = useContext(LanguageContext);
  const l = T[lang] || T.en;
  const isEl = lang === "el";
  const printRef = useRef(null);

  const [selectedType, setSelectedType] = useState("addition");
  const [difficulty, setDifficulty] = useState("easy");
  const [count, setCount] = useState(15);
  const [exercises, setExercises] = useState(null);
  const [showAnswers, setShowAnswers] = useState(false);

  const visibleTypes = useMemo(
    () => WORKSHEET_TYPES.filter(w => !w.onlyLang || w.onlyLang === lang),
    [lang]
  );

  // Group by category for cleaner picker
  const groupedTypes = useMemo(() => {
    const out = {};
    for (const w of visibleTypes) {
      const cat = w.category || "math";
      if (!out[cat]) out[cat] = [];
      out[cat].push(w);
    }
    return out;
  }, [visibleTypes]);

  const wsType = WORKSHEET_TYPES.find(w => w.id === selectedType) || visibleTypes[0];

  // Auto-switch type if current selection isn't valid for the language
  React.useEffect(() => {
    if (!visibleTypes.find(w => w.id === selectedType)) {
      setSelectedType(visibleTypes[0]?.id || "addition");
    }
  }, [visibleTypes, selectedType]);

  const handleGenerate = () => {
    if (!wsType) return;
    setExercises(wsType.generate(count, difficulty, lang));
    setShowAnswers(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <Navbar />
      <SEO title={l.title} />

      <div className="pt-20 pb-12 px-4 print:pt-0 print:px-0">
        <div className="mx-auto max-w-3xl">
          {/* Controls - hidden when printing */}
          <div className="print:hidden space-y-6 mb-8">
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white mb-2">🖨️ {l.title}</h1>
              <p className="text-slate-500 dark:text-slate-400">{l.subtitle}</p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-700 space-y-4">
              <div className="space-y-4">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">{l.type}</label>
                {Object.entries(groupedTypes).map(([cat, items]) => (
                  <div key={cat}>
                    <p className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                      {l[cat] || cat}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {items.map(wt => (
                        <button key={wt.id} onClick={() => setSelectedType(wt.id)} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${selectedType === wt.id ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border-2 border-indigo-400" : "bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600"}`}>
                          <span>{wt.icon}</span>
                          <span className="truncate">{isEl ? wt.name.el : wt.name.en}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">{l.difficulty}</label>
                  <div className="flex gap-2">
                    {["easy", "medium", "hard"].map(d => (
                      <button key={d} onClick={() => setDifficulty(d)} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${difficulty === d ? "bg-indigo-500 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"}`}>
                        {l[d]}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">{l.count}</label>
                  <select value={count} onChange={e => setCount(Number(e.target.value))} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white outline-none">
                    {[10, 15, 20, 25, 30].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </div>

              <button onClick={handleGenerate} className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold shadow-md hover:shadow-lg transition-all text-lg">
                ✨ {l.generate}
              </button>
            </div>
          </div>

          {/* Worksheet preview / print area */}
          {exercises && (
            <>
              <div className="print:hidden flex gap-3 justify-center mb-4">
                <button onClick={handlePrint} className="px-6 py-2.5 rounded-xl bg-emerald-500 text-white font-bold shadow-md hover:shadow-lg transition-all">
                  🖨️ {l.print}
                </button>
                <button onClick={() => setShowAnswers(!showAnswers)} className="px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold">
                  {showAnswers ? l.hideAnswers : l.showAnswers}
                </button>
                <button onClick={handleGenerate} className="px-6 py-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold">
                  🔄 {l.newSheet}
                </button>
              </div>

              <div ref={printRef} className="bg-white dark:bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-slate-100 dark:border-slate-100 print:shadow-none print:border-none print:rounded-none print:p-4">
                {/* Header */}
                <div className="text-center border-b-2 border-slate-300 pb-4 mb-6">
                  <h2 className="text-xl font-bold text-slate-800">{l.worksheet}: {wsType && (isEl ? wsType.name.el : wsType.name.en)}</h2>
                  <div className="flex justify-between mt-3 text-sm text-slate-500">
                    <span>{l.name}</span>
                    <span>{l.date}</span>
                  </div>
                </div>

                {/* Exercises */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  {exercises.map((ex, i) => (
                    <div key={i} className="flex items-baseline gap-2 py-1.5 border-b border-dotted border-slate-200">
                      <span className="text-sm font-bold text-slate-400 w-6 text-right shrink-0">{i + 1}.</span>
                      <span className="text-base text-slate-800 font-medium">{ex.question}</span>
                    </div>
                  ))}
                </div>

                {/* Answers (only when toggled or for print) */}
                {showAnswers && (
                  <div className="mt-8 pt-4 border-t-2 border-slate-300">
                    <h3 className="text-sm font-bold text-slate-500 mb-2">{l.answers}:</h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                      {exercises.map((ex, i) => (
                        <span key={i}><strong>{i + 1}.</strong> {ex.answer}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        @media print {
          body > *:not(#root) { display: none !important; }
          nav, .print\\:hidden { display: none !important; }
          .print\\:pt-0 { padding-top: 0 !important; }
          .print\\:px-0 { padding-left: 0 !important; padding-right: 0 !important; }
        }
      `}</style>
    </div>
  );
}
