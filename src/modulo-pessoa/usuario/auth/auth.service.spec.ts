import { Test } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from '../usuario.service'; 
import {
  usuarioServiceMock,
  jwtServiceMock,
  sampleUserActive,
  sampleUserInactive,
} from './tests/mocks';

jest.mock('argon2', () => ({ verify: jest.fn() }));
import * as argon2 from 'argon2';

describe('AuthService (unit, mocks)', () => {
  let service: AuthService;
  let usuarios: ReturnType<typeof usuarioServiceMock>;
  let jwt: ReturnType<typeof jwtServiceMock>;

  beforeEach(async () => {
    usuarios = usuarioServiceMock();
    jwt = jwtServiceMock();

    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsuarioService, useValue: usuarios }, 
        { provide: JwtService, useValue: jwt },
      ],
    }).compile();

    service = moduleRef.get(AuthService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('validate', () => {
    it('retorna safe user com credenciais corretas e ativo', async () => {
      usuarios.findByCodigoWithSenha.mockResolvedValue(sampleUserActive);
      (argon2.verify as jest.Mock).mockResolvedValue(true);

      const safe = await service.validate('Rodrigo', 'luvr#123');
      expect(usuarios.findByCodigoWithSenha).toHaveBeenCalledWith('Rodrigo');
      expect(safe).toMatchObject({
        usuario_id: sampleUserActive.usuario_id,
        usuario_codigo: sampleUserActive.usuario_codigo,
      });
      expect((safe as any).usuario_senha).toBeUndefined();
    });

    it('lança Unauthorized se usuário não existe', async () => {
      usuarios.findByCodigoWithSenha.mockResolvedValue(null);
      await expect(service.validate('x', 'y')).rejects.toThrow(UnauthorizedException);
    });

    it('lança Unauthorized se senha inválida', async () => {
      usuarios.findByCodigoWithSenha.mockResolvedValue(sampleUserActive);
      (argon2.verify as jest.Mock).mockResolvedValue(false);
      await expect(service.validate('Rodrigo', 'errada')).rejects.toThrow(UnauthorizedException);
    });

    it('lança Unauthorized se inativo', async () => {
      usuarios.findByCodigoWithSenha.mockResolvedValue(sampleUserInactive);
      (argon2.verify as jest.Mock).mockResolvedValue(true);
      await expect(service.validate('Rodrigo', 'luvr#123')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('assina payload e retorna access_token + safe user', async () => {
      usuarios.findByCodigoWithSenha.mockResolvedValue(sampleUserActive);
      (argon2.verify as jest.Mock).mockResolvedValue(true);
      jwt.signAsync.mockResolvedValue('access.jwt');

      const res = await service.login('Rodrigo', 'luvr#123');
      expect(jwt.signAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          sub: sampleUserActive.usuario_id,
          codigo: sampleUserActive.usuario_codigo,
          role: 'recepcionista',
          roles: ['recepcionista'],
        }),
      );
      expect(res.access_token).toBe('access.jwt');
      expect((res.user as any).usuario_senha).toBeUndefined();
    });
  });
});
