import { PartialType } from '@nestjs/mapped-types';
import { CreateRecebimentoDto } from './create-recebimento.dto';

export class UpdateRecebimentoDto extends PartialType(CreateRecebimentoDto) {}
