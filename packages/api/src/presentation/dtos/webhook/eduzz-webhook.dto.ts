import type {
  EduzzAffiliate as IEduzzAffiliate,
  EduzzBuyer as IEduzzBuyer,
  EduzzChargeback as IEduzzChargeback,
  EduzzFees as IEduzzFees,
  EduzzGains as IEduzzGains,
  EduzzInvoiceData as IEduzzInvoiceData,
  EduzzItem as IEduzzItem,
  EduzzProducer as IEduzzProducer,
  EduzzRefund as IEduzzRefund,
  EduzzStudent as IEduzzStudent,
  EduzzTracker as IEduzzTracker,
  EduzzUtm as IEduzzUtm,
  EduzzWebhookPayload as IEduzzWebhookPayload,
} from '@synapse/shared-types';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class EduzzAddressDto {
  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  number: string;

  @IsString()
  @IsNotEmpty()
  neighborhood: string;

  @IsString()
  @IsNotEmpty()
  complement: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  zipCode: string;
}

export class EduzzBuyerDto implements IEduzzBuyer {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  document: string;

  @IsEmail({}, { message: 'Buyer email must be valid' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  phone2: string;

  @IsString()
  @IsNotEmpty()
  cellphone: string;

  @IsObject()
  @ValidateNested()
  @Type(() => EduzzAddressDto)
  @IsNotEmpty()
  address: EduzzAddressDto;
}

export class EduzzProducerDto implements IEduzzProducer {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  originSecret: string;
}

export class EduzzAffiliateDto implements IEduzzAffiliate {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class EduzzUtmDto implements IEduzzUtm {
  @IsString()
  @IsOptional()
  source?: string;

  @IsString()
  @IsOptional()
  campaign?: string;

  @IsString()
  @IsOptional()
  medium?: string;

  @IsString()
  @IsOptional()
  content?: string;
}

export class EduzzTrackerDto implements IEduzzTracker {
  @IsString()
  @IsOptional()
  code1?: string;

  @IsString()
  @IsOptional()
  code2?: string;

  @IsString()
  @IsOptional()
  code3?: string;
}

export class EduzzPriceDto {
  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsNumber()
  @IsNotEmpty()
  value: number;
}

export class EduzzRefundPeriodDto {
  @IsString()
  @IsNotEmpty()
  durationType: string;

  @IsNumber()
  @IsNotEmpty()
  value: number;
}

export class EduzzCouponDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  key: string;

  @IsObject()
  @ValidateNested()
  @Type(() => EduzzPriceDto)
  @IsNotEmpty()
  discount: EduzzPriceDto;
}

export class EduzzItemDto implements IEduzzItem {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  parentId: string;

  @IsObject()
  @ValidateNested()
  @Type(() => EduzzRefundPeriodDto)
  @IsNotEmpty()
  refundPeriod: EduzzRefundPeriodDto;

  @IsObject()
  @ValidateNested()
  @Type(() => EduzzPriceDto)
  @IsNotEmpty()
  price: EduzzPriceDto;

  @IsObject()
  @ValidateNested()
  @Type(() => EduzzCouponDto)
  @IsNotEmpty()
  coupon: EduzzCouponDto;

  @IsString()
  @IsNotEmpty()
  partnerId: string;

  @IsString()
  @IsNotEmpty()
  billingType: string;

  @IsString()
  @IsNotEmpty()
  skuReference: string;
}

export class EduzzTransactionDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  key: string;
}

export class EduzzStudentDto implements IEduzzStudent {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  document: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  phone2: string;

  @IsString()
  @IsNotEmpty()
  cellphone: string;
}

export class EduzzGainsDto implements IEduzzGains {
  @IsObject()
  @ValidateNested()
  @Type(() => EduzzPriceDto)
  @IsNotEmpty()
  producer: EduzzPriceDto;

  @IsObject()
  @ValidateNested()
  @Type(() => EduzzPriceDto)
  @IsNotEmpty()
  coproducer: EduzzPriceDto;

  @IsObject()
  @ValidateNested()
  @Type(() => EduzzPriceDto)
  @IsNotEmpty()
  affiliate: EduzzPriceDto;
}

export class EduzzFeesDto implements IEduzzFees {
  @IsObject()
  @ValidateNested()
  @Type(() => EduzzPriceDto)
  @IsNotEmpty()
  eduzz: EduzzPriceDto;

  @IsObject()
  @ValidateNested()
  @Type(() => EduzzPriceDto)
  @IsNotEmpty()
  recovery: EduzzPriceDto;

