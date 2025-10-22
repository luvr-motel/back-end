import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { RegistroPontoModule } from './registro-ponto/registro-ponto.module';
import { RegistroPonto } from './registro-ponto/entities/registro-ponto.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 5432),
      username: process.env.DB_USERNAME ?? 'postgres',
      password: process.env.DB_PASSWORD ?? 'admin',
      database: process.env.DB_DATABASE ?? 'luvr',
      entities: [RegistroPonto],
      autoLoadEntities: true,  
      synchronize: true,          
      logging: ['query', 'error', 'schema'],
      migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
    }),
    RegistroPontoModule,
  ],
})
export class AppModule {}
