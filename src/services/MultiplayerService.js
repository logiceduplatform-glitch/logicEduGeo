const ROOM_KEY_PREFIX = "geo:room:";

function generateRoomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function generatePlayerId() {
  return "p_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

const QUIZ_BANK = {
  general: [
    { q: { el: "Ποια είναι η πρωτεύουσα της Ελλάδας;", en: "What is the capital of Greece?" }, options: [{ el: "Αθήνα", en: "Athens" }, { el: "Θεσσαλονίκη", en: "Thessaloniki" }, { el: "Πάτρα", en: "Patras" }, { el: "Ηράκλειο", en: "Heraklion" }], answer: 0 },
    { q: { el: "Πόσα πόδια έχει η αράχνη;", en: "How many legs does a spider have?" }, options: [{ el: "6", en: "6" }, { el: "8", en: "8" }, { el: "10", en: "10" }, { el: "4", en: "4" }], answer: 1 },
    { q: { el: "Ποιο είναι το μεγαλύτερο ωκεάνιο;", en: "What is the largest ocean?" }, options: [{ el: "Ατλαντικός", en: "Atlantic" }, { el: "Ινδικός", en: "Indian" }, { el: "Ειρηνικός", en: "Pacific" }, { el: "Αρκτικός", en: "Arctic" }], answer: 2 },
    { q: { el: "Πόσα χρώματα έχει το ουράνιο τόξο;", en: "How many colors in a rainbow?" }, options: [{ el: "5", en: "5" }, { el: "6", en: "6" }, { el: "7", en: "7" }, { el: "8", en: "8" }], answer: 2 },
    { q: { el: "Ποιο ζώο είναι το πιο γρήγορο;", en: "What is the fastest animal?" }, options: [{ el: "Λιοντάρι", en: "Lion" }, { el: "Γατόπαρδος", en: "Cheetah" }, { el: "Αετός", en: "Eagle" }, { el: "Δελφίνι", en: "Dolphin" }], answer: 1 },
    { q: { el: "Πόσοι πλανήτες έχει το ηλιακό μας σύστημα;", en: "How many planets in our solar system?" }, options: [{ el: "7", en: "7" }, { el: "8", en: "8" }, { el: "9", en: "9" }, { el: "10", en: "10" }], answer: 1 },
    { q: { el: "Ποιο είναι το χημικό σύμβολο του νερού;", en: "What is the chemical symbol for water?" }, options: [{ el: "CO2", en: "CO2" }, { el: "H2O", en: "H2O" }, { el: "O2", en: "O2" }, { el: "NaCl", en: "NaCl" }], answer: 1 },
    { q: { el: "Σε ποια ήπειρο είναι η Βραζιλία;", en: "On which continent is Brazil?" }, options: [{ el: "Αφρική", en: "Africa" }, { el: "Ασία", en: "Asia" }, { el: "Ν. Αμερική", en: "S. America" }, { el: "Ευρώπη", en: "Europe" }], answer: 2 },
    { q: { el: "Πόσα δόντια έχει ένας ενήλικας;", en: "How many teeth does an adult have?" }, options: [{ el: "28", en: "28" }, { el: "30", en: "30" }, { el: "32", en: "32" }, { el: "34", en: "34" }], answer: 2 },
    { q: { el: "Ποιος ζωγράφισε τη Μόνα Λίζα;", en: "Who painted the Mona Lisa?" }, options: [{ el: "Πικάσο", en: "Picasso" }, { el: "Ντα Βίντσι", en: "Da Vinci" }, { el: "Μιχαήλ Άγγελος", en: "Michelangelo" }, { el: "Βαν Γκογκ", en: "Van Gogh" }], answer: 1 },
  ],
};

function pickQuestions(category = "general", count = 5) {
  const bank = QUIZ_BANK[category] || QUIZ_BANK.general;
  const shuffled = [...bank].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export const MultiplayerService = {
  _playerId: null,

  getPlayerId() {
    if (!this._playerId) {
      this._playerId = localStorage.getItem("geo:playerId");
      if (!this._playerId) {
        this._playerId = generatePlayerId();
        localStorage.setItem("geo:playerId", this._playerId);
      }
    }
    return this._playerId;
  },

  createRoom(playerName, category = "general") {
    const code = generateRoomCode();
    const playerId = this.getPlayerId();
    const questions = pickQuestions(category, 5);

    const room = {
      code,
      hostId: playerId,
      status: "waiting",
      category,
      questions,
      players: {
        [playerId]: { name: playerName, score: 0, currentQ: 0, answers: [], ready: true, finished: false },
      },
      createdAt: Date.now(),
      currentQuestion: 0,
      startedAt: null,
    };

    localStorage.setItem(ROOM_KEY_PREFIX + code, JSON.stringify(room));
    return room;
  },

  joinRoom(code, playerName) {
    const raw = localStorage.getItem(ROOM_KEY_PREFIX + code);
    if (!raw) return null;

    const room = JSON.parse(raw);
    if (room.status !== "waiting") return null;

    const playerId = this.getPlayerId();
    if (room.players[playerId]) return room;

    room.players[playerId] = { name: playerName, score: 0, currentQ: 0, answers: [], ready: true, finished: false };
    localStorage.setItem(ROOM_KEY_PREFIX + code, JSON.stringify(room));
    return room;
  },

  getRoom(code) {
    const raw = localStorage.getItem(ROOM_KEY_PREFIX + code);
    return raw ? JSON.parse(raw) : null;
  },

  startGame(code) {
    const room = this.getRoom(code);
    if (!room) return null;
    room.status = "playing";
    room.startedAt = Date.now();
    room.currentQuestion = 0;
    localStorage.setItem(ROOM_KEY_PREFIX + code, JSON.stringify(room));
    return room;
  },

  submitAnswer(code, questionIndex, answerIndex, timeTaken = 0) {
    const room = this.getRoom(code);
    if (!room) return null;

    const playerId = this.getPlayerId();
    const player = room.players[playerId];
    if (!player) return null;

    const question = room.questions[questionIndex];
    if (!question) return null;

    const correct = answerIndex === question.answer;
    const speedBonus = Math.max(0, Math.floor((10 - timeTaken) * 10));
    const points = correct ? 100 + speedBonus : 0;

    player.answers[questionIndex] = { answerIndex, correct, points, timeTaken };
    player.score += points;
    player.currentQ = questionIndex + 1;

    if (player.currentQ >= room.questions.length) {
      player.finished = true;
    }

    const allFinished = Object.values(room.players).every(p => p.finished);
    if (allFinished) room.status = "finished";

    localStorage.setItem(ROOM_KEY_PREFIX + code, JSON.stringify(room));
    return { correct, points, room };
  },

  getResults(code) {
    const room = this.getRoom(code);
    if (!room) return null;

    const rankings = Object.entries(room.players)
      .map(([id, p]) => ({ id, name: p.name, score: p.score, answers: p.answers }))
      .sort((a, b) => b.score - a.score);

    return { rankings, questions: room.questions, totalQuestions: room.questions.length };
  },

  simulateOpponent(code, opponentName = "GeoBot") {
    const room = this.getRoom(code);
    if (!room) return;

    const botId = "bot_" + Date.now().toString(36);
    room.players[botId] = { name: opponentName, score: 0, currentQ: 0, answers: [], ready: true, finished: false };
    localStorage.setItem(ROOM_KEY_PREFIX + code, JSON.stringify(room));

    let qi = 0;
    const advance = () => {
      const r = this.getRoom(code);
      if (!r || r.status === "finished") return;

      const q = r.questions[qi];
      if (!q) return;

      const correct = Math.random() < 0.6;
      const ansIdx = correct ? q.answer : (q.answer + 1 + Math.floor(Math.random() * 3)) % 4;
      const timeTaken = 2 + Math.random() * 6;
      const speedBonus = Math.max(0, Math.floor((10 - timeTaken) * 10));
      const points = correct ? 100 + speedBonus : 0;

      r.players[botId].answers[qi] = { answerIndex: ansIdx, correct, points, timeTaken };
      r.players[botId].score += points;
      r.players[botId].currentQ = qi + 1;
      qi++;

      if (qi >= r.questions.length) {
        r.players[botId].finished = true;
        const allFinished = Object.values(r.players).every(p => p.finished);
        if (allFinished) r.status = "finished";
      }

      localStorage.setItem(ROOM_KEY_PREFIX + code, JSON.stringify(r));

      if (qi < r.questions.length) {
        setTimeout(advance, 2000 + Math.random() * 3000);
      }
    };

    setTimeout(advance, 1500 + Math.random() * 2000);
    return botId;
  },

  cleanOldRooms() {
    const cutoff = Date.now() - 3600000;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(ROOM_KEY_PREFIX)) {
        try {
          const room = JSON.parse(localStorage.getItem(key));
          if (room.createdAt < cutoff) localStorage.removeItem(key);
        } catch { localStorage.removeItem(key); }
      }
    }
  },
};
