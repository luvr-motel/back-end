import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import request from 'supertest';

import { LocacaoModule } from 'src/modulo-locacao/locacao/locacao.module';
import { Locacao } from 'src/modulo-locacao/locacao/entities/locacao.entity';
import { Motel, MotelStatus } from 'src/modulo-motel/motel/entities/motel.entity';
import { Quarto } from 'src/modulo-quarto/quarto/entities/quarto.entity';
import { QuartoTipo } from 'src/modulo-quarto/quarto_tipo/entities/quarto_tipo.entity';
import { Pessoa } from 'src/modulo-pessoa/pessoa/entities/pessoa.entity';
import { Usuario, UsuarioStatus } from 'src/modulo-pessoa/usuario/entities/usuario.entity';
import { LocacaoTipo } from 'src/modulo-locacao/locacao-tipo/entities/locacao-tipo.entity';
import { LocacaoPosicao } from 'src/modulo-locacao/locacao-posicao/entities/locacao-posicao.entity';
import { PagamentoForma } from 'src/modulo-pagamento/pagamento-forma/entities/pagamento-forma.entity';

jest.setTimeout(30000);

describe('LocacaoController (e2e)', () => {
  let app: INestApplication;
  let httpServer: any;
  let locacaoRepo: Repository<Locacao>;
  let motelRepo: Repository<Motel>;
  let quartoRepo: Repository<Quarto>;
  let quartoTipoRepo: Repository<QuartoTipo>;
  let pessoaRepo: Repository<Pessoa>;
  let usuarioRepo: Repository<Usuario>;
  let locacaoTipoRepo: Repository<LocacaoTipo>;
  let locacaoPosicaoRepo: Repository<LocacaoPosicao>;
  let pagamentoFormaRepo: Repository<PagamentoForma>;

  let motelBase: Motel;
  let quartoBase: Quarto;
  let pessoaBase: Pessoa;
  let usuarioBase: Usuario;
  let locacaoTipoBase: LocacaoTipo;
  let locacaoPosicaoBase: LocacaoPosicao;
  let locacaoPosicaoLimpeza: LocacaoPosicao;
  let pagamentoFormaBase: PagamentoForma;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: 'admin',
          database: 'luvr_test',
          entities: ['src/**/*.entity{.ts,.js}'],
          synchronize: true,
          dropSchema: true,
        }),
        LocacaoModule,
        TypeOrmModule.forFeature([
          Motel,
          Quarto,
          QuartoTipo,
          Pessoa,
          Usuario,
          LocacaoTipo,
          LocacaoPosicao,
          PagamentoForma,
        ]),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    httpServer = app.getHttpServer();
    locacaoRepo = moduleFixture.get<Repository<Locacao>>(getRepositoryToken(Locacao));
    motelRepo = moduleFixture.get<Repository<Motel>>(getRepositoryToken(Motel));
    quartoRepo = moduleFixture.get<Repository<Quarto>>(getRepositoryToken(Quarto));
    quartoTipoRepo = moduleFixture.get<Repository<QuartoTipo>>(getRepositoryToken(QuartoTipo));
    pessoaRepo = moduleFixture.get<Repository<Pessoa>>(getRepositoryToken(Pessoa));
    usuarioRepo = moduleFixture.get<Repository<Usuario>>(getRepositoryToken(Usuario));
    locacaoTipoRepo = moduleFixture.get<Repository<LocacaoTipo>>(getRepositoryToken(LocacaoTipo));
    locacaoPosicaoRepo = moduleFixture.get<Repository<LocacaoPosicao>>(getRepositoryToken(LocacaoPosicao));
    pagamentoFormaRepo = moduleFixture.get<Repository<PagamentoForma>>(getRepositoryToken(PagamentoForma));
  });

  beforeEach(async () => {
    await locacaoRepo.createQueryBuilder().delete().from(Locacao).execute();
    await pagamentoFormaRepo.createQueryBuilder().delete().from(PagamentoForma).execute();
    await locacaoPosicaoRepo.createQueryBuilder().delete().from(LocacaoPosicao).execute();
    await locacaoTipoRepo.createQueryBuilder().delete().from(LocacaoTipo).execute();
    await usuarioRepo.createQueryBuilder().delete().from(Usuario).execute();
    await pessoaRepo.createQueryBuilder().delete().from(Pessoa).execute();
    await quartoRepo.createQueryBuilder().delete().from(Quarto).execute();
    await quartoTipoRepo.createQueryBuilder().delete().from(QuartoTipo).execute();
    await motelRepo.createQueryBuilder().delete().from(Motel).execute();

    motelBase = await motelRepo.save({
      motel_descricao: 'Motel E2E',
      motel_endereco: 'Rua 1',
      motel_email: 'motel@e2e.com',
      motel_cnpj: `77.777.777/0001-${Math.floor(Math.random() * 90 + 10)}`,
      motel_ativo: MotelStatus.ATIVO,
    });

    const quartoTipo = await quartoTipoRepo.save({
      quartotipoDescricao: 'Luxo',
    });

    quartoBase = await quartoRepo.save({
      quarto_descricao: 'Quarto E2E',
      quarto_atributos: 'Frigobar',
      quarto_ativo: true,
      quartotipo: quartoTipo,
      motel: motelBase,
    });

    pessoaBase = await pessoaRepo.save({
      pessoa_nome: 'Cliente E2E',
      pessoa_cpf: `${Math.floor(Math.random() * 9e10 + 1e10)}`,
      pessoa_telefone: '44999990000',
      pessoa_ativo: true,
    });

    usuarioBase = await usuarioRepo.save({
      usuario_codigo: `usuario_${Date.now()}`,
      usuario_senha: 'senha123',
      usuario_ativo: UsuarioStatus.ATIVO,
      pessoa: pessoaBase,
      motel: motelBase,
    });

    locacaoTipoBase = await locacaoTipoRepo.save({
      locacaoTipo_descricao: 'Hora',
      locacoTipo_valor: 50,
    });

    locacaoPosicaoBase = await locacaoPosicaoRepo.save({
      locacaoPosicao_descricao: 'OCUPADO',
    });

    locacaoPosicaoLimpeza = await locacaoPosicaoRepo.save({
      locacaoPosicao_descricao: 'LIMPEZA',
    });

    pagamentoFormaBase = await pagamentoFormaRepo.save({
      pagamentoForma_descricao: 'PIX',
      pagamentoForma_contaDestino: 'Conta',
    });
  });

  afterAll(async () => {
    await app.close();
  });

  const buildPayload = () => ({
    locacao_totalItens: 0,
    locacao_totalQuarto: 0,
    locacao_totalDesconto: 0,
    locacao_totalLocacao: 0,
    quarto_id: quartoBase.quarto_id,
    pessoa_id: pessoaBase.pessoa_id,
    motel_id: motelBase.motel_id,
    usuario_id: usuarioBase.usuario_id,
    locacaoPosicao_id: locacaoPosicaoBase.locacaoPosicao_id,
    locacaoTipo_id: locacaoTipoBase.locacaoTipo_id,
    pagamentoforma_id: pagamentoFormaBase.pagamentoForma_id,
  });

  it('POST /locacao deve criar uma locação', async () => {
    const response = await request(httpServer).post('/locacao').send(buildPayload()).expect(201);

    expect(response.body.locacao_id).toBeDefined();
    expect(response.body.quarto.quarto_id).toBe(quartoBase.quarto_id);
  });

  it('GET /locacao deve listar locações', async () => {
    await locacaoRepo.save({
      locacao_totalItens: 0,
      locacao_totalQuarto: 0,
      locacao_totalDesconto: 0,
      locacao_totalLocacao: 0,
      quarto: quartoBase,
      pessoa: pessoaBase,
      motel: motelBase,
      usuario: usuarioBase,
      locacaoPosicao: locacaoPosicaoBase,
      locacaoTipo: locacaoTipoBase,
      pagamentoForma: pagamentoFormaBase,
    });

    const response = await request(httpServer).get('/locacao').expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
  });

  it('GET /locacao/:id deve retornar locação específica', async () => {
    const locacao = await locacaoRepo.save({
      locacao_totalItens: 0,
      locacao_totalQuarto: 0,
      locacao_totalDesconto: 0,
      locacao_totalLocacao: 0,
      quarto: quartoBase,
      pessoa: pessoaBase,
      motel: motelBase,
      usuario: usuarioBase,
      locacaoPosicao: locacaoPosicaoBase,
      locacaoTipo: locacaoTipoBase,
      pagamentoForma: pagamentoFormaBase,
    });

    const response = await request(httpServer).get(`/locacao/${locacao.locacao_id}`).expect(200);

    expect(response.body.mensagem).toBe(`Locação #${locacao.locacao_id}`);
  });

  it('PATCH /locacao/:id deve atualizar dados da locação', async () => {
    const locacao = await locacaoRepo.save({
      locacao_totalItens: 0,
      locacao_totalQuarto: 0,
      locacao_totalDesconto: 0,
      locacao_totalLocacao: 0,
      quarto: quartoBase,
      pessoa: pessoaBase,
      motel: motelBase,
      usuario: usuarioBase,
      locacaoPosicao: locacaoPosicaoBase,
      locacaoTipo: locacaoTipoBase,
      pagamentoForma: pagamentoFormaBase,
    });

    const response = await request(httpServer)
      .patch(`/locacao/${locacao.locacao_id}`)
      .send({ locacao_totalDesconto: 50 })
      .expect(200);

    expect(response.body.locacao.locacao_totalDesconto).toBe(50);
  });

  it('DELETE /locacao/:id deve excluir locação', async () => {
    const locacao = await locacaoRepo.save({
      locacao_totalItens: 0,
      locacao_totalQuarto: 0,
      locacao_totalDesconto: 0,
      locacao_totalLocacao: 0,
      quarto: quartoBase,
      pessoa: pessoaBase,
      motel: motelBase,
      usuario: usuarioBase,
      locacaoPosicao: locacaoPosicaoBase,
      locacaoTipo: locacaoTipoBase,
      pagamentoForma: pagamentoFormaBase,
    });

    const response = await request(httpServer).delete(`/locacao/${locacao.locacao_id}`).expect(200);

    expect(response.body.mensagem).toBe(`Locação ${locacao.locacao_id} Excluída com sucesso`);
  });

  it('GET /locacao/checkins/turno deve retornar dados agregados', async () => {
    await locacaoRepo.save({
      locacao_totalItens: 10,
      locacao_totalQuarto: 100,
      locacao_totalDesconto: 0,
      locacao_totalLocacao: 110,
      quarto: quartoBase,
      pessoa: pessoaBase,
      motel: motelBase,
      usuario: usuarioBase,
      locacaoPosicao: locacaoPosicaoBase,
      locacaoTipo: locacaoTipoBase,
      pagamentoForma: pagamentoFormaBase,
    });

    const response = await request(httpServer)
      .get('/locacao/checkins/turno')
      .query({
        usuario_id: usuarioBase.usuario_id,
        motel_id: motelBase.motel_id,
        horas: 12,
        posicao: locacaoPosicaoBase.locacaoPosicao_id,
      })
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('PATCH /locacao/:id/checkout deve encerrar locação', async () => {
    const locacao = await locacaoRepo.save({
      locacao_totalItens: 0,
      locacao_totalQuarto: 0,
      locacao_totalDesconto: 0,
      locacao_totalLocacao: 0,
      quarto: quartoBase,
      pessoa: pessoaBase,
      motel: motelBase,
      usuario: usuarioBase,
      locacaoPosicao: locacaoPosicaoBase,
      locacaoTipo: locacaoTipoBase,
      pagamentoForma: pagamentoFormaBase,
    });

    const response = await request(httpServer)
      .patch(`/locacao/${locacao.locacao_id}/checkout`)
      .query({ desconto: 10 })
      .expect(200);

    expect(response.body.mensagem).toBe(`Checkout da locação #${locacao.locacao_id} realizado com sucesso`);
  });
});
