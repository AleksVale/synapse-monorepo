import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class HotmartBuyerDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  checkout_phone?: string;
}

export class HotmartProductDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;
}

export class HotmartPaymentDto {
  @IsString()
  type: string;
}

export class HotmartPriceDto {
  @IsNumber()
  value: number;

  @IsString()
  currency_code: string;
}

export class HotmartPurchaseDto {
  @IsNumber()
  order_date: number;

  @IsOptional()
  @IsNumber()
  approved_date?: number;

  @IsString()
  status: string;

  @IsString()
  transaction: string;

  @ValidateNested()
  @Type(() => HotmartPaymentDto)
  payment: HotmartPaymentDto;

  @ValidateNested()
  @Type(() => HotmartPriceDto)
  price: HotmartPriceDto;
}

export class HotmartDataDto {
  @ValidateNested()
  @Type(() => HotmartProductDto)
  product: HotmartProductDto;

  @ValidateNested()
  @Type(() => HotmartBuyerDto)
  buyer: HotmartBuyerDto;

  @ValidateNested()
  @Type(() => HotmartPurchaseDto)
  purchase: HotmartPurchaseDto;
}

export class HotmartWebhookDto {
  @IsString()
  event: string;

  @IsString()
  version: string;

  @ValidateNested()
  @Type(() => HotmartDataDto)
  data: HotmartDataDto;
}
