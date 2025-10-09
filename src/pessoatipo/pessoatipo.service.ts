import { Injectable, NotFoundException } from '@nestjs/common'; 
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
    return this.repo.save(entity);
  }

  async findAllPessoaTipos(): Promise<PessoaTipo[]> {
    return this.repo.find({ order: { pessoatipo_id: 'ASC' } });
  }

  async findOnePessoaTipo(id: number): Promise<PessoaTipo> {
    const found = await this.repo.findOne({ where: { pessoatipo_id: id } });
    if (!found) throw new NotFoundException('Tipo não encontrado.');
    return found;
  }

  async updatePessoaTipo(id: number, dto: UpdatePessoaTipoDto): Promise<PessoaTipo> {
    const tipo = await this.findOnePessoaTipo(id);
    if (dto.pessoatipo_descricao !== undefined) {
      tipo.pessoatipo_descricao = dto.pessoatipo_descricao?.trim() ?? tipo.pessoatipo_descricao;
    }
    await this.repo.save(tipo);
    return this.findOnePessoaTipo(id);
  }

  async removePessoaTipo(id: number): Promise<{ mensagem: string }> {
    const ok = await this.repo.findOne({ where: { pessoatipo_id: id } });
    if (!ok) throw new NotFoundException('Tipo não encontrado.');
    await this.repo.softDelete(id);
    return { mensagem: `Tipo ${id} excluído com sucesso` };
  }
}
