import 'reflect-metadata';
import { validate } from 'class-validator';
import { CreateEstoqueProdutoDto } from './create-estoque-produto.dto';

describe('CreateEstoqueProdutoDto', () => {
  it('válido com valores mínimos necessários', async () => {
    const dto = new CreateEstoqueProdutoDto();
    dto.estoqueProduto_fisico = 16;
    // opcionais:
    dto.estoqueProduto_ativo = true;
    dto.produto_id = 1;
    dto.motel_id = 1;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('válido com opcionais ausentes', async () => {
    const dto = new CreateEstoqueProdutoDto();
    dto.estoqueProduto_fisico = 0; 

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('falha quando estoqueProduto_fisico ausente', async () => {
    const dto = new CreateEstoqueProdutoDto();
    const errors = await validate(dto);
    const e = errors.find(x => x.property === 'estoqueProduto_fisico');
    expect(e).toBeTruthy();
  });

  it('falha quando estoqueProduto_fisico não é inteiro', async () => {
    const dto = new CreateEstoqueProdutoDto();
    dto.estoqueProduto_fisico = 1.5 as any;
    const errors = await validate(dto);
    const e = errors.find(x => x.property === 'estoqueProduto_fisico');
    expect(e).toBeTruthy();
  });

  it('falha quando estoqueProduto_ativo não é boolean', async () => {
    const dto = new CreateEstoqueProdutoDto();
    dto.estoqueProduto_fisico = 1;
    (dto as any).estoqueProduto_ativo = 'true';
    const errors = await validate(dto);
    const e = errors.find(x => x.property === 'estoqueProduto_ativo');
    expect(e).toBeTruthy();
  });

  it('falha quando produto_id não é inteiro', async () => {
    const dto = new CreateEstoqueProdutoDto();
    dto.estoqueProduto_fisico = 1;
    (dto as any).produto_id = 1.2;
    const errors = await validate(dto);
    const e = errors.find(x => x.property === 'produto_id');
    expect(e).toBeTruthy();
  });

  it('falha quando motel_id não é inteiro', async () => {
    const dto = new CreateEstoqueProdutoDto();
    dto.estoqueProduto_fisico = 1;
    (dto as any).motel_id = 'abc';
    const errors = await validate(dto);
    const e = errors.find(x => x.property === 'motel_id');
    expect(e).toBeTruthy();
  });
});
