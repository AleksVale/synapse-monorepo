import { Injectable } from '@nestjs/common';
import type { EduzzWebhookPayload } from '@synapse/shared-types';
import {
  IntegrationPlatform,
  WebhookEventType,
} from '../../../../generated/prisma';
import {
  IntegrationRepository,
  ProductRepository,
  SaleRepository,
} from '../../repositories';
import { EduzzValidator } from '../validators/eduzz.validator';
import type {
  IWebhookStrategy,
  WebhookProcessResult,
} from './webhook-strategy.interface';

@Injectable()
export class EduzzStrategy implements IWebhookStrategy {
  constructor(
    private readonly saleRepository: SaleRepository,
    private readonly productRepository: ProductRepository,
    private readonly integrationRepository: IntegrationRepository,
    private readonly validator: EduzzValidator,
  ) {}

  getPlatform(): IntegrationPlatform {
    return IntegrationPlatform.EDUZZ;
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
    const eduzzPayload = payload as EduzzWebhookPayload;
    const eventType = this.mapEventType(eduzzPayload.event);

    try {
      switch (eventType) {
        case WebhookEventType.EDUZZ_VENDA:
          return await this.handleSale(eduzzPayload, integrationId);

        case WebhookEventType.EDUZZ_REEMBOLSO:
          return await this.handleRefund(eduzzPayload, integrationId);

        case WebhookEventType.EDUZZ_CANCELAMENTO:
          return await this.handleCancellation(eduzzPayload, integrationId);

        default:
          return {
            success: false,
            eventType,
            message: `Event type ${eduzzPayload.event} not handled`,
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
      'myeduzz.invoice_paid': WebhookEventType.EDUZZ_VENDA,
      'myeduzz.invoice_refunded': WebhookEventType.EDUZZ_REEMBOLSO,
      'myeduzz.invoice_chargeback': WebhookEventType.EDUZZ_CANCELAMENTO,
    };

    return eventMap[event] || WebhookEventType.EDUZZ_VENDA;
  }

  private async handleSale(
    payload: EduzzWebhookPayload,
    integrationId: number,
  ): Promise<WebhookProcessResult> {
    const productName = payload.data.items[0]?.name || 'Produto Eduzz';
    const product = await this.findOrCreateProduct(productName, integrationId);

    const sale = await this.saleRepository.create({
      integrationId,
      productId: product.id,
      platformSaleId: payload.data.id,
      status: this.mapSaleStatus(payload.data.status),
      amount: payload.data.price.value,
      currency: payload.data.price.currency,
      customerName: payload.data.buyer.name,
      customerEmail: payload.data.buyer.email,
      saleDate: payload.data.paidAt
        ? new Date(payload.data.paidAt)
        : new Date(payload.data.createdAt),
    });

    return {
      success: true,
      saleId: sale.id,
      eventType: WebhookEventType.EDUZZ_VENDA,
      message: 'Sale processed successfully',
    };
  }

  private async handleRefund(
    payload: EduzzWebhookPayload,
    integrationId: number,
  ): Promise<WebhookProcessResult> {
    const sale = await this.saleRepository.findByPlatformSaleId(
      payload.data.id,
      integrationId,
    );

    if (sale) {
      await this.saleRepository.update(sale.id, { status: 'REFUNDED' });
    }

    return {
      success: true,
      saleId: sale?.id,
      eventType: WebhookEventType.EDUZZ_REEMBOLSO,
      message: 'Refund processed successfully',
    };
  }

  private async handleCancellation(
    payload: EduzzWebhookPayload,
    integrationId: number,
  ): Promise<WebhookProcessResult> {
    const sale = await this.saleRepository.findByPlatformSaleId(
      payload.data.id,
      integrationId,
    );

    if (sale) {
      await this.saleRepository.update(sale.id, { status: 'CANCELLED' });
    }

    return {
      success: true,
      saleId: sale?.id,
      eventType: WebhookEventType.EDUZZ_CANCELAMENTO,
      message: 'Cancellation processed successfully',
    };
  }

  private mapSaleStatus(
    transStatus: string,
  ): 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'REFUNDED' {
    const statusMap: Record<
      string,
      'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'REFUNDED'
    > = {
      aprovado: 'CONFIRMED',
      pendente: 'PENDING',
      cancelado: 'CANCELLED',
      reembolsado: 'REFUNDED',
    };

    return statusMap[transStatus.toLowerCase()] || 'PENDING';
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
