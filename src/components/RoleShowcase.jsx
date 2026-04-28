import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import { AuthContext } from "../auth/AuthContext";

const ROLES = {
  el: [
    {
      id: "teachers",
      icon: "👩‍🏫",
      title: "Δάσκαλοι",
      subtitle: "Δωρεάν για πάντα",
      gradient: "from-blue-500 to-indigo-600",
      lightBg: "bg-blue-50 dark:bg-blue-900/20",
      border: "border-blue-200 dark:border-blue-800",
      benefits: [
        "Δημιουργία quiz με πολλαπλούς τύπους ερωτήσεων",
        "Μόνιμες τάξεις με κωδικό εγγραφής",
        "Αναλυτικά στατιστικά & σκορ μαθητών",
        "Ανάθεση quiz & ανακοινώσεις τάξης",
        "Σχόλια σε αποτελέσματα μαθητών",
      ],
      cta: "Ξεκίνα ως Δάσκαλος",
      route: "/auth?mode=register",
      highlight: "100% δωρεάν — χωρίς κρυφές χρεώσεις",
    },
    {
      id: "parents",
      icon: "👨‍👩‍👧",
      title: "Γονείς",
      subtitle: "Ασφαλές περιβάλλον",
      gradient: "from-emerald-500 to-teal-600",
      lightBg: "bg-emerald-50 dark:bg-emerald-900/20",
      border: "border-emerald-200 dark:border-emerald-800",
      benefits: [
        "Πίνακας ελέγχου προόδου παιδιού",
        "Ρύθμιση χρονικού ορίου παιχνιδιού",
        "Προφίλ παιδιών με PIN κλείδωμα",
        "Εβδομαδιαίες αναφορές email",
        "Αγορά θεμάτων & αξεσουάρ",
      ],
      cta: "Ξεκίνα ως Γονέας",
      route: "/auth?mode=register",
      highlight: "Χωρίς διαφημίσεις — ασφαλές για παιδιά",
    },
    {
      id: "students",
      icon: "🧒",
      title: "Μαθητές",
      subtitle: "Μάθε παίζοντας",
      gradient: "from-amber-500 to-orange-500",
      lightBg: "bg-amber-50 dark:bg-amber-900/20",
      border: "border-amber-200 dark:border-amber-800",
      benefits: [
        "350+ παιχνίδια ανά ηλικία & κατηγορία",
        "Κέρδισε XP, badges & νομίσματα",
        "Ανέβα επίπεδο & ξεκλείδωσε πιστοποιητικά",
        "Καθημερινές αποστολές & challenges",
        "Leaderboard & online multiplayer",
      ],
      cta: "Δοκίμασε Δωρεάν",
      route: "/guest-setup",
      highlight: "Χωρίς εγγραφή — παίξε αμέσως",
    },
  ],
  en: [
    {
      id: "teachers",
      icon: "👩‍🏫",
      title: "Teachers",
      subtitle: "Free forever",
      gradient: "from-blue-500 to-indigo-600",
      lightBg: "bg-blue-50 dark:bg-blue-900/20",
      border: "border-blue-200 dark:border-blue-800",
      benefits: [
        "Create quizzes with multiple question types",
        "Permanent classrooms with enrollment codes",
        "Detailed statistics & student scores",
        "Quiz assignments & classroom announcements",
        "Feedback on student results",
      ],
      cta: "Start as Teacher",
      route: "/auth?mode=register",
      highlight: "100% free — no hidden fees",
    },
    {
      id: "parents",
      icon: "👨‍👩‍👧",
      title: "Parents",
      subtitle: "Safe environment",
      gradient: "from-emerald-500 to-teal-600",
      lightBg: "bg-emerald-50 dark:bg-emerald-900/20",
      border: "border-emerald-200 dark:border-emerald-800",
      benefits: [
        "Child progress dashboard",
        "Screen time limits",
        "Child profiles with PIN lock",
        "Weekly email reports",
        "Shop for themes & accessories",
      ],
      cta: "Start as Parent",
      route: "/auth?mode=register",
      highlight: "Zero ads — safe for children",
    },
    {
      id: "students",
      icon: "🧒",
      title: "Students",
      subtitle: "Learn by playing",
      gradient: "from-amber-500 to-orange-500",
      lightBg: "bg-amber-50 dark:bg-amber-900/20",
      border: "border-amber-200 dark:border-amber-800",
      benefits: [
        "350+ games by age & category",
        "Earn XP, badges & coins",
        "Level up & unlock certificates",
        "Daily missions & challenges",
        "Leaderboard & online multiplayer",
      ],
      cta: "Try Free",
      route: "/guest-setup",
      highlight: "No signup required — play now",
    },
  ],
};

export default function RoleShowcase() {
  const navigate = useNavigate();
  const { lang } = useContext(LanguageContext);
  const { user, guest } = useContext(AuthContext);
  const isEl = lang === "el";
  const roles = ROLES[isEl ? "el" : "en"];
  const [activeTab, setActiveTab] = useState("teachers");
  const isLoggedIn = !!(user || guest);

  return (
    <section className="py-14 sm:py-20 bg-white dark:bg-slate-800/50">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-sm font-semibold mb-4">
            {isEl ? "Για ποιον είναι" : "Who it's for"}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white mb-3">
            {isEl ? "Σχεδιασμένο για κάθε ρόλο" : "Designed for every role"}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            {isEl
              ? "Δάσκαλοι, γονείς ή μαθητές — η πλατφόρμα προσαρμόζεται σε εσάς."
              : "Teachers, parents, or students — the platform adapts to you."}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-10">
          {roles.map((r) => (
            <button
              key={r.id}
              onClick={() => setActiveTab(r.id)}
              className={`px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-sm font-bold transition-all duration-300 ${
                activeTab === r.id
                  ? `bg-gradient-to-r ${r.gradient} text-white shadow-lg scale-105`
                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
              }`}
            >
              <span className="mr-1.5">{r.icon}</span>
              {r.title}
            </button>
          ))}
        </div>

        {/* Active role card */}
        {roles.filter((r) => r.id === activeTab).map((role) => (
          <div
            key={role.id}
            className={`${role.lightBg} rounded-3xl border ${role.border} p-8 sm:p-10 max-w-3xl mx-auto`}
          >
            <div className="flex flex-col sm:flex-row gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl">{role.icon}</span>
                  <div>
                    <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white">{role.title}</h3>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{role.subtitle}</p>
                  </div>
                </div>

                <ul className="mt-6 space-y-3">
                  {role.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className={`w-6 h-6 rounded-full bg-gradient-to-br ${role.gradient} flex items-center justify-center shrink-0 mt-0.5`}>
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-sm sm:text-base text-slate-700 dark:text-slate-200 font-medium">{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {!isLoggedIn && (
                    <button
                      onClick={() => navigate(role.route)}
                      className={`px-7 py-3.5 rounded-2xl bg-gradient-to-r ${role.gradient} text-white font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-sm sm:text-base`}
                    >
                      {role.cta}
                    </button>
                  )}
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    {role.highlight}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
