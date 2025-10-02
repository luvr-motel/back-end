import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

export type JwtPayload = {
  sub: number;
  codigo: string;
  motelId?: number | null;
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

  validate(payload: JwtPayload) {
    return {
      usuarioId: payload.sub,
      usuarioCodigo: payload.codigo,
      motelId: payload.motelId ?? null,
      roles: payload.roles ?? [],
    };
  }
}
