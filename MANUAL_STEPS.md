# Manual steps

## Run

1. `git pull`
2. Confirm `.env` has the Supabase URL and publishable key.
3. Delete `node_modules` and `package-lock.json` once after dependency changes.
4. `npm install`
5. `npx expo install --fix`
6. `npm run doctor`
7. `npx expo start --clear`
8. Scan the QR code in Expo Go on the iPhone.

## What is implemented

Auth, logout, account deletion, local persistence, Supabase remote sync, offline fallback, deadline-to-missed resolution, RLS schema, private proof bucket, photo upload service, multi-step locking flow, score/history, profile surface, and keyboard-safe input.

## Important device verification

Runtime build, Expo doctor, auth, remote sync, photo upload, notification permission, and physical iPhone testing were not executable from this environment. Test them on a real device. Notifications may require an EAS development build rather than Expo Go.

Never place a Supabase secret/service key in `.env`; use only the publishable key.
