import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDespesaDto } from './dto/create-despesa.dto';
import { UpdateDespesaDto } from './dto/update-despesa.dto';
import { Despesa } from './entities/despesa.entity';

@Injectable()
export class DespesaService {
  constructor(
    @InjectRepository(Despesa)
    private readonly despesaRepository: Repository<Despesa>,
  ) {}

  async createDespesa(createDespesaDto: CreateDespesaDto): Promise<Despesa> {
    const despesa = this.despesaRepository.create({
      despesa_descricao: createDespesaDto.despesa_descricao,
      despesa_parcela: createDespesaDto.despesa_parcela ?? null,
      despesa_aberto: createDespesaDto.despesa_aberto,
      despesa_valortotal: createDespesaDto.despesa_valortotal,
    });

    return this.despesaRepository.save(despesa);
  }

  async findAllDespesas(): Promise<Despesa[]> {
    return this.despesaRepository.find();
  }

  async findDespesaId(despesa_id: number): Promise<{ despesa: Despesa; mensagem: string }> {
    const despesa = await this.despesaRepository.findOne({ where: { despesa_id } });

    if (!despesa) {
      throw new HttpException('Despesa não encontrada', 404);
    }

    return {
      mensagem: `Despesa #${despesa_id}`,
      despesa,
    };
  }

  async updateDespesa(
    despesa_id: number,
    updateDespesaDto: UpdateDespesaDto,
  ): Promise<{ mensagem: string; despesa: Despesa }> {
    const despesaAtual = await this.despesaRepository.findOne({ where: { despesa_id } });

    if (!despesaAtual) {
      throw new HttpException('Erro ao atualizar despesa', 404);
    }

    const despesaAtualizada = this.despesaRepository.merge(
      despesaAtual,
      updateDespesaDto,
    );

    const despesaSalva = await this.despesaRepository.save(despesaAtualizada);

    return {
      mensagem: `Despesa #${despesa_id} atualizada com sucesso`,
      despesa: despesaSalva,
    };
  }

  async removeDespesa(despesa_id: number): Promise<{ mensagem: string }> {
    const despesa = await this.despesaRepository.findOne({ where: { despesa_id } });

    if (!despesa) {
      throw new HttpException('Erro ao excluir despesa', 404);
    }

    await this.despesaRepository.softDelete(despesa_id);
    return { mensagem: `Despesa #${despesa_id} excluída com sucesso` };
  }
}
