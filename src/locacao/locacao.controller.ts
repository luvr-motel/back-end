import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LocacaoService } from './locacao.service';
import { CreateLocacaoDto } from './dto/create-locacao.dto';
import { UpdateLocacaoDto } from './dto/update-locacao.dto';

@Controller('locacao')
export class LocacaoController {
  constructor(private readonly locacaoService: LocacaoService) {}

  @Post()
  create(@Body() createLocacaoDto: CreateLocacaoDto) {
    return this.locacaoService.create(createLocacaoDto);
  }

  @Get()
  findAll() {
    return this.locacaoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.locacaoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLocacaoDto: UpdateLocacaoDto) {
    return this.locacaoService.update(+id, updateLocacaoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.locacaoService.remove(+id);
  }
}
