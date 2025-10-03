import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LocacaoTipoService } from './locacao-tipo.service';
import { CreateLocacaoTipoDto } from './dto/create-locacao-tipo.dto';
import { UpdateLocacaoTipoDto } from './dto/update-locacao-tipo.dto';

@Controller('locacao-tipo')
export class LocacaoTipoController {
  constructor(private readonly locacaoTipoService: LocacaoTipoService) {}

  @Post()
  create(@Body() createLocacaoTipoDto: CreateLocacaoTipoDto) {
    return this.locacaoTipoService.create(createLocacaoTipoDto);
  }

  @Get()
  findAll() {
    return this.locacaoTipoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.locacaoTipoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLocacaoTipoDto: UpdateLocacaoTipoDto) {
    return this.locacaoTipoService.update(+id, updateLocacaoTipoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.locacaoTipoService.remove(+id);
  }
}
