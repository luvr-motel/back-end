import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RecebimentoService } from './recebimento.service';
import { CreateRecebimentoDto } from './dto/create-recebimento.dto';
import { UpdateRecebimentoDto } from './dto/update-recebimento.dto';

@Controller('recebimento')
export class RecebimentoController {
  constructor(private readonly recebimentoService: RecebimentoService) {}

  @Post()
  create(@Body() createRecebimentoDto: CreateRecebimentoDto) {
    return this.recebimentoService.createRecebimento(createRecebimentoDto);
  }

  @Get()
  findAll() {
    return this.recebimentoService.findAllRecebimento();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recebimentoService.findRecebimentoById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRecebimentoDto: UpdateRecebimentoDto) {
    return this.recebimentoService.updateRecebimentoById(+id, updateRecebimentoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recebimentoService.deleteRecebimento(+id);
  }
}
