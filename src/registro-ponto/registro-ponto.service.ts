import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRegistroPontoDto } from './dto/create-registro-ponto.dto';
import { UpdateRegistroPontoDto } from './dto/update-registro-ponto.dto';
import { RegistroPonto } from './entities/registro-ponto.entity';

@Injectable()
export class RegistroPontoService {
  constructor(
    @InjectRepository(RegistroPonto)
    private readonly registroPontoRepository: Repository<RegistroPonto>,
  ) {}

  async createRegistroPonto(
    dto: CreateRegistroPontoDto,
  ): Promise<{ mensagem: string; registroPonto: RegistroPonto }> {
    const entity = this.registroPontoRepository.create({
      registroponto_entrada: dto.registroponto_entrada,
      usuario: { usuario_id: dto.usuario_id } as any,
      ...(dto.motel_id ? { motel: { motel_id: dto.motel_id } as any } : {}),
    });

    const saved = await this.registroPontoRepository.save(entity);
    return {
      mensagem: 'Registro de ponto criado com sucesso',
      registroPonto: saved,
    };
  }

  async findAllRegistroPonto(): Promise<RegistroPonto[]> {
    return this.registroPontoRepository.find({
      relations: ['usuario', 'motel'],
    });
  }

  async findRegistroPontoId(
    id: number,
  ): Promise<{ registroPonto: RegistroPonto; mensagem: string }> {
    const data = await this.registroPontoRepository.findOne({
      where: { registroponto_id: id },
      relations: ['usuario', 'motel'],
    });

    if (!data) {
      throw new HttpException('Registro de ponto não encontrado', 404);
    }

    return {
      mensagem: `RegistroPonto #${id}`,
      registroPonto: data,
    };
  }

  async updateRegistroPontoById(
    id: number,
    dto: UpdateRegistroPontoDto,
  ): Promise<{ mensagem: string; registroPonto: RegistroPonto }> {
    const atual = await this.registroPontoRepository.findOne({
      where: { registroponto_id: id },
      relations: ['usuario', 'motel'],
    });

    if (!atual) {
      throw new HttpException('Erro ao atualizar registro de ponto', 404);
    }

    const merged = this.registroPontoRepository.merge(atual, {
      registroponto_entrada:
        dto.registroponto_entrada !== undefined
          ? dto.registroponto_entrada
          : atual.registroponto_entrada,
      ...(dto.usuario_id ? { usuario: { usuario_id: dto.usuario_id } as any } : {}),
      ...(dto.motel_id !== undefined
        ? dto.motel_id === null
          ? { motel: null }
          : { motel: { motel_id: dto.motel_id } as any }
        : {}),
    });

    const saved = await this.registroPontoRepository.save(merged);

    return {
      mensagem: `RegistroPonto #${id} atualizado com sucesso`,
      registroPonto: saved,
    };
  }

  async removeRegistroPonto(id: number): Promise<{ mensagem: string }> {
    const registro = await this.registroPontoRepository.findOne({
      where: { registroponto_id: id },
    });

    if (!registro) {
      throw new HttpException('Erro ao excluir registro de ponto', 404);
    }

    await this.registroPontoRepository.softDelete(id);
    return { mensagem: `Registro ${id} excluído com sucesso` };
  }
}
