# Render deploy fix

The previous deploy failed because Express 5 no longer accepts the unnamed `*` wildcard route. The server now uses a final `app.use(...)` SPA fallback instead, which avoids the path-to-regexp error.

Push this version to GitHub and Render will automatically redeploy.
