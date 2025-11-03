import { Module } from '@nestjs/common';
import { ProdutoService } from './produto.service';
import { ProdutoController } from './produto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produto } from './entities/produto.entity';
import { Comanda } from '../../modulo-locacao/comanda/entities/comanda.entity';

@Module({
  imports:     [ TypeOrmModule.forFeature([ Produto, Comanda ])],
  controllers: [ProdutoController ],
  providers:   [ProdutoService ],
  exports:     [ TypeOrmModule ],
})
export class ProdutoModule {}
