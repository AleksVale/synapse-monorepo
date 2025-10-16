import type { Product } from 'generated/prisma';

export interface CreateProductData {
  userId: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  category?: string;
  status: string;
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
  abstract findById(id: string): Promise<Product | null>;
  abstract findByUserId(userId: string): Promise<Product[]>;
  abstract findByName(userId: string, name: string): Promise<Product | null>;
  abstract update(id: string, data: UpdateProductData): Promise<Product>;
  abstract softDelete(id: string): Promise<Product>;
  abstract count(userId: string): Promise<number>;
}
