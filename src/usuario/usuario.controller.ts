import { Controller, Get, Post, Body, Patch, Param, Delete, Req, ParseIntPipe } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Roles } from './auth/roles.decorator';
import { Public } from './auth/public.decorator';
import { Usuario } from './entities/usuario.entity';

type UsuarioOut = Omit<Usuario, 'usuario_senha'>;

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly service: UsuarioService) {}

  @Public()
  @Post()
  createUsuario(@Body() dto: CreateUsuarioDto): Promise<UsuarioOut> {
    return this.service.create(dto);
  }

  @Roles('admin', 'gerente', 'recepcionista')
  @Get('me/profile')
  getMyProfileUsuario(@Req() req: any): Promise<{ mensagem: string; usuario: UsuarioOut }> {
    const userId = Number(req?.user?.usuarioId ?? req?.user?.sub ?? req?.user?.id);
    return this.service.findOne(userId);
  }

  @Roles('admin', 'gerente', 'recepcionista')
  @Get()
  findAllUsuarios(): Promise<UsuarioOut[]> {
    return this.service.findAll();
  }

  @Roles('admin', 'gerente', 'recepcionista')
  @Get(':id')
  findOneUsuario(@Param('id', ParseIntPipe) id: number): Promise<{ mensagem: string; usuario: UsuarioOut }> {
    return this.service.findOne(id);
  }

  @Roles('admin')
  @Patch(':id')
  updateUsuario(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUsuarioDto): Promise<{ mensagem: string; usuario: UsuarioOut }> {
    return this.service.update(id, dto);
  }

  @Roles('admin')
  @Delete(':id')
  removeUsuario(@Param('id', ParseIntPipe) id: number): Promise<{ mensagem: string }> {
    return this.service.remove(id);
  }
}
