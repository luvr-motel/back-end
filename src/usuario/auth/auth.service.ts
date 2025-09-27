import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UsuarioService } from '../usuario.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarios: UsuarioService,
    private readonly jwt: JwtService,
  ) {}

  /** Valida as credenciais e retorna o usuário (sem senha) */
  async validate(usuarioCodigo: string, senha: string) {
    const user = await this.usuarios.findByCodigoWithSenha(usuarioCodigo);
    const ok = await argon2.verify(user.usuarioSenha, senha);
    if (!ok || !user.usuarioAtivo) {
      throw new UnauthorizedException('Credenciais inválidas ou usuário inativo');
    }
    // remove a senha antes de devolver
    const { usuarioSenha, ...safe } = user as any;
    return safe;
  }

  /** Faz login e devolve JWT + dados básicos do usuário */
  async login(usuarioCodigo: string, senha: string) {
    const u = await this.validate(usuarioCodigo, senha);

    const payload = {
      sub: u.usuarioId,
      codigo: u.usuarioCodigo,
      lojaId: u.lojaId ?? null,
      roles: u.roles ?? [],
    };

    const access_token = await this.jwt.signAsync(payload);
    return { access_token, user: u };
  }
}
