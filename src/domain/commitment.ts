import { createId } from './ids';

export type CommitmentStatus = 'draft' | 'active' | 'completed' | 'missed' | 'abandoned' | 'archived';
export type CommitmentResult = 'success' | 'missed' | 'abandoned';
export type ProofType = 'self' | 'photo' | 'witness';
export type Visibility = 'private' | 'link' | 'friends';

export type Commitment = {
  id: string;
  title: string;
  deadline: string;
  proof: ProofType;
  visibility: Visibility;
  status: CommitmentStatus;
  /** Set once when the promise resolves. Survives archiving so the score never rewrites itself. */
  result?: CommitmentResult;
  createdAt: string;
  lockedAt?: string;
  completedAt?: string;
};

const transitions: Record<CommitmentStatus, CommitmentStatus[]> = {
  draft: ['active'],
  active: ['completed', 'missed', 'abandoned'],
  completed: ['archived'],
  missed: ['archived'],
  abandoned: ['archived'],
  archived: [],
};

export function canTransition(from: CommitmentStatus, to: CommitmentStatus): boolean {
  return transitions[from].includes(to);
}

export function createDraft(
  input: { title: string; deadline: string; proof: ProofType; visibility: Visibility },
  now = new Date().toISOString(),
): Commitment {
  return {
    id: createId(),
    title: input.title.trim(),
    deadline: input.deadline,
    proof: input.proof,
    visibility: input.visibility,
    status: 'draft',
    createdAt: now,
  };
}

export function lockCommitment(commitment: Commitment, now = new Date().toISOString()): Commitment {
  if (!canTransition(commitment.status, 'active')) throw new Error('Only drafts can be locked');
  return { ...commitment, status: 'active', lockedAt: now };
}

export function completeCommitment(commitment: Commitment, now = new Date().toISOString()): Commitment {
  if (!canTransition(commitment.status, 'completed')) throw new Error('Only active promises can be completed');
  return { ...commitment, status: 'completed', result: 'success', completedAt: now };
}

export function abandonCommitment(commitment: Commitment): Commitment {
  if (!canTransition(commitment.status, 'abandoned')) throw new Error('Only active promises can be abandoned');
  return { ...commitment, status: 'abandoned', result: 'abandoned' };
}

/** Presentation only. Never touches `result`, so the score is unchanged. */
export function archiveCommitment(commitment: Commitment): Commitment {
  if (!canTransition(commitment.status, 'archived')) throw new Error('Only resolved promises can be archived');
  return { ...commitment, status: 'archived' };
}

/** Backfills `result` for promises stored before the field existed. */
export function withDerivedResult(commitment: Commitment): Commitment {
  if (commitment.result) return commitment;
  if (commitment.status === 'completed') return { ...commitment, result: 'success' };
  if (commitment.status === 'missed') return { ...commitment, result: 'missed' };
  if (commitment.status === 'abandoned') return { ...commitment, result: 'abandoned' };
  return commitment;
}

export function isResolved(commitment: Commitment): boolean {
  return commitment.result !== undefined;
}

export function calculateScore(commitments: Commitment[]): number {
  const resolved = commitments.filter(isResolved);
  const successful = resolved.filter((item) => item.result === 'success').length;
  return Math.round((100 * (successful + 1)) / (resolved.length + 2));
}
