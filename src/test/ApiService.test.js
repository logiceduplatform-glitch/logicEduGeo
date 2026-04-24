import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../auth/firebase', () => ({
  auth: {
    currentUser: { uid: 'test-uid-123' },
  },
  db: {},
}));

const mockSetDoc = vi.fn().mockResolvedValue(undefined);
const mockGetDoc = vi.fn();
const mockDeleteDoc = vi.fn().mockResolvedValue(undefined);
const mockGetDocs = vi.fn();
const mockDoc = vi.fn(() => ({ id: 'mock-ref' }));
const mockCollection = vi.fn(() => 'mock-collection-ref');

vi.mock('firebase/firestore', () => ({
  doc: (...args) => mockDoc(...args),
  getDoc: (...args) => mockGetDoc(...args),
  setDoc: (...args) => mockSetDoc(...args),
  deleteDoc: (...args) => mockDeleteDoc(...args),
  collection: (...args) => mockCollection(...args),
  getDocs: (...args) => mockGetDocs(...args),
  writeBatch: vi.fn(),
}));

let ApiService;

beforeEach(async () => {
  vi.clearAllMocks();
  const mod = await import('../services/ApiService');
  ApiService = mod.ApiService;
});

describe('ApiService', () => {
  describe('isAvailable', () => {
    it('returns true when auth.currentUser and db exist', () => {
      expect(ApiService.isAvailable()).toBe(true);
    });
  });

  describe('getUserProfile', () => {
    it('returns profile data when document exists', async () => {
      mockGetDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ name: 'Test', role: 'teacher', avatar: '🦊' }),
      });

      const result = await ApiService.getUserProfile();
      expect(result.ok).toBe(true);
      expect(result.data).toEqual({ name: 'Test', role: 'teacher', avatar: '🦊' });
    });

    it('returns null when document does not exist', async () => {
      mockGetDoc.mockResolvedValue({
        exists: () => false,
        data: () => null,
      });

      const result = await ApiService.getUserProfile();
      expect(result.ok).toBe(true);
      expect(result.data).toBeNull();
    });
  });

  describe('saveUserProfile', () => {
    it('calls setDoc with profile data', async () => {
      const profile = { name: 'Teacher', role: 'teacher', avatar: '🐼' };
      const result = await ApiService.saveUserProfile(profile);
      expect(result.ok).toBe(true);
      expect(mockSetDoc).toHaveBeenCalledTimes(1);
      const savedData = mockSetDoc.mock.calls[0][1];
      expect(savedData.name).toBe('Teacher');
      expect(savedData.role).toBe('teacher');
      expect(savedData.updatedAt).toBeDefined();
    });
  });

  describe('saveProgress', () => {
    it('saves progress with updatedAt timestamp', async () => {
      const result = await ApiService.saveProgress('math-quiz', { score: 5, total: 10 });
      expect(result.ok).toBe(true);
      expect(mockSetDoc).toHaveBeenCalledTimes(1);
      const savedData = mockSetDoc.mock.calls[0][1];
      expect(savedData.score).toBe(5);
      expect(savedData.updatedAt).toBeDefined();
    });
  });

  describe('saveFavorites', () => {
    it('saves favorites list', async () => {
      const result = await ApiService.saveFavorites(['game1', 'game2']);
      expect(result.ok).toBe(true);
      expect(mockSetDoc).toHaveBeenCalledWith(expect.anything(), { list: ['game1', 'game2'] });
    });
  });

  describe('pullAll', () => {
    it('returns all data categories including userProfile', async () => {
      mockGetDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ name: 'User', role: 'student' }),
      });
      mockGetDocs.mockResolvedValue({ docs: [] });

      const result = await ApiService.pullAll();
      expect(result.ok).toBe(true);
      expect(result.data).toHaveProperty('userProfile');
      expect(result.data).toHaveProperty('profiles');
      expect(result.data).toHaveProperty('progress');
      expect(result.data).toHaveProperty('favorites');
      expect(result.data).toHaveProperty('stats');
      expect(result.data).toHaveProperty('quizzes');
    });
  });

  describe('pushAll', () => {
    it('pushes userProfile when present in local data', async () => {
      const localData = {
        userProfile: { name: 'Test', role: 'teacher' },
        profiles: [],
        favorites: [],
        progress: {},
        stats: {},
        quizzes: [],
      };

      const result = await ApiService.pushAll(localData);
      expect(result.ok).toBe(true);
      expect(mockSetDoc).toHaveBeenCalled();
    });

    it('handles empty local data', async () => {
      const result = await ApiService.pushAll({});
      expect(result.ok).toBe(true);
    });
  });
});
