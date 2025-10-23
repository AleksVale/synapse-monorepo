import { Inject, Injectable } from '@nestjs/common';
import type { Product } from '@synapse/shared-types';
import { IProductRepository } from '../../domain/repositories';
import { ProductMapper } from '../../infrastructure/mappers/product.mapper';

@Injectable()
export class ListProductsUseCase {
  constructor(
    @Inject(IProductRepository)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(
    userId: number,
    page = 1,
    limit = 10,
  ): Promise<{ products: Product[]; total: number; totalPages: number }> {
    if (page < 1) {
      throw new Error('Page must be greater than or equal to 1');
    }

    if (limit < 1 || limit > 100) {
      throw new Error('Limit must be between 1 and 100');
    }

    const { products, total } = await this.productRepository.findPaginated(
      userId,
      page,
      limit,
    );

    const totalPages = Math.ceil(total / limit);

    return {
      products: ProductMapper.toDomainList(products),
      total,
      totalPages,
    };
  }
}
