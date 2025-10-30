import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DespesaService } from './despesa.service';
import { CreateDespesaDto } from './dto/create-despesa.dto';
import { UpdateDespesaDto } from './dto/update-despesa.dto';

@Controller('despesa')
export class DespesaController {
  constructor(private readonly despesaService: DespesaService) {}

  @Post()
  createDespesa(@Body() createDespesaDto: CreateDespesaDto) {
    return this.despesaService.createDespesa(createDespesaDto);
  }

  @Get()
  findAllDespesas() {
    return this.despesaService.findAllDespesas();
  }

  @Get(':despesa_id')
  findDespesaId(@Param('despesa_id') despesa_id: string) {
    return this.despesaService.findDespesaId(+despesa_id);
  }

  @Patch(':despesa_id')
  updateDespesa(@Param('despesa_id') despesa_id: string, @Body() updateDespesaDto: UpdateDespesaDto) {
    return this.despesaService.updateDespesa(+despesa_id, updateDespesaDto);
  }

  @Delete(':despesa_id')
  async removeDespesa(@Param('despesa_id') despesa_id: string) {
    return this.despesaService.removeDespesa(+despesa_id);
  }
}
