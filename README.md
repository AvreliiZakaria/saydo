# SAY/DO

SAY/DO turns an intention into a time-bound promise: say it, lock it, do it, or let the result count.

## Current foundation

- Expo SDK 54, React Native 0.81
- Keyboard-safe promise creation on iPhone
- Local promise persistence with AsyncStorage
- Supabase Auth email sign-in and registration
- Stale-session recovery when an account was deleted externally
- Logout and irreversible account deletion controls in the authenticated shell
- Secure delete-account Edge Function
- Supabase schema with Row Level Security and private proof storage
- Today, Score, People, and Profile flows

## Run locally

```bash
npm install
npx expo install --fix
npx expo start --clear
```

The app expects `.env` with `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Never place a secret or service-role key in the mobile app.
