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
import { Usuario } from './modulo-pessoa/usuario/entities/usuario.entity';
import { UsuarioModule } from './modulo-pessoa/usuario/usuario.module';
import { PessoaModule } from './pessoa/pessoa.module';
import { PessoaTipoModule } from './pessoatipo/pessoatipo.module';
import { Comanda } from './modulo-locacao/comanda/entities/comanda.entity';
import { EstoqueProduto } from './modulo-produto/estoque-produto/entities/estoque-produto.entity';
import { Locacao } from './modulo-locacao/locacao/entities/locacao.entity';
import { LocacaoPosicao } from './modulo-locacao/locacao-posicao/entities/locacao-posicao.entity';
import { LocacaoTipo } from './modulo-locacao/locacao-tipo/entities/locacao-tipo.entity';
import { PagamentoForma } from './pagamento-forma/entities/pagamento-forma.entity';
import { Despesa } from './modulo-despesa/despesa/entities/despesa.entity';
import { Despesatipo } from './modulo-despesa/despesatipo/entities/despesatipo.entity';
import { Produto } from './modulo-produto/produto/entities/produto.entity';
import { DespesatipoModule } from './modulo-despesa/despesatipo/despesatipo.module';
import { LocacaoModule } from './modulo-locacao/locacao/locacao.module';
import { LocacaoTipoModule } from './modulo-locacao/locacao-tipo/locacao-tipo.module';
import { LocacaoPosicaoModule } from './modulo-locacao/locacao-posicao/locacao-posicao.module';
import { ProdutoModule } from './modulo-produto/produto/produto.module';
import { EstoqueProdutoModule } from './modulo-produto/estoque-produto/estoque-produto.module';
import { PagamentoFormaModule } from './pagamento-forma/pagamento-forma.module';

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
      entities: [ Despesa, Despesaquarto, Despesatipo, Comanda, Locacao, LocacaoPosicao, LocacaoTipo, Produto, EstoqueProduto, Quarto, QuartoTipo, Motel, PagamentoForma, Pessoa, PessoaTipo, Quarto, QuartoTipo, Usuario ],
      //Comanda, EstoqueProduto, Locacao, LocacaoPosicao, LocacaoTipo, PagamentoForma, Produto//adicionar manualmente as entities
      migrations: [__dirname + '/database/migrations/*{.js,.ts}'],
      synchronize: true,//desabilita quando for para produção
      logging: ['query', 'error', 'schema'], 
      autoLoadEntities: true,
  }),
  DespesaModule,
  DespesatipoModule,
  DespesaquartoModule,
  LocacaoModule,
  LocacaoTipoModule,
  LocacaoPosicaoModule,
  ProdutoModule,
  EstoqueProdutoModule,
  QuartoModule,
  QuartoTipoModule,
  MotelModule,
  PagamentoFormaModule,
  PessoaModule,
  PessoaTipoModule,
  QuartoModule,
  QuartoTipoModule,
  UsuarioModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}