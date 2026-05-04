import React, { useContext, useState } from "react";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";
import { VoiceService } from "../../services/VoiceService";

const PARTS = {
  el: {
    hero: ["ένας μικρός δράκος", "μια γενναία πριγκίπισσα", "ένα μαγικό κουνέλι", "ένας έξυπνος ρομπότ", "μια μαγική γάτα"],
    place: ["σε ένα δάσος", "πάνω από τα σύννεφα", "κάτω από τη θάλασσα", "σε ένα χρυσό κάστρο", "στο φεγγάρι"],
    action: ["έψαχνε για θησαυρό", "έλυνε γρίφους", "βοηθούσε τους φίλους του", "πετούσε με μαγικά φτερά", "διάβαζε ένα παλιό βιβλίο"],
    twist: ["όταν εμφανίστηκε ένα ουράνιο τόξο", "και έγινε αόρατο", "όταν ξύπνησε ένας γίγαντας", "και βρήκε ένα μαγικό κλειδί", "όταν άνοιξε μια μυστική πόρτα"],
    end: ["και έζησαν ευτυχισμένοι", "και η περιπέτεια συνεχίστηκε", "και όλοι έμαθαν ένα μάθημα", "και έγινε διάσημος", "και επέστρεψε σπίτι με χαμόγελο"],
  },
  en: {
    hero: ["a little dragon", "a brave princess", "a magic rabbit", "a clever robot", "a wise cat"],
    place: ["in a forest", "above the clouds", "under the sea", "in a golden castle", "on the moon"],
    action: ["was looking for treasure", "was solving riddles", "was helping friends", "was flying with magic wings", "was reading an old book"],
    twist: ["when a rainbow appeared", "and became invisible", "when a giant woke up", "and found a magic key", "when a secret door opened"],
    end: ["and lived happily ever after", "and the adventure continued", "and everyone learned a lesson", "and became famous", "and returned home smiling"],
  },
};

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

export default function StoryBuilderPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const isEl = lang === "el";
  const p = PARTS[lang] || PARTS.en;
  const [story, setStory] = useState({ hero: rand(p.hero), place: rand(p.place), action: rand(p.action), twist: rand(p.twist), end: rand(p.end) });

  const text = isEl
    ? `Μια φορά κι έναν καιρό, ${story.hero} ${story.place} ${story.action}. ${story.twist[0].toUpperCase() + story.twist.slice(1)}, ${story.end}.`
    : `Once upon a time, ${story.hero} ${story.place} ${story.action}. ${story.twist[0].toUpperCase() + story.twist.slice(1)}, ${story.end}.`;

  const Picker = ({ k, options, label }) => (
    <div className="mb-3">
      <div className="text-xs font-bold text-slate-500 uppercase mb-1">{label}</div>
      <div className="flex flex-wrap gap-1">
        {options.map((o) => (
          <button key={o} onClick={() => setStory((s) => ({ ...s, [k]: o }))}
            className={`px-2 py-1 text-xs rounded ${story[k] === o ? "bg-purple-600 text-white" : "bg-slate-200 dark:bg-slate-700"}`}>
            {o}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <GameShell title={isEl ? "Φτιάξε Ιστορία" : "Story Builder"} description={isEl ? "Διάλεξε στοιχεία και φτιάξε δική σου ιστορία" : "Pick parts to build your story"} emoji="📖" canonical="/games/story-builder" back="/games">
      <Picker k="hero" options={p.hero} label={isEl ? "Ήρωας" : "Hero"} />
      <Picker k="place" options={p.place} label={isEl ? "Τόπος" : "Place"} />
      <Picker k="action" options={p.action} label={isEl ? "Δράση" : "Action"} />
      <Picker k="twist" options={p.twist} label={isEl ? "Ανατροπή" : "Twist"} />
      <Picker k="end" options={p.end} label={isEl ? "Τέλος" : "Ending"} />

      <div className="mt-4 p-4 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 rounded-2xl border-2 border-purple-300 dark:border-purple-700">
        <div className="text-lg leading-relaxed">{text}</div>
      </div>
      <div className="flex gap-2 justify-center mt-3 flex-wrap">
        <button onClick={() => VoiceService.speak(text, lang)} className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-lg">
          🔊 {isEl ? "Άκου" : "Read"}
        </button>
        <button onClick={() => setStory({ hero: rand(p.hero), place: rand(p.place), action: rand(p.action), twist: rand(p.twist), end: rand(p.end) })}
          className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-lg">
          🎲 {isEl ? "Τυχαία" : "Random"}
        </button>
      </div>
    </GameShell>
  );
}
