import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PessoaTipoController } from './pessoatipo.controller';
import { PessoaTipoService } from './pessoatipo.service';
import { CreatePessoaTipoDto } from './dto/create-pessoatipo.dto';
import { UpdatePessoaTipoDto } from './dto/update-pessoatipo.dto';
import { PessoaTipo } from './entities/pessoatipo.entity';

describe('PessoaTipoController', () => {
  let controller: PessoaTipoController;
  let service: jest.Mocked<PessoaTipoService>;

  const tipoFake: PessoaTipo = { pessoatipo_id: 1, pessoatipo_descricao: 'Cliente' } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PessoaTipoController],
      providers: [
        {
          provide: PessoaTipoService,
          useValue: {
            createPessoaTipo: jest.fn(),
            findAllPessoaTipos: jest.fn(),
            findOnePessoaTipo: jest.fn(),
            updatePessoaTipo: jest.fn(),
            removePessoaTipo: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(PessoaTipoController);
    service = module.get(PessoaTipoService) as any;
    jest.clearAllMocks();
  });

  describe('POST /pessoatipo', () => {
    it('sucesso', async () => {
      const dto = { pessoatipo_descricao: 'Cliente' } as CreatePessoaTipoDto;
      service.createPessoaTipo.mockResolvedValue(tipoFake);

      const res = await controller.createPessoaTipo(dto);
      expect(service.createPessoaTipo).toHaveBeenCalledWith(dto);
      expect(res).toBe(tipoFake);
    });

    it('erro (propaga)', async () => {
      service.createPessoaTipo.mockRejectedValue(
        new HttpException('bad', HttpStatus.BAD_REQUEST),
      );
      await expect(controller.createPessoaTipo({} as any)).rejects.toThrow(HttpException);
    });
  });

  describe('GET /pessoatipo', () => {
    it('sucesso', async () => {
      service.findAllPessoaTipos.mockResolvedValue([tipoFake]);
      const res = await controller.findAllPessoaTipos();
      expect(res).toEqual([tipoFake]);
    });

    it('erro (propaga)', async () => {
      service.findAllPessoaTipos.mockRejectedValue(
        new HttpException('oops', HttpStatus.INTERNAL_SERVER_ERROR),
      );
      await expect(controller.findAllPessoaTipos()).rejects.toThrow(HttpException);
    });
  });

  describe('GET /pessoatipo/:id', () => {
    it('sucesso', async () => {
      service.findOnePessoaTipo.mockResolvedValue({ mensagem: 'ok', pessoatipo: tipoFake });
      const res = await controller.findOnePessoaTipo(1);
      expect(service.findOnePessoaTipo).toHaveBeenCalledWith(1);
      expect(res.pessoatipo).toBe(tipoFake);
    });

    it('erro (não encontrado)', async () => {
      service.findOnePessoaTipo.mockRejectedValue(
        new HttpException('nf', HttpStatus.NOT_FOUND),
      );
      await expect(controller.findOnePessoaTipo(999)).rejects.toThrow(HttpException);
    });
  });

  describe('PATCH /pessoatipo/:id', () => {
    it('sucesso', async () => {
      service.updatePessoaTipo.mockResolvedValue({ mensagem: 'ok', pessoatipo: tipoFake });
      const dto = { pessoatipo_descricao: 'VIP' } as UpdatePessoaTipoDto;
      const res = await controller.updatePessoaTipo(1, dto);
      expect(service.updatePessoaTipo).toHaveBeenCalledWith(1, dto);
      expect(res.pessoatipo).toBe(tipoFake);
    });

    it('erro (propaga)', async () => {
      service.updatePessoaTipo.mockRejectedValue(
        new HttpException('bad', HttpStatus.BAD_REQUEST),
      );
      await expect(controller.updatePessoaTipo(1, {} as any)).rejects.toThrow(HttpException);
    });
  });

  describe('DELETE /pessoatipo/:id', () => {
    it('sucesso', async () => {
      service.removePessoaTipo.mockResolvedValue({ mensagem: 'removido' } as any);
      const res = await controller.removePessoaTipo(1);
      expect(service.removePessoaTipo).toHaveBeenCalledWith(1);
      expect(res).toEqual({ mensagem: 'removido' });
    });

    it('erro (propaga)', async () => {
      service.removePessoaTipo.mockRejectedValue(
        new HttpException('nf', HttpStatus.NOT_FOUND),
      );
      await expect(controller.removePessoaTipo(123)).rejects.toThrow(HttpException);
    });
  });
});
