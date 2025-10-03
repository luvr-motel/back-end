import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DespesaService } from './despesa.service';
import { CreateDespesaDto } from './dto/create-despesa.dto';
import { UpdateDespesaDto } from './dto/update-despesa.dto';

@Controller('despesageral')
export class DespesaController {
  constructor(private readonly despesaService: DespesaService) {}

  @Post()
  create(@Body() createDespesageralDto: CreateDespesaDto) {
    return this.despesaService.create(createDespesageralDto);
  }

  @Get()
  findAll() {
    return this.despesaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.despesaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDespesageralDto: UpdateDespesaDto) {
    return this.despesaService.update(+id, updateDespesageralDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.despesaService.remove(+id);
  }
}