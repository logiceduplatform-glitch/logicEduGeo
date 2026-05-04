import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import { AuthContext } from "../auth/AuthContext";
import SEO from "../components/SEO";
import Navbar from "../components/Navbar";
import FooterSection from "../components/FooterSection";

const FEATURES = {
  el: [
    {
      icon: "🏫",
      title: "Δημιουργία μόνιμης τάξης",
      desc: "Φτιάξτε την τάξη σας με έναν μοναδικό κωδικό. Οι μαθητές εγγράφονται μία φορά και παραμένουν για πάντα.",
    },
    {
      icon: "📝",
      title: "Δημιουργία & ανάθεση Quiz",
      desc: "Δημιουργήστε custom quiz ή χρησιμοποιήστε τα 350+ έτοιμα παιχνίδια. Αναθέστε τα στην τάξη σας με ένα κλικ.",
    },
    {
      icon: "📊",
      title: "Αναλυτικά στατιστικά",
      desc: "Δείτε σε πραγματικό χρόνο τα αποτελέσματα, τον μέσο όρο, τους top μαθητές και πού δυσκολεύονται.",
    },
    {
      icon: "📢",
      title: "Ανακοινώσεις τάξης",
      desc: "Στείλτε ανακοινώσεις σε όλους τους μαθητές σας. Notification dot τους ειδοποιεί αυτόματα.",
    },
    {
      icon: "💬",
      title: "Feedback ανά μαθητή",
      desc: "Σχολιάστε τα αποτελέσματα κάθε μαθητή ξεχωριστά. Τα σχόλια εμφανίζονται στον μαθητή.",
    },
    {
      icon: "🔗",
      title: "Γρήγοροι κωδικοί Quiz",
      desc: "Μοιραστείτε κωδικούς quiz για γρήγορα τεστ χωρίς εγγραφή σε τάξη. Ιδανικό για one-time challenges.",
    },
    {
      icon: "👶",
      title: "Λειτουργία μαθητή",
      desc: "Προσθέστε παιδικά προφίλ στον λογαριασμό σας για να δοκιμάσετε τα παιχνίδια ως μαθητής.",
    },
    {
      icon: "🏆",
      title: "Leaderboard τάξης",
      desc: "Αυτόματος πίνακας κατάταξης που κρατά τα κίνητρα ψηλά με υγιή ανταγωνισμό.",
    },
  ],
  en: [
    {
      icon: "🏫",
      title: "Create a permanent classroom",
      desc: "Build your classroom with a unique code. Students enroll once and stay forever.",
    },
    {
      icon: "📝",
      title: "Create & assign quizzes",
      desc: "Create custom quizzes or use 350+ ready-made games. Assign them to your class with one click.",
    },
    {
      icon: "📊",
      title: "Detailed analytics",
      desc: "See real-time results, averages, top students, and where they struggle.",
    },
    {
      icon: "📢",
      title: "Class announcements",
      desc: "Send announcements to all your students. A notification dot alerts them automatically.",
    },
    {
      icon: "💬",
      title: "Per-student feedback",
      desc: "Comment on each student's results individually. Comments are shown to the student.",
    },
    {
      icon: "🔗",
      title: "Quick quiz codes",
      desc: "Share quiz codes for quick tests without classroom enrollment. Perfect for one-time challenges.",
    },
    {
      icon: "👶",
      title: "Student mode",
      desc: "Add child profiles to your account to test games as a student would experience them.",
    },
    {
      icon: "🏆",
      title: "Class leaderboard",
      desc: "Automatic ranking board that keeps motivation high with healthy competition.",
    },
  ],
};

const STEPS = {
  el: [
    { step: "1", icon: "📧", title: "Εγγραφείτε δωρεάν", desc: "Επιλέξτε ρόλο «Δάσκαλος» κατά την εγγραφή" },
    { step: "2", icon: "🏫", title: "Δημιουργήστε τάξη", desc: "Δώστε όνομα και λάβετε τον μοναδικό κωδικό" },
    { step: "3", icon: "📤", title: "Μοιραστείτε τον κωδικό", desc: "Στείλτε τον κωδικό στους μαθητές σας" },
    { step: "4", icon: "🎯", title: "Αναθέστε quiz", desc: "Επιλέξτε παιχνίδια και αναθέστε τα στην τάξη" },
  ],
  en: [
    { step: "1", icon: "📧", title: "Sign up for free", desc: "Select 'Teacher' role during registration" },
    { step: "2", icon: "🏫", title: "Create a classroom", desc: "Name it and receive your unique code" },
    { step: "3", icon: "📤", title: "Share the code", desc: "Send the code to your students" },
    { step: "4", icon: "🎯", title: "Assign quizzes", desc: "Pick games and assign them to your class" },
  ],
};

