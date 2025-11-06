import 'reflect-metadata';
import { validate } from 'class-validator';
import { CreatePessoaDto } from './create-pessoa.dto';

describe('CreatePessoaDto', () => {
  it('deve ser válido com os campos obrigatórios', async () => {
    const dto = new CreatePessoaDto();
    dto.pessoa_nome = 'Maria da Silva';
    dto.pessoa_cpf = '12345678901';
    dto.pessoa_telefone = '44999998888';
    (dto as any).pessoatipo_id = 1;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('deve acusar erro quando pessoa_nome está vazio', async () => {
    const dto = new CreatePessoaDto();
    dto.pessoa_nome = '';
    dto.pessoa_cpf = '12345678901';
    dto.pessoa_telefone = '44999998888';
    (dto as any).pessoatipo_id = 1;

    const errors = await validate(dto);
    const props = errors.map(e => e.property);
    expect(props).toContain('pessoa_nome');
  });

  it('deve acusar erro quando pessoa_nome está ausente', async () => {
    const dto = new CreatePessoaDto();
    dto.pessoa_cpf = '12345678901';
    dto.pessoa_telefone = '44999998888';
    (dto as any).pessoatipo_id = 1;

    const errors = await validate(dto);
    const props = errors.map(e => e.property);
    expect(props).toContain('pessoa_nome');
  });

  it('deve aceitar pessoa_nome com exatamente 255 caracteres', async () => {
    const dto = new CreatePessoaDto();
    dto.pessoa_nome = 'a'.repeat(255);
    dto.pessoa_cpf = '12345678901';
    dto.pessoa_telefone = '44999998888';
    (dto as any).pessoatipo_id = 1;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('deve acusar erro quando pessoa_nome excede 255 caracteres', async () => {
    const dto = new CreatePessoaDto();
    dto.pessoa_nome = 'a'.repeat(256);
    dto.pessoa_cpf = '12345678901';
    dto.pessoa_telefone = '44999998888';
    (dto as any).pessoatipo_id = 1;

    const errors = await validate(dto);
    const props = errors.map(e => e.property);
    expect(props).toContain('pessoa_nome');
  });

  it('deve acusar erro quando pessoa_nome não é string', async () => {
    const dto = new CreatePessoaDto();
    (dto as any).pessoa_nome = 123 as any; 
    dto.pessoa_cpf = '12345678901';
    dto.pessoa_telefone = '44999998888';
    (dto as any).pessoatipo_id = 1;

    const errors = await validate(dto);
    const props = errors.map(e => e.property);
    expect(props).toContain('pessoa_nome');
  });

  it('deve acusar erro quando pessoatipo_id não é inteiro', async () => {
    const dto = new CreatePessoaDto();
    dto.pessoa_nome = 'Maria';
    dto.pessoa_cpf = '12345678901';
    dto.pessoa_telefone = '44999998888';
    (dto as any).pessoatipo_id = 'x' as any;

    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'pessoatipo_id')).toBe(true);
  });
});
