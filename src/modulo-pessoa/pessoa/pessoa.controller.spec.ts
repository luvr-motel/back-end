import { Test, TestingModule } from '@nestjs/testing';
import { PessoaController } from './pessoa.controller';
import { PessoaService } from './pessoa.service';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { Pessoa } from './entities/pessoa.entity';

describe('PessoaController', () => {
  let controller: PessoaController;
  let service: jest.Mocked<PessoaService>;

  beforeEach(async () => {
    const serviceMock: jest.Mocked<PessoaService> = {
      createPessoa: jest.fn(),
      findAllPessoas: jest.fn(),
      findOnePessoa: jest.fn(),
      updatePessoa: jest.fn(),
      removePessoa: jest.fn(),
    } as unknown as jest.Mocked<PessoaService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PessoaController],
      providers: [{ provide: PessoaService, useValue: serviceMock }],
    }).compile();

    controller = module.get<PessoaController>(PessoaController);
    service = module.get(PessoaService) as jest.Mocked<PessoaService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve delegar createPessoa ao service', async () => {
    const dto: CreatePessoaDto = {
      pessoa_nome: 'Maria',
      pessoa_cpf: '12345678901',
      pessoa_telefone: '44999998888',
      pessoatipo_id: 1,
    } as any;

    const pessoa = { pessoa_id: 1, pessoa_nome: 'Maria' } as Pessoa;
    service.createPessoa.mockResolvedValue(pessoa);

    const result = await controller.createPessoa(dto);

    expect(service.createPessoa).toHaveBeenCalledWith(dto);
    expect(result).toEqual(pessoa);
  });

  it('deve delegar findAllPessoas ao service', async () => {
    const list = [{ pessoa_id: 1 } as Pessoa, { pessoa_id: 2 } as Pessoa];
    service.findAllPessoas.mockResolvedValue(list);

    const result = await controller.findAllPessoas();

    expect(service.findAllPessoas).toHaveBeenCalledTimes(1);
    expect(result).toEqual(list);
  });

  it('deve delegar findOnePessoa ao service', async () => {
    const payload = { mensagem: 'Pessoa #1', pessoa: { pessoa_id: 1 } as Pessoa };
    service.findOnePessoa.mockResolvedValue(payload);

    const result = await controller.findOnePessoa(1);

    expect(service.findOnePessoa).toHaveBeenCalledWith(1);
    expect(result).toEqual(payload);
  });

  it('deve delegar updatePessoa ao service', async () => {
    const dto: UpdatePessoaDto = { pessoa_nome: 'Novo' } as any;
    const payload = {
      mensagem: 'Pessoa #1 Atualizada com sucesso',
      pessoa: { pessoa_id: 1, pessoa_nome: 'Novo' } as Pessoa,
    };
    service.updatePessoa.mockResolvedValue(payload);

    const result = await controller.updatePessoa(1, dto);

    expect(service.updatePessoa).toHaveBeenCalledWith(1, dto);
    expect(result).toEqual(payload);
  });

  it('deve delegar removePessoa ao service', async () => {
    const payload = { mensagem: 'Pessoa 1 excluída com sucesso' };
    service.removePessoa.mockResolvedValue(payload);

    const result = await controller.removePessoa(1);

    expect(service.removePessoa).toHaveBeenCalledWith(1);
    expect(result).toEqual(payload);
  });

  it('createPessoa deve propagar erro do service', async () => {
    const dto: CreatePessoaDto = { pessoa_nome: 'X' } as any;
    const err = new Error('create failed');
    service.createPessoa.mockRejectedValue(err);

    await expect(controller.createPessoa(dto)).rejects.toBe(err);
    expect(service.createPessoa).toHaveBeenCalledWith(dto);
  });

  it('findAllPessoas deve propagar erro do service', async () => {
    const err = new Error('list failed');
    service.findAllPessoas.mockRejectedValue(err);

    await expect(controller.findAllPessoas()).rejects.toBe(err);
    expect(service.findAllPessoas).toHaveBeenCalledTimes(1);
  });

  it('findOnePessoa deve propagar erro do service', async () => {
    const err = new Error('findOne failed');
    service.findOnePessoa.mockRejectedValue(err);

    await expect(controller.findOnePessoa(123)).rejects.toBe(err);
    expect(service.findOnePessoa).toHaveBeenCalledWith(123);
  });

  it('updatePessoa deve propagar erro do service', async () => {
    const dto: UpdatePessoaDto = { pessoa_nome: 'Y' } as any;
    const err = new Error('update failed');
    service.updatePessoa.mockRejectedValue(err);

    await expect(controller.updatePessoa(9, dto)).rejects.toBe(err);
    expect(service.updatePessoa).toHaveBeenCalledWith(9, dto);
  });

  it('removePessoa deve propagar erro do service', async () => {
    const err = new Error('remove failed');
    service.removePessoa.mockRejectedValue(err);

    await expect(controller.removePessoa(7)).rejects.toBe(err);
    expect(service.removePessoa).toHaveBeenCalledWith(7);
  });
});
