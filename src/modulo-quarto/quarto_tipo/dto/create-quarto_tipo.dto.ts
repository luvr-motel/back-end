import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateQuartoTipoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({example: 'Luxo'})
  quartotipo_descricao: string;
}