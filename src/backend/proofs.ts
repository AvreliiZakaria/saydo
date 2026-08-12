import { supabase } from './supabase';

export async function uploadProof(userId: string, commitmentId: string, uri: string): Promise<string> {
  if (!supabase) throw new Error('Supabase is not configured');
  const response = await fetch(uri);
  const blob = await response.blob();
  const path = `${userId}/${commitmentId}/${Date.now()}.jpg`;
  const { error } = await supabase.storage.from('saydo-proofs').upload(path, blob, { contentType: 'image/jpeg', upsert: false });
  if (error) throw error;
  const { error: rowError } = await supabase.from('saydo_proofs').insert({ commitment_id: commitmentId, owner_id: userId, storage_path: path });
  if (rowError) throw rowError;
  return path;
}
