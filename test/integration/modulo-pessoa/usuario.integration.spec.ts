import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';
import * as argon2 from 'argon2';

import { Usuario, UsuarioStatus } from 'src/modulo-pessoa/usuario/entities/usuario.entity';
import { UsuarioService } from 'src/modulo-pessoa/usuario/usuario.service';
import { UsuarioRole } from 'src/modulo-pessoa/usuario/entities/usuario-role.enum';

jest.setTimeout(30000);

describe('UsuarioService (integração)', () => {
  let moduleRef: TestingModule;
  let service: UsuarioService;
  let repo: Repository<Usuario>;

  // inicia módulo e conecta no banco de teste
  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: 'admin',
          database: 'luvr_test',
          entities: ['src/**/*.entity{.ts,.js}'],
          synchronize: true,
          dropSchema: true,
        }),
        TypeOrmModule.forFeature([Usuario]),
      ],
      providers: [UsuarioService],
    }).compile();

    service = moduleRef.get<UsuarioService>(UsuarioService);
    repo = moduleRef.get<Repository<Usuario>>(getRepositoryToken(Usuario));
  });

  // limpa tabela antes de cada teste
  beforeEach(async () => {
    await repo.createQueryBuilder().delete().from(Usuario).execute();
  });

  // fecha módulo ao final
  afterAll(async () => {
    await moduleRef.close();
  });

  it('deve criar um usuário e recuperá-lo (create + findAll + findOne)', async () => {
    // cria usuário
    const created = await service.create({
      usuarioCodigo: '   LUVR.RODRIGO   ',
      usuarioSenha: 'luvr#123',
      // sem usuarioAtivo -> default ATIVO
      // sem usuarioRole  -> default RECEPCIONISTA
    });

    // não deve ter senha no retorno
    expect((created as any).usuario_senha).toBeUndefined();
    expect(created.usuario_id).toBeDefined();
    expect(created.usuario_codigo).toBe('LUVR.RODRIGO');
    expect(created.usuario_ativo).toBe(UsuarioStatus.ATIVO);
    expect(created.usuario_role).toBe(UsuarioRole.RECEPCIONISTA);

    // findAll
    const todos = await service.findAll();
    expect(todos).toHaveLength(1);
    expect(todos[0].usuario_codigo).toBe('LUVR.RODRIGO');

    // findOne
    const { mensagem, usuario } = await service.findOne(created.usuario_id);
    expect(mensagem).toBe(`Usuário #${created.usuario_id}`);
    expect(usuario.usuario_id).toBe(created.usuario_id);
    expect((usuario as any).usuario_senha).toBeUndefined();
  });

  it('deve lançar HttpException 409 ao criar usuário com codigo duplicado', async () => {
    // cria usuário inicial
    await service.create({
      usuarioCodigo: 'LUVR.DUP',
      usuarioSenha: 'senha#1',
    });

    // tenta criar com mesmo código
    try {
      await service.create({
        usuarioCodigo: '   LUVR.DUP   ',
        usuarioSenha: 'senha#2',
      });
      fail('Era esperado lançar HttpException 409, mas não lançou.');
    } catch (err) {
      expect(err).toBeInstanceOf(HttpException);
      const httpErr = err as HttpException;
      expect(httpErr.getStatus()).toBe(409);
      expect(httpErr.message).toBe('Código de usuário já existe');
    }
  });

  it('deve lançar HttpException 404 ao buscar usuário inexistente (findOne)', async () => {
    // tenta buscar id inexistente
    try {
      await service.findOne(999);
      fail('Era esperado lançar HttpException 404, mas não lançou.');
    } catch (err) {
      expect(err).toBeInstanceOf(HttpException);
      const httpErr = err as HttpException;
      expect(httpErr.getStatus()).toBe(404);
      expect(httpErr.message).toBe('Usuário não encontrado');
    }
  });

  it('deve buscar usuário por código com senha (findByCodigoWithSenha) e verificar hash', async () => {
    // cria usuário
    const created = await service.create({
      usuarioCodigo: 'LUVR.HASH',
      usuarioSenha: 'segredo#123',
    });

    // busca com senha
    const userWithPass = await service.findByCodigoWithSenha('LUVR.HASH');

    expect(userWithPass.usuario_id).toBe(created.usuario_id);
    expect(userWithPass.usuario_senha).toBeDefined();

    // verifica hash
    const ok = await argon2.verify(userWithPass.usuario_senha, 'segredo#123');
    expect(ok).toBe(true);
  });

  it('deve lançar HttpException 404 em findByCodigoWithSenha para código inexistente', async () => {
    try {
      await service.findByCodigoWithSenha('NAO.EXISTE');
      fail('Era esperado lançar HttpException 404, mas não lançou.');
    } catch (err) {
      expect(err).toBeInstanceOf(HttpException);
      const httpErr = err as HttpException;
      expect(httpErr.getStatus()).toBe(404);
      expect(httpErr.message).toBe('Usuário não encontrado');
    }
  });

  it('deve atualizar um usuário existente (update) incluindo troca de senha', async () => {
    // cria usuário
    const created = await service.create({
      usuarioCodigo: 'LUVR.UPDATE',
      usuarioSenha: 'senha#old',
      usuarioAtivo: UsuarioStatus.ATIVO,
      usuarioRole: UsuarioRole.RECEPCIONISTA,
    });

    // atualiza
    const { mensagem, usuario } = await service.update(created.usuario_id, {
      usuarioCodigo: '  LUVR.UPDATE.NOVO  ',
      usuarioSenha: 'senha#new',
      usuarioAtivo: UsuarioStatus.INATIVO,
      usuarioRole: UsuarioRole.GERENTE,
    });

    expect(mensagem).toBe(`Usuário #${created.usuario_id} Atualizado com sucesso`);
    expect(usuario.usuario_codigo).toBe('LUVR.UPDATE.NOVO');
    expect(usuario.usuario_ativo).toBe(UsuarioStatus.INATIVO);
    expect(usuario.usuario_role).toBe(UsuarioRole.GERENTE);
    expect((usuario as any).usuario_senha).toBeUndefined();

    // confere que a senha mudou no banco
    const fromDb = await repo.findOne({ where: { usuario_id: created.usuario_id } });
    expect(fromDb).toBeDefined();
    const senhaOk = await argon2.verify(fromDb!.usuario_senha, 'senha#new');
    expect(senhaOk).toBe(true);
  });

  it('deve manter a senha antiga se usuarioSenha não for enviada no update', async () => {
    // cria usuário
    const created = await service.create({
      usuarioCodigo: 'LUVR.NO.PASS.UPDATE',
      usuarioSenha: 'senha#original',
    });

    const before = await repo.findOne({ where: { usuario_id: created.usuario_id } });
    expect(before).toBeDefined();
    const hashAntigo = before!.usuario_senha;

    // atualiza sem enviar usuarioSenha
    await service.update(created.usuario_id, {
      usuarioCodigo: 'LUVR.NO.PASS.UPDATE.2',
    });

    const after = await repo.findOne({ where: { usuario_id: created.usuario_id } });
    expect(after!.usuario_codigo).toBe('LUVR.NO.PASS.UPDATE.2');
    expect(after!.usuario_senha).toBe(hashAntigo);
  });

  it('deve lançar HttpException 404 ao atualizar usuário inexistente', async () => {
    // tenta atualizar inexistente
    try {
      await service.update(999, {
        usuarioCodigo: 'NAO.EXISTE',
      });
      fail('Era esperado lançar HttpException 404, mas não lançou.');
    } catch (err) {
      expect(err).toBeInstanceOf(HttpException);
      const httpErr = err as HttpException;
      expect(httpErr.getStatus()).toBe(404);
      expect(httpErr.message).toBe('Erro ao atualizar usuário');
    }
  });

  it('deve realizar soft delete do usuário (remove)', async () => {
    // cria usuário
    const created = await service.create({
      usuarioCodigo: 'LUVR.DELETE',
      usuarioSenha: 'senha#del',
    });

    // remove usuário
    const resp = await service.remove(created.usuario_id);
    expect(resp.mensagem).toBe(`Usuário ${created.usuario_id} excluido com sucesso`);

    // deve ter registro deletado
    const fromDb = await repo.findOne({
      where: { usuario_id: created.usuario_id },
      withDeleted: true,
    });

    expect(fromDb).toBeDefined();
    expect(fromDb!.usuario_exclusao).toBeInstanceOf(Date);
  });

  it('deve lançar HttpException 404 ao remover usuário inexistente', async () => {
    // tenta remover inexistente
    try {
      await service.remove(999);
      fail('Era esperado lançar HttpException 404, mas não lançou.');
    } catch (err) {
      expect(err).toBeInstanceOf(HttpException);
      const httpErr = err as HttpException;
      expect(httpErr.getStatus()).toBe(404);
      expect(httpErr.message).toBe('Erro ao excluir usuário');
    }
  });
});
