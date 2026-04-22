import React, { useState, useCallback } from "react";
import BoardHeader from "./shared/BoardHeader";
import GameOverModal from "./shared/GameOverModal";

const ROLES = {
  werewolf:  { icon: "🐺", en: "Werewolf",   el: "Λυκάνθρωπος", team: "evil" },
  seer:      { icon: "🔮", en: "Seer",        el: "Μάντης",      team: "good" },
  doctor:    { icon: "💊", en: "Doctor",       el: "Γιατρός",     team: "good" },
  hunter:    { icon: "🏹", en: "Hunter",       el: "Κυνηγός",     team: "good" },
  villager:  { icon: "🧑‍🌾", en: "Villager",  el: "Χωρικός",     team: "good" },
};

function shuffled(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function initPlayers() {
  const roleKeys = ["werewolf", "werewolf", "seer", "doctor", "hunter", "villager", "villager", "villager"];
  const names = ["Alex", "Maria", "Nikos", "Elena", "Giorgos", "Sofia", "Dimitris", "Anna"];
  const roles = shuffled(roleKeys);
  return names.map((name, i) => ({
    name,
    role: roles[i],
    alive: true,
    protected: false,
    revealed: false,
  }));
}

export default function Werewolf({ mode, difficulty, onPlayAgain, onChangeGame, lang }) {
  const isEl = lang === "el";

  const [players, setPlayers] = useState(initPlayers);
  const [phase, setPhase] = useState("night_werewolf");
  const [day, setDay] = useState(1);
  const [winner, setWinner] = useState(null);
  const [message, setMessage] = useState(isEl ? "Νύχτα πέφτει... Οι λυκάνθρωποι ξυπνούν!" : "Night falls... The werewolves awaken!");
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [seerResult, setSeerResult] = useState(null);
  const [nightActions, setNightActions] = useState({ wolfTarget: null, doctorTarget: null });
  const [log, setLog] = useState([]);

  const gameOver = winner !== null;
  const alive = players.filter(p => p.alive);
  const wolves = alive.filter(p => p.role === "werewolf");
  const villagers = alive.filter(p => ROLES[p.role].team === "good");

  const addLog = useCallback((msg) => setLog(prev => [...prev, msg]), []);

  const checkWin = useCallback((ps) => {
    const al = ps.filter(p => p.alive);
    const w = al.filter(p => p.role === "werewolf");
    const v = al.filter(p => ROLES[p.role].team === "good");
    if (w.length === 0) return "village";
    if (w.length >= v.length) return "wolves";
    return null;
  }, []);

  const handleNightAction = useCallback(() => {
    if (!selectedTarget) return;
    const target = players.find(p => p.name === selectedTarget);
    if (!target || !target.alive) return;

    if (phase === "night_werewolf") {
      setNightActions(prev => ({ ...prev, wolfTarget: selectedTarget }));
      setSelectedTarget(null);
      setPhase("night_seer");
      setMessage(isEl ? "Ο Μάντης ξυπνάει. Ποιον θες να ελέγξεις;" : "The Seer awakens. Who do you want to investigate?");
      setSeerResult(null);
    } else if (phase === "night_seer") {
      const role = ROLES[target.role];
      setSeerResult(`${target.name}: ${role.icon} ${isEl ? role.el : role.en} (${target.role === "werewolf" ? "🐺" : "✅"})`);
      addLog(isEl ? `Μάντης: ${target.name} είναι ${role.el}` : `Seer: ${target.name} is ${role.en}`);
      setPhase("night_seer_done");
      setMessage(isEl ? "Αποτέλεσμα ελέγχου:" : "Investigation result:");
    } else if (phase === "night_doctor") {
      const doctorTargetToUse = selectedTarget;
      setNightActions(prev => ({ ...prev, doctorTarget: doctorTargetToUse }));
      setSelectedTarget(null);
      resolveNight(doctorTargetToUse);
    }
  }, [selectedTarget, players, phase, isEl, addLog]);

  const continueFromSeer = useCallback(() => {
    setSeerResult(null);
    setSelectedTarget(null);
    const doctorAlive = players.some(p => p.role === "doctor" && p.alive);
    if (doctorAlive) {
      setPhase("night_doctor");
      setMessage(isEl ? "Ο Γιατρός ξυπνάει. Ποιον θες να προστατέψεις;" : "The Doctor awakens. Who do you want to protect?");
    } else {
      resolveNight(null);
    }
  }, [players, isEl]);

  const resolveNight = useCallback((doctorTarget) => {
    const wolfTarget = nightActions.wolfTarget;
    const saved = wolfTarget === doctorTarget;
    const np = players.map(p => {
      if (p.name === wolfTarget && !saved) return { ...p, alive: false };
      return p;
    });

    setPlayers(np);

    if (saved) {
      const msg = isEl ? `Ο Γιατρός έσωσε τον ${wolfTarget}!` : `The Doctor saved ${wolfTarget}!`;
      addLog(msg);
      setMessage(msg);
    } else {
      const victim = players.find(p => p.name === wolfTarget);
      const role = ROLES[victim.role];
      const msg = isEl
        ? `Ημέρα ${day}: Ο ${wolfTarget} (${role.el}) βρέθηκε νεκρός!`
        : `Day ${day}: ${wolfTarget} (${role.en}) was found dead!`;
      addLog(msg);
      setMessage(msg);
    }

    const w = checkWin(np);
    if (w) {
      setWinner(w);
      return;
    }

    setPhase("day_discuss");
    setNightActions({ wolfTarget: null, doctorTarget: null });
    setSelectedTarget(null);
  }, [nightActions, players, day, isEl, addLog, checkWin]);

  const handleVote = useCallback(() => {
    if (!selectedTarget) return;
    const np = players.map(p =>
      p.name === selectedTarget ? { ...p, alive: false, revealed: true } : p
    );
    setPlayers(np);

    const eliminated = players.find(p => p.name === selectedTarget);
    const role = ROLES[eliminated.role];
    const msg = isEl
      ? `Το χωριό ψήφισε! Ο ${selectedTarget} (${role.el} ${role.icon}) εκτελέστηκε!`
      : `The village voted! ${selectedTarget} (${role.en} ${role.icon}) was eliminated!`;
    addLog(msg);
    setMessage(msg);

    const w = checkWin(np);
    if (w) {
      setWinner(w);
      return;
    }

    setPhase("day_result");
    setSelectedTarget(null);
  }, [selectedTarget, players, isEl, addLog, checkWin]);

  const startNight = useCallback(() => {
    setDay(prev => prev + 1);
    setPhase("night_werewolf");
    setSelectedTarget(null);
    setMessage(isEl ? "Νύχτα πέφτει... Οι λυκάνθρωποι ξυπνούν!" : "Night falls... The werewolves awaken!");
  }, [isEl]);

  const reset = useCallback(() => {
    setPlayers(initPlayers());
    setPhase("night_werewolf");
    setDay(1);
    setWinner(null);
    setMessage(isEl ? "Νύχτα πέφτει... Οι λυκάνθρωποι ξυπνούν!" : "Night falls... The werewolves awaken!");
    setSelectedTarget(null);
    setSeerResult(null);
    setNightActions({ wolfTarget: null, doctorTarget: null });
    setLog([]);
    onPlayAgain?.();
  }, [isEl, onPlayAgain]);

  const isNight = phase.startsWith("night");
  const canSelect = !gameOver && (phase === "night_werewolf" || phase === "night_seer" || phase === "night_doctor" || phase === "day_discuss");

  return (
    <div className="flex flex-col items-center gap-4 p-2 sm:p-6 w-full">
      <div className="w-full max-w-2xl rounded-3xl overflow-hidden bg-gradient-to-b from-slate-800 to-slate-900 border border-white/10 shadow-2xl shadow-black/30">
        <BoardHeader
          title="Werewolf"
          turn={null}
          playerNames={{ 1: isEl ? "Χωριό" : "Village" }}
          status={`${isNight ? "🌙" : "☀️"} ${isEl ? "Ημέρα" : "Day"} ${day}`}
        />

        <div className="p-4 sm:p-6 space-y-4 bg-white/5 backdrop-blur-sm">
          {/* Phase indicator */}
          <div className={`rounded-2xl p-4 text-center text-base font-semibold backdrop-blur-sm shadow-xl ${isNight ? "bg-gradient-to-br from-indigo-900 to-indigo-950 text-indigo-200 border border-white/10" : "bg-gradient-to-br from-amber-900/40 to-amber-800/30 text-amber-200 border border-amber-400/20"}`}>
            {phase === "night_werewolf" && (isEl ? "🐺 Λυκάνθρωποι: Διαλέξτε θύμα" : "🐺 Werewolves: Choose a victim")}
            {phase === "night_seer" && (isEl ? "🔮 Μάντης: Ελέγξτε κάποιον" : "🔮 Seer: Investigate someone")}
            {phase === "night_seer_done" && seerResult}
            {phase === "night_doctor" && (isEl ? "💊 Γιατρός: Προστατέψτε κάποιον" : "💊 Doctor: Protect someone")}
            {phase === "day_discuss" && (isEl ? "☀️ Ψηφοφορία: Ποιον υποπτεύεστε;" : "☀️ Vote: Who do you suspect?")}
            {phase === "day_result" && message}
          </div>

          {/* Players grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {players.map(p => {
              const role = ROLES[p.role];
              const isSelected = selectedTarget === p.name;
              return (
                <button
                  key={p.name}
                  onClick={() => canSelect && p.alive && setSelectedTarget(p.name)}
                  disabled={!p.alive || !canSelect}
                  className={[
                    "rounded-2xl p-4 text-center transition-all border-2 min-h-[100px]",
                    !p.alive
                      ? "opacity-40 border-white/5 bg-gradient-to-br from-slate-800/30 to-slate-900/30"
                      : isSelected
                        ? "border-violet-400 ring-[3px] ring-violet-400 bg-gradient-to-br from-violet-600/40 to-fuchsia-600/30 shadow-xl scale-105"
                        : "border-white/10 bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm hover:bg-white/20 hover:scale-[1.02] hover:shadow-xl",
                  ].join(" ")}
                >
                  <div className="text-4xl mb-2 drop-shadow-md">{p.alive ? "🧑" : "💀"}</div>
                  <div className="text-sm font-bold text-slate-300 truncate">{p.name}</div>
                  {(!p.alive || p.revealed) && (
                    <div className="text-xs mt-1 text-slate-400 font-medium">{role.icon} {isEl ? role.el : role.en}</div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Alive counts */}
          <div className="flex gap-3 justify-center text-sm font-semibold">
            <span className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-900/40 to-emerald-800/30 backdrop-blur-sm border border-white/10 text-emerald-300 shadow-xl">
              ✅ {alive.length} {isEl ? "ζωντανοί" : "alive"}
            </span>
            <span className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-900/40 to-red-800/30 backdrop-blur-sm border border-white/10 text-red-400 shadow-xl">
              💀 {players.filter(p => !p.alive).length} {isEl ? "νεκροί" : "dead"}
            </span>
          </div>

          {/* Message */}
          {message && phase !== "night_seer_done" && phase !== "day_discuss" && phase !== "night_werewolf" && phase !== "night_seer" && phase !== "night_doctor" && (
            <p className="text-center text-sm text-slate-400 font-medium">{message}</p>
          )}

          {/* Action buttons */}
          {!gameOver && (
            <div className="flex gap-3 justify-center">
              {phase === "night_seer_done" && (
                <button onClick={continueFromSeer}
                  className="px-6 py-3 rounded-xl text-base bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold shadow-xl hover:-translate-y-0.5 transition-all hover:from-violet-500 hover:to-fuchsia-500">
                  {isEl ? "Συνέχεια" : "Continue"}
                </button>
              )}
              {(phase === "night_werewolf" || phase === "night_seer" || phase === "night_doctor") && selectedTarget && (
                <button onClick={handleNightAction}
                  className="px-6 py-3 rounded-xl text-base bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold shadow-xl hover:-translate-y-0.5 transition-all hover:from-violet-500 hover:to-fuchsia-500">
                  ✅ {isEl ? "Επιβεβαίωση" : "Confirm"}
                </button>
              )}
              {phase === "day_discuss" && selectedTarget && (
                <button onClick={handleVote}
                  className="px-6 py-3 rounded-xl text-base bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold shadow-xl hover:from-red-400 hover:to-orange-400 hover:-translate-y-0.5 transition-all">
                  🗳️ {isEl ? "Ψήφισε" : "Vote"}
                </button>
              )}
              {phase === "day_result" && (
                <button onClick={startNight}
                  className="px-6 py-3 rounded-xl text-base bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold shadow-xl hover:-translate-y-0.5 transition-all hover:from-violet-500 hover:to-fuchsia-500">
                  🌙 {isEl ? "Νύχτα" : "Night falls"}
                </button>
              )}
            </div>
          )}

          {/* Game log */}
          {log.length > 0 && (
            <details className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4 transition-all shadow-xl">
              <summary className="text-sm font-bold text-slate-400 cursor-pointer hover:text-slate-300 transition-all">{isEl ? "Ιστορικό" : "Game Log"} ({log.length})</summary>
              <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                {log.map((l, i) => <p key={i} className="text-[11px] text-slate-400">{l}</p>)}
              </div>
            </details>
          )}
        </div>
      </div>

      {gameOver && (
        <GameOverModal
          winner={winner === "village" ? 1 : 2}
          playerNames={{ 1: isEl ? "Χωριό" : "Village", 2: isEl ? "Λυκάνθρωποι" : "Werewolves" }}
          stats={{
            [isEl ? "Ημέρες" : "Days"]: day,
            [isEl ? "Επιζώντες" : "Survivors"]: alive.length,
          }}
          onPlayAgain={reset}
          onChangeGame={onChangeGame}
        />
      )}
    </div>
  );
}
