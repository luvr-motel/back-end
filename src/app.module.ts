import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Despesa } from './modulo-despesa/despesa/entities/despesa.entity';
import { Despesatipo } from './modulo-despesa/despesatipo/entities/despesatipo.entity';
import { Comanda } from './modulo-locacao/comanda/entities/comanda.entity';
import { Locacao } from './modulo-locacao/locacao/entities/locacao.entity';
import { LocacaoPosicao } from './modulo-locacao/locacao-posicao/entities/locacao-posicao.entity';
import { LocacaoTipo } from './modulo-locacao/locacao-tipo/entities/locacao-tipo.entity';
import { Produto } from './modulo-produto/produto/entities/produto.entity';
import { EstoqueProduto } from './modulo-produto/estoque-produto/entities/estoque-produto.entity';
import { Quarto } from './modulo-quarto/quarto/entities/quarto.entity';
import { QuartoTipo } from './modulo-quarto/quarto_tipo/entities/quarto_tipo.entity';
import { Motel } from './modulo-motel/motel/entities/motel.entity';
import { PagamentoForma } from './modulo-pagamento/pagamento-forma/entities/pagamento-forma.entity';
import { Pessoa } from './modulo-pessoa/pessoa/entities/pessoa.entity';
import { PessoaTipo } from './modulo-pessoa/pessoatipo/entities/pessoatipo.entity';
import { Usuario } from './modulo-pessoa/usuario/entities/usuario.entity';
import { DespesatipoModule } from './modulo-despesa/despesatipo/despesatipo.module';
import { LocacaoModule } from './modulo-locacao/locacao/locacao.module';
import { LocacaoTipoModule } from './modulo-locacao/locacao-tipo/locacao-tipo.module';
import { LocacaoPosicaoModule } from './modulo-locacao/locacao-posicao/locacao-posicao.module';
import { ProdutoModule } from './modulo-produto/produto/produto.module';
import { EstoqueProdutoModule } from './modulo-produto/estoque-produto/estoque-produto.module';
import { QuartoModule } from './modulo-quarto/quarto/quarto.module';
import { QuartoTipoModule } from './modulo-quarto/quarto_tipo/quarto_tipo.module';
import { MotelModule } from './modulo-motel/motel/motel.module';
import { PagamentoFormaModule } from './modulo-pagamento/pagamento-forma/pagamento-forma.module';
import { PessoaModule } from './modulo-pessoa/pessoa/pessoa.module';
import { PessoaTipoModule } from './modulo-pessoa/pessoatipo/pessoatipo.module';
import { UsuarioModule } from './modulo-pessoa/usuario/usuario.module';
import { DespesaModule } from './modulo-despesa/despesa/despesa.module';
import { Despesaquarto } from './modulo-despesa/despesaquarto/entities/despesaquarto.entity';
import { DespesaquartoModule } from './modulo-despesa/despesaquarto/despesaquarto.module';

@Module({
  imports: [ 
  ConfigModule.forRoot({
    envFilePath: '.env', 
    isGlobal: true  
  }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        entities: [
          Despesa, Despesaquarto, Despesatipo, Comanda, Locacao,
          LocacaoPosicao, LocacaoTipo, Produto, EstoqueProduto,
          Quarto, QuartoTipo, Motel, PagamentoForma, Pessoa,
          PessoaTipo, Usuario,
        ],
        synchronize: true, // desabilite em produção se quiser proteger o schema
        autoLoadEntities: true,
        ssl: { rejectUnauthorized: false }, // 👈 necessário no Railway
        retryAttempts: 10, // tenta reconectar 10 vezes
        retryDelay: 5000,  // 5 segundos entre as tentativas
        logging: ['error'],
      }),
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
