# Decisions

## 2026-08-12: Local-first foundation

The app stores promises locally with AsyncStorage before authentication and remote sync exist. This keeps the core promise loop usable without secrets or a backend account.

## 2026-08-12: Supabase backend

Supabase project `rfsailrgxqpaokmdgpjm` now contains `saydo_commitments`, `saydo_witness_requests`, and `saydo_proofs`. Row Level Security restricts commitment and proof rows to their owner; witness requests are restricted to requester and witness. The app uses only the publishable key, never a service key.

## 2026-08-12: Keyboard behavior

Promise creation uses `KeyboardAvoidingView`, keyboard-aware scrolling, and a focused input ref so the field and action buttons remain visible on iPhone.

## 2026-08-12: Sync boundary

`SupabaseBackend` is implemented but authentication is intentionally not faked. Until a user signs in, local storage remains the source of truth. Auth and conflict-safe sync are the next phase.
