import { StorageService } from "./StorageService";

const CERTS_KEY = "geo:certificates";
const SHOWN_KEY = "geo:certificates:shown";

const MILESTONES = [
  { id: "games_10",   type: "gamesPlayed", target: 10,   icon: "🎮", title: { el: "10 Παιχνίδια!", en: "10 Games!" }, desc: { el: "Ολοκλήρωσες 10 παιχνίδια", en: "Completed 10 games" } },
  { id: "games_25",   type: "gamesPlayed", target: 25,   icon: "🏅", title: { el: "25 Παιχνίδια!", en: "25 Games!" }, desc: { el: "Ολοκλήρωσες 25 παιχνίδια", en: "Completed 25 games" } },
  { id: "games_50",   type: "gamesPlayed", target: 50,   icon: "🏆", title: { el: "50 Παιχνίδια!", en: "50 Games!" }, desc: { el: "Ολοκλήρωσες 50 παιχνίδια", en: "Completed 50 games" } },
  { id: "games_100",  type: "gamesPlayed", target: 100,  icon: "💎", title: { el: "100 Παιχνίδια!", en: "100 Games!" }, desc: { el: "Ολοκλήρωσες 100 παιχνίδια", en: "Completed 100 games" } },
  { id: "games_250",  type: "gamesPlayed", target: 250,  icon: "👑", title: { el: "250 Παιχνίδια!", en: "250 Games!" }, desc: { el: "Ολοκλήρωσες 250 παιχνίδια", en: "Completed 250 games" } },
  { id: "level_3",    type: "level",       target: 3,    icon: "⭐", title: { el: "Level 3!", en: "Level 3!" }, desc: { el: "Έφτασες στο επίπεδο 3", en: "Reached level 3" } },
  { id: "level_5",    type: "level",       target: 5,    icon: "🌟", title: { el: "Level 5!", en: "Level 5!" }, desc: { el: "Έφτασες στο επίπεδο 5", en: "Reached level 5" } },
  { id: "level_10",   type: "level",       target: 10,   icon: "💫", title: { el: "Level 10!", en: "Level 10!" }, desc: { el: "Έφτασες στο επίπεδο 10", en: "Reached level 10" } },
  { id: "level_20",   type: "level",       target: 20,   icon: "🔥", title: { el: "Level 20!", en: "Level 20!" }, desc: { el: "Έφτασες στο επίπεδο 20", en: "Reached level 20" } },
  { id: "streak_7",   type: "streak",      target: 7,    icon: "🔥", title: { el: "7-Day Streak!", en: "7-Day Streak!" }, desc: { el: "7 μέρες σερί!", en: "7 days in a row!" } },
  { id: "streak_30",  type: "streak",      target: 30,   icon: "🌋", title: { el: "30-Day Streak!", en: "30-Day Streak!" }, desc: { el: "30 μέρες σερί!", en: "30 days in a row!" } },
  { id: "correct_100", type: "correct",    target: 100,  icon: "✅", title: { el: "100 Σωστές!", en: "100 Correct!" }, desc: { el: "100 σωστές απαντήσεις", en: "100 correct answers" } },
  { id: "correct_500", type: "correct",    target: 500,  icon: "🎯", title: { el: "500 Σωστές!", en: "500 Correct!" }, desc: { el: "500 σωστές απαντήσεις", en: "500 correct answers" } },
  { id: "correct_1000", type: "correct",   target: 1000, icon: "🏅", title: { el: "1000 Σωστές!", en: "1000 Correct!" }, desc: { el: "1000 σωστές απαντήσεις", en: "1000 correct answers" } },
];

export const CertificateService = {
  getEarnedCertificates() {
    return StorageService.get(CERTS_KEY) || [];
  },

  getShownCertificates() {
    return StorageService.get(SHOWN_KEY) || [];
  },

  _save(certs) {
    StorageService.set(CERTS_KEY, certs);
  },

  _markShown(certId) {
    const shown = this.getShownCertificates();
    if (!shown.includes(certId)) {
      shown.push(certId);
      StorageService.set(SHOWN_KEY, shown);
    }
  },

  checkMilestones({ gamesPlayed = 0, level = 1, streak = 0, correct = 0 }) {
    const earned = this.getEarnedCertificates();
    const earnedIds = earned.map(c => c.id);
    const newCerts = [];

    for (const m of MILESTONES) {
      if (earnedIds.includes(m.id)) continue;

      let value = 0;
      switch (m.type) {
        case "gamesPlayed": value = gamesPlayed; break;
        case "level": value = level; break;
        case "streak": value = streak; break;
        case "correct": value = correct; break;
      }

      if (value >= m.target) {
        const cert = { ...m, earnedAt: new Date().toISOString() };
        earned.push(cert);
        newCerts.push(cert);
      }
    }

    if (newCerts.length > 0) {
      this._save(earned);
    }

    return newCerts;
  },

  getUnshownCertificate() {
    const earned = this.getEarnedCertificates();
    const shown = this.getShownCertificates();
    return earned.find(c => !shown.includes(c.id)) || null;
  },

  markCertificateShown(certId) {
    this._markShown(certId);
  },

  getAllMilestones() {
    return MILESTONES;
  },

  getProgress({ gamesPlayed = 0, level = 1, streak = 0, correct = 0 }) {
    const earned = this.getEarnedCertificates();
    const earnedIds = earned.map(c => c.id);

    return MILESTONES.map(m => {
      let value = 0;
      switch (m.type) {
        case "gamesPlayed": value = gamesPlayed; break;
        case "level": value = level; break;
        case "streak": value = streak; break;
        case "correct": value = correct; break;
      }

      return {
        ...m,
        earned: earnedIds.includes(m.id),
        current: value,
        progress: Math.min(1, value / m.target),
      };
    });
  },
};
