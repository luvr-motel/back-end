import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PagamentoFormaService } from './pagamento-forma.service';
import { PagamentoForma } from './entities/pagamento-forma.entity';
import { CreatePagamentoFormaDto } from './dto/create-pagamento-forma.dto';
import { UpdatePagamentoFormaDto } from './dto/update-pagamento-forma.dto';

type MockRepository = Partial<
  Record<
    keyof Pick<
      Repository<PagamentoForma>,
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

describe('PagamentoFormaService', () => {
  let service: PagamentoFormaService;
  let repository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PagamentoFormaService,
        {
          provide: getRepositoryToken(PagamentoForma),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get(PagamentoFormaService);
    repository = module.get(getRepositoryToken(PagamentoForma));
  });

  describe('createPagamentoForma', () => {
    it('deve criar e salvar uma forma de pagamento', async () => {
      const dto: CreatePagamentoFormaDto = {
        pagamentoForma_descricao: 'PIX',
        pagamentoForma_contaDestino: '123-x',
      };
      const entity = { pagamentoForma_id: 1 } as PagamentoForma;

      (repository.create as jest.Mock).mockReturnValue(entity);
      (repository.save as jest.Mock).mockResolvedValue(entity);

      const result = await service.createPagamentoForma(dto);

      expect(repository.create).toHaveBeenCalledWith({
        pagamentoForma_descricao: dto.pagamentoForma_descricao,
        pagamentoForma_contaDestino: dto.pagamentoForma_contaDestino,
      });
      expect(repository.save).toHaveBeenCalledWith(entity);
      expect(result).toBe(entity);
    });

    it('deve lançar erro quando create retornar valor inválido', async () => {
      (repository.create as jest.Mock).mockReturnValue(undefined);

      await expect(
        service.createPagamentoForma({
          pagamentoForma_descricao: 'PIX',
          pagamentoForma_contaDestino: '123',
        }),
      ).rejects.toThrow('Não foi possivel criar nova forma de pagamento!');
    });
  });

  describe('findAllPagamentoForma', () => {
    it('deve listar todas as formas', async () => {
      const lista = [{ pagamentoForma_id: 1 }] as PagamentoForma[];
      (repository.find as jest.Mock).mockResolvedValue(lista);

      const result = await service.findAllPagamentoForma();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toBe(lista);
    });
  });

  describe('findPagamentoFormaById', () => {
    it('deve retornar a forma existente', async () => {
      const forma = { pagamentoForma_id: 1 } as PagamentoForma;
      (repository.findOne as jest.Mock).mockResolvedValue(forma);

      const result = await service.findPagamentoFormaById(1);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { pagamentoForma_id: 1 },
      });
      expect(result).toEqual({
        mensagem: 'Forma de pagamento; 1',
        forma,
      });
    });

    it('deve lançar erro quando não encontrar', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.findPagamentoFormaById(2)).rejects.toThrow(
        'Forma de pagamento não encontrada',
      );
    });
  });

  describe('updatePagamentoFormaById', () => {
    it('deve atualizar forma existente', async () => {
      const forma = { pagamentoForma_id: 1 } as PagamentoForma;
      const dto: UpdatePagamentoFormaDto = {
        pagamentoForma_descricao: 'Cartão',
      };
      const merged = { ...forma, ...dto } as PagamentoForma;

      (repository.findOne as jest.Mock).mockResolvedValue(forma);
      (repository.merge as jest.Mock).mockReturnValue(merged);
      (repository.save as jest.Mock).mockResolvedValue(merged);

      const result = await service.updatePagamentoFormaById(1, dto);

      expect(repository.merge).toHaveBeenCalledWith(forma, dto);
      expect(repository.save).toHaveBeenCalledWith(merged);
      expect(result).toEqual({
        mensagem: 'Forma de pagamento; 1',
        forma: merged,
      });
    });

    it('deve lançar erro quando forma não existe', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        service.updatePagamentoFormaById(1, { pagamentoForma_descricao: 'X' }),
      ).rejects.toThrow('Erro ao atualizar forma de pagamento');
    });
  });

  describe('deletePagamentoForma', () => {
    it('deve remover forma existente', async () => {
      const forma = { pagamentoForma_id: 1 } as PagamentoForma;
      (repository.findOne as jest.Mock).mockResolvedValue(forma);
      (repository.softDelete as jest.Mock).mockResolvedValue(undefined);

      const result = await service.deletePagamentoForma(1);

      expect(repository.softDelete).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        mensagem: 'Forma de pagamento 1 Excluido com sucesso',
        forma,
      });
    });

    it('deve lançar erro quando forma não existe', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.deletePagamentoForma(2)).rejects.toThrow(
        'Erro ao excluir Forma de pagamento',
      );
    });
  });
});
