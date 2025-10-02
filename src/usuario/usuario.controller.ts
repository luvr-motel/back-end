import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags, ApiOperation } from '@nestjs/swagger';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Roles } from './auth/roles.decorator';
import { Public } from 'src/usuario/auth/public.decorator';

@ApiTags('Usuario')
@ApiBearerAuth()
@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly service: UsuarioService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Criar usuário' })
  async create(@Body() dto: CreateUsuarioDto) {
    const data = await this.service.create(dto);
    return { message: 'Usuário criado com sucesso.', data };
  }

  @Roles('admin', 'gerente', 'recepcionista')
  @Get('me/profile')
  @ApiOperation({ summary: 'Perfil do usuário autenticado' })
  async getMyProfile(@Req() req: any) {
    const userId =
      req.user?.id ??
      req.user?.usuarioId ??
      req.user?.sub; 
    const data = await this.service.findOne(Number(userId));
    return { message: 'Perfil retornado com sucesso.', data };
  }

  @Roles('admin', 'gerente', 'recepcionista')
  @Get()
  @ApiOperation({ summary: 'Listar usuários com página' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    const safeLimit = Math.min(Math.max(1, limit), 100);
    const data = await this.service.findAll(page, safeLimit);
    return { message: 'Lista de usuários retornada com sucesso.', data };
  }

  @Roles('admin', 'gerente', 'recepcionista')
  @Get(':id')
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.service.findOne(id);
    return { message: 'Usuário encontrado com sucesso.', data };
  }

  @Roles('admin')
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar usuário por ID' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUsuarioDto) {
    const data = await this.service.update(id, dto);
    return { message: 'Usuário atualizado com sucesso.', data };
  }

  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Excluir usuário por ID' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
