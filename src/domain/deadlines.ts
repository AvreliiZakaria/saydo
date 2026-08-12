import { Commitment, CommitmentStatus } from './commitment';

export function resolveExpiredCommitments(items: Commitment[], now = new Date()): Commitment[] {
  return items.map((item) => {
    if (item.status !== 'active' || new Date(item.deadline).getTime() > now.getTime()) return item;
    return { ...item, status: 'missed' as CommitmentStatus };
  });
}
