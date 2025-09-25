import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PessoaTipoService } from './pessoatipo.service';
import { CreatePessoaTipoDto } from './dto/create-pessoatipo.dto';
import { UpdatePessoaTipoDto } from './dto/update-pessoatipo.dto';

// pra autenticação
// import { UseGuards } from '@nestjs/common';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { RolesGuard } from '../auth/roles.guard';
// import { Roles } from '../auth/roles.decorator';

@ApiTags('PessoaTipo')
@Controller('pessoatipo')
// @UseGuards(JwtAuthGuard, RolesGuard)
export class PessoaTipoController {
  constructor(private readonly service: PessoaTipoService) {}

  // @Roles('admin','gerente')
  @Post()
  async create(@Body() dto: CreatePessoaTipoDto) {
    const data = await this.service.create(dto);
    return { message: 'tipo criado com sucesso.', data };
  }

  // @Roles('admin','gerente','recepcionista')
  @Get()
  async list() {
    const data = await this.service.findAll();
    return { message: 'lista de tipos retornada com sucesso.', data };
  }

  // @Roles('admin','gerente','recepcionista')
  @Get(':id')
  async get(@Param('id') id: string) {
    const data = await this.service.findOne(+id);
    return { message: 'tipo encontrado com sucesso.', data };
  }

  // @Roles('admin','gerente')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdatePessoaTipoDto) {
    const data = await this.service.update(+id, dto);
    return { message: 'tipo atualizado com sucesso.', data };
  }

  // @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.service.remove(+id);
    return { message: 'tipo deletado com sucesso.' };
  }
}
