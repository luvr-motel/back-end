import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { QuartoModule } from './quarto/quarto.module';
import { QuartoTipoModule } from './quarto_tipo/quarto_tipo.module';
import { DespesaquartoModule } from './despesaquarto/despesaquarto.module';
import { Quarto } from './quarto/entities/quarto.entity';
import { QuartoTipo } from './quarto_tipo/entities/quarto_tipo.entity';
import { Despesaquarto } from './despesaquarto/entities/despesaquarto.entity';
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
      entities: [Quarto, QuartoTipo,Despesaquarto],//adicionar manualmente as entities
      migrations: [__dirname + '/database/migrations/*{.js,.ts}'],
      synchronize: true,//desabilita quando for para produção
      logging: ['query', 'error', 'schema'], 
      autoLoadEntities: true,
  }),
  QuartoModule,
  QuartoTipoModule,
  DespesaquartoModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

