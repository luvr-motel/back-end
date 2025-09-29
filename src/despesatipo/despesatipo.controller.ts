import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DespesatipoService } from './despesatipo.service';
import { CreateDespesatipoDto } from './dto/create-despesatipo.dto';
import { UpdateDespesatipoDto } from './dto/update-despesatipo.dto';

@Controller('despesatipo')
export class DespesatipoController {
  constructor(private readonly despesatipoService: DespesatipoService) {}

  @Post()
  create(@Body() createDespesatipoDto: CreateDespesatipoDto) {
    return this.despesatipoService.create(createDespesatipoDto);
  }

  @Get()
  findAll() {
    return this.despesatipoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.despesatipoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDespesatipoDto: UpdateDespesatipoDto) {
    return this.despesatipoService.update(+id, updateDespesatipoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.despesatipoService.remove(+id);
  }
}
