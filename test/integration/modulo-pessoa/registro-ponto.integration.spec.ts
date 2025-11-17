import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';

import { RegistroPonto } from 'src/modulo-pessoa/registro-ponto/entities/registro-ponto.entity';
import { RegistroPontoService } from 'src/modulo-pessoa/registro-ponto/registro-ponto.service';
import { Usuario } from 'src/modulo-pessoa/usuario/entities/usuario.entity';

jest.setTimeout(30000);

describe('RegistroPontoService (integração)', () => {
  let moduleRef: TestingModule;
  let service: RegistroPontoService;
  let repoRegistro: Repository<RegistroPonto>;
  let repoUsuario: Repository<Usuario>;

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
        TypeOrmModule.forFeature([RegistroPonto, Usuario]),
      ],
      providers: [RegistroPontoService],
    }).compile();

    service = moduleRef.get<RegistroPontoService>(RegistroPontoService);
    repoRegistro = moduleRef.get<Repository<RegistroPonto>>(
      getRepositoryToken(RegistroPonto),
    );
    repoUsuario = moduleRef.get<Repository<Usuario>>(
      getRepositoryToken(Usuario),
    );
  });

  beforeEach(async () => {
    await repoRegistro.createQueryBuilder().delete().from(RegistroPonto).execute();
    await repoUsuario.createQueryBuilder().delete().from(Usuario).execute();
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it('deve listar e buscar um registro de ponto existente (findAllRegistroPonto + findRegistroPontoId)', async () => {
    const usuario = await repoUsuario.save({
      usuario_codigo: 'colab01',
      usuario_nome: 'Colaborador Teste',
      usuario_role: 'recepcionista',
      usuario_senha: 'hashed:test',
      // usuario_ativo removido → vai usar o default da entity/DB
    } as any);

    const seeded = await repoRegistro.save({
      usuario,
      registroponto_entrada: true,
    } as any);

    const todos = await service.findAllRegistroPonto();
    expect(todos).toHaveLength(1);

    const salvo = todos[0];
    expect(salvo.registroponto_id).toBe(seeded.registroponto_id);
    expect(salvo.registroponto_entrada).toBe(true);

    const { mensagem, registroPonto } = await service.findRegistroPontoId(
      seeded.registroponto_id,
    );

    expect(mensagem).toBe(`RegistroPonto #${seeded.registroponto_id}`);
    expect(registroPonto.registroponto_id).toBe(seeded.registroponto_id);
    expect(registroPonto.registroponto_entrada).toBe(true);
  });

  it('deve lançar HttpException (404) ao buscar registro de ponto inexistente', async () => {
    try {
      await service.findRegistroPontoId(999);
      fail('Era esperado lançar HttpException 404, mas não lançou.');
    } catch (err) {
      expect(err).toBeInstanceOf(HttpException);
      const httpErr = err as HttpException;
      expect(httpErr.getStatus()).toBe(404);
      expect(httpErr.message).toBe('Registro de ponto não encontrado');
    }
  });

  it('deve atualizar um registro de ponto existente (updateRegistroPontoById)', async () => {
    const usuario = await repoUsuario.save({
      usuario_codigo: 'colab02',
      usuario_nome: 'Colaborador 2',
      usuario_role: 'recepcionista',
      usuario_senha: 'hashed:test2',
      // usuario_ativo removido
    } as any);

    const seeded = await repoRegistro.save({
      usuario,
      registroponto_entrada: true,
    } as any);

    const { mensagem, registroPonto } = await service.updateRegistroPontoById(
      seeded.registroponto_id,
      {
        registroponto_entrada: false,
      },
    );

    expect(mensagem).toBe(
      `RegistroPonto #${seeded.registroponto_id} atualizado com sucesso`,
    );
    expect(registroPonto.registroponto_id).toBe(seeded.registroponto_id);
    expect(registroPonto.registroponto_entrada).toBe(false);

    const encontrado = await repoRegistro.findOne({
      where: { registroponto_id: seeded.registroponto_id },
    });

    expect(encontrado!.registroponto_entrada).toBe(false);
  });

  it('deve lançar HttpException (404) ao atualizar registro de ponto inexistente', async () => {
    try {
      await service.updateRegistroPontoById(999, {
        registroponto_entrada: false,
      });
      fail('Era esperado lançar HttpException 404, mas não lançou.');
    } catch (err) {
      expect(err).toBeInstanceOf(HttpException);
      const httpErr = err as HttpException;
      expect(httpErr.getStatus()).toBe(404);
      expect(httpErr.message).toBe('Erro ao atualizar registro de ponto');
    }
  });

  it('deve realizar soft delete do registro de ponto (removeRegistroPonto)', async () => {
    const usuario = await repoUsuario.save({
      usuario_codigo: 'colab03',
      usuario_nome: 'Colaborador 3',
      usuario_role: 'recepcionista',
      usuario_senha: 'hashed:test3',
      // usuario_ativo removido
    } as any);

    const seeded = await repoRegistro.save({
      usuario,
      registroponto_entrada: true,
    } as any);

    const resp = await service.removeRegistroPonto(seeded.registroponto_id);
    expect(resp.mensagem).toBe(
      `Registro ${seeded.registroponto_id} excluido com sucesso`,
    );

    const todos = await service.findAllRegistroPonto();
    expect(todos).toHaveLength(0);

    const encontrado = await repoRegistro.findOne({
      where: { registroponto_id: seeded.registroponto_id },
      withDeleted: true,
    });

    expect(encontrado).toBeDefined();
    expect(encontrado!.registroponto_exclusao).toBeInstanceOf(Date);
  });

  it('deve lançar HttpException (404) ao remover registro de ponto inexistente', async () => {
    try {
      await service.removeRegistroPonto(999);
      fail('Era esperado lançar HttpException 404, mas não lançou.');
    } catch (err) {
      expect(err).toBeInstanceOf(HttpException);
      const httpErr = err as HttpException;
      expect(httpErr.getStatus()).toBe(404);
      expect(httpErr.message).toBe('Erro ao excluir registro de ponto');
    }
  });
});
