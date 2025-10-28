import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DespesatipoService } from './despesatipo.service';
import { CreateDespesatipoDto } from './dto/create-despesatipo.dto';
import { UpdateDespesatipoDto } from './dto/update-despesatipo.dto';

@Controller('despesatipo')
export class DespesatipoController {
  constructor(private readonly despesatipoService: DespesatipoService) {}

  @Post()
  createDespesatipo(@Body() createDespesatipoDto: CreateDespesatipoDto) {
    return this.despesatipoService.createDespesatipo(createDespesatipoDto);
  }

  @Get()
  findAllDespesatipo() {
    return this.despesatipoService.findAllDespesatipo();
  }

  @Get(':despesatipo_id')
  findOneDespesatipo(@Param('despesatipo_id') despesatipo_id: string) {
    return this.despesatipoService.findOneDespesatipo(+despesatipo_id);
  }

  @Patch(':despesatipo_id')
  updateDespesatipo(@Param('despesatipo_id') despesatipo_id: string, @Body() updateDespesatipoDto: UpdateDespesatipoDto) {
    return this.despesatipoService.updateDespesatipo(+despesatipo_id, updateDespesatipoDto);
  }

  @Delete(':despesatipo_id')
  removeDespesatipo(@Param('despesatipo_id') despesatipo_id: string) {
    return this.despesatipoService.removeDespesatipo(+despesatipo_id);
  }
}
