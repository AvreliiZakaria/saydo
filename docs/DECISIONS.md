# Decisions

## 2026-08-12: Local-first foundation

The app stores promises locally with AsyncStorage before authentication and remote sync exist. This keeps the core promise loop usable without secrets or a backend account.

## 2026-08-12: Backend boundary

A `SayDoBackend` interface exists now. The mobile bundle must never contain service-role keys or private AI keys. A Supabase implementation will be added only after project URL, anon key, schema, row-level security, and authentication flows are configured.

## 2026-08-12: Keyboard behavior

Promise creation stays inline, but the form is wrapped in `KeyboardAvoidingView` and a keyboard-aware scroll layout so the focused field and action buttons remain visible on iPhone.
