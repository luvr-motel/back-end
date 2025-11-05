import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ObjectLiteral, Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';
import { RecebimentoService } from './recebimento.service';
import { Recebimento } from './entities/recebimento.entity';
import { CreateRecebimentoDto } from './dto/create-recebimento.dto';
import { UpdateRecebimentoDto } from './dto/update-recebimento.dto';

type MockRepository<T extends ObjectLiteral = ObjectLiteral> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

const createMockRepository = <T extends ObjectLiteral = ObjectLiteral>():
  MockRepository<T> => ({
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    merge: jest.fn(),
    softDelete: jest.fn(),
  });

const createRecebimentoEntity = (
  override: Partial<Recebimento> = {},
): Recebimento =>
  ({
    recebimento_id: 1,
    recebimento_descricao: 'Descrição padrão',
    recebimento_total: 100,
    pagamentoforma_id: [],
    motel_id: undefined,
    recebimento_inclusao: new Date(),
    recebimento_exclusao: null,
    ...override,
  } as unknown as Recebimento);

describe('RecebimentoService', () => {
  let service: RecebimentoService;
  let repository: jest.Mocked<Repository<Recebimento>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecebimentoService,
        {
          provide: getRepositoryToken(Recebimento),
          useValue: createMockRepository<Recebimento>(),
        },
      ],
    }).compile();

    service = module.get<RecebimentoService>(RecebimentoService);
    repository = module.get(
      getRepositoryToken(Recebimento),
    ) as jest.Mocked<Repository<Recebimento>>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createRecebimento', () => {
    it('deve criar e salvar um recebimento', async () => {
      const dto: CreateRecebimentoDto = {
        recebimento_descricao: 'Teste',
        recebimento_total: 100,
        motel_id: 1,
      };
      const entity = createRecebimentoEntity({
        recebimento_id: 99,
        recebimento_descricao: dto.recebimento_descricao,
        recebimento_total: dto.recebimento_total,
        motel_id: { motel_id: dto.motel_id } as any,
      });

      repository.create.mockReturnValue(entity);
      repository.save.mockResolvedValue(entity);

      const result = await service.createRecebimento(dto);

      expect(repository.create).toHaveBeenCalledWith({
        recebimento_descricao: dto.recebimento_descricao,
        recebimento_total: dto.recebimento_total,
        motel_id: { motel_id: dto.motel_id },
      });
      expect(repository.save).toHaveBeenCalledWith(entity);
      expect(result).toBe(entity);
    });
  });

  describe('findAllRecebimento', () => {
    it('deve retornar todos os recebimentos', async () => {
      const recebimentos = [createRecebimentoEntity()];
      repository.find.mockResolvedValue(recebimentos);

      const result = await service.findAllRecebimento();

      expect(repository.find).toHaveBeenCalledWith({
        relations: ['pagamentoforma_id', 'motel_id'],
      });
      expect(result).toBe(recebimentos);
    });
  });

  describe('findRecebimentoById', () => {
    it('deve retornar um recebimento existente com mensagem', async () => {
      const entity = createRecebimentoEntity({ recebimento_id: 5 });
      repository.findOne.mockResolvedValue(entity);

      const result = await service.findRecebimentoById(5);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { recebimento_id: 5 },
        relations: ['pagamentoforma_id', 'motel_id'],
      });
      expect(result).toEqual({
        mensagem: 'Recebimento #5 encontrado com sucesso',
        recebimento: entity,
      });
    });

    it('deve lançar exceção quando recebimento não encontrado', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findRecebimentoById(1)).rejects.toEqual(
        new HttpException('Recebimento não encontrado', 404),
      );
    });
  });

  describe('updateRecebimentoById', () => {
    it('deve atualizar um recebimento existente', async () => {
      const entity = createRecebimentoEntity({ recebimento_id: 10 });
      const dto: UpdateRecebimentoDto = {
        recebimento_total: 200,
        motel_id: 2,
      };
      const merged = {
        ...entity,
        recebimento_total: dto.recebimento_total,
      } as unknown as Recebimento;
      const saved = { ...merged };

      repository.findOne.mockResolvedValue(entity);
      repository.merge.mockReturnValue(merged);
      repository.save.mockResolvedValue(saved);

      const result = await service.updateRecebimentoById(10, dto);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { recebimento_id: 10 },
        relations: ['pagamentoforma_id', 'motel_id'],
      });
      expect(repository.merge).toHaveBeenCalledWith(
        entity,
        expect.objectContaining({
          recebimento_total: 200,
        }),
      );
      expect(repository.save).toHaveBeenCalledWith(merged);
      expect(result).toEqual({
        mensagem: 'Recebimento atualizado com sucesso!',
        recebimento: saved,
      });
    });

    it('deve lançar exceção quando recebimento não encontrado', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(
        service.updateRecebimentoById(1, { recebimento_total: 200 }),
      ).rejects.toEqual(new HttpException('Erro ao atualizar recebimento', 404));
    });
  });

  describe('deleteRecebimento', () => {
    it('deve realizar soft delete e retornar mensagem', async () => {
      const entity = createRecebimentoEntity({ recebimento_id: 3 });
      repository.findOne.mockResolvedValue(entity);

      const result = await service.deleteRecebimento(3);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { recebimento_id: 3 },
      });
      expect(repository.softDelete).toHaveBeenCalledWith(3);
      expect(result).toEqual({
        mensagem: 'Recebimento excluído com sucesso!',
        recebimento: entity,
      });
    });

    it('deve lançar exceção quando recebimento não encontrado', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.deleteRecebimento(1)).rejects.toEqual(
        new HttpException('Erro ao excluir recebimento', 404),
      );
    });
  });
});
