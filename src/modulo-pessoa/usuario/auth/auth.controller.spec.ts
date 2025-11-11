import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController (unit, mock service)', () => {
  let controller: AuthController;
  const authMock = { login: jest.fn() };

  beforeEach(async () => {
    const ref = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authMock }],
    }).compile();

    controller = ref.get(AuthController);
  });

  afterEach(() => jest.clearAllMocks());

  it('POST /auth/login -> delega para service.login', async () => {
    authMock.login.mockResolvedValue({ access_token: 'jwt', user: { id: 1 } });

    const res = await controller.login({ usuarioCodigo: 'Rodrigo', senha: 'luvr#123' });
    expect(authMock.login).toHaveBeenCalledWith('Rodrigo', 'luvr#123');
    expect(res).toEqual({ access_token: 'jwt', user: { id: 1 } });
  });
});
