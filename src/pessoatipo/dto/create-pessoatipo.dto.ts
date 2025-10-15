import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePessoaTipoDto {
  @ApiProperty({ example: 'Funcionário', description: 'Descrição do tipo de pessoa.' })
  @IsString({ message: 'pessoatipo_descricao deve ser uma string.' })
  @IsNotEmpty()
  @MaxLength(255)
  pessoatipo_descricao: string;
}

