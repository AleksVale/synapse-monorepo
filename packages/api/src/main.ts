import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for web app
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api');

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades não decoradas
      transform: true, // Transforma payloads para DTOs
      transformOptions: {
        enableImplicitConversion: true, // Converte tipos automaticamente
      },
    }),
  );

  const port = process.env.PORT ?? 3001;
  await app.listen(port);

  console.log(`🚀 API running on http://localhost:${port}`);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
