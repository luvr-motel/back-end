import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
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

  private onlyDigits(v: unknown): string | undefined {
    if (v === null || v === undefined) return undefined;
    const s = String(v).replace(/\D/g, '');
    return s.length ? s : undefined;
  }

  async create(dto: CreatePessoaDto): Promise<Pessoa> {
    if (dto.pessoatipoId != null) {
      await this.pessoaTipoService.ensureExists(dto.pessoatipoId);
    }

    const entity = this.repo.create({
      pessoaNome: dto.pessoaNome?.trim(),
      pessoaCpf: this.onlyDigits(dto.pessoaCpf),
      pessoaTelefone: this.onlyDigits(dto.pessoaTelefone),
      pessoaTipo: dto.pessoatipoId != null
        ? ({ pessoatipoId: dto.pessoatipoId } as any)
        : undefined,
    } as DeepPartial<Pessoa>);

    const saved = await this.repo.save(entity);
    return this.findOne(saved.pessoaId);
  }

  async findAll(page = 1, limit = 20): Promise<Pessoa[]> {
    const p = Math.max(1, Number(page) || 1);
    const l = Math.min(Math.max(1, Number(limit) || 20), 100);

    return this.repo.find({
      relations: { pessoaTipo: true },
      order: { pessoaId: 'ASC' },
      skip: (p - 1) * l,
      take: l,
    });
  }

  async findOne(id: number): Promise<Pessoa> {
    const found = await this.repo.findOne({
      where: { pessoaId: id },
      relations: { pessoaTipo: true },
    });
    if (!found) throw new NotFoundException('Pessoa não encontrada');
    return found;
  }

  async update(id: number, dto: UpdatePessoaDto): Promise<Pessoa> {
    const pessoa = await this.findOne(id);

    if (dto.pessoaNome !== undefined) {
      pessoa.pessoaNome = dto.pessoaNome?.trim() ?? pessoa.pessoaNome;
    }

    if (Object.prototype.hasOwnProperty.call(dto, 'pessoatipoId')) {
      if (dto.pessoatipoId != null) {
        await this.pessoaTipoService.ensureExists(dto.pessoatipoId);
        pessoa.pessoaTipo = { pessoatipoId: dto.pessoatipoId } as any;
      } else {
        pessoa.pessoaTipo = null as any;
      }
    }

    if (Object.prototype.hasOwnProperty.call(dto, 'pessoaCpf')) {
      pessoa.pessoaCpf =
        dto.pessoaCpf === null
          ? null
          : this.onlyDigits(dto.pessoaCpf) ?? null;
    }

    if (Object.prototype.hasOwnProperty.call(dto, 'pessoaTelefone')) {
      pessoa.pessoaTelefone =
        (dto as any).pessoaTelefone === null
          ? null
          : this.onlyDigits((dto as any).pessoaTelefone) ?? null;
    }

    await this.repo.save(pessoa);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const found = await this.findOne(id);
    await this.repo.softRemove(found);
  }
}
