import type { UpdateIntegrationDto as IUpdateIntegrationDto } from '@synapse/shared-types';
import {
  IsDate,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateIntegrationDto implements IUpdateIntegrationDto {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Platform name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Platform name must not exceed 100 characters' })
  platformName?: string;

  @IsOptional()
  @IsString()
  apiKey?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'Status must not exceed 50 characters' })
  status?: string;

  @IsOptional()
  @IsDate({ message: 'Last sync date must be a valid date' })
  lastSyncAt?: Date;
}
