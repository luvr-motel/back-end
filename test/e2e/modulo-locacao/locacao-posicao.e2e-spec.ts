import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import request from 'supertest';

import { LocacaoPosicaoModule } from 'src/modulo-locacao/locacao-posicao/locacao-posicao.module';
import { LocacaoPosicao } from 'src/modulo-locacao/locacao-posicao/entities/locacao-posicao.entity';

jest.setTimeout(30000);

describe('LocacaoPosicaoController (e2e)', () => {
  let app: INestApplication;
  let httpServer: any;
  let repo: Repository<LocacaoPosicao>;

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
        LocacaoPosicaoModule,
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
    repo = moduleFixture.get<Repository<LocacaoPosicao>>(getRepositoryToken(LocacaoPosicao));
  });

  beforeEach(async () => {
    await repo.createQueryBuilder().delete().from(LocacaoPosicao).execute();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /locacao-posicao deve criar uma posição', async () => {
    const response = await request(httpServer)
      .post('/locacao-posicao')
      .send({ locacaoPosicao_descricao: 'OCUPADO' })
      .expect(201);

    expect(response.body.mensagem).toBe('Posição criada com sucesso!');
    expect(response.body.posicao.locacaoPosicao_descricao).toBe('OCUPADO');
  });

  it('GET /locacao-posicao deve listar as posições', async () => {
    await repo.save({ locacaoPosicao_descricao: 'LIMPEZA' });
    await repo.save({ locacaoPosicao_descricao: 'OCUPADO' });

    const response = await request(httpServer).get('/locacao-posicao').expect(200);

    expect(response.body).toHaveLength(2);
    expect(response.body.some((p: LocacaoPosicao) => p.locacaoPosicao_descricao === 'LIMPEZA')).toBe(true);
  });

  it('GET /locacao-posicao/:id deve retornar posição específica', async () => {
    const posicao = await repo.save({ locacaoPosicao_descricao: 'MANUTENÇÃO' });

    const response = await request(httpServer).get(`/locacao-posicao/${posicao.locacaoPosicao_id}`).expect(200);

    expect(response.body.mensagem).toBe(`Posição de locação #${posicao.locacaoPosicao_id}`);
    expect(response.body.posicao.locacaoPosicao_descricao).toBe('MANUTENÇÃO');
  });

  it('GET /locacao-posicao/:id deve retornar 404 quando inexistente', async () => {
    const response = await request(httpServer).get('/locacao-posicao/999').expect(404);
    expect(response.body.message).toBe('Posição de locação não encontrada');
  });

  it('PATCH /locacao-posicao/:id deve atualizar a descrição', async () => {
    const posicao = await repo.save({ locacaoPosicao_descricao: 'ORIGINAL' });

    const response = await request(httpServer)
      .patch(`/locacao-posicao/${posicao.locacaoPosicao_id}`)
      .send({ locacaoPosicao_descricao: 'ATUALIZADO' })
      .expect(200);

    expect(response.body.mensagem).toBe('Posição de locação atualizada com sucesso');
    expect(response.body.posicao.locacaoPosicao_descricao).toBe('ATUALIZADO');
  });

  it('PATCH /locacao-posicao/:id deve retornar 404 quando inexistente', async () => {
    const response = await request(httpServer)
      .patch('/locacao-posicao/999')
      .send({ locacaoPosicao_descricao: 'ATUALIZADO' })
      .expect(404);

    expect(response.body.message).toBe('Posição de locação não encontrado');
  });

  it('DELETE /locacao-posicao/:id deve remover posição', async () => {
    const posicao = await repo.save({ locacaoPosicao_descricao: 'REMOVER' });

    const response = await request(httpServer).delete(`/locacao-posicao/${posicao.locacaoPosicao_id}`).expect(200);

    expect(response.body.mensagem).toBe('Posição de locação excluida com sucesso');
  });

  it('DELETE /locacao-posicao/:id deve retornar 404 quando inexistente', async () => {
    const response = await request(httpServer).delete('/locacao-posicao/999').expect(404);
    expect(response.body.message).toBe('Erro ao excluir posição de locação');
  });

  it('POST /locacao-posicao deve falhar com payload inválido', async () => {
    const response = await request(httpServer)
      .post('/locacao-posicao')
      .send({ locacaoPosicao_descricao: 123 })
      .expect(400);

    expect(Array.isArray(response.body.message)).toBe(true);
  });
});