const TESTIMONIALS = {
  el: [
    {
      text: "Επιτέλους μια πλατφόρμα που μπορώ να χρησιμοποιήσω στην τάξη χωρίς πολύπλοκες ρυθμίσεις!",
      name: "Μαρία Κ.",
      role: "Δασκάλα Δ' Δημοτικού",
    },
    {
      text: "Τα παιδιά ζητάνε μόνα τους να κάνουν τα quiz. Αυτό λέει πολλά!",
      name: "Γιώργος Π.",
      role: "Εκπαιδευτικός Γ' Δημοτικού",
    },
    {
      text: "Το feedback ανά μαθητή και τα στατιστικά τάξης με βοηθούν πολύ στη διαφοροποίηση.",
      name: "Ελένη Δ.",
      role: "Νηπιαγωγός",
    },
  ],
  en: [
    {
      text: "Finally a platform I can use in my classroom without complicated setup!",
      name: "Maria K.",
      role: "4th Grade Teacher",
    },
    {
      text: "The kids ask to do the quizzes on their own. That says a lot!",
      name: "George P.",
      role: "3rd Grade Educator",
    },
    {
      text: "Per-student feedback and class analytics help me differentiate instruction.",
      name: "Helen D.",
      role: "Kindergarten Teacher",
    },
  ],
};

