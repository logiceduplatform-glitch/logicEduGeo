import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import { LEGAL_INFO as L } from "../config/legalInfo";

/**
 * Data Processing Agreement summary page (B2B / Schools).
 *
 * This is a public-facing summary. The full signable DPA is sent on request
 * to legal@kibloo.app. Designed to provide schools and DPOs with everything
 * they need to greenlight Kibloo for classroom use.
 */

const CONTENT = {
  el: {
    title: "Data Processing Agreement (DPA) — Σχολεία",
    intro: `Αυτή η σελίδα συνοψίζει τους όρους επεξεργασίας δεδομένων μεταξύ της ${L.brand} (ως Εκτελών την Επεξεργασία) και των σχολείων / εκπαιδευτικών οργανισμών (ως Υπεύθυνος Επεξεργασίας) που χρησιμοποιούν την πλατφόρμα. Για το πλήρες, υπογράψιμο DPA, παρακαλούμε επικοινωνήστε στο ${L.emailLegal}.`,
    updated: `Τελευταία ενημέρωση: ${L.policyUpdated}`,
    sections: [
      { h: "1. Συμβαλλόμενα μέρη", body: `Υπεύθυνος Επεξεργασίας (Controller): Το σχολείο ή ο εκπαιδευτικός οργανισμός που χρησιμοποιεί την πλατφόρμα.\n\nΕκτελών την Επεξεργασία (Processor): ${L.legalName}, ${L.address}, ΑΦΜ ${L.vatNumber}.\n\nΥπεύθυνος Προστασίας Δεδομένων (DPO): ${L.emailDpo}` },
      { h: "2. Αντικείμενο και διάρκεια", body: "Η επεξεργασία περιορίζεται στην παροχή της εκπαιδευτικής πλατφόρμας Kibloo στους μαθητές του σχολείου. Διαρκεί όσο η σύμβαση School License παραμένει ενεργή." },
      { h: "3. Φύση και σκοπός επεξεργασίας", body: "• Παροχή λογαριασμών μαθητών μέσω class codes ή PIN\n• Αποθήκευση προόδου μάθησης\n• Στατιστικά τάξης για τους δασκάλους\n• Τεχνική υποστήριξη" },
      { h: "4. Κατηγορίες δεδομένων", body: "• Όνομα/ψευδώνυμο μαθητή\n• Ηλικιακή ομάδα / τάξη\n• Πρόοδος παιχνιδιών (σκορ, χρόνος, achievements)\n• Email δασκάλου (όχι μαθητή)\n\nΔΕΝ συλλέγονται: φωτογραφίες προσώπων, τοποθεσία, ευαίσθητα δεδομένα." },
      { h: "5. Υποκείμενα των δεδομένων", body: "Μαθητές 2-12 ετών και εκπαιδευτικοί που έχουν λογαριασμό School." },
      { h: "6. Υπεργολάβοι (Sub-processors)", body: `• Google Firebase (Authentication, Firestore, Hosting) — ΗΠΑ/ΕΕ — SCCs\n• Microsoft Clarity (analytics, opt-in) — ΗΠΑ — SCCs\n• Stripe (πληρωμές σχολείου, όχι μαθητή) — Ιρλανδία/ΗΠΑ — SCCs\n\nΕνημερώνουμε για αλλαγές υπεργολάβων με 30 ημέρες προειδοποίηση.` },
      { h: "7. Διεθνείς μεταφορές", body: "Δεδομένα ενδέχεται να μεταφέρονται εκτός ΕΟΧ (κυρίως ΗΠΑ μέσω Google/Stripe). Διασφαλίζουμε προστασία μέσω Standard Contractual Clauses (SCCs) της Ευρωπαϊκής Επιτροπής (απόφαση 2021/914)." },
      { h: "8. Τεχνικά και οργανωτικά μέτρα ασφαλείας (Άρθρο 32 GDPR)", body: "🔐 Τεχνικά:\n• HTTPS/TLS 1.3 για όλες τις επικοινωνίες\n• Κρυπτογράφηση at-rest στο Firestore (AES-256)\n• Firebase App Check ενάντια σε abuse\n• Rate limiting στα auth endpoints\n• Content Security Policy (CSP)\n• Strict security headers (HSTS, X-Frame-Options κλπ.)\n\n🏢 Οργανωτικά:\n• Πρόσβαση σε δεδομένα μόνο κατ' ανάγκη (need-to-know)\n• 2FA για admin λογαριασμούς\n• Logs πρόσβασης διατηρούνται 90 ημέρες\n• Τακτικά backups (καθημερινά, με 30-day retention)\n• Incident response plan" },
      { h: "9. Δικαιώματα υποκειμένων (Άρθρα 15-22 GDPR)", body: `Διευκολύνουμε το σχολείο να ανταποκριθεί σε αιτήματα μαθητών/γονέων:\n\n• Πρόσβαση\n• Διόρθωση\n• Διαγραφή\n• Φορητότητα (export σε JSON)\n• Περιορισμός / Εναντίωση\n\nΗ ανταπόκριση γίνεται εντός 30 ημερών. Επικοινωνία: ${L.emailDpo}` },
      { h: "10. Παραβίαση δεδομένων", body: "Ενημερώνουμε το σχολείο εντός 24 ωρών από τη γνωστοποίηση παραβίασης που επηρεάζει τα δεδομένα του (Άρθρο 33 GDPR). Παρέχουμε όλη την απαραίτητη πληροφορία για ενημέρωση της εποπτικής αρχής (ΑΠΔΠΧ)." },
      { h: "11. Έλεγχοι και επιθεωρήσεις (audit)", body: "Παρέχουμε ετήσια αναφορά συμμόρφωσης και αντίγραφα πιστοποιητικών των υπεργολάβων μας (SOC 2, ISO 27001 για Google/Stripe). Επιθεωρήσεις on-site με προειδοποίηση 60 ημερών." },
      { h: "12. Διάρκεια διατήρησης", body: "• Δεδομένα μαθητών: διαγραφή εντός 30 ημερών μετά τον τερματισμό της σύμβασης\n• Λογιστικά αρχεία: 5 χρόνια (ελληνικός νόμος)\n• Logs ασφαλείας: 90 ημέρες" },
      { h: "13. Αποζημίωση και ευθύνη", body: "Η ευθύνη μας για παραβίαση των υποχρεώσεων DPA περιορίζεται στο διπλάσιο της ετήσιας αμοιβής της School License, εκτός αν πρόκειται για δόλο ή βαριά αμέλεια. Ο περιορισμός δεν εφαρμόζεται για παραβιάσεις GDPR με πρόστιμα από εποπτικές αρχές." },
      { h: "14. Επικοινωνία και υπογραφή", body: `Για να λάβετε το πλήρες, υπογράψιμο DPA σε PDF (DocuSign):\n\nEmail: ${L.emailLegal}\nΘέμα: "School DPA Request — [Σχολείο σας]"\n\nΣυνήθης χρόνος αποστολής: 1-2 εργάσιμες ημέρες.` },
    ],
    cta: { title: "Είστε έτοιμοι;", desc: "Συμπληρώστε τη φόρμα ή στείλτε email για να ξεκινήσει η διαδικασία.", btn: "📧 Ζήτησε υπογραφή DPA" },
  },
  en: {
    title: "Data Processing Agreement (DPA) — Schools",
    intro: `This page summarises the data processing terms between ${L.brand} (as Processor) and schools / educational organisations (as Controller) using the platform. For the full signable DPA please contact ${L.emailLegal}.`,
    updated: `Last updated: ${L.policyUpdated}`,
    sections: [
      { h: "1. Parties", body: `Controller: The school or educational organisation using the platform.\n\nProcessor: ${L.legalName}, ${L.address}, VAT ${L.vatNumber}.\n\nData Protection Officer (DPO): ${L.emailDpo}` },
      { h: "2. Subject matter and duration", body: "Processing is limited to providing the Kibloo educational platform to the school's students. Lasts as long as the School License contract is active." },
      { h: "3. Nature and purpose", body: "• Provision of student accounts via class codes or PIN\n• Storage of learning progress\n• Class statistics for teachers\n• Technical support" },
      { h: "4. Categories of data", body: "• Student name/nickname\n• Age group / class\n• Game progress (scores, time, achievements)\n• Teacher email (not student)\n\nNOT collected: face photos, location, sensitive data." },
      { h: "5. Data subjects", body: "Students aged 2-12 and educators with a School account." },
      { h: "6. Sub-processors", body: `• Google Firebase (Authentication, Firestore, Hosting) — US/EU — SCCs\n• Microsoft Clarity (analytics, opt-in) — US — SCCs\n• Stripe (school payments, not student) — Ireland/US — SCCs\n\nWe notify of sub-processor changes with 30 days notice.` },
      { h: "7. International transfers", body: "Data may be transferred outside the EEA (mainly US via Google/Stripe). We ensure protection via Standard Contractual Clauses (SCCs) of the European Commission (decision 2021/914)." },
      { h: "8. Technical and organisational security measures (Art. 32 GDPR)", body: "🔐 Technical:\n• HTTPS/TLS 1.3 for all communications\n• At-rest encryption in Firestore (AES-256)\n• Firebase App Check against abuse\n• Rate limiting on auth endpoints\n• Content Security Policy (CSP)\n• Strict security headers (HSTS, X-Frame-Options etc.)\n\n🏢 Organisational:\n• Data access on need-to-know basis\n• 2FA for admin accounts\n• Access logs retained 90 days\n• Regular backups (daily, 30-day retention)\n• Incident response plan" },
      { h: "9. Subject rights (Art. 15-22 GDPR)", body: `We facilitate the school in responding to student/parent requests:\n\n• Access\n• Rectification\n• Erasure\n• Portability (JSON export)\n• Restriction / Objection\n\nResponse within 30 days. Contact: ${L.emailDpo}` },
      { h: "10. Data breach", body: "We notify the school within 24 hours of becoming aware of a breach affecting their data (Art. 33 GDPR). We provide all necessary information to notify the supervisory authority (HDPA)." },
      { h: "11. Audits", body: "We provide an annual compliance report and copies of sub-processor certifications (SOC 2, ISO 27001 for Google/Stripe). On-site audits with 60 days notice." },
      { h: "12. Retention", body: "• Student data: deletion within 30 days of contract termination\n• Accounting records: 5 years (Greek law)\n• Security logs: 90 days" },
      { h: "13. Indemnification and liability", body: "Our liability for DPA breach is limited to twice the annual School License fee, except for wilful misconduct or gross negligence. Limit does not apply to GDPR fines from supervisory authorities." },
      { h: "14. Contact and signing", body: `To receive the full signable DPA in PDF (DocuSign):\n\nEmail: ${L.emailLegal}\nSubject: "School DPA Request — [your school]"\n\nTypical turnaround: 1-2 business days.` },
    ],
    cta: { title: "Ready to start?", desc: "Fill the form or send an email to begin the process.", btn: "📧 Request DPA signature" },
  },
};

