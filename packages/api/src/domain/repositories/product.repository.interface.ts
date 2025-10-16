import type { Product } from 'generated/prisma';

export interface CreateProductData {
  userId?: number;
  name: string;
  description?: string;
  price?: number;
  currency?: string;
  category?: string;
  status?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  currency?: string;
  category?: string;
  status?: string;
  metadata?: Record<string, unknown>;
}

export abstract class IProductRepository {
  abstract create(data: CreateProductData): Promise<Product>;
  abstract findById(id: number): Promise<Product | null>;
  abstract findByUserId(userId: number): Promise<Product[]>;
  abstract findByName(name: string, userId: number): Promise<Product | null>;
  abstract update(id: number, data: UpdateProductData): Promise<Product>;
  abstract softDelete(id: number): Promise<Product>;
  abstract count(userId: number): Promise<number>;
  abstract findPaginated(
    userId: number,
    page: number,
    limit: number,
  ): Promise<{ products: Product[]; total: number }>;
}
