import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
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

  //@Roles('admin') - quando for lançar, ativar isso e tirar o public decorator e td de public -
  @Public()
  @Post()
  async create(@Body() dto: CreateUsuarioDto) {
    const data = await this.service.create(dto);
    return { message: 'usuário criado com sucesso.', data };
  }

  @Roles('admin', 'gerente', 'recepcionista')
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @Get()
  async findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    const data = await this.service.findAll(Number(page) || 1, Number(limit) || 20);
    return { message: 'lista de usuários retornada com sucesso.', data };
  }

  @Roles('admin', 'gerente', 'recepcionista')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.service.findOne(+id);
    return { message: 'usuário encontrado com sucesso.', data };
  }

  @Roles('admin')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUsuarioDto) {
    const data = await this.service.update(+id, dto);
    return { message: 'usuário atualizado com sucesso.', data };
  }

  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }

  @Get('me/profile')
  async getMyProfile(@Req() req: any) {
    const data = await this.service.findOne(req.user?.id ?? req.user?.usuarioId);
    return { message: 'perfil retornado com sucesso.', data };
  }
}
