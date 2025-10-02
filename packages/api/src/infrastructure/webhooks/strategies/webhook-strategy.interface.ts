import type {
  IntegrationPlatform,
  WebhookEventType,
} from '../../../../generated/prisma';

export interface WebhookProcessResult {
  success: boolean;
  saleId?: number;
  eventType: WebhookEventType;
  message: string;
  error?: string;
}

export interface IWebhookStrategy {
  validateSignature(
    payload: unknown,
    signature: string,
    secret: string,
  ): boolean;

  process(
    payload: unknown,
    integrationId: number,
  ): Promise<WebhookProcessResult>;

  getPlatform(): IntegrationPlatform;
}
