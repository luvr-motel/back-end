import { Body, Controller, Delete, Get, Param, Patch, Post, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiCreatedResponse, ApiOkResponse, ApiNotFoundResponse, ApiConflictResponse } from '@nestjs/swagger';
import { PessoaTipoService } from './pessoatipo.service';
import { CreatePessoaTipoDto } from './dto/create-pessoatipo.dto';
import { UpdatePessoaTipoDto } from './dto/update-pessoatipo.dto';
import { Roles } from 'src/usuario/auth/roles.decorator';
import { PessoaTipo } from './entities/pessoatipo.entity';

type ApiItem<T> = { message: string; data: T };
type ApiList<T> = { message: string; data: T[] };
type ApiMsg = { message: string };

@ApiTags('PessoaTipo')
@ApiBearerAuth()
@Controller('pessoatipo')
export class PessoaTipoController {
  constructor(private readonly service: PessoaTipoService) {}

  @Roles('admin', 'gerente')
  @Post()
  @ApiOperation({ summary: 'Criar tipo de pessoa' })
  @ApiCreatedResponse({ description: 'Tipo criado com sucesso.', type: PessoaTipo })
  @ApiConflictResponse({ description: 'Descrição já cadastrada.' })
  async create(@Body() dto: CreatePessoaTipoDto): Promise<ApiItem<PessoaTipo>> {
    const data = await this.service.create(dto);
    return { message: 'Tipo criado com sucesso.', data };
  }

  @Roles('admin', 'gerente', 'recepcionista')
  @Get()
  @ApiOperation({ summary: 'Listar tipos de pessoa' })
  @ApiOkResponse({ description: 'Lista de tipos retornada com sucesso.', type: [PessoaTipo] })
  async list(): Promise<ApiList<PessoaTipo>> {
    const data = await this.service.findAll();
    return { message: 'Lista de tipos retornada com sucesso.', data };
  }

  @Roles('admin', 'gerente', 'recepcionista')
  @Get(':id')
  @ApiOperation({ summary: 'Obter tipo de pessoa por ID' })
  @ApiOkResponse({ description: 'Tipo encontrado com sucesso.', type: PessoaTipo })
  @ApiNotFoundResponse({ description: 'Tipo não encontrado.' })
  async get(@Param('id', ParseIntPipe) id: number): Promise<ApiItem<PessoaTipo>> {
    const data = await this.service.findOne(id);
    return { message: 'Tipo encontrado com sucesso.', data };
  }

  @Roles('admin', 'gerente')
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar tipo de pessoa' })
  @ApiOkResponse({ description: 'Tipo atualizado com sucesso.', type: PessoaTipo })
  @ApiNotFoundResponse({ description: 'Tipo não encontrado.' })
  @ApiConflictResponse({ description: 'Descrição já cadastrada.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePessoaTipoDto,
  ): Promise<ApiItem<PessoaTipo>> {
    const data = await this.service.update(id, dto);
    return { message: 'Tipo atualizado com sucesso.', data };
  }

  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Excluir tipo de pessoa' })
  @ApiOkResponse({ description: 'Tipo deletado com sucesso.' })
  @ApiNotFoundResponse({ description: 'Tipo não encontrado.' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<ApiMsg> {
    await this.service.remove(id);
    return { message: 'Tipo deletado com sucesso.' };
  }
}
