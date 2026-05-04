import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LanguageContext } from "../../i18n/LanguageContext";
import { AuthContext } from "../../auth/AuthContext";
import AdminGate from "../../components/admin/AdminGate";
import SEO from "../../components/SEO";
import AdminOverview from "../../components/admin/AdminOverview";
import AdminUsers from "../../components/admin/AdminUsers";
import AdminFlags from "../../components/admin/AdminFlags";
import AdminPremium from "../../components/admin/AdminPremium";
import AdminContent from "../../components/admin/AdminContent";
import AdminModeration from "../../components/admin/AdminModeration";
import AdminSubscriptions from "../../components/admin/AdminSubscriptions";
import AdminSystem from "../../components/admin/AdminSystem";
import AdminLogs from "../../components/admin/AdminLogs";
import AdminErrorReports from "../../components/admin/AdminErrorReports";
import AdminEmailQueue from "../../components/admin/AdminEmailQueue";
import AdminPush from "../../components/admin/AdminPush";
import AdminFeedback from "../../components/admin/AdminFeedback";

const T = {
  el: {
    title: "🛠️ Admin Dashboard",
    subtitle: "Διαχείριση πλατφόρμας",
    home: "→ Site",
    overview: "Επισκόπηση",
    users: "Χρήστες",
    flags: "Feature Flags",
    premium: "Premium",
    content: "Περιεχόμενο",
    moderation: "Moderation",
    subs: "Subscriptions",
    system: "Σύστημα",
    logs: "Logs",
    errors: "Σφάλματα",
    emails: "Emails",
    push: "Push",
    feedback: "Γνώμες",
  },
  en: {
    title: "🛠️ Admin Dashboard",
    subtitle: "Platform management",
    home: "→ Site",
    overview: "Overview",
    users: "Users",
    flags: "Feature Flags",
    premium: "Premium",
    content: "Content",
    moderation: "Moderation",
    subs: "Subscriptions",
    system: "System",
    logs: "Logs",
    errors: "Errors",
    emails: "Emails",
    push: "Push",
    feedback: "Feedback",
  },
};

const TABS = [
  { id: "overview",    icon: "📊", key: "overview",    Comp: AdminOverview },
  { id: "users",       icon: "👥", key: "users",       Comp: AdminUsers },
  { id: "flags",       icon: "🎛️", key: "flags",       Comp: AdminFlags },
  { id: "premium",     icon: "💎", key: "premium",     Comp: AdminPremium },
  { id: "content",     icon: "📝", key: "content",     Comp: AdminContent },
  { id: "moderation",  icon: "🛡️", key: "moderation",  Comp: AdminModeration },
  { id: "subs",        icon: "💰", key: "subs",        Comp: AdminSubscriptions },
  { id: "system",      icon: "⚙️", key: "system",      Comp: AdminSystem },
  { id: "logs",        icon: "📋", key: "logs",        Comp: AdminLogs },
  { id: "errors",      icon: "🐞", key: "errors",      Comp: AdminErrorReports },
  { id: "emails",      icon: "📧", key: "emails",      Comp: AdminEmailQueue },
  { id: "push",        icon: "🔔", key: "push",        Comp: AdminPush },
  { id: "feedback",    icon: "💬", key: "feedback",    Comp: AdminFeedback },
];

export default function AdminDashboard() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const { user } = useContext(AuthContext) || {};
  const navigate = useNavigate();
  const l = T[lang] || T.en;

  const [tab, setTab] = useState("overview");
  const ActiveComp = TABS.find((t) => t.id === tab)?.Comp || AdminOverview;

  return (
    <AdminGate>
      <SEO title={l.title} description={l.subtitle} canonical="/admin" />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        {/* Top bar */}
        <header className="bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-extrabold flex items-center gap-2">
                <span aria-hidden>🛠️</span>
                <span className="truncate">{l.title}</span>
              </h1>
              <p className="text-xs text-slate-300 truncate">{l.subtitle}{user?.email ? ` · ${user.email}` : ""}</p>
            </div>
            <Link to="/" className="text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition shrink-0">{l.home}</Link>
          </div>
        </header>

        {/* Tabs */}
        <nav role="tablist" aria-label={l.title} className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 overflow-x-auto scrollbar-thin">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-1">
            {TABS.map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-1.5 px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 transition focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-inset ${active ? "text-purple-700 dark:text-purple-300 border-purple-500" : "text-slate-600 dark:text-slate-300 border-transparent hover:text-purple-600 dark:hover:text-purple-400"}`}
                >
                  <span aria-hidden>{t.icon}</span>
                  <span>{l[t.key]}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <ActiveComp />
        </main>
      </div>
    </AdminGate>
  );
}
