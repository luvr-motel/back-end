import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PessoaTipo } from './entities/pessoatipo.entity';
import { CreatePessoaTipoDto } from './dto/create-pessoatipo.dto';
import { UpdatePessoaTipoDto } from './dto/update-pessoatipo.dto';

@Injectable()
export class PessoaTipoService {
  /* istanbul ignore next */ 
  constructor(@InjectRepository(PessoaTipo) private readonly repo: Repository<PessoaTipo>) {}

  async createPessoaTipo(dto: CreatePessoaTipoDto): Promise<PessoaTipo> {
    const entity = this.repo.create({
      pessoatipo_descricao: dto.pessoatipo_descricao,
    });
    return this.repo.save(entity);
  }

  async findAllPessoaTipos(): Promise<PessoaTipo[]> {
    return this.repo.find();
  }

  async findOnePessoaTipo(id: number): Promise<{ mensagem: string; pessoatipo: PessoaTipo }> {
    const data = await this.repo.findOne({ where: { pessoatipo_id: id } });
    if (!data) {
      throw new HttpException('Tipo não encontrado', 404);
    }
    return {
      mensagem: `Tipo #${id}`,
      pessoatipo: data,
    };
  }

  async updatePessoaTipo(
    id: number,
    dto: UpdatePessoaTipoDto,
  ): Promise<{ mensagem: string; pessoatipo: PessoaTipo }> {
    const atual = await this.repo.findOne({ where: { pessoatipo_id: id } });
    if (!atual) {
      throw new HttpException('Erro ao atualizar tipo', 404);
    } else {
      const merged = this.repo.merge(atual, dto);
      const saved = await this.repo.save(merged);
      return {
        mensagem: `Tipo #${id} Atualizado com sucesso`,
        pessoatipo: saved,
      };
    }
  }

  async removePessoaTipo(id: number): Promise<{ mensagem: string }> {
    const found = await this.repo.findOne({ where: { pessoatipo_id: id } });
    if (!found) {
      throw new HttpException('Erro ao excluir tipo', 404);
    } else {
      await this.repo.softDelete(id);
      return { mensagem: `Tipo ${id} excluido com sucesso` };
    }
  }
}
