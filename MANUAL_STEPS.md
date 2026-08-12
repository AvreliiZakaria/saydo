# Manual steps

## Install and run

1. Use Node.js 20.19 or newer.
2. Pull the latest repository changes.
3. Copy `.env.example` to `.env`.
4. Put the Supabase publishable key from the project Connect dialog into `.env`.
5. Delete `node_modules` and `package-lock.json` once after dependency changes.
6. Run `npm install`.
7. Run `npx expo install --fix`.
8. Run `npm run doctor`.
9. Run `npx expo start --clear`.
10. Open the QR code in the current Expo Go on the physical iPhone.

## Supabase status

- Project connected: `rfsailrgxqpaokmdgpjm`.
- Backend tables created: `saydo_commitments`, `saydo_witness_requests`, `saydo_proofs`.
- RLS policies created for owner and witness access.
- Publishable client configuration added.
- Auth flow: NOT IMPLEMENTED yet.
- Remote sync: backend adapter committed, app still uses local-first mode until auth exists.

## Verification status

- Supabase schema execution: EXECUTED.
- Runtime build: NOT EXECUTED in this environment.
- `npm install`: NOT EXECUTED in this environment.
- `expo install --fix`: NOT EXECUTED in this environment.
- Expo doctor: NOT EXECUTED in this environment.
- Physical iPhone / Expo Go: NOT EXECUTED in this environment.

## Safety

Never place a Supabase secret/service key in the app. The mobile bundle may contain only the project URL and publishable key. Do not run `npm audit fix --force` during this migration.