export default function DPAPage() {
  const navigate = useNavigate();
  const { lang } = useContext(LanguageContext);
  const c = CONTENT[lang === "el" ? "el" : "en"];

  return (
    <div id="main-content" className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <SEO title={c.title} description={c.intro} canonical="/dpa" />
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="mx-auto max-w-3xl">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 mb-6 flex items-center gap-1"
          >
            &larr; {lang === "el" ? "Πίσω" : "Back"}
          </button>

          <div className="inline-block px-3 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-bold mb-3">
            {lang === "el" ? "🏫 B2B · Σχολεία" : "🏫 B2B · Schools"}
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">{c.title}</h1>
          <p className="text-sm text-slate-400 mb-3">{c.updated}</p>
          <p className="text-slate-600 dark:text-slate-300 mb-10 leading-relaxed">{c.intro}</p>

          <div className="space-y-6">
            {c.sections.map((s, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
                <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-3">{s.h}</h2>
                <div className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line text-sm">{s.body}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 p-6 bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-900/30 dark:to-blue-900/30 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-center">
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">{c.cta.title}</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4 text-sm">{c.cta.desc}</p>
            <a
              href={`mailto:${L.emailLegal}?subject=School%20DPA%20Request`}
              className="inline-block px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition-all hover:shadow-xl"
            >
              {c.cta.btn}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
