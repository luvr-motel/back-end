import { Injectable } from '@nestjs/common';
import { CreateLocacaoTipoDto } from './dto/create-locacao-tipo.dto';
import { UpdateLocacaoTipoDto } from './dto/update-locacao-tipo.dto';

@Injectable()
export class LocacaoTipoService {
  create(createLocacaoTipoDto: CreateLocacaoTipoDto) {
    return 'This action adds a new locacaoTipo';
  }

  findAll() {
    return `This action returns all locacaoTipo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} locacaoTipo`;
  }

  update(id: number, updateLocacaoTipoDto: UpdateLocacaoTipoDto) {
    return `This action updates a #${id} locacaoTipo`;
  }

  remove(id: number) {
    return `This action removes a #${id} locacaoTipo`;
  }
}
