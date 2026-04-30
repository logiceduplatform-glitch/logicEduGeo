import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import { LanguageContext } from "../i18n/LanguageContext";

const VALUES = [
  {
    key: "safety",
    icon: "🛡️",
    en: { title: "Safety", desc: "We prioritize child safety with age-appropriate content, no ads, and GDPR-compliant data practices." },
    el: { title: "Ασφάλεια", desc: "Δίνουμε προτεραιότητα στην ασφάλεια των παιδιών με περιεχόμενο κατάλληλο για την ηλικία, χωρίς διαφημίσεις και συμμορφώσιμο με το GDPR." },
  },
  {
    key: "learning",
    icon: "📚",
    en: { title: "Learning", desc: "Every game is designed with clear learning goals—math, logic, language, and critical thinking." },
    el: { title: "Μάθηση", desc: "Κάθε παιχνίδι σχεδιάστηκε με σαφή εκπαιδευτικούς στόχους—μαθηματικά, λογική, γλώσσα και κριτική σκέψη." },
  },
  {
    key: "fun",
    icon: "🎮",
    en: { title: "Fun", desc: "Learning through play keeps children engaged. We believe the best learning happens when kids enjoy themselves." },
    el: { title: "Διασκέδαση", desc: "Η μάθηση μέσω του παιχνιδιού κρατά τα παιδιά ενεργά. Πιστεύουμε ότι η καλύτερη μάθηση γίνεται όταν τα παιδιά διασκεδάζουν." },
  },
  {
    key: "accessibility",
    icon: "🌐",
    en: { title: "Accessibility", desc: "Free core access, works on any device, and supports both Greek and English." },
    el: { title: "Προσβασιμότητα", desc: "Δωρεάν βασική πρόσβαση, λειτουργία σε οποιαδήποτε συσκευή και υποστήριξη σε Ελληνικά και Αγγλικά." },
  },
];

const STATS = [
  { value: "350+", en: "games", el: "παιχνίδια" },
  { value: "6", en: "age groups", el: "ηλικιακές ομάδες" },
  { value: "10+", en: "subjects", el: "μαθήματα" },
];

const MISSION = {
  en: {
    title: "Our Mission",
    body: "We believe every child deserves access to high-quality educational content that sparks curiosity and grows with them. Kibloo combines playful games with real learning outcomes—helping kids ages 2–12 build skills in math, logic, language, and more. We're built by educators and developers who care about safe, engaging, and meaningful learning.",
  },
  el: {
    title: "Η Αποστολή μας",
    body: "Πιστεύουμε ότι κάθε παιδί αξίζει πρόσβαση σε ποιοτικό εκπαιδευτικό περιεχόμενο που αναζωπυρώνει την περιέργεια και αναπτύσσεται μαζί του. Το Kibloo συνδυάζει διασκεδαστικά παιχνίδια με πραγματικά μαθησιακά αποτελέσματα—βοηθώντας τα παιδιά 2–12 ετών να αναπτύξουν δεξιότητες σε μαθηματικά, λογική, γλώσσα και άλλα. Είμαστε φτιαγμένοι από εκπαιδευτικούς και προγραμματιστές που νοιάζονται για ασφαλή, ελκυστική και ουσιαστική μάθηση.",
  },
};

const TEAM = {
  en: "A team of educators and developers passionate about learning through play.",
  el: "Μία ομάδα εκπαιδευτικών και προγραμματιστών με πάθος για τη μάθηση μέσω του παιχνιδιού.",
};

export default function AboutPage() {
  const navigate = useNavigate();
  const { lang } = useContext(LanguageContext);
  const isEl = lang === "el";
  const m = MISSION[isEl ? "el" : "en"];

  const title = isEl ? "Σχετικά με εμάς" : "About us";

  return (
    <div id="main-content" className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <SEO
        title={title}
        description={isEl ? "Μάθετε για το Kibloo και την αποστολή μας" : "Learn about Kibloo and our mission"}
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
          <div className="mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-sm font-semibold mb-4">
              {isEl ? "Σχετικά" : "About"}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100 mb-4">
              {title}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
              {isEl
                ? "Εκπαιδευτική πλατφόρμα για παιδιά 2–12 ετών. Μάθηση μέσα από τη διασκέδαση."
                : "Educational platform for kids ages 2–12. Learning through play."}
            </p>
          </div>

          {/* Mission */}
          <section className="mb-14">
            <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-100 dark:border-purple-800/50 p-8 sm:p-10">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                {m.title}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {m.body}
              </p>
            </div>
          </section>

          {/* Values */}
          <section className="mb-14">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">
              {isEl ? "Οι αξίες μας" : "Our Values"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {VALUES.map((v) => {
                const c = v[isEl ? "el" : "en"];
                return (
                  <div
                    key={v.key}
                    className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <span className="text-3xl mb-3 block">{v.icon}</span>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2">
                      {c.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {c.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Team */}
          <section className="mb-14">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">
              {isEl ? "Η ομάδα μας" : "Our Team"}
            </h2>
            <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-8 flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl shrink-0">
                👥
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {TEAM[isEl ? "el" : "en"]}
              </p>
            </div>
          </section>

          {/* Stats */}
          <section className="mb-14">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">
              {isEl ? "Στατιστικά" : "By the numbers"}
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {STATS.map((s, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 text-center shadow-sm"
                >
                  <p className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {s.value}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {s[isEl ? "el" : "en"]}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section>
            <div className="rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 p-8 sm:p-10 text-center">
              <h2 className="text-xl font-bold text-white mb-2">
                {isEl ? "Ξεκινήστε τώρα" : "Get started today"}
              </h2>
              <p className="text-purple-100 mb-6 max-w-md mx-auto">
                {isEl
                  ? "Δημιουργήστε δωρεάν λογαριασμό ή δοκιμάστε ως επισκέπτης."
                  : "Create a free account or try as a guest."}
              </p>
              <button
                onClick={() => navigate("/auth?mode=register")}
                className="px-8 py-3 rounded-xl font-bold bg-white text-purple-700 hover:bg-purple-50 shadow-lg transition-all"
              >
                {isEl ? "Εγγραφή" : "Sign up"}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
