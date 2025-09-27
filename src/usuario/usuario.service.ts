import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { Usuario } from './entities/usuario.entity';
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

  async create(dto: CreateUsuarioDto) {
    const exists = await this.repo.findOne({ where: { usuarioCodigo: dto.usuarioCodigo } });
    if (exists) throw new ConflictException('Código de usuário já existe');

    const roles =
      dto.roles?.length ? dto.roles :
      dto.usuarioRole ? [dto.usuarioRole] :
      [UsuarioRole.RECEPCIONISTA];

    const entity = this.repo.create({
      usuarioCodigo: dto.usuarioCodigo,
      usuarioSenha: await argon2.hash(dto.senha),
      usuarioAtivo: dto?.usuarioAtivo ?? true,       
      roles,
      pessoa: dto?.pessoaId ? ({ pessoaId: dto.pessoaId } as any) : null,
      lojaId: dto?.lojaId ?? null,
    });

    const saved = await this.repo.save(entity);
    return this.toSafe(saved);
  }

  async findAll(page = 1, limit = 20) {
    const data = await this.repo.find({
      order: { usuarioId: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['pessoa'],
    });
    return data.map((u) => this.toSafe(u));
  }

  async findOne(id: number) {
    const found = await this.repo.findOne({ where: { usuarioId: id }, relations: ['pessoa'] });
    if (!found) throw new NotFoundException('Usuário não encontrado');
    return this.toSafe(found);
  }

  async findByCodigoWithSenha(usuarioCodigo: string) {
    const qb = this.repo.createQueryBuilder('u')
      .addSelect('u.usuarioSenha')
      .where('u.usuarioCodigo = :usuarioCodigo', { usuarioCodigo });

    const user = await qb.getOne();
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async update(id: number, dto: UpdateUsuarioDto) {
    const user = await this.repo.findOne({ where: { usuarioId: id } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    if (dto.senha) {
      (user as any).usuarioSenha = await argon2.hash(dto.senha);
    }
    if (dto.roles?.length) {
      user.roles = dto.roles;
    } else if (dto.usuarioRole) {
      user.roles = [dto.usuarioRole];
    }
    if (typeof dto.usuarioAtivo === 'boolean') {      
      user.usuarioAtivo = dto.usuarioAtivo;
    }
    if (dto.pessoaId !== undefined) {
      (user as any).pessoa = dto.pessoaId ? ({ pessoaId: dto.pessoaId } as any) : null;
    }
    if (dto.lojaId !== undefined) {
      user.lojaId = dto.lojaId;
    }

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
