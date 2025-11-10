import { PagamentoFormaController } from './pagamento-forma.controller';
import { PagamentoFormaService } from './pagamento-forma.service';
import { CreatePagamentoFormaDto } from './dto/create-pagamento-forma.dto';
import { UpdatePagamentoFormaDto } from './dto/update-pagamento-forma.dto';

describe('PagamentoFormaController', () => {
  let controller: PagamentoFormaController;
  let service: jest.Mocked<PagamentoFormaService>;

  beforeEach(() => {
    service = {
      createPagamentoForma: jest.fn(),
      findAllPagamentoForma: jest.fn(),
      findPagamentoFormaById: jest.fn(),
      updatePagamentoFormaById: jest.fn(),
      deletePagamentoForma: jest.fn(),
    } as unknown as jest.Mocked<PagamentoFormaService>;

    controller = new PagamentoFormaController(service);
  });

  it('deve criar uma forma de pagamento via service', async () => {
    const dto: CreatePagamentoFormaDto = {
      pagamentoForma_descricao: 'PIX',
      pagamentoForma_contaDestino: '123-x',
    };
    const resposta = { pagamentoForma_id: 1 };
    service.createPagamentoForma.mockResolvedValue(resposta as any);

    const result = await controller.create(dto);

    expect(service.createPagamentoForma).toHaveBeenCalledWith(dto);
    expect(result).toBe(resposta);
  });

  it('deve listar todas as formas', async () => {
    const lista = [{ pagamentoForma_id: 1 }];
    service.findAllPagamentoForma.mockResolvedValue(lista as any);

    const result = await controller.findAll();

    expect(service.findAllPagamentoForma).toHaveBeenCalled();
    expect(result).toBe(lista);
  });

  it('deve buscar forma por id convertendo parâmetro', async () => {
    const resposta = { mensagem: 'ok' };
    service.findPagamentoFormaById.mockResolvedValue(resposta as any);

    const result = await controller.findOne('5');

    expect(service.findPagamentoFormaById).toHaveBeenCalledWith(5);
    expect(result).toBe(resposta);
  });

  it('deve atualizar forma', async () => {
    const dto: UpdatePagamentoFormaDto = {
      pagamentoForma_descricao: 'Cartão',
    };
    const resposta = { mensagem: 'Atualizada' };
    service.updatePagamentoFormaById.mockResolvedValue(resposta as any);

    const result = await controller.update('6', dto);

    expect(service.updatePagamentoFormaById).toHaveBeenCalledWith(6, dto);
    expect(result).toBe(resposta);
  });

  it('deve remover forma', async () => {
    const resposta = { mensagem: 'Removida' };
    service.deletePagamentoForma.mockResolvedValue(resposta as any);

    const result = await controller.deletePagamentoForma('7');

    expect(service.deletePagamentoForma).toHaveBeenCalledWith(7);
    expect(result).toBe(resposta);
  });
});
