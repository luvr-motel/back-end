import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DespesaService } from './despesa.service';
import { CreateDespesaDto } from './dto/create-despesa.dto';
import { UpdateDespesaDto } from './dto/update-despesa.dto';

@Controller('despesa')
export class DespesaController {
  constructor(private readonly despesaService: DespesaService) {}

  @Post()
  createDespesa(@Body() createDespesageralDto: CreateDespesaDto) {
    return this.despesaService.createDespesa(createDespesageralDto);
  }

  @Get()
  findAllDespesa() {
    return this.despesaService.findAllDespesas();
  }

  @Get(':despesa_id')
  findOneDespesa(@Param('despesa_id') despesa_id: string) {
    return this.despesaService.findDespesaId(+despesa_id);
  }

  @Patch(':despesa_id')
  updateDespesa(
    @Param('despesa_id') despesa_id: string,
    @Body() updateDespesageralDto: UpdateDespesaDto,
  ) {
    return this.despesaService.updateDespesa(+despesa_id, updateDespesageralDto);
  }

  @Delete(':despesa_id')
  async removeDespesa(@Param('despesa_id') despesa_id: string) {
    return this.despesaService.removeDespesa(+despesa_id);
  }
}
