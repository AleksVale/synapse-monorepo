import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '../../application/services/auth.service';
import { CryptoService } from '../../application/services/crypto.service';
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
    AuthService,
    CryptoService,
    LocalStrategy,
    JwtStrategy,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
  ],
  controllers: [AuthController],
  exports: [AuthService, CryptoService],
})
export class AuthModule {}
