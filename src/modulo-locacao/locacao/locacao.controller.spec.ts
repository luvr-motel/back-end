import { Test, TestingModule } from '@nestjs/testing';
import { LocacaoController } from './locacao.controller';
import { LocacaoService } from './locacao.service';
import { CreateLocacaoDto } from './dto/create-locacao.dto';
import { UpdateLocacaoDto } from './dto/update-locacao.dto';
import { Locacao } from './entities/locacao.entity';

describe('LocacaoController', () => {
  let controller: LocacaoController;
  let service: jest.Mocked<LocacaoService>;

  beforeEach(async () => {
    const serviceMock: Partial<jest.Mocked<LocacaoService>> = {
      createLocacao: jest.fn(),
      findAllLocacoes: jest.fn(),
      findLocacaoId: jest.fn(),
      getCheckinsTurno: jest.fn(),
      updateLocacao: jest.fn(),
      deleteLocacaoById: jest.fn(),
      checkoutLocacao: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocacaoController],
      providers: [
        {
          provide: LocacaoService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<LocacaoController>(LocacaoController);
    service = module.get(LocacaoService) as jest.Mocked<LocacaoService>;

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve delegar para LocacaoService.createLocacao', async () => {
      const dto: CreateLocacaoDto = {
        locacao_totalItens: 10,
        locacao_totalQuarto: 100,
        locacao_totalDesconto: 5,
        locacao_totalLocacao: 105,
        motel_id: 1,
        quarto_id: 2,
        pessoa_id: 3,
        pagamentoforma_id: 4,
        usuario_id: 5,
        locacaoPosicao_id: 6,
        locacaoTipo_id: 7,
      };

      const locacao: Locacao = { locacao_id: 1 } as any;
      (service.createLocacao as jest.Mock).mockResolvedValue(locacao);

      const result = await controller.create(dto);

      expect(service.createLocacao).toHaveBeenCalledWith(dto);
      expect(result).toBe(locacao);
    });
  });

  describe('findAll', () => {
    it('deve chamar LocacaoService.findAllLocacoes', async () => {
      const lista: Locacao[] = [{ locacao_id: 1 } as any];
      (service.findAllLocacoes as jest.Mock).mockResolvedValue(lista);

      const result = await controller.findAll();

      expect(service.findAllLocacoes).toHaveBeenCalled();
      expect(result).toBe(lista);
    });
  });

  describe('findOne', () => {
    it('deve converter id para number e chamar LocacaoService.findLocacaoId', async () => {
      const payload = {
        mensagem: 'Locação #10',
        locacao: { locacao_id: 10 } as any,
      };

      (service.findLocacaoId as jest.Mock).mockResolvedValue(payload);

      const result = await controller.findOne('10');

      expect(service.findLocacaoId).toHaveBeenCalledWith(10);
      expect(result).toBe(payload);
    });
  });

  describe('getCheckinsTurno', () => {
    it('deve converter query params para number e chamar LocacaoService.getCheckinsTurno', async () => {
      const rows = [{ totalQuartosOcupados: 2 }];
      (service.getCheckinsTurno as jest.Mock).mockResolvedValue(rows);

      const result = await controller.getCheckinsTurno(
        '3', // usuario_id
        '1', // motel_id
        '8', // horas
        '2', // posicao
      );

      expect(service.getCheckinsTurno).toHaveBeenCalledWith(3, 1, 8, 2);
      expect(result).toBe(rows);
    });
  });

  describe('update', () => {
    it('update (primeiro @Patch): deve converter id para number e chamar updateLocacao', async () => {
      const dto: UpdateLocacaoDto = {
        locacao_totalItens: 20,
      } as any;

      const payload = {
        mensagem: 'Locação #5 Atualizada com sucesso',
        locacao: { locacao_id: 5 } as any,
      };

      (service.updateLocacao as jest.Mock).mockResolvedValue(payload);

      const result = await controller.update('5', dto);

      expect(service.updateLocacao).toHaveBeenCalledWith(5, dto);
      expect(result).toBe(payload);
    });

    it('updateLocacao (segundo @Patch): também deve chamar updateLocacao do service', async () => {
      const dto: UpdateLocacaoDto = {
        locacao_totalQuarto: 300,
      } as any;

      const payload = {
        mensagem: 'Locação #7 Atualizada com sucesso',
        locacao: { locacao_id: 7 } as any,
      };

      (service.updateLocacao as jest.Mock).mockResolvedValue(payload);

      const result = await controller.updateLocacao('7', dto);

      expect(service.updateLocacao).toHaveBeenCalledWith(7, dto);
      expect(result).toBe(payload);
    });
  });

  describe('deleteLocacaoById', () => {
    it('deve converter id para number e chamar deleteLocacaoById no service', async () => {
      const payload = {
        mensagem: 'Locação 9 Excluída com sucesso',
      };

      (service.deleteLocacaoById as jest.Mock).mockResolvedValue(payload);

      const result = await controller.deleteLocacaoById('9' as any);

      expect(service.deleteLocacaoById).toHaveBeenCalledWith(9);
      expect(result).toBe(payload);
    });
  });

  describe('checkout', () => {
    it('deve converter id e desconto e chamar checkoutLocacao com desconto informado', async () => {
      const payload = {
        mensagem: 'Checkout da locação #1 realizado com sucesso',
        locacao: { locacao_id: 1 } as any,
      };

      (service.checkoutLocacao as jest.Mock).mockResolvedValue(payload);

      const result = await controller.checkout('1', '15');

      expect(service.checkoutLocacao).toHaveBeenCalledWith(1, 15);
      expect(result).toBe(payload);
    });

    it('deve usar desconto 0 quando query param não é enviado', async () => {
      const payload = {
        mensagem: 'Checkout da locação #2 realizado com sucesso',
        locacao: { locacao_id: 2 } as any,
      };

      (service.checkoutLocacao as jest.Mock).mockResolvedValue(payload);

      const result = await controller.checkout('2');

      expect(service.checkoutLocacao).toHaveBeenCalledWith(2, 0);
      expect(result).toBe(payload);
    });
  });
});
