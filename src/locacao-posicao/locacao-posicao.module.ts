import { Module } from '@nestjs/common';
import { LocacaoPosicaoService } from './locacao-posicao.service';
import { LocacaoPosicaoController } from './locacao-posicao.controller';

@Module({
  controllers: [LocacaoPosicaoController],
  providers: [LocacaoPosicaoService],
})
export class LocacaoPosicaoModule {}
