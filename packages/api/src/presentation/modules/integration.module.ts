import { Module } from '@nestjs/common';
import {
  CreateIntegrationUseCase,
  DeleteIntegrationUseCase,
  ListUserIntegrationsUseCase,
  UpdateIntegrationUseCase,
} from '../../application/use-cases';
import {
  IIntegrationRepository,
  ISaleRepository,
} from '../../domain/repositories';
import {
  IntegrationRepository,
  SaleRepository,
} from '../../infrastructure/repositories';
import { IntegrationController } from '../controllers/integration.controller';

@Module({
  providers: [
    // Repository providers
    {
      provide: IIntegrationRepository,
      useClass: IntegrationRepository,
    },
    {
      provide: ISaleRepository,
      useClass: SaleRepository,
    },
    // Use cases
    CreateIntegrationUseCase,
    ListUserIntegrationsUseCase,
    UpdateIntegrationUseCase,
    DeleteIntegrationUseCase,
  ],
  controllers: [IntegrationController],
  exports: [
    CreateIntegrationUseCase,
    ListUserIntegrationsUseCase,
    UpdateIntegrationUseCase,
    DeleteIntegrationUseCase,
  ],
})
export class IntegrationModule {}
