import { Injectable } from '@nestjs/common';
import { CreateLocacaoPosicaoDto } from './dto/create-locacao-posicao.dto';
import { UpdateLocacaoPosicaoDto } from './dto/update-locacao-posicao.dto';

@Injectable()
export class LocacaoPosicaoService {
  create(createLocacaoPosicaoDto: CreateLocacaoPosicaoDto) {
    return 'This action adds a new locacaoPosicao';
  }

  findAll() {
    return `This action returns all locacaoPosicao`;
  }

  findOne(id: number) {
    return `This action returns a #${id} locacaoPosicao`;
  }

  update(id: number, updateLocacaoPosicaoDto: UpdateLocacaoPosicaoDto) {
    return `This action updates a #${id} locacaoPosicao`;
  }

  remove(id: number) {
    return `This action removes a #${id} locacaoPosicao`;
  }
}
