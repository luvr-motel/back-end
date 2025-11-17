import { QuartoController } from './quarto.controller';
import { QuartoService } from './quarto.service';
import { CreateQuartoDto } from './dto/create-quarto.dto';
import { UpdateQuartoDto } from './dto/update-quarto.dto';

describe('QuartoController', () => {
  let controller: QuartoController;
  let service: jest.Mocked<QuartoService>;

  beforeEach(() => {
    service = {
      createQuarto: jest.fn(),
      findAllQuartos: jest.fn(),
      findQuartoId: jest.fn(),
      updateQuarto: jest.fn(),
      deleteQuartoById: jest.fn(),
    } as unknown as jest.Mocked<QuartoService>;

    controller = new QuartoController(service);
  });

  it('deve criar quarto via service', async () => {
    const dto: CreateQuartoDto = {
      quarto_descricao: 'Suíte',
      quarto_atributos: 'TV',
      quarto_ativo: true,
      quartotipo_id: 1,
      motel: 2,
    };
    const resposta = { quarto_id: 1 };
    service.createQuarto.mockResolvedValue(resposta as any);

    const result = await controller.createQuarto(dto);

    expect(service.createQuarto).toHaveBeenCalledWith(dto);
    expect(result).toBe(resposta);
  });

  it('deve retornar todos os quartos', async () => {
    const lista = [{ quarto_id: 1 }];
    service.findAllQuartos.mockResolvedValue(lista as any);

    const result = await controller.findAllQuartos();

    expect(service.findAllQuartos).toHaveBeenCalled();
    expect(result).toBe(lista);
  });

  it('deve buscar quarto por id convertendo parâmetro', async () => {
    const resposta = { mensagem: 'ok' };
    service.findQuartoId.mockResolvedValue(resposta as any);

    const result = await controller.findQuartoId('5');

    expect(service.findQuartoId).toHaveBeenCalledWith(5);
    expect(result).toBe(resposta);
  });

  it('deve atualizar quarto', async () => {
    const dto: UpdateQuartoDto = { quarto_descricao: 'Atualizado' };
    const resposta = { mensagem: 'Atualizado' };
    service.updateQuarto.mockResolvedValue(resposta as any);

    const result = await controller.updateQuarto('6', dto);

    expect(service.updateQuarto).toHaveBeenCalledWith(6, dto);
    expect(result).toBe(resposta);
  });

  it('deve remover quarto', async () => {
    const resposta = { mensagem: 'Removido' };
    service.deleteQuartoById.mockResolvedValue(resposta as any);

    const result = await controller.deleteQuartoById('7');

    expect(service.deleteQuartoById).toHaveBeenCalledWith(7);
    expect(result).toBe(resposta);
  });

  it('propaga erro do service ao criar quarto', async () => {
    service.createQuarto.mockRejectedValue(new Error('falha'));

    await expect(
      controller.createQuarto({
        quarto_descricao: 'S',
        quarto_atributos: 'A',
        quarto_ativo: true,
        quartotipo_id: 1,
        motel: undefined,
      } as CreateQuartoDto),
    ).rejects.toThrow('falha');
  });

  it('propaga erro do service ao atualizar quarto', async () => {
    service.updateQuarto.mockRejectedValue(new Error('falha update'));

    await expect(
      controller.updateQuarto('10', { quarto_descricao: 'X' }),
    ).rejects.toThrow('falha update');
    expect(service.updateQuarto).toHaveBeenCalledWith(
      10,
      expect.objectContaining({ quarto_descricao: 'X' }),
    );
  });
});
