import type {
  HotmartAffiliate as IHotmartAffiliate,
  HotmartBuyer as IHotmartBuyer,
  HotmartCommission as IHotmartCommission,
  HotmartProducer as IHotmartProducer,
  HotmartProduct as IHotmartProduct,
  HotmartPurchase as IHotmartPurchase,
  HotmartSubscription as IHotmartSubscription,
  HotmartWebhookData as IHotmartWebhookData,
  HotmartWebhookPayload as IHotmartWebhookPayload,
} from '@synapse/shared-types';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class HotmartAddressDto {
  @IsString()
  @IsNotEmpty()
  zipcode: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  number: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  neighborhood: string;

  @IsString()
  @IsOptional()
  complement?: string;

  @IsString()
  @IsNotEmpty()
  country_iso: string;
}

export class HotmartBuyerDto implements IHotmartBuyer {
  @IsEmail({}, { message: 'Buyer email must be valid' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsString()
  @IsNotEmpty()
  checkout_phone: string;

  @IsString()
  @IsNotEmpty()
  checkout_phone_code: string;

  @IsString()
  @IsNotEmpty()
  document: string;

  @IsString()
  @IsNotEmpty()
  document_type: string;

  @IsObject()
  @ValidateNested()
  @Type(() => HotmartAddressDto)
  @IsNotEmpty()
  address: HotmartAddressDto;
}

export class HotmartProductContentItemDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  ucode: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  @IsNotEmpty()
  is_physical_product: boolean;
}

export class HotmartProductContentDto {
  @IsBoolean()
  @IsNotEmpty()
  has_physical_products: boolean;

  @ValidateNested({ each: true })
  @Type(() => HotmartProductContentItemDto)
  @IsNotEmpty()
  products: HotmartProductContentItemDto[];
}

export class HotmartProductDto implements IHotmartProduct {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  ucode: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  @IsNotEmpty()
  has_co_production: boolean;

  @IsString()
  @IsOptional()
  warranty_date?: string;

  @IsString()
  @IsOptional()
  support_email?: string;

  @IsBoolean()
  @IsNotEmpty()
  is_physical_product: boolean;

  @IsObject()
  @ValidateNested()
  @Type(() => HotmartProductContentDto)
  @IsOptional()
  content?: HotmartProductContentDto;
}

export class HotmartAffiliateDto implements IHotmartAffiliate {
  @IsString()
  @IsNotEmpty()
  affiliate_code: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}

export class HotmartProducerDto implements IHotmartProducer {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  legal_nature: string;

  @IsString()
  @IsNotEmpty()
  document: string;
}

export class HotmartCurrencyConversionDto {
  @IsNumber()
  @IsNotEmpty()
  converted_value: number;

  @IsString()
  @IsNotEmpty()
  converted_to_currency: string;

  @IsNumber()
  @IsNotEmpty()
  conversion_rate: number;
}

export class HotmartCommissionDto implements IHotmartCommission {
  @IsNumber()
  @IsNotEmpty()
  value: number;

  @IsString()
  @IsNotEmpty()
  currency_value: string;

  @IsString()
  @IsNotEmpty()
  source: string;

  @IsObject()
  @ValidateNested()
  @Type(() => HotmartCurrencyConversionDto)
  @IsOptional()
  currency_conversion?: HotmartCurrencyConversionDto;
}

export class HotmartPriceDto {
  @IsNumber()
  @IsNotEmpty()
  value: number;

  @IsString()
  @IsNotEmpty()
  currency_value: string;
}

export class HotmartOfferDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsOptional()
  coupon_code?: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class HotmartCheckoutCountryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  iso: string;
}

export class HotmartOriginDto {
  @IsString()
  @IsOptional()
  xcod?: string;
}

export class HotmartOrderBumpDto {
  @IsBoolean()
  @IsNotEmpty()
  is_order_bump: boolean;

  @IsString()
  @IsOptional()
  parent_purchase_transaction?: string;
}

export class HotmartPaymentDto {
  @IsString()
  @IsOptional()
  billet_barcode?: string;

  @IsString()
  @IsOptional()
  billet_url?: string;

  @IsNumber()
  @IsOptional()
  installments_number?: number;

  @IsString()
  @IsOptional()
  pix_code?: string;

  @IsNumber()
  @IsOptional()
  pix_expiration_date?: number;

  @IsString()
  @IsOptional()
  pix_qrcode?: string;

  @IsString()
  @IsOptional()
  refusal_reason?: string;

  @IsString()
  @IsNotEmpty()
  type: string;
}

