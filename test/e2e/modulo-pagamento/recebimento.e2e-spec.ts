import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import request from 'supertest';

import { Recebimento } from 'src/modulo-pagamento/recebimento/entities/recebimento.entity';
import { RecebimentoModule } from 'src/modulo-pagamento/recebimento/recebimento.module';
import { Motel, MotelStatus } from 'src/modulo-motel/motel/entities/motel.entity';

jest.setTimeout(30000);

describe('RecebimentoController (e2e)', () => {
  let app: INestApplication;
  let httpServer: any;
  let recebimentoRepo: Repository<Recebimento>;
  let motelRepo: Repository<Motel>;
  let motelBase: Motel;

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
        TypeOrmModule.forFeature([Motel]),
        RecebimentoModule,
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
    recebimentoRepo = moduleFixture.get<Repository<Recebimento>>(getRepositoryToken(Recebimento));
    motelRepo = moduleFixture.get<Repository<Motel>>(getRepositoryToken(Motel));
  });

  beforeEach(async () => {
    await recebimentoRepo.createQueryBuilder().delete().from(Recebimento).execute();
    await motelRepo.createQueryBuilder().delete().from(Motel).execute();

    motelBase = await motelRepo.save({
      motel_descricao: 'Motel Recebimento',
      motel_endereco: 'Rua A',
      motel_email: 'motel@teste.com',
      motel_cnpj: `22.222.222/0001-${Math.floor(Math.random() * 90 + 10)}`,
      motel_ativo: MotelStatus.ATIVO,
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /recebimento deve criar um recebimento', async () => {
    const response = await request(httpServer)
      .post('/recebimento')
      .send({
        recebimento_descricao: 'Recebimento Janeiro',
        recebimento_total: 1500.5,
        motel_id: motelBase.motel_id,
      })
      .expect(201);

    expect(response.body.recebimento_id).toBeDefined();
    expect(response.body.recebimento_descricao).toBe('Recebimento Janeiro');
    expect(Number(response.body.recebimento_total)).toBeCloseTo(1500.5);
  });

  it('GET /recebimento deve listar todos os recebimentos', async () => {
    await recebimentoRepo.save([
      {
        recebimento_descricao: 'R1',
        recebimento_total: 100,
        motel_id: motelBase,
      },
      {
        recebimento_descricao: 'R2',
        recebimento_total: 200,
      },
    ]);

    const response = await request(httpServer).get('/recebimento').expect(200);

    expect(response.body).toHaveLength(2);
    expect(response.body.some((r: Recebimento) => r.recebimento_descricao === 'R1')).toBe(true);
  });

  it('GET /recebimento/:id deve retornar um recebimento específico', async () => {
    const recebido = await recebimentoRepo.save({
      recebimento_descricao: 'R Detalhe',
      recebimento_total: 300,
      motel_id: motelBase,
    });

    const response = await request(httpServer).get(`/recebimento/${recebido.recebimento_id}`).expect(200);
    expect(response.body.mensagem).toBe(`Recebimento #${recebido.recebimento_id} encontrado com sucesso`);
    expect(response.body.recebimento.recebimento_descricao).toBe('R Detalhe');
  });

  it('GET /recebimento/:id deve retornar 404 quando inexistente', async () => {
    const response = await request(httpServer).get('/recebimento/999').expect(404);
    expect(response.body.message).toBe('Recebimento não encontrado');
  });

  it('PATCH /recebimento/:id deve atualizar campos e motel', async () => {
    const recebimento = await recebimentoRepo.save({
      recebimento_descricao: 'Atualizar',
      recebimento_total: 400,
      motel_id: motelBase,
    });

    const novoMotel = await motelRepo.save({
      motel_descricao: 'Motel Novo',
      motel_endereco: 'Rua B',
      motel_email: 'novo@motel.com',
      motel_cnpj: `55.555.555/0001-${Math.floor(Math.random() * 90 + 10)}`,
      motel_ativo: MotelStatus.ATIVO,
    });

    const response = await request(httpServer)
      .patch(`/recebimento/${recebimento.recebimento_id}`)
      .send({
        recebimento_total: 450.75,
        motel_id: novoMotel.motel_id,
      })
      .expect(200);

    expect(response.body.mensagem).toBe('Recebimento atualizado com sucesso!');
    expect(Number(response.body.recebimento.recebimento_total)).toBeCloseTo(450.75);
    expect(response.body.recebimento.motel_id.motel_id).toBe(novoMotel.motel_id);
  });

  it('PATCH /recebimento/:id deve retornar 404 quando inexistente', async () => {
    const response = await request(httpServer)
      .patch('/recebimento/999')
      .send({ recebimento_descricao: 'Inexistente' })
      .expect(404);

    expect(response.body.message).toBe('Erro ao atualizar recebimento');
  });

  it('DELETE /recebimento/:id deve remover recebimento', async () => {
    const recebimento = await recebimentoRepo.save({
      recebimento_descricao: 'Excluir',
      recebimento_total: 500,
    });

    const response = await request(httpServer).delete(`/recebimento/${recebimento.recebimento_id}`).expect(200);

    expect(response.body.mensagem).toBe('Recebimento excluído com sucesso!');

    const removido = await recebimentoRepo.findOne({
      where: { recebimento_id: recebimento.recebimento_id },
      withDeleted: true,
    });
    expect(removido!.recebimento_exclusao).toBeInstanceOf(Date);
  });

  it('DELETE /recebimento/:id deve retornar 404 quando inexistente', async () => {
    const response = await request(httpServer).delete('/recebimento/999').expect(404);
    expect(response.body.message).toBe('Erro ao excluir recebimento');
  });

  it('POST /recebimento deve falhar com payload inválido', async () => {
    const response = await request(httpServer)
      .post('/recebimento')
      .send({
        recebimento_descricao: '',
        recebimento_total: 'abc',
      })
      .expect(400);

    expect(Array.isArray(response.body.message)).toBe(true);
    expect(response.body.message.some((msg: string) => msg.includes('recebimento_descricao'))).toBe(true);
  });
});
