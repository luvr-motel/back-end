import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDespesaDto } from './dto/create-despesa.dto';
import { UpdateDespesaDto } from './dto/update-despesa.dto';
import { Despesa } from './entities/despesa.entity';
import { Despesatipo } from '../despesatipo/entities/despesatipo.entity';

@Injectable()
export class DespesaService {
  constructor(
    @InjectRepository(Despesa) private readonly despesaRepository: Repository<Despesa> ) {}

  async createDespesa(createDespesaDto: CreateDespesaDto): Promise<Despesa> {
    const despesa = this.despesaRepository.create({
      despesa_descricao: createDespesaDto.despesa_descricao,
      despesa_parcela: createDespesaDto.despesa_parcela ?? null,
      despesa_aberto: createDespesaDto.despesa_aberto,
      despesa_valortotal: createDespesaDto.despesa_valortotal,
      despesatipo: createDespesaDto.despesatipo_id
        ? ({ despesatipo_id: createDespesaDto.despesatipo_id } as Despesatipo)
        : undefined,
    });
    if (!despesa){
      throw new HttpException( 'Produto não encontrado', 404 )  
    } else {
      return this.despesaRepository.save(despesa)
    }
  }

  async findAllDespesas(): Promise<Despesa[]> {
    return this.despesaRepository.find({
      relations: [ 'despesatipo' ],
    });
  }

  async findDespesaId(despesa_id: number): Promise<{ despesa: Despesa; mensagem: string }> {
    const despesa = await this.despesaRepository.findOne({ where: { despesa_id: despesa_id },
      relations: ['despesatipo'],
    });

    if (!despesa) {
      throw new HttpException('Despesa não encontrada', 404);
    } else {
      return {
        mensagem: `Despesa #${despesa_id}`,
        despesa,
      }
    }
  }

  async updateDespesa( despesa_id: number, updateDespesaDto: UpdateDespesaDto, ): Promise<{ mensagem: string; despesa: Despesa }> {
    const despesaAtual = await this.despesaRepository.findOne({ where: { despesa_id: despesa_id }});

    if (!despesaAtual) {
      throw new HttpException('Erro ao atualizar despesa', 404);
    } else {

      const { despesatipo_id, ...restoAtualizacao } = updateDespesaDto;
      const despesaAtualizada = this.despesaRepository.merge( despesaAtual, restoAtualizacao, );

      // if (despesatipo_id !== undefined) {
      //   despesaAtualizada.despesatipo = despesatipo_id
      //     ? ({ despesatipo_id } as Despesatipo) : null;
      // }
      const despesaSalva = await this.despesaRepository.save(despesaAtualizada);
      return {
        mensagem: `Despesa #${despesa_id} atualizada com sucesso`,
        despesa: despesaSalva,
      }
    }
  }

  async removeDespesa(despesa_id: number): Promise<{ mensagem: string }> {
    const despesa = await this.despesaRepository.findOne({ where: { despesa_id: despesa_id }});

    if (!despesa) {
      throw new HttpException('Erro ao excluir despesa', 404);
    } else {
      await this.despesaRepository.softDelete(despesa_id);
      return { mensagem: `Despesa #${despesa_id} excluída com sucesso` }
    }
  }
}
