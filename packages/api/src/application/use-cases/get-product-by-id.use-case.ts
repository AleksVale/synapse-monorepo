import { Injectable, NotFoundException } from '@nestjs/common';
import type { Product } from '@synapse/shared-types';
import type { IProductRepository } from '../../domain/repositories';
import { ProductMapper } from '../../infrastructure/mappers/product.mapper';

@Injectable()
export class GetProductByIdUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(id: number, userId: number): Promise<Product> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    if (product.userId !== userId) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return ProductMapper.toDomain(product);
  }
}
