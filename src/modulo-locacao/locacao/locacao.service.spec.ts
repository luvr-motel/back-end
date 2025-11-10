import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocacaoService } from './locacao.service';
import { Locacao } from './entities/locacao.entity';
import { CreateLocacaoDto } from './dto/create-locacao.dto';
import { UpdateLocacaoDto } from './dto/update-locacao.dto';

type MockRepository = Partial<
  Record<
    keyof Pick<
      Repository<Locacao>,
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

describe('LocacaoService', () => {
  let service: LocacaoService;
  let repository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocacaoService,
        {
          provide: getRepositoryToken(Locacao),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get(LocacaoService);
    repository = module.get(getRepositoryToken(Locacao));
  });

  describe('createLocacao', () => {
    it('deve criar e salvar uma locação', async () => {
      const dto: CreateLocacaoDto = {
        locacao_totalItens: 1,
        locacao_totalQuarto: 2,
        locacao_totalDesconto: 0,
        locacao_totalLocacao: 3,
        quarto_id: 4,
        pessoa_id: 5,
        motel_id: 6,
      };
      const entity = { locacao_id: 1 } as Locacao;

      (repository.create as jest.Mock).mockReturnValue(entity);
      (repository.save as jest.Mock).mockResolvedValue(entity);

      const result = await service.createLocacao(dto);

      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          locacao_totalItens: dto.locacao_totalItens,
          quarto_id: dto.quarto_id,
          pessoa_id: dto.pessoa_id,
          motel_id: dto.motel_id,
        }),
      );
      expect(repository.save).toHaveBeenCalledWith(entity);
      expect(result).toBe(entity);
    });
  });

  describe('findAllLocacoes', () => {
    it('deve retornar a lista de locações', async () => {
      const lista = [{ locacao_id: 1 }] as Locacao[];
      (repository.find as jest.Mock).mockResolvedValue(lista);

      const result = await service.findAllLocacoes();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toBe(lista);
    });
  });

  describe('findLocacaoId', () => {
    it('deve retornar locação quando encontrada', async () => {
      const locacao = { locacao_id: 1 } as Locacao;
      (repository.findOne as jest.Mock).mockResolvedValue(locacao);

      const result = await service.findLocacaoId(1);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { locacao_id: 1 },
      });
      expect(result).toEqual({
        mensagem: 'Locação #1',
        locacao,
      });
    });

    it('deve lançar exceção quando não achar', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.findLocacaoId(2)).rejects.toThrow(
        'Locação não encontrada ',
      );
    });
  });

  describe('updateLocacao', () => {
    it('deve atualizar locação existente', async () => {
      const atual = { locacao_id: 1 } as Locacao;
      const dto: UpdateLocacaoDto = {
        locacao_totalItens: 10,
      };
      const merged = { ...atual, ...dto } as Locacao;

      (repository.findOne as jest.Mock).mockResolvedValue(atual);
      (repository.merge as jest.Mock).mockReturnValue(merged);
      (repository.save as jest.Mock).mockResolvedValue(merged);

      const result = await service.updateLocacao(1, dto);

      expect(repository.merge).toHaveBeenCalledWith(atual, dto);
      expect(repository.save).toHaveBeenCalledWith(merged);
      expect(result).toEqual({
        mensagem: 'Locação #1 Atualizada com sucesso',
        locacao: merged,
      });
    });

    it('deve lançar erro quando locação não existir', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.updateLocacao(1, {})).rejects.toThrow(
        'Erro ao atualizar locação',
      );
    });
  });

  describe('deleteLocacaoById', () => {
    it('deve remover locação existente', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue({
        locacao_id: 1,
      } as Locacao);
      (repository.softDelete as jest.Mock).mockResolvedValue(undefined);

      const result = await service.deleteLocacaoById(1);

      expect(repository.softDelete).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        mensagem: 'Locação 1 Excluido com sucesso',
      });
    });

    it('deve lançar erro quando locação não existir', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.deleteLocacaoById(2)).rejects.toThrow(
        'Erro ao excluir locação',
      );
    });
  });
});
