import React, { useContext, useEffect, useMemo, useState } from "react";
import { LanguageContext } from "../../i18n/LanguageContext";
import { AuthContext } from "../../auth/AuthContext";
import { db } from "../../auth/firebase";
import {
  collection, doc, addDoc, getDocs, query, where, orderBy, onSnapshot, updateDoc, serverTimestamp,
} from "firebase/firestore";

const T = {
  el: {
    title: "Μηνύματα Δασκάλου",
    subtitle: "Άμεση επικοινωνία με τους δασκάλους του παιδιού",
    noClassrooms: "Το παιδί δεν έχει εγγραφεί σε καμία τάξη ακόμα.",
    selectTeacher: "Επίλεξε δάσκαλο",
    teacher: "Δάσκαλος",
    classroom: "Τάξη",
    typeMessage: "Πληκτρολόγησε μήνυμα...",
    send: "Αποστολή",
    you: "Εσύ",
    noMessages: "Δεν υπάρχουν μηνύματα ακόμα. Ξεκίνα μια συζήτηση!",
    needAuth: "Πρέπει να είσαι συνδεδεμένος",
    sending: "...",
    failed: "Αποτυχία αποστολής",
    childUsed: "Σχετικά με",
    refresh: "Ανανέωση",
  },
  en: {
    title: "Teacher Messages",
    subtitle: "Direct communication with your child's teachers",
    noClassrooms: "Child hasn't joined any classroom yet.",
    selectTeacher: "Pick teacher",
    teacher: "Teacher",
    classroom: "Classroom",
    typeMessage: "Type a message...",
    send: "Send",
    you: "You",
    noMessages: "No messages yet. Start a conversation!",
    needAuth: "You need to be signed in",
    sending: "...",
    failed: "Send failed",
    childUsed: "About",
    refresh: "Refresh",
  },
};

function makeThreadId(parentUid, teacherUid, childId) {
  return `${parentUid}_${teacherUid}_${childId}`.slice(0, 100);
}

