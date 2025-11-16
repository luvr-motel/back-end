import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';

import { Pessoa } from 'src/modulo-pessoa/pessoa/entities/pessoa.entity';
import { PessoaService } from 'src/modulo-pessoa/pessoa/pessoa.service';

jest.setTimeout(30000);

describe('PessoaService (integração)', () => {
  let moduleRef: TestingModule;
  let service: PessoaService;
  let repo: Repository<Pessoa>;

  // inicia módulo e conecta no banco de teste
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
        TypeOrmModule.forFeature([Pessoa]),
      ],
      providers: [PessoaService],
    }).compile();

    service = moduleRef.get<PessoaService>(PessoaService);
    repo = moduleRef.get<Repository<Pessoa>>(getRepositoryToken(Pessoa));
  });

  // limpa tabela antes de cada teste
  beforeEach(async () => {
    await repo.createQueryBuilder().delete().from(Pessoa).execute();
  });

  // fecha módulo ao final
  afterAll(async () => {
    await moduleRef.close();
  });

  it('deve criar uma pessoa e recuperá-la (createPessoa + findAllPessoas + findOnePessoa)', async () => {
    // dto para criação
    const dto = {
      pessoa_nome: '   Rodrigo QA   ',
      pessoa_cpf: '12345678901',
      pessoa_telefone: '44999998888',
    } as any;

    // cria pessoa
    const criada = await service.createPessoa(dto);

    expect(criada).toBeDefined();
    expect(criada.pessoa_nome).toBe('Rodrigo QA');

    // lista pessoas
    const todas = await service.findAllPessoas();
    expect(todas).toHaveLength(1);

    // busca pessoa por id
    const { mensagem, pessoa } = await service.findOnePessoa(criada.pessoa_id);
    expect(pessoa.pessoa_id).toBe(criada.pessoa_id);
  });

  it('deve lançar HttpException (404) ao buscar pessoa inexistente', async () => {
    // tenta buscar id inexistente
    try {
      await service.findOnePessoa(999);
      fail('Era esperado lançar HttpException, mas não lançou.');
    } catch (err) {
      expect(err).toBeInstanceOf(HttpException);
      expect((err as HttpException).getStatus()).toBe(404);
    }
  });

  it('deve atualizar uma pessoa existente (updatePessoa)', async () => {
    // cria primeiro
    const criada = await service.createPessoa({
      pessoa_nome: 'Maria Original',
      pessoa_cpf: '11111111111',
      pessoa_telefone: '44911111111',
    } as any);

    // atualiza
    const { mensagem, pessoa } = await service.updatePessoa(criada.pessoa_id, {
      pessoa_nome: '  Maria Atualizada  ',
      pessoa_telefone: '44922222222',
    } as any);

    expect(mensagem).toBe(`Pessoa #${criada.pessoa_id} Atualizada com sucesso`);

    // busca novamente
    const encontrada = await repo.findOne({
      where: { pessoa_id: criada.pessoa_id },
    });

    expect(encontrada!.pessoa_nome).toBe('Maria Atualizada');
  });

  it('deve lançar HttpException (404) ao atualizar pessoa inexistente', async () => {
    // tenta atualizar id inexistente
    try {
      await service.updatePessoa(999, { pessoa_nome: 'Nome qualquer' } as any);
      fail('Era esperado lançar HttpException, mas não lançou.');
    } catch (err) {
      expect(err).toBeInstanceOf(HttpException);
      expect((err as HttpException).getStatus()).toBe(404);
    }
  });

  it('deve inativar e realizar soft delete da pessoa (removePessoa)', async () => {
    // cria pessoa
    const criada = await service.createPessoa({
      pessoa_nome: 'Pessoa para remover',
      pessoa_cpf: '22222222222',
      pessoa_telefone: '44933333333',
    } as any);

    // remove pessoa
    const resposta = await service.removePessoa(criada.pessoa_id);
    expect(resposta.mensagem).toBe(`Pessoa ${criada.pessoa_id} excluída com sucesso`);

    // busca com deleted
    const encontrada = await repo.findOne({
      where: { pessoa_id: criada.pessoa_id },
      withDeleted: true,
    });

    expect(encontrada!.pessoa_ativo).toBe(false);
    expect(encontrada!.pessoa_exclusao).toBeInstanceOf(Date);
  });

  it('deve lançar HttpException (404) ao remover pessoa inexistente', async () => {
    // tenta remover inexistente
    try {
      await service.removePessoa(999);
      fail('Era esperado lançar HttpException, mas não lançou.');
    } catch (err) {
      expect(err).toBeInstanceOf(HttpException);
      expect((err as HttpException).getStatus()).toBe(404);
    }
  });
});
