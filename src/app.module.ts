import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { DespesaModule } from './modulo-despesa/despesa/despesa.module';
import { DespesatipoModule } from './modulo-despesa/despesatipo/despesatipo.module';
import { DespesaquartoModule } from './modulo-despesa/despesaquarto/despesaquarto.module';
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

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        autoLoadEntities: true,
        synchronize: true, // desative em produção se usar migrations
        ssl:
          process.env.NODE_ENV === 'production'
            ? { rejectUnauthorized: false }
            : false, // 👈 SSL só em produção
        retryAttempts: 10,
        retryDelay: 5000,
        logging: ['error'],
      }),
    }),

    // seus módulos
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
    UsuarioModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

