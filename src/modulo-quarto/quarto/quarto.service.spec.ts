import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuartoService } from './quarto.service';
import { Quarto } from './entities/quarto.entity';
import { CreateQuartoDto } from './dto/create-quarto.dto';
import { UpdateQuartoDto } from './dto/update-quarto.dto';

type MockRepository = Partial<
  Record<
    keyof Pick<
      Repository<Quarto>,
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

describe('QuartoService', () => {
  let service: QuartoService;
  let repository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuartoService,
        {
          provide: getRepositoryToken(Quarto),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get(QuartoService);
    repository = module.get(getRepositoryToken(Quarto));
  });

  describe('createQuarto', () => {
    it('deve criar um quarto incluindo relações corretas', async () => {
      const dto: CreateQuartoDto = {
        quarto_descricao: 'Suíte 101',
        quarto_atributos: 'Ar-condicionado',
        quarto_ativo: true,
        quartotipo_id: 2,
        motel: 3,
      };
      const entity = { quarto_id: 1 } as Quarto;

      (repository.create as jest.Mock).mockReturnValue(entity);
      (repository.save as jest.Mock).mockResolvedValue(entity);

      const result = await service.createQuarto(dto);

      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          quarto_descricao: dto.quarto_descricao,
          quartotipo: { quartotipo_Id: dto.quartotipo_id },
          motel: { motel_id: dto.motel },
        }),
      );
      expect(repository.save).toHaveBeenCalledWith(entity);
      expect(result).toBe(entity);
    });

    it('deve criar sem motel quando não informado', async () => {
      const dto: CreateQuartoDto = {
        quarto_descricao: 'Suíte 102',
        quarto_atributos: 'TV',
        quarto_ativo: false,
        quartotipo_id: 5,
        motel: undefined,
      };
      const entity = { quarto_id: 2 } as Quarto;
      (repository.create as jest.Mock).mockReturnValue(entity);
      (repository.save as jest.Mock).mockResolvedValue(entity);

      await service.createQuarto(dto);

      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          motel: undefined,
        }),
      );
    });
  });

  describe('findAllQuartos', () => {
    it('deve retornar lista de quartos', async () => {
      const quartos = [{ quarto_id: 1 }] as Quarto[];
      (repository.find as jest.Mock).mockResolvedValue(quartos);

      const result = await service.findAllQuartos();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toBe(quartos);
    });
  });

  describe('findQuartoId', () => {
    it('deve retornar quarto existente', async () => {
      const quarto = { quarto_id: 1 } as Quarto;
      (repository.findOne as jest.Mock).mockResolvedValue(quarto);

      const result = await service.findQuartoId(1);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { quarto_id: 1 },
      });
      expect(result).toEqual({
        mensagem: 'Quarto #1',
        quarto,
      });
    });

    it('deve lançar erro quando não encontrar', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.findQuartoId(99)).rejects.toThrow(
        'Quarto não encontrado',
      );
    });
  });

  describe('updateQuarto', () => {
    it('deve atualizar quarto existente', async () => {
      const existente = { quarto_id: 1 } as Quarto;
      const dto: UpdateQuartoDto = { quarto_descricao: 'Atualizado' };
      const atualizado = { ...existente, ...dto } as Quarto;

      (repository.findOne as jest.Mock).mockResolvedValue(existente);
      (repository.merge as jest.Mock).mockReturnValue(atualizado);
      (repository.save as jest.Mock).mockResolvedValue(atualizado);

      const result = await service.updateQuarto(1, dto);

      expect(repository.merge).toHaveBeenCalledWith(existente, dto);
      expect(repository.save).toHaveBeenCalledWith(atualizado);
      expect(result).toEqual({
        mensagem: 'quarto #1 atualizado com sucesso',
        quarto: atualizado,
      });
    });

    it('deve lançar erro quando quarto não existe', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.updateQuarto(1, {})).rejects.toThrow(
        'Erro ao atualizar quarto',
      );
    });
  });

  describe('deleteQuartoById', () => {
    it('deve remover quarto existente', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue({
        quarto_id: 1,
      } as Quarto);
      (repository.softDelete as jest.Mock).mockResolvedValue(undefined);

      const result = await service.deleteQuartoById(1);

      expect(repository.softDelete).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        mensagem: 'Quarto #1 excluído com sucesso',
      });
    });

    it('deve lançar erro quando quarto não existe', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.deleteQuartoById(2)).rejects.toThrow(
        'Erro ao excluir quarto',
      );
    });
  });
});
