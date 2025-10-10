import type { Product } from 'generated/prisma';

export interface CreateProductData {
  userId?: number;
  name: string;
  description?: string;
}

export interface UpdateProductData {
  name?: string;
  description?: string;
}

export abstract class IProductRepository {
  abstract create(data: CreateProductData): Promise<Product>;
  abstract findById(id: number): Promise<Product | null>;
  abstract findByUserId(userId: number): Promise<Product[]>;
  abstract findByName(name: string, userId: number): Promise<Product | null>;
  abstract update(id: number, data: UpdateProductData): Promise<Product>;
  abstract softDelete(id: number): Promise<Product>;
  abstract count(userId: number): Promise<number>;
}
