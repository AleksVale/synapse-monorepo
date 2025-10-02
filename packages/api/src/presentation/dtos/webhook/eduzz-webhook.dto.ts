import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class EduzzCustomerDto {
  @IsString()
  nome: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  cpf?: string;

  @IsOptional()
  @IsString()
  telefone?: string;
}

export class EduzzProductDto {
  @IsNumber()
  cod_produto: number;

  @IsString()
  nome_produto: string;
}

export class EduzzWebhookDto {
  @IsString()
  evento: string;

  @IsNumber()
  trans_cod: number;

  @IsString()
  trans_status: string;

  @ValidateNested()
  @Type(() => EduzzProductDto)
  produto: EduzzProductDto;

  @ValidateNested()
  @Type(() => EduzzCustomerDto)
  cliente: EduzzCustomerDto;

  @IsString()
  forma_pagamento: string;

  @IsOptional()
  @IsString()
  data_aprovacao?: string;

  @IsNumber()
  valor: number;

  @IsString()
  moeda: string;

  @IsString()
  token: string;
}
