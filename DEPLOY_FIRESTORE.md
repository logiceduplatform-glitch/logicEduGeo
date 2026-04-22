# Deployment Guide - Geo Platform with Firestore

## Prerequisites

- Firebase project (already set up with Auth)
- Firebase Console access

---

## Step 1: Enable Firestore

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **logic-education-platform**
3. Click **Firestore Database** in the left sidebar
4. Click **Create database**
5. Select **Start in production mode**
6. Choose a location (e.g. `europe-west` for Greece)
7. Click **Enable**

---

## Step 2: Set Security Rules

1. In Firestore, click the **Rules** tab
2. Replace the rules with:

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

3. Click **Publish**

These rules ensure each user can only access their own data.

---

## Step 3: Deploy Frontend

### Option A: Upload to your shared hosting

```bash
npm run build
```

Upload the contents of `dist/` to your hosting's `public_html/` (or subdirectory).

Create an `.htaccess` file in the same directory (already included in `public/.htaccess`):

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
```

### Option B: Firebase Hosting (free)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Select your project, set public dir to "dist", single-page app: yes
npm run build
firebase deploy
```

---

## How It Works

```
User logs in with Google
        ↓
Firebase Auth (token)
        ↓
React App reads/writes to Firestore
        ↓
Firestore stores data under /users/{uid}/...
        ↓
localStorage used as offline cache
```

### Data Structure in Firestore

```
users/
  {uid}/
    profiles/
      child_123456789/   → { name, age, avatar, objective }
    progress/
      game-math-quiz/    → { gamesPlayed, bestScore, ... }
    data/
      favorites          → { list: ["game1", "game2"] }
    stats/
      stats_streak       → { value: { current, best, lastActiveDate } }
      stats_overall      → { value: { totalGamesPlayed, ... } }
      stats_xp           → { value: { totalXP, level } }
    quizzes/
      quiz_123456789/    → { title, questions: [...] }
```

### Free Tier Limits

| Resource | Daily Free Limit | Typical Usage |
|---|---|---|
| Document reads | 50,000 / day | ~50 per user session |
| Document writes | 20,000 / day | ~10-20 per user session |
| Storage | 1 GB total | ~1KB per user |

With 100 active users/day: ~5,000 reads, ~2,000 writes (well within limits).

---

## Troubleshooting

- **"Missing or insufficient permissions"**: Check that Firestore Rules are published correctly
- **Data not syncing**: Ensure user is logged in (not guest mode). Guest users only use localStorage
- **Slow initial load**: First Firestore read has cold-start latency (~1-2s). Subsequent reads are fast

---

## PHP + MySQL Backup

The `api/` folder contains a complete PHP + MySQL backend as an alternative.
If you ever want to switch away from Firestore, follow `DEPLOY.md` instead.
