# PairPlay UI v0.8

## Back navigation
Every secondary screen in the web preview now has a visible Back button. Navigation keeps a small history stack, so users can move from Discover → Profile/Chat → back to the previous screen instead of being trapped in a section. Browser back is also handled for the demo.

For Flutter screens, use the provided `pairAppBar(context, title)` helper or a standard `AppBar(leading: BackButton())` on pushed routes.
