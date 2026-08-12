# Manual steps

## Run

1. `cd C:\\Users\\toolh\\Desktop\\saydo-sdk54`
2. `git pull`
3. Confirm `.env` has the Supabase URL and publishable key.
4. `npm install`
5. `npx expo install --fix`
6. `npm run typecheck`
7. `npm test`
8. `npm run doctor`
9. `npx expo start --clear`
10. Scan the QR code in Expo Go on the iPhone.

## Verified on 2026-08-12

- Supabase auth: one account exists, email confirmed, last sign-in succeeded.
- Remote sync: the first promise reached `saydo_commitments` as a UUID row.
- Local promise reminders now have a real Expo notification service and app permissions configured.

## Still unverified on a physical device

Photo proof is not yet end-to-end: the current UI lets a promise marked `Фото` complete through the self-confirmation dialog without opening the picker or inserting `saydo_proofs`. This is the next implementation task, not a completed feature.

Notifications may require an EAS development build rather than Expo Go. The app must request permission before scheduling reminders.

Never place a Supabase secret/service key in `.env`; use only the publishable key.
