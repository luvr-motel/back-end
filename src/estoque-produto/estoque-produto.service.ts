import { Injectable } from '@nestjs/common';
import { CreateEstoqueProdutoDto } from './dto/create-estoque-produto.dto';
import { UpdateEstoqueProdutoDto } from './dto/update-estoque-produto.dto';

@Injectable()
export class EstoqueProdutoService {
  create(createEstoqueProdutoDto: CreateEstoqueProdutoDto) {
    return 'This action adds a new estoqueProduto';
  }

  findAll() {
    return `This action returns all estoqueProduto`;
  }

  findOne(id: number) {
    return `This action returns a #${id} estoqueProduto`;
  }

  update(id: number, updateEstoqueProdutoDto: UpdateEstoqueProdutoDto) {
    return `This action updates a #${id} estoqueProduto`;
  }

  remove(id: number) {
    return `This action removes a #${id} estoqueProduto`;
  }
}
