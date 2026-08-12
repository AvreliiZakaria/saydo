import { Commitment, CommitmentResult, CommitmentStatus } from './commitment';

/**
 * Flips active promises whose deadline has passed to `missed`.
 * Returns the original array reference when nothing changed so React can bail out of a re-render.
 */
export function resolveExpiredCommitments(items: Commitment[], now = new Date()): Commitment[] {
  let changed = false;
  const next = items.map((item) => {
    if (item.status !== 'active' || new Date(item.deadline).getTime() > now.getTime()) return item;
    changed = true;
    return { ...item, status: 'missed' as CommitmentStatus, result: 'missed' as CommitmentResult };
  });
  return changed ? next : items;
}
