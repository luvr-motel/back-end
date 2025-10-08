import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config'
import { ProdutoModule } from './produto/produto.module';
import { ComandaModule } from './comanda/comanda.module';
import { Produto } from './produto/entities/produto.entity';
import { Comanda } from './comanda/entities/comanda.entity';
import { LocacaoModule } from './locacao/locacao.module';
import { Locacao } from './locacao/entities/locacao.entity';
import { LocacaoTipoModule } from './locacao-tipo/locacao-tipo.module';
import { LocacaoPosicaoModule } from './locacao-posicao/locacao-posicao.module';
import { LocacaoPosicao } from './locacao-posicao/entities/locacao-posicao.entity';
import { LocacaoTipo } from './locacao-tipo/entities/locacao-tipo.entity';
import { EstoqueProdutoModule } from './estoque-produto/estoque-produto.module';

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
      entities: [ Produto, Comanda, Locacao, LocacaoPosicao, LocacaoTipo ],//adicionar manualmente as entities
      migrations: [__dirname + '/database/migrations/*{.js,.ts}'],
      synchronize: true,//desabilita quando for para produção
      logging: ['query', 'error', 'schema'], 
      autoLoadEntities: true,
  }),
  ProdutoModule,
  ComandaModule,
  LocacaoModule,
  LocacaoTipoModule,
  LocacaoPosicaoModule,
  EstoqueProdutoModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

