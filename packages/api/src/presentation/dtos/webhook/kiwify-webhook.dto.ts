import type {
  KiwifyCommissions as IKiwifyCommissions,
  KiwifyCustomer as IKiwifyCustomer,
  KiwifyProduct as IKiwifyProduct,
  KiwifySubscription as IKiwifySubscription,
  KiwifyTrackingParameters as IKiwifyTrackingParameters,
  KiwifyWebhookPayload as IKiwifyWebhookPayload,
} from '@synapse/shared-types';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class KiwifyCustomerDto implements IKiwifyCustomer {
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsEmail({}, { message: 'Customer email must be valid' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  mobile?: string;

  @IsString()
  @IsOptional()
  CPF?: string;

  @IsString()
  @IsOptional()
  ip?: string;

  @IsString()
  @IsOptional()
  country?: string;
}

export class KiwifyProductDto implements IKiwifyProduct {
  @IsString()
  @IsNotEmpty()
  product_id: string;

  @IsString()
  @IsNotEmpty()
  product_name: string;
}

export class KiwifyCommissionedStoreDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  custom_name: string;

  @IsString()
  @IsNotEmpty()
  affiliate_id: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  value: string;
}

export class KiwifyCommissionsDto implements IKiwifyCommissions {
  @IsString()
  @IsNotEmpty()
  charge_amount: string;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsString()
  @IsNotEmpty()
  product_base_price: string;

  @IsString()
  @IsNotEmpty()
  product_base_price_currency: string;

  @IsString()
  @IsNotEmpty()
  kiwify_fee: string;

  @IsString()
  @IsNotEmpty()
  kiwify_fee_currency: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => KiwifyCommissionedStoreDto)
  @IsNotEmpty()
  commissioned_stores: KiwifyCommissionedStoreDto[];

  @IsString()
  @IsNotEmpty()
  my_commission: string;

  @IsString()
  @IsOptional()
  funds_status?: string;

  @IsString()
  @IsOptional()
  estimated_deposit_date?: string;

  @IsString()
  @IsOptional()
  deposit_date?: string;
}

export class KiwifyTrackingParametersDto implements IKiwifyTrackingParameters {
  @IsString()
  @IsOptional()
  src?: string;

  @IsString()
  @IsOptional()
  sck?: string;

  @IsString()
  @IsOptional()
  utm_source?: string;

  @IsString()
  @IsOptional()
  utm_medium?: string;

  @IsString()
  @IsOptional()
  utm_campaign?: string;

  @IsString()
  @IsOptional()
  utm_content?: string;

  @IsString()
  @IsOptional()
  utm_term?: string;
}

export class KiwifyCustomerAccessDto {
  @IsBoolean()
  @IsNotEmpty()
  has_access: boolean;

  @IsBoolean()
  @IsNotEmpty()
  active_period: boolean;

  @IsString()
  @IsNotEmpty()
  access_until: string;
}

export class KiwifySubscriptionPlanDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  frequency: string;

  @IsNumber()
  @IsNotEmpty()
  qty_charges: number;
}

export class KiwifyCompletedChargeDto {
  @IsString()
  @IsNotEmpty()
  order_id: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsNumber()
  @IsNotEmpty()
  installments: number;

  @IsString()
  @IsOptional()
  card_type?: string;

  @IsString()
  @IsOptional()
  card_last_digits?: string;

  @IsString()
  @IsOptional()
  card_first_digits?: string;

  @IsString()
  @IsNotEmpty()
  created_at: string;
}

export class KiwifyFutureChargeDto {
  @IsString()
  @IsNotEmpty()
  charge_date: string;
}

export class KiwifyChargesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => KiwifyCompletedChargeDto)
  @IsNotEmpty()
  completed: KiwifyCompletedChargeDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => KiwifyFutureChargeDto)
  @IsNotEmpty()
  future: KiwifyFutureChargeDto[];
}

export class KiwifySubscriptionDto implements IKiwifySubscription {
  @IsString()
  @IsNotEmpty()
  start_date: string;

  @IsString()
  @IsNotEmpty()
  next_payment: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsObject()
  @ValidateNested()
  @Type(() => KiwifyCustomerAccessDto)
  @IsNotEmpty()
  customer_access: KiwifyCustomerAccessDto;

  @IsObject()
  @ValidateNested()
  @Type(() => KiwifySubscriptionPlanDto)
  @IsNotEmpty()
  plan: KiwifySubscriptionPlanDto;

  @IsObject()
  @ValidateNested()
  @Type(() => KiwifyChargesDto)
  @IsNotEmpty()
  charges: KiwifyChargesDto;
}

export class KiwifyWebhookDto implements IKiwifyWebhookPayload {
  @IsString()
  @IsNotEmpty()
  order_id: string;

  @IsString()
  @IsNotEmpty()
  order_ref: string;

  @IsString()
  @IsNotEmpty()
  order_status: string;

  @IsString()
  @IsNotEmpty()
  payment_method: string;

  @IsString()
  @IsNotEmpty()
  store_id: string;

  @IsString()
  @IsNotEmpty()
  payment_merchant_id: string;

  @IsNumber()
  @IsNotEmpty()
  installments: number;

  @IsString()
  @IsOptional()
  card_type?: string;

  @IsString()
  @IsOptional()
  card_last4digits?: string;

  @IsString()
  @IsOptional()
  card_rejection_reason?: string;

  @IsString()
  @IsOptional()
  pix_code?: string;

  @IsString()
  @IsOptional()
  pix_expiration?: string;

  @IsString()
  @IsOptional()
  boleto_URL?: string;

  @IsString()
  @IsOptional()
  boleto_barcode?: string;

  @IsString()
  @IsOptional()
  boleto_expiry_date?: string;

  @IsString()
  @IsNotEmpty()
  sale_type: string;

  @IsString()
  @IsOptional()
  approved_date?: string;

  @IsString()
  @IsNotEmpty()
  created_at: string;

  @IsString()
  @IsNotEmpty()
  updated_at: string;

  @IsString()
  @IsNotEmpty()
  webhook_event_type: string;

  @IsString()
  @IsNotEmpty()
  product_type: string;

  @IsObject()
  @ValidateNested()
  @Type(() => KiwifyProductDto)
  @IsNotEmpty()
  Product: KiwifyProductDto;

  @IsObject()
  @ValidateNested()
  @Type(() => KiwifyCustomerDto)
  @IsNotEmpty()
  Customer: KiwifyCustomerDto;

  @IsObject()
  @ValidateNested()
  @Type(() => KiwifyCommissionsDto)
  @IsNotEmpty()
  Commissions: KiwifyCommissionsDto;

  @IsObject()
  @ValidateNested()
  @Type(() => KiwifyTrackingParametersDto)
  @IsNotEmpty()
  TrackingParameters: KiwifyTrackingParametersDto;

  @IsObject()
  @ValidateNested()
  @Type(() => KiwifySubscriptionDto)
  @IsOptional()
  Subscription?: KiwifySubscriptionDto;

  @IsString()
  @IsOptional()
  subscription_id?: string;

  @IsString()
  @IsNotEmpty()
  checkout_link: string;

  @IsString()
  @IsNotEmpty()
  access_url: string;
}
