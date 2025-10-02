import { Injectable } from '@nestjs/common';
import {
  IntegrationPlatform,
  WebhookEventType,
  type KiwifyWebhookPayload,
} from '@synapse/shared-types';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { KiwifyValidator } from '../validators/kiwify.validator';
import type {
  IWebhookStrategy,
  WebhookProcessResult,
} from './webhook-strategy.interface';

@Injectable()
export class KiwifyStrategy implements IWebhookStrategy {
  constructor(
    private readonly prisma: PrismaService,
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
    const eventType = this.mapEventType(kiwifyPayload.event);

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
            message: `Event type ${kiwifyPayload.event} not handled`,
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
      'order.paid': WebhookEventType.KIWIFY_ORDER_PAID,
      'order.refunded': WebhookEventType.KIWIFY_ORDER_REFUNDED,
      'order.chargeback': WebhookEventType.KIWIFY_ORDER_CHARGEBACK,
      'subscription.created': WebhookEventType.KIWIFY_SUBSCRIPTION_CREATED,
      'subscription.cancelled': WebhookEventType.KIWIFY_SUBSCRIPTION_CANCELLED,
    };

    return eventMap[event] || WebhookEventType.KIWIFY_ORDER_PAID;
  }

  private async handleOrderPaid(
    payload: KiwifyWebhookPayload,
    integrationId: number,
  ): Promise<WebhookProcessResult> {
    const product = await this.findOrCreateProduct(
      payload.product.name,
      integrationId,
    );

    const sale = await this.prisma.sale.create({
      data: {
        integrationId,
        productId: product.id,
        platformSaleId: payload.order_id,
        status: 'CONFIRMED',
        amount: payload.amount,
        currency: payload.currency,
        customerName: payload.customer.name,
        customerEmail: payload.customer.email,
        saleDate: payload.approved_date
          ? new Date(payload.approved_date)
          : new Date(),
      },
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
    const sale = await this.prisma.sale.findFirst({
      where: {
        platformSaleId: payload.order_id,
        integrationId,
      },
    });

    if (sale) {
      await this.prisma.sale.update({
        where: { id: sale.id },
        data: { status: 'REFUNDED' },
      });
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
    const sale = await this.prisma.sale.findFirst({
      where: {
        platformSaleId: payload.order_id,
        integrationId,
      },
    });

    if (sale) {
      await this.prisma.sale.update({
        where: { id: sale.id },
        data: { status: 'CANCELLED' },
      });
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
    const integration = await this.prisma.integration.findUnique({
      where: { id: integrationId },
    });

    let product = await this.prisma.product.findFirst({
      where: {
        name: productName,
        userId: integration?.userId,
      },
    });

    if (!product) {
      product = await this.prisma.product.create({
        data: {
          name: productName,
          userId: integration?.userId,
        },
      });
    }

    return product;
  }
}
