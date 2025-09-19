import { HttpException, Injectable } from '@nestjs/common';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Produto } from './entities/produto.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProdutoService {
  constructor(
    @InjectRepository( Produto ) private readonly produtoRepository: Repository<Produto>
  ){}

  async createProduto ( produtoDto: CreateProdutoDto ) {
    const produto = this.produtoRepository.create({
      produto_descricao: produtoDto.produto_descricao,
      produto_custo: produtoDto.produto_custo,
      produto_venda: produtoDto.produto_venda 
    });
    return this.produtoRepository.save( produto )
  }

  findAllProdutos() {
    return this.produtoRepository.find()
  }

  async findIdProduto(id: number): Promise< Produto >{
    const produtoData = await this.produtoRepository.findOneBy({ produto_id });

    if ( !produtoData ){
      throw new HttpException( 'Produto não encontrado', 404 )
    }

    return produtoData;
  }

  update(id: number, updateProdutoDto: UpdateProdutoDto) {
    return `This action updates a #${id} produto`;
  }

  remove(id: number) {
    return `This action removes a #${id} produto`;
  }
}
