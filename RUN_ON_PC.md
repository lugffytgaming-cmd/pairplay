# PairPlay — run it on your PC

## Instant visual preview (no Flutter needed)
1. Unzip the PairPlay package.
2. Open `preview/index.html` in Chrome/Edge.
3. Click Home, Discover, Games, Couple Room and Profile to preview the flow.
4. Try the mini-games and send messages in the demo chat.

## Run the Flutter app locally
Install Flutter SDK + Android Studio (for Android) or Chrome (for web).

From the PairPlay folder:

```bash
flutter doctor
flutter pub get
flutter run -d chrome
```

Android emulator/device:

```bash
flutter devices
flutter run
```

Release Android App Bundle:

```bash
flutter build appbundle --release
```

The current UI prototype does not require Firebase initialization to preview. Firebase authentication, Firestore chat, matching backend, FCM notifications, moderation, billing, and production configuration are the next implementation layer.
