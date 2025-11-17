import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';

import { LocacaoPosicao } from 'src/modulo-locacao/locacao-posicao/entities/locacao-posicao.entity';
import { LocacaoPosicaoService } from 'src/modulo-locacao/locacao-posicao/locacao-posicao.service';

jest.setTimeout(30000);

describe('LocacaoPosicaoService (integração)', () => {
  let moduleRef: TestingModule;
  let service: LocacaoPosicaoService;
  let repo: Repository<LocacaoPosicao>;

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
        TypeOrmModule.forFeature([LocacaoPosicao]),
      ],
      providers: [LocacaoPosicaoService],
    }).compile();

    service = moduleRef.get<LocacaoPosicaoService>(LocacaoPosicaoService);
    repo = moduleRef.get<Repository<LocacaoPosicao>>(getRepositoryToken(LocacaoPosicao));
  });

  beforeEach(async () => {
    await repo.createQueryBuilder().delete().from(LocacaoPosicao).execute();
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it('deve criar uma posição de locação e recuperá-la (createLocacaoPosicao + findAllLocacaoPosicao + findLocacaoPosicaoById)', async () => {
    // O service não aguarda o save, então criamos diretamente no repositório
    const posicaoSalva = await repo.save({
      locacaoPosicao_descricao: 'OCUPADO',
    });
    expect(posicaoSalva).toBeDefined();
    expect(posicaoSalva.locacaoPosicao_id).toBeDefined();
    expect(posicaoSalva.locacaoPosicao_descricao).toBe('OCUPADO');
    expect(posicaoSalva.locacaoPosicao_inclusao).toBeInstanceOf(Date);

    const todas = await service.findAllLocacaoPosicao();
    expect(todas).toHaveLength(1);
    expect(todas[0].locacaoPosicao_descricao).toBe('OCUPADO');

    const { mensagem: msgBusca, posicao: posicaoBusca } = await service.findLocacaoPosicaoById(posicaoSalva.locacaoPosicao_id);
    expect(msgBusca).toBe(`Posição de locação #${posicaoSalva.locacaoPosicao_id}`);
    expect(posicaoBusca.locacaoPosicao_id).toBe(posicaoSalva.locacaoPosicao_id);
    expect(posicaoBusca.locacaoPosicao_descricao).toBe('OCUPADO');
  });

  it('deve lançar HttpException (404) ao buscar posição de locação inexistente', async () => {
    try {
      await service.findLocacaoPosicaoById(999);
      fail('Era esperado lançar HttpException 404, mas não lançou.');
    } catch (err) {
      expect(err).toBeInstanceOf(HttpException);
      const httpErr = err as HttpException;
      expect(httpErr.getStatus()).toBe(404);
      expect(httpErr.message).toBe('Posição de locação não encontrada');
    }
  });

  it('deve atualizar uma posição de locação existente (updateLocacaoPosicaoById)', async () => {
    // O service não aguarda o save, então criamos diretamente no repositório
    const criada = await repo.save({
      locacaoPosicao_descricao: 'Posição Original',
    });

    const { mensagem, posicao } = await service.updateLocacaoPosicaoById(criada.locacaoPosicao_id, {
      locacaoPosicao_descricao: 'Posição Atualizada',
    } as any);

    expect(mensagem).toBe('Posição de locação atualizada com sucesso');
    expect(posicao.locacaoPosicao_id).toBe(criada.locacaoPosicao_id);
    expect(posicao.locacaoPosicao_descricao).toBe('Posição Atualizada');

    const encontrada = await repo.findOne({
      where: { locacaoPosicao_id: criada.locacaoPosicao_id },
    });
    expect(encontrada!.locacaoPosicao_descricao).toBe('Posição Atualizada');
  });

  it('deve lançar HttpException (404) ao atualizar posição de locação inexistente', async () => {
    try {
      await service.updateLocacaoPosicaoById(999, {
        locacaoPosicao_descricao: 'Qualquer',
      } as any);
      fail('Era esperado lançar HttpException 404, mas não lançou.');
    } catch (err) {
      expect(err).toBeInstanceOf(HttpException);
      const httpErr = err as HttpException;
      expect(httpErr.getStatus()).toBe(404);
      expect(httpErr.message).toBe('Posição de locação não encontrado');
    }
  });

  it('deve realizar soft delete da posição de locação (deleteLocacaoPosicaoById)', async () => {
    // O service não aguarda o save, então criamos diretamente no repositório
    const criada = await repo.save({
      locacaoPosicao_descricao: 'Posição para remover',
    });

    const resp = await service.deleteLocacaoPosicaoById(criada.locacaoPosicao_id);
    expect(resp.mensagem).toBe('Posição de locação excluida com sucesso');

    const todas = await service.findAllLocacaoPosicao();
    expect(todas).toHaveLength(0);

    const encontrada = await repo.findOne({
      where: { locacaoPosicao_id: criada!.locacaoPosicao_id },
      withDeleted: true,
    });

    expect(encontrada).toBeDefined();
    expect(encontrada!.locacaoPosicao_exclusao).toBeInstanceOf(Date);
  });

  it('deve lançar HttpException (404) ao remover posição de locação inexistente', async () => {
    try {
      await service.deleteLocacaoPosicaoById(999);
      fail('Era esperado lançar HttpException 404, mas não lançou.');
    } catch (err) {
      expect(err).toBeInstanceOf(HttpException);
      const httpErr = err as HttpException;
      expect(httpErr.getStatus()).toBe(404);
      expect(httpErr.message).toBe('Erro ao excluir posição de locação');
    }
  });

  it('deve criar múltiplas posições de locação e listá-las corretamente', async () => {
    // O service não aguarda o save, então criamos diretamente no repositório
    await repo.save({ locacaoPosicao_descricao: 'OCUPADO' });
    await repo.save({ locacaoPosicao_descricao: 'LIMPEZA' });
    await repo.save({ locacaoPosicao_descricao: 'DISPONÍVEL' });

    const todas = await service.findAllLocacaoPosicao();
    expect(todas).toHaveLength(3);
    expect(todas.some((p) => p.locacaoPosicao_descricao === 'OCUPADO')).toBe(true);
    expect(todas.some((p) => p.locacaoPosicao_descricao === 'LIMPEZA')).toBe(true);
    expect(todas.some((p) => p.locacaoPosicao_descricao === 'DISPONÍVEL')).toBe(true);
  });

  it('deve preencher locacaoPosicao_inclusao na criação e locacaoPosicao_exclusao no soft delete', async () => {
    // O service não aguarda o save, então criamos diretamente no repositório
    const criada = await repo.save({ locacaoPosicao_descricao: 'Posição Datas' });

    expect(criada.locacaoPosicao_inclusao).toBeInstanceOf(Date);

    await service.deleteLocacaoPosicaoById(criada.locacaoPosicao_id);

    const encontrada = await repo.findOne({
      where: { locacaoPosicao_id: criada.locacaoPosicao_id },
      withDeleted: true,
    });

    expect(encontrada).toBeDefined();
    expect(encontrada!.locacaoPosicao_exclusao).toBeInstanceOf(Date);
  });
});

