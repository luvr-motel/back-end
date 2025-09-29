import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDespesageralDto } from './dto/create-despesageral.dto';
import { UpdateDespesageralDto } from './dto/update-despesageral.dto';
import { Despesageral } from './entities/despesageral.entity';

@Injectable()
export class DespesageralService {
  constructor(
    @InjectRepository(Despesageral)
    private readonly despesageralRepository: Repository<Despesageral>,
  ) {}

  create(createDespesageralDto: CreateDespesageralDto) {
    const { despesatipoId, ...rest } = createDespesageralDto;
    const despesageral = this.despesageralRepository.create({
      ...rest,
      despesatipoId,});
    return this.despesageralRepository.save(despesageral);
  }

  findAll() {
    return this.despesageralRepository.find();
  }

  findOne(id: number) {
    return this.despesageralRepository.findOne({ where: { id } });
  }

  async update(id: number, updateDespesageralDto: UpdateDespesageralDto) {
    const { despesatipoId, ...rest } = updateDespesageralDto;
    const preloadData: Partial<Despesageral> = {
      id,
      ...rest,
      despesatipoId,};
      
    const entity = await this.despesageralRepository.preload(preloadData);
    if (!entity) throw new NotFoundException();
    return this.despesageralRepository.save(entity);
  }

  remove(id: number) {
    return this.despesageralRepository.delete(id);
  }
}
