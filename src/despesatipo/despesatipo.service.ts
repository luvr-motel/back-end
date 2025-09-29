import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDespesatipoDto } from './dto/create-despesatipo.dto';
import { UpdateDespesatipoDto } from './dto/update-despesatipo.dto';
import { Despesatipo } from './entities/despesatipo.entity';

@Injectable()
export class DespesatipoService {
  constructor(
    @InjectRepository(Despesatipo)
    private readonly despesatipoRepository: Repository<Despesatipo>,
  ) {}

  create(createDespesatipoDto: CreateDespesatipoDto) {
    const despesatipo = this.despesatipoRepository.create(createDespesatipoDto);
    return this.despesatipoRepository.save(despesatipo);
  }

  findAll() {
    return this.despesatipoRepository.find();
  }

  findOne(id: number) {
    return this.despesatipoRepository.findOne({ where: { id } });
  }

  async update(id: number, updateDespesatipoDto: UpdateDespesatipoDto) {
    const entity = await this.despesatipoRepository.preload({
      id,
      ...updateDespesatipoDto,});
    if (!entity) throw new NotFoundException();

    return this.despesatipoRepository.save(entity);
  }

  remove(id: number) {
    return this.despesatipoRepository.delete(id);
  }
}
