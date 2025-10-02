import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './infrastructure/auth/auth.module';
import { PrismaModule } from './infrastructure/database/prisma.module';
import { WebhookModule } from './infrastructure/webhooks/webhook.module';

@Module({
  imports: [PrismaModule, AuthModule, WebhookModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
