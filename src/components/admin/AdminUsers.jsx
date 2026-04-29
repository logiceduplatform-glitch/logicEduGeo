import React, { useContext, useEffect, useMemo, useState } from "react";
import { LanguageContext } from "../../i18n/LanguageContext";
import { AuthContext } from "../../auth/AuthContext";
import { AdminService } from "../../services/AdminService";

const T = {
  el: {
    title: "👥 Διαχείριση Χρηστών",
    search: "Αναζήτηση (email, όνομα)...",
    allRoles: "Όλοι οι ρόλοι",
    student: "Μαθητής",
    teacher: "Δάσκαλος",
    parent: "Γονέας",
    admin: "Admin",
    refresh: "🔄 Ανανέωση",
    role: "Ρόλος",
    actions: "Ενέργειες",
    setStudent: "Μαθητής",
    setTeacher: "Δάσκαλος",
    setParent: "Γονέας",
    verifyTeacher: "✅ Πιστοποίηση",
    unverifyTeacher: "↩️ Άρση",
    ban: "🚫 Ban",
    unban: "✅ Unban",
    grantPremium: "💎 Premium 30 μέρες",
    revokePremium: "↩️ Αφαίρεση Premium",
    addAdmin: "➕ Κάνε admin",
    removeAdmin: "↩️ Αφαίρεση admin",
    confirmBan: "Είσαι σίγουρος ότι θέλεις να κάνεις ban;",
    confirmRevoke: "Επιβεβαίωση αφαίρεσης premium;",
    noUsers: "Δεν βρέθηκαν χρήστες",
    loading: "Φόρτωση...",
    verified: "✓ Verified",
    banned: "BANNED",
    premium: "💎 Premium",
    you: "(εσύ)",
    showing: "Εμφάνιση {n} χρηστών",
  },
  en: {
    title: "👥 User Management",
    search: "Search (email, name)...",
    allRoles: "All roles",
    student: "Student",
    teacher: "Teacher",
    parent: "Parent",
    admin: "Admin",
    refresh: "🔄 Refresh",
    role: "Role",
    actions: "Actions",
    setStudent: "Student",
    setTeacher: "Teacher",
    setParent: "Parent",
    verifyTeacher: "✅ Verify",
    unverifyTeacher: "↩️ Unverify",
    ban: "🚫 Ban",
    unban: "✅ Unban",
    grantPremium: "💎 Grant 30 days",
    revokePremium: "↩️ Revoke premium",
    addAdmin: "➕ Make admin",
    removeAdmin: "↩️ Remove admin",
    confirmBan: "Are you sure you want to ban this user?",
    confirmRevoke: "Confirm revoke premium?",
    noUsers: "No users found",
    loading: "Loading...",
    verified: "✓ Verified",
    banned: "BANNED",
    premium: "💎 Premium",
    you: "(you)",
    showing: "Showing {n} users",
  },
};

