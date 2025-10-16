import { Body, Controller, Delete, Get, Param, Patch, Post, ParseIntPipe } from '@nestjs/common';
import { PessoaTipoService } from './pessoatipo.service';
import { CreatePessoaTipoDto } from './dto/create-pessoatipo.dto';
import { UpdatePessoaTipoDto } from './dto/update-pessoatipo.dto';
import { Roles } from 'src/modulo-pessoa/usuario/auth/roles.decorator';
import { PessoaTipo } from './entities/pessoatipo.entity';

type PessoaTipoResp = { mensagem: string; pessoatipo: PessoaTipo };

@Controller('pessoatipo')
export class PessoaTipoController {
  constructor(private readonly service: PessoaTipoService) {}

  @Roles('admin', 'gerente')
  @Post()
  createPessoaTipo(@Body() dto: CreatePessoaTipoDto): Promise<PessoaTipo> {
    return this.service.createPessoaTipo(dto);
  }

  @Roles('admin', 'gerente', 'recepcionista')
  @Get()
  findAllPessoaTipos(): Promise<PessoaTipo[]> {
    return this.service.findAllPessoaTipos();
  }

  @Roles('admin', 'gerente', 'recepcionista')
  @Get(':id')
  findOnePessoaTipo(@Param('id', ParseIntPipe) id: number): Promise<PessoaTipoResp> {
    return this.service.findOnePessoaTipo(id);
  }

  @Roles('admin', 'gerente')
  @Patch(':id')
  updatePessoaTipo( @Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePessoaTipoDto, ): Promise<PessoaTipoResp> {
    return this.service.updatePessoaTipo(id, dto);
  }

  @Roles('admin')
  @Delete(':id')
  removePessoaTipo(@Param('id', ParseIntPipe) id: number): Promise<{ mensagem: string }> {
    return this.service.removePessoaTipo(id);
  }
}
