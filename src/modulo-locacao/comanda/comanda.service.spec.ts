import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ComandaService } from './comanda.service';
import { Comanda } from './entities/comanda.entity';
import { CreateComandaDto } from './dto/create-comanda.dto';
import { UpdateComandaDto } from './dto/update-comanda.dto';

type MockRepository = Partial<
  Record<
    keyof Pick<
      Repository<Comanda>,
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

describe('ComandaService', () => {
  let service: ComandaService;
  let repository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ComandaService,
        {
          provide: getRepositoryToken(Comanda),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get(ComandaService);
    repository = module.get(getRepositoryToken(Comanda));
  });

  describe('createComanda', () => {
    it('deve criar e salvar uma comanda', async () => {
      const dto: CreateComandaDto = {
        comanda_observacao: 'Observação',
        comanda_qtde: 2,
      };
      const entity = { comanda_id: 1 } as Comanda;
      (repository.create as jest.Mock).mockReturnValue(entity);
      (repository.save as jest.Mock).mockResolvedValue(entity);

      const result = await service.createComanda(dto);

      expect(repository.create).toHaveBeenCalledWith({
        comanda_observacao: dto.comanda_observacao,
        comanda_qtde: dto.comanda_qtde,
      });
      expect(repository.save).toHaveBeenCalledWith(entity);
      expect(result).toBe(entity);
    });
  });

  describe('findAllComandas', () => {
    it('deve retornar todas as comandas', async () => {
      const lista = [{ comanda_id: 1 }] as Comanda[];
      (repository.find as jest.Mock).mockResolvedValue(lista);

      const result = await service.findAllComandas();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toBe(lista);
    });
  });

  describe('findComandaId', () => {
    it('deve retornar comanda existente', async () => {
      const comanda = { comanda_id: 1 } as Comanda;
      (repository.findOne as jest.Mock).mockResolvedValue(comanda);

      const result = await service.findComandaId(1);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { comanda_id: 1 },
      });
      expect(result).toEqual({
        mensagem: 'Comanda 1 ',
        comanda,
      });
    });

    it('deve lançar erro quando não encontrar', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.findComandaId(2)).rejects.toThrow(
        'Comanda não encontrada',
      );
    });
  });

  describe('updateComanda', () => {
    it('deve atualizar comanda existente', async () => {
      const atual = { comanda_id: 1 } as Comanda;
      const dto: UpdateComandaDto = { comanda_observacao: 'Atualizado' };
      const merged = { ...atual, ...dto } as Comanda;

      (repository.findOne as jest.Mock).mockResolvedValue(atual);
      (repository.merge as jest.Mock).mockReturnValue(merged);
      (repository.save as jest.Mock).mockResolvedValue(merged);

      const result = await service.updateComanda(1, dto);

      expect(repository.merge).toHaveBeenCalledWith(atual, dto);
      expect(repository.save).toHaveBeenCalledWith(merged);
      expect(result).toEqual({
        mensagem: 'Comanda #1 atualizada com sucesso',
        comanda: merged,
      });
    });

    it('deve lançar erro quando comanda não existe', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.updateComanda(1, {})).rejects.toThrow(
        'Erro ao atualizar comanda',
      );
    });
  });

  describe('removeComanda', () => {
    it('deve remover comanda existente', async () => {
      const comanda = { comanda_id: 1 } as Comanda;
      (repository.findOne as jest.Mock).mockResolvedValue(comanda);
      (repository.softDelete as jest.Mock).mockResolvedValue(undefined);

      const result = await service.removeComanda(1);

      expect(repository.softDelete).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        mensagem: 'Locação 1 Excluido com sucesso',
      });
    });

    it('deve lançar erro quando comanda não existe', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.removeComanda(2)).rejects.toThrow(
        'Erro ao excluir locação',
      );
    });
  });
});
