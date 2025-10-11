import { Injectable, NotFoundException } from '@nestjs/common';
import type { Integration, UpdateIntegrationDto } from '@synapse/shared-types';
import type { IIntegrationRepository } from '../../domain/repositories';

@Injectable()
export class UpdateIntegrationUseCase {
  constructor(private readonly integrationRepository: IIntegrationRepository) {}

  async execute(
    integrationId: number,
    userId: number,
    data: UpdateIntegrationDto,
  ): Promise<Integration> {
    const integration =
      await this.integrationRepository.findById(integrationId);

    if (!integration) {
      throw new NotFoundException(
        `Integration with id ${integrationId} not found`,
      );
    }

    if (integration.userId !== userId) {
      throw new NotFoundException(
        'Integration not found or you do not have permission to access it',
      );
    }

    return this.integrationRepository.update(integrationId, data);
  }
}
