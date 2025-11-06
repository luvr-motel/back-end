import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException } from '@nestjs/common';
import { Repository, DeepPartial } from 'typeorm';
import { PessoaService } from './pessoa.service';
import { Pessoa } from './entities/pessoa.entity';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';

type RepoMock = Partial<jest.Mocked<Repository<Pessoa>>>;

function createRepoMock(): RepoMock {
  return {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
    merge: jest.fn(),
  };
}

describe('PessoaService', () => {
  let service: PessoaService;
  let repo: RepoMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PessoaService,
        { provide: getRepositoryToken(Pessoa), useValue: createRepoMock() },
      ],
    }).compile();

    service = module.get<PessoaService>(PessoaService);
    repo = module.get<RepoMock>(getRepositoryToken(Pessoa));
  });

  afterEach(() => jest.clearAllMocks());

  describe('createPessoa', () => {
    it('deve criar e salvar uma pessoa com os dados mínimos', async () => {
      const dto: CreatePessoaDto = {
        pessoa_nome: '  Maria da Silva  ',
        pessoa_cpf: '12345678901',
        pessoa_telefone: '44999998888',
        pessoatipo_id: 1,
      } as any;

      const partial: DeepPartial<Pessoa> = {
        pessoa_nome: 'Maria da Silva',
        pessoa_cpf: '12345678901',
        pessoa_telefone: '44999998888',
        pessoatipo: { pessoatipo_id: 1 } as any,
      };

      const entity: Pessoa = { pessoa_id: 1, ...partial } as any;

      repo.create!.mockReturnValue(entity);
      repo.save!.mockResolvedValue({ ...entity, pessoa_id: 1 });

      const result = await service.createPessoa(dto);

      expect(repo.create).toHaveBeenCalledWith(partial);
      expect(repo.save).toHaveBeenCalledWith(entity);
      expect(result).toEqual({ ...entity, pessoa_id: 1 });
    });

    it('createPessoa: nome só com espaços vira string vazia após trim', async () => {
      (repo.create as jest.Mock).mockImplementation(p => p);
      (repo.save as jest.Mock).mockResolvedValue({ pessoa_id: 101, pessoa_nome: '' });

      const result = await service.createPessoa({ pessoa_nome: '   ' } as any);

      expect(repo.create).toHaveBeenCalledWith({ pessoa_nome: '' });
      expect(result.pessoa_id).toBe(101);
    });

    it('createPessoa: inclui cpf/telefone quando são string vazia (≠ undefined)', async () => {
      (repo.create as jest.Mock).mockImplementation(p => p);
      (repo.save as jest.Mock).mockResolvedValue({
        pessoa_id: 102, pessoa_nome: 'Ana', pessoa_cpf: '', pessoa_telefone: ''
      });

      await service.createPessoa({ pessoa_nome: 'Ana', pessoa_cpf: '', pessoa_telefone: '' } as any);

      const partial = (repo.create as jest.Mock).mock.calls[0][0];
      expect(partial).toEqual({ pessoa_nome: 'Ana', pessoa_cpf: '', pessoa_telefone: '' });
    });


    it('createPessoa: considera cpf/telefone definidos como string vazia (≠ undefined)', async () => {
      const dto = { pessoa_nome: 'Ana', pessoa_cpf: '', pessoa_telefone: '' } as any;

      (repo.create as jest.Mock).mockImplementation(p => p);
      (repo.save as jest.Mock).mockResolvedValue({ pessoa_id: 42, ...dto });

      const result = await service.createPessoa(dto);

      expect(repo.create).toHaveBeenCalledWith({
        pessoa_nome: 'Ana',
        pessoa_cpf: '',        
        pessoa_telefone: '',
      });
      expect(result.pessoa_id).toBe(42);
    });


    it('não deve mutar o DTO original e ignora campos ausentes', async () => {
      const dto: CreatePessoaDto = { pessoa_nome: '  Maria ' } as any;
      const dtoCopia = { ...dto };

      const entityCriada = { pessoa_id: 100, pessoa_nome: 'Maria' } as Pessoa;
      (repo.create as jest.Mock).mockReturnValue(entityCriada);
      (repo.save as jest.Mock).mockResolvedValue(entityCriada);

      const result = await service.createPessoa(dto);

      expect(result).toEqual(entityCriada);
      expect(dto).toEqual(dtoCopia); // não mutou o DTO
      const chamada = (repo.create as jest.Mock).mock.calls[0][0];
      expect(chamada).toEqual({ pessoa_nome: 'Maria' });
    });

    it('deve mapear pessoatipo_id para pessoatipo corretamente', async () => {
      const dto = { pessoa_nome: 'Ana', pessoatipo_id: 7 } as CreatePessoaDto;

      const partialEsperado: DeepPartial<Pessoa> = {
        pessoa_nome: 'Ana',
        pessoatipo: { pessoatipo_id: 7 } as any,
      };
      const entity = { pessoa_id: 1, ...partialEsperado } as Pessoa;

      (repo.create as jest.Mock).mockReturnValue(entity);
      (repo.save as jest.Mock).mockResolvedValue(entity);

      const result = await service.createPessoa(dto);

      expect(repo.create).toHaveBeenCalledWith(partialEsperado);
      expect(repo.save).toHaveBeenCalledWith(entity);
      expect(result).toEqual(entity);
    });

    it('deve propagar erro do repo.save', async () => {
      const dto: CreatePessoaDto = { pessoa_nome: 'Ana' } as any;

      (repo.create as jest.Mock).mockReturnValue({ pessoa_nome: 'Ana' } as any);
      const boom = new Error('DB down');
      (repo.save as jest.Mock).mockRejectedValue(boom);

      await expect(service.createPessoa(dto)).rejects.toBe(boom);
    });

    it('nome com apenas espaços vira string vazia após trim', async () => {
      const dto = { pessoa_nome: '   ' } as CreatePessoaDto;
      const salvo = { pessoa_id: 1, pessoa_nome: '' } as Pessoa;

      (repo.create as jest.Mock).mockImplementation((p) => p);
      (repo.save as jest.Mock).mockResolvedValue(salvo);

      const result = await service.createPessoa(dto);
      expect(repo.create).toHaveBeenCalledWith({ pessoa_nome: '' });
      expect(result).toEqual(salvo);
    });

    it('ignora cpf/telefone indefinidos no partial', async () => {
      const dto = { pessoa_nome: 'Ana' } as CreatePessoaDto;

      (repo.create as jest.Mock).mockImplementation((p) => p);
      (repo.save as jest.Mock).mockResolvedValue({ pessoa_id: 2, pessoa_nome: 'Ana' });

      await service.createPessoa(dto);
      const partial = (repo.create as jest.Mock).mock.calls[0][0];
      expect(partial).toEqual({ pessoa_nome: 'Ana' });
      expect('pessoa_cpf' in partial).toBe(false);
      expect('pessoa_telefone' in partial).toBe(false);
    });
  });

  describe('findAllPessoas', () => {
    it('deve retornar lista de pessoas', async () => {
      const list = [{ pessoa_id: 1 } as Pessoa, { pessoa_id: 2 } as Pessoa];
      repo.find!.mockResolvedValue(list);

      const result = await service.findAllPessoas();
      expect(repo.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual(list);
    });

    it('deve retornar array vazio quando não houver registros', async () => {
      (repo.find as jest.Mock).mockResolvedValue([]);
      const result = await service.findAllPessoas();
      expect(result).toEqual([]);
    });
  });

  describe('findOnePessoa', () => {
    it('deve retornar pessoa quando existir', async () => {
      const pessoa = { pessoa_id: 10 } as Pessoa;
      repo.findOne!.mockResolvedValue(pessoa);

      const result = await service.findOnePessoa(10);

      expect(repo.findOne).toHaveBeenCalledWith({
        where: { pessoa_id: 10 },
        relations: { pessoatipo: true },
      });
      expect(result).toEqual({ mensagem: 'Pessoa #10', pessoa });
    });

    it('deve lançar 404 quando não existir (null)', async () => {
      repo.findOne!.mockResolvedValue(null);
      await expect(service.findOnePessoa(999)).rejects.toThrow(HttpException);
      await expect(service.findOnePessoa(999)).rejects.toThrow('Pessoa não encontrada');
    });

    it('deve lançar 404 quando não existir (undefined)', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(undefined);
      await expect(service.findOnePessoa(321)).rejects.toThrow(HttpException);
      await expect(service.findOnePessoa(321)).rejects.toThrow('Pessoa não encontrada');
    });
  });

  describe('updatePessoa', () => {
    it('deve atualizar quando existir', async () => {
      const atual = {
        pessoa_id: 5,
        pessoa_nome: 'Antigo',
        pessoa_cpf: '000',
        pessoa_telefone: '111',
      } as Pessoa;

      const dto: UpdatePessoaDto = {
        pessoa_nome: '  Novo Nome ',
        pessoa_cpf: '222',
        pessoa_telefone: '333',
        pessoatipo_id: 2,
      } as any;

      const merged = {
        ...atual,
        pessoa_nome: 'Novo Nome',
        pessoa_cpf: '222',
        pessoa_telefone: '333',
        pessoatipo: { pessoatipo_id: 2 } as any,
      } as Pessoa;

      repo.findOne!.mockResolvedValueOnce(atual);
      repo.merge!.mockReturnValue(merged);
      repo.save!.mockResolvedValue(merged);
      repo.findOne!.mockResolvedValueOnce(merged);

      const result = await service.updatePessoa(5, dto);

      expect(repo.findOne).toHaveBeenNthCalledWith(1, { where: { pessoa_id: 5 } });
      expect(repo.merge).toHaveBeenCalledWith(atual, {
        pessoa_nome: 'Novo Nome',
        pessoa_cpf: '222',
        pessoa_telefone: '333',
        pessoatipo: { pessoatipo_id: 2 },
      });
      expect(repo.save).toHaveBeenCalledWith(merged);
      expect(repo.findOne).toHaveBeenNthCalledWith(2, {
        where: { pessoa_id: 5 },
        relations: { pessoatipo: true },
      });
      expect(result).toEqual({
        mensagem: 'Pessoa #5 Atualizada com sucesso',
        pessoa: merged,
      });
    });

    it('deve aplicar trim em pessoa_nome', async () => {
      const atual = { pessoa_id: 3, pessoa_nome: 'Antigo' } as Pessoa;

      (repo.findOne as jest.Mock)
        .mockResolvedValueOnce(atual)
        .mockResolvedValueOnce({ pessoa_id: 3, pessoa_nome: 'Novo Nome' } as Pessoa);

      (repo.merge as jest.Mock).mockImplementation((a, b) => ({ ...a, ...b }));
      (repo.save as jest.Mock).mockResolvedValue({ pessoa_id: 3, pessoa_nome: 'Novo Nome' });

      const dto = { pessoa_nome: '  Novo Nome  ' } as UpdatePessoaDto;
      const result = await service.updatePessoa(3, dto);

      expect(repo.merge).toHaveBeenCalledWith(atual, { pessoa_nome: 'Novo Nome' });
      expect(result.mensagem).toContain('#3');
      expect(result.pessoa.pessoa_nome).toBe('Novo Nome');
    });

    it('deve atualizar apenas campos presentes no DTO (sem undefined)', async () => {
      const atual = {
        pessoa_id: 11,
        pessoa_nome: 'Nome',
        pessoa_cpf: '111',
        pessoa_telefone: '222',
        pessoatipo: { pessoatipo_id: 1 } as any,
      } as Pessoa;

      (repo.findOne as jest.Mock)
        .mockResolvedValueOnce(atual)
        .mockResolvedValueOnce(atual);

      (repo.merge as jest.Mock).mockImplementation((a, b) => ({ ...a, ...b }));
      (repo.save as jest.Mock).mockResolvedValue(atual);

      const dto = { pessoa_cpf: '999' } as UpdatePessoaDto;
      await service.updatePessoa(11, dto);

      expect(repo.merge).toHaveBeenCalledWith(atual, { pessoa_cpf: '999' });
    });

    it('DTO vazio não deve alterar campos', async () => {
      const atual = {
        pessoa_id: 55,
        pessoa_nome: 'Nome',
        pessoa_cpf: '111',
        pessoa_telefone: '222',
        pessoatipo: { pessoatipo_id: 9 } as any,
      } as Pessoa;

      (repo.findOne as jest.Mock)
        .mockResolvedValueOnce(atual)
        .mockResolvedValueOnce(atual);

      (repo.merge as jest.Mock).mockImplementation((a, b) => ({ ...a, ...b }));
      (repo.save as jest.Mock).mockResolvedValue(atual);

      const dto = {} as UpdatePessoaDto;
      const result = await service.updatePessoa(55, dto);

      expect(repo.merge).toHaveBeenCalledWith(atual, {});
      expect(result.pessoa).toEqual(atual);
    });

    it('deve lançar 404 quando não existir', async () => {
      repo.findOne!.mockResolvedValue(null);
      await expect(service.updatePessoa(123, {} as any)).rejects.toThrow(HttpException);
      await expect(service.updatePessoa(123, {} as any)).rejects.toThrow('Erro ao atualizar pessoa');
    });

    it('mapeia apenas pessoatipo_id quando é o único campo enviado', async () => {
      const atual = { pessoa_id: 20, pessoa_nome: 'Nome' } as Pessoa;

      (repo.findOne as jest.Mock)
        .mockResolvedValueOnce(atual)
        .mockResolvedValueOnce({ pessoa_id: 20, pessoa_nome: 'Nome', pessoatipo: { pessoatipo_id: 4 } } as any);

      (repo.merge as jest.Mock).mockImplementation((a, b) => ({ ...a, ...b }));
      (repo.save as jest.Mock).mockResolvedValue({ pessoa_id: 20, pessoa_nome: 'Nome', pessoatipo: { pessoatipo_id: 4 } });

      const dto = { pessoatipo_id: 4 } as UpdatePessoaDto;
      const result = await service.updatePessoa(20, dto);

      expect(repo.merge).toHaveBeenCalledWith(atual, { pessoatipo: { pessoatipo_id: 4 } });
      expect(result.pessoa).toEqual({ pessoa_id: 20, pessoa_nome: 'Nome', pessoatipo: { pessoatipo_id: 4 } });
    });

    it('caso extremo: pós-save findOne retorna null (retorna mensagem com pessoa null)', async () => {
      const atual = { pessoa_id: 77, pessoa_nome: 'Nome' } as Pessoa;

      (repo.findOne as jest.Mock)
        .mockResolvedValueOnce(atual) 
        .mockResolvedValueOnce(null); 

      (repo.merge as jest.Mock).mockImplementation((a, b) => ({ ...a, ...b }));
      (repo.save as jest.Mock).mockResolvedValue({ pessoa_id: 77, pessoa_nome: 'Nome' });

      const dto = {} as UpdatePessoaDto;
      const result = await service.updatePessoa(77, dto);

      expect(result.mensagem).toBe('Pessoa #77 Atualizada com sucesso');
      expect(result.pessoa).toBeNull();
    });
  });

  describe('removePessoa', () => {
    it('deve inativar e fazer soft delete quando existir', async () => {
      repo.findOne!.mockResolvedValue({ pessoa_id: 7 } as Pessoa);
      repo.update!.mockResolvedValue({} as any);
      repo.softDelete!.mockResolvedValue({} as any);

      const result = await service.removePessoa(7);

      expect(repo.findOne).toHaveBeenCalledWith({ where: { pessoa_id: 7 } });
      expect(repo.update).toHaveBeenCalledWith(7, { pessoa_ativo: false });
      expect(repo.softDelete).toHaveBeenCalledWith(7);
      expect(result).toEqual({ mensagem: 'Pessoa 7 excluída com sucesso' });
    });

    it('deve lançar 404 quando não existir', async () => {
      repo.findOne!.mockResolvedValue(null);
      await expect(service.removePessoa(999)).rejects.toThrow(HttpException);
      await expect(service.removePessoa(999)).rejects.toThrow('Erro ao excluir pessoa');
    });

    it('deve chamar update antes de softDelete (ordem)', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue({ pessoa_id: 7 } as Pessoa);
      (repo.update as jest.Mock).mockResolvedValue({} as any);
      (repo.softDelete as jest.Mock).mockResolvedValue({} as any);

      await service.removePessoa(7);

      const orderUpdate = (repo.update as jest.Mock).mock.invocationCallOrder[0];
      const orderSoft = (repo.softDelete as jest.Mock).mock.invocationCallOrder[0];
      expect(orderUpdate).toBeLessThan(orderSoft);
    });

    it('deve propagar erro do repo.update', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue({ pessoa_id: 8 } as Pessoa);
      const boom = new Error('update failed');
      (repo.update as jest.Mock).mockRejectedValue(boom);

      await expect(service.removePessoa(8)).rejects.toBe(boom);
    });

    it('deve propagar erro do repo.softDelete', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue({ pessoa_id: 8 } as Pessoa);
      (repo.update as jest.Mock).mockResolvedValue({} as any);
      const boom = new Error('soft delete failed');
      (repo.softDelete as jest.Mock).mockRejectedValue(boom);

      await expect(service.removePessoa(8)).rejects.toBe(boom);
    });
  });
});
