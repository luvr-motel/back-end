import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemcomandaService } from './itemcomanda.service';
import { ItemcomandaController } from './itemcomanda.controller';
import { ItemComanda } from './entities/itemcomanda.entity';
import { Locacao } from 'src/modulo-locacao/locacao/entities/locacao.entity';
import { Comanda } from 'src/modulo-locacao/comanda/entities/comanda.entity';
import { Produto } from 'src/modulo-produto/produto/entities/produto.entity';
import { Motel } from 'src/modulo-motel/motel/entities/motel.entity';

import { LocacaoModule } from 'src/modulo-locacao/locacao/locacao.module';
import { ComandaModule } from 'src/modulo-locacao/comanda/comanda.module';
import { ProdutoModule } from 'src/modulo-produto/produto/produto.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ItemComanda,  // <--- ESTE NOME TEM QUE SER O MESMO DA CLASSE
      Locacao,
      Comanda,
      Produto,
      Motel
    ]),
  ],
  controllers: [ItemcomandaController],
  providers: [ItemcomandaService],
  exports: [ItemcomandaService],
})
export class ItemcomandaModule {}

