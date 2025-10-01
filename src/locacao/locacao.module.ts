import { Module } from '@nestjs/common';
import { LocacaoService } from './locacao.service';
import { LocacaoController } from './locacao.controller';

@Module({
  controllers: [LocacaoController],
  providers: [LocacaoService],
})
export class LocacaoModule {}
