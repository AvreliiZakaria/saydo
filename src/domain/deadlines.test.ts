import { resolveExpiredCommitments } from './deadlines';
import { Commitment } from './commitment';
const base: Commitment = { id: '1', title: 'test', deadline: '2026-08-12T10:00:00.000Z', proof: 'self', visibility: 'private', status: 'active', createdAt: '2026-08-12T08:00:00.000Z' };
export function deadlineResolutionSmokeTest() { const result = resolveExpiredCommitments([base], new Date('2026-08-12T11:00:00.000Z')); if (result[0].status !== 'missed') throw new Error('Expired promise was not marked missed'); }
