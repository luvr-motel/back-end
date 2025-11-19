import { HttpException, Injectable } from '@nestjs/common';
import { CreateLocacaoDto } from './dto/create-locacao.dto';
import { UpdateLocacaoDto } from './dto/update-locacao.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Locacao } from './entities/locacao.entity';
import { LocacaoPosicao } from '../locacao-posicao/entities/locacao-posicao.entity';
import { ItemLocacao } from 'src/itemlocacao/entities/itemlocacao.entity';
import { Repository, IsNull } from 'typeorm';

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
      throw new HttpException( 'Locação não encontrada', 404);
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
      throw new HttpException('Erro ao atualizar locação', 404);
    } else {
      const dadosAtualizacao: any = { ...updateLocacaoDto };

      if (updateLocacaoDto.motel_id) {
        dadosAtualizacao.motel = { motel_id: updateLocacaoDto.motel_id };
        delete dadosAtualizacao.motel_id;
      }

      if (updateLocacaoDto.quarto_id) {
        dadosAtualizacao.quarto = { quarto_id: updateLocacaoDto.quarto_id };
        delete dadosAtualizacao.quarto_id;
      }

      if (updateLocacaoDto.pessoa_id) {
        dadosAtualizacao.pessoa = { pessoa_id: updateLocacaoDto.pessoa_id };
        delete dadosAtualizacao.pessoa_id;
      }

      if (updateLocacaoDto.usuario_id) {
        dadosAtualizacao.usuario = { usuario_id: updateLocacaoDto.usuario_id };
        delete dadosAtualizacao.usuario_id;
      }

      if (updateLocacaoDto.locacaoPosicao_id) {
        dadosAtualizacao.locacaoPosicao = { locacaoPosicao_id: updateLocacaoDto.locacaoPosicao_id };
        delete dadosAtualizacao.locacaoPosicao_id;
      }

      if (updateLocacaoDto.pagamentoforma_id) {
        dadosAtualizacao.pagamentoForma = { pagamentoForma_id: updateLocacaoDto.pagamentoforma_id };
        delete dadosAtualizacao.pagamentoforma_id;
      }

      if (updateLocacaoDto.locacaoTipo_id) {
        dadosAtualizacao.locacaoTipo = { locacaoTipo_id: updateLocacaoDto.locacaoTipo_id };
        delete dadosAtualizacao.locacaoTipo_id;
      }

      const locacao = this.locacaoRepository.merge(locacaoAtualizacao, dadosAtualizacao);
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
      return { mensagem: `Locação ${id} Excluída com sucesso` }
    }

  }

  async getCheckinsTurno( usuarioId: number, motelId: number, horas: number, posicao : number ): Promise<any[]> {
    const query = `
        with filtroOcupados as (
          select loc.locacao_id as quartosOcupados
          from locacao loc
          where loc.locacao_posicao_id  = 2
            and loc.locacao_exclusao is null
        )
        select ( select count(*) from filtroOcupados ) as totalQuartosOcupados, 
            sum( loc."locacao_totalLocacao" ) as totalQuartos, 
            sum( loc."locacao_totalItens" ) as totalItensConsumidos,
            count( loc.locacao_id ) as totalQuartosLocadosTurno
        from locacao loc
        where loc.usuario_id = 2
          and loc.motel_id = 1
          and loc.locacao_inclusao between (NOW() - ( 24 || 'hours' )::interval ) AND NOW()
    `;
    const rows = await this.locacaoRepository.query(query, [ posicao, usuarioId, motelId, horas ]);
    return rows;
  }

  async checkoutLocacao(
    locacaoId: number,
    desconto = 0,
  ): Promise<{ mensagem: string; locacao: Locacao }> {
    return this.locacaoRepository.manager.transaction(async (manager) => {
      const locacaoRepo = manager.getRepository(Locacao);
      const posicaoRepo = manager.getRepository(LocacaoPosicao);
      const itemRepo = manager.getRepository(ItemLocacao);

      const locacao = await locacaoRepo.findOne({
        where: { locacao_id: locacaoId },
        relations: ['locacaoTipo', 'locacaoPosicao', 'quarto'],
      });

      if (!locacao) {
        throw new HttpException('Locação não encontrada', 404);
      }

      if (locacao.locacao_exclusao) {
        throw new HttpException('Locação já encerrada', 400);
      }

      if (!locacao.locacaoTipo || locacao.locacaoTipo.locacoTipo_valor == null) {
        throw new HttpException(
          'Tipo de locação inválido para checkout',
          400,
        );
      }

      const agora = new Date();
      const inicio = new Date(locacao.locacao_inclusao);

      const diffMs = agora.getTime() - inicio.getTime();
      const diffMin = diffMs / 1000 / 60;

      if (diffMin <= 0) {
        throw new HttpException(
          'Data de inclusão da locação é inválida',
          400,
        );
      }

      const blocos30 = Math.ceil(diffMin / 30);
      const horasArredondadas = blocos30 * 0.5;

      const valorHora = Number(locacao.locacaoTipo.locacoTipo_valor);
      const totalQuarto = valorHora * horasArredondadas;

      const itens = await itemRepo.find({
        where: {
          locacao: { locacao_id: locacaoId },
          itemLocacao_exclusao: IsNull(),
        },
        relations: ['produto'],
      });

      let totalItens = 0;

      for (const item of itens) {
        const precoUnitario =
          item.itemLocacao_valor != null
            ? Number(item.itemLocacao_valor)
            : item.produto?.produto_venda != null
              ? Number(item.produto.produto_venda)
              : Number(item.produto?.produto_custo ?? 0);

        totalItens += Number(item.itemLocacao_qtde ?? 0) * precoUnitario;
      }

      const totalDesconto = Number(desconto) || 0;
      const totalLocacao = totalQuarto + totalItens - totalDesconto;

      locacao.locacao_totalQuarto = Number(totalQuarto.toFixed(2));
      locacao.locacao_totalItens = Number(totalItens.toFixed(2));
      locacao.locacao_totalDesconto = Number(totalDesconto.toFixed(2));
      locacao.locacao_totalLocacao = Number(totalLocacao.toFixed(2));
      locacao.locacao_exclusao = agora;

      const posicaoLimpeza = await posicaoRepo.findOne({
        where: { locacaoPosicao_descricao: 'LIMPEZA' },
      });

      if (!posicaoLimpeza) {
        throw new HttpException(
          'Posição de locação "LIMPEZA" não cadastrada',
          500,
        );
      }

      locacao.locacaoPosicao = posicaoLimpeza;
      (locacao as any).locacao_posicao_id = posicaoLimpeza.locacaoPosicao_id;

      const locacaoSalva = await locacaoRepo.save(locacao);

      return {
        mensagem: `Checkout da locação #${locacaoId} realizado com sucesso`,
        locacao: locacaoSalva,
      };
    });
  }

  async getTotaisPorTipo(dataInicio: string, dataFim: string, motelId: number): Promise<any[]> {
    const query = `
      SELECT loc.locacao_tipo,
             COUNT(*) as quantidadeLocacoes,
             SUM(loc.locacao_totalLocacao) as totalLocacao,
             SUM(loc.locacao_totalItens) as totalItens,
             SUM(loc.locacao_totalQuarto) as totalQuartos
      FROM locacao loc
      WHERE loc.locacao_inclusao BETWEEN $1 AND $2
        AND loc.locacao_exclusao IS NULL
        AND loc.motel_id = $3
      GROUP BY loc.locacao_tipo
    `;
    const rows = await this.locacaoRepository.query(query, [dataInicio, dataFim, motelId]);
    return rows;
  }
}

