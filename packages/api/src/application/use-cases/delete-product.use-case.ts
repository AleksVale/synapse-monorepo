import { Injectable, NotFoundException } from '@nestjs/common';
import type { IProductRepository } from '../../domain/repositories';

@Injectable()
export class DeleteProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(id: number, userId: number): Promise<void> {
    const existingProduct = await this.productRepository.findById(id);

    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    if (existingProduct.userId !== userId) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    await this.productRepository.softDelete(id);
  }
}
