import { Module } from '@nestjs/common';
import {
  CreateProductUseCase,
  DeleteProductUseCase,
  GetProductByIdUseCase,
  ListProductsUseCase,
  UpdateProductUseCase,
} from '../../application/use-cases';
import { IProductRepository } from '../../domain/repositories';
import { ProductRepository } from '../../infrastructure/repositories';
import { ProductController } from '../controllers/product.controller';

@Module({
  providers: [
    {
      provide: IProductRepository,
      useClass: ProductRepository,
    },
    CreateProductUseCase,
    ListProductsUseCase,
    GetProductByIdUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
  ],
  controllers: [ProductController],
  exports: [
    CreateProductUseCase,
    ListProductsUseCase,
    GetProductByIdUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
  ],
})
export class ProductModule {}
