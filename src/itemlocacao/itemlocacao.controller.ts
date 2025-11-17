import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ItemlocacaoService } from './itemlocacao.service';
import { CreateItemlocacaoDto } from './dto/create-itemlocacao.dto';
import { UpdateItemlocacaoDto } from './dto/update-itemlocacao.dto';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@ApiTags('itemlocacao')
@Controller('itemlocacao')
export class ItemlocacaoController {
  constructor(private readonly itemlocacaoService: ItemlocacaoService) {}

  @Post()
  @ApiOperation({ summary: 'Criar item na comanda' })
  @ApiResponse({ status: 201, description: 'Item adicionado com sucesso' })
  create(@Body() createItemlocacaoDto: CreateItemlocacaoDto) {
    return this.itemlocacaoService.create(createItemlocacaoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar itens por locação' })
  @ApiQuery({ name: 'locacao_id', required: true, description: 'ID da locação', type: Number })
  @ApiResponse({ status: 200, description: 'Lista de itens retornada' })
  findAll(@Query('locacao_id') locacao_id: number) {
    return this.itemlocacaoService.findAllByLocacao(Number(locacao_id));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar item por ID' })
  @ApiResponse({ status: 200, description: 'Item encontrado' })
  findOne(@Param('id') id: string) {
    return this.itemlocacaoService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar quantidade do item' })
  @ApiResponse({ status: 200, description: 'Quantidade atualizada com sucesso' })
  update(@Param('id') id: string, @Body() updateItemlocacaoDto: UpdateItemlocacaoDto) {
    return this.itemlocacaoService.update(+id, updateItemlocacaoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover (soft delete) item da comanda' })
  @ApiResponse({ status: 200, description: 'Item removido com sucesso (soft delete)' })
  remove(@Param('id') id: string) {
    return this.itemlocacaoService.remove(+id);
  }
}
