import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PessoatipoService } from './pessoatipo.service';
import { CreatePessoatipoDto } from './dto/create-pessoatipo.dto';
import { UpdatePessoatipoDto } from './dto/update-pessoatipo.dto';

@Controller('pessoatipo')
export class PessoatipoController {
  constructor(private readonly pessoatipoService: PessoatipoService) {}

  @Post()
  create(@Body() createPessoatipoDto: CreatePessoatipoDto) {
    return this.pessoatipoService.create(createPessoatipoDto);
  }

  @Get()
  findAll() {
    return this.pessoatipoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pessoatipoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePessoatipoDto: UpdatePessoatipoDto) {
    return this.pessoatipoService.update(+id, updatePessoatipoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pessoatipoService.remove(+id);
  }
}
