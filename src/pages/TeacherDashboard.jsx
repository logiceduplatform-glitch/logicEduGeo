// Firestore: teacher may read/write users/{uid}/teacherQuizzes/{quizId} and delete classroomMembers for their own classrooms; adjust security rules to match.
import React, { useState, useContext, useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import { AuthContext } from "../auth/AuthContext";
import { db, auth } from "../auth/firebase";
import { collection, doc, setDoc, getDoc, getDocs, deleteDoc, query, where, orderBy, addDoc } from "firebase/firestore";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";

const STORAGE_KEY = "geo:teacherQuizzes";
const DIFFICULTY_OPTIONS = ["easy", "medium", "hard"];

function getLocalQuizzes() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}
function saveLocalQuizzes(q) { localStorage.setItem(STORAGE_KEY, JSON.stringify(q)); }

function getQuestionType(q) {
  if (q.type === "true_false" || q.type === "fill_in" || q.type === "multiple_choice") return q.type;
  return "multiple_choice";
}

function isAnswerCorrect(q, selected) {
  const t = getQuestionType(q);
  if (t === "fill_in") {
    return (selected || "").trim().toLowerCase() === String(q.correct || "").trim().toLowerCase();
  }
  return selected === q.correct;
}

function isDeadlinePast(deadline) {
  if (!deadline) return false;
  const d = String(deadline).length === 10 ? new Date(String(deadline) + "T23:59:59.999") : new Date(deadline);
  return d < new Date();
}

function validateQuestionForSave(q) {
  if (!q || !q.question || !q.question.trim()) return false;
  const t = getQuestionType(q);
  if (t === "fill_in") return !!(q.correct && String(q.correct).trim());
  const opts = (q.options || []).filter(Boolean);
  if (t === "true_false") return opts.length >= 2 && opts.includes(q.correct);
  if (t === "multiple_choice") return opts.length >= 2 && opts.length <= 6 && opts.includes(q.correct);
  return false;
}

function migrateQuestion(q) {
  const t = getQuestionType(q);
  let options = Array.isArray(q.options) ? [...q.options] : ["", "", "", ""];
  if (t === "true_false" && options.filter(Boolean).length < 2) {
    options = ["Σωστό", "Λάθος"];
  }
  if (t === "multiple_choice" && options.length < 2) {
    while (options.length < 4) options.push("");
  }
  if (t === "fill_in") options = [];
  return {
    ...q,
    type: t,
    options,
    imageUrl: q.imageUrl || "",
  };
}

const QUIZ_TEMPLATES = {
  math: [
    { titleEl: "Μαθηματικά — Δημοτικό (Πρόσθεση/Αφαίρεση)", titleEn: "Math — Elementary (Add/Subtract)", subjectEl: "Μαθηματικά", subjectEn: "Mathematics", gradeLevel: "elem", questions: [
      { type: "multiple_choice", question: "5 + 3 = ?", options: ["6", "7", "8", "9"], correct: "8", difficulty: "easy" },
      { type: "multiple_choice", question: "10 − 4 = ?", options: ["4", "5", "6", "7"], correct: "6", difficulty: "easy" },
      { type: "true_false", question: "Το 2 + 2 ισούται με 5", options: ["Σωστό", "Λάθος"], correct: "Λάθος", difficulty: "easy" },
      { type: "fill_in", question: "3 × 2 =", correct: "6", difficulty: "medium" },
      { type: "multiple_choice", question: "Μισό από 12:", options: ["4", "5", "6", "7"], correct: "6", difficulty: "medium" },
    ]},
    { titleEl: "Μαθηματικά — Γυμνάσιο (Κλάσματα/Ποσοστά)", titleEn: "Math — Middle (Fractions & %)", subjectEl: "Μαθηματικά", subjectEn: "Mathematics", gradeLevel: "middle", questions: [
      { type: "multiple_choice", question: "1/2 + 1/4 =", options: ["1/2", "2/4", "3/4", "1"], correct: "3/4", difficulty: "medium" },
      { type: "true_false", question: "0,5 = 1/2", options: ["Σωστό", "Λάθος"], correct: "Σωστό", difficulty: "easy" },
      { type: "fill_in", question: "Το 25% του 200 είναι", correct: "50", difficulty: "medium" },
      { type: "multiple_choice", question: "3² =", options: ["6", "9", "12", "27"], correct: "9", difficulty: "easy" },
      { type: "multiple_choice", question: "Η τετραγωνική ρίζα του 16 είναι", options: ["2", "4", "6", "8"], correct: "4", difficulty: "hard" },
    ]},
    { titleEl: "Μαθηματικά — Λύκειο (Άλγεβρα)", titleEn: "Math — High (Algebra)", subjectEl: "Μαθηματικά", subjectEn: "Mathematics", gradeLevel: "high", questions: [
      { type: "multiple_choice", question: "x + 2 = 5 ⇒ x =", options: ["1", "2", "3", "7"], correct: "3", difficulty: "medium" },
      { type: "fill_in", question: "2x = 10 ⇒ x =", correct: "5", difficulty: "medium" },
      { type: "true_false", question: "Η παράσταση (a+b)² = a² + b² είναι πάντα αληθής", options: ["Σωστό", "Λάθος"], correct: "Λάθος", difficulty: "hard" },
      { type: "multiple_choice", question: "Ρίζα(49) =", options: ["6", "7", "8", "9"], correct: "7", difficulty: "easy" },
      { type: "multiple_choice", question: "Κλίση y = 2x + 1 στο (0) είναι", options: ["0", "1", "2", "3"], correct: "1", difficulty: "hard" },
    ]},
  ],
  geography: [
    { titleEl: "Γεωγραφία — Ελλάδα (Ποτάμια/Λίμνες)", titleEn: "Geography — Greece (Rivers & Lakes)", subjectEl: "Γεωγραφία", subjectEn: "Geography", gradeLevel: "elem", questions: [
      { type: "multiple_choice", question: "Η μεγαλύτερη πόλη της Ελλάδας είναι", options: ["Θεσσαλονίκη", "Αθήνα", "Πάτρα", "Ηράκλειο"], correct: "Αθήνα", difficulty: "easy" },
      { type: "true_false", question: "Η Λευκάδα λέγεται νησί", options: ["Σωστό", "Λάθος"], correct: "Σωστό", difficulty: "easy" },
      { type: "fill_in", question: "Η πρωτεύουσα της Κρήτης (πόλη) είναι", correct: "Ηράκλειο", difficulty: "medium" },
      { type: "multiple_choice", question: "Ποιο ακρωνύμιο για την Ε.Ε. χρησιμοποιούμε", options: ["UN", "EU", "USA", "NATO"], correct: "EU", difficulty: "medium" },
      { type: "multiple_choice", question: "Η Θεσσαλονίκη βρίσκεται", options: ["Κρήτη", "Βόρεια Ελλάδα", "Πελοπόννησο", "Ήπειρος"], correct: "Βόρεια Ελλάδα", difficulty: "easy" },
    ]},
    { titleEl: "Γεωγραφία — Ήπειροι", titleEn: "Geography — Continents", subjectEl: "Γεωγραφία", subjectEn: "Geography", gradeLevel: "middle", questions: [
      { type: "multiple_choice", question: "Πόσες είναι οι παραδοσιακές ήπειροι;", options: ["5", "6", "7", "8"], correct: "7", difficulty: "medium" },
      { type: "true_false", question: "Η Ανταρκτική είναι κατοικημένη χώρα", options: ["Σωστό", "Λάθος"], correct: "Λάθος", difficulty: "easy" },
      { type: "fill_in", question: "Η μικρότερη ήπειρος (όνομα):", correct: "Ωκεανία", difficulty: "hard" },
      { type: "multiple_choice", question: "Η Λατινική Αμερική κυρίως μιλάει", options: ["Γερμανικά", "Ρομανκικές/Ισπανικά-Πορτογαλικά", "Ρωσικά", "Αγγλικά"], correct: "Ρομανκικές/Ισπανικά-Πορτογαλικά", difficulty: "medium" },
      { type: "multiple_choice", question: "Η Ιαπωνία στον", options: ["Ατλαντικό", "Ινδικό", "Ειρηνικό", "Αρκτικό"], correct: "Ειρηνικό", difficulty: "easy" },
    ]},
  ],
  history: [
    { titleEl: "Ιστορία — Αρχαία Ελλάδα", titleEn: "History — Ancient Greece", subjectEl: "Ιστορία", subjectEn: "History", gradeLevel: "elem", questions: [
      { type: "multiple_choice", question: "Η αρχαία Ολυμπιάδα τελούνταν", options: ["Ρώμη", "Ολυμπία", "Αθήνα", "Σπάρτη"], correct: "Ολυμπία", difficulty: "medium" },
      { type: "true_false", question: "Ο Ηρόδοτος θεωρείται «πατέρας» της Ιστορίας", options: ["Σωστό", "Λάθος"], correct: "Σωστό", difficulty: "medium" },
      { type: "fill_in", question: "Πολιτικό σύστημα Αθήνων: … (μία λέξη, δημο-)", correct: "δημοκρατία", difficulty: "hard" },
      { type: "multiple_choice", question: "Φιλόσοφος της αρχαίας Αθήνας:", options: ["Καίσαρας", "Πλάτων", "Κολόμβος", "Ναπολέων"], correct: "Πλάτων", difficulty: "medium" },
      { type: "multiple_choice", question: "Η Θερμοπυλές συνδέονται με", options: ["Θεμιστοκλή", "Λεωνίδα", "Περικλή", "Φίλιππο"], correct: "Λεωνίδα", difficulty: "hard" },
    ]},
    { titleEl: "Ιστορία — Νεότερα χρόνια", titleEn: "History — Modern", subjectEl: "Ιστορία", subjectEn: "History", gradeLevel: "high", questions: [
      { type: "multiple_choice", question: "Η Βιομηχανική Επανάσταση ξεκινά κυρίως", options: ["Ισπανία", "Ηνωμένο Βασίλειο", "Ιαπωνία", "Ρωσία"], correct: "Ηνωμένο Βασίλειο", difficulty: "medium" },
      { type: "true_false", question: "Το 1945 τέλειωσε ο Β' Π.Π. στην Ευρώπη", options: ["Σωστό", "Λάθος"], correct: "Σωστό", difficulty: "easy" },
      { type: "fill_in", question: "Χρονολογία έναρξης Α' Π.Π. (έτος, τέσσερα ψηφία):", correct: "1914", difficulty: "hard" },
      { type: "multiple_choice", question: "Η Γαλλική Επανάσταση (έτος):", options: ["1689", "1789", "1889", "1989"], correct: "1789", difficulty: "medium" },
      { type: "multiple_choice", question: "Ψυχρός πόλεμος:", options: ["ΗΠΑ-Σοβ. Ένωση", "ΗΠΑ-Κίνα", "ΗΠΑ-Βρετανία", "ΕΕ-Ρωσία"], correct: "ΗΠΑ-Σοβ. Ένωση", difficulty: "hard" },
    ]},
  ],
  language: [
    { titleEl: "Γλώσσα — Γραμματική", titleEn: "Language — Grammar", subjectEl: "Γλώσσα", subjectEn: "Language", gradeLevel: "elem", questions: [
      { type: "multiple_choice", question: "Ποιο είναι ουσιαστικό;", options: ["τρέχω", "σπίτι", "γρήγορα", "επίσης"], correct: "σπίτι", difficulty: "easy" },
      { type: "true_false", question: "Η «καλός» πάει στο «καλοί» (πλυθ/κος)", options: ["Σωστό", "Λάθος"], correct: "Λάθος", difficulty: "medium" },
      { type: "fill_in", question: "Καταλήξη 3ο πρόσωπο ενεστ. «αυτός … (γράφω)»", correct: "γράφει", difficulty: "medium" },
      { type: "multiple_choice", question: "Σωστό «ένα, δύο, …» (γράμμα)", options: ["τρία", "τρήα", "τρια", "τραία"], correct: "τρία", difficulty: "easy" },
      { type: "multiple_choice", question: "Αντώνυμα: μέρα -", options: ["νύχτα", "εβδομάδα", "μήνας", "μήνες"], correct: "νύχτα", difficulty: "medium" },
    ]},
    { titleEl: "Γλώσσα — Κατανόηση", titleEn: "Language — Comprehension", subjectEl: "Γλώσσα", subjectEn: "Language", gradeLevel: "middle", questions: [
      { type: "multiple_choice", question: "«Κείμενο» σημαίνει:", options: ["Μόνο ποίημα", "Γραπτή ενότητα λόγου", "Μόνο άρθρο", "Φωτογραφία"], correct: "Γραπτή ενότητα λόγου", difficulty: "easy" },
      { type: "true_false", question: "Η παράγραφος έχει μία βασική ιδέα", options: ["Σωστό", "Λάθος"], correct: "Σωστό", difficulty: "easy" },
      { type: "fill_in", question: "Λέξη που σημαίνει 'ταξίδι' (3 γράμμα, αρσ.):", correct: "ταξίδι", difficulty: "hard" },
      { type: "multiple_choice", question: "Συνώνυμα: μεγάλος -", options: ["μικρός", "τεράστιος", "άδειος", "κενός"], correct: "τεράστιος", difficulty: "medium" },
      { type: "multiple_choice", question: "Σωστά εισαγωγικά στα « … » (ελληνικά):", options: ["«»", "“”", "''", ";;"], correct: "«»", difficulty: "medium" },
    ]},
  ],
};

