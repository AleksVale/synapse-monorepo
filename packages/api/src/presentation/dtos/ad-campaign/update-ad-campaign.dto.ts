import type { UpdateAdCampaignDto as IUpdateAdCampaignDto } from '@synapse/shared-types';
import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateAdCampaignDto implements IUpdateAdCampaignDto {
  @IsOptional()
  @IsInt({ message: 'Integration ID must be an integer' })
  integrationId?: number;

  @IsOptional()
  @IsInt({ message: 'Product ID must be an integer' })
  productId?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255, {
    message: 'Platform campaign ID must not exceed 255 characters',
  })
  platformCampaignId?: string;

  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(255, { message: 'Name must not exceed 255 characters' })
  name?: string;
}
