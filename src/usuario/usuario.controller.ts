import { Controller, Get, Post, Body, Patch, Param, Delete, Req, ParseIntPipe } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Roles } from './auth/roles.decorator';
import { Public } from './auth/public.decorator';
import { Usuario } from './entities/usuario.entity';

// tipo de saída sem a senha alinha com o que o service retorna
type UsuarioOut = Omit<Usuario, 'usuario_senha'>;

function getUserIdFromReq(req: any): number | undefined {
  return req?.user?.usuarioId ?? req?.user?.sub ?? req?.user?.id;
}

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly service: UsuarioService) {}

  @Public()
  @Post()
  async createUsuario(@Body() dto: CreateUsuarioDto): Promise<{ mensagem: string; data: UsuarioOut }> {
    const data = await this.service.create(dto); 
    return { mensagem: 'Usuário criado com sucesso.', data };
  }

  @Roles('admin', 'gerente', 'recepcionista')
  @Get('me/profile')
  async getMyProfileUsuario(@Req() req: any): Promise<{ mensagem: string; data: UsuarioOut }> {
    const userId = getUserIdFromReq(req);
    const data = await this.service.findOne(Number(userId)); 
    return { mensagem: 'Perfil retornado com sucesso.', data };
  }

  @Roles('admin', 'gerente', 'recepcionista')
  @Get()
  async findAllUsuarios(): Promise<{ mensagem: string; data: UsuarioOut[] }> {
    const data = await this.service.findAll(); 
    return { mensagem: 'Lista de usuários retornada com sucesso.', data };
  }

  @Roles('admin', 'gerente', 'recepcionista')
  @Get(':id')
  async findOneUsuario(@Param('id', ParseIntPipe) id: number): Promise<{ mensagem: string; data: UsuarioOut }> {
    const data = await this.service.findOne(id); 
    return { mensagem: 'Usuário encontrado com sucesso.', data };
  }

  @Roles('admin')
  @Patch(':id')
  async updateUsuario(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUsuarioDto,
  ): Promise<{ mensagem: string; data: UsuarioOut }> {
    const data = await this.service.update(id, dto); 
    return { mensagem: 'Usuário atualizado com sucesso.', data };
  }

  @Roles('admin')
  @Delete(':id')
  removeUsuario(@Param('id', ParseIntPipe) id: number): Promise<{ mensagem: string }> {
    return this.service.remove(id); 
  }
}