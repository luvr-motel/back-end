import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';

import { Produto } from 'src/modulo-produto/produto/entities/produto.entity';
import { ProdutoService } from 'src/modulo-produto/produto/produto.service';

import { EstoqueProduto } from 'src/modulo-produto/estoque-produto/entities/estoque-produto.entity';
import { EstoqueProdutoService } from 'src/modulo-produto/estoque-produto/estoque-produto.service';

jest.setTimeout(30000);

describe('Módulo Produto (integração)', () => {
  let moduleRef: TestingModule;

  let produtoService: ProdutoService;
  let repoProduto: Repository<Produto>;

  let estoqueService: EstoqueProdutoService;
  let repoEstoque: Repository<EstoqueProduto>;

  // inicia módulo e conecta no banco de teste
  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: 'admin',
          database: 'luvr_test',
          entities: ['src/**/*.entity{.ts,.js}'],
          synchronize: true,
          dropSchema: true,
        }),
        TypeOrmModule.forFeature([Produto, EstoqueProduto]),
      ],
      providers: [ProdutoService, EstoqueProdutoService],
    }).compile();

    // produto
    produtoService = moduleRef.get<ProdutoService>(ProdutoService);
    repoProduto = moduleRef.get<Repository<Produto>>(
      getRepositoryToken(Produto),
    );

    // estoque
    estoqueService = moduleRef.get<EstoqueProdutoService>(EstoqueProdutoService);
    repoEstoque = moduleRef.get<Repository<EstoqueProduto>>(
      getRepositoryToken(EstoqueProduto),
    );
  });

  // limpa tabelas antes de cada teste
  beforeEach(async () => {
    // primeiro estoque (pois pode referenciar produto), depois produto
    await repoEstoque.createQueryBuilder().delete().from(EstoqueProduto).execute();
    await repoProduto.createQueryBuilder().delete().from(Produto).execute();
  });

  // fecha módulo ao final
  afterAll(async () => {
    await moduleRef.close();
  });

  // ---------------------------------------------------------------------------
  // PRODUTO
  // ---------------------------------------------------------------------------
  describe('ProdutoService (integração)', () => {
    it('deve criar um produto e recuperá-lo (createProduto + findAllProdutos + findProdutoId)', async () => {
      const dto = {
        produto_descricao: 'Coca-cola Lata',
        produto_custo: 1.1,
        produto_venda: 3.5,
        produto_marckup: 1.0,
      } as any;

      const criado = await produtoService.createProduto(dto);

      expect(criado).toBeDefined();
      expect(criado.produto_id).toBeDefined();
      expect(criado.produto_descricao).toBe('Coca-cola Lata');
      expect(Number(criado.produto_custo)).toBeCloseTo(1.1, 2);
      expect(Number(criado.produto_venda)).toBeCloseTo(3.5, 2);
      expect(criado.produto_inclusao).toBeInstanceOf(Date);

      const todos = await produtoService.findAllProdutos();
      expect(todos).toHaveLength(1);
      expect(todos[0].produto_descricao).toBe('Coca-cola Lata');

      const { mensagem, produto } = await produtoService.findProdutoId(
        criado.produto_id,
      );
      expect(mensagem).toBe(`Produto #${criado.produto_id}`);
      expect(produto.produto_id).toBe(criado.produto_id);
    });

    it('deve lançar HttpException (404) ao buscar produto inexistente', async () => {
      try {
        await produtoService.findProdutoId(999);
        fail('Era esperado lançar HttpException 404, mas não lançou.');
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        const httpErr = err as HttpException;
        expect(httpErr.getStatus()).toBe(404);
        expect(httpErr.message).toBe('Produto não encontrado');
      }
    });

    it('deve atualizar um produto existente (updateProdutoById)', async () => {
      const criado = await produtoService.createProduto({
        produto_descricao: 'Coca-cola Original',
        produto_custo: 1.5,
        produto_venda: 4.0,
        produto_marckup: 1.2,
      } as any);

      const { mensagem, produto } = await produtoService.updateProdutoById(
        criado.produto_id,
        {
          produto_descricao: 'Coca-cola Zero',
          produto_venda: 4.5,
        } as any,
      );

      expect(mensagem).toBe(
        `Produto #${criado.produto_id} Atualizado com sucesso`,
      );
      expect(produto.produto_id).toBe(criado.produto_id);
      expect(produto.produto_descricao).toBe('Coca-cola Zero');
      expect(Number(produto.produto_venda)).toBeCloseTo(4.5, 2);

      const encontrado = await repoProduto.findOne({
        where: { produto_id: criado.produto_id },
      });
      expect(encontrado!.produto_descricao).toBe('Coca-cola Zero');
      expect(Number(encontrado!.produto_venda)).toBeCloseTo(4.5, 2);
      expect(Number(encontrado!.produto_custo)).toBeCloseTo(1.5, 2);
      expect(Number(encontrado!.produto_marckup)).toBeCloseTo(1.2, 2);
    });

    it('deve lançar HttpException (404) ao atualizar produto inexistente', async () => {
      try {
        await produtoService.updateProdutoById(999, {
          produto_descricao: 'Produto Inexistente',
        } as any);
        fail('Era esperado lançar HttpException 404, mas não lançou.');
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        const httpErr = err as HttpException;
        expect(httpErr.getStatus()).toBe(404);
        expect(httpErr.message).toBe('Erro ao atualizar produto');
      }
    });

    it('deve realizar soft delete do produto (removeProduto)', async () => {
      const criado = await produtoService.createProduto({
        produto_descricao: 'Produto para remover',
        produto_custo: 2.0,
        produto_venda: 5.0,
        produto_marckup: 1.0,
      } as any);

      const resp = await produtoService.removeProduto(criado.produto_id);
      expect(resp.mensagem).toBe(
        `Produto ${criado.produto_id} excluido com sucesso`,
      );

      const todos = await produtoService.findAllProdutos();
      expect(todos).toHaveLength(0);

      const encontrado = await repoProduto.findOne({
        where: { produto_id: criado.produto_id },
        withDeleted: true,
      });

      expect(encontrado).toBeDefined();
      expect(encontrado!.produto_exclusao).toBeInstanceOf(Date);
    });

    it('deve lançar HttpException (404) ao remover produto inexistente', async () => {
      try {
        await produtoService.removeProduto(999);
        fail('Era esperado lançar HttpException 404, mas não lançou.');
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        const httpErr = err as HttpException;
        expect(httpErr.getStatus()).toBe(404);
        // a mensagem tem espaço no começo na service, então usamos trim()
        expect(httpErr.message.trim()).toBe('Erro ao excluir produto');
      }
    });
  });

  describe('EstoqueProdutoService (integração)', () => {
    it('deve lançar estoque (createEstoqueProduto)', async () => {
      const { mensagem, estoque } = await estoqueService.createEstoqueProduto({
        estoqueProduto_fisico: 10,
        estoqueProduto_ativo: true,
      });

      expect(mensagem).toBe('Estoque lançado com sucesso!');
      expect(estoque).toBeDefined();
      expect(estoque.estoqueProduto_fisico).toBe(10);
      expect(estoque.estoqueProduto_ativo).toBe(true);
    });

    it('deve listar e buscar um estoque existente (findAllEstoque + findEstoqueById)', async () => {
      const seeded = await repoEstoque.save({
        estoqueProduto_fisico: 15,
        estoqueProduto_ativo: true,
      } as any);

      const todos = await estoqueService.findAllEstoque();
      expect(todos).toHaveLength(1);

      const salvo = todos[0];
      expect(salvo.estoqueProduto_id).toBe(seeded.estoqueProduto_id);
      expect(salvo.estoqueProduto_fisico).toBe(15);
      expect(salvo.estoqueProduto_ativo).toBe(true);

      const { mensagem: msgFind, estoque: encontrado } =
        await estoqueService.findEstoqueById(seeded.estoqueProduto_id);

      expect(msgFind).toBe(`Estoque #${seeded.estoqueProduto_id}`);
      expect(encontrado.estoqueProduto_id).toBe(seeded.estoqueProduto_id);
      expect(encontrado.estoqueProduto_fisico).toBe(15);
      expect(encontrado.estoqueProduto_ativo).toBe(true);
    });

    it('deve lançar HttpException (404) ao buscar estoque inexistente', async () => {
      try {
        await estoqueService.findEstoqueById(999);
        fail('Era esperado lançar HttpException 404, mas não lançou.');
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        const httpErr = err as HttpException;
        expect(httpErr.getStatus()).toBe(404);
        expect(httpErr.message).toBe('Estoque não encontrado');
      }
    });

    it('deve atualizar um estoque existente (updateEstoqueProduto)', async () => {
      const criado = await repoEstoque.save({
        estoqueProduto_fisico: 5,
        estoqueProduto_ativo: true,
      } as any);

      const { mensagem, estoque } = await estoqueService.updateEstoqueProduto(
        criado.estoqueProduto_id,
        {
          estoqueProduto_fisico: 20,
          estoqueProduto_ativo: false,
        },
      );

      expect(mensagem).toBe(
        `Estoque #${criado.estoqueProduto_id} Atualizado com sucesso`,
      );
      expect(estoque.estoqueProduto_id).toBe(criado.estoqueProduto_id);
      expect(estoque.estoqueProduto_fisico).toBe(20);
      expect(estoque.estoqueProduto_ativo).toBe(false);

      const encontrado = await repoEstoque.findOne({
        where: { estoqueProduto_id: criado.estoqueProduto_id },
      });

      expect(encontrado!.estoqueProduto_fisico).toBe(20);
      expect(encontrado!.estoqueProduto_ativo).toBe(false);
    });

    it('deve lançar HttpException (404) ao atualizar estoque inexistente', async () => {
      try {
        await estoqueService.updateEstoqueProduto(999, {
          estoqueProduto_fisico: 50,
        });
        fail('Era esperado lançar HttpException 404, mas não lançou.');
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        const httpErr = err as HttpException;
        expect(httpErr.getStatus()).toBe(404);
        expect(httpErr.message).toBe('Estoque não encontrado');
      }
    });

    it('deve realizar soft delete do estoque (deleteEstoqueByProduto)', async () => {
      const criado = await repoEstoque.save({
        estoqueProduto_fisico: 100,
        estoqueProduto_ativo: true,
      } as any);

      const resp = await estoqueService.deleteEstoqueByProduto(
        criado.estoqueProduto_id,
      );

      expect(resp.mensagem).toBe('Estoque excluido com sucesso');

      const todos = await estoqueService.findAllEstoque();
      expect(todos).toHaveLength(0);

      const encontrado = await repoEstoque.findOne({
        where: { estoqueProduto_id: criado.estoqueProduto_id },
        withDeleted: true,
      });

      expect(encontrado).toBeDefined();
      expect(encontrado!.estoqueProduto_exclusao).toBeInstanceOf(Date);
    });

    it('deve lançar HttpException (404) ao remover estoque inexistente', async () => {
      try {
        await estoqueService.deleteEstoqueByProduto(999);
        fail('Era esperado lançar HttpException 404, mas não lançou.');
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        const httpErr = err as HttpException;
        expect(httpErr.getStatus()).toBe(404);
        expect(httpErr.message).toBe(
          'Erro ao excluir estoque do produto #999',
        );
      }
    });
  });
});
