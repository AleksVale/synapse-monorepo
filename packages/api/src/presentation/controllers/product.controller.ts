import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import type { ApiResponse, Product } from '@synapse/shared-types';
import {
  CreateProductUseCase,
  DeleteProductUseCase,
  GetProductByIdUseCase,
  ListProductsUseCase,
  UpdateProductUseCase,
} from '../../application/use-cases';
import { JwtAuthGuard } from '../../infrastructure/auth/jwt-auth.guard';
import { CreateProductDto, UpdateProductDto } from '../dtos';

interface AuthenticatedRequest extends Request {
  user: {
    userId: number;
    email: string;
  };
}

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly listProductsUseCase: ListProductsUseCase,
    private readonly getProductByIdUseCase: GetProductByIdUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
  ) {}

  @Get()
  async listProducts(
    @Request() req: AuthenticatedRequest,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<
    ApiResponse<Product[]> & {
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }
  > {
    try {
      const { products, total, totalPages } =
        await this.listProductsUseCase.execute(
          req.user.userId,
          Number(page),
          Number(limit),
        );

      return {
        success: true,
        data: products,
        message: 'Products retrieved successfully',
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to retrieve products',
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: 0,
          totalPages: 0,
        },
      };
    }
  }

  @Get(':id')
  async getProductById(
    @Request() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<Product>> {
    try {
      const product = await this.getProductByIdUseCase.execute(
        id,
        req.user.userId,
      );

      return {
        success: true,
        data: product,
        message: 'Product retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to retrieve product',
      };
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createProduct(
    @Request() req: AuthenticatedRequest,
    @Body() createProductDto: CreateProductDto,
  ): Promise<ApiResponse<Product>> {
    try {
      const product = await this.createProductUseCase.execute(
        req.user.userId,
        createProductDto,
      );

      return {
        success: true,
        data: product,
        message: 'Product created successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to create product',
      };
    }
  }

  @Put(':id')
  async updateProduct(
    @Request() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ApiResponse<Product>> {
    try {
      const product = await this.updateProductUseCase.execute(
        id,
        req.user.userId,
        updateProductDto,
      );

      return {
        success: true,
        data: product,
        message: 'Product updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to update product',
      };
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProduct(
    @Request() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    await this.deleteProductUseCase.execute(id, req.user.userId);
  }
}
