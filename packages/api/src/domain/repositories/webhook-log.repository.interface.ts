import type {
  IntegrationPlatform,
  WebhookEventType,
  WebhookLog,
  WebhookStatus,
} from 'generated/prisma';

export interface CreateWebhookLogData {
  integrationId?: number;
  platform: IntegrationPlatform;
  eventType: WebhookEventType;
  payload: Record<string, any>;
  status: WebhookStatus;
  errorMessage?: string;
  processedAt?: Date;
}

export interface UpdateWebhookLogData {
  status?: WebhookStatus;
  errorMessage?: string;
  processedAt?: Date;
}

export abstract class IWebhookLogRepository {
  abstract create(data: CreateWebhookLogData): Promise<WebhookLog>;
  abstract findById(id: number): Promise<WebhookLog | null>;
  abstract findByIntegration(
    integrationId: number,
    limit?: number,
  ): Promise<WebhookLog[]>;
  abstract findByPlatform(
    platform: IntegrationPlatform,
    limit?: number,
  ): Promise<WebhookLog[]>;
  abstract findByStatus(
    status: WebhookStatus,
    limit?: number,
  ): Promise<WebhookLog[]>;
  abstract findFailedLogs(limit?: number): Promise<WebhookLog[]>;
  abstract update(id: number, data: UpdateWebhookLogData): Promise<WebhookLog>;
  abstract countByStatus(status: WebhookStatus): Promise<number>;
  abstract countByPlatform(platform: IntegrationPlatform): Promise<number>;
  abstract deleteOlderThan(days: number): Promise<number>;
}
