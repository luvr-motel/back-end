import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';

import { RegistroPontoService } from './registro-ponto.service';
import { RegistroPonto } from './entities/registro-ponto.entity';
import { CreateRegistroPontoDto } from './dto/create-registro-ponto.dto';
import { UpdateRegistroPontoDto } from './dto/update-registro-ponto.dto';

type RepoMock = jest.Mocked<
  Pick<
    Repository<RegistroPonto>,
    'create' | 'save' | 'find' | 'findOne' | 'merge' | 'softDelete'
  >
>;

function createRepoMock(): RepoMock {
  return {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    merge: jest.fn(),
    softDelete: jest.fn(),
  } as any;
}

describe('RegistroPontoService', () => {
  let service: RegistroPontoService;
  let repo: RepoMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegistroPontoService,
        {
          provide: getRepositoryToken(RegistroPonto),
          useValue: createRepoMock(),
        },
      ],
    }).compile();

    service = module.get<RegistroPontoService>(RegistroPontoService);
    repo = module.get(getRepositoryToken(RegistroPonto));

    jest.clearAllMocks();
  });

  describe('createRegistroPonto', () => {
    it('deve criar e salvar um registro de ponto com sucesso', async () => {
      const dto: CreateRegistroPontoDto = {
        usuario_id: 1,
        motel_id: 2,
        registroponto_entrada: true,
      };

      const entity: RegistroPonto = {
        registroponto_id: 10,
        registroponto_entrada: true,
      } as any;

      (repo.create as jest.Mock).mockReturnValue(entity);
      (repo.save as jest.Mock).mockResolvedValue(entity);

      const result = await service.createRegistroPonto(dto);

      expect(repo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          registroponto_entrada: dto.registroponto_entrada,
        }),
      );
      expect(repo.save).toHaveBeenCalledWith(entity);
      expect(result).toEqual({
        mensagem: 'Registro de ponto criado com sucesso',
        registroPonto: entity,
      });
    });
  });

  describe('findAllRegistroPonto', () => {
    it('deve retornar lista de registros de ponto', async () => {
      const lista: RegistroPonto[] = [
        { registroponto_id: 1 } as any,
        { registroponto_id: 2 } as any,
      ];

      (repo.find as jest.Mock).mockResolvedValue(lista);

      const result = await service.findAllRegistroPonto();

      expect(repo.find).toHaveBeenCalled();
      expect(result).toBe(lista);
    });
  });

  describe('findRegistroPontoId', () => {
    it('deve retornar registro quando encontrado', async () => {
      const registro: RegistroPonto = {
        registroponto_id: 5,
        registroponto_entrada: true,
      } as any;

      (repo.findOne as jest.Mock).mockResolvedValue(registro);

      const result = await service.findRegistroPontoId(5);

      expect(repo.findOne).toHaveBeenCalledWith({
        where: { registroponto_id: 5 },
      });
      expect(result).toEqual({
        mensagem: 'RegistroPonto #5',
        registroPonto: registro,
      });
    });

    it('deve lançar 404 quando não encontrar', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.findRegistroPontoId(99)).rejects.toThrow(
        'Registro de ponto não encontrado',
      );
      await expect(service.findRegistroPontoId(99)).rejects.toBeInstanceOf(
        HttpException,
      );
    });
  });

  describe('updateRegistroPontoById', () => {
    it('deve lançar erro quando registro não existir', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        service.updateRegistroPontoById(1, {} as any),
      ).rejects.toThrow('Erro ao atualizar registro de ponto');
    });

    it('deve atualizar registroponto_entrada quando enviado no DTO', async () => {
      const atual: RegistroPonto = {
        registroponto_id: 10,
        registroponto_entrada: false,
      } as any;

      (repo.findOne as jest.Mock).mockResolvedValue(atual);

      const dto: UpdateRegistroPontoDto = {
        registroponto_entrada: true,
      } as any;

      const merged: RegistroPonto = {
        registroponto_id: 10,
        registroponto_entrada: true,
      } as any;

      (repo.merge as jest.Mock).mockReturnValue(merged);
      (repo.save as jest.Mock).mockResolvedValue(merged);

      const result = await service.updateRegistroPontoById(10, dto);

      expect(repo.findOne).toHaveBeenCalledWith({
        where: { registroponto_id: 10 },
      });
      expect(repo.merge).toHaveBeenCalledWith(atual, {
        registroponto_entrada: true,
      });
      expect(repo.save).toHaveBeenCalledWith(merged);
      expect(result).toEqual({
        mensagem: 'RegistroPonto #10 atualizado com sucesso',
        registroPonto: merged,
      });
    });

    it('não deve alterar registroponto_entrada quando não enviado no DTO', async () => {
      const atual: RegistroPonto = {
        registroponto_id: 11,
        registroponto_entrada: false,
      } as any;

      (repo.findOne as jest.Mock).mockResolvedValue(atual);

      const dto: UpdateRegistroPontoDto = {} as any;

      const merged: RegistroPonto = {
        registroponto_id: 11,
        registroponto_entrada: false,
      } as any;

      (repo.merge as jest.Mock).mockReturnValue(merged);
      (repo.save as jest.Mock).mockResolvedValue(merged);

      const result = await service.updateRegistroPontoById(11, dto);

      expect(repo.merge).toHaveBeenCalledWith(atual, {
        registroponto_entrada: false,
      });
      expect(repo.save).toHaveBeenCalledWith(merged);
      expect(result).toEqual({
        mensagem: 'RegistroPonto #11 atualizado com sucesso',
        registroPonto: merged,
      });
    });
  });

  describe('removeRegistroPonto', () => {
    it('deve remover registro existente', async () => {
      const registro: RegistroPonto = {
        registroponto_id: 7,
        registroponto_entrada: true,
      } as any;

      (repo.findOne as jest.Mock).mockResolvedValue(registro);
      (repo.softDelete as jest.Mock).mockResolvedValue(undefined as any);

      const result = await service.removeRegistroPonto(7);

      expect(repo.findOne).toHaveBeenCalledWith({
        where: { registroponto_id: 7 },
      });
      expect(repo.softDelete).toHaveBeenCalledWith(7);
      expect(result).toEqual({
        mensagem: 'Registro 7 excluido com sucesso',
      });
    });

    it('deve lançar erro quando registro não existir', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.removeRegistroPonto(8)).rejects.toThrow(
        'Erro ao excluir registro de ponto',
      );
    });
  });
});
