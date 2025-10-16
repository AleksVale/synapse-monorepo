import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './infrastructure/auth/auth.module';
import { PrismaModule } from './infrastructure/database/prisma.module';
import { WebhookModule } from './infrastructure/webhooks/webhook.module';
import { IntegrationModule } from './presentation/modules/integration.module';
import { ProductModule } from './presentation/modules/product.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    WebhookModule,
    IntegrationModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
