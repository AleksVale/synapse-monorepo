import { Injectable } from '@nestjs/common';
import type { CreateProductDto, Product } from '@synapse/shared-types';
import type { IProductRepository } from '../../domain/repositories';
import { ProductMapper } from '../../infrastructure/mappers/product.mapper';

@Injectable()
export class CreateProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(userId: number, data: CreateProductDto): Promise<Product> {
    if (!data.name?.trim()) {
      throw new Error('Product name is required and cannot be empty');
    }

    if (data.price !== undefined && data.price < 0) {
      throw new Error('Product price cannot be negative');
    }

    const validStatuses = ['active', 'inactive', 'draft'] as const;
    if (data.status && !validStatuses.includes(data.status)) {
      throw new Error(
        `Invalid product status. Valid statuses: ${validStatuses.join(', ')}`,
      );
    }

    const existingProduct = await this.productRepository.findByName(
      data.name.trim(),
      userId,
    );

    if (existingProduct) {
      throw new Error(
        `Product with name "${data.name}" already exists for this user`,
      );
    }

    const createdProduct = await this.productRepository.create({
      userId,
      name: data.name.trim(),
      description: data.description?.trim(),
      price: data.price ?? 0,
      currency: data.currency ?? 'BRL',
      category: data.category?.trim(),
      status: data.status ?? 'draft',
      metadata: data.metadata ?? {},
    });

    return ProductMapper.toDomain(createdProduct);
  }
}
