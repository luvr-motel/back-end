import { Injectable } from '@nestjs/common';
import { CreateDespesageralDto } from './dto/create-despesageral.dto';
import { UpdateDespesageralDto } from './dto/update-despesageral.dto';

@Injectable()
export class DespesageralService {
  create(createDespesageralDto: CreateDespesageralDto) {
    return 'This action adds a new despesageral';
  }

  findAll() {
    return `This action returns all despesageral`;
  }

  findOne(id: number) {
    return `This action returns a #${id} despesageral`;
  }

  update(id: number, updateDespesageralDto: UpdateDespesageralDto) {
    return `This action updates a #${id} despesageral`;
  }

  remove(id: number) {
    return `This action removes a #${id} despesageral`;
  }
}
