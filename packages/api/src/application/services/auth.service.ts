import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  User,
  LoginDto,
  CreateUserDto,
  AuthResponse,
  ApiResponse,
} from '@synapse/shared-types';
import type { IUserRepository } from '../../domain/interfaces/repositories.interface';
import { CryptoService } from './crypto.service';

export interface JwtPayload {
  sub: number;
  email: string;
  name: string;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
    private readonly cryptoService: CryptoService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await this.cryptoService.comparePassword(
      password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    const token = this.jwtService.sign(payload);

    // Remove password hash from user response
    const { passwordHash, ...userResponse } = user;

    return {
      success: true,
      data: {
        user: userResponse as User,
        token,
      },
      message: 'Login successful',
    };
  }

  async register(createUserDto: CreateUserDto): Promise<ApiResponse<User>> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(
      createUserDto.email,
    );

    if (existingUser) {
      return {
        success: false,
        error: 'User with this email already exists',
      };
    }

    // Hash password
    const hashedPassword = await this.cryptoService.hashPassword(
      createUserDto.password,
    );

    // Create user
    const user = await this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    // Remove password hash from response
    const { passwordHash, ...userResponse } = user;

    return {
      success: true,
      data: userResponse as User,
      message: 'User created successfully',
    };
  }

  async findUserById(id: number): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  generateJwtToken(user: User): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    return this.jwtService.sign(payload);
  }
}
