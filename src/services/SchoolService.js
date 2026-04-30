// School Edition: Manage schools, classes, and student "kid logins" (PIN + QR code).
// Stored in Firestore. Designed for a small school (<500 students) using batched localStorage cache.
//
// Data model:
//  - schools/{schoolId}    { name, code, ownerUid, plan, classCount, studentCount, createdAt }
//  - schoolClasses/{classId} { schoolId, name, grade, teacherUid, studentIds[], createdAt }
//  - schoolStudents/{studentId} { schoolId, classId, name, pin, avatar, qrCode, addedAt }
// Auth: kid login is an ephemeral local session (stored in localStorage, no Firebase Auth).

import { db } from "../auth/firebase";
import {
  doc, addDoc, setDoc, updateDoc, getDoc, getDocs, deleteDoc,
  collection, query, where, orderBy, serverTimestamp, increment, limit,
} from "firebase/firestore";

const SCHOOLS = "schools";
const CLASSES = "schoolClasses";
const STUDENTS = "schoolStudents";
const KID_SESSION_KEY = "geo:kid-session";

function randomCode(len = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

function randomPin(len = 4) {
  let s = "";
  for (let i = 0; i < len; i++) s += String(Math.floor(Math.random() * 10));
  return s;
}

const KID_AVATARS = ["🦊", "🐯", "🐻", "🐼", "🐰", "🦁", "🐶", "🐱", "🐸", "🦉", "🐧", "🦄", "🐷", "🐮", "🐵", "🐨"];

function pickAvatar(seed) {
  if (!seed) return KID_AVATARS[0];
  let n = 0;
  for (const c of String(seed)) n = (n + c.charCodeAt(0)) % KID_AVATARS.length;
  return KID_AVATARS[n];
}

export const SchoolService = {
  randomCode,
  randomPin,
  pickAvatar,

  /** Create a new school. */
  async createSchool({ uid, name }) {
    if (!uid) throw new Error("auth-required");
    if (!name?.trim()) throw new Error("name-required");
    const code = randomCode(6);
    const ref = await addDoc(collection(db, SCHOOLS), {
      name: name.trim().slice(0, 80),
      code,
      ownerUid: uid,
      plan: "free", // free | premium | district
      classCount: 0,
      studentCount: 0,
      createdAt: serverTimestamp(),
    });
    return { id: ref.id, code };
  },

  async getSchool(id) {
    if (!id) return null;
    const s = await getDoc(doc(db, SCHOOLS, id));
    return s.exists() ? { id: s.id, ...s.data() } : null;
  },

  async getSchoolsByOwner(uid) {
    const q = query(collection(db, SCHOOLS), where("ownerUid", "==", uid));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  // ── Classes ────────────────────────────────────────────────────────────

  async createClass({ schoolId, teacherUid, name, grade = "" }) {
    if (!schoolId || !teacherUid) throw new Error("missing-args");
    const ref = await addDoc(collection(db, CLASSES), {
      schoolId, teacherUid,
      name: name.trim().slice(0, 60),
      grade,
      studentCount: 0,
      createdAt: serverTimestamp(),
    });
    await updateDoc(doc(db, SCHOOLS, schoolId), { classCount: increment(1) });
    return ref.id;
  },

  async getClasses(schoolId) {
    const q = query(collection(db, CLASSES), where("schoolId", "==", schoolId), orderBy("createdAt", "asc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  async getClass(classId) {
    const s = await getDoc(doc(db, CLASSES, classId));
    return s.exists() ? { id: s.id, ...s.data() } : null;
  },

  async deleteClass(classId, schoolId) {
    // Delete all students of this class first
    const students = await this.getStudents(classId);
    await Promise.all(students.map((st) => deleteDoc(doc(db, STUDENTS, st.id))));
    await deleteDoc(doc(db, CLASSES, classId));
    if (schoolId) {
      await updateDoc(doc(db, SCHOOLS, schoolId), {
        classCount: increment(-1),
        studentCount: increment(-students.length),
      });
    }
  },

  // ── Students ───────────────────────────────────────────────────────────

  async addStudent({ schoolId, classId, name, avatar }) {
    if (!classId || !name?.trim()) throw new Error("missing-args");
    const pin = randomPin(4);
    const qrCode = randomCode(8);
    const ref = await addDoc(collection(db, STUDENTS), {
      schoolId, classId,
      name: name.trim().slice(0, 50),
      pin,
      qrCode,
      avatar: avatar || pickAvatar(name),
      addedAt: serverTimestamp(),
    });
    if (schoolId) await updateDoc(doc(db, SCHOOLS, schoolId), { studentCount: increment(1) });
    await updateDoc(doc(db, CLASSES, classId), { studentCount: increment(1) });
    return { id: ref.id, pin, qrCode };
  },

  async addStudentsBulk({ schoolId, classId, names = [] }) {
    const list = names.map((n) => n.trim()).filter(Boolean);
    const out = [];
    for (const n of list) {
      try {
        const s = await this.addStudent({ schoolId, classId, name: n });
        out.push({ name: n, ...s });
      } catch (e) { out.push({ name: n, error: e.message }); }
    }
    return out;
  },

  async getStudents(classId) {
    const q = query(collection(db, STUDENTS), where("classId", "==", classId), orderBy("name"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  async deleteStudent(studentId, classId, schoolId) {
    await deleteDoc(doc(db, STUDENTS, studentId));
    if (classId) await updateDoc(doc(db, CLASSES, classId), { studentCount: increment(-1) });
    if (schoolId) await updateDoc(doc(db, SCHOOLS, schoolId), { studentCount: increment(-1) });
  },

  /** Find student by QR code. */
  async findByQR(qrCode) {
    const q = query(collection(db, STUDENTS), where("qrCode", "==", qrCode), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0];
    return { id: d.id, ...d.data() };
  },

  /** Find student by class code + PIN. */
  async findByClassAndPin(classId, pin) {
    const q = query(collection(db, STUDENTS), where("classId", "==", classId), where("pin", "==", pin), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0];
    return { id: d.id, ...d.data() };
  },

  // ── Kid session ────────────────────────────────────────────────────────

  setKidSession(student, classData) {
    try {
      const session = {
        studentId: student.id,
        name: student.name,
        avatar: student.avatar,
        classId: student.classId,
        className: classData?.name || "",
        schoolId: student.schoolId,
        loginAt: Date.now(),
      };
      localStorage.setItem(KID_SESSION_KEY, JSON.stringify(session));
      return session;
    } catch { return null; }
  },

  getKidSession() {
    try {
      const s = localStorage.getItem(KID_SESSION_KEY);
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  },

  clearKidSession() {
    try { localStorage.removeItem(KID_SESSION_KEY); } catch {}
  },

  /** Build a kid-login URL for QR generation. */
  buildKidLoginUrl(qrCode) {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}/k/${qrCode}`;
  },
};
