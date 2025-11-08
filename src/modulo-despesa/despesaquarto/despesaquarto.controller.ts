import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DespesaquartoService } from './despesaquarto.service';
import { CreateDespesaquartoDto } from './dto/create-despesaquarto.dto';
import { UpdateDespesaquartoDto } from './dto/update-despesaquarto.dto';

@Controller('despesaQuaro')
export class DespesaquartoController {
  constructor(private readonly despesaquartoService: DespesaquartoService) {}

  @Post()
  createDespesaquarto(@Body() createDespesaquartoDto: CreateDespesaquartoDto) {
    return this.despesaquartoService.createDespesaquarto(createDespesaquartoDto);
  }

  @Get()
  findAllDespesasQuarto() {
    return this.despesaquartoService.findAllDespesasQuarto();
  }

  @Get(':id')
  findDespesaquartoId(@Param('id') id: string) {
    return this.despesaquartoService.findDespesaquartoId(+id);
  }

  @Patch(':id')
  updateDespesaquarto(@Param('id') id: string,@Body() updateDespesaquartoDto: UpdateDespesaquartoDto,) {
    return this.despesaquartoService.updateDespesaquarto(+id, updateDespesaquartoDto);
  }

  @Delete(':id')
  async removeDespesaquarto(@Param('id') id: string) {
    return this.despesaquartoService.removeDespesaquarto(+id);
  }
}
