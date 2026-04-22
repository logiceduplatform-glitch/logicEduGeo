import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';

vi.mock('../auth/firebase', () => ({
  auth: {
    onAuthStateChanged: vi.fn((cb) => { cb(null); return () => {}; }),
    currentUser: null,
  },
  googleProvider: null,
  db: null,
  analytics: null,
}));

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(),
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  GoogleAuthProvider: vi.fn(),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn((auth, cb) => { cb(null); return () => {}; }),
  createUserWithEmailAndPassword: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
  sendEmailVerification: vi.fn(),
  setPersistence: vi.fn(),
  browserLocalPersistence: 'local',
  browserSessionPersistence: 'session',
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(() => Promise.resolve({ exists: () => false, data: () => null })),
  setDoc: vi.fn(() => Promise.resolve()),
  updateDoc: vi.fn(() => Promise.resolve()),
  collection: vi.fn(),
  getDocs: vi.fn(() => Promise.resolve({ docs: [] })),
  query: vi.fn(),
  where: vi.fn(),
  serverTimestamp: vi.fn(),
}));

vi.mock('firebase/analytics', () => ({
  getAnalytics: vi.fn(),
  isSupported: vi.fn(() => Promise.resolve(false)),
  logEvent: vi.fn(),
}));

describe('App Integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders without crashing', async () => {
    render(<App />);
    await waitFor(() => {
      expect(document.body.innerHTML.length > 0).toBeTruthy();
    });
  });

  it('renders skip-to-content link', async () => {
    render(<App />);
    await waitFor(() => {
      const skipLink = screen.queryByText('Skip to content') || screen.queryByText('Μετάβαση στο περιεχόμενο');
      expect(skipLink).toBeInTheDocument();
    });
  });

  it('shows skeleton loader initially', () => {
    const { container } = render(<App />);
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
