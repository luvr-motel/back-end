import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query } from '@nestjs/common';
import { MotelService } from './motel.service';
import { CreateMotelDto } from './dto/create-motel.dto';
import { UpdateMotelDto } from './dto/update-motel.dto';

@Controller('moteis')
export class MotelController {
  constructor(private readonly service: MotelService) {}

  @Post()
  createMotel(@Body() dto: CreateMotelDto) {
    return this.service.createMotel(dto);
  }

  @Get()
  findAllMoteis() {
    return this.service.findAllMoteis();
  }

  @Get(':id')
  findOneMotel(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOneMotel(id);
  }

  @Get('financeiroMotel')
  relatorioMotel(
    @Query('data_inicio') dataInicio: string,
    @Query('data_fim') dataFim: string,
    @Query('motel_id') motelId: string
  ) {
    return this.service.relatorioMotel(dataInicio, dataFim, Number(motelId));
  }

  @Patch(':id')
  updateMotel(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMotelDto) {
    return this.service.updateMotel(id, dto);
  }

  @Delete(':id')
  async deleteMotel(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteMotel(id);
  }
}