export default function AdminUsers() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const { user } = useContext(AuthContext) || {};
  const l = T[lang] || T.en;

  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyUid, setBusyUid] = useState(null);

  const load = async () => {
    setLoading(true);
    const [u, a] = await Promise.all([
      AdminService.listUsers({ limit: 200, role: roleFilter || null }),
      AdminService.listAdmins(),
    ]);
    setUsers(u);
    setAdmins(a);
    setLoading(false);
  };

  useEffect(() => { load(); }, [roleFilter]);

  const adminUids = useMemo(() => new Set(admins.map((a) => a.uid)), [admins]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      return (u.email || "").toLowerCase().includes(q) ||
        (u.displayName || "").toLowerCase().includes(q) ||
        (u.id || "").toLowerCase().includes(q);
    });
  }, [users, search]);

  const wrap = async (uid, fn) => {
    if (!uid) return;
    setBusyUid(uid);
    try { await fn(); await load(); } catch (e) { alert("Error: " + e.message); }
    setBusyUid(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">{l.title}</h2>
        <button onClick={load} disabled={loading} className="text-sm font-semibold px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 disabled:opacity-50">{l.refresh}</button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={l.search}
          aria-label={l.search}
          className="flex-1 min-w-[200px] px-4 py-2 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-purple-400"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-purple-400"
        >
          <option value="">{l.allRoles}</option>
          <option value="student">{l.student}</option>
          <option value="teacher">{l.teacher}</option>
          <option value="parent">{l.parent}</option>
        </select>
      </div>

      <p className="text-xs text-slate-500 mb-3">{l.showing.replace("{n}", filtered.length)}</p>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-slate-500">{l.loading}</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-slate-500">{l.noUsers}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-left">
                <tr>
                  <th className="px-4 py-2 font-bold text-slate-600 dark:text-slate-300">User</th>
                  <th className="px-4 py-2 font-bold text-slate-600 dark:text-slate-300">{l.role}</th>
                  <th className="px-4 py-2 font-bold text-slate-600 dark:text-slate-300">Status</th>
                  <th className="px-4 py-2 font-bold text-slate-600 dark:text-slate-300">{l.actions}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => {
                  const isAdmin = adminUids.has(u.id);
                  const isMe = user?.uid === u.id;
                  const isSuper = AdminService.SUPER_ADMINS.includes((u.email || "").toLowerCase());
                  const busy = busyUid === u.id;
                  return (
                    <tr key={u.id} className="border-b border-slate-100 dark:border-slate-700 last:border-0 align-top">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {u.photoURL ? (
                            <img src={u.photoURL} alt="" className="w-8 h-8 rounded-full shrink-0" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold shrink-0">{(u.displayName || u.email || "?")[0]?.toUpperCase()}</div>
                          )}
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">{u.displayName || "—"} {isMe && <span className="text-xs text-purple-500">{l.you}</span>}</p>
                            <p className="text-xs text-slate-500 truncate font-mono">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                          {l[u.role] || u.role || "—"}
                        </span>
                        {u.teacherVerified && <span className="ml-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">{l.verified}</span>}
                      </td>
                      <td className="px-4 py-3 space-x-1">
                        {u.banned && <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">{l.banned}</span>}
                        {u.premium && <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">{l.premium}</span>}
                        {(isAdmin || isSuper) && <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">🛡️ {isSuper ? "SUPER" : "ADMIN"}</span>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {/* Role */}
                          <select
                            value={u.role || "student"}
                            disabled={busy}
                            onChange={(e) => wrap(u.id, () => AdminService.setUserRole(u.id, e.target.value))}
                            className="text-xs px-2 py-1 rounded-md border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                          >
                            <option value="student">{l.setStudent}</option>
                            <option value="teacher">{l.setTeacher}</option>
                            <option value="parent">{l.setParent}</option>
                          </select>

                          {/* Teacher verify */}
                          {u.role === "teacher" && (
                            <ActionBtn busy={busy} onClick={() => wrap(u.id, () => AdminService.setTeacherVerified(u.id, !u.teacherVerified))}>
                              {u.teacherVerified ? l.unverifyTeacher : l.verifyTeacher}
                            </ActionBtn>
                          )}

                          {/* Premium */}
                          {u.premium ? (
                            <ActionBtn busy={busy} variant="warn" onClick={() => { if (window.confirm(l.confirmRevoke)) wrap(u.id, () => AdminService.revokePremium(u.id)); }}>
                              {l.revokePremium}
                            </ActionBtn>
                          ) : (
                            <ActionBtn busy={busy} onClick={() => wrap(u.id, () => AdminService.grantPremium(u.id, 30))}>
                              {l.grantPremium}
                            </ActionBtn>
                          )}

                          {/* Ban */}
                          {!isMe && !isSuper && (
                            u.banned ? (
                              <ActionBtn busy={busy} onClick={() => wrap(u.id, () => AdminService.unbanUser(u.id))}>
                                {l.unban}
                              </ActionBtn>
                            ) : (
                              <ActionBtn busy={busy} variant="danger" onClick={() => { if (window.confirm(l.confirmBan)) wrap(u.id, () => AdminService.banUser(u.id, "admin_action")); }}>
                                {l.ban}
                              </ActionBtn>
                            )
                          )}

                          {/* Admin grant/revoke */}
                          {!isSuper && !isMe && (
                            isAdmin ? (
                              <ActionBtn busy={busy} variant="warn" onClick={() => wrap(u.id, () => AdminService.removeAdmin(u.id))}>
                                {l.removeAdmin}
                              </ActionBtn>
                            ) : (
                              <ActionBtn busy={busy} onClick={() => wrap(u.id, () => AdminService.addAdmin({ uid: u.id, email: u.email, name: u.displayName }, user?.email))}>
                                {l.addAdmin}
                              </ActionBtn>
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function ActionBtn({ busy, variant = "default", onClick, children }) {
  const styles = {
    default: "bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600",
    warn: "bg-amber-50 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-100",
    danger: "bg-rose-50 dark:bg-rose-900/30 border-rose-300 dark:border-rose-700 text-rose-700 dark:text-rose-300 hover:bg-rose-100",
  };
  return (
    <button
      onClick={onClick}
      disabled={busy}
      className={`text-[11px] font-bold px-2 py-1 rounded-md border ${styles[variant] || styles.default} disabled:opacity-50 transition`}
    >
      {children}
    </button>
  );
}
