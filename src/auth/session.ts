import { supabase } from '../backend/supabase';

export async function getSessionUserId(): Promise<string | null> {
  if (!supabase) return null;
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) return null;
  const { data: userData, error } = await supabase.auth.getUser();
  if (error || !userData.user) {
    await supabase.auth.signOut({ scope: 'local' });
    return null;
  }
  return userData.user.id;
}

export async function signInWithEmail(email: string, password: string): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured');
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function signUpWithEmail(email: string, password: string): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured');
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
}

export async function signOut(): Promise<void> {
  if (!supabase) return;
  await supabase.auth.signOut({ scope: 'local' });
}

export async function deleteAccount(): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured');
  const { error } = await supabase.functions.invoke('delete-account', { body: {} });
  if (error) throw error;
  await supabase.auth.signOut({ scope: 'local' });
}
