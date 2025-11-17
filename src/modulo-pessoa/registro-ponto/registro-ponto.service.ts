import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateRegistroPontoDto } from './dto/create-registro-ponto.dto';
import { UpdateRegistroPontoDto } from './dto/update-registro-ponto.dto';
import { RegistroPonto } from './entities/registro-ponto.entity';

@Injectable()
export class RegistroPontoService {
  constructor(
    @InjectRepository(RegistroPonto) private readonly registroPontoRepository: Repository<RegistroPonto>,
  ) {}

  // adicionar mensagem de bem sucedido
  async createRegistroPonto(dto: CreateRegistroPontoDto): Promise<{ mensagem: string; registroPonto: RegistroPonto }> {
    const entity = this.registroPontoRepository.create({
      // TODO: ligar relações/colunas quando prontas
      usuario_id: dto.usuario_id,
      motel_id: dto.motel_id ?? null,
      registroponto_entrada: dto.registroponto_entrada,
    } as Partial<RegistroPonto>);

    const saved = await this.registroPontoRepository.save(entity);
    return {
      mensagem: 'Registro de ponto criado com sucesso',
      registroPonto: saved,
    };
  }

  async findAllRegistroPonto(): Promise<RegistroPonto[]> {
    return this.registroPontoRepository.find();
  }

  async findRegistroPontoId(id: number): Promise<{ registroPonto: RegistroPonto; mensagem: string }> {
    const data = await this.registroPontoRepository.findOne({ where: { registroponto_id: id } });

    if (!data) {
      throw new HttpException('Registro de ponto não encontrado', 404);
    } else {
      return {
        mensagem: `RegistroPonto #${id}`,
        registroPonto: data,
      };
    }
  }

  async updateRegistroPontoById(
    id: number,
    dto: UpdateRegistroPontoDto,
  ): Promise<{ mensagem: string; registroPonto: RegistroPonto }> {
    const atual = await this.registroPontoRepository.findOne({ where: { registroponto_id: id } });

    if (!atual) {
      throw new HttpException('Erro ao atualizar registro de ponto', 404);
    } else {
      const merged = this.registroPontoRepository.merge(atual, {
        // TODO: ligar relações/colunas quando prontas
        // usuario_id: dto.usuario_id ?? atual.usuario_id,
        // motel_id: dto.motel_id ?? atual.motel_id,
        registroponto_entrada:
          dto.registroponto_entrada !== undefined ? dto.registroponto_entrada : atual.registroponto_entrada,
      } as Partial<RegistroPonto>);

      const saved = await this.registroPontoRepository.save(merged);

      return {
        mensagem: `RegistroPonto #${id} atualizado com sucesso`,
        registroPonto: saved,
      };
    }
  }

  async removeRegistroPonto(id: number): Promise<{ mensagem: string }> {
    const registro = await this.registroPontoRepository.findOne({ where: { registroponto_id: id } });

    if (!registro) {
      throw new HttpException('Erro ao excluir registro de ponto', 404);
    } else {
      await this.registroPontoRepository.softDelete(id);
      return { mensagem: `Registro ${id} excluido com sucesso` };
    }
  }
}
