import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';
import * as argon2 from 'argon2';

import { Despesa } from 'src/modulo-despesa/despesa/entities/despesa.entity';
import { DespesaService } from 'src/modulo-despesa/despesa/despesa.service';
import { Despesatipo } from 'src/modulo-despesa/despesatipo/entities/despesatipo.entity';
import { Motel } from 'src/modulo-motel/motel/entities/motel.entity';
import { Pessoa } from 'src/modulo-pessoa/pessoa/entities/pessoa.entity';
import { Usuario, UsuarioStatus } from 'src/modulo-pessoa/usuario/entities/usuario.entity';
import { UsuarioRole } from 'src/modulo-pessoa/usuario/entities/usuario-role.enum';
import { MotelStatus } from 'src/modulo-motel/motel/entities/motel.entity';

jest.setTimeout(30000);

describe('DespesaService (integração)', () => {
  let moduleRef: TestingModule;
  let service: DespesaService;
  let despesaRepo: Repository<Despesa>;
  let despesatipoRepo: Repository<Despesatipo>;
  let motelRepo: Repository<Motel>;
  let pessoaRepo: Repository<Pessoa>;
  let usuarioRepo: Repository<Usuario>;

  // Dados de teste para relacionamentos
  let despesatipoTest: Despesatipo;
  let motelTest: Motel;
  let pessoaTest: Pessoa;
  let usuarioTest: Usuario;

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
        TypeOrmModule.forFeature([Despesa, Despesatipo, Motel, Pessoa, Usuario]),
      ],
      providers: [DespesaService],
    }).compile();

    service = moduleRef.get<DespesaService>(DespesaService);
    despesaRepo = moduleRef.get<Repository<Despesa>>(getRepositoryToken(Despesa));
    despesatipoRepo = moduleRef.get<Repository<Despesatipo>>(getRepositoryToken(Despesatipo));
    motelRepo = moduleRef.get<Repository<Motel>>(getRepositoryToken(Motel));
    pessoaRepo = moduleRef.get<Repository<Pessoa>>(getRepositoryToken(Pessoa));
    usuarioRepo = moduleRef.get<Repository<Usuario>>(getRepositoryToken(Usuario));
  });

  beforeEach(async () => {
    // Limpa todas as tabelas antes de cada teste
    await despesaRepo.createQueryBuilder().delete().from(Despesa).execute();
    await usuarioRepo.createQueryBuilder().delete().from(Usuario).execute();
    await pessoaRepo.createQueryBuilder().delete().from(Pessoa).execute();
    await motelRepo.createQueryBuilder().delete().from(Motel).execute();
    await despesatipoRepo.createQueryBuilder().delete().from(Despesatipo).execute();

    // Cria dados de teste para relacionamentos
    despesatipoTest = await despesatipoRepo.save({
      despesatipo_descricao: 'Tipo de Despesa Teste',
    });

    motelTest = await motelRepo.save({
      motel_descricao: 'Motel Teste',
      motel_endereco: 'Rua Teste, 123',
      motel_email: 'teste@motel.com',
      motel_cnpj: '12.345.678/0001-99',
      motel_ativo: MotelStatus.ATIVO,
    });

    pessoaTest = await pessoaRepo.save({
      pessoa_nome: 'Pessoa Teste',
      pessoa_cpf: '12345678901',
      pessoa_telefone: '44999998888',
      pessoa_ativo: true,
    });

    const senhaHash = await argon2.hash('senha123');
    usuarioTest = await usuarioRepo.save({
      usuario_codigo: 'USUARIO.TESTE',
      usuario_senha: senhaHash,
      usuario_ativo: UsuarioStatus.ATIVO,
      usuario_role: UsuarioRole.ADMIN,
      pessoa: pessoaTest,
    });
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it('deve criar uma despesa com todos os relacionamentos e recuperá-la (createDespesa + findAllDespesas + findDespesaId)', async () => {
    const dto = {
      despesa_descricao: 'Despesa de Teste Completa',
      despesa_parcela: 1,
      despesa_aberto: true,
      despesa_total: 1250.75,
      despesatipo_id: despesatipoTest.despesatipo_id,
      motel_id: motelTest.motel_id,
      pessoa: pessoaTest.pessoa_id,
      usuario_id: usuarioTest.usuario_id,
    } as any;

    const criada = await service.createDespesa(dto);

    expect(criada).toBeDefined();
    expect(criada.despesa_id).toBeDefined();
    expect(criada.despesa_descricao).toBe('Despesa de Teste Completa');
    expect(criada.despesa_parcela).toBe(1);
    expect(criada.despesa_aberto).toBe(true);
    expect(Number(criada.despesa_total)).toBeCloseTo(1250.75, 2);
    expect(criada.despesa_inclusao).toBeInstanceOf(Date);

    // Verifica relacionamentos
    const despesaComRelacoes = await despesaRepo.findOne({
      where: { despesa_id: criada.despesa_id },
      relations: ['despesatipo', 'motel', 'pessoa', 'usuario'],
    });

    expect(despesaComRelacoes).toBeDefined();
    expect(despesaComRelacoes!.despesatipo.despesatipo_id).toBe(despesatipoTest.despesatipo_id);
    expect(despesaComRelacoes!.motel.motel_id).toBe(motelTest.motel_id);
    expect(despesaComRelacoes!.pessoa?.pessoa_id).toBe(pessoaTest.pessoa_id);
    expect(despesaComRelacoes!.usuario?.usuario_id).toBe(usuarioTest.usuario_id);

    // Testa findAllDespesas
    const todas = await service.findAllDespesas();
    expect(todas).toHaveLength(1);
    expect(todas[0].despesa_descricao).toBe('Despesa de Teste Completa');
    expect(todas[0].despesatipo).toBeDefined();
    expect(todas[0].despesatipo.despesatipo_id).toBe(despesatipoTest.despesatipo_id);

    // Testa findDespesaId
    const { mensagem, despesa } = await service.findDespesaId(criada.despesa_id);
    expect(mensagem).toBe(`Despesa #${criada.despesa_id}`);
    expect(despesa.despesa_id).toBe(criada.despesa_id);
    expect(despesa.despesa_descricao).toBe('Despesa de Teste Completa');
    expect(despesa.despesatipo).toBeDefined();
  });

  it('deve criar uma despesa sem pessoa e sem usuario (relacionamentos opcionais)', async () => {
    const dto = {
      despesa_descricao: 'Despesa Sem Pessoa e Usuario',
      despesa_parcela: null,
      despesa_aberto: false,
      despesa_total: 500.50,
      despesatipo_id: despesatipoTest.despesatipo_id,
      motel_id: motelTest.motel_id,
    } as any;

    const criada = await service.createDespesa(dto);

    expect(criada).toBeDefined();
    expect(criada.despesa_id).toBeDefined();
    expect(criada.despesa_descricao).toBe('Despesa Sem Pessoa e Usuario');
    expect(criada.despesa_parcela).toBeNull();
    expect(criada.despesa_aberto).toBe(false);

    // Verifica que pessoa e usuario são null
    const despesaComRelacoes = await despesaRepo.findOne({
      where: { despesa_id: criada.despesa_id },
      relations: ['pessoa', 'usuario'],
    });

    expect(despesaComRelacoes!.pessoa).toBeNull();
    expect(despesaComRelacoes!.usuario).toBeNull();
  });

  it('deve criar uma despesa sem despesa_parcela (undefined) para cobrir branch do ?? null', async () => {
    const dto = {
      despesa_descricao: 'Despesa Sem Parcela',
      // despesa_parcela não é passado (undefined)
      despesa_aberto: true,
      despesa_total: 300.00,
      despesatipo_id: despesatipoTest.despesatipo_id,
      motel_id: motelTest.motel_id,
    } as any;

    const criada = await service.createDespesa(dto);

    expect(criada).toBeDefined();
    expect(criada.despesa_id).toBeDefined();
    expect(criada.despesa_descricao).toBe('Despesa Sem Parcela');
    // Quando undefined, o operador ?? null deve retornar null
    expect(criada.despesa_parcela).toBeNull();
  });

  it('deve lançar HttpException (404) ao buscar despesa inexistente', async () => {
    try {
      await service.findDespesaId(999);
      fail('Era esperado lançar HttpException 404, mas não lançou.');
    } catch (err) {
      expect(err).toBeInstanceOf(HttpException);
      const httpErr = err as HttpException;
      expect(httpErr.getStatus()).toBe(404);
      expect(httpErr.message).toBe('Despesa não encontrada');
    }
  });

  it('deve atualizar uma despesa existente (updateDespesa)', async () => {
    // Cria despesa inicial
    const criada = await service.createDespesa({
      despesa_descricao: 'Despesa Original',
      despesa_parcela: 1,
      despesa_aberto: true,
      despesa_total: 1000.00,
      despesatipo_id: despesatipoTest.despesatipo_id,
      motel_id: motelTest.motel_id,
      pessoa: pessoaTest.pessoa_id,
    } as any);

    // Atualiza despesa
    const { mensagem, despesa } = await service.updateDespesa(criada.despesa_id, {
      despesa_descricao: 'Despesa Atualizada',
      despesa_aberto: false,
      despesa_total: 1500.00,
    } as any);

    expect(mensagem).toBe(`Despesa #${criada.despesa_id} atualizada com sucesso`);
    expect(despesa.despesa_id).toBe(criada.despesa_id);
    expect(despesa.despesa_descricao).toBe('Despesa Atualizada');
    expect(despesa.despesa_aberto).toBe(false);
    expect(Number(despesa.despesa_total)).toBeCloseTo(1500.00, 2);

    // Verifica no banco
    const encontrada = await despesaRepo.findOne({
      where: { despesa_id: criada.despesa_id },
    });
    expect(encontrada!.despesa_descricao).toBe('Despesa Atualizada');
    expect(encontrada!.despesa_aberto).toBe(false);
    expect(Number(encontrada!.despesa_total)).toBeCloseTo(1500.00, 2);
  });

  it('deve manter os campos não enviados ao atualizar a despesa', async () => {
    // Cria despesa completa
    const criada = await service.createDespesa({
      despesa_descricao: 'Despesa Completa',
      despesa_parcela: 3,
      despesa_aberto: true,
      despesa_total: 2000.00,
      despesatipo_id: despesatipoTest.despesatipo_id,
      motel_id: motelTest.motel_id,
      pessoa: pessoaTest.pessoa_id,
    } as any);

    // Atualiza somente a descrição
    const { despesa } = await service.updateDespesa(criada.despesa_id, {
      despesa_descricao: 'Despesa Alterada',
    } as any);

    // Descrição mudou
    expect(despesa.despesa_descricao).toBe('Despesa Alterada');

    // Outros campos foram preservados
    expect(despesa.despesa_parcela).toBe(3);
    expect(despesa.despesa_aberto).toBe(true);
    expect(Number(despesa.despesa_total)).toBeCloseTo(2000.00, 2);
  });

  it('deve lançar HttpException (404) ao atualizar despesa inexistente', async () => {
    try {
      await service.updateDespesa(999, {
        despesa_descricao: 'Despesa Inexistente',
      } as any);
      fail('Era esperado lançar HttpException 404, mas não lançou.');
    } catch (err) {
      expect(err).toBeInstanceOf(HttpException);
      const httpErr = err as HttpException;
      expect(httpErr.getStatus()).toBe(404);
      expect(httpErr.message).toBe('Erro ao atualizar despesa');
    }
  });

  it('deve realizar soft delete da despesa (removeDespesa)', async () => {
    // Cria despesa
    const criada = await service.createDespesa({
      despesa_descricao: 'Despesa para remover',
      despesa_parcela: 1,
      despesa_aberto: true,
      despesa_total: 750.25,
      despesatipo_id: despesatipoTest.despesatipo_id,
      motel_id: motelTest.motel_id,
    } as any);

    // Remove despesa
    const resp = await service.removeDespesa(criada.despesa_id);
    expect(resp.mensagem).toBe(`Despesa #${criada.despesa_id} excluída com sucesso`);

    // Não deve aparecer na listagem normal
    const todas = await service.findAllDespesas();
    expect(todas).toHaveLength(0);

    // Mas deve existir como soft-deletada
    const encontrada = await despesaRepo.findOne({
      where: { despesa_id: criada.despesa_id },
      withDeleted: true,
    });

    expect(encontrada).toBeDefined();
    expect(encontrada!.despesa_exclusao).toBeInstanceOf(Date);
  });

  it('deve lançar HttpException (404) ao remover despesa inexistente', async () => {
    try {
      await service.removeDespesa(999);
      fail('Era esperado lançar HttpException 404, mas não lançou.');
    } catch (err) {
      expect(err).toBeInstanceOf(HttpException);
      const httpErr = err as HttpException;
      expect(httpErr.getStatus()).toBe(404);
      expect(httpErr.message).toBe('Erro ao excluir despesa');
    }
  });

  it('deve criar múltiplas despesas e listá-las corretamente', async () => {
    // Cria primeira despesa
    const despesa1 = await service.createDespesa({
      despesa_descricao: 'Despesa 1',
      despesa_parcela: 1,
      despesa_aberto: true,
      despesa_total: 100.00,
      despesatipo_id: despesatipoTest.despesatipo_id,
      motel_id: motelTest.motel_id,
    } as any);

    // Cria segunda despesa
    const despesa2 = await service.createDespesa({
      despesa_descricao: 'Despesa 2',
      despesa_parcela: 2,
      despesa_aberto: false,
      despesa_total: 200.00,
      despesatipo_id: despesatipoTest.despesatipo_id,
      motel_id: motelTest.motel_id,
      pessoa: pessoaTest.pessoa_id,
    } as any);

    // Lista todas
    const todas = await service.findAllDespesas();
    expect(todas).toHaveLength(2);

    // Verifica que ambas têm o relacionamento com despesatipo
    expect(todas[0].despesatipo).toBeDefined();
    expect(todas[1].despesatipo).toBeDefined();
    expect(todas[0].despesatipo.despesatipo_id).toBe(despesatipoTest.despesatipo_id);
    expect(todas[1].despesatipo.despesatipo_id).toBe(despesatipoTest.despesatipo_id);
  });

  it('deve preencher despesa_inclusao na criação e despesa_exclusao no soft delete', async () => {
    const criada = await service.createDespesa({
      despesa_descricao: 'Despesa Datas',
      despesa_parcela: 1,
      despesa_aberto: true,
      despesa_total: 300.00,
      despesatipo_id: despesatipoTest.despesatipo_id,
      motel_id: motelTest.motel_id,
    } as any);

    // despesa_inclusao preenchida
    expect(criada.despesa_inclusao).toBeInstanceOf(Date);

    await service.removeDespesa(criada.despesa_id);

    const encontrada = await despesaRepo.findOne({
      where: { despesa_id: criada.despesa_id },
      withDeleted: true,
    });

    expect(encontrada).toBeDefined();
    expect(encontrada!.despesa_exclusao).toBeInstanceOf(Date);
  });

  it('deve manter relacionamentos ao atualizar despesa', async () => {
    // Cria despesa com todos os relacionamentos
    const criada = await service.createDespesa({
      despesa_descricao: 'Despesa com Relacionamentos',
      despesa_parcela: 1,
      despesa_aberto: true,
      despesa_total: 500.00,
      despesatipo_id: despesatipoTest.despesatipo_id,
      motel_id: motelTest.motel_id,
      pessoa: pessoaTest.pessoa_id,
      usuario_id: usuarioTest.usuario_id,
    } as any);

    // Atualiza apenas a descrição
    await service.updateDespesa(criada.despesa_id, {
      despesa_descricao: 'Despesa Atualizada',
    } as any);

    // Verifica que os relacionamentos foram mantidos
    const despesaAtualizada = await despesaRepo.findOne({
      where: { despesa_id: criada.despesa_id },
      relations: ['despesatipo', 'motel', 'pessoa', 'usuario'],
    });

    expect(despesaAtualizada!.despesatipo.despesatipo_id).toBe(despesatipoTest.despesatipo_id);
    expect(despesaAtualizada!.motel.motel_id).toBe(motelTest.motel_id);
    expect(despesaAtualizada!.pessoa?.pessoa_id).toBe(pessoaTest.pessoa_id);
    expect(despesaAtualizada!.usuario?.usuario_id).toBe(usuarioTest.usuario_id);
  });
});