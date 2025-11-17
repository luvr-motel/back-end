import { LocacaoPosicaoController } from './locacao-posicao.controller';
import { LocacaoPosicaoService } from './locacao-posicao.service';
import { CreateLocacaoPosicaoDto } from './dto/create-locacao-posicao.dto';
import { UpdateLocacaoPosicaoDto } from './dto/update-locacao-posicao.dto';

describe('LocacaoPosicaoController', () => {
  let controller: LocacaoPosicaoController;
  let service: jest.Mocked<LocacaoPosicaoService>;

  beforeEach(() => {
    service = {
      createLocacaoPosicao: jest.fn(),
      findAllLocacaoPosicao: jest.fn(),
      findLocacaoPosicaoById: jest.fn(),
      updateLocacaoPosicaoById: jest.fn(),
      deleteLocacaoPosicaoById: jest.fn(),
    } as unknown as jest.Mocked<LocacaoPosicaoService>;

    controller = new LocacaoPosicaoController(service);
  });

  it('deve criar posição via service', async () => {
    const dto: CreateLocacaoPosicaoDto = { locacaoPosicao_descricao: 'Livre' };
    const resposta = { mensagem: 'ok' };
    service.createLocacaoPosicao.mockResolvedValue(resposta as any);

    const result = await controller.create(dto);

    expect(service.createLocacaoPosicao).toHaveBeenCalledWith(dto);
    expect(result).toBe(resposta);
  });

  it('deve listar posições', async () => {
    const lista = [{ locacaoPosicao_id: 1 }];
    service.findAllLocacaoPosicao.mockResolvedValue(lista as any);

    const result = await controller.findAll();

    expect(service.findAllLocacaoPosicao).toHaveBeenCalled();
    expect(result).toBe(lista);
  });

  it('deve buscar posição por id', async () => {
    const resposta = { mensagem: 'ok' };
    service.findLocacaoPosicaoById.mockResolvedValue(resposta as any);

    const result = await controller.findOne('5');

    expect(service.findLocacaoPosicaoById).toHaveBeenCalledWith(5);
    expect(result).toBe(resposta);
  });

  it('deve atualizar posição', async () => {
    const dto: UpdateLocacaoPosicaoDto = { locacaoPosicao_descricao: 'Atualizada' };
    const resposta = { mensagem: 'Atualizada' };
    service.updateLocacaoPosicaoById.mockResolvedValue(resposta as any);

    const result = await controller.update('6', dto);

    expect(service.updateLocacaoPosicaoById).toHaveBeenCalledWith(6, dto);
    expect(result).toBe(resposta);
  });

  it('deve remover posição', async () => {
    const resposta = { mensagem: 'Removida' };
    service.deleteLocacaoPosicaoById.mockResolvedValue(resposta as any);

    const result = await controller.deleteLocacaoPosicaoById('7');

    expect(service.deleteLocacaoPosicaoById).toHaveBeenCalledWith(7);
    expect(result).toBe(resposta);
  });
});
