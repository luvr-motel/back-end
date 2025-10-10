import { Module } from '@nestjs/common';
import { EstoqueProdutoService } from './estoque-produto.service';
import { EstoqueProdutoController } from './estoque-produto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstoqueProduto } from './entities/estoque-produto.entity';

@Module({
  imports:     [ TypeOrmModule.forFeature([ EstoqueProduto ])],
  controllers: [EstoqueProdutoController],
  providers:   [EstoqueProdutoService],
  exports:     [ TypeOrmModule ],
})
export class EstoqueProdutoModule {}
