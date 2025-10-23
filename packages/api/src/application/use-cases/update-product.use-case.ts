import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { Product, UpdateProductDto } from '@synapse/shared-types';
import { IProductRepository } from '../../domain/repositories';
import { ProductMapper } from '../../infrastructure/mappers/product.mapper';

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject(IProductRepository)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(
    id: number,
    userId: number,
    data: UpdateProductDto,
  ): Promise<Product> {
    const existingProduct = await this.productRepository.findById(id);

    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    if (existingProduct.userId !== userId) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    if (data.name) {
      const trimmedName = data.name.trim();
      if (!trimmedName) {
        throw new Error('Product name cannot be empty');
      }

      const productWithSameName = await this.productRepository.findByName(
        trimmedName,
        userId,
      );

      if (productWithSameName && productWithSameName.id !== id) {
        throw new Error(
          `Product with name "${trimmedName}" already exists for this user`,
        );
      }

      data.name = trimmedName;
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

    const updatedProduct = await this.productRepository.update(id, {
      name: data.name,
      description: data.description?.trim(),
      price: data.price,
      currency: data.currency,
      category: data.category?.trim(),
      status: data.status,
      metadata: data.metadata,
    });

    return ProductMapper.toDomain(updatedProduct);
  }
}
