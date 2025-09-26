import { PartialType } from '@nestjs/swagger';
import { CreateDespesageralDto } from './create-despesageral.dto';

export class UpdateDespesageralDto extends PartialType(CreateDespesageralDto) {}
