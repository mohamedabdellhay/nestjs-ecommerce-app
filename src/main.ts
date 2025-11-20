// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API build with NestJS + Prisma + PostgreSQL')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'API Docs',
    customCss: '.swagger-ui .topbar { background-color: #1a1a1a; }',
  });
  app.use(cookieParser());
  await app.listen(3000);
  console.log(`🚀 Application is running on: http://localhost:3000`);
  console.log(`📚 Swagger Docs: http://localhost:3000/api/v1`);
}
bootstrap();
