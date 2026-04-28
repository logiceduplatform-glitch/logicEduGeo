import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";

const AGES = [
  {
    key: "2-3", icon: "👶", color: "from-rose-400 to-pink-500",
    skills: {
      el: ["Αναγνώριση χρωμάτων", "Σχήματα & μοτίβα", "Αριθμοί 1-10", "Ζώα & ήχοι", "Drag & Drop", "Puzzle"],
      en: ["Color recognition", "Shapes & patterns", "Numbers 1-10", "Animals & sounds", "Drag & Drop", "Puzzles"],
    },
    route: "/play/2-3-fun",
  },
  {
    key: "4-5", icon: "🧒", color: "from-violet-400 to-purple-500",
    skills: {
      el: ["Λογική σκέψη", "Memory Match", "Odd One Out", "Ταξινόμηση μεγέθους", "Σειροθέτηση", "Μοτίβα"],
      en: ["Logical thinking", "Memory Match", "Odd One Out", "Size sorting", "Sequencing", "Patterns"],
    },
    route: "/play/4-5-fun",
  },
  {
    key: "6", icon: "🎒", color: "from-blue-400 to-cyan-500",
    skills: {
      el: ["Μαθηματικά", "Ανάγνωση", "Γεωγραφία", "Φύση", "Σκάκι βασικά", "Λέξεις"],
      en: ["Mathematics", "Reading", "Geography", "Nature", "Chess basics", "Words"],
    },
    route: "/play/6-fun",
  },
  {
    key: "7-8", icon: "📖", color: "from-emerald-400 to-teal-500",
    skills: {
      el: ["Πολλαπλασιασμός", "Γραμματική", "Ιστορία", "Επιστήμη", "Κριτική σκέψη", "Στρατηγική"],
      en: ["Multiplication", "Grammar", "History", "Science", "Critical thinking", "Strategy"],
    },
    route: "/play/7-8-fun",
  },
  {
    key: "9-10", icon: "🔬", color: "from-amber-400 to-orange-500",
    skills: {
      el: ["Κλάσματα", "Γεωμετρία", "Φυσική", "Χημεία", "Γεωγραφία κόσμου", "Λογική"],
      en: ["Fractions", "Geometry", "Physics", "Chemistry", "World geography", "Logic"],
    },
    route: "/play/9-10-fun",
  },
  {
    key: "11-12", icon: "🎓", color: "from-indigo-400 to-purple-500",
    skills: {
      el: ["Άλγεβρα", "Ιστορία Ελλάδας", "Πολιτεία", "Τέχνη", "Τεχνολογία", "Υγεία"],
      en: ["Algebra", "Greek history", "Civics", "Art", "Technology", "Health"],
    },
    route: "/play/11-12-fun",
  },
  {
    key: "Adult", icon: "🧠", color: "from-slate-500 to-gray-600",
    skills: {
      el: ["Trivia", "Σκάκι", "Board Games", "Πολιτική", "Επιστήμη", "Φιλοσοφία"],
      en: ["Trivia", "Chess", "Board Games", "Politics", "Science", "Philosophy"],
    },
    route: "/play/adult-games",
  },
];

export default function CurriculumMapPage() {
  const navigate = useNavigate();
  const { lang } = useContext(LanguageContext);
  const isEl = lang === "el";

  return (
    <div id="main-content" className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <SEO title={isEl ? "Χάρτης Μαθημάτων" : "Curriculum Map"} />
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="mx-auto max-w-5xl">
          <button onClick={() => navigate(-1)} className="text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400 mb-6 flex items-center gap-1">
            &larr; {isEl ? "Πίσω" : "Back"}
          </button>

          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100 mb-3">
              {isEl ? "🗺️ Χάρτης Μαθημάτων" : "🗺️ Curriculum Map"}
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              {isEl
                ? "Δες τι δεξιότητες αναπτύσσει κάθε ηλικιακή ομάδα μέσα από τα παιχνίδια μας."
                : "See what skills each age group develops through our games."}
            </p>
          </div>

          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-rose-300 via-purple-300 to-indigo-300 dark:from-rose-700 dark:via-purple-700 dark:to-indigo-700" />

            <div className="space-y-8">
              {AGES.map((age, idx) => (
                <div key={age.key} className="relative pl-16 sm:pl-20">
                  {/* Timeline dot */}
                  <div className={`absolute left-3.5 sm:left-5.5 w-5 h-5 rounded-full bg-gradient-to-br ${age.color} shadow-lg border-2 border-white dark:border-slate-900`} />

                  <div
                    className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-shadow cursor-pointer group"
                    onClick={() => navigate(age.route)}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">{age.icon}</span>
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          {age.key === "Adult" ? (isEl ? "Ενήλικες" : "Adults") : `${isEl ? "Ηλικία" : "Age"} ${age.key}`}
                        </h3>
                        <p className="text-xs text-slate-400">{age.skills[isEl ? "el" : "en"].length} {isEl ? "δεξιότητες" : "skills"}</p>
                      </div>
                      <div className="ml-auto">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r ${age.color}`}>
                          {isEl ? "Εξερεύνηση →" : "Explore →"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {age.skills[isEl ? "el" : "en"].map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
