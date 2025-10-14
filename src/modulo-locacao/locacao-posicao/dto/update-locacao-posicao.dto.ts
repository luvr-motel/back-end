import { PartialType } from '@nestjs/swagger';
import { CreateLocacaoPosicaoDto } from './create-locacao-posicao.dto';

export class UpdateLocacaoPosicaoDto extends PartialType(CreateLocacaoPosicaoDto) {}
