import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PessoaService } from './pessoa.service';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { Roles } from 'src/usuario/auth/roles.decorator';

@ApiTags('Pessoa')
@ApiBearerAuth()
@Controller('pessoa')
export class PessoaController {
  constructor(private readonly pessoaService: PessoaService) {}

  @Roles('admin','gerente')
  @Post()
  async create(@Body() dto: CreatePessoaDto) {
    const data = await this.pessoaService.create(dto);
    return { message: 'Pessoa criada com sucesso.', data };
  }

  @Roles('admin','gerente','recepcionista')
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @Get()
  async findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    const data = await this.pessoaService.findAll(Number(page) || 1, Number(limit) || 20);
    return { message: 'Lista de pessoas retornada com sucesso.', data };
  }

  @Roles('admin','gerente','recepcionista')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.pessoaService.findOne(+id);
    return { message: 'Pessoa encontrada com sucesso.', data };
  }

  @Roles('admin','gerente')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdatePessoaDto) {
    const data = await this.pessoaService.update(+id, dto);
    return { message: 'Pessoa atualizada com sucesso.', data };
  }

  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.pessoaService.remove(+id);
    return { message: 'Pessoa deletada com sucesso.' };
  }
}
