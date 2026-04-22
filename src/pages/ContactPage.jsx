import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import { LanguageContext } from "../i18n/LanguageContext";

const SUBJECTS = {
  en: ["General inquiry", "Technical support", "Partnership", "Feedback", "Other"],
  el: ["Γενικό ερώτημα", "Τεχνική υποστήριξη", "Συνεργασία", "Σχόλια", "Άλλο"],
};

export default function ContactPage() {
  const navigate = useNavigate();
  const { lang } = useContext(LanguageContext);
  const isEl = lang === "el";

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const title = isEl ? "Επικοινωνία" : "Contact";
  const subjects = SUBJECTS[isEl ? "el" : "en"];

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = isEl ? "Υποχρεωτικό πεδίο" : "Required";
    if (!form.email.trim()) e.email = isEl ? "Υποχρεωτικό πεδίο" : "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = isEl ? "Μη έγκυρο email" : "Invalid email";
    }
    if (!form.subject) e.subject = isEl ? "Υποχρεωτικό πεδίο" : "Required";
    if (!form.message.trim()) e.message = isEl ? "Υποχρεωτικό πεδίο" : "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(false);

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    setSending(true);
    setSendError(false);

    try {
      const res = await fetch("https://formspree.io/f/xpwzgkdl", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: form.message,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        setForm({ name: "", email: "", subject: "", message: "" });
        setErrors({});
      } else {
        setSendError(true);
      }
    } catch {
      setSendError(true);
    } finally {
      setSending(false);
    }
  };

  const handleChange = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  return (
    <div id="main-content" className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <SEO
        title={title}
        description={isEl ? "Επικοινωνήστε μαζί μας" : "Get in touch with us"}
      />
      <Navbar />

      <div className="pt-24 pb-16 px-4">
        <div className="mx-auto max-w-5xl">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 mb-6 flex items-center gap-1 font-medium transition-colors"
          >
            &larr; {isEl ? "Πίσω" : "Back"}
          </button>

          <div className="mb-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-sm font-semibold mb-4">
              {isEl ? "Επικοινωνία" : "Contact"}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">
              {isEl ? "Επικοινωνήστε μαζί μας" : "Get in touch"}
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              {isEl
                ? "Στείλτε μας το μήνυμά σας και θα απαντήσουμε το συντομότερο δυνατό."
                : "Send us your message and we'll respond as soon as possible."}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                      <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                      {isEl ? "Ευχαριστούμε!" : "Thank you!"}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                      {isEl
                        ? "Το μήνυμά σας εστάλη επιτυχώς. Θα απαντήσουμε εντός 24 ωρών."
                        : "Your message was sent successfully. We'll respond within 24 hours."}
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/60 transition-colors"
                    >
                      {isEl ? "Στείλε νέο μήνυμα" : "Send another message"}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        {isEl ? "Όνομα" : "Name"} *
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                          errors.name
                            ? "border-red-500 dark:border-red-400"
                            : "border-slate-200 dark:border-slate-600"
                        }`}
                        placeholder={isEl ? "Το όνομά σας" : "Your name"}
                        autoComplete="name"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        {isEl ? "Email" : "Email"} *
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                          errors.email
                            ? "border-red-500 dark:border-red-400"
                            : "border-slate-200 dark:border-slate-600"
                        }`}
                        placeholder={isEl ? "εσύ@example.com" : "you@example.com"}
                        autoComplete="email"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.email}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        {isEl ? "Θέμα" : "Subject"} *
                      </label>
                      <select
                        value={form.subject}
                        onChange={(e) => handleChange("subject", e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                          errors.subject
                            ? "border-red-500 dark:border-red-400"
                            : "border-slate-200 dark:border-slate-600"
                        }`}
                      >
                        <option value="">{isEl ? "Επιλέξτε θέμα" : "Select subject"}</option>
                        {subjects.map((s, i) => (
                          <option key={i} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      {errors.subject && (
                        <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.subject}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        {isEl ? "Μήνυμα" : "Message"} *
                      </label>
                      <textarea
                        value={form.message}
                        onChange={(e) => handleChange("message", e.target.value)}
                        rows={5}
                        className={`w-full px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none ${
                          errors.message
                            ? "border-red-500 dark:border-red-400"
                            : "border-slate-200 dark:border-slate-600"
                        }`}
                        placeholder={isEl ? "Γράψτε το μήνυμά σας..." : "Write your message..."}
                      />
                      {errors.message && (
                        <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.message}</p>
                      )}
                    </div>
                    {sendError && (
                      <p className="text-sm text-red-500 dark:text-red-400 font-medium">
                        {isEl ? "Αποτυχία αποστολής. Δοκιμάστε ξανά." : "Failed to send. Please try again."}
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full sm:w-auto px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-md shadow-purple-300/30 dark:shadow-purple-900/30 transition-all disabled:opacity-60"
                    >
                      {sending
                        ? (isEl ? "Αποστολή..." : "Sending...")
                        : (isEl ? "Αποστολή" : "Send message")}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/20 border border-purple-100 dark:border-purple-800/50 p-6 h-fit">
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-4">
                  {isEl ? "Πληροφορίες επικοινωνίας" : "Contact info"}
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                      Email
                    </p>
                    <a
                      href="mailto:info@geoloplatform.com"
                      className="text-purple-700 dark:text-purple-300 hover:text-purple-800 dark:hover:text-purple-200 font-medium break-all"
                    >
                      info@geoloplatform.com
                    </a>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                      {isEl ? "Χρόνος απόκρισης" : "Response time"}
                    </p>
                    <p className="text-slate-700 dark:text-slate-300">
                      {isEl ? "Εντός 24 ωρών" : "Within 24 hours"}
                    </p>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-purple-200/50 dark:border-purple-700/50">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {isEl
                      ? "Επικοινωνήστε μαζί μας για ερωτήσεις, υποστήριξη ή συνεργασία."
                      : "Reach out for questions, support, or partnership opportunities."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
