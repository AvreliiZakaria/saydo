import { Commitment } from '../domain/commitment';

export type NotificationStatus = 'unavailable' | 'permission-needed' | 'ready';

export interface ReminderService {
  status(): Promise<NotificationStatus>;
  scheduleFor(commitment: Commitment): Promise<void>;
  cancelFor(commitmentId: string): Promise<void>;
}

export class NoopReminderService implements ReminderService {
  async status(): Promise<NotificationStatus> { return 'unavailable'; }
  async scheduleFor(): Promise<void> { return; }
  async cancelFor(): Promise<void> { return; }
}

export const reminders: ReminderService = new NoopReminderService();
