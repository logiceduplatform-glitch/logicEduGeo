import React, { useContext } from "react";
import { LanguageContext } from "../i18n/LanguageContext";

/**
 * Side-by-side comparison vs popular alternatives.
 * Honest comparison with competitor names blurred ("Competitor A/B/C") to
 * stay legally safe (no trademark issues) while still being useful.
 *
 * The mapping in the comments below is what we tell prospective customers
 * informally: A = Prodigy (math RPG), B = Khan Academy Kids, C = ABCmouse.
 */

const T = {
  el: {
    eyebrow: "Σύγκριση",
    title: "Γιατί η Kibloo;",
    sub: "Εμείς και ο ανταγωνισμός — με ειλικρίνεια.",
    features: "Χαρακτηριστικά",
    us: "Kibloo",
    a: "Ανταγωνιστής A",
    b: "Ανταγωνιστής B",
    c: "Ανταγωνιστής C",
    yes: "Ναι",
    no: "Όχι",
    rows: [
      { f: "Παιχνίδια όλων των ηλικιών (2–12)", us: "yes", a: "no",  b: "yes", c: "yes",  note: "Οι περισσότεροι καλύπτουν 1 εύρος" },
      { f: "Πλήρως δωρεάν trial",                us: "yes", a: "yes", b: "yes", c: "limited" },
      { f: "Διαθέσιμο σε Ελληνικά",              us: "yes", a: "no",  b: "no",  c: "no" },
      { f: "Λειτουργεί χωρίς λογαριασμό (guest)",us: "yes", a: "no",  b: "no",  c: "no" },
      { f: "Multiplayer & ομαδικά",              us: "yes", a: "yes", b: "no",  c: "no" },
      { f: "Λειτουργικότητα δασκάλου / σχολείου",us: "yes", a: "yes", b: "no",  c: "yes" },
      { f: "Γονικός έλεγχος + reports",          us: "yes", a: "yes", b: "limited", c: "yes" },
      { f: "AI Tutor & δημιουργία φύλλων",       us: "yes", a: "no",  b: "no",  c: "no" },
      { f: "Χωρίς διαφημίσεις",                  us: "yes", a: "yes", b: "yes", c: "yes" },
      { f: "Ελληνική νομοθεσία (DPA, GDPR)",     us: "yes", a: "no",  b: "no",  c: "no" },
    ],
    foot: "Σύγκριση βάσει δημοσίως διαθέσιμων πληροφοριών · Μάιος 2026",
  },
  en: {
    eyebrow: "Comparison",
    title: "Why Kibloo?",
    sub: "Us vs alternatives — honestly.",
    features: "Features",
    us: "Kibloo",
    a: "Competitor A",
    b: "Competitor B",
    c: "Competitor C",
    yes: "Yes",
    no: "No",
    rows: [
      { f: "Games for all ages (2–12)",          us: "yes", a: "no",  b: "yes", c: "yes" },
      { f: "Free trial available",               us: "yes", a: "yes", b: "yes", c: "limited" },
      { f: "Available in Greek",                 us: "yes", a: "no",  b: "no",  c: "no" },
      { f: "Works without account (guest mode)", us: "yes", a: "no",  b: "no",  c: "no" },
      { f: "Multiplayer & group play",           us: "yes", a: "yes", b: "no",  c: "no" },
      { f: "Teacher / school dashboard",         us: "yes", a: "yes", b: "no",  c: "yes" },
      { f: "Parental control + reports",         us: "yes", a: "yes", b: "limited", c: "yes" },
      { f: "AI tutor & worksheet generator",     us: "yes", a: "no",  b: "no",  c: "no" },
      { f: "Ad-free experience",                 us: "yes", a: "yes", b: "yes", c: "yes" },
      { f: "EU/GR-law compliant (DPA, GDPR)",    us: "yes", a: "no",  b: "no",  c: "no" },
    ],
    foot: "Comparison based on publicly available information · May 2026",
  },
};

function Cell({ value, dim }) {
  if (value === "yes") {
    return (
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-bold">
        ✓
      </span>
    );
  }
  if (value === "no") {
    return (
      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full ${dim ? "bg-slate-100 dark:bg-slate-700 text-slate-400" : "bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-300"} font-bold`}>
        ✕
      </span>
    );
  }
  if (value === "limited") {
    return (
      <span className="inline-flex items-center justify-center px-2 h-7 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-xs font-bold">
        ~
      </span>
    );
  }
  return null;
}

export default function ComparisonSection() {
  const { lang } = useContext(LanguageContext);
  const l = T[lang === "el" ? "el" : "en"];

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-sm font-bold tracking-wide uppercase mb-3">
            {l.eyebrow}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white">
            {l.title}
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">{l.sub}</p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60">
                <th className="text-left px-5 py-4 font-bold text-slate-700 dark:text-slate-200">
                  {l.features}
                </th>
                <th className="text-center px-3 py-4">
                  <div className="inline-flex flex-col items-center gap-1">
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-extrabold shadow">
                      {l.us}
                    </span>
                  </div>
                </th>
                <th className="text-center px-3 py-4 font-semibold text-slate-500 dark:text-slate-400">{l.a}</th>
                <th className="text-center px-3 py-4 font-semibold text-slate-500 dark:text-slate-400">{l.b}</th>
                <th className="text-center px-3 py-4 font-semibold text-slate-500 dark:text-slate-400">{l.c}</th>
              </tr>
            </thead>
            <tbody>
              {l.rows.map((row, i) => (
                <tr
                  key={i}
                  className={`border-b border-slate-100 dark:border-slate-700 last:border-0 ${i % 2 ? "bg-slate-50/50 dark:bg-slate-800/30" : ""}`}
                >
                  <td className="px-5 py-3 font-medium text-slate-700 dark:text-slate-200">
                    {row.f}
                  </td>
                  <td className="text-center px-3 py-3">
                    <Cell value={row.us} />
                  </td>
                  <td className="text-center px-3 py-3"><Cell value={row.a} dim /></td>
                  <td className="text-center px-3 py-3"><Cell value={row.b} dim /></td>
                  <td className="text-center px-3 py-3"><Cell value={row.c} dim /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400 italic">
          {l.foot}
        </p>
      </div>
    </section>
  );
}
