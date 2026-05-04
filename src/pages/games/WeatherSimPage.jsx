import React, { useContext, useEffect, useMemo, useState } from "react";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";

export default function WeatherSimPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const isEl = lang === "el";
  const [temp, setTemp] = useState(20);
  const [humidity, setHumidity] = useState(60);
  const [wind, setWind] = useState(10);
  const [pressure, setPressure] = useState(1013);

  const condition = useMemo(() => {
    if (temp <= 0 && humidity > 50) return { emoji: "❄️", el: "Χιόνι", en: "Snow", desc: { el: "Παγωμένο νερό από ψηλά", en: "Frozen precipitation" } };
    if (humidity > 80 && pressure < 1000) return { emoji: "⛈️", el: "Καταιγίδα", en: "Thunderstorm", desc: { el: "Βροχή με κεραυνούς!", en: "Rain with lightning!" } };
    if (humidity > 70) return { emoji: "🌧️", el: "Βροχή", en: "Rain", desc: { el: "Πολλή υγρασία = βροχή", en: "High humidity → rain" } };
    if (humidity > 50) return { emoji: "☁️", el: "Συννεφιά", en: "Cloudy", desc: { el: "Σύννεφα κρύβουν τον ήλιο", en: "Clouds cover the sun" } };
    if (temp > 30 && humidity < 30) return { emoji: "🥵", el: "Ζέστη/Ξηρασία", en: "Heatwave", desc: { el: "Ζεστός & ξηρός αέρας", en: "Hot & dry air" } };
    if (wind > 40) return { emoji: "🌪️", el: "Δυνατός Άνεμος", en: "Strong Wind", desc: { el: "Πολύ δυνατός αέρας!", en: "Very strong winds!" } };
    return { emoji: "☀️", el: "Ηλιοφάνεια", en: "Sunny", desc: { el: "Καθαρός ουρανός", en: "Clear sky" } };
  }, [temp, humidity, wind, pressure]);

  const [particles, setParticles] = useState([]);
  useEffect(() => {
    if (condition.emoji === "🌧️" || condition.emoji === "⛈️" || condition.emoji === "❄️") {
      const id = setInterval(() => {
        setParticles((ps) => {
          const moved = ps.map((p) => ({ ...p, y: p.y + (condition.emoji === "❄️" ? 1 : 4) })).filter((p) => p.y < 100);
          if (moved.length < 40) {
            for (let i = 0; i < 3; i++) moved.push({ id: Math.random(), x: Math.random() * 100, y: -5 });
          }
          return moved;
        });
      }, 80);
      return () => clearInterval(id);
    }
    setParticles([]);
  }, [condition.emoji]);

  return (
    <GameShell title={isEl ? "Καιρός - Προσομοίωση" : "Weather Simulator"} description={isEl ? "Άλλαξε παραμέτρους & δες τον καιρό" : "Tweak params, see the weather change"} emoji="🌦️" canonical="/games/weather" back="/games">
      <div className="relative bg-gradient-to-b from-blue-300 to-blue-500 dark:from-slate-700 dark:to-slate-900 rounded-2xl overflow-hidden mb-4" style={{ height: 220 }}>
        {particles.map((p) => (
          <div key={p.id} className="absolute text-lg" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
            {condition.emoji === "❄️" ? "❄️" : "💧"}
          </div>
        ))}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <div className="text-7xl mb-2">{condition.emoji}</div>
          <div className="text-2xl font-extrabold">{isEl ? condition.el : condition.en}</div>
          <div className="text-sm opacity-90">{condition.desc[lang] || condition.desc.en}</div>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <label className="flex items-center gap-2"><span className="w-24">🌡 {isEl ? "Θερμ." : "Temp"}</span>
          <input type="range" min="-20" max="45" value={temp} onChange={(e) => setTemp(Number(e.target.value))} className="flex-1" />
          <span className="font-mono w-12">{temp}°C</span></label>
        <label className="flex items-center gap-2"><span className="w-24">💦 {isEl ? "Υγρασία" : "Humidity"}</span>
          <input type="range" min="0" max="100" value={humidity} onChange={(e) => setHumidity(Number(e.target.value))} className="flex-1" />
          <span className="font-mono w-12">{humidity}%</span></label>
        <label className="flex items-center gap-2"><span className="w-24">💨 {isEl ? "Άνεμος" : "Wind"}</span>
          <input type="range" min="0" max="80" value={wind} onChange={(e) => setWind(Number(e.target.value))} className="flex-1" />
          <span className="font-mono w-12">{wind}km/h</span></label>
        <label className="flex items-center gap-2"><span className="w-24">📊 {isEl ? "Πίεση" : "Pressure"}</span>
          <input type="range" min="950" max="1050" value={pressure} onChange={(e) => setPressure(Number(e.target.value))} className="flex-1" />
          <span className="font-mono w-12">{pressure}</span></label>
      </div>
    </GameShell>
  );
}
