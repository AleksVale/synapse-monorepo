import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './infrastructure/database/prisma.module';
import { RepositoryModule } from './infrastructure/repositories/repository.module';
import { ControllersModule } from './presentation/controllers/controllers.module';

@Module({
  imports: [PrismaModule, RepositoryModule, ControllersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
