import { describe, it, expect, beforeEach } from 'vitest';
import { MultiplayerService } from '../services/MultiplayerService';

const ROOM_PREFIX = 'geo:room:';

function setPlayerId(id) {
  MultiplayerService._playerId = null;
  if (id == null) localStorage.removeItem('geo:playerId');
  else localStorage.setItem('geo:playerId', id);
}

describe('MultiplayerService', () => {
  beforeEach(() => {
    localStorage.clear();
    MultiplayerService._playerId = null;
  });

  describe('getPlayerId', () => {
    it('generates a stable player id and persists it in localStorage', () => {
      const a = MultiplayerService.getPlayerId();
      expect(a).toMatch(/^p_/);
      MultiplayerService._playerId = null;
      const b = MultiplayerService.getPlayerId();
      expect(b).toBe(a);
      expect(localStorage.getItem('geo:playerId')).toBe(a);
    });
  });

  describe('createRoom', () => {
    it('returns a room with code, hostId, waiting status, five questions, and the host player entry', () => {
      const room = MultiplayerService.createRoom('Alex', 'general');
      expect(room.code).toHaveLength(5);
      expect(room.hostId).toBe(MultiplayerService.getPlayerId());
      expect(room.status).toBe('waiting');
      expect(room.questions).toHaveLength(5);
      expect(room.players[room.hostId]).toMatchObject({
        name: 'Alex',
        score: 0,
        currentQ: 0,
        finished: false,
      });
    });
  });

  describe('joinRoom', () => {
    it('adds a second player when the room is waiting and the joiner has a different id', () => {
      const room = MultiplayerService.createRoom('Host');
      const hostId = room.hostId;
      setPlayerId(null);
      const joined = MultiplayerService.joinRoom(room.code, 'Guest');
      const guestId = MultiplayerService.getPlayerId();
      expect(hostId).not.toBe(guestId);
      expect(joined.players[guestId].name).toBe('Guest');
      expect(Object.keys(joined.players)).toHaveLength(2);
    });

    it('returns null when the room code does not exist', () => {
      expect(MultiplayerService.joinRoom('XXXXX', 'Nobody')).toBeNull();
    });

    it('returns null when the game has already started', () => {
      const room = MultiplayerService.createRoom('Host');
      MultiplayerService.startGame(room.code);
      setPlayerId(null);
      expect(MultiplayerService.joinRoom(room.code, 'Late')).toBeNull();
    });
  });

  describe('startGame', () => {
    it('sets room status to playing', () => {
      const { code } = MultiplayerService.createRoom('Solo');
      const updated = MultiplayerService.startGame(code);
      expect(updated.status).toBe('playing');
      expect(MultiplayerService.getRoom(code).status).toBe('playing');
    });
  });

  describe('submitAnswer', () => {
    it('awards 100 plus a speed bonus for a correct answer', () => {
      const { code } = MultiplayerService.createRoom('P1');
      MultiplayerService.startGame(code);
      const q0 = MultiplayerService.getRoom(code).questions[0];
      const result = MultiplayerService.submitAnswer(code, 0, q0.answer, 0);
      expect(result.correct).toBe(true);
      const speedBonus = Math.max(0, Math.floor((10 - 0) * 10));
      expect(result.points).toBe(100 + speedBonus);
      expect(result.points).toBeGreaterThanOrEqual(100);
    });

    it('awards zero points for an incorrect answer', () => {
      const { code } = MultiplayerService.createRoom('P1');
      MultiplayerService.startGame(code);
      const q0 = MultiplayerService.getRoom(code).questions[0];
      const wrong = (q0.answer + 1) % 4;
      const result = MultiplayerService.submitAnswer(code, 0, wrong, 0);
      expect(result.correct).toBe(false);
      expect(result.points).toBe(0);
    });
  });

  describe('match completion and results', () => {
    it('sets status to finished when every player has completed all questions', () => {
      const room = MultiplayerService.createRoom('Alice');
      const code = room.code;
      const aliceId = room.hostId;

      setPlayerId(null);
      MultiplayerService.joinRoom(code, 'Bob');
      const bobId = MultiplayerService.getPlayerId();

      MultiplayerService.startGame(code);
      const questions = MultiplayerService.getRoom(code).questions;

      setPlayerId(aliceId);
      for (let i = 0; i < questions.length; i++) {
        MultiplayerService.submitAnswer(code, i, questions[i].answer, 1);
      }

      setPlayerId(bobId);
      for (let i = 0; i < questions.length; i++) {
        MultiplayerService.submitAnswer(code, i, questions[i].answer, 1);
      }

      expect(MultiplayerService.getRoom(code).status).toBe('finished');
    });

    it('getResults returns rankings sorted by score descending', () => {
      const room = MultiplayerService.createRoom('Low');
      const code = room.code;
      const lowId = room.hostId;

      setPlayerId(null);
      MultiplayerService.joinRoom(code, 'High');
      const highId = MultiplayerService.getPlayerId();
      MultiplayerService.startGame(code);
      const questions = MultiplayerService.getRoom(code).questions;

      setPlayerId(lowId);
      for (let i = 0; i < questions.length; i++) {
        MultiplayerService.submitAnswer(code, i, (questions[i].answer + 1) % 4, 9);
      }

      setPlayerId(highId);
      for (let i = 0; i < questions.length; i++) {
        MultiplayerService.submitAnswer(code, i, questions[i].answer, 0);
      }

      const { rankings } = MultiplayerService.getResults(code);
      expect(rankings[0].score).toBeGreaterThanOrEqual(rankings[1].score);
      expect(rankings.map((r) => r.name)).toContain('High');
      expect(rankings.map((r) => r.name)).toContain('Low');
    });
  });

  describe('cleanOldRooms', () => {
    it('removes room entries whose createdAt is older than one hour', () => {
      const room = MultiplayerService.createRoom('Old');
      const key = ROOM_PREFIX + room.code;
      const stale = JSON.parse(localStorage.getItem(key));
      stale.createdAt = Date.now() - 2 * 60 * 60 * 1000;
      localStorage.setItem(key, JSON.stringify(stale));

      MultiplayerService.cleanOldRooms();
      expect(localStorage.getItem(key)).toBeNull();
    });
  });
});
