import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateRegistroPontoDto } from './create-registro-ponto.dto';

describe('CreateRegistroPontoDto', () => {
  it('é válido com usuario_id inteiro, motel_id opcional e registroponto_entrada booleano', async () => {
    const input = {
      usuario_id: 1,
      motel_id: 10,
      registroponto_entrada: true,
    };

    const dto = plainToInstance(CreateRegistroPontoDto, input);
    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it('permite motel_id ausente (opcional)', async () => {
    const input = {
      usuario_id: 2,
      registroponto_entrada: false,
    };

    const dto = plainToInstance(CreateRegistroPontoDto, input);
    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it('retorna erro quando usuario_id e motel_id não são inteiros', async () => {
    const input = {
      usuario_id: 'abc',          
      motel_id: 'xyz',            
      registroponto_entrada: 'yes', 
    };

    const dto = plainToInstance(CreateRegistroPontoDto, input);
    const errors = await validate(dto);

    // Deve ter erros (pelo menos em usuario_id e motel_id)
    expect(errors.length).toBeGreaterThan(0);

    const usuarioIdError = errors.find((e) => e.property === 'usuario_id');
    expect(usuarioIdError).toBeDefined();
    expect(usuarioIdError!.constraints).toHaveProperty('isInt');

    const motelIdError = errors.find((e) => e.property === 'motel_id');
    expect(motelIdError).toBeDefined();
    expect(motelIdError!.constraints).toHaveProperty('isInt');

  });
});
