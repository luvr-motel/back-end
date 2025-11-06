import { Test, TestingModule } from '@nestjs/testing';
import { PessoaTipoController } from './pessoatipo.controller';
import { PessoaTipoService } from './pessoatipo.service';
import { CreatePessoaTipoDto } from './dto/create-pessoatipo.dto';
import { UpdatePessoaTipoDto } from './dto/update-pessoatipo.dto';
import { PessoaTipo } from './entities/pessoatipo.entity';

describe('PessoaTipoController', () => {
  let controller: PessoaTipoController;
  let service: jest.Mocked<PessoaTipoService>;

  beforeEach(async () => {
    const serviceMock: jest.Mocked<PessoaTipoService> = {
      createPessoaTipo: jest.fn(),
      findAllPessoaTipos: jest.fn(),
      findOnePessoaTipo: jest.fn(),
      updatePessoaTipo: jest.fn(),
      removePessoaTipo: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PessoaTipoController],
      providers: [{ provide: PessoaTipoService, useValue: serviceMock }],
    }).compile();

    controller = module.get<PessoaTipoController>(PessoaTipoController);
    service = module.get(PessoaTipoService) as jest.Mocked<PessoaTipoService>;
  });

  afterEach(() => jest.clearAllMocks());

  it('POST /pessoatipo -> createPessoaTipo', async () => {
    const dto: CreatePessoaTipoDto = { pessoatipo_descricao: 'Funcionário' };
    const esperado = { pessoatipo_id: 1, pessoatipo_descricao: 'Funcionário' } as PessoaTipo;

    service.createPessoaTipo.mockResolvedValue(esperado);
    const res = await controller.createPessoaTipo(dto);

    expect(service.createPessoaTipo).toHaveBeenCalledWith(dto);
    expect(res).toEqual(esperado);
  });

  it('GET /pessoatipo -> findAllPessoaTipos', async () => {
    const lista = [{ pessoatipo_id: 1 } as PessoaTipo, { pessoatipo_id: 2 } as PessoaTipo];
    service.findAllPessoaTipos.mockResolvedValue(lista);

    const res = await controller.findAllPessoaTipos();

    expect(service.findAllPessoaTipos).toHaveBeenCalledTimes(1);
    expect(res).toEqual(lista);
  });

  it('GET /pessoatipo/:id -> findOnePessoaTipo', async () => {
    const payload = { mensagem: 'Tipo #3', pessoatipo: { pessoatipo_id: 3 } as PessoaTipo };
    service.findOnePessoaTipo.mockResolvedValue(payload);

    const res = await controller.findOnePessoaTipo(3);

    expect(service.findOnePessoaTipo).toHaveBeenCalledWith(3);
    expect(res).toEqual(payload);
  });

  it('PATCH /pessoatipo/:id -> updatePessoaTipo', async () => {
    const dto: UpdatePessoaTipoDto = { pessoatipo_descricao: 'VIP' } as any;
    const payload = {
      mensagem: 'Tipo #2 Atualizado com sucesso',
      pessoatipo: { pessoatipo_id: 2, pessoatipo_descricao: 'VIP' } as PessoaTipo,
    };
    service.updatePessoaTipo.mockResolvedValue(payload);

    const res = await controller.updatePessoaTipo(2, dto);

    expect(service.updatePessoaTipo).toHaveBeenCalledWith(2, dto);
    expect(res).toEqual(payload);
  });

  it('DELETE /pessoatipo/:id -> removePessoaTipo', async () => {
    const payload = { mensagem: 'Tipo 9 excluido com sucesso' };
    service.removePessoaTipo.mockResolvedValue(payload);

    const res = await controller.removePessoaTipo(9);

    expect(service.removePessoaTipo).toHaveBeenCalledWith(9);
    expect(res).toEqual(payload);
  });

  it('propaga erros do service', async () => {
    const err = new Error('boom');
    service.findAllPessoaTipos.mockRejectedValue(err);
    await expect(controller.findAllPessoaTipos()).rejects.toBe(err);
  });
});
