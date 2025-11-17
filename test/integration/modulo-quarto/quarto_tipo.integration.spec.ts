import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';

import { QuartoTipo } from 'src/modulo-quarto/quarto_tipo/entities/quarto_tipo.entity';
import { QuartoTipoService } from 'src/modulo-quarto/quarto_tipo/quarto_tipo.service';

jest.setTimeout(30000);

describe('QuartoTipoService (integração)', () => {
  let moduleRef: TestingModule;
  let service: QuartoTipoService;
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
        TypeOrmModule.forFeature([QuartoTipo]),
      ],
      providers: [QuartoTipoService],
    }).compile();

    service = moduleRef.get<QuartoTipoService>(QuartoTipoService);
    repoQuartoTipo = moduleRef.get<Repository<QuartoTipo>>(
      getRepositoryToken(QuartoTipo),
    );
  });

  beforeEach(async () => {
    await repoQuartoTipo.createQueryBuilder().delete().from(QuartoTipo).execute();
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it('deve criar um quarto_tipo e recuperá-lo (createQuartoTipo + findAllQuartoTipos + findQuartoTipoId)', async () => {
    const criado = await service.createQuartoTipo({
      quartotipo_descricao: 'Luxo',
    });

    expect(criado).toBeDefined();
    expect(criado.quartotipo_Id).toBeDefined();
    expect(criado.quartotipoDescricao).toBe('Luxo');

    const todos = await service.findAllQuartoTipos();
    expect(todos).toHaveLength(1);
    expect(todos[0].quartotipoDescricao).toBe('Luxo');

    const { mensagem, quartotipo } = await service.findQuartoTipoId(
      criado.quartotipo_Id,
    );

    expect(mensagem).toBe(`Tipo de quarto #${criado.quartotipo_Id}`);
    expect(quartotipo.quartotipo_Id).toBe(criado.quartotipo_Id);
    expect(quartotipo.quartotipoDescricao).toBe('Luxo');
  });

  it('deve lançar HttpException (404) ao buscar quarto_tipo inexistente', async () => {
    try {
      await service.findQuartoTipoId(999);
      fail('Era esperado lançar HttpException 404, mas não lançou.');
    } catch (err) {
      expect(err).toBeInstanceOf(HttpException);
      const httpErr = err as HttpException;
      expect(httpErr.getStatus()).toBe(404);
      expect(httpErr.message).toBe('Tipo de quarto não encontrado');
    }
  });

  it('deve atualizar um quarto_tipo existente (updateQuartoTipo)', async () => {
    const criado = await service.createQuartoTipo({
      quartotipo_descricao: 'Standard',
    });

    const { mensagem, quartotipo } = await service.updateQuartoTipo(
      criado.quartotipo_Id,
      {
        quartotipo_descricao: 'Standard Plus',
      },
    );

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
      await service.updateQuartoTipo(999, {
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
    const criado = await service.createQuartoTipo({
      quartotipo_descricao: 'Tipo para remover',
    });

    const resp = await service.removeQuartoTipo(criado.quartotipo_Id);
    expect(resp.mensagem).toBe(
      `Tipo de quarto #${criado.quartotipo_Id} excluído com sucesso`,
    );

    const todos = await service.findAllQuartoTipos();
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
      await service.removeQuartoTipo(999);
      fail('Era esperado lançar HttpException 404, mas não lançou.');
    } catch (err) {
      expect(err).toBeInstanceOf(HttpException);
      const httpErr = err as HttpException;
      expect(httpErr.getStatus()).toBe(404);
      expect(httpErr.message).toBe('Erro ao excluir tipo de quarto');
    }
  });
});
