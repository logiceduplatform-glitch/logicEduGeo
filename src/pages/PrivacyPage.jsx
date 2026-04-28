import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";

const CONTENT = {
  el: {
    title: "Πολιτική Απορρήτου",
    updated: "Τελευταία ενημέρωση: Απρίλιος 2026",
    sections: [
      {
        heading: "1. Εισαγωγή",
        body: "Η πλατφόρμα GeoLo Education (\"εμείς\", \"μας\") δεσμεύεται στην προστασία της ιδιωτικότητας των χρηστών μας, ιδιαίτερα των παιδιών. Η παρούσα πολιτική εξηγεί ποια δεδομένα συλλέγουμε, πώς τα χρησιμοποιούμε και τα δικαιώματά σας σύμφωνα με τον Γενικό Κανονισμό Προστασίας Δεδομένων (GDPR), τον ελληνικό νόμο 4624/2019 και τις αρχές του COPPA.",
      },
      {
        heading: "2. Ποια δεδομένα συλλέγουμε",
        body: `Συλλέγουμε τα ελάχιστα απαραίτητα δεδομένα:\n\n• Στοιχεία λογαριασμού: Email, όνομα χρήστη, ρόλος (μαθητής/γονέας/δάσκαλος)\n• Ηλικιακή ομάδα: Για την εξατομίκευση του περιεχομένου\n• Πρόοδος μάθησης: Σκορ, ολοκληρωμένα παιχνίδια, επιτεύγματα\n• Τεχνικά δεδομένα: Τύπος συσκευής, browser (μέσω Firebase Analytics, μόνο με τη συγκατάθεσή σας)\n\nΔεν συλλέγουμε: φωτογραφίες προσώπου παιδιών, τοποθεσία, αριθμούς τηλεφώνου ή ευαίσθητα προσωπικά δεδομένα.`,
      },
      {
        heading: "3. Δεδομένα παιδιών (κάτω των 16 ετών)",
        body: `Η πλατφόρμα μας σχεδιάστηκε ειδικά για παιδιά. Εφαρμόζουμε αυστηρά μέτρα:\n\n• Γονική συναίνεση: Οι λογαριασμοί παιδιών δημιουργούνται μέσω γονέα ή δασκάλου\n• Ελάχιστα δεδομένα: Συλλέγουμε μόνο όνομα/ψευδώνυμο και ηλικιακή ομάδα\n• Κανένα email παιδιού: Τα παιδιά δεν χρειάζονται δικό τους email\n• Κλείδωμα PIN: Οι γονείς/δάσκαλοι ελέγχουν τις ρυθμίσεις μέσω 4ψήφιου PIN\n• Χωρίς διαφημίσεις: Δεν εμφανίζουμε διαφημίσεις σε κανένα χρήστη\n• Χωρίς κοινωνικά δίκτυα: Τα παιδιά δεν μπορούν να επικοινωνούν με αγνώστους`,
      },
      {
        heading: "4. Πώς χρησιμοποιούμε τα δεδομένα",
        body: `Τα δεδομένα χρησιμοποιούνται αποκλειστικά για:\n\n• Εξατομίκευση της μαθησιακής εμπειρίας βάσει ηλικίας\n• Αποθήκευση και συγχρονισμό προόδου\n• Στατιστικά τάξης για δασκάλους\n• Βελτίωση της πλατφόρμας (ανώνυμα analytics)\n\nΔεν πουλάμε, δεν ενοικιάζουμε και δεν μοιραζόμαστε προσωπικά δεδομένα με τρίτους για εμπορικούς σκοπούς.`,
      },
      {
        heading: "5. Αποθήκευση και ασφάλεια δεδομένων",
        body: `• Τοπική αποθήκευση: Η πρόοδος αποθηκεύεται στη συσκευή σας (localStorage)\n• Cloud: Αν έχετε λογαριασμό, τα δεδομένα συγχρονίζονται μέσω Google Firebase (κρυπτογραφημένα κατά τη μεταφορά και αποθήκευση)\n• Διατήρηση: Τα δεδομένα λογαριασμού διατηρούνται έως τη διαγραφή του λογαριασμού. Τα ανώνυμα analytics διατηρούνται για 14 μήνες\n• Διαγραφή: Μπορείτε να ζητήσετε πλήρη διαγραφή ανά πάσα στιγμή`,
      },
      {
        heading: "6. Υπεργολάβοι επεξεργασίας (Subprocessors)",
        body: `Χρησιμοποιούμε τις ακόλουθες υπηρεσίες τρίτων:\n\n• Google Firebase (Authentication, Firestore, Hosting, Analytics) — ΗΠΑ/ΕΕ — Τυποποιημένες Συμβατικές Ρήτρες (SCCs)\n• Stripe (Επεξεργασία πληρωμών) — ΗΠΑ/ΕΕ — PCI DSS Level 1\n• Formspree (Φόρμα επικοινωνίας) — ΗΠΑ — SCCs\n\nΌλοι οι υπεργολάβοι συμμορφώνονται με τον GDPR και εφαρμόζουν κατάλληλες τεχνικές και οργανωτικές ασφάλειες.`,
      },
      {
        heading: "7. Cookies και Analytics",
        body: `• Απαραίτητα cookies: Χρησιμοποιούμε μόνο τεχνικά cookies για τη λειτουργία της πλατφόρμας (σύνδεση, γλώσσα, θέμα)\n• Firebase Analytics: Ενεργοποιείται ΜΟΝΟ μετά τη ρητή συγκατάθεσή σας μέσω του banner cookies. Συλλέγει ανώνυμα δεδομένα χρήσης (σελίδες, γεγονότα)\n• Χωρίς cookies διαφήμισης: Δεν χρησιμοποιούμε cookies τρίτων για διαφημιστική παρακολούθηση\n• Ανάκληση: Μπορείτε να αλλάξετε τη συγκατάθεσή σας ανά πάσα στιγμή από τις ρυθμίσεις`,
      },
      {
        heading: "8. Δικαιώματα χρηστών (GDPR)",
        body: `Σύμφωνα με τον GDPR, έχετε τα ακόλουθα δικαιώματα:\n\n• Πρόσβαση: Ζητήστε αντίγραφο των δεδομένων σας\n• Διόρθωση: Διορθώστε ανακριβή δεδομένα\n• Διαγραφή: Ζητήστε πλήρη διαγραφή (\"δικαίωμα στη λήθη\")\n• Φορητότητα: Λάβετε τα δεδομένα σας σε μηχαναγνώσιμη μορφή\n• Εναντίωση: Αντιταχθείτε στην επεξεργασία ανώνυμων analytics\n• Ανάκληση συγκατάθεσης: Ανά πάσα στιγμή\n\nΓια να ασκήσετε τα δικαιώματά σας: info@geoloplatform.com\nΑπαντάμε εντός 30 ημερών.`,
      },
      {
        heading: "9. Διεθνείς μεταφορές δεδομένων",
        body: "Ορισμένοι υπεργολάβοι μας (Google, Stripe) μπορεί να επεξεργάζονται δεδομένα εκτός ΕΟΧ (π.χ. ΗΠΑ). Σε αυτές τις περιπτώσεις, διασφαλίζουμε κατάλληλες εγγυήσεις μέσω Τυποποιημένων Συμβατικών Ρητρών (SCCs) της Ευρωπαϊκής Επιτροπής.",
      },
      {
        heading: "10. Εκπαιδευτικοί οργανισμοί (Σχολεία)",
        body: "Αν χρησιμοποιείτε την πλατφόρμα ως σχολείο, ο δάσκαλος ενεργεί ως υπεύθυνος επεξεργασίας για τα δεδομένα των μαθητών του. Μπορούμε να συνάψουμε Συμφωνία Επεξεργασίας Δεδομένων (DPA) κατόπιν αιτήματος στο info@geoloplatform.com.",
      },
      {
        heading: "11. Αλλαγές στην πολιτική",
        body: "Ενδέχεται να ενημερώσουμε αυτήν την πολιτική κατά καιρούς. Οι σημαντικές αλλαγές θα ανακοινώνονται στην πλατφόρμα. Η συνέχιση χρήσης μετά από αλλαγή συνιστά αποδοχή.",
      },
      {
        heading: "12. Επικοινωνία",
        body: "Υπεύθυνος Προστασίας Δεδομένων (DPO)\nEmail: info@geoloplatform.com\n\nΑρχή Προστασίας Δεδομένων Προσωπικού Χαρακτήρα (ΑΠΔΠΧ)\nΚηφισίας 1-3, 115 23 Αθήνα\nwww.dpa.gr",
      },
    ],
  },
  en: {
    title: "Privacy Policy",
    updated: "Last updated: April 2026",
    sections: [
      {
        heading: "1. Introduction",
        body: "GeoLo Education platform (\"we\", \"us\") is committed to protecting the privacy of our users, especially children. This policy explains what data we collect, how we use it, and your rights under the General Data Protection Regulation (GDPR), Greek Law 4624/2019, and COPPA principles.",
      },
      {
        heading: "2. What data we collect",
        body: `We collect the minimum necessary data:\n\n• Account details: Email, username, role (student/parent/teacher)\n• Age group: For content personalization\n• Learning progress: Scores, completed games, achievements\n• Technical data: Device type, browser (via Firebase Analytics, only with your consent)\n\nWe do NOT collect: children's face photos, location, phone numbers, or sensitive personal data.`,
      },
      {
        heading: "3. Children's data (under 16)",
        body: `Our platform is designed specifically for children. We apply strict measures:\n\n• Parental consent: Children's accounts are created through a parent or teacher\n• Minimal data: We only collect a name/nickname and age group\n• No child email: Children do not need their own email\n• PIN lock: Parents/teachers control settings via a 4-digit PIN\n• No advertisements: We do not display ads to any user\n• No social networking: Children cannot communicate with strangers`,
      },
      {
        heading: "4. How we use data",
        body: `Data is used exclusively for:\n\n• Personalizing the learning experience by age\n• Saving and syncing progress\n• Classroom statistics for teachers\n• Platform improvement (anonymous analytics)\n\nWe do not sell, rent, or share personal data with third parties for commercial purposes.`,
      },
      {
        heading: "5. Data storage and security",
        body: `• Local storage: Progress is stored on your device (localStorage)\n• Cloud: If you have an account, data syncs via Google Firebase (encrypted in transit and at rest)\n• Retention: Account data is retained until account deletion. Anonymous analytics are retained for 14 months\n• Deletion: You can request full deletion at any time`,
      },
      {
        heading: "6. Subprocessors",
        body: `We use the following third-party services:\n\n• Google Firebase (Authentication, Firestore, Hosting, Analytics) — US/EU — Standard Contractual Clauses (SCCs)\n• Stripe (Payment processing) — US/EU — PCI DSS Level 1\n• Formspree (Contact forms) — US — SCCs\n\nAll subprocessors comply with GDPR and implement appropriate technical and organizational safeguards.`,
      },
      {
        heading: "7. Cookies and Analytics",
        body: `• Essential cookies: We use only technical cookies for platform operation (login, language, theme)\n• Firebase Analytics: Activated ONLY after your explicit consent via the cookie banner. Collects anonymous usage data (pages, events)\n• No advertising cookies: We do not use third-party cookies for ad tracking\n• Withdrawal: You can change your consent at any time from settings`,
      },
      {
        heading: "8. User rights (GDPR)",
        body: `Under GDPR, you have the following rights:\n\n• Access: Request a copy of your data\n• Rectification: Correct inaccurate data\n• Erasure: Request full deletion ("right to be forgotten")\n• Portability: Receive your data in machine-readable format\n• Objection: Object to anonymous analytics processing\n• Withdraw consent: At any time\n\nTo exercise your rights: info@geoloplatform.com\nWe respond within 30 days.`,
      },
      {
        heading: "9. International data transfers",
        body: "Some of our subprocessors (Google, Stripe) may process data outside the EEA (e.g., US). In these cases, we ensure appropriate safeguards through Standard Contractual Clauses (SCCs) of the European Commission.",
      },
      {
        heading: "10. Educational organizations (Schools)",
        body: "If you use the platform as a school, the teacher acts as data controller for their students' data. We can enter into a Data Processing Agreement (DPA) upon request at info@geoloplatform.com.",
      },
      {
        heading: "11. Policy changes",
        body: "We may update this policy from time to time. Significant changes will be announced on the platform. Continued use after a change constitutes acceptance.",
      },
      {
        heading: "12. Contact",
        body: "Data Protection Officer (DPO)\nEmail: info@geoloplatform.com\n\nHellenic Data Protection Authority (HDPA)\nKifisias 1-3, 115 23 Athens, Greece\nwww.dpa.gr",
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
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
                <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-3">{s.heading}</h2>
                <div className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line text-sm">{s.body}</div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-5 bg-purple-50 dark:bg-purple-900/30 rounded-2xl border border-purple-200 dark:border-purple-800">
            <p className="text-sm font-semibold text-purple-700 dark:text-purple-300 mb-1">
              {lang === "el" ? "Ερωτήσεις;" : "Questions?"}
            </p>
            <p className="text-sm text-purple-600 dark:text-purple-400">
              {lang === "el"
                ? "Για οποιαδήποτε ερώτηση σχετικά με το απόρρητο, επικοινωνήστε: info@geoloplatform.com"
                : "For any privacy-related questions, contact: info@geoloplatform.com"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
