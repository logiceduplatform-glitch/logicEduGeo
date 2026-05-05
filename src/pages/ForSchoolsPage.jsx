import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import SEO from "../components/SEO";
import Navbar from "../components/Navbar";
import FooterSection from "../components/FooterSection";

const T = {
  el: {
    title: "Για Σχολεία & Φροντιστήρια",
    subtitle: "Ολοκληρωμένη πλατφόρμα για ιδρύματα — εκπτώσεις όγκου, τιμολόγηση, διαχείριση ομάδων.",
    heroBadge: "🏫 B2B Λύσεις",
    heroCta: "Ζήτα προσφορά",
    heroCtaSecondary: "Δες τις τιμές",
    pricingTitle: "Τιμές ανά μαθητή / έτος",
    pricingSubtitle: "Όλες οι τιμές χωρίς ΦΠΑ. Ετήσια χρέωση. Δωρεάν setup & training.",
    seats: "θέσεις",
    perSeat: "ανά θέση/έτος",
    save: "Κερδίζεις",
    plansHint: "💡 Όλα τα πλάνα περιλαμβάνουν: 350+ παιχνίδια, dashboard δασκάλου, αναφορές προόδου, GDPR-compliant DPA.",
    featuresTitle: "Τι περιλαμβάνει",
    requestQuoteTitle: "Ζήτα προσφορά για το σχολείο σου",
    requestQuoteSubtitle: "Συμπλήρωσε τη φόρμα και θα σου στείλουμε εξατομικευμένη προσφορά εντός 24h.",
    formSchool: "Όνομα σχολείου",
    formContact: "Όνομα υπεύθυνου",
    formEmail: "Email επικοινωνίας",
    formPhone: "Τηλέφωνο (προαιρετικό)",
    formStudents: "Αριθμός μαθητών",
    formMessage: "Επιπλέον σχόλια",
    formSubmit: "Στείλε αίτημα",
    formSent: "✅ Λάβαμε το αίτημά σου! Θα επικοινωνήσουμε σύντομα.",
    faqTitle: "Συχνές ερωτήσεις",
    faqs: [
      { q: "Πώς γίνεται η τιμολόγηση;", a: "Στέλνουμε ηλεκτρονικό τιμολόγιο μέσω της πλατφόρμας. Δέχεται όλους τους τύπους πληρωμής (κάρτα, τραπεζική κατάθεση, IRIS) και είναι συμβατό με το mydata της ΑΑΔΕ." },
      { q: "Υπάρχει DPA (Data Processing Agreement);", a: "Ναι. Παρέχουμε υπογεγραμμένο DPA που πληροί τις απαιτήσεις του GDPR για επεξεργασία δεδομένων ανηλίκων." },
      { q: "Μπορώ να δοκιμάσω πριν αγοράσω;", a: "Ναι, προσφέρουμε δωρεάν 30-ήμερη δοκιμή για όλο το σχολείο, χωρίς πιστωτική κάρτα." },
      { q: "Τι γίνεται με την εκπαίδευση δασκάλων;", a: "Περιλαμβάνεται 1 δωρεάν online συνεδρία training (60'), βίντεο tutorials και 24/7 email support." },
      { q: "Δουλεύει με Chromebooks/Tablets;", a: "Ναι. Είμαστε 100% web-based με PWA installation. Δουλεύει σε Chrome, Safari, Firefox, Edge και mobile browsers." },
      { q: "Μπορώ να ακυρώσω τη συνδρομή;", a: "Ναι. Η συνδρομή είναι ετήσια αλλά μπορείτε να την ακυρώσετε χωρίς ποινή πριν την ανανέωση." },
    ],
    contactCta: "Έχεις ερωτήσεις; Στείλε email στο",
  },
  en: {
    title: "For Schools & Training Centers",
    subtitle: "Full platform for institutions — volume discounts, invoicing, team management.",
    heroBadge: "🏫 B2B Solutions",
    heroCta: "Request a quote",
    heroCtaSecondary: "View pricing",
    pricingTitle: "Per-student / year pricing",
    pricingSubtitle: "Prices excl. VAT. Annual billing. Free setup & training included.",
    seats: "seats",
    perSeat: "per seat/year",
    save: "You save",
    plansHint: "💡 All plans include: 350+ games, teacher dashboard, progress reports, GDPR-compliant DPA.",
    featuresTitle: "What's included",
    requestQuoteTitle: "Request a quote for your school",
    requestQuoteSubtitle: "Fill in the form and we'll send a personalised quote within 24h.",
    formSchool: "School name",
    formContact: "Contact name",
    formEmail: "Contact email",
    formPhone: "Phone (optional)",
    formStudents: "Number of students",
    formMessage: "Additional notes",
    formSubmit: "Send request",
    formSent: "✅ We got your request! We'll be in touch shortly.",
    faqTitle: "Frequently asked",
    faqs: [
      { q: "How does invoicing work?", a: "We send digital invoices through the platform. Accepts cards, bank transfers, IRIS — fully compatible with Greek mydata authority." },
      { q: "Is there a DPA (Data Processing Agreement)?", a: "Yes — a signed DPA is provided that meets GDPR requirements for processing minors' data." },
      { q: "Can I trial before buying?", a: "Yes — a free 30-day trial for the whole school, no credit card required." },
      { q: "What about teacher training?", a: "Includes 1 free 60-minute online training session, video tutorials, and 24/7 email support." },
      { q: "Does it work on Chromebooks/Tablets?", a: "Yes — 100% web-based with PWA install. Works on Chrome, Safari, Firefox, Edge and mobile browsers." },
      { q: "Can I cancel?", a: "Yes — annual billing but you can cancel without penalty before renewal." },
    ],
    contactCta: "Have questions? Email us at",
  },
};

