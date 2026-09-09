# PairPlay — direct mobile link

The current demo is a Node.js + WebSocket web app. To let a friend use it from another city/device, deploy this folder as a public **Web Service** (not a static site). Render Web Services support inbound WebSocket connections and provide a public `onrender.com` URL.

## Deploy
1. Push this `pairplay_app` folder to GitHub.
2. In Render: **New → Web Service**.
3. Select the GitHub repository.
4. Build command: `npm install`
5. Start command: `node server.js`
6. Deploy.
7. Share the resulting `https://<name>.onrender.com` URL with your friend.

For a Custom Room, create a room and share the generated `...?room=ABC123` invite URL. Your friend can open it directly on a phone; the devices do not need to be on the same Wi-Fi.

The web demo also includes a PWA manifest, so on supported mobile browsers the user can use the browser's **Add to Home Screen / Install** action after opening the public URL.

## Important
The current demo keeps room state in process memory. A production launch should add persistent storage/authentication, abuse protection, moderation, and proper room/session recovery before public release.
