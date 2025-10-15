import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LocacaoService } from './locacao.service';
import { CreateLocacaoDto } from './dto/create-locacao.dto';
import { UpdateLocacaoDto } from './dto/update-locacao.dto';

@Controller('locacao')
export class LocacaoController {
  constructor(private readonly locacaoService: LocacaoService) {}

  @Post()
  create(@Body() createLocacaoDto: CreateLocacaoDto) {
    return this.locacaoService.createLocacao(createLocacaoDto);
  }

  @Get()
  findAll() {
    return this.locacaoService.findAllLocacoes();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.locacaoService.findLocacaoId(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLocacaoDto: UpdateLocacaoDto) {
    return this.locacaoService.updateLocacao(+id, updateLocacaoDto);
  }

  @Patch(':id')
  updateLocacao(@Param('id') id: string, @Body() updateLocacaoDto: UpdateLocacaoDto) {
    return this.locacaoService.updateLocacao(+id, updateLocacaoDto);
  }

  @Delete(':id')
  async deleteLocacaoById(@Param('id') id: number) {
    return this.locacaoService.deleteLocacaoById(+id);
  }
}
