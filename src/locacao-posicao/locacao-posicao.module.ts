import { Module } from '@nestjs/common';
import { LocacaoPosicaoService } from './locacao-posicao.service';
import { LocacaoPosicaoController } from './locacao-posicao.controller';
import { LocacaoPosicao } from './entities/locacao-posicao.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:     [ TypeOrmModule.forFeature([LocacaoPosicao ])],
  controllers: [ LocacaoPosicaoController],
  providers:   [ LocacaoPosicaoService],
  exports:     [ TypeOrmModule ],
})
export class LocacaoPosicaoModule {}
