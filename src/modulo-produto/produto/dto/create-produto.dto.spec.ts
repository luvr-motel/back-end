import 'reflect-metadata';
import { validate } from 'class-validator';
import { CreateProdutoDto } from './create-produto.dto';

describe('CreateProdutoDto', () => {
  it('válido com todos os campos', async () => {
    const dto = new CreateProdutoDto();
    dto.produto_descricao = 'Coca-cola';
    dto.produto_custo = 1.1;
    dto.produto_venda = 3.5;
    dto.produto_marckup = 1.0;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('válido com campos opcionais ausentes (venda/marckup)', async () => {
    const dto = new CreateProdutoDto();
    dto.produto_descricao = 'Água';
    dto.produto_custo = 2.0;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('falha quando descricao está vazia', async () => {
    const dto = new CreateProdutoDto();
    dto.produto_custo = 2.0;

    const errors = await validate(dto);
    const e = errors.find(x => x.property === 'produto_descricao');
    expect(e).toBeTruthy();
  });

  it('falha quando custo ausente', async () => {
    const dto = new CreateProdutoDto();
    dto.produto_descricao = 'Suco';

    const errors = await validate(dto);
    const e = errors.find(x => x.property === 'produto_custo');
    expect(e).toBeTruthy();
  });

  it('falha quando descricao excede 255 chars (MaxLength)', async () => {
    const dto = new CreateProdutoDto();
    dto.produto_descricao = 'x'.repeat(256);
    dto.produto_custo = 1.0;

    const errors = await validate(dto);
    const e = errors.find(x => x.property === 'produto_descricao');
    expect(e).toBeTruthy();
  });

  it('falha quando custo tem mais de 2 casas decimais', async () => {
    const dto = new CreateProdutoDto();
    dto.produto_descricao = 'Café';
    dto.produto_custo = 1.123 as any;

    const errors = await validate(dto);
    const e = errors.find(x => x.property === 'produto_custo');
    expect(e).toBeTruthy();
  });

  it('falha quando venda tem mais de 2 casas decimais', async () => {
    const dto = new CreateProdutoDto();
    dto.produto_descricao = 'Chá';
    dto.produto_custo = 1.0;
    dto.produto_venda = 2.999 as any;

    const errors = await validate(dto);
    const e = errors.find(x => x.property === 'produto_venda');
    expect(e).toBeTruthy();
  });

  it('falha quando marckup tem mais de 2 casas decimais', async () => {
    const dto = new CreateProdutoDto();
    dto.produto_descricao = 'Refri';
    dto.produto_custo = 1.0;
    dto.produto_marckup = 1.234 as any;

    const errors = await validate(dto);
    const e = errors.find(x => x.property === 'produto_marckup');
    expect(e).toBeTruthy();
  });
});
