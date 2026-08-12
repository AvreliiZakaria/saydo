export type CommitmentStatus = 'draft' | 'active' | 'completed' | 'missed' | 'abandoned';
export type ProofType = 'self' | 'photo' | 'witness';
export type Visibility = 'private' | 'link' | 'friends';

export type Commitment = {
  id: string;
  title: string;
  deadline: string;
  proof: ProofType;
  visibility: Visibility;
  status: CommitmentStatus;
  createdAt: string;
  lockedAt?: string;
  completedAt?: string;
};

const transitions: Record<CommitmentStatus, CommitmentStatus[]> = {
  draft: ['active'],
  active: ['completed', 'missed', 'abandoned'],
  completed: [],
  missed: [],
  abandoned: [],
};

export function canTransition(from: CommitmentStatus, to: CommitmentStatus): boolean {
  return transitions[from].includes(to);
}

export function lockCommitment(commitment: Commitment, now = new Date().toISOString()): Commitment {
  if (!canTransition(commitment.status, 'active')) throw new Error('Only drafts can be locked');
  return { ...commitment, status: 'active', lockedAt: now };
}

export function completeCommitment(commitment: Commitment, now = new Date().toISOString()): Commitment {
  if (!canTransition(commitment.status, 'completed')) throw new Error('Only active promises can be completed');
  return { ...commitment, status: 'completed', completedAt: now };
}

export function calculateScore(commitments: Commitment[]): number {
  const resolved = commitments.filter((item) => ['completed', 'missed', 'abandoned'].includes(item.status));
  const successful = resolved.filter((item) => item.status === 'completed').length;
  return Math.round((100 * (successful + 1)) / (resolved.length + 2));
}
