import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

export type JwtPayload = {
  sub: number;
  codigo: string;
  lojaId?: number | null;
  roles?: string[];
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET') ?? 'dev-secret',
      algorithms: ['HS256'],
    });
  }

  // o objeto retornado vira req.user
  validate(payload: JwtPayload) {
    return {
      usuarioId: payload.sub,
      usuarioCodigo: payload.codigo,
      lojaId: payload.lojaId ?? null,
      roles: payload.roles ?? [],
    };
  }
}
