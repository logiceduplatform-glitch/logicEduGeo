import React, { useState, useContext, useEffect } from "react";
import { LanguageContext } from "../i18n/LanguageContext";
import { AuthContext } from "../auth/AuthContext";
import { db } from "../auth/firebase";
import { collection, doc, setDoc, getDocs, deleteDoc, query, where } from "firebase/firestore";

const T = {
  el: {
    title: "Συν-διδασκαλία",
    subtitle: "Πρόσκαλεσε άλλους δασκάλους να συνεργαστείτε σε τάξεις",
    selectClass: "Διάλεξε τάξη",
    chooseClass: "-- Διάλεξε --",
    inviteEmail: "Email του δασκάλου",
    role: "Ρόλος",
    roleViewer: "Παρατηρητής (μόνο ανάγνωση)",
    roleEditor: "Συνεπεξεργαστής (πλήρη πρόσβαση)",
    sendInvite: "📧 Αποστολή Πρόσκλησης",
    pendingInvites: "Εκκρεμείς Προσκλήσεις",
    activeCoTeachers: "Ενεργοί Συν-Δάσκαλοι",
    none: "Καμία ακόμα.",
    accept: "Αποδοχή",
    reject: "Απόρριψη",
    revoke: "Αφαίρεση",
    pending: "Σε αναμονή",
    invited: "Στάλθηκε πρόσκληση!",
    myInvites: "Προσκλήσεις προς εμένα",
    invitedBy: "Από",
    accepted: "Αποδεχτήκατε!",
    rejected: "Απορρίψατε",
    confirmRevoke: "Σίγουρα αφαίρεση πρόσβασης;",
    invalidEmail: "Μη έγκυρο email",
    selfInvite: "Δεν μπορείς να καλέσεις τον εαυτό σου",
    classRequired: "Διάλεξε τάξη πρώτα",
    info: "Πώς δουλεύει η Συν-διδασκαλία",
    info1: "Στέλνεις πρόσκληση σε άλλο δάσκαλο",
    info2: "Όταν αποδεχτεί, βλέπει την τάξη στο dashboard του",
    info3: "Παρατηρητής: βλέπει αποτελέσματα. Συνεπεξεργαστής: φτιάχνει & αναθέτει quiz",
  },
  en: {
    title: "Co-Teaching",
    subtitle: "Invite other teachers to collaborate on your classrooms",
    selectClass: "Select classroom",
    chooseClass: "-- Choose --",
    inviteEmail: "Teacher's email",
    role: "Role",
    roleViewer: "Viewer (read-only)",
    roleEditor: "Co-Editor (full access)",
    sendInvite: "📧 Send Invite",
    pendingInvites: "Pending Invites",
    activeCoTeachers: "Active Co-Teachers",
    none: "None yet.",
    accept: "Accept",
    reject: "Reject",
    revoke: "Revoke",
    pending: "Pending",
    invited: "Invitation sent!",
    myInvites: "Invites for me",
    invitedBy: "From",
    accepted: "Accepted!",
    rejected: "Rejected",
    confirmRevoke: "Revoke access?",
    invalidEmail: "Invalid email",
    selfInvite: "Can't invite yourself",
    classRequired: "Pick a classroom first",
    info: "How Co-Teaching works",
    info1: "Send an invitation to another teacher's email",
    info2: "Once accepted, the class shows up in their dashboard",
    info3: "Viewer: sees results. Co-Editor: creates & assigns quizzes",
  },
};

