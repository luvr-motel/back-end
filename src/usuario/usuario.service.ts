import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { Usuario, UsuarioStatus } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UsuarioRole } from './entities/usuario-role.enum';

type SafeUsuario = Omit<Usuario, 'usuario_senha'> & { usuario_senha?: never };

@Injectable()
export class UsuarioService {
  constructor(@InjectRepository(Usuario) private readonly repo: Repository<Usuario>) {}

  private toSafe(u: Usuario): SafeUsuario {
    const { usuario_senha, ...rest } = u as any;
    return rest as SafeUsuario;
  }

  async create(dto: CreateUsuarioDto): Promise<SafeUsuario> {
    const exists = await this.repo.findOne({ where: { usuario_codigo: dto.usuarioCodigo } });
    if (exists) throw new ConflictException('Código de usuário já existe');

    const entity = this.repo.create({
      usuario_codigo: dto.usuarioCodigo.trim(),
      usuario_senha: await argon2.hash(dto.usuarioSenha),

      ...(dto.usuarioAtivo && { usuario_ativo: dto.usuarioAtivo as UsuarioStatus }),

      ...(dto.roles?.length
        ? { roles: dto.roles as UsuarioRole[] }
        : dto.usuarioRole
        ? { roles: [dto.usuarioRole as UsuarioRole] }
        : {}),
      ...(dto.pessoaId ? { pessoa: { pessoa_id: dto.pessoaId } as any } : {}),
    });

    const saved = await this.repo.save(entity);
    return this.toSafe(saved);
  }

  async findAll(): Promise<SafeUsuario[]> {
    const data = await this.repo.find({
      relations: { pessoa: true /*, motel: true */ },
      order: { usuario_id: 'ASC' },
    });
    return data.map(u => this.toSafe(u));
  }

  async findOne(id: number): Promise<SafeUsuario> {
    const found = await this.repo.findOne({
      where: { usuario_id: id },
      relations: { pessoa: true /*, motel: true */ },
    });
    if (!found) throw new NotFoundException('Usuário não encontrado');
    return this.toSafe(found);
  }

  async findByCodigoWithSenha(usuario_codigo: string): Promise<Usuario> {
  const user = await this.repo
    .createQueryBuilder('u')
    .addSelect('u.usuario_senha')
    .where('u.usuario_codigo = :usuario_codigo', { usuario_codigo })
    .getOne();

  if (!user) throw new NotFoundException('Usuário não encontrado');
  return user;
}


  async update(id: number, dto: UpdateUsuarioDto): Promise<SafeUsuario> {
    const user = await this.repo.findOne({ where: { usuario_id: id } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    if (dto.usuarioCodigo !== undefined) {
      const novo = dto.usuarioCodigo.trim();
      if (novo !== user.usuario_codigo) {
        const dupe = await this.repo.findOne({ where: { usuario_codigo: novo } });
        if (dupe) throw new ConflictException('Código de usuário já existe');
        user.usuario_codigo = novo;
      }
    }

    if (dto.usuarioSenha !== undefined) {
      (user as any).usuario_senha = await argon2.hash(dto.usuarioSenha);
    }

    if (dto.usuarioAtivo !== undefined) {
      user.usuario_ativo = dto.usuarioAtivo as UsuarioStatus;
    }

    if (dto.roles?.length) {
      user.roles = dto.roles as UsuarioRole[];
    } else if (dto.usuarioRole) {
      user.roles = [dto.usuarioRole as UsuarioRole];
    }

    if ('pessoaId' in dto) {
      (user as any).pessoa = dto.pessoaId ? ({ pessoa_id: dto.pessoaId } as any) : null;
    }

    await this.repo.save(user);

    const fresh = await this.repo.findOne({
      where: { usuario_id: id },
      relations: { pessoa: true /*, motel: true */ },
    });
    return this.toSafe(fresh!);
  }

  async remove(id: number): Promise<{ mensagem: string }> {
    const res = await this.repo.softDelete(id);
    if (!res.affected) throw new NotFoundException('Usuário não encontrado');
    return { mensagem: `Usuário ${id} excluído com sucesso` };
  }
}
