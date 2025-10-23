import { Inject, Injectable } from '@nestjs/common';
import type {
  IntegrationListItemDto,
  ListIntegrationsResponseDto,
} from '@synapse/shared-types';
import {
  IIntegrationRepository,
  ISaleRepository,
} from '../../domain/repositories';

@Injectable()
export class ListUserIntegrationsUseCase {
  constructor(
    @Inject(IIntegrationRepository)
    private readonly integrationRepository: IIntegrationRepository,
    @Inject(ISaleRepository)
    private readonly saleRepository: ISaleRepository,
  ) {}

  async execute(
    userId: number,
    page = 1,
    limit = 10,
  ): Promise<ListIntegrationsResponseDto> {
    const integrations = await this.integrationRepository.findByUserId(userId);

    const integrationsWithStats: IntegrationListItemDto[] = integrations.map(
      (integration) => {
        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const isHealthy =
          integration.lastSyncAt && integration.lastSyncAt > oneDayAgo;

        const syncStatus: 'idle' | 'syncing' | 'error' =
          integration.status === 'error' ? 'error' : 'idle';

        return {
          id: integration.id,
          platformName: integration.platformName,
          status: integration.status,
          lastSyncAt: integration.lastSyncAt,
          createdAt: integration.createdAt,
          isHealthy: !!isHealthy,
          syncStatus,
        };
      },
    );

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedIntegrations = integrationsWithStats.slice(
      startIndex,
      endIndex,
    );

    return {
      success: true,
      data: paginatedIntegrations,
      pagination: {
        page,
        limit,
        total: integrationsWithStats.length,
        totalPages: Math.ceil(integrationsWithStats.length / limit),
      },
    };
  }
}
