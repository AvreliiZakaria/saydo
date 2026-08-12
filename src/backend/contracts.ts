import { Commitment } from '../domain/commitment';

export interface SayDoBackend {
  getCommitments(userId: string): Promise<Commitment[]>;
  saveCommitment(userId: string, commitment: Commitment): Promise<void>;
  deleteAccount(userId: string): Promise<void>;
}

export class UnconfiguredBackend implements SayDoBackend {
  async getCommitments(): Promise<Commitment[]> { return []; }
  async saveCommitment(): Promise<void> { return; }
  async deleteAccount(): Promise<void> { return; }
}

export const backend = new UnconfiguredBackend();
