import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle( 'Luvr - Gestão Inteligente' )
    .setDescription( 'Escola de T.I - software de gestão de motel.' )
    .setVersion( '1.0' )
    .addTag( 'API Luvr - BackEnd' )
    .build();

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

  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 Server running at http://localhost:${process.env.PORT ?? 3000}/api` );
  console.log(`📄 Swagger JSON at http://localhost:${process.env.PORT ?? 3000}/openapi.json` );
}
bootstrap();
