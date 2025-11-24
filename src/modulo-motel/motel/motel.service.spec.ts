import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, HttpException, NotFoundException } from '@nestjs/common';
import { Repository, IsNull, Not } from 'typeorm';
import { MotelService } from './motel.service';
import { Motel, MotelStatus as Status } from './entities/motel.entity';
import { CreateMotelDto } from './dto/create-motel.dto';
import { UpdateMotelDto } from './dto/update-motel.dto';

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

  const existing = {
    motel_id: 1,
    motel_descricao: 'LUVR Motel Centro',
    motel_endereco: 'Av. Brasil, 1000 - Centro',
    motel_email: 'contato@motel.com.br',
    motel_cnpj: '12.345.678/0001-99',
    motel_ativo: Status.ATIVO,
    motel_inclusao: new Date(),
    motel_exclusao: null,
    locacoes: [],
    comandas: [],
    recebimento: [],
    quartos: [],
    despesaquartos: [],
    despesas: [],
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
        // motel_ativo não enviado, deve cair no default ATIVO
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
        where: { motel_cnpj: dto.motel_cnpj, motel_exclusao: IsNull() },
      });
      expect(repo.create).toHaveBeenCalledWith({
        motel_descricao: dto.motel_descricao ?? null,
        motel_endereco: dto.motel_endereco ?? null,
        motel_email: dto.motel_email ?? null,
        motel_cnpj: dto.motel_cnpj,
        motel_ativo: Status.ATIVO,
      });
      expect(result.motel_id).toBe(2);
      expect(result.motel_ativo).toBe(Status.ATIVO);
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
      (repo.save as jest.Mock).mockImplementation(async (e) => ({
        motel_id: 3,
        ...e,
      }));

      const res = await service.createMotel(dto);
      expect(res.motel_ativo).toBe(Status.INATIVO);
    });

    it('lança BadRequestException quando CNPJ já cadastrado', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(existing);
      await expect(
        service.createMotel({
          motel_descricao: 'Duplicado',
          motel_endereco: 'Rua Y, 1',
          motel_email: 'dup@motel.com',
          motel_cnpj: existing.motel_cnpj,
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
        where: { motel_exclusao: IsNull() },
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
        where: { motel_id: 1, motel_exclusao: IsNull() },
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
      expect(res.motel_descricao).toBe('Atualizado');
      expect(res.motel_endereco).toBe('Nova Rua, 55');
      expect(res.motel_email).toBe('novo@email.com');
      expect(res.motel_ativo).toBe(Status.INATIVO);
      expect(repo.save).toHaveBeenCalled();
    });

    it('valida CNPJ duplicado ao atualizar e lança BadRequestException', async () => {
      (repo.findOne as jest.Mock)
        .mockResolvedValueOnce(existing)
        .mockResolvedValueOnce({ ...existing, motel_id: 2 });

      const dto: UpdateMotelDto = { motel_cnpj: '22.222.222/2222-22' } as any;

      await expect(service.updateMotel(1, dto)).rejects.toBeInstanceOf(BadRequestException);
      expect(repo.findOne).toHaveBeenNthCalledWith(2, {
        where: {
          motel_cnpj: '22.222.222/2222-22',
          motel_exclusao: IsNull(),
          motel_id: Not(1),
        },
      });
    });

    it('não valida duplicidade quando CNPJ não mudou', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(existing);
      (repo.save as jest.Mock).mockImplementation(async (e) => e);

      const dto: UpdateMotelDto = { motel_cnpj: existing.motel_cnpj } as any;

      const res = await service.updateMotel(1, dto);
      expect(res.motel_cnpj).toBe(existing.motel_cnpj);
      // só a chamada do findOneMotel
      expect((repo.findOne as jest.Mock).mock.calls.length).toBe(1);
    });

    it('não altera campos quando não enviados (undefined)', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue({ ...existing });
      (repo.save as jest.Mock).mockImplementation(async (e) => e);

      const before = { ...existing };
      const res = await service.updateMotel(1, {} as any);

      expect(res.motel_descricao).toBe(before.motel_descricao);
      expect(res.motel_endereco).toBe(before.motel_endereco);
      expect(res.motel_email).toBe(before.motel_email);
      expect(res.motel_ativo).toBe(before.motel_ativo);
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
      expect(res.motel_descricao).toBeNull();
      expect(res.motel_endereco).toBeNull();
      expect(res.motel_email).toBeNull();
    });

    it('atualiza CNPJ com sucesso quando novo CNPJ não está duplicado (linha 56)', async () => {
      (repo.findOne as jest.Mock)
        .mockResolvedValueOnce(existing) // findOneMotel
        .mockResolvedValueOnce(null); // verificação de duplicata

      (repo.save as jest.Mock).mockImplementation(async (e) => e);

      const dto: UpdateMotelDto = { motel_cnpj: '99.999.999/9999-99' } as any;

      const res = await service.updateMotel(1, dto);

      // Verifica que o CNPJ foi atualizado (linha 56 coberta)
      expect(res.motel_cnpj).toBe('99.999.999/9999-99');
      expect(repo.findOne).toHaveBeenNthCalledWith(2, {
        where: {
          motel_cnpj: '99.999.999/9999-99',
          motel_exclusao: IsNull(),
          motel_id: Not(1),
        },
      });
      expect(repo.save).toHaveBeenCalled();
    });
  });


  describe('deleteMotel', () => {
    it('soft delete quando encontrado e retorna mensagem', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(existing);
      (repo.softDelete as jest.Mock).mockResolvedValue({ affected: 1 });

      const res = await service.deleteMotel(1);
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { motel_id: 1, motel_exclusao: IsNull() },
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