function withQuestionIds(questions) {
  const base = Date.now();
  return questions.map((q, i) => {
    const t = q.type || "multiple_choice";
    const fill = t === "fill_in";
    return {
      ...q,
      type: t,
      id: "q_" + base + "_" + i + "_" + Math.random().toString(36).slice(2, 6),
      explanation: q.explanation || "",
      options: fill ? [] : (t === "true_false" ? (q.options && q.options.filter(Boolean).length >= 2 ? q.options : ["Σωστό", "Λάθος"]) : (q.options || [])),
    };
  });
}

function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function emptyQuestion() {
  return {
    id: "q_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
    type: "multiple_choice",
    question: "",
    options: ["", "", "", ""],
    correct: "",
    difficulty: "medium",
    explanation: "",
    imageUrl: "",
  };
}

const T = {
  el: {
    title: "Πίνακας Δασκάλου",
    subtitle: "Δημιούργησε quiz και μοίρασέ τα στους μαθητές σου",
    back: "Πίσω",
    tabQuizzes: "Τα Quiz μου",
    tabClassroom: "Η Τάξη μου",
    tabResources: "Πόροι",
    createNew: "Νέο Quiz",
    noQuizzes: "Δεν έχεις δημιουργήσει quiz ακόμα",
    quizTitle: "Τίτλος quiz",
    subject: "Μάθημα (π.χ. Μαθηματικά)",
    gradeLevel: "Βαθμίδα",
    question: "Ερώτηση",
    options: "Επιλογές",
    correct: "Σωστή απάντηση",
    difficulty: "Δυσκολία",
    explanation: "Εξήγηση (προαιρετικά)",
    addQuestion: "Προσθήκη ερώτησης",
    removeQuestion: "Αφαίρεση",
    save: "Αποθήκευση",
    saved: "Αποθηκεύτηκε!",
    cancel: "Ακύρωση",
    edit: "Επεξεργασία",
    delete: "Διαγραφή",
    play: "Δοκιμή",
    questions: "ερωτήσεις",
    option: "Επιλογή",
    easy: "Εύκολο",
    medium: "Μέτριο",
    hard: "Δύσκολο",
    confirmDelete: "Σίγουρα θέλεις να διαγράψεις αυτό το quiz;",
    titleRequired: "Ο τίτλος είναι υποχρεωτικός",
    minQuestions: "Χρειάζονται τουλάχιστον 2 ερωτήσεις",
    generateCode: "Δημιουργία κωδικού τάξης",
    codeGenerated: "Ο κωδικός δημιουργήθηκε!",
    codeCopied: "Αντιγράφηκε!",
    codeUnavailableOffline: "Η δημιουργία κωδικού τάξης χρειάζεται σύνδεση λογαριασμού.",
    codeGenerationFailed: "Αποτυχία δημιουργίας κωδικού. Δοκίμασε ξανά.",
    shareHint: "Μοίρασε αυτόν τον κωδικό στους μαθητές σου",
    classroomCode: "Κωδικός τάξης",
    noCodesYet: "Δεν έχεις δημιουργήσει ακόμα κωδικούς τάξης",
    timesPlayed: "φορές παιχτ.",
    resourcesTitle: "Οδηγός χρήσης",
    resourcesDesc: "Βήμα προς βήμα: πώς να αξιοποιήσεις όλα τα εργαλεία σου.",
    elem: "Δημοτικό",
    middle: "Γυμνάσιο",
    high: "Λύκειο",
    all: "Όλες",
    finishScore: "Σκορ",
    playAgain: "Ξανά",
    backToEditor: "Πίσω στον editor",
    announcements: "Ανακοινώσεις",
    newAnnouncement: "Νέα ανακοίνωση",
    announcementPlaceholder: "Γράψε μια ανακοίνωση για τους μαθητές σου...",
    postAnnouncement: "Δημοσίευση",
    noAnnouncements: "Δεν υπάρχουν ανακοινώσεις ακόμα",
    announcementPosted: "Η ανακοίνωση δημοσιεύτηκε!",
    deleteAnnouncement: "Διαγραφή",
    confirmDeleteAnnouncement: "Σίγουρα θέλεις να διαγράψεις αυτή την ανακοίνωση;",
    results: "Αποτελέσματα μαθητών",
    noResults: "Δεν υπάρχουν αποτελέσματα ακόμα",
    studentName: "Μαθητής",
    scoreLabel: "Σκορ",
    dateLabel: "Ημερομηνία",
    selectQuiz: "Επέλεξε quiz",
    allQuizzes: "Όλα τα quiz",
    viewDetails: "Λεπτομέρειες",
    hideDetails: "Απόκρυψη",
    correctAnswer: "Σωστή",
    studentAnswer: "Απ. μαθητή",
    questionLabel: "Ερώτηση",
    shareCode: "Κοινοποίηση",
    shareLinkCopied: "Ο σύνδεσμος αντιγράφηκε!",
    shareMessage: "Μπες εδώ για να κάνεις το quiz «TITLE»:",
    myClassrooms: "Οι τάξεις μου",
    createClassroom: "Δημιουργία τάξης",
    classroomName: "Όνομα τάξης",
    classroomNamePlaceholder: "π.χ. Α' Δημοτικού - Τμήμα Β",
    classroomCreated: "Η τάξη δημιουργήθηκε!",
    noClassrooms: "Δεν έχεις δημιουργήσει ακόμα κάποια τάξη",
    noClassroomsHint: "Δημιούργησε μια τάξη για να εγγράψεις μαθητές",
    members: "Μαθητές",
    noMembers: "Κανένας μαθητής δεν έχει εγγραφεί ακόμα",
    assignQuiz: "Ανάθεση σε τάξη",
    assignedToClassroom: "Ανατέθηκε στην τάξη!",
    deleteClassroom: "Διαγραφή τάξης",
    confirmDeleteClassroom: "Σίγουρα θέλεις να διαγράψεις αυτή την τάξη;",
    shareClassroom: "Κοινοποίηση τάξης",
    shareClassroomMsg: "Μπες στην τάξη «NAME» και κάνε εγγραφή:",
    enrolledOn: "Εγγράφηκε",
    quickCodes: "Γρήγοροι κωδικοί quiz",
    quickCodesHint: "(μιας χρήσης, τύπου Kahoot)",
    tabAnalytics: "Στατιστικά",
    totalStudents: "Μαθητές",
    totalQuizzesStat: "Quiz",
    totalSubmissions: "Υποβολές",
    averageScorePct: "Μέσος όρος %",
    analyticsSummary: "Σύνοψη τάξης",
    perQuizBreakdown: "Ανά quiz",
    quizNameCol: "Quiz",
    submissionsCol: "Υποβολές",
    avgScoreCol: "Μ.ό. %",
    bestScoreCol: "Καλύτερο %",
    worstScoreCol: "Χειρότερο %",
    hardestQuestions: "Δυσκολότερες ερωτήσεις",
    selectQuizAnalytics: "Επίλεξε quiz",
    leaderboard: "Κατάταξη (Top 10)",
    rank: "Θέση",
    studentAvgScore: "Μέσος όρος %",
    scoreDistribution: "Κατανομή βαθμολογίας",
    dist0_20: "0–20%",
    dist21_40: "21–40%",
    dist41_60: "41–60%",
    dist61_80: "61–80%",
    dist81_100: "81–100%",
    noAnalyticsData: "Δεν υπάρχουν ακόμα δεδομένα.",
    successRate: "Επιτυχία",
    exportCSV: "Εξαγωγή CSV",
    columnPercentage: "Ποσοστό %",
    columnTotal: "Σύνολο",
    questionType: "Τύπος ερώτησης",
    typeMultiple: "Πολλαπλής επιλογής",
    typeTrueFalse: "Σωστό / Λάθος",
    typeFillIn: "Συμπλήρωση",
    addOption: "Προσθήκη επιλογής",
    removeOptionOpt: "Αφαίρεση επιλογής",
    imageUrl: "Εικόνα (URL)",
    imageUrlHint: "Προαιρετική εικόνα πάνω από το κείμενο",
    fillInCorrectHint: "Αναμενόμενη απάντηση (χωρίς διάκριση πεζών-κεφαλαίων)",
    cloudSync: "Συγχρονισμός",
    cloudSynced: "Συγχρονίστηκε με το cloud!",
    cloudRestored: "Ανακτήθηκαν quiz από το cloud.",
    cloneQuiz: "Αντιγραφή",
    deadline: "Προθεσμία",
    deadlineLabel: "Προθεσμία (ημερομηνία)",
    deadlineBadge: "Προθεσμία",
    noDeadline: "Χωρίς προθεσμία",
    expired: "Έληξε",
    removeMember: "Αφαίρεση",
    confirmRemoveMember: "Σίγουρα θέλεις να αφαιρέσεις αυτόν τον μαθητή από την τάξη;",
    templates: "Πρότυπα",
    templatesTitle: "Πρότυπα quiz",
    templatesMath: "Μαθηματικά",
    templatesGeography: "Γεωγραφία",
    templatesHistory: "Ιστορία",
    templatesLanguage: "Γλώσσα",
    useThisTemplate: "Χρήση",
    closeModal: "Κλείσιμο",
    trueLabel: "Σωστό",
    falseLabel: "Λάθος",
    submitAnswer: "Υποβολή",
    fillInPlaceholder: "Η απάντησή σου",
    copySuffix: " (αντίγραφο)",
  },
  en: {
    title: "Teacher Dashboard",
    subtitle: "Create quizzes and share them with your students",
    back: "Back",
    tabQuizzes: "My Quizzes",
    tabClassroom: "My Classroom",
    tabResources: "Resources",
    createNew: "New Quiz",
    noQuizzes: "You haven't created any quizzes yet",
    quizTitle: "Quiz title",
    subject: "Subject (e.g. Math)",
    gradeLevel: "Grade level",
    question: "Question",
    options: "Options",
    correct: "Correct answer",
    difficulty: "Difficulty",
    explanation: "Explanation (optional)",
    addQuestion: "Add question",
    removeQuestion: "Remove",
    save: "Save",
    saved: "Saved!",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    play: "Preview",
    questions: "questions",
    option: "Option",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    confirmDelete: "Are you sure you want to delete this quiz?",
    titleRequired: "Title is required",
    minQuestions: "At least 2 questions required",
    generateCode: "Generate classroom code",
    codeGenerated: "Code generated!",
    codeCopied: "Copied!",
    codeUnavailableOffline: "Generating classroom code requires a signed-in account.",
    codeGenerationFailed: "Failed to generate code. Please try again.",
    shareHint: "Share this code with your students",
    classroomCode: "Classroom code",
    noCodesYet: "No classroom codes created yet",
    timesPlayed: "times played",
    resourcesTitle: "User Guide",
    resourcesDesc: "Step-by-step: how to use all your tools.",
    elem: "Elementary",
    middle: "Middle",
    high: "High",
    all: "All",
    finishScore: "Score",
    playAgain: "Again",
    backToEditor: "Back to editor",
    announcements: "Announcements",
    newAnnouncement: "New announcement",
    announcementPlaceholder: "Write an announcement for your students...",
    postAnnouncement: "Post",
    noAnnouncements: "No announcements yet",
    announcementPosted: "Announcement posted!",
    deleteAnnouncement: "Delete",
    confirmDeleteAnnouncement: "Are you sure you want to delete this announcement?",
    results: "Student results",
    noResults: "No results yet",
    studentName: "Student",
    scoreLabel: "Score",
    dateLabel: "Date",
    selectQuiz: "Select quiz",
    allQuizzes: "All quizzes",
    viewDetails: "Details",
    hideDetails: "Hide",
    correctAnswer: "Correct",
    studentAnswer: "Student's answer",
    questionLabel: "Question",
    shareCode: "Share",
    shareLinkCopied: "Link copied!",
    shareMessage: "Join here to take the quiz «TITLE»:",
    myClassrooms: "My classrooms",
    createClassroom: "Create classroom",
    classroomName: "Classroom name",
    classroomNamePlaceholder: "e.g. 1st Grade - Section B",
    classroomCreated: "Classroom created!",
    noClassrooms: "You haven't created any classrooms yet",
    noClassroomsHint: "Create a classroom to enroll students",
    members: "Students",
    noMembers: "No students enrolled yet",
    assignQuiz: "Assign to classroom",
    assignedToClassroom: "Assigned to classroom!",
    deleteClassroom: "Delete classroom",
    confirmDeleteClassroom: "Are you sure you want to delete this classroom?",
    shareClassroom: "Share classroom",
    shareClassroomMsg: "Join classroom «NAME» and enroll:",
    enrolledOn: "Enrolled",
    quickCodes: "Quick quiz codes",
    quickCodesHint: "(one-time, Kahoot-style)",
    tabAnalytics: "Analytics",
    totalStudents: "Students",
    totalQuizzesStat: "Quizzes",
    totalSubmissions: "Submissions",
    averageScorePct: "Average %",
    analyticsSummary: "Class summary",
    perQuizBreakdown: "By quiz",
    quizNameCol: "Quiz",
    submissionsCol: "Submissions",
    avgScoreCol: "Avg %",
    bestScoreCol: "Best %",
    worstScoreCol: "Worst %",
    hardestQuestions: "Hardest questions",
    selectQuizAnalytics: "Select a quiz",
    leaderboard: "Leaderboard (Top 10)",
    rank: "Rank",
    studentAvgScore: "Avg %",
    scoreDistribution: "Score distribution",
    dist0_20: "0–20%",
    dist21_40: "21–40%",
    dist41_60: "41–60%",
    dist61_80: "61–80%",
    dist81_100: "81–100%",
    noAnalyticsData: "No data yet.",
    successRate: "Success",
    exportCSV: "Export CSV",
    columnPercentage: "Percentage",
    columnTotal: "Total",
    questionType: "Question type",
    typeMultiple: "Multiple choice",
    typeTrueFalse: "True / False",
    typeFillIn: "Fill in",
    addOption: "Add option",
    removeOptionOpt: "Remove",
    imageUrl: "Image (URL)",
    imageUrlHint: "Optional image above the text",
    fillInCorrectHint: "Expected answer (case-insensitive)",
    cloudSync: "Sync",
    cloudSynced: "Synced to the cloud!",
    cloudRestored: "Quizzes restored from the cloud.",
    cloneQuiz: "Clone",
    deadline: "Deadline",
    deadlineLabel: "Deadline (date)",
    deadlineBadge: "Due",
    noDeadline: "No deadline",
    expired: "Expired",
    removeMember: "Remove",
    confirmRemoveMember: "Remove this student from the classroom?",
    templates: "Templates",
    templatesTitle: "Quiz templates",
    templatesMath: "Math",
    templatesGeography: "Geography",
    templatesHistory: "History",
    templatesLanguage: "Language",
    useThisTemplate: "Use",
    closeModal: "Close",
    trueLabel: "True",
    falseLabel: "False",
    submitAnswer: "Submit",
    fillInPlaceholder: "Your answer",
    copySuffix: " (copy)",
  },
};

