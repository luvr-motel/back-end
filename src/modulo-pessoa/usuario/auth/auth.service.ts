import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UsuarioService } from '../usuario.service';
import { UsuarioRole } from '../entities/usuario-role.enum';
import { UsuarioStatus } from '../entities/usuario.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarios: UsuarioService,
    private readonly jwt: JwtService,
  ) {}

  async validate(usuarioCodigo: string, senha: string) {
    const user = await this.usuarios.findByCodigoWithSenha(usuarioCodigo);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

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

    const role: string = (u as any).usuario_role ?? UsuarioRole.RECEPCIONISTA;

    const payload = {
      sub: (u as any).usuario_id,
      codigo: (u as any).usuario_codigo,
      role,        
      roles: [role], 
    };

    const access_token = await this.jwt.signAsync(payload);
    return { access_token, user: u };
  }
}
