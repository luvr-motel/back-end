import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { QuartoModule } from './quarto/quarto.module';
import { QuartoTipoModule } from './quarto_tipo/quarto_tipo.module';
import { Quarto } from './quarto/entities/quarto.entity';
import { QuartoTipo } from './quarto_tipo/entities/quarto_tipo.entity';
import { Motel } from './motel/entities/motel.entity';
import { MotelModule } from './motel/motel.module';
import { Pessoa } from './pessoa/entities/pessoa.entity';
import { PessoaTipo } from './pessoatipo/entities/pessoatipo.entity';
import { Usuario } from './usuario/entities/usuario.entity';
import { UsuarioModule } from './usuario/usuario.module';
import { PessoaModule } from './pessoa/pessoa.module';
import { PessoaTipoModule } from './pessoatipo/pessoatipo.module';
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
      entities: [ Quarto, QuartoTipo, Motel, Pessoa, PessoaTipo, Usuario ],//adicionar manualmente as entities
      migrations: [__dirname + '/database/migrations/*{.js,.ts}'],
      synchronize: true,//desabilita quando for para produção
      logging: ['query', 'error', 'schema'], 
      autoLoadEntities: true,
  }),
  QuartoModule,
  QuartoTipoModule,
  MotelModule,
  UsuarioModule,
  PessoaModule,
  PessoaTipoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}