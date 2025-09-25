import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type {
  LoginDto,
  CreateUserDto,
  AuthResponse,
  ApiResponse,
  User,
} from '@synapse/shared-types';
import { AuthService } from '../../application/services/auth.service';
import { LocalAuthGuard } from '../../infrastructure/auth/local-auth.guard';
import { JwtAuthGuard } from '../../infrastructure/auth/jwt-auth.guard';
import { CurrentUser } from '../../infrastructure/auth/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ApiResponse<User>> {
    return this.authService.register(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@CurrentUser() user: User): Promise<ApiResponse<User>> {
    // Remove password hash from response
    const { passwordHash, ...userResponse } = user;

    return {
      success: true,
      data: userResponse as User,
      message: 'Profile retrieved successfully',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getCurrentUser(@CurrentUser() user: User): Promise<ApiResponse<User>> {
    return {
      success: true,
      data: user,
      message: 'Current user retrieved successfully',
    };
  }
}
