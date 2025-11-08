import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
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
import { DespesaquartoModule } from './modulo-despesa/despesaquarto/despesaquarto.module';

@Module({
  imports: [ 
  ConfigModule.forRoot({
    envFilePath: '.env', 
    isGlobal: true  
  }),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        // Debug minimal para confirmar qual config está ativa
        const dbg = {
          NODE_ENV: process.env.NODE_ENV,
          HAS_DATABASE_URL: !!process.env.DATABASE_URL,
          DB_HOST: process.env.DB_HOST,
          DB_PORT: process.env.DB_PORT,
          DB_USERNAME: process.env.DB_USERNAME,
          DB_DATABASE: process.env.DB_DATABASE,
          TYPEORM_SYNC: process.env.TYPEORM_SYNC,
        };
        // eslint-disable-next-line no-console
        console.log('[DBCFG]', dbg);
        const isProd = process.env.NODE_ENV === 'production';
        const hasUrl = !!process.env.DATABASE_URL;
        const base = {
          type: 'postgres' as const,
          autoLoadEntities: true,
          migrations: [__dirname + '/database/migrations/*{.js,.ts}'],
          logging: ['query', 'error', 'schema'] as any,
        };
        if (hasUrl) {
          return {
            ...base,
            url: process.env.DATABASE_URL,
            ssl: isProd ? { rejectUnauthorized: false } : false,
            synchronize: process.env.TYPEORM_SYNC === 'true',
          };
        }
        return {
          ...base,
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE,
          synchronize: process.env.TYPEORM_SYNC === 'true',
        };
      }
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
  UsuarioModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

