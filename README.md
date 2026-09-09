# Firebase setup

1. Create a Firebase project.
2. Enable Authentication -> Google provider.
3. Create a Firestore database.
4. Add Android app(s) in the Firebase console.
5. Install FlutterFire CLI and run `flutterfire configure` from the app root.
6. Deploy Firestore rules from `firestore.rules` after reviewing them for your final schema.
7. Add Cloud Functions for authoritative matchmaking, abuse checks and notifications.

The client must never decide whether a user is eligible for a match. The server should enforce:
- adult eligibility / age-restricted access
- opposite selected gender matching rule
- one active partner at a time
- block/unmatch exclusions
- rate limits / anti-spam
- report escalation
