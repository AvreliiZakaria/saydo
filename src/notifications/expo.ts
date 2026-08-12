import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Commitment } from '../domain/commitment';
import type { NotificationStatus, ReminderService } from './index';

Notifications.setNotificationHandler({ handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: false, shouldSetBadge: false }) });

const notificationIds = new Map<string, string[]>();

function reminderTimes(deadline: number): number[] {
  const now = Date.now();
  const times = new Set<number>();
  for (let at = now + 60 * 60 * 1000; at < deadline; at += 60 * 60 * 1000) times.add(at);
  for (const offset of [60 * 60 * 1000, 30 * 60 * 1000, 5 * 60 * 1000]) {
    const at = deadline - offset;
    if (at > now && at < deadline) times.add(at);
  }
  return [...times].sort((a, b) => a - b);
}

export class ExpoReminderService implements ReminderService {
  async status(): Promise<NotificationStatus> {
    if (Platform.OS === 'web') return 'unavailable';
    const permissions = await Notifications.getPermissionsAsync();
    return permissions.granted ? 'ready' : 'permission-needed';
  }
  async scheduleFor(commitment: Commitment): Promise<void> {
    if (Platform.OS === 'web' || commitment.status !== 'active') return;
    await this.cancelFor(commitment.id);
    if (await this.status() !== 'ready') return;
    const deadline = new Date(commitment.deadline).getTime();
    if (!Number.isFinite(deadline) || deadline <= Date.now()) return;
    const ids: string[] = [];
    for (const at of reminderTimes(deadline)) {
      const minutesLeft = Math.max(1, Math.round((deadline - at) / 60000));
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'SAY/DO',
          body: minutesLeft === 60 ? `До «${commitment.title}» остался час.` : `До «${commitment.title}» осталось ${minutesLeft} мин.`,
          sound: false,
          data: { commitmentId: commitment.id },
        },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: new Date(at) },
      });
      ids.push(id);
    }
    notificationIds.set(commitment.id, ids);
  }
  async cancelFor(commitmentId: string): Promise<void> {
    const ids = notificationIds.get(commitmentId) ?? [];
    await Promise.all(ids.map((id) => Notifications.cancelScheduledNotificationAsync(id)));
    notificationIds.delete(commitmentId);
  }
}

export async function requestReminderPermission(): Promise<NotificationStatus> {
  if (Platform.OS === 'web') return 'unavailable';
  const result = await Notifications.requestPermissionsAsync();
  return result.granted ? 'ready' : 'permission-needed';
}
