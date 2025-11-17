import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';

import { Quarto } from 'src/modulo-quarto/quarto/entities/quarto.entity';
import { QuartoService } from 'src/modulo-quarto/quarto/quarto.service';
import { QuartoTipo } from 'src/modulo-quarto/quarto_tipo/entities/quarto_tipo.entity';
import { QuartoTipoService } from 'src/modulo-quarto/quarto_tipo/quarto_tipo.service';

jest.setTimeout(30000);

describe('Módulo Quarto (integração)', () => {
  let moduleRef: TestingModule;

  let quartoService: QuartoService;
  let repoQuarto: Repository<Quarto>;

  let quartoTipoService: QuartoTipoService;
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
      providers: [QuartoService, QuartoTipoService],
    }).compile();

    quartoService = moduleRef.get<QuartoService>(QuartoService);
    repoQuarto = moduleRef.get<Repository<Quarto>>(getRepositoryToken(Quarto));

    quartoTipoService = moduleRef.get<QuartoTipoService>(QuartoTipoService);
    repoQuartoTipo = moduleRef.get<Repository<QuartoTipo>>(
      getRepositoryToken(QuartoTipo),
    );
  });

  // limpa tabelas antes de cada teste
  beforeEach(async () => {
    // primeiro QUARTO (filho), depois QUARTO_TIPO (pai)
    await repoQuarto.createQueryBuilder().delete().from(Quarto).execute();
    await repoQuartoTipo
      .createQueryBuilder()
      .delete()
      .from(QuartoTipo)
      .execute();
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  describe('QuartoService (integração)', () => {
    it('deve criar um quarto e recuperá-lo (seed via repo + findAllQuartos + findQuartoId)', async () => {
      const tipo = await repoQuartoTipo.save({
        quartotipoDescricao: 'Suíte Standard',
      } as any);

      const criado = await repoQuarto.save({
        quarto_descricao: 'Suíte 101',
        quarto_atributos: 'Ar-condicionado, teto solar',
        quarto_ativo: true,
        quartotipo: tipo, // relação ManyToOne
      } as any);

      expect(criado).toBeDefined();
      expect(criado.quarto_id).toBeDefined();
      expect(criado.quarto_descricao).toBe('Suíte 101');
      expect(criado.quarto_ativo).toBe(true);

      const todos = await quartoService.findAllQuartos();
      expect(todos).toHaveLength(1);
      expect(todos[0].quarto_descricao).toBe('Suíte 101');

      const { mensagem, quarto } = await quartoService.findQuartoId(
        criado.quarto_id,
      );
      expect(mensagem).toBe(`Quarto #${criado.quarto_id}`);
      expect(quarto.quarto_id).toBe(criado.quarto_id);
      expect(quarto.quarto_descricao).toBe('Suíte 101');
    });

    it('deve lançar HttpException (404) ao buscar quarto inexistente', async () => {
      try {
        await quartoService.findQuartoId(999);
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

      const { mensagem, quarto } = await quartoService.updateQuarto(
        criado.quarto_id,
        {
          quarto_descricao: 'Suíte Reformada',
          quarto_atributos: 'Ar-condicionado, hidro',
          quarto_ativo: true,
        } as any,
      );

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
        await quartoService.updateQuarto(999, {
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

      const resp = await quartoService.deleteQuartoById(criado.quarto_id);
      expect(resp.mensagem).toBe(
        `Quarto #${criado.quarto_id} excluído com sucesso`,
      );

      const todos = await quartoService.findAllQuartos();
      expect(todos).toHaveLength(0);

      const encontrado = await repoQuarto.findOne({
        where: { quarto_id: criado.quarto_id },
        withDeleted: true,
      });

      expect(encontrado).toBeDefined();
      // compatível com o nome real da coluna (quarto_exclusao ou quarto_Exclusao)
      expect(
        (encontrado as any).quarto_exclusao ||
          (encontrado as any).quarto_Exclusao,
      ).toBeInstanceOf(Date);
    });

    it('deve lançar HttpException (404) ao remover quarto inexistente', async () => {
      try {
        await quartoService.deleteQuartoById(999);
        fail('Era esperado lançar HttpException 404, mas não lançou.');
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        const httpErr = err as HttpException;
        expect(httpErr.getStatus()).toBe(404);
        expect(httpErr.message).toBe('Erro ao excluir quarto');
      }
    });
  });

  describe('QuartoTipoService (integração)', () => {
    it('deve criar um quarto_tipo e recuperá-lo (createQuartoTipo + findAllQuartoTipos + findQuartoTipoId)', async () => {
      const criado = await quartoTipoService.createQuartoTipo({
        quartotipo_descricao: 'Luxo',
      });

      expect(criado).toBeDefined();
      expect(criado.quartotipo_Id).toBeDefined();
      expect(criado.quartotipoDescricao).toBe('Luxo');

      const todos = await quartoTipoService.findAllQuartoTipos();
      expect(todos).toHaveLength(1);
      expect(todos[0].quartotipoDescricao).toBe('Luxo');

      const { mensagem, quartotipo } =
        await quartoTipoService.findQuartoTipoId(criado.quartotipo_Id);

      expect(mensagem).toBe(`Tipo de quarto #${criado.quartotipo_Id}`);
      expect(quartotipo.quartotipo_Id).toBe(criado.quartotipo_Id);
      expect(quartotipo.quartotipoDescricao).toBe('Luxo');
    });

    it('deve lançar HttpException (404) ao buscar quarto_tipo inexistente', async () => {
      try {
        await quartoTipoService.findQuartoTipoId(999);
        fail('Era esperado lançar HttpException 404, mas não lançou.');
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        const httpErr = err as HttpException;
        expect(httpErr.getStatus()).toBe(404);
        expect(httpErr.message).toBe('Tipo de quarto não encontrado');
      }
    });

    it('deve atualizar um quarto_tipo existente (updateQuartoTipo)', async () => {
      const criado = await quartoTipoService.createQuartoTipo({
        quartotipo_descricao: 'Standard',
      });

      const { mensagem, quartotipo } =
        await quartoTipoService.updateQuartoTipo(criado.quartotipo_Id, {
          quartotipo_descricao: 'Standard Plus',
        });

      expect(mensagem).toBe(
        `Tipo de quarto #${criado.quartotipo_Id} atualizado com sucesso`,
      );
      expect(quartotipo.quartotipo_Id).toBe(criado.quartotipo_Id);
      expect(quartotipo.quartotipoDescricao).toBe('Standard Plus');

      const encontrado = await repoQuartoTipo.findOne({
        where: { quartotipo_Id: criado.quartotipo_Id },
      });
      expect(encontrado!.quartotipoDescricao).toBe('Standard Plus');
    });

    it('deve lançar HttpException (404) ao atualizar quarto_tipo inexistente', async () => {
      try {
        await quartoTipoService.updateQuartoTipo(999, {
          quartotipo_descricao: 'Qualquer',
        });
        fail('Era esperado lançar HttpException 404, mas não lançou.');
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        const httpErr = err as HttpException;
        expect(httpErr.getStatus()).toBe(404);
        expect(httpErr.message).toBe('Erro ao atualizar tipo de quarto');
      }
    });

    it('deve realizar soft delete do quarto_tipo (removeQuartoTipo)', async () => {
      const criado = await quartoTipoService.createQuartoTipo({
        quartotipo_descricao: 'Tipo para remover',
      });

      const resp = await quartoTipoService.removeQuartoTipo(
        criado.quartotipo_Id,
      );
      expect(resp.mensagem).toBe(
        `Tipo de quarto #${criado.quartotipo_Id} excluído com sucesso`,
      );

      const todos = await quartoTipoService.findAllQuartoTipos();
      expect(todos).toHaveLength(0);

      const encontrado = await repoQuartoTipo.findOne({
        where: { quartotipo_Id: criado.quartotipo_Id },
        withDeleted: true,
      });

      expect(encontrado).toBeDefined();
      expect(encontrado!.quartotipo_Exclusao).toBeInstanceOf(Date);
    });

    it('deve lançar HttpException (404) ao remover quarto_tipo inexistente', async () => {
      try {
        await quartoTipoService.removeQuartoTipo(999);
        fail('Era esperado lançar HttpException 404, mas não lançou.');
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        const httpErr = err as HttpException;
        expect(httpErr.getStatus()).toBe(404);
        expect(httpErr.message).toBe('Erro ao excluir tipo de quarto');
      }
    });
  });
});
