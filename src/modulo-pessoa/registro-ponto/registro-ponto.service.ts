import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateRegistroPontoDto } from './dto/create-registro-ponto.dto';
import { UpdateRegistroPontoDto } from './dto/update-registro-ponto.dto';
import { RegistroPonto } from './entities/registro-ponto.entity';

import { Usuario } from 'src/modulo-pessoa/usuario/entities/usuario.entity';
import { Motel } from 'src/modulo-motel/motel/entities/motel.entity';

@Injectable()
export class RegistroPontoService {
  constructor(
    @InjectRepository(RegistroPonto)
    private readonly registroPontoRepository: Repository<RegistroPonto>,

    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,

    @InjectRepository(Motel)
    private readonly motelRepository: Repository<Motel>,
  ) {}

  // ============================================
  // CREATE
  // ============================================
  async createRegistroPonto(dto: CreateRegistroPontoDto) {
    const usuario = await this.usuarioRepository.findOne({
      where: { usuario_id: dto.usuario_id },
    });
    if (!usuario) throw new HttpException('Usuário não encontrado', 404);

    let motel: Motel | null = null;

    if (dto.motel_id) {
      motel = await this.motelRepository.findOne({
        where: { motel_id: dto.motel_id },
      });

      if (!motel) throw new HttpException('Motel não encontrado', 404);
    }

    const entity = this.registroPontoRepository.create({
      usuario,
      motel,
      registroponto_entrada: dto.registroponto_entrada,
    });

    const saved = await this.registroPontoRepository.save(entity);

    return {
      mensagem: 'Registro de ponto criado com sucesso',
      registroPonto: saved,
    };
  }

  // ============================================
  // FIND ALL
  // ============================================
  async findAllRegistroPonto(): Promise<RegistroPonto[]> {
    return this.registroPontoRepository.find({
      relations: ['usuario', 'motel'],
    });
  }

  // ============================================
  // FIND BY ID
  // ============================================
  async findRegistroPontoId(id: number) {
    const data = await this.registroPontoRepository.findOne({
      where: { registroponto_id: id },
      relations: ['usuario', 'motel'],
    });

    if (!data) throw new HttpException('Registro de ponto não encontrado', 404);

    return {
      mensagem: `Registro de ponto #${id}`,
      registroPonto: data,
    };
  }

  // ============================================
  // UPDATE
  // ============================================
  async updateRegistroPontoById(id: number, dto: UpdateRegistroPontoDto) {
    const atual = await this.registroPontoRepository.findOne({
      where: { registroponto_id: id },
      relations: ['usuario', 'motel'],
    });

    if (!atual) throw new HttpException('Registro de ponto não encontrado', 404);

    // Atualizar usuário se enviado
    if (dto.usuario_id) {
      const usuario = await this.usuarioRepository.findOne({
        where: { usuario_id: dto.usuario_id },
      });
      if (!usuario) throw new HttpException('Usuário não encontrado', 404);

      atual.usuario = usuario;
    }

    // Atualizar motel
    if (dto.motel_id !== undefined) {
      if (dto.motel_id === null) {
        atual.motel = null;
      } else {
        const motel = await this.motelRepository.findOne({
          where: { motel_id: dto.motel_id },
        });

        if (!motel) throw new HttpException('Motel não encontrado', 404);

        atual.motel = motel;
      }
    }

    // Atualizar boolean
    if (dto.registroponto_entrada !== undefined) {
      atual.registroponto_entrada = dto.registroponto_entrada;
    }

    const saved = await this.registroPontoRepository.save(atual);

    return {
      mensagem: `Registro de ponto #${id} atualizado com sucesso`,
      registroPonto: saved,
    };
  }

  // ============================================
  // DELETE
  // ============================================
  async removeRegistroPonto(id: number) {
    const registro = await this.registroPontoRepository.findOne({
      where: { registroponto_id: id },
    });

    if (!registro) {
      throw new HttpException('Registro de ponto não encontrado', 404);
    }

    await this.registroPontoRepository.softDelete(id);

    return { mensagem: `Registro de ponto #${id} excluído com sucesso` };
  }
}
