import type { CreateRoleDto as ICreateRoleDto } from '@synapse/shared-types';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateRoleDto implements ICreateRoleDto {
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Name must not exceed 50 characters' })
  name: string;
}
