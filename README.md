# SAY/DO

SAY/DO turns an intention into a time-bound promise: say it, lock it, do it, or let the result count.

## Current foundation

- Expo SDK 54, React Native 0.81
- Keyboard-safe promise creation on iPhone
- Local persistence with AsyncStorage
- Supabase schema with Row Level Security
- Supabase client and commitment backend adapter
- Today, Score, People, and Profile flows

## Run locally

```bash
cp .env.example .env
npm install
npx expo install --fix
npx expo start --clear
```

On Windows, copy `.env.example` to `.env` manually, then replace the publishable key placeholder. Auth, witness verification, photo uploads, notifications, and conflict-safe sync are the next implementation phase.
