import { Module } from '@nestjs/common';
import { EstoqueProdutoService } from './estoque-produto.service';
import { EstoqueProdutoController } from './estoque-produto.controller';

@Module({
  controllers: [EstoqueProdutoController],
  providers: [EstoqueProdutoService],
})
export class EstoqueProdutoModule {}
