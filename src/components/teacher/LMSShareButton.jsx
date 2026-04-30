import React, { useContext, useState } from "react";
import { LanguageContext } from "../../i18n/LanguageContext";
import { LMSExportService } from "../../services/LMSExportService";

const T = {
  el: {
    share: "Κοινοποίηση σε LMS",
    google: "Google Classroom",
    teams: "Microsoft Teams",
    email: "Email",
    copyLink: "Αντιγραφή link",
    copied: "Αντιγράφηκε!",
    downloadIcs: "Λήψη ημερολογίου (.ics)",
    close: "Κλείσιμο",
    title: "Στείλε τους μαθητές σου",
    desc: "Επίλεξε πλατφόρμα για να μοιραστείς την εργασία.",
  },
  en: {
    share: "Share to LMS",
    google: "Google Classroom",
    teams: "Microsoft Teams",
    email: "Email",
    copyLink: "Copy link",
    copied: "Copied!",
    downloadIcs: "Download calendar (.ics)",
    close: "Close",
    title: "Send to your students",
    desc: "Pick a platform to share this assignment.",
  },
};

export default function LMSShareButton({ url, title = "Assignment", body = "", dueDate = null, className = "" }) {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
  };

  const handleIcs = () => {
    if (!dueDate) return;
    const ics = LMSExportService.toICS({ title, description: body, dueDate, url });
    LMSExportService.downloadICS(`${(title || "assignment").replace(/\s+/g, "_")}.ics`, ics);
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-sm shadow ${className}`}>
        📤 {l.share}
      </button>

      {open && (
        <div role="dialog" className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md space-y-3" onClick={(e) => e.stopPropagation()}>
            <div>
              <h3 className="text-xl font-extrabold text-slate-800 dark:text-white">{l.title}</h3>
              <p className="text-sm text-slate-500 mt-1">{l.desc}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={() => LMSExportService.shareToGoogleClassroom({ url, title, body })}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white font-bold shadow hover:scale-[1.02] transition"
              >
                <span className="text-2xl">🎓</span>
                {l.google}
              </button>
              <button
                onClick={() => LMSExportService.shareToTeams({ url, title, body })}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white font-bold shadow hover:scale-[1.02] transition"
              >
                <span className="text-2xl">💼</span>
                {l.teams}
              </button>
              <a
                href={LMSExportService.emailLink({ title, body, url })}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white font-bold shadow hover:scale-[1.02] transition"
              >
                <span className="text-2xl">✉️</span>
                {l.email}
              </a>
              <button
                onClick={handleCopy}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white font-bold shadow hover:scale-[1.02] transition"
              >
                <span className="text-2xl">🔗</span>
                {copied ? l.copied : l.copyLink}
              </button>
              {dueDate && (
                <button
                  onClick={handleIcs}
                  className="sm:col-span-2 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold shadow"
                >
                  <span className="text-2xl">📅</span>
                  {l.downloadIcs}
                </button>
              )}
            </div>

            <p className="text-[11px] text-slate-400 break-all border-t border-slate-100 dark:border-slate-700 pt-2 font-mono">{url}</p>

            <button onClick={() => setOpen(false)} className="w-full px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm">
              {l.close}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
