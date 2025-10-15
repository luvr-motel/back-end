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
    const partial: DeepPartial<Pessoa> = {};
    if (dto.pessoa_nome != null) partial.pessoa_nome = dto.pessoa_nome.trim();
    if (dto.pessoa_cpf !== undefined) partial.pessoa_cpf = dto.pessoa_cpf;
    if (dto.pessoa_telefone !== undefined) partial.pessoa_telefone = dto.pessoa_telefone;
    if (dto.pessoatipo_id !== undefined) partial.pessoatipo = { pessoatipo_id: dto.pessoatipo_id } as any;

    const entity = this.repo.create(partial); 
    return this.repo.save(entity);            
  }

  async findAllPessoas(): Promise<Pessoa[]> {
    return this.repo.find();
  }

  async findOnePessoa(id: number): Promise<{ mensagem: string; pessoa: Pessoa }> {
    const pessoa = await this.repo.findOne({
      where: { pessoa_id: id },
      relations: { pessoatipo: true },
    });
    if (!pessoa) throw new HttpException('Pessoa não encontrada', 404);
    return { mensagem: `Pessoa #${id}`, pessoa };
  }

  async updatePessoa(id: number, dto: UpdatePessoaDto): Promise<{ mensagem: string; pessoa: Pessoa }> {
    const atual = await this.repo.findOne({ where: { pessoa_id: id } });
      if (!atual) throw new HttpException('Erro ao atualizar pessoa', 404);

    const partial: DeepPartial<Pessoa> = {};
      if (dto.pessoa_nome != null) partial.pessoa_nome = dto.pessoa_nome.trim();
      if (dto.pessoa_cpf !== undefined) partial.pessoa_cpf = dto.pessoa_cpf;
      if (dto.pessoa_telefone !== undefined) partial.pessoa_telefone = dto.pessoa_telefone;
      if (dto.pessoatipo_id !== undefined) partial.pessoatipo = { pessoatipo_id: dto.pessoatipo_id } as any;

    const merged = this.repo.merge(atual, partial);
      await this.repo.save(merged);

    const pessoa = await this.repo.findOne({
      where: { pessoa_id: id },
      relations: { pessoatipo: true },
  });

  return { mensagem: `Pessoa #${id} Atualizada com sucesso`, pessoa: pessoa! };
}

  async removePessoa(id: number): Promise<{ mensagem: string }> {
    const exists = await this.repo.findOne({ where: { pessoa_id: id } });
    if (!exists) throw new HttpException('Erro ao excluir pessoa', 404);

    await this.repo.update(id, { pessoa_ativo: false } as any);
    await this.repo.softDelete(id);

    return { mensagem: `Pessoa ${id} excluída com sucesso` };
  }
}
