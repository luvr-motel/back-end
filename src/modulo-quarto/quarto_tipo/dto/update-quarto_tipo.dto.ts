import { PartialType } from '@nestjs/swagger';
import { CreateQuartoTipoDto } from './create-quarto_tipo.dto';

export class UpdateQuartoTipoDto extends PartialType(CreateQuartoTipoDto) {}
