import React, { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import { LanguageContext } from "../i18n/LanguageContext";
import { FeatureFlagService } from "../services/FeatureFlagService";

// ─── FAQ data ─────────────────────────────────────────────
// Each item belongs to one or more categories.
// Categories: "general" | "student" | "parent" | "teacher" | "subscription" | "tech"
export const FAQ_ITEMS = [
  // General
  {
    cat: ["general"],
    q: { en: "What is Kibloo?", el: "Τι είναι το Kibloo;" },
    a: {
      en: "Kibloo is an interactive learning platform with 100+ quizzes and 59 classic games for children ages 2–12 (plus an adult section). Kids learn math, language, geography, science and more — through play.",
      el: "Το Kibloo είναι μια διαδραστική εκπαιδευτική πλατφόρμα με 100+ quizzes και 59 κλασικά παιχνίδια για παιδιά 2–12 ετών (και ενότητα ενηλίκων). Τα παιδιά μαθαίνουν μαθηματικά, γλώσσα, γεωγραφία, επιστήμη — μέσα από το παιχνίδι.",
    },
  },
  {
    cat: ["general"],
    q: { en: "What ages is it for?", el: "Για ποιες ηλικίες είναι;" },
    a: {
      en: "Children ages 2–12, organized in 6 age groups (2–3, 4–5, 6, 7–8, 9–10, 11–12). We also have a separate Adult section with brain games and trivia.",
      el: "Παιδιά 2–12 ετών, σε 6 ηλικιακές ομάδες (2–3, 4–5, 6, 7–8, 9–10, 11–12). Έχουμε και ξεχωριστή ενότητα Ενηλίκων με brain games και γρίφους.",
    },
  },
  {
    cat: ["general", "tech"],
    q: { en: "Can I use it on mobile?", el: "Λειτουργεί στο κινητό;" },
    a: {
      en: "Yes! Kibloo works on phones, tablets and desktops (Chrome, Safari, Firefox, Edge). You can also install it as a PWA app via 'Add to Home Screen'.",
      el: "Ναι! Το Kibloo λειτουργεί σε κινητά, tablets και υπολογιστές (Chrome, Safari, Firefox, Edge). Μπορείτε επίσης να το εγκαταστήσετε ως PWA μέσω 'Προσθήκη στην οθόνη Home'.",
    },
  },
  {
    cat: ["general", "tech"],
    q: { en: "Does it work offline?", el: "Λειτουργεί χωρίς internet;" },
    a: {
      en: "Many games work offline thanks to our PWA service worker. When you reconnect, your progress syncs automatically.",
      el: "Πολλά παιχνίδια λειτουργούν offline χάρη στο PWA service worker. Όταν επανέλθει το internet, η πρόοδος συγχρονίζεται αυτόματα.",
    },
  },
  {
    cat: ["general"],
    q: { en: "What languages are supported?", el: "Σε ποιες γλώσσες είναι;" },
    a: {
      en: "Greek (Ελληνικά) and English. Switch via the globe icon (🌐) in the header.",
      el: "Ελληνικά και Αγγλικά. Αλλαγή από το εικονίδιο 🌐 στο header.",
    },
  },

  // Account
  {
    cat: ["general"],
    q: { en: "How do I create an account?", el: "Πώς δημιουργώ λογαριασμό;" },
    a: {
      en: "Click 'Sign up' top-right, choose your role (student / parent / teacher), enter email + password (or use Google sign-in). You'll get a 7-day free Premium trial automatically!",
      el: "Κλικ στο «Εγγραφή» πάνω δεξιά, επιλέξτε ρόλο (μαθητής / γονιός / δάσκαλος), email + κωδικό (ή Google sign-in). Παίρνετε αυτόματα 7 ημέρες δωρεάν Premium!",
    },
  },
  {
    cat: ["general"],
    q: { en: "How can I delete my account?", el: "Πώς διαγράφω τον λογαριασμό μου;" },
    a: {
      en: "Profile → Settings → 'Delete account'. Per GDPR right-to-erasure, all data is permanently removed within 30 days.",
      el: "Profile → Ρυθμίσεις → «Διαγραφή λογαριασμού». Σύμφωνα με το GDPR, όλα τα δεδομένα διαγράφονται οριστικά εντός 30 ημερών.",
    },
  },
  {
    cat: ["general"],
    q: { en: "I forgot my password — what now?", el: "Ξέχασα τον κωδικό μου — τι κάνω;" },
    a: {
      en: "On the login page, click 'Forgot password' — we'll send a reset link to your email.",
      el: "Στη σελίδα σύνδεσης, κλικ «Ξέχασα τον κωδικό». Θα σου στείλουμε link επαναφοράς στο email σου.",
    },
  },

  // Student
  {
    cat: ["student"],
    q: { en: "How do I earn coins?", el: "Πώς κερδίζω coins;" },
    a: {
      en: "Correct answer = +10 coins · Game completion = +20 to +50 · Daily streak = +5/day · Daily Challenge = +100 · Achievement unlocked = +25 to +200.",
      el: "Σωστή απάντηση = +10 coins · Ολοκλήρωση παιχνιδιού = +20 έως +50 · Daily streak = +5/μέρα · Ημερήσια Πρόκληση = +100 · Achievement = +25 έως +200.",
    },
  },
  {
    cat: ["student"],
    q: { en: "What can I buy with coins?", el: "Τι μπορώ να αγοράσω με coins;" },
    a: {
      en: "Visit the Shop (Profile → Shop) to spend coins on hints (50/50), themes, avatar frames, and profile badges.",
      el: "Πήγαινε στο Κατάστημα (Profile → Κατάστημα) για να ξοδέψεις coins σε hints (50/50), themes, avatar frames και badges.",
    },
  },
  {
    cat: ["student"],
    q: { en: "What are classic games?", el: "Τι είναι τα Κλασικά Παιχνίδια;" },
    a: {
      en: "59 timeless games organized in 6 collections: Quick Wins (Wordle, 2048, Snake, Tetris…), Educational (Spelling Bee, Math Sprint…), Creative (Pixel Art, Story Builder…), Multiplayer, Action and STEM. Find them in Navbar → 'Classic'.",
      el: "59 κλασικά παιχνίδια σε 6 συλλογές: Quick Wins (Wordle, 2048, Snake, Tetris…), Εκπαιδευτικά (Spelling Bee, Math Sprint…), Δημιουργικά (Pixel Art, Story Builder…), Multiplayer, Δράσης, και STEM. Στο Navbar → «Κλασικά».",
    },
  },
  {
    cat: ["student"],
    q: { en: "How does AI Study Buddy work?", el: "Πώς λειτουργεί το AI Study Buddy;" },
    a: {
      en: "In every quiz there's a '🤖 Help' button. The AI explains the question in simple language and gives hints without revealing the answer. Free: 5 questions/day · Premium: unlimited.",
      el: "Σε κάθε quiz υπάρχει κουμπί «🤖 Βοήθεια». Το AI εξηγεί την ερώτηση σε απλή γλώσσα και δίνει υπόδειξεις χωρίς να αποκαλύπτει την απάντηση. Free: 5 ερωτήσεις/μέρα · Premium: απεριόριστα.",
    },
  },
  {
    cat: ["student"],
    q: { en: "How do multiplayer games work?", el: "Πώς λειτουργούν τα multiplayer παιχνίδια;" },
    a: {
      en: "Online Battle (1v1 real-time), Battle Royale (100 players), Friend Challenges (async — send a quiz to a friend), Tic-Tac-Toe Online (real-time with friends), and live classroom mode for teachers.",
      el: "Online Battle (1v1 real-time), Battle Royale (100 παίκτες), Friend Challenges (async — στείλε quiz σε φίλο), Tic-Tac-Toe Online (real-time με φίλους), και live classroom mode για δασκάλους.",
    },
  },

  // Parent
  {
    cat: ["parent"],
    q: { en: "Is there a Parent Dashboard?", el: "Υπάρχει Πίνακας Γονέα;" },
    a: {
      en: "Yes. Sign in with your parent account → Profile → Parent Dashboard. View progress, screen time, weekly reports, family challenges, and chat with teachers.",
      el: "Ναι. Σύνδεση με parent account → Profile → Parent Dashboard. Δες πρόοδο, screen time, εβδομαδιαίες αναφορές, family challenges και chat με δασκάλους.",
    },
  },
  {
    cat: ["parent"],
    q: { en: "How do I limit screen time?", el: "Πώς θέτω όριο χρόνου οθόνης;" },
    a: {
      en: "Parent Dashboard → Screen Time. Set max minutes/day and allowed time windows (e.g. 16:00–20:00). When time runs out, the app politely says 'Come back tomorrow!'.",
      el: "Parent Dashboard → Έλεγχος Χρόνου. Ορίστε max λεπτά/μέρα και επιτρεπόμενες ώρες (π.χ. 16:00–20:00). Όταν λήξει, η εφαρμογή λέει «Έλα αύριο!».",
    },
  },
  {
    cat: ["parent", "subscription"],
    q: { en: "Can multiple children share one account?", el: "Πολλά παιδιά σε έναν λογαριασμό;" },
    a: {
      en: "Yes — with the Family Plan (€14.99/month) you can have up to 5 child profiles, each with separate progress and avatar.",
      el: "Ναι — με το Family Plan (€14.99/μήνα) μπορείς να έχεις έως 5 child profiles, με ξεχωριστή πρόοδο και avatar το καθένα.",
    },
  },
  {
    cat: ["parent"],
    q: { en: "Will I get progress reports?", el: "Θα παίρνω αναφορές προόδου;" },
    a: {
      en: "Every Sunday you'll receive an email digest with the week's top 3 strengths and 3 areas to improve, plus next week's recommendations.",
      el: "Κάθε Κυριακή παίρνεις email αναφορά με τα 3 strongest και 3 weakest themes της εβδομάδας, και προτάσεις για την επόμενη.",
    },
  },

  // Teacher
  {
    cat: ["teacher"],
    q: { en: "How do I create a class?", el: "Πώς δημιουργώ τάξη;" },
    a: {
      en: "Teacher Dashboard → 'New Class'. Give a name and age group. You'll get a class code (e.g. ABC123) and a QR code that students scan to join.",
      el: "Teacher Dashboard → «Νέα Τάξη». Δώσε όνομα και ηλικιακή ομάδα. Παίρνεις κωδικό class (π.χ. ABC123) και QR code που σκανάρουν οι μαθητές για να μπουν.",
    },
  },
  {
    cat: ["teacher"],
    q: { en: "What is Live Quiz?", el: "Τι είναι το Live Quiz;" },
    a: {
      en: "A Kahoot-style mode: pick a quiz, show the join code on the classroom screen, students join from their phones, and you play live with a real-time leaderboard.",
      el: "Mode Kahoot-style: επίλεξε quiz, δείξε τον κωδικό στην οθόνη της τάξης, μαθητές μπαίνουν από τα κινητά τους, παίζετε live με real-time leaderboard.",
    },
  },
  {
    cat: ["teacher"],
    q: { en: "Can I generate quizzes with AI?", el: "Μπορώ να φτιάχνω quizzes με AI;" },
    a: {
      en: "Yes! Input a topic + age + difficulty → get 10 questions in 5 seconds. Output is bilingual (Greek + English). Available under Teacher → AI Quiz Generator.",
      el: "Ναι! Εισάγεις θέμα + ηλικία + δυσκολία → παίρνεις 10 ερωτήσεις σε 5 δευτερόλεπτα. Output δίγλωσσο (EL + EN). Στο Teacher → AI Quiz Generator.",
    },
  },
  {
    cat: ["teacher"],
    q: { en: "Can I print worksheets?", el: "Μπορώ να εκτυπώσω φύλλα εργασίας;" },
    a: {
      en: "Yes — auto-generated PDFs with 1 page of exercises + 1 page of answers, in Greek or English. Teacher Dashboard → Worksheets.",
      el: "Ναι — auto-generated PDFs με 1 σελίδα ασκήσεων + 1 σελίδα λύσεων, στα Ελληνικά ή Αγγλικά. Teacher Dashboard → Φύλλα Εργασίας.",
    },
  },
  {
    cat: ["teacher"],
    q: { en: "Can students log in without an email?", el: "Μπορούν οι μαθητές να μπουν χωρίς email;" },
    a: {
      en: "Yes — use 'Kid Login (PIN/QR)'. Create child accounts in your dashboard; each gets a PIN or QR code. No email required.",
      el: "Ναι — με «Kid Login (PIN/QR)». Φτιάχνεις child accounts στο dashboard, κάθε παιδί παίρνει PIN ή QR. Χωρίς email.",
    },
  },

  // Subscription
  {
    cat: ["subscription"],
    q: { en: "How much does Premium cost?", el: "Πόσο κοστίζει το Premium;" },
    a: {
      en: "Premium: €9.99/month or €79/year (save ~33%). Family: €14.99/month or €119/year. School: custom per-seat pricing (from €2/seat for 100+ seats).",
      el: "Premium: €9.99/μήνα ή €79/έτος (~33% έκπτωση). Family: €14.99/μήνα ή €119/έτος. School: custom per-seat pricing (από €2/seat για 100+ seats).",
    },
  },
  {
    cat: ["subscription"],
    q: { en: "Is there a free trial?", el: "Υπάρχει δωρεάν δοκιμή;" },
    a: {
      en: "Yes — every new account gets 7 days of Premium for free, automatically. You'll get email reminders 3 and 7 days before it ends.",
      el: "Ναι — κάθε νέος λογαριασμός παίρνει αυτόματα 7 ημέρες Premium δωρεάν. Θα πάρεις email reminders 3 και 7 ημέρες πριν λήξει.",
    },
  },
  {
    cat: ["subscription"],
    q: { en: "How do I cancel my subscription?", el: "Πώς ακυρώνω τη συνδρομή;" },
    a: {
      en: "Profile → Subscription → 'Cancel'. You'll keep access until the end of the current period. No questions asked, no hidden fees.",
      el: "Profile → Συνδρομή → «Ακύρωση». Διατηρείς πρόσβαση μέχρι το τέλος της τρέχουσας περιόδου. Χωρίς ερωτήσεις, χωρίς κρυφές χρεώσεις.",
    },
  },
  {
    cat: ["subscription"],
    q: { en: "Can I get a refund?", el: "Μπορώ να πάρω επιστροφή χρημάτων;" },
    a: {
      en: "Within 14 days of purchase you can request a full refund (EU consumer right). Email support@kibloo.app or contact us via chat.",
      el: "Εντός 14 ημερών από την αγορά μπορείς να ζητήσεις πλήρη επιστροφή (δικαίωμα καταναλωτή ΕΕ). Email support@kibloo.app ή chat.",
    },
  },
  {
    cat: ["subscription"],
    q: { en: "What payment methods do you accept?", el: "Τι μέθοδοι πληρωμής γίνονται δεκτές;" },
    a: {
      en: "All major credit/debit cards via Stripe (PCI-compliant). We never store card details ourselves. Apple Pay and Google Pay are supported on mobile.",
      el: "Όλες οι μεγάλες πιστωτικές/χρεωστικές μέσω Stripe (PCI-compliant). Δεν αποθηκεύουμε στοιχεία κάρτας εμείς. Apple Pay και Google Pay υποστηρίζονται στο κινητό.",
    },
  },
  {
    cat: ["subscription"],
    q: { en: "How do referrals work?", el: "Πώς λειτουργούν οι παραπομπές;" },
    a: {
      en: "Profile → Referrals → share your link. When a friend signs up using it, both of you get +30 days of Premium for free.",
      el: "Profile → Παραπομπές → μοιράσου το link σου. Όταν φίλος εγγραφεί μέσω αυτού, και οι δύο κερδίζετε +30 ημέρες Premium δωρεάν.",
    },
  },

  // Tech / Privacy
  {
    cat: ["tech"],
    q: { en: "Is my data safe?", el: "Είναι ασφαλή τα δεδομένα μου;" },
    a: {
      en: "Yes. We're GDPR + COPPA compliant. We collect only what's needed, never sell to third parties, and use Firebase App Check + Sentry to protect against abuse. Read our Privacy Policy.",
      el: "Ναι. Είμαστε GDPR + COPPA συμβατοί. Συλλέγουμε μόνο τα απαραίτητα, δεν πουλάμε σε τρίτους, και χρησιμοποιούμε Firebase App Check + Sentry για ασφάλεια. Δείτε την Πολιτική Απορρήτου.",
    },
  },
  {
    cat: ["tech"],
    q: { en: "Are there ads for kids?", el: "Υπάρχουν διαφημίσεις για παιδιά;" },
    a: {
      en: "Free plan has minimal kid-safe ads (no third-party tracking). Premium / Family / School plans are completely ad-free.",
      el: "Το Free plan έχει μικρές παιδικά κατάλληλες διαφημίσεις (όχι 3rd-party tracking). Premium / Family / School είναι εντελώς ad-free.",
    },
  },
  {
    cat: ["tech"],
    q: { en: "How do I report a bug?", el: "Πώς αναφέρω ένα bug;" },
    a: {
      en: "Click the green 'Send feedback' pill at the bottom-right and tell us what happened — or email bugs@kibloo.app with screenshots if possible.",
      el: "Κλικ στο πράσινο «Πες μας γνώμη» κάτω δεξιά και πες μας τι συνέβη — ή email στο bugs@kibloo.app με screenshots αν γίνεται.",
    },
  },
  {
    cat: ["tech"],
    q: { en: "Where can I check if the site is down?", el: "Πού βλέπω αν το site είναι down;" },
    a: {
      en: "Visit our public Status Page at /status — it shows real-time health of authentication, database, and cloud functions.",
      el: "Επισκέψου το /status — δείχνει real-time κατάσταση των authentication, database και cloud functions.",
    },
  },
];

// ─── Categories ──────────────────────────────────────────
const CATEGORIES = [
  { id: "all", emoji: "📋", label: { el: "Όλα", en: "All" } },
  { id: "general", emoji: "🌍", label: { el: "Γενικά", en: "General" } },
  { id: "student", emoji: "🎓", label: { el: "Μαθητής", en: "Student" } },
  { id: "parent", emoji: "👨‍👩‍👧", label: { el: "Γονιός", en: "Parent" } },
  { id: "teacher", emoji: "👨‍🏫", label: { el: "Δάσκαλος", en: "Teacher" } },
  { id: "subscription", emoji: "💳", label: { el: "Συνδρομές", en: "Subscriptions" } },
  { id: "tech", emoji: "🔧", label: { el: "Tech & Privacy", en: "Tech & Privacy" } },
];

export default function FAQPage() {
  const navigate = useNavigate();
  const { lang } = useContext(LanguageContext);
  const isEl = lang === "el";
  const L = isEl ? "el" : "en";

  const [openIndex, setOpenIndex] = useState(null);
  const [activeCat, setActiveCat] = useState("all");
  const [query, setQuery] = useState("");

  const title = isEl ? "Κέντρο Βοήθειας" : "Help Center";
  const subtitle = isEl
    ? "Βρες γρήγορες απαντήσεις στις πιο συχνές ερωτήσεις."
    : "Find quick answers to the most common questions.";

  // Filter FAQs based on active category + search query
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FAQ_ITEMS.filter((item) => {
      const inCategory = activeCat === "all" || item.cat.includes(activeCat);
      if (!inCategory) return false;
      if (!q) return true;
      const haystack = `${item.q[L]} ${item.a[L]}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [activeCat, query, L]);

  return (
    <div id="main-content" className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <SEO
        title={title}
        description={subtitle}
        faq={FAQ_ITEMS.map((it) => ({
          question: it.q[L],
          answer: it.a[L],
        }))}
      />
      <Navbar />

      <div className="pt-24 pb-16 px-4">
        <div className="mx-auto max-w-4xl">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 mb-6 flex items-center gap-1 font-medium transition-colors"
          >
            &larr; {isEl ? "Πίσω" : "Back"}
          </button>

          {/* Hero */}
          <div className="mb-8">
            <span className="inline-block px-4 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-sm font-semibold mb-4">
              {isEl ? "💬 Βοήθεια" : "💬 Help"}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">
              {title}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">{subtitle}</p>

            {/* Search bar */}
            {FeatureFlagService.isEnabled("helpCenter_search") && (
            <div className="relative mb-6">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={isEl ? "Αναζήτηση... (π.χ. «πώς ακυρώνω συνδρομή»)" : "Search... (e.g. \"how to cancel subscription\")"}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                aria-label={isEl ? "Αναζήτηση στις ερωτήσεις" : "Search questions"}
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  aria-label={isEl ? "Καθαρισμός" : "Clear"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500"
                >
                  ×
                </button>
              )}
            </div>
            )}

            {/* Category tabs */}
            {FeatureFlagService.isEnabled("helpCenter_categories") && (
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => {
                const active = activeCat === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => { setActiveCat(c.id); setOpenIndex(null); }}
                    className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
                      active
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                    }`}
                    aria-pressed={active}
                  >
                    <span aria-hidden="true">{c.emoji}</span> {c.label[L]}
                  </button>
                );
              })}
            </div>
            )}
          </div>

          {/* Results count */}
          <div className="text-sm text-slate-500 dark:text-slate-400 mb-3">
            {filteredItems.length === 0
              ? (isEl ? "Δεν βρέθηκαν αποτελέσματα." : "No results.")
              : (isEl
                  ? `${filteredItems.length} ${filteredItems.length === 1 ? "ερώτηση" : "ερωτήσεις"}`
                  : `${filteredItems.length} ${filteredItems.length === 1 ? "question" : "questions"}`)
            }
          </div>

          {/* Accordion */}
          {filteredItems.length === 0 ? (
            <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-8 text-center">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2">
                {isEl ? "Δεν βρήκαμε κάτι σχετικό" : "Nothing found"}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                {isEl
                  ? "Δοκίμασε διαφορετικές λέξεις-κλειδιά ή επικοινώνησε μαζί μας."
                  : "Try different keywords or contact us directly."}
              </p>
              <a
                href="mailto:support@kibloo.app"
                className="inline-block px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition"
              >
                ✉️ {isEl ? "Στείλε email" : "Email us"}
              </a>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredItems.map((item, idx) => {
                const isOpen = openIndex === idx;
                const q = item.q[L];
                const a = item.a[L];
                return (
                  <div
                    key={idx}
                    className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left"
                      aria-expanded={isOpen}
                    >
                      <span className="font-semibold text-slate-800 dark:text-slate-100">
                        {q}
                      </span>
                      <span
                        className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </button>
                    <div
                      className={`grid transition-all duration-300 ease-in-out ${
                        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="px-6 pb-4 pt-0">
                          <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                            {a}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Still need help CTA */}
          {FeatureFlagService.isEnabled("helpCenter_contactCta") && (
          <div className="mt-10 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 text-white p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold mb-1">
                  {isEl ? "Δεν βρήκες αυτό που έψαχνες;" : "Didn't find what you were looking for?"}
                </h3>
                <p className="text-sm text-white/90">
                  {isEl
                    ? "Είμαστε εδώ για σένα. Συνήθως απαντάμε σε λιγότερο από 24 ώρες."
                    : "We're here for you. We usually reply in less than 24 hours."}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  href="mailto:support@kibloo.app"
                  className="px-4 py-2 rounded-lg bg-white text-purple-700 hover:bg-purple-50 font-semibold text-sm transition shadow"
                >
                  ✉️ {isEl ? "Email" : "Email"}
                </a>
                <a
                  href="/contact"
                  className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white font-semibold text-sm transition border border-white/40"
                >
                  💬 {isEl ? "Φόρμα" : "Contact form"}
                </a>
                <a
                  href="/status"
                  className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white font-semibold text-sm transition border border-white/40"
                >
                  🟢 {isEl ? "Status" : "Status"}
                </a>
              </div>
            </div>
          </div>
          )}

          {/* Quick links */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-sm">
            <a href="/privacy" className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition">
              <div className="text-2xl mb-1">📜</div>
              <div className="font-semibold text-slate-700 dark:text-slate-200">{isEl ? "Απόρρητο" : "Privacy"}</div>
            </a>
            <a href="/terms" className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition">
              <div className="text-2xl mb-1">📋</div>
              <div className="font-semibold text-slate-700 dark:text-slate-200">{isEl ? "Όροι" : "Terms"}</div>
            </a>
            <a href="/cookies" className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition">
              <div className="text-2xl mb-1">🍪</div>
              <div className="font-semibold text-slate-700 dark:text-slate-200">Cookies</div>
            </a>
            <a href="/blog" className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition">
              <div className="text-2xl mb-1">📰</div>
              <div className="font-semibold text-slate-700 dark:text-slate-200">Blog</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
