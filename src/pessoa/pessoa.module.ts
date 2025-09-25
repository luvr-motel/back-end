import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pessoa } from './entities/pessoa.entity';
import { PessoaService } from './pessoa.service';
import { PessoaController } from './pessoa.controller';

// imports do auth user
// import { PassportModule } from '@nestjs/passport';
// import { JwtModule } from '@nestjs/jwt';
// import { APP_GUARD } from '@nestjs/core';
// import { JwtStrategy } from '../auth/jwt.strategy';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { RolesGuard } from '../auth/roles.guard';

import { PessoaTipoModule } from '../pessoatipo/pessoatipo.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pessoa]),
    PessoaTipoModule, 
    // PassportModule.register({ defaultStrategy: 'jwt' }),
    // JwtModule.register({
    //   secret: process.env.JWT_SECRET,
    //   signOptions: { expiresIn: process.env.JWT_EXPIRES || '1d' },
    // }),
  ],
  controllers: [PessoaController],
  providers: [
    PessoaService,
    // JwtStrategy,
    // { provide: APP_GUARD, useClass: JwtAuthGuard },
    // { provide: APP_GUARD, useClass: RolesGuard },
  ],
  exports: [PessoaService, TypeOrmModule],
})
export class PessoaModule {}
