import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { deleteAccount, signOut } from './session';

export function AccountActions({ onSignedOut }: { onSignedOut?: () => void }) {
  const [busy, setBusy] = useState(false);
  async function logout() {
    setBusy(true);
    try { await signOut(); onSignedOut?.(); } catch { Alert.alert('Не удалось выйти', 'Проверь интернет и попробуй ещё раз.'); } finally { setBusy(false); }
  }
  function confirmDelete() {
    Alert.alert('Удалить аккаунт?', 'Все обещания, счёт и доступ к профилю будут удалены без возможности восстановления.', [{ text: 'Отмена', style: 'cancel' }, { text: 'Удалить', style: 'destructive', onPress: async () => { setBusy(true); try { await deleteAccount(); onSignedOut?.(); } catch { Alert.alert('Не удалось удалить аккаунт', 'Ничего не удалено. Проверь интернет и попробуй ещё раз.'); } finally { setBusy(false); } } }]);
  }
  return <View style={styles.wrap}><Pressable disabled={busy} onPress={logout} style={styles.logout}><Text style={styles.logoutText}>{busy ? 'ПОДОЖДИ...' : 'ВЫЙТИ ИЗ АККАУНТА'}</Text></Pressable><Pressable disabled={busy} onPress={confirmDelete} style={styles.delete}><Text style={styles.deleteText}>Удалить аккаунт</Text></Pressable></View>;
}
const styles = StyleSheet.create({ wrap: { marginTop: 32, paddingTop: 24, borderTopWidth: 1, borderColor: '#D8DDD2' }, logout: { backgroundColor: '#3F765B', borderRadius: 12, paddingVertical: 16, alignItems: 'center' }, logoutText: { color: '#FFFDF8', fontWeight: '900', letterSpacing: 1, fontSize: 12 }, delete: { alignItems: 'center', paddingVertical: 16 }, deleteText: { color: '#A33D2A', fontWeight: '700', fontSize: 13 } });
