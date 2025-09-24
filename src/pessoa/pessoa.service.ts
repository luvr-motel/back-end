// src/pessoa/pessoa.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm'; // <-- DeepPartial
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
    const cpf = dto.pessoaCpf ? dto.pessoaCpf.replace(/\D/g, '') : undefined;

    const entity = this.repo.create({
      pessoaNome: dto.pessoaNome,
      pessoatipoId: dto.pessoatipoId ?? undefined,
      lojaId: dto.lojaId ?? undefined,
      pessoaCpf: cpf,
      pessoaTelefone: dto.pessoaTelefone ?? undefined,
    } as DeepPartial<Pessoa>); // <-- garante overload de objeto

    const saved = await this.repo.save(entity); // saved: Pessoa
    return this.findOne(saved.pessoaId);
  }

  async findAll(page = 1, limit = 20): Promise<Pessoa[]> {
    return this.repo.find({
      order: { pessoaId: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findOne(id: number): Promise<Pessoa> {
    const found = await this.repo.findOne({ where: { pessoaId: id } });
    if (!found) throw new NotFoundException('Pessoa não encontrada');
    return found;
  }

  async update(id: number, dto: UpdatePessoaDto): Promise<Pessoa> {
    const pessoa = await this.findOne(id);

    if (dto.pessoaNome !== undefined) {
      pessoa.pessoaNome = dto.pessoaNome;
    }

    if (Object.prototype.hasOwnProperty.call(dto, 'pessoatipoId')) {
      pessoa.pessoatipoId = dto.pessoatipoId ?? undefined; // <-- sem null
    }

    if (Object.prototype.hasOwnProperty.call(dto, 'lojaId')) {
      pessoa.lojaId = dto.lojaId ?? undefined; // <-- sem null
    }

    if (Object.prototype.hasOwnProperty.call(dto, 'pessoaCpf')) {
      const cpf = dto.pessoaCpf ? dto.pessoaCpf.replace(/\D/g, '') : undefined;
      pessoa.pessoaCpf = cpf; // <-- sem null
    }

    if (Object.prototype.hasOwnProperty.call(dto, 'pessoaTelefone')) {
      pessoa.pessoaTelefone = dto.pessoaTelefone ?? undefined; // <-- sem null
    }

    await this.repo.save(pessoa);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const found = await this.findOne(id);
    await this.repo.softRemove(found);
  }
}
