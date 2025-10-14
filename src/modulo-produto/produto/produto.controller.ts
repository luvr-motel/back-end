import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProdutoService } from './produto.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';

@Controller('produto')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  @Post()
  create(@Body() createProdutoDto: CreateProdutoDto) {
     return this.produtoService.createProduto(createProdutoDto);
  }

  @Get()
  findAll() {
     return this.produtoService.findAllProdutos();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
     return this.produtoService.findProdutoId(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProdutoDto: UpdateProdutoDto) {
     return this.produtoService.updateProdutoById(+id, updateProdutoDto);
  }

  @Delete(':id')
  async removeProduto(@Param('id') id: string) {
     return this.produtoService.removeProduto(+id);
  }
}
