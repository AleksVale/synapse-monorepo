import type {
  CreateAdCampaignDto as ICreateAdCampaignDto,
  CreateAuditLogDto as ICreateAuditLogDto,
  CreateDailyAdMetricDto as ICreateDailyAdMetricDto,
  CreateIntegrationDto as ICreateIntegrationDto,
  CreateProductDto as ICreateProductDto,
  CreateRoleDto as ICreateRoleDto,
  CreateSaleDto as ICreateSaleDto,
  CreateUserDto as ICreateUserDto,
  LoginDto as ILoginDto,
  UpdateAdCampaignDto as IUpdateAdCampaignDto,
  UpdateDailyAdMetricDto as IUpdateDailyAdMetricDto,
  UpdateIntegrationDto as IUpdateIntegrationDto,
  UpdateProductDto as IUpdateProductDto,
  UpdateRoleDto as IUpdateRoleDto,
  UpdateSaleDto as IUpdateSaleDto,
  UpdateUserDto as IUpdateUserDto,
} from '@synapse/shared-types';
import { SaleStatus } from '@synapse/shared-types';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

// ============= AUTH DTOs =============
export class LoginDto implements ILoginDto {
  @IsEmail({}, { message: 'Email must be valid' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;
}

// ============= ROLE DTOs =============
export class CreateRoleDto implements ICreateRoleDto {
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Name must not exceed 50 characters' })
  name: string;
}

export class UpdateRoleDto implements IUpdateRoleDto {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Name must not exceed 50 characters' })
  name?: string;
}

// ============= USER DTOs =============
export class CreateUserDto implements ICreateUserDto {
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(255, { message: 'Name must not exceed 255 characters' })
  name: string;

  @IsEmail({}, { message: 'Email must be valid' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(100, { message: 'Password must not exceed 100 characters' })
  password: string;

  @IsOptional()
  @IsInt({ message: 'Role ID must be an integer' })
  roleId?: number;
}

export class UpdateUserDto implements IUpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(255, { message: 'Name must not exceed 255 characters' })
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email must be valid' })
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(100, { message: 'Password must not exceed 100 characters' })
  password?: string;

  @IsOptional()
  @IsInt({ message: 'Role ID must be an integer' })
  roleId?: number;
}

// ============= PRODUCT DTOs =============
export class CreateProductDto implements ICreateProductDto {
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(255, { message: 'Name must not exceed 255 characters' })
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt({ message: 'User ID must be an integer' })
  userId?: number;
}

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

// ============= INTEGRATION DTOs =============
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

// ============= AD CAMPAIGN DTOs =============
export class CreateAdCampaignDto implements ICreateAdCampaignDto {
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

  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(255, { message: 'Name must not exceed 255 characters' })
  name: string;

  @IsOptional()
  @IsInt({ message: 'User ID must be an integer' })
  userId?: number;
}

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

// ============= DAILY AD METRIC DTOs =============
export class CreateDailyAdMetricDto implements ICreateDailyAdMetricDto {
  @IsOptional()
  @IsInt({ message: 'Campaign ID must be an integer' })
  campaignId?: number;

  @IsDate({ message: 'Date must be a valid date' })
  date: Date;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Spend must be a valid number with up to 2 decimal places' },
  )
  @Min(0, { message: 'Spend must be at least 0' })
  spend: number;

  @IsInt({ message: 'Clicks must be an integer' })
  @Min(0, { message: 'Clicks must be at least 0' })
  clicks: number;

  @IsInt({ message: 'Impressions must be an integer' })
  @Min(0, { message: 'Impressions must be at least 0' })
  impressions: number;

  @IsInt({ message: 'Conversions must be an integer' })
  @Min(0, { message: 'Conversions must be at least 0' })
  conversions: number;

  @IsOptional()
  @IsInt({ message: 'User ID must be an integer' })
  userId?: number;
}

export class UpdateDailyAdMetricDto implements IUpdateDailyAdMetricDto {
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Spend must be a valid number with up to 2 decimal places' },
  )
  @Min(0, { message: 'Spend must be at least 0' })
  spend?: number;

  @IsOptional()
  @IsInt({ message: 'Clicks must be an integer' })
  @Min(0, { message: 'Clicks must be at least 0' })
  clicks?: number;

  @IsOptional()
  @IsInt({ message: 'Impressions must be an integer' })
  @Min(0, { message: 'Impressions must be at least 0' })
  impressions?: number;

  @IsOptional()
  @IsInt({ message: 'Conversions must be an integer' })
  @Min(0, { message: 'Conversions must be at least 0' })
  conversions?: number;
}

// ============= SALE DTOs =============
export class CreateSaleDto implements ICreateSaleDto {
  @IsOptional()
  @IsInt({ message: 'Product ID must be an integer' })
  productId?: number;

  @IsOptional()
  @IsInt({ message: 'Integration ID must be an integer' })
  integrationId?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255, {
    message: 'Platform sale ID must not exceed 255 characters',
  })
  platformSaleId?: string;

  @IsEnum(SaleStatus, { message: 'Status must be a valid sale status' })
  status: SaleStatus;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Amount must be a valid number with up to 2 decimal places' },
  )
  @Min(0, { message: 'Amount must be at least 0' })
  amount: number;

  @IsString()
  @MaxLength(10, { message: 'Currency must not exceed 10 characters' })
  currency: string;

  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'Customer name must not exceed 255 characters' })
  customerName?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Customer email must be valid' })
  customerEmail?: string;

  @IsOptional()
  @IsDate({ message: 'Sale date must be a valid date' })
  saleDate?: Date;
}

export class UpdateSaleDto implements IUpdateSaleDto {
  @IsOptional()
  @IsEnum(SaleStatus, { message: 'Status must be a valid sale status' })
  status?: SaleStatus;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Amount must be a valid number with up to 2 decimal places' },
  )
  @Min(0, { message: 'Amount must be at least 0' })
  amount?: number;

  @IsOptional()
  @IsString()
  @MaxLength(10, { message: 'Currency must not exceed 10 characters' })
  currency?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'Customer name must not exceed 255 characters' })
  customerName?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Customer email must be valid' })
  customerEmail?: string;

  @IsOptional()
  @IsDate({ message: 'Sale date must be a valid date' })
  saleDate?: Date;
}

// ============= AUDIT LOG DTOs =============
export class CreateAuditLogDto implements ICreateAuditLogDto {
  @IsOptional()
  @IsInt({ message: 'User ID must be an integer' })
  userId?: number;

  @IsString()
  @MaxLength(255, { message: 'Action must not exceed 255 characters' })
  action: string;

  @IsOptional()
  @IsString()
  details?: string;
}
