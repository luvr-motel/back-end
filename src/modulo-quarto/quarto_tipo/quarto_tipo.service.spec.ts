import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuartoTipoService } from './quarto_tipo.service';
import { QuartoTipo } from './entities/quarto_tipo.entity';
import { CreateQuartoTipoDto } from './dto/create-quarto_tipo.dto';
import { UpdateQuartoTipoDto } from './dto/update-quarto_tipo.dto';

type MockRepository = Partial<
  Record<
    keyof Pick<
      Repository<QuartoTipo>,
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

describe('QuartoTipoService', () => {
  let service: QuartoTipoService;
  let repository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuartoTipoService,
        {
          provide: getRepositoryToken(QuartoTipo),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get(QuartoTipoService);
    repository = module.get(getRepositoryToken(QuartoTipo));
  });

  describe('createQuartoTipo', () => {
    it('deve criar e salvar um novo tipo', async () => {
      const dto: CreateQuartoTipoDto = { quartotipo_descricao: 'Luxo' };
      const entity = { quartotipo_Id: 1 } as QuartoTipo;

      (repository.create as jest.Mock).mockReturnValue(entity);
      (repository.save as jest.Mock).mockResolvedValue(entity);

      const result = await service.createQuartoTipo(dto);

      expect(repository.create).toHaveBeenCalledWith({
        quartotipoDescricao: dto.quartotipo_descricao,
      });
      expect(repository.save).toHaveBeenCalledWith(entity);
      expect(result).toBe(entity);
    });
  });

  describe('findAllQuartoTipos', () => {
    it('deve listar ordenado por descrição', async () => {
      const lista = [{ quartotipo_Id: 1 }] as QuartoTipo[];
      (repository.find as jest.Mock).mockResolvedValue(lista);

      const result = await service.findAllQuartoTipos();

      expect(repository.find).toHaveBeenCalledWith({
        order: { quartotipoDescricao: 'ASC' },
      });
      expect(result).toBe(lista);
    });
  });

  describe('findQuartoTipoId', () => {
    it('deve retornar o tipo quando existe', async () => {
      const tipo = { quartotipo_Id: 5 } as QuartoTipo;
      (repository.findOne as jest.Mock).mockResolvedValue(tipo);

      const result = await service.findQuartoTipoId(5);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { quartotipo_Id: 5 },
      });
      expect(result).toEqual({
        mensagem: 'Tipo de quarto #5',
        quartotipo: tipo,
      });
    });

    it('deve lançar erro se não existir', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.findQuartoTipoId(99)).rejects.toThrow(
        'Tipo de quarto não encontrado',
      );
    });
  });

  describe('updateQuartoTipo', () => {
    it('deve atualizar um tipo existente', async () => {
      const existente = { quartotipo_Id: 1, quartotipoDescricao: 'Antigo' } as QuartoTipo;
      const dto: UpdateQuartoTipoDto = { quartotipo_descricao: 'Novo' };
      const atualizado = { ...existente, quartotipoDescricao: 'Novo' } as QuartoTipo;

      (repository.findOne as jest.Mock).mockResolvedValue(existente);
      (repository.merge as jest.Mock).mockReturnValue(atualizado);
      (repository.save as jest.Mock).mockResolvedValue(atualizado);

      const result = await service.updateQuartoTipo(1, dto);

      expect(repository.merge).toHaveBeenCalledWith(existente, {
        quartotipoDescricao: dto.quartotipo_descricao ?? existente.quartotipoDescricao,
      });
      expect(repository.save).toHaveBeenCalledWith(atualizado);
      expect(result).toEqual({
        mensagem: 'Tipo de quarto #1 atualizado com sucesso',
        quartotipo: atualizado,
      });
    });

    it('deve lançar erro se tipo não existir', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.updateQuartoTipo(1, {})).rejects.toThrow(
        'Erro ao atualizar tipo de quarto',
      );
    });
  });

  describe('removeQuartoTipo', () => {
    it('deve remover um tipo existente', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue({
        quartotipo_Id: 1,
      } as QuartoTipo);
      (repository.softDelete as jest.Mock).mockResolvedValue(undefined);

      const result = await service.removeQuartoTipo(1);

      expect(repository.softDelete).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        mensagem: 'Tipo de quarto #1 excluído com sucesso',
      });
    });

    it('deve lançar erro se tipo não existir', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.removeQuartoTipo(2)).rejects.toThrow(
        'Erro ao excluir tipo de quarto',
      );
    });
  });
});
