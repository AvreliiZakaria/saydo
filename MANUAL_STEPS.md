# Manual steps

## Run

1. `cd C:\Users\toolh\Desktop\saydo-sdk54`
2. `git pull`
3. Confirm `.env` has the Supabase URL and publishable key.
4. `npm install` (required this time: Jest was added)
5. `npx expo install --fix`
6. `npm run typecheck`
7. `npm test`
8. `npm run doctor`
9. `npx expo start --clear`
10. Scan the QR code in Expo Go on the iPhone.

Clean reinstall on Windows if anything looks stale:

```
rmdir /s /q node_modules
del package-lock.json
npm install
```

## What is implemented

Auth, logout, account deletion, local persistence, Supabase remote sync, offline fallback,
deadline-to-missed resolution, RLS schema, private proof bucket, photo upload service,
multi-step locking flow, score/history, profile surface, and keyboard-safe input.

## Verify remote sync (this has never actually succeeded)

Promise ids used to be `Date.now()-random`, which Postgres rejected against the `uuid`
primary key. Every upsert failed into an empty `catch`, so `saydo_commitments` stayed empty.
Ids are UUIDs now, and sync failures are logged instead of swallowed.

To confirm the fix on device:

1. Sign up and confirm the email.
2. Lock one promise.
3. Watch the Metro logs for `[saydo] could not sync promise` (there should be none).
4. Check that `saydo_commitments` has a row for your user.
5. Delete the app data or sign in on a second device and confirm the promise comes back.

Existing local promises with legacy ids are re-keyed automatically on first load, so they
will appear in Supabase as new rows.

## Still unverified from this environment

Runtime build, Expo Doctor, auth, remote sync, photo upload, notification permission, and
physical iPhone testing. Notifications likely need an EAS development build rather than Expo Go.

Never place a Supabase secret/service key in `.env`; use only the publishable key.
