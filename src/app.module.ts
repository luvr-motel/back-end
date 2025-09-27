import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { PessoaModule } from './pessoa/pessoa.module';
import { PessoaTipoModule } from './pessoatipo/pessoatipo.module';
import { UsuarioModule } from './usuario/usuario.module';
import { AuthModule } from './usuario/auth/auth.module';

import { JwtAuthGuard } from './usuario/auth/jwt-auth.guard';
import { RolesGuard } from './usuario/auth/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'admin',
      database: process.env.DB_DATABASE || 'luvr',
      entities: [],
      autoLoadEntities: true,
      synchronize: true,
      logging: ['query', 'error', 'schema'],
      migrations: [__dirname + '/database/migrations/*{.js,.ts}'],
    }),
    PessoaModule,
    PessoaTipoModule,
    UsuarioModule,
    AuthModule,
  ],
  
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard }, 
    { provide: APP_GUARD, useClass: RolesGuard },  
  ],
})
export class AppModule {}