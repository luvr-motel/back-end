import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Pessoa } from './entities/pessoa.entity';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';

@Injectable()
export class PessoaService {
  constructor(@InjectRepository(Pessoa) private readonly repo: Repository<Pessoa>) {}

  async createPessoa(dto: CreatePessoaDto): Promise<Pessoa> {
    const entity = this.repo.create({
      pessoa_nome: dto.pessoa_nome?.trim(),
      pessoa_cpf: dto.pessoa_cpf ?? null,
      pessoa_telefone: dto.pessoa_telefone ?? null,
      ...(dto.pessoatipo_id != null
        ? { pessoatipo: { pessoatipo_id: dto.pessoatipo_id } as any }
        : {}),
    } as DeepPartial<Pessoa>);

    try {
      return await this.repo.save(entity);
    } catch (e: any) {
      if (e?.code === '23503') throw new HttpException('Tipo não encontrado', 404);
      throw e;
    }
  }

  async findAllPessoas(): Promise<Pessoa[]> {
    return this.repo.find({ order: { pessoa_id: 'ASC' } });
  }

  async findOnePessoa(id: number): Promise<{ mensagem: string; pessoa: Pessoa }> {
    const pessoa = await this.repo.findOne({
      where: { pessoa_id: id },
      relations: { pessoatipo: true }, 
    });
    if (!pessoa) throw new HttpException('Pessoa não encontrada', 404);

    return {
      mensagem: `Pessoa #${id}`,
      pessoa,
    };
  }

  async updatePessoa(id: number, dto: UpdatePessoaDto): Promise<{ mensagem: string; pessoa: Pessoa }> {
    const atual = await this.repo.findOne({ where: { pessoa_id: id } });
    if (!atual) throw new HttpException('Erro ao atualizar pessoa', 404);

    if (dto.pessoa_nome !== undefined) {
      atual.pessoa_nome = dto.pessoa_nome?.trim() ?? atual.pessoa_nome;
    }

    if ('pessoatipo_id' in dto) {
      atual.pessoatipo =
        dto.pessoatipo_id != null ? ({ pessoatipo_id: dto.pessoatipo_id } as any) : (null as any);
    }

    if ('pessoa_cpf' in dto) {
      atual.pessoa_cpf = dto.pessoa_cpf === null ? null : dto.pessoa_cpf;
    }

    if ('pessoa_telefone' in dto) {
      atual.pessoa_telefone = dto.pessoa_telefone === null ? null : dto.pessoa_telefone;
    }

    try {
      await this.repo.save(atual);

      const pessoa = await this.repo.findOne({
        where: { pessoa_id: id },
        relations: { pessoatipo: true },
      });

      return {
        mensagem: `Pessoa #${id} Atualizada com sucesso`,
        pessoa: pessoa!,
      };
    } catch (e: any) {
      if (e?.code === '23503') throw new HttpException('Tipo não encontrado', 404);
      throw e;
    }
  }

  async removePessoa(id: number): Promise<{ mensagem: string }> {
    const exists = await this.repo.findOne({ where: { pessoa_id: id } });
    if (!exists) throw new HttpException('Erro ao excluir pessoa', 404);

    await this.repo.update(id, { pessoa_ativo: false } as any);

    await this.repo.softDelete(id);
    return { mensagem: `Pessoa ${id} excluída com sucesso` };
  }
}
