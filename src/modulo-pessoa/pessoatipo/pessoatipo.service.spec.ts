import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { HttpException } from '@nestjs/common';
import { PessoaTipoService } from './pessoatipo.service';
import { PessoaTipo } from './entities/pessoatipo.entity';
import { CreatePessoaTipoDto } from './dto/create-pessoatipo.dto';
import { UpdatePessoaTipoDto } from './dto/update-pessoatipo.dto';

type RepoMock = Partial<jest.Mocked<Repository<PessoaTipo>>>;

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

describe('PessoaTipoService', () => {
  let service: PessoaTipoService;
  let repo: RepoMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PessoaTipoService,
        { provide: getRepositoryToken(PessoaTipo), useValue: createRepoMock() },
      ],
    }).compile();

    service = module.get(PessoaTipoService);
    repo = module.get(getRepositoryToken(PessoaTipo));
  });

  afterEach(() => jest.clearAllMocks());

  describe('createPessoaTipo', () => {
    it('cria usando a descrição do DTO e salva', async () => {
      const dto: CreatePessoaTipoDto = { pessoatipo_descricao: 'Funcionário' };
      const partial: DeepPartial<PessoaTipo> = { pessoatipo_descricao: 'Funcionário' };
      const salvo = { pessoatipo_id: 1, pessoatipo_descricao: 'Funcionário' } as PessoaTipo;

      (repo.create as jest.Mock).mockImplementation(p => p);
      (repo.save as jest.Mock).mockResolvedValue(salvo);

      const res = await service.createPessoaTipo(dto);

      expect(repo.create).toHaveBeenCalledWith(partial);
      expect(repo.save).toHaveBeenCalledWith(partial);
      expect(res).toEqual(salvo);
    });

    it('propaga erro do save', async () => {
      (repo.create as jest.Mock).mockImplementation(p => p);
      (repo.save as jest.Mock).mockRejectedValue(new Error('db fail'));

      await expect(service.createPessoaTipo({ pessoatipo_descricao: 'X' })).rejects.toThrow('db fail');
    });
  });

  describe('findAllPessoaTipos', () => {
    it('lista todos', async () => {
      const lista = [{ pessoatipo_id: 1 }, { pessoatipo_id: 2 }] as PessoaTipo[];
      (repo.find as jest.Mock).mockResolvedValue(lista);

      const res = await service.findAllPessoaTipos();

      expect(repo.find).toHaveBeenCalledTimes(1);
      expect(res).toEqual(lista);
    });
  });

  describe('findOnePessoaTipo', () => {
    it('retorna quando existe', async () => {
      const item = { pessoatipo_id: 5, pessoatipo_descricao: 'VIP' } as PessoaTipo;
      (repo.findOne as jest.Mock).mockResolvedValue(item);

      const res = await service.findOnePessoaTipo(5);

      expect(repo.findOne).toHaveBeenCalledWith({ where: { pessoatipo_id: 5 } });
      expect(res).toEqual({ mensagem: 'Tipo #5', pessoatipo: item });
    });

    it('404 quando não existe', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(null);
      await expect(service.findOnePessoaTipo(999)).rejects.toThrow(HttpException);
      await expect(service.findOnePessoaTipo(999)).rejects.toThrow('Tipo não encontrado');
    });
  });

  describe('updatePessoaTipo', () => {
    it('atualiza e retorna mensagem com entidade salva', async () => {
      const atual = { pessoatipo_id: 7, pessoatipo_descricao: 'Antigo' } as PessoaTipo;
      const dto: UpdatePessoaTipoDto = { pessoatipo_descricao: 'Novo' } as any;
      const merged = { pessoatipo_id: 7, pessoatipo_descricao: 'Novo' } as PessoaTipo;

      (repo.findOne as jest.Mock)
        .mockResolvedValueOnce(atual);
      (repo.merge as jest.Mock).mockImplementation((a, b) => ({ ...a, ...b }));
      (repo.save as jest.Mock).mockResolvedValue(merged);

      const res = await service.updatePessoaTipo(7, dto);

      expect(repo.findOne).toHaveBeenCalledWith({ where: { pessoatipo_id: 7 } });
      expect(repo.merge).toHaveBeenCalledWith(atual, dto);
      expect(repo.save).toHaveBeenCalledWith(merged);
      expect(res).toEqual({
        mensagem: 'Tipo #7 Atualizado com sucesso',
        pessoatipo: merged,
      });
    });

    it('404 quando não existe', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(null);
      await expect(service.updatePessoaTipo(1, {} as any)).rejects.toThrow(HttpException);
      await expect(service.updatePessoaTipo(1, {} as any)).rejects.toThrow('Erro ao atualizar tipo');
    });

    it('propaga erro do save', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue({ pessoatipo_id: 1 } as PessoaTipo);
      (repo.merge as jest.Mock).mockImplementation((a, b) => ({ ...a, ...b }));
      (repo.save as jest.Mock).mockRejectedValue(new Error('save fail'));
      await expect(service.updatePessoaTipo(1, { pessoatipo_descricao: 'X' } as any)).rejects.toThrow('save fail');
    });
  });

  describe('removePessoaTipo', () => {
    it('soft-deleta quando existe e retorna mensagem', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue({ pessoatipo_id: 9 } as PessoaTipo);
      (repo.softDelete as jest.Mock).mockResolvedValue({} as any);

      const res = await service.removePessoaTipo(9);

      expect(repo.findOne).toHaveBeenCalledWith({ where: { pessoatipo_id: 9 } });
      expect(repo.softDelete).toHaveBeenCalledWith(9);
      expect(res).toEqual({ mensagem: 'Tipo 9 excluido com sucesso' });
    });

    it('404 quando não existe', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(null);
      await expect(service.removePessoaTipo(2)).rejects.toThrow(HttpException);
      await expect(service.removePessoaTipo(2)).rejects.toThrow('Erro ao excluir tipo');
    });

    it('propaga erro do softDelete', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue({ pessoatipo_id: 10 } as PessoaTipo);
      (repo.softDelete as jest.Mock).mockRejectedValue(new Error('soft fail'));
      await expect(service.removePessoaTipo(10)).rejects.toThrow('soft fail');
    });

    it('não altera nada quando DTO está vazio (garante branch else)', async () => {
        const atual = { pessoatipo_id: 15, pessoatipo_descricao: 'Original' } as PessoaTipo;

      (repo.findOne as jest.Mock).mockResolvedValueOnce(atual); 

      (repo.merge as jest.Mock).mockImplementation((a, b) => ({ ...a, ...b }));
      (repo.save as jest.Mock).mockResolvedValue(atual);

      const dto = {} as UpdatePessoaTipoDto;
      const result = await service.updatePessoaTipo(15, dto);

      expect(repo.findOne).toHaveBeenCalledWith({ where: { pessoatipo_id: 15 } });
      expect(repo.merge).toHaveBeenCalledWith(atual, {});
      expect(repo.save).toHaveBeenCalledWith(atual);
      expect(result).toEqual({
     mensagem: 'Tipo #15 Atualizado com sucesso',
     pessoatipo: atual,
     });
    });
  });
});
