import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateQuartoTipoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  quartotipo_descricao: string;
}