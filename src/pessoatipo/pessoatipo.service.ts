import { Injectable } from '@nestjs/common';
import { CreatePessoatipoDto } from './dto/create-pessoatipo.dto';
import { UpdatePessoatipoDto } from './dto/update-pessoatipo.dto';

@Injectable()
export class PessoatipoService {
  create(createPessoatipoDto: CreatePessoatipoDto) {
    return 'This action adds a new pessoatipo';
  }

  findAll() {
    return `This action returns all pessoatipo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pessoatipo`;
  }

  update(id: number, updatePessoatipoDto: UpdatePessoatipoDto) {
    return `This action updates a #${id} pessoatipo`;
  }

  remove(id: number) {
    return `This action removes a #${id} pessoatipo`;
  }
}