export default function ForTeachersPage() {
  const { lang } = useContext(LanguageContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const isEl = lang === "el";
  const l = isEl ? "el" : "en";
  const features = FEATURES[l];
  const steps = STEPS[l];
  const testimonials = TESTIMONIALS[l];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <SEO
        title={isEl ? "Για Εκπαιδευτικούς" : "For Teachers"}
        description={isEl
          ? "Δημιουργήστε τάξεις, αναθέστε quiz και παρακολουθήστε την πρόοδο κάθε μαθητή. Δωρεάν εργαλεία για εκπαιδευτικούς."
          : "Create classrooms, assign quizzes, and track every student's progress. Free tools for educators."}
      />
      <Navbar />

      {/* HERO */}
      <section className="pt-24 pb-16 sm:pt-28 sm:pb-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 text-[120px]">📚</div>
          <div className="absolute bottom-10 right-10 text-[100px]">🎓</div>
          <div className="absolute top-40 right-40 text-[80px]">✏️</div>
        </div>
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-semibold mb-6 backdrop-blur">
            {isEl ? "Για Εκπαιδευτικούς" : "For Educators"}
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
            {isEl ? (
              <>Η τάξη σας,<br /><span className="text-amber-300">ψηφιακά αναβαθμισμένη</span></>
            ) : (
              <>Your classroom,<br /><span className="text-amber-300">digitally upgraded</span></>
            )}
          </h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed">
            {isEl
              ? "350+ εκπαιδευτικά παιχνίδια, δημιουργία τάξεων, ανάθεση quiz, αναλυτικά στατιστικά — όλα δωρεάν. Σχεδιασμένο από εκπαιδευτικούς, για εκπαιδευτικούς."
              : "350+ educational games, classroom creation, quiz assignment, detailed analytics — all free. Designed by educators, for educators."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(user ? "/teacher-dashboard" : "/auth")}
              className="px-8 py-4 rounded-2xl bg-white text-indigo-700 font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all"
            >
              {isEl
                ? (user ? "Πάμε στο Dashboard" : "Ξεκινήστε Δωρεάν")
                : (user ? "Go to Dashboard" : "Get Started Free")}
            </button>
            <button
              onClick={() => document.getElementById("how-it-works-teachers")?.scrollIntoView({ behavior: "smooth" })}
              className="px-8 py-4 rounded-2xl border-2 border-white/40 text-white font-bold text-lg hover:bg-white/10 transition-all"
            >
              {isEl ? "Δείτε πώς λειτουργεί" : "See how it works"}
            </button>
          </div>
        </div>
      </section>

      {/* KEY NUMBERS */}
      <section className="py-12 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
        <div className="mx-auto max-w-4xl px-4 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { val: "350+", label: isEl ? "Παιχνίδια" : "Games" },
            { val: "7", label: isEl ? "Ηλικιακές ομάδες" : "Age groups" },
            { val: "100%", label: isEl ? "Δωρεάν" : "Free" },
            { val: "0", label: isEl ? "Διαφημίσεις" : "Ads" },
          ].map((s, i) => (
            <div key={i}>
              <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">{s.val}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white mb-4">
              {isEl ? "Τι προσφέρουμε στους εκπαιδευτικούς" : "What we offer educators"}
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              {isEl
                ? "Εργαλεία που κάνουν τη διδασκαλία πιο αποτελεσματική και τη μάθηση πιο διασκεδαστική."
                : "Tools that make teaching more effective and learning more fun."}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <div
                key={i}
                className="group bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <span className="text-3xl block mb-4 group-hover:scale-110 transition-transform duration-300">{f.icon}</span>
                <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-2">{f.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works-teachers" className="py-16 sm:py-20 bg-indigo-50 dark:bg-slate-800/50">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white mb-14 text-center">
            {isEl ? "Πώς ξεκινάτε" : "How to get started"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="text-center">
                <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white dark:bg-slate-800 shadow-md mb-4">
                  <span className="text-3xl">{s.icon}</span>
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                    {s.step}
                  </span>
                </div>
                <h3 className="font-bold text-slate-800 dark:text-white mb-1">{s.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white mb-12 text-center">
            {isEl ? "Τι λένε οι εκπαιδευτικοί" : "What educators say"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm"
              >
                <div className="text-indigo-400 mb-3 text-3xl">"</div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4 italic">
                  {t.text}
                </p>
                <div>
                  <div className="font-bold text-slate-800 dark:text-white text-sm">{t.name}</div>
                  <div className="text-xs text-slate-400">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-900">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white mb-10 text-center">
            {isEl ? "Συχνές ερωτήσεις" : "Frequently asked questions"}
          </h2>
          <div className="space-y-3">
            {[
              {
                q: isEl ? "Είναι πραγματικά δωρεάν;" : "Is it really free?",
                a: isEl
                  ? "Ναι. Το βασικό πακέτο για εκπαιδευτικούς είναι 100% δωρεάν για πάντα. Premium χαρακτηριστικά (απεριόριστα custom quiz, advanced analytics) σε χαμηλή τιμή."
                  : "Yes. The base teacher plan is 100% free forever. Premium features (unlimited custom quizzes, advanced analytics) at a low price.",
              },
              {
                q: isEl ? "Χρειάζονται οι μαθητές μου email;" : "Do my students need an email?",
                a: isEl
                  ? "Όχι. Με το school student mode, οι μαθητές συνδέονται με QR code ή απλό username — ιδανικό για παιδιά κάτω των 13."
                  : "No. With school student mode, students log in via QR code or a simple username — perfect for kids under 13.",
              },
              {
                q: isEl ? "Συμμορφώνεται με GDPR/COPPA;" : "Are you GDPR/COPPA compliant?",
                a: isEl
                  ? "Ναι. Δεν συλλέγουμε προσωπικά δεδομένα από παιδιά <13 χωρίς γονική συγκατάθεση. Όλα τα δεδομένα παραμένουν στην ΕΕ."
                  : "Yes. We don't collect personal data from children <13 without parental consent. All data is stored in the EU.",
              },
              {
                q: isEl ? "Λειτουργεί σε tablet/Chromebook;" : "Does it work on tablets/Chromebooks?",
                a: isEl
                  ? "Ναι. Η Kibloo είναι responsive και τρέχει άψογα σε όλα τα μοντέρνα browsers — δεν χρειάζεται εγκατάσταση."
                  : "Yes. Kibloo is responsive and runs in any modern browser — no installation needed.",
              },
            ].map((item, i) => (
              <details
                key={i}
                className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
              >
                <summary className="px-5 py-4 cursor-pointer font-semibold text-slate-800 dark:text-white flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  {item.q}
                  <span className="text-indigo-500 group-open:rotate-45 transition-transform text-xl">+</span>
                </summary>
                <div className="px-5 pb-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST BADGES */}
      <section className="py-10 bg-white dark:bg-slate-800 border-y border-slate-100 dark:border-slate-700">
        <div className="mx-auto max-w-5xl px-4">
          <p className="text-center text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-6">
            {isEl ? "Εμπιστεύονται την Kibloo" : "Trusted by educators"}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 text-slate-400 dark:text-slate-500">
            <span className="flex items-center gap-2 text-sm font-semibold">🇪🇺 GDPR</span>
            <span className="flex items-center gap-2 text-sm font-semibold">👶 COPPA</span>
            <span className="flex items-center gap-2 text-sm font-semibold">🔒 SSL</span>
            <span className="flex items-center gap-2 text-sm font-semibold">♿ WCAG 2.1 AA</span>
            <span className="flex items-center gap-2 text-sm font-semibold">🚫 No ads</span>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            {isEl ? "Έτοιμοι να αναβαθμίσετε την τάξη σας;" : "Ready to upgrade your classroom?"}
          </h2>
          <p className="text-lg text-white/80 mb-8">
            {isEl
              ? "Εγγραφείτε δωρεάν σε 30 δευτερόλεπτα. Δεν χρειάζεται πιστωτική κάρτα. + 14 ημέρες δωρεάν Premium trial."
              : "Sign up free in 30 seconds. No credit card required. + 14-day free Premium trial."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(user ? "/teacher-dashboard" : "/auth")}
              className="px-10 py-4 rounded-2xl bg-white text-indigo-700 font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all"
            >
              {isEl
                ? (user ? "Μετάβαση στο Dashboard" : "Δημιουργία Δωρεάν Λογαριασμού")
                : (user ? "Go to Dashboard" : "Create Free Account")}
            </button>
            <button
              onClick={() => navigate("/subscription")}
              className="px-8 py-4 rounded-2xl border-2 border-white/40 text-white font-bold text-lg hover:bg-white/10 transition-all"
            >
              {isEl ? "Δείτε τα Premium πλάνα" : "See Premium plans"}
            </button>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
