import { Injectable } from '@nestjs/common';
import type { HotmartWebhookPayload } from '@synapse/shared-types';
import {
  IntegrationPlatform,
  WebhookEventType,
} from '../../../../generated/prisma';
import {
  IntegrationRepository,
  ProductRepository,
  SaleRepository,
} from '../../repositories';
import { HotmartValidator } from '../validators/hotmart.validator';
import type {
  IWebhookStrategy,
  WebhookProcessResult,
} from './webhook-strategy.interface';

@Injectable()
export class HotmartStrategy implements IWebhookStrategy {
  constructor(
    private readonly saleRepository: SaleRepository,
    private readonly productRepository: ProductRepository,
    private readonly integrationRepository: IntegrationRepository,
    private readonly validator: HotmartValidator,
  ) {}

  getPlatform(): IntegrationPlatform {
    return IntegrationPlatform.HOTMART;
  }

  validateSignature(
    payload: unknown,
    signature: string,
    secret: string,
  ): boolean {
    return this.validator.validateHottok(signature, secret);
  }

  async process(
    payload: unknown,
    integrationId: number,
  ): Promise<WebhookProcessResult> {
    const hotmartPayload = payload as HotmartWebhookPayload;
    const eventType = this.mapEventType(hotmartPayload.event);

    try {
      switch (eventType) {
        case WebhookEventType.HOTMART_PURCHASE_COMPLETE:
          return await this.handlePurchaseComplete(
            hotmartPayload,
            integrationId,
          );

        case WebhookEventType.HOTMART_PURCHASE_REFUNDED:
          return await this.handlePurchaseRefunded(
            hotmartPayload,
            integrationId,
          );

        case WebhookEventType.HOTMART_PURCHASE_CHARGEBACK:
          return await this.handlePurchaseChargeback(
            hotmartPayload,
            integrationId,
          );

        default:
          return {
            success: false,
            eventType,
            message: `Event type ${hotmartPayload.event} not handled`,
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
      PURCHASE_COMPLETE: WebhookEventType.HOTMART_PURCHASE_COMPLETE,
      PURCHASE_REFUNDED: WebhookEventType.HOTMART_PURCHASE_REFUNDED,
      PURCHASE_CHARGEBACK: WebhookEventType.HOTMART_PURCHASE_CHARGEBACK,
      SUBSCRIPTION_CANCELLATION:
        WebhookEventType.HOTMART_SUBSCRIPTION_CANCELLATION,
    };

    return eventMap[event] || WebhookEventType.HOTMART_PURCHASE_COMPLETE;
  }

  private async handlePurchaseComplete(
    payload: HotmartWebhookPayload,
    integrationId: number,
  ): Promise<WebhookProcessResult> {
    const product = await this.findOrCreateProduct(
      payload.data.product.name,
      integrationId,
    );

    const sale = await this.saleRepository.create({
      integrationId,
      productId: product.id,
      platformSaleId: payload.data.purchase.transaction,
      status: 'CONFIRMED',
      amount: payload.data.purchase.price.value,
      currency: payload.data.purchase.price.currency_code,
      customerName: payload.data.buyer.name,
      customerEmail: payload.data.buyer.email,
      saleDate: payload.data.purchase.approved_date
        ? new Date(payload.data.purchase.approved_date * 1000)
        : new Date(payload.data.purchase.order_date * 1000),
    });

    return {
      success: true,
      saleId: sale.id,
      eventType: WebhookEventType.HOTMART_PURCHASE_COMPLETE,
      message: 'Purchase complete processed successfully',
    };
  }

  private async handlePurchaseRefunded(
    payload: HotmartWebhookPayload,
    integrationId: number,
  ): Promise<WebhookProcessResult> {
    const sale = await this.saleRepository.findByPlatformSaleId(
      payload.data.purchase.transaction,
      integrationId,
    );

    if (sale) {
      await this.saleRepository.update(sale.id, { status: 'REFUNDED' });
    }

    return {
      success: true,
      saleId: sale?.id,
      eventType: WebhookEventType.HOTMART_PURCHASE_REFUNDED,
      message: 'Purchase refunded processed successfully',
    };
  }

  private async handlePurchaseChargeback(
    payload: HotmartWebhookPayload,
    integrationId: number,
  ): Promise<WebhookProcessResult> {
    const sale = await this.saleRepository.findByPlatformSaleId(
      payload.data.purchase.transaction,
      integrationId,
    );

    if (sale) {
      await this.saleRepository.update(sale.id, { status: 'CANCELLED' });
    }

    return {
      success: true,
      saleId: sale?.id,
      eventType: WebhookEventType.HOTMART_PURCHASE_CHARGEBACK,
      message: 'Purchase chargeback processed successfully',
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
