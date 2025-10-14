import { PartialType } from '@nestjs/swagger';
import { CreateLocacaoTipoDto } from './create-locacao-tipo.dto';

export class UpdateLocacaoTipoDto extends PartialType(CreateLocacaoTipoDto) {}
