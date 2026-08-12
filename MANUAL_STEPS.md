# Manual steps

## Upgrade/install

1. Use Node.js 20.19 or newer.
2. Pull the latest repository changes.
3. Delete `node_modules` and `package-lock.json` once to remove the SDK 53 dependency tree.
4. Run `npm install`.
5. Run `npx expo install --fix` to let Expo verify and align package versions.
6. Run `npm run doctor` and fix any project-specific warnings it reports.
7. Run `npx expo start --clear`.
8. Open the QR code in the current Expo Go on the physical iPhone. Keep the phone and computer on the same network.

## Verification status

- Expo SDK 54 dependency migration: committed.
- Runtime build: NOT EXECUTED in this environment.
- `npm install`: NOT EXECUTED in this environment.
- `expo install --fix`: NOT EXECUTED in this environment.
- Expo doctor: NOT EXECUTED in this environment.
- Physical iPhone / current Expo Go: NOT EXECUTED in this environment.
- Native Android/iOS builds: NOT EXECUTED in this environment.

## Notes

- Do not run `npm audit fix --force` during this migration. It can introduce unrelated breaking changes.
- Expo Go can run the managed app on a physical iPhone without a local Xcode build. Xcode is only needed for a local native iOS build.
- The app functionality and architecture were not changed by this upgrade.
