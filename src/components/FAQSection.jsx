import React, { useState, useContext } from "react";
import { LanguageContext } from "../i18n/LanguageContext";

export const FAQS = {
  el: [
    { q: "Είναι δωρεάν;", a: "Ναι! Η βασική πλατφόρμα είναι δωρεάν. Δημιούργησε λογαριασμό ή δοκίμασε ως επισκέπτης. Για πρόσθετες δυνατότητες υπάρχουν προαιρετικά Premium πλάνα." },
    { q: "Για ποιες ηλικίες είναι;", a: "Η πλατφόρμα καλύπτει ηλικίες 2-12 ετών και ενήλικες, με ξεχωριστό περιεχόμενο ανά ηλικιακή ομάδα (2-3, 4-5, 6, 7-8, 9-10, 11-12, ενήλικες)." },
    { q: "Είναι ασφαλές για τα παιδιά;", a: "Απολύτως. Χωρίς διαφημίσεις, χωρίς κοινοποίηση δεδομένων σε τρίτους. 100% εκπαιδευτικό περιεχόμενο. Συμμόρφωση με GDPR." },
    { q: "Πώς λειτουργεί για δασκάλους;", a: "Οι δάσκαλοι μπορούν δωρεάν να δημιουργούν quiz, να φτιάχνουν μόνιμες τάξεις, να αναθέτουν εργασίες και να παρακολουθούν στατιστικά μαθητών." },
    { q: "Χρειάζεται εγκατάσταση;", a: "Όχι! Η πλατφόρμα λειτουργεί στον browser — κινητό, tablet ή υπολογιστή. Μπορείς επίσης να την προσθέσεις ως εφαρμογή (PWA)." },
    { q: "Πώς παρακολουθώ την πρόοδο;", a: "Κάθε παιχνίδι καταγράφει σκορ, streaks και XP. Στο προφίλ σου βλέπεις στατιστικά, επιτεύγματα και εβδομαδιαίες αναφορές. Οι γονείς έχουν δικό τους dashboard." },
  ],
  en: [
    { q: "Is it free?", a: "Yes! The core platform is free. Create an account or try as guest. Optional Premium plans are available for additional features." },
    { q: "What ages is it for?", a: "The platform covers ages 2-12 and adults, with dedicated content for each age group (2-3, 4-5, 6, 7-8, 9-10, 11-12, adults)." },
    { q: "Is it safe for kids?", a: "Absolutely. No ads, no data sharing with third parties. 100% educational content. GDPR compliant." },
    { q: "How does it work for teachers?", a: "Teachers can create quizzes, set up permanent classrooms, assign work, and track student statistics — all for free." },
    { q: "Do I need to install anything?", a: "No! The platform works directly in your browser — phone, tablet, or computer. You can also add it as an app (PWA)." },
    { q: "How does progress tracking work?", a: "Every game records scores, streaks, and XP. Your profile shows statistics, achievements, and weekly reports. Parents get their own dashboard." },
  ],
};

export default function FAQSection() {
  const { lang } = useContext(LanguageContext);
  const isEl = lang === "el";
  const faqs = FAQS[isEl ? "el" : "en"];
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <section id="faq" className="py-20 bg-slate-50 dark:bg-slate-900">
      <div className="mx-auto max-w-3xl px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 text-sm font-semibold mb-4">
            {isEl ? "Συχνές Ερωτήσεις" : "FAQ"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white">
            {isEl ? "Έχεις απορίες;" : "Got questions?"}
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIdx === i;
            return (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden transition-shadow hover:shadow-md"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-slate-800 dark:text-white text-sm sm:text-base">
                    {faq.q}
                  </span>
                  <svg
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
