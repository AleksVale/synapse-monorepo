import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '../../application/services/auth.service';
import { CryptoService } from '../../application/services/crypto.service';
import { IUserRepository } from '../../domain/repositories';
import { AuthController } from '../../presentation/controllers/auth.controller';
import { UserRepository } from '../repositories/user.repository';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [
    // Repository provider
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
    AuthService,
    CryptoService,
    LocalStrategy,
    JwtStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService, CryptoService],
})
export class AuthModule {}
