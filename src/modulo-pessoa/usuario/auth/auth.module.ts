import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy'; 
import { UsuarioModule } from '../usuario.module';

@Module({
  imports: [ConfigModule, UsuarioModule, PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => {
        const expiresCfg = cfg.get<string>('JWT_EXPIRES');
        // Prefer a numeric value in seconds; fallback to 1 day
        // Accept numbers in env (seconds). If string like '1d', default to 86400.
        const expiresIn = (() => {
          if (!expiresCfg) return 60 * 60 * 24; // 1 day
          const asNumber = Number(expiresCfg);
          if (!Number.isNaN(asNumber) && asNumber > 0) return asNumber;
          return 60 * 60 * 24; // fallback 1 day in seconds
        })();

        return {
          secret: cfg.get<string>('JWT_SECRET') ?? 'dev-secret',
          signOptions: { expiresIn },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