export default function ParentTeacherMessages({ children = [] }) {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const { user } = useContext(AuthContext);
  const l = T[lang] || T.en;

  const [teacherContacts, setTeacherContacts] = useState([]); // {teacherUid, teacherName, classroomName, classroomCode, childId, childName}
  const [selectedKey, setSelectedKey] = useState("");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  const selected = teacherContacts.find(c => c.key === selectedKey);

  // Load teacher contacts based on classroomMembers + classroomQuizzes
  useEffect(() => {
    if (!db || !user) { setLoading(false); return; }
    const load = async () => {
      try {
        const memQ = query(collection(db, "classroomMembers"), where("studentUid", "==", user.uid));
        const memSnap = await getDocs(memQ);
        const codes = [];
        const memberRecords = [];
        memSnap.forEach(d => {
          const data = { id: d.id, ...d.data() };
          if (data.classroomCode) {
            codes.push(data.classroomCode);
            memberRecords.push(data);
          }
        });

        if (codes.length === 0) { setLoading(false); return; }

        const uniqueCodes = [...new Set(codes)].slice(0, 30);
        const clsQ = query(collection(db, "classrooms"), where("code", "in", uniqueCodes));
        const clsSnap = await getDocs(clsQ);
        const clsByCode = {};
        clsSnap.forEach(d => { const data = d.data(); if (data.code) clsByCode[data.code] = data; });

        const contacts = memberRecords
          .filter(m => clsByCode[m.classroomCode])
          .map(m => {
            const cls = clsByCode[m.classroomCode];
            return {
              key: `${cls.teacherUid}_${m.classroomCode}_${m.childId || "self"}`,
              teacherUid: cls.teacherUid,
              teacherName: cls.teacherName || cls.teacherEmail || "Teacher",
              classroomName: cls.name,
              classroomCode: m.classroomCode,
              childId: m.childId || null,
              childName: m.studentName || (children.find(c => c.id === m.childId)?.name) || "",
            };
          });

        // Dedup by key
        const seen = {};
        const dedup = contacts.filter(c => seen[c.key] ? false : (seen[c.key] = true));
        setTeacherContacts(dedup);
        if (dedup.length > 0 && !selectedKey) setSelectedKey(dedup[0].key);
      } catch (e) {
        console.warn("[PTM] load failed", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]); // eslint-disable-line

  // Subscribe to messages
  useEffect(() => {
    if (!db || !user || !selected) { setMessages([]); return; }
    const threadId = makeThreadId(user.uid, selected.teacherUid, selected.childId || "self");
    const q = query(
      collection(db, "parentTeacherMessages"),
      where("threadId", "==", threadId),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(q, snap => {
      const list = [];
      snap.forEach(d => list.push({ id: d.id, ...d.data() }));
      setMessages(list);
      // Mark teacher messages as read
      list.forEach(m => {
        if (m.from === "teacher" && !m.readByParent) {
          updateDoc(doc(db, "parentTeacherMessages", m.id), { readByParent: true }).catch(() => {});
        }
      });
    }, e => console.warn("[PTM] subscribe failed", e));
    return () => unsub();
  }, [user, selectedKey]); // eslint-disable-line

  const sendMessage = async () => {
    if (!text.trim() || !selected || !user) return;
    setSending(true);
    const threadId = makeThreadId(user.uid, selected.teacherUid, selected.childId || "self");
    try {
      await addDoc(collection(db, "parentTeacherMessages"), {
        threadId,
        parentUid: user.uid,
        parentName: user.displayName || user.email || "",
        parentEmail: (user.email || "").toLowerCase(),
        teacherUid: selected.teacherUid,
        teacherName: selected.teacherName,
        classroomCode: selected.classroomCode,
        childId: selected.childId,
        childName: selected.childName,
        from: "parent",
        text: text.trim(),
        createdAt: new Date().toISOString(),
        serverTime: serverTimestamp(),
        readByParent: true,
        readByTeacher: false,
      });
      setText("");
    } catch (e) {
      console.error("[PTM] send failed", e);
      alert(l.failed);
    }
    setSending(false);
  };

  if (!user) {
    return (
      <div className="text-center py-10 bg-slate-50 dark:bg-slate-800 rounded-2xl">
        <span className="text-4xl">🔐</span>
        <p className="mt-3 text-slate-500 dark:text-slate-400 text-sm">{l.needAuth}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-10 bg-slate-50 dark:bg-slate-800 rounded-2xl">
        <span className="text-3xl animate-pulse">💬</span>
      </div>
    );
  }

  if (teacherContacts.length === 0) {
    return (
      <div className="text-center py-10 bg-slate-50 dark:bg-slate-800 rounded-2xl">
        <span className="text-4xl">📚</span>
        <p className="mt-3 text-slate-500 dark:text-slate-400 text-sm">{l.noClassrooms}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-blue-900/20 dark:via-cyan-900/20 dark:to-teal-900/20 rounded-2xl p-5 border border-blue-200 dark:border-blue-800">
        <span className="inline-block text-3xl mb-1">💬</span>
        <h3 className="text-lg font-extrabold text-slate-800 dark:text-white">{l.title}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{l.subtitle}</p>
      </div>

      {/* Teacher selector */}
      <div className="flex flex-wrap gap-2">
        {teacherContacts.map(c => (
          <button
            key={c.key}
            onClick={() => setSelectedKey(c.key)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition text-left ${selectedKey === c.key ? "bg-blue-500 text-white shadow-md" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"}`}
          >
            👨‍🏫 {c.teacherName}
            <span className="block text-[10px] opacity-80">{c.classroomName} · {c.childName}</span>
          </button>
        ))}
      </div>

      {selected && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col h-[500px]">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
            <div className="font-bold text-sm text-slate-800 dark:text-white">{selected.teacherName}</div>
            <div className="text-xs text-slate-500">{l.classroom}: {selected.classroomName} • {l.childUsed}: {selected.childName}</div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 dark:bg-slate-900/30">
            {messages.length === 0 ? (
              <p className="text-center text-slate-400 dark:text-slate-500 text-sm py-10">{l.noMessages}</p>
            ) : (
              messages.map(m => (
                <div key={m.id} className={`flex ${m.from === "parent" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] px-3 py-2 rounded-2xl ${m.from === "parent" ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-br-sm" : "bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-600 rounded-bl-sm"}`}>
                    <div className="text-[10px] opacity-70 mb-0.5">
                      {m.from === "parent" ? l.you : selected.teacherName}
                    </div>
                    <div className="text-sm whitespace-pre-wrap break-words">{m.text}</div>
                    <div className="text-[9px] opacity-60 mt-1 text-right">
                      {m.createdAt ? new Date(m.createdAt).toLocaleString(lang === "el" ? "el-GR" : "en-US", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" }) : ""}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 border-t border-slate-100 dark:border-slate-700 flex gap-2">
            <input
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder={l.typeMessage}
              className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:border-blue-400 text-sm"
            />
            <button
              onClick={sendMessage}
              disabled={sending || !text.trim()}
              className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold text-sm disabled:opacity-50"
            >
              {sending ? l.sending : l.send}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
