import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pessoa } from './entities/pessoa.entity';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';

@Injectable()
export class PessoaService {
  constructor(
    @InjectRepository(Pessoa)
    private readonly repo: Repository<Pessoa>,
  ) {}

  async create(dto: CreatePessoaDto): Promise<Pessoa> {
    const entity = this.repo.create({
      pessoaNome: dto.pessoaNome,
      pessoatipoId: dto.pessoatipoId ?? null,
      lojaId: dto.lojaId ?? null,
    });
    const saved = await this.repo.save(entity);
    return this.findOne(saved.pessoaId);
  }

  async findAll(): Promise<Pessoa[]> {
    return this.repo.find({ order: { pessoaId: 'ASC' } });
  }

  async findOne(id: number): Promise<Pessoa> {
    const found = await this.repo.findOne({ where: { pessoaId: id } });
    if (!found) {
      throw new NotFoundException('Pessoa não encontrada');
    }
    return found;
  }

  async update(id: number, dto: UpdatePessoaDto): Promise<Pessoa> {
    const pessoa = await this.findOne(id);

    if (dto.pessoaNome !== undefined) {
      pessoa.pessoaNome = dto.pessoaNome;
    }

    if (Object.prototype.hasOwnProperty.call(dto, 'pessoatipoId')) {
      pessoa.pessoatipoId = dto.pessoatipoId ?? null;
    }

    if (Object.prototype.hasOwnProperty.call(dto, 'lojaId')) {
      pessoa.lojaId = dto.lojaId ?? null;
    }

    await this.repo.save(pessoa);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const found = await this.findOne(id);
    await this.repo.softRemove(found);
  }
}
