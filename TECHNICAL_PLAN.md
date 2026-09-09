# PairPlay Technical Plan

## Data model

### users/{uid}
- displayName
- photoUrl
- selectedGender: male | female
- birthDate (store minimal/appropriate form)
- adultEligible: boolean
- interests: string[]
- languages: string[]
- relationshipIntent
- activeMatchId: string|null
- createdAt
- lastActiveAt

### matches/{matchId}
- memberIds: [uidA, uidB]
- status: pending | active | ended | blocked
- compatibilityScore
- gameSignals
- createdAt
- endedAt

### matches/{matchId}/messages/{messageId}
- senderId
- type: text | image | system
- text / mediaUrl
- createdAt
- moderationStatus

### reports/{reportId}
- reporterId
- targetUserId
- targetMessageId (optional)
- reason
- notes
- createdAt
- status

### blocks/{blockId}
- blockerId
- blockedUserId
- createdAt

## Match score
Hard eligibility checks happen first. Then:
- game agreement 45%
- interests 20%
- age preference overlap 10%
- language overlap 10%
- relationship intention 10%
- location preference 5%

A production system should avoid revealing exact sensitive scoring inputs and should explain the result as an approximate compatibility signal rather than a promise.

## Client rule
The Flutter client is a presentation layer. It can request match candidates and submit game answers, but authoritative eligibility and match creation must happen on a trusted backend.
