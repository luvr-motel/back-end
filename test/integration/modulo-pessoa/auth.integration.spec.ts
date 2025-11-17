import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { Usuario, UsuarioStatus } from 'src/modulo-pessoa/usuario/entities/usuario.entity';
import { UsuarioService } from 'src/modulo-pessoa/usuario/usuario.service';
import { UsuarioRole } from 'src/modulo-pessoa/usuario/entities/usuario-role.enum';
import { AuthService } from 'src/modulo-pessoa/usuario/auth/auth.service';
import { AuthModule } from 'src/modulo-pessoa/usuario/auth/auth.module';

jest.setTimeout(30000);

describe('AuthService (integração)', () => {
  let moduleRef: TestingModule;
  let authService: AuthService;
  let usuarioService: UsuarioService;
  let jwtService: JwtService;
  let repo: Repository<Usuario>;

  // inicia módulo, auth e banco de teste
  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
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
        AuthModule,
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    usuarioService = moduleRef.get<UsuarioService>(UsuarioService);
    jwtService = moduleRef.get<JwtService>(JwtService);
    repo = moduleRef.get<Repository<Usuario>>(getRepositoryToken(Usuario));
  });

  // limpa tabela de usuários antes de cada teste
  beforeEach(async () => {
    await repo.createQueryBuilder().delete().from(Usuario).execute();
  });

  // fecha módulo ao final
  afterAll(async () => {
    await moduleRef.close();
  });

  it('deve validar credenciais corretas e usuário ativo (validate)', async () => {
    // cria usuário ativo
    const created = await usuarioService.create({
      usuarioCodigo: 'AUTH.OK',
      usuarioSenha: 'senha#ok',
      usuarioAtivo: UsuarioStatus.ATIVO,
      usuarioRole: UsuarioRole.RECEPCIONISTA,
    });

    // chama validate
    const result = await authService.validate('AUTH.OK', 'senha#ok');

    // retorna usuário safe
    expect(result).toBeDefined();
    expect(result.usuario_id).toBe(created.usuario_id);
    expect(result.usuario_codigo).toBe('AUTH.OK');
    expect((result as any).usuario_senha).toBeUndefined();
  });

  it('deve lançar UnauthorizedException ao enviar senha inválida', async () => {
    // cria usuário ativo
    await usuarioService.create({
      usuarioCodigo: 'AUTH.WRONG',
      usuarioSenha: 'senha#correta',
      usuarioAtivo: UsuarioStatus.ATIVO,
      usuarioRole: UsuarioRole.RECEPCIONISTA,
    });

    // tenta validar com senha errada
    await expect(
      authService.validate('AUTH.WRONG', 'senha#errada'),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    try {
      await authService.validate('AUTH.WRONG', 'senha#errada');
    } catch (err) {
      const uerr = err as UnauthorizedException;
      expect(uerr.message).toBe('Credenciais inválidas ou usuário inativo');
    }
  });

  it('deve lançar UnauthorizedException ao tentar logar com usuário inativo', async () => {
    // cria usuário inativo
    const created = await usuarioService.create({
      usuarioCodigo: 'AUTH.INATIVO',
      usuarioSenha: 'senha#inativo',
      usuarioAtivo: UsuarioStatus.INATIVO,
      usuarioRole: UsuarioRole.RECEPCIONISTA,
    });

    // garante que ficou inativo no banco
    const fromDb = await repo.findOne({ where: { usuario_id: created.usuario_id } });
    expect(fromDb!.usuario_ativo).toBe(UsuarioStatus.INATIVO);

    // tenta validar
    await expect(
      authService.validate('AUTH.INATIVO', 'senha#inativo'),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    try {
      await authService.validate('AUTH.INATIVO', 'senha#inativo');
    } catch (err) {
      const uerr = err as UnauthorizedException;
      expect(uerr.message).toBe('Credenciais inválidas ou usuário inativo');
    }
  });

  it('deve realizar login e retornar JWT válido com payload correto', async () => {
    // cria usuário
    const created = await usuarioService.create({
      usuarioCodigo: 'AUTH.LOGIN',
      usuarioSenha: 'senha#login',
      usuarioAtivo: UsuarioStatus.ATIVO,
      usuarioRole: UsuarioRole.GERENTE,
    });

    // chama login
    const resp = await authService.login('AUTH.LOGIN', 'senha#login');

    // tem access_token e user
    expect(resp).toBeDefined();
    expect(typeof resp.access_token).toBe('string');
    expect(resp.user).toBeDefined();
    expect(resp.user.usuario_id).toBe(created.usuario_id);
    expect((resp.user as any).usuario_senha).toBeUndefined();

    // decodifica token
    const decoded: any = jwtService.decode(resp.access_token);
    expect(decoded).toBeDefined();
    expect(decoded.sub).toBe(created.usuario_id);
    expect(decoded.codigo).toBe('AUTH.LOGIN');

    // role no payload
    expect(decoded.role).toBe('gerente');        
    expect(decoded.roles).toContain('gerente');  
  });
});
