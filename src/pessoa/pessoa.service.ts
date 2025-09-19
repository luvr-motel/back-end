import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Pessoa } from './entities/pessoa.entity';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';

function onlyDigits(v?: string | null) {
  return typeof v === 'string' ? v.replace(/\D/g, '') : v ?? null;
}

@Injectable()
export class PessoaService {
  constructor(
    @InjectRepository(Pessoa)
    private readonly repo: Repository<Pessoa>,
  ) {}

  private async ensureCpfAvailable(cpf?: string | null, ignoreId?: number) {
    const clean = onlyDigits(cpf);
    if (!clean) return; 
    if (clean.length !== 11) {
      throw new BadRequestException('CPF deve ter 11 dígitos.');
    }
    const where = ignoreId
      ? { pessoaCpf: clean, pessoaId: Not(ignoreId) as any }
      : { pessoaCpf: clean };
    const exists = await this.repo.findOne({ where: where as any });
    if (exists) {
      throw new BadRequestException('CPF já cadastrado para outra pessoa.');
    }
  }

  async create(dto: CreatePessoaDto): Promise<Pessoa> {
    const cpf = onlyDigits(dto.pessoaCpf);
    await this.ensureCpfAvailable(cpf);

    const entity = this.repo.create({
      pessoaNome: dto.pessoaNome,
      pessoaCpf: cpf ?? null,
      pessoaTelefone: dto.pessoaTelefone ?? null,
      pessoatipoId: dto.pessoatipoId ?? null,
      lojaId: dto.lojaId ?? null,
    });

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
    const found = await this.repo.findOne({ where: { pessoaId: id } });
    if (!found) throw new NotFoundException('pessoa não encontrada');
    return found;
  }

  async update(id: number, dto: UpdatePessoaDto): Promise<Pessoa> {
    const pessoa = await this.findOne(id);

    if (dto.pessoaNome !== undefined) {
      pessoa.pessoaNome = dto.pessoaNome;
    }

    if (Object.prototype.hasOwnProperty.call(dto, 'pessoaCpf')) {
      const cpf = onlyDigits(dto.pessoaCpf ?? null);
      await this.ensureCpfAvailable(cpf, id);
      pessoa.pessoaCpf = cpf ?? null;
    }

    if (Object.prototype.hasOwnProperty.call(dto, 'pessoaTelefone')) {
      pessoa.pessoaTelefone = dto.pessoaTelefone ?? null;
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
