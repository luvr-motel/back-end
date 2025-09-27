import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PessoaTipo } from './entities/pessoatipo.entity';
import { CreatePessoaTipoDto } from './dto/create-pessoatipo.dto';
import { UpdatePessoaTipoDto } from './dto/update-pessoatipo.dto';

@Injectable()
export class PessoaTipoService {
  constructor(@InjectRepository(PessoaTipo) private readonly repo: Repository<PessoaTipo>) {}

  async create(dto: CreatePessoaTipoDto) {
    const exists = await this.repo.findOne({ where: { descricao: dto.descricao } });
    if (exists) throw new ConflictException('Descrição já cadastrada.');
    return this.repo.save(this.repo.create({ descricao: dto.descricao }));
  }

  findAll() {
    return this.repo.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number) {
    const found = await this.repo.findOne({ where: { id } });
    if (!found) throw new NotFoundException('Tipo não encontrado.');
    return found;
  }

  async update(id: number, dto: UpdatePessoaTipoDto) {
    const tipo = await this.findOne(id);
    if (dto.descricao && dto.descricao !== tipo.descricao) {
      const dupe = await this.repo.findOne({ where: { descricao: dto.descricao } });
      if (dupe) throw new ConflictException('Descrição já cadastrada.');
      tipo.descricao = dto.descricao;
    }
    await this.repo.save(tipo);
    return this.findOne(id);
  }

  async remove(id: number) {
    const found = await this.findOne(id);
    await this.repo.softRemove(found);
  }

  async ensureExists(id?: number) {
    if (id == null) return;
    const ok = await this.repo.exist({ where: { id } });
    if (!ok) throw new NotFoundException('pessoatipo_id inválido.');
  }
}
