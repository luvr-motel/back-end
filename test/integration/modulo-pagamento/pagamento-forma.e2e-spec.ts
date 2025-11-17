import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import request from 'supertest';

import { PagamentoForma } from 'src/modulo-pagamento/pagamento-forma/entities/pagamento-forma.entity';
import { PagamentoFormaModule } from 'src/modulo-pagamento/pagamento-forma/pagamento-forma.module';

jest.setTimeout(30000);

describe('PagamentoFormaController (e2e)', () => {
  let app: INestApplication;
  let repo: Repository<PagamentoForma>;
  let httpServer: any;

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
        PagamentoFormaModule,
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
    repo = moduleFixture.get<Repository<PagamentoForma>>(getRepositoryToken(PagamentoForma));
  });

  beforeEach(async () => {
    await repo.createQueryBuilder().delete().from(PagamentoForma).execute();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /pagamento-forma deve criar uma forma de pagamento', async () => {
    const response = await request(httpServer)
      .post('/pagamento-forma')
      .send({
        pagamentoForma_descricao: 'PIX',
        pagamentoForma_contaDestino: 'Conta Central',
      })
      .expect(201);

    expect(response.body.pagamentoForma_id).toBeDefined();
    expect(response.body.pagamentoForma_descricao).toBe('PIX');
    expect(response.body.pagamentoForma_contaDestino).toBe('Conta Central');
  });

  it('GET /pagamento-forma deve listar todas as formas', async () => {
    await repo.save([
      {
        pagamentoForma_descricao: 'Cartão Crédito',
        pagamentoForma_contaDestino: 'Conta Cartões',
      },
      {
        pagamentoForma_descricao: 'Dinheiro',
        pagamentoForma_contaDestino: 'Caixa',
      },
    ]);

    const response = await request(httpServer).get('/pagamento-forma').expect(200);

    expect(response.body).toHaveLength(2);
    expect(response.body.some((f: PagamentoForma) => f.pagamentoForma_descricao === 'Dinheiro')).toBe(true);
  });

  it('GET /pagamento-forma/:id deve retornar forma específica', async () => {
    const forma = await repo.save({
      pagamentoForma_descricao: 'Cheque',
      pagamentoForma_contaDestino: 'Conta Recebimentos',
    });

    const response = await request(httpServer).get(`/pagamento-forma/${forma.pagamentoForma_id}`).expect(200);

    expect(response.body.mensagem).toBe(`Forma de pagamento; ${forma.pagamentoForma_id}`);
    expect(response.body.forma.pagamentoForma_descricao).toBe('Cheque');
  });

  it('GET /pagamento-forma/:id deve retornar 404 para forma inexistente', async () => {
    const response = await request(httpServer).get('/pagamento-forma/999').expect(404);

    expect(response.body.message).toBe('Forma de pagamento não encontrada');
  });

  it('PATCH /pagamento-forma/:id deve atualizar a forma parcialmente', async () => {
    const forma = await repo.save({
      pagamentoForma_descricao: 'Transferência',
      pagamentoForma_contaDestino: 'Conta Original',
    });

    const response = await request(httpServer)
      .patch(`/pagamento-forma/${forma.pagamentoForma_id}`)
      .send({
        pagamentoForma_contaDestino: 'Conta Atualizada',
      })
      .expect(200);

    expect(response.body.mensagem).toBe(`Forma de pagamento; ${forma.pagamentoForma_id}`);
    expect(response.body.forma.pagamentoForma_descricao).toBe('Transferência');
    expect(response.body.forma.pagamentoForma_contaDestino).toBe('Conta Atualizada');
  });

  it('PATCH /pagamento-forma/:id deve retornar 404 para forma inexistente', async () => {
    const response = await request(httpServer)
      .patch('/pagamento-forma/999')
      .send({
        pagamentoForma_descricao: 'Atualizada',
      })
      .expect(404);

    expect(response.body.message).toBe('Erro ao atualizar forma de pagamento');
  });

  it('DELETE /pagamento-forma/:id deve remover a forma', async () => {
    const forma = await repo.save({
      pagamentoForma_descricao: 'Boleto',
      pagamentoForma_contaDestino: 'Conta Boletos',
    });

    const response = await request(httpServer).delete(`/pagamento-forma/${forma.pagamentoForma_id}`).expect(200);

    expect(response.body.mensagem).toBe(`Forma de pagamento ${forma.pagamentoForma_id} Excluido com sucesso`);

    const restantes = await repo.find();
    expect(restantes).toHaveLength(0);
  });

  it('DELETE /pagamento-forma/:id deve retornar 404 para forma inexistente', async () => {
    const response = await request(httpServer).delete('/pagamento-forma/999').expect(404);

    expect(response.body.message).toBe('Erro ao excluir Forma de pagamento');
  });

  it('POST /pagamento-forma deve falhar com payload inválido', async () => {
    const response = await request(httpServer)
      .post('/pagamento-forma')
      .send({
        pagamentoForma_descricao: 123,
      })
      .expect(400);

    expect(Array.isArray(response.body.message)).toBe(true);
    expect(response.body.message.some((msg: string) => msg.includes('pagamentoForma_contaDestino'))).toBe(true);
  });
});
