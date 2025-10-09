import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UsuarioService } from '../usuario.service';
import { UsuarioRole } from '../../usuario/entities/usuario-role.enum';
import { UsuarioStatus } from '../../usuario/entities/usuario.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarios: UsuarioService,
    private readonly jwt: JwtService,
  ) {}

  async validate(usuarioCodigo: string, senha: string) {
    const user = await this.usuarios.findByCodigoWithSenha(usuarioCodigo);

    const ok = await argon2.verify((user as any).usuario_senha, senha);

    const ativo = (user as any).usuario_ativo === UsuarioStatus.ATIVO;

    if (!ok || !ativo) {
      throw new UnauthorizedException('Credenciais inválidas ou usuário inativo');
    }

    const { usuario_senha, ...safe } = user as any;
    return safe;
  }

  async login(usuarioCodigo: string, senha: string) {
    const u = await this.validate(usuarioCodigo, senha);

    const payload = {
      sub: (u as any).usuario_id,
      codigo: (u as any).usuario_codigo,
      roles:
        Array.isArray((u as any).roles) && (u as any).roles.length
          ? (u as any).roles
          : [UsuarioRole.RECEPCIONISTA], 
    };

    const access_token = await this.jwt.signAsync(payload);
    return { access_token, user: u };
  }
}
