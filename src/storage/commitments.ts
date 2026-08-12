import AsyncStorage from '@react-native-async-storage/async-storage';
import { Commitment } from '../domain/commitment';

const KEY = '@saydo/commitments/v1';

export async function loadCommitments(): Promise<Commitment[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed as Commitment[] : [];
  } catch {
    return [];
  }
}

export async function saveCommitments(items: Commitment[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(items));
}
