import { Injectable } from '@nestjs/common';
import type { Sale, SaleStatus } from 'generated/prisma';
import { PrismaService } from '../database/prisma.service';

export interface CreateSaleData {
  productId?: number;
  integrationId?: number;
  platformSaleId?: string;
  status: SaleStatus;
  amount: number;
  currency: string;
  customerName?: string;
  customerEmail?: string;
  saleDate?: Date;
}

export interface UpdateSaleData {
  status?: SaleStatus;
  amount?: number;
  currency?: string;
  customerName?: string;
  customerEmail?: string;
  saleDate?: Date;
}

@Injectable()
export class SaleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateSaleData): Promise<Sale> {
    return this.prisma.sale.create({
      data: {
        productId: data.productId,
        integrationId: data.integrationId,
        platformSaleId: data.platformSaleId,
        status: data.status,
        amount: data.amount,
        currency: data.currency,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        saleDate: data.saleDate,
      },
    });
  }

  async findById(id: number): Promise<Sale | null> {
    return this.prisma.sale.findUnique({
      where: { id },
      include: { product: true },
    });
  }

  async findByPlatformSaleId(
    platformSaleId: string,
    integrationId: number,
  ): Promise<Sale | null> {
    return this.prisma.sale.findFirst({
      where: {
        platformSaleId,
        integrationId,
      },
    });
  }

  async findByProduct(productId: number, limit = 100): Promise<Sale[]> {
    return this.prisma.sale.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async findByIntegration(integrationId: number, limit = 100): Promise<Sale[]> {
    return this.prisma.sale.findMany({
      where: { integrationId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async findByStatus(status: SaleStatus, limit = 100): Promise<Sale[]> {
    return this.prisma.sale.findMany({
      where: { status },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async update(id: number, data: UpdateSaleData): Promise<Sale> {
    return this.prisma.sale.update({
      where: { id },
      data: {
        status: data.status,
        amount: data.amount,
        currency: data.currency,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        saleDate: data.saleDate,
      },
    });
  }

  async delete(id: number): Promise<Sale> {
    return this.prisma.sale.delete({
      where: { id },
    });
  }

  async countByStatus(status: SaleStatus): Promise<number> {
    return this.prisma.sale.count({
      where: { status },
    });
  }

  async getTotalRevenue(integrationId?: number): Promise<number> {
    const result = await this.prisma.sale.aggregate({
      where: {
        integrationId,
        status: 'CONFIRMED',
      },
      _sum: {
        amount: true,
      },
    });

    return result._sum.amount?.toNumber() ?? 0;
  }
}
