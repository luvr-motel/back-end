import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
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

  @Get('checkins/turno')
  getCheckinsTurno(
    @Query('usuario_id') usuarioId: string,
    @Query('motel_id') motelId: string,
    @Query('horas') horas: string,
    @Query('posicao') posicao: string
  ) {
    return this.locacaoService.getCheckinsTurno( Number(usuarioId), Number(motelId), Number(horas), Number(posicao));
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

  @Patch(':id/checkout')
  checkout(
    @Param('id') id: string,
    @Query('desconto') desconto?: string,
  ) {
    return this.locacaoService.checkoutLocacao(
      Number(id),
      desconto ? Number(desconto) : 0,
    );
  }
}
