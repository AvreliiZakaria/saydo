import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { signInWithEmail, signUpWithEmail } from './session';
import { supabase } from '../backend/supabase';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [error, setError] = useState('');
  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    supabase.auth.getSession().then(({ data }) => { setUserId(data.session?.user.id ?? null); setLoading(false); });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setUserId(session?.user.id ?? null));
    return () => data.subscription.unsubscribe();
  }, []);
  if (loading) return <View style={styles.center}><ActivityIndicator color="#E15C3A" /></View>;
  if (userId) return <>{children}</>;
  async function submit() { setError(''); try { if (mode === 'signIn') await signInWithEmail(email.trim(), password); else await signUpWithEmail(email.trim(), password); } catch (e) { setError(e instanceof Error ? e.message : 'Не удалось войти'); } }
  return <View style={styles.screen}><Text style={styles.logo}>SAY/DO</Text><Text style={styles.title}>{mode === 'signIn' ? 'Войти' : 'Создать аккаунт'}</Text><Text style={styles.subtitle}>Обещания должны быть доступны тебе, а не только этому телефону.</Text><TextInput autoCapitalize="none" keyboardType="email-address" placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} /><TextInput secureTextEntry placeholder="Пароль" value={password} onChangeText={setPassword} style={styles.input} /><Pressable onPress={submit} style={styles.button}><Text style={styles.buttonText}>{mode === 'signIn' ? 'ВОЙТИ' : 'СОЗДАТЬ'}</Text></Pressable>{error ? <Text style={styles.error}>{error}</Text> : null}<Pressable onPress={() => setMode(mode === 'signIn' ? 'signUp' : 'signIn')}><Text style={styles.switch}>{mode === 'signIn' ? 'Нет аккаунта? Создать' : 'Уже есть аккаунт? Войти'}</Text></Pressable></View>;
}
const styles = StyleSheet.create({ center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F4EF' }, screen: { flex: 1, justifyContent: 'center', padding: 28, backgroundColor: '#F5F4EF' }, logo: { fontSize: 18, fontWeight: '900', letterSpacing: 2, color: '#20241F', marginBottom: 44 }, title: { fontSize: 38, fontWeight: '900', color: '#20241F' }, subtitle: { color: '#6C7569', fontSize: 16, lineHeight: 23, marginTop: 12, marginBottom: 28 }, input: { backgroundColor: '#FFFDF8', borderBottomWidth: 1, borderColor: '#D8DDD2', padding: 15, fontSize: 16, marginBottom: 12 }, button: { backgroundColor: '#3F765B', paddingVertical: 16, alignItems: 'center', borderRadius: 12, marginTop: 8 }, buttonText: { color: '#FFFDF8', fontWeight: '900', letterSpacing: 1 }, error: { color: '#E15C3A', marginTop: 14 }, switch: { color: '#3F765B', textAlign: 'center', marginTop: 22, fontWeight: '700' } });
