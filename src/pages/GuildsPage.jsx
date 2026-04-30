import React, { useContext, useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import { AuthContext } from "../auth/AuthContext";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import { GuildService } from "../services/GuildService";

const T = {
  el: {
    title: "🛡️ Συμμαχίες (Guilds)",
    subtitle: "Φτιάξε ή μπες σε ομάδα. Παίξτε μαζί και ανεβείτε στη συλλογική κατάταξη!",
    myGuilds: "Οι Συμμαχίες μου",
    topGuilds: "🏆 Top Συμμαχίες",
    searchPh: "Αναζήτηση συμμαχίας...",
    create: "+ Νέα Συμμαχία",
    name: "Όνομα",
    namePh: "π.χ. Σπαρτιάτες",
    desc: "Περιγραφή",
    emoji: "Έμβλημα",
    members: "μέλη",
    score: "Συλλογική βαθμολογία",
    join: "Συμμετοχή",
    leave: "Αποχώρηση",
    view: "Δες",
    cancel: "Άκυρο",
    save: "Δημιουργία",
    confirmLeave: "Να αποχωρήσεις από τη συμμαχία;",
    needAuth: "Πρέπει να συνδεθείς για guilds.",
    full: "Η συμμαχία είναι πλήρης (μέγιστο 20 μέλη).",
    notFound: "Δεν βρέθηκε.",
    role_owner: "👑 Owner",
    role_member: "Member",
    description: "Περιγραφή",
    games: "Παιχνίδια",
    back: "← Πίσω",
    created: "Δημιουργήθηκε!",
  },
  en: {
    title: "🛡️ Guilds",
    subtitle: "Create or join a crew. Play together and climb the team leaderboard!",
    myGuilds: "My Guilds",
    topGuilds: "🏆 Top Guilds",
    searchPh: "Search guilds...",
    create: "+ New Guild",
    name: "Name",
    namePh: "e.g. Spartans",
    desc: "Description",
    emoji: "Emblem",
    members: "members",
    score: "Total score",
    join: "Join",
    leave: "Leave",
    view: "View",
    cancel: "Cancel",
    save: "Create",
    confirmLeave: "Leave this guild?",
    needAuth: "Sign in to use guilds.",
    full: "Guild is full (max 20 members).",
    notFound: "Not found.",
    role_owner: "👑 Owner",
    role_member: "Member",
    description: "Description",
    games: "Games",
    back: "← Back",
    created: "Created!",
  },
};

const EMOJIS = ["🛡️", "⚔️", "🏆", "🦁", "🐺", "🐉", "🦅", "🌟", "🔥", "⚡", "🌊", "🏰", "🎯", "💎", "🦊", "🐯"];

export default function GuildsPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const { user } = useContext(AuthContext) || {};
  const l = T[lang] || T.en;
  const navigate = useNavigate();
  const { guildId } = useParams();

  const [guilds, setGuilds] = useState([]);
  const [topGuilds, setTopGuilds] = useState([]);
  const [myGuilds, setMyGuilds] = useState([]);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ name: "", emoji: "🛡️", description: "" });

  // Single-guild detail mode
  const [guildDetail, setGuildDetail] = useState(null);
  const [members, setMembers] = useState([]);

  const loadList = useCallback(async () => {
    setBusy(true);
    try {
      const top = await GuildService.getTopGuilds(15);
      setTopGuilds(top);
      if (search.trim()) {
        const s = await GuildService.searchGuilds(search.trim());
        setGuilds(s);
      } else {
        setGuilds(top);
      }
      if (user?.uid) {
        const mine = await GuildService.getMyGuilds(user.uid);
        setMyGuilds(mine);
      }
    } catch (e) { /* ignore */ }
    setBusy(false);
  }, [search, user?.uid]);

  const loadDetail = useCallback(async (id) => {
    if (!id) return;
    setBusy(true);
    try {
      const g = await GuildService.getGuild(id);
      setGuildDetail(g);
      if (g) {
        const mems = await GuildService.getMembers(id);
        setMembers(mems);
      }
    } catch (e) { /* ignore */ }
    setBusy(false);
  }, []);

  useEffect(() => {
    if (guildId) loadDetail(guildId);
    else loadList();
  }, [guildId, loadDetail, loadList]);

  const handleCreate = async () => {
    if (!user?.uid) return alert(l.needAuth);
    if (!form.name.trim()) return;
    setBusy(true);
    try {
      const id = await GuildService.createGuild({
        uid: user.uid,
        ownerName: user.displayName || "Owner",
        name: form.name,
        emoji: form.emoji,
        description: form.description,
      });
      setShowCreate(false);
      setForm({ name: "", emoji: "🛡️", description: "" });
      navigate(`/guilds/${id}`);
    } catch (e) { alert(e.message); }
    setBusy(false);
  };

  const handleJoin = async (g) => {
    if (!user?.uid) return alert(l.needAuth);
    setBusy(true);
    try {
      await GuildService.joinGuild({ guildId: g.id, uid: user.uid, name: user.displayName || "Member" });
      navigate(`/guilds/${g.id}`);
    } catch (e) {
      alert(e.message === "guild-full" ? l.full : e.message);
    }
    setBusy(false);
  };

  const handleLeave = async () => {
    if (!user?.uid || !guildDetail) return;
    if (!window.confirm(l.confirmLeave)) return;
    setBusy(true);
    try {
      await GuildService.leaveGuild({ guildId: guildDetail.id, uid: user.uid });
      navigate("/guilds");
    } catch (e) { alert(e.message); }
    setBusy(false);
  };

  // ── Detail view ──────────────────────────────────────────────────────────
  if (guildId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
        <Navbar />
        <SEO title={guildDetail?.name || "Guild"} />
        <div className="pt-20 pb-12 px-4">
          <div className="mx-auto max-w-3xl space-y-5">
            <button onClick={() => navigate("/guilds")} className="text-sm text-slate-500 hover:underline">{l.back}</button>
            {!guildDetail ? (
              <p className="text-center text-slate-500">{busy ? "..." : l.notFound}</p>
            ) : (
              <>
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-700">
                  <div className="flex items-start gap-4">
                    <div className="text-6xl">{guildDetail.emoji || "🛡️"}</div>
                    <div className="flex-1 min-w-0">
                      <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">{guildDetail.name}</h1>
                      <p className="text-xs font-mono text-slate-400">#{guildDetail.tag}</p>
                      {guildDetail.description && <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{guildDetail.description}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    <Stat label={l.members} value={`${guildDetail.memberCount || 0}/20`} color="from-emerald-400 to-teal-500" />
                    <Stat label={l.score} value={(guildDetail.totalScore || 0).toLocaleString()} color="from-amber-400 to-orange-500" />
                    <Stat label={l.games} value={(guildDetail.totalGames || 0).toLocaleString()} color="from-violet-400 to-fuchsia-500" />
                  </div>
                </div>

                {user?.uid && members.find((m) => m.uid === user.uid) && (
                  <div className="text-center">
                    {members.find((m) => m.uid === user.uid)?.role !== "owner" && (
                      <button onClick={handleLeave} className="px-4 py-2 rounded-lg bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 font-bold text-sm">
                        {l.leave}
                      </button>
                    )}
                  </div>
                )}

                {!user?.uid || !members.find((m) => m.uid === user.uid) ? (
                  <button onClick={() => handleJoin(guildDetail)} disabled={!user?.uid || (guildDetail.memberCount || 0) >= 20} className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-extrabold shadow disabled:opacity-50">
                    {l.join}
                  </button>
                ) : null}

                <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700">
                  <h2 className="font-bold text-slate-800 dark:text-white mb-3">👥 {l.members}</h2>
                  <ul className="space-y-2">
                    {members.map((m, idx) => (
                      <li key={m.id} className="flex items-center justify-between gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-700/40 rounded-lg">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-xs font-bold text-slate-400 w-5">{idx + 1}.</span>
                          <button onClick={() => navigate(`/u/${m.uid}`)} className="font-semibold text-slate-800 dark:text-slate-100 hover:underline truncate">
                            {m.name}
                          </button>
                          {m.role === "owner" && <span className="text-[10px] font-bold text-amber-600">{l.role_owner}</span>}
                        </div>
                        <span className="text-sm font-bold text-violet-600 dark:text-violet-400">{m.score || 0} pts</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── List view ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <Navbar />
      <SEO title={l.title} />
      <div className="pt-20 pb-12 px-4">
        <div className="mx-auto max-w-3xl space-y-5">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white mb-2">{l.title}</h1>
            <p className="text-slate-500 dark:text-slate-400">{l.subtitle}</p>
          </div>

          {!user?.uid && (
            <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl p-3 text-rose-700 dark:text-rose-300 text-sm font-semibold text-center">
              {l.needAuth}
            </div>
          )}

          {/* My guilds */}
          {myGuilds.length > 0 && (
            <section className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700">
              <h2 className="font-bold text-slate-800 dark:text-white mb-3">{l.myGuilds}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {myGuilds.map((g) => <GuildCard key={g.id} g={g} onClick={() => navigate(`/guilds/${g.id}`)} l={l} />)}
              </div>
            </section>
          )}

          {/* Create + Search */}
          <div className="flex gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={l.searchPh}
              className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none"
            />
            <button onClick={() => setShowCreate(true)} disabled={!user?.uid} className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold shadow disabled:opacity-50">
              {l.create}
            </button>
          </div>

          {/* Top guilds list */}
          <section className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700">
            <h2 className="font-bold text-slate-800 dark:text-white mb-3">{l.topGuilds}</h2>
            {guilds.length === 0 && !busy ? (
              <p className="text-center text-sm text-slate-500 py-6">—</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {guilds.map((g) => <GuildCard key={g.id} g={g} onClick={() => navigate(`/guilds/${g.id}`)} l={l} />)}
              </div>
            )}
          </section>

          {/* Create modal */}
          {showCreate && (
            <div role="dialog" className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md space-y-4">
                <h3 className="text-xl font-extrabold text-slate-800 dark:text-white">{l.create}</h3>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{l.name}</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={l.namePh} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{l.emoji}</label>
                  <div className="flex flex-wrap gap-1">
                    {EMOJIS.map((e) => (
                      <button key={e} onClick={() => setForm({ ...form, emoji: e })} className={`w-10 h-10 rounded-lg text-2xl ${form.emoji === e ? "bg-cyan-100 dark:bg-cyan-900/40 ring-2 ring-cyan-400" : "bg-slate-100 dark:bg-slate-700"}`}>{e}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{l.desc}</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} maxLength={200} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white outline-none resize-none" />
                </div>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold">{l.cancel}</button>
                  <button onClick={handleCreate} disabled={busy || !form.name.trim()} className="px-4 py-2 rounded-lg bg-cyan-500 text-white font-bold disabled:opacity-50">{l.save}</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function GuildCard({ g, onClick, l }) {
  return (
    <button onClick={onClick} className="text-left bg-slate-50 dark:bg-slate-700/40 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 rounded-xl p-3 border border-slate-200 dark:border-slate-700 transition">
      <div className="flex items-center gap-2">
        <span className="text-2xl">{g.emoji || "🛡️"}</span>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-slate-800 dark:text-slate-100 truncate">{g.name}</p>
          <p className="text-[11px] text-slate-400 font-mono">#{g.tag}</p>
        </div>
      </div>
      <div className="flex items-center justify-between mt-2 text-xs">
        <span className="text-slate-500">{g.memberCount || 0}/20 {l.members}</span>
        <span className="font-bold text-violet-600 dark:text-violet-400">⭐ {(g.totalScore || 0).toLocaleString()}</span>
      </div>
    </button>
  );
}

function Stat({ label, value, color }) {
  return (
    <div className={`rounded-xl p-3 bg-gradient-to-br ${color} text-white`}>
      <p className="text-xs font-bold uppercase tracking-wider opacity-90">{label}</p>
      <p className="text-xl font-extrabold mt-0.5">{value}</p>
    </div>
  );
}
