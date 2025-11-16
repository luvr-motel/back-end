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

  async getCheckinsTurno( usuarioId: number, motelId: number, horas: number ): Promise<any[]> {
    const query = `
        with filtroOcupados as (
          select loc.locacao_id as quartosOcupados
          from locacao loc
          where loc.locacao_posicao_id  = $1
        )
        select ( select count(*) from filtroOcupados ) as totalQuartosOcupados, 
            sum( loc."locacao_totalLocacao" ) as totalQuartos, 
            sum( loc."locacao_totalItens" ) as totalItensConsumidos,
            count( loc.locacao_id ) as totalQuartosLocadosTurno
        from locacao loc
        where loc.usuario_id = $2
          and loc.locacao_inclusao between (NOW() - ( $3 || ' hours' )::interval ) AND NOW()
    `;

    const rows = await this.locacaoRepository.query(query, [ usuarioId, motelId, horas ]);

    return rows;
  }
}
