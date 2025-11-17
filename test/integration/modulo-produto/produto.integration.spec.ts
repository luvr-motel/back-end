import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';

import { Produto } from 'src/modulo-produto/produto/entities/produto.entity';
import { ProdutoService } from 'src/modulo-produto/produto/produto.service';

jest.setTimeout(30000);

describe('ProdutoService (integração)', () => {
  let moduleRef: TestingModule;
  let service: ProdutoService;
  let repo: Repository<Produto>;

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
        TypeOrmModule.forFeature([Produto]),
      ],
      providers: [ProdutoService],
    }).compile();

    service = moduleRef.get<ProdutoService>(ProdutoService);
    repo = moduleRef.get<Repository<Produto>>(getRepositoryToken(Produto));
  });

  // limpa tabela antes de cada teste
  beforeEach(async () => {
    await repo.createQueryBuilder().delete().from(Produto).execute();
  });

  // fecha módulo ao final
  afterAll(async () => {
    await moduleRef.close();
  });

  it('deve criar um produto e recuperá-lo (createProduto + findAllProdutos + findProdutoId)', async () => {
    // cria produto
    const dto = {
      produto_descricao: 'Coca-cola Lata',
      produto_custo: 1.1,
      produto_venda: 3.5,
      produto_marckup: 1.0,
    } as any;

    const criado = await service.createProduto(dto);

    expect(criado).toBeDefined();
    expect(criado.produto_id).toBeDefined();
    expect(criado.produto_descricao).toBe('Coca-cola Lata');
    expect(Number(criado.produto_custo)).toBeCloseTo(1.1, 2);
    expect(Number(criado.produto_venda)).toBeCloseTo(3.5, 2);
    expect(criado.produto_inclusao).toBeInstanceOf(Date);

    // lista todos
    const todos = await service.findAllProdutos();
    expect(todos).toHaveLength(1);
    expect(todos[0].produto_descricao).toBe('Coca-cola Lata');

    // busca por id
    const { mensagem, produto } = await service.findProdutoId(criado.produto_id);
    expect(mensagem).toBe(`Produto #${criado.produto_id}`);
    expect(produto.produto_id).toBe(criado.produto_id);
  });

  it('deve lançar HttpException (404) ao buscar produto inexistente', async () => {
    try {
      await service.findProdutoId(999);
      fail('Era esperado lançar HttpException 404, mas não lançou.');
    } catch (err) {
      expect(err).toBeInstanceOf(HttpException);
      const httpErr = err as HttpException;
      expect(httpErr.getStatus()).toBe(404);
      expect(httpErr.message).toBe('Produto não encontrado');
    }
  });

  it('deve atualizar um produto existente (updateProdutoById)', async () => {
    // cria produto
    const criado = await service.createProduto({
      produto_descricao: 'Coca-cola Original',
      produto_custo: 1.5,
      produto_venda: 4.0,
      produto_marckup: 1.2,
    } as any);

    // atualiza alguns campos
    const { mensagem, produto } = await service.updateProdutoById(criado.produto_id, {
      produto_descricao: 'Coca-cola Zero',
      produto_venda: 4.5,
    } as any);

    expect(mensagem).toBe(`Produto #${criado.produto_id} Atualizado com sucesso`);
    expect(produto.produto_id).toBe(criado.produto_id);
    expect(produto.produto_descricao).toBe('Coca-cola Zero');
    expect(Number(produto.produto_venda)).toBeCloseTo(4.5, 2);

    // confere direto no banco
    const encontrado = await repo.findOne({ where: { produto_id: criado.produto_id } });
    expect(encontrado!.produto_descricao).toBe('Coca-cola Zero');
    expect(Number(encontrado!.produto_venda)).toBeCloseTo(4.5, 2);
    // campos não alterados continuam
    expect(Number(encontrado!.produto_custo)).toBeCloseTo(1.5, 2);
    expect(Number(encontrado!.produto_marckup)).toBeCloseTo(1.2, 2);
  });

  it('deve lançar HttpException (404) ao atualizar produto inexistente', async () => {
    try {
      await service.updateProdutoById(999, {
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
    // cria produto
    const criado = await service.createProduto({
      produto_descricao: 'Produto para remover',
      produto_custo: 2.0,
      produto_venda: 5.0,
      produto_marckup: 1.0,
    } as any);

    // remove produto
    const resp = await service.removeProduto(criado.produto_id);
    expect(resp.mensagem).toBe(`Produto ${criado.produto_id} excluido com sucesso`);

    // não deve aparecer na listagem normal
    const todos = await service.findAllProdutos();
    expect(todos).toHaveLength(0);

    // mas deve existir como soft-deletado
    const encontrado = await repo.findOne({
      where: { produto_id: criado.produto_id },
      withDeleted: true,
    });

    expect(encontrado).toBeDefined();
    expect(encontrado!.produto_exclusao).toBeInstanceOf(Date);
  });

  it('deve lançar HttpException (404) ao remover produto inexistente', async () => {
    try {
      await service.removeProduto(999);
      fail('Era esperado lançar HttpException 404, mas não lançou.');
    } catch (err) {
      expect(err).toBeInstanceOf(HttpException);
      const httpErr = err as HttpException;
      expect(httpErr.getStatus()).toBe(404);
      // a mensagem tem um espaço no começo na service, então uso trim()
      expect(httpErr.message.trim()).toBe('Erro ao excluir produto');
    }
  });
});
