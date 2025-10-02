import { Module } from '@nestjs/common';
import { CreateWebhookLogUseCase } from '../../application/use-cases/create-webhook-log.use-case';
import { ProcessWebhookUseCase } from '../../application/use-cases/process-webhook.use-case';
import { WebhookController } from '../../presentation/controllers/webhook.controller';
import {
  IntegrationRepository,
  ProductRepository,
  SaleRepository,
  WebhookLogRepository,
} from '../repositories';
import { EduzzStrategy, HotmartStrategy, KiwifyStrategy } from './strategies';
import {
  EduzzValidator,
  HotmartValidator,
  KiwifyValidator,
} from './validators';

@Module({
  providers: [
    WebhookLogRepository,
    IntegrationRepository,
    SaleRepository,
    ProductRepository,
    KiwifyValidator,
    EduzzValidator,
    HotmartValidator,
    KiwifyStrategy,
    EduzzStrategy,
    HotmartStrategy,
    ProcessWebhookUseCase,
    CreateWebhookLogUseCase,
  ],
  controllers: [WebhookController],
  exports: [ProcessWebhookUseCase, CreateWebhookLogUseCase],
})
export class WebhookModule {}
