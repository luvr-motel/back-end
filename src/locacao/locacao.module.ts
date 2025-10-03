import { Module } from '@nestjs/common';
import { LocacaoService } from './locacao.service';
import { LocacaoController } from './locacao.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Locacao } from './entities/locacao.entity';
import { LocacaoTipoModule } from './locacao-tipo/locacao-tipo.module';

@Module({
  imports:     [ TypeOrmModule.forFeature([ Locacao ]), LocacaoTipoModule],
  controllers: [LocacaoController ],
  providers:   [LocacaoService    ],
  exports:     [ TypeOrmModule    ],
})
export class LocacaoModule {}
