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
    const eduzzPayload = payload as EduzzWebhookPayload;
    return this.validator.validateToken(eduzzPayload.token, secret);
  }

  async process(
    payload: unknown,
    integrationId: number,
  ): Promise<WebhookProcessResult> {
    const eduzzPayload = payload as EduzzWebhookPayload;
    const eventType = this.mapEventType(eduzzPayload.evento);

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
            message: `Event type ${eduzzPayload.evento} not handled`,
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

  private mapEventType(evento: string): WebhookEventType {
    const eventMap: Record<string, WebhookEventType> = {
      venda: WebhookEventType.EDUZZ_VENDA,
      cancelamento: WebhookEventType.EDUZZ_CANCELAMENTO,
      reembolso: WebhookEventType.EDUZZ_REEMBOLSO,
    };

    return eventMap[evento] || WebhookEventType.EDUZZ_VENDA;
  }

  private async handleSale(
    payload: EduzzWebhookPayload,
    integrationId: number,
  ): Promise<WebhookProcessResult> {
    const product = await this.findOrCreateProduct(
      payload.produto.nome_produto,
      integrationId,
    );

    const sale = await this.saleRepository.create({
      integrationId,
      productId: product.id,
      platformSaleId: payload.trans_cod.toString(),
      status: this.mapSaleStatus(payload.trans_status),
      amount: payload.valor,
      currency: payload.moeda,
      customerName: payload.cliente.nome,
      customerEmail: payload.cliente.email,
      saleDate: payload.data_aprovacao
        ? new Date(payload.data_aprovacao)
        : new Date(),
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
      payload.trans_cod.toString(),
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
      payload.trans_cod.toString(),
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
