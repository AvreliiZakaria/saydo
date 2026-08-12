import {
  abandonCommitment,
  archiveCommitment,
  calculateScore,
  canTransition,
  Commitment,
  completeCommitment,
  createDraft,
  lockCommitment,
} from './commitment';
import { isUuid } from './ids';

function draft(): Commitment {
  return createDraft({ title: '  Пробежать 5 км  ', deadline: '2026-08-12T17:00:00.000Z', proof: 'self', visibility: 'private' });
}

describe('createDraft', () => {
  it('produces a uuid Supabase will accept', () => {
    expect(isUuid(draft().id)).toBe(true);
  });

  it('trims the title', () => {
    expect(draft().title).toBe('Пробежать 5 км');
  });
});

describe('state machine', () => {
  it('allows only the documented transitions', () => {
    expect(canTransition('draft', 'active')).toBe(true);
    expect(canTransition('active', 'completed')).toBe(true);
    expect(canTransition('completed', 'active')).toBe(false);
    expect(canTransition('missed', 'completed')).toBe(false);
    expect(canTransition('archived', 'active')).toBe(false);
  });

  it('refuses to complete a promise that was never locked', () => {
    expect(() => completeCommitment(draft())).toThrow();
  });

  it('records a result when resolved', () => {
    expect(completeCommitment(lockCommitment(draft())).result).toBe('success');
    expect(abandonCommitment(lockCommitment(draft())).result).toBe('abandoned');
  });
});

describe('calculateScore', () => {
  function resolvedSet(successes: number, failures: number): Commitment[] {
    const items: Commitment[] = [];
    for (let index = 0; index < successes; index += 1) items.push(completeCommitment(lockCommitment(draft())));
    for (let index = 0; index < failures; index += 1) items.push(abandonCommitment(lockCommitment(draft())));
    return items;
  }

  it('starts a new user at 50', () => {
    expect(calculateScore([])).toBe(50);
  });

  it('matches the documented examples', () => {
    expect(calculateScore(resolvedSet(1, 0))).toBe(67);
    expect(calculateScore(resolvedSet(5, 0))).toBe(86);
    expect(calculateScore(resolvedSet(8, 2))).toBe(75);
    expect(calculateScore(resolvedSet(18, 2))).toBe(86);
  });

  it('ignores drafts and active promises', () => {
    expect(calculateScore([draft(), lockCommitment(draft())])).toBe(50);
  });

  it('does not change when a resolved promise is archived', () => {
    const items = resolvedSet(3, 1);
    const before = calculateScore(items);
    const archived = items.map((item) => archiveCommitment(item));
    expect(calculateScore(archived)).toBe(before);
  });
});
