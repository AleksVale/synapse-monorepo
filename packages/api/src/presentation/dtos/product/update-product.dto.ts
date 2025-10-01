import type { UpdateProductDto as IUpdateProductDto } from '@synapse/shared-types';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateProductDto implements IUpdateProductDto {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(255, { message: 'Name must not exceed 255 characters' })
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
