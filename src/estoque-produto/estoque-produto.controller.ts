import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EstoqueProdutoService } from './estoque-produto.service';
import { CreateEstoqueProdutoDto } from './dto/create-estoque-produto.dto';
import { UpdateEstoqueProdutoDto } from './dto/update-estoque-produto.dto';

@Controller('estoque-produto')
export class EstoqueProdutoController {
  constructor(private readonly estoqueProdutoService: EstoqueProdutoService) {}

  @Post()
  create(@Body() createEstoqueProdutoDto: CreateEstoqueProdutoDto) {
    return this.estoqueProdutoService.create(createEstoqueProdutoDto);
  }

  @Get()
  findAll() {
    return this.estoqueProdutoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.estoqueProdutoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEstoqueProdutoDto: UpdateEstoqueProdutoDto) {
    return this.estoqueProdutoService.update(+id, updateEstoqueProdutoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.estoqueProdutoService.remove(+id);
  }
}
