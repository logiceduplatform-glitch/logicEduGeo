import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import { LEGAL_INFO as L } from "../config/legalInfo";

const CONTENT = {
  el: {
    title: "Όροι Χρήσης",
    updated: `Τελευταία ενημέρωση: ${L.policyUpdated}`,
    intro: `Καλώς ήρθατε στο ${L.brand}. Διαβάστε προσεκτικά τους παρόντες Όρους Χρήσης πριν χρησιμοποιήσετε την πλατφόρμα μας. Η χρήση της πλατφόρμας συνιστά ανεπιφύλακτη αποδοχή των όρων.`,
    sections: [
      {
        heading: "1. Στοιχεία της εταιρείας",
        body: `Η πλατφόρμα ${L.brand} λειτουργεί από:\n\n• Επωνυμία: ${L.legalName}\n• Διεύθυνση: ${L.address}\n• ΑΦΜ: ${L.vatNumber} — Δ.Ο.Υ.: ${L.taxOffice}\n• Γ.Ε.ΜΗ.: ${L.gemiNumber}\n• Email: ${L.emailGeneral}\n• Τηλέφωνο: ${L.phone}`,
      },
      {
        heading: "2. Αποδοχή όρων",
        body: `Με την πρόσβαση και χρήση της πλατφόρμας, αποδέχεστε:\n\n• Τους παρόντες Όρους Χρήσης\n• Την Πολιτική Απορρήτου (/privacy)\n• Την Πολιτική Cookies (/cookies)\n\nΑν δεν συμφωνείτε με κάποιον όρο, διακόψτε τη χρήση της πλατφόρμας.`,
      },
      {
        heading: "3. Περιγραφή υπηρεσίας",
        body: `Το ${L.brand} είναι μια εκπαιδευτική διαδικτυακή πλατφόρμα που προσφέρει:\n\n• Παιχνίδια μάθησης για παιδιά 2–12 ετών\n• Λογαριασμούς για γονείς, δασκάλους και μαθητές\n• AI-υποστηριζόμενες λειτουργίες (Study Buddy, photo solver, story generator)\n• Συνδρομητικά πλάνα (βλ. όρο 6)\n• B2B λύσεις για σχολεία (School License)\n\nΔιατηρούμε το δικαίωμα να προσθέτουμε, τροποποιούμε ή αφαιρούμε λειτουργίες χωρίς προειδοποίηση.`,
      },
      {
        heading: "4. Καταλληλότητα και ηλικιακά όρια",
        body: `• Παιδιά κάτω των 16 ετών χρειάζονται ρητή συναίνεση γονέα/κηδεμόνα.\n• Οι λογαριασμοί παιδιών δημιουργούνται και διαχειρίζονται αποκλειστικά από ενήλικες (γονείς ή πιστοποιημένους δασκάλους).\n• Δεν επιτρέπεται η δημιουργία ψεύτικων ή αναληθών λογαριασμών.\n• Απαγορεύεται η αυτοματοποιημένη πρόσβαση (bots, scrapers).`,
      },
      {
        heading: "5. Λογαριασμοί χρηστών και ασφάλεια",
        body: `Είστε υπεύθυνοι για:\n\n• Τη διατήρηση της εμπιστευτικότητας των διαπιστευτηρίων σας\n• Όλες τις ενέργειες που πραγματοποιούνται στον λογαριασμό σας\n• Την άμεση ενημέρωσή μας σε περίπτωση μη εξουσιοδοτημένης πρόσβασης (στο ${L.emailSupport})\n• Την παροχή ακριβών στοιχείων κατά την εγγραφή\n\nΔιατηρούμε το δικαίωμα αναστολής ή τερματισμού λογαριασμού για παραβίαση των όρων.`,
      },
      {
        heading: "6. Συνδρομές και πληρωμές",
        body: `Προσφέρουμε τα παρακάτω πλάνα:\n\n• Free: ${L.pricing.free} — βασικές λειτουργίες\n• Premium: ${L.pricing.premium} — όλα τα παιχνίδια & AI features\n• Family: ${L.pricing.family} — έως 6 παιδιά + parental controls\n• School: custom pricing — επικοινωνήστε στο ${L.emailGeneral}\n\n• Δωρεάν δοκιμή: ${L.pricing.trialDays} ημέρες χωρίς χρέωση. Ακύρωση οποιαδήποτε στιγμή χωρίς κόστος.\n• Χρέωση: μηνιαία, αυτόματη ανανέωση μέσω Stripe.\n• ΦΠΑ: Όλες οι τιμές περιλαμβάνουν ΦΠΑ 24% (ψηφιακές υπηρεσίες).\n• Ακύρωση: Μπορείτε να ακυρώσετε τη συνδρομή σας ανά πάσα στιγμή από τις ρυθμίσεις. Η πρόσβαση διατηρείται έως το τέλος της χρεωμένης περιόδου.`,
      },
      {
        heading: "7. Δικαίωμα υπαναχώρησης (EU)",
        body: `Σύμφωνα με το ευρωπαϊκό δίκαιο προστασίας καταναλωτή (Οδηγία 2011/83/ΕΕ):\n\n• Έχετε ${L.pricing.refundDays} ημέρες δικαίωμα υπαναχώρησης από την ημερομηνία αγοράς συνδρομής, χωρίς αιτιολόγηση.\n• Η επιστροφή χρημάτων γίνεται εντός 14 ημερών από την αίτηση, στο ίδιο μέσο πληρωμής.\n• ΕΞΑΙΡΕΣΗ: Αν χρησιμοποιήσετε ενεργά το premium περιεχόμενο εντός των 14 ημερών, παραιτείστε από το δικαίωμα υπαναχώρησης (αναγνωρίζετε ότι λάβατε άμεση πρόσβαση σε ψηφιακό περιεχόμενο).\n• Αίτηση επιστροφής: ${L.emailSupport}`,
      },
      {
        heading: "8. Επιτρεπόμενη και απαγορευμένη χρήση",
        body: `Επιτρέπεται:\n• Προσωπική, μη εμπορική χρήση για εκπαιδευτικούς σκοπούς\n• Χρήση εντός σχολικής αίθουσας με ενεργή License\n\nΑπαγορεύεται:\n• Αντιγραφή, αναπαραγωγή ή διανομή του περιεχομένου\n• Reverse engineering ή προσπάθεια εξαγωγής source code\n• Χρήση για παράνομες, παραπλανητικές ή επιβλαβείς δραστηριότητες\n• Παρενόχληση άλλων χρηστών μέσω chat/multiplayer features\n• Παράκαμψη μέτρων ασφαλείας ή περιορισμών συνδρομής`,
      },
      {
        heading: "9. Δημιουργικό περιεχόμενο χρήστη",
        body: `Όταν δημιουργείτε περιεχόμενο μέσω παιχνιδιών (Pixel Art, Story Builder, Drawing Pad, κλπ.):\n\n• Διατηρείτε όλα τα πνευματικά δικαιώματα στο περιεχόμενο που δημιουργείτε.\n• Παρέχετε στο ${L.brand} μια μη αποκλειστική, παγκόσμια άδεια αποθήκευσης και προβολής του περιεχομένου σας ΜΟΝΟ εντός του δικού σας λογαριασμού.\n• Δεν θα δημοσιεύσουμε ποτέ δημόσια το παιδικό περιεχόμενο χωρίς τη ρητή γονική συναίνεση.`,
      },
      {
        heading: "10. Πνευματική ιδιοκτησία της πλατφόρμας",
        body: `Όλα τα πνευματικά δικαιώματα της πλατφόρμας (κώδικας, σχεδιασμός, παιχνίδια, εικαστικά, ήχοι, κείμενα, λογότυπα) ανήκουν στο ${L.brand} ή στους νόμιμους δικαιοπαρόχους μας. Προστατεύονται από:\n\n• Ν. 2121/1993 περί Πνευματικής Ιδιοκτησίας (Ελλάδα)\n• Οδηγία 2001/29/ΕΚ της ΕΕ\n• Berne Convention\n\nΤο εμπορικό σήμα "${L.brand}" είναι κατατεθειμένο.`,
      },
      {
        heading: "11. Διαθεσιμότητα και τεχνικές διακοπές",
        body: `Η πλατφόρμα παρέχεται "ως έχει" (as-is). Αν και προσπαθούμε για 99.5% uptime:\n\n• Ενδέχεται να υπάρξουν προγραμματισμένες διακοπές για συντήρηση.\n• Δεν εγγυόμαστε αδιάλειπτη ή χωρίς σφάλματα λειτουργία.\n• Σε περίπτωση παρατεταμένης διακοπής (>72 ώρες), οι premium συνδρομητές δικαιούνται pro-rata πίστωση.`,
      },
      {
        heading: "12. Περιορισμός ευθύνης",
        body: `Στο μέγιστο επιτρεπόμενο από τον νόμο βαθμό:\n\n• Δεν φέρουμε ευθύνη για έμμεσες, τυχαίες ή επακόλουθες ζημίες.\n• Η συνολική μας ευθύνη περιορίζεται στο ποσό που καταβάλατε για συνδρομή τους τελευταίους 12 μήνες.\n• Δεν εγγυόμαστε εκπαιδευτικά αποτελέσματα — η χρήση είναι συμπληρωματική στη σχολική εκπαίδευση.\n\nΟι παραπάνω περιορισμοί δεν επηρεάζουν τα μη-αποποιήσιμα δικαιώματα του καταναλωτή υπό την ελληνική και ευρωπαϊκή νομοθεσία.`,
      },
      {
        heading: "13. Διαγραφή λογαριασμού",
        body: `Μπορείτε ανά πάσα στιγμή:\n\n• Να ακυρώσετε τη συνδρομή σας από τις ρυθμίσεις\n• Να ζητήσετε πλήρη διαγραφή λογαριασμού στέλνοντας email στο ${L.emailPrivacy}\n• Η διαγραφή ολοκληρώνεται εντός 30 ημερών (εκτός από αρχεία λογιστικής που διατηρούνται 5 χρόνια βάσει νόμου)\n• Η διαγραφή είναι μη αναστρέψιμη — όλα τα δεδομένα προόδου θα χαθούν`,
      },
      {
        heading: "14. Εφαρμοστέο δίκαιο και επίλυση διαφορών",
        body: `• Εφαρμοστέο δίκαιο: ${L.governingLaw}\n• Δικαιοδοσία: ${L.jurisdiction}\n\nΟnline Επίλυση Διαφορών (ODR):\nΓια καταναλωτές της ΕΕ, η Ευρωπαϊκή Επιτροπή παρέχει πλατφόρμα ODR στο: ${L.euOdrUrl}\n\nΠριν από οποιαδήποτε δικαστική ενέργεια, καλούμε να επικοινωνήσετε στο ${L.emailLegal} για φιλική επίλυση.`,
      },
      {
        heading: "15. Τροποποιήσεις των όρων",
        body: `Διατηρούμε το δικαίωμα να τροποποιούμε τους παρόντες όρους:\n\n• Σημαντικές αλλαγές ανακοινώνονται στην πλατφόρμα 30 ημέρες πριν τεθούν σε ισχύ\n• Ασήμαντες αλλαγές (π.χ. διορθώσεις τυπογραφικών) ισχύουν αμέσως\n• Η συνέχιση χρήσης μετά από τροποποίηση συνιστά αποδοχή\n• Αν διαφωνείτε, μπορείτε να ακυρώσετε τη συνδρομή σας πριν την έναρξη ισχύος`,
      },
      {
        heading: "16. Επικοινωνία",
        body: `Για ερωτήσεις σχετικά με τους όρους:\n\n• Νομικά: ${L.emailLegal}\n• Υποστήριξη: ${L.emailSupport}\n• Γενικά: ${L.emailGeneral}\n\n${L.legalName}\n${L.address}\n${L.country}`,
      },
    ],
  },
  en: {
    title: "Terms of Service",
    updated: `Last updated: ${L.policyUpdated}`,
    intro: `Welcome to ${L.brand}. Please read these Terms of Service carefully before using our platform. Use of the platform constitutes unconditional acceptance of these terms.`,
    sections: [
      {
        heading: "1. Company information",
        body: `${L.brand} is operated by:\n\n• Legal name: ${L.legalName}\n• Address: ${L.address}\n• VAT: ${L.vatNumber} — Tax office: ${L.taxOffice}\n• Business reg.: ${L.gemiNumber}\n• Email: ${L.emailGeneral}\n• Phone: ${L.phone}`,
      },
      {
        heading: "2. Acceptance of terms",
        body: `By accessing and using the platform, you accept:\n\n• These Terms of Service\n• The Privacy Policy (/privacy)\n• The Cookie Policy (/cookies)\n\nIf you do not agree with any term, please discontinue use.`,
      },
      {
        heading: "3. Service description",
        body: `${L.brand} is an online educational platform offering:\n\n• Learning games for children ages 2–12\n• Accounts for parents, teachers and students\n• AI-powered features (Study Buddy, photo solver, story generator)\n• Subscription plans (see clause 6)\n• B2B school licensing\n\nWe reserve the right to add, modify or remove features without notice.`,
      },
      {
        heading: "4. Eligibility and age limits",
        body: `• Children under 16 require explicit parental/guardian consent.\n• Children's accounts are created and managed exclusively by adults (parents or verified teachers).\n• False or misleading account creation is not permitted.\n• Automated access (bots, scrapers) is prohibited.`,
      },
      {
        heading: "5. Accounts and security",
        body: `You are responsible for:\n\n• Maintaining the confidentiality of your credentials\n• All actions performed under your account\n• Notifying us immediately of unauthorized access (at ${L.emailSupport})\n• Providing accurate registration information\n\nWe reserve the right to suspend or terminate accounts for breach of terms.`,
      },
      {
        heading: "6. Subscriptions and payments",
        body: `We offer the following plans:\n\n• Free: ${L.pricing.free} — basic features\n• Premium: ${L.pricing.premium} — all games & AI features\n• Family: ${L.pricing.family} — up to 6 children + parental controls\n• School: custom pricing — contact ${L.emailGeneral}\n\n• Free trial: ${L.pricing.trialDays} days, no charge. Cancel any time at no cost.\n• Billing: monthly auto-renewal via Stripe.\n• VAT: All prices include 24% VAT (digital services).\n• Cancellation: Cancel anytime from settings. Access continues until the end of the billed period.`,
      },
      {
        heading: "7. EU right of withdrawal",
        body: `Under EU consumer law (Directive 2011/83/EU):\n\n• You have ${L.pricing.refundDays} days from purchase to withdraw, no reason needed.\n• Refunds are issued within 14 days of request to the same payment method.\n• EXCEPTION: If you actively use premium content within 14 days, you waive the right of withdrawal (acknowledging immediate access to digital content).\n• Refund requests: ${L.emailSupport}`,
      },
      {
        heading: "8. Permitted and prohibited use",
        body: `Permitted:\n• Personal, non-commercial educational use\n• Use within school classrooms with active License\n\nProhibited:\n• Copying, reproducing or distributing platform content\n• Reverse engineering or attempting to extract source code\n• Use for illegal, misleading or harmful activities\n• Harassing other users via chat/multiplayer features\n• Bypassing security measures or subscription limits`,
      },
      {
        heading: "9. User-generated content",
        body: `When you create content via games (Pixel Art, Story Builder, Drawing Pad, etc.):\n\n• You retain all intellectual property rights to your creations.\n• You grant ${L.brand} a non-exclusive, worldwide license to store and display your content ONLY within your own account.\n• We will never publicly publish a child's content without explicit parental consent.`,
      },
      {
        heading: "10. Platform intellectual property",
        body: `All platform IP (code, design, games, art, sounds, text, logos) belongs to ${L.brand} or our legal licensors. Protected under:\n\n• Greek IP Law 2121/1993\n• EU Directive 2001/29/EC\n• Berne Convention\n\nThe trademark "${L.brand}" is registered.`,
      },
      {
        heading: "11. Availability and downtime",
        body: `Platform is provided "as-is". While we target 99.5% uptime:\n\n• Scheduled maintenance windows may occur.\n• We do not guarantee uninterrupted or error-free operation.\n• For prolonged outages (>72 hours), premium subscribers are entitled to pro-rata credit.`,
      },
      {
        heading: "12. Limitation of liability",
        body: `To the maximum extent permitted by law:\n\n• We are not liable for indirect, incidental or consequential damages.\n• Our total liability is limited to the amount paid for subscription in the past 12 months.\n• We do not guarantee educational outcomes — use is supplementary to school education.\n\nThe above does not affect non-waivable consumer rights under Greek and EU law.`,
      },
      {
        heading: "13. Account deletion",
        body: `You may at any time:\n\n• Cancel your subscription from settings\n• Request full account deletion by emailing ${L.emailPrivacy}\n• Deletion completes within 30 days (except accounting records retained 5 years by law)\n• Deletion is irreversible — all progress data will be lost`,
      },
      {
        heading: "14. Governing law and dispute resolution",
        body: `• Governing law: ${L.governingLaw}\n• Jurisdiction: ${L.jurisdiction}\n\nOnline Dispute Resolution (ODR):\nFor EU consumers, the European Commission provides an ODR platform at: ${L.euOdrUrl}\n\nBefore any legal action, please contact ${L.emailLegal} for amicable resolution.`,
      },
      {
        heading: "15. Modifications",
        body: `We reserve the right to modify these terms:\n\n• Major changes are announced 30 days in advance\n• Minor changes (e.g. typo fixes) are effective immediately\n• Continued use after modification constitutes acceptance\n• If you disagree, you may cancel before the effective date`,
      },
      {
        heading: "16. Contact",
        body: `For questions about these terms:\n\n• Legal: ${L.emailLegal}\n• Support: ${L.emailSupport}\n• General: ${L.emailGeneral}\n\n${L.legalName}\n${L.address}\n${L.country}`,
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
      <SEO title={c.title} description={c.intro} canonical="/terms" />
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
          <p className="text-sm text-slate-400 mb-3">{c.updated}</p>
          <p className="text-slate-600 dark:text-slate-300 mb-10 leading-relaxed">{c.intro}</p>

          <div className="space-y-6">
            {c.sections.map((s, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
                <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-3">{s.heading}</h2>
                <div className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line text-sm">{s.body}</div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-5 bg-purple-50 dark:bg-purple-900/30 rounded-2xl border border-purple-200 dark:border-purple-800 text-sm">
            <p className="font-semibold text-purple-700 dark:text-purple-300 mb-1">
              {lang === "el" ? "Σχετικές πολιτικές" : "Related policies"}
            </p>
            <p className="text-purple-600 dark:text-purple-400">
              <a href="/privacy" className="underline">{lang === "el" ? "Πολιτική Απορρήτου" : "Privacy Policy"}</a>
              {" · "}
              <a href="/cookies" className="underline">{lang === "el" ? "Πολιτική Cookies" : "Cookie Policy"}</a>
              {" · "}
              <a href="/dpa" className="underline">{lang === "el" ? "DPA (Σχολεία)" : "DPA (Schools)"}</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
