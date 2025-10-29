import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDespesaDto } from './dto/create-despesa.dto';
import { UpdateDespesaDto } from './dto/update-despesa.dto';
import { Despesa } from './entities/despesa.entity';
import { Despesatipo } from '../despesatipo/entities/despesatipo.entity';
import { Pessoa } from '../../modulo-pessoa/pessoa/entities/pessoa.entity';
import { Usuario } from '../../modulo-pessoa/usuario/entities/usuario.entity';
import { Motel } from '../../modulo-motel/motel/entities/motel.entity';

@Injectable()
export class DespesaService {
  constructor(
    @InjectRepository(Despesa) private readonly despesaRepository: Repository<Despesa> ) {}

async createDespesa(createDespesaDto: CreateDespesaDto): Promise<Despesa> {
  const despesa = this.despesaRepository.create({
    despesa_descricao: createDespesaDto.despesa_descricao,
    despesa_parcela: createDespesaDto.despesa_parcela ?? null,
    despesa_aberto: createDespesaDto.despesa_aberto,
    despesa_total: createDespesaDto.despesa_total,
    despesatipo: ({ despesatipo_id: createDespesaDto.despesatipo_id } as Despesatipo),
    pessoa: createDespesaDto.pessoa
      ? ({ pessoa_id: createDespesaDto.pessoa } as Pessoa)
      : undefined,
    usuario: createDespesaDto.usuario_id
      ? ({ usuario_id: createDespesaDto.usuario_id } as Usuario)
      : undefined,
    motel: ({ motel_id: createDespesaDto.motel_id } as Motel),
  });

  return this.despesaRepository.save(despesa);
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
    }

    return {
      mensagem: `Despesa #${despesa_id}`,
      despesa,
    }
  }

  async updateDespesa(despesa_id: number, updateDespesaDto: UpdateDespesaDto): Promise<{ mensagem: string; despesa: Despesa }> {
    const despesaAtualizacao = await this.despesaRepository.findOne({ where: { despesa_id: despesa_id }});

    if (!despesaAtualizacao) {
      throw new HttpException('Erro ao atualizar despesa', 404);
    }

    const despesa = this.despesaRepository.merge(despesaAtualizacao, updateDespesaDto as any);
    const despesaSave = await this.despesaRepository.save(despesa);

    return {
      mensagem: `Despesa #${despesa_id} atualizada com sucesso`,
      despesa: despesaSave,
    }
  }

  async removeDespesa(despesa_id: number): Promise<{ mensagem: string }> {
    const despesa = await this.despesaRepository.findOne({ where: { despesa_id: despesa_id }});

    if (!despesa) {
      throw new HttpException('Erro ao excluir despesa', 404);
    }

    await this.despesaRepository.softDelete(despesa_id);
    return { mensagem: `Despesa #${despesa_id} excluída com sucesso` }
  }
}
