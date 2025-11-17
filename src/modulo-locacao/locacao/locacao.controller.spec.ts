import { LocacaoController } from './locacao.controller';
import { LocacaoService } from './locacao.service';
import { CreateLocacaoDto } from './dto/create-locacao.dto';
import { UpdateLocacaoDto } from './dto/update-locacao.dto';

describe('LocacaoController', () => {
  let controller: LocacaoController;
  let service: jest.Mocked<LocacaoService>;

  beforeEach(() => {
    service = {
      createLocacao: jest.fn(),
      findAllLocacoes: jest.fn(),
      findLocacaoId: jest.fn(),
      updateLocacao: jest.fn(),
      deleteLocacaoById: jest.fn(),
    } as unknown as jest.Mocked<LocacaoService>;

    controller = new LocacaoController(service);
  });

  it('deve criar locação via service', async () => {
    const dto: CreateLocacaoDto = {
      locacao_totalItens: 1,
    };
    const resposta = { locacao_id: 1 };
    service.createLocacao.mockResolvedValue(resposta as any);

    const result = await controller.create(dto);

    expect(service.createLocacao).toHaveBeenCalledWith(dto);
    expect(result).toBe(resposta);
  });

  it('deve retornar todas as locações', async () => {
    const lista = [{ locacao_id: 1 }];
    service.findAllLocacoes.mockResolvedValue(lista as any);

    const result = await controller.findAll();

    expect(service.findAllLocacoes).toHaveBeenCalled();
    expect(result).toBe(lista);
  });

  it('deve buscar locação por id convertendo parâmetro', async () => {
    const resposta = { mensagem: 'ok' };
    service.findLocacaoId.mockResolvedValue(resposta as any);

    const result = await controller.findOne('5');

    expect(service.findLocacaoId).toHaveBeenCalledWith(5);
    expect(result).toBe(resposta);
  });

  it('deve atualizar locação', async () => {
    const dto: UpdateLocacaoDto = { locacao_totalItens: 2 };
    const resposta = { mensagem: 'Atualizado' };
    service.updateLocacao.mockResolvedValue(resposta as any);

    const result = await controller.update('6', dto);

    expect(service.updateLocacao).toHaveBeenCalledWith(6, dto);
    expect(result).toBe(resposta);
  });

  it('deve remover locação', async () => {
    const resposta = { mensagem: 'Removida' };
    service.deleteLocacaoById.mockResolvedValue(resposta as any);

    const result = await controller.deleteLocacaoById('7' as any);

    expect(service.deleteLocacaoById).toHaveBeenCalledWith(7);
    expect(result).toBe(resposta);
  });
});
