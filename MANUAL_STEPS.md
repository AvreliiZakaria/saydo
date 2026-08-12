# Manual steps

## Install and run

1. Use Node.js 20.19 or newer.
2. Pull the latest repository changes.
3. Confirm `.env` contains the Supabase URL and publishable key.
4. Delete `node_modules` and `package-lock.json` once after dependency changes.
5. Run `npm install`.
6. Run `npx expo install --fix`.
7. Run `npm run doctor`.
8. Run `npx expo start --clear`.
9. Open the QR code in the current Expo Go on the physical iPhone.

## Account lifecycle

- On startup the app validates the cached Supabase session with `auth.getUser()`.
- If the account was deleted in Supabase, the cached session and local commitments are cleared.
- Authenticated users can sign out from the top account bar.
- Authenticated users can permanently delete the account from the top account bar. The `delete-account` Edge Function performs the privileged deletion server-side.
- Local commitments are cleared on logout so a second user on the same phone cannot see the previous user's data.

## Verification

Supabase schema and `delete-account` Edge Function: EXECUTED.
Runtime build, npm install, Expo doctor, auth flow, and physical iPhone testing: NOT EXECUTED in this environment.

Never put a Supabase secret/service key in the app. Only the project URL and publishable key belong in `.env`.
