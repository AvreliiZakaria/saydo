import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Commitment } from '../domain/commitment';
import { NotificationStatus, ReminderService } from './index';

Notifications.setNotificationHandler({ handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: false, shouldSetBadge: false }) });

const notificationIds = new Map<string, string>();

export class ExpoReminderService implements ReminderService {
  async status(): Promise<NotificationStatus> {
    if (Platform.OS === 'web' || !Platform.isPad && Platform.OS === 'web') return 'unavailable';
    const permissions = await Notifications.getPermissionsAsync();
    return permissions.granted ? 'ready' : 'permission-needed';
  }
  async scheduleFor(commitment: Commitment): Promise<void> {
    if (Platform.OS === 'web' || commitment.status !== 'active') return;
    await this.cancelFor(commitment.id);
    const current = await this.status();
    if (current !== 'ready') return;
    const deadline = new Date(commitment.deadline).getTime();
    if (!Number.isFinite(deadline) || deadline <= Date.now()) return;
    const reminderAt = deadline - 60 * 60 * 1000;
    if (reminderAt <= Date.now()) return;
    const id = await Notifications.scheduleNotificationAsync({ content: { title: 'SAY/DO', body: `До обещания «${commitment.title}» остался час.`, data: { commitmentId: commitment.id } }, trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: new Date(reminderAt) } });
    notificationIds.set(commitment.id, id);
  }
  async cancelFor(commitmentId: string): Promise<void> {
    const id = notificationIds.get(commitmentId);
    if (!id) return;
    await Notifications.cancelScheduledNotificationAsync(id);
    notificationIds.delete(commitmentId);
  }
}

export async function requestReminderPermission(): Promise<NotificationStatus> {
  if (Platform.OS === 'web') return 'unavailable';
  const result = await Notifications.requestPermissionsAsync();
  return result.granted ? 'ready' : 'permission-needed';
}
