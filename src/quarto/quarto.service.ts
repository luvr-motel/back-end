import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateQuartoDto } from './dto/create-quarto.dto';
import { UpdateQuartoDto } from './dto/update-quarto.dto';
import { Quarto } from './entities/quarto.entity';
import { QuartoTipo } from '../quarto_tipo/entities/quarto_tipo.entity';

@Injectable()
export class QuartoService {
  constructor(
    @InjectRepository(Quarto)
    private quartoRepository: Repository<Quarto>,
  ) {}

  create(createQuartoDto: CreateQuartoDto) {
    const { quartotipo_id, ...rest } = createQuartoDto;
    const quarto = this.quartoRepository.create({
      ...rest,
      quartotipo: { quartotipoId: quartotipo_id } as QuartoTipo,
    });
    return this.quartoRepository.save(quarto);
  }

  findAll() {
    return this.quartoRepository.find();
  }

  findOne(id: number) {
    return this.quartoRepository.findOne({ where: { quarto_id: id } });
  }

  async update(id: number, updateQuartoDto: UpdateQuartoDto) {
    const { quartotipo_id, ...rest } = updateQuartoDto;
    const preloadData: Partial<Quarto> = {
      quarto_id: id,
      ...rest,
    };

    if (typeof quartotipo_id !== 'undefined') {
      preloadData.quartotipo = { quartotipoId: quartotipo_id } as QuartoTipo;
    }

    const entity = await this.quartoRepository.preload(preloadData);
    if (!entity) throw new NotFoundException();
    return this.quartoRepository.save(entity);
  }

  remove(id: number) {
    return this.quartoRepository.delete(id);
  }
}
