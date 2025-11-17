import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import request from 'supertest';

import { ComandaModule } from 'src/modulo-locacao/comanda/comanda.module';
import { Comanda } from 'src/modulo-locacao/comanda/entities/comanda.entity';
import { Locacao } from 'src/modulo-locacao/locacao/entities/locacao.entity';
import { LocacaoPosicao } from 'src/modulo-locacao/locacao-posicao/entities/locacao-posicao.entity';
import { LocacaoTipo } from 'src/modulo-locacao/locacao-tipo/entities/locacao-tipo.entity';
import { Motel, MotelStatus } from 'src/modulo-motel/motel/entities/motel.entity';
import { Quarto } from 'src/modulo-quarto/quarto/entities/quarto.entity';
import { QuartoTipo } from 'src/modulo-quarto/quarto_tipo/entities/quarto_tipo.entity';
import { Pessoa } from 'src/modulo-pessoa/pessoa/entities/pessoa.entity';
import { Usuario, UsuarioStatus } from 'src/modulo-pessoa/usuario/entities/usuario.entity';
import { PagamentoForma } from 'src/modulo-pagamento/pagamento-forma/entities/pagamento-forma.entity';
import { Produto } from 'src/modulo-produto/produto/entities/produto.entity';

jest.setTimeout(30000);

