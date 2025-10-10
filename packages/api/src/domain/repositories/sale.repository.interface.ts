import type { Sale, SaleStatus } from 'generated/prisma';

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

export abstract class ISaleRepository {
  abstract create(data: CreateSaleData): Promise<Sale>;
  abstract findById(id: number): Promise<Sale | null>;
  abstract findByPlatformSaleId(
    platformSaleId: string,
    integrationId: number,
  ): Promise<Sale | null>;
  abstract findByProduct(productId: number, limit?: number): Promise<Sale[]>;
  abstract findByIntegration(
    integrationId: number,
    limit?: number,
  ): Promise<Sale[]>;
  abstract findByStatus(status: SaleStatus, limit?: number): Promise<Sale[]>;
  abstract update(id: number, data: UpdateSaleData): Promise<Sale>;
  abstract delete(id: number): Promise<Sale>;
  abstract countByStatus(status: SaleStatus): Promise<number>;
  abstract getTotalRevenue(integrationId?: number): Promise<number>;
}
