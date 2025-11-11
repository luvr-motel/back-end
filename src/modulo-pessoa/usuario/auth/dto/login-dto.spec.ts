import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { LoginDto } from '../dto/login.dto';

describe('LoginDto (unit)', () => {
  it('válido com dados corretos', async () => {
    const dto = plainToInstance(LoginDto, { usuarioCodigo: 'Rodrigo', senha: 'luvr#123' });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('erro se usuarioCodigo vazio', async () => {
    const dto = plainToInstance(LoginDto, { usuarioCodigo: '', senha: 'luvr#123' });
    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'usuarioCodigo')).toBe(true);
  });

  it('erro se senha < 8', async () => {
    const dto = plainToInstance(LoginDto, { usuarioCodigo: 'Rodrigo', senha: '1234567' });
    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'senha')).toBe(true);
  });
});
