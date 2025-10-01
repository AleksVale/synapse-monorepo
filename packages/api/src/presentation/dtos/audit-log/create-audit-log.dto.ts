import type { CreateAuditLogDto as ICreateAuditLogDto } from '@synapse/shared-types';
import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

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
