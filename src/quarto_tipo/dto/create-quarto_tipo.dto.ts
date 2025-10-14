import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateQuartoTipoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  quartotipo_descricao: string;
}