import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IIntegrationRepository } from '../../domain/repositories';

@Injectable()
export class DeleteIntegrationUseCase {
  constructor(
    @Inject(IIntegrationRepository)
    private readonly integrationRepository: IIntegrationRepository,
  ) {}

  async execute(integrationId: number, userId: number): Promise<void> {
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

    await this.integrationRepository.delete(integrationId);
  }
}
