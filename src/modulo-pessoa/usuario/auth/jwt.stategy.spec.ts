import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy (unit, mock config)', () => {
  it('normalize role/roles no validate()', () => {
    const configMock = { get: jest.fn().mockReturnValue('secret') } as any;
    const strat = new JwtStrategy(configMock);

    const out1 = strat.validate({ sub: 1, codigo: 'Rodrigo', motel_id: 5, roles: ['admin'] });
    expect(out1).toEqual({
      usuarioId: 1,
      usuarioCodigo: 'Rodrigo',
      motel_id: 5,
      role: 'admin',
      roles: ['admin'],
    });

    const out2 = strat.validate({ sub: 2, codigo: 'Ana', role: 'gerente' });
    expect(out2).toEqual({
      usuarioId: 2,
      usuarioCodigo: 'Ana',
      motel_id: null,
      role: 'gerente',
      roles: ['gerente'],
    });
  });
});
