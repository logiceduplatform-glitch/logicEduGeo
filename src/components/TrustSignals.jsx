import React, { useContext } from "react";
import { LanguageContext } from "../i18n/LanguageContext";

const SIGNALS = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
    ),
    label: { el: "Χωρίς διαφημίσεις", en: "Ad-Free" },
    desc: { el: "100% καθαρή εμπειρία", en: "100% clean experience" },
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    label: { el: "Ασφαλές για παιδιά", en: "Safe for Kids" },
    desc: { el: "Εκπαιδευτικό περιεχόμενο μόνο", en: "Educational content only" },
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    label: { el: "GDPR", en: "GDPR Compliant" },
    desc: { el: "Προστασία προσωπικών δεδομένων", en: "Data privacy protected" },
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
      </svg>
    ),
    label: { el: "Χωρίς εγκατάσταση", en: "No Installation" },
    desc: { el: "Παίξε απευθείας στον browser", en: "Play directly in browser" },
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
    label: { el: "PWA / Offline", en: "Works Offline" },
    desc: { el: "Λειτουργεί και χωρίς internet", en: "Works without internet" },
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
      </svg>
    ),
    label: { el: "Κινητό & Desktop", en: "Mobile & Desktop" },
    desc: { el: "Responsive σε κάθε οθόνη", en: "Responsive on every screen" },
  },
];

export default function TrustSignals() {
  const { lang } = useContext(LanguageContext);
  const isEl = lang === "el";

  return (
    <section className="py-14 bg-white dark:bg-slate-800/50">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-10">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            {isEl ? "Γιατί να μας εμπιστευτείς" : "Why trust us"}
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {SIGNALS.map((s, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center gap-2 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                {s.icon}
              </div>
              <span className="font-bold text-sm text-slate-800 dark:text-white">
                {s.label[isEl ? "el" : "en"]}
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 leading-tight">
                {s.desc[isEl ? "el" : "en"]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
