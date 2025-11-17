import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';
import { performance } from 'perf_hooks';

import { PagamentoForma } from 'src/modulo-pagamento/pagamento-forma/entities/pagamento-forma.entity';
import { PagamentoFormaService } from 'src/modulo-pagamento/pagamento-forma/pagamento-forma.service';

jest.setTimeout(30000);

describe('PagamentoFormaService (integração)', () => {
  let moduleRef: TestingModule;
  let service: PagamentoFormaService;
  let repo: Repository<PagamentoForma>;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: 'admin',
          database: 'luvr_test',
          entities: ['src/**/*.entity{.ts,.js}'],
          synchronize: true,
          dropSchema: true,
        }),
        TypeOrmModule.forFeature([PagamentoForma]),
      ],
      providers: [PagamentoFormaService],
    }).compile();

    service = moduleRef.get<PagamentoFormaService>(PagamentoFormaService);
    repo = moduleRef.get<Repository<PagamentoForma>>(getRepositoryToken(PagamentoForma));
  });

  beforeEach(async () => {
    await repo.createQueryBuilder().delete().from(PagamentoForma).execute();
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it('deve criar uma forma de pagamento e recuperá-la (createPagamentoForma + findAll + findById)', async () => {
    const dto = {
      pagamentoForma_descricao: 'PIX',
      pagamentoForma_contaDestino: 'Conta Central',
    } as any;

    const criada = await service.createPagamentoForma(dto);

    expect(criada).toBeDefined();
    expect(criada.pagamentoForma_id).toBeDefined();
    expect(criada.pagamentoForma_descricao).toBe('PIX');
    expect(criada.pagamentoForma_contaDestino).toBe('Conta Central');
    expect(criada.pagamentoforma_inclusao).toBeInstanceOf(Date);

    const todas = await service.findAllPagamentoForma();
    expect(todas).toHaveLength(1);
    expect(todas[0].pagamentoForma_descricao).toBe('PIX');

    const { mensagem, forma } = await service.findPagamentoFormaById(criada.pagamentoForma_id);
    expect(mensagem).toBe(`Forma de pagamento; ${criada.pagamentoForma_id}`);
    expect(forma.pagamentoForma_descricao).toBe('PIX');
    expect(forma.pagamentoForma_contaDestino).toBe('Conta Central');
  });

  it('deve atualizar uma forma de pagamento existente (updatePagamentoFormaById)', async () => {
    const existente = await repo.save({
      pagamentoForma_descricao: 'Cartão',
      pagamentoForma_contaDestino: 'Conta 1',
    });

    const { mensagem, forma } = await service.updatePagamentoFormaById(existente.pagamentoForma_id, {
      pagamentoForma_descricao: 'Cartão Débito',
      pagamentoForma_contaDestino: 'Conta 2',
    });

    expect(mensagem).toBe(`Forma de pagamento; ${existente.pagamentoForma_id}`);
    expect(forma.pagamentoForma_descricao).toBe('Cartão Débito');
    expect(forma.pagamentoForma_contaDestino).toBe('Conta 2');

    const salvo = await repo.findOne({ where: { pagamentoForma_id: existente.pagamentoForma_id } });
    expect(salvo!.pagamentoForma_descricao).toBe('Cartão Débito');
    expect(salvo!.pagamentoForma_contaDestino).toBe('Conta 2');
  });

  it('deve lançar HttpException ao buscar forma inexistente', async () => {
    await expect(service.findPagamentoFormaById(999)).rejects.toMatchObject({
      message: 'Forma de pagamento não encontrada',
      status: 404,
    });
  });

  it('deve lançar HttpException ao atualizar forma inexistente', async () => {
    await expect(
      service.updatePagamentoFormaById(999, {
        pagamentoForma_descricao: 'Cheque',
        pagamentoForma_contaDestino: 'Conta',
      }),
    ).rejects.toMatchObject({
      message: 'Erro ao atualizar forma de pagamento',
      status: 404,
    });
  });

  it('deve realizar soft delete da forma de pagamento (deletePagamentoForma)', async () => {
    const existente = await repo.save({
      pagamentoForma_descricao: 'Dinheiro',
      pagamentoForma_contaDestino: 'Caixa',
    });

    const resp = await service.deletePagamentoForma(existente.pagamentoForma_id);
    expect(resp.mensagem).toBe(`Forma de pagamento ${existente.pagamentoForma_id} Excluido com sucesso`);

    const removida = await repo.findOne({
      where: { pagamentoForma_id: existente.pagamentoForma_id },
      withDeleted: true,
    });

    expect(removida).toBeDefined();
    expect(removida!.pagamentoforma_exclusao).toBeInstanceOf(Date);

    const todas = await service.findAllPagamentoForma();
    expect(todas).toHaveLength(0);
  });

  it('deve criar múltiplas formas de pagamento e listá-las corretamente', async () => {
    await service.createPagamentoForma({
      pagamentoForma_descricao: 'PIX',
      pagamentoForma_contaDestino: 'Conta Digital',
    } as any);
    await service.createPagamentoForma({
      pagamentoForma_descricao: 'Cartão Crédito',
      pagamentoForma_contaDestino: 'Conta Crédito',
    } as any);
    await service.createPagamentoForma({
      pagamentoForma_descricao: 'Boleto',
      pagamentoForma_contaDestino: 'Conta Financeiro',
    } as any);

    const todas = await service.findAllPagamentoForma();
    expect(todas).toHaveLength(3);
    expect(todas.some((f) => f.pagamentoForma_descricao === 'PIX')).toBe(true);
    expect(todas.some((f) => f.pagamentoForma_descricao === 'Cartão Crédito')).toBe(true);
    expect(todas.some((f) => f.pagamentoForma_descricao === 'Boleto')).toBe(true);
  });

  it('deve manter os campos não enviados ao atualizar a forma', async () => {
    const existente = await repo.save({
      pagamentoForma_descricao: 'Transferência',
      pagamentoForma_contaDestino: 'Conta Original',
    });

    const { forma } = await service.updatePagamentoFormaById(existente.pagamentoForma_id, {
      pagamentoForma_descricao: 'Transferência Bancária',
    });

    expect(forma.pagamentoForma_descricao).toBe('Transferência Bancária');
    expect(forma.pagamentoForma_contaDestino).toBe('Conta Original');
  });

  it('deve lançar HttpException ao excluir forma inexistente', async () => {
    await expect(service.deletePagamentoForma(999)).rejects.toMatchObject({
      message: 'Erro ao excluir Forma de pagamento',
      status: 404,
    });
  });

  it('deve preencher pagamentoforma_inclusao e pagamentoforma_exclusao nas operações', async () => {
    const criada = await service.createPagamentoForma({
      pagamentoForma_descricao: 'Voucher',
      pagamentoForma_contaDestino: 'Conta Vale',
    } as any);

    expect(criada.pagamentoforma_inclusao).toBeInstanceOf(Date);
    expect(criada.pagamentoforma_exclusao).toBeNull();

    await service.deletePagamentoForma(criada.pagamentoForma_id);

    const removida = await repo.findOne({
      where: { pagamentoForma_id: criada.pagamentoForma_id },
      withDeleted: true,
    });

    expect(removida!.pagamentoforma_inclusao).toBeInstanceOf(Date);
    expect(removida!.pagamentoforma_exclusao).toBeInstanceOf(Date);
  });

  it('deve retornar lista vazia quando não existem formas cadastradas', async () => {
    const todas = await service.findAllPagamentoForma();
    expect(todas).toEqual([]);
  });

  it('deve manter descrição original quando atualizar apenas conta destino', async () => {
    const existente = await repo.save({
      pagamentoForma_descricao: 'Depósito',
      pagamentoForma_contaDestino: 'Conta A',
    });

    const { forma } = await service.updatePagamentoFormaById(existente.pagamentoForma_id, {
      pagamentoForma_contaDestino: 'Conta Nova',
    });

    expect(forma.pagamentoForma_descricao).toBe('Depósito');
    expect(forma.pagamentoForma_contaDestino).toBe('Conta Nova');
  });

  it('deve retornar entidade original ao excluir e não listar registros removidos', async () => {
    const existente = await repo.save({
      pagamentoForma_descricao: 'Cheque',
      pagamentoForma_contaDestino: 'Conta Pagamentos',
    });

    const resp = await service.deletePagamentoForma(existente.pagamentoForma_id);
    expect(resp.forma.pagamentoForma_id).toBe(existente.pagamentoForma_id);
    expect(resp.forma.pagamentoforma_exclusao).toBeNull();

    const todas = await service.findAllPagamentoForma();
    expect(todas).toHaveLength(0);
  });

  it('deve lançar HttpException ao buscar forma removida', async () => {
    const criada = await service.createPagamentoForma({
      pagamentoForma_descricao: 'Cartão Parcelado',
      pagamentoForma_contaDestino: 'Conta Parcelas',
    } as any);

    await service.deletePagamentoForma(criada.pagamentoForma_id);

    await expect(service.findPagamentoFormaById(criada.pagamentoForma_id)).rejects.toMatchObject({
      message: 'Forma de pagamento não encontrada',
      status: 404,
    });
  });

  it('deve lançar HttpException ao atualizar forma removida', async () => {
    const criada = await service.createPagamentoForma({
      pagamentoForma_descricao: 'TED',
      pagamentoForma_contaDestino: 'Conta TED',
    } as any);

    await service.deletePagamentoForma(criada.pagamentoForma_id);

    await expect(
      service.updatePagamentoFormaById(criada.pagamentoForma_id, {
        pagamentoForma_descricao: 'TED Urgente',
      }),
    ).rejects.toMatchObject({
      message: 'Erro ao atualizar forma de pagamento',
      status: 404,
    });
  });

  it('deve executar multiple updates preservando inclusão original', async () => {
    const criada = await service.createPagamentoForma({
      pagamentoForma_descricao: 'PIX Empresa',
      pagamentoForma_contaDestino: 'Conta PIX Inicial',
    } as any);

    const inclusaoOriginal = criada.pagamentoforma_inclusao;

    await service.updatePagamentoFormaById(criada.pagamentoForma_id, {
      pagamentoForma_contaDestino: 'Conta PIX Secundária',
    });
    const { forma } = await service.updatePagamentoFormaById(criada.pagamentoForma_id, {
      pagamentoForma_descricao: 'PIX Corporativo',
    });

    expect(forma.pagamentoForma_descricao).toBe('PIX Corporativo');
    expect(forma.pagamentoForma_contaDestino).toBe('Conta PIX Secundária');
    expect(forma.pagamentoforma_inclusao.getTime()).toBe(inclusaoOriginal.getTime());
  });

  it('deve excluir múltiplas formas sem afetar registros restantes', async () => {
    const formaA = await service.createPagamentoForma({
      pagamentoForma_descricao: 'Cartão A',
      pagamentoForma_contaDestino: 'Conta A',
    } as any);
    const formaB = await service.createPagamentoForma({
      pagamentoForma_descricao: 'Cartão B',
      pagamentoForma_contaDestino: 'Conta B',
    } as any);
    const formaC = await service.createPagamentoForma({
      pagamentoForma_descricao: 'Cartão C',
      pagamentoForma_contaDestino: 'Conta C',
    } as any);

    await service.deletePagamentoForma(formaA.pagamentoForma_id);
    await service.deletePagamentoForma(formaC.pagamentoForma_id);

    const todas = await service.findAllPagamentoForma();
    expect(todas).toHaveLength(1);
    expect(todas[0].pagamentoForma_id).toBe(formaB.pagamentoForma_id);
  });

  it('deve criar e consultar formas rapidamente (teste de performance)', async () => {
    const quantidade = 300;
    const inicioCriacao = performance.now();
    for (let i = 0; i < quantidade; i++) {
      await service.createPagamentoForma({
        pagamentoForma_descricao: `Forma ${i}`,
        pagamentoForma_contaDestino: `Conta ${i}`,
      } as any);
    }
    const fimCriacao = performance.now();

    const inicioConsulta = performance.now();
    const todas = await service.findAllPagamentoForma();
    const fimConsulta = performance.now();

    expect(todas).toHaveLength(quantidade);

    const duracaoCriacao = fimCriacao - inicioCriacao;
    const duracaoConsulta = fimConsulta - inicioConsulta;


    expect(duracaoCriacao).toBeLessThan(1000);
    expect(duracaoConsulta).toBeLessThan(500);
  });
});
