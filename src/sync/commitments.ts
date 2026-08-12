import AsyncStorage from '@react-native-async-storage/async-storage';
import { Commitment, withDerivedResult } from '../domain/commitment';
import { createId, isUuid } from '../domain/ids';
import { resolveExpiredCommitments } from '../domain/deadlines';
import { backend } from '../backend/contracts';
import { supabase } from '../backend/supabase';

const KEY = '@saydo/commitments/v1';

/** Fingerprint of what we last successfully pushed, so we stop re-uploading the whole list. */
const pushed = new Map<string, string>();

/**
 * Promises created before UUID ids shipped cannot be stored in Postgres, and promises
 * created before the `result` field existed would silently drop out of the score.
 */
function migrate(items: Commitment[]): Commitment[] {
  return items.map((item) => {
    const withResult = withDerivedResult(item);
    return isUuid(withResult.id) ? withResult : { ...withResult, id: createId() };
  });
}

export async function loadForUser(userId: string): Promise<Commitment[]> {
  const local = migrate(await loadLocal());
  if (!supabase) return resolveExpiredCommitments(local);
  try {
    const remote = await backend.getCommitments(userId);
    if (remote.length > 0) {
      const resolved = resolveExpiredCommitments(migrate(remote));
      await saveLocal(resolved);
      return resolved;
    }
  } catch (error) {
    console.warn('[saydo] remote load failed, using local copy', error);
  }
  return resolveExpiredCommitments(local);
}

export async function saveForUser(userId: string, items: Commitment[]): Promise<void> {
  await saveLocal(items);
  if (!supabase) return;
  for (const item of items) {
    const fingerprint = JSON.stringify(item);
    if (pushed.get(item.id) === fingerprint) continue;
    try {
      await backend.saveCommitment(userId, item);
      pushed.set(item.id, fingerprint);
    } catch (error) {
      pushed.delete(item.id);
      console.warn('[saydo] could not sync promise', item.id, error);
    }
  }
}

export async function loadLocal(): Promise<Commitment[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Commitment[]) : [];
  } catch {
    return [];
  }
}

export async function saveLocal(items: Commitment[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(items));
}

export async function clearLocal(): Promise<void> {
  pushed.clear();
  await AsyncStorage.removeItem(KEY);
}
