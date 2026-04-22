import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";

const CONTENT = {
  el: {
    title: "Όροι Χρήσης",
    updated: "Τελευταία ενημέρωση: Φεβρουάριος 2026",
    sections: [
      {
        heading: "1. Αποδοχή όρων",
        body: "Χρησιμοποιώντας την πλατφόρμα GeoLo Platform, αποδέχεστε τους παρόντες όρους χρήσης. Αν δεν συμφωνείτε, παρακαλούμε μην χρησιμοποιείτε την υπηρεσία.",
      },
      {
        heading: "2. Περιγραφή υπηρεσίας",
        body: "Η GeoLo Platform είναι μια εκπαιδευτική πλατφόρμα παιχνιδιών για παιδιά 2-12 ετών. Παρέχει δραστηριότητες λογικής, μαθηματικών, γεωγραφίας και άλλων θεμάτων.",
      },
      {
        heading: "3. Λογαριασμοί χρηστών",
        body: "Μπορείτε να χρησιμοποιήσετε την πλατφόρμα ως επισκέπτης ή να δημιουργήσετε λογαριασμό. Οι γονείς/κηδεμόνες είναι υπεύθυνοι για τη χρήση της πλατφόρμας από ανήλικους.",
      },
      {
        heading: "4. Πνευματική ιδιοκτησία",
        body: "Όλο το περιεχόμενο της πλατφόρμας (παιχνίδια, εικόνες, κείμενα) ανήκει στην GeoLo Platform και προστατεύεται από τους νόμους περί πνευματικής ιδιοκτησίας.",
      },
      {
        heading: "5. Περιορισμός ευθύνης",
        body: "Η πλατφόρμα παρέχεται «ως έχει». Δεν εγγυόμαστε αδιάλειπτη ή χωρίς σφάλματα λειτουργία.",
      },
      {
        heading: "6. Τροποποιήσεις",
        body: "Διατηρούμε το δικαίωμα να τροποποιήσουμε τους παρόντες όρους. Οι αλλαγές θα κοινοποιούνται μέσω της πλατφόρμας.",
      },
    ],
  },
  en: {
    title: "Terms of Service",
    updated: "Last updated: February 2026",
    sections: [
      {
        heading: "1. Acceptance of terms",
        body: "By using GeoLo Platform, you agree to these terms of service. If you do not agree, please do not use the service.",
      },
      {
        heading: "2. Service description",
        body: "GeoLo Platform is an educational gaming platform for children ages 2-12. It provides activities in logic, math, geography, and other subjects.",
      },
      {
        heading: "3. User accounts",
        body: "You can use the platform as a guest or create an account. Parents/guardians are responsible for use of the platform by minors.",
      },
      {
        heading: "4. Intellectual property",
        body: "All platform content (games, images, text) belongs to GeoLo Platform and is protected by intellectual property laws.",
      },
      {
        heading: "5. Limitation of liability",
        body: "The platform is provided \"as is\". We do not guarantee uninterrupted or error-free operation.",
      },
      {
        heading: "6. Modifications",
        body: "We reserve the right to modify these terms. Changes will be communicated through the platform.",
      },
    ],
  },
};

export default function TermsPage() {
  const navigate = useNavigate();
  const { lang } = useContext(LanguageContext);
  const c = CONTENT[lang === "el" ? "el" : "en"];

  return (
    <div id="main-content" className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <SEO title={c.title} />
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="mx-auto max-w-3xl">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 mb-6 flex items-center gap-1"
          >
            &larr; {lang === "el" ? "Πίσω" : "Back"}
          </button>

          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">{c.title}</h1>
          <p className="text-sm text-slate-400 mb-10">{c.updated}</p>

          <div className="space-y-8">
            {c.sections.map((s, i) => (
              <div key={i}>
                <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-2">{s.heading}</h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 p-4 bg-purple-50 dark:bg-purple-900/30 rounded-xl text-sm text-purple-700 dark:text-purple-300">
            {lang === "el"
              ? "Για οποιαδήποτε ερώτηση, επικοινωνήστε: info@geoloplatform.com"
              : "For any questions, contact: info@geoloplatform.com"}
          </div>
        </div>
      </div>
    </div>
  );
}
