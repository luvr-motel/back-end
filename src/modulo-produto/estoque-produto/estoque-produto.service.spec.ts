import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { HttpException } from '@nestjs/common';
import { EstoqueProdutoService } from './estoque-produto.service';
import { EstoqueProduto } from './entities/estoque-produto.entity';
import { CreateEstoqueProdutoDto } from './dto/create-estoque-produto.dto';
import { UpdateEstoqueProdutoDto } from './dto/update-estoque-produto.dto';

type RepoMock = Partial<jest.Mocked<Repository<EstoqueProduto>>>;
type EstoqueLike = DeepPartial<EstoqueProduto>;

function createRepoMock(): RepoMock {
  return {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    merge: jest.fn(),
    softDelete: jest.fn(),
  };
}

describe('EstoqueProdutoService', () => {
  let service: EstoqueProdutoService;
  let repo: RepoMock;

  const now = new Date();

  const baseObrigatorio: EstoqueLike = {
    estoqueProduto_inclusao: now,
    //estoqueProduto_exclusao: null,
    produto: undefined,
    motel: undefined,
    produto_id: 1,
    motel_id: 1,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EstoqueProdutoService,
        { provide: getRepositoryToken(EstoqueProduto), useValue: createRepoMock() },
      ],
    }).compile();

    service = module.get<EstoqueProdutoService>(EstoqueProdutoService);
    repo = module.get(getRepositoryToken(EstoqueProduto));
  });

  it('service definido', () => {
    expect(service).toBeDefined();
  });

  describe('createEstoqueProduto', () => {
    it('cria e retorna mensagem + entidade (happy path)', async () => {
      const dto: CreateEstoqueProdutoDto = {
        estoqueProduto_fisico: 16,
        estoqueProduto_ativo: true,
        produto_id: 1,
        motel_id: 1,
      };

      const entity: EstoqueLike = {
        estoqueProduto_id: 10,
        estoqueProduto_fisico: dto.estoqueProduto_fisico,
        estoqueProduto_ativo: dto.estoqueProduto_ativo,
        ...baseObrigatorio,
      };

      (repo.create as jest.Mock).mockReturnValue(entity);
      const result = await service.createEstoqueProduto(dto);

      expect(repo.create).toHaveBeenCalledWith({
        estoqueProduto_ativo: dto.estoqueProduto_ativo,
        estoqueProduto_fisico: dto.estoqueProduto_fisico,
      });
      expect(result).toEqual({
        mensagem: 'Estoque lançado com sucesso!',
        estoque: entity,
      });
    });

    it('lança exceção se repo.create retornar valor falsy', async () => {
      const dto = { estoqueProduto_fisico: 5 } as CreateEstoqueProdutoDto;
      (repo.create as jest.Mock).mockReturnValue(undefined);

      await expect(service.createEstoqueProduto(dto))
        .rejects.toThrow('Erro ao lançar estoque');
    });
  });

  describe('findAllEstoque', () => {
    it('retorna lista', async () => {
      const data: EstoqueLike[] = [
        { estoqueProduto_id: 1, ...baseObrigatorio },
        { estoqueProduto_id: 2, ...baseObrigatorio },
      ];
      (repo.find as jest.Mock).mockResolvedValue(data);

      const result = await service.findAllEstoque();
      expect(repo.find).toHaveBeenCalled();
      expect(result).toEqual(data);
    });

    it('propaga erro do repo.find', async () => {
      (repo.find as jest.Mock).mockRejectedValue(new Error('Falha no find'));
      await expect(service.findAllEstoque()).rejects.toThrow('Falha no find');
    });
  });

  describe('findEstoqueById', () => {
    it('retorna quando encontrado', async () => {
      const est: EstoqueLike = { estoqueProduto_id: 7, ...baseObrigatorio };
      (repo.findOne as jest.Mock).mockResolvedValue(est);

      const result = await service.findEstoqueById(7);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { estoqueProduto_id: 7 } });
      expect(result).toEqual({ mensagem: 'Estoque #7', estoque: est });
    });

    it('lança quando não encontrado', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(null);
      await expect(service.findEstoqueById(999)).rejects.toBeInstanceOf(HttpException);
      await expect(service.findEstoqueById(999)).rejects.toThrow('Estoque não encontrado');
    });

    it('propaga erro do repo.findOne', async () => {
      (repo.findOne as jest.Mock).mockRejectedValue(new Error('Falha no findOne'));
      await expect(service.findEstoqueById(1)).rejects.toThrow('Falha no findOne');
    });
  });

  describe('updateEstoqueProduto', () => {
    it('atualiza e salva quando encontrado', async () => {
      const existente: EstoqueLike = {
        estoqueProduto_id: 15,
        estoqueProduto_fisico: 10,
        estoqueProduto_ativo: true,
        ...baseObrigatorio,
      };
      const dto: UpdateEstoqueProdutoDto = { estoqueProduto_fisico: 20 } as any;
      const mesclado: EstoqueLike = { ...existente, ...dto };
      const salvo: EstoqueLike = { ...mesclado };

      (repo.findOne as jest.Mock).mockResolvedValue(existente);
      (repo.merge as jest.Mock).mockReturnValue(mesclado);
      (repo.save as jest.Mock).mockResolvedValue(salvo);

      const result = await service.updateEstoqueProduto(15, dto);

      expect(repo.findOne).toHaveBeenCalledWith({ where: { estoqueProduto_id: 15 } });
      expect(repo.merge).toHaveBeenCalledWith(existente, dto);
      expect(repo.save).toHaveBeenCalledWith(mesclado);
      expect(result).toEqual({
        mensagem: 'Estoque #15 Atualizado com sucesso',
        estoque: salvo,
      });
    });

    it('lança quando não encontrado', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(null);
      await expect(service.updateEstoqueProduto(2, {} as any))
        .rejects.toThrow('Estoque não encontrado');
    });

    it('propaga erro do repo.save', async () => {
      const existente: EstoqueLike = { estoqueProduto_id: 3, ...baseObrigatorio };
      (repo.findOne as jest.Mock).mockResolvedValue(existente);
      (repo.merge as jest.Mock).mockReturnValue(existente);
      (repo.save as jest.Mock).mockRejectedValue(new Error('Falha no save'));

      await expect(service.updateEstoqueProduto(3, {} as any)).rejects.toThrow('Falha no save');
    });
  });

  describe('deleteEstoqueByProduto', () => {
    it('softDelete quando encontrado e retorna mensagem', async () => {
      const existente: EstoqueLike = { estoqueProduto_id: 4, ...baseObrigatorio };
      (repo.findOne as jest.Mock).mockResolvedValue(existente);
      (repo.softDelete as jest.Mock).mockResolvedValue({ affected: 1 });

      const result = await service.deleteEstoqueByProduto(4);

      expect(repo.findOne).toHaveBeenCalledWith({ where: { estoqueProduto_id: 4 } });
      expect(repo.softDelete).toHaveBeenCalledWith(4);
      expect(result).toEqual({ mensagem: 'Estoque excluido com sucesso' });
    });

    it('lança quando não encontrado', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(null);
      await expect(service.deleteEstoqueByProduto(99))
        .rejects.toThrow('Erro ao excluir estoque do produto #99');
      expect(repo.softDelete).not.toHaveBeenCalled();
    });

    it('propaga erro do repo.softDelete', async () => {
      const existente: EstoqueLike = { estoqueProduto_id: 8, ...baseObrigatorio };
      (repo.findOne as jest.Mock).mockResolvedValue(existente);
      (repo.softDelete as jest.Mock).mockRejectedValue(new Error('Falha no softDelete'));

      await expect(service.deleteEstoqueByProduto(8)).rejects.toThrow('Falha no softDelete');
    });
  });
});
