import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { Motel } from './entities/motel.entity';
import { CreateMotelDto } from './dto/create-motel.dto';
import { UpdateMotelDto } from './dto/update-motel.dto';
import { Status } from './common/enums/status.enum';

@Injectable()
export class MotelService {
  constructor(
    @InjectRepository(Motel)
    private readonly repo: Repository<Motel>,
  ) {}

  async createMotel(dto: CreateMotelDto): Promise<Motel> {
    if (!dto.motel_cnpj) throw new BadRequestException('motel_cnpj é obrigatório');

    const exists = await this.repo.findOne({
      where: { motelCnpj: dto.motel_cnpj, motelExclusao: IsNull() },
    });
    if (exists) throw new BadRequestException('CNPJ já cadastrado');

    const entity = this.repo.create({
      motelDescricao: dto.motel_descricao ?? null,
      motelEndereco: dto.motel_endereco ?? null,
      motelEmail: dto.motel_email ?? null,
      motelCnpj: dto.motel_cnpj,
      motelAtivo: dto.motel_ativo ?? Status.ATIVO,
    });

    return this.repo.save(entity);
  }

  async findAllMoteis(): Promise<Motel[]> {
    return this.repo.find({
      where: { motelExclusao: IsNull() },
      order: { motelId: 'ASC' },
    });
  }

  async findOneMotel(id: number): Promise<Motel> {
    const found = await this.repo.findOne({
      where: { motelId: id, motelExclusao: IsNull() },
    });
    if (!found) throw new NotFoundException('Motel não encontrado');
    return found;
  }

  async updateMotel(id: number, dto: UpdateMotelDto): Promise<Motel> {
    const entity = await this.findOneMotel(id);

    if (dto.motel_cnpj && dto.motel_cnpj !== entity.motelCnpj) {
      const exists = await this.repo.findOne({
        where: { motelCnpj: dto.motel_cnpj, motelExclusao: IsNull(), motelId: Not(id) },
      });
      if (exists) throw new BadRequestException('CNPJ já cadastrado');
      entity.motelCnpj = dto.motel_cnpj;
    }

    if (dto.motel_descricao !== undefined) entity.motelDescricao = dto.motel_descricao ?? null;
    if (dto.motel_endereco !== undefined) entity.motelEndereco = dto.motel_endereco ?? null;
    if (dto.motel_email !== undefined) entity.motelEmail = dto.motel_email ?? null;
    if (dto.motel_ativo !== undefined) entity.motelAtivo = dto.motel_ativo; 

    return this.repo.save(entity);
  }

  async deleteMotel(id: number): Promise<void> {
    const entity = await this.repo.findOne({ where: { motelId: id, motelExclusao: IsNull() } });
    if (!entity) throw new NotFoundException('Motel não encontrado');
    entity.motelExclusao = new Date();
    entity.motelAtivo = Status.INATIVO; 
    await this.repo.save(entity);
  }
}
