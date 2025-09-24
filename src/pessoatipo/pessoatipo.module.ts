import { Module } from '@nestjs/common';
import { PessoatipoService } from './pessoatipo.service';
import { PessoatipoController } from './pessoatipo.controller';

@Module({
  controllers: [PessoatipoController],
  providers: [PessoatipoService],
})
export class PessoatipoModule {}
