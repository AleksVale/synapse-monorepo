import { Injectable } from '@nestjs/common';
import type { Product } from 'generated/prisma';
import { PrismaService } from '../database/prisma.service';

export interface CreateProductData {
  userId?: number;
  name: string;
  description?: string;
}

export interface UpdateProductData {
  name?: string;
  description?: string;
}

@Injectable()
export class ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProductData): Promise<Product> {
    return this.prisma.product.create({
      data: {
        userId: data.userId,
        name: data.name,
        description: data.description,
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
}
