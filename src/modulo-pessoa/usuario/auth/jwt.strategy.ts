import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

export type JwtPayload = {
  sub: number;
  codigo: string;
  motel_id?: number | null;
  role?: string;       
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
    const role = payload.role ?? payload.roles?.[0];
    const roles = payload.roles ?? (payload.role ? [payload.role] : []);

    return {
      usuarioId: payload.sub,
      usuarioCodigo: payload.codigo,
      motel_id: payload.motel_id ?? null,
      role,   
      roles,  
    };
  }
}
