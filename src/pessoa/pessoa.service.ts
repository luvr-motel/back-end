import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Pessoa } from './entities/pessoa.entity';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';

@Injectable()
export class PessoaService {
  constructor(@InjectRepository(Pessoa) private readonly repo: Repository<Pessoa>) {}

  private onlyDigits(v: unknown): string | undefined {
    if (v === null || v === undefined) return undefined;
    const s = String(v).replace(/\D/g, '');
    return s.length ? s : undefined;
  }

  async createPessoa(dto: CreatePessoaDto): Promise<Pessoa> {
    const entity = this.repo.create({
      pessoa_nome: dto.pessoa_nome?.trim(),
      pessoa_cpf: this.onlyDigits(dto.pessoa_cpf),
      pessoa_telefone: this.onlyDigits(dto.pessoa_telefone),
      ...(dto.pessoatipo_id != null ? { pessoatipo: { pessoatipo_id: dto.pessoatipo_id } as any } : {}),
    } as DeepPartial<Pessoa>);

    try {
      const saved = await this.repo.save(entity);
      return this.findOnePessoa(saved.pessoa_id);
    } catch (e: any) {
      if (e?.code === '23503') throw new NotFoundException('Tipo não encontrado.');
      throw e;
    }
  }

  async findAllPessoas(): Promise<Pessoa[]> {
    return this.repo.find({ relations: { pessoatipo: true }, order: { pessoa_id: 'ASC' } });
  }

  async findOnePessoa(id: number): Promise<Pessoa> {
    const found = await this.repo.findOne({ where: { pessoa_id: id }, relations: { pessoatipo: true } });
    if (!found) throw new NotFoundException('Pessoa não encontrada');
    return found;
  }

  async updatePessoa(id: number, dto: UpdatePessoaDto): Promise<Pessoa> {
    const pessoa = await this.findOnePessoa(id);

    if (dto.pessoa_nome !== undefined) {
      pessoa.pessoa_nome = dto.pessoa_nome?.trim() ?? pessoa.pessoa_nome;
    }

    if (Object.prototype.hasOwnProperty.call(dto, 'pessoatipo_id')) {
      pessoa.pessoatipo = dto.pessoatipo_id != null ? ({ pessoatipo_id: dto.pessoatipo_id } as any) : (null as any);
    }

    if (Object.prototype.hasOwnProperty.call(dto, 'pessoa_cpf')) {
      pessoa.pessoa_cpf = dto.pessoa_cpf === null ? null : this.onlyDigits(dto.pessoa_cpf) ?? null;
    }

    if (Object.prototype.hasOwnProperty.call(dto, 'pessoa_telefone')) {
      pessoa.pessoa_telefone =
        (dto as any).pessoa_telefone === null ? null : this.onlyDigits((dto as any).pessoa_telefone) ?? null;
    }

    try {
      await this.repo.save(pessoa);
      return this.findOnePessoa(id);
    } catch (e: any) {
      if (e?.code === '23503') throw new NotFoundException('Tipo não encontrado.');
      throw e;
    }
  }

  async removePessoa(id: number): Promise<{ mensagem: string }> {
    const exists = await this.repo.findOne({ where: { pessoa_id: id } });
    if (!exists) throw new NotFoundException('Erro ao excluir pessoa');
    await this.repo.softDelete(id);
    return { mensagem: `Pessoa ${id} excluída com sucesso` };
  }
}
