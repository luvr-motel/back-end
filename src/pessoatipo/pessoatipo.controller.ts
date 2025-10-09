import { Body, Controller, Delete, Get, Param, Patch, Post, ParseIntPipe } from '@nestjs/common'; 
import { PessoaTipoService } from './pessoatipo.service'; 
import { CreatePessoaTipoDto } from './dto/create-pessoatipo.dto'; 
import { UpdatePessoaTipoDto } from './dto/update-pessoatipo.dto'; 
import { Roles } from 'src/usuario/auth/roles.decorator'; 
import { PessoaTipo } from './entities/pessoatipo.entity';

@Controller('pessoatipo')
export class PessoaTipoController {
  constructor(private readonly service: PessoaTipoService) {}

  @Roles('admin', 'gerente')
  @Post()
  async createPessoaTipo(@Body() dto: CreatePessoaTipoDto): Promise<PessoaTipo> {
    return this.service.createPessoaTipo(dto);
  }

  @Roles('admin', 'gerente', 'recepcionista')
  @Get()
  async findAllPessoaTipos(): Promise<PessoaTipo[]> {
    return this.service.findAllPessoaTipos();
  }

  @Roles('admin', 'gerente', 'recepcionista')
  @Get(':id')
  async findOnePessoaTipo(@Param('id', ParseIntPipe) id: number): Promise<PessoaTipo> {
    return this.service.findOnePessoaTipo(id);
  }

  @Roles('admin', 'gerente')
  @Patch(':id')
  async updatePessoaTipo(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePessoaTipoDto): Promise<PessoaTipo> {
    return this.service.updatePessoaTipo(id, dto);
  }

  @Roles('admin')
  @Delete(':id')
  async removePessoaTipo(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.service.removePessoaTipo(id);
    return { message: 'Tipo deletado com sucesso.' };
  }
}
