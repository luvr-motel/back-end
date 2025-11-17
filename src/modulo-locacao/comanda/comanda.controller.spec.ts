import { ComandaController } from './comanda.controller';
import { ComandaService } from './comanda.service';
import { CreateComandaDto } from './dto/create-comanda.dto';
import { UpdateComandaDto } from './dto/update-comanda.dto';

describe('ComandaController', () => {
  let controller: ComandaController;
  let service: jest.Mocked<ComandaService>;

  beforeEach(() => {
    service = {
      createComanda: jest.fn(),
      findAllComandas: jest.fn(),
      findComandaId: jest.fn(),
      updateComanda: jest.fn(),
      removeComanda: jest.fn(),
    } as unknown as jest.Mocked<ComandaService>;

    controller = new ComandaController(service);
  });

  it('deve criar comanda usando o service', async () => {
    const dto: CreateComandaDto = {
      comanda_observacao: 'Obs',
      comanda_qtde: 1,
    };
    const resposta = { comanda_id: 1 };
    service.createComanda.mockResolvedValue(resposta as any);

    const result = await controller.create(dto);

    expect(service.createComanda).toHaveBeenCalledWith(dto);
    expect(result).toBe(resposta);
  });

  it('deve retornar todas as comandas', async () => {
    const lista = [{ comanda_id: 1 }];
    service.findAllComandas.mockResolvedValue(lista as any);

    const result = await controller.findAll();

    expect(service.findAllComandas).toHaveBeenCalled();
    expect(result).toBe(lista);
  });

  it('deve buscar comanda por id convertendo parâmetro', async () => {
    const resposta = { mensagem: 'ok' };
    service.findComandaId.mockResolvedValue(resposta as any);

    const result = await controller.findOne('5');

    expect(service.findComandaId).toHaveBeenCalledWith(5);
    expect(result).toBe(resposta);
  });

  it('deve atualizar comanda', async () => {
    const dto: UpdateComandaDto = { comanda_observacao: 'Atualizada' };
    const resposta = { mensagem: 'Atualizada' };
    service.updateComanda.mockResolvedValue(resposta as any);

    const result = await controller.update('6', dto);

    expect(service.updateComanda).toHaveBeenCalledWith(6, dto);
    expect(result).toBe(resposta);
  });

  it('deve remover comanda', async () => {
    const resposta = { mensagem: 'Removida' };
    service.removeComanda.mockResolvedValue(resposta as any);

    const result = await controller.removeComanda('7');

    expect(service.removeComanda).toHaveBeenCalledWith(7);
    expect(result).toBe(resposta);
  });
});
