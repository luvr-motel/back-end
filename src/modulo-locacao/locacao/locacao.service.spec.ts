import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';

import { LocacaoService } from './locacao.service';
import { Locacao } from './entities/locacao.entity';
import { CreateLocacaoDto } from './dto/create-locacao.dto';
import { UpdateLocacaoDto } from './dto/update-locacao.dto';
import { LocacaoPosicao } from '../locacao-posicao/entities/locacao-posicao.entity';

type RepoMock = jest.Mocked<Repository<Locacao>>;

function createRepoMock(): RepoMock {
  return {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    softDelete: jest.fn(),
    merge: jest.fn(),
    query: jest.fn(),
    manager: {
      transaction: jest.fn(),
    } as any,
  } as unknown as RepoMock;
}

describe('LocacaoService', () => {
  let service: LocacaoService;
  let repo: RepoMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocacaoService,
        {
          provide: getRepositoryToken(Locacao),
          useValue: createRepoMock(),
        },
      ],
    }).compile();

    service = module.get<LocacaoService>(LocacaoService);
    repo = module.get<RepoMock>(getRepositoryToken(Locacao));
    jest.clearAllMocks();
  });

  describe('createLocacao', () => {
    it('deve criar e salvar uma locação mapeando relacionamentos corretamente', async () => {
      const dto: CreateLocacaoDto = {
        locacao_totalItens: 1,
        locacao_totalQuarto: 2,
        locacao_totalDesconto: 0,
        locacao_totalLocacao: 3,
        quarto_id: 4,
        pessoa_id: 5,
        motel_id: 6,
        usuario_id: 7,
        locacaoPosicao_id: 8,
        locacaoTipo_id: 9,
        pagamentoforma_id: 10,
      };

      const entity = { locacao_id: 1 } as Locacao;

      (repo.create as jest.Mock).mockReturnValue(entity);
      (repo.save as jest.Mock).mockResolvedValue(entity);

      const result = await service.createLocacao(dto);

      expect(repo.create).toHaveBeenCalledWith({
        locacao_totalItens: dto.locacao_totalItens,
        locacao_totalQuarto: dto.locacao_totalQuarto,
        locacao_totalDesconto: dto.locacao_totalDesconto,
        locacao_totalLocacao: dto.locacao_totalLocacao,
        quarto: { quarto_id: dto.quarto_id },
        pessoa: { pessoa_id: dto.pessoa_id },
        motel: { motel_id: dto.motel_id },
        usuario: { usuario_id: dto.usuario_id },
        locacaoPosicao: { locacaoPosicao_id: dto.locacaoPosicao_id },
        locacaoTipo: { locacaoTipo_id: dto.locacaoTipo_id },
        pagamentoForma: { pagamentoForma_id: dto.pagamentoforma_id },
      });
      expect(repo.save).toHaveBeenCalledWith(entity);
      expect(result).toBe(entity);
    });
  });

  describe('findAllLocacoes', () => {
    it('deve retornar a lista de locações', async () => {
      const lista = [{ locacao_id: 1 }] as Locacao[];
      (repo.find as jest.Mock).mockResolvedValue(lista);

      const result = await service.findAllLocacoes();

      expect(repo.find).toHaveBeenCalled();
      expect(result).toBe(lista);
    });
  });

  describe('findLocacaoId', () => {
    it('deve retornar locação quando encontrada', async () => {
      const locacao = { locacao_id: 1 } as Locacao;
      (repo.findOne as jest.Mock).mockResolvedValue(locacao);

      const result = await service.findLocacaoId(1);

      expect(repo.findOne).toHaveBeenCalledWith({
        where: { locacao_id: 1 },
      });
      expect(result).toEqual({
        mensagem: 'Locação #1',
        locacao,
      });
    });

    it('deve lançar exceção quando não achar', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.findLocacaoId(2)).rejects.toThrow(
        'Locação não encontrada',
      );
    });
  });

  describe('updateLocacao', () => {
    it('deve lançar erro quando locação não existir', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.updateLocacao(1, {} as any)).rejects.toThrow(
        'Erro ao atualizar locação',
      );
    });

    it('deve atualizar campos simples e relacionamentos quando IDs são informados', async () => {
      const atual: Locacao = {
        locacao_id: 1,
        locacao_totalItens: 0,
        locacao_totalQuarto: 0,
        locacao_totalDesconto: 0,
        locacao_totalLocacao: 0,
      } as any;

      (repo.findOne as jest.Mock).mockResolvedValue(atual);

      const dto: UpdateLocacaoDto = {
        locacao_totalItens: 10,
        locacao_totalQuarto: 20,
        locacao_totalDesconto: 3,
        locacao_totalLocacao: 27,
        motel_id: 6,
        quarto_id: 4,
        pessoa_id: 5,
        usuario_id: 7,
        locacaoPosicao_id: 8,
        pagamentoforma_id: 10,
        locacaoTipo_id: 9,
      };

      (repo.merge as jest.Mock).mockImplementation((a, b) => ({ ...a, ...b }));
      (repo.save as jest.Mock).mockImplementation(async (v) => v as Locacao);

      const result = await service.updateLocacao(1, dto);

      expect(repo.merge).toHaveBeenCalledWith(atual, {
        locacao_totalItens: 10,
        locacao_totalQuarto: 20,
        locacao_totalDesconto: 3,
        locacao_totalLocacao: 27,
        motel: { motel_id: 6 },
        quarto: { quarto_id: 4 },
        pessoa: { pessoa_id: 5 },
        usuario: { usuario_id: 7 },
        locacaoPosicao: { locacaoPosicao_id: 8 },
        pagamentoForma: { pagamentoForma_id: 10 },
        locacaoTipo: { locacaoTipo_id: 9 },
      });

      const savedArg = (repo.save as jest.Mock).mock.calls[0][0];

      expect(savedArg).toEqual(
        expect.objectContaining({
          locacao_id: 1,
          locacao_totalItens: 10,
          locacao_totalQuarto: 20,
          locacao_totalDesconto: 3,
          locacao_totalLocacao: 27,
        }),
      );

      expect(result).toEqual({
        mensagem: 'Locação #1 Atualizada com sucesso',
        locacao: savedArg,
      });
    });
  });

  describe('deleteLocacaoById', () => {
    it('deve remover locação existente', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue({
        locacao_id: 1,
      } as Locacao);
      (repo.softDelete as jest.Mock).mockResolvedValue(undefined);

      const result = await service.deleteLocacaoById(1);

      expect(repo.findOne).toHaveBeenCalledWith({
        where: { locacao_id: 1 },
      });
      expect(repo.softDelete).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        mensagem: 'Locação 1 Excluída com sucesso',
      });
    });

    it('deve lançar erro quando locação não existir', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.deleteLocacaoById(2)).rejects.toThrow(
        'Erro ao excluir locação',
      );
    });
  });

  describe('getCheckinsTurno', () => {
    it('deve executar query com parâmetros corretos e retornar resultado', async () => {
      const rows = [{ totalQuartosOcupados: 2 }];
      (repo.query as jest.Mock).mockResolvedValue(rows);

      const result = await service.getCheckinsTurno(3, 1, 8, 2);

      expect(repo.query).toHaveBeenCalledTimes(1);
      const [sql, params] = (repo.query as jest.Mock).mock.calls[0];
      expect(typeof sql).toBe('string');
      expect(params).toEqual([2, 3, 1, 8]);
      expect(result).toBe(rows);
    });
  });

  describe('checkoutLocacao', () => {
    function setupTransaction() {
      const locacaoRepoMock = {
        findOne: jest.fn(),
        save: jest.fn(),
      };

      const posicaoRepoMock = {
        findOne: jest.fn(),
      };

      const managerMock = {
        getRepository: jest.fn((entity) => {
          if (entity === Locacao) return locacaoRepoMock;
          if (entity === LocacaoPosicao) return posicaoRepoMock;
          return null;
        }),
      };

      (repo.manager.transaction as jest.Mock).mockImplementation(
        async (cb: any) => cb(managerMock),
      );

      return { locacaoRepoMock, posicaoRepoMock, managerMock };
    }

    it('lança 404 quando locação não encontrada', async () => {
      const { locacaoRepoMock } = setupTransaction();
      (locacaoRepoMock.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.checkoutLocacao(10, 0)).rejects.toThrow(
        'Locação não encontrada',
      );
    });

    it('lança 400 quando locação já encerrada', async () => {
      const { locacaoRepoMock } = setupTransaction();

      const locacao: Locacao = {
        locacao_id: 1,
        locacao_exclusao: new Date(),
      } as any;

      (locacaoRepoMock.findOne as jest.Mock).mockResolvedValue(locacao);

      await expect(service.checkoutLocacao(1, 0)).rejects.toThrow(
        'Locação já encerrada',
      );
    });

    it('lança 400 quando tipo de locação é inválido', async () => {
      const { locacaoRepoMock } = setupTransaction();

      const locacao: Locacao = {
        locacao_id: 1,
        locacao_exclusao: null,
        locacao_inclusao: new Date(Date.now() - 60 * 60 * 1000),
        locacaoTipo: { locacoTipo_valor: null } as any,
      } as any;

      (locacaoRepoMock.findOne as jest.Mock).mockResolvedValue(locacao);

      await expect(service.checkoutLocacao(1, 0)).rejects.toThrow(
        'Tipo de locação inválido para checkout',
      );
    });

    it('lança 400 quando diffMin <= 0 (data de inclusão inválida)', async () => {
      const { locacaoRepoMock } = setupTransaction();

      const locacao: Locacao = {
        locacao_id: 1,
        locacao_exclusao: null,
        locacao_inclusao: new Date(Date.now() + 60 * 1000), // futuro
        locacaoTipo: { locacoTipo_valor: 100 } as any,
        comandas: [],
      } as any;

      (locacaoRepoMock.findOne as jest.Mock).mockResolvedValue(locacao);

      await expect(service.checkoutLocacao(1, 0)).rejects.toThrow(
        'Data de inclusão da locação é inválida',
      );
    });

    it('lança 500 quando posição LIMPEZA não está cadastrada', async () => {
      const { locacaoRepoMock, posicaoRepoMock } = setupTransaction();

      const locacao: Locacao = {
        locacao_id: 1,
        locacao_exclusao: null,
        locacao_inclusao: new Date(Date.now() - 60 * 60 * 1000),
        locacaoTipo: { locacoTipo_valor: 100 } as any,
        comandas: [],
      } as any;

      (locacaoRepoMock.findOne as jest.Mock).mockResolvedValue(locacao);
      (posicaoRepoMock.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.checkoutLocacao(1, 0)).rejects.toThrow(
        'Posição de locação "LIMPEZA" não cadastrada',
      );
    });

    it('happy path: calcula totais, muda posição para LIMPEZA e salva locação', async () => {
      const { locacaoRepoMock, posicaoRepoMock } = setupTransaction();

      const agora = new Date();
      const umaHoraAtras = new Date(agora.getTime() - 60 * 60 * 1000);

      const locacao: any = {
        locacao_id: 1,
        locacao_exclusao: null,
        locacao_inclusao: umaHoraAtras,
        locacaoTipo: { locacoTipo_valor: 100 },
        locacao_totalQuarto: 0,
        locacao_totalItens: 0,
        locacao_totalDesconto: 0,
        locacao_totalLocacao: 0,
        comandas: [
          {
            comanda_qtde: 2,
            produto: {
              produto_venda: 10,
              produto_custo: 7,
            },
          },
        ],
      };

      (locacaoRepoMock.findOne as jest.Mock).mockResolvedValue(locacao);

      const posicaoLimpeza: LocacaoPosicao = {
        locacaoPosicao_id: 99,
        locacaoPosicao_descricao: 'LIMPEZA',
      } as any;

      (posicaoRepoMock.findOne as jest.Mock).mockResolvedValue(posicaoLimpeza);

      (locacaoRepoMock.save as jest.Mock).mockImplementation(async (v) => v);

      const result = await service.checkoutLocacao(1, 5);

      expect(posicaoRepoMock.findOne).toHaveBeenCalledWith({
        where: { locacaoPosicao_descricao: 'LIMPEZA' },
      });

      expect(locacao.locacaoPosicao).toBe(posicaoLimpeza);
      expect(locacao.locacao_posicao_id).toBe(99);
      expect(locacao.locacao_totalQuarto).toBe(100); // 1h arredondada * 100
      expect(locacao.locacao_totalItens).toBe(20);   // 2 * 10
      expect(locacao.locacao_totalDesconto).toBe(5);
      expect(locacao.locacao_totalLocacao).toBe(115);
      expect(locacao.locacao_exclusao).toBeInstanceOf(Date);

      expect(locacaoRepoMock.save).toHaveBeenCalledWith(locacao);

      expect(result.mensagem).toBe(
        'Checkout da locação #1 realizado com sucesso',
      );
      expect(result.locacao).toBe(locacao);
    });
  });
});
