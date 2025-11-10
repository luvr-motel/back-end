import 'reflect-metadata';
import { validate } from 'class-validator';
import { CreatePessoaTipoDto } from './create-pessoatipo.dto';

describe('CreatePessoaTipoDto', () => {
  it('válido com descrição até 255 chars', async () => {
    const dto = new CreatePessoaTipoDto();
    dto.pessoatipo_descricao = 'Funcionário';
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('erro quando descrição ausente', async () => {
    const dto = new CreatePessoaTipoDto();
    const errors = await validate(dto);
    const props = errors.map(e => e.property);
    expect(props).toContain('pessoatipo_descricao');
  });

  it('erro quando descrição vazia', async () => {
    const dto = new CreatePessoaTipoDto();
    dto.pessoatipo_descricao = '';
    const errors = await validate(dto);
    const props = errors.map(e => e.property);
    expect(props).toContain('pessoatipo_descricao');
  });

  it('aceita exatamente 255 chars', async () => {
    const dto = new CreatePessoaTipoDto();
    dto.pessoatipo_descricao = 'a'.repeat(255);
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('erro com 256 chars', async () => {
    const dto = new CreatePessoaTipoDto();
    dto.pessoatipo_descricao = 'a'.repeat(256);
    const errors = await validate(dto);
    const props = errors.map(e => e.property);
    expect(props).toContain('pessoatipo_descricao');
  });

  it('erro quando não é string', async () => {
    const dto = new CreatePessoaTipoDto();
    dto.pessoatipo_descricao = 123 as any;
    const errors = await validate(dto);
    const props = errors.map(e => e.property);
    expect(props).toContain('pessoatipo_descricao');
  });
});