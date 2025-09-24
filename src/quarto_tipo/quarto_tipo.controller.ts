import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QuartoTipoService } from './quarto_tipo.service';
import { CreateQuartoTipoDto } from './dto/create-quarto_tipo.dto';
import { UpdateQuartoTipoDto } from './dto/update-quarto_tipo.dto';

@Controller('quarto-tipo')
export class QuartoTipoController {
  constructor(private readonly quartoTipoService: QuartoTipoService) {}

  @Post()
  create(@Body() createQuartoTipoDto: CreateQuartoTipoDto) {
    return this.quartoTipoService.create(createQuartoTipoDto);
  }

  @Get()
  findAll() {
    return this.quartoTipoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quartoTipoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuartoTipoDto: UpdateQuartoTipoDto) {
    return this.quartoTipoService.update(+id, updateQuartoTipoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quartoTipoService.remove(+id);
  }
}
