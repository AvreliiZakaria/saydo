# SAY/DO

SAY/DO turns an intention into a time-bound promise: say it, lock it, do it, or let the result count.

## MVP implemented

- Expo SDK 54 / React Native 0.81
- Supabase email auth with stale-session recovery
- Logout and irreversible account deletion
- Local-first storage with Supabase remote sync and offline fallback
- Automatic missed-deadline resolution
- RLS-protected commitments, witness requests, and private proof storage
- Multi-step promise creation: action, deadline, proof, visibility, lock review
- Today, Score, People, and Profile surfaces
- Keyboard-safe forms on iPhone
- Photo upload service and Expo local reminder service

## Run locally

```bash
npm install
npx expo install --fix
npm run doctor
npx expo start --clear
```

The app expects `.env` with `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Never put a secret or service-role key in the mobile app.
