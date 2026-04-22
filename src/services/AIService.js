const AI_API_URL = import.meta.env.VITE_AI_API_URL || "";

const SYSTEM_PROMPT_EL = `Είσαι ο "Βοηθός Μελέτης" στην εκπαιδευτική πλατφόρμα GeoLo Platform.
Βοηθάς παιδιά 2-12 ετών και ενήλικες να μάθουν μέσα από παιχνίδια.
Απαντάς ΠΑΝΤΑ στα ελληνικά, σύντομα (2-4 προτάσεις), φιλικά, ενθαρρυντικά.
Αν σου ρωτήσουν κάτι εκτός θέματος, φέρε τη συζήτηση πίσω στη μάθηση.
Αν σου δώσουν στατιστικά χρήστη, δώσε εξατομικευμένες συμβουλές.
Μην δίνεις λανθασμένες πληροφορίες. Αν δεν ξέρεις, πες το.
Χρησιμοποίησε emoji με μέτρο (1-2 ανά μήνυμα).`;

const SYSTEM_PROMPT_EN = `You are the "Study Assistant" on GeoLo Platform, an educational gaming platform.
You help children aged 2-12 and adults learn through games.
Always respond in English, concisely (2-4 sentences), friendly, encouraging.
If asked something off-topic, gently guide conversation back to learning.
If given user stats, provide personalized advice.
Don't give incorrect information. If unsure, say so.
Use emoji sparingly (1-2 per message).`;

export const AIService = {
  isConfigured() {
    return !!AI_API_URL;
  },

  async chat(messages, lang = "el", userContext = {}) {
    if (!this.isConfigured()) {
      return null;
    }

    const systemPrompt = lang === "el" ? SYSTEM_PROMPT_EL : SYSTEM_PROMPT_EN;
    let contextNote = "";
    if (userContext.stats) {
      const s = userContext.stats;
      contextNote = lang === "el"
        ? `\n[Στατιστικά χρήστη: ${s.totalGamesPlayed} παιχνίδια, ${s.totalCorrect}/${s.totalAttempts} σωστές, Σερί: ${s.streak || 0} μέρες, Επίπεδο: ${s.level || 1}]`
        : `\n[User stats: ${s.totalGamesPlayed} games, ${s.totalCorrect}/${s.totalAttempts} correct, Streak: ${s.streak || 0} days, Level: ${s.level || 1}]`;
    }

    const apiMessages = [
      { role: "system", content: systemPrompt + contextNote },
      ...messages.slice(-10).map(m => ({
        role: m.from === "user" ? "user" : "assistant",
        content: m.text,
      })),
    ];

    try {
      if (AI_API_URL) {
        return await this._callProxy(apiMessages);
      }
      return null;
    } catch (err) {
      if (import.meta.env.DEV) console.warn("[AIService] Error:", err);
      return null;
    }
  },

  async _callProxy(messages) {
    const res = await fetch(AI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.reply || data.choices?.[0]?.message?.content || null;
  },

};
