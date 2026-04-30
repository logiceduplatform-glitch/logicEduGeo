import React, { useState, useContext, useMemo, useRef } from "react";
import { LanguageContext } from "../i18n/LanguageContext";

const T = {
  el: {
    title: "Αναφορές Τάξης",
    subtitle: "Δημιουργία PDF αναφορών για γονείς ή διοίκηση",
    selectClass: "Επίλεξε τάξη",
    chooseClass: "-- Διάλεξε --",
    students: "Μαθητές",
    overview: "Επισκόπηση",
    avgScore: "Μέσος όρος",
    totalQuizzes: "Σύνολο Quiz",
    completed: "Ολοκληρωμένα",
    studentReports: "Ατομικές αναφορές μαθητών",
    studentName: "Μαθητής",
    quizzes: "Quiz",
    avg: "Μ.Ο.",
    bestScore: "Καλύτερο",
    lastActive: "Τελευταία",
    noData: "Δεν υπάρχουν αρκετά δεδομένα ακόμα.",
    exportAll: "📄 Εξαγωγή Πλήρους Αναφοράς (PDF)",
    exportStudent: "📋 PDF",
    generating: "Δημιουργία...",
    reportTitle: "Αναφορά Τάξης",
    reportFor: "Αναφορά για",
    teacher: "Δάσκαλος/α",
    date: "Ημερομηνία",
    summary: "Σύνοψη",
    detailedResults: "Αναλυτικά Αποτελέσματα",
    quiz: "Quiz",
    score: "Σκορ",
    completedAt: "Ολοκλήρωση",
    excellent: "Άριστα",
    good: "Καλά",
    needsWork: "Χρειάζεται βελτίωση",
    progress: "Πρόοδος",
    distribution: "Κατανομή Επιδόσεων",
    classAverage: "Μέσος Όρος Τάξης",
  },
  en: {
    title: "Class Reports",
    subtitle: "Generate PDF reports for parents or administration",
    selectClass: "Select classroom",
    chooseClass: "-- Choose --",
    students: "Students",
    overview: "Overview",
    avgScore: "Average score",
    totalQuizzes: "Total Quizzes",
    completed: "Completed",
    studentReports: "Individual Student Reports",
    studentName: "Student",
    quizzes: "Quizzes",
    avg: "Avg",
    bestScore: "Best",
    lastActive: "Last active",
    noData: "Not enough data yet.",
    exportAll: "📄 Export Full Report (PDF)",
    exportStudent: "📋 PDF",
    generating: "Generating...",
    reportTitle: "Class Report",
    reportFor: "Report for",
    teacher: "Teacher",
    date: "Date",
    summary: "Summary",
    detailedResults: "Detailed Results",
    quiz: "Quiz",
    score: "Score",
    completedAt: "Completed",
    excellent: "Excellent",
    good: "Good",
    needsWork: "Needs work",
    progress: "Progress",
    distribution: "Performance Distribution",
    classAverage: "Class Average",
  },
};

function pct(n, total) { return total > 0 ? Math.round((n / total) * 100) : 0; }

