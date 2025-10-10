import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EstoqueProdutoService } from './estoque-produto.service';
import { CreateEstoqueProdutoDto } from './dto/create-estoque-produto.dto';
import { UpdateEstoqueProdutoDto } from './dto/update-estoque-produto.dto';

@Controller('estoque-produto')
export class EstoqueProdutoController {
  constructor(private readonly estoqueProdutoService: EstoqueProdutoService) {}

  @Post()
  create(@Body() createEstoqueProdutoDto: CreateEstoqueProdutoDto) {
    return this.estoqueProdutoService.createEstoqueProduto(createEstoqueProdutoDto);
  }

  @Get()
  findAll() {
    return this.estoqueProdutoService.findAllEstoque();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.estoqueProdutoService.findEstoqueById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEstoqueProdutoDto: UpdateEstoqueProdutoDto) {
    return this.estoqueProdutoService.updateEstoqueProduto(+id, updateEstoqueProdutoDto);
  }

  @Delete(':id')
  async deleteEstoqueByProduto(@Param('id') id: string) {
    return this.estoqueProdutoService.deleteEstoqueByProduto(+id);
  }
}
