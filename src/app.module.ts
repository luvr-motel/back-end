import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config'
import { ProdutoModule } from './modulo-produto/produto/produto.module';
import { ComandaModule } from './modulo-locacao/comanda/comanda.module';
import { Produto } from './modulo-produto/produto/entities/produto.entity';
import { Comanda } from './modulo-locacao/comanda/entities/comanda.entity';
import { LocacaoModule } from './modulo-locacao/locacao/locacao.module';
import { Locacao } from './modulo-locacao/locacao/entities/locacao.entity';
import { LocacaoTipoModule } from './modulo-locacao/locacao-tipo/locacao-tipo.module';
import { LocacaoPosicaoModule } from './modulo-locacao/locacao-posicao/locacao-posicao.module';
import { LocacaoPosicao } from './modulo-locacao/locacao-posicao/entities/locacao-posicao.entity';
import { LocacaoTipo } from './modulo-locacao/locacao-tipo/entities/locacao-tipo.entity';
import { EstoqueProdutoModule } from './modulo-produto/estoque-produto/estoque-produto.module';
import { EstoqueProduto } from './modulo-produto/estoque-produto/entities/estoque-produto.entity';
import { PagamentoFormaModule } from './pagamento-forma/pagamento-forma.module';
import { PagamentoForma } from './pagamento-forma/entities/pagamento-forma.entity';

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
      entities: [ Comanda, EstoqueProduto, Locacao, LocacaoPosicao, LocacaoTipo, PagamentoForma, Produto  ],//adicionar manualmente as entities
      migrations: [__dirname + '/database/migrations/*{.js,.ts}'],
      synchronize: true,//desabilita quando for para produção
      logging: ['query', 'error', 'schema'], 
      autoLoadEntities: true,
  }),
  ProdutoModule, ComandaModule, LocacaoModule,LocacaoTipoModule, LocacaoPosicaoModule, EstoqueProdutoModule, PagamentoFormaModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

