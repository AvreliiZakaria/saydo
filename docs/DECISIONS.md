# Decisions

## Promise ids are UUID v4, generated on the client

`saydo_commitments.id` is a Postgres `uuid`. Client-generated ids let the app create promises
offline and upsert them later without a round trip. `src/domain/ids.ts` uses the platform
CSPRNG when Hermes exposes one and falls back to `Math.random`; these ids are database keys,
not secrets, so the fallback is acceptable and avoids a native dependency.

## Outcome lives in `result`, not in `status`

The spec requires archiving to never change the score. If the score were derived from `status`,
archiving a completed promise would erase the success. `result` (`success` / `missed` /
`abandoned`) is written once when a promise resolves and is never cleared, so `status` stays
free to move to `archived` for presentation. This mirrors the existing `result` column in
Postgres.

## Sync is last-write-wins, per promise

`saveForUser` pushes only promises whose serialized form changed since the last successful
upload. There is no conflict resolution: editing the same promise on two devices means the
last write wins. Acceptable for a single-device MVP, revisit before multi-device launch.

## Deadlines are re-checked on a 30s timer

Previously expiry was only evaluated when the promise list happened to change, so an open app
could show an active promise hours past its deadline. `resolveExpiredCommitments` returns the
original array reference when nothing changed, so the timer does not cause re-renders.

## Tests cover the domain only

`jest-expo` is wired up, but tests are limited to pure domain logic (state machine, score,
deadline resolution). Component and integration tests need `@testing-library/react-native`
and are not set up yet.
