import { Injectable } from '@nestjs/common';
import type {
  IntegrationPlatform,
  WebhookLog,
  WebhookStatus,
} from 'generated/prisma';
import {
  IWebhookLogRepository,
  type CreateWebhookLogData,
  type UpdateWebhookLogData,
} from '../../domain/repositories';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class WebhookLogRepository implements IWebhookLogRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateWebhookLogData): Promise<WebhookLog> {
    return this.prisma.webhookLog.create({
      data: {
        integrationId: data.integrationId,
        platform: data.platform,
        eventType: data.eventType,
        payload: data.payload,
        status: data.status,
        errorMessage: data.errorMessage,
        processedAt: data.processedAt,
      },
    });
  }

  async findById(id: number): Promise<WebhookLog | null> {
    return this.prisma.webhookLog.findUnique({
      where: { id },
    });
  }

  async findByIntegration(
    integrationId: number,
    limit = 100,
  ): Promise<WebhookLog[]> {
    return this.prisma.webhookLog.findMany({
      where: { integrationId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async findByPlatform(
    platform: IntegrationPlatform,
    limit = 100,
  ): Promise<WebhookLog[]> {
    return this.prisma.webhookLog.findMany({
      where: { platform },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async findByStatus(
    status: WebhookStatus,
    limit = 100,
  ): Promise<WebhookLog[]> {
    return this.prisma.webhookLog.findMany({
      where: { status },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async findFailedLogs(limit = 100): Promise<WebhookLog[]> {
    return this.prisma.webhookLog.findMany({
      where: { status: 'FAILED' },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async update(id: number, data: UpdateWebhookLogData): Promise<WebhookLog> {
    return this.prisma.webhookLog.update({
      where: { id },
      data: {
        status: data.status,
        errorMessage: data.errorMessage,
        processedAt: data.processedAt,
      },
    });
  }

  async countByStatus(status: WebhookStatus): Promise<number> {
    return this.prisma.webhookLog.count({
      where: { status },
    });
  }

  async countByPlatform(platform: IntegrationPlatform): Promise<number> {
    return this.prisma.webhookLog.count({
      where: { platform },
    });
  }

  async deleteOlderThan(days: number): Promise<number> {
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - days);

    const result = await this.prisma.webhookLog.deleteMany({
      where: {
        createdAt: {
          lt: dateThreshold,
        },
      },
    });

    return result.count;
  }
}
