import { Injectable } from '@nestjs/common';
import type { Integration } from 'generated/prisma';
import {
  IIntegrationRepository,
  type CreateIntegrationData,
  type UpdateIntegrationData,
} from '../../domain/repositories';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class IntegrationRepository implements IIntegrationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<Integration | null> {
    return this.prisma.integration.findUnique({
      where: { id },
    });
  }

  async findByUserId(userId: number): Promise<Integration[]> {
    return this.prisma.integration.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByPlatform(
    userId: number,
    platformName: string,
  ): Promise<Integration | null> {
    return this.prisma.integration.findFirst({
      where: { userId, platformName },
    });
  }

  async create(data: CreateIntegrationData): Promise<Integration> {
    return this.prisma.integration.create({
      data: {
        userId: data.userId,
        platformName: data.platformName,
        apiKey: data.apiKey,
        status: data.status,
        lastSyncAt: data.lastSyncAt,
      },
    });
  }

  async update(id: number, data: UpdateIntegrationData): Promise<Integration> {
    return this.prisma.integration.update({
      where: { id },
      data: {
        platformName: data.platformName,
        apiKey: data.apiKey,
        status: data.status,
        lastSyncAt: data.lastSyncAt,
      },
    });
  }

  async updateLastSync(id: number, lastSyncAt: Date): Promise<Integration> {
    return this.prisma.integration.update({
      where: { id },
      data: { lastSyncAt },
    });
  }

  async delete(id: number): Promise<Integration> {
    return this.prisma.integration.delete({
      where: { id },
    });
  }

  async countByUser(userId: number): Promise<number> {
    return this.prisma.integration.count({
      where: { userId },
    });
  }

  async findActiveIntegrations(): Promise<Integration[]> {
    return this.prisma.integration.findMany({
      where: { status: 'active' },
    });
  }
}
