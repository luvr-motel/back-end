import { PartialType } from '@nestjs/swagger';
import { CreatePessoatipoDto } from './create-pessoatipo.dto';

export class UpdatePessoatipoDto extends PartialType(CreatePessoatipoDto) {}
