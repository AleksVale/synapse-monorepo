import { Inject, Injectable } from '@nestjs/common';
import type { KiwifyWebhookPayload } from '@synapse/shared-types';
import {
  IntegrationPlatform,
  WebhookEventType,
} from '../../../../generated/prisma';
import {
  IIntegrationRepository,
  IProductRepository,
  ISaleRepository,
} from '../../../domain/repositories';
import { KiwifyValidator } from '../validators/kiwify.validator';
import type {
  IWebhookStrategy,
  WebhookProcessResult,
} from './webhook-strategy.interface';

@Injectable()
export class KiwifyStrategy implements IWebhookStrategy {
  constructor(
    @Inject(ISaleRepository)
    private readonly saleRepository: ISaleRepository,
    @Inject(IProductRepository)
    private readonly productRepository: IProductRepository,
    @Inject(IIntegrationRepository)
    private readonly integrationRepository: IIntegrationRepository,
    private readonly validator: KiwifyValidator,
  ) {}

  getPlatform(): IntegrationPlatform {
    return IntegrationPlatform.KIWIFY;
  }

  validateSignature(
    payload: unknown,
    signature: string,
    secret: string,
  ): boolean {
    const payloadString = JSON.stringify(payload);
    return this.validator.validateSignature(payloadString, signature, secret);
  }

  async process(
    payload: unknown,
    integrationId: number,
  ): Promise<WebhookProcessResult> {
    const kiwifyPayload = payload as KiwifyWebhookPayload;
    const eventType = this.mapEventType(kiwifyPayload.webhook_event_type);

    try {
      switch (eventType) {
        case WebhookEventType.KIWIFY_ORDER_PAID:
          return await this.handleOrderPaid(kiwifyPayload, integrationId);

        case WebhookEventType.KIWIFY_ORDER_REFUNDED:
          return await this.handleOrderRefunded(kiwifyPayload, integrationId);

        case WebhookEventType.KIWIFY_ORDER_CHARGEBACK:
          return await this.handleOrderChargeback(kiwifyPayload, integrationId);

        default:
          return {
            success: false,
            eventType,
            message: `Event type ${kiwifyPayload.webhook_event_type} not handled`,
          };
      }
    } catch (error) {
      return {
        success: false,
        eventType,
        message: 'Error processing webhook',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private mapEventType(event: string): WebhookEventType {
    const eventMap: Record<string, WebhookEventType> = {
      order_approved: WebhookEventType.KIWIFY_ORDER_PAID,
      order_refunded: WebhookEventType.KIWIFY_ORDER_REFUNDED,
      chargeback: WebhookEventType.KIWIFY_ORDER_CHARGEBACK,
    };

    return eventMap[event] || WebhookEventType.KIWIFY_ORDER_PAID;
  }

  private async handleOrderPaid(
    payload: KiwifyWebhookPayload,
    integrationId: number,
  ): Promise<WebhookProcessResult> {
    const product = await this.findOrCreateProduct(
      payload.Product.product_name,
      integrationId,
    );

    const amountInCents = parseInt(payload.Commissions.charge_amount, 10);
    const amountInUnits = amountInCents / 100;

    const sale = await this.saleRepository.create({
      integrationId,
      productId: product.id,
      platformSaleId: payload.order_id,
      status: 'CONFIRMED',
      amount: amountInUnits,
      currency: payload.Commissions.currency,
      customerName: payload.Customer.full_name,
      customerEmail: payload.Customer.email,
      saleDate: payload.approved_date
        ? new Date(payload.approved_date)
        : new Date(payload.created_at),
    });

    return {
      success: true,
      saleId: sale.id,
      eventType: WebhookEventType.KIWIFY_ORDER_PAID,
      message: 'Order paid processed successfully',
    };
  }

  private async handleOrderRefunded(
    payload: KiwifyWebhookPayload,
    integrationId: number,
  ): Promise<WebhookProcessResult> {
    const sale = await this.saleRepository.findByPlatformSaleId(
      payload.order_id,
      integrationId,
    );

    if (sale) {
      await this.saleRepository.update(sale.id, { status: 'REFUNDED' });
    }

    return {
      success: true,
      saleId: sale?.id,
      eventType: WebhookEventType.KIWIFY_ORDER_REFUNDED,
      message: 'Order refunded processed successfully',
    };
  }

  private async handleOrderChargeback(
    payload: KiwifyWebhookPayload,
    integrationId: number,
  ): Promise<WebhookProcessResult> {
    const sale = await this.saleRepository.findByPlatformSaleId(
      payload.order_id,
      integrationId,
    );

    if (sale) {
      await this.saleRepository.update(sale.id, { status: 'CANCELLED' });
    }

    return {
      success: true,
      saleId: sale?.id,
      eventType: WebhookEventType.KIWIFY_ORDER_CHARGEBACK,
      message: 'Order chargeback processed successfully',
    };
  }

  private async findOrCreateProduct(
    productName: string,
    integrationId: number,
  ) {
    const integration =
      await this.integrationRepository.findById(integrationId);

    if (!integration?.userId) {
      throw new Error('Integration user not found');
    }

    let product = await this.productRepository.findByName(
      productName,
      integration.userId,
    );

    if (!product) {
      product = await this.productRepository.create({
        name: productName,
        userId: integration.userId,
      });
    }

    return product;
  }
}
