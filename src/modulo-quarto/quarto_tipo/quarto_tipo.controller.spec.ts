import { QuartoTipoController } from './quarto_tipo.controller';
import { QuartoTipoService } from './quarto_tipo.service';
import { CreateQuartoTipoDto } from './dto/create-quarto_tipo.dto';
import { UpdateQuartoTipoDto } from './dto/update-quarto_tipo.dto';

describe('QuartoTipoController', () => {
  let controller: QuartoTipoController;
  let service: jest.Mocked<QuartoTipoService>;

  beforeEach(() => {
    service = {
      createQuartoTipo: jest.fn(),
      findAllQuartoTipos: jest.fn(),
      findQuartoTipoId: jest.fn(),
      updateQuartoTipo: jest.fn(),
      removeQuartoTipo: jest.fn(),
    } as unknown as jest.Mocked<QuartoTipoService>;

    controller = new QuartoTipoController(service);
  });

  it('deve criar um tipo de quarto', async () => {
    const dto: CreateQuartoTipoDto = { quartotipo_descricao: 'Luxo' };
    const resposta = { quartotipo_Id: 1 };
    service.createQuartoTipo.mockResolvedValue(resposta as any);

    const result = await controller.createQuartoTipo(dto);

    expect(service.createQuartoTipo).toHaveBeenCalledWith(dto);
    expect(result).toBe(resposta);
  });

  it('deve listar os tipos', async () => {
    const lista = [{ quartotipo_Id: 1 }];
    service.findAllQuartoTipos.mockResolvedValue(lista as any);

    const result = await controller.findAllQuartoTipos();

    expect(service.findAllQuartoTipos).toHaveBeenCalled();
    expect(result).toBe(lista);
  });

  it('deve buscar um tipo por id', async () => {
    const resposta = { mensagem: 'ok' };
    service.findQuartoTipoId.mockResolvedValue(resposta as any);

    const result = await controller.findQuartoTipoId('3');

    expect(service.findQuartoTipoId).toHaveBeenCalledWith(3);
    expect(result).toBe(resposta);
  });

  it('deve atualizar um tipo', async () => {
    const dto: UpdateQuartoTipoDto = { quartotipo_descricao: 'Atualizado' };
    const resposta = { mensagem: 'Atualizado' };
    service.updateQuartoTipo.mockResolvedValue(resposta as any);

    const result = await controller.updateQuartoTipo('4', dto);

    expect(service.updateQuartoTipo).toHaveBeenCalledWith(4, dto);
    expect(result).toBe(resposta);
  });

  it('deve remover um tipo', async () => {
    const resposta = { mensagem: 'Removido' };
    service.removeQuartoTipo.mockResolvedValue(resposta as any);

    const result = await controller.removeQuartoTipo('5');

    expect(service.removeQuartoTipo).toHaveBeenCalledWith(5);
    expect(result).toBe(resposta);
  });
});
