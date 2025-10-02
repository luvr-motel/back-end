import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UsuarioService } from '../usuario.service';
import { UsuarioRole } from '../../usuario/entities/usuario-role.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarios: UsuarioService,
    private readonly jwt: JwtService,
  ) {}

  async validate(usuarioCodigo: string, senha: string) {
    const user = await this.usuarios.findByCodigoWithSenha(usuarioCodigo);
    const ok = await argon2.verify(user.usuarioSenha, senha);
    if (!ok || !user.usuarioAtivo) {
      throw new UnauthorizedException('Credenciais inválidas ou usuário inativo');
    }
    const { usuarioSenha, ...safe } = user as any;
    return safe; 
  }

  async login(usuarioCodigo: string, senha: string) {
    const u = await this.validate(usuarioCodigo, senha);

    const payload = {
      sub: u.usuarioId,
      codigo: u.usuarioCodigo,
      lojaId: (u as any).lojaId ?? null,
      roles: (u as any).roles && Array.isArray((u as any).roles) && (u as any).roles.length
        ? (u as any).roles
        : [UsuarioRole.ADMIN],
    };

    const access_token = await this.jwt.signAsync(payload);
    return { access_token, user: u };
  }
}
