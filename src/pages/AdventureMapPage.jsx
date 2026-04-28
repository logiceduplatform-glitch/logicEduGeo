import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import { ADVENTURE_STATIONS, ZONES, getAdventureProgress, completeStation } from "../config/adventureMapConfig";
import { ProgressService } from "../services/ProgressService";
import { CoinService } from "../services/CoinService";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";

const T = {
  el: {
    title: "Χάρτης Περιπέτειας",
    subtitle: "Εξερεύνησε τον κόσμο σταθμό-σταθμό!",
    locked: "Κλειδωμένο",
    play: "Παίξε!",
    completed: "Ολοκληρώθηκε",
    boss: "Boss Level",
    stars: "Αστέρια",
    progress: "Πρόοδος",
    stations: "σταθμοί",
    back: "Πίσω",
    congrats: "Μπράβο!",
    earned: "Κέρδισες",
    markComplete: "Σημείωσε ως ολοκληρωμένο",
    howMany: "Πόσα αστέρια κέρδισες;",
  },
  en: {
    title: "Adventure Map",
    subtitle: "Explore the world station by station!",
    locked: "Locked",
    play: "Play!",
    completed: "Completed",
    boss: "Boss Level",
    stars: "Stars",
    progress: "Progress",
    stations: "stations",
    back: "Back",
    congrats: "Great job!",
    earned: "You earned",
    markComplete: "Mark as complete",
    howMany: "How many stars did you earn?",
  },
};

function StationNode({ station, status, starsEarned, isEl, onClick, idx, total }) {
  const isLocked = status === "locked";
  const isCompleted = status === "completed";
  const isCurrent = status === "available";
  const isBoss = station.boss;

  const side = idx % 2 === 0 ? "left" : "right";
  const xPos = side === "left" ? "20%" : "80%";

  return (
    <div className="relative flex items-center" style={{ minHeight: "100px" }}>
      <div
        className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-10 ${isCurrent ? "animate-bounce" : ""}`}
        style={{ left: xPos, top: "50%" }}
      >
        <button
          onClick={() => !isLocked && onClick(station)}
          disabled={isLocked}
          className={`relative group flex flex-col items-center transition-all duration-300 ${isLocked ? "opacity-40 cursor-not-allowed grayscale" : "cursor-pointer hover:scale-110"}`}
        >
          <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-2xl sm:text-3xl shadow-xl border-4 transition-all ${
            isCompleted
              ? "bg-gradient-to-br from-emerald-400 to-green-500 border-emerald-300"
              : isCurrent
                ? `bg-gradient-to-br from-amber-400 to-orange-500 border-amber-300 ring-4 ring-amber-300/50 ring-offset-2 dark:ring-offset-slate-900`
                : isBoss
                  ? "bg-gradient-to-br from-red-400 to-rose-600 border-red-300"
                  : "bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 border-slate-300 dark:border-slate-500"
          }`}>
            {isLocked ? "🔒" : station.icon}
            {isBoss && !isLocked && <span className="absolute -top-1 -right-1 text-sm">👑</span>}
          </div>

          {isCompleted && starsEarned > 0 && (
            <div className="flex gap-0.5 mt-1">
              {[1, 2, 3].map(s => (
                <span key={s} className={`text-sm ${s <= starsEarned ? "text-amber-400" : "text-slate-300 dark:text-slate-600"}`}>★</span>
              ))}
            </div>
          )}

          <span className={`mt-1 text-[10px] sm:text-xs font-bold text-center max-w-[100px] leading-tight ${
            isCompleted ? "text-emerald-600 dark:text-emerald-400" : isCurrent ? "text-amber-700 dark:text-amber-300" : "text-slate-400 dark:text-slate-500"
          }`}>
            {isEl ? station.name.el : station.name.en}
          </span>
        </button>
      </div>
    </div>
  );
}

