import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import { LanguageContext } from "../i18n/LanguageContext";

const FAQ_ITEMS = [
  {
    q: { en: "What is GeoLo Platform?", el: "Τι είναι το GeoLo Platform;" },
    a: {
      en: "GeoLo Platform is an interactive learning environment where children ages 2–12 can play games that help them learn math, logic, language, geography, and more. Learning through play is at the heart of everything we do.",
      el: "Το GeoLo Platform είναι ένα διαδραστικό περιβάλλον μάθησης όπου παιδιά 2–12 ετών μπορούν να παίζουν παιχνίδια που τους βοηθούν να μάθουν μαθηματικά, λογική, γλώσσα, γεωγραφία κ.ά. Η μάθηση μέσω του παιχνιδιού είναι στον πυρήνα όλων όσων κάνουμε.",
    },
  },
  {
    q: { en: "Is it free?", el: "Είναι δωρεάν;" },
    a: {
      en: "Yes! The core platform is free to use. Create an account or try as a guest. Optional Premium plans are available for additional features like unlimited games and advanced statistics, but the main learning experience remains free.",
      el: "Ναι! Η βασική πλατφόρμα είναι δωρεάν. Δημιουργήστε λογαριασμό ή δοκιμάστε ως επισκέπτης. Προαιρετικά Premium πλάνα είναι διαθέσιμα για πρόσθετες δυνατότητες, αλλά η κύρια εκπαιδευτική εμπειρία παραμένει δωρεάν.",
    },
  },
  {
    q: { en: "What ages is it for?", el: "Για ποιες ηλικίες είναι;" },
    a: {
      en: "We target children ages 2–12, with content grouped by age: 2–3, 4–5, 6, 7–8, 9–10, and 11–12. We also offer board games and trivia for adults.",
      el: "Απευθυνόμαστε σε παιδιά 2–12 ετών, με περιεχόμενο ομαδοποιημένο ανά ηλικία: 2–3, 4–5, 6, 7–8, 9–10 και 11–12. Προσφέρουμε επίσης επιτραπέζια παιχνίδια και γρίφους για ενήλικες.",
    },
  },
  {
    q: { en: "Is my data safe?", el: "Είναι ασφαλή τα δεδομένα μου;" },
    a: {
      en: "Yes. We collect only what is needed (e.g. email, progress) and never sell data to third parties. We comply with GDPR and Greek data protection laws. See our Privacy Policy for details.",
      el: "Ναι. Συλλέγουμε μόνο τα απαραίτητα (π.χ. email, πρόοδος) και δεν πωλούμε ποτέ δεδομένα σε τρίτους. Συμμορφωνόμαστε με το GDPR και την ελληνική νομοθεσία προστασίας δεδομένων. Δείτε την Πολιτική Απορρήτου μας για λεπτομέρειες.",
    },
  },
  {
    q: { en: "Can I use it on mobile?", el: "Μπορώ να το χρησιμοποιήσω στο κινητό;" },
    a: {
      en: "Yes! Our platform is fully responsive and works on phones, tablets, and desktops. You can learn and play from anywhere with an internet connection.",
      el: "Ναι! Η πλατφόρμα μας είναι πλήρως responsive και λειτουργεί σε κινητά, tablets και υπολογιστές. Μπορείτε να μαθαίνετε και να παίζετε από οπουδήποτε με σύνδεση στο Διαδίκτυο.",
    },
  },
  {
    q: { en: "How does guest mode work?", el: "Πώς λειτουργεί η λειτουργία επισκέπτη;" },
    a: {
      en: "Guest mode lets you try the platform without creating an account. You choose a name and age group, then play. Progress is stored locally. For long-term progress and parent features, we recommend signing up.",
      el: "Η λειτουργία επισκέπτη σας επιτρέπει να δοκιμάσετε την πλατφόρμα χωρίς λογαριασμό. Επιλέγετε όνομα και ηλικιακή ομάδα και παίζετε. Η πρόοδος αποθηκεύεται τοπικά. Για μακροπρόθεσμη πρόοδο και γονικές λειτουργίες, συνιστούμε την εγγραφή.",
    },
  },
  {
    q: { en: "Is there a parent dashboard?", el: "Υπάρχει πίνακας γονέα;" },
    a: {
      en: "Yes. Parents with an account can access a dashboard to see their child's progress, activities, and achievements. Sign in with your parent account and go to Parent Dashboard from your profile.",
      el: "Ναι. Οι γονείς με λογαριασμό έχουν πρόσβαση σε πίνακα για να βλέπουν την πρόοδο, τις δραστηριότητες και τα επιτεύγματα του παιδιού τους. Συνδεθείτε με τον λογαριασμό γονέα και πηγαίνετε στον Πίνακα Γονέα από το προφίλ σας.",
    },
  },
  {
    q: { en: "What subjects are covered?", el: "Τι μαθήματα καλύπτει;" },
    a: {
      en: "We cover math, logic, language, geography, science, memory, and more. Content adapts by age—from shapes and colors for little ones to critical thinking and trivia for older kids.",
      el: "Καλύπτουμε μαθηματικά, λογική, γλώσσα, γεωγραφία, επιστήμη, μνήμη και άλλα. Το περιεχόμενο προσαρμόζεται ανά ηλικία—από σχήματα και χρώματα για τα μικρά έως κριτική σκέψη και γρίφους για τα μεγαλύτερα παιδιά.",
    },
  },
  {
    q: { en: "How can I contact you?", el: "Πώς μπορώ να επικοινωνήσω;" },
    a: {
      en: "You can reach us at info@geoloplatform.com. We typically respond within 24 hours. You can also use our Contact page to send a message.",
      el: "Μπορείτε να μας επικοινωνήσετε στο info@geoloplatform.com. Απαντάμε συνήθως εντός 24 ωρών. Μπορείτε επίσης να χρησιμοποιήσετε τη σελίδα Επικοινωνία για να στείλετε μήνυμα.",
    },
  },
  {
    q: { en: "Can I delete my account?", el: "Μπορώ να διαγράψω τον λογαριασμό μου;" },
    a: {
      en: "Yes. You can request account deletion at any time. Contact us at info@geoloplatform.com with your request, and we will process it in line with GDPR.",
      el: "Ναι. Μπορείτε να ζητήσετε τη διαγραφή του λογαριασμού σας ανά πάσα στιγμή. Επικοινωνήστε μαζί μας στο info@geoloplatform.com με το αίτημά σας και θα το επεξεργαστούμε σύμφωνα με το GDPR.",
    },
  },
];

export default function FAQPage() {
  const navigate = useNavigate();
  const { lang } = useContext(LanguageContext);
  const [openIndex, setOpenIndex] = useState(null);
  const isEl = lang === "el";

  const title = isEl ? "Συχνές Ερωτήσεις" : "Frequently Asked Questions";

  return (
    <div id="main-content" className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <SEO
        title={title}
        description={isEl ? "Απαντήσεις σε συχνές ερωτήσεις για το GeoLo Platform" : "Answers to common questions about GeoLo Platform"}
      />
      <Navbar />

      <div className="pt-24 pb-16 px-4">
        <div className="mx-auto max-w-3xl">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 mb-6 flex items-center gap-1 font-medium transition-colors"
          >
            &larr; {isEl ? "Πίσω" : "Back"}
          </button>

          <div className="mb-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-sm font-semibold mb-4">
              {isEl ? "Βοήθεια" : "Help"}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">
              {title}
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              {isEl
                ? "Βρείτε γρήγορες απαντήσεις στις πιο συχνές ερωτήσεις."
                : "Find quick answers to the most common questions."}
            </p>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openIndex === idx;
              const q = item.q[isEl ? "el" : "en"];
              const a = item.a[isEl ? "el" : "en"];
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
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                          {a}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
