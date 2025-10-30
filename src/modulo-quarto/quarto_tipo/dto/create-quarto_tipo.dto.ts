import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateQuartoTipoDto {
  @ApiProperty({ example: "Luxo"})
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  quartotipo_descricao: string;
}