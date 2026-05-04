import React, { useContext, useEffect, useRef, useState } from "react";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";

export default function StopMotionPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const isEl = lang === "el";
  const [stream, setStream] = useState(null);
  const [frames, setFrames] = useState([]);
  const [error, setError] = useState("");
  const [playing, setPlaying] = useState(false);
  const [pIdx, setPIdx] = useState(0);
  const [fps, setFps] = useState(6);
  const videoRef = useRef(null);

  useEffect(() => () => stream?.getTracks().forEach((t) => t.stop()), [stream]);

  useEffect(() => {
    if (!playing || frames.length === 0) return;
    const t = setInterval(() => setPIdx((i) => (i + 1) % frames.length), 1000 / fps);
    return () => clearInterval(t);
  }, [playing, fps, frames.length]);

  const startCam = async () => {
    setError("");
    if (!navigator.mediaDevices?.getUserMedia) { setError(isEl ? "Δεν υποστηρίζεται" : "Not supported"); return; }
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      setStream(s);
      if (videoRef.current) { videoRef.current.srcObject = s; videoRef.current.play(); }
    } catch (e) {
      setError(isEl ? "Άρνηση πρόσβασης κάμερας" : "Camera access denied");
    }
  };

  const capture = () => {
    if (!videoRef.current) return;
    const v = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = v.videoWidth || 320;
    canvas.height = v.videoHeight || 240;
    canvas.getContext("2d").drawImage(v, 0, 0);
    setFrames((f) => [...f, canvas.toDataURL("image/jpeg", 0.7)]);
  };

  const remove = (i) => setFrames((f) => f.filter((_, j) => j !== i));
  const clearAll = () => { setFrames([]); setPIdx(0); setPlaying(false); };

  return (
    <GameShell title={isEl ? "Stop Motion" : "Stop Motion"} description={isEl ? "Φτιάξε animation από φωτογραφίες" : "Create animation from snapshots"} emoji="🎥" canonical="/games/stop-motion" back="/games">
      {error && <div className="mb-3 p-2 rounded bg-rose-100 text-rose-700 text-sm text-center">{error}</div>}
      {!stream && (
        <div className="text-center">
          <button onClick={startCam} className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl">
            📷 {isEl ? "Άνοιγμα Κάμερας" : "Open Camera"}
          </button>
        </div>
      )}
      {stream && (
        <>
          <div className="relative">
            {playing && frames.length > 0 ? (
              <img src={frames[pIdx]} alt="" className="w-full rounded-xl bg-black" />
            ) : (
              <video ref={videoRef} className="w-full rounded-xl bg-black" playsInline />
            )}
            {playing && <div className="absolute top-2 left-2 bg-black/60 text-white px-2 rounded text-xs">▶ {pIdx + 1}/{frames.length}</div>}
          </div>
          <div className="flex gap-2 justify-center mt-3 flex-wrap">
            <button onClick={capture} disabled={playing} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold rounded-lg">
              📸 {isEl ? "Καρέ" : "Snap"}
            </button>
            <button onClick={() => setPlaying((p) => !p)} disabled={frames.length === 0} className={`px-4 py-2 ${playing ? "bg-rose-500" : "bg-purple-500"} disabled:opacity-50 text-white font-bold rounded-lg`}>
              {playing ? "■" : "▶"} {playing ? (isEl ? "Στοπ" : "Stop") : (isEl ? "Παίξε" : "Play")}
            </button>
            <button onClick={clearAll} disabled={frames.length === 0} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 disabled:opacity-50 font-bold rounded-lg">↺</button>
            <label className="text-sm flex items-center gap-1">FPS <input type="range" min="2" max="15" value={fps} onChange={(e) => setFps(Number(e.target.value))} /> {fps}</label>
          </div>
          <div className="mt-3 grid grid-cols-6 gap-1 max-h-32 overflow-y-auto">
            {frames.map((f, i) => (
              <div key={i} className="relative">
                <img src={f} alt="" className="w-full aspect-square object-cover rounded border-2 border-slate-300" />
                <button onClick={() => remove(i)} className="absolute top-0 right-0 bg-rose-500 text-white text-xs w-5 h-5 rounded-full leading-none">×</button>
              </div>
            ))}
          </div>
        </>
      )}
    </GameShell>
  );
}
