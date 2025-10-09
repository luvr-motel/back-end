import { Controller, Get, Post, Body, Patch, Param, Delete, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { PessoaService } from './pessoa.service';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { Roles } from 'src/usuario/auth/roles.decorator';
import { Pessoa } from './entities/pessoa.entity';

@Controller('pessoa')
export class PessoaController {
  constructor(private readonly pessoaService: PessoaService) {}

  @Roles('admin', 'gerente')
  @Post()
  async createPessoa(@Body() dto: CreatePessoaDto): Promise<Pessoa> {
    return this.pessoaService.createPessoa(dto);
  }

  @Roles('admin', 'gerente', 'recepcionista')
  @Get()
  async findAllPessoas(): Promise<Pessoa[]> {
    return this.pessoaService.findAllPessoas();
  }
  
  @Roles('admin', 'gerente', 'recepcionista')
  @Get(':id')
  async findOnePessoa(@Param('id', ParseIntPipe) id: number): Promise<Pessoa> {
    return this.pessoaService.findOnePessoa(id);
  }

  @Roles('admin', 'gerente')
  @Patch(':id')
  async updatePessoa(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePessoaDto): Promise<Pessoa> {
    return this.pessoaService.updatePessoa(id, dto);
  }

  @Roles('admin')
  @Delete(':id')
  async removePessoa(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.pessoaService.removePessoa(id);
    return { message: 'Pessoa deletada com sucesso.' };
  }
}
