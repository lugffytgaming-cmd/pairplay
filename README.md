# PairPlay

PairPlay is a 1-to-1 couple discovery prototype: public discovery, compatibility scoring, mutual connection, private two-person rooms, games and safety rules.

## Run the online demo locally
1. Install Node.js 18+
2. `npm install`
3. `node server.js`
4. Open `http://localhost:8080`

For public testing, deploy this Node.js server to a public host with WebSocket support. The generated invite link can then be shared from anywhere.

## Production next steps
Firebase/managed database persistence, Google Sign-In, robust age verification/Play Console Restrict Minor Access, server-side moderation, report/block persistence, privacy policy, account deletion, rate limiting, anti-abuse, and secure billing are still required before Play Store release.
