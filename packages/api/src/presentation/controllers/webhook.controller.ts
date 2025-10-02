import {
  Body,
  Controller,
  Headers,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { WebhookEventType, WebhookStatus } from '../../../generated/prisma';
import {
  CreateWebhookLogUseCase,
  ProcessWebhookUseCase,
} from '../../application/use-cases';

@Controller('webhooks')
export class WebhookController {
  constructor(
    private readonly processWebhookUseCase: ProcessWebhookUseCase,
    private readonly createWebhookLogUseCase: CreateWebhookLogUseCase,
  ) {}

  @Post(':integrationId')
  async handleWebhook(
    @Param('integrationId', ParseIntPipe) integrationId: number,
    @Body() payload: any,
    @Headers('x-kiwify-signature') kiwifySignature?: string,
    @Headers('x-hotmart-hottok') hotmartHottok?: string,
    @Headers('x-signature') eduzzSignature?: string,
  ) {
    try {
      const signature = kiwifySignature || hotmartHottok || eduzzSignature;

      const result = await this.processWebhookUseCase.execute(
        integrationId,
        payload,
        signature,
      );

      const platform = result.eventType.split('_')[0] as
        | 'KIWIFY'
        | 'EDUZZ'
        | 'HOTMART';

      await this.createWebhookLogUseCase.execute({
        integrationId,
        platform,
        eventType: result.eventType,
        payload: payload as Record<string, any>,
        status: result.success ? WebhookStatus.SUCCESS : WebhookStatus.FAILED,
        errorMessage: result.error,
        processedAt: new Date(),
      });

      return {
        success: result.success,
        message: result.message,
      };
    } catch (error) {
      const payloadData = payload as Record<string, unknown>;
      const rawEventType =
        payloadData?.event ||
        payloadData?.webhook_event_type ||
        payloadData?.Event ||
        'UNKNOWN_EVENT';
      const eventType =
        typeof rawEventType === 'string' ? rawEventType : 'UNKNOWN_EVENT';

      const platform = kiwifySignature
        ? 'KIWIFY'
        : hotmartHottok
          ? 'HOTMART'
          : eduzzSignature
            ? 'EDUZZ'
            : 'UNKNOWN';

      await this.createWebhookLogUseCase.execute({
        integrationId,
        platform: platform as 'KIWIFY' | 'EDUZZ' | 'HOTMART',
        eventType: eventType as WebhookEventType,
        payload: payload as Record<string, any>,
        status: WebhookStatus.FAILED,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        processedAt: new Date(),
      });

      return {
        success: false,
        message: 'Webhook processing failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
