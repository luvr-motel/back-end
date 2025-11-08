import { PartialType } from '@nestjs/swagger';
import { CreateRegistroPontoDto } from './create-registro-ponto.dto';

export class UpdateRegistroPontoDto extends PartialType(CreateRegistroPontoDto) {}
