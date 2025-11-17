import 'reflect-metadata';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateMotelDto } from '../dto/create-motel.dto';
import { MotelStatus as Status } from '../entities/motel.entity';

describe('CreateMotelDto', () => {

  it('válido quando todos os campos obrigatórios corretos', async () => {
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
      motel_endereco: 'Endereço',
      motel_email: 'contato@motel.com.br',
      motel_cnpj: '12.345.678/0001-99',
      motel_ativo: Status.ATIVO,
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
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
  });
});
