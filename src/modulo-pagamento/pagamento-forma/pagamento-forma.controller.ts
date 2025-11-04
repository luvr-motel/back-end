import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PagamentoFormaService } from './pagamento-forma.service';
import { CreatePagamentoFormaDto } from './dto/create-pagamento-forma.dto';
import { UpdatePagamentoFormaDto } from './dto/update-pagamento-forma.dto';

@Controller('pagamento-forma')
export class PagamentoFormaController {
  constructor(private readonly pagamentoFormaService: PagamentoFormaService) {}

  @Post()
  create(@Body() createPagamentoFormaDto: CreatePagamentoFormaDto) {
    return this.pagamentoFormaService.createPagamentoForma(createPagamentoFormaDto);
  }

  @Get()
  findAll() {
    return this.pagamentoFormaService.findAllPagamentoForma();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pagamentoFormaService.findPagamentoFormaById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePagamentoFormaDto: UpdatePagamentoFormaDto) {
    return this.pagamentoFormaService.updatePagamentoFormaById(+id, updatePagamentoFormaDto);
  }

  @Delete(':id')
  async deletePagamentoForma(@Param('id') id: string) {
    return this.pagamentoFormaService.deletePagamentoForma(+id);
  }
}
