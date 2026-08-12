import { Commitment } from './commitment';
import { resolveExpiredCommitments } from './deadlines';

const base: Commitment = {
  id: '00000000-0000-4000-8000-000000000001',
  title: 'test',
  deadline: '2026-08-12T10:00:00.000Z',
  proof: 'self',
  visibility: 'private',
  status: 'active',
  createdAt: '2026-08-12T08:00:00.000Z',
};

describe('resolveExpiredCommitments', () => {
  it('marks an expired active promise as missed', () => {
    const [result] = resolveExpiredCommitments([base], new Date('2026-08-12T11:00:00.000Z'));
    expect(result.status).toBe('missed');
    expect(result.result).toBe('missed');
  });

  it('leaves a promise alone before its deadline', () => {
    const [result] = resolveExpiredCommitments([base], new Date('2026-08-12T09:00:00.000Z'));
    expect(result.status).toBe('active');
    expect(result.result).toBeUndefined();
  });

  it('never resurrects an already resolved promise', () => {
    const done: Commitment = { ...base, status: 'completed', result: 'success' };
    const [result] = resolveExpiredCommitments([done], new Date('2026-08-12T11:00:00.000Z'));
    expect(result.status).toBe('completed');
  });

  it('returns the same reference when nothing changed', () => {
    const items = [base];
    expect(resolveExpiredCommitments(items, new Date('2026-08-12T09:00:00.000Z'))).toBe(items);
  });
});