export default function CoTeacherManager({ classrooms = [] }) {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const { user } = useContext(AuthContext);
  const l = T[lang] || T.en;

  const [selectedCode, setSelectedCode] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");
  const [invites, setInvites] = useState([]);
  const [myInvites, setMyInvites] = useState([]);
  const [flash, setFlash] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadAll = async () => {
    if (!db || !user) return;
    try {
      const sentQ = query(collection(db, "coTeacherInvites"), where("inviterUid", "==", user.uid));
      const sentSnap = await getDocs(sentQ);
      const sent = [];
      sentSnap.forEach(d => sent.push({ id: d.id, ...d.data() }));
      setInvites(sent);

      if (user.email) {
        const recvQ = query(collection(db, "coTeacherInvites"), where("inviteeEmail", "==", user.email.toLowerCase()));
        const recvSnap = await getDocs(recvQ);
        const recv = [];
        recvSnap.forEach(d => recv.push({ id: d.id, ...d.data() }));
        setMyInvites(recv);
      }
    } catch (e) {
      console.warn("[CoTeacher] Load failed:", e);
    }
  };

  useEffect(() => { loadAll(); }, [user]);

  const showFlash = (text, type = "success") => {
    setFlash({ text, type });
    setTimeout(() => setFlash(null), 3000);
  };

  const handleInvite = async () => {
    if (!selectedCode) return showFlash(l.classRequired, "error");
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return showFlash(l.invalidEmail, "error");
    if (trimmed === (user.email || "").toLowerCase()) return showFlash(l.selfInvite, "error");

    setLoading(true);
    const cls = classrooms.find(c => c.code === selectedCode);
    const inviteId = `inv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    try {
      await setDoc(doc(db, "coTeacherInvites", inviteId), {
        id: inviteId,
        classroomCode: selectedCode,
        classroomName: cls?.name || "",
        inviterUid: user.uid,
        inviterEmail: (user.email || "").toLowerCase(),
        inviterName: user.displayName || user.email || "",
        inviteeEmail: trimmed,
        role,
        status: "pending",
        createdAt: new Date().toISOString(),
      });
      setEmail("");
      showFlash(l.invited);
      loadAll();
    } catch (e) {
      console.error("Invite failed:", e);
      showFlash("Error", "error");
    }
    setLoading(false);
  };

  const respondInvite = async (inv, action) => {
    try {
      await setDoc(doc(db, "coTeacherInvites", inv.id), {
        ...inv,
        status: action,
        respondedAt: new Date().toISOString(),
        inviteeUid: user.uid,
      });
      showFlash(action === "accepted" ? l.accepted : l.rejected);
      loadAll();
    } catch (e) {
      console.error(e);
    }
  };

  const revokeInvite = async (inv) => {
    if (!confirm(l.confirmRevoke)) return;
    try {
      await deleteDoc(doc(db, "coTeacherInvites", inv.id));
      showFlash("✅");
      loadAll();
    } catch (e) {
      console.error(e);
    }
  };

  const pendingSent = invites.filter(i => i.status === "pending");
  const activeSent = invites.filter(i => i.status === "accepted");
  const pendingReceived = myInvites.filter(i => i.status === "pending");

  return (
    <div className="space-y-5">
      <div className="text-center bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 dark:from-violet-900/20 dark:via-purple-900/20 dark:to-fuchsia-900/20 rounded-2xl p-6 border border-violet-200 dark:border-violet-800">
        <span className="inline-block text-4xl mb-2">👥🤝</span>
        <h3 className="text-xl font-extrabold text-slate-800 dark:text-white">{l.title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{l.subtitle}</p>
      </div>

      {flash && (
        <div className={`p-3 rounded-xl text-sm font-semibold text-center ${flash.type === "error" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"}`}>
          {flash.text}
        </div>
      )}

      {/* Invites for me */}
      {pendingReceived.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4 border-2 border-amber-300 dark:border-amber-800">
          <h4 className="font-bold text-sm text-amber-800 dark:text-amber-400 mb-2">📨 {l.myInvites}</h4>
          <div className="space-y-2">
            {pendingReceived.map(inv => (
              <div key={inv.id} className="bg-white dark:bg-slate-800 rounded-xl p-3 flex items-center justify-between gap-2 flex-wrap">
                <div>
                  <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">{inv.classroomName}</div>
                  <div className="text-xs text-slate-500">{l.invitedBy}: {inv.inviterName} • {inv.role === "editor" ? l.roleEditor : l.roleViewer}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => respondInvite(inv, "accepted")} className="px-3 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-lg">✅ {l.accept}</button>
                  <button onClick={() => respondInvite(inv, "rejected")} className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg">{l.reject}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invite form */}
      {classrooms.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 block">{l.selectClass}</label>
            <select value={selectedCode} onChange={e => setSelectedCode(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white outline-none">
              <option value="">{l.chooseClass}</option>
              {classrooms.map(c => <option key={c.code} value={c.code}>{c.name} ({c.code})</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 block">{l.inviteEmail}</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="teacher@example.com"
              className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:border-violet-400"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 block">{l.role}</label>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setRole("viewer")} className={`px-3 py-2 rounded-lg text-xs font-bold ${role === "viewer" ? "bg-violet-500 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"}`}>👁️ {l.roleViewer}</button>
              <button onClick={() => setRole("editor")} className={`px-3 py-2 rounded-lg text-xs font-bold ${role === "editor" ? "bg-violet-500 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"}`}>✏️ {l.roleEditor}</button>
            </div>
          </div>
          <button
            onClick={handleInvite}
            disabled={loading}
            className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white font-bold shadow-md hover:shadow-lg transition disabled:opacity-60"
          >
            {loading ? "..." : l.sendInvite}
          </button>
        </div>
      )}

      {/* Pending sent */}
      {pendingSent.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
          <h4 className="font-bold text-sm text-slate-700 dark:text-slate-200 mb-3">⏳ {l.pendingInvites}</h4>
          <div className="space-y-2">
            {pendingSent.map(inv => (
              <div key={inv.id} className="flex items-center justify-between gap-2 p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg flex-wrap">
                <div className="text-sm">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{inv.inviteeEmail}</span>
                  <span className="ml-2 text-xs text-slate-500">→ {inv.classroomName} • {inv.role}</span>
                </div>
                <button onClick={() => revokeInvite(inv)} className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded font-semibold">{l.revoke}</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active co-teachers */}
      {activeSent.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
          <h4 className="font-bold text-sm text-slate-700 dark:text-slate-200 mb-3">✅ {l.activeCoTeachers}</h4>
          <div className="space-y-2">
            {activeSent.map(inv => (
              <div key={inv.id} className="flex items-center justify-between gap-2 p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg flex-wrap">
                <div className="text-sm">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{inv.inviteeEmail}</span>
                  <span className="ml-2 text-xs text-slate-500">{inv.classroomName} • {inv.role === "editor" ? "✏️" : "👁️"}</span>
                </div>
                <button onClick={() => revokeInvite(inv)} className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded font-semibold">{l.revoke}</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <details className="bg-violet-50 dark:bg-violet-900/20 rounded-xl p-4 border border-violet-200 dark:border-violet-800">
        <summary className="cursor-pointer font-bold text-sm text-violet-700 dark:text-violet-400">💡 {l.info}</summary>
        <ol className="mt-2 space-y-1 text-xs text-violet-600 dark:text-violet-300 list-decimal list-inside">
          <li>{l.info1}</li>
          <li>{l.info2}</li>
          <li>{l.info3}</li>
        </ol>
      </details>
    </div>
  );
}
