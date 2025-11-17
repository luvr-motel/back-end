import { Test, TestingModule } from '@nestjs/testing';
import { EstoqueProdutoController } from './estoque-produto.controller';
import { EstoqueProdutoService } from './estoque-produto.service';
import { CreateEstoqueProdutoDto } from './dto/create-estoque-produto.dto';
import { UpdateEstoqueProdutoDto } from './dto/update-estoque-produto.dto';
import { HttpException } from '@nestjs/common';

describe('EstoqueProdutoController', () => {
  let controller: EstoqueProdutoController;
  let service: jest.Mocked<EstoqueProdutoService>;

  beforeEach(async () => {
    const serviceMock: Partial<jest.Mocked<EstoqueProdutoService>> = {
      createEstoqueProduto: jest.fn(),
      findAllEstoque: jest.fn(),
      findEstoqueById: jest.fn(),
      updateEstoqueProduto: jest.fn(),
      deleteEstoqueByProduto: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EstoqueProdutoController],
      providers: [{ provide: EstoqueProdutoService, useValue: serviceMock }],
    }).compile();

    controller = module.get<EstoqueProdutoController>(EstoqueProdutoController);
    service = module.get(EstoqueProdutoService) as jest.Mocked<EstoqueProdutoService>;
  });

  it('create delega ao service e retorna', async () => {
    const dto: CreateEstoqueProdutoDto = {
      estoqueProduto_fisico: 16,
      estoqueProduto_ativo: true,
      produto_id: 1,
      motel_id: 1,
    };
    const payload = { mensagem: 'Estoque lançado com sucesso!', estoque: { estoqueProduto_id: 1 } } as any;
    service.createEstoqueProduto.mockResolvedValue(payload);

    const result = await controller.create(dto);
    expect(service.createEstoqueProduto).toHaveBeenCalledWith(dto);
    expect(result).toBe(payload);
  });

  it('findAll delega ao service', async () => {
    const lista = [{ estoqueProduto_id: 1 }] as any[];
    service.findAllEstoque.mockResolvedValue(lista);

    const result = await controller.findAll();
    expect(service.findAllEstoque).toHaveBeenCalled();
    expect(result).toBe(lista);
  });

  it('findOne converte id para número e delega', async () => {
    const payload = { mensagem: 'Estoque #5', estoque: { estoqueProduto_id: 5 } } as any;
    service.findEstoqueById.mockResolvedValue(payload);

    const result = await controller.findOne('5');
    expect(service.findEstoqueById).toHaveBeenCalledWith(5);
    expect(result).toBe(payload);
  });

  it('update delega com id numérico', async () => {
    const dto: UpdateEstoqueProdutoDto = { estoqueProduto_fisico: 30 } as any;
    const payload = { mensagem: 'Estoque #2 Atualizado com sucesso', estoque: { estoqueProduto_id: 2 } } as any;
    service.updateEstoqueProduto.mockResolvedValue(payload);

    const result = await controller.update('2', dto);
    expect(service.updateEstoqueProduto).toHaveBeenCalledWith(2, dto);
    expect(result).toBe(payload);
  });

  it('delete delega com id numérico', async () => {
    const payload = { mensagem: 'Estoque excluido com sucesso' } as any;
    service.deleteEstoqueByProduto.mockResolvedValue(payload);

    const result = await controller.deleteEstoqueByProduto('9');
    expect(service.deleteEstoqueByProduto).toHaveBeenCalledWith(9);
    expect(result).toBe(payload);
  });

  it('propaga erro do service no findOne', async () => {
    service.findEstoqueById.mockRejectedValue(new HttpException('Estoque não encontrado', 404));
    await expect(controller.findOne('999')).rejects.toThrow('Estoque não encontrado');
  });

  it('propaga erro do service no update', async () => {
    service.updateEstoqueProduto.mockRejectedValue(new HttpException('Estoque não encontrado', 404));
    await expect(controller.update('1', {} as any)).rejects.toThrow('Estoque não encontrado');
  });

  it('propaga erro do service no delete', async () => {
    service.deleteEstoqueByProduto.mockRejectedValue(new HttpException('Erro ao excluir estoque do produto #5', 404));
    await expect(controller.deleteEstoqueByProduto('5')).rejects.toThrow('Erro ao excluir estoque do produto #5');
  });
});
