import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';

import { Quarto } from 'src/modulo-quarto/quarto/entities/quarto.entity';
import { QuartoService } from 'src/modulo-quarto/quarto/quarto.service';
import { QuartoTipo } from 'src/modulo-quarto/quarto_tipo/entities/quarto_tipo.entity';

jest.setTimeout(30000);

describe('QuartoService (integração)', () => {
  let moduleRef: TestingModule;
  let service: QuartoService;
  let repoQuarto: Repository<Quarto>;
  let repoQuartoTipo: Repository<QuartoTipo>;

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
    repoQuartoTipo = moduleRef.get<Repository<QuartoTipo>>(
      getRepositoryToken(QuartoTipo),
    );
  });

  beforeEach(async () => {
    await repoQuarto.createQueryBuilder().delete().from(Quarto).execute();
    await repoQuartoTipo.createQueryBuilder().delete().from(QuartoTipo).execute();
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it('deve criar um quarto e recuperá-lo (seed via repo + findAllQuartos + findQuartoId)', async () => {
    // cria um tipo de quarto válido
    const tipo = await repoQuartoTipo.save({
      quartotipoDescricao: 'Suíte Standard',
    } as any);

    // cria quarto diretamente no repo, setando a relação correta
    const criado = await repoQuarto.save({
      quarto_descricao: 'Suíte 101',
      quarto_atributos: 'Ar-condicionado, teto solar',
      quarto_ativo: true,
      quartotipo: tipo, // propriedade usada no OneToMany (quarto.quartotipo)
    } as any);

    expect(criado).toBeDefined();
    expect(criado.quarto_id).toBeDefined();
    expect(criado.quarto_descricao).toBe('Suíte 101');
    expect(criado.quarto_ativo).toBe(true);

    // lista todos via service
    const todos = await service.findAllQuartos();
    expect(todos).toHaveLength(1);
    expect(todos[0].quarto_descricao).toBe('Suíte 101');

    // busca por id via service
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

  it('deve atualizar um quarto existente (seed via repo + updateQuarto)', async () => {
    const tipo = await repoQuartoTipo.save({
      quartotipoDescricao: 'Tipo Original',
    } as any);

    const criado = await repoQuarto.save({
      quarto_descricao: 'Suíte Antiga',
      quarto_atributos: 'Ventilador de teto',
      quarto_ativo: false,
      quartotipo: tipo,
    } as any);

    const { mensagem, quarto } = await service.updateQuarto(criado.quarto_id, {
      quarto_descricao: 'Suíte Reformada',
      quarto_atributos: 'Ar-condicionado, hidro',
      quarto_ativo: true,
    } as any);

    expect(mensagem).toBe(
      `quarto #${criado.quarto_id} atualizado com sucesso`,
    );
    expect(quarto.quarto_id).toBe(criado.quarto_id);
    expect(quarto.quarto_descricao).toBe('Suíte Reformada');
    expect(quarto.quarto_atributos).toBe('Ar-condicionado, hidro');
    expect(quarto.quarto_ativo).toBe(true);

    const encontrado = await repoQuarto.findOne({
      where: { quarto_id: criado.quarto_id },
    });

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

  it('deve realizar soft delete do quarto (seed via repo + deleteQuartoById)', async () => {
    const tipo = await repoQuartoTipo.save({
      quartotipoDescricao: 'Tipo Remoção',
    } as any);

    const criado = await repoQuarto.save({
      quarto_descricao: 'Quarto para remover',
      quarto_atributos: 'Simples',
      quarto_ativo: true,
      quartotipo: tipo,
    } as any);

    const resp = await service.deleteQuartoById(criado.quarto_id);
    expect(resp.mensagem).toBe(`Quarto #${criado.quarto_id} excluído com sucesso`);

    const todos = await service.findAllQuartos();
    expect(todos).toHaveLength(0);

    const encontrado = await repoQuarto.findOne({
      where: { quarto_id: criado.quarto_id },
      withDeleted: true,
    });

    expect(encontrado).toBeDefined();
    // aqui ajusta o nome da propriedade conforme estiver na entity (quarto_exclusao / quarto_Exclusao)
    expect((encontrado as any).quarto_exclusao || (encontrado as any).quarto_Exclusao).toBeInstanceOf(Date);
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
