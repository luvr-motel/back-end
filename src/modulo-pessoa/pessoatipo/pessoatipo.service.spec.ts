// src/modulo-pessoa/pessoatipo/pessoatipo.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PessoaTipoService } from './pessoatipo.service';
import { PessoaTipo } from './entities/pessoatipo.entity';
import { CreatePessoaTipoDto } from './dto/create-pessoatipo.dto';
import { UpdatePessoaTipoDto } from './dto/update-pessoatipo.dto';

type RepoMock = jest.Mocked<Repository<PessoaTipo>>;

function createRepoMock(): RepoMock {
  return {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
    merge: jest.fn(),
  } as unknown as RepoMock;
}

function mockCreateSave(repo: RepoMock, saveReturn: any) {
  (repo.create as jest.Mock).mockImplementation((p) => p);
  (repo.save as jest.Mock).mockResolvedValue(saveReturn);
}

function getCreateArg(repo: RepoMock) {
  return (repo.create as jest.Mock).mock.calls[0][0];
}

describe('PessoaTipoService', () => {
  let service: PessoaTipoService;
  let repo: RepoMock;

  const tipoFake: PessoaTipo = { pessoatipo_id: 1, pessoatipo_descricao: 'Cliente' } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PessoaTipoService,
        { provide: getRepositoryToken(PessoaTipo), useValue: createRepoMock() },
      ],
    }).compile();

    service = module.get(PessoaTipoService);
    repo = module.get(getRepositoryToken(PessoaTipo));
    jest.clearAllMocks();
  });

  describe('createPessoaTipo', () => {
    it('cria e salva com descrição passada', async () => {
      const dto: CreatePessoaTipoDto = { pessoatipo_descricao: 'Cliente' } as any;
      (repo.create as jest.Mock).mockImplementation((p) => ({ ...p }));
      (repo.save as jest.Mock).mockResolvedValue({ pessoatipo_id: 10, ...dto });

      const res = await service.createPessoaTipo(dto);

      expect(repo.create).toHaveBeenCalledWith({ pessoatipo_descricao: 'Cliente' });
      expect(repo.save).toHaveBeenCalledWith({ pessoatipo_descricao: 'Cliente' });
      expect(res.pessoatipo_id).toBe(10);
    });

    it('propaga erro do save', async () => {
      (repo.create as jest.Mock).mockImplementation((p) => p);
      const boom = new Error('save failed');
      (repo.save as jest.Mock).mockRejectedValue(boom);

      await expect(service.createPessoaTipo({ pessoatipo_descricao: 'X' } as any)).rejects.toBe(boom);
    });

    it.each([
      { label: 'descrição vazia', dto: { pessoatipo_descricao: '' } as any },
      { label: 'descrição normal', dto: { pessoatipo_descricao: 'VIP' } as any },
    ])('não muta DTO (%s) e passa objeto para create', async ({ dto }) => {
      const dtoCopy = { ...dto };
      mockCreateSave(repo, { pessoatipo_id: 99, ...dto });

      await service.createPessoaTipo(dto);

      expect(getCreateArg(repo)).toEqual({ ...dto });
      expect(dto).toEqual(dtoCopy);
    });
  });

  describe('findAllPessoaTipos', () => {
    it('retorna lista', async () => {
      (repo.find as jest.Mock).mockResolvedValue([tipoFake]);
      const res = await service.findAllPessoaTipos();
      expect(res).toEqual([tipoFake]);
    });

    it('propaga erro de find', async () => {
      const boom = new Error('db find failed');
      (repo.find as jest.Mock).mockRejectedValue(boom);
      await expect(service.findAllPessoaTipos()).rejects.toBe(boom);
    });
  });

  describe('findOnePessoaTipo', () => {
    it('retorna quando existe', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(tipoFake);
      const res = await service.findOnePessoaTipo(1);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { pessoatipo_id: 1 } });
      expect(res).toEqual({ mensagem: 'Tipo #1', pessoatipo: tipoFake });
    });

    it('lança 404 quando não existe', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(null);
      await expect(service.findOnePessoaTipo(999)).rejects.toThrow(HttpException);
      await expect(service.findOnePessoaTipo(999)).rejects.toThrow('Tipo não encontrado');
    });
  });

  describe('updatePessoaTipo', () => {
    it('lança 404 se não existir', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(null);
      await expect(service.updatePessoaTipo(1, {} as any)).rejects.toThrow(HttpException);
      await expect(service.updatePessoaTipo(1, {} as any)).rejects.toThrow('Erro ao atualizar tipo');
    });

    it('atualiza quando existe', async () => {
      const atual = { ...tipoFake };
      const dto: UpdatePessoaTipoDto = { pessoatipo_descricao: 'VIP' } as any;

      (repo.findOne as jest.Mock)
        .mockResolvedValueOnce(atual); // busca inicial

      (repo.merge as jest.Mock).mockImplementation((a, b) => ({ ...a, ...b }));
      (repo.save as jest.Mock).mockResolvedValue({ ...atual, ...dto });

      const res = await service.updatePessoaTipo(1, dto);

      expect(repo.merge).toHaveBeenCalledWith(atual, dto);
      expect(repo.save).toHaveBeenCalledWith({ ...atual, ...dto });
      expect(res.mensagem).toBe('Tipo #1 Atualizado com sucesso');
      expect(res.pessoatipo.pessoatipo_descricao).toBe('VIP');
    });

    it('propaga erro do save', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(tipoFake);
      (repo.merge as jest.Mock).mockImplementation((a, b) => ({ ...a, ...b }));
      const boom = new Error('save failed');
      (repo.save as jest.Mock).mockRejectedValue(boom);

      await expect(service.updatePessoaTipo(1, { pessoatipo_descricao: 'Z' } as any)).rejects.toBe(boom);
    });
  });

  describe('removePessoaTipo', () => {
    it('lança 404 se não existir', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(null);
      await expect(service.removePessoaTipo(5)).rejects.toThrow(HttpException);
      await expect(service.removePessoaTipo(5)).rejects.toThrow('Erro ao excluir tipo');
    });

    it('remove com sucesso (softDelete chamado)', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(tipoFake);
      (repo.softDelete as jest.Mock).mockResolvedValue({} as any);

      const res = await service.removePessoaTipo(5);

      expect(repo.softDelete).toHaveBeenCalledWith(5);
      expect(res.mensagem).toBe('Tipo 5 excluido com sucesso');
    });

    it('propaga erro do softDelete', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(tipoFake);
      const boom = new Error('soft failed');
      (repo.softDelete as jest.Mock).mockRejectedValue(boom);

      await expect(service.removePessoaTipo(9)).rejects.toBe(boom);
    });
  });
});
