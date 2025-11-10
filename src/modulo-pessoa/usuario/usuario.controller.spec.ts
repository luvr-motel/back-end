import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UsuarioRole } from './entities/usuario-role.enum';
import { UsuarioStatus } from './entities/usuario.entity';

describe('UsuarioController', () => {
  let controller: UsuarioController;
  let service: jest.Mocked<UsuarioService>;

  const usuarioOut = {
    usuario_id: 1,
    usuario_codigo: 'LUVR.RODRIGO',
    usuario_role: UsuarioRole.RECEPCIONISTA,
    usuario_ativo: UsuarioStatus.ATIVO,
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuarioController],
      providers: [
        {
          provide: UsuarioService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            findByCodigoWithSenha: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(UsuarioController);
    service = module.get(UsuarioService) as any;
    jest.clearAllMocks();
  });

  describe('POST /usuarios', () => {
    it('cria usuário (sucesso)', async () => {
      const dto: CreateUsuarioDto = {
        usuarioCodigo: 'LUVR.RODRIGO',
        usuarioSenha: 'luvr#123',
      } as any;
      service.create.mockResolvedValueOnce(usuarioOut);

      const res = await controller.createUsuario(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(res).toBe(usuarioOut);
    });

    it('propaga erro do service', async () => {
      service.create.mockRejectedValueOnce(new HttpException('conflict', HttpStatus.CONFLICT));
      await expect(controller.createUsuario({} as any)).rejects.toThrow(HttpException);
    });
  });

  describe('GET /usuarios/me/profile', () => {
    it('pega id do req.user.usuarioId (fallback sub/id) e chama findOne', async () => {
      service.findOne.mockResolvedValueOnce({ mensagem: 'ok', usuario: usuarioOut });
      const req = { user: { usuarioId: 5 } };

      const res = await controller.getMyProfileUsuario(req as any);

      expect(service.findOne).toHaveBeenCalledWith(5);
      expect(res.usuario).toBe(usuarioOut);
    });
  });

  describe('GET /usuarios', () => {
    it('lista usuários', async () => {
      service.findAll.mockResolvedValueOnce([usuarioOut]);
      const res = await controller.findAllUsuarios();
      expect(res).toEqual([usuarioOut]);
    });

    it('propaga erro', async () => {
      service.findAll.mockRejectedValueOnce(new HttpException('err', HttpStatus.INTERNAL_SERVER_ERROR));
      await expect(controller.findAllUsuarios()).rejects.toThrow(HttpException);
    });
  });

  describe('GET /usuarios/:id', () => {
    it('retorna um', async () => {
      service.findOne.mockResolvedValueOnce({ mensagem: 'ok', usuario: usuarioOut });
      const res = await controller.findOneUsuario(1);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(res.usuario).toBe(usuarioOut);
    });

    it('propaga erro', async () => {
      service.findOne.mockRejectedValueOnce(new HttpException('nf', HttpStatus.NOT_FOUND));
      await expect(controller.findOneUsuario(999)).rejects.toThrow(HttpException);
    });
  });

  describe('PATCH /usuarios/:id', () => {
    it('atualiza', async () => {
      const dto: UpdateUsuarioDto = { usuarioRole: UsuarioRole.GERENTE } as any;
      service.update.mockResolvedValueOnce({ mensagem: 'ok', usuario: usuarioOut });
      const res = await controller.updateUsuario(1, dto);
      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(res.usuario).toBe(usuarioOut);
    });

    it('propaga erro', async () => {
      service.update.mockRejectedValueOnce(new HttpException('bad', HttpStatus.BAD_REQUEST));
      await expect(controller.updateUsuario(1, {} as any)).rejects.toThrow(HttpException);
    });
  });

  describe('DELETE /usuarios/:id', () => {
    it('remove', async () => {
      service.remove.mockResolvedValueOnce({ mensagem: 'removed' } as any);
      const res = await controller.removeUsuario(2);
      expect(service.remove).toHaveBeenCalledWith(2);
      expect(res).toEqual({ mensagem: 'removed' });
    });

    it('propaga erro', async () => {
      service.remove.mockRejectedValueOnce(new HttpException('nf', HttpStatus.NOT_FOUND));
      await expect(controller.removeUsuario(999)).rejects.toThrow(HttpException);
    });
  });
});
