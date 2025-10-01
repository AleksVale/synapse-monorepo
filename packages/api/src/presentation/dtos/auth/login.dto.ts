import type { LoginDto as ILoginDto } from '@synapse/shared-types';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto implements ILoginDto {
  @IsEmail({}, { message: 'Email must be valid' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;
}
