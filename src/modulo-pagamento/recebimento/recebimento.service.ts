import { Injectable } from '@nestjs/common';
import { CreateRecebimentoDto } from './dto/create-recebimento.dto';
import { UpdateRecebimentoDto } from './dto/update-recebimento.dto';

@Injectable()
export class RecebimentoService {
  create(createRecebimentoDto: CreateRecebimentoDto) {
    return 'This action adds a new recebimento';
  }

  findAll() {
    return `This action returns all recebimento`;
  }

  findOne(id: number) {
    return `This action returns a #${id} recebimento`;
  }

  update(id: number, updateRecebimentoDto: UpdateRecebimentoDto) {
    return `This action updates a #${id} recebimento`;
  }

  remove(id: number) {
    return `This action removes a #${id} recebimento`;
  }
}
