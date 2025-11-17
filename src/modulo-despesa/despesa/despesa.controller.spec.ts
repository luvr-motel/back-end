import { DespesaController } from './despesa.controller';
import { DespesaService } from './despesa.service';
import { CreateDespesaDto } from './dto/create-despesa.dto';
import { UpdateDespesaDto } from './dto/update-despesa.dto';

describe('DespesaController', () => {
  let controller: DespesaController;
  let service: jest.Mocked<DespesaService>;

  beforeEach(() => {
    service = {
      createDespesa: jest.fn(),
      findAllDespesas: jest.fn(),
      findDespesaId: jest.fn(),
      updateDespesa: jest.fn(),
      removeDespesa: jest.fn(),
    } as unknown as jest.Mocked<DespesaService>;

    controller = new DespesaController(service);
  });

  it('deve delegar criação para o service', async () => {
    const dto = {
      despesa_descricao: 'Nova despesa',
      despesa_parcela: 1,
      despesa_aberto: true,
      despesa_total: 100,
      despesatipo_id: 2,
      pessoa: 3,
      usuario_id: 4,
      motel_id: 5,
    } as CreateDespesaDto;
    const resposta = { despesa_id: 1 };
    service.createDespesa.mockResolvedValue(resposta as any);

    const result = await controller.createDespesa(dto);

    expect(service.createDespesa).toHaveBeenCalledWith(dto);
    expect(result).toBe(resposta);
  });

  it('deve retornar todas as despesas', async () => {
    const despesas = [{ despesa_id: 1 }];
    service.findAllDespesas.mockResolvedValue(despesas as any);

    const result = await controller.findAllDespesas();

    expect(service.findAllDespesas).toHaveBeenCalled();
    expect(result).toBe(despesas);
  });

  it('deve buscar despesa por id convertendo para número', async () => {
    const resposta = { mensagem: 'ok' };
    service.findDespesaId.mockResolvedValue(resposta as any);

    const result = await controller.findDespesaId('7');

    expect(service.findDespesaId).toHaveBeenCalledWith(7);
    expect(result).toBe(resposta);
  });

  it('deve atualizar despesa', async () => {
    const dto: UpdateDespesaDto = { despesa_descricao: 'Atualizada' };
    const resposta = { mensagem: 'Atualizada' };
    service.updateDespesa.mockResolvedValue(resposta as any);

    const result = await controller.updateDespesa('8', dto);

    expect(service.updateDespesa).toHaveBeenCalledWith(8, dto);
    expect(result).toBe(resposta);
  });

  it('deve remover despesa', async () => {
    const resposta = { mensagem: 'Removida' };
    service.removeDespesa.mockResolvedValue(resposta as any);

    const result = await controller.removeDespesa('9');

    expect(service.removeDespesa).toHaveBeenCalledWith(9);
    expect(result).toBe(resposta);
  });
});
