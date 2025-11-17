import { RolesGuard } from './roles.guard';

const makeCtx = (user: any) =>
  ({
    switchToHttp: () => ({ getRequest: () => ({ user }) }),
    getHandler: jest.fn(),
    getClass: jest.fn(),
  } as any);

describe('RolesGuard (unit, mock reflector)', () => {
  let reflector: { getAllAndOverride: jest.Mock };
  let guard: RolesGuard;

  beforeEach(() => {
    reflector = { getAllAndOverride: jest.fn() } as any;
    guard = new RolesGuard(reflector as any);
  });

  afterEach(() => jest.clearAllMocks());

  it('permite se rota é pública', () => {
    reflector.getAllAndOverride.mockImplementation((key: string) =>
      key === 'isPublic' ? true : undefined,
    );
    expect(guard.canActivate(makeCtx({}))).toBe(true);
  });

  it('permite se não há roles requeridas', () => {
    reflector.getAllAndOverride.mockReturnValue(undefined);
    expect(guard.canActivate(makeCtx({}))).toBe(true);
  });

  it('permite se usuário possui ao menos uma role requerida', () => {
    reflector.getAllAndOverride.mockImplementation((key: string) =>
      key === 'roles' ? ['Gerente', 'Admin'] : undefined,
    );
    expect(guard.canActivate(makeCtx({ roles: ['admin'] }))).toBe(true);
  });

  it('lança Forbidden se faltar role requerida', () => {
    reflector.getAllAndOverride.mockImplementation((key: string) =>
      key === 'roles' ? ['admin'] : undefined,
    );
    expect(() => guard.canActivate(makeCtx({ roles: ['recepcionista'], role: 'gerente' })))
      .toThrow('Acesso negado para este perfil.');
  });
});
