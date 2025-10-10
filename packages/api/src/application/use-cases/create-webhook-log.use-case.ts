import { Injectable } from '@nestjs/common';

import type { WebhookLog } from 'generated/prisma';
import type {
  CreateWebhookLogData,
  IWebhookLogRepository,
} from '../../domain/repositories';

@Injectable()
export class CreateWebhookLogUseCase {
  constructor(private readonly repository: IWebhookLogRepository) {}

  async execute(data: CreateWebhookLogData): Promise<WebhookLog> {
    return this.repository.create(data);
  }
}
