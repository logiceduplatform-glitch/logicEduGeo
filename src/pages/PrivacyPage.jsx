import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";

const CONTENT = {
  el: {
    title: "Πολιτική Απορρήτου",
    updated: "Τελευταία ενημέρωση: Φεβρουάριος 2026",
    sections: [
      {
        heading: "1. Ποια δεδομένα συλλέγουμε",
        body: "Συλλέγουμε μόνο τα απαραίτητα δεδομένα για τη λειτουργία της πλατφόρμας: email, όνομα χρήστη, ηλικιακή ομάδα και πρόοδο στα παιχνίδια. Δεν συλλέγουμε ευαίσθητα προσωπικά δεδομένα παιδιών χωρίς τη συγκατάθεση του γονέα.",
      },
      {
        heading: "2. Πώς χρησιμοποιούμε τα δεδομένα",
        body: "Τα δεδομένα χρησιμοποιούνται αποκλειστικά για την εξατομίκευση της μαθησιακής εμπειρίας, την αποθήκευση προόδου και τη βελτίωση της πλατφόρμας. Δεν πουλάμε ούτε μοιραζόμαστε δεδομένα με τρίτους.",
      },
      {
        heading: "3. Αποθήκευση δεδομένων",
        body: "Τα δεδομένα αποθηκεύονται τοπικά στη συσκευή σας (localStorage) και, αν έχετε λογαριασμό, στο Firebase Authentication της Google. Χρησιμοποιούμε κρυπτογράφηση για την προστασία των δεδομένων σας.",
      },
      {
        heading: "4. Δικαιώματα χρηστών",
        body: "Μπορείτε ανά πάσα στιγμή να ζητήσετε πρόσβαση, διόρθωση ή διαγραφή των δεδομένων σας. Επικοινωνήστε μαζί μας στο info@geoloplatform.com.",
      },
      {
        heading: "5. Cookies",
        body: "Χρησιμοποιούμε μόνο τα απαραίτητα cookies για τη λειτουργία του site. Δεν χρησιμοποιούμε cookies παρακολούθησης ή διαφήμισης.",
      },
      {
        heading: "6. Παιδιά & GDPR",
        body: "Η πλατφόρμα μας σχεδιάστηκε με γνώμονα την ασφάλεια των παιδιών. Συμμορφωνόμαστε με τον GDPR και τον ελληνικό νόμο για την προστασία δεδομένων ανηλίκων.",
      },
    ],
  },
  en: {
    title: "Privacy Policy",
    updated: "Last updated: February 2026",
    sections: [
      {
        heading: "1. What data we collect",
        body: "We collect only the data necessary for platform operation: email, username, age group, and game progress. We do not collect sensitive personal data from children without parental consent.",
      },
      {
        heading: "2. How we use data",
        body: "Data is used exclusively to personalize the learning experience, save progress, and improve the platform. We do not sell or share data with third parties.",
      },
      {
        heading: "3. Data storage",
        body: "Data is stored locally on your device (localStorage) and, if you have an account, in Google's Firebase Authentication. We use encryption to protect your data.",
      },
      {
        heading: "4. User rights",
        body: "You can request access, correction, or deletion of your data at any time. Contact us at info@geoloplatform.com.",
      },
      {
        heading: "5. Cookies",
        body: "We use only essential cookies for site functionality. We do not use tracking or advertising cookies.",
      },
      {
        heading: "6. Children & GDPR",
        body: "Our platform is designed with children's safety in mind. We comply with GDPR and Greek data protection laws for minors.",
      },
    ],
  },
};

export default function PrivacyPage() {
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
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 p-4 bg-purple-50 dark:bg-purple-900/30 rounded-xl text-sm text-purple-700 dark:text-purple-300">
            {lang === "el"
              ? "Για οποιαδήποτε ερώτηση σχετικά με το απόρρητο, επικοινωνήστε: info@geoloplatform.com"
              : "For any privacy-related questions, contact: info@geoloplatform.com"}
          </div>
        </div>
      </div>
    </div>
  );
}
