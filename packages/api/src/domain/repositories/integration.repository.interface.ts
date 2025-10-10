import type { Integration } from 'generated/prisma';

export interface CreateIntegrationData {
  userId?: number;
  platformName: string;
  apiKey?: string;
  status: string;
  lastSyncAt?: Date;
}

export interface UpdateIntegrationData {
  platformName?: string;
  apiKey?: string;
  status?: string;
  lastSyncAt?: Date;
}

export abstract class IIntegrationRepository {
  abstract findById(id: number): Promise<Integration | null>;
  abstract findByUserId(userId: number): Promise<Integration[]>;
  abstract findByPlatform(
    userId: number,
    platformName: string,
  ): Promise<Integration | null>;
  abstract create(data: CreateIntegrationData): Promise<Integration>;
  abstract update(
    id: number,
    data: UpdateIntegrationData,
  ): Promise<Integration>;
  abstract updateLastSync(id: number, lastSyncAt: Date): Promise<Integration>;
  abstract delete(id: number): Promise<Integration>;
  abstract countByUser(userId: number): Promise<number>;
  abstract findActiveIntegrations(): Promise<Integration[]>;
}
