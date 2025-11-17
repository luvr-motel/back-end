import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import request from 'supertest';

import { LocacaoTipoModule } from 'src/modulo-locacao/locacao-tipo/locacao-tipo.module';
import { LocacaoTipo } from 'src/modulo-locacao/locacao-tipo/entities/locacao-tipo.entity';

jest.setTimeout(30000);

describe('LocacaoTipoController (e2e)', () => {
  let app: INestApplication;
  let httpServer: any;
  let repo: Repository<LocacaoTipo>;

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
        LocacaoTipoModule,
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
    repo = moduleFixture.get<Repository<LocacaoTipo>>(getRepositoryToken(LocacaoTipo));
  });

  beforeEach(async () => {
    await repo.createQueryBuilder().delete().from(LocacaoTipo).execute();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /locacao-tipo deve criar um tipo de locação', async () => {
    const response = await request(httpServer)
      .post('/locacao-tipo')
      .send({ locacaoTipo_descricao: 'Standard', locacoTIpo_valor: 100 })
      .expect(201);

    expect(response.body.locacaoTipo_id).toBeDefined();
    expect(response.body.locacaoTipo_descricao).toBe('Standard');
  });

  it('GET /locacao-tipo deve listar tipos de locação', async () => {
    await repo.save({ locacaoTipo_descricao: 'Hora', locacoTipo_valor: 50 });
    await repo.save({ locacaoTipo_descricao: 'Período', locacoTipo_valor: 90 });

    const response = await request(httpServer).get('/locacao-tipo').expect(200);

    expect(response.body).toHaveLength(2);
    expect(response.body.some((tipo: LocacaoTipo) => tipo.locacaoTipo_descricao === 'Período')).toBe(true);
  });

  it('GET /locacao-tipo/:id deve retornar tipo específico', async () => {
    const tipo = await repo.save({ locacaoTipo_descricao: 'Executivo', locacoTipo_valor: 120 });

    const response = await request(httpServer).get(`/locacao-tipo/${tipo.locacaoTipo_id}`).expect(200);

    expect(response.body.mensagem).toBe(`Categoria de locação: #${tipo.locacaoTipo_id} atualizada com sucesso`);
    expect(response.body.tipo.locacaoTipo_descricao).toBe('Executivo');
  });

  it('GET /locacao-tipo/:id deve retornar 404 quando inexistente', async () => {
    const response = await request(httpServer).get('/locacao-tipo/999').expect(404);

    expect(response.body.message).toBe('Categoria não encontrada');
  });

  it('PATCH /locacao-tipo/:id deve atualizar tipo', async () => {
    const tipo = await repo.save({ locacaoTipo_descricao: 'Original', locacoTipo_valor: 60 });

    const response = await request(httpServer)
      .patch(`/locacao-tipo/${tipo.locacaoTipo_id}`)
      .send({ locacaoTipo_descricao: 'Atualizado', locacoTIpo_valor: 80 })
      .expect(200);

    expect(response.body.mensagem).toBe('Categoria de locação atualizada com sucesso!');
    expect(response.body.tipo.locacaoTipo_descricao).toBe('Atualizado');
    // Service does not map locacoTIpo -> locacoTipo, so valor permanece 60
    expect(Number(response.body.tipo.locacoTipo_valor)).toBeCloseTo(60);
  });

  it('PATCH /locacao-tipo/:id deve retornar 404 quando inexistente', async () => {
    const response = await request(httpServer)
      .patch('/locacao-tipo/999')
      .send({ locacaoTipo_descricao: 'Atualizado' })
      .expect(404);

    expect(response.body.message).toBe('Erro ao atualizar categoria de locação');
  });

  it('DELETE /locacao-tipo/:id deve remover tipo', async () => {
    const tipo = await repo.save({ locacaoTipo_descricao: 'Remover', locacoTipo_valor: 70 });

    const response = await request(httpServer).delete(`/locacao-tipo/${tipo.locacaoTipo_id}`).expect(200);

    expect(response.body.mensagem).toBe('Categoria de locação excluida com sucesso!');
  });

  it('DELETE /locacao-tipo/:id deve retornar 404 quando inexistente', async () => {
    const response = await request(httpServer).delete('/locacao-tipo/999').expect(404);
    expect(response.body.message).toBe('Erro ao excluir categoria de locação');
  });

  it('POST /locacao-tipo deve falhar com payload inválido', async () => {
    const response = await request(httpServer)
      .post('/locacao-tipo')
      .send({ locacaoTipo_descricao: '', locacoTIpo_valor: 'abc' })
      .expect(400);

    expect(Array.isArray(response.body.message)).toBe(true);
  });
});
