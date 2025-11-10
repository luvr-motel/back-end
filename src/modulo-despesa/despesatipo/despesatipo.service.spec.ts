import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DespesatipoService } from './despesatipo.service';
import { Despesatipo } from './entities/despesatipo.entity';
import { CreateDespesatipoDto } from './dto/create-despesatipo.dto';
import { UpdateDespesatipoDto } from './dto/update-despesatipo.dto';

type MockRepository = Partial<
  Record<
    keyof Pick<
      Repository<Despesatipo>,
      'create' | 'save' | 'find' | 'findOne' | 'merge' | 'softDelete'
    >,
    jest.Mock
  >
>;

const createMockRepository = (): MockRepository => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  merge: jest.fn(),
  softDelete: jest.fn(),
});

describe('DespesatipoService', () => {
  let service: DespesatipoService;
  let repository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DespesatipoService,
        {
          provide: getRepositoryToken(Despesatipo),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get(DespesatipoService);
    repository = module.get(getRepositoryToken(Despesatipo));
  });

  describe('createDespesatipo', () => {
    it('deve criar e salvar um novo tipo de despesa', async () => {
      const dto: CreateDespesatipoDto = {
        despesatipo_descricao: 'Fornecedor',
      };
      const entity = { despesatipo_id: 1 } as Despesatipo;

      (repository.create as jest.Mock).mockReturnValue(entity);
      (repository.save as jest.Mock).mockResolvedValue(entity);

      const result = await service.createDespesatipo(dto);

      expect(repository.create).toHaveBeenCalledWith({
        despesatipo_descricao: dto.despesatipo_descricao,
      });
      expect(repository.save).toHaveBeenCalledWith(entity);
      expect(result).toBe(entity);
    });
  });

  describe('findAllDespesatipo', () => {
    it('deve listar todos os tipos', async () => {
      const lista = [{ despesatipo_id: 1 }] as Despesatipo[];
      (repository.find as jest.Mock).mockResolvedValue(lista);

      const result = await service.findAllDespesatipo();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toBe(lista);
    });
  });

  describe('findOneDespesatipo', () => {
    it('deve retornar um tipo existente', async () => {
      const tipo = { despesatipo_id: 10 } as Despesatipo;
      (repository.findOne as jest.Mock).mockResolvedValue(tipo);

      const result = await service.findOneDespesatipo(10);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { despesatipo_id: 10 },
      });
      expect(result).toEqual({
        mensagem: 'despesatipo encontrado com o id: #10',
        despesatipo: tipo,
      });
    });

    it('deve lançar exceção quando não encontrar', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.findOneDespesatipo(1)).rejects.toThrow(
        'despesatipo não encontrado',
      );
    });
  });

  describe('updateDespesatipo', () => {
    it('deve atualizar um tipo existente', async () => {
      const existente = { despesatipo_id: 1 } as Despesatipo;
      const dto: UpdateDespesatipoDto = { despesatipo_descricao: 'Novo' };
      const atualizado = { ...existente, ...dto } as Despesatipo;

      (repository.findOne as jest.Mock).mockResolvedValue(existente);
      (repository.merge as jest.Mock).mockReturnValue(atualizado);
      (repository.save as jest.Mock).mockResolvedValue(atualizado);

      const result = await service.updateDespesatipo(1, dto);

      expect(repository.merge).toHaveBeenCalledWith(existente, dto);
      expect(repository.save).toHaveBeenCalledWith(atualizado);
      expect(result).toEqual({
        mensagem: 'Tipo de despesa #1 atualizado com sucesso',
        despesatipo: atualizado,
      });
    });

    it('deve lançar exceção se não encontrar o tipo', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.updateDespesatipo(1, {})).rejects.toThrow(
        'Erro ao atualizar despesatipo',
      );
    });
  });

  describe('removeDespesatipo', () => {
    it('deve remover um tipo existente', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue({
        despesatipo_id: 1,
      } as Despesatipo);
      (repository.softDelete as jest.Mock).mockResolvedValue(undefined);

      const result = await service.removeDespesatipo(1);

      expect(repository.softDelete).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        mensagem: 'Tipo de despesa 1 excluído com sucesso',
      });
    });

    it('deve lançar exceção se o tipo não existir', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.removeDespesatipo(2)).rejects.toThrow(
        'Erro ao excluir tipo de despesa',
      );
    });
  });
});