export default function ClassReports({ classrooms = [], classroomMembers = {}, results = [], teacherName = "" }) {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;

  const [selectedCode, setSelectedCode] = useState(classrooms[0]?.code || "");
  const [generating, setGenerating] = useState(false);
  const reportRef = useRef(null);

  const cls = useMemo(() => classrooms.find(c => c.code === selectedCode), [classrooms, selectedCode]);
  const members = classroomMembers[selectedCode] || [];

  const classResults = useMemo(() => {
    return results.filter(r => r.classroomCode === selectedCode);
  }, [results, selectedCode]);

  const stats = useMemo(() => {
    if (classResults.length === 0) return { avg: 0, count: 0, byStudent: [] };
    const total = classResults.reduce((s, r) => s + (r.score || 0), 0);
    const avg = Math.round(total / classResults.length);

    const studentMap = {};
    classResults.forEach(r => {
      const key = r.studentEmail || r.studentName || r.userId || "anon";
      if (!studentMap[key]) {
        studentMap[key] = {
          name: r.studentName || r.studentEmail || "—",
          email: r.studentEmail || "",
          quizzes: [],
        };
      }
      studentMap[key].quizzes.push(r);
    });

    const byStudent = Object.values(studentMap).map(s => {
      const scores = s.quizzes.map(q => q.score || 0);
      const studentAvg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      const best = Math.max(...scores);
      const lastDate = s.quizzes.map(q => q.completedAt).filter(Boolean).sort().reverse()[0];
      return { ...s, avg: studentAvg, best, count: s.quizzes.length, lastActive: lastDate };
    }).sort((a, b) => b.avg - a.avg);

    return { avg, count: classResults.length, byStudent };
  }, [classResults]);

  const distribution = useMemo(() => {
    const buckets = { excellent: 0, good: 0, needsWork: 0 };
    classResults.forEach(r => {
      if (r.score >= 80) buckets.excellent++;
      else if (r.score >= 60) buckets.good++;
      else buckets.needsWork++;
    });
    return buckets;
  }, [classResults]);

  const exportPDF = async (mode = "all", studentKey = null) => {
    setGenerating(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const target = reportRef.current;
      if (!target) { setGenerating(false); return; }

      const filename = mode === "student"
        ? `${cls?.name || "class"}_${studentKey}_report.pdf`
        : `${cls?.name || "class"}_full_report.pdf`;

      target.style.display = "block";
      await html2pdf().set({
        margin: 10,
        filename: filename.replace(/[^\w.-]/g, "_"),
        image: { type: "jpeg", quality: 0.95 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      }).from(target).save();
      target.style.display = "none";
    } catch (e) {
      console.error("PDF export failed:", e);
      alert("PDF export failed. Try again.");
    }
    setGenerating(false);
  };

  if (classrooms.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 dark:bg-slate-800 rounded-2xl">
        <span className="text-4xl">📊</span>
        <p className="mt-3 text-slate-500 dark:text-slate-400">{l.noData}</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="text-center bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-blue-900/20 dark:via-cyan-900/20 dark:to-teal-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
        <span className="inline-block text-4xl mb-2">📊📄</span>
        <h3 className="text-xl font-extrabold text-slate-800 dark:text-white">{l.title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{l.subtitle}</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 block">{l.selectClass}</label>
        <select value={selectedCode} onChange={e => setSelectedCode(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white outline-none">
          <option value="">{l.chooseClass}</option>
          {classrooms.map(c => (
            <option key={c.code} value={c.code}>{c.name} ({c.code})</option>
          ))}
        </select>
      </div>

      {selectedCode && (
        <>
          {/* Overview cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard label={l.students} value={members.length} icon="👥" color="from-blue-500 to-cyan-500" />
            <StatCard label={l.totalQuizzes} value={stats.count} icon="📝" color="from-purple-500 to-pink-500" />
            <StatCard label={l.avgScore} value={`${stats.avg}%`} icon="📊" color="from-emerald-500 to-teal-500" />
            <StatCard label={l.completed} value={stats.byStudent.length} icon="✅" color="from-amber-500 to-orange-500" />
          </div>

          {/* Distribution */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
            <h4 className="font-bold text-sm text-slate-700 dark:text-slate-200 mb-3">📈 {l.distribution}</h4>
            <DistroBar label={`${l.excellent} (≥80%)`} count={distribution.excellent} total={stats.count} color="bg-emerald-500" />
            <DistroBar label={`${l.good} (60-79%)`} count={distribution.good} total={stats.count} color="bg-amber-500" />
            <DistroBar label={`${l.needsWork} (<60%)`} count={distribution.needsWork} total={stats.count} color="bg-red-400" />
          </div>

          {/* Student table */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <h4 className="font-bold text-sm text-slate-700 dark:text-slate-200">👨‍🎓 {l.studentReports}</h4>
              <button
                onClick={() => exportPDF("all")}
                disabled={generating || stats.byStudent.length === 0}
                className="px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold shadow-sm hover:shadow-md transition disabled:opacity-50"
              >
                {generating ? l.generating : l.exportAll}
              </button>
            </div>
            {stats.byStudent.length === 0 ? (
              <p className="text-center text-slate-500 dark:text-slate-400 py-6 text-sm">{l.noData}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                      <th className="text-left py-2 px-2">{l.studentName}</th>
                      <th className="text-right py-2 px-2">{l.quizzes}</th>
                      <th className="text-right py-2 px-2">{l.avg}</th>
                      <th className="text-right py-2 px-2">{l.bestScore}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.byStudent.map((s, i) => (
                      <tr key={i} className="border-b border-slate-100 dark:border-slate-700/50">
                        <td className="py-2 px-2 text-slate-700 dark:text-slate-200">{s.name}</td>
                        <td className="py-2 px-2 text-right text-slate-600 dark:text-slate-300">{s.count}</td>
                        <td className={`py-2 px-2 text-right font-bold ${s.avg >= 80 ? "text-emerald-600" : s.avg >= 60 ? "text-amber-600" : "text-red-500"}`}>{s.avg}%</td>
                        <td className="py-2 px-2 text-right text-slate-600 dark:text-slate-300">{s.best}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Hidden printable report */}
          <div ref={reportRef} style={{ display: "none", padding: "20px", fontFamily: "Arial, sans-serif", color: "#1e293b", background: "white", maxWidth: "210mm" }}>
            <div style={{ borderBottom: "3px solid #3b82f6", paddingBottom: "12px", marginBottom: "20px" }}>
              <h1 style={{ margin: 0, fontSize: "24px", color: "#1e40af" }}>📊 {l.reportTitle}</h1>
              <p style={{ margin: "6px 0 0 0", fontSize: "14px", color: "#64748b" }}>
                {l.reportFor}: <strong>{cls?.name}</strong> ({cls?.code})
              </p>
              <p style={{ margin: "2px 0", fontSize: "12px", color: "#64748b" }}>
                {l.teacher}: {teacherName || cls?.teacherName || "—"} • {l.date}: {new Date().toLocaleDateString(lang === "el" ? "el-GR" : "en-US")}
              </p>
            </div>

            <h2 style={{ fontSize: "18px", color: "#1e40af", marginTop: "16px" }}>{l.summary}</h2>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <tbody>
                <tr><td style={tdStyle}>{l.students}:</td><td style={tdStyle}><strong>{members.length}</strong></td></tr>
                <tr><td style={tdStyle}>{l.totalQuizzes}:</td><td style={tdStyle}><strong>{stats.count}</strong></td></tr>
                <tr><td style={tdStyle}>{l.classAverage}:</td><td style={tdStyle}><strong>{stats.avg}%</strong></td></tr>
                <tr><td style={tdStyle}>{l.excellent}:</td><td style={tdStyle}>{distribution.excellent} ({pct(distribution.excellent, stats.count)}%)</td></tr>
                <tr><td style={tdStyle}>{l.good}:</td><td style={tdStyle}>{distribution.good} ({pct(distribution.good, stats.count)}%)</td></tr>
                <tr><td style={tdStyle}>{l.needsWork}:</td><td style={tdStyle}>{distribution.needsWork} ({pct(distribution.needsWork, stats.count)}%)</td></tr>
              </tbody>
            </table>

            <h2 style={{ fontSize: "18px", color: "#1e40af", marginTop: "20px" }}>{l.studentReports}</h2>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
              <thead>
                <tr style={{ background: "#f1f5f9" }}>
                  <th style={thStyle}>{l.studentName}</th>
                  <th style={thStyle}>{l.quizzes}</th>
                  <th style={thStyle}>{l.avg}</th>
                  <th style={thStyle}>{l.bestScore}</th>
                </tr>
              </thead>
              <tbody>
                {stats.byStudent.map((s, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <td style={tdStyle}>{s.name}</td>
                    <td style={{ ...tdStyle, textAlign: "center" }}>{s.count}</td>
                    <td style={{ ...tdStyle, textAlign: "center", fontWeight: "bold", color: s.avg >= 80 ? "#059669" : s.avg >= 60 ? "#d97706" : "#dc2626" }}>{s.avg}%</td>
                    <td style={{ ...tdStyle, textAlign: "center" }}>{s.best}%</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h2 style={{ fontSize: "18px", color: "#1e40af", marginTop: "20px" }}>{l.detailedResults}</h2>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
              <thead>
                <tr style={{ background: "#f1f5f9" }}>
                  <th style={thStyle}>{l.studentName}</th>
                  <th style={thStyle}>{l.quiz}</th>
                  <th style={thStyle}>{l.score}</th>
                  <th style={thStyle}>{l.completedAt}</th>
                </tr>
              </thead>
              <tbody>
                {classResults.slice(0, 60).map((r, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <td style={tdStyle}>{r.studentName || r.studentEmail || "—"}</td>
                    <td style={tdStyle}>{r.quizTitle || "—"}</td>
                    <td style={{ ...tdStyle, textAlign: "center", fontWeight: "bold" }}>{r.score || 0}%</td>
                    <td style={tdStyle}>{r.completedAt ? new Date(r.completedAt).toLocaleDateString() : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginTop: "30px", paddingTop: "10px", borderTop: "1px solid #e2e8f0", fontSize: "10px", color: "#94a3b8", textAlign: "center" }}>
              Kibloo • {new Date().toLocaleString(lang === "el" ? "el-GR" : "en-US")}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const thStyle = { padding: "8px", border: "1px solid #cbd5e1", textAlign: "left", fontWeight: "bold" };
const tdStyle = { padding: "6px 8px", border: "1px solid #e2e8f0" };

function StatCard({ label, value, icon, color }) {
  return (
    <div className={`bg-gradient-to-br ${color} rounded-xl p-3 text-white shadow-sm`}>
      <div className="text-2xl">{icon}</div>
      <div className="text-2xl font-extrabold mt-1">{value}</div>
      <div className="text-xs opacity-90">{label}</div>
    </div>
  );
}

function DistroBar({ label, count, total, color }) {
  const pctVal = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="mb-2.5">
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-slate-600 dark:text-slate-300">{label}</span>
        <span className="font-bold text-slate-700 dark:text-slate-200">{count} ({Math.round(pctVal)}%)</span>
      </div>
      <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all`} style={{ width: `${pctVal}%` }} />
      </div>
    </div>
  );
}
