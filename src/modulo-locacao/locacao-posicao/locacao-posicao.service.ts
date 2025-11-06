import { Locacao } from './../locacao/entities/locacao.entity';
import { HttpException, Injectable } from '@nestjs/common';
import { CreateLocacaoPosicaoDto } from './dto/create-locacao-posicao.dto';
import { UpdateLocacaoPosicaoDto } from './dto/update-locacao-posicao.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LocacaoPosicao } from './entities/locacao-posicao.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LocacaoPosicaoService {

  constructor ( @InjectRepository( LocacaoPosicao ) private readonly posicaoRepository: Repository<LocacaoPosicao> ){}

  async createLocacaoPosicao( locacaoPosicaoDto: CreateLocacaoPosicaoDto ): Promise<{mensagem: string; posicao: LocacaoPosicao }> {
    const posicao = this.posicaoRepository.create({
      locacaoPosicao_descricao : locacaoPosicaoDto.locacaoPosicao_descricao
    });
    if (!posicao){
      throw new HttpException( 'Erro ao criar posicao', 404);
    } else {
      const feito = this.posicaoRepository.save( posicao )
      return {
        mensagem: 'Posição criada com sucesso!',
        posicao: posicao
      }
    }
  }

  async findAllLocacaoPosicao(): Promise<LocacaoPosicao[]> {
    return this.posicaoRepository.find();
  }

  async findLocacaoPosicaoById(id: number): Promise<{ mensagem: string; posicao: LocacaoPosicao }> {
    const posicaoData = await this.posicaoRepository.findOne({ where: { locacaoPosicao_id: id }});
    
    if (!posicaoData){
      throw new HttpException( 'Posição de locação não encontrada', 404 )
    } else {
      return {
        mensagem: `Posição de locação #${id}`,
        posicao: posicaoData
      }
    }
  }

  async updateLocacaoPosicaoById(id: number, updateLocacaoPosicaoDto: UpdateLocacaoPosicaoDto): Promise<{ mensagem: string; posicao: LocacaoPosicao }> {
    const posicaoAtualiza = await this.posicaoRepository.findOne({ where: { locacaoPosicao_id: id }});

    if ( !posicaoAtualiza ){
       throw new HttpException( 'Posição de locação não encontrado', 404 )
    } else {
      const posicao = this.posicaoRepository.merge( posicaoAtualiza, updateLocacaoPosicaoDto );
      const posicaoSave = await this.posicaoRepository.save( posicao )

      return {
        mensagem: 'Posição de locação atualizada com sucesso',
        posicao: posicaoSave
      }
    }
  }

  async deleteLocacaoPosicaoById(id: number): Promise<{ mensagem: string; posicao: LocacaoPosicao}> {
    const posicao = await this.posicaoRepository.findOne({ where: { locacaoPosicao_id: id }})

    if ( !posicao ) {
       throw new HttpException( 'Erro ao excluir posição de locação', 404 )
    } else {
      await this.posicaoRepository.softDelete( id );
      return {
        mensagem: 'Posição de locação excluida com sucesso',
        posicao: posicao
      }
    }
  
  }
}
