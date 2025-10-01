import type { UpdateRoleDto as IUpdateRoleDto } from '@synapse/shared-types';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateRoleDto implements IUpdateRoleDto {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Name must not exceed 50 characters' })
  name?: string;
}
