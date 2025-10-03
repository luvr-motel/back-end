import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LocacaoPosicaoService } from './locacao-posicao.service';
import { CreateLocacaoPosicaoDto } from './dto/create-locacao-posicao.dto';
import { UpdateLocacaoPosicaoDto } from './dto/update-locacao-posicao.dto';

@Controller('locacao-posicao')
export class LocacaoPosicaoController {
  constructor(private readonly locacaoPosicaoService: LocacaoPosicaoService) {}

  @Post()
  create(@Body() createLocacaoPosicaoDto: CreateLocacaoPosicaoDto) {
    return this.locacaoPosicaoService.create(createLocacaoPosicaoDto);
  }

  @Get()
  findAll() {
    return this.locacaoPosicaoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.locacaoPosicaoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLocacaoPosicaoDto: UpdateLocacaoPosicaoDto) {
    return this.locacaoPosicaoService.update(+id, updateLocacaoPosicaoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.locacaoPosicaoService.remove(+id);
  }
}
