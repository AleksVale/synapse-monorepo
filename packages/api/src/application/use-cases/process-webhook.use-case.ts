import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  IntegrationPlatform,
  WebhookEventType,
} from '../../../generated/prisma';
import { IIntegrationRepository } from '../../domain/repositories';
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
    @Inject(IIntegrationRepository)
    private readonly integrationRepository: IIntegrationRepository,
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

    const strategy = this.strategies.get(
      integration.platformName as IntegrationPlatform,
    );

    if (!strategy) {
      throw new NotFoundException(
        `Strategy for platform ${integration.platformName} not found`,
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
