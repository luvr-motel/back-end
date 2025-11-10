import { HttpException, Injectable } from '@nestjs/common';
import { CreateLocacaoDto } from './dto/create-locacao.dto';
import { UpdateLocacaoDto } from './dto/update-locacao.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Locacao } from './entities/locacao.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LocacaoService {

  constructor( @InjectRepository( Locacao ) private readonly locacaoRepository: Repository<Locacao> ){}

  async createLocacao( locacaoDto: CreateLocacaoDto ) {
    const locacao = this.locacaoRepository.create({
      locacao_totalItens   : locacaoDto.locacao_totalItens,
      locacao_totalQuarto  : locacaoDto.locacao_totalQuarto,   
      locacao_totalDesconto: locacaoDto.locacao_totalDesconto,
      locacao_totalLocacao : locacaoDto.locacao_totalLocacao,
      quarto               : { quarto_id: locacaoDto.quarto_id },
      pessoa               : { pessoa_id: locacaoDto.pessoa_id },
      motel                : { motel_id: locacaoDto.motel_id },
      usuario              : { usuario_id: locacaoDto.usuario_id },
      locacaoPosicao       : { locacaoPosicao_id: locacaoDto.locacaoPosicao_id },
      locacaoTipo          : { locacaoTipo_id: locacaoDto.locacaoTipo_id },
      pagamentoForma       : { pagamentoForma_id: locacaoDto.pagamentoforma_id },
      });
    return this.locacaoRepository.save( locacao );
  }

  async findAllLocacoes(): Promise< Locacao[] > {
    return this.locacaoRepository.find();
  }

  async findLocacaoId(id: number): Promise<{ mensagem: string; locacao: Locacao } >{
    const locacaoData = await this.locacaoRepository.findOne({ where: { locacao_id: id }});

    if ( !locacaoData ){
      throw new HttpException( 'Locação não encontrada ', 404)
    } else {
      return {
        mensagem: `Locação #${id}`,
        locacao : locacaoData
      }
    }
  }

  async updateLocacao(id: number, updateLocacaoDto: UpdateLocacaoDto): Promise<{ mensagem: string; locacao: Locacao }> {
    const locacaoAtualizacao = await this.locacaoRepository.findOne({ where: { locacao_id: id }});

    if (!locacaoAtualizacao) {
      throw new HttpException( 'Erro ao atualizar locação', 404 )
    } else {
      const locacao     = this.locacaoRepository.merge( locacaoAtualizacao, updateLocacaoDto );
      const locacaoSave = await this.locacaoRepository.save( locacao );

      return {
        mensagem: `Locação #${id} Atualizada com sucesso`,
        locacao: locacaoSave
      }
    }
  }

  async deleteLocacaoById( id: number ): Promise<{ mensagem: string }> {
    const locacao = await this.locacaoRepository.findOne({ where: { locacao_id: id }});

    if (!locacao) {
      throw new HttpException( 'Erro ao excluir locação', 404 )
    } else {
      await this.locacaoRepository.softDelete(id);
      return { mensagem: `Locação ${id} Excluido com sucesso` }
    }

  }
}
