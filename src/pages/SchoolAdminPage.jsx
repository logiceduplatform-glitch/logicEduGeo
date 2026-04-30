import React, { useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import { AuthContext } from "../auth/AuthContext";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import QRCode from "../components/QRCode";
import { SchoolService } from "../services/SchoolService";

const T = {
  el: {
    title: "🏫 School Admin",
    subtitle: "Διαχείριση σχολείου, τάξεων και QR-κάρτες σύνδεσης για μαθητές.",
    needAuth: "Συνδεθείτε για να δημιουργήσετε σχολείο.",
    create: "+ Δημιουργία Σχολείου",
    schoolName: "Όνομα σχολείου",
    schoolNamePh: "π.χ. 1ο Δημοτικό Αθηνών",
    save: "Αποθήκευση",
    cancel: "Άκυρο",
    plan: "Πλάνο",
    classes: "Τάξεις",
    students: "Μαθητές",
    addClass: "+ Νέα Τάξη",
    className: "Όνομα τάξης",
    classNamePh: "π.χ. Α' Δημοτικού",
    grade: "Επίπεδο",
    addStudent: "+ Νέος Μαθητής",
    studentName: "Όνομα μαθητή",
    studentNamePh: "π.χ. Μαρία Π.",
    bulkAdd: "Προσθήκη πολλών (ένα όνομα ανά γραμμή)",
    bulkBtn: "Πρόσθεσέ τους",
    bulkPh: "Μαρία\nΓιάννης\nΑννα\n...",
    pin: "PIN",
    qrCard: "QR Κάρτα",
    print: "🖨️ Εκτύπωση καρτών",
    delete: "Διαγραφή",
    confirmDeleteClass: "Σίγουρα να διαγραφεί η τάξη και όλοι οι μαθητές;",
    confirmDeleteStudent: "Σίγουρα να διαγραφεί ο μαθητής;",
    classCode: "Κωδικός τάξης",
    pinShort: "PIN",
    qrLink: "Σύνδεση: ",
    instructionsTitle: "Οδηγίες σύνδεσης μαθητή",
    instructions1: "1. Σαρώστε το QR με τη συσκευή σας ή",
    instructions2: "2. Πηγαίνετε στο /k και βάλτε τον κωδικό + PIN.",
    backToList: "← Όλα τα σχολεία",
    expand: "Άνοιξε",
    collapse: "Κλείσε",
    noStudents: "Δεν υπάρχουν μαθητές. Πρόσθεσε τον πρώτο!",
    noClasses: "Δημιούργησε την πρώτη σου τάξη.",
    noSchools: "Δεν έχεις δημιουργήσει σχολείο ακόμα.",
    selectSchool: "Επίλεξε σχολείο",
  },
  en: {
    title: "🏫 School Admin",
    subtitle: "Manage school, classes, and QR login cards for students.",
    needAuth: "Sign in to create a school.",
    create: "+ Create School",
    schoolName: "School name",
    schoolNamePh: "e.g. Lincoln Elementary",
    save: "Save",
    cancel: "Cancel",
    plan: "Plan",
    classes: "Classes",
    students: "Students",
    addClass: "+ New Class",
    className: "Class name",
    classNamePh: "e.g. Grade 1A",
    grade: "Grade",
    addStudent: "+ New Student",
    studentName: "Student name",
    studentNamePh: "e.g. Maria P.",
    bulkAdd: "Bulk add (one name per line)",
    bulkBtn: "Add all",
    bulkPh: "Maria\nJohn\nAnna\n...",
    pin: "PIN",
    qrCard: "QR Card",
    print: "🖨️ Print cards",
    delete: "Delete",
    confirmDeleteClass: "Delete this class and all its students?",
    confirmDeleteStudent: "Delete this student?",
    classCode: "Class code",
    pinShort: "PIN",
    qrLink: "Login: ",
    instructionsTitle: "How students log in",
    instructions1: "1. Scan QR with device camera or",
    instructions2: "2. Go to /k and enter class code + PIN.",
    backToList: "← All schools",
    expand: "Open",
    collapse: "Close",
    noStudents: "No students yet. Add the first one!",
    noClasses: "Create your first class.",
    noSchools: "No schools created yet.",
    selectSchool: "Pick a school",
  },
};

export default function SchoolAdminPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const { user } = useContext(AuthContext) || {};
  const l = T[lang] || T.en;
  const navigate = useNavigate();

  const [schools, setSchools] = useState([]);
  const [activeSchool, setActiveSchool] = useState(null);
  const [classes, setClasses] = useState([]);
  const [busy, setBusy] = useState(false);

  // create school form
  const [showCreateSchool, setShowCreateSchool] = useState(false);
  const [schoolNameInput, setSchoolNameInput] = useState("");

  // create class form (per active school)
  const [classNameInput, setClassNameInput] = useState("");
  const [classGradeInput, setClassGradeInput] = useState("");

  const loadSchools = useCallback(async () => {
    if (!user?.uid) return;
    setBusy(true);
    try {
      const s = await SchoolService.getSchoolsByOwner(user.uid);
      setSchools(s);
      if (s.length > 0 && !activeSchool) setActiveSchool(s[0]);
    } catch (e) { /* ignore */ }
    setBusy(false);
  }, [user?.uid, activeSchool]);

  const loadClasses = useCallback(async () => {
    if (!activeSchool) return setClasses([]);
    setBusy(true);
    try {
      const cls = await SchoolService.getClasses(activeSchool.id);
      setClasses(cls);
    } catch (e) { /* ignore */ }
    setBusy(false);
  }, [activeSchool]);

  useEffect(() => { loadSchools(); }, [loadSchools]);
  useEffect(() => { loadClasses(); }, [loadClasses]);

  const handleCreateSchool = async () => {
    if (!user?.uid || !schoolNameInput.trim()) return;
    setBusy(true);
    try {
      const created = await SchoolService.createSchool({ uid: user.uid, name: schoolNameInput });
      const fresh = await SchoolService.getSchool(created.id);
      setSchools((s) => [...s, fresh]);
      setActiveSchool(fresh);
      setSchoolNameInput("");
      setShowCreateSchool(false);
    } catch (e) { alert(e.message); }
    setBusy(false);
  };

  const handleCreateClass = async () => {
    if (!activeSchool || !classNameInput.trim() || !user?.uid) return;
    setBusy(true);
    try {
      await SchoolService.createClass({
        schoolId: activeSchool.id,
        teacherUid: user.uid,
        name: classNameInput,
        grade: classGradeInput,
      });
      setClassNameInput(""); setClassGradeInput("");
      await loadClasses();
    } catch (e) { alert(e.message); }
    setBusy(false);
  };

  const handleDeleteClass = async (cls) => {
    if (!window.confirm(l.confirmDeleteClass)) return;
    await SchoolService.deleteClass(cls.id, activeSchool.id);
    await loadClasses();
  };

  if (!user?.uid) {
    return (
      <div className="min-h-screen bg-amber-50 dark:bg-slate-900">
        <Navbar />
        <div className="pt-20 pb-12 px-4 text-center">
          <p className="text-slate-500 mt-20">{l.needAuth}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <Navbar />
      <SEO title={l.title} />

      <div className="pt-20 pb-12 px-4">
        <div className="mx-auto max-w-5xl space-y-5">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white">{l.title}</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">{l.subtitle}</p>
          </div>

          {/* Schools picker */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 flex flex-wrap gap-2 items-center">
            {schools.length === 0 ? (
              <p className="text-sm text-slate-500">{l.noSchools}</p>
            ) : (
              <>
                <span className="text-xs font-bold text-slate-500">{l.selectSchool}:</span>
                {schools.map((s) => (
                  <button key={s.id} onClick={() => setActiveSchool(s)} className={`px-3 py-1.5 rounded-lg text-sm font-bold ${activeSchool?.id === s.id ? "bg-amber-500 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200"}`}>
                    {s.name}
                  </button>
                ))}
              </>
            )}
            <button onClick={() => setShowCreateSchool(true)} className="ml-auto px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-bold">
              {l.create}
            </button>
          </div>

          {/* Create school modal */}
          {showCreateSchool && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowCreateSchool(false)}>
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md space-y-4" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-xl font-extrabold text-slate-800 dark:text-white">{l.create}</h3>
                <input value={schoolNameInput} onChange={(e) => setSchoolNameInput(e.target.value)} placeholder={l.schoolNamePh} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white outline-none" />
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setShowCreateSchool(false)} className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold">{l.cancel}</button>
                  <button onClick={handleCreateSchool} disabled={busy || !schoolNameInput.trim()} className="px-4 py-2 rounded-lg bg-emerald-500 text-white font-bold disabled:opacity-50">{l.save}</button>
                </div>
              </div>
            </div>
          )}

          {/* Active school */}
          {activeSchool && (
            <>
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">{activeSchool.name}</h2>
                    <p className="text-xs font-mono text-slate-400">#{activeSchool.code} · {activeSchool.classCount || 0} {l.classes} · {activeSchool.studentCount || 0} {l.students}</p>
                  </div>
                  <span className="px-2 py-1 rounded-md bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase">{l.plan}: {activeSchool.plan || "free"}</span>
                </div>
              </div>

              {/* New class form */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 space-y-2">
                <h3 className="font-bold text-slate-800 dark:text-white">{l.addClass}</h3>
                <div className="flex flex-wrap gap-2">
                  <input value={classNameInput} onChange={(e) => setClassNameInput(e.target.value)} placeholder={l.classNamePh} className="flex-1 min-w-[180px] px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white outline-none" />
                  <input value={classGradeInput} onChange={(e) => setClassGradeInput(e.target.value)} placeholder={l.grade} className="w-32 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white outline-none" />
                  <button onClick={handleCreateClass} disabled={busy || !classNameInput.trim()} className="px-4 py-2 rounded-lg bg-emerald-500 text-white font-bold disabled:opacity-50">{l.save}</button>
                </div>
              </div>

              {/* Classes list */}
              {classes.length === 0 ? (
                <p className="text-center text-slate-500">{l.noClasses}</p>
              ) : (
                <div className="space-y-3">
                  {classes.map((cls) => <ClassCard key={cls.id} cls={cls} schoolId={activeSchool.id} l={l} onDelete={() => handleDeleteClass(cls)} />)}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Class Card ──────────────────────────────────────────────────────────
function ClassCard({ cls, schoolId, l, onDelete }) {
  const [open, setOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [bulk, setBulk] = useState("");
  const [busy, setBusy] = useState(false);

  const reload = useCallback(async () => {
    setBusy(true);
    try { setStudents(await SchoolService.getStudents(cls.id)); } catch {}
    setBusy(false);
  }, [cls.id]);

  useEffect(() => { if (open) reload(); }, [open, reload]);

  const handleAdd = async () => {
    if (!studentName.trim()) return;
    setBusy(true);
    try {
      await SchoolService.addStudent({ schoolId, classId: cls.id, name: studentName });
      setStudentName("");
      await reload();
    } catch (e) { alert(e.message); }
    setBusy(false);
  };

  const handleBulk = async () => {
    const names = bulk.split("\n").map((s) => s.trim()).filter(Boolean);
    if (!names.length) return;
    setBusy(true);
    try {
      await SchoolService.addStudentsBulk({ schoolId, classId: cls.id, names });
      setBulk("");
      await reload();
    } catch {}
    setBusy(false);
  };

  const handleDeleteStudent = async (st) => {
    if (!window.confirm(l.confirmDeleteStudent)) return;
    await SchoolService.deleteStudent(st.id, cls.id, schoolId);
    await reload();
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank", "width=1024,height=768");
    if (!printWindow) return;
    const cards = students.map((s) => {
      const url = SchoolService.buildKidLoginUrl(s.qrCode);
      return `
        <div class="card">
          <div class="head">${s.avatar || "🦊"} ${s.name}</div>
          <div class="cls">${cls.name}${cls.grade ? " · " + cls.grade : ""}</div>
          <div class="qr"><img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}" /></div>
          <div class="pin">PIN: <strong>${s.pin}</strong></div>
          <div class="code">Class: <span>${cls.id.slice(-6).toUpperCase()}</span></div>
          <div class="footer">geo · scan to login</div>
        </div>
      `;
    }).join("");
    printWindow.document.write(`
      <html><head><title>QR Login Cards</title>
      <style>
        @page { size: A4; margin: 1cm; }
        body { font-family: system-ui, sans-serif; }
        .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.2cm; }
        .card { border: 2px dashed #94a3b8; border-radius: 12px; padding: 1cm; text-align: center; page-break-inside: avoid; }
        .head { font-size: 22px; font-weight: 800; color: #0f172a; }
        .cls { color: #64748b; font-size: 13px; margin-bottom: 12px; }
        .qr img { width: 200px; height: 200px; }
        .pin { font-size: 18px; margin-top: 12px; font-family: ui-monospace, monospace; }
        .pin strong { font-size: 28px; color: #0f172a; letter-spacing: 6px; }
        .code { font-family: ui-monospace, monospace; color: #475569; font-size: 12px; margin-top: 4px; }
        .footer { color: #94a3b8; font-size: 10px; margin-top: 8px; text-transform: uppercase; }
      </style></head><body><div class="grid">${cards}</div></body></html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 300);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
      <div className="p-4 flex items-center gap-3 flex-wrap">
        <div className="flex-1 min-w-0">
          <p className="font-bold text-slate-800 dark:text-white">{cls.name}</p>
          <p className="text-xs text-slate-400">{cls.grade ? cls.grade + " · " : ""}{cls.studentCount || 0} {l.students} · {l.classCode}: <code className="font-mono">{cls.id.slice(-6).toUpperCase()}</code></p>
        </div>
        <button onClick={() => setOpen((v) => !v)} className="px-3 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm font-bold">
          {open ? l.collapse : l.expand}
        </button>
        <button onClick={onDelete} className="px-3 py-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-sm font-bold">
          {l.delete}
        </button>
      </div>

      {open && (
        <div className="p-4 border-t border-slate-100 dark:border-slate-700 space-y-4">
          {/* Add student */}
          <div className="flex gap-2">
            <input value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder={l.studentNamePh} className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white outline-none" />
            <button onClick={handleAdd} disabled={busy || !studentName.trim()} className="px-4 py-2 rounded-lg bg-emerald-500 text-white font-bold disabled:opacity-50">{l.addStudent}</button>
          </div>

          {/* Bulk */}
          <details className="bg-slate-50 dark:bg-slate-700/40 rounded-lg p-3">
            <summary className="cursor-pointer text-sm font-bold text-slate-700 dark:text-slate-200">{l.bulkAdd}</summary>
            <div className="mt-2 flex flex-col gap-2">
              <textarea value={bulk} onChange={(e) => setBulk(e.target.value)} rows={4} placeholder={l.bulkPh} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white outline-none text-sm font-mono resize-none" />
              <button onClick={handleBulk} disabled={busy || !bulk.trim()} className="self-start px-4 py-2 rounded-lg bg-violet-500 text-white font-bold text-sm disabled:opacity-50">{l.bulkBtn}</button>
            </div>
          </details>

          {/* Students grid */}
          {students.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4">{l.noStudents}</p>
          ) : (
            <>
              <div className="flex justify-end">
                <button onClick={handlePrint} className="px-3 py-1.5 rounded-lg bg-blue-500 text-white text-sm font-bold">{l.print}</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {students.map((s) => <StudentCard key={s.id} s={s} cls={cls} l={l} onDelete={() => handleDeleteStudent(s)} />)}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ── Student Card ──────────────────────────────────────────────────────────
function StudentCard({ s, cls, l, onDelete }) {
  const url = SchoolService.buildKidLoginUrl(s.qrCode);
  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-700/40 dark:to-slate-700/40 rounded-xl p-3 border border-amber-200 dark:border-slate-600">
      <div className="flex items-center justify-between gap-1 mb-2">
        <span className="text-3xl">{s.avatar}</span>
        <button onClick={onDelete} className="text-xs text-rose-500 hover:underline">×</button>
      </div>
      <p className="font-bold text-slate-800 dark:text-slate-100 text-sm truncate">{s.name}</p>
      <div className="bg-white p-2 rounded-md mt-2 flex justify-center">
        <QRCode value={url} size={100} />
      </div>
      <div className="flex items-center justify-between mt-2 text-xs">
        <span className="font-mono text-slate-500">{l.pinShort}: <strong className="text-slate-800 dark:text-slate-100">{s.pin}</strong></span>
        <span className="font-mono text-slate-400 text-[10px]">{cls.id.slice(-6).toUpperCase()}</span>
      </div>
    </div>
  );
}
