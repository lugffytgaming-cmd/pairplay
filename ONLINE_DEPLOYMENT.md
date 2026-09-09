# PairPlay 0.5 — Online Rooms

This build removes the same-Wi-Fi/IP requirement for testing. It uses a Node.js server + WebSocket signaling so two people can connect from different networks.

## Features
- Custom private room capped at 2 people.
- Generated invite link: `https://YOUR-DOMAIN/?room=ABC123`
- Online random queue: Male is paired only with Female and vice versa.
- No group rooms.
- Real-time 1-to-1 chat.
- Works on desktop and mobile browsers.
- English / বাংলা / हिन्दी selector.

## Run locally
```bash
npm install
npm start
```
Open `http://localhost:8080`.

To test two users locally, use two browser windows on the same PC. For two different networks, deploy this project to a public Node.js host.

## Deploy to Render
1. Create a new **Web Service** from this folder/repository.
2. Build command: `npm install`
3. Start command: `npm start`
4. Environment: Node 20+.
5. Render gives you a public HTTPS URL. Share that URL (or a generated `/ ?room=CODE` invite) with your friend.

## Production note
This is a testable online prototype. The in-memory room/queue state resets when the server restarts. A production release should add persistent user/profile storage, authenticated sessions, moderation/report storage, abuse prevention, rate limiting, Redis or a managed realtime backend, and proper Google Sign-In / age controls.
