import { Injectable } from '@nestjs/common';
import type { CreateProductDto, Product } from '@synapse/shared-types';
import type { IProductRepository } from '../../domain/repositories';

@Injectable()
export class CreateProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(
    userId: string,
    data: CreateProductDto,
  ): Promise<Product | null> {
    if (!data.name?.trim()) {
      throw new Error('Product name is required and cannot be empty');
    }

    if (data.price !== undefined && data.price < 0) {
      throw new Error('Product price cannot be negative');
    }

    const validStatuses = ['active', 'inactive', 'draft'] as const;
    if (data.status && !validStatuses.includes(data.status as any)) {
      throw new Error(
        `Invalid product status. Valid statuses: ${validStatuses.join(', ')}`,
      );
    }

    const existingProduct = await this.productRepository.findByName(
      userId,
      data.name.trim(),
    );

    if (existingProduct) {
      throw new Error(
        `Product with name "${data.name}" already exists for this user`,
      );
    }

    return this.productRepository.create({
      userId,
      name: data.name.trim(),
      description: data.description?.trim(),
      price: data.price || 0,
      currency: data.currency || 'BRL',
      category: data.category?.trim(),
      status: data.status || 'draft',
      metadata: data.metadata || {},
    });
  }
}
