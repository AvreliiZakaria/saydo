import { Commitment } from '../domain/commitment';
import { supabase } from './supabase';

export interface SayDoBackend {
  getCommitments(userId: string): Promise<Commitment[]>;
  saveCommitment(userId: string, commitment: Commitment): Promise<void>;
  deleteAccount(userId: string): Promise<void>;
}

function toRow(userId: string, commitment: Commitment) {
  return {
    id: commitment.id,
    owner_id: userId,
    title: commitment.title,
    deadline: commitment.deadline,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    proof_type: commitment.proof,
    visibility: commitment.visibility,
    status: commitment.status,
    locked_at: commitment.lockedAt ?? null,
    completed_at: commitment.completedAt ?? null,
    result: commitment.status === 'completed' ? 'success' : commitment.status === 'missed' ? 'missed' : commitment.status === 'abandoned' ? 'abandoned' : null,
  };
}

function fromRow(row: Record<string, unknown>): Commitment {
  return {
    id: String(row.id),
    title: String(row.title),
    deadline: String(row.deadline),
    proof: row.proof_type as Commitment['proof'],
    visibility: row.visibility as Commitment['visibility'],
    status: row.status as Commitment['status'],
    createdAt: String(row.created_at),
    lockedAt: row.locked_at ? String(row.locked_at) : undefined,
    completedAt: row.completed_at ? String(row.completed_at) : undefined,
  };
}

export class SupabaseBackend implements SayDoBackend {
  async getCommitments(userId: string): Promise<Commitment[]> {
    if (!supabase) return [];
    const { data, error } = await supabase.from('saydo_commitments').select('*').eq('owner_id', userId).neq('status', 'archived').order('deadline', { ascending: true });
    if (error) throw error;
    return (data ?? []).map((row) => fromRow(row as Record<string, unknown>));
  }

  async saveCommitment(userId: string, commitment: Commitment): Promise<void> {
    if (!supabase) return;
    const { error } = await supabase.from('saydo_commitments').upsert(toRow(userId, commitment));
    if (error) throw error;
  }

  async deleteAccount(userId: string): Promise<void> {
    if (!supabase) return;
    const { error } = await supabase.from('saydo_commitments').delete().eq('owner_id', userId);
    if (error) throw error;
  }
}

export const backend = new SupabaseBackend();
