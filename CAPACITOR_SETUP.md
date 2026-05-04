# Capacitor Mobile App Setup

Capacitor wraps the existing React app in a native iOS/Android shell, giving you:
- App Store / Play Store distribution
- Native splash, status bar, haptics, share sheet
- Push notifications via FCM
- 100% code reuse with the web app

## One-time setup

### 1. Build the web app

```bash
npm run build
```

### 2. Add native platforms

```bash
# Android
npx cap add android

# iOS (requires macOS + Xcode)
npx cap add ios
```

### 3. Sync web code into native projects

After every `npm run build`:

```bash
npx cap sync
```

## Daily workflow

```bash
# Make changes → build → sync → open native IDE
npm run build && npx cap sync

# Open Android Studio
npx cap open android

# Open Xcode
npx cap open ios
```

## App Store / Play Store

### Android (Google Play)

1. Open `android/` in Android Studio
2. Build → Generate Signed Bundle / APK → Android App Bundle (.aab)
3. Upload to https://play.google.com/console (€25 one-time fee)
4. Fill out store listing, age rating, content rating
5. Submit for review (typically 2-7 days first time)

### iOS (App Store)

1. Open `ios/App/App.xcworkspace` in Xcode (NOT .xcodeproj)
2. Select team → Product → Archive
3. Distribute → App Store Connect
4. Configure in https://appstoreconnect.apple.com ($99/year for Apple Developer Program)
5. Submit for review (typically 1-3 days)

## Configuration changes

If you change `capacitor.config.json`, run:

```bash
npx cap sync
```

## Live reload (development)

Edit `capacitor.config.json` to point at your local dev server:

```json
{
  "server": {
    "url": "http://192.168.1.100:5173",
    "cleartext": true
  }
}
```

Then:

```bash
npm run dev   # in one terminal
npx cap run android --livereload  # in another
```

## Native plugins to consider adding later

- `@capacitor/push-notifications` — already supported via FCM
- `@capacitor/local-notifications` — for local reminders
- `@capacitor/camera` — for kid avatar capture
- `@capacitor/in-app-review` — prompt for App Store rating
- `@capacitor-community/admob` — if you ever decide to monetize via ads (currently no ads policy)
- `revenuecat` — alternative to Stripe for in-app purchases (required by App Store for digital subs)

## App Store guidelines reminders

- **Apple requires in-app purchase (IAP) for digital subscriptions.** Stripe Checkout works fine in-app on Android, but iOS will reject your app unless you use IAP. Consider:
  - Hide subscription UI on iOS, redirect to web
  - Use RevenueCat to handle IAP
  - Apple takes 30% in year 1, 15% after
- **Kids category**: extra scrutiny — must comply with COPPA, no third-party trackers, parental gates for purchases.
- **Privacy nutrition labels**: required for both stores. Use Firebase Privacy Manifest.
