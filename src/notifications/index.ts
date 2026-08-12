export type NotificationPermission = 'unknown' | 'granted' | 'denied';

export interface NotificationScheduler {
  requestPermission(): Promise<NotificationPermission>;
  scheduleDeadlineReminder(commitmentId: string, deadline: string): Promise<void>;
}

export class LocalNotificationScheduler implements NotificationScheduler {
  async requestPermission(): Promise<NotificationPermission> { return 'unknown'; }
  async scheduleDeadlineReminder(): Promise<void> { return; }
}

export const notifications = new LocalNotificationScheduler();
