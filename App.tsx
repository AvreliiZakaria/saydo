import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useState } from 'react';
import { Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { calculateScore, Commitment, completeCommitment, lockCommitment } from './src/domain/commitment';

const colors = { ink: '#20241F', muted: '#6C7569', paper: '#F5F4EF', panel: '#FFFDF8', line: '#D8DDD2', accent: '#E15C3A', green: '#3F765B' };

export default function App() {
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [draftTitle, setDraftTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const score = useMemo(() => calculateScore(commitments), [commitments]);
  const active = commitments.find((item) => item.status === 'active');

  function createDraft() {
    if (!draftTitle.trim()) return;
    const draft: Commitment = { id: String(Date.now()), title: draftTitle.trim(), deadline: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), proof: 'self', status: 'draft', createdAt: new Date().toISOString() };
    setCommitments((items) => [...items, lockCommitment(draft)]);
    setDraftTitle(''); setIsCreating(false);
  }

  function finishActive() {
    if (!active) return;
    Alert.alert('Сделал?', 'Это обещание будет засчитано.', [
      { text: 'Не сейчас', style: 'cancel' },
      { text: 'Да, засчитать', onPress: () => setCommitments((items) => items.map((item) => item.id === active.id ? completeCommitment(item) : item)) },
    ]);
  }

  return <SafeAreaView style={styles.safe}><StatusBar style="dark" /><ScrollView contentContainerStyle={styles.page}>
    <View style={styles.topbar}><Text style={styles.logo}>SAY/DO</Text><View style={styles.scorePill}><Text style={styles.scorePillNumber}>{score}</Text><Text style={styles.scorePillLabel}>SCORE</Text></View></View>
    <Text style={styles.kicker}>СЕГОДНЯ</Text><Text style={styles.title}>Сказал. Сделай.</Text><Text style={styles.subtitle}>Одна конкретная вещь. Один срок. Без тихого переноса.</Text>
    {active ? <View style={styles.promiseBlock}><Text style={styles.activeLabel}>АКТИВНОЕ ОБЕЩАНИЕ</Text><Text style={styles.promiseTitle}>{active.title}</Text><Text style={styles.deadline}>до {new Date(active.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text><Pressable style={styles.primaryButton} onPress={finishActive}><Text style={styles.primaryButtonText}>Я СДЕЛАЛ</Text></Pressable><Text style={styles.proofHint}>Моё слово · self verified</Text></View> : <View style={styles.emptyState}><Text style={styles.emptyTitle}>Пока доказывать нечего.</Text><Text style={styles.emptyText}>Пообещай себе одну конкретную вещь.</Text></View>}
    {isCreating ? <View style={styles.createBlock}><Text style={styles.createTitle}>Сказать себе</Text><TextInput autoFocus value={draftTitle} onChangeText={setDraftTitle} placeholder="Например: пробежать 5 км" placeholderTextColor="#929A90" style={styles.input} onSubmitEditing={createDraft} /><View style={styles.deadlineRow}><Text style={styles.deadlineRowLabel}>Дедлайн</Text><Text style={styles.deadlineRowValue}>Сегодня, через 6 часов</Text></View><View style={styles.buttonRow}><Pressable onPress={() => setIsCreating(false)} style={styles.secondaryButton}><Text style={styles.secondaryText}>Отмена</Text></Pressable><Pressable onPress={createDraft} style={styles.lockButton}><Text style={styles.lockText}>ЗАФИКСИРОВАТЬ</Text></Pressable></View></View> : <Pressable style={styles.sayButton} onPress={() => setIsCreating(true)}><Text style={styles.sayButtonPlus}>+</Text><Text style={styles.sayButtonText}>SAY IT</Text></Pressable>}
    <View style={styles.footerRow}><Text style={styles.footerLabel}>Надёжность</Text><Text style={styles.footerValue}>{score}/100</Text></View><Text style={styles.footerNote}>Счёт считает только зафиксированные обещания. Провал не исчезает, но следующее обещание всё меняет.</Text>
  </ScrollView></SafeAreaView>;
}

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: colors.paper }, page: { padding: 24, paddingBottom: 48 }, topbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 56 }, logo: { color: colors.ink, fontSize: 18, fontWeight: '900', letterSpacing: 2 }, scorePill: { flexDirection: 'row', alignItems: 'center', gap: 7, borderWidth: 1, borderColor: colors.line, borderRadius: 99, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: colors.panel }, scorePillNumber: { fontSize: 16, fontWeight: '900', color: colors.accent }, scorePillLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1, color: colors.muted }, kicker: { color: colors.accent, fontWeight: '800', letterSpacing: 2, fontSize: 11, marginBottom: 14 }, title: { color: colors.ink, fontSize: 43, lineHeight: 48, fontWeight: '900' }, subtitle: { color: colors.muted, fontSize: 17, lineHeight: 25, marginTop: 14 }, promiseBlock: { backgroundColor: colors.ink, borderRadius: 24, padding: 24, marginTop: 42 }, activeLabel: { color: '#AAB9A9', fontSize: 11, letterSpacing: 1.5, fontWeight: '800' }, promiseTitle: { color: '#FFFDF8', fontSize: 28, lineHeight: 33, fontWeight: '800', marginTop: 24 }, deadline: { color: '#BFCABF', fontSize: 15, marginTop: 10 }, primaryButton: { backgroundColor: colors.accent, borderRadius: 14, paddingVertical: 17, alignItems: 'center', marginTop: 28 }, primaryButtonText: { color: '#FFFDF8', fontSize: 13, letterSpacing: 1.5, fontWeight: '900' }, proofHint: { color: '#AAB9A9', textAlign: 'center', fontSize: 12, marginTop: 14 }, emptyState: { borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.line, paddingVertical: 30, marginTop: 42 }, emptyTitle: { color: colors.ink, fontSize: 20, fontWeight: '800' }, emptyText: { color: colors.muted, fontSize: 15, marginTop: 7 }, sayButton: { marginTop: 28, borderWidth: 1.5, borderColor: colors.accent, borderRadius: 16, paddingVertical: 18, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }, sayButtonPlus: { color: colors.accent, fontSize: 24 }, sayButtonText: { color: colors.accent, fontSize: 13, fontWeight: '900', letterSpacing: 1.5 }, createBlock: { marginTop: 32, backgroundColor: colors.panel, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: colors.line }, createTitle: { color: colors.ink, fontSize: 21, fontWeight: '800', marginBottom: 16 }, input: { borderBottomWidth: 1, borderColor: colors.line, color: colors.ink, fontSize: 18, paddingVertical: 12 }, deadlineRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 18, borderBottomWidth: 1, borderColor: colors.line }, deadlineRowLabel: { color: colors.muted, fontSize: 14 }, deadlineRowValue: { color: colors.ink, fontSize: 14, fontWeight: '700' }, buttonRow: { flexDirection: 'row', gap: 10, marginTop: 18 }, secondaryButton: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 15 }, secondaryText: { color: colors.muted, fontWeight: '700' }, lockButton: { flex: 1.6, backgroundColor: colors.green, borderRadius: 12, alignItems: 'center', justifyContent: 'center', paddingVertical: 15 }, lockText: { color: '#FFFDF8', fontSize: 12, fontWeight: '900', letterSpacing: 1 }, footerRow: { marginTop: 56, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }, footerLabel: { color: colors.muted, fontSize: 14, fontWeight: '700' }, footerValue: { color: colors.ink, fontSize: 24, fontWeight: '900' }, footerNote: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 10 } });
