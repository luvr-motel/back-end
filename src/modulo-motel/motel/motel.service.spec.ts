import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, HttpException, NotFoundException } from '@nestjs/common';
import { Repository, IsNull, Not } from 'typeorm';
import { MotelService } from './motel.service';
import { Motel } from './entities/motel.entity';
import { CreateMotelDto } from './dto/create-motel.dto';
import { UpdateMotelDto } from './dto/update-motel.dto';
import { Status } from './common/enums/status.enum';

type RepoMock = Partial<jest.Mocked<Repository<Motel>>>;

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

describe('MotelService', () => {
  let service: MotelService;
  let repo: RepoMock;

  const existing: Motel = {
    motel_id: 1,
    motelDescricao: 'LUVR Motel Centro',
    motelEndereco: 'Av. Brasil, 1000 - Centro',
    motelEmail: 'contato@motel.com.br',
    motelCnpj: '12.345.678/0001-99',
    motelAtivo: Status.ATIVO,
    motelExclusao: null,
  } as unknown as Motel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MotelService,
        { provide: getRepositoryToken(Motel), useValue: createRepoMock() },
      ],
    }).compile();

    service = module.get<MotelService>(MotelService);
    repo = module.get(getRepositoryToken(Motel));
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('createMotel', () => {
    it('cria com sucesso quando CNPJ não existe e aplica Status padrão ATIVO', async () => {
      const dto: CreateMotelDto = {
        motel_descricao: 'Novo Motel',
        motel_endereco: 'Rua X, 123',
        motel_email: 'novo@motel.com',
        motel_cnpj: '00.000.000/0001-00',
        // motel_ativo não enviado, deve ir como ATIVO
        motel_ativo: undefined as unknown as Status,
      };

      (repo.findOne as jest.Mock).mockResolvedValue(null);
      (repo.create as jest.Mock).mockImplementation((entity) => entity);
      (repo.save as jest.Mock).mockImplementation(async (entity) => ({
        motel_id: 2,
        ...entity,
      }));

      const result = await service.createMotel(dto);
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { motelCnpj: dto.motel_cnpj, motelExclusao: IsNull() },
      });
      expect(repo.create).toHaveBeenCalledWith({
        motelDescricao: dto.motel_descricao,
        motelEndereco: dto.motel_endereco,
        motelEmail: dto.motel_email,
        motelCnpj: dto.motel_cnpj,
        motelAtivo: Status.ATIVO,
      });
      expect(result.motel_id).toBe(2);
      expect(result.motelAtivo).toBe(Status.ATIVO);
    });

    it('cria usando motel_ativo enviado (sem fallback)', async () => {
      const dto: CreateMotelDto = {
        motel_descricao: 'Com Status',
        motel_endereco: 'Rua A, 10',
        motel_email: 'a@motel.com',
        motel_cnpj: '55.555.555/0001-55',
        motel_ativo: Status.INATIVO,
      };

      (repo.findOne as jest.Mock).mockResolvedValue(null);
      (repo.create as jest.Mock).mockImplementation((e) => e);
      (repo.save as jest.Mock).mockImplementation(async (e) => ({ motel_id: 3, ...e }));

      const res = await service.createMotel(dto);
      expect(res.motelAtivo).toBe(Status.INATIVO);
    });

    it('lança BadRequestException quando CNPJ já cadastrado', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(existing);
      await expect(
        service.createMotel({
          motel_descricao: 'Duplicado',
          motel_endereco: 'Rua Y, 1',
          motel_email: 'dup@motel.com',
          motel_cnpj: existing.motelCnpj,
          motel_ativo: Status.ATIVO,
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('lança HttpException quando repo.create retornar falsy', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(null);
      (repo.create as jest.Mock).mockReturnValue(undefined);
      await expect(
        service.createMotel({
          motel_descricao: 'Sem create',
          motel_endereco: 'Rua Z, 9',
          motel_email: 'z@motel.com',
          motel_cnpj: '11.111.111/1111-11',
          motel_ativo: Status.ATIVO,
        }),
      ).rejects.toBeInstanceOf(HttpException);
    });
  });

  describe('findAllMoteis', () => {
    it('retorna somente não excluídos em ordem crescente por motel_id', async () => {
      (repo.find as jest.Mock).mockResolvedValue([existing]);
      const result = await service.findAllMoteis();
      expect(repo.find).toHaveBeenCalledWith({
        where: { motelExclusao: IsNull() },
        order: { motel_id: 'ASC' },
      });
      expect(result).toHaveLength(1);
    });
  });

  describe('findOneMotel', () => {
    it('retorna quando encontrado', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(existing);
      const res = await service.findOneMotel(1);
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { motel_id: 1, motelExclusao: IsNull() },
      });
      expect(res).toEqual(existing);
    });

    it('lança NotFoundException quando não encontrado', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(null);
      await expect(service.findOneMotel(999)).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('updateMotel', () => {
    it('atualiza descrição, endereço, email e status', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(existing);
      (repo.save as jest.Mock).mockImplementation(async (entity) => entity);

      const dto: UpdateMotelDto = {
        motel_descricao: 'Atualizado',
        motel_endereco: 'Nova Rua, 55',
        motel_email: 'novo@email.com',
        motel_ativo: Status.INATIVO,
      } as any;

      const res = await service.updateMotel(1, dto);
      expect(res.motelDescricao).toBe('Atualizado');
      expect(res.motelEndereco).toBe('Nova Rua, 55');
      expect(res.motelEmail).toBe('novo@email.com');
      expect(res.motelAtivo).toBe(Status.INATIVO);
      expect(repo.save).toHaveBeenCalled();
    });

    it('valida CNPJ duplicado ao atualizar e lança BadRequestException', async () => {
      (repo.findOne as jest.Mock)
        .mockResolvedValueOnce(existing) // findOneMotel(id)
        .mockResolvedValueOnce({ ...existing, motel_id: 2 }); // exists com outro id

      const dto: UpdateMotelDto = { motel_cnpj: '22.222.222/2222-22' } as any;

      await expect(service.updateMotel(1, dto)).rejects.toBeInstanceOf(BadRequestException);
      expect(repo.findOne).toHaveBeenNthCalledWith(2, {
        where: {
          motelCnpj: '22.222.222/2222-22',
          motelExclusao: IsNull(),
          motel_id: Not(1),
        },
      });
    });

    it('não valida duplicidade quando CNPJ não mudou', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(existing);
      (repo.save as jest.Mock).mockImplementation(async (e) => e);

      const dto: UpdateMotelDto = { motel_cnpj: existing.motelCnpj } as any;

      const res = await service.updateMotel(1, dto);
      expect(res.motelCnpj).toBe(existing.motelCnpj);
      expect((repo.findOne as jest.Mock).mock.calls.length).toBe(1);
    });

    it('não altera campos quando não enviados (undefined)', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue({ ...existing });
      (repo.save as jest.Mock).mockImplementation(async (e) => e);

      const before = { ...existing };
      const res = await service.updateMotel(1, {} as any);

      expect(res.motelDescricao).toBe(before.motelDescricao);
      expect(res.motelEndereco).toBe(before.motelEndereco);
      expect(res.motelEmail).toBe(before.motelEmail);
      expect(res.motelAtivo).toBe(before.motelAtivo);
    });

    it('define campos como null quando enviados null', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue({ ...existing });
      (repo.save as jest.Mock).mockImplementation(async (e) => e);

      const dto: UpdateMotelDto = {
        motel_descricao: null,
        motel_endereco: null,
        motel_email: null,
      } as any;

      const res = await service.updateMotel(1, dto);
      expect(res.motelDescricao).toBeNull();
      expect(res.motelEndereco).toBeNull();
      expect(res.motelEmail).toBeNull();
    });
  });

  describe('deleteMotel', () => {
    it('soft delete quando encontrado e retorna mensagem', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(existing);
      (repo.softDelete as jest.Mock).mockResolvedValue({ affected: 1 });

      const res = await service.deleteMotel(1);
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { motel_id: 1, motelExclusao: IsNull() },
      });
      expect(repo.softDelete).toHaveBeenCalledWith(1);
      expect(res).toEqual({ mensagem: 'Motel 1 excluído com sucesso' });
    });

    it('lança HttpException quando não encontrado', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(null);
      await expect(service.deleteMotel(999)).rejects.toBeInstanceOf(HttpException);
    });
  });
});
