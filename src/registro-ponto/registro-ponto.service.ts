import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
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

  async createRegistroPonto(
    dto: CreateRegistroPontoDto,
  ): Promise<{ mensagem: string; registroPonto: RegistroPonto }> {
    if (!Number.isInteger(dto.usuario_id)) {
      throw new BadRequestException('usuario_id deve ser um inteiro válido.');
    }

    const usuario = await this.usuarioRepository.findOne({ where: { usuario_id: dto.usuario_id } });
    if (!usuario) throw new NotFoundException('Usuário não encontrado');

    let motel: Motel | null = null;
    if (dto.motel_id !== undefined) {
      if (dto.motel_id === null) {
        motel = null;
      } else {
        if (!Number.isInteger(dto.motel_id)) {
          throw new BadRequestException('motel_id deve ser um inteiro válido quando informado.');
        }
        motel = await this.motelRepository.findOne({ where: { motel_id: dto.motel_id } });
        if (!motel) throw new NotFoundException('Motel não encontrado');
      }
    }

    const entity = this.registroPontoRepository.create({
      registroponto_entrada: dto.registroponto_entrada,
      usuario,
      ...(dto.motel_id !== undefined ? { motel } : {}),
    });

    const saved = await this.registroPontoRepository.save(entity);
    return { mensagem: 'Registro de ponto criado com sucesso', registroPonto: saved };
  }

  async findAllRegistroPonto(): Promise<RegistroPonto[]> {
    return this.registroPontoRepository.find({ relations: ['usuario', 'motel'] });
  }

  async findRegistroPontoId(
    id: number,
  ): Promise<{ registroPonto: RegistroPonto; mensagem: string }> {
    if (!Number.isInteger(id)) throw new BadRequestException('id deve ser um inteiro válido.');

    const data = await this.registroPontoRepository.findOne({
      where: { registroponto_id: id },
      relations: ['usuario', 'motel'],
    });
    if (!data) throw new HttpException('Registro de ponto não encontrado', 404);

    return { mensagem: `RegistroPonto #${id}`, registroPonto: data };
  }

  async updateRegistroPontoById(
    id: number,
    dto: UpdateRegistroPontoDto,
  ): Promise<{ mensagem: string; registroPonto: RegistroPonto }> {
    if (!Number.isInteger(id)) throw new BadRequestException('id deve ser um inteiro válido.');

    const atual = await this.registroPontoRepository.findOne({
      where: { registroponto_id: id },
      relations: ['usuario', 'motel'],
    });
    if (!atual) throw new NotFoundException('Erro ao atualizar registro de ponto: não encontrado');

    const patch: Partial<RegistroPonto> = {};

    if (dto.registroponto_entrada !== undefined) {
      patch.registroponto_entrada = dto.registroponto_entrada;
    }

    if (dto.usuario_id !== undefined) {
      if (!Number.isInteger(dto.usuario_id)) {
        throw new BadRequestException('usuario_id deve ser um inteiro válido quando informado.');
      }
      const usuario = await this.usuarioRepository.findOne({ where: { usuario_id: dto.usuario_id } });
      if (!usuario) throw new NotFoundException('Usuário não encontrado');
      patch.usuario = usuario;
    }

    if (Object.prototype.hasOwnProperty.call(dto, 'motel_id')) {
      const value = (dto as any).motel_id;
      if (value === null) {
        patch.motel = null;
      } else if (value === undefined) {
        // não altera
      } else {
        if (!Number.isInteger(value)) {
          throw new BadRequestException('motel_id deve ser um inteiro válido quando informado.');
        }
        const motel = await this.motelRepository.findOne({ where: { motel_id: value } });
        if (!motel) throw new NotFoundException('Motel não encontrado');
        patch.motel = motel;
      }
    }

    const merged = this.registroPontoRepository.merge(atual, patch);
    const saved = await this.registroPontoRepository.save(merged);

    return { mensagem: `RegistroPonto #${id} atualizado com sucesso`, registroPonto: saved };
  }

  async removeRegistroPonto(id: number): Promise<{ mensagem: string }> {
    if (!Number.isInteger(id)) throw new BadRequestException('id deve ser um inteiro válido.');

    const existe = await this.registroPontoRepository.findOne({ where: { registroponto_id: id } });
    if (!existe) throw new NotFoundException('Erro ao excluir registro de ponto: não encontrado');

    await this.registroPontoRepository.softDelete(id);
    return { mensagem: `Registro ${id} excluído com sucesso` };
  }
}