function QuizPlayer({ quiz, lang, onBack }) {
  const l = T[lang] || T.en;
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [finished, setFinished] = useState(false);
  const [fillText, setFillText] = useState("");

  const q = quiz.questions[idx];
  const qType = q ? getQuestionType(q) : "multiple_choice";

  useEffect(() => {
    setFillText("");
  }, [idx, quiz?.id]);

  if (!q && !finished) return null;

  const handleAnswer = (opt) => {
    if (feedback || !q) return;
    const isCorrect = isAnswerCorrect(q, opt);
    setFeedback({ correct: isCorrect, selected: opt });
    setScore((s) => (isCorrect ? s + 1 : s));
    setTimeout(() => {
      setFeedback(null);
      if (idx + 1 >= quiz.questions.length) setFinished(true);
      else setIdx((i) => i + 1);
    }, 1500);
  };

  if (finished) {
    const pct = Math.round((score / quiz.questions.length) * 100);
    return (
      <div className="text-center py-12">
        <div className="text-7xl mb-4">{pct >= 80 ? "🏆" : pct >= 50 ? "👏" : "💪"}</div>
        <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">{l.finishScore}: {score}/{quiz.questions.length}</h2>
        <p className="text-lg font-bold text-purple-600 dark:text-purple-400 mb-6">{pct}%</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => { setIdx(0); setScore(0); setFinished(false); setFeedback(null); setFillText(""); }} className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold">{l.playAgain}</button>
          <button onClick={onBack} className="px-5 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold">{l.backToEditor}</button>
        </div>
      </div>
    );
  }

  const optionsForDisplay = (() => {
    if (qType === "fill_in") return [];
    if (qType === "true_false") {
      const o = (q.options || []).filter(Boolean);
      if (o.length >= 2) return o.slice(0, 2);
      return [l.trueLabel, l.falseLabel];
    }
    return (q.options || []).filter(Boolean);
  })();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="text-sm text-slate-500 dark:text-slate-400 hover:text-purple-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          {l.back}
        </button>
        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-700 px-3 py-1.5 rounded-full border border-slate-100 dark:border-slate-600">{idx + 1} / {quiz.questions.length}</span>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
        {q.imageUrl && q.imageUrl.trim() && (
          <div className="mb-4 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-700">
            <img src={q.imageUrl} alt="" className="w-full max-h-56 object-contain" />
          </div>
        )}
        <p className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-5">{q.question}</p>
        {qType === "fill_in" ? (
          <div className="space-y-3">
            <input
              type="text"
              value={fillText}
              onChange={(e) => setFillText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !feedback && fillText.trim() && handleAnswer(fillText)}
              disabled={!!feedback}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700 outline-none focus:border-purple-400"
              placeholder={l.fillInPlaceholder}
            />
            <button
              type="button"
              onClick={() => handleAnswer(fillText)}
              disabled={!!feedback || !fillText.trim()}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold disabled:opacity-40"
            >
              {l.submitAnswer}
            </button>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {optionsForDisplay.map((opt, oi) => {
              let cls = "px-4 py-3.5 rounded-xl border-2 text-left text-sm font-medium transition-all ";
              if (feedback) {
                if (opt === q.correct) cls += "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-400 text-emerald-800 dark:text-emerald-200";
                else if (opt === feedback.selected) cls += "bg-red-50 dark:bg-red-900/30 border-red-400 text-red-800 dark:text-red-200";
                else cls += "bg-slate-50 dark:bg-slate-700/30 border-slate-100 dark:border-slate-700 opacity-50 text-slate-400";
              } else {
                cls += "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-500 cursor-pointer text-slate-700 dark:text-slate-200";
              }
              return <button key={oi} type="button" onClick={() => handleAnswer(opt)} disabled={!!feedback} className={cls}><span className="font-bold mr-2 text-slate-400">{String.fromCharCode(65 + oi)}.</span>{opt}</button>;
            })}
          </div>
        )}
        {feedback && qType === "fill_in" && (
          <p className={`mt-3 text-sm font-semibold ${feedback.correct ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
            {feedback.correct ? "✅" : "❌"} {!feedback.correct && <span className="block sm:inline mt-1 sm:mt-0">{l.correctAnswer}: {q.correct}</span>}
          </p>
        )}
        {feedback && q.explanation && (
          <div className="mt-4 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-sm text-blue-700 dark:text-blue-300">💡 {q.explanation}</div>
        )}
      </div>
    </div>
  );
}

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const { lang } = useContext(LanguageContext);
  const { user } = useContext(AuthContext);
  const l = T[lang] || T.en;
  const isEl = lang === "el";

  const [tab, setTab] = useState("quizzes");
  const [quizzes, setQuizzes] = useState(() => getLocalQuizzes());
  const [editing, setEditing] = useState(null);
  const [playing, setPlaying] = useState(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [actionNotice, setActionNotice] = useState(null);
  const [codes, setCodes] = useState([]);
  const [copiedCode, setCopiedCode] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncementText, setNewAnnouncementText] = useState("");
  const [postingAnnouncement, setPostingAnnouncement] = useState(false);
  const [results, setResults] = useState([]);
  const [resultsFilter, setResultsFilter] = useState("all");
  const [expandedResult, setExpandedResult] = useState(null);
  const [classrooms, setClassrooms] = useState([]);
  const [newClassroomName, setNewClassroomName] = useState("");
  const [creatingClassroom, setCreatingClassroom] = useState(false);
  const [classroomMembers, setClassroomMembers] = useState({});
  const [expandedClassroom, setExpandedClassroom] = useState(null);
  const [assignPopup, setAssignPopup] = useState(null);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [analyticsQuizTitle, setAnalyticsQuizTitle] = useState("");
  const [cloudSyncing, setCloudSyncing] = useState(false);
  const [sharePopup, setSharePopup] = useState(null);

  useEffect(() => {
    if (!db || !user) return;
    const loadAll = async () => {
      try {
        const codeQ = query(collection(db, "classroomQuizzes"), where("teacherUid", "==", user.uid));
        const codeSnap = await getDocs(codeQ);
        const loadedCodes = [];
        codeSnap.forEach((d) => loadedCodes.push({ id: d.id, ...d.data() }));
        setCodes(loadedCodes);

        const annQ = query(collection(db, "classroomAnnouncements"), where("teacherUid", "==", user.uid), orderBy("createdAt", "desc"));
        const annSnap = await getDocs(annQ);
        const loadedAnn = [];
        annSnap.forEach((d) => loadedAnn.push({ id: d.id, ...d.data() }));
        setAnnouncements(loadedAnn);

        if (loadedCodes.length > 0) {
          const codelist = loadedCodes.map((c) => c.code);
          const resQ = query(collection(db, "classroomResults"), where("classroomCode", "in", codelist.slice(0, 30)));
          const resSnap = await getDocs(resQ);
          const loadedRes = [];
          resSnap.forEach((d) => loadedRes.push({ id: d.id, ...d.data() }));
          loadedRes.sort((a, b) => (b.completedAt || "").localeCompare(a.completedAt || ""));
          setResults(loadedRes);
        }

        // Load classrooms
        const clsQ = query(collection(db, "classrooms"), where("teacherUid", "==", user.uid));
        const clsSnap = await getDocs(clsQ);
        const loadedCls = [];
        clsSnap.forEach((d) => loadedCls.push({ id: d.id, ...d.data() }));
        loadedCls.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
        setClassrooms(loadedCls);

        // Load members for all classrooms
        if (loadedCls.length > 0) {
          const clsCodes = loadedCls.map((c) => c.code);
          const memQ = query(collection(db, "classroomMembers"), where("classroomCode", "in", clsCodes.slice(0, 30)));
          const memSnap = await getDocs(memQ);
          const memMap = {};
          memSnap.forEach((d) => {
            const data = { id: d.id, ...d.data() };
            if (!memMap[data.classroomCode]) memMap[data.classroomCode] = [];
            memMap[data.classroomCode].push(data);
          });
          Object.values(memMap).forEach((arr) => arr.sort((a, b) => (a.joinedAt || "").localeCompare(b.joinedAt || "")));
          setClassroomMembers(memMap);
        }
      } catch (e) {
        if (import.meta.env.DEV) console.warn("[TeacherDashboard] Failed to load data:", e);
      }
    };
    loadAll();
  }, [user]);

  useEffect(() => {
    if (!db || !user) return;
    const local = getLocalQuizzes();
    if (local.length > 0) return;
    (async () => {
      try {
        const snap = await getDocs(collection(db, "users", user.uid, "teacherQuizzes"));
        const list = [];
        snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
        if (list.length > 0) {
          setQuizzes(list);
          saveLocalQuizzes(list);
          setActionNotice({ type: "success", text: l.cloudRestored });
          setTimeout(() => setActionNotice(null), 4000);
        }
      } catch (e) {
        if (import.meta.env.DEV) console.warn("[TeacherDashboard] Cloud restore failed:", e);
      }
    })();
  }, [db, user]);

  const handleNew = () => {
    setEditing({
      id: "tq_" + Date.now(),
      title: "",
      subject: "",
      gradeLevel: "",
      deadline: "",
      questions: [emptyQuestion(), emptyQuestion()],
      createdAt: new Date().toISOString(),
    });
    setError(null);
  };

  const handleEdit = (quiz) => {
    setEditing({
      ...quiz,
      deadline: quiz.deadline || "",
      questions: (quiz.questions || []).map((q) => {
        const m = migrateQuestion({ ...q, options: q.options ? [...q.options] : [] });
        return m;
      }),
    });
    setError(null);
  };

  const handleDelete = (id) => {
    if (!confirm(l.confirmDelete)) return;
    const updated = quizzes.filter((q) => q.id !== id);
    setQuizzes(updated);
    saveLocalQuizzes(updated);
    if (db && user) {
      deleteDoc(doc(db, "users", user.uid, "teacherQuizzes", id)).catch(() => {});
    }
  };

  const handleSave = async () => {
    if (!editing.title.trim()) { setError(l.titleRequired); return; }
    const validQs = editing.questions.filter(validateQuestionForSave);
    if (validQs.length < 2) { setError(l.minQuestions); return; }
    const toSave = {
      ...editing,
      questions: validQs.map((q) => migrateQuestion({ ...q })),
      updatedAt: new Date().toISOString(),
    };
    const found = quizzes.findIndex((q) => q.id === toSave.id);
    let updated;
    if (found >= 0) { updated = [...quizzes]; updated[found] = toSave; }
    else { updated = [...quizzes, toSave]; }
    setQuizzes(updated);
    saveLocalQuizzes(updated);
    if (db && user) {
      try {
        await setDoc(doc(db, "users", user.uid, "teacherQuizzes", toSave.id), toSave);
      } catch (e) {
        if (import.meta.env.DEV) console.warn("[TeacherDashboard] Cloud save failed:", e);
      }
    }
    setEditing(null);
    setError(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSyncFromCloud = async () => {
    if (!db || !user) {
      setActionNotice({ type: "error", text: l.codeUnavailableOffline });
      setTimeout(() => setActionNotice(null), 3000);
      return;
    }
    setCloudSyncing(true);
    try {
      const snap = await getDocs(collection(db, "users", user.uid, "teacherQuizzes"));
      const fromCloud = [];
      snap.forEach((d) => fromCloud.push({ id: d.id, ...d.data() }));
      const byId = new Map(quizzes.map((q) => [q.id, { ...q }]));
      fromCloud.forEach((q) => {
        const ex = byId.get(q.id);
        if (!ex) byId.set(q.id, q);
        else {
          const t1 = new Date(ex.updatedAt || ex.createdAt || 0).getTime();
          const t2 = new Date(q.updatedAt || q.createdAt || 0).getTime();
          byId.set(q.id, t2 >= t1 ? { ...q } : ex);
        }
      });
      const merged = Array.from(byId.values());
      setQuizzes(merged);
      saveLocalQuizzes(merged);
      setActionNotice({ type: "success", text: l.cloudSynced });
      setTimeout(() => setActionNotice(null), 3000);
    } catch (e) {
      if (import.meta.env.DEV) console.warn("[TeacherDashboard] Sync failed:", e);
    } finally {
      setCloudSyncing(false);
    }
  };

  const handleCloneQuiz = (quiz) => {
    const newId = "tq_" + Date.now();
    const cloned = {
      ...quiz,
      id: newId,
      title: (quiz.title || "Quiz") + l.copySuffix,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      questions: (quiz.questions || []).map((q) =>
        migrateQuestion({ ...q, id: "q_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7), options: q.options ? [...q.options] : [] })
      ),
    };
    setQuizzes((prev) => {
      const next = [...prev, cloned];
      saveLocalQuizzes(next);
      return next;
    });
    if (db && user) {
      setDoc(doc(db, "users", user.uid, "teacherQuizzes", newId), cloned).catch(() => {});
    }
  };

  const applyTemplate = (tpl) => {
    setEditing({
      id: "tq_" + Date.now(),
      title: isEl ? tpl.titleEl : tpl.titleEn,
      subject: isEl ? tpl.subjectEl : tpl.subjectEn,
      gradeLevel: tpl.gradeLevel,
      deadline: "",
      questions: withQuestionIds(tpl.questions),
      createdAt: new Date().toISOString(),
    });
    setTemplatesOpen(false);
    setTab("quizzes");
    setError(null);
  };

  const handleRemoveClassroomMember = async (memberDocId, classroomCode) => {
    if (!db || !confirm(l.confirmRemoveMember)) return;
    try {
      await deleteDoc(doc(db, "classroomMembers", memberDocId));
      setClassroomMembers((prev) => {
        const next = { ...prev };
        if (next[classroomCode]) {
          next[classroomCode] = next[classroomCode].filter((m) => m.id !== memberDocId);
        }
        return next;
      });
    } catch (e) {
      if (import.meta.env.DEV) console.warn("[TeacherDashboard] Remove member failed:", e);
    }
  };

  const exportResultsToCsv = () => {
    const rows = resultsFilter === "all" ? results : results.filter((r) => r.classroomCode === resultsFilter);
    const header = [l.studentName, l.quizTitle, l.scoreLabel, l.columnTotal, l.columnPercentage, l.dateLabel];
    const lines = [header.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")];
    rows.forEach((r) => {
      const pct = r.total > 0 ? Math.round((r.score / r.total) * 100) : 0;
      const d = r.completedAt || "";
      const esc = (s) => {
        const t = String(s ?? "");
        return `"${t.replace(/"/g, '""')}"`;
      };
      lines.push([esc(r.studentName || ""), esc(r.quizTitle || ""), r.score, r.total, `${pct}%`, esc(d)].join(","));
    });
    const blob = new Blob(["\uFEFF" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "classroom-results-" + new Date().toISOString().slice(0, 10) + ".csv";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const handleGenerateCode = async (quiz) => {
    if (!db || !user) {
      setActionNotice({ type: "error", text: l.codeUnavailableOffline });
      setTimeout(() => setActionNotice(null), 3000);
      return;
    }
    const code = generateCode();
    try {
      await setDoc(doc(db, "classroomQuizzes", code), {
        code,
        quizId: quiz.id,
        quizTitle: quiz.title,
        subject: quiz.subject || "",
        gradeLevel: quiz.gradeLevel || "",
        questions: quiz.questions,
        teacherUid: user.uid,
        teacherName: user.displayName || "",
        createdAt: new Date().toISOString(),
        timesPlayed: 0,
        deadline: quiz.deadline || null,
      });
      setCodes((prev) => [...prev, { id: code, code, quizTitle: quiz.title, timesPlayed: 0, createdAt: new Date().toISOString(), deadline: quiz.deadline || null }]);
      setActionNotice({ type: "success", text: `${l.codeGenerated} ${code}` });
      setCopiedCode(code);
      await navigator.clipboard?.writeText(code).catch(() => {});
      setTab("classroom");
      setTimeout(() => setCopiedCode(null), 3000);
      setTimeout(() => setActionNotice(null), 3000);
    } catch (e) {
      setActionNotice({ type: "error", text: l.codeGenerationFailed });
      setTimeout(() => setActionNotice(null), 3000);
      if (import.meta.env.DEV) console.warn("[TeacherDashboard] Failed to save code:", e);
    }
  };

  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {}
  };

  const handleShare = (c) => {
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/join/${c.code}`;
    const message = l.shareMessage.replace("TITLE", c.quizTitle) + "\n" + link;
    setSharePopup({ code: c.code, title: c.quizTitle, link, message });
  };

  const copyShareText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setActionNotice({ type: "success", text: l.shareLinkCopied });
      setTimeout(() => setActionNotice(null), 2500);
    } catch {}
  };

  const handleCreateClassroom = async () => {
    if (!db || !user || !newClassroomName.trim()) return;
    setCreatingClassroom(true);
    const code = generateCode();
    try {
      const data = {
        code,
        name: newClassroomName.trim(),
        teacherUid: user.uid,
        teacherName: user.displayName || "",
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, "classrooms", code), data);
      setClassrooms((prev) => [{ id: code, ...data }, ...prev]);
      setNewClassroomName("");
      setActionNotice({ type: "success", text: l.classroomCreated });
      setTimeout(() => setActionNotice(null), 3000);
    } catch (e) {
      if (import.meta.env.DEV) console.warn("[TeacherDashboard] Failed to create classroom:", e);
    } finally {
      setCreatingClassroom(false);
    }
  };

  const handleDeleteClassroom = async (cls) => {
    if (!confirm(l.confirmDeleteClassroom)) return;
    try {
      await deleteDoc(doc(db, "classrooms", cls.code));
      setClassrooms((prev) => prev.filter((c) => c.code !== cls.code));
    } catch (e) {
      if (import.meta.env.DEV) console.warn("[TeacherDashboard] Failed to delete classroom:", e);
    }
  };

  const handleShareClassroom = (cls) => {
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/my-classroom/${cls.code}`;
    const message = l.shareClassroomMsg.replace("NAME", cls.name) + "\n" + link;
    setSharePopup({ code: cls.code, title: cls.name, link, message, isClassroom: true });
  };

  const handleAssignQuizToClassroom = async (quiz, clsCode) => {
    if (!db || !user) return;
    const code = generateCode();
    try {
      await setDoc(doc(db, "classroomQuizzes", code), {
        code,
        classroomCode: clsCode,
        quizId: quiz.id,
        quizTitle: quiz.title,
        subject: quiz.subject || "",
        gradeLevel: quiz.gradeLevel || "",
        questions: quiz.questions,
        teacherUid: user.uid,
        teacherName: user.displayName || "",
        createdAt: new Date().toISOString(),
        timesPlayed: 0,
        deadline: quiz.deadline || null,
      });
      setCodes((prev) => [...prev, { id: code, code, classroomCode: clsCode, quizTitle: quiz.title, timesPlayed: 0, createdAt: new Date().toISOString(), deadline: quiz.deadline || null }]);
      setAssignPopup(null);
      setActionNotice({ type: "success", text: l.assignedToClassroom });
      setTimeout(() => setActionNotice(null), 3000);
    } catch (e) {
      if (import.meta.env.DEV) console.warn("[TeacherDashboard] Failed to assign quiz:", e);
    }
  };

  const handlePostAnnouncement = async () => {
    if (!db || !user || !newAnnouncementText.trim()) return;
    setPostingAnnouncement(true);
    try {
      const announcementData = {
        teacherUid: user.uid,
        teacherName: user.displayName || "",
        text: newAnnouncementText.trim(),
        classroomCodes: [...codes.map((c) => c.code), ...classrooms.map((c) => c.code)].filter((v, i, a) => a.indexOf(v) === i),
        createdAt: new Date().toISOString(),
      };
      const docRef = await addDoc(collection(db, "classroomAnnouncements"), announcementData);
      setAnnouncements((prev) => [{ id: docRef.id, ...announcementData }, ...prev]);
      setNewAnnouncementText("");
      setActionNotice({ type: "success", text: l.announcementPosted });
      setTimeout(() => setActionNotice(null), 3000);
    } catch (e) {
      if (import.meta.env.DEV) console.warn("[TeacherDashboard] Failed to post announcement:", e);
    } finally {
      setPostingAnnouncement(false);
    }
  };

  const handleDeleteAnnouncement = async (annId) => {
    if (!confirm(l.confirmDeleteAnnouncement)) return;
    try {
      await deleteDoc(doc(db, "classroomAnnouncements", annId));
      setAnnouncements((prev) => prev.filter((a) => a.id !== annId));
    } catch (e) {
      if (import.meta.env.DEV) console.warn("[TeacherDashboard] Failed to delete announcement:", e);
    }
  };

  const filteredResults = resultsFilter === "all" ? results : results.filter((r) => r.classroomCode === resultsFilter);

  const analytics = useMemo(() => {
    const rlist = results;
    const studSet = new Set();
    rlist.forEach((r) => {
      const k = (r.studentUid || "") + "|" + (r.studentName || "");
      studSet.add(k);
    });
    const pcts = rlist.map((r) => (r.total > 0 ? (r.score / r.total) * 100 : 0));
    const avgAll = pcts.length ? pcts.reduce((a, b) => a + b, 0) / pcts.length : 0;
    const byQuiz = {};
    rlist.forEach((r) => {
      const t = r.quizTitle || "—";
      if (!byQuiz[t]) byQuiz[t] = { title: t, pcts: [] };
      byQuiz[t].pcts.push(r.total > 0 ? (r.score / r.total) * 100 : 0);
    });
    const perQuiz = Object.values(byQuiz).map((g) => {
      const p = g.pcts;
      const subs = p.length;
      const avg = subs ? p.reduce((a, b) => a + b, 0) / subs : 0;
      return { title: g.title, submissions: subs, avg, best: p.length ? Math.max(...p) : 0, worst: p.length ? Math.min(...p) : 0 };
    });
    perQuiz.sort((a, b) => b.submissions - a.submissions);
    const byStudent = {};
    rlist.forEach((r) => {
      const name = (r.studentName || "").trim() || "—";
      if (!byStudent[name]) byStudent[name] = { sum: 0, n: 0 };
      const pct = r.total > 0 ? (r.score / r.total) * 100 : 0;
      byStudent[name].sum += pct;
      byStudent[name].n += 1;
    });
    const leaderboard = Object.entries(byStudent)
      .map(([name, { sum, n }]) => ({ name, avg: n ? sum / n : 0 }))
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 10);
    const buckets = [0, 0, 0, 0, 0];
    rlist.forEach((r) => {
      const p = r.total > 0 ? (r.score / r.total) * 100 : 0;
      if (p <= 20) buckets[0] += 1;
      else if (p <= 40) buckets[1] += 1;
      else if (p <= 60) buckets[2] += 1;
      else if (p <= 80) buckets[3] += 1;
      else buckets[4] += 1;
    });
    const maxB = Math.max(1, ...buckets);
    const quizTitles = [...new Set(rlist.map((r) => r.quizTitle).filter(Boolean))];
    return {
      totalStudents: studSet.size,
      totalQuizzes: codes.length,
      totalSubmissions: rlist.length,
      avgAll,
      perQuiz,
      leaderboard,
      buckets,
      maxB,
      quizTitles,
    };
  }, [results, codes.length]);

  const questionDifficulty = useMemo(() => {
    const pickTitle = analyticsQuizTitle || analytics.quizTitles[0] || "";
    if (!pickTitle) return [];
    const sub = results.filter((r) => (r.quizTitle || "") === pickTitle && r.answers && r.answers.length);
    const nq = sub[0]?.answers?.length || 0;
    if (nq === 0) return [];
    const stats = Array.from({ length: nq }, () => ({ ok: 0, tot: 0 }));
    sub.forEach((r) => {
      (r.answers || []).forEach((a, i) => {
        if (i < stats.length) {
          stats[i].tot += 1;
          if (a.isCorrect) stats[i].ok += 1;
        }
      });
    });
    return stats
      .map((s, i) => ({
        i: i + 1,
        rate: s.tot ? (s.ok / s.tot) * 100 : 0,
        text: (sub[0].answers[i] && sub[0].answers[i].question) || (isEl ? "Ερώτηση " : "Q") + (i + 1),
      }))
      .sort((a, b) => a.rate - b.rate)
      .slice(0, 8);
  }, [results, analyticsQuizTitle, isEl, analytics.quizTitles]);

  const changeQuestionType = (qIdx, newType) => {
    if (!editing) return;
    const qs = [...editing.questions];
    const prev = { ...qs[qIdx] };
    if (newType === "true_false") {
      qs[qIdx] = { ...prev, type: "true_false", options: isEl ? ["Σωστό", "Λάθος"] : [l.trueLabel, l.falseLabel] };
    } else if (newType === "multiple_choice") {
      const o = (prev.options || []).filter(Boolean);
      const next = o.length >= 2 ? o.slice(0, 6) : ["", "", "", ""];
      while (next.length < 2) next.push("");
      qs[qIdx] = { ...prev, type: "multiple_choice", options: next };
    } else {
      qs[qIdx] = { ...prev, type: "fill_in", options: [], correct: prev.correct || "" };
    }
    setEditing({ ...editing, questions: qs });
  };

  const addOptionRow = (qIdx) => {
    if (!editing) return;
    const qs = [...editing.questions];
    const opts = [...(qs[qIdx].options || [])];
    if (opts.length >= 6) return;
    opts.push("");
    qs[qIdx] = { ...qs[qIdx], options: opts };
    setEditing({ ...editing, questions: qs });
  };

  const removeOptionRow = (qIdx, oIdx) => {
    if (!editing) return;
    const qs = [...editing.questions];
    const opts = [...(qs[qIdx].options || [])].filter((_, j) => j !== oIdx);
    if (opts.filter(Boolean).length < 2 && getQuestionType(qs[qIdx]) === "multiple_choice") return;
    qs[qIdx] = { ...qs[qIdx], options: opts.length ? opts : ["", ""] };
    setEditing({ ...editing, questions: qs });
  };

  const updateQuestion = (qIdx, field, value) => {
    const qs = [...editing.questions];
    qs[qIdx] = { ...qs[qIdx], [field]: value };
    setEditing({ ...editing, questions: qs });
  };

  const updateOption = (qIdx, oIdx, value) => {
    const qs = [...editing.questions];
    const opts = [...qs[qIdx].options];
    opts[oIdx] = value;
    qs[qIdx] = { ...qs[qIdx], options: opts };
    setEditing({ ...editing, questions: qs });
  };

  const TABS = [
    { key: "quizzes", label: l.tabQuizzes, icon: "📝" },
    { key: "classroom", label: l.tabClassroom, icon: "🏫" },
    { key: "analytics", label: l.tabAnalytics, icon: "📈" },
    { key: "resources", label: l.tabResources, icon: "📚" },
  ];

  if (playing) {
    return (
      <div id="main-content" className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
        <Navbar />
        <div className="pt-20 pb-12 px-4">
          <div className="mx-auto max-w-2xl">
            <QuizPlayer quiz={playing} lang={lang} onBack={() => setPlaying(null)} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="main-content" className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <SEO title={l.title} />
      <Navbar />

      <div className="pt-20 pb-12 px-4">
        <div className={tab === "analytics" ? "mx-auto max-w-6xl" : "mx-auto max-w-4xl"}>
          <button onClick={() => editing ? setEditing(null) : navigate(-1)} className="mb-6 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-amber-700 dark:hover:text-amber-400 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            {l.back}
          </button>

          {/* Header */}
          <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 rounded-3xl p-8 text-white mb-6 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full" />
            <div className="absolute -left-6 -bottom-6 w-28 h-28 bg-white/5 rounded-full" />
            <div className="relative flex items-center gap-3">
              <span className="text-3xl">📚</span>
              <div>
                <h1 className="text-2xl font-bold">{l.title}</h1>
                <p className="text-amber-200 text-sm">{l.subtitle}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-white dark:bg-slate-800 rounded-2xl p-1.5 border border-slate-200 dark:border-slate-700">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  tab === t.key
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                <span>{t.icon}</span> {t.label}
              </button>
            ))}
          </div>

          {saved && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-sm font-semibold flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              {l.saved}
            </div>
          )}
          {actionNotice && (
            <div className={`mb-4 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 border ${
              actionNotice.type === "error"
                ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300"
                : "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
            }`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d={actionNotice.type === "error" ? "M6 18L18 6M6 6l12 12" : "M5 13l4 4L19 7"} /></svg>
              <span>{actionNotice.text}</span>
            </div>
          )}

          {/* QUIZZES TAB */}
          {tab === "quizzes" && (
            editing ? (
              <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-6 sm:p-8 border border-slate-100 dark:border-slate-700 space-y-6">
                {error && <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm font-semibold">{error}</div>}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{l.quizTitle}</label>
                    <input type="text" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 focus:border-amber-400 outline-none text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700" placeholder={isEl ? "π.χ. Γεωγραφία Ελλάδας" : "e.g. Greek Geography"} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{l.subject}</label>
                    <input type="text" value={editing.subject || ""} onChange={(e) => setEditing({ ...editing, subject: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 focus:border-amber-400 outline-none text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700" placeholder={l.subject} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{l.gradeLevel}</label>
                  <div className="flex gap-2 flex-wrap">
                    {["elem", "middle", "high", "all"].map((g) => (
                      <button key={g} onClick={() => setEditing({ ...editing, gradeLevel: g })} className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${editing.gradeLevel === g ? "border-amber-500 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300" : "border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-amber-300"}`}>
                        {l[g]}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{l.deadlineLabel}</label>
                  <input
                    type="date"
                    value={editing.deadline || ""}
                    onChange={(e) => setEditing({ ...editing, deadline: e.target.value })}
                    className="w-full max-w-xs px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 focus:border-amber-400 outline-none text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700"
                  />
                </div>

                {editing.questions.map((q, qIdx) => {
                  const qType = getQuestionType(q);
                  const optList = (q.options || []);
                  return (
                    <div key={q.id} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <span className="text-sm font-bold text-slate-500 dark:text-slate-400">{l.question} #{qIdx + 1}</span>
                        <div className="flex items-center gap-2 flex-wrap">
                          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">{l.questionType}</label>
                          <select
                            value={qType}
                            onChange={(e) => changeQuestionType(qIdx, e.target.value)}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 text-xs font-semibold text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700 outline-none"
                          >
                            <option value="multiple_choice">{l.typeMultiple}</option>
                            <option value="true_false">{l.typeTrueFalse}</option>
                            <option value="fill_in">{l.typeFillIn}</option>
                          </select>
                        </div>
                        {editing.questions.length > 2 && (
                          <button type="button" onClick={() => { const qs = editing.questions.filter((_, i) => i !== qIdx); setEditing({ ...editing, questions: qs }); }} className="text-xs text-red-500 hover:text-red-700 font-semibold sm:ml-auto">
                            {l.removeQuestion}
                          </button>
                        )}
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">{l.imageUrl}</label>
                        <input
                          type="url"
                          value={q.imageUrl || ""}
                          onChange={(e) => updateQuestion(qIdx, "imageUrl", e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700 outline-none focus:border-amber-400"
                          placeholder={l.imageUrlHint}
                        />
                      </div>
                      <input type="text" value={q.question} onChange={(e) => updateQuestion(qIdx, "question", e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700 outline-none focus:border-amber-400" placeholder={l.question} />
                      {qType === "fill_in" ? (
                        <div>
                          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">{l.fillInCorrectHint}</label>
                          <input
                            type="text"
                            value={q.correct}
                            onChange={(e) => updateQuestion(qIdx, "correct", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700 outline-none"
                          />
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {optList.map((opt, oIdx) => (
                              <div key={oIdx} className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-400 w-5">{String.fromCharCode(65 + oIdx)}</span>
                                <input
                                  type="text"
                                  value={opt}
                                  onChange={(e) => updateOption(qIdx, oIdx, e.target.value)}
                                  className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700 outline-none focus:border-amber-400"
                                  placeholder={`${l.option} ${String.fromCharCode(65 + oIdx)}`}
                                />
                                {qType === "multiple_choice" && optList.length > 2 && (
                                  <button type="button" onClick={() => removeOptionRow(qIdx, oIdx)} className="text-xs text-slate-400 hover:text-red-500 px-1">
                                    ×
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                          {qType === "multiple_choice" && optList.length < 6 && (
                            <button type="button" onClick={() => addOptionRow(qIdx)} className="text-xs font-bold text-amber-600 dark:text-amber-400">
                              + {l.addOption}
                            </button>
                          )}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">{l.correct}</label>
                              <select value={q.correct} onChange={(e) => updateQuestion(qIdx, "correct", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700 outline-none">
                                <option value="">—</option>
                                {optList.filter(Boolean).map((opt, oi) => (
                                  <option key={oi} value={opt}>
                                    {String.fromCharCode(65 + oi)}: {opt}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">{l.difficulty}</label>
                              <select value={q.difficulty} onChange={(e) => updateQuestion(qIdx, "difficulty", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700 outline-none">
                                {DIFFICULTY_OPTIONS.map((d) => (
                                  <option key={d} value={d}>
                                    {l[d]}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </>
                      )}
                      {qType === "fill_in" && (
                        <div>
                          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">{l.difficulty}</label>
                          <select value={q.difficulty} onChange={(e) => updateQuestion(qIdx, "difficulty", e.target.value)} className="w-full max-w-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700 outline-none">
                            {DIFFICULTY_OPTIONS.map((d) => (
                              <option key={d} value={d}>
                                {l[d]}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                      <input type="text" value={q.explanation} onChange={(e) => updateQuestion(qIdx, "explanation", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700 outline-none focus:border-amber-400" placeholder={l.explanation} />
                    </div>
                  );
                })}

                <button onClick={() => setEditing({ ...editing, questions: [...editing.questions, emptyQuestion()] })} className="w-full py-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 font-semibold hover:border-amber-400 hover:text-amber-600 transition-colors flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                  {l.addQuestion}
                </button>

                <div className="flex gap-3">
                  <button onClick={() => setEditing(null)} className="flex-1 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">{l.cancel}</button>
                  <button onClick={handleSave} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold hover:from-amber-700 hover:to-orange-700 shadow-lg shadow-amber-200 dark:shadow-amber-900/30 transition-all">{l.save}</button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={handleNew} className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold hover:from-amber-700 hover:to-orange-700 shadow-lg shadow-amber-200 dark:shadow-amber-900/30 transition-all flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                    {l.createNew}
                  </button>
                  <button type="button" onClick={() => setTemplatesOpen(true)} className="px-5 py-3 rounded-xl border-2 border-amber-300 dark:border-amber-600 text-amber-800 dark:text-amber-200 font-bold text-sm hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all">
                    {l.templates}
                  </button>
                  <button
                    type="button"
                    onClick={handleSyncFromCloud}
                    disabled={cloudSyncing || !user}
                    className="px-5 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all disabled:opacity-40"
                  >
                    {cloudSyncing ? "…" : l.cloudSync}
                  </button>
                </div>

                {quizzes.length === 0 ? (
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 border border-slate-100 dark:border-slate-700 text-center">
                    <span className="text-5xl block mb-4">📝</span>
                    <p className="text-slate-500 dark:text-slate-400 font-semibold mb-2">{l.noQuizzes}</p>
                    <p className="text-sm text-slate-400 dark:text-slate-500">{isEl ? "Πάτα 'Νέο Quiz' για να ξεκινήσεις!" : "Press 'New Quiz' to get started!"}</p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {quizzes.map((quiz) => {
                      const past = quiz.deadline && isDeadlinePast(quiz.deadline);
                      return (
                        <div key={quiz.id} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 truncate flex-1">{quiz.title}</h3>
                            {quiz.deadline && (
                              <span
                                className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                                  past
                                    ? "text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20"
                                    : "text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/20"
                                }`}
                              >
                                {l.deadlineBadge}{" "}
                                {new Date(quiz.deadline + "T12:00:00").toLocaleDateString(isEl ? "el-GR" : "en-US", { day: "numeric", month: "short" })}
                                {past ? ` · ${l.expired}` : ""}
                              </span>
                            )}
                          </div>
                          {quiz.subject && <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mb-1">{quiz.subject}</p>}
                          <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">{quiz.questions.length} {l.questions} {quiz.gradeLevel ? `· ${l[quiz.gradeLevel] || quiz.gradeLevel}` : ""}</p>
                          <div className="flex gap-2 flex-wrap">
                            <button type="button" onClick={() => setPlaying(quiz)} className="px-3 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                              {l.play}
                            </button>
                            <button type="button" onClick={() => handleEdit(quiz)} className="px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700">
                              {l.edit}
                            </button>
                            <button type="button" onClick={() => handleCloneQuiz(quiz)} className="px-3 py-2 rounded-lg text-xs font-semibold text-violet-600 dark:text-violet-300 bg-violet-50 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-700">
                              {l.cloneQuiz}
                            </button>
                            {classrooms.length > 0 && (
                              <button type="button" onClick={() => setAssignPopup(quiz)} className="px-3 py-2 rounded-lg text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700">
                                {l.assignQuiz}
                              </button>
                            )}
                            <button type="button" onClick={() => handleGenerateCode(quiz)} className="px-3 py-2 rounded-lg text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700">
                              {l.generateCode}
                            </button>
                            <button type="button" onClick={() => handleDelete(quiz.id)} className="px-3 py-2 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                              {l.delete}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {templatesOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setTemplatesOpen(false)}>
                    <div onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">{l.templatesTitle}</h3>
                        <button type="button" onClick={() => setTemplatesOpen(false)} className="text-sm font-bold text-slate-500">
                          {l.closeModal}
                        </button>
                      </div>
                      {Object.entries(QUIZ_TEMPLATES).map(([key, list]) => (
                        <div key={key} className="space-y-2">
                          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            {key === "math" && l.templatesMath}
                            {key === "geography" && l.templatesGeography}
                            {key === "history" && l.templatesHistory}
                            {key === "language" && l.templatesLanguage}
                          </h4>
                          <div className="grid gap-2 sm:grid-cols-1">
                            {list.map((tpl, ti) => (
                              <div key={ti} className="flex items-center justify-between gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-600">
                                <span className="text-sm font-medium text-slate-800 dark:text-slate-100">{isEl ? tpl.titleEl : tpl.titleEn}</span>
                                <button type="button" onClick={() => applyTemplate(tpl)} className="shrink-0 px-3 py-1.5 rounded-lg bg-amber-500 text-white text-xs font-bold">
                                  {l.useThisTemplate}
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          )}

          {/* ANALYTICS TAB */}
          {tab === "analytics" && (
            <div className="space-y-6">
              {results.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-10 border text-center text-slate-500 dark:text-slate-400">{l.noAnalyticsData}</div>
              ) : (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      { v: analytics.totalStudents, sub: l.totalStudents, from: "from-sky-500 to-blue-600" },
                      { v: analytics.totalQuizzes, sub: l.totalQuizzesStat, from: "from-violet-500 to-purple-600" },
                      { v: analytics.totalSubmissions, sub: l.totalSubmissions, from: "from-emerald-500 to-teal-600" },
                      { v: Math.round(analytics.avgAll * 10) / 10, sub: l.averageScorePct, from: "from-amber-500 to-orange-600" },
                    ].map((c, i) => (
                      <div key={i} className={`rounded-2xl p-5 text-white bg-gradient-to-br ${c.from} shadow-lg`}>
                        <p className="text-3xl font-extrabold tabular-nums">{c.v}</p>
                        <p className="text-sm font-semibold text-white/90 mt-1">{c.sub}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="px-5 py-3 bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-600">
                      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">{l.perQuizBreakdown}</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-slate-100/80 dark:bg-slate-700/30">
                            <th className="text-left px-4 py-2 font-semibold text-slate-600 dark:text-slate-300">{l.quizNameCol}</th>
                            <th className="text-center px-2 py-2 font-semibold text-slate-600 dark:text-slate-300">{l.submissionsCol}</th>
                            <th className="text-center px-2 py-2 font-semibold text-slate-600 dark:text-slate-300">{l.avgScoreCol}</th>
                            <th className="text-center px-2 py-2 font-semibold text-slate-600 dark:text-slate-300">{l.bestScoreCol}</th>
                            <th className="text-center px-2 py-2 font-semibold text-slate-600 dark:text-slate-300">{l.worstScoreCol}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {analytics.perQuiz.map((row) => (
                            <tr key={row.title} className="border-t border-slate-100 dark:border-slate-700/50">
                              <td className="px-4 py-2.5 text-slate-800 dark:text-slate-200 font-medium">{row.title}</td>
                              <td className="px-2 py-2.5 text-center tabular-nums">{row.submissions}</td>
                              <td className="px-2 py-2.5 text-center tabular-nums">{Math.round(row.avg * 10) / 10}%</td>
                              <td className="px-2 py-2.5 text-center tabular-nums text-emerald-600 dark:text-emerald-400">{Math.round(row.best * 10) / 10}%</td>
                              <td className="px-2 py-2.5 text-center tabular-nums text-red-600 dark:text-red-400">{Math.round(row.worst * 10) / 10}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">{l.hardestQuestions}</h3>
                        <select
                          value={analyticsQuizTitle}
                          onChange={(e) => setAnalyticsQuizTitle(e.target.value)}
                          className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-sm bg-white dark:bg-slate-700"
                        >
                          {analytics.quizTitles.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>
                      {questionDifficulty.length === 0 ? (
                        <p className="text-xs text-slate-400">{l.noResults}</p>
                      ) : (
                        <ol className="space-y-2 list-decimal list-inside text-sm text-slate-700 dark:text-slate-200">
                          {questionDifficulty.map((h) => (
                            <li key={h.i} className="pl-1">
                              <span className="text-slate-500 dark:text-slate-400">#{h.i} · </span>
                              {h.text} — <span className="font-bold text-amber-600 dark:text-amber-400">{Math.round(h.rate)}% {l.successRate}</span>
                            </li>
                          ))}
                        </ol>
                      )}
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
                      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">{l.leaderboard}</h3>
                      <ol className="space-y-2">
                        {analytics.leaderboard.map((s, i) => (
                          <li key={s.name} className="flex items-center justify-between text-sm">
                            <span>
                              <span className="font-mono text-amber-600 dark:text-amber-400 w-6 inline-block">{i + 1}.</span> {s.name}
                            </span>
                            <span className="font-bold text-slate-800 dark:text-slate-100 tabular-nums">{Math.round(s.avg * 10) / 10}%</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl border border-indigo-200/60 dark:border-slate-600 p-6">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4">{l.scoreDistribution}</h3>
                    <div className="flex items-end justify-between gap-2 h-40">
                      {[
                        { b: analytics.buckets[0], la: l.dist0_20 },
                        { b: analytics.buckets[1], la: l.dist21_40 },
                        { b: analytics.buckets[2], la: l.dist41_60 },
                        { b: analytics.buckets[3], la: l.dist61_80 },
                        { b: analytics.buckets[4], la: l.dist81_100 },
                      ].map((x, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center justify-end h-full min-w-0">
                          <div
                            className="w-full max-w-[64px] mx-auto rounded-t-lg bg-gradient-to-t from-fuchsia-500 to-indigo-500 transition-all"
                            style={{ height: `${(x.b / analytics.maxB) * 100}%` }}
                            title={String(x.b)}
                          />
                          <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 mt-1 text-center leading-tight">{x.b}</span>
                          <span className="text-[9px] text-slate-500 dark:text-slate-500 text-center mt-0.5 leading-tight">{x.la}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* CLASSROOM TAB */}
          {tab === "classroom" && (
            <div className="space-y-6">
              {copiedCode && (
                <div className="px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-sm font-semibold flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  {l.codeCopied}: <span className="font-mono font-bold">{copiedCode}</span>
                </div>
              )}

              {/* ========== PERMANENT CLASSROOMS ========== */}
              <div>
                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span>🏫</span> {l.myClassrooms}
                </h3>

                {/* Create classroom form */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm mb-4">
                  <div className="flex gap-3 items-end">
                    <div className="flex-1">
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">{l.classroomName}</label>
                      <input
                        type="text"
                        value={newClassroomName}
                        onChange={(e) => setNewClassroomName(e.target.value)}
                        placeholder={l.classroomNamePlaceholder}
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 focus:border-amber-400 outline-none text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700"
                        onKeyDown={(e) => e.key === "Enter" && newClassroomName.trim() && handleCreateClassroom()}
                      />
                    </div>
                    <button
                      onClick={handleCreateClassroom}
                      disabled={!newClassroomName.trim() || creatingClassroom}
                      className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-sm hover:from-amber-700 hover:to-orange-700 shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2 shrink-0"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                      {l.createClassroom}
                    </button>
                  </div>
                </div>

                {classrooms.length === 0 ? (
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-10 border border-slate-100 dark:border-slate-700 text-center">
                    <span className="text-4xl block mb-3">🏫</span>
                    <p className="text-slate-500 dark:text-slate-400 font-semibold mb-1">{l.noClassrooms}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{l.noClassroomsHint}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {classrooms.map((cls) => {
                      const mems = classroomMembers[cls.code] || [];
                      const clsQuizzes = codes.filter((c) => c.classroomCode === cls.code);
                      const isExpanded = expandedClassroom === cls.code;
                      return (
                        <div key={cls.code} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                          {/* Classroom header */}
                          <div
                            className="p-5 flex items-center gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                            onClick={() => setExpandedClassroom(isExpanded ? null : cls.code)}
                          >
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl shrink-0">🏫</div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 truncate">{cls.name}</h4>
                              <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                                <span>👥 {mems.length} {l.members.toLowerCase()}</span>
                                <span>📝 {clsQuizzes.length} quiz</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg border border-blue-200 dark:border-blue-700 tracking-widest">{cls.code}</span>
                              <button onClick={(e) => { e.stopPropagation(); copyCode(cls.code); }} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); handleShareClassroom(cls); }} className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
                                <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                              </button>
                              <svg className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                            </div>
                          </div>

                          {/* Expanded content */}
                          {isExpanded && (
                            <div className="border-t border-slate-100 dark:border-slate-700 p-5 space-y-4">
                              {/* Assigned quizzes */}
                              <div>
                                <h5 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">📝 Quiz</h5>
                                {clsQuizzes.length === 0 ? (
                                  <p className="text-xs text-slate-400 dark:text-slate-500 italic">{isEl ? "Δεν έχεις αναθέσει quiz σε αυτή την τάξη ακόμα" : "No quizzes assigned to this classroom yet"}</p>
                                ) : (
                                  <div className="space-y-2">
                                    {clsQuizzes.map((cq) => (
                                      <div key={cq.code} className="flex items-center justify-between bg-slate-50 dark:bg-slate-700/30 rounded-xl px-4 py-2.5">
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{cq.quizTitle}</span>
                                        <span className="text-xs text-slate-400">{cq.timesPlayed || 0} {l.timesPlayed}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Members */}
                              <div>
                                <h5 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">👥 {l.members}</h5>
                                {mems.length === 0 ? (
                                  <p className="text-xs text-slate-400 dark:text-slate-500 italic">{l.noMembers}</p>
                                ) : (
                                  <div className="grid gap-2 sm:grid-cols-2">
                                    {mems.map((m) => (
                                      <div key={m.id} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-700/30 rounded-xl px-4 py-2.5">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold">
                                          {(m.studentName || "?")[0].toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{m.studentName || (isEl ? "Ανώνυμος" : "Anonymous")}</p>
                                          <p className="text-xs text-slate-400 dark:text-slate-500">{l.enrolledOn}: {m.joinedAt ? new Date(m.joinedAt).toLocaleDateString(isEl ? "el-GR" : "en-US", { day: "numeric", month: "short" }) : "—"}</p>
                                        </div>
                                        {db && (
                                          <button
                                            type="button"
                                            onClick={() => handleRemoveClassroomMember(m.id, cls.code)}
                                            className="shrink-0 text-xs font-bold text-red-500 hover:text-red-700 px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                                          >
                                            {l.removeMember}
                                          </button>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Actions */}
                              <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                                <button
                                  onClick={() => handleShareClassroom(cls)}
                                  className="px-4 py-2 rounded-lg text-xs font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-700 hover:bg-blue-100 transition-colors"
                                >
                                  {l.shareClassroom}
                                </button>
                                <button
                                  onClick={() => handleDeleteClassroom(cls)}
                                  className="px-4 py-2 rounded-lg text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                >
                                  {l.deleteClassroom}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ========== QUICK CODES (Kahoot-style) ========== */}
              <div>
                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-2">
                  <span>🔑</span> {l.quickCodes}
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">{l.quickCodesHint}</p>
                {codes.filter((c) => !c.classroomCode).length === 0 ? (
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 text-center">
                    <p className="text-sm text-slate-400 dark:text-slate-500">{l.noCodesYet}</p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {codes.filter((c) => !c.classroomCode).map((c) => (
                      <div key={c.id} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4 flex-wrap">
                        <div className="flex-1 min-w-[200px]">
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{c.quizTitle}</p>
                          <p className="text-xs text-slate-400 dark:text-slate-500">{c.timesPlayed || 0} {l.timesPlayed}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-lg font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-4 py-2 rounded-xl border border-amber-200 dark:border-amber-700 tracking-widest">{c.code}</span>
                          <button onClick={() => copyCode(c.code)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" title={l.codeCopied}>
                            <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                          </button>
                          <button
                            onClick={() => handleShare(c)}
                            className="px-3 py-2 rounded-lg text-xs font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors flex items-center gap-1.5"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                            {l.shareCode}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Announcements */}
              <div>
                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span>📢</span> {l.announcements}
                </h3>
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm mb-3">
                  <textarea
                    value={newAnnouncementText}
                    onChange={(e) => setNewAnnouncementText(e.target.value)}
                    placeholder={l.announcementPlaceholder}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 focus:border-amber-400 outline-none text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700 resize-none"
                  />
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={handlePostAnnouncement}
                      disabled={!newAnnouncementText.trim() || postingAnnouncement || (codes.length === 0 && classrooms.length === 0)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-sm hover:from-amber-700 hover:to-orange-700 shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                      {l.postAnnouncement}
                    </button>
                  </div>
                </div>

                {announcements.length === 0 ? (
                  <div className="text-center py-6 text-slate-400 dark:text-slate-500 text-sm">{l.noAnnouncements}</div>
                ) : (
                  <div className="space-y-3">
                    {announcements.map((ann) => (
                      <div key={ann.id} className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-100 dark:border-amber-800">
                        <p className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">{ann.text}</p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-slate-400 dark:text-slate-500">
                            {new Date(ann.createdAt).toLocaleDateString(isEl ? "el-GR" : "en-US", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </span>
                          <button
                            onClick={() => handleDeleteAnnouncement(ann.id)}
                            className="text-xs text-red-500 hover:text-red-700 font-semibold"
                          >
                            {l.deleteAnnouncement}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Student Results */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <span>📊</span> {l.results}
                  </h3>
                  {filteredResults.length > 0 && (
                    <button
                      type="button"
                      onClick={exportResultsToCsv}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
                    >
                      {l.exportCSV}
                    </button>
                  )}
                </div>

                {codes.length > 1 && (
                  <div className="flex gap-2 flex-wrap mb-3">
                    <button
                      onClick={() => setResultsFilter("all")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${resultsFilter === "all" ? "bg-amber-500 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"}`}
                    >
                      {l.allQuizzes}
                    </button>
                    {codes.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => setResultsFilter(c.code)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${resultsFilter === c.code ? "bg-amber-500 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"}`}
                      >
                        {c.quizTitle}
                      </button>
                    ))}
                  </div>
                )}

                {filteredResults.length === 0 ? (
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-10 border border-slate-100 dark:border-slate-700 text-center">
                    <span className="text-4xl block mb-3">📊</span>
                    <p className="text-slate-500 dark:text-slate-400 font-semibold">{l.noResults}</p>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700">
                            <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">{l.studentName}</th>
                            <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Quiz</th>
                            <th className="text-center px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">{l.scoreLabel}</th>
                            <th className="text-right px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">{l.dateLabel}</th>
                            <th className="text-center px-4 py-3 font-semibold text-slate-600 dark:text-slate-300" />
                          </tr>
                        </thead>
                        <tbody>
                          {filteredResults.map((r) => {
                            const pct = r.total > 0 ? Math.round((r.score / r.total) * 100) : 0;
                            const hasAnswers = r.answers && r.answers.length > 0;
                            return (
                              <tr key={r.id} className="border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                <td className="px-4 py-3">
                                  <span className="font-semibold text-slate-800 dark:text-slate-100">{r.studentName || (isEl ? "Ανώνυμος" : "Anonymous")}</span>
                                </td>
                                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{r.quizTitle}</td>
                                <td className="px-4 py-3 text-center">
                                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                                    pct >= 80 ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300" :
                                    pct >= 50 ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300" :
                                    "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                                  }`}>
                                    {pct >= 80 ? "🏆" : pct >= 50 ? "👏" : "💪"} {r.score}/{r.total} ({pct}%)
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-right text-xs text-slate-400 dark:text-slate-500">
                                  {r.completedAt ? new Date(r.completedAt).toLocaleDateString(isEl ? "el-GR" : "en-US", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "—"}
                                </td>
                                <td className="px-4 py-3 text-center">
                                  {hasAnswers ? (
                                    <button
                                      onClick={() => setExpandedResult(r)}
                                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                                    >
                                      🔍 {l.viewDetails}
                                    </button>
                                  ) : (
                                    <span className="text-xs text-slate-300 dark:text-slate-600">—</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                )}
              </div>

              {/* Share popup modal */}
              {sharePopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSharePopup(null)}>
                  <div onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-5 animate-in">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-slate-800 dark:text-white">{l.shareCode}</h3>
                      <button onClick={() => setSharePopup(null)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                        <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>

                    {/* Direct link */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">{lang === "el" ? "Άμεσος σύνδεσμος" : "Direct link"}</label>
                      <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 border border-slate-200 dark:border-slate-600">
                        <span className="flex-1 text-sm font-mono text-blue-600 dark:text-blue-400 break-all select-all">{sharePopup.link}</span>
                        <button onClick={() => copyShareText(sharePopup.link)} className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                          {lang === "el" ? "Αντιγραφή" : "Copy"}
                        </button>
                      </div>
                    </div>

                    {/* Ready-made message */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">{lang === "el" ? "Έτοιμο μήνυμα" : "Ready-made message"}</label>
                      <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 border border-slate-200 dark:border-slate-600">
                        <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line mb-3">{sharePopup.message}</p>
                        <button onClick={() => copyShareText(sharePopup.message)} className="w-full px-3 py-2 rounded-lg text-xs font-bold bg-purple-600 text-white hover:bg-purple-700 transition-colors">
                          {lang === "el" ? "Αντιγραφή μηνύματος" : "Copy message"}
                        </button>
                      </div>
                    </div>

                    {/* Code only */}
                    <div className="text-center pt-2 border-t border-slate-200 dark:border-slate-700">
                      <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">{lang === "el" ? "ή δώσε μόνο τον κωδικό" : "or give the code only"}</p>
                      <span className="font-mono text-2xl font-extrabold tracking-[0.3em] text-amber-600 dark:text-amber-400">{sharePopup.code}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Assign quiz to classroom modal */}
              {assignPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setAssignPopup(null)}>
                  <div onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4 animate-in">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-slate-800 dark:text-white">{l.assignQuiz}</h3>
                      <button onClick={() => setAssignPopup(null)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                        <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{isEl ? `Ανάθεση «${assignPopup.title}» σε:` : `Assign "${assignPopup.title}" to:`}</p>
                    <div className="space-y-2">
                      {classrooms.map((cls) => (
                        <button
                          key={cls.code}
                          onClick={() => handleAssignQuizToClassroom(assignPopup, cls.code)}
                          className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-slate-200 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 transition-all text-left"
                        >
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shrink-0">🏫</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{cls.name}</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500">{cls.code}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Results detail modal */}
              {expandedResult && expandedResult.answers && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setExpandedResult(null)}>
                  <div
                    className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between shrink-0">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                          {expandedResult.studentName || (isEl ? "Ανώνυμος" : "Anonymous")}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {expandedResult.quizTitle} — {expandedResult.score}/{expandedResult.total} ({expandedResult.total > 0 ? Math.round((expandedResult.score / expandedResult.total) * 100) : 0}%)
                        </p>
                      </div>
                      <button
                        onClick={() => setExpandedResult(null)}
                        className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                      >
                        <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>

                    <div className="p-6 overflow-y-auto space-y-3">
                      {expandedResult.answers.map((a, ai) => (
                        <div
                          key={ai}
                          className={`flex items-start gap-3 p-4 rounded-2xl border ${
                            a.isCorrect
                              ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800"
                              : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                          }`}
                        >
                          <span className="text-xl shrink-0 mt-0.5">{a.isCorrect ? "✅" : "❌"}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-1">{l.questionLabel} {ai + 1}</p>
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">{a.question}</p>
                            {!a.isCorrect ? (
                              <div className="space-y-1.5">
                                <div className="flex items-start gap-2 text-sm">
                                  <span className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center shrink-0 mt-0.5">
                                    <span className="w-2 h-2 rounded-full bg-red-500" />
                                  </span>
                                  <div>
                                    <span className="text-xs font-semibold text-red-600 dark:text-red-400 block">{l.studentAnswer}</span>
                                    <span className="text-red-700 dark:text-red-300">{a.selected}</span>
                                  </div>
                                </div>
                                <div className="flex items-start gap-2 text-sm">
                                  <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0 mt-0.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                  </span>
                                  <div>
                                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 block">{l.correctAnswer}</span>
                                    <span className="text-emerald-700 dark:text-emerald-300">{a.correct}</span>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{l.correctAnswer}: {a.correct}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* RESOURCES TAB */}
          {tab === "resources" && (
            <div className="space-y-5">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">{l.resourcesTitle}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{l.resourcesDesc}</p>

                {/* Guide sections */}
                <div className="space-y-6">
                  {(isEl ? [
                    {
                      icon: "🏫", color: "from-blue-500 to-indigo-600", title: "Δημιουργία μόνιμης τάξης",
                      steps: [
                        "Πήγαινε στην καρτέλα «Η Τάξη μου»",
                        "Γράψε το όνομα της τάξης (π.χ. «Α' Δημοτικού - Τμήμα Β») και πάτα «Δημιουργία τάξης»",
                        "Θα δημιουργηθεί ένας μοναδικός κωδικός (π.χ. X7KN4P)",
                        "Πάτα «Κοινοποίηση τάξης» για να πάρεις σύνδεσμο ή έτοιμο μήνυμα",
                        "Στείλε τον κωδικό ή τον σύνδεσμο στους γονείς/μαθητές — χρειάζεται μόνο μία φορά!",
                      ],
                    },
                    {
                      icon: "📝", color: "from-amber-500 to-orange-600", title: "Δημιουργία & ανάθεση quiz",
                      steps: [
                        "Στην καρτέλα «Τα Quiz μου», πάτα «Νέο Quiz»",
                        "Συμπλήρωσε τίτλο, μάθημα, βαθμίδα και τις ερωτήσεις (τουλάχιστον 2)",
                        "Πάτα «Αποθήκευση»",
                        "Στην κάρτα του quiz, πάτα «Ανάθεση σε τάξη» → επέλεξε τάξη",
                        "Το quiz εμφανίζεται αυτόματα στους μαθητές μέσα στη σελίδα «Η Τάξη μου» τους",
                        "Εναλλακτικά, πάτα «Δημιουργία κωδικού τάξης» για γρήγορο κωδικό μιας χρήσης (τύπου Kahoot)",
                      ],
                    },
                    {
                      icon: "📢", color: "from-purple-500 to-pink-600", title: "Ανακοινώσεις",
                      steps: [
                        "Στην καρτέλα «Η Τάξη μου», στην ενότητα «Ανακοινώσεις»",
                        "Γράψε το μήνυμά σου και πάτα «Δημοσίευση»",
                        "Η ανακοίνωση εμφανίζεται αμέσως στους μαθητές σε όλες τις τάξεις σου",
                        "Μπορείς να τη διαγράψεις αν χρειαστεί",
                      ],
                    },
                    {
                      icon: "📊", color: "from-emerald-500 to-teal-600", title: "Αποτελέσματα μαθητών",
                      steps: [
                        "Στην καρτέλα «Η Τάξη μου», πήγαινε στα «Αποτελέσματα μαθητών»",
                        "Βλέπεις πίνακα με: μαθητή, quiz, σκορ (%), ημερομηνία",
                        "Φίλτραρε ανά quiz αν θέλεις",
                        "Πάτα «🔍 Λεπτομέρειες» για να δεις πού ακριβώς έκανε λάθος ο μαθητής",
                        "Σε κάθε λάθος φαίνεται τι απάντησε ο μαθητής και ποια ήταν η σωστή",
                      ],
                    },
                    {
                      icon: "👨‍👩‍👧‍👦", color: "from-rose-500 to-red-600", title: "Πώς μπαίνει ο μαθητής",
                      steps: [
                        "Ο γονέας/μαθητής μπαίνει στην πλατφόρμα και πατάει «Η Τάξη μου» από το μενού",
                        "Γράφει τον κωδικό τάξης + το όνομά του και πατάει «Εγγραφή»",
                        "Από εδώ και πέρα, κάθε φορά που ανοίγει «Η Τάξη μου» βλέπει αυτόματα τα quiz, τις ανακοινώσεις, και τον δάσκαλο — χωρίς κωδικό ξανά!",
                        "Για γρήγορα quiz (μιας χρήσης): μπαίνει από «Γρήγορος κωδικός quiz» στο μενού",
                      ],
                    },
                  ] : [
                    {
                      icon: "🏫", color: "from-blue-500 to-indigo-600", title: "Create a permanent classroom",
                      steps: [
                        "Go to the «My Classroom» tab",
                        "Type the class name (e.g. \"1st Grade - Section B\") and press «Create classroom»",
                        "A unique code is generated (e.g. X7KN4P)",
                        "Press «Share classroom» to get a link or ready-made message",
                        "Send the code or link to parents/students — only needed once!",
                      ],
                    },
                    {
                      icon: "📝", color: "from-amber-500 to-orange-600", title: "Create & assign quizzes",
                      steps: [
                        "In the «My Quizzes» tab, press «New Quiz»",
                        "Fill in title, subject, grade level and questions (at least 2)",
                        "Press «Save»",
                        "On the quiz card, press «Assign to classroom» → choose a classroom",
                        "The quiz appears automatically on the student's «My Classroom» page",
                        "Alternatively, press «Generate classroom code» for a one-time code (Kahoot-style)",
                      ],
                    },
                    {
                      icon: "📢", color: "from-purple-500 to-pink-600", title: "Announcements",
                      steps: [
                        "In the «My Classroom» tab, under «Announcements»",
                        "Write your message and press «Post»",
                        "The announcement appears instantly to students in all your classrooms",
                        "You can delete it if needed",
                      ],
                    },
                    {
                      icon: "📊", color: "from-emerald-500 to-teal-600", title: "Student results",
                      steps: [
                        "In the «My Classroom» tab, go to «Student results»",
                        "You see a table with: student, quiz, score (%), date",
                        "Filter by quiz if needed",
                        "Press «🔍 Details» to see exactly where the student got it wrong",
                        "Each mistake shows the student's answer vs. the correct one",
                      ],
                    },
                    {
                      icon: "👨‍👩‍👧‍👦", color: "from-rose-500 to-red-600", title: "How students join",
                      steps: [
                        "The parent/student opens the platform and presses «My Classroom» from the menu",
                        "They enter the classroom code + their name and press «Enroll»",
                        "From now on, every time they open «My Classroom» they see quizzes, announcements, and the teacher — no code needed again!",
                        "For one-time quizzes: use «Quick Quiz Code» from the menu",
                      ],
                    },
                  ]).map((section, si) => (
                    <div key={si} className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                      <div className={`bg-gradient-to-r ${section.color} px-5 py-3 flex items-center gap-3`}>
                        <span className="text-2xl">{section.icon}</span>
                        <h4 className="text-sm font-bold text-white">{section.title}</h4>
                      </div>
                      <ol className="p-5 space-y-2.5">
                        {section.steps.map((step, sti) => (
                          <li key={sti} className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0 mt-0.5">{sti + 1}</span>
                            <span className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
