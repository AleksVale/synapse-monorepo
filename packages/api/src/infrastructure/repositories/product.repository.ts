import { Injectable } from '@nestjs/common';
import type { Product } from 'generated/prisma';
import {
  IProductRepository,
  type CreateProductData,
  type UpdateProductData,
} from '../../domain/repositories';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProductData): Promise<Product> {
    return this.prisma.product.create({
      data: {
        userId: data.userId,
        name: data.name,
        description: data.description,
        price: data.price,
        currency: data.currency ?? 'BRL',
        category: data.category,
        status: data.status ?? 'draft',
        metadata: data.metadata as any,
      },
    });
  }

  async findById(id: number): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { id, deletedAt: null },
    });
  }

  async findByUserId(userId: number): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: { userId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByName(name: string, userId: number): Promise<Product | null> {
    return this.prisma.product.findFirst({
      where: { name, userId, deletedAt: null },
    });
  }

  async update(id: number, data: UpdateProductData): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        currency: data.currency,
        category: data.category,
        status: data.status,
        metadata: data.metadata as any,
      },
    });
  }

  async softDelete(id: number): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async count(userId: number): Promise<number> {
    return this.prisma.product.count({
      where: { userId, deletedAt: null },
    });
  }

  async findPaginated(
    userId: number,
    page: number,
    limit: number,
  ): Promise<{ products: Product[]; total: number }> {
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where: { userId, deletedAt: null },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.product.count({
        where: { userId, deletedAt: null },
      }),
    ]);

    return { products, total };
  }
}
