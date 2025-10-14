import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
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

  @Get(':id')
  findQuartoId(@Param('id') id: string) {
    return this.quartoService.findQuartoId(+id);
  }

  // @Patch(':id')
  // updateQuarto(@Param('id') id: string,@Body() updateQuartoDto: UpdateQuartoDto,) {
  //   return this.quartoService.updateQuarto(+id, updateQuartoDto);
  // }

  @Delete(':id')
  deleteQuartoById(@Param('id') id: string) {
    return this.quartoService.deleteQuartoById(+id);
  }
}
