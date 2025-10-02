import { Controller, Get, Post, Body, Patch, Param, Delete, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags, ApiOperation, ApiCreatedResponse, ApiOkResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { PessoaService } from './pessoa.service';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { Roles } from 'src/usuario/auth/roles.decorator';
import { Pessoa } from './entities/pessoa.entity';

type ApiList<T> = { message: string; data: T[] };
type ApiItem<T> = { message: string; data: T };
type ApiMsg = { message: string };

@ApiTags('Pessoa')
@ApiBearerAuth()
@Controller('pessoa')
export class PessoaController {
  constructor(private readonly pessoaService: PessoaService) {}

  @Roles('admin', 'gerente')
  @Post()
  @ApiOperation({ summary: 'Criar pessoa' })
  @ApiCreatedResponse({ description: 'Pessoa criada com sucesso.', type: Pessoa })
  async create(@Body() dto: CreatePessoaDto): Promise<ApiItem<Pessoa>> {
    const data = await this.pessoaService.create(dto);
    return { message: 'Pessoa criada com sucesso.', data };
  }

  @Roles('admin', 'gerente', 'recepcionista')
  @Get()
  @ApiOperation({ summary: 'Listar pessoas (paginado)' })
  @ApiOkResponse({ description: 'Lista de pessoas retornada com sucesso.', type: [Pessoa] })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ): Promise<ApiList<Pessoa>> {
    const safeLimit = Math.min(Math.max(1, limit), 100);
    const data = await this.pessoaService.findAll(page, safeLimit);
    return { message: 'Lista de pessoas retornada com sucesso.', data };
  }

  @Roles('admin', 'gerente', 'recepcionista')
  @Get(':id')
  @ApiOperation({ summary: 'Buscar pessoa por ID' })
  @ApiOkResponse({ description: 'Pessoa encontrada com sucesso.', type: Pessoa })
  @ApiNotFoundResponse({ description: 'Pessoa não encontrada' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiItem<Pessoa>> {
    const data = await this.pessoaService.findOne(id);
    return { message: 'Pessoa encontrada com sucesso.', data };
  }

  @Roles('admin', 'gerente')
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar pessoa por ID' })
  @ApiOkResponse({ description: 'Pessoa atualizada com sucesso.', type: Pessoa })
  @ApiNotFoundResponse({ description: 'Pessoa não encontrada' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePessoaDto,
  ): Promise<ApiItem<Pessoa>> {
    const data = await this.pessoaService.update(id, dto);
    return { message: 'Pessoa atualizada com sucesso.', data };
  }

  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Excluir pessoa por ID' })
  @ApiOkResponse({ description: 'Pessoa deletada com sucesso.' })
  @ApiNotFoundResponse({ description: 'Pessoa não encontrada' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiMsg> {
    await this.pessoaService.remove(id);
    return { message: 'Pessoa deletada com sucesso.' };
  }
}
