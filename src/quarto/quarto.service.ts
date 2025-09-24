import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateQuartoDto } from './dto/create-quarto.dto';
import { UpdateQuartoDto } from './dto/update-quarto.dto';
import { Quarto } from './entities/quarto.entity';

@Injectable()
export class QuartoService {
  constructor(
    @InjectRepository(Quarto)
    private quartoRepository: Repository<Quarto>,
  ) {}

  create(createQuartoDto: CreateQuartoDto) {
    const quarto = this.quartoRepository.create(createQuartoDto);
    return this.quartoRepository.save(quarto);
  }

  findAll() {
    return this.quartoRepository.find();
  }

  findOne(id: number) {
    return this.quartoRepository.findOne({ where: { quarto_id: id } });
  }

  update(id: number, updateQuartoDto: UpdateQuartoDto) {
    return this.quartoRepository.update(id, updateQuartoDto);
  }

  remove(id: number) {
    return this.quartoRepository.delete(id);
  }
}