const PRICING_TIERS = [
  { id: "small",  seats: "20-99",   pricePerSeat: 25, label: { el: "Μικρό σχολείο", en: "Small school" } },
  { id: "medium", seats: "100-299", pricePerSeat: 18, label: { el: "Μεσαίο σχολείο", en: "Medium school" }, highlight: true, save: 28 },
  { id: "large",  seats: "300-999", pricePerSeat: 14, label: { el: "Μεγάλο σχολείο", en: "Large school" }, save: 44 },
  { id: "enterprise", seats: "1000+", pricePerSeat: 10, label: { el: "Όμιλος / Δίκτυο", en: "Enterprise / network" }, save: 60 },
];

const FEATURES = {
  el: [
    { icon: "📊", title: "Dashboard Σχολείου", desc: "Όλες οι τάξεις, οι δάσκαλοι και οι αναφορές σε ένα μέρος." },
    { icon: "🏫", title: "Απεριόριστες τάξεις", desc: "Δημιούργησε όσες τάξεις χρειάζεσαι, με δικό κωδικό η καθεμιά." },
    { icon: "👨‍🏫", title: "Πολλοί λογαριασμοί δασκάλων", desc: "Κάθε δάσκαλος έχει δικό του login και διαχειρίζεται μόνο τις δικές του τάξεις." },
    { icon: "📝", title: "Custom quiz banks", desc: "Φτιάξτε δική σας βιβλιοθήκη ερωτήσεων που μοιράζεται όλο το σχολείο." },
    { icon: "📜", title: "Πιστοποιητικά", desc: "Αυτόματη έκδοση πιστοποιητικών για ολοκληρωμένα μαθήματα — με logo σχολείου." },
    { icon: "🔒", title: "GDPR & DPA", desc: "Υπογεγραμμένο DPA, EU data residency, full audit logs." },
    { icon: "💼", title: "Τιμολόγηση & ΑΦΜ", desc: "Νόμιμα παραστατικά mydata-compliant. Καμία γραφειοκρατία." },
    { icon: "🎓", title: "Δωρεάν training", desc: "1 ώρα live training + video tutorials στα Ελληνικά για όλους τους δασκάλους." },
    { icon: "🛟", title: "Priority Support", desc: "Email response < 4h εργάσιμες, dedicated account manager για >300 μαθητές." },
  ],
  en: [
    { icon: "📊", title: "School Dashboard", desc: "All classes, teachers and reports in one place." },
    { icon: "🏫", title: "Unlimited classes", desc: "Create as many classes as you need, each with its own join code." },
    { icon: "👨‍🏫", title: "Multiple teacher accounts", desc: "Each teacher logs in with their own credentials and manages only their classes." },
    { icon: "📝", title: "Custom quiz banks", desc: "Build your own school-wide question library shared by all teachers." },
    { icon: "📜", title: "Certificates", desc: "Auto-generated completion certificates — with your school logo." },
    { icon: "🔒", title: "GDPR & DPA", desc: "Signed DPA, EU data residency, full audit logs." },
    { icon: "💼", title: "Invoicing & VAT", desc: "Legal mydata-compliant invoices. Zero paperwork." },
    { icon: "🎓", title: "Free training", desc: "1-hour live training + video tutorials for all your teachers." },
    { icon: "🛟", title: "Priority Support", desc: "Email reply < 4h business hours, dedicated account manager for >300 students." },
  ],
};

