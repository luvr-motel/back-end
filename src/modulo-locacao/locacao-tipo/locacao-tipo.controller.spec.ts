import { LocacaoTipoController } from './locacao-tipo.controller';
import { LocacaoTipoService } from './locacao-tipo.service';
import { CreateLocacaoTipoDto } from './dto/create-locacao-tipo.dto';
import { UpdateLocacaoTipoDto } from './dto/update-locacao-tipo.dto';

describe('LocacaoTipoController', () => {
  let controller: LocacaoTipoController;
  let service: jest.Mocked<LocacaoTipoService>;

  beforeEach(() => {
    service = {
      createLocacaoTipo: jest.fn(),
      findAllLocacaoTipo: jest.fn(),
      findLocacaoTipoId: jest.fn(),
      updateLocacaoTipById: jest.fn(),
      deleteLocacaoTipo: jest.fn(),
    } as unknown as jest.Mocked<LocacaoTipoService>;

    controller = new LocacaoTipoController(service);
  });

  it('deve criar tipo de locação via service', async () => {
    const dto: CreateLocacaoTipoDto = { locacaoTipo_descricao: 'Luxo' };
    const resposta = { locacaoTipo_id: 1 };
    service.createLocacaoTipo.mockResolvedValue(resposta as any);

    const result = await controller.create(dto);

    expect(service.createLocacaoTipo).toHaveBeenCalledWith(dto);
    expect(result).toBe(resposta);
  });

  it('deve listar tipos', async () => {
    const lista = [{ locacaoTipo_id: 1 }];
    service.findAllLocacaoTipo.mockResolvedValue(lista as any);

    const result = await controller.findAll();

    expect(service.findAllLocacaoTipo).toHaveBeenCalled();
    expect(result).toBe(lista);
  });

  it('deve buscar tipo por id', async () => {
    const resposta = { mensagem: 'ok' };
    service.findLocacaoTipoId.mockResolvedValue(resposta as any);

    const result = await controller.findOne('5');

    expect(service.findLocacaoTipoId).toHaveBeenCalledWith(5);
    expect(result).toBe(resposta);
  });

  it('deve atualizar tipo', async () => {
    const dto: UpdateLocacaoTipoDto = { locacaoTipo_descricao: 'Atualizado' };
    const resposta = { mensagem: 'Atualizado' };
    service.updateLocacaoTipById.mockResolvedValue(resposta as any);

    const result = await controller.update('6', dto);

    expect(service.updateLocacaoTipById).toHaveBeenCalledWith(6, dto);
    expect(result).toBe(resposta);
  });

  it('deve remover tipo', async () => {
    const resposta = { mensagem: 'Removido' };
    service.deleteLocacaoTipo.mockResolvedValue(resposta as any);

    const result = await controller.deleteLocacaoTipo('7');

    expect(service.deleteLocacaoTipo).toHaveBeenCalledWith(7);
    expect(result).toBe(resposta);
  });
});