export default function AdventureMapPage() {
  const navigate = useNavigate();
  const { lang } = useContext(LanguageContext);
  const l = T[lang] || T.en;
  const isEl = lang === "el";
  const mapRef = useRef(null);

  const [progress, setProgress] = useState(() => getAdventureProgress());
  const [selectedStation, setSelectedStation] = useState(null);
  const [completeModal, setCompleteModal] = useState(null);

  const totalCompleted = Object.keys(progress.completed).length;
  const overallProgress = Math.round((totalCompleted / ADVENTURE_STATIONS.length) * 100);

  useEffect(() => {
    if (mapRef.current) {
      const current = progress.current;
      const el = document.getElementById(`station-${current}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  const getStatus = (station) => {
    if (progress.completed[station.id]) return "completed";
    if (station.id <= progress.current) return "available";
    return "locked";
  };

  const handleStationClick = (station) => {
    setSelectedStation(station);
  };

  const handlePlay = () => {
    if (selectedStation) {
      navigate(selectedStation.route);
    }
  };

  const handleMarkComplete = (stars) => {
    if (!completeModal) return;
    const newProgress = completeStation(completeModal.id, stars);
    setProgress({ ...newProgress });

    ProgressService.addXP(stars * 5, 2);
    if (stars === 3) CoinService.earn(3);
    else if (stars >= 1) CoinService.earn(1);

    setCompleteModal(null);
    setSelectedStation(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-green-50 to-amber-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <Navbar />
      <SEO title={l.title} />

      <div className="pt-20 pb-12 px-4">
        <div className="mx-auto max-w-2xl">
          <div className="text-center mb-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white mb-2">
              🗺️ {l.title}
            </h1>
            <p className="text-slate-500 dark:text-slate-400">{l.subtitle}</p>

            <div className="mt-4 mx-auto max-w-sm">
              <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                <span>{l.progress}</span>
                <span>{totalCompleted}/{ADVENTURE_STATIONS.length} {l.stations}</span>
              </div>
              <div className="h-3 bg-white dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
                <div className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full transition-all duration-700" style={{ width: `${overallProgress}%` }} />
              </div>
            </div>
          </div>

          <div ref={mapRef} className="relative">
            {ZONES.map((zone, zi) => {
              const zoneStations = ADVENTURE_STATIONS.filter(s => zone.stations.includes(s.id));
              return (
                <div key={zone.id} className="relative mb-2">
                  <div className={`sticky top-20 z-20 mx-auto w-fit px-4 py-1.5 rounded-full bg-gradient-to-r ${zone.color} text-white text-xs sm:text-sm font-bold shadow-lg mb-4`}>
                    {zone.bgEmoji} {isEl ? zone.name.el : zone.name.en}
                  </div>

                  <div className="relative">
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                      {zoneStations.map((station, i) => {
                        if (i === zoneStations.length - 1) return null;
                        const y1 = (i * 100) + 50;
                        const y2 = ((i + 1) * 100) + 50;
                        const x1 = i % 2 === 0 ? "20%" : "80%";
                        const x2 = (i + 1) % 2 === 0 ? "20%" : "80%";
                        const completed = progress.completed[station.id] && progress.completed[zoneStations[i + 1].id];
                        return (
                          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                            stroke={completed ? "#34d399" : progress.completed[station.id] ? "#fbbf24" : "#cbd5e1"}
                            strokeWidth="3" strokeDasharray={completed ? "0" : "8 6"}
                            className="dark:opacity-50"
                          />
                        );
                      })}
                    </svg>

                    {zoneStations.map((station, i) => (
                      <div key={station.id} id={`station-${station.id}`}>
                        <StationNode
                          station={station}
                          status={getStatus(station)}
                          starsEarned={progress.completed[station.id] || 0}
                          isEl={isEl}
                          onClick={handleStationClick}
                          idx={i}
                          total={zoneStations.length}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {progress.current > ADVENTURE_STATIONS.length && (
              <div className="text-center py-8">
                <span className="text-5xl">🏆</span>
                <p className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-2">{isEl ? "Ολοκλήρωσες τον χάρτη!" : "Map Complete!"}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedStation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedStation(null)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4" onClick={e => e.stopPropagation()}>
            <div className="text-center">
              <span className="text-5xl block mb-2">{selectedStation.icon}</span>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                {isEl ? selectedStation.name.el : selectedStation.name.en}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {isEl ? selectedStation.description.el : selectedStation.description.en}
              </p>
              {selectedStation.boss && (
                <span className="inline-block mt-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold">
                  👑 {l.boss}
                </span>
              )}
              {progress.completed[selectedStation.id] && (
                <div className="mt-2 flex justify-center gap-1">
                  {[1, 2, 3].map(s => (
                    <span key={s} className={`text-xl ${s <= progress.completed[selectedStation.id] ? "text-amber-400" : "text-slate-300"}`}>★</span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button onClick={handlePlay} className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold shadow-md hover:shadow-lg transition-all hover:scale-[1.02]">
                {l.play}
              </button>
              {!progress.completed[selectedStation.id] && (
                <button onClick={() => { setCompleteModal(selectedStation); }} className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold shadow-md hover:shadow-lg transition-all hover:scale-[1.02] text-sm">
                  {l.markComplete}
                </button>
              )}
            </div>
            <button onClick={() => setSelectedStation(null)} className="w-full text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              {l.back}
            </button>
          </div>
        </div>
      )}

      {completeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setCompleteModal(null)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-xs w-full shadow-2xl space-y-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-center text-slate-800 dark:text-white">{l.howMany}</h3>
            <div className="flex justify-center gap-4">
              {[1, 2, 3].map(s => (
                <button key={s} onClick={() => handleMarkComplete(s)} className="flex flex-col items-center gap-1 px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 hover:border-amber-400 dark:hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all">
                  <div className="flex gap-0.5">
                    {[1, 2, 3].map(i => <span key={i} className={`text-xl ${i <= s ? "text-amber-400" : "text-slate-300"}`}>★</span>)}
                  </div>
                  <span className="text-xs font-bold text-slate-500">{s} {s === 1 ? (isEl ? "αστέρι" : "star") : (isEl ? "αστέρια" : "stars")}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
