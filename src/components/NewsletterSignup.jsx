import React, { useState, useContext } from "react";
import { LanguageContext } from "../i18n/LanguageContext";

export default function NewsletterSignup({ variant = "inline" }) {
  const { lang } = useContext(LanguageContext);
  const isEl = lang === "el";
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || sending) return;
    setSending(true);
    setError(false);
    try {
      const res = await fetch("https://formspree.io/f/xpwzgkdl", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email, _subject: "Newsletter signup", type: "newsletter" }),
      });
      if (res.ok) {
        try {
          const existing = JSON.parse(localStorage.getItem("geo:newsletter") || "[]");
          if (!existing.includes(email)) {
            existing.push(email);
            localStorage.setItem("geo:newsletter", JSON.stringify(existing));
          }
        } catch {}
        setSubmitted(true);
        setEmail("");
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    }
    setSending(false);
  };

  if (submitted) {
    return (
      <div className={`flex items-center gap-2 ${variant === "footer" ? "text-emerald-400" : "text-emerald-600 dark:text-emerald-400"} text-sm font-medium`}>
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        {isEl ? "Ευχαριστούμε! Θα σε ενημερώνουμε." : "Thanks! We'll keep you updated."}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={isEl ? "Το email σου..." : "Your email..."}
          required
          className={`flex-1 min-w-0 px-4 py-2.5 rounded-xl text-sm outline-none transition-all ${
            variant === "footer"
              ? "bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500"
              : "bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white placeholder:text-slate-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900"
          }`}
        />
        <button
          type="submit"
          disabled={sending}
          className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md transition-all hover:scale-[1.02] shrink-0 disabled:opacity-60"
        >
          {sending ? "..." : isEl ? "Εγγραφή" : "Subscribe"}
        </button>
      </div>
      {error && (
        <p className="text-xs text-red-500">{isEl ? "Σφάλμα. Δοκιμάστε ξανά." : "Error. Please try again."}</p>
      )}
    </form>
  );
}
