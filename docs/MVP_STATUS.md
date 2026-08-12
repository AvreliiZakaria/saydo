# SAY/DO MVP status

## Working

- Expo SDK 54 / React Native 0.81
- Email sign-up, sign-in, stale-session recovery, logout, account deletion
- Local persistence and offline fallback
- Supabase commitment schema, RLS, private proof bucket
- Remote commitment read/write adapter
- Automatic expired active promises become missed in the client
- Today, Score, People, Profile surfaces
- Multi-step promise creation with deadline, proof, and visibility choices
- Keyboard-safe forms

## MVP boundaries still requiring device/provider verification

- Push reminders need `expo-notifications`, physical-device permission testing, and an EAS development build. Expo Go is not enough for every notification workflow.
- Photo capture UI needs `expo-image-picker` and private upload testing on a real device.
- Witness discovery needs a user directory and abuse/privacy rules before enabling search.
- Conflict resolution needs multi-device test coverage.
- App Store / Play Store builds need EAS credentials and store metadata.

The app is functional as a local-first accountability MVP, but these provider-dependent items are not fabricated as complete.
