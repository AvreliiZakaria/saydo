import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Commitment } from '../domain/commitment';
import { NotificationStatus, ReminderService } from './index';

Notifications.setNotificationHandler({ handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: false, shouldSetBadge: false }) });

export class ExpoReminderService implements ReminderService {
  async status(): Promise<NotificationStatus> {
    if (Platform.OS === 'web') return 'unavailable';
    const permissions = await Notifications.getPermissionsAsync();
    return permissions.granted ? 'ready' : 'permission-needed';
  }
  async scheduleFor(commitment: Commitment): Promise<void> {
    if (Platform.OS === 'web') return;
    const current = await this.status();
    if (current !== 'ready') return;
    const deadline = new Date(commitment.deadline).getTime();
    const reminderAt = Math.max(Date.now() + 1000, deadline - 60 * 60 * 1000);
    await Notifications.scheduleNotificationAsync({ content: { title: 'SAY/DO', body: `До обещания «${commitment.title}» остался час.` }, trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: new Date(reminderAt) } });
  }
  async cancelFor(): Promise<void> { return; }
}

export async function requestReminderPermission(): Promise<NotificationStatus> {
  if (Platform.OS === 'web') return 'unavailable';
  const result = await Notifications.requestPermissionsAsync();
  return result.granted ? 'ready' : 'permission-needed';
}
