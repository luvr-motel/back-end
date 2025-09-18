import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
//import { PassportModule } from '@nestjs/passport';
//import { JwtModule } from '@nestjs/jwt';
//import { APP_GUARD } from '@nestjs/core';
//import { Pessoa } from './pessoa.entity';
import { PessoaService } from './pessoa.service';
import { PessoaController } from './pessoa.controller';
import { Pessoa } from './entities/pessoa.entity';
//import { JwtStrategy } from './auth/jwt.strategy';
//import { JwtAuthGuard } from './auth/jwt-auth.guard';
//import { RolesGuard } from './auth/roles.guard';
//import { DevAuthController } from './auth/dev-auth.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Pessoa])], // <-- registra o repo
  controllers: [PessoaController],
  providers: [PessoaService],
  exports: [PessoaService, TypeOrmModule], // <-- exporte se outro módulo precisar
})
export class PessoaModule {}
