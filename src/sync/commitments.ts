import AsyncStorage from '@react-native-async-storage/async-storage';
import { Commitment } from '../domain/commitment';
import { resolveExpiredCommitments } from '../domain/deadlines';
import { backend } from '../backend/contracts';
import { supabase } from '../backend/supabase';

const KEY = '@saydo/commitments/v1';

export async function loadForUser(userId: string): Promise<Commitment[]> {
  const local = await loadLocal();
  if (!supabase) return resolveExpiredCommitments(local);
  try {
    const remote = await backend.getCommitments(userId);
    if (remote.length > 0) {
      const resolved = resolveExpiredCommitments(remote);
      await saveLocal(resolved);
      return resolved;
    }
  } catch {
    // Offline mode keeps the local copy usable.
  }
  return resolveExpiredCommitments(local);
}

export async function saveForUser(userId: string, items: Commitment[]): Promise<void> {
  await saveLocal(items);
  if (!supabase) return;
  for (const item of items) {
    try { await backend.saveCommitment(userId, item); } catch { /* retry on next app start */ }
  }
}

export async function loadLocal(): Promise<Commitment[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try { const parsed: unknown = JSON.parse(raw); return Array.isArray(parsed) ? parsed as Commitment[] : []; } catch { return []; }
}

export async function saveLocal(items: Commitment[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(items));
}

export async function clearLocal(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}
