import React, { useContext, useEffect, useRef, useState } from "react";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";

export default function VoiceRecorderPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const isEl = lang === "el";
  const [recording, setRecording] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const [error, setError] = useState("");
  const [time, setTime] = useState(0);
  const mediaRef = useRef(null);
  const chunks = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => () => { try { mediaRef.current?.stream?.getTracks().forEach((t) => t.stop()); } catch { /* */ } clearInterval(timerRef.current); }, []);

  const start = async () => {
    setError("");
    if (!navigator.mediaDevices?.getUserMedia) { setError(isEl ? "Δεν υποστηρίζεται" : "Not supported"); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunks.current = [];
      mr.ondataavailable = (e) => chunks.current.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunks.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setRecordings((r) => [{ url, ts: Date.now(), duration: time }, ...r]);
        stream.getTracks().forEach((t) => t.stop());
      };
      mediaRef.current = mr;
      mr.start();
      setRecording(true);
      setTime(0);
      timerRef.current = setInterval(() => setTime((t) => t + 1), 1000);
    } catch (e) {
      setError(isEl ? "Άρνηση πρόσβασης μικροφώνου" : "Microphone access denied");
    }
  };

  const stop = () => {
    mediaRef.current?.stop();
    setRecording(false);
    clearInterval(timerRef.current);
  };

  const remove = (i) => setRecordings((r) => r.filter((_, j) => j !== i));

  return (
    <GameShell title={isEl ? "Φωνητικός Καταγραφέας" : "Voice Recorder"} description={isEl ? "Ηχογράφησε φωνητικά μηνύματα" : "Record audio messages"} emoji="🎤" canonical="/games/voice-recorder" back="/games">
      <div className="text-center">
        {error && <div className="mb-3 p-2 rounded bg-rose-100 text-rose-700 text-sm">{error}</div>}
        <div className="text-6xl mb-2">{recording ? "🔴" : "🎙️"}</div>
        {recording && <div className="text-2xl font-mono mb-2">{Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}</div>}
        <button onClick={recording ? stop : start} className={`px-6 py-3 ${recording ? "bg-rose-500 hover:bg-rose-600" : "bg-emerald-500 hover:bg-emerald-600"} text-white font-bold rounded-xl text-lg`}>
          {recording ? "■ " + (isEl ? "Στοπ" : "Stop") : "● " + (isEl ? "Εγγραφή" : "Record")}
        </button>
      </div>
      <div className="mt-4 space-y-2">
        {recordings.map((r, i) => (
          <div key={r.ts} className="flex items-center gap-2 p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
            <audio src={r.url} controls className="flex-1" />
            <a href={r.url} download={`recording-${r.ts}.webm`} className="px-2 py-1 text-xs bg-blue-500 text-white rounded">⬇</a>
            <button onClick={() => remove(i)} className="px-2 py-1 text-xs bg-rose-500 text-white rounded">🗑</button>
          </div>
        ))}
        {recordings.length === 0 && !recording && (
          <div className="text-center text-sm text-slate-500 mt-4">{isEl ? "Καμία εγγραφή ακόμη" : "No recordings yet"}</div>
        )}
      </div>
    </GameShell>
  );
}
