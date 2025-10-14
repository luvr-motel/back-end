import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PessoaTipo } from './entities/pessoatipo.entity';
import { CreatePessoaTipoDto } from './dto/create-pessoatipo.dto';
import { UpdatePessoaTipoDto } from './dto/update-pessoatipo.dto';

@Injectable()
export class PessoaTipoService {
  constructor(@InjectRepository(PessoaTipo) private readonly repo: Repository<PessoaTipo>) {}

  async createPessoaTipo(dto: CreatePessoaTipoDto): Promise<PessoaTipo> {
    const entity = this.repo.create({ pessoatipo_descricao: dto.pessoatipo_descricao?.trim() });
    try {
      return await this.repo.save(entity);
    } catch (e: any) {
      if (e?.code === '23505') throw new ConflictException('Descrição já cadastrada.');
      throw e;
    }
  }

  async findAllPessoaTipos(): Promise<PessoaTipo[]> {
    return this.repo.find({ order: { pessoatipo_id: 'ASC' } });
  }

  async findOnePessoaTipo(id: number): Promise<{ mensagem: string; pessoatipo: PessoaTipo }> {
    const found = await this.repo.findOne({ where: { pessoatipo_id: id } });
    if (!found) throw new NotFoundException('Tipo não encontrado.');
    return { mensagem: `Tipo #${id}`, pessoatipo: found };
  }

  async updatePessoaTipo(
    id: number,
    dto: UpdatePessoaTipoDto,
  ): Promise<{ mensagem: string; pessoatipo: PessoaTipo }> {
    const atual = await this.repo.findOne({ where: { pessoatipo_id: id } });
    if (!atual) throw new NotFoundException('Tipo não encontrado.');

    if (dto.pessoatipo_descricao !== undefined) {
      atual.pessoatipo_descricao = dto.pessoatipo_descricao?.trim() ?? atual.pessoatipo_descricao;
    }

    try {
      await this.repo.save(atual);
      const atualizado = await this.repo.findOne({ where: { pessoatipo_id: id } });
      return { mensagem: `Tipo #${id} atualizado com sucesso`, pessoatipo: atualizado! };
    } catch (e: any) {
      if (e?.code === '23505') throw new ConflictException('Descrição já cadastrada.');
      throw e;
    }
  }

  async removePessoaTipo(id: number): Promise<{ mensagem: string }> {
    const ok = await this.repo.findOne({ where: { pessoatipo_id: id } });
    if (!ok) throw new NotFoundException('Tipo não encontrado.');
    await this.repo.softDelete(id);
    return { mensagem: `Tipo ${id} excluído com sucesso` };
  }
}
