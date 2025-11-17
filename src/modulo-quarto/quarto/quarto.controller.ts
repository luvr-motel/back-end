import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { QuartoService } from './quarto.service';
import { CreateQuartoDto } from './dto/create-quarto.dto';
import { UpdateQuartoDto } from './dto/update-quarto.dto';

@Controller('quarto')
export class QuartoController {
  constructor(private readonly quartoService: QuartoService) {}

  @Post()
  createQuarto(@Body() createQuartoDto: CreateQuartoDto) {
    return this.quartoService.createQuarto(createQuartoDto);
  }

  @Get()
  findAllQuartos() {
    return this.quartoService.findAllQuartos();
  }

  @Get(':id/metricas')
  getMetricasQuarto(
    @Param('id') quarto_id: string,
    @Query('data_inicio') dataInicio: string,
    @Query('data_fim') dataFim: string,
    @Query('motel_id') motelId: string
  ) {
    return this.quartoService.getMetricasQuarto(+quarto_id, dataInicio, dataFim, Number(motelId));
  }

  @Get(':id')
  findQuartoId(@Param('id') id: string) {
    return this.quartoService.findQuartoId(+id);
  }

  @Patch(':id')
  updateQuarto(@Param('id') id: string,@Body() updateQuartoDto: UpdateQuartoDto,) {
    return this.quartoService.updateQuarto(+id, updateQuartoDto);
  }

  @Delete(':id')
  async deleteQuartoById(@Param('id') id: string) {
    return this.quartoService.deleteQuartoById(+id);
  }
}
