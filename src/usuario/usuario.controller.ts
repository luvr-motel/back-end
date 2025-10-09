import { Controller, Get, Post, Body, Patch, Param, Delete, Req, ParseIntPipe } from '@nestjs/common'; 
import { UsuarioService } from './usuario.service'; 
import { CreateUsuarioDto } from './dto/create-usuario.dto'; 
import { UpdateUsuarioDto } from './dto/update-usuario.dto'; 
import { Roles } from './auth/roles.decorator'; 
import { Public } from 'src/usuario/auth/public.decorator';

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly service: UsuarioService) {}

  @Public()
  @Post()
  async createUsuario(@Body() dto: CreateUsuarioDto) {
    const data = await this.service.create(dto);
    return { message: 'Usuário criado com sucesso.', data };
  }

  @Roles('admin', 'gerente', 'recepcionista')
  @Get('me/profile')
  async getMyProfileUsuario(@Req() req: any) {
    const userId = 
      req.user?.id ?? 
      req.user?.usuarioId ?? 
      req.user?.sub;
    const data = await this.service.findOne(Number(userId));
    return { message: 'Perfil retornado com sucesso.', data };
  }

  @Roles('admin', 'gerente', 'recepcionista')
  @Get()
  async findAllUsuarios() {
    const data = await this.service.findAll();
    return { message: 'Lista de usuários retornada com sucesso.', data };
  }

  @Roles('admin', 'gerente', 'recepcionista')
  @Get(':id')
  async findOneUsuario(@Param('id', ParseIntPipe) id: number) {
    const data = await this.service.findOne(id);
    return { message: 'Usuário encontrado com sucesso.', data };
  }

  @Roles('admin')
  @Patch(':id')
  async updateUsuario(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUsuarioDto) {
    const data = await this.service.update(id, dto);
    return { message: 'Usuário atualizado com sucesso.', data };
  }

  @Roles('admin')
  @Delete(':id')
  async removeUsuario(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