describe('ComandaController (e2e)', () => {
  let app: INestApplication;
  let httpServer: any;
  let comandaRepo: Repository<Comanda>;
  let locacaoRepo: Repository<Locacao>;
  let locacaoPosicaoRepo: Repository<LocacaoPosicao>;
  let locacaoTipoRepo: Repository<LocacaoTipo>;
  let motelRepo: Repository<Motel>;
  let quartoRepo: Repository<Quarto>;
  let quartoTipoRepo: Repository<QuartoTipo>;
  let pessoaRepo: Repository<Pessoa>;
  let usuarioRepo: Repository<Usuario>;
  let pagamentoFormaRepo: Repository<PagamentoForma>;
  let produtoRepo: Repository<Produto>;

  let motelBase: Motel;
  let quartoBase: Quarto;
  let pessoaBase: Pessoa;
  let usuarioBase: Usuario;
  let locacaoTipoBase: LocacaoTipo;
  let locacaoPosicaoBase: LocacaoPosicao;
  let pagamentoFormaBase: PagamentoForma;
  let locacaoBase: Locacao;
  let produtoBase: Produto;

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
        ComandaModule,
        TypeOrmModule.forFeature([
          Locacao,
          LocacaoPosicao,
          LocacaoTipo,
          Motel,
          Quarto,
          QuartoTipo,
          Pessoa,
          Usuario,
          PagamentoForma,
          Produto,
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
    comandaRepo = moduleFixture.get<Repository<Comanda>>(getRepositoryToken(Comanda));
    locacaoRepo = moduleFixture.get<Repository<Locacao>>(getRepositoryToken(Locacao));
    locacaoPosicaoRepo = moduleFixture.get<Repository<LocacaoPosicao>>(getRepositoryToken(LocacaoPosicao));
    locacaoTipoRepo = moduleFixture.get<Repository<LocacaoTipo>>(getRepositoryToken(LocacaoTipo));
    motelRepo = moduleFixture.get<Repository<Motel>>(getRepositoryToken(Motel));
    quartoRepo = moduleFixture.get<Repository<Quarto>>(getRepositoryToken(Quarto));
    quartoTipoRepo = moduleFixture.get<Repository<QuartoTipo>>(getRepositoryToken(QuartoTipo));
    pessoaRepo = moduleFixture.get<Repository<Pessoa>>(getRepositoryToken(Pessoa));
    usuarioRepo = moduleFixture.get<Repository<Usuario>>(getRepositoryToken(Usuario));
    pagamentoFormaRepo = moduleFixture.get<Repository<PagamentoForma>>(getRepositoryToken(PagamentoForma));
    produtoRepo = moduleFixture.get<Repository<Produto>>(getRepositoryToken(Produto));
  });

  beforeEach(async () => {
    await comandaRepo.createQueryBuilder().delete().from(Comanda).execute();
    await locacaoRepo.createQueryBuilder().delete().from(Locacao).execute();
    await produtoRepo.createQueryBuilder().delete().from(Produto).execute();
    await pagamentoFormaRepo.createQueryBuilder().delete().from(PagamentoForma).execute();
    await usuarioRepo.createQueryBuilder().delete().from(Usuario).execute();
    await pessoaRepo.createQueryBuilder().delete().from(Pessoa).execute();
    await quartoRepo.createQueryBuilder().delete().from(Quarto).execute();
    await quartoTipoRepo.createQueryBuilder().delete().from(QuartoTipo).execute();
    await locacaoTipoRepo.createQueryBuilder().delete().from(LocacaoTipo).execute();
    await locacaoPosicaoRepo.createQueryBuilder().delete().from(LocacaoPosicao).execute();
    await motelRepo.createQueryBuilder().delete().from(Motel).execute();

    motelBase = await motelRepo.save({
      motel_descricao: 'Motel Comanda',
      motel_endereco: 'Rua Z',
      motel_email: 'motel@comanda.com',
      motel_cnpj: `66.666.666/0001-${Math.floor(Math.random() * 90 + 10)}`,
      motel_ativo: MotelStatus.ATIVO,
    });

    const quartoTipo = await quartoTipoRepo.save({ quartotipoDescricao: 'Standard' });

    quartoBase = await quartoRepo.save({
      quarto_descricao: 'Quarto Comanda',
      quarto_atributos: 'TV',
      quarto_ativo: true,
      quartotipo: quartoTipo,
      motel: motelBase,
    });

    pessoaBase = await pessoaRepo.save({
      pessoa_nome: 'Cliente Comanda',
      pessoa_cpf: `${Math.floor(Math.random() * 9e10 + 1e10)}`,
      pessoa_telefone: '44999997777',
      pessoa_ativo: true,
    });

    usuarioBase = await usuarioRepo.save({
      usuario_codigo: `user_${Date.now()}`,
      usuario_senha: 'senha',
      usuario_ativo: UsuarioStatus.ATIVO,
      pessoa: pessoaBase,
      motel: motelBase,
    });

    locacaoTipoBase = await locacaoTipoRepo.save({
      locacaoTipo_descricao: 'Hora',
      locacoTipo_valor: 40,
    });

    locacaoPosicaoBase = await locacaoPosicaoRepo.save({
      locacaoPosicao_descricao: 'OCUPADO',
    });

    pagamentoFormaBase = await pagamentoFormaRepo.save({
      pagamentoForma_descricao: 'PIX',
      pagamentoForma_contaDestino: 'Conta',
      motel: motelBase,
    });

    produtoBase = await produtoRepo.save({
      produto_descricao: 'Cerveja',
      produto_custo: 5,
      produto_venda: 10,
    });

    locacaoBase = await locacaoRepo.save({
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
  });

  afterAll(async () => {
    await app.close();
  });

  const buildPayload = () => ({
    comanda_qtde: 2,
    comanda_observacao: 'Sem gelo',
    locacao_id: locacaoBase.locacao_id,
    produto_id: produtoBase.produto_id,
    motel_id: motelBase.motel_id,
  });

  // it('POST /comanda deve criar uma comanda', async () => {
  //   const response = await request(httpServer).post('/comanda').send(buildPayload()).expect(201);

  //   expect(response.body.comanda_id).toBeDefined();
  //   expect(Number(response.body.comanda_qtde)).toBe(2);
  //   expect(response.body.comanda_observacao).toBe('Sem gelo');
  // });

  it('GET /comanda deve listar comandas', async () => {
    await comandaRepo.save({
      comanda_qtde: 1,
      comanda_observacao: 'Teste',
      locacao: locacaoBase,
      produto: produtoBase,
      motel: motelBase,
    });

    const response = await request(httpServer).get('/comanda').expect(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(1);
  });

  it('GET /comanda/:id deve retornar comanda específica', async () => {
    const comanda = await comandaRepo.save({
      comanda_qtde: 1,
      comanda_observacao: 'Detalhe',
      locacao: locacaoBase,
      produto: produtoBase,
      motel: motelBase,
    });

    const response = await request(httpServer).get(`/comanda/${comanda.comanda_id}`).expect(200);
    expect(response.body.mensagem).toBe(`Comanda ${comanda.comanda_id} `);
  });

  it('GET /comanda/:id deve retornar 404 quando inexistente', async () => {
    const response = await request(httpServer).get('/comanda/999').expect(404);
    expect(response.body.message).toBe('Comanda não encontrada');
  });

  it('PATCH /comanda/:id deve atualizar comanda', async () => {
    const comanda = await comandaRepo.save({
      comanda_qtde: 1,
      comanda_observacao: 'Original',
      locacao: locacaoBase,
      produto: produtoBase,
      motel: motelBase,
    });

    const response = await request(httpServer)
      .patch(`/comanda/${comanda.comanda_id}`)
      .send({ comanda_qtde: 3 })
      .expect(200);

    expect(Number(response.body.comanda.comanda_qtde)).toBe(3);
  });

  it('PATCH /comanda/:id deve retornar 404 quando inexistente', async () => {
    const response = await request(httpServer)
      .patch('/comanda/999')
      .send({ comanda_qtde: 5 })
      .expect(404);

    expect(response.body.message).toBe('Erro ao atualizar comanda');
  });

  it('DELETE /comanda/:id deve remover comanda', async () => {
    const comanda = await comandaRepo.save({
      comanda_qtde: 1,
      comanda_observacao: 'Remover',
      locacao: locacaoBase,
      produto: produtoBase,
      motel: motelBase,
    });

    const response = await request(httpServer).delete(`/comanda/${comanda.comanda_id}`).expect(200);
    expect(response.body.mensagem).toBe(`Locação ${comanda.comanda_id} Excluido com sucesso`);
  });

  it('DELETE /comanda/:id deve retornar 404 quando inexistente', async () => {
    const response = await request(httpServer).delete('/comanda/999').expect(404);
    expect(response.body.message).toBe('Erro ao excluir locação');
  });

  it('POST /comanda deve falhar com payload inválido', async () => {
    const response = await request(httpServer)
      .post('/comanda')
      .send({ comanda_qtde: 'abc' })
      .expect(400);

    expect(Array.isArray(response.body.message)).toBe(true);
  });
});
