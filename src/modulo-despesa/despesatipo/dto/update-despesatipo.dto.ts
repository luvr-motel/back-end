import { PartialType } from '@nestjs/swagger';
import { CreateDespesatipoDto } from './create-despesatipo.dto';

export class UpdateDespesatipoDto extends PartialType(CreateDespesatipoDto) {}