  @IsObject()
  @ValidateNested()
  @Type(() => EduzzPriceDto)
  @IsNotEmpty()
  alumy: EduzzPriceDto;

  @IsObject()
  @ValidateNested()
  @Type(() => EduzzPriceDto)
  @IsNotEmpty()
  total: EduzzPriceDto;
}

export class EduzzRefundDto implements IEduzzRefund {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  createdAt: string;

  @IsString()
  @IsNotEmpty()
  refundedAt: string;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsNumber()
  @IsNotEmpty()
  value: number;

  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsString()
  @IsNotEmpty()
  refundBy: string;
}

export class EduzzChargebackDto implements IEduzzChargeback {
  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsNotEmpty()
  createdAt: string;

  @IsString()
  @IsNotEmpty()
  limitDate: string;

  @IsString()
  @IsOptional()
  finishedAt?: string;
}

export class EduzzBankSlipInstallmentDto {
  @IsNumber()
  @IsNotEmpty()
  installmentNumber: number;

  @IsNumber()
  @IsNotEmpty()
  totalInstallments: number;
}

export class EduzzInvoiceDataDto implements IEduzzInvoiceData {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsObject()
  @ValidateNested()
  @Type(() => EduzzBuyerDto)
  @IsNotEmpty()
  buyer: EduzzBuyerDto;

  @IsObject()
  @ValidateNested()
  @Type(() => EduzzProducerDto)
  @IsNotEmpty()
  producer: EduzzProducerDto;

  @IsObject()
  @ValidateNested()
  @Type(() => EduzzAffiliateDto)
  @IsOptional()
  affiliate?: EduzzAffiliateDto;

  @IsObject()
  @ValidateNested()
  @Type(() => EduzzUtmDto)
  @IsNotEmpty()
  utm: EduzzUtmDto;

  @IsObject()
  @ValidateNested()
  @Type(() => EduzzTrackerDto)
  @IsNotEmpty()
  tracker: EduzzTrackerDto;

  @IsString()
  @IsNotEmpty()
  createdAt: string;

  @IsString()
  @IsNotEmpty()
  dueDate: string;

  @IsString()
  @IsOptional()
  barcode?: string;

  @IsObject()
  @ValidateNested()
  @Type(() => EduzzPriceDto)
  @IsNotEmpty()
  price: EduzzPriceDto;

  @IsObject()
  @ValidateNested()
  @Type(() => EduzzPriceDto)
  @IsNotEmpty()
  paid: EduzzPriceDto;

  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @IsNumber()
  @IsNotEmpty()
  installments: number;

  @IsObject()
  @ValidateNested()
  @Type(() => EduzzTransactionDto)
  @IsOptional()
  transaction?: EduzzTransactionDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EduzzItemDto)
  @IsNotEmpty()
  items: EduzzItemDto[];

  @IsNumber()
  @IsNotEmpty()
  totalItems: number;

  @IsString()
  @IsOptional()
  billetUrl?: string;

  @IsString()
  @IsOptional()
  checkoutUrl?: string;

  @IsString()
  @IsOptional()
  bankslipUrl?: string;

  @IsString()
  @IsOptional()
  paidAt?: string;

  @IsString()
  @IsOptional()
  refundedAt?: string;

  @IsObject()
  @ValidateNested()
  @Type(() => EduzzStudentDto)
  @IsNotEmpty()
  student: EduzzStudentDto;

  @IsObject()
  @ValidateNested()
  @Type(() => EduzzGainsDto)
  @IsOptional()
  gains?: EduzzGainsDto;

  @IsObject()
  @ValidateNested()
  @Type(() => EduzzFeesDto)
  @IsOptional()
  fees?: EduzzFeesDto;

  @IsObject()
  @ValidateNested()
  @Type(() => EduzzRefundDto)
  @IsOptional()
  refund?: EduzzRefundDto;

  @IsObject()
  @ValidateNested()
  @Type(() => EduzzChargebackDto)
  @IsOptional()
  chargeback?: EduzzChargebackDto;

  @IsObject()
  @ValidateNested()
  @Type(() => EduzzBankSlipInstallmentDto)
  @IsOptional()
  bankSlipInstallment?: EduzzBankSlipInstallmentDto;
}

export class EduzzWebhookDto implements IEduzzWebhookPayload {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  event: string;

  @IsObject()
  @ValidateNested()
  @Type(() => EduzzInvoiceDataDto)
  @IsNotEmpty()
  data: EduzzInvoiceDataDto;

  @IsString()
  @IsNotEmpty()
  sentDate: string;
}
