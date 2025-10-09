import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config'
import { DespesageralModule } from './despesa/despesa.module';
import { DespesatipoModule } from './despesatipo/despesatipo.module';
import { Despesa } from './despesa/entities/despesa.entity';
import { Despesatipo } from './despesatipo/entities/despesatipo.entity';
@Module({
  imports: [ 
  ConfigModule.forRoot({
    envFilePath: '.env', 
    isGlobal: true  
  }),
  TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Despesa, Despesatipo],//adicionar manualmente as entities
      migrations: [__dirname + '/database/migrations/*{.js,.ts}'],
      synchronize: true,//desabilita quando for para produção
      logging: ['query', 'error', 'schema'], 
      autoLoadEntities: true,
  }),
  DespesageralModule,
  DespesatipoModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

