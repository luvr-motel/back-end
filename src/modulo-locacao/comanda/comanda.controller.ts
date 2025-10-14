import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ComandaService } from './comanda.service';
import { CreateComandaDto } from './dto/create-comanda.dto';
import { UpdateComandaDto } from './dto/update-comanda.dto';

@Controller('comanda')
export class ComandaController {
  constructor(private readonly comandaService: ComandaService) {}

  @Post()
  create(@Body() createComandaDto: CreateComandaDto) {
    return this.comandaService.createComanda(createComandaDto);
  }

  @Get()
  findAll() {
    return this.comandaService.findAllComandas();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.comandaService.findComandaId(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateComandaDto: UpdateComandaDto) {
    return this.comandaService.updateComanda(+id, updateComandaDto);
  }

  @Delete(':id')
  async removeComanda(@Param('id') id: string) {
    return this.comandaService.removeComanda(+id);
  }
}
