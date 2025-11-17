// src/modulo-pessoa/pessoa/pessoa.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PessoaController } from './pessoa.controller';
import { PessoaService } from './pessoa.service';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { Pessoa } from './entities/pessoa.entity';

describe('PessoaController', () => {
  let controller: PessoaController;
  let service: jest.Mocked<PessoaService>;

  const pessoaFake: Pessoa = {
    pessoa_id: 1 as any,
    pessoa_nome: 'Rodrigo' as any,
  } as Pessoa;

  const serviceMock: jest.Mocked<PessoaService> = {
    createPessoa: jest.fn(),
    findAllPessoas: jest.fn(),
    findOnePessoa: jest.fn(),
    updatePessoa: jest.fn(),
    removePessoa: jest.fn(),
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PessoaController],
      providers: [{ provide: PessoaService, useValue: serviceMock }],
    }).compile();

    controller = module.get<PessoaController>(PessoaController);
    service = module.get(PessoaService);
    jest.clearAllMocks();
  });

  describe('POST /pessoa - createPessoa', () => {
    it('deve criar pessoa (sucesso)', async () => {
      const dto: CreatePessoaDto = {
        pessoa_nome: 'Ana',
        pessoa_cpf: '12345678901',
        pessoa_telefone: '44999998888',
        pessoatipo_id: 2,
      } as any;
      service.createPessoa.mockResolvedValueOnce(pessoaFake);

      const result = await controller.createPessoa(dto);
      expect(service.createPessoa).toHaveBeenCalledWith(dto);
      expect(result).toBe(pessoaFake);
    });

    it('deve propagar erro do service', async () => {
      const dto: CreatePessoaDto = {
        pessoa_nome: 'Ana',
        pessoa_cpf: '12345678901',
        pessoa_telefone: '44999998888',
        pessoatipo_id: 2,
      } as any;
      service.createPessoa.mockRejectedValueOnce(
        new HttpException('erro', HttpStatus.BAD_REQUEST),
      );

      await expect(controller.createPessoa(dto)).rejects.toThrow(HttpException);
    });
  });

  describe('GET /pessoa - findAllPessoas', () => {
    it('deve listar pessoas (sucesso)', async () => {
      service.findAllPessoas.mockResolvedValueOnce([pessoaFake]);

      const result = await controller.findAllPessoas();
      expect(service.findAllPessoas).toHaveBeenCalled();
      expect(result).toEqual([pessoaFake]);
    });

    it('deve propagar erro do service', async () => {
      service.findAllPessoas.mockRejectedValueOnce(
        new HttpException('erro', HttpStatus.INTERNAL_SERVER_ERROR),
      );

      await expect(controller.findAllPessoas()).rejects.toThrow(HttpException);
    });
  });

  describe('GET /pessoa/:id - findOnePessoa', () => {
    it('deve retornar uma pessoa (sucesso)', async () => {
      service.findOnePessoa.mockResolvedValueOnce({
        mensagem: 'ok',
        pessoa: pessoaFake,
      });

      const result = await controller.findOnePessoa(1);
      expect(service.findOnePessoa).toHaveBeenCalledWith(1);
      expect(result.pessoa).toBe(pessoaFake);
    });

    it('deve propagar erro quando não encontrar', async () => {
      service.findOnePessoa.mockRejectedValueOnce(
        new HttpException('não encontrado', HttpStatus.NOT_FOUND),
      );

      await expect(controller.findOnePessoa(999)).rejects.toThrow(HttpException);
    });
  });

  describe('PATCH /pessoa/:id - updatePessoa', () => {
    it('deve atualizar pessoa (sucesso)', async () => {
      const dto: UpdatePessoaDto = {
        pessoa_nome: 'Novo Nome',
        pessoa_cpf: '98765432100',
        pessoa_telefone: '44988887777',
        pessoatipo_id: 3,
      } as any;
      service.updatePessoa.mockResolvedValueOnce({
        mensagem: 'atualizado',
        pessoa: pessoaFake,
      });

      const result = await controller.updatePessoa(1, dto);
      expect(service.updatePessoa).toHaveBeenCalledWith(1, dto);
      expect(result.pessoa).toBe(pessoaFake);
    });

    it('deve propagar erro do service', async () => {
      const dto: UpdatePessoaDto = {
        pessoa_nome: 'Novo Nome',
        pessoa_cpf: '98765432100',
        pessoa_telefone: '44988887777',
        pessoatipo_id: 3,
      } as any;
      service.updatePessoa.mockRejectedValueOnce(
        new HttpException('erro update', HttpStatus.BAD_REQUEST),
      );

      await expect(controller.updatePessoa(1, dto)).rejects.toThrow(HttpException);
    });
  });

  describe('DELETE /pessoa/:id - removePessoa', () => {
    it('deve remover pessoa (sucesso)', async () => {
      service.removePessoa.mockResolvedValueOnce({ mensagem: 'removido' });

      const result = await controller.removePessoa(1);
      expect(service.removePessoa).toHaveBeenCalledWith(1);
      expect(result).toEqual({ mensagem: 'removido' });
    });

    it('deve propagar erro do service', async () => {
      service.removePessoa.mockRejectedValueOnce(
        new HttpException('erro delete', HttpStatus.NOT_FOUND),
      );

      await expect(controller.removePessoa(123)).rejects.toThrow(HttpException);
    });
  });
});
