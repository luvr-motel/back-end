import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { PessoaService } from './pessoa.service';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { Roles } from '../usuario/auth/roles.decorator';
import { Pessoa } from './entities/pessoa.entity';

@Controller('pessoa')
export class PessoaController {
  constructor(private readonly pessoaService: PessoaService) {}

  @Roles('admin', 'gerente')
  @Post()
  createPessoa(@Body() dto: CreatePessoaDto): Promise<Pessoa> {
    return this.pessoaService.createPessoa(dto); 
  }

  @Roles('admin', 'gerente', 'recepcionista')
  @Get()
  findAllPessoas(): Promise<Pessoa[]> {
    return this.pessoaService.findAllPessoas();
  }
  
  @Roles('admin', 'gerente', 'recepcionista')
  @Get(':id')
  findOnePessoa(@Param('id', ParseIntPipe) id: number): Promise<{ mensagem: string; pessoa: Pessoa }> {
    return this.pessoaService.findOnePessoa(id); 
  }

  @Roles('admin', 'gerente')
  @Patch(':id')
  updatePessoa(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePessoaDto,
  ): Promise<{ mensagem: string; pessoa: Pessoa }> {
    return this.pessoaService.updatePessoa(id, dto);
  }

  @Roles('admin')
  @Delete(':id')
  async removePessoa(@Param('id', ParseIntPipe) id: number): Promise<{ mensagem: string }> {
    return this.pessoaService.removePessoa(id); 
  }
}
