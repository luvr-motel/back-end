import { PartialType } from '@nestjs/swagger';
import { CreatePessoaTipoDto } from './create-pessoatipo.dto';

export class UpdatePessoaTipoDto extends PartialType(CreatePessoaTipoDto) {}
