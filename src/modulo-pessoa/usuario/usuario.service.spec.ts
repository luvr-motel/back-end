import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { UsuarioService, UsuarioResp, UsuarioOut } from './usuario.service';
import { Usuario, UsuarioStatus } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UsuarioRole } from './entities/usuario-role.enum';

type RepoMock = jest.Mocked<Repository<Usuario>>;

function createRepoMock(): RepoMock {
  return {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
    merge: jest.fn(),
    createQueryBuilder: jest.fn(),
  } as unknown as RepoMock;
}

function mockQB(user: Usuario | null) {
  const qb: any = {
    addSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getOne: jest.fn().mockResolvedValue(user),
  };
  return qb;
}

jest.mock('argon2', () => ({
  hash: jest.fn(async (v: string) => `hashed(${v})`),
}));

describe('UsuarioService', () => {
  let service: UsuarioService;
  let repo: RepoMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuarioService,
        { provide: getRepositoryToken(Usuario), useValue: createRepoMock() },
      ],
    }).compile();

    service = module.get(UsuarioService);
    repo = module.get(getRepositoryToken(Usuario));
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('cria usuário, trim no código, default ATIVO/RECEPCIONISTA e mapeia pessoaId', async () => {
      const dto: CreateUsuarioDto = {
        usuarioCodigo: '  LUVR.RODRIGO  ',
        usuarioSenha: 'luvr#123',
        // usuarioAtivo omitido -> ATIVO
        // usuarioRole omitido -> RECEPCIONISTA
        pessoaId: 7,
      } as any;

      (repo.findOne as jest.Mock).mockResolvedValue(null);
      const entity: Usuario = {
        usuario_id: 1,
        usuario_codigo: 'LUVR.RODRIGO',
        usuario_senha: 'hashed(luvr#123)',
        usuario_ativo: UsuarioStatus.ATIVO,
        usuario_role: UsuarioRole.RECEPCIONISTA,
        pessoa: { pessoa_id: 7 } as any,
      } as any;

      (repo.create as jest.Mock).mockImplementation(p => ({ ...p }));
      (repo.save as jest.Mock).mockResolvedValue(entity);

      const out = await service.create(dto);

      expect(repo.findOne).toHaveBeenCalledWith({ where: { usuario_codigo: 'LUVR.RODRIGO' } });
      expect(argon2.hash).toHaveBeenCalledWith('luvr#123');
      expect(repo.create).toHaveBeenCalledWith({
        usuario_codigo: 'LUVR.RODRIGO',
        usuario_senha: 'hashed(luvr#123)',
        usuario_ativo: UsuarioStatus.ATIVO,
        usuario_role: UsuarioRole.RECEPCIONISTA,
        pessoa: { pessoa_id: 7 },
      });
      // não deve retornar senha
      expect((out as any).usuario_senha).toBeUndefined();
      expect(out.usuario_codigo).toBe('LUVR.RODRIGO');
      expect(out.usuario_role).toBe(UsuarioRole.RECEPCIONISTA);
    });

    it('create: trata caso em que usuarioCodigo não tem trim (valor não string)', async () => {
      const dto = { usuarioCodigo: 123 as any, usuarioSenha: 'pw' };
      (repo.findOne as jest.Mock).mockResolvedValue(null);
      (repo.create as jest.Mock).mockImplementation(p => p);
      (repo.save as jest.Mock).mockResolvedValue({
        usuario_id: 1,
        usuario_codigo: 123,
        usuario_senha: 'hashed(pw)',
      } as any);

      const res = await service.create(dto as any);
      expect(res.usuario_codigo).toBe(123);
    });

    it('create: usa ativo/role informados e NÃO seta pessoa quando pessoaId ausente', async () => {
      const dto = {
        usuarioCodigo: 'GERENTE1',
        usuarioSenha: 'pw',
        usuarioAtivo: UsuarioStatus.INATIVO,
        usuarioRole: UsuarioRole.GERENTE,
        // pessoaId omitido
      } as any;

      (repo.findOne as jest.Mock).mockResolvedValue(null);
      (repo.create as jest.Mock).mockImplementation(p => p);
      (repo.save as jest.Mock).mockResolvedValue({
        usuario_id: 10,
        usuario_codigo: 'GERENTE1',
        usuario_senha: 'hashed(pw)',
        usuario_ativo: UsuarioStatus.INATIVO,
        usuario_role: UsuarioRole.GERENTE,
      } as any);

      const out = await service.create(dto);

      // garante que pessoa não foi mapeada
     expect((repo.create as jest.Mock).mock.calls[0][0]).toEqual({
        usuario_codigo: 'GERENTE1',
        usuario_senha: 'hashed(pw)',
        usuario_ativo: UsuarioStatus.INATIVO,
        usuario_role: UsuarioRole.GERENTE,
      });
      expect(out.usuario_codigo).toBe('GERENTE1');
      expect(out.usuario_role).toBe(UsuarioRole.GERENTE);
      expect((out as any).usuario_senha).toBeUndefined();
    });

    it('lança 409 quando código já existe', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue({ usuario_id: 99 } as any);
      const dto = { usuarioCodigo: 'X', usuarioSenha: 'pass' } as any;

      await expect(service.create(dto)).rejects.toThrow(HttpException);
      await expect(service.create(dto)).rejects.toThrow('Código de usuário já existe');
    });
  });

  describe('findAll', () => {
    it('retorna usuários sem senha (toSafe)', async () => {
      const withPwd: Usuario = {
        usuario_id: 1,
        usuario_codigo: 'A',
        usuario_senha: 'hashed',
        usuario_ativo: UsuarioStatus.ATIVO,
        usuario_role: UsuarioRole.RECEPCIONISTA,
      } as any;
      (repo.find as jest.Mock).mockResolvedValue([withPwd]);

      const list = await service.findAll();
      expect(list).toHaveLength(1);
      expect(list[0].usuario_codigo).toBe('A');
      expect((list[0] as any).usuario_senha).toBeUndefined();
    });
  });

  describe('findOne', () => {
    it('retorna usuário sem senha', async () => {
      const u: Usuario = { usuario_id: 10, usuario_codigo: 'X' } as any;
      (repo.findOne as jest.Mock).mockResolvedValue(u);

      const res = await service.findOne(10);
      expect(res.mensagem).toBe('Usuário #10');
      expect(res.usuario.usuario_codigo).toBe('X');
      expect((res.usuario as any).usuario_senha).toBeUndefined();
    });

    it('404 quando não existe', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow('Usuário não encontrado');
    });
  });

  describe('findByCodigoWithSenha', () => {
    it('retorna com senha via query builder', async () => {
      const user = { usuario_id: 1, usuario_codigo: 'A', usuario_senha: 'hash' } as any;
      (repo.createQueryBuilder as jest.Mock).mockReturnValue(mockQB(user));

      const got = await service.findByCodigoWithSenha('A');
      expect(repo.createQueryBuilder).toHaveBeenCalledWith('u');
      expect(got.usuario_senha).toBe('hash');
    });

    it('404 quando não existe via query builder', async () => {
      (repo.createQueryBuilder as jest.Mock).mockReturnValue(mockQB(null));
      await expect(service.findByCodigoWithSenha('X')).rejects.toThrow('Usuário não encontrado');
    });

    it('findByCodigoWithSenha: usa where correto no query builder', async () => {
    const qb: any = {
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue({ usuario_id: 3, usuario_codigo: 'CODE', usuario_senha: 'hash' }),
    };
    (repo.createQueryBuilder as jest.Mock).mockReturnValue(qb);

    await service.findByCodigoWithSenha('CODE');

    expect(repo.createQueryBuilder).toHaveBeenCalledWith('u');
    expect(qb.addSelect).toHaveBeenCalledWith('u.usuario_senha');
    expect(qb.where).toHaveBeenCalledWith('u.usuario_codigo = :usuario_codigo', { usuario_codigo: 'CODE' });
    expect(qb.getOne).toHaveBeenCalled();
  });
});

  describe('update', () => {
    it('atualiza campos: trim codigo, hash senha, ativo, role e pessoaId -> pessoa', async () => {
      const atual: Usuario = {
        usuario_id: 5,
        usuario_codigo: 'OLD',
        usuario_ativo: UsuarioStatus.ATIVO,
        usuario_role: UsuarioRole.RECEPCIONISTA,
      } as any;

      (repo.findOne as jest.Mock).mockResolvedValueOnce(atual);

      (repo.merge as jest.Mock).mockImplementation((a, b) => ({ ...a, ...b }));
      const saved: Usuario = {
        usuario_id: 5,
        usuario_codigo: 'NEW',
        usuario_senha: 'hashed(nova#123)',
        usuario_ativo: UsuarioStatus.INATIVO,
        usuario_role: UsuarioRole.GERENTE,
        pessoa: { pessoa_id: 77 } as any,
      } as any;
      (repo.save as jest.Mock).mockResolvedValue(saved);

      const dto: UpdateUsuarioDto = {
        usuarioCodigo: '  NEW ',
        usuarioSenha: 'nova#123',
        usuarioAtivo: UsuarioStatus.INATIVO,
        usuarioRole: UsuarioRole.GERENTE,
        pessoaId: 77,
      } as any;

      const res = await service.update(5, dto);

      expect(argon2.hash).toHaveBeenCalledWith('nova#123');
      expect(repo.merge).toHaveBeenCalledWith(atual, {
        usuario_codigo: 'NEW',
        usuario_senha: 'hashed(nova#123)',
        usuario_ativo: UsuarioStatus.INATIVO,
        usuario_role: UsuarioRole.GERENTE,
        pessoa: { pessoa_id: 77 },
      });
      expect(res.mensagem).toBe('Usuário #5 Atualizado com sucesso');
      expect((res.usuario as any).usuario_senha).toBeUndefined();
      expect(res.usuario.usuario_codigo).toBe('NEW');
    });

    it('update: trata usuarioCodigo sem trim (não string)', async () => {
      const atual = { usuario_id: 22, usuario_codigo: 'OLD' } as any;
      (repo.findOne as jest.Mock).mockResolvedValueOnce(atual);
      (repo.merge as jest.Mock).mockImplementation((a, b) => ({ ...a, ...b }));
      (repo.save as jest.Mock).mockResolvedValue({ ...atual, usuario_codigo: 999 });

      const dto = { usuarioCodigo: 999 as any };
      const res = await service.update(22, dto as any);
      expect(res.usuario.usuario_codigo).toBe(999);
    });

    it('update: sem usuarioSenha não hasheia e sem pessoaId no DTO mantém relação', async () => {
      const atual = {
        usuario_id: 30,
        usuario_codigo: 'OLD',
        usuario_ativo: UsuarioStatus.ATIVO,
        usuario_role: UsuarioRole.RECEPCIONISTA,
        pessoa: { pessoa_id: 5 } as any,
     } as any;

      (repo.findOne as jest.Mock).mockResolvedValueOnce(atual);
      (repo.merge as jest.Mock).mockImplementation((a, b) => ({ ...a, ...b }));
      (repo.save as jest.Mock).mockResolvedValue({ ...atual, usuario_codigo: 'NEW' });

      const dto = { usuarioCodigo: '  NEW  ' } as UpdateUsuarioDto; // sem senha e sem pessoaId
      const res = await service.update(30, dto);

      expect(argon2.hash).not.toHaveBeenCalled(); // não hasheou
      expect(repo.merge).toHaveBeenCalledWith(atual, { usuario_codigo: 'NEW' });
      expect(res.usuario.usuario_codigo).toBe('NEW');
      expect((res.usuario as any).pessoa).toEqual({ pessoa_id: 5 }); 
    });

    it('update: usuarioRole = null zera o campo (usa ?? null)', async () => {
      const atual = { usuario_id: 12, usuario_codigo: 'U', usuario_role: UsuarioRole.RECEPCIONISTA } as any;
      (repo.findOne as jest.Mock).mockResolvedValueOnce(atual);
      (repo.merge as jest.Mock).mockImplementation((a, b) => ({ ...a, ...b }));
      (repo.save as jest.Mock).mockResolvedValue({ ...atual, usuario_role: null });

      const res = await service.update(12, { usuarioRole: null as any });

      expect(repo.merge).toHaveBeenCalledWith(atual, { usuario_role: null });
      expect((res.usuario as any).usuario_role).toBeNull();
    });

    it('update: DTO vazio não altera campos (merge com objeto vazio)', async () => {
      const atual: Usuario = {
      usuario_id: 55,
      usuario_codigo: 'KEEP',
      usuario_ativo: UsuarioStatus.ATIVO,
      usuario_role: UsuarioRole.RECEPCIONISTA,
      pessoa: { pessoa_id: 9 } as any,
    } as any;

    (repo.findOne as jest.Mock).mockResolvedValueOnce(atual);
    (repo.merge as jest.Mock).mockImplementation((a, b) => ({ ...a, ...b }));
    (repo.save as jest.Mock).mockResolvedValue(atual);

    const res = await service.update(55, {} as UpdateUsuarioDto);

    expect(repo.merge).toHaveBeenCalledWith(atual, {});
    expect(res.usuario.usuario_codigo).toBe('KEEP');
    expect((res.usuario as any).pessoa).toEqual({ pessoa_id: 9 });
    });

    it("pessoaId presente porém falsy zera relação (null)", async () => {
      const atual: Usuario = { usuario_id: 2, usuario_codigo: 'A' } as any;
      (repo.findOne as jest.Mock).mockResolvedValueOnce(atual);
      (repo.merge as jest.Mock).mockImplementation((a, b) => ({ ...a, ...b }));
      (repo.save as jest.Mock).mockResolvedValue({ ...atual, pessoa: null });

      const res = await service.update(2, { pessoaId: 0 } as any);
      expect(repo.merge).toHaveBeenCalledWith(atual, { pessoa: null });
      expect(res.usuario).toEqual({ usuario_id: 2, usuario_codigo: 'A', pessoa: null } as any);
    });

    it('404 quando não existir', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(null);
      await expect(service.update(123, {} as any)).rejects.toThrow('Erro ao atualizar usuário');
    });

    it('update: ignora usuarioSenha e usuarioAtivo quando undefined', async () => {
      const atual = { usuario_id: 5, usuario_codigo: 'A' } as any;
      (repo.findOne as jest.Mock).mockResolvedValueOnce(atual);
      (repo.merge as jest.Mock).mockImplementation((a, b) => ({ ...a, ...b }));
      (repo.save as jest.Mock).mockResolvedValue(atual);

      const dto = { usuarioSenha: undefined, usuarioAtivo: undefined } as any;
      const res = await service.update(5, dto);
      expect(argon2.hash).not.toHaveBeenCalled();
     expect(repo.merge).toHaveBeenCalledWith(atual, {});
    });
  });

  describe('remove', () => {
    it('remove com sucesso via softDelete', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue({ usuario_id: 7 } as any);
      (repo.softDelete as jest.Mock).mockResolvedValue({} as any);

      const res = await service.remove(7);
      expect(repo.softDelete).toHaveBeenCalledWith(7);
      expect(res.mensagem).toBe('Usuário 7 excluido com sucesso');
    });

    it('404 quando não encontrado', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow('Erro ao excluir usuário');
    });

    it('remove: propaga erro do softDelete', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue({ usuario_id: 7 } as any);
      const boom = new Error('soft failed');
      (repo.softDelete as jest.Mock).mockRejectedValue(boom);

    await expect(service.remove(7)).rejects.toBe(boom);
    });
  });
});
