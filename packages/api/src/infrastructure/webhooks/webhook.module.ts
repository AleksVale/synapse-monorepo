import { Module } from '@nestjs/common';
import { CreateWebhookLogUseCase } from '../../application/use-cases/create-webhook-log.use-case';
import { ProcessWebhookUseCase } from '../../application/use-cases/process-webhook.use-case';
import {
  IIntegrationRepository,
  IProductRepository,
  ISaleRepository,
  IWebhookLogRepository,
} from '../../domain/repositories';
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
    // Repository providers (abstract class -> concrete implementation)
    {
      provide: IWebhookLogRepository,
      useClass: WebhookLogRepository,
    },
    {
      provide: IIntegrationRepository,
      useClass: IntegrationRepository,
    },
    {
      provide: ISaleRepository,
      useClass: SaleRepository,
    },
    {
      provide: IProductRepository,
      useClass: ProductRepository,
    },
    // Validators
    KiwifyValidator,
    EduzzValidator,
    HotmartValidator,
    // Strategies
    KiwifyStrategy,
    EduzzStrategy,
    HotmartStrategy,
    // Use cases
    ProcessWebhookUseCase,
    CreateWebhookLogUseCase,
  ],
  controllers: [WebhookController],
  exports: [ProcessWebhookUseCase, CreateWebhookLogUseCase],
})
export class WebhookModule {}
