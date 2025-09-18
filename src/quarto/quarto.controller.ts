import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QuartoService } from './quarto.service';
import { CreateQuartoDto } from './dto/create-quarto.dto';
import { UpdateQuartoDto } from './dto/update-quarto.dto';

@Controller('quarto')
export class QuartoController {
  constructor(private readonly quartoService: QuartoService) {}

  @Post()
  create(@Body() createQuartoDto: CreateQuartoDto) {
    return this.quartoService.create(createQuartoDto);
  }

  @Get()
  findAll() {
    return this.quartoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quartoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuartoDto: UpdateQuartoDto) {
    return this.quartoService.update(+id, updateQuartoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quartoService.remove(+id);
  }
}
