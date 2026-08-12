import { Platform } from 'react-native';
import { Commitment } from '../domain/commitment';
import { ExpoReminderService } from './expo';

export type NotificationStatus = 'unavailable' | 'permission-needed' | 'ready';
export interface ReminderService { status(): Promise<NotificationStatus>; scheduleFor(commitment: Commitment): Promise<void>; cancelFor(commitmentId: string): Promise<void>; }

export class NoopReminderService implements ReminderService { async status(): Promise<NotificationStatus> { return 'unavailable'; } async scheduleFor(): Promise<void> { return; } async cancelFor(): Promise<void> { return; } }

export const reminders: ReminderService = Platform.OS === 'web' ? new NoopReminderService() : new ExpoReminderService();
