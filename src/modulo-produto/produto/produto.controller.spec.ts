import { Test, TestingModule } from '@nestjs/testing';
import { ProdutoController } from './produto.controller';
import { ProdutoService } from './produto.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { HttpException } from '@nestjs/common';

describe('ProdutoController', () => {
  let controller: ProdutoController;
  let service: jest.Mocked<ProdutoService>;

  beforeEach(async () => {
    const serviceMock: Partial<jest.Mocked<ProdutoService>> = {
      createProduto: jest.fn(),
      findAllProdutos: jest.fn(),
      findProdutoId: jest.fn(),
      updateProdutoById: jest.fn(),
      removeProduto: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProdutoController],
      providers: [{ provide: ProdutoService, useValue: serviceMock }],
    }).compile();

    controller = module.get<ProdutoController>(ProdutoController);
    service = module.get(ProdutoService) as jest.Mocked<ProdutoService>;
  });

  it('create → delega ao service e retorna', async () => {
    const dto: CreateProdutoDto = {
      produto_descricao: 'Coca',
      produto_custo: 1.1,
      produto_venda: 3.5,
      produto_marckup: 1.0,
    };
    const salvo = { produto_id: 1, ...dto } as any;
    service.createProduto.mockResolvedValue(salvo);

    const result = await controller.create(dto);
    expect(service.createProduto).toHaveBeenCalledWith(dto);
    expect(result).toBe(salvo);
  });

  it('findAll → delega ao service', async () => {
    const lista = [{ produto_id: 1 }] as any[];
    service.findAllProdutos.mockResolvedValue(lista);

    const result = await controller.findAll();
    expect(service.findAllProdutos).toHaveBeenCalled();
    expect(result).toBe(lista);
  });

  it('findOne → converte id p/ número e delega', async () => {
    const payload = { mensagem: 'Produto #2', produto: { produto_id: 2 } };
    service.findProdutoId.mockResolvedValue(payload as any);

    const result = await controller.findOne('2');
    expect(service.findProdutoId).toHaveBeenCalledWith(2);
    expect(result).toBe(payload);
  });

  it('update → delega ao service com id numérico', async () => {
    const dto: UpdateProdutoDto = { produto_descricao: 'Novo' } as any;
    const resp = { mensagem: 'Produto #3 Atualizado com sucesso', produto: { produto_id: 3 } };
    service.updateProdutoById.mockResolvedValue(resp as any);

    const result = await controller.update('3', dto);
    expect(service.updateProdutoById).toHaveBeenCalledWith(3, dto);
    expect(result).toBe(resp);
  });

  it('removeProduto → delega ao service com id numérico', async () => {
    const resp = { mensagem: 'Produto 4 excluido com sucesso' };
    service.removeProduto.mockResolvedValue(resp);

    const result = await controller.removeProduto('4');
    expect(service.removeProduto).toHaveBeenCalledWith(4);
    expect(result).toBe(resp);
  });

  it('propaga erro do service no findOne', async () => {
    service.findProdutoId.mockRejectedValue(new HttpException('Produto não encontrado', 404));
    await expect(controller.findOne('999')).rejects.toThrow('Produto não encontrado');
  });

  it('propaga erro do service no update', async () => {
    service.updateProdutoById.mockRejectedValue(new HttpException('Erro ao atualizar produto', 404));
    await expect(controller.update('123', {} as any)).rejects.toThrow('Erro ao atualizar produto');
  });

  it('propaga erro do service no delete', async () => {
    service.removeProduto.mockRejectedValue(new HttpException(' Erro ao excluir produto', 404));
    await expect(controller.removeProduto('55')).rejects.toThrow(' Erro ao excluir produto');
  });
});
