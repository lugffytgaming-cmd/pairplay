# PairPlay — Product Specification v1

## Positioning
Play first. Match naturally. Talk privately.

## Core loop
1. Sign in with Google.
2. Confirm adult eligibility.
3. Build profile and preferences.
4. Enter Find Your Match.
5. Complete short compatibility games.
6. Both users opt in to connect.
7. Mutual match creates one private Couple Room.
8. Chat, send media, and play couple games.
9. Unmatch or block at any time.

## Screens
Splash → Google Sign-In → Adult Gate → Profile → Preferences → Home → Find Match → Game Lobby → Game Session → Match Result → Couple Room → Chat / Games / Daily Question → Profile & Safety.

## Games
- This or That
- Quick Choice
- Emoji Guess
- 2 Truths 1 Lie
- Who Knows Me Better?
- Daily Question

## Matching score
Weighted inputs:
- game agreement: 45%
- interests: 20%
- age preference overlap: 10%
- language overlap: 10%
- relationship intention: 10%
- location preference: 5%

Hard filters are evaluated first. If a hard filter fails, no match is shown.

## Safety
- 18+ only.
- Clear Terms and Community Guidelines acceptance before user-generated content.
- In-app report user.
- In-app report content.
- In-app block user.
- Unmatch and chat removal controls.
- Abuse/CSAM escalation process and safety contact.
- Server-side authorization for every chat write/read path.
- Rate limits and anti-spam.

## Privacy defaults
- Private profile discovery only to eligible opposite-gender candidates.
- No searchable public directory.
- No group chat.
- No anonymous chat mode.
- Minimize collected profile data.
- Delete-account workflow from inside the app.

## Monetization v1
Free: daily matching quota, core games, 1 active couple.
Premium: additional discovery opportunities, extra couple themes/games, advanced compatibility insights, ad-free experience where policy-compliant.

Digital subscriptions/features should use Google Play Billing on Play-distributed Android builds.
