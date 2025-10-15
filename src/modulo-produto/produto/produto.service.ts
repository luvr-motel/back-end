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

  async createProduto ( produtoDto: CreateProdutoDto ) {//adicionar mensafgem de bem sucedido
    const produto = this.produtoRepository.create({
      produto_descricao: produtoDto.produto_descricao,
      produto_custo    : produtoDto.produto_custo,
      produto_venda    : produtoDto.produto_venda,
      produto_marckup  : produtoDto.produto_marckup
    });
    return this.produtoRepository.save( produto )
  }

  async findAllProdutos(): Promise<Produto[]> {
    return this.produtoRepository.find()
  }

  async findProdutoId(id: number): Promise< {produto: Produto; mensagem: string} >{
    const produtoData = await this.produtoRepository.findOne({ where: { produto_id: id }});
    if ( !produtoData ){
      throw new HttpException( 'Produto não encontrado', 404 )
    } else { 
      return {
        mensagem: `Produto #${id}`,
        produto: produtoData
      }
    }
  }

  async updateProdutoById(id: number, updateProdutoDto: UpdateProdutoDto): Promise< { mensagem:string; produto: Produto} > {
    const produtoAtualizado = await this.produtoRepository.findOne({ where:{ produto_id:id }});

    if ( !produtoAtualizado ) {
      throw new HttpException( 'Erro ao atualizar produto', 404 )
    } else {
      const produto = this.produtoRepository.merge( produtoAtualizado, updateProdutoDto );
      const produtoSave = await this.produtoRepository.save( produto );

      return {
        mensagem: `Produto #${id} Atualizado com sucesso`,
        produto: produtoSave
      }
    }
  }

  async removeProduto(id: number): Promise<{ mensagem: string }> {
    const produto = await this.produtoRepository.findOne({ where: { produto_id: id }});

    if ( !produto ) {
      throw new HttpException(' Erro ao excluir produto', 404)
    } else {
      await this.produtoRepository.softDelete(id);
      return { mensagem: `Produto ${id} excluido com sucesso`}
    }
  }
}
