import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuartoTipo } from './entities/quarto_tipo.entity';
import { CreateQuartoTipoDto } from './dto/create-quarto_tipo.dto';
import { UpdateQuartoTipoDto } from './dto/update-quarto_tipo.dto';

@Injectable()
export class QuartoTipoService {
  constructor(
    @InjectRepository(QuartoTipo)
    private readonly repo: Repository<QuartoTipo>,
  ) {}

  create(dto: CreateQuartoTipoDto) {
    const entity = this.repo.create({
      quartotipoDescricao: dto.quartotipo_descricao,
    });
    return this.repo.save(entity);
  }

  findAll() {
    return this.repo.find({ order: { quartotipoDescricao: 'ASC' } });
  }

  async findOne(id: number) {
    const item = await this.repo.findOneBy({ quartotipoId: id });
    if (!item) throw new NotFoundException();
    return item;
  }

  async update(id: number, dto: UpdateQuartoTipoDto) {
    const entity = await this.repo.preload({
      quartotipoId: id,
      quartotipoDescricao: dto.quartotipo_descricao,
    });
    if (!entity) throw new NotFoundException();
    return this.repo.save(entity);
  }

  async remove(id: number): Promise<void> {
    const res = await this.repo.delete(id);
    if (res.affected === 0) throw new NotFoundException();
  }
}
