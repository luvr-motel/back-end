import { DespesatipoController } from './despesatipo.controller';
import { DespesatipoService } from './despesatipo.service';
import { CreateDespesatipoDto } from './dto/create-despesatipo.dto';
import { UpdateDespesatipoDto } from './dto/update-despesatipo.dto';

describe('DespesatipoController', () => {
  let controller: DespesatipoController;
  let service: jest.Mocked<DespesatipoService>;

  beforeEach(() => {
    service = {
      createDespesatipo: jest.fn(),
      findAllDespesatipo: jest.fn(),
      findOneDespesatipo: jest.fn(),
      updateDespesatipo: jest.fn(),
      removeDespesatipo: jest.fn(),
    } as unknown as jest.Mocked<DespesatipoService>;

    controller = new DespesatipoController(service);
  });

  it('deve criar um tipo de despesa', async () => {
    const dto: CreateDespesatipoDto = {
      despesatipo_descricao: 'Fornecedor',
    };
    const resposta = { despesatipo_id: 1 };
    service.createDespesatipo.mockResolvedValue(resposta as any);

    const result = await controller.createDespesatipo(dto);

    expect(service.createDespesatipo).toHaveBeenCalledWith(dto);
    expect(result).toBe(resposta);
  });

  it('deve listar todos os tipos', async () => {
    const lista = [{ despesatipo_id: 1 }];
    service.findAllDespesatipo.mockResolvedValue(lista as any);

    const result = await controller.findAllDespesatipo();

    expect(service.findAllDespesatipo).toHaveBeenCalled();
    expect(result).toBe(lista);
  });

  it('deve buscar um tipo por id', async () => {
    const resposta = { mensagem: 'ok' };
    service.findOneDespesatipo.mockResolvedValue(resposta as any);

    const result = await controller.findOneDespesatipo('5');

    expect(service.findOneDespesatipo).toHaveBeenCalledWith(5);
    expect(result).toBe(resposta);
  });

  it('deve atualizar um tipo', async () => {
    const dto: UpdateDespesatipoDto = { despesatipo_descricao: 'Atualizado' };
    const resposta = { mensagem: 'Atualizado' };
    service.updateDespesatipo.mockResolvedValue(resposta as any);

    const result = await controller.updateDespesatipo('6', dto);

    expect(service.updateDespesatipo).toHaveBeenCalledWith(6, dto);
    expect(result).toBe(resposta);
  });

  it('deve remover um tipo', async () => {
    const resposta = { mensagem: 'Removido' };
    service.removeDespesatipo.mockResolvedValue(resposta as any);

    const result = await controller.removeDespesatipo('7');

    expect(service.removeDespesatipo).toHaveBeenCalledWith(7);
    expect(result).toBe(resposta);
  });
});
