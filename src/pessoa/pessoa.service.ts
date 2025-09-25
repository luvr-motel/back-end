import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Pessoa } from './entities/pessoa.entity';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { PessoaTipoService } from '../pessoatipo/pessoatipo.service';

@Injectable()
export class PessoaService {
  constructor(
    @InjectRepository(Pessoa)
    private readonly repo: Repository<Pessoa>,
    private readonly pessoaTipoService: PessoaTipoService, 
  ) {}

  async create(dto: CreatePessoaDto): Promise<Pessoa> {
    await this.pessoaTipoService.ensureExists(dto.pessoatipoId);

    const cpf = dto.pessoaCpf ? dto.pessoaCpf.replace(/\D/g, '') : undefined;

    const entity = this.repo.create({
      pessoaNome: dto.pessoaNome?.trim(),
      pessoaCpf: cpf,
      pessoaTelefone: dto.pessoaTelefone ?? undefined,
      lojaId: dto.lojaId ?? undefined,
      pessoaTipo: dto.pessoatipoId ? ({ id: dto.pessoatipoId } as any) : undefined,
    } as DeepPartial<Pessoa>);

    const saved = await this.repo.save(entity);
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
    const found = await this.repo.findOne({
      where: { pessoaId: id },
    });
    if (!found) throw new NotFoundException('Pessoa não encontrada');
    return found;
  }

  async update(id: number, dto: UpdatePessoaDto): Promise<Pessoa> {
    const pessoa = await this.findOne(id);

    if (dto.pessoaNome !== undefined) {
      pessoa.pessoaNome = dto.pessoaNome.trim();
    }

    if (Object.prototype.hasOwnProperty.call(dto, 'pessoatipoId')) {
      await this.pessoaTipoService.ensureExists(dto.pessoatipoId ?? undefined);
      pessoa.pessoaTipo = dto.pessoatipoId ? ({ id: dto.pessoatipoId } as any) : undefined;
    }

    if (Object.prototype.hasOwnProperty.call(dto, 'lojaId')) {
      pessoa.lojaId = dto.lojaId ?? undefined;
    }

    if (Object.prototype.hasOwnProperty.call(dto, 'pessoaCpf')) {
      const cpf = dto.pessoaCpf ? dto.pessoaCpf.replace(/\D/g, '') : undefined;
      pessoa.pessoaCpf = cpf;
    }

    if (Object.prototype.hasOwnProperty.call(dto, 'pessoaTelefone')) {
      pessoa.pessoaTelefone = dto.pessoaTelefone ?? undefined;
    }

    await this.repo.save(pessoa);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const found = await this.findOne(id);
    await this.repo.softRemove(found);
  }
}
