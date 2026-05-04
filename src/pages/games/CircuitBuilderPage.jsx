import React, { useContext, useMemo, useState } from "react";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";

// Simple linear circuit: battery + components in series. Switch closes loop.
const COMPONENT_TYPES = {
  bulb:   { emoji: "💡", el: "Λάμπα",     en: "Bulb" },
  resistor: { emoji: "🔻", el: "Αντίσταση", en: "Resistor" },
  motor:  { emoji: "⚙️", el: "Μοτέρ",     en: "Motor" },
  buzzer: { emoji: "🔔", el: "Κουδούνι",  en: "Buzzer" },
  switch: { emoji: "🎚️", el: "Διακόπτης",  en: "Switch" },
};

export default function CircuitBuilderPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const isEl = lang === "el";
  const [components, setComponents] = useState([{ type: "bulb", on: false }]);
  const [switchOn, setSwitchOn] = useState(true);
  const [voltage, setVoltage] = useState(9);

  // current is closed only if switch is on
  const isOn = switchOn && components.length > 0;
  const currentBrightness = useMemo(() => {
    if (!isOn) return 0;
    const resistors = components.filter((c) => c.type === "resistor").length;
    return Math.max(0, voltage / (1 + resistors));
  }, [isOn, components, voltage]);

  const add = (type) => setComponents((c) => [...c, { type }]);
  const remove = (i) => setComponents((c) => c.filter((_, j) => j !== i));
  const reset = () => setComponents([]);

  return (
    <GameShell title={isEl ? "Φτιάξε Κύκλωμα" : "Circuit Builder"} description={isEl ? "Συνδύασε εξαρτήματα και άναψε τα φώτα!" : "Combine components and light them up!"} emoji="🔌" canonical="/games/circuit" back="/games">
      <div className="bg-slate-100 dark:bg-slate-700 rounded-2xl p-4 mb-3">
        <div className="text-xs text-slate-500 mb-2">{isEl ? "Κύκλωμα" : "Circuit"}</div>
        <div className="flex flex-wrap items-center gap-2 justify-center">
          <div className="flex flex-col items-center">
            <div className="text-3xl">🔋</div>
            <div className="text-xs">{voltage}V</div>
          </div>
          <span>—</span>
          <button onClick={() => setSwitchOn((s) => !s)} className={`px-3 py-2 rounded font-bold ${switchOn ? "bg-emerald-500 text-white" : "bg-slate-400 text-white"}`}>
            {switchOn ? "🔛 ON" : "🔴 OFF"}
          </button>
          {components.map((c, i) => {
            const t = COMPONENT_TYPES[c.type];
            const lit = isOn && c.type === "bulb" && currentBrightness > 0;
            const motor = isOn && c.type === "motor";
            return (
              <React.Fragment key={i}>
                <span>—</span>
                <button onClick={() => remove(i)} className="flex flex-col items-center group">
                  <div className={`text-3xl ${lit ? "drop-shadow-[0_0_8px_rgba(250,204,21,1)] animate-pulse" : ""} ${motor ? "animate-spin" : ""}`}>{t.emoji}</div>
                  <div className="text-[10px] text-slate-500 group-hover:text-rose-500">{isEl ? t.el : t.en} ✕</div>
                </button>
              </React.Fragment>
            );
          })}
          <span>—</span>
          <div className="text-2xl">⚡</div>
        </div>
        {isOn && (
          <div className="mt-2 text-center text-xs text-slate-500">
            ⚡ {isEl ? "Φωτεινότητα" : "Brightness"}: <b>{currentBrightness.toFixed(1)}</b>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        {Object.entries(COMPONENT_TYPES).filter(([k]) => k !== "switch").map(([k, t]) => (
          <button key={k} onClick={() => add(k)} className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg text-sm">
            + {t.emoji} {isEl ? t.el : t.en}
          </button>
        ))}
      </div>

      <label className="flex items-center gap-2 text-sm mb-2">
        <span className="w-20">{isEl ? "Τάση" : "Voltage"}</span>
        <input type="range" min="1" max="24" value={voltage} onChange={(e) => setVoltage(Number(e.target.value))} className="flex-1" />
        <span className="font-mono w-10">{voltage}V</span>
      </label>
      <div className="text-center">
        <button onClick={reset} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 font-bold rounded-lg">↺ {isEl ? "Reset" : "Reset"}</button>
      </div>
    </GameShell>
  );
}
