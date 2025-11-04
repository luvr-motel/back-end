import { Module } from '@nestjs/common';
import { LocacaoService } from './locacao.service';
import { LocacaoController } from './locacao.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Locacao } from './entities/locacao.entity';
import { Comanda } from '../comanda/entities/comanda.entity';
import { Produto } from '../../modulo-produto/produto/entities/produto.entity';

@Module({
  imports:     [ TypeOrmModule.forFeature([ Locacao, Comanda, Produto ]) ],
  controllers: [ LocacaoController ],
  providers:   [ LocacaoService    ],
  exports:     [ TypeOrmModule    ],
})
export class LocacaoModule {}
