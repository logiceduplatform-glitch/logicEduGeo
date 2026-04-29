import React, { useContext, useEffect, useState } from "react";
import { LanguageContext } from "../../i18n/LanguageContext";
import { AuthContext } from "../../auth/AuthContext";
import { AdminService } from "../../services/AdminService";

const T = {
  el: {
    title: "📝 Διαχείριση Περιεχομένου",
    announcements: "📢 Ανακοινώσεις",
    newAnn: "Νέα Ανακοίνωση",
    annTitle: "Τίτλος",
    annMessage: "Μήνυμα",
    annType: "Τύπος",
    typeInfo: "Ενημέρωση",
    typeWarning: "Προειδοποίηση",
    typeSuccess: "Επιτυχία",
    typePromo: "Προσφορά",
    create: "Δημιουργία",
    save: "Αποθήκευση",
    cancel: "Άκυρο",
    delete: "Διαγραφή",
    activate: "✅ Ενεργοποίηση",
    deactivate: "⏸️ Απενεργοποίηση",
    edit: "✏️ Επεξεργασία",
    active: "ΕΝΕΡΓΗ",
    inactive: "Ανενεργή",
    confirmDelete: "Επιβεβαίωση διαγραφής;",
    none: "Δεν υπάρχουν ανακοινώσεις",
    blogNote: "💡 Τα άρθρα του blog διαχειρίζονται από τον κώδικα (src/pages/BlogPage.jsx & άρθρα).",
    eventsNote: "💡 Τα events διαχειρίζονται από το src/config/eventsConfig.js.",
  },
  en: {
    title: "📝 Content Management",
    announcements: "📢 Announcements",
    newAnn: "New Announcement",
    annTitle: "Title",
    annMessage: "Message",
    annType: "Type",
    typeInfo: "Info",
    typeWarning: "Warning",
    typeSuccess: "Success",
    typePromo: "Promo",
    create: "Create",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    activate: "✅ Activate",
    deactivate: "⏸️ Deactivate",
    edit: "✏️ Edit",
    active: "ACTIVE",
    inactive: "Inactive",
    confirmDelete: "Confirm delete?",
    none: "No announcements",
    blogNote: "💡 Blog articles are managed in code (src/pages/BlogPage.jsx & articles).",
    eventsNote: "💡 Events are managed in src/config/eventsConfig.js.",
  },
};

const TYPE_STYLES = {
  info:    { bg: "bg-blue-100 dark:bg-blue-900/40",  text: "text-blue-700 dark:text-blue-300",  icon: "ℹ️" },
  warning: { bg: "bg-amber-100 dark:bg-amber-900/40", text: "text-amber-700 dark:text-amber-300", icon: "⚠️" },
  success: { bg: "bg-emerald-100 dark:bg-emerald-900/40", text: "text-emerald-700 dark:text-emerald-300", icon: "✅" },
  promo:   { bg: "bg-pink-100 dark:bg-pink-900/40", text: "text-pink-700 dark:text-pink-300", icon: "🎉" },
};

export default function AdminContent() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const { user } = useContext(AuthContext) || {};
  const l = T[lang] || T.en;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: "", message: "", type: "info", active: true });

  const load = async () => {
    setLoading(true);
    setItems(await AdminService.listAnnouncements());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const startNew = () => {
    setEditId(null);
    setForm({ title: "", message: "", type: "info", active: true });
    setShowForm(true);
  };

  const startEdit = (item) => {
    setEditId(item.id);
    setForm({ title: item.title || "", message: item.message || "", type: item.type || "info", active: !!item.active });
    setShowForm(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) return;
    if (editId) {
      await AdminService.updateAnnouncement(editId, form);
    } else {
      await AdminService.createAnnouncement({ ...form, createdByEmail: user?.email });
    }
    setShowForm(false);
    setEditId(null);
    await load();
  };

  const toggleActive = async (item) => {
    await AdminService.updateAnnouncement(item.id, { active: !item.active });
    await load();
  };

  const remove = async (item) => {
    if (!window.confirm(l.confirmDelete)) return;
    await AdminService.deleteAnnouncement(item.id);
    await load();
  };

  return (
    <div>
      <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 mb-4">{l.title}</h2>

      <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden mb-6">
        <header className="px-5 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between gap-2 flex-wrap">
          <h3 className="font-bold text-slate-800 dark:text-slate-100">{l.announcements}</h3>
          <button onClick={startNew} className="text-sm font-bold px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            ➕ {l.newAnn}
          </button>
        </header>

        {showForm && (
          <form onSubmit={submit} className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 space-y-3 bg-slate-50 dark:bg-slate-900/40">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">{l.annTitle}</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">{l.annMessage}</label>
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required rows={3} className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100" />
            </div>
            <div className="flex flex-wrap gap-3 items-center">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300">{l.annType}</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="px-3 py-1.5 rounded-lg border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-200">
                <option value="info">{l.typeInfo}</option>
                <option value="warning">{l.typeWarning}</option>
                <option value="success">{l.typeSuccess}</option>
                <option value="promo">{l.typePromo}</option>
              </select>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
                {l.active}
              </label>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-sm">{editId ? l.save : l.create}</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm">{l.cancel}</button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="p-10 text-center text-sm text-slate-500">...</div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">{l.none}</div>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-700">
            {items.map((item) => {
              const t = TYPE_STYLES[item.type] || TYPE_STYLES.info;
              return (
                <li key={item.id} className="px-5 py-3 flex items-start gap-3 flex-wrap">
                  <div className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${t.bg}`}>{t.icon}</div>
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-slate-800 dark:text-slate-100">{item.title}</p>
                      {item.active ? (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${t.bg} ${t.text}`}>{l.active}</span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500">{l.inactive}</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 whitespace-pre-line">{item.message}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => toggleActive(item)} className="text-[11px] font-bold px-2 py-1 rounded-md bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50">
                      {item.active ? l.deactivate : l.activate}
                    </button>
                    <button onClick={() => startEdit(item)} className="text-[11px] font-bold px-2 py-1 rounded-md bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50">{l.edit}</button>
                    <button onClick={() => remove(item)} className="text-[11px] font-bold px-2 py-1 rounded-md bg-rose-50 dark:bg-rose-900/30 border border-rose-300 dark:border-rose-700 text-rose-700 dark:text-rose-300 hover:bg-rose-100">{l.delete}</button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <div className="space-y-3">
        <p className="text-xs text-slate-600 dark:text-slate-300 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3">{l.blogNote}</p>
        <p className="text-xs text-slate-600 dark:text-slate-300 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3">{l.eventsNote}</p>
      </div>
    </div>
  );
}
