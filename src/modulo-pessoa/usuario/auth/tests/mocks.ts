import { UsuarioStatus } from '../../entities/usuario.entity';

export const usuarioServiceMock = () => ({
  findByCodigoWithSenha: jest.fn(),
});

export const jwtServiceMock = () => ({
  signAsync: jest.fn(),
});

export const configServiceMock = () => ({
  get: jest.fn((key: string) => (key === 'JWT_SECRET' ? 'test-secret' : undefined)),
});

export const sampleUserActive = {
  usuario_id: 1,
  usuario_codigo: 'Rodrigo',
  usuario_nome: 'Rodrigo Pinesso',
  usuario_role: 'recepcionista',
  usuario_ativo: UsuarioStatus.ATIVO,        
  usuario_senha: 'hashed:luvr#123',
};

export const sampleUserInactive = {
  ...sampleUserActive,
  usuario_ativo: UsuarioStatus.INATIVO,     
};
