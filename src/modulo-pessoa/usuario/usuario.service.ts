import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import * as argon2 from 'argon2';
import { Usuario, UsuarioStatus } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UsuarioRole } from './entities/usuario-role.enum';

export type UsuarioOut = Omit<Usuario, 'usuario_senha'>;
export type UsuarioResp = { mensagem: string; usuario: UsuarioOut };

@Injectable()
export class UsuarioService {
  constructor(@InjectRepository(Usuario) private readonly repo: Repository<Usuario>) {}

  private toSafe(u: Usuario): UsuarioOut {
    const { usuario_senha, ...rest } = u as any;
    return rest as UsuarioOut;
  }

  async create(dto: CreateUsuarioDto): Promise<UsuarioOut> {
    const codigo = dto.usuarioCodigo?.trim?.() ?? dto.usuarioCodigo;

    const exists = await this.repo.findOne({ where: { usuario_codigo: codigo } });
    if (exists) throw new HttpException('Código de usuário já existe', 409);

    const partial: DeepPartial<Usuario> = {
      usuario_codigo: codigo,
      usuario_senha : await argon2.hash(dto.usuarioSenha),
      usuario_ativo : (dto.usuarioAtivo as UsuarioStatus) ?? UsuarioStatus.ATIVO,
      usuario_role  : dto.usuarioRole ?? UsuarioRole.RECEPCIONISTA,
      ...(dto.pessoaId ? { pessoa: { pessoa_id: dto.pessoaId } as any } : {}),
      ...(dto.motelId ? { motel: { motel_id: dto.motelId } as any } : {}),
    };

    const entity = this.repo.create(partial);
    const saved = await this.repo.save(entity);
    return this.toSafe(saved);
  }

  async findAll(): Promise<UsuarioOut[]> {
    const list = await this.repo.find(); 
    return list.map((u) => this.toSafe(u));
  }

  async findOne(id: number): Promise<UsuarioResp> {
    const data = await this.repo.findOne({ where: { usuario_id: id } });
    if (!data) throw new HttpException('Usuário não encontrado', 404);
    return { mensagem: `Usuário #${id}`, usuario: this.toSafe(data) };
  }

  async findByCodigoWithSenha(usuario_codigo: string): Promise<Usuario> {
    const user = await this.repo
      .createQueryBuilder('u')
      .addSelect('u.usuario_senha') 
      .where('u.usuario_codigo = :usuario_codigo', { usuario_codigo })
      .getOne();

    if (!user) throw new HttpException('Usuário não encontrado', 404);
    return user;
  } 

  async update(id: number, dto: UpdateUsuarioDto): Promise<UsuarioResp> {
    const atual = await this.repo.findOne({ where: { usuario_id: id } });
    if (!atual) throw new HttpException('Erro ao atualizar usuário', 404);

    const payload: DeepPartial<Usuario> = {};
    if (dto.usuarioCodigo !== undefined) payload.usuario_codigo = dto.usuarioCodigo?.trim?.() ?? dto.usuarioCodigo;
    if (dto.usuarioSenha !== undefined) (payload as any).usuario_senha = await argon2.hash(dto.usuarioSenha);
    if (dto.usuarioAtivo !== undefined) payload.usuario_ativo = dto.usuarioAtivo as UsuarioStatus;
    if (dto.usuarioRole !== undefined) payload.usuario_role = dto.usuarioRole ?? null;
    if ('pessoaId' in dto) (payload as any).pessoa = dto.pessoaId ? ({ pessoa_id: dto.pessoaId } as any) : null;
    if ('motelId' in dto) (payload as any).motel = dto.motelId ? ({ motel_id: dto.motelId } as any) : null;

    const merged = this.repo.merge(atual, payload);
    const saved = await this.repo.save(merged);

    return {
      mensagem: `Usuário #${id} Atualizado com sucesso`,
      usuario: this.toSafe(saved),
    };
  }

  async remove(id: number): Promise<{ mensagem: string }> {
    const data = await this.repo.findOne({ where: { usuario_id: id } });
    if (!data) throw new HttpException('Erro ao excluir usuário', 404);

    await this.repo.softDelete(id);
    return { mensagem: `Usuário ${id} excluido com sucesso` };
  }
}
