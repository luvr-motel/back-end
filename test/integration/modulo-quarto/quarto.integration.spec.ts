import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';

import { Quarto } from 'src/modulo-quarto/quarto/entities/quarto.entity';
import { QuartoService } from 'src/modulo-quarto/quarto/quarto.service';
import { QuartoTipo } from 'src/modulo-quarto/quarto_tipo/entities/quarto_tipo.entity';
import { Motel } from 'src/modulo-motel/motel/entities/motel.entity';

jest.setTimeout(30000);

describe('QuartoService (integração)', () => {
  let moduleRef: TestingModule;
  let service: QuartoService;
  let repoQuarto: Repository<Quarto>;
  let repoQuartoTipo: Repository<QuartoTipo>;

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
        TypeOrmModule.forFeature([Quarto, QuartoTipo]),
      ],
      providers: [QuartoService],
    }).compile();

    service = moduleRef.get<QuartoService>(QuartoService);
    repoQuarto = moduleRef.get<Repository<Quarto>>(getRepositoryToken(Quarto));
    repoQuartoTipo = moduleRef.get<Repository<QuartoTipo>>(getRepositoryToken(QuartoTipo));
  });

  // limpa tabelas antes de cada teste
  beforeEach(async () => {
    await repoQuarto.createQueryBuilder().delete().from(Quarto).execute();
    await repoQuartoTipo.createQueryBuilder().delete().from(QuartoTipo).execute();
  });

  // fecha módulo ao final
  afterAll(async () => {
    await moduleRef.close();
  });

  it('deve criar um quarto e recuperá-lo (createQuarto + findAllQuartos + findQuartoId)', async () => {
    // cria um tipo de quarto para atender o FK e captura o ID real
    const tipo = await repoQuartoTipo.save({
      quartotipo_descricao: 'Suíte Standard',
    } as any);

    // cria quarto usando o ID real do tipo
    const criado = await service.createQuarto({
      quarto_descricao: 'Suíte 101',
      quarto_atributos: 'Ar-condicionado, teto solar',
      quarto_ativo: true,
      quartotipo_id: tipo.quartotipo_id,
      // motel omitido (nullable)
    } as any);

    expect(criado).toBeDefined();
    expect(criado.quarto_id).toBeDefined();
    expect(criado.quarto_descricao).toBe('Suíte 101');
    expect(criado.quarto_ativo).toBe(true);
    expect(criado.quarto_inclusao).toBeInstanceOf(Date);

    // lista todos
    const todos = await service.findAllQuartos();
    expect(todos).toHaveLength(1);
    expect(todos[0].quarto_descricao).toBe('Suíte 101');

    // busca por id
    const { mensagem, quarto } = await service.findQuartoId(criado.quarto_id);
    expect(mensagem).toBe(`Quarto #${criado.quarto_id}`);
    expect(quarto.quarto_id).toBe(criado.quarto_id);
    expect(quarto.quarto_descricao).toBe('Suíte 101');
  });

  it('deve lançar HttpException (404) ao buscar quarto inexistente', async () => {
    try {
      await service.findQuartoId(999);
      fail('Era esperado lançar HttpException 404, mas não lançou.');
    } catch (err) {
      expect(err).toBeInstanceOf(HttpException);
      const httpErr = err as HttpException;
      expect(httpErr.getStatus()).toBe(404);
      expect(httpErr.message).toBe('Quarto não encontrado');
    }
  });

  it('deve atualizar um quarto existente (updateQuarto)', async () => {
    // cria tipo e pega ID real
    const tipo = await repoQuartoTipo.save({
      quartotipo_descricao: 'Tipo Original',
    } as any);

    // cria quarto
    const criado = await service.createQuarto({
      quarto_descricao: 'Suíte Antiga',
      quarto_atributos: 'Ventilador de teto',
      quarto_ativo: false,
      quartotipo_id: tipo.quartotipo_id,
    } as any);

    // atualiza alguns campos
    const { mensagem, quarto } = await service.updateQuarto(criado.quarto_id, {
      quarto_descricao: 'Suíte Reformada',
      quarto_atributos: 'Ar-condicionado, hidro',
      quarto_ativo: true,
    } as any);

    expect(mensagem).toBe(`quarto #${criado.quarto_id} atualizado com sucesso`);
    expect(quarto.quarto_id).toBe(criado.quarto_id);
    expect(quarto.quarto_descricao).toBe('Suíte Reformada');
    expect(quarto.quarto_atributos).toBe('Ar-condicionado, hidro');
    expect(quarto.quarto_ativo).toBe(true);

    // confere direto no banco
    const encontrado = await repoQuarto.findOne({ where: { quarto_id: criado.quarto_id } });
    expect(encontrado!.quarto_descricao).toBe('Suíte Reformada');
    expect(encontrado!.quarto_atributos).toBe('Ar-condicionado, hidro');
    expect(encontrado!.quarto_ativo).toBe(true);
  });

  it('deve lançar HttpException (404) ao atualizar quarto inexistente', async () => {
    try {
      await service.updateQuarto(999, {
        quarto_descricao: 'Qualquer',
      } as any);
      fail('Era esperado lançar HttpException 404, mas não lançou.');
    } catch (err) {
      expect(err).toBeInstanceOf(HttpException);
      const httpErr = err as HttpException;
      expect(httpErr.getStatus()).toBe(404);
      expect(httpErr.message).toBe('Erro ao atualizar quarto');
    }
  });

  it('deve realizar soft delete do quarto (deleteQuartoById)', async () => {
    // cria tipo
    const tipo = await repoQuartoTipo.save({
      quartotipo_descricao: 'Tipo Remoção',
    } as any);

    // cria quarto
    const criado = await service.createQuarto({
      quarto_descricao: 'Quarto para remover',
      quarto_atributos: 'Simples',
      quarto_ativo: true,
      quartotipo_id: tipo.quartotipo_id,
    } as any);

    // remove
    const resp = await service.deleteQuartoById(criado.quarto_id);
    expect(resp.mensagem).toBe(`Quarto #${criado.quarto_id} excluído com sucesso`);

    // não deve aparecer na listagem normal
    const todos = await service.findAllQuartos();
    expect(todos).toHaveLength(0);

    // mas deve existir como soft-deletado
    const encontrado = await repoQuarto.findOne({
      where: { quarto_id: criado.quarto_id },
      withDeleted: true,
    });

    expect(encontrado).toBeDefined();
    expect(encontrado!.quarto_exclusao).toBeInstanceOf(Date);
  });

  it('deve lançar HttpException (404) ao remover quarto inexistente', async () => {
    try {
      await service.deleteQuartoById(999);
      fail('Era esperado lançar HttpException 404, mas não lançou.');
    } catch (err) {
      expect(err).toBeInstanceOf(HttpException);
      const httpErr = err as HttpException;
      expect(httpErr.getStatus()).toBe(404);
      expect(httpErr.message).toBe('Erro ao excluir quarto');
    }
  });
});
