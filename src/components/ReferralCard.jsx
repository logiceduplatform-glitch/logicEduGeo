import React, { useContext, useState } from "react";
import { AuthContext } from "../auth/AuthContext";
import { LanguageContext } from "../i18n/LanguageContext";
import { AnalyticsService } from "../services/AnalyticsService";

export default function ReferralCard() {
  const { user } = useContext(AuthContext);
  const { lang } = useContext(LanguageContext);
  const isEl = lang === "el";
  const [copied, setCopied] = useState(false);

  if (!user) return null;

  const refCode = user.uid?.slice(0, 8) || "GEOLO";
  const refLink = `${window.location.origin}/?ref=${refCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(refLink);
      setCopied(true);
      AnalyticsService.referralShare("copy");
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  const handleShare = async () => {
    AnalyticsService.referralShare("share_api");
    if (navigator.share) {
      try {
        await navigator.share({
          title: isEl ? "Kibloo — Μάθε παίζοντας!" : "Kibloo — Learn by playing!",
          text: isEl
            ? "Δοκίμασε αυτή την εκπαιδευτική πλατφόρμα! Χρησιμοποίησε τον κωδικό μου για bonus."
            : "Try this educational platform! Use my code for a bonus.",
          url: refLink,
        });
      } catch {}
    } else {
      handleCopy();
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-5 border border-purple-200 dark:border-purple-800">
      <div className="flex items-start gap-3 mb-4">
        <span className="text-2xl">🎁</span>
        <div>
          <h3 className="text-sm font-bold text-purple-800 dark:text-purple-200">
            {isEl ? "Πρόσκληση φίλου" : "Invite a friend"}
          </h3>
          <p className="text-xs text-purple-600 dark:text-purple-400 mt-0.5">
            {isEl
              ? "Μοιράσου τον σύνδεσμό σου και κέρδισε bonus νομίσματα!"
              : "Share your link and earn bonus coins!"}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex-1 min-w-0 px-3 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-700 text-xs font-mono text-purple-700 dark:text-purple-300 truncate">
          {refLink}
        </div>
        <button
          onClick={handleCopy}
          className={`shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            copied
              ? "bg-emerald-500 text-white"
              : "bg-purple-600 text-white hover:bg-purple-700"
          }`}
        >
          {copied ? "✓" : isEl ? "Αντιγραφή" : "Copy"}
        </button>
      </div>

      {navigator.share && (
        <button
          onClick={handleShare}
          className="mt-3 w-full py-2.5 rounded-xl text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/40 hover:bg-purple-200 dark:hover:bg-purple-900/60 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          {isEl ? "Κοινοποίηση" : "Share"}
        </button>
      )}
    </div>
  );
}
