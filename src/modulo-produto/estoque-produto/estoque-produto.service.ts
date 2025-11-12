import { HttpException, Injectable } from '@nestjs/common';
import { CreateEstoqueProdutoDto } from './dto/create-estoque-produto.dto';
import { UpdateEstoqueProdutoDto } from './dto/update-estoque-produto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EstoqueProduto } from './entities/estoque-produto.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EstoqueProdutoService {

  constructor( @InjectRepository( EstoqueProduto ) private readonly estoqueProdutoRepositoty: Repository<EstoqueProduto>){}

  async createEstoqueProduto( estoqueProdutoDto: CreateEstoqueProdutoDto): Promise<{ mensagem: string; estoque: EstoqueProduto }> {
    const estoque = this.estoqueProdutoRepositoty.create({
      estoqueProduto_ativo  : estoqueProdutoDto.estoqueProduto_ativo,
      estoqueProduto_fisico : estoqueProdutoDto.estoqueProduto_fisico
  });
  if ( !estoque ){
    throw new HttpException( 'Erro ao lançar estoque', 404);
  } else {
    return {
      mensagem: 'Estoque lançado com sucesso!',
      estoque: estoque
    }
  }}

  async findAllEstoque(): Promise< EstoqueProduto[] >{
    return this.estoqueProdutoRepositoty.find();
  }

  async findEstoqueById(id: number): Promise<{ mensagem: string; estoque: EstoqueProduto }> {
    const estoqueData = await this.estoqueProdutoRepositoty.findOne({ where: { estoqueProduto_id: id }});
    if ( !estoqueData ){
      throw new HttpException( 'Estoque não encontrado', 404 )
    } else {
      return { 
        mensagem: `Estoque #${id}`,
        estoque: estoqueData
      }
    }
  }

  async updateEstoqueProduto(id: number, updateEstoqueProdutoDto: UpdateEstoqueProdutoDto): Promise<{ mensagem: string; estoque: EstoqueProduto }> {
    const estoqueData = await this.estoqueProdutoRepositoty.findOne({ where: { estoqueProduto_id: id }});
    if ( !estoqueData ){
      throw new HttpException( 'Estoque não encontrado', 404 )
    } else {
      const estoque     = this.estoqueProdutoRepositoty.merge( estoqueData, updateEstoqueProdutoDto );
      const estoqueSave = await this.estoqueProdutoRepositoty.save( estoque );
      return {
        mensagem: `Estoque #${id} Atualizado com sucesso`,
        estoque: estoqueSave  
      }
    }
  }

  async deleteEstoqueByProduto(id: number): Promise<{ mensagem: string }> {
    const estoque = await this.estoqueProdutoRepositoty.findOne({ where: { estoqueProduto_id: id }});

    if (!estoque) {
      throw new HttpException( `Erro ao excluir estoque do produto #${id}`, 404 )//adicionar nome do produto
    } else {
      await this.estoqueProdutoRepositoty.softDelete(id);
      return {
        mensagem: `Estoque excluido com sucesso`
      }
    }
  }

  

  
}
