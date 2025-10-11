import { Injectable } from '@nestjs/common';
import type { CreateIntegrationDto, Integration } from '@synapse/shared-types';
import type { IIntegrationRepository } from '../../domain/repositories';

@Injectable()
export class CreateIntegrationUseCase {
  constructor(private readonly integrationRepository: IIntegrationRepository) {}

  async execute(
    userId: number,
    data: CreateIntegrationDto,
  ): Promise<Integration | null> {
    const supportedPlatforms = [
      'KIWIFY',
      'EDUZZ',
      'HOTMART',
      'FACEBOOK_ADS',
      'GOOGLE_ADS',
    ];

    if (!supportedPlatforms.includes(data.platformName)) {
      throw new Error(
        `Platform ${data.platformName} is not supported. Supported platforms: ${supportedPlatforms.join(', ')}`,
      );
    }

    const existingIntegration = await this.integrationRepository.findByPlatform(
      userId,
      data.platformName,
    );

    if (existingIntegration) {
      throw new Error(
        `Integration with ${data.platformName} already exists for this user`,
      );
    }

    return this.integrationRepository.create({
      userId,
      platformName: data.platformName,
      apiKey: data.apiKey,
      status: data.status || 'active',
    });
  }
}
