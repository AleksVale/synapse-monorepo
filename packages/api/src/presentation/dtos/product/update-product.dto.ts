import type { UpdateProductDto as IUpdateProductDto } from '@synapse/shared-types';
import {
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateProductDto implements IUpdateProductDto {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(255, { message: 'Name must not exceed 255 characters' })
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000, { message: 'Description must not exceed 5000 characters' })
  description?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Price must be a valid number' })
  @Min(0, { message: 'Price cannot be negative' })
  price?: number;

  @IsOptional()
  @IsString()
  @MaxLength(3, { message: 'Currency must not exceed 3 characters' })
  currency?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Category must not exceed 100 characters' })
  category?: string;

  @IsOptional()
  @IsEnum(['active', 'inactive', 'draft'], {
    message: 'Status must be one of: active, inactive, draft',
  })
  status?: 'active' | 'inactive' | 'draft';

  @IsOptional()
  @IsObject({ message: 'Metadata must be a valid object' })
  metadata?: Record<string, unknown>;
}
