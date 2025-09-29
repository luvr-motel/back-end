import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DespesageralService } from './despesageral.service';
import { CreateDespesageralDto } from './dto/create-despesageral.dto';
import { UpdateDespesageralDto } from './dto/update-despesageral.dto';

@Controller('despesageral')
export class DespesageralController {
  constructor(private readonly despesageralService: DespesageralService) {}

  @Post()
  create(@Body() createDespesageralDto: CreateDespesageralDto) {
    return this.despesageralService.create(createDespesageralDto);
  }

  @Get()
  findAll() {
    return this.despesageralService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.despesageralService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDespesageralDto: UpdateDespesageralDto) {
    return this.despesageralService.update(+id, updateDespesageralDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.despesageralService.remove(+id);
  }
}