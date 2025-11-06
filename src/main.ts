import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { Request, Response } from 'express';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  // Boot logs para confirmar execução
  // eslint-disable-next-line no-console
  console.log('[BOOT] starting');
  const app = await NestFactory.create(AppModule);
  // eslint-disable-next-line no-console
  console.log('[BOOT] app created');

  const config = new DocumentBuilder()
    .setTitle( 'Luvr - Gestão Inteligente' )
    .setDescription( 'Escola de T.I - software de gestão de motel.' )
    .setVersion('1.0')
    .addTag('API Luvr - BackEnd')
    .addServer('https://api.luvr.com.br').addServer('http://localhost:3000').build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  writeFileSync('./openapi.json', JSON.stringify(document, null, 2));

  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.get('/openapi.json', (req: Request, res: Response) => {
    res.json(document);
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Global error logging to reveal root causes in dev/prod
  app.useGlobalFilters(new AllExceptionsFilter());

  // Helpful in dev to verify envs are loaded
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.log('[ENV]', {
      DB_HOST: process.env.DB_HOST,
      DB_PORT: process.env.DB_PORT,
      DB_USERNAME: process.env.DB_USERNAME,
      DB_DATABASE: process.env.DB_DATABASE,
      HAS_DATABASE_URL: Boolean(process.env.DATABASE_URL),
      TYPEORM_SYNC: process.env.TYPEORM_SYNC,
      PORT: process.env.PORT,
      NODE_ENV: process.env.NODE_ENV,
    });
  }

  app.enableCors({ origin: ['https://api.luvr.com.br','http://localhost:3000', 'http://localhost:5173', 'https://admin.luvr.com.br' ], credentials: true, methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'], allowedHeaders: ['Content-Type','Authorization'] });
  await app.listen(process.env.PORT ?? 3000);
  // eslint-disable-next-line no-console
  console.log('[BOOT] listening on', process.env.PORT ?? 3000);
  console.log(`🚀 Server running at http://localhost:${process.env.PORT ?? 3000}/api` );
  console.log(`📄 Swagger JSON at http://localhost:${process.env.PORT ?? 3000}/openapi.json` );
}
bootstrap();

