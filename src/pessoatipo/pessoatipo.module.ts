import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PessoaTipo } from './entities/pessoatipo.entity';
import { PessoaTipoService } from './pessoatipo.service';
import { PessoaTipoController } from './pessoatipo.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PessoaTipo])],
  controllers: [PessoaTipoController],
  providers: [PessoaTipoService],
  exports: [PessoaTipoService, TypeOrmModule], 
})
export class PessoaTipoModule {}
