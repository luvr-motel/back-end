import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { Usuario, UsuarioStatus } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UsuarioRole } from './entities/usuario-role.enum';

type SafeUsuario = Omit<Usuario, 'usuarioSenha'> & { usuarioSenha?: never };

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly repo: Repository<Usuario>,
  ) {}

  private toSafe(u: Usuario): SafeUsuario {
    const { usuarioSenha, ...rest } = u as any;
    return rest as SafeUsuario;
  }

  async create(dto: CreateUsuarioDto): Promise<SafeUsuario> {
    // código único
    const exists = await this.repo.findOne({ where: { usuarioCodigo: dto.usuarioCodigo } });
    if (exists) throw new ConflictException('Código de usuário já existe');

    const hashed = await argon2.hash(dto.usuarioSenha);

    const roles =
      (dto as any).roles?.length ? (dto as any).roles as UsuarioRole[] :
      (dto as any).usuarioRole ? [ (dto as any).usuarioRole as UsuarioRole ] :
      undefined; 

    const entity = this.repo.create({
      usuarioCodigo: dto.usuarioCodigo,
      usuarioSenha: hashed,
      usuarioAtivo: dto.usuarioAtivo ?? UsuarioStatus.ATIVO,
      roles,
      pessoa: dto.pessoaId ? ({ pessoaId: dto.pessoaId } as any) : null,
      // TODO(motel): reativar quando o módulo/tabela estiverem prontos
      // motel: dto.motelId ? ({ motelId: dto.motelId } as any) : null,
    });

    const saved = await this.repo.save(entity);
    return this.toSafe(saved);
  }

  async findAll(page = 1, limit = 20): Promise<SafeUsuario[]> {
    const p = Math.max(1, Number(page) || 1);
    const l = Math.min(Math.max(1, Number(limit) || 20), 100);

    const data = await this.repo.find({
      order: { usuarioId: 'ASC' },
      skip: (p - 1) * l,
      take: l,
      relations: ['pessoa'], // , 'motel'  // TODO(motel)
    });

    return data.map((u) => this.toSafe(u));
  }

  async findOne(id: number): Promise<SafeUsuario> {
    const found = await this.repo.findOne({
      where: { usuarioId: id },
      relations: ['pessoa'], // , 'motel'  // TODO(motel)
    });
    if (!found) throw new NotFoundException('Usuário não encontrado');
    return this.toSafe(found);
  }

  async findByCodigoWithSenha(usuarioCodigo: string): Promise<Usuario> {
    const qb = this.repo
      .createQueryBuilder('u')
      .addSelect('u.usuarioSenha')
      .where('u.usuarioCodigo = :usuarioCodigo', { usuarioCodigo });

    const user = await qb.getOne();
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async update(id: number, dto: UpdateUsuarioDto): Promise<SafeUsuario> {
    const user = await this.repo.findOne({ where: { usuarioId: id } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    if (dto.usuarioCodigo && dto.usuarioCodigo !== user.usuarioCodigo) {
      const dupe = await this.repo.findOne({ where: { usuarioCodigo: dto.usuarioCodigo } });
      if (dupe) throw new ConflictException('Código de usuário já existe');
      user.usuarioCodigo = dto.usuarioCodigo;
    }

    if (dto.usuarioSenha) {
      (user as any).usuarioSenha = await argon2.hash(dto.usuarioSenha);
    }

    if (dto.usuarioAtivo !== undefined) {
      user.usuarioAtivo = dto.usuarioAtivo as UsuarioStatus;
    }

    if ((dto as any).roles?.length) {
      user.roles = (dto as any).roles as UsuarioRole[];
    } else if ((dto as any).usuarioRole) {
      user.roles = [ (dto as any).usuarioRole as UsuarioRole ];
    }

    if (dto.pessoaId !== undefined) {
      (user as any).pessoa = dto.pessoaId ? ({ pessoaId: dto.pessoaId } as any) : null;
    }
    // TODO(motel)
    // if (dto.motelId !== undefined) {
    //   (user as any).motel = dto.motelId ? ({ motelId: dto.motelId } as any) : null;
    // }

    const saved = await this.repo.save(user);
    return this.toSafe(saved);
  }

  async remove(id: number) {
    const found = await this.repo.findOne({ where: { usuarioId: id } });
    if (!found) throw new NotFoundException('Usuário não encontrado');
    await this.repo.softDelete(id);
    return { message: 'Usuário removido.' };
  }
}
