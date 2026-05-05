# 📚 Kibloo · Πλήρης Οδηγός Features

> Αναλυτική τεκμηρίωση **όλων** των δυνατοτήτων της πλατφόρμας.
> Κάθε feature περιγράφει: **τι κάνει**, **πώς το βρίσκεις**, **πώς ενεργοποιείται/απενεργοποιείται** από admin, και **πού βρίσκεται στον κώδικα**.

**Ενημερωμένο:** Μάιος 2026 · **Εκδοση πλατφόρμας:** v1.0 (production)

---

## 📑 Πίνακας Περιεχομένων

1. [Πώς διαβάζεται αυτός ο οδηγός](#πώς-διαβάζεται-αυτός-ο-οδηγός)
2. [Συνδρομές & Πληρωμές](#1-συνδρομές--πληρωμές)
3. [Παιχνίδια ανά Ηλικία](#2-παιχνίδια-ανά-ηλικία)
4. [Κλασικά Παιχνίδια (59 παιχνίδια)](#3-κλασικά-παιχνίδια-59-παιχνίδια)
5. [Features για Μαθητές](#4-features-για-μαθητές)
6. [AI & Φωνή](#5-ai--φωνή)
7. [Πρόοδος & Ανταγωνισμός](#6-πρόοδος--ανταγωνισμός)
8. [Features για Δασκάλους](#7-features-για-δασκάλους)
9. [Features για Γονείς](#8-features-για-γονείς)
10. [Multiplayer & Κοινωνικά](#9-multiplayer--κοινωνικά)
11. [B2B / Σχολεία / Family Plans](#10-b2b--σχολεία--family-plans)
12. [Onboarding & Engagement](#11-onboarding--engagement)
13. [Marketing & SEO](#12-marketing--seo)
14. [Analytics & Monitoring](#13-analytics--monitoring)
15. [Business Operations](#14-business-operations)
16. [Προσβασιμότητα & UX](#15-προσβασιμότητα--ux)
17. [PWA & Offline](#16-pwa--offline)
18. [Νομικά & Συμμόρφωση](#17-νομικά--συμμόρφωση)

---

## Πώς διαβάζεται αυτός ο οδηγός

Κάθε feature ακολουθεί την ίδια δομή:

```
🎯 Όνομα Feature
─────────────────
Τι κάνει:    Σύντομη περιγραφή σε απλή γλώσσα.
Για ποιόν:   Μαθητές / Γονείς / Δασκάλους / Admin / Όλους.
Πού:         Πώς το βρίσκει ο χρήστης (route ή UI path).
Flag:        Όνομα feature flag στο Admin Dashboard.
Αρχείο:      Το βασικό αρχείο κώδικα (για developers).
```

**Πώς αλλάζω αν ένα feature είναι ενεργό;**

1. Σύνδεση ως admin (`logic.edu.platform@gmail.com`).
2. Πήγαινε στο **Admin Dashboard → Feature Flags** (`/admin/flags`).
3. Βρες το flag στην κατηγορία του και κάνε toggle.
4. Η αλλαγή είναι **άμεση** για όλους τους χρήστες (δεν χρειάζεται redeploy).

---

## 1. Συνδρομές & Πληρωμές

### 💳 Σύστημα Συνδρομών (Master)
- **Τι κάνει:** Ενεργοποιεί ολόκληρο το σύστημα πληρωμών — αν κλείσει, όλοι έχουν δωρεάν πρόσβαση.
- **Για ποιόν:** Όλους
- **Flag:** `subs_enabled`
- **Αρχείο:** `src/services/SubscriptionService.js`

### 🆓 Πλάνο Free
- **Τι κάνει:** Δωρεάν tier — βασικά παιχνίδια, χωρίς premium content, με μικρή διαφήμιση εσωτερικά.
- **Flag:** `subs_free`

### ⭐ Πλάνο Premium (€9.99/μήνα)
- **Τι κάνει:** Ξεκλειδώνει όλα τα παιχνίδια, AI tutor χωρίς όρια, advanced analytics, ad-free.
- **Πού:** `/pricing` → "Premium" button → Stripe Checkout.
- **Flag:** `subs_premium`
- **Πληρωμή:** Stripe (test mode μέχρι το go-live — βλέπε [`STRIPE_LIVE.md`](./STRIPE_LIVE.md)).

### 👨‍👩‍👧 Πλάνο Family (€14.99/μήνα)
- **Τι κάνει:** Premium για έως 5 child profiles + parental dashboard.
- **Flag:** `subs_family`
- **Bonus flag:** `familyPlan_profiles` (πολλαπλά παιδιά).

### 🏫 Πλάνο School
- **Τι κάνει:** Custom B2B άδεια για τάξεις/σχολεία (per-seat pricing).
- **Πού:** `/pricing` → "Σχολεία" tab → contact form.
- **Flag:** `subs_school` (default: OFF — απαιτεί manual ενεργοποίηση).

### 🎁 7-ήμερη Δωρεάν Δοκιμή
- **Τι κάνει:** Νέοι χρήστες παίρνουν αυτόματα 7 ημέρες Premium δωρεάν.
- **Flag:** `subs_trial`
- **Email reminders:** Day 3 + Day 7 πριν λήξει (Cloud Function `scheduledTrialReminders`).

### 🎟️ Premium Trial μέσω Παραπομπής
- **Τι κάνει:** Κάθε χρήστης που φέρνει φίλο κερδίζει +30 μέρες Premium.
- **Flag:** `subs_referralReward`
- **Πού:** `/referrals` (κωδικός μοιράζεται με WhatsApp/Email link).

### 💰 Σελίδα Τιμολόγησης
- **Πού:** `/pricing` (link στο Navbar).
- **Flag:** `subs_pricingPage`

### 🔐 Stripe Checkout
- **Τι κάνει:** Επεξεργασία πληρωμών μέσω Stripe (PCI-compliant, δεν αποθηκεύουμε κάρτες).
- **Flag:** `subs_payment`
- **Backend:** Cloud Function `createCheckoutSession` + webhook `stripeWebhook`.

---

## 2. Παιχνίδια ανά Ηλικία

Η πλατφόρμα οργανώνει τα εκπαιδευτικά παιχνίδια σε **6 ηλικιακές ομάδες** × **3 κατηγορίες** = **18 πακέτα** + Adult section.

| Ηλικία | Σχολικά (🏫) | Διασκέδαση (🎉) | Λογική (🧠) |
|--------|---|---|---|
| 2–3 ετών | `games_age_2_3_school` | `games_age_2_3_fun` | `games_age_2_3_logic` |
| 4–5 ετών | `games_age_4_5_school` | `games_age_4_5_fun` | `games_age_4_5_logic` |
| 6 ετών | `games_age_6_school` | `games_age_6_fun` | `games_age_6_logic` |
| 7–8 ετών | `games_age_7_8_school` | `games_age_7_8_fun` | `games_age_7_8_logic` |
| 9–10 ετών | `games_age_9_10_school` | `games_age_9_10_fun` | `games_age_9_10_logic` |
| 11–12 ετών | `games_age_11_12_school` | `games_age_11_12_fun` | `games_age_11_12_logic` |
| **Ενήλικες** | Brain · Fun · Logic · Board | | |

- **Πού:** Home page → "Επιλογή ηλικίας" carousel → άνοιγμα κατηγορίας.
- **Toggle ομάδας:** Στο Admin Dashboard, κατηγορία **🎮 Παιχνίδια ανά Ηλικία**.
- **Επιπτώσεις απενεργοποίησης:** Όλη η ηλικιακή κατηγορία εξαφανίζεται από το menu και τα search results.

---

## 3. Κλασικά Παιχνίδια (59 παιχνίδια)

Συλλογή 59 timeless παιχνιδιών οργανωμένα σε **6 sub-collections**.

### 🎯 Master Toggle
- **Flag:** `classicGames_master` — αν κλείσει, εξαφανίζονται **όλα** τα classic games.

### Sub-collections

| Συλλογή | # | Παραδείγματα | Flag |
|---|---|---|---|
| ⚡ Quick Wins | 10 | Wordle, 2048, Snake, Tetris, Tic-Tac-Toe, 24 Game, Word Search, Whack-a-Mole, Dot Connect, Drawing Pad | `classicGames_quickWins` |
| 📚 Εκπαιδευτικά | 16 | Spelling Bee, Math Sprint, Times Tables, Map of Greece, Periodic Table, Geography, History Timeline, Code Puzzles, Logic Gates, Fraction Pizza, Music Notes | `classicGames_educational` |
| 🎨 Δημιουργικά | 13 | Pixel Art, Story Builder, Comic Maker, Music Composer, Pattern Designer, Mad Libs, Animation, Stop Motion, Beat Maker | `classicGames_creative` |
| 👥 Multiplayer | 5 | Battle Quiz, Co-op Maze, Team Spelling, Word Race, Drawing Telephone | `classicGames_multiplayer` |
| 💥 Δράσης | 8 | Reaction Time, Bubble Pop, Memory Flash, Color Match, Number Tap, Pattern Repeat | `classicGames_action` |
| 🔬 STEM | 7 | Chemistry Lab, Solar System, DNA Helix, Circuit Builder, Ecosystem Sim, Math Photo Solver | `classicGames_stem` |

### Paramount Sub-features

| Feature | Flag | Περιγραφή |
|---|---|---|
| Εμφάνιση στο Navbar | `classicGames_navMenu` | Tab "Κλασικά" στο header navigation. |
| Mega banner στην Home | `classicGames_homeBanner` | Promotional section στην αρχική. |
| Coin rewards | `classicGames_coinRewards` | +5 έως +20 coins ανά παιχνίδι. |
| Achievements | `classicGames_achievements` | Milestones: 1ο, 5, 15, 30 παιχνίδια. |
| First-time tutorials | `classicGames_firstTip` | Popup με οδηγίες την 1η φορά. |
| Reward toasts | `classicGames_rewardToast` | Animation όταν κερδίζεις coins. |
| Reflex Leaderboard | `classicGames_leaderboard` | Personal bests για action games. |
| 'Τι Νέο' σελίδα | `classicGames_whatsNew` | `/whats-new` με όλες τις προσθήκες. |

- **Πού:** Navbar → "🕹️ Κλασικά" → showcase pages ανά κατηγορία.
- **Routes:** `/games/all`, `/games/quick-wins`, `/games/educational`, `/games/creative`, `/games/multiplayer`, `/games/action`, `/games/stem`.

---

## 4. Features για Μαθητές

### ⚔️ Battle Royale
- **Τι κάνει:** Online quiz battle με έως 100 παίκτες ταυτόχρονα.
- **Πού:** Student Dashboard → "Battle Royale" tile.
- **Flag:** `battleRoyale`

### 🏃 Speedrun
- **Τι κάνει:** Λύνεις 10 ερωτήσεις με χρονόμετρο, παγκόσμια κατάταξη.
- **Flag:** `speedrun`

### 🗺️ Χάρτης Περιπέτειας
- **Τι κάνει:** Story-driven map με νησιά/περιοχές που ξεκλειδώνεις προοδευτικά.
- **Πού:** `/adventure`
- **Flag:** `adventureMap`

### 🐾 Pet System
- **Τι κάνει:** Κάθε μαθητής υιοθετεί κατοικίδιο που μεγαλώνει με κάθε σωστή απάντηση.
- **Flag:** `pet`

### 🃏 Συλλεκτικές Κάρτες
- **Τι κάνει:** 100+ κάρτες με ιστορικά πρόσωπα/φυτά/ζώα — drop rates ως reward.
- **Flag:** `cards`

### 📖 Story Mode
- **Τι κάνει:** Παίζεις quiz μέσα σε διαδραστικό story (διακλαδώσεις, choices).
- **Flag:** `storyMode`

### 🎯 Ημερήσια Πρόκληση
- **Τι κάνει:** 1 ειδικό quiz κάθε μέρα με bonus coins.
- **Flag:** `dailyChallenge`

### 🎭 Avatar Builder
- **Τι κάνει:** Customize avatar (ρούχα, μαλλιά, αξεσουάρ).
- **Flag:** `avatarBuilder`

### 🛍️ Κατάστημα
- **Τι κάνει:** Ξοδεύεις coins σε hints, themes, frames, badges.
- **Flag:** `shop`
- **Επέκταση:** `shopExpansion` (frames, badges).

---

## 5. AI & Φωνή

### 🧠 Study Buddy AI
- **Τι κάνει:** Προσωπικός AI tutor που εξηγεί ασκήσεις, δίνει υπόδειξεις.
- **Πού:** Σε κάθε quiz, κουμπί "🤖 Βοήθεια".
- **Flag:** `aiTutor`
- **Premium:** Απεριόριστα · Free: 5 ερωτήσεις/μέρα.

### 🎤 Voice Commands
- **Τι κάνει:** Έλεγχος της εφαρμογής με φωνή ("επόμενο", "βοήθεια").
- **Flag:** `voiceCommands`

### 🔊 Text-to-Speech
- **Τι κάνει:** Διαβάζει ερωτήσεις/θεωρία (χρήσιμο για μικρά παιδιά / dyslexia).
- **Flag:** `textToSpeech`

### 💡 Hint System (50/50)
- **Τι κάνει:** Αφαιρεί 2 λάθος απαντήσεις (κοστίζει 5 coins).
- **Flag:** `hintSystem`

### 📷 AI Math Photo Solver
- **Τι κάνει:** Φωτογραφίζεις άσκηση μαθηματικών, δίνει βήμα-βήμα λύση.
- **Πού:** `/games/photo-solver`
- **Flag:** `aiPhotoSolver`

### ✨ AI Story Generator
- **Τι κάνει:** Δημιουργεί προσαρμοσμένες εκπαιδευτικές ιστορίες.
- **Flag:** `aiStoryGen`

### 🎙️ AI Voice Quiz
- **Τι κάνει:** Quiz όπου απαντάς με τη φωνή σου.
- **Πού:** `/quiz/voice`
- **Flag:** `aiVoiceQuiz`

### 📝 AI Lesson Generator
- **Τι κάνει:** Ο δάσκαλος εισάγει θέμα → AI φτιάχνει πλήρες μάθημα + quiz.
- **Flag:** `aiLessonGen`

### 🎓 AI Quiz Generator
- **Τι κάνει:** Ο δάσκαλος επιλέγει θέμα/ηλικία/δυσκολία → 10 ερωτήσεις σε 5 sec.
- **Flag:** `aiQuizGen`
- **Bilingual:** EL + EN output.

---

## 6. Πρόοδος & Ανταγωνισμός

### 🏆 Trophy Room
- **Τι κάνει:** Συλλογή 50+ trophies που ξεκλειδώνεις ανά achievement.
- **Πού:** Profile → "Trophies".
- **Flag:** `trophyRoom`

### 📊 Mastery Tracker
- **Τι κάνει:** Δείχνει επίπεδο κατανόησης ανά θέμα (μαθηματικά, ιστορία, κλπ.).
- **Πού:** Profile → "Mastery".
- **Flag:** `masteryTracker`

### 🥇 Παγκόσμια Κατάταξη
- **Τι κάνει:** Top 100 μαθητές παγκοσμίως, εθνικά, σχολικά.
- **Flag:** `leaderboard`

### 🎉 Events & Τουρνουά
- **Τι κάνει:** Σεζονιακά events (Halloween Quiz, Christmas Math Race κλπ.).
- **Flag:** `events`

### 🔁 Spaced Repetition
- **Τι κάνει:** Algorithm που σου ξανα-δείχνει ερωτήσεις πριν τις ξεχάσεις.
- **Flag:** `spacedRepetition` και `srs` (νέο engine).
- **Dashboard widget:** `srsDashboard`.

### 📜 Πιστοποιητικά
- **Τι κάνει:** Auto-generated PDF certificate όταν ολοκληρώνεις course.
- **Flag:** `certificates`

---

## 7. Features για Δασκάλους

### 🎮 Live Quiz
- **Τι κάνει:** Δημιουργείς quiz, μαθητές μπαίνουν με κωδικό, παίζουν live (Kahoot-style).
- **Πού:** Teacher Dashboard → "Live Quiz".
- **Flag:** `liveQuiz`
- **Νέο engine:** `liveClassroom` (Kahoot-style με leaderboard real-time).

### 📝 Εργασίες για το Σπίτι
- **Τι κάνει:** Αναθέτεις quiz σε συγκεκριμένη τάξη με deadline.
- **Flag:** `homework`

### 📄 Φύλλα Εργασίας
- **Τι κάνει:** Auto-generate PDF worksheets για print (EL + EN).
- **Flag:** `worksheets`

### 📚 Σχέδια Μαθήματος
- **Τι κάνει:** Έτοιμα lesson plans αλιγνισμένα στο Ελληνικό curriculum.
- **Flag:** `lessonPlans`

### 📊 Αναφορές Τάξης
- **Τι κάνει:** Performance dashboard ανά μαθητή/θέμα.
- **Flag:** `classReports`

### 👥 Co-Teacher
- **Τι κάνει:** 2+ δάσκαλοι μοιράζονται τάξη.
- **Flag:** `coTeacher`

### 📖 Θεωρία & Μαθήματα
- **Τι κάνει:** Βιβλιοθήκη με θεωρία + παραδείγματα.
- **Flag:** `teacherTheory`

### 📦 Πακέτα Curriculum
- **Τι κάνει:** Προ-έτοιμα bundles για κάθε τάξη (Α' Δημοτικού, Β' κλπ).
- **Flag:** `curriculumPacks`
- **Αρχείο:** `src/config/curriculumPacks.js`

### 🎓 LMS Export
- **Τι κάνει:** Εξαγωγή για Google Classroom / Microsoft Teams.
- **Flag:** `lmsExport`

---

## 8. Features για Γονείς

### 👨‍👩‍👧 Οικογενειακή Πρόκληση
- **Τι κάνει:** Γονιός vs παιδί quiz, με leaderboard.
- **Flag:** `familyChallenge`

### 📅 Εβδομαδιαία Αναφορά
- **Τι κάνει:** Email κάθε Κυριακή με πρόοδο της εβδομάδας.
- **Flag:** `weeklyDigest`

### ⏱️ Έλεγχος Χρόνου Οθόνης
- **Τι κάνει:** Ορίζεις max λεπτά/μέρα + ώρες χρήσης.
- **Πού:** Parent Dashboard → "Έλεγχος χρόνου".
- **Flag:** `screenTime`
- **Αναβαθμισμένο:** `timeManagement` (full dashboard), `timeManagement_schedule` (windows), `timeManagement_dailyCap` (όριο).

### 💬 Chat Γονέα-Δασκάλου
- **Τι κάνει:** Άμεση επικοινωνία μέσα στην εφαρμογή.
- **Flag:** `parentTeacherChat`

### 👶 Σύγκριση Πολλαπλών Παιδιών
- **Τι κάνει:** Σύγκριση προόδου ανάμεσα σε αδέρφια.
- **Flag:** `multiChild`

### 🤝 Homework Helper
- **Τι κάνει:** AI που βοηθάει το γονιό να εξηγήσει εργασίες.
- **Flag:** `homeworkHelper`

### 🎮 Co-Play με Γονιό
- **Τι κάνει:** Quizzes designed για να παίζεις μαζί με το παιδί στην ίδια συσκευή.
- **Flag:** `coPlay`

---

## 9. Multiplayer & Κοινωνικά

### ⚔️ Online Battle (PvP)
- **Τι κάνει:** 1v1 quiz duel real-time.
- **Flag:** `onlineBattle`

### 🛡️ Συμμαχίες (Guilds)
- **Τι κάνει:** Δημιουργείς/μπαίνεις σε guild, ομαδικά quests.
- **Flag:** `guilds`

### 👤 Δημόσιο Προφίλ
- **Τι κάνει:** Public page (`/u/<username>`) με trophies, level.
- **Flag:** `publicProfile`

### 🤝 Friend Challenges (Async 1v1)
- **Τι κάνει:** Στέλνεις challenge σε φίλο, παίζει όποτε θέλει, σύγκριση scores.
- **Flag:** `friendChallenges`

### ⭕ Tic-Tac-Toe Online
- **Τι κάνει:** Real-time multiplayer με Firestore sync.
- **Flag:** `ticTacToeOnline`

---

## 10. B2B / Σχολεία / Family Plans

### 🏫 School Admin
- **Τι κάνει:** Διαχείριση σχολείου: τάξεις, δάσκαλοι, μαθητές, billing.
- **Πού:** `/school-admin`
- **Flag:** `schoolAdmin`

### 🎫 School License
- **Τι κάνει:** Activation με κωδικό/PO number.
- **Flag:** `schoolLicense`
- **Σελίδα:** `/school-activate` (`schoolLicensePage`).

### 📱 Kid Login (QR/PIN)
- **Τι κάνει:** Παιδιά μπαίνουν με QR/PIN (χωρίς email/password).
- **Flag:** `kidLogin`

### 💼 School Invoicing
- **Τι κάνει:** Admin εκδίδει Stripe invoices για σχολεία.
- **Πού:** `/admin/invoicing`
- **Flag:** `schoolInvoicing`
- **Backend:** Cloud Functions `createSchoolInvoice`, `voidSchoolInvoice`.

### 🤝 Affiliate Program
- **Τι κάνει:** Παρτνέρς στέλνουν traffic με tracking link, παίρνουν προμήθεια.
- **Πού:** `/affiliate`
- **Flag:** `affiliate`

### 👨‍👩‍👧 Family Plan Profiles
- **Τι κάνει:** 1 λογαριασμός γονέα → έως 5 child profiles.
- **Flag:** `familyPlan_profiles`

---

## 11. Onboarding & Engagement

### 🎉 Welcome Quest
- **Τι κάνει:** Interactive 5-step tour για νέους χρήστες (επιλογή avatar, πρώτο quiz, κλπ).
- **Πού:** Auto-trigger στο 1ο login.
- **Flag:** `welcomeQuest`

### 💬 In-app Feedback Widget
- **Τι κάνει:** Floating "Πες μας γνώμη" pill, εμφανίζεται μετά από 5 sec engagement.
- **Πού:** Bottom-right, δίπλα στο support bubble.
- **Flag:** `feedbackWidget`
- **Cooldown:** Επανεμφανίζεται μετά από 24h (αν dismiss).

### 🏅 Founding Member Badge
- **Τι κάνει:** Special badge για τους πρώτους 1000 χρήστες.
- **Flag:** `foundingMemberBadge`

### 🎯 Ημερήσιες Αποστολές (Daily Quests)
- **Τι κάνει:** 3 αποστολές/μέρα με coin rewards.
- **Flag:** `dailyQuests`

### 🎲 Καθημερινά Mini-Games
- **Τι κάνει:** 1 διαφορετικό mini-game κάθε μέρα.
- **Flag:** `miniGames`

### 🎵 Background Music
- **Τι κάνει:** Ήσυχη μουσική παρασκηνίου (toggle on/off).
- **Flag:** `music`

---

## 12. Marketing & SEO

### 📊 Σύγκριση με Ανταγωνισμό
- **Τι κάνει:** Side-by-side table στην homepage (Kibloo vs Prodigy/IXL/Begin).
- **Flag:** `marketing_comparison`
- **Αρχείο:** `src/components/ComparisonSection.jsx`

### ✉️ Newsletter Signup
- **Τι κάνει:** Email collection με rate limiting.
- **Πού:** Footer (default) ή/και homepage hero (optional).
- **Flag:** `marketing_newsletter` (footer), `marketing_newsletterHero` (homepage hero — default OFF).
- **Backend:** Firestore collection `newsletter` + προαιρετικό webhook.

### 📝 Blog
- **Τι κάνει:** 8+ άρθρα για γονείς/δασκάλους (διαχείριση οθόνης, learning styles, κλπ).
- **Πού:** `/blog`
- **Flag:** `marketing_blog`

### 📡 RSS Feed
- **Τι κάνει:** Auto-generated `/rss.xml` σε κάθε build.
- **Flag:** `marketing_rssLink`
- **Script:** `scripts/generate-rss.js`

### 🔍 SEO FAQ Schema
- **Τι κάνει:** JSON-LD `FAQPage` schema για rich Google results.
- **Flag:** `marketing_seoFaqSchema`

### 🎁 Σύστημα Παραπομπών
- **Πού:** `/referrals`
- **Flag:** `referrals`

### 🏆 Share Trophy Room / Score Card
- **Τι κάνει:** Social share με auto-generated image.
- **Flags:** `trophyShare`, `scoreShare`

---

## 13. Analytics & Monitoring

### 📈 Microsoft Clarity
- **Τι κάνει:** Heatmaps + session recordings (anonymous).
- **Flag:** `analytics_clarity`
- **Privacy:** Δεν συλλέγει PII· σέβεται cookie consent.

### 🎮 Game Events
- **Τι κάνει:** Tracks `game_started`, `game_completed`, `score`.
- **Flag:** `analytics_gameEvents`

### 🎯 Milestones
- **Τι κάνει:** Tracks 1ο παιχνίδι, 5/15/30 διαφορετικά games.
- **Flag:** `analytics_milestones`

### 🐛 Sentry Error Tracking
- **Τι κάνει:** Πιάνει JS errors + performance issues στο production.
- **Flag:** `sentry_enabled`
- **Setup:** Βλέπε [`OPS.md`](./OPS.md) → Sentry section.

### 🛡️ Firebase App Check
- **Τι κάνει:** Anti-abuse (reCAPTCHA v3) — εμποδίζει bots από Firestore writes.
- **Flag:** `appcheck_enabled`
- **Setup:** Βλέπε [`OPS.md`](./OPS.md).

---

## 14. Business Operations

### 💬 Support Widget (Crisp/Tawk)
- **Τι κάνει:** Φορτώνει 3rd-party chat widget αν έχει configured.
- **Flag:** `supportWidget`
- **Env vars:** `VITE_SUPPORT_PROVIDER`, `VITE_CRISP_WEBSITE_ID`, ή `VITE_TAWK_PROPERTY_ID`.

### 🆘 Floating Help Bubble (fallback)
- **Τι κάνει:** Δικό μας help button (μωβ) όταν δεν είναι active το 3rd-party.
- **Πού:** Bottom-right, hidden σε /admin και /auth.
- **Flag:** `supportBubble`

### 📧 Onboarding Emails
- **Day 3:** Tips & tricks email — `onboardingEmails_day3`
- **Day 7:** Trial reminder + special offer — `onboardingEmails_day7`
- **Backend:** Cloud Function `onboardingEmailSequence` (daily at 10:00 Athens time).

---

## 15. Προσβασιμότητα & UX

### ♿ Σελίδα Προσβασιμότητας
- **Πού:** `/accessibility`
- **Flag:** `accessibility`

### 🦽 Floating Accessibility (♿)
- **Τι κάνει:** Floating button με quick toggles (μέγεθος γραμματοσειράς, contrast, etc).
- **Flag:** `a11yFAB`

### 👋 Νοηματική Γλώσσα
- **Τι κάνει:** Video signing για επιλεγμένα παιχνίδια.
- **Flag:** `signLanguage`

### 🎨 Εποχιακά Θέματα (User Selectable)
- **Flag:** `seasonalThemes`

### 🌸 Εποχιακές Διακοσμήσεις (Animations)
- **Τι κάνει:** Πέφτουν λουλούδια/χιόνι κλπ. στο background.
- **Flag:** `seasonalDecorations` (default: **OFF** — απενεργοποιήθηκε με user request).

### Built-in WCAG AA features (πάντα ενεργά, no flags)
- High-contrast focus rings (dark mode)
- 44px min touch targets για mobile
- `prefers-reduced-motion` support
- Forced-colors (Windows high contrast) support
- Skip-to-content link
- Semantic HTML + ARIA labels

---

## 16. PWA & Offline

### 📲 PWA Install
- **Τι κάνει:** "Add to Home Screen" prompt για iOS/Android/Desktop.
- **Flag:** `pwaInstall`

### 🔔 Browser Notifications
- **Flag:** `pushNotifs`

### 🌐 Offline Mode (Service Worker)
- **Τι κάνει:** Βασικά παιχνίδια λειτουργούν χωρίς internet.
- **Flag:** `offlineMode`

---

## 17. Νομικά & Συμμόρφωση

### 📜 Privacy Policy — `/privacy`
GDPR + COPPA compliant. Source: `src/pages/PrivacyPage.jsx`.

### 📋 Terms of Service — `/terms`
16 sections (production-grade). Source: `src/pages/TermsPage.jsx`.

### 🍪 Cookie Policy — `/cookies`
Detailed cookie inventory. Source: `src/pages/CookiesPage.jsx`.

### 🤝 Data Processing Agreement — `/dpa`
Summary για B2B customers. Source: `src/pages/DPAPage.jsx`.

### 🟢 Status Page — `/status`
Real-time health checks (Auth, Firestore, Functions).

> Όλα τα νομικά κείμενα διαχειρίζονται μέσω `src/config/legalInfo.js`.
> Έχουν `TBD` placeholders για τα στοιχεία της εταιρείας — **πρέπει να συμπληρωθούν πριν το go-live**.

---

## 🔧 Σχετικά Documents

| Αρχείο | Περιεχόμενο |
|---|---|
| [`ADMIN_GUIDE.md`](./ADMIN_GUIDE.md) | Πλήρης οδηγός Admin Dashboard |
| [`USER_GUIDE.md`](./USER_GUIDE.md) | Οδηγός για μαθητές/γονείς/δασκάλους |
| [`OPS.md`](./OPS.md) | Operations: Sentry, App Check, Backups, Uptime |
| [`STRIPE_LIVE.md`](./STRIPE_LIVE.md) | Stripe go-live checklist |
| [`STRIPE_SETUP.md`](./STRIPE_SETUP.md) | Initial Stripe setup |
| [`DEPLOY.md`](./DEPLOY.md) | Deployment instructions |
| [`DEPLOY_FIRESTORE.md`](./DEPLOY_FIRESTORE.md) | Firestore rules deployment |
| [`DOMAIN_SETUP.md`](./DOMAIN_SETUP.md) | Custom domain configuration |
| [`CAPACITOR_SETUP.md`](./CAPACITOR_SETUP.md) | Native iOS/Android wrapping |

---

**Τελευταία ενημέρωση:** Μάιος 2026
**Συνολικά features:** 130+ flags · 59 classic games · 100+ quizzes · 6 ηλικιακές ομάδες
