import React, { useState, useContext } from "react";
import { LanguageContext } from "../i18n/LanguageContext";

const FAQS = {
  el: [
    { q: "Είναι δωρεάν;", a: "Ναι! Μπορείς να παίξεις 5 παιχνίδια ανά κατηγορία δωρεάν. Αναβάθμισε σε Premium για πλήρη πρόσβαση σε 350+ παιχνίδια." },
    { q: "Για ποιες ηλικίες είναι;", a: "Η πλατφόρμα καλύπτει ηλικίες 2-12 ετών και ενήλικες, με ξεχωριστό περιεχόμενο ανά ηλικιακή ομάδα." },
    { q: "Είναι ασφαλές για τα παιδιά;", a: "Απολύτως. Δεν υπάρχουν διαφημίσεις, δεν μοιραζόμαστε δεδομένα με τρίτους, και το περιεχόμενο είναι 100% εκπαιδευτικό." },
    { q: "Μπορώ να ακυρώσω τη συνδρομή;", a: "Ναι, μπορείς να ακυρώσεις οποτεδήποτε. Υπάρχει 7-ημερη δωρεάν δοκιμή σε όλα τα πλάνα." },
    { q: "Χρειάζεται εγκατάσταση;", a: "Όχι! Η πλατφόρμα λειτουργεί απευθείας στον browser — κινητό, tablet ή υπολογιστή. Μπορείς επίσης να την προσθέσεις ως εφαρμογή." },
    { q: "Πώς παρακολουθώ την πρόοδο;", a: "Κάθε παιχνίδι καταγράφει σκορ, streaks και XP. Στο προφίλ σου βλέπεις στατιστικά, επιτεύγματα και εβδομαδιαίες αναφορές." },
  ],
  en: [
    { q: "Is it free?", a: "Yes! You can play 5 games per category for free. Upgrade to Premium for full access to 350+ games." },
    { q: "What ages is it for?", a: "The platform covers ages 2-12 and adults, with dedicated content for each age group." },
    { q: "Is it safe for kids?", a: "Absolutely. No ads, no data sharing with third parties, and 100% educational content." },
    { q: "Can I cancel my subscription?", a: "Yes, you can cancel anytime. All paid plans include a 7-day free trial." },
    { q: "Do I need to install anything?", a: "No! The platform works directly in your browser — phone, tablet, or computer. You can also add it as an app." },
    { q: "How does progress tracking work?", a: "Every game records scores, streaks, and XP. Your profile shows statistics, achievements, and weekly reports." },
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
