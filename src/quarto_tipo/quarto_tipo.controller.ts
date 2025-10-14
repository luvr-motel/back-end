import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QuartoTipoService } from './quarto_tipo.service';
import { CreateQuartoTipoDto } from './dto/create-quarto_tipo.dto';
import { UpdateQuartoTipoDto } from './dto/update-quarto_tipo.dto';

@Controller('quarto-tipo')
export class QuartoTipoController {
  constructor(private readonly quartoTipoService: QuartoTipoService) {}

  @Post()
  createQuartoTipo(@Body() createQuartoTipoDto: CreateQuartoTipoDto) {
    return this.quartoTipoService.createQuartoTipo(createQuartoTipoDto);
  }

  @Get()
  findAllQuartoTipos() {
    return this.quartoTipoService.findAllQuartoTipos();
  }

  @Get(':id')
  findQuartoTipoId(@Param('id') id: string) {
    return this.quartoTipoService.findQuartoTipoId(+id);
  }

  @Patch(':id')
  updateQuartoTipo(
    @Param('id') id: string,
    @Body() updateQuartoTipoDto: UpdateQuartoTipoDto,
  ) {
    return this.quartoTipoService.updateQuartoTipo(+id, updateQuartoTipoDto);
  }

  @Delete(':id')
  removeQuartoTipo(@Param('id') id: string) {
    return this.quartoTipoService.removeQuartoTipo(+id);
  }
}
