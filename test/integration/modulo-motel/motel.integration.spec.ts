import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { HttpException, BadRequestException, NotFoundException } from '@nestjs/common';

import { Motel, MotelStatus } from 'src/modulo-motel/motel/entities/motel.entity';
import { MotelService } from 'src/modulo-motel/motel/motel.service';

jest.setTimeout(30000);

describe('MotelService (integração)', () => {
  let moduleRef: TestingModule;
  let service: MotelService;
  let repo: Repository<Motel>;

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
        TypeOrmModule.forFeature([Motel]),
      ],
      providers: [MotelService],
    }).compile();

    service = moduleRef.get<MotelService>(MotelService);
    repo = moduleRef.get<Repository<Motel>>(getRepositoryToken(Motel));
  });

  // limpa tabela antes de cada teste
  beforeEach(async () => {
    await repo.createQueryBuilder().delete().from(Motel).execute();
  });

  // fecha módulo ao final
  afterAll(async () => {
    await moduleRef.close();
  });

  it('deve criar um motel e recuperá-lo (createMotel + findAllMoteis + findOneMotel)', async () => {
    // cria motel
    const dto = {
      motel_descricao: 'LUVR Motel Centro',
      motel_endereco: 'Av. Brasil, 1000 - Centro',
      motel_email: 'contato@motel.com.br',
      motel_cnpj: '12.345.678/0001-99',
      motel_ativo: MotelStatus.ATIVO,
    } as any;

    const criado = await service.createMotel(dto);

    expect(criado).toBeDefined();
    expect(criado.motel_id).toBeDefined();
    expect(criado.motel_descricao).toBe('LUVR Motel Centro');
    expect(criado.motel_ativo).toBe(MotelStatus.ATIVO);

    // lista moteis
    const todos = await service.findAllMoteis();
    expect(todos).toHaveLength(1);
    expect(todos[0].motel_descricao).toBe('LUVR Motel Centro');

    // busca por id
    const encontrado = await service.findOneMotel(criado.motel_id);
    expect(encontrado.motel_id).toBe(criado.motel_id);
    expect(encontrado.motel_cnpj).toBe('12.345.678/0001-99');
  });

  it('deve lançar BadRequestException ao tentar criar motel com CNPJ duplicado', async () => {
    // cria motel inicial
    await service.createMotel({
      motel_descricao: 'Motel 1',
      motel_endereco: 'Rua A',
      motel_email: 'm1@teste.com',
      motel_cnpj: '11.111.111/0001-11',
      motel_ativo: MotelStatus.ATIVO,
    } as any);

    // tenta criar com mesmo CNPJ
    try {
      await service.createMotel({
        motel_descricao: 'Motel 2',
        motel_endereco: 'Rua B',
        motel_email: 'm2@teste.com',
        motel_cnpj: '11.111.111/0001-11',
        motel_ativo: MotelStatus.ATIVO,
      } as any);
      fail('Era esperado lançar BadRequestException, mas não lançou.');
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
      expect((err as BadRequestException).message).toBe('CNPJ já cadastrado');
    }
  });

  it('deve lançar NotFoundException ao buscar motel inexistente', async () => {
    // tenta buscar id inexistente
    try {
      await service.findOneMotel(999);
      fail('Era esperado lançar NotFoundException, mas não lançou.');
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
      expect((err as NotFoundException).message).toBe('Motel não encontrado');
    }
  });

  it('deve atualizar um motel existente (updateMotel)', async () => {
    // cria motel
    const criado = await service.createMotel({
      motel_descricao: 'Motel Original',
      motel_endereco: 'Endereço Original',
      motel_email: 'original@motel.com',
      motel_cnpj: '22.222.222/0001-22',
      motel_ativo: MotelStatus.ATIVO,
    } as any);

    // atualiza
    const atualizado = await service.updateMotel(criado.motel_id, {
      motel_descricao: 'Motel Atualizado',
      motel_endereco: 'Endereço Atualizado',
      motel_email: 'atualizado@motel.com',
      motel_ativo: MotelStatus.INATIVO,
    } as any);

    expect(atualizado.motel_id).toBe(criado.motel_id);
    expect(atualizado.motel_descricao).toBe('Motel Atualizado');
    expect(atualizado.motel_endereco).toBe('Endereço Atualizado');
    expect(atualizado.motel_email).toBe('atualizado@motel.com');
    expect(atualizado.motel_ativo).toBe(MotelStatus.INATIVO);

    // busca novamente direto no repositório
    const encontrado = await repo.findOne({
      where: { motel_id: criado.motel_id, motel_exclusao: IsNull() },
    });

    expect(encontrado).toBeDefined();
    expect(encontrado!.motel_descricao).toBe('Motel Atualizado');
  });

  it('deve lançar BadRequestException ao atualizar CNPJ para um já existente', async () => {
    // cria primeiro motel
    const m1 = await service.createMotel({
      motel_descricao: 'Motel 1',
      motel_endereco: 'Rua 1',
      motel_email: 'm1@motel.com',
      motel_cnpj: '33.333.333/0001-33',
      motel_ativo: MotelStatus.ATIVO,
    } as any);

    // cria segundo motel
    const m2 = await service.createMotel({
      motel_descricao: 'Motel 2',
      motel_endereco: 'Rua 2',
      motel_email: 'm2@motel.com',
      motel_cnpj: '44.444.444/0001-44',
      motel_ativo: MotelStatus.ATIVO,
    } as any);

    // evita warning de variável não usada
    expect(m1.motel_id).toBeDefined();

    // tenta atualizar CNPJ do segundo para o do primeiro
    try {
      await service.updateMotel(m2.motel_id, {
        motel_cnpj: '33.333.333/0001-33',
      } as any);
      fail('Era esperado lançar BadRequestException, mas não lançou.');
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
      expect((err as BadRequestException).message).toBe('CNPJ já cadastrado');
    }
  });

  it('deve realizar soft delete do motel (deleteMotel)', async () => {
    // cria motel
    const criado = await service.createMotel({
      motel_descricao: 'Motel para excluir',
      motel_endereco: 'Rua X',
      motel_email: 'excluir@motel.com',
      motel_cnpj: '55.555.555/0001-55',
      motel_ativo: MotelStatus.ATIVO,
    } as any);

    // remove motel
    const resp = await service.deleteMotel(criado.motel_id);
    expect(resp.mensagem).toBe(`Motel ${criado.motel_id} excluído com sucesso`);

    // não deve aparecer na listagem normal
    const todos = await service.findAllMoteis();
    expect(todos).toHaveLength(0);

    // mas deve existir com soft delete
    const encontrado = await repo.findOne({
      where: { motel_id: criado.motel_id },
      withDeleted: true,
    });

    expect(encontrado).toBeDefined();
    expect(encontrado!.motel_exclusao).toBeInstanceOf(Date);
  });

  it('deve lançar HttpException (404) ao excluir motel inexistente', async () => {
    // tenta excluir inexistente
    try {
      await service.deleteMotel(999);
      fail('Era esperado lançar HttpException, mas não lançou.');
    } catch (err) {
      expect(err).toBeInstanceOf(HttpException);
      const httpErr = err as HttpException;
      expect(httpErr.message).toBe('Erro ao excluir motel');
      expect(httpErr.getStatus()).toBe(404);
    }
  });
});
