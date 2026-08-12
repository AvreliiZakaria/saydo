import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { signInWithEmail, signUpWithEmail } from './session';
import { supabase } from '../backend/supabase';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [error, setError] = useState('');
  const passwordRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    supabase.auth.getSession().then(({ data }) => { setUserId(data.session?.user.id ?? null); setLoading(false); });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setUserId(session?.user.id ?? null));
    return () => data.subscription.unsubscribe();
  }, []);

  if (loading) return <View style={styles.center}><ActivityIndicator color={colors.accent} /></View>;
  if (userId) return <>{children}</>;

  async function submit() {
    const cleanEmail = email.trim().toLowerCase();
    setError('');
    if (!cleanEmail || !cleanEmail.includes('@')) { setError('Введи корректный email.'); return; }
    if (password.length < 6) { setError('Пароль должен быть не короче 6 символов.'); return; }
    setSubmitting(true);
    try {
      if (mode === 'signIn') {
        await signInWithEmail(cleanEmail, password);
      } else {
        await signUpWithEmail(cleanEmail, password);
        setMode('signIn');
        setPassword('');
        Alert.alert('Почти готово', 'Проверь почту и подтверди email. После этого войди в SAY/DO.', [{ text: 'Понятно' }]);
      }
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'Не удалось выполнить запрос';
      setError(readableAuthError(message));
    } finally {
      setSubmitting(false);
    }
  }

  return <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={12}>
    <ScrollView contentContainerStyle={styles.screen} keyboardShouldPersistTaps="handled" keyboardDismissMode="interactive">
      <Text style={styles.logo}>SAY/DO</Text>
      <View style={styles.eyebrow}><Text style={styles.eyebrowText}>{mode === 'signIn' ? 'С возвращением' : 'Первый шаг'}</Text></View>
      <Text style={styles.title}>{mode === 'signIn' ? 'Войти.' : 'Создать аккаунт.'}</Text>
      <Text style={styles.subtitle}>{mode === 'signIn' ? 'Твои обещания ждут. Продолжим с того места, где остановились.' : 'Сохрани обещания и счёт, чтобы они были доступны не только этому телефону.'}</Text>
      <Text style={styles.label}>EMAIL</Text>
      <TextInput autoFocus={mode === 'signUp'} autoCapitalize="none" autoCorrect={false} keyboardType="email-address" inputMode="email" placeholder="you@example.com" placeholderTextColor={colors.placeholder} value={email} onChangeText={(value) => { setEmail(value); setError(''); }} onSubmitEditing={() => passwordRef.current?.focus()} returnKeyType="next" style={styles.input} />
      <Text style={styles.label}>ПАРОЛЬ</Text>
      <TextInput ref={passwordRef} secureTextEntry autoCapitalize="none" autoCorrect={false} placeholder="Минимум 6 символов" placeholderTextColor={colors.placeholder} value={password} onChangeText={(value) => { setPassword(value); setError(''); }} onSubmitEditing={submit} returnKeyType="done" style={styles.input} />
      {error ? <View style={styles.errorBox}><Text style={styles.error}>{error}</Text></View> : null}
      <Pressable disabled={submitting} onPress={submit} style={({ pressed }) => [styles.button, pressed && styles.pressed, submitting && styles.disabled]}><Text style={styles.buttonText}>{submitting ? 'ПОДОЖДИ...' : mode === 'signIn' ? 'ВОЙТИ' : 'СОЗДАТЬ АККАУНТ'}</Text></Pressable>
      <Pressable disabled={submitting} onPress={() => { setMode(mode === 'signIn' ? 'signUp' : 'signIn'); setError(''); }} style={styles.switchButton}><Text style={styles.switch}>{mode === 'signIn' ? 'Нет аккаунта? Создать' : 'Уже есть аккаунт? Войти'}</Text></Pressable>
      <Text style={styles.privacy}>Продолжая, ты принимаешь правила SAY/DO и подтверждаешь, что контролируешь этот email.</Text>
    </ScrollView>
  </KeyboardAvoidingView>;
}

function readableAuthError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('invalid login credentials')) return 'Неверный email или пароль.';
  if (lower.includes('email not confirmed')) return 'Сначала подтверди email по ссылке из письма.';
  if (lower.includes('user already registered')) return 'Такой email уже зарегистрирован. Войди в аккаунт.';
  if (lower.includes('rate limit')) return 'Слишком много попыток. Попробуй через минуту.';
  if (lower.includes('password')) return 'Пароль должен быть не короче 6 символов.';
  return 'Не удалось выполнить запрос. Проверь интернет и попробуй ещё раз.';
}

const colors = { ink: '#20241F', muted: '#6C7569', paper: '#F5F4EF', panel: '#FFFDF8', line: '#D8DDD2', accent: '#E15C3A', green: '#3F765B', placeholder: '#929A90' };
const styles = StyleSheet.create({
  flex: { flex: 1 }, center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.paper },
  screen: { flexGrow: 1, justifyContent: 'center', padding: 28, paddingTop: 56, paddingBottom: 40, backgroundColor: colors.paper },
  logo: { fontSize: 18, fontWeight: '900', letterSpacing: 2, color: colors.ink, marginBottom: 48 },
  eyebrow: { alignSelf: 'flex-start', backgroundColor: '#E9EDE5', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, marginBottom: 16 },
  eyebrowText: { color: colors.green, fontSize: 11, fontWeight: '900', letterSpacing: 1.2 },
  title: { fontSize: 40, lineHeight: 44, fontWeight: '900', color: colors.ink },
  subtitle: { color: colors.muted, fontSize: 16, lineHeight: 23, marginTop: 14, marginBottom: 30 },
  label: { color: colors.muted, fontSize: 10, letterSpacing: 1.5, fontWeight: '900', marginTop: 12, marginBottom: 8 },
  input: { backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 15, fontSize: 16, color: colors.ink, marginBottom: 8 },
  errorBox: { backgroundColor: '#FBE9E4', borderRadius: 10, padding: 12, marginTop: 8 }, error: { color: '#A33D2A', fontSize: 13, lineHeight: 18 },
  button: { backgroundColor: colors.green, paddingVertical: 17, alignItems: 'center', borderRadius: 13, marginTop: 20 }, buttonText: { color: colors.panel, fontWeight: '900', letterSpacing: 1, fontSize: 12 }, pressed: { opacity: 0.78 }, disabled: { opacity: 0.55 },
  switchButton: { paddingVertical: 18, alignItems: 'center' }, switch: { color: colors.green, textAlign: 'center', fontWeight: '800', fontSize: 15 }, privacy: { color: colors.muted, fontSize: 11, lineHeight: 16, textAlign: 'center', marginTop: 18 },
});
