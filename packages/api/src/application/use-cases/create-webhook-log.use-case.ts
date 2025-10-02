import { Injectable } from '@nestjs/common';

import type { WebhookLog } from 'generated/prisma';
import type { CreateWebhookLogData } from '../../infrastructure/repositories/webhook-log.repository';
import { WebhookLogRepository } from '../../infrastructure/repositories/webhook-log.repository';

@Injectable()
export class CreateWebhookLogUseCase {
  constructor(private readonly repository: WebhookLogRepository) {}

  async execute(data: CreateWebhookLogData): Promise<WebhookLog> {
    return this.repository.create(data);
  }
}
