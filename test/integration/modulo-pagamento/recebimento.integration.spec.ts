import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';

import { Recebimento } from 'src/modulo-pagamento/recebimento/entities/recebimento.entity';
import { RecebimentoService } from 'src/modulo-pagamento/recebimento/recebimento.service';
import { Motel, MotelStatus } from 'src/modulo-motel/motel/entities/motel.entity';

jest.setTimeout(30000);

describe('RecebimentoService (integração)', () => {
  let moduleRef: TestingModule;
  let service: RecebimentoService;
  let recebimentoRepo: Repository<Recebimento>;
  let motelRepo: Repository<Motel>;
  let motelBase: Motel;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
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
        TypeOrmModule.forFeature([Recebimento, Motel]),
      ],
      providers: [RecebimentoService],
    }).compile();

    service = moduleRef.get<RecebimentoService>(RecebimentoService);
    recebimentoRepo = moduleRef.get<Repository<Recebimento>>(getRepositoryToken(Recebimento));
    motelRepo = moduleRef.get<Repository<Motel>>(getRepositoryToken(Motel));
  });

  beforeEach(async () => {
    await recebimentoRepo.createQueryBuilder().delete().from(Recebimento).execute();
    await motelRepo.createQueryBuilder().delete().from(Motel).execute();

    motelBase = await motelRepo.save({
      motel_descricao: 'Motel Recebimento',
      motel_endereco: 'Rua A',
      motel_email: 'recebimento@motel.com',
      motel_cnpj: `88.888.888/0001-${Math.floor(Math.random() * 90 + 10)}`,
      motel_ativo: MotelStatus.ATIVO,
    });
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it('deve criar um recebimento e recuperá-lo (createRecebimento + findAll + findById)', async () => {
    const criado = await service.createRecebimento({
      recebimento_descricao: 'Receita Fevereiro',
      recebimento_total: 1234.56,
      motel_id: motelBase.motel_id,
    });

    expect(criado.recebimento_id).toBeDefined();
    expect(criado.recebimento_descricao).toBe('Receita Fevereiro');
    expect(Number(criado.recebimento_total)).toBeCloseTo(1234.56);

    const todos = await service.findAllRecebimento();
    expect(todos).toHaveLength(1);
    expect(todos[0].motel_id?.motel_id).toBe(motelBase.motel_id);

    const { mensagem, recebimento } = await service.findRecebimentoById(criado.recebimento_id);
    expect(mensagem).toBe(`Recebimento #${criado.recebimento_id} encontrado com sucesso`);
    expect(recebimento.recebimento_descricao).toBe('Receita Fevereiro');
  });

  it('deve listar múltiplos recebimentos', async () => {
    await service.createRecebimento({
      recebimento_descricao: 'Diária 1',
      recebimento_total: 100,
      motel_id: motelBase.motel_id,
    });
    await service.createRecebimento({
      recebimento_descricao: 'Diária 2',
      recebimento_total: 200,
    });
    await service.createRecebimento({
      recebimento_descricao: 'Diária 3',
      recebimento_total: 300,
    });

    const todos = await service.findAllRecebimento();
    expect(todos).toHaveLength(3);
    expect(todos.some((r) => Number(r.recebimento_total) === 200)).toBe(true);
  });

  it('deve lançar HttpException ao buscar recebimento inexistente', async () => {
    await expect(service.findRecebimentoById(999)).rejects.toMatchObject({
      message: 'Recebimento não encontrado',
      status: 404,
    });
  });

  it('deve atualizar um recebimento existente', async () => {
    const criado = await service.createRecebimento({
      recebimento_descricao: 'Atualizar',
      recebimento_total: 400,
      motel_id: motelBase.motel_id,
    });

    const novoMotel = await motelRepo.save({
      motel_descricao: 'Motel Atualizado',
      motel_endereco: 'Rua B',
      motel_email: 'novo@motel.com',
      motel_cnpj: `55.555.555/0001-${Math.floor(Math.random() * 90 + 10)}`,
      motel_ativo: MotelStatus.ATIVO,
    });

    const { mensagem, recebimento } = await service.updateRecebimentoById(criado.recebimento_id, {
      recebimento_total: 450.75,
      motel_id: novoMotel.motel_id,
    });

    expect(mensagem).toBe('Recebimento atualizado com sucesso!');
    expect(Number(recebimento.recebimento_total)).toBeCloseTo(450.75);
    expect(recebimento.motel_id.motel_id).toBe(novoMotel.motel_id);
  });

  it('deve lançar HttpException ao atualizar recebimento inexistente', async () => {
    await expect(
      service.updateRecebimentoById(999, {
        recebimento_descricao: 'Inexistente',
      }),
    ).rejects.toMatchObject({
      message: 'Erro ao atualizar recebimento',
      status: 404,
    });
  });

  it('deve realizar soft delete do recebimento', async () => {
    const criado = await service.createRecebimento({
      recebimento_descricao: 'Remover',
      recebimento_total: 600,
    });

    const resp = await service.deleteRecebimento(criado.recebimento_id);
    expect(resp.mensagem).toBe('Recebimento excluído com sucesso!');

    const removido = await recebimentoRepo.findOne({
      where: { recebimento_id: criado.recebimento_id },
      withDeleted: true,
    });

    expect(removido).toBeDefined();
    expect(removido!.recebimento_exclusao).toBeInstanceOf(Date);

    const todos = await service.findAllRecebimento();
    expect(todos).toHaveLength(0);
  });

  it('deve lançar HttpException ao excluir recebimento inexistente', async () => {
    await expect(service.deleteRecebimento(999)).rejects.toMatchObject({
      message: 'Erro ao excluir recebimento',
      status: 404,
    });
  });

  it('deve manter dados anteriores quando atualizar parcialmente', async () => {
    const criado = await service.createRecebimento({
      recebimento_descricao: 'Parcial',
      recebimento_total: 700,
      motel_id: motelBase.motel_id,
    });

    const { recebimento } = await service.updateRecebimentoById(criado.recebimento_id, {
      recebimento_total: 710,
    });

    expect(recebimento.recebimento_descricao).toBe('Parcial');
    expect(Number(recebimento.recebimento_total)).toBeCloseTo(710);
    expect(recebimento.motel_id.motel_id).toBe(motelBase.motel_id);
  });

  it('deve retornar lista vazia quando não existirem recebimentos', async () => {
    await recebimentoRepo.createQueryBuilder().delete().from(Recebimento).execute();

    const todos = await service.findAllRecebimento();
    expect(todos).toEqual([]);
  });

  it('deve permitir criação sem motel e retornar dados numéricos corretamente', async () => {
    const criado = await service.createRecebimento({
      recebimento_descricao: 'Sem Motel',
      recebimento_total: 999.99,
    });

    expect(criado.motel_id).toBeUndefined();
    // em bancos Postgres o decimal volta como string
    expect(Number(criado.recebimento_total)).toBeCloseTo(999.99);
  });

  it('deve manter data de inclusão após múltiplas atualizações', async () => {
    const criado = await service.createRecebimento({
      recebimento_descricao: 'Multi Update',
      recebimento_total: 100,
    });

    const inclusaoOriginal = criado.recebimento_inclusao.getTime();

    await service.updateRecebimentoById(criado.recebimento_id, {
      recebimento_total: 150,
    });
    const { recebimento: atualizado } = await service.updateRecebimentoById(criado.recebimento_id, {
      recebimento_descricao: 'Multi Update Final',
    });

    expect(atualizado.recebimento_descricao).toBe('Multi Update Final');
    expect(Number(atualizado.recebimento_total)).toBeCloseTo(150);
    expect(atualizado.recebimento_inclusao.getTime()).toBe(inclusaoOriginal);
  });

  it('deve lançar HttpException ao buscar recebimento removido', async () => {
    const criado = await service.createRecebimento({
      recebimento_descricao: 'Removido',
      recebimento_total: 500,
    });

    await service.deleteRecebimento(criado.recebimento_id);

    await expect(service.findRecebimentoById(criado.recebimento_id)).rejects.toMatchObject({
      message: 'Recebimento não encontrado',
      status: 404,
    });
  });

  it('deve preencher recebimento_inclusao e recebimento_exclusao corretamente', async () => {
    const criado = await service.createRecebimento({
      recebimento_descricao: 'Datas',
      recebimento_total: 321,
    });

    expect(criado.recebimento_inclusao).toBeInstanceOf(Date);
    expect(criado.recebimento_exclusao).toBeNull();

    await service.deleteRecebimento(criado.recebimento_id);

    const removido = await recebimentoRepo.findOne({
      where: { recebimento_id: criado.recebimento_id },
      withDeleted: true,
    });

    expect(removido!.recebimento_inclusao).toBeInstanceOf(Date);
    expect(removido!.recebimento_exclusao).toBeInstanceOf(Date);
  });
});
