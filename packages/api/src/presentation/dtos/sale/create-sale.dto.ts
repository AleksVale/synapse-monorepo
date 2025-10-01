import type { CreateSaleDto as ICreateSaleDto } from '@synapse/shared-types';
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
} from 'class-validator';

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
