import { Test, TestingModule } from '@nestjs/testing';
import { RegistroPontoController } from './registro-ponto.controller';
import { RegistroPontoService } from './registro-ponto.service';
import { CreateRegistroPontoDto } from './dto/create-registro-ponto.dto';
import { UpdateRegistroPontoDto } from './dto/update-registro-ponto.dto';
import { RegistroPonto } from './entities/registro-ponto.entity';

describe('RegistroPontoController', () => {
  let controller: RegistroPontoController;
  let service: jest.Mocked<RegistroPontoService>;

  beforeEach(async () => {
    const serviceMock: Partial<jest.Mocked<RegistroPontoService>> = {
      createRegistroPonto: jest.fn(),
      findAllRegistroPonto: jest.fn(),
      findRegistroPontoId: jest.fn(),
      updateRegistroPontoById: jest.fn(),
      removeRegistroPonto: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegistroPontoController],
      providers: [
        {
          provide: RegistroPontoService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<RegistroPontoController>(RegistroPontoController);
    service = module.get(
      RegistroPontoService,
    ) as jest.Mocked<RegistroPontoService>;

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve delegar para service.createRegistroPonto', async () => {
      const dto: CreateRegistroPontoDto = {
        usuario_id: 1,
        motel_id: 2,
        registroponto_entrada: true,
      };

      const registro: RegistroPonto = {
        registroponto_id: 10,
        registroponto_entrada: true,
      } as any;

      const resp = {
        mensagem: 'Registro de ponto criado com sucesso',
        registroPonto: registro,
      };

      (service.createRegistroPonto as jest.Mock).mockResolvedValue(resp);

      const result = await controller.create(dto);

      expect(service.createRegistroPonto).toHaveBeenCalledWith(dto);
      expect(result).toBe(resp);
    });
  });

  describe('findAll', () => {
    it('deve chamar service.findAllRegistroPonto', async () => {
      const lista: RegistroPonto[] = [
        { registroponto_id: 1 } as any,
        { registroponto_id: 2 } as any,
      ];

      (service.findAllRegistroPonto as jest.Mock).mockResolvedValue(lista);

      const result = await controller.findAll();

      expect(service.findAllRegistroPonto).toHaveBeenCalled();
      expect(result).toBe(lista);
    });
  });

  describe('findOne', () => {
    it('deve converter id para number e chamar service.findRegistroPontoId', async () => {
      const registro: RegistroPonto = {
        registroponto_id: 5,
        registroponto_entrada: true,
      } as any;

      const resp = {
        mensagem: 'RegistroPonto #5',
        registroPonto: registro,
      };

      (service.findRegistroPontoId as jest.Mock).mockResolvedValue(resp);

      const result = await controller.findOne('5');

      expect(service.findRegistroPontoId).toHaveBeenCalledWith(5);
      expect(result).toBe(resp);
    });
  });

  describe('update', () => {
    it('deve converter id para number e chamar service.updateRegistroPontoById', async () => {
      const dto: UpdateRegistroPontoDto = {
        registroponto_entrada: false,
      } as any;

      const registro: RegistroPonto = {
        registroponto_id: 7,
        registroponto_entrada: false,
      } as any;

      const resp = {
        mensagem: 'RegistroPonto #7 atualizado com sucesso',
        registroPonto: registro,
      };

      (service.updateRegistroPontoById as jest.Mock).mockResolvedValue(resp);

      const result = await controller.update('7', dto);

      expect(service.updateRegistroPontoById).toHaveBeenCalledWith(7, dto);
      expect(result).toBe(resp);
    });
  });

  describe('remove', () => {
    it('deve converter id para number e chamar service.removeRegistroPonto', async () => {
      const resp = { mensagem: 'Registro 9 excluido com sucesso' };

      (service.removeRegistroPonto as jest.Mock).mockResolvedValue(resp);

      const result = await controller.remove('9');

      expect(service.removeRegistroPonto).toHaveBeenCalledWith(9);
      expect(result).toBe(resp);
    });
  });
});
