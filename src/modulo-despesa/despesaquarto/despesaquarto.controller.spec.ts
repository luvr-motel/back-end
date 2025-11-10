import { DespesaquartoController } from './despesaquarto.controller';
import { DespesaquartoService } from './despesaquarto.service';
import { CreateDespesaquartoDto } from './dto/create-despesaquarto.dto';
import { UpdateDespesaquartoDto } from './dto/update-despesaquarto.dto';

describe('DespesaquartoController', () => {
  let controller: DespesaquartoController;
  let service: jest.Mocked<DespesaquartoService>;

  beforeEach(() => {
    service = {
      createDespesaquarto: jest.fn(),
      findAllDespesasQuarto: jest.fn(),
      findDespesaquartoId: jest.fn(),
      updateDespesaquarto: jest.fn(),
      removeDespesaquarto: jest.fn(),
    } as unknown as jest.Mocked<DespesaquartoService>;

    controller = new DespesaquartoController(service);
  });

  it('deve delegar a criação de despesa para o serviço', async () => {
    const dto = {
      despesaquarto_descricao: 'Teste',
      despesaquarto_itens: 'Itens',
      usuario_id: 1,
      quarto_id: 2,
      motel_id: 3,
      despesatipo_id: 4,
      pessoa_id: 5,
      despesaquarto_parcela: 1,
    } as CreateDespesaquartoDto;
    const expected = { despesaquarto_id: 1 };
    service.createDespesaquarto.mockResolvedValue(expected as any);

    const result = await controller.createDespesaquarto(dto);

    expect(service.createDespesaquarto).toHaveBeenCalledWith(dto);
    expect(result).toBe(expected);
  });

  it('deve retornar todas as despesas usando o serviço', async () => {
    const despesas = [{ despesaquarto_id: 1 }];
    service.findAllDespesasQuarto.mockResolvedValue(despesas as any);

    const result = await controller.findAllDespesasQuarto();

    expect(service.findAllDespesasQuarto).toHaveBeenCalled();
    expect(result).toBe(despesas);
  });

  it('deve buscar uma despesa por id convertendo o parâmetro para número', async () => {
    const resposta = { mensagem: 'ok' };
    service.findDespesaquartoId.mockResolvedValue(resposta as any);

    const result = await controller.findDespesaquartoId('10');

    expect(service.findDespesaquartoId).toHaveBeenCalledWith(10);
    expect(result).toBe(resposta);
  });

  it('deve atualizar uma despesa', async () => {
    const dto: UpdateDespesaquartoDto = {
      despesaquarto_descricao: 'Atualizada',
    };
    const resposta = { mensagem: 'Atualizada' };
    service.updateDespesaquarto.mockResolvedValue(resposta as any);

    const result = await controller.updateDespesaquarto('2', dto);

    expect(service.updateDespesaquarto).toHaveBeenCalledWith(2, dto);
    expect(result).toBe(resposta);
  });

  it('deve remover uma despesa', async () => {
    const resposta = { mensagem: 'Removida' };
    service.removeDespesaquarto.mockResolvedValue(resposta as any);

    const result = await controller.removeDespesaquarto('3');

    expect(service.removeDespesaquarto).toHaveBeenCalledWith(3);
    expect(result).toBe(resposta);
  });
});