export class HotmartEventTicketsDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}

export class HotmartPurchaseDto implements IHotmartPurchase {
  @IsNumber()
  @IsOptional()
  approved_date?: number;

  @IsObject()
  @ValidateNested()
  @Type(() => HotmartPriceDto)
  @IsNotEmpty()
  full_price: HotmartPriceDto;

  @IsObject()
  @ValidateNested()
  @Type(() => HotmartPriceDto)
  @IsOptional()
  original_offer_price?: HotmartPriceDto;

  @IsObject()
  @ValidateNested()
  @Type(() => HotmartPriceDto)
  @IsNotEmpty()
  price: HotmartPriceDto;

  @IsObject()
  @ValidateNested()
  @Type(() => HotmartOfferDto)
  @IsOptional()
  offer?: HotmartOfferDto;

  @IsNumber()
  @IsOptional()
  recurrence_number?: number;

  @IsBoolean()
  @IsOptional()
  subscription_anticipation_purchase?: boolean;

  @IsObject()
  @ValidateNested()
  @Type(() => HotmartCheckoutCountryDto)
  @IsNotEmpty()
  checkout_country: HotmartCheckoutCountryDto;

  @IsObject()
  @ValidateNested()
  @Type(() => HotmartOriginDto)
  @IsOptional()
  origin?: HotmartOriginDto;

  @IsObject()
  @ValidateNested()
  @Type(() => HotmartOrderBumpDto)
  @IsOptional()
  order_bump?: HotmartOrderBumpDto;

  @IsString()
  @IsNotEmpty()
  order_date: string;

  @IsNumber()
  @IsOptional()
  date_next_charge?: number;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsNotEmpty()
  transaction: string;

  @IsObject()
  @ValidateNested()
  @Type(() => HotmartPaymentDto)
  @IsNotEmpty()
  payment: HotmartPaymentDto;

  @IsBoolean()
  @IsOptional()
  is_funnel?: boolean;

  @IsObject()
  @ValidateNested()
  @Type(() => HotmartEventTicketsDto)
  @IsOptional()
  event_tickets?: HotmartEventTicketsDto;

  @IsString()
  @IsOptional()
  business_model?: string;
}

export class HotmartSubscriptionPlanDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;
}

export class HotmartSubscriberDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class HotmartSubscriptionDto implements IHotmartSubscription {
  @IsString()
  @IsNotEmpty()
  status: string;

  @IsObject()
  @ValidateNested()
  @Type(() => HotmartSubscriptionPlanDto)
  @IsNotEmpty()
  plan: HotmartSubscriptionPlanDto;

  @IsObject()
  @ValidateNested()
  @Type(() => HotmartSubscriberDto)
  @IsNotEmpty()
  subscriber: HotmartSubscriberDto;
}

export class HotmartDataDto implements IHotmartWebhookData {
  @IsObject()
  @ValidateNested()
  @Type(() => HotmartProductDto)
  @IsNotEmpty()
  product: HotmartProductDto;

  @ValidateNested({ each: true })
  @Type(() => HotmartAffiliateDto)
  @IsOptional()
  affiliates?: HotmartAffiliateDto[];

  @IsObject()
  @ValidateNested()
  @Type(() => HotmartBuyerDto)
  @IsNotEmpty()
  buyer: HotmartBuyerDto;

  @IsObject()
  @ValidateNested()
  @Type(() => HotmartProducerDto)
  @IsNotEmpty()
  producer: HotmartProducerDto;

  @ValidateNested({ each: true })
  @Type(() => HotmartCommissionDto)
  @IsOptional()
  commissions?: HotmartCommissionDto[];

  @IsObject()
  @ValidateNested()
  @Type(() => HotmartPurchaseDto)
  @IsNotEmpty()
  purchase: HotmartPurchaseDto;

  @IsObject()
  @ValidateNested()
  @Type(() => HotmartSubscriptionDto)
  @IsOptional()
  subscription?: HotmartSubscriptionDto;
}

export class HotmartWebhookDto implements IHotmartWebhookPayload {
  @IsString()
  @IsNotEmpty({ message: 'Webhook ID is required' })
  id: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Creation date is required' })
  creation_date: number;

  @IsString()
  @IsNotEmpty({ message: 'Event type is required' })
  event: string;

  @IsString()
  @IsNotEmpty({ message: 'Version is required' })
  version: string;

  @IsObject()
  @ValidateNested()
  @Type(() => HotmartDataDto)
  @IsNotEmpty({ message: 'Data is required' })
  data: HotmartDataDto;
}
