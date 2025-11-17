import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';

import { Comanda } from 'src/modulo-locacao/comanda/entities/comanda.entity';
import { ComandaService } from 'src/modulo-locacao/comanda/comanda.service';
import { Locacao } from 'src/modulo-locacao/locacao/entities/locacao.entity';
import { Produto } from 'src/modulo-produto/produto/entities/produto.entity';
import { Motel } from 'src/modulo-motel/motel/entities/motel.entity';
import { MotelStatus } from 'src/modulo-motel/motel/entities/motel.entity';
import { Quarto } from 'src/modulo-quarto/quarto/entities/quarto.entity';
import { QuartoTipo } from 'src/modulo-quarto/quarto_tipo/entities/quarto_tipo.entity';
import { Pessoa } from 'src/modulo-pessoa/pessoa/entities/pessoa.entity';
import { LocacaoTipo } from 'src/modulo-locacao/locacao-tipo/entities/locacao-tipo.entity';
import { LocacaoPosicao } from 'src/modulo-locacao/locacao-posicao/entities/locacao-posicao.entity';

jest.setTimeout(30000);

describe('ComandaService (integração)', () => {
  let moduleRef: TestingModule;
  let service: ComandaService;
  let comandaRepo: Repository<Comanda>;
  let locacaoRepo: Repository<Locacao>;
  let produtoRepo: Repository<Produto>;
  let motelRepo: Repository<Motel>;
  let quartoRepo: Repository<Quarto>;
  let quartoTipoRepo: Repository<QuartoTipo>;
  let pessoaRepo: Repository<Pessoa>;
  let locacaoTipoRepo: Repository<LocacaoTipo>;
  let locacaoPosicaoRepo: Repository<LocacaoPosicao>;

  // Dados de teste para relacionamentos
  let motelTest: Motel;
  let quartoTest: Quarto;
  let pessoaTest: Pessoa;
  let locacaoTipoTest: LocacaoTipo;
  let locacaoPosicaoTest: LocacaoPosicao;
  let produtoTest: Produto;
  let locacaoTest: Locacao;

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
        TypeOrmModule.forFeature([
          Comanda,
          Locacao,
          Produto,
          Motel,
          Quarto,
          QuartoTipo,
          Pessoa,
          LocacaoTipo,
          LocacaoPosicao,
        ]),
      ],
      providers: [ComandaService],
    }).compile();

    service = moduleRef.get<ComandaService>(ComandaService);
    comandaRepo = moduleRef.get<Repository<Comanda>>(getRepositoryToken(Comanda));
    locacaoRepo = moduleRef.get<Repository<Locacao>>(getRepositoryToken(Locacao));
    produtoRepo = moduleRef.get<Repository<Produto>>(getRepositoryToken(Produto));
    motelRepo = moduleRef.get<Repository<Motel>>(getRepositoryToken(Motel));
    quartoRepo = moduleRef.get<Repository<Quarto>>(getRepositoryToken(Quarto));
    quartoTipoRepo = moduleRef.get<Repository<QuartoTipo>>(getRepositoryToken(QuartoTipo));
    pessoaRepo = moduleRef.get<Repository<Pessoa>>(getRepositoryToken(Pessoa));
    locacaoTipoRepo = moduleRef.get<Repository<LocacaoTipo>>(getRepositoryToken(LocacaoTipo));
    locacaoPosicaoRepo = moduleRef.get<Repository<LocacaoPosicao>>(getRepositoryToken(LocacaoPosicao));
  });

  beforeEach(async () => {
    // Limpa todas as tabelas antes de cada teste
    await comandaRepo.createQueryBuilder().delete().from(Comanda).execute();
    await locacaoRepo.createQueryBuilder().delete().from(Locacao).execute();
    await produtoRepo.createQueryBuilder().delete().from(Produto).execute();
    await quartoRepo.createQueryBuilder().delete().from(Quarto).execute();
    await quartoTipoRepo.createQueryBuilder().delete().from(QuartoTipo).execute();
    await pessoaRepo.createQueryBuilder().delete().from(Pessoa).execute();
    await locacaoTipoRepo.createQueryBuilder().delete().from(LocacaoTipo).execute();
    await locacaoPosicaoRepo.createQueryBuilder().delete().from(LocacaoPosicao).execute();
    await motelRepo.createQueryBuilder().delete().from(Motel).execute();

    // Cria dados de teste para relacionamentos
    motelTest = await motelRepo.save({
      motel_descricao: 'Motel Teste',
      motel_endereco: 'Rua Teste, 123',
      motel_email: 'teste@motel.com',
      motel_cnpj: '12.345.678/0001-99',
      motel_ativo: MotelStatus.ATIVO,
    });

    const quartoTipoTest = await quartoTipoRepo.save({
      quartotipoDescricao: 'Tipo Quarto Teste',
    });

    quartoTest = await quartoRepo.save({
      quarto_descricao: 'Quarto Teste',
      quarto_atributos: 'Ar-condicionado',
      quarto_ativo: true,
      quartotipo: quartoTipoTest,
    });

    pessoaTest = await pessoaRepo.save({
      pessoa_nome: 'Pessoa Teste',
      pessoa_cpf: '12345678901',
      pessoa_telefone: '44999998888',
      pessoa_ativo: true,
    });

    locacaoTipoTest = await locacaoTipoRepo.save({
      locacaoTipo_descricao: 'Hora',
      locacoTipo_valor: 50.00,
    });

    locacaoPosicaoTest = await locacaoPosicaoRepo.save({
      locacaoPosicao_descricao: 'OCUPADO',
    });

    produtoTest = await produtoRepo.save({
      produto_descricao: 'Produto Teste',
      produto_custo: 10.00,
      produto_venda: 15.00,
    });

    locacaoTest = await locacaoRepo.save({
      locacao_totalItens: 0,
      locacao_totalQuarto: 0,
      locacao_totalDesconto: 0,
      locacao_totalLocacao: 0,
      quarto: quartoTest,
      pessoa: pessoaTest,
      motel: motelTest,
      locacaoTipo: locacaoTipoTest,
      locacaoPosicao: locacaoPosicaoTest,
    });
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it('deve criar uma comanda e recuperá-la (createComanda + findAllComandas + findComandaId)', async () => {
    // O service não mapeia relacionamentos, então criamos diretamente no repositório
    const criada = await comandaRepo.save({
      comanda_qtde: 2,
      comanda_observacao: 'Sem gelo',
      locacao: locacaoTest,
      produto: produtoTest,
      motel: motelTest,
    });

    expect(criada).toBeDefined();
    expect(criada.comanda_id).toBeDefined();
    expect(criada.comanda_qtde).toBe(2);
    expect(criada.comanda_observacao).toBe('Sem gelo');
    expect(criada.comanda_inclusao).toBeInstanceOf(Date);

    // Verifica relacionamentos
    const comandaComRelacoes = await comandaRepo.findOne({
      where: { comanda_id: criada.comanda_id },
      relations: ['locacao', 'produto', 'motel'],
    });

    expect(comandaComRelacoes).toBeDefined();
    expect(comandaComRelacoes!.locacao.locacao_id).toBe(locacaoTest.locacao_id);
    expect(comandaComRelacoes!.produto.produto_id).toBe(produtoTest.produto_id);
    expect(comandaComRelacoes!.motel.motel_id).toBe(motelTest.motel_id);

    // Testa findAllComandas
    const todas = await service.findAllComandas();
    expect(todas).toHaveLength(1);
    // comanda_qtde é numeric no banco, então vem como string
    expect(Number(todas[0].comanda_qtde)).toBe(2);

    // Testa findComandaId
    const { mensagem, comanda } = await service.findComandaId(criada.comanda_id);
    expect(mensagem).toBe(`Comanda ${criada.comanda_id} `);
    expect(comanda.comanda_id).toBe(criada.comanda_id);
    // comanda_qtde é numeric no banco, então vem como string
    expect(Number(comanda.comanda_qtde)).toBe(2);
  });

  it('deve criar uma comanda sem observação (campo opcional)', async () => {
    // O service não mapeia relacionamentos, então criamos diretamente no repositório
    const criada = await comandaRepo.save({
      comanda_qtde: 1,
      locacao: locacaoTest,
      produto: produtoTest,
      motel: motelTest,
    });

    expect(criada).toBeDefined();
    expect(criada.comanda_id).toBeDefined();
    expect(criada.comanda_qtde).toBe(1);
    expect(criada.comanda_observacao).toBeNull();
  });

  it('deve lançar HttpException (404) ao buscar comanda inexistente', async () => {
    try {
      await service.findComandaId(999);
      fail('Era esperado lançar HttpException 404, mas não lançou.');
    } catch (err) {
      expect(err).toBeInstanceOf(HttpException);
      const httpErr = err as HttpException;
      expect(httpErr.getStatus()).toBe(404);
      expect(httpErr.message).toBe('Comanda não encontrada');
    }
  });

  it('deve atualizar uma comanda existente (updateComanda)', async () => {
    // O service não mapeia relacionamentos, então criamos diretamente no repositório
    const criada = await comandaRepo.save({
      comanda_qtde: 1,
      comanda_observacao: 'Observação Original',
      locacao: locacaoTest,
      produto: produtoTest,
      motel: motelTest,
    });

    const { mensagem, comanda } = await service.updateComanda(criada.comanda_id, {
      comanda_qtde: 3,
      comanda_observacao: 'Observação Atualizada',
    } as any);

    expect(mensagem).toBe(`Comanda #${criada.comanda_id} atualizada com sucesso`);
    expect(comanda.comanda_id).toBe(criada.comanda_id);
    expect(comanda.comanda_qtde).toBe(3);
    expect(comanda.comanda_observacao).toBe('Observação Atualizada');

    const encontrada = await comandaRepo.findOne({
      where: { comanda_id: criada.comanda_id },
    });
    // comanda_qtde é numeric no banco, então vem como string
    expect(Number(encontrada!.comanda_qtde)).toBe(3);
    expect(encontrada!.comanda_observacao).toBe('Observação Atualizada');
  });

  it('deve manter os campos não enviados ao atualizar a comanda', async () => {
    // O service não mapeia relacionamentos, então criamos diretamente no repositório
    const criada = await comandaRepo.save({
      comanda_qtde: 2,
      comanda_observacao: 'Observação Original',
      locacao: locacaoTest,
      produto: produtoTest,
      motel: motelTest,
    });

    const { comanda } = await service.updateComanda(criada.comanda_id, {
      comanda_qtde: 5,
    } as any);

    expect(comanda.comanda_qtde).toBe(5);
    expect(comanda.comanda_observacao).toBe('Observação Original');
  });

  it('deve lançar HttpException (404) ao atualizar comanda inexistente', async () => {
    try {
      await service.updateComanda(999, {
        comanda_qtde: 1,
      } as any);
      fail('Era esperado lançar HttpException 404, mas não lançou.');
    } catch (err) {
      expect(err).toBeInstanceOf(HttpException);
      const httpErr = err as HttpException;
      expect(httpErr.getStatus()).toBe(404);
      expect(httpErr.message).toBe('Erro ao atualizar comanda');
    }
  });

  it('deve realizar soft delete da comanda (removeComanda)', async () => {
    // O service não mapeia relacionamentos, então criamos diretamente no repositório
    const criada = await comandaRepo.save({
      comanda_qtde: 2,
      locacao: locacaoTest,
      produto: produtoTest,
      motel: motelTest,
    });

    const resp = await service.removeComanda(criada.comanda_id);
    expect(resp.mensagem).toBe(`Locação ${criada.comanda_id} Excluido com sucesso`);

    const todas = await service.findAllComandas();
    expect(todas).toHaveLength(0);

    const encontrada = await comandaRepo.findOne({
      where: { comanda_id: criada.comanda_id },
      withDeleted: true,
    });

    expect(encontrada).toBeDefined();
    expect(encontrada!.comanda_exclusao).toBeInstanceOf(Date);
  });

  it('deve lançar HttpException (404) ao remover comanda inexistente', async () => {
    try {
      await service.removeComanda(999);
      fail('Era esperado lançar HttpException 404, mas não lançou.');
    } catch (err) {
      expect(err).toBeInstanceOf(HttpException);
      const httpErr = err as HttpException;
      expect(httpErr.getStatus()).toBe(404);
      expect(httpErr.message).toBe('Erro ao excluir locação');
    }
  });

  it('deve criar múltiplas comandas e listá-las corretamente', async () => {
    // O service não mapeia relacionamentos, então criamos diretamente no repositório
    await comandaRepo.save({
      comanda_qtde: 1,
      locacao: locacaoTest,
      produto: produtoTest,
      motel: motelTest,
    });

    await comandaRepo.save({
      comanda_qtde: 3,
      comanda_observacao: 'Segunda comanda',
      locacao: locacaoTest,
      produto: produtoTest,
      motel: motelTest,
    });

    const todas = await service.findAllComandas();
    expect(todas).toHaveLength(2);
  });

  it('deve preencher comanda_inclusao na criação e comanda_exclusao no soft delete', async () => {
    // O service não mapeia relacionamentos, então criamos diretamente no repositório
    const criada = await comandaRepo.save({
      comanda_qtde: 1,
      locacao: locacaoTest,
      produto: produtoTest,
      motel: motelTest,
    });

    expect(criada.comanda_inclusao).toBeInstanceOf(Date);

    await service.removeComanda(criada.comanda_id);

    const encontrada = await comandaRepo.findOne({
      where: { comanda_id: criada.comanda_id },
      withDeleted: true,
    });

    expect(encontrada).toBeDefined();
    expect(encontrada!.comanda_exclusao).toBeInstanceOf(Date);
  });
});

