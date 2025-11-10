import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocacaoPosicaoService } from './locacao-posicao.service';
import { LocacaoPosicao } from './entities/locacao-posicao.entity';
import { CreateLocacaoPosicaoDto } from './dto/create-locacao-posicao.dto';
import { UpdateLocacaoPosicaoDto } from './dto/update-locacao-posicao.dto';

type MockRepository = Partial<
  Record<
    keyof Pick<
      Repository<LocacaoPosicao>,
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

describe('LocacaoPosicaoService', () => {
  let service: LocacaoPosicaoService;
  let repository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocacaoPosicaoService,
        {
          provide: getRepositoryToken(LocacaoPosicao),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get(LocacaoPosicaoService);
    repository = module.get(getRepositoryToken(LocacaoPosicao));
  });

  describe('createLocacaoPosicao', () => {
    it('deve criar e salvar uma posição', async () => {
      const dto: CreateLocacaoPosicaoDto = {
        locacaoPosicao_descricao: 'Ocupado',
      };
      const entity = { locacaoPosicao_id: 1 } as LocacaoPosicao;

      (repository.create as jest.Mock).mockReturnValue(entity);
      (repository.save as jest.Mock).mockResolvedValue(entity);

      const result = await service.createLocacaoPosicao(dto);

      expect(repository.create).toHaveBeenCalledWith({
        locacaoPosicao_descricao: dto.locacaoPosicao_descricao,
      });
      expect(repository.save).toHaveBeenCalledWith(entity);
      expect(result).toEqual({
        mensagem: 'Posição criada com sucesso!',
        posicao: entity,
      });
    });

    it('deve lançar erro quando criação falhar', async () => {
      (repository.create as jest.Mock).mockReturnValue(undefined);

      await expect(
        service.createLocacaoPosicao({ locacaoPosicao_descricao: 'Livre' }),
      ).rejects.toThrow('Erro ao criar posicao');
    });
  });

  describe('findAllLocacaoPosicao', () => {
    it('deve listar todas as posições', async () => {
      const lista = [{ locacaoPosicao_id: 1 }] as LocacaoPosicao[];
      (repository.find as jest.Mock).mockResolvedValue(lista);

      const result = await service.findAllLocacaoPosicao();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toBe(lista);
    });
  });

  describe('findLocacaoPosicaoById', () => {
    it('deve retornar posição existente', async () => {
      const posicao = { locacaoPosicao_id: 1 } as LocacaoPosicao;
      (repository.findOne as jest.Mock).mockResolvedValue(posicao);

      const result = await service.findLocacaoPosicaoById(1);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { locacaoPosicao_id: 1 },
      });
      expect(result).toEqual({
        mensagem: 'Posição de locação #1',
        posicao,
      });
    });

    it('deve lançar erro quando não encontrar', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.findLocacaoPosicaoById(2)).rejects.toThrow(
        'Posição de locação não encontrada',
      );
    });
  });

  describe('updateLocacaoPosicaoById', () => {
    it('deve atualizar posição existente', async () => {
      const atual = { locacaoPosicao_id: 1 } as LocacaoPosicao;
      const dto: UpdateLocacaoPosicaoDto = {
        locacaoPosicao_descricao: 'Atualizada',
      };
      const merged = { ...atual, ...dto } as LocacaoPosicao;

      (repository.findOne as jest.Mock).mockResolvedValue(atual);
      (repository.merge as jest.Mock).mockReturnValue(merged);
      (repository.save as jest.Mock).mockResolvedValue(merged);

      const result = await service.updateLocacaoPosicaoById(1, dto);

      expect(repository.merge).toHaveBeenCalledWith(atual, dto);
      expect(repository.save).toHaveBeenCalledWith(merged);
      expect(result).toEqual({
        mensagem: 'Posição de locação atualizada com sucesso',
        posicao: merged,
      });
    });

    it('deve lançar erro quando posição não existir', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        service.updateLocacaoPosicaoById(1, { locacaoPosicao_descricao: 'X' }),
      ).rejects.toThrow('Posição de locação não encontrado');
    });
  });

  describe('deleteLocacaoPosicaoById', () => {
    it('deve remover posição existente', async () => {
      const posicao = { locacaoPosicao_id: 1 } as LocacaoPosicao;
      (repository.findOne as jest.Mock).mockResolvedValue(posicao);
      (repository.softDelete as jest.Mock).mockResolvedValue(undefined);

      const result = await service.deleteLocacaoPosicaoById(1);

      expect(repository.softDelete).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        mensagem: 'Posição de locação excluida com sucesso',
        posicao,
      });
    });

    it('deve lançar erro quando posição não existir', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.deleteLocacaoPosicaoById(2)).rejects.toThrow(
        'Erro ao excluir posição de locação',
      );
    });
  });
});
