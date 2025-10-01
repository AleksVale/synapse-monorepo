import type { CreateIntegrationDto as ICreateIntegrationDto } from '@synapse/shared-types';
import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateIntegrationDto implements ICreateIntegrationDto {
  @IsString()
  @MinLength(2, { message: 'Platform name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Platform name must not exceed 100 characters' })
  platformName: string;

  @IsOptional()
  @IsString()
  apiKey?: string;

  @IsString()
  @MaxLength(50, { message: 'Status must not exceed 50 characters' })
  status: string;

  @IsOptional()
  @IsInt({ message: 'User ID must be an integer' })
  userId?: number;
}
