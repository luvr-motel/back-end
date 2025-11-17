import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemlocacaoService } from './itemlocacao.service';
import { ItemlocacaoController } from './itemlocacao.controller';
import { ItemLocacao } from './entities/itemlocacao.entity';
import { Locacao } from 'src/modulo-locacao/locacao/entities/locacao.entity';
import { Comanda } from 'src/modulo-locacao/comanda/entities/comanda.entity';
import { Produto } from 'src/modulo-produto/produto/entities/produto.entity';
import { Motel } from 'src/modulo-motel/motel/entities/motel.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ItemLocacao,  // classe renomeada
      Locacao,
      Comanda,
      Produto,
      Motel,
    ]),
  ],
  controllers: [ItemlocacaoController],
  providers: [ItemlocacaoService],
  exports: [ItemlocacaoService],
})
export class ItemlocacaoModule {}
