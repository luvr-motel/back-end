import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefixo global (opcional)
  // app.setGlobalPrefix('v1');

  // Pipes globais
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }));

  // CORS (ajuste as origins do seu front)
  app.enableCors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Luvr - Gestão Inteligente')
    .setDescription('Escola de T.I - software de gestão de motel.')
    .setVersion('1.0')
    .addTag('api')
    .addBearerAuth() // <- já deixa pronto pro JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Encerramento gracioso (SIGTERM/SIGINT)
  app.enableShutdownHooks();

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
  console.log(`API rodando: http://localhost:${port}`);
  console.log(`Swagger:     http://localhost:${port}/api`);
}
bootstrap();
