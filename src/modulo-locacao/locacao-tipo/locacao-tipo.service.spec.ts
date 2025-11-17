import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocacaoTipoService } from './locacao-tipo.service';
import { LocacaoTipo } from './entities/locacao-tipo.entity';
import { CreateLocacaoTipoDto } from './dto/create-locacao-tipo.dto';
import { UpdateLocacaoTipoDto } from './dto/update-locacao-tipo.dto';

type MockRepository = Partial<
  Record<
    keyof Pick<
      Repository<LocacaoTipo>,
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

describe('LocacaoTipoService', () => {
  let service: LocacaoTipoService;
  let repository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocacaoTipoService,
        {
          provide: getRepositoryToken(LocacaoTipo),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get(LocacaoTipoService);
    repository = module.get(getRepositoryToken(LocacaoTipo));
  });

  describe('createLocacaoTipo', () => {
    it('deve criar e salvar um tipo de locação', async () => {
      const dto: CreateLocacaoTipoDto = { locacaoTipo_descricao: 'Luxo' };
      const entity = { locacaoTipo_id: 1 } as LocacaoTipo;

      (repository.create as jest.Mock).mockReturnValue(entity);
      (repository.save as jest.Mock).mockResolvedValue(entity);

      const result = await service.createLocacaoTipo(dto);

      expect(repository.create).toHaveBeenCalledWith({
        locacaoTipo_descricao: dto.locacaoTipo_descricao,
      });
      expect(repository.save).toHaveBeenCalledWith(entity);
      expect(result).toBe(entity);
    });
  });

  describe('findAllLocacaoTipo', () => {
    it('deve retornar todos os tipos', async () => {
      const lista = [{ locacaoTipo_id: 1 }] as LocacaoTipo[];
      (repository.find as jest.Mock).mockResolvedValue(lista);

      const result = await service.findAllLocacaoTipo();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toBe(lista);
    });
  });

  describe('findLocacaoTipoId', () => {
    it('deve retornar tipo existente', async () => {
      const tipo = { locacaoTipo_id: 1 } as LocacaoTipo;
      (repository.findOne as jest.Mock).mockResolvedValue(tipo);

      const result = await service.findLocacaoTipoId(1);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { locacaoTipo_id: 1 },
      });
      expect(result).toEqual({
        mensagem: 'Categoria de locação: #1 atualizada com sucesso',
        tipo,
      });
    });

    it('deve lançar erro quando não encontrar', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.findLocacaoTipoId(2)).rejects.toThrow(
        'Categoria não encontrada',
      );
    });
  });

  describe('updateLocacaoTipById', () => {
    it('deve atualizar um tipo existente', async () => {
      const tipo = { locacaoTipo_id: 1 } as LocacaoTipo;
      const dto: UpdateLocacaoTipoDto = { locacaoTipo_descricao: 'Novo' };
      const merged = { ...tipo, ...dto } as LocacaoTipo;

      (repository.findOne as jest.Mock).mockResolvedValue(tipo);
      (repository.merge as jest.Mock).mockReturnValue(merged);
      (repository.save as jest.Mock).mockResolvedValue(merged);

      const result = await service.updateLocacaoTipById(1, dto);

      expect(repository.merge).toHaveBeenCalledWith(tipo, dto);
      expect(repository.save).toHaveBeenCalledWith(merged);
      expect(result).toEqual({
        mensagem: 'Categoria de locação atualizada com sucesso!',
        tipo: merged,
      });
    });

    it('deve lançar erro quando tipo não existe', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        service.updateLocacaoTipById(1, { locacaoTipo_descricao: 'X' }),
      ).rejects.toThrow('Erro ao atualizar categoria de locação');
    });
  });

  describe('deleteLocacaoTipo', () => {
    it('deve remover tipo existente', async () => {
      const tipo = { locacaoTipo_id: 1 } as LocacaoTipo;
      (repository.findOne as jest.Mock).mockResolvedValue(tipo);
      (repository.softDelete as jest.Mock).mockResolvedValue(undefined);

      const result = await service.deleteLocacaoTipo(1);

      expect(repository.softDelete).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        mensagem: 'Categoria de locação excluida com sucesso!',
        tipo,
      });
    });

    it('deve lançar erro quando tipo não existe', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.deleteLocacaoTipo(2)).rejects.toThrow(
        'Erro ao excluir categoria de locação',
      );
    });
  });
});