export default function ForSchoolsPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const isEl = lang === "el";
  const l = T[isEl ? "el" : "en"];
  const navigate = useNavigate();

  const [form, setForm] = useState({
    school: "", contact: "", email: "", phone: "", students: "", message: "", honeypot: "",
  });
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (form.honeypot) return; // bot trap
    if (!form.email || !form.school) return;
    setBusy(true);
    try {
      // Optional: persist to Firestore so admin can see the lead.
      const { addDoc, collection, serverTimestamp } = await import("firebase/firestore");
      const { db } = await import("../auth/firebase");
      await addDoc(collection(db, "schoolLeads"), {
        ...form,
        lang,
        createdAt: serverTimestamp(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      });
    } catch {
      // If Firestore fails, fall back to mailto link.
      try {
        const subject = encodeURIComponent(`School quote request: ${form.school}`);
        const body = encodeURIComponent(JSON.stringify(form, null, 2));
        window.location.href = `mailto:hello@kibloo.app?subject=${subject}&body=${body}`;
      } catch { /* noop */ }
    }
    setBusy(false);
    setSent(true);
  };

  return (
    <>
      <SEO
        title={l.title}
        description={l.subtitle}
        canonical="/for-schools"
      />
      <Navbar />

      <main id="main-content" className="pt-20 pb-16 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 min-h-screen">
        {/* HERO */}
        <section className="max-w-5xl mx-auto px-4 text-center py-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-bold mb-4">
            {l.heroBadge}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-800 dark:text-white mb-4">
            {l.title}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {l.subtitle}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#quote"
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold shadow-lg hover:scale-105 transition-all"
            >
              {l.heroCta}
            </a>
            <a
              href="#pricing"
              className="px-6 py-3 rounded-2xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold border-2 border-slate-200 dark:border-slate-700 hover:border-purple-300 transition-all"
            >
              {l.heroCtaSecondary}
            </a>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="max-w-6xl mx-auto px-4 py-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white mb-2">
              {l.pricingTitle}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{l.pricingSubtitle}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.id}
                className={`relative rounded-2xl p-5 border-2 transition shadow ${
                  tier.highlight
                    ? "border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 scale-105 z-10"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                }`}
              >
                {tier.save && (
                  <span className="absolute -top-3 right-4 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500 text-white shadow">
                    {l.save} {tier.save}%
                  </span>
                )}
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  {tier.label[isEl ? "el" : "en"]}
                </p>
                <p className="text-3xl font-extrabold text-slate-800 dark:text-white">
                  €{tier.pricePerSeat}
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">/{l.seats.replace("seats", "seat").replace("θέσεις", "θέση")}</span>
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{l.perSeat}</p>
                <p className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {tier.seats} {l.seats}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            {l.plansHint}
          </p>
        </section>

        {/* FEATURES */}
        <section className="max-w-6xl mx-auto px-4 py-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white text-center mb-8">
            {l.featuresTitle}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES[isEl ? "el" : "en"].map((f, i) => (
              <div key={i} className="rounded-2xl bg-white dark:bg-slate-800 p-5 shadow border border-slate-200 dark:border-slate-700">
                <div className="text-3xl mb-2">{f.icon}</div>
                <h3 className="font-bold text-slate-800 dark:text-white text-base mb-1">{f.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* QUOTE FORM */}
        <section id="quote" className="max-w-3xl mx-auto px-4 py-10">
          <div className="rounded-3xl bg-white dark:bg-slate-800 p-6 sm:p-10 shadow-xl border border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white mb-2">
              {l.requestQuoteTitle}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{l.requestQuoteSubtitle}</p>

            {sent ? (
              <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 p-6 text-center">
                <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">{l.formSent}</p>
                <button
                  onClick={() => navigate("/")}
                  className="mt-4 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition"
                >
                  ← {isEl ? "Στην αρχική" : "Back to home"}
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-3">
                {/* Honeypot for bots — humans never see this. */}
                <input
                  type="text"
                  name="website"
                  value={form.honeypot}
                  onChange={(e) => setForm({ ...form, honeypot: e.target.value })}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input label={l.formSchool + " *"} value={form.school} onChange={(v) => setForm({ ...form, school: v })} required />
                  <Input label={l.formContact + " *"} value={form.contact} onChange={(v) => setForm({ ...form, contact: v })} required />
                  <Input label={l.formEmail + " *"} value={form.email} onChange={(v) => setForm({ ...form, email: v })} required type="email" />
                  <Input label={l.formPhone} value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} type="tel" />
                </div>
                <Input label={l.formStudents + " *"} value={form.students} onChange={(v) => setForm({ ...form, students: v })} required type="number" />
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">{l.formMessage}</label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-purple-400"
                  />
                </div>
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold shadow-lg hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-wait"
                >
                  {busy ? "..." : l.formSubmit}
                </button>
                <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                  {l.contactCta} <a href="mailto:hello@kibloo.app" className="text-purple-600 dark:text-purple-400 font-semibold underline">hello@kibloo.app</a>
                </p>
              </form>
            )}
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto px-4 py-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white text-center mb-6">
            {l.faqTitle}
          </h2>
          <div className="space-y-2">
            {l.faqs.map((f, i) => (
              <details key={i} className="group rounded-2xl bg-white dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
                <summary className="cursor-pointer font-bold text-slate-800 dark:text-white flex items-center justify-between gap-3">
                  <span>{f.q}</span>
                  <span className="text-purple-500 text-xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <FooterSection t={(k, fb) => fb || k} />
    </>
  );
}

function Input({ label, value, onChange, type = "text", required = false }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-purple-400"
      />
    </div>
  );
}
