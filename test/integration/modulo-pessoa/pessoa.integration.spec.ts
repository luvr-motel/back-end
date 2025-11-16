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

  beforeEach(async () => {
    await repo.createQueryBuilder().delete().from(Pessoa).execute();
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it('deve criar uma pessoa e recuperá-la (createPessoa + findAllPessoas + findOnePessoa)', async () => {
    const dto = {
      pessoa_nome: '   Rodrigo QA   ',
      pessoa_cpf: '12345678901',
      pessoa_telefone: '44999998888',
    } as any;

    const criada = await service.createPessoa(dto);

    expect(criada).toBeDefined();
    expect(criada.pessoa_id).toBeDefined();
    expect(criada.pessoa_nome).toBe('Rodrigo QA');
    expect(criada.pessoa_ativo).toBe(true);

    const todas = await service.findAllPessoas();
    expect(todas).toHaveLength(1);
    expect(todas[0].pessoa_nome).toBe('Rodrigo QA');

    const { mensagem, pessoa } = await service.findOnePessoa(criada.pessoa_id);
    expect(mensagem).toBe(`Pessoa #${criada.pessoa_id}`);
    expect(pessoa.pessoa_id).toBe(criada.pessoa_id);
    expect(pessoa.pessoa_nome).toBe('Rodrigo QA');
  });

  it('deve lançar HttpException (404) ao buscar pessoa inexistente', async () => {
    try {
      await service.findOnePessoa(999);
      fail('Era esperado lançar HttpException, mas não lançou.');
    } catch (err) {
      expect(err).toBeInstanceOf(HttpException);
      const httpErr = err as HttpException;
      expect(httpErr.message).toBe('Pessoa não encontrada');
      expect(httpErr.getStatus()).toBe(404);
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
    expect(pessoa.pessoa_id).toBe(criada.pessoa_id);
    expect(pessoa.pessoa_nome).toBe('Maria Atualizada');
    expect(pessoa.pessoa_telefone).toBe('44922222222');

    // confere direto no repositório / banco
    const encontrada = await repo.findOne({
      where: { pessoa_id: criada.pessoa_id },
    });
    expect(encontrada!.pessoa_nome).toBe('Maria Atualizada');
    expect(encontrada!.pessoa_telefone).toBe('44922222222');
  });

  it('deve lançar HttpException (404) ao atualizar pessoa inexistente', async () => {
    try {
      await service.updatePessoa(999, {
        pessoa_nome: 'Nome qualquer',
      } as any);
      fail('Era esperado lançar HttpException, mas não lançou.');
    } catch (err) {
      expect(err).toBeInstanceOf(HttpException);
      const httpErr = err as HttpException;
      expect(httpErr.message).toBe('Erro ao atualizar pessoa');
      expect(httpErr.getStatus()).toBe(404);
    }
  });

  it('deve manter os campos não enviados ao atualizar a pessoa', async () => {
    // cria uma pessoa completa
    const criada = await service.createPessoa({
      pessoa_nome: 'Pessoa Original',
      pessoa_cpf: '99999999999',
      pessoa_telefone: '44944444444',
    } as any);

    // atualiza somente o nome
    const { pessoa } = await service.updatePessoa(criada.pessoa_id, {
      pessoa_nome: 'Pessoa Alterada',
      // sem cpf, sem telefone
    } as any);

    // nome mudou
    expect(pessoa.pessoa_nome).toBe('Pessoa Alterada');

    // cpf e telefone foram preservados
    expect(pessoa.pessoa_cpf).toBe('99999999999');
    expect(pessoa.pessoa_telefone).toBe('44944444444');
  });

  it('deve inativar e realizar soft delete da pessoa (removePessoa)', async () => {
    // cria pessoa
    const criada = await service.createPessoa({
      pessoa_nome: 'Pessoa para remover',
      pessoa_cpf: '22222222222',
      pessoa_telefone: '44933333333',
    } as any);

    const resposta = await service.removePessoa(criada.pessoa_id);
    expect(resposta.mensagem).toBe(
      `Pessoa ${criada.pessoa_id} excluída com sucesso`,
    );

    // busca inclusive registros deletados
    const encontrada = await repo.findOne({
      where: { pessoa_id: criada.pessoa_id },
      withDeleted: true,
    });

    expect(encontrada).toBeDefined();
    expect(encontrada!.pessoa_ativo).toBe(false);
    expect(encontrada!.pessoa_exclusao).toBeInstanceOf(Date);
  });

  it('deve lançar HttpException (404) ao remover pessoa inexistente', async () => {
    try {
      await service.removePessoa(999);
      fail('Era esperado lançar HttpException, mas não lançou.');
    } catch (err) {
      expect(err).toBeInstanceOf(HttpException);
      const httpErr = err as HttpException;
      expect(httpErr.message).toBe('Erro ao excluir pessoa');
      expect(httpErr.getStatus()).toBe(404);
    }
  });

  it('deve preencher pessoa_inclusao na criação e pessoa_exclusao no soft delete', async () => {
    const criada = await service.createPessoa({
      pessoa_nome: 'Pessoa Datas',
      pessoa_cpf: '33333333333',
      pessoa_telefone: '44955555555',
    } as any);

    // pessoa_inclusao preenchida
    expect(criada.pessoa_inclusao).toBeInstanceOf(Date);

    await service.removePessoa(criada.pessoa_id);

    const encontrada = await repo.findOne({
      where: { pessoa_id: criada.pessoa_id },
      withDeleted: true,
    });

    expect(encontrada).toBeDefined();
    expect(encontrada!.pessoa_exclusao).toBeInstanceOf(Date);
  });
});
