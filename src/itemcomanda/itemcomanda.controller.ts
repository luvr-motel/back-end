import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ItemcomandaService } from './itemcomanda.service';
import { CreateItemcomandaDto } from './dto/create-itemcomanda.dto';
import { UpdateItemcomandaDto } from './dto/update-itemcomanda.dto';

@Controller('itemcomanda')
export class ItemcomandaController {
  constructor(private readonly itemcomandaService: ItemcomandaService) {}

  @Post()
  create(@Body() createItemcomandaDto: CreateItemcomandaDto) {
    return this.itemcomandaService.create(createItemcomandaDto);
  }

  // LISTAR ITENS POR COMANDA
  @Get()
  findAll(@Query('comanda_id') comanda_id: number) {
    return this.itemcomandaService.findAllByComanda(Number(comanda_id));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemcomandaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItemcomandaDto: UpdateItemcomandaDto) {
    return this.itemcomandaService.update(+id, updateItemcomandaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemcomandaService.remove(+id);
  }
}
