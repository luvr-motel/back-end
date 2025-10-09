import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDespesatipoDto } from './dto/create-despesatipo.dto';
import { UpdateDespesatipoDto } from './dto/update-despesatipo.dto';
import { Despesatipo } from './entities/despesatipo.entity';

@Injectable()
export class DespesatipoService {
  constructor(
    @InjectRepository(Despesatipo)
    private readonly despesatipoRepository: Repository<Despesatipo>,
  ) {}

  async createDespesatipo(
    createDespesatipoDto: CreateDespesatipoDto,
  ): Promise<Despesatipo> {
    const despesatipo = this.despesatipoRepository.create({
      despesatipo_descricao: createDespesatipoDto.despesatipo_descricao,
    });

    return this.despesatipoRepository.save(despesatipo);
  }

  async findAllDespesatipo(): Promise<Despesatipo[]> {
    return this.despesatipoRepository.find();
  }

  async findOneDespesatipo(
    despesatipo_id: number,
  ): Promise<{ despesatipo: Despesatipo; mensagem: string }> {
    const tipo = await this.despesatipoRepository.findOne({ where: { despesatipo_id } });

    if (!tipo) {
      throw new HttpException('Tipo de despesa não encontrado', 404);
    }

    return {
      mensagem: `Tipo de despesa #${despesatipo_id}`,
      despesatipo: tipo,
    };
  }

  async updateDespesatipo(
    despesatipo_id: number,
    updateDespesatipoDto: UpdateDespesatipoDto,
  ): Promise<{ mensagem: string; despesatipo: Despesatipo }> {
    const tipoExistente = await this.despesatipoRepository.findOne({
      where: { despesatipo_id },
    });

    if (!tipoExistente) {
      throw new HttpException('Erro ao atualizar tipo de despesa', 404);
    }

    const tipoAtualizado = this.despesatipoRepository.merge(
      tipoExistente,
      updateDespesatipoDto,
    );

    const tipoSalvo = await this.despesatipoRepository.save(tipoAtualizado);

    return {
      mensagem: `Tipo de despesa #${despesatipo_id} atualizado com sucesso`,
      despesatipo: tipoSalvo,
    };
  }

  async removeDespesatipo(despesatipo_id: number): Promise<{ mensagem: string }> {
    const tipo = await this.despesatipoRepository.findOne({ where: { despesatipo_id } });

    if (!tipo) {
      throw new HttpException('Erro ao excluir tipo de despesa', 404);
    }

    await this.despesatipoRepository.softDelete(despesatipo_id);
    return { mensagem: `Tipo de despesa ${despesatipo_id} excluído com sucesso` };
  }
}
