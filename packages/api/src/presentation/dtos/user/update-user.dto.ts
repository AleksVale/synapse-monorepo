import type { UpdateUserDto as IUpdateUserDto } from '@synapse/shared-types';
import {
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto implements IUpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(255, { message: 'Name must not exceed 255 characters' })
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email must be valid' })
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(100, { message: 'Password must not exceed 100 characters' })
  password?: string;

  @IsOptional()
  @IsInt({ message: 'Role ID must be an integer' })
  roleId?: number;
}
