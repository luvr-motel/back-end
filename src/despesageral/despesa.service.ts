import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDespesaDto } from './dto/create-despesa.dto';
import { UpdateDespesaDto } from './dto/update-despesa.dto';
import { Despesa } from './entities/despesa.entity';

@Injectable()
export class DespesaService {
  constructor(
    @InjectRepository(Despesa)
    private readonly despesaRepository: Repository<Despesa>,
  ) {}

  create(createDespesaDto: CreateDespesaDto) {
    const { despesatipoId, ...rest } = createDespesaDto;
    const despesa = this.despesaRepository.create({
      ...rest,
      despesatipoId,});
    return this.despesaRepository.save(despesa);
  }

  findAll() {
    return this.despesaRepository.find();
  }

  findOne(id: number) {
    return this.despesaRepository.findOne({ where: { id } });
  }

  async update(id: number, updateDespesaDto: UpdateDespesaDto) {
    const { despesatipoId, ...rest } = updateDespesaDto;
    const preloadData: Partial<Despesa> = {
      id,
      ...rest,
      despesatipoId,};
    const entity = await this.despesaRepository.preload(preloadData);
    if (!entity) throw new NotFoundException();
    return this.despesaRepository.save(entity);
  }

  remove(id: number) {
    return this.despesaRepository.delete(id);
  }
}
