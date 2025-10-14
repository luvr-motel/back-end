import { PartialType } from '@nestjs/swagger';
import { CreateLocacaoDto } from './create-locacao.dto';

export class UpdateLocacaoDto extends PartialType(CreateLocacaoDto) {}
