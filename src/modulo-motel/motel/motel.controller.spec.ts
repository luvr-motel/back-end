import 'reflect-metadata';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateMotelDto } from './dto/create-motel.dto';
import { Status } from './common/enums/status.enum';

describe('CreateMotelDto (todos os campos obrigatórios)', () => {
  it('válido quando todos os campos obrigatórios estão corretos', async () => {
    const dto = plainToInstance(CreateMotelDto, {
      motel_descricao: 'LUVR Motel Centro',
      motel_endereco: 'Av. Brasil, 1000 - Centro',
      motel_email: 'contato@motel.com.br',
      motel_cnpj: '12.345.678/0001-99',
      motel_ativo: Status.ATIVO,
    });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('inválido sem motel_descricao', async () => {
    const dto = plainToInstance(CreateMotelDto, {
      motel_endereco: 'Av. Brasil, 1000 - Centro',
      motel_email: 'contato@motel.com.br',
      motel_cnpj: '12.345.678/0001-99',
      motel_ativo: Status.ATIVO,
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(e => e.property === 'motel_descricao')).toBe(true);
  });

  it('inválido sem motel_endereco', async () => {
    const dto = plainToInstance(CreateMotelDto, {
      motel_descricao: 'LUVR Motel Centro',
      motel_email: 'contato@motel.com.br',
      motel_cnpj: '12.345.678/0001-99',
      motel_ativo: Status.ATIVO,
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(e => e.property === 'motel_endereco')).toBe(true);
  });

  it('inválido sem motel_email', async () => {
    const dto = plainToInstance(CreateMotelDto, {
      motel_descricao: 'LUVR Motel Centro',
      motel_endereco: 'Av. Brasil, 1000 - Centro',
      motel_cnpj: '12.345.678/0001-99',
      motel_ativo: Status.ATIVO,
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(e => e.property === 'motel_email')).toBe(true);
  });

  it('inválido sem motel_cnpj', async () => {
    const dto = plainToInstance(CreateMotelDto, {
      motel_descricao: 'LUVR Motel Centro',
      motel_endereco: 'Av. Brasil, 1000 - Centro',
      motel_email: 'contato@motel.com.br',
      motel_ativo: Status.ATIVO,
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(e => e.property === 'motel_cnpj')).toBe(true);
  });

  it('inválido sem motel_ativo', async () => {
    const dto = plainToInstance(CreateMotelDto, {
      motel_descricao: 'LUVR Motel Centro',
      motel_endereco: 'Av. Brasil, 1000 - Centro',
      motel_email: 'contato@motel.com.br',
      motel_cnpj: '12.345.678/0001-99',
      // motel_ativo ausente
    } as any);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(e => e.property === 'motel_ativo')).toBe(true);
  });

  it('inválido com email inválido', async () => {
    const dto = plainToInstance(CreateMotelDto, {
      motel_descricao: 'Desc',
      motel_endereco: 'End',
      motel_email: 'email-invalido',
      motel_cnpj: '12.345.678/0001-99',
      motel_ativo: Status.ATIVO,
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(e => e.property === 'motel_email')).toBe(true);
  });

  it('inválido com status fora do enum', async () => {
    const dto = plainToInstance(CreateMotelDto, {
      motel_descricao: 'Desc',
      motel_endereco: 'End',
      motel_email: 'contato@motel.com.br',
      motel_cnpj: '12.345.678/0001-99',
      motel_ativo: 'QUALQUER' as any,
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(e => e.property === 'motel_ativo')).toBe(true);
  });

  it('inválido com motel_descricao > 255', async () => {
    const dto = plainToInstance(CreateMotelDto, {
      motel_descricao: 'x'.repeat(256),
      motel_endereco: 'Av. Brasil, 1000 - Centro',
      motel_email: 'contato@motel.com.br',
      motel_cnpj: '12.345.678/0001-99',
      motel_ativo: Status.ATIVO,
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(e => e.property === 'motel_descricao')).toBe(true);
  });

  it('inválido com motel_endereco > 255', async () => {
    const dto = plainToInstance(CreateMotelDto, {
      motel_descricao: 'LUVR Motel Centro',
      motel_endereco: 'x'.repeat(256),
      motel_email: 'contato@motel.com.br',
      motel_cnpj: '12.345.678/0001-99',
      motel_ativo: Status.ATIVO,
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(e => e.property === 'motel_endereco')).toBe(true);
  });
});
