import type { UpdateSaleDto as IUpdateSaleDto } from '@synapse/shared-types';
import { SaleStatus } from '@synapse/shared-types';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

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
