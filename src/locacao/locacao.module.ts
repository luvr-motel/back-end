import { Module } from '@nestjs/common';
import { LocacaoService } from './locacao.service';
import { LocacaoController } from './locacao.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Locacao } from './entities/locacao.entity';

@Module({
  imports:     [ TypeOrmModule.forFeature([ Locacao ])],
  controllers: [LocacaoController ],
  providers:   [LocacaoService    ],
  exports:     [ TypeOrmModule    ],
})
export class LocacaoModule {}
