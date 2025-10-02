import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Raw } from 'typeorm';
import { PessoaTipo } from './entities/pessoatipo.entity';
import { CreatePessoaTipoDto } from './dto/create-pessoatipo.dto';
import { UpdatePessoaTipoDto } from './dto/update-pessoatipo.dto';

@Injectable()
export class PessoaTipoService {
  constructor(
    @InjectRepository(PessoaTipo)
    private readonly repo: Repository<PessoaTipo>,
  ) {}

  async create(dto: CreatePessoaTipoDto) {
    const descricao = dto.pessoatipoDescricao.trim();

    const exists = await this.repo.findOne({
      where: {
        pessoatipoDescricao: Raw(alias => `LOWER(${alias}) = LOWER(:d)`, { d: descricao }),
      },
    });
    if (exists) throw new ConflictException('Descrição já cadastrada.');

    const entity = this.repo.create({ pessoatipoDescricao: descricao });
    return this.repo.save(entity);
  }

  findAll() {
    return this.repo.find({ order: { pessoatipoId: 'ASC' } });
  }

  async findOne(id: number) {
    const found = await this.repo.findOne({ where: { pessoatipoId: id } });
    if (!found) throw new NotFoundException('Tipo não encontrado.');
    return found;
  }

  async update(id: number, dto: UpdatePessoaTipoDto) {
    const tipo = await this.findOne(id);

    if (dto.pessoatipoDescricao !== undefined) {
      const descricao = dto.pessoatipoDescricao.trim();

      if (descricao.toLowerCase() !== (tipo.pessoatipoDescricao ?? '').toLowerCase()) {
        const dupe = await this.repo.findOne({
          where: {
            pessoatipoDescricao: Raw(alias => `LOWER(${alias}) = LOWER(:d)`, { d: descricao }),
          },
        });
        if (dupe) throw new ConflictException('Descrição já cadastrada.');
      }
      tipo.pessoatipoDescricao = descricao;
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
    const ok = await this.repo.exist({ where: { pessoatipoId: id } });
    if (!ok) throw new NotFoundException('pessoatipo_id inválido.');
  }
}
