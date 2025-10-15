import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pessoa } from './entities/pessoa.entity';
import { PessoaService } from './pessoa.service';
import { PessoaController } from './pessoa.controller';
import { PessoaTipoModule } from '../pessoatipo/pessoatipo.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pessoa]),
    PessoaTipoModule,
  ],
  controllers: [PessoaController],
  providers: [PessoaService],
  exports: [PessoaService, TypeOrmModule],
})
export class PessoaModule {}
