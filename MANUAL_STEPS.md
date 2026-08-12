# Manual steps

## Install and run

1. Use Node.js 20.19 or newer.
2. Pull the latest repository changes.
3. Copy `.env.example` to `.env` and paste the Supabase publishable key.
4. Delete `node_modules` and `package-lock.json` once after dependency changes.
5. Run `npm install`.
6. Run `npx expo install --fix`.
7. Run `npm run doctor`.
8. Run `npx expo start --clear`.
9. Open the QR code in the current Expo Go on the physical iPhone.

## Current backend status

- Supabase Auth email sign-in/sign-up gate: committed and wired as the app entry.
- Commitment schema and RLS: executed in project `rfsailrgxqpaokmdgpjm`.
- Private proof bucket and storage policies: executed.
- Deadline resolution service: committed, UI wiring pending.
- Photo upload service: committed, camera/picker UI pending.
- Remote commitment sync: adapter exists, UI wiring pending.
- Push notifications: not implemented yet.
- Witness requests: schema exists, UI and invite/search flow pending.

## Verification

Runtime build, npm install, Expo doctor, auth flow, and physical iPhone testing are NOT EXECUTED in this environment.

Never put a Supabase secret/service key in the app. Only the project URL and publishable key belong in `.env`.
