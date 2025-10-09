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

  update(id: number, updateLocacaoPosicaoDto: UpdateLocacaoPosicaoDto) {
    return `This action updates a #${id} locacaoPosicao`;
  }

  remove(id: number) {
    return `This action removes a #${id} locacaoPosicao`;
  }
}
