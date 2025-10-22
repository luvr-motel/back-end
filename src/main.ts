import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Pipes globais (validação + transformação)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // CORS
  app.enableCors();

  // (Opcional) prefixo global
  // app.setGlobalPrefix('api/v1');

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Luvr - Gestão Inteligente')
    .setDescription('Escola de T.I - software de gestão de motel.')
    .setVersion('1.0')
    .addTag('API Luvr - BackEnd')
    // .addBearerAuth() // habilite se estiver usando auth
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Exporta OpenAPI JSON
  writeFileSync('./openapi.json', JSON.stringify(document, null, 2));

  // Rota para servir o JSON (Express)
  const httpAdapter = app.getHttpAdapter();
  const instance = httpAdapter.getInstance();
  instance.get('/openapi.json', (_req: any, res: any) => {
    res.json(document);
  });

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);

  console.log(`🚀 Server running at http://localhost:${port}`);
  console.log(`📄 Swagger UI at http://localhost:${port}/api`);
  console.log(`🧾 Swagger JSON at http://localhost:${port}/openapi.json`);
}

bootstrap();