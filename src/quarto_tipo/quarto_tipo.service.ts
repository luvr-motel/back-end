import { Injectable } from '@nestjs/common';
import { CreateQuartoTipoDto } from './dto/create-quarto_tipo.dto';
import { UpdateQuartoTipoDto } from './dto/update-quarto_tipo.dto';

@Injectable()
export class QuartoTipoService {
  create(createQuartoTipoDto: CreateQuartoTipoDto) {
    return 'This action adds a new quartoTipo';
  }

  findAll() {
    return `This action returns all quartoTipo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} quartoTipo`;
  }

  update(id: number, updateQuartoTipoDto: UpdateQuartoTipoDto) {
    return `This action updates a #${id} quartoTipo`;
  }

  remove(id: number) {
    return `This action removes a #${id} quartoTipo`;
  }
}
