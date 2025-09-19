import { Controller, Get, Post, Body, Patch, Param, Delete, Query /* FUTURO: UseGuards */ } from '@nestjs/common';
import { PessoaService } from './pessoa.service';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { ApiTags, ApiQuery } from '@nestjs/swagger';

// import do auth user
// import { UseGuards } from '@nestjs/common';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { RolesGuard } from '../auth/roles.guard';
// import { Roles } from '../auth/roles.decorator';

@ApiTags('Pessoa')
@Controller('pessoa')
// @UseGuards(JwtAuthGuard, RolesGuard)
export class PessoaController {
  constructor(private readonly pessoaService: PessoaService) {}

  // @Roles('admin','gerente')
  @Post()
  async create(@Body() dto: CreatePessoaDto) {
    const data = await this.pessoaService.create(dto);
    return { message: 'pessoa criada com sucesso.', data };
  }

  // @Roles('admin','gerente','recepcionista')
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @Get()
  async findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    const data = await this.pessoaService.findAll(Number(page) || 1, Number(limit) || 20);
    return { message: 'lista de pessoas retornada com sucesso.', data };
  }

  // @Roles('admin','gerente','recepcionista')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.pessoaService.findOne(+id);
    return { message: 'pessoa encontrada com sucesso.', data };
  }

  // @Roles('admin','gerente')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdatePessoaDto) {
    const data = await this.pessoaService.update(+id, dto);
    return { message: 'pessoa atualizada com sucesso.', data };
  }

  // @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.pessoaService.remove(+id);
    return { message: 'pessoa deletada com sucesso.' };
  }
}
