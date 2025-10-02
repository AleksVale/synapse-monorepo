import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class KiwifyCustomerDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  cpf?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

export class KiwifyProductDto {
  @IsString()
  id: string;

  @IsString()
  name: string;
}

export class KiwifyWebhookDto {
  @IsString()
  event: string;

  @IsString()
  order_id: string;

  @IsString()
  order_ref: string;

  @ValidateNested()
  @Type(() => KiwifyProductDto)
  product: KiwifyProductDto;

  @ValidateNested()
  @Type(() => KiwifyCustomerDto)
  customer: KiwifyCustomerDto;

  @IsString()
  payment_method: string;

  @IsOptional()
  @IsString()
  approved_date?: string;

  @IsNumber()
  amount: number;

  @IsString()
  currency: string;

  @IsString()
  status: string;
}
