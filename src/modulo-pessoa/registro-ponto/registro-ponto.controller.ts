import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RegistroPontoService } from './registro-ponto.service';
import { CreateRegistroPontoDto } from './dto/create-registro-ponto.dto';
import { UpdateRegistroPontoDto } from './dto/update-registro-ponto.dto';

@Controller('registroponto')
export class RegistroPontoController {
  constructor(private readonly registroPontoService: RegistroPontoService) {}

  @Post()
  create(@Body() createRegistroPontoDto: CreateRegistroPontoDto) {
    return this.registroPontoService.createRegistroPonto(createRegistroPontoDto);
  }

  @Get()
  findAll() {
    return this.registroPontoService.findAllRegistroPonto();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.registroPontoService.findRegistroPontoId(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRegistroPontoDto: UpdateRegistroPontoDto) {
    return this.registroPontoService.updateRegistroPontoById(+id, updateRegistroPontoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.registroPontoService.removeRegistroPonto(+id);
  }
}
