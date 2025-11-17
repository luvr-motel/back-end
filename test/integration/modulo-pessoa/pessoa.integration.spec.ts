import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';

import { PessoaTipo } from 'src/modulo-pessoa/pessoatipo/entities/pessoatipo.entity';
import { PessoaTipoService } from 'src/modulo-pessoa/pessoatipo/pessoatipo.service';

import { Pessoa } from 'src/modulo-pessoa/pessoa/entities/pessoa.entity';
import { PessoaService } from 'src/modulo-pessoa/pessoa/pessoa.service';

jest.setTimeout(30000);

describe('Módulo Pessoa (integração)', () => {
  let moduleRef: TestingModule;

  let pessoaTipoService: PessoaTipoService;
  let pessoaTipoRepo: Repository<PessoaTipo>;

  let pessoaService: PessoaService;
  let pessoaRepo: Repository<Pessoa>;

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
        TypeOrmModule.forFeature([PessoaTipo, Pessoa]),
      ],
      providers: [PessoaTipoService, PessoaService],
    }).compile();

    pessoaTipoService = moduleRef.get<PessoaTipoService>(PessoaTipoService);
    pessoaTipoRepo = moduleRef.get<Repository<PessoaTipo>>(
      getRepositoryToken(PessoaTipo),
    );

    pessoaService = moduleRef.get<PessoaService>(PessoaService);
    pessoaRepo = moduleRef.get<Repository<Pessoa>>(
      getRepositoryToken(Pessoa),
    );
  });

  // limpa tabelas antes de cada teste
  beforeEach(async () => {
    // ordem: primeiro quem depende (Pessoa), depois tipo (PessoaTipo)
    await pessoaRepo.createQueryBuilder().delete().from(Pessoa).execute();
    await pessoaTipoRepo.createQueryBuilder().delete().from(PessoaTipo).execute();
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  describe('PessoaTipoService (integração)', () => {
    it('deve criar um tipo de pessoa e recuperá-lo (createPessoaTipo + findAllPessoaTipos + findOnePessoaTipo)', async () => {
      const dto = {
        pessoatipo_descricao: 'Funcionário',
      } as any;

      const criado = await pessoaTipoService.createPessoaTipo(dto);

      expect(criado).toBeDefined();
      expect(criado.pessoatipo_id).toBeDefined();
      expect(criado.pessoatipo_descricao).toBe('Funcionário');
      expect(criado.pessoatipo_inclusao).toBeInstanceOf(Date);

      const todos = await pessoaTipoService.findAllPessoaTipos();
      expect(todos).toHaveLength(1);
      expect(todos[0].pessoatipo_descricao).toBe('Funcionário');

      const { mensagem, pessoatipo } =
        await pessoaTipoService.findOnePessoaTipo(criado.pessoatipo_id);

      expect(mensagem).toBe(`Tipo #${criado.pessoatipo_id}`);
      expect(pessoatipo.pessoatipo_id).toBe(criado.pessoatipo_id);
      expect(pessoatipo.pessoatipo_descricao).toBe('Funcionário');
    });

    it('deve lançar HttpException (404) ao buscar tipo inexistente', async () => {
      try {
        await pessoaTipoService.findOnePessoaTipo(999);
        fail('Era esperado lançar HttpException 404, mas não lançou.');
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        const httpErr = err as HttpException;
        expect(httpErr.getStatus()).toBe(404);
        expect(httpErr.message).toBe('Tipo não encontrado');
      }
    });

    it('deve atualizar um tipo existente (updatePessoaTipo)', async () => {
      const criado = await pessoaTipoService.createPessoaTipo({
        pessoatipo_descricao: 'Cliente',
      } as any);

      const { mensagem, pessoatipo } =
        await pessoaTipoService.updatePessoaTipo(criado.pessoatipo_id, {
          pessoatipo_descricao: 'Funcionário Interno',
        } as any);

      expect(mensagem).toBe(
        `Tipo #${criado.pessoatipo_id} Atualizado com sucesso`,
      );
      expect(pessoatipo.pessoatipo_id).toBe(criado.pessoatipo_id);
      expect(pessoatipo.pessoatipo_descricao).toBe('Funcionário Interno');

      const encontrado = await pessoaTipoRepo.findOne({
        where: { pessoatipo_id: criado.pessoatipo_id },
      });

      expect(encontrado!.pessoatipo_descricao).toBe('Funcionário Interno');
    });

    it('deve lançar HttpException (404) ao atualizar tipo inexistente', async () => {
      try {
        await pessoaTipoService.updatePessoaTipo(999, {
          pessoatipo_descricao: 'Qualquer',
        } as any);
        fail('Era esperado lançar HttpException 404, mas não lançou.');
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        const httpErr = err as HttpException;
        expect(httpErr.getStatus()).toBe(404);
        expect(httpErr.message).toBe('Erro ao atualizar tipo');
      }
    });

    it('deve realizar soft delete do tipo (removePessoaTipo)', async () => {
      const criado = await pessoaTipoService.createPessoaTipo({
        pessoatipo_descricao: 'Terceirizado',
      } as any);

      const resp = await pessoaTipoService.removePessoaTipo(
        criado.pessoatipo_id,
      );
      expect(resp.mensagem).toBe(
        `Tipo ${criado.pessoatipo_id} excluido com sucesso`,
      );

      const todos = await pessoaTipoService.findAllPessoaTipos();
      expect(todos).toHaveLength(0);

      const encontrado = await pessoaTipoRepo.findOne({
        where: { pessoatipo_id: criado.pessoatipo_id },
        withDeleted: true,
      });

      expect(encontrado).toBeDefined();
      expect(encontrado!.pessoatipo_exclusao).toBeInstanceOf(Date);
    });

    it('deve lançar HttpException (404) ao remover tipo inexistente', async () => {
      try {
        await pessoaTipoService.removePessoaTipo(999);
        fail('Era esperado lançar HttpException 404, mas não lançou.');
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        const httpErr = err as HttpException;
        expect(httpErr.getStatus()).toBe(404);
        expect(httpErr.message).toBe('Erro ao excluir tipo');
      }
    });
  });

  describe('PessoaService (integração)', () => {
    it('deve criar uma pessoa e recuperá-la (createPessoa + findAllPessoas + findOnePessoa)', async () => {
      const dto = {
        pessoa_nome: '   Rodrigo QA   ',
        pessoa_cpf: '12345678901',
        pessoa_telefone: '44999998888',
      } as any;

      const criada = await pessoaService.createPessoa(dto);

      expect(criada).toBeDefined();
      expect(criada.pessoa_id).toBeDefined();
      expect(criada.pessoa_nome).toBe('Rodrigo QA');
      expect(criada.pessoa_ativo).toBe(true);

      const todas = await pessoaService.findAllPessoas();
      expect(todas).toHaveLength(1);
      expect(todas[0].pessoa_nome).toBe('Rodrigo QA');

      const { mensagem, pessoa } = await pessoaService.findOnePessoa(
        criada.pessoa_id,
      );
      expect(mensagem).toBe(`Pessoa #${criada.pessoa_id}`);
      expect(pessoa.pessoa_id).toBe(criada.pessoa_id);
      expect(pessoa.pessoa_nome).toBe('Rodrigo QA');
    });

    it('deve lançar HttpException (404) ao buscar pessoa inexistente', async () => {
      try {
        await pessoaService.findOnePessoa(999);
        fail('Era esperado lançar HttpException, mas não lançou.');
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        const httpErr = err as HttpException;
        expect(httpErr.message).toBe('Pessoa não encontrada');
        expect(httpErr.getStatus()).toBe(404);
      }
    });

    it('deve atualizar uma pessoa existente (updatePessoa)', async () => {
      const criada = await pessoaService.createPessoa({
        pessoa_nome: 'Maria Og',
        pessoa_cpf: '11111111111',
        pessoa_telefone: '44911111111',
      } as any);

      const { mensagem, pessoa } = await pessoaService.updatePessoa(
        criada.pessoa_id,
        {
          pessoa_nome: 'Maria Atualizada',
          pessoa_telefone: '44922222222',
        } as any,
      );

      expect(mensagem).toBe(
        `Pessoa #${criada.pessoa_id} Atualizada com sucesso`,
      );
      expect(pessoa.pessoa_id).toBe(criada.pessoa_id);
      expect(pessoa.pessoa_nome).toBe('Maria Atualizada');
      expect(pessoa.pessoa_telefone).toBe('44922222222');

      const encontrada = await pessoaRepo.findOne({
        where: { pessoa_id: criada.pessoa_id },
      });
      expect(encontrada!.pessoa_nome).toBe('Maria Atualizada');
      expect(encontrada!.pessoa_telefone).toBe('44922222222');
    });

    it('deve lançar HttpException (404) ao atualizar pessoa inexistente', async () => {
      try {
        await pessoaService.updatePessoa(999, {
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
      const criada = await pessoaService.createPessoa({
        pessoa_nome: 'Pessoa Og',
        pessoa_cpf: '99999999999',
        pessoa_telefone: '44944444444',
      } as any);

      const { pessoa } = await pessoaService.updatePessoa(criada.pessoa_id, {
        pessoa_nome: 'Pessoa Alterada',
      } as any);

      expect(pessoa.pessoa_nome).toBe('Pessoa Alterada');
      expect(pessoa.pessoa_cpf).toBe('99999999999');
      expect(pessoa.pessoa_telefone).toBe('44944444444');
    });

    it('deve inativar e realizar soft delete da pessoa (removePessoa)', async () => {
      const criada = await pessoaService.createPessoa({
        pessoa_nome: 'Pessoa para remover',
        pessoa_cpf: '22222222222',
        pessoa_telefone: '44933333333',
      } as any);

      const resposta = await pessoaService.removePessoa(criada.pessoa_id);
      expect(resposta.mensagem).toBe(
        `Pessoa ${criada.pessoa_id} excluída com sucesso`,
      );

      const encontrada = await pessoaRepo.findOne({
        where: { pessoa_id: criada.pessoa_id },
        withDeleted: true,
      });

      expect(encontrada).toBeDefined();
      expect(encontrada!.pessoa_ativo).toBe(false);
      expect(encontrada!.pessoa_exclusao).toBeInstanceOf(Date);
    });

    it('deve lançar HttpException (404) ao remover pessoa inexistente', async () => {
      try {
        await pessoaService.removePessoa(999);
        fail('Era esperado lançar HttpException, mas não lançou.');
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        const httpErr = err as HttpException;
        expect(httpErr.message).toBe('Erro ao excluir pessoa');
        expect(httpErr.getStatus()).toBe(404);
      }
    });

    it('deve preencher pessoa_inclusao na criação e pessoa_exclusao no soft delete', async () => {
      const criada = await pessoaService.createPessoa({
        pessoa_nome: 'Pessoa Datas',
        pessoa_cpf: '33333333333',
        pessoa_telefone: '44955555555',
      } as any);

      expect(criada.pessoa_inclusao).toBeInstanceOf(Date);

      await pessoaService.removePessoa(criada.pessoa_id);

      const encontrada = await pessoaRepo.findOne({
        where: { pessoa_id: criada.pessoa_id },
        withDeleted: true,
      });

      expect(encontrada).toBeDefined();
      expect(encontrada!.pessoa_exclusao).toBeInstanceOf(Date);
    });
  });
});
