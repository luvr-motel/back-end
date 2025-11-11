import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { HttpException } from '@nestjs/common';
import { ProdutoService } from './produto.service';
import { Produto } from './entities/produto.entity';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';

type RepoMock = Partial<jest.Mocked<Repository<Produto>>>;
type ProdutoLike = DeepPartial<Produto>;

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

describe('ProdutoService', () => {
  let service: ProdutoService;
  let repo: RepoMock;

  const now = new Date();

  const baseProdutoObrigatorio: ProdutoLike = {
    produto_inclusao: now,
    comandas: [] as any[],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutoService,
        { provide: getRepositoryToken(Produto), useValue: createRepoMock() },
      ],
    }).compile();

    service = module.get<ProdutoService>(ProdutoService);
    repo = module.get(getRepositoryToken(Produto));
  });

  it('service deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('createProduto', () => {
    it('deve criar e salvar um produto (happy path)', async () => {
      const dto: CreateProdutoDto = {
        produto_descricao: 'Coca-cola',
        produto_custo: 1.1,
        produto_venda: 3.5,
        produto_marckup: 1.0,
      };

      const entity: ProdutoLike = {
        produto_id: 1,
        ...dto,
        ...baseProdutoObrigatorio,
      };

      (repo.create as jest.Mock).mockReturnValue(entity);
      (repo.save as jest.Mock).mockResolvedValue({ ...entity });

      const result = await service.createProduto(dto);

      expect(repo.create).toHaveBeenCalledWith({
        produto_descricao: dto.produto_descricao,
        produto_custo: dto.produto_custo,
        produto_venda: dto.produto_venda,
        produto_marckup: dto.produto_marckup,
      });
      expect(repo.save).toHaveBeenCalledWith(entity);
      expect(result).toEqual(entity);
    });

    it('deve funcionar com campos opcionais undefined (venda/marckup)', async () => {
      const dto = {
        produto_descricao: 'Água',
        produto_custo: 2.0,
      } as CreateProdutoDto;

      const entity: ProdutoLike = {
        produto_id: 2,
        produto_descricao: dto.produto_descricao,
        produto_custo: dto.produto_custo,
        produto_venda: undefined,
        produto_marckup: undefined,
        ...baseProdutoObrigatorio,
      };

      (repo.create as jest.Mock).mockReturnValue(entity);
      (repo.save as jest.Mock).mockResolvedValue({ ...entity });

      const result = await service.createProduto(dto);

      expect(repo.create).toHaveBeenCalledWith({
        produto_descricao: 'Água',
        produto_custo: 2.0,
        produto_venda: undefined,
        produto_marckup: undefined,
      });
      expect(repo.save).toHaveBeenCalled();
      expect(result).toEqual(entity);
    });

    it('deve propagar erro do repository.save', async () => {
      const dto: CreateProdutoDto = {
        produto_descricao: 'Erro',
        produto_custo: 9.99,
      } as any;

      const entity: ProdutoLike = { produto_id: 3, ...dto, ...baseProdutoObrigatorio };

      (repo.create as jest.Mock).mockReturnValue(entity);
      (repo.save as jest.Mock).mockRejectedValue(new Error('Falha no save'));

      await expect(service.createProduto(dto)).rejects.toThrow('Falha no save');
    });
  });

  describe('findAllProdutos', () => {
    it('deve retornar lista de produtos', async () => {
      const data: ProdutoLike[] = [
        { produto_id: 1, ...baseProdutoObrigatorio },
        { produto_id: 2, ...baseProdutoObrigatorio },
      ];
      (repo.find as jest.Mock).mockResolvedValue(data);

      const result = await service.findAllProdutos();

      expect(repo.find).toHaveBeenCalled();
      expect(result).toEqual(data);
    });

    it('deve retornar array vazio quando não houver produtos', async () => {
      (repo.find as jest.Mock).mockResolvedValue([]);

      const result = await service.findAllProdutos();

      expect(repo.find).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('deve propagar erro do repository.find', async () => {
      (repo.find as jest.Mock).mockRejectedValue(new Error('Falha no find'));
      await expect(service.findAllProdutos()).rejects.toThrow('Falha no find');
    });
  });

  describe('findProdutoId', () => {
    it('deve retornar produto quando encontrado', async () => {
      const produto: ProdutoLike = { produto_id: 10, ...baseProdutoObrigatorio };
      (repo.findOne as jest.Mock).mockResolvedValue(produto);

      const result = await service.findProdutoId(10);

      expect(repo.findOne).toHaveBeenCalledWith({ where: { produto_id: 10 } });
      expect(result).toEqual({ mensagem: 'Produto #10', produto });
    });

    it('deve lançar exceção quando não encontrado', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.findProdutoId(99)).rejects.toBeInstanceOf(HttpException);
      await expect(service.findProdutoId(99)).rejects.toThrow('Produto não encontrado');
    });

    it('deve propagar erro do repository.findOne', async () => {
      (repo.findOne as jest.Mock).mockRejectedValue(new Error('Falha no findOne'));
      await expect(service.findProdutoId(1)).rejects.toThrow('Falha no findOne');
    });
  });

  describe('updateProdutoById', () => {
    it('deve atualizar e salvar quando encontrado (atualiza somente campos enviados)', async () => {
      const existente: ProdutoLike = {
        produto_id: 5,
        produto_descricao: 'Antigo',
        produto_custo: 5.55,
        produto_venda: 7.77,
        produto_marckup: 1.2,
        ...baseProdutoObrigatorio,
      };
      const dto: UpdateProdutoDto = { produto_descricao: 'Novo' } as any;
      const mesclado: ProdutoLike = { ...existente, ...dto };
      const salvo: ProdutoLike = { ...mesclado };

      (repo.findOne as jest.Mock).mockResolvedValue(existente);
      (repo.merge as jest.Mock).mockReturnValue(mesclado);
      (repo.save as jest.Mock).mockResolvedValue(salvo);

      const result = await service.updateProdutoById(5, dto);

      expect(repo.findOne).toHaveBeenCalledWith({ where: { produto_id: 5 } });
      expect(repo.merge).toHaveBeenCalledWith(existente, dto);
      expect(repo.save).toHaveBeenCalledWith(mesclado);
      expect((result.produto as any).produto_venda).toBe(7.77);
      expect((result.produto as any).produto_marckup).toBe(1.2);
      expect(result).toEqual({ mensagem: 'Produto #5 Atualizado com sucesso', produto: salvo });
    });

    it('deve aceitar atualização de múltiplos campos', async () => {
      const existente: ProdutoLike = { produto_id: 6, produto_descricao: 'Desc', ...baseProdutoObrigatorio };
      const dto: UpdateProdutoDto = {
        produto_descricao: 'Desc nova',
        produto_custo: 12.34,
        produto_venda: 22.22,
        produto_marckup: 1.8,
      } as any;

      const mesclado: ProdutoLike = { ...existente, ...dto };
      const salvo: ProdutoLike = { ...mesclado };

      (repo.findOne as jest.Mock).mockResolvedValue(existente);
      (repo.merge as jest.Mock).mockReturnValue(mesclado);
      (repo.save as jest.Mock).mockResolvedValue(salvo);

      const result = await service.updateProdutoById(6, dto);

      expect(repo.merge).toHaveBeenCalledWith(existente, dto);
      expect((result.produto as any).produto_custo).toBe(12.34);
      expect((result.produto as any).produto_venda).toBe(22.22);
      expect((result.produto as any).produto_marckup).toBe(1.8);
    });

    it('deve lançar exceção quando produto não existe', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.updateProdutoById(123, {} as any)).rejects.toBeInstanceOf(HttpException);
      await expect(service.updateProdutoById(123, {} as any)).rejects.toThrow('Erro ao atualizar produto');
    });

    it('deve propagar erro do repository.save ao atualizar', async () => {
      const existente: ProdutoLike = { produto_id: 8, produto_descricao: 'X', ...baseProdutoObrigatorio };
      const dto: UpdateProdutoDto = { produto_descricao: 'Y' } as any;
      const mesclado: ProdutoLike = { ...existente, ...dto };

      (repo.findOne as jest.Mock).mockResolvedValue(existente);
      (repo.merge as jest.Mock).mockReturnValue(mesclado);
      (repo.save as jest.Mock).mockRejectedValue(new Error('Falha no save update'));

      await expect(service.updateProdutoById(8, dto)).rejects.toThrow('Falha no save update');
    });
  });

  describe('removeProduto', () => {
    it('deve softDelete quando encontrado e retornar mensagem', async () => {
      const existente: ProdutoLike = { produto_id: 7, ...baseProdutoObrigatorio };
      (repo.findOne as jest.Mock).mockResolvedValue(existente);
      (repo.softDelete as jest.Mock).mockResolvedValue({ affected: 1 });

      const result = await service.removeProduto(7);

      expect(repo.findOne).toHaveBeenCalledWith({ where: { produto_id: 7 } });
      expect(repo.softDelete).toHaveBeenCalledWith(7);
      expect(result).toEqual({ mensagem: 'Produto 7 excluido com sucesso' });
    });

    it('não deve chamar softDelete quando não encontrado (lança exceção)', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.removeProduto(55)).rejects.toBeInstanceOf(HttpException);
      await expect(service.removeProduto(55)).rejects.toThrow(' Erro ao excluir produto');
      expect(repo.softDelete).not.toHaveBeenCalled();
    });

    it('deve propagar erro do repository.softDelete', async () => {
      const existente: ProdutoLike = { produto_id: 9, ...baseProdutoObrigatorio };
      (repo.findOne as jest.Mock).mockResolvedValue(existente);
      (repo.softDelete as jest.Mock).mockRejectedValue(new Error('Falha no softDelete'));

      await expect(service.removeProduto(9)).rejects.toThrow('Falha no softDelete');
    });
  });
});
