import { Injectable, NotFoundException } from '@nestjs/common';
import {
  IntegrationPlatform,
  WebhookEventType,
} from '../../../generated/prisma';
import { IntegrationRepository } from '../../infrastructure/repositories';
import {
  EduzzStrategy,
  HotmartStrategy,
  type IWebhookStrategy,
  KiwifyStrategy,
  type WebhookProcessResult,
} from '../../infrastructure/webhooks/strategies';

@Injectable()
export class ProcessWebhookUseCase {
  private strategies: Map<IntegrationPlatform, IWebhookStrategy>;

  constructor(
    private readonly integrationRepository: IntegrationRepository,
    private readonly kiwifyStrategy: KiwifyStrategy,
    private readonly eduzzStrategy: EduzzStrategy,
    private readonly hotmartStrategy: HotmartStrategy,
  ) {
    this.strategies = new Map<IntegrationPlatform, IWebhookStrategy>([
      [IntegrationPlatform.KIWIFY, kiwifyStrategy],
      [IntegrationPlatform.EDUZZ, eduzzStrategy],
      [IntegrationPlatform.HOTMART, hotmartStrategy],
    ]);
  }

  async execute(
    platform: IntegrationPlatform,
    integrationId: number,
    payload: unknown,
    signature?: string,
  ): Promise<WebhookProcessResult> {
    const integration =
      await this.integrationRepository.findById(integrationId);

    if (!integration) {
      throw new NotFoundException(
        `Integration with id ${integrationId} not found`,
      );
    }

    const strategy = this.strategies.get(platform);

    if (!strategy) {
      throw new NotFoundException(
        `Strategy for platform ${platform} not found`,
      );
    }

    if (signature && integration.apiKey) {
      const isValid = strategy.validateSignature(
        payload,
        signature,
        integration.apiKey,
      );

      if (!isValid) {
        return {
          success: false,
          eventType: WebhookEventType.KIWIFY_ORDER_PAID,
          message: 'Invalid signature',
          error: 'Signature validation failed',
        };
      }
    }

    return await strategy.process(payload, integrationId);
  }
}
