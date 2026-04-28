import React, { useState, useContext, useEffect, useCallback } from "react";
import { LanguageContext } from "../i18n/LanguageContext";
import { AuthContext } from "../auth/AuthContext";
import { db } from "../auth/firebase";
import { collection, doc, setDoc, getDocs, deleteDoc, query, where, updateDoc } from "firebase/firestore";

function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

const T = {
  el: {
    title: "Εργασίες",
    create: "Νέα Εργασία",
    noHomework: "Δεν υπάρχουν εργασίες ακόμα.",
    hwTitle: "Τίτλος εργασίας",
    description: "Περιγραφή / Οδηγίες",
    deadline: "Προθεσμία",
    assignTo: "Ανάθεση σε τάξη",
    selectClassroom: "Επίλεξε τάξη",
    selectQuiz: "Σύνδεσε quiz (προαιρετικό)",
    selectLesson: "Σύνδεσε μάθημα (προαιρετικό)",
    noQuiz: "Χωρίς quiz",
    noLesson: "Χωρίς μάθημα",
    save: "Αποθήκευση",
    delete: "Διαγραφή",
    cancel: "Ακύρωση",
    status: "Κατάσταση",
    active: "Ενεργή",
    expired: "Έληξε",
    upcoming: "Μελλοντική",
    submissions: "Υποβολές",
    noSubmissions: "Δεν υπάρχουν υποβολές ακόμα",
    viewSubmissions: "Δες υποβολές",
    assigned: "Ανατέθηκε!",
    dueDate: "Προθεσμία",
    code: "Κωδικός",
    back: "Πίσω",
  },
  en: {
    title: "Homework",
    create: "New Homework",
    noHomework: "No homework yet.",
    hwTitle: "Homework title",
    description: "Description / Instructions",
    deadline: "Deadline",
    assignTo: "Assign to classroom",
    selectClassroom: "Select classroom",
    selectQuiz: "Link quiz (optional)",
    selectLesson: "Link lesson (optional)",
    noQuiz: "No quiz",
    noLesson: "No lesson",
    save: "Save",
    delete: "Delete",
    cancel: "Cancel",
    status: "Status",
    active: "Active",
    expired: "Expired",
    upcoming: "Upcoming",
    submissions: "Submissions",
    noSubmissions: "No submissions yet",
    viewSubmissions: "View submissions",
    assigned: "Assigned!",
    dueDate: "Due date",
    code: "Code",
    back: "Back",
  },
};

const HW_KEY = "geo:teacherHomework";

function getLocalHomework() {
  try { return JSON.parse(localStorage.getItem(HW_KEY)) || []; } catch { return []; }
}
function saveLocalHomework(hw) {
  localStorage.setItem(HW_KEY, JSON.stringify(hw));
}

