# PairPlay v0.4

- UI foundation refreshed toward a cleaner, card-based premium style.
- Supported languages: Bangla, English, Hindi.
- Question bank uses stable IDs and client preview history to avoid immediate repeats.
- Production rule: store `askedQuestionIds`/question history server-side; do not depend on AI for deduplication.
- AI can be added later for personalization, question generation, safety triage and match explanations, but deterministic backend rules remain authoritative.
