import type { CreateIntegrationDto as ICreateIntegrationDto } from '@synapse/shared-types';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateIntegrationDto implements ICreateIntegrationDto {
  @IsString({ message: 'Platform name must be a string' })
  @IsIn(['KIWIFY', 'EDUZZ', 'HOTMART', 'FACEBOOK_ADS', 'GOOGLE_ADS'], {
    message:
      'Platform must be one of: KIWIFY, EDUZZ, HOTMART, FACEBOOK_ADS, GOOGLE_ADS',
  })
  platformName: string;

  @IsOptional()
  @IsString({ message: 'API key must be a string' })
  @MinLength(10, { message: 'API key must be at least 10 characters long' })
  @MaxLength(500, { message: 'API key must not exceed 500 characters' })
  apiKey?: string;

  @IsString({ message: 'Status must be a string' })
  @IsIn(['active', 'inactive', 'error'], {
    message: 'Status must be one of: active, inactive, error',
  })
  status: string;

  @IsOptional()
  @IsInt({ message: 'User ID must be an integer' })
  userId?: number;
}