export default function TeacherHomework({ quizzes = [], classrooms = [], lang }) {
  const { user } = useContext(AuthContext);
  const l = T[lang] || T.en;
  const isEl = lang === "el";

  const [homeworkList, setHomeworkList] = useState(() => getLocalHomework());
  const [editing, setEditing] = useState(null);
  const [viewSubmissions, setViewSubmissions] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [assignSuccess, setAssignSuccess] = useState(false);

  const emptyHw = {
    id: null,
    title: "",
    description: "",
    deadline: "",
    classroomCode: "",
    linkedQuizCode: "",
    linkedLessonCode: "",
    code: "",
  };

  const getStatus = (hw) => {
    if (!hw.deadline) return "active";
    const now = new Date();
    const deadline = new Date(hw.deadline);
    if (deadline < now) return "expired";
    return "active";
  };

  const handleSave = async () => {
    if (!editing || !editing.title.trim()) return;
    const isNew = !editing.id;
    const hw = {
      ...editing,
      id: editing.id || `hw_${Date.now()}`,
      code: editing.code || generateCode(),
      createdAt: editing.createdAt || new Date().toISOString(),
    };

    const list = isNew ? [...homeworkList, hw] : homeworkList.map(h => h.id === hw.id ? hw : h);
    setHomeworkList(list);
    saveLocalHomework(list);

    if (hw.classroomCode && user) {
      try {
        await setDoc(doc(db, "classroomHomework", hw.code), {
          ...hw,
          teacherUid: user.uid,
          teacherName: user.displayName || "Teacher",
        });
        setAssignSuccess(true);
        setTimeout(() => setAssignSuccess(false), 2000);
      } catch (e) { console.error("Failed to sync homework:", e); }
    }

    setEditing(null);
  };

  const handleDelete = async (hw) => {
    const list = homeworkList.filter(h => h.id !== hw.id);
    setHomeworkList(list);
    saveLocalHomework(list);
    if (hw.code) {
      try { await deleteDoc(doc(db, "classroomHomework", hw.code)); } catch {}
    }
  };

  const loadSubmissions = async (hwCode) => {
    try {
      const q = query(collection(db, "homeworkSubmissions"), where("homeworkCode", "==", hwCode));
      const snap = await getDocs(q);
      setSubmissions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch { setSubmissions([]); }
    setViewSubmissions(hwCode);
  };

  if (viewSubmissions) {
    const hw = homeworkList.find(h => h.code === viewSubmissions);
    return (
      <div className="space-y-4">
        <button onClick={() => setViewSubmissions(null)} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">← {l.back}</button>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">{l.submissions} — {hw?.title}</h3>
        {submissions.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-8 text-center text-slate-400 border">{l.noSubmissions}</div>
        ) : (
          <div className="space-y-3">
            {submissions.map(sub => (
              <div key={sub.id} className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-100 dark:border-slate-700 flex items-center gap-4">
                <span className="text-xl">👤</span>
                <div className="flex-1">
                  <div className="font-semibold text-slate-700 dark:text-slate-200">{sub.studentName}</div>
                  <div className="text-xs text-slate-400">{new Date(sub.submittedAt).toLocaleString(isEl ? "el-GR" : "en-US")}</div>
                </div>
                {sub.score !== undefined && (
                  <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-bold">{sub.score}/{sub.total}</span>
                )}
                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium">{sub.status || (isEl ? "Υποβλήθηκε" : "Submitted")}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (editing) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">{editing.id ? (isEl ? "Επεξεργασία" : "Edit") : l.create}</h3>

        <input value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} placeholder={l.hwTitle} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:border-amber-400" />

        <textarea value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} placeholder={l.description} rows={3} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:border-amber-400 resize-none" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">{l.deadline}</label>
            <input type="datetime-local" value={editing.deadline} onChange={e => setEditing({ ...editing, deadline: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:border-amber-400" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">{l.assignTo}</label>
            <select value={editing.classroomCode} onChange={e => setEditing({ ...editing, classroomCode: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:border-amber-400">
              <option value="">{l.selectClassroom}</option>
              {classrooms.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">{l.selectQuiz}</label>
            <select value={editing.linkedQuizCode} onChange={e => setEditing({ ...editing, linkedQuizCode: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:border-amber-400">
              <option value="">{l.noQuiz}</option>
              {quizzes.map(q => <option key={q.code || q.id} value={q.code || q.id}>{q.title}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">{l.selectLesson}</label>
            <select value={editing.linkedLessonCode} onChange={e => setEditing({ ...editing, linkedLessonCode: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:border-amber-400">
              <option value="">{l.noLesson}</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={handleSave} className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold shadow-md hover:shadow-lg transition-all">{l.save}</button>
          <button onClick={() => setEditing(null)} className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold">{l.cancel}</button>
        </div>

        {assignSuccess && <div className="text-emerald-600 font-bold text-sm animate-pulse">✅ {l.assigned}</div>}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">📋 {l.title}</h3>
        <button onClick={() => setEditing({ ...emptyHw })} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all">
          + {l.create}
        </button>
      </div>

      {homeworkList.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-10 border text-center text-slate-400">{l.noHomework}</div>
      ) : (
        <div className="space-y-3">
          {homeworkList.map(hw => {
            const status = getStatus(hw);
            return (
              <div key={hw.id} className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-100 dark:border-slate-700 shadow-sm">
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5">📋</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-slate-800 dark:text-white">{hw.title}</h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        status === "active" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                      }`}>{status === "active" ? l.active : l.expired}</span>
                    </div>
                    {hw.description && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{hw.description}</p>}
                    <div className="flex gap-4 mt-2 text-xs text-slate-400">
                      {hw.deadline && <span>📅 {new Date(hw.deadline).toLocaleDateString(isEl ? "el-GR" : "en-US", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>}
                      {hw.classroomCode && <span>🏫 {classrooms.find(c => c.code === hw.classroomCode)?.name || hw.classroomCode}</span>}
                      {hw.code && <span className="font-mono">{l.code}: {hw.code}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => loadSubmissions(hw.code)} className="text-xs px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">{l.viewSubmissions}</button>
                    <button onClick={() => setEditing({ ...hw })} className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">{isEl ? "✏️" : "✏️"}</button>
                    <button onClick={() => handleDelete(hw)} className="text-xs px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 font-semibold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">{l.delete}</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
